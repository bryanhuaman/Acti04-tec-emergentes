"""Regresiones de integración y diseño. Requiere Streamlit iniciado en UI_BASE_URL."""

import os
from pathlib import Path
import unittest

from playwright.sync_api import sync_playwright
from streamlit.testing.v1 import AppTest

ROOT = Path(__file__).resolve().parents[1]


class StreamlitIntegrationTests(unittest.TestCase):
    def test_frontend_is_embedded_without_python_errors(self):
        app = AppTest.from_file(str(ROOT / "streamlit_app.py")).run(timeout=30)
        self.assertFalse(app.exception)
        frames = app.get("iframe")
        self.assertEqual(len(frames), 1)
        html = frames[0].proto.srcdoc
        self.assertIn('id="theme-select"', html)
        self.assertIn('id="view-container"', html)
        self.assertNotIn('<script src="app.js"></script>', html)
        self.assertNotIn('<link rel="stylesheet" href="styles.css" />', html)


class BrowserInterfaceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        executable = os.environ.get("UI_BROWSER_EXECUTABLE")
        cls.browser = cls.playwright.chromium.launch(
            headless=True, **({"executable_path": executable} if executable else {})
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 390, "height": 844})
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.goto(os.environ.get("UI_BASE_URL", "http://127.0.0.1:8501"))
        self.page.locator("iframe").first.wait_for()
        self.frame = self.page.frames[1]
        self.frame.locator("#view-container h1").wait_for()

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def navigate(self, view):
        toggle = self.frame.locator("#menu-toggle")
        if toggle.is_visible():
            toggle.click()
        self.frame.locator(f'.nav-item[data-view="{view}"]').click()

    def test_layout_and_navigation_in_both_themes(self):
        views = ("overview", "claims", "faq", "orders", "sources", "reports", "sprints", "settings")
        for width in (320, 390, 768, 1024, 1440):
            self.page.set_viewport_size({"width": width, "height": 900})
            for theme in ("light", "dark"):
                self.frame.select_option("#theme-select", theme)
                for view in views:
                    with self.subTest(width=width, theme=theme, view=view):
                        self.navigate(view)
                        self.assertTrue(self.frame.evaluate(
                            "document.documentElement.scrollWidth <= innerWidth"
                        ))
                        self.assertEqual(self.frame.locator('[aria-current="page"]').count(), 1)
                        self.assertEqual(self.frame.get_attribute("html", "data-theme"), theme)
                        self.assertTrue(self.page.evaluate(
                            "document.documentElement.scrollHeight <= innerHeight"
                        ))

    def test_theme_persistence_and_host_changes(self):
        self.frame.select_option("#theme-select", "dark")
        self.page.reload()
        self.page.locator("iframe").first.wait_for()
        self.frame = self.page.frames[1]
        self.frame.locator("h1").wait_for()
        self.assertEqual(self.frame.get_attribute("html", "data-theme"), "dark")
        self.frame.select_option("#theme-select", "auto")
        for background, expected in (("rgb(14, 17, 23)", "dark"), ("rgb(255, 255, 255)", "light")):
            self.page.evaluate("color => document.querySelector('[data-testid=stApp]').style.backgroundColor = color", background)
            self.frame.wait_for_function("theme => document.documentElement.dataset.theme === theme", arg=expected)

    def test_mobile_dialogs_forms_and_keyboard(self):
        for theme in ("light", "dark"):
            self.frame.select_option("#theme-select", theme)
            self.navigate("claims")
            self.frame.locator('[data-action="new-claim"]').click()
            self.frame.locator('[name="customer"]').fill("Prueba de interfaz")
            self.frame.locator('[name="order"]').fill("DG4-2026-1042")
            self.frame.locator('[name="description"]').fill("Mi pedido tiene una demora de una hora.")
            self.frame.locator('#claim-form button[type="submit"]').click()
            self.frame.locator(".claim-open").first.click()
            self.assertEqual(self.frame.locator(".detail-drawer").get_attribute("aria-modal"), "true")
            self.frame.locator('[data-action="change-category"]').click()
            self.page.keyboard.press("Escape")
            self.assertTrue(self.frame.locator(".detail-drawer").is_visible())
            self.assertFalse(self.frame.locator(".detail-drawer").evaluate("el => el.inert"))
            self.frame.locator('[data-action="edit-draft"]').click()
            self.frame.locator("#draft-box").fill("Respuesta revisada para el cliente.")
            self.frame.locator('[data-action="save-draft"]').click()
            self.assertEqual(self.frame.locator("#draft-box").inner_text(), "Respuesta revisada para el cliente.")
            self.frame.locator('[data-action="approve-claim"]').click()
            self.assertEqual(self.frame.locator(".detail-drawer").count(), 0)
            self.navigate("orders")
            for order, expected in (("DG4-2026-1042", "En camino"), ("NO-EXISTE", "No encontramos")):
                self.frame.locator("#order-input").fill(order)
                self.frame.locator("#order-form button").click()
                self.assertIn(expected, self.frame.locator("#order-result").inner_text())
            self.navigate("faq")
            self.frame.locator('[data-faq-id="FAQ-04"]').focus()
            self.page.keyboard.press("Enter")
            self.assertIn("No hay evidencia", self.frame.locator(".answer-note").inner_text())
            self.assertTrue(self.frame.locator(".answer-panel").evaluate("el => document.activeElement === el"))


if __name__ == "__main__":
    unittest.main()
