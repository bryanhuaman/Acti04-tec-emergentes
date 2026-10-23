import copy
from pathlib import Path
import tempfile
import unittest

from app_store import DEMO_PASSWORD, Store


class StoreTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.directory.name) / "test.sqlite3")
        self.agent = self.store.authenticate("agente@example.test", DEMO_PASSWORD)
        self.camila = self.store.authenticate("camila@example.test", DEMO_PASSWORD)
        self.sofia = self.store.authenticate("sofia@example.test", DEMO_PASSWORD)

    def tearDown(self):
        self.directory.cleanup()

    def snapshot(self, user):
        snapshot = self.store.snapshot(user)
        return snapshot, {"claims": snapshot["claims"], "faqReviews": snapshot["artifacts"]["faqReviews"]}

    def new_claim(self, identifier="SC-test", order="DG4-2026-1042"):
        return {"id": identifier, "customer": "Cliente", "order": order, "description": "Mi pedido tiene un retraso.", "channel": "Web"}

    def test_authentication_uses_correct_password(self):
        self.assertEqual(self.agent["role"], "agent")
        self.assertIsNone(self.store.authenticate("agente@example.test", "incorrecta"))
        self.assertIsNone(self.store.authenticate("inexistente@example.test", DEMO_PASSWORD))

    def test_hu04_server_filters_orders_and_claims_per_account(self):
        first = self.store.snapshot(self.camila)
        second = self.store.snapshot(self.sofia)
        self.assertIn("DG4-2026-1042", first["orders"])
        self.assertNotIn("DG4-2026-1187", first["orders"])
        self.assertIn("DG4-2026-1187", second["orders"])
        self.assertTrue({c["id"] for c in first["claims"]}.isdisjoint(c["id"] for c in second["claims"]))
        self.assertIsNone(self.store.get_order(self.camila, "DG4-2026-1187"))
        self.assertIsNone(self.store.get_order(self.sofia, "DG4-2026-1042"))

    def test_session_resumes_without_storing_raw_token_and_revokes(self):
        token = self.store.create_session(self.camila)
        self.assertEqual(self.store.resume_session(token)["email"], self.camila["email"])
        self.assertIsNone(self.store.resume_session("token-invalido"))
        with self.store.connect() as db:
            stored = db.execute("SELECT token_hash FROM sessions").fetchone()[0]
        self.assertNotEqual(stored, token)
        self.store.revoke_session(token)
        self.assertIsNone(self.store.resume_session(token))

    def test_role_is_resolved_in_server_not_trusted_from_client(self):
        forged = {**self.camila, "role": "agent"}
        self.assertEqual(self.store.snapshot(forged)["user"]["role"], "client")
        self.assertNotIn("DG4-2026-1187", self.store.snapshot(forged)["orders"])

    def test_hu01_customer_registration_becomes_visible_to_agent(self):
        snapshot, incoming = self.snapshot(self.camila)
        incoming["claims"].append(self.new_claim())
        self.store.save(self.camila, incoming, snapshot["revision"])
        found = next(c for c in self.store.snapshot(self.agent)["claims"] if c["id"] == "SC-test")
        self.assertEqual(found["customer"], "Camila Torres")
        self.assertTrue(found["createdAt"])
        self.assertEqual(found["status"], "Nuevo")
        self.assertNotIn("SC-test", [c["id"] for c in self.store.snapshot(self.sofia)["claims"]])

    def test_customer_cannot_claim_another_users_order(self):
        snapshot, incoming = self.snapshot(self.camila)
        incoming["claims"].append(self.new_claim(order="DG4-2026-1187"))
        with self.assertRaises(PermissionError):
            self.store.save(self.camila, incoming, snapshot["revision"])
        self.assertEqual(self.store.snapshot(self.camila)["revision"], snapshot["revision"])

    def test_empty_descriptions_are_rejected_in_server(self):
        snapshot, incoming = self.snapshot(self.camila)
        candidate = self.new_claim()
        candidate["description"] = "  "
        incoming["claims"].append(candidate)
        with self.assertRaises(ValueError):
            self.store.save(self.camila, incoming, snapshot["revision"])

    def test_customer_cannot_inject_approval_on_new_claim(self):
        snapshot, incoming = self.snapshot(self.camila)
        incoming["claims"].append({**self.new_claim(), "approval": {"text": "Inventada"}, "sent": {"text": "Inventada"}})
        self.store.save(self.camila, incoming, snapshot["revision"])
        saved = next(c for c in self.store.snapshot(self.camila)["claims"] if c["id"] == "SC-test")
        self.assertIsNone(saved.get("approval"))
        self.assertIsNone(saved.get("sent"))

    def test_customer_cannot_approve_an_existing_case(self):
        snapshot, incoming = self.snapshot(self.camila)
        incoming["claims"][0]["approval"] = {"text": "No permitida"}
        with self.assertRaises(PermissionError):
            self.store.save(self.camila, incoming, snapshot["revision"])

    def test_cannot_alter_someone_elses_claim_by_id(self):
        other = self.store.snapshot(self.sofia)["claims"][0]
        snapshot, incoming = self.snapshot(self.camila)
        incoming["claims"].append(other)
        with self.assertRaises(PermissionError):
            self.store.save(self.camila, incoming, snapshot["revision"])

    def test_stale_writes_do_not_overwrite_other_changes(self):
        snapshot, incoming = self.snapshot(self.agent)
        self.store.save(self.agent, incoming, snapshot["revision"])
        with self.assertRaises(ValueError):
            self.store.save(self.agent, incoming, snapshot["revision"])

    def test_hu10_server_requires_saved_current_approval_before_send(self):
        snapshot, incoming = self.snapshot(self.agent)
        candidate = incoming["claims"][0]
        candidate.update(draft="Respuesta", revision=0, approval={"text": "Respuesta", "revision": 0}, sent={"text": "Respuesta"})
        with self.assertRaises(PermissionError):
            self.store.save(self.agent, incoming, snapshot["revision"])
        candidate["sent"] = None
        self.store.save(self.agent, incoming, snapshot["revision"])
        snapshot, incoming = self.snapshot(self.agent)
        candidate = incoming["claims"][0]
        candidate["sent"] = {"text": "Respuesta"}
        self.store.save(self.agent, incoming, snapshot["revision"])
        saved = self.store.snapshot(self.agent)["claims"][0]
        self.assertEqual(saved["sent"]["actor"], self.agent["name"])
        self.assertTrue(saved["sent"]["simulated"])
        self.assertEqual(saved["approval"]["actor"], self.agent["name"])

    def test_customer_snapshot_never_exposes_internal_drafts_or_audit(self):
        snapshot, incoming = self.snapshot(self.agent)
        candidate = next(c for c in incoming["claims"] if c["order"] == "DG4-2026-1042")
        candidate.update(draft="BORRADOR INTERNO", originalDraft="ORIGINAL INTERNO", revisions=[{"before": "INTERNO"}], audit=[{"text": "NOTA INTERNA"}])
        self.store.save(self.agent, incoming, snapshot["revision"])
        public = next(c for c in self.store.snapshot(self.camila)["claims"] if c["id"] == candidate["id"])
        self.assertEqual(public["draft"], "")
        self.assertEqual(public["audit"], [])
        self.assertEqual(public["revisions"], [])
        self.assertNotIn("originalDraft", public)

    def test_approval_must_match_current_text_and_revision(self):
        snapshot, incoming = self.snapshot(self.agent)
        incoming["claims"][0].update(draft="Actual", revision=2, approval={"text": "Anterior", "revision": 1})
        with self.assertRaises(ValueError):
            self.store.save(self.agent, incoming, snapshot["revision"])

    def test_specialist_review_is_enforced_before_approval(self):
        snapshot, incoming = self.snapshot(self.agent)
        incoming["claims"][0].update(draft="Respuesta", revision=0, escalation={"reason": "Salud"}, approval={"text": "Respuesta", "revision": 0})
        with self.assertRaises(PermissionError):
            self.store.save(self.agent, incoming, snapshot["revision"])

    def test_faq_review_queue_is_shared_with_agent_but_filtered_for_customers(self):
        snapshot, incoming = self.snapshot(self.camila)
        incoming["faqReviews"].append({"id": "FAQ-test", "question": "¿Cambio dirección?", "reason": "Sin respuesta validada", "status": "Revisada"})
        self.store.save(self.camila, incoming, snapshot["revision"])
        agent = self.store.snapshot(self.agent)
        request = agent["artifacts"]["faqReviews"][0]
        self.assertEqual(request["status"], "Pendiente")
        self.assertEqual(request["actor"], self.camila["name"])
        self.assertEqual(self.store.snapshot(self.sofia)["artifacts"]["faqReviews"], [])

    def test_sprint_artifacts_and_measurements_are_persisted_for_agents_only(self):
        snapshot, incoming = self.snapshot(self.agent)
        incoming.update(scrum={"version": 2, "stories": {}}, measurements=[{"sampleId": "test"}])
        self.store.save(self.agent, incoming, snapshot["revision"])
        self.assertEqual(self.store.snapshot(self.agent)["artifacts"]["scrum"]["version"], 2)
        self.assertNotIn("scrum", self.store.snapshot(self.camila)["artifacts"])


if __name__ == "__main__":
    unittest.main()
