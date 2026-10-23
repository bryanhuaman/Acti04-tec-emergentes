"""Pruebas de la app iniciada en UI_BASE_URL (usar una base SQLite de prueba)."""
import json
import os
from pathlib import Path
import unittest

from playwright.sync_api import sync_playwright
from streamlit.testing.v1 import AppTest

from app_store import DEMO_PASSWORD

ROOT = Path(__file__).resolve().parents[1]


class StreamlitIntegrationTests(unittest.TestCase):
    def test_login_and_component_load_without_python_errors(self):
        app = AppTest.from_file(str(ROOT / "streamlit_app.py")).run(timeout=30)
        self.assertFalse(app.exception)
        app.text_input[1].set_value(DEMO_PASSWORD)
        app.button[0].click().run(timeout=30)
        self.assertFalse(app.exception)
        self.assertTrue(app.session_state["smartclaim_user"]["role"] == "agent")
        self.assertEqual(len(app.get("component_instance")), 1)


class BrowserInterfaceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        executable = os.environ.get("UI_BROWSER_EXECUTABLE")
        cls.browser = cls.playwright.chromium.launch(headless=True, **({"executable_path": executable} if executable else {}))

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def open_session(self, email="agente@example.test"):
        context = self.browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()
        page.on("pageerror", lambda error: self.errors.append(str(error)))
        page.goto(os.environ.get("UI_BASE_URL", "http://127.0.0.1:8501"))
        page.get_by_label("Correo de demostración", exact=True).fill(email)
        page.get_by_label("Contraseña de demostración", exact=True).fill(DEMO_PASSWORD)
        page.get_by_role("button", name="Iniciar sesión", exact=True).click()
        page.locator("iframe").first.wait_for()
        frame = page.frames[1]
        frame.wait_for_function("typeof currentUser !== 'undefined' && currentUser !== null")
        return context, page, frame

    def setUp(self):
        self.errors = []
        self.context, self.page, self.frame = self.open_session()

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def saved(self, frame=None):
        frame = frame or self.frame
        frame.wait_for_function("!SmartClaimBridge.pending")
        self.assertFalse(frame.locator("#save-status").evaluate("e => e.classList.contains('save-error')"))

    def navigate(self, view, frame=None):
        frame = frame or self.frame
        self.saved(frame)
        toggle = frame.locator("#menu-toggle")
        if toggle.is_visible():
            toggle.click()
        frame.locator(f'.nav-item[data-view="{view}"]').click()

    def test_layout_and_navigation_in_both_themes(self):
        for width in (320, 390, 768, 1024, 1440):
            self.page.set_viewport_size({"width": width, "height": 900})
            for theme in ("light", "dark"):
                self.frame.select_option("#theme-select", theme)
                for view in ("overview", "claims", "faq", "orders", "sources", "reports", "sprints", "settings"):
                    with self.subTest(width=width, theme=theme, view=view):
                        self.navigate(view)
                        self.assertTrue(self.frame.evaluate("document.documentElement.scrollWidth <= innerWidth"))
                        self.assertEqual(self.frame.locator('[aria-current="page"]').count(), 1)
                        self.assertEqual(self.frame.get_attribute("html", "data-theme"), theme)
                        self.assertTrue(self.page.evaluate("document.documentElement.scrollHeight <= innerHeight"))

    def test_theme_persistence_and_host_changes(self):
        self.frame.select_option("#theme-select", "dark")
        self.page.reload()
        self.page.locator("iframe").first.wait_for()
        self.frame = self.page.frames[1]
        self.frame.wait_for_function("currentUser !== null")
        self.assertEqual(self.frame.get_attribute("html", "data-theme"), "dark")
        self.frame.select_option("#theme-select", "auto")
        for background, expected in (("rgb(14, 17, 23)", "dark"), ("rgb(255, 255, 255)", "light")):
            self.page.evaluate("color => document.querySelector('[data-testid=stApp]').style.backgroundColor = color", background)
            self.frame.wait_for_function("theme => document.documentElement.dataset.theme === theme", arg=expected)

    def test_customer_order_isolation_and_agent_review_flow(self):
        context, customer_page, customer_frame = self.open_session("camila@example.test")
        try:
            self.assertNotIn("DG4-2026-1187", customer_frame.evaluate("Object.keys(Data.orders)"))
            self.navigate("orders", customer_frame)
            customer_frame.locator("#order-input").fill("DG4-2026-1187")
            customer_frame.locator("#order-form button").click()
            self.assertIn("No encontramos", customer_frame.locator("#order-result").inner_text())
            customer_frame.locator("#order-input").fill("DG4-2026-1042")
            customer_frame.locator("#order-form button").click()
            self.assertIn("En camino", customer_frame.locator("#order-result").inner_text())
            self.navigate("claims", customer_frame)
            customer_frame.locator('[data-action="new-claim"]').click()
            customer_frame.locator('[name="order"]').select_option("DG4-2026-1042")
            marker = customer_frame.evaluate("crypto.randomUUID()")
            customer_frame.locator('[name="description"]').fill("Mi pedido tiene una demora. " + marker)
            customer_frame.locator('#claim-form button[type="submit"]').click()
            self.saved(customer_frame)
            claim_id = customer_frame.evaluate("marker => state.claims.find(c => c.description.includes(marker)).id", marker)
            customer_frame.locator(f'[data-claim-id="{claim_id}"] .claim-open').click()
            self.assertEqual(customer_frame.locator('[data-action="approve-claim"]').count(), 0)
            customer_frame.locator('[data-action="close-drawer"]').click()
            # El agente recarga el estado compartido; no lee datos del navegador del cliente.
            self.navigate("claims")
            self.frame.locator('[data-action="refresh"]').click()
            self.saved()
            self.frame.locator("#claim-search").fill(claim_id)
            self.frame.locator(".claim-open").click()
            self.assertTrue(self.frame.locator('[data-action="send-claim"]').is_disabled())
            self.frame.locator('[data-action="edit-draft"]').click()
            self.frame.locator("#draft-box").fill("Respuesta humana revisada para este pedido.")
            self.frame.locator('[data-action="save-draft"]').click()
            self.saved()
            self.frame.locator('[data-action="approve-claim"]').click()
            self.saved()
            self.frame.locator(".claim-open").click()
            self.frame.locator('[data-action="send-claim"]').click()
            self.saved()
            self.assertIn("Envío simulado registrado", self.frame.locator(".detail-drawer").inner_text())
            self.assertTrue(self.frame.locator('[data-action="edit-draft"]').is_disabled())
            customer_page.reload()
            customer_page.locator("iframe").wait_for()
            customer_frame = customer_page.frames[1]
            customer_frame.wait_for_function("currentUser !== null")
            customer_frame.locator("#claim-search").fill(claim_id)
            customer_frame.locator(".claim-open").click()
            self.assertIn("Respuesta humana revisada", customer_frame.locator(".detail-drawer").inner_text())
            self.assertEqual(customer_frame.locator('[data-action="edit-draft"]').count(), 0)
        finally:
            context.close()

    def test_logout_revokes_session_and_reload_stays_logged_out(self):
        self.frame.locator("#menu-toggle").click()
        self.frame.locator('[data-action="logout"]').click()
        self.page.get_by_role("button", name="Iniciar sesión", exact=True).wait_for()
        self.page.reload()
        self.page.get_by_role("button", name="Iniciar sesión", exact=True).wait_for()
        self.assertEqual(self.page.locator("iframe").count(), 0)

    def test_sources_faq_reviews_and_nested_dialog_keyboard(self):
        self.navigate("sources")
        self.frame.locator('[data-action="open-source"]').first.click()
        self.assertIn("POL-01-F01", self.frame.locator("#modal").inner_text())
        self.page.keyboard.press("Escape")
        self.navigate("claims")
        self.frame.locator(".claim-open").first.click()
        if self.frame.locator('[data-action="change-category"]').is_enabled():
            self.frame.locator('[data-action="change-category"]').click()
            self.page.keyboard.press("Escape")
            self.assertTrue(self.frame.locator(".detail-drawer").is_visible())
            self.assertFalse(self.frame.locator(".detail-drawer").evaluate("e => e.inert"))
        self.page.keyboard.press("Escape")
        self.navigate("faq")
        self.frame.locator('[data-faq-id="FAQ-04"]').focus()
        self.page.keyboard.press("Enter")
        self.assertIn("No hay evidencia", self.frame.locator(".answer-panel .answer-note").inner_text())
        self.frame.locator('[data-action="review-faq"]').click()
        self.frame.locator('#modal button[type="submit"], #modal form button').last.click()
        self.saved()
        self.assertTrue(self.frame.locator('[data-action="resolve-faq"]').count() > 0)

    def test_scrum_has_fifteen_cards_correct_totals_and_downloadable_evidence(self):
        self.navigate("sprints")
        self.assertEqual(self.frame.locator("[data-story-card]").count(), 15)
        self.assertIn("68 SP", self.frame.locator("#view-container").inner_text())
        self.assertIn("27/35 SP", self.frame.locator("#view-container").inner_text())
        self.assertIn("TE-18", self.frame.locator("#view-container").inner_text())
        self.frame.locator('[data-story-status="HU-15"]').select_option("En curso")
        self.saved()
        self.assertEqual(self.frame.locator('[data-story-status="HU-15"]').input_value(), "En curso")
        self.frame.locator('[data-story-status="HU-15"]').select_option("Por hacer")
        self.saved()
        form = self.frame.locator('.sprint-record[data-sprint="1"]')
        form.locator('[name="mode"]').select_option("Simulación académica")
        form.locator('[name="review"]').fill("Prueba automatizada de la ficha. No documenta una reunión real.")
        form.locator('button').click()
        self.saved()
        self.assertEqual(self.frame.locator('.sprint-record[data-sprint="1"] [name="mode"]').input_value(), "Simulación académica")
        with self.page.expect_download() as pending:
            self.frame.locator('[data-action="export-scrum"]').click()
        download = pending.value
        html = Path(download.path()).read_text(encoding="utf-8")
        self.assertIn("Plantilla C", html)
        self.assertIn("TE-18", html)
        self.assertIn("HU-07 pendiente", html)
        self.assertIn("Captura definitiva pendiente", html)
        with self.page.expect_download() as pending:
            self.frame.locator('[data-action="export-board"]').click()
        self.assertIn("tablero local", Path(pending.value.path()).read_text())

    def test_evaluation_exports_results_and_collects_paired_times(self):
        self.navigate("reports")
        with self.page.expect_download() as pending:
            self.frame.locator('[data-action="export-report"]').click()
        result = json.loads(Path(pending.value.path()).read_text())
        self.assertEqual(result["dataset"]["count"], 38)
        self.assertLess(result["metrics"]["macroF1"], 1)
        for mode in ("manual", "assisted"):
            self.frame.locator('#experiment-start [name="mode"]').select_option(mode)
            self.frame.locator("#experiment-start button").click()
            self.frame.locator('#experiment-finish [name="response"]').fill("Respuesta revisada de prueba de interfaz; sin envío real.")
            self.frame.locator("#experiment-finish button").first.click()
            self.saved()
        with self.page.expect_download() as pending:
            self.frame.locator('[data-action="export-report"]').click()
        result = json.loads(Path(pending.value.path()).read_text())
        self.assertGreaterEqual(len(result["comparison"]["pairs"]), 1)
        self.assertGreater(result["comparison"]["manualMeanMs"], 0)
        self.assertGreater(result["comparison"]["assistedMeanMs"], 0)


if __name__ == "__main__":
    unittest.main()
