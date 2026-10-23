"""Persistencia y aislamiento de cuentas para la demostración Streamlit.

No integra sistemas de PedidosYa ni servicios de IA. Las cuentas son públicas y
exclusivas del entorno académico; los permisos se comprueban en el servidor.
"""
from contextlib import contextmanager
from datetime import datetime, timezone
import hashlib
import hmac
import json
import os
from pathlib import Path
import sqlite3
import secrets
import time

ROOT = Path(__file__).resolve().parent
DEMO_PASSWORD = "SmartClaim-demo-2026"
DEMO_ACCOUNTS = (
    ("camila@example.test", "Camila Torres", "client"),
    ("sofia@example.test", "Sofía Valdivia", "client"),
    ("agente@example.test", "Agente de demostración", "agent"),
)


def timestamp():
    return datetime.now(timezone.utc).isoformat()


def encode(value):
    return json.dumps(value, ensure_ascii=False)


class Store:
    def __init__(self, path=None):
        self.path = Path(path or os.environ.get("SMARTCLAIM_DB_PATH", ROOT / ".local" / "smartclaim.sqlite3"))
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.initialize()

    @contextmanager
    def connect(self):
        connection = sqlite3.connect(self.path, timeout=10)
        try:
            connection.row_factory = sqlite3.Row
            with connection:
                connection.execute("PRAGMA foreign_keys=ON")
                yield connection
        finally:
            connection.close()

    def initialize(self):
        with self.connect() as db:
            db.executescript("""
                CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, email TEXT NOT NULL REFERENCES users(email), expires REAL NOT NULL);
                CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, owner TEXT NOT NULL REFERENCES users(email), payload TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS claims (id TEXT PRIMARY KEY, owner TEXT NOT NULL REFERENCES users(email), payload TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS faq_reviews (id TEXT PRIMARY KEY, owner TEXT NOT NULL REFERENCES users(email), payload TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, payload TEXT NOT NULL);
                INSERT OR IGNORE INTO metadata VALUES ('revision','0');
            """)
            if db.execute("SELECT count(*) FROM users").fetchone()[0]:
                return
            for email, name, role in DEMO_ACCOUNTS:
                salt = os.urandom(16).hex()
                hashed = hashlib.scrypt(DEMO_PASSWORD.encode(), salt=bytes.fromhex(salt), n=2**14, r=8, p=1).hex()
                db.execute("INSERT INTO users VALUES (?,?,?,?,?)", (email, name, role, salt, hashed))
            seed = json.loads((ROOT / "demo_seed.json").read_text(encoding="utf-8"))
            for number, (order_id, payload) in enumerate(seed["orders"].items()):
                owner = DEMO_ACCOUNTS[1 if number == 1 else 0][0]
                db.execute("INSERT INTO orders VALUES (?,?,?)", (order_id, owner, encode(payload)))
            for index, value in enumerate(seed["claims"]):
                order = db.execute("SELECT owner FROM orders WHERE id=?", (value["order"],)).fetchone()
                owner = order["owner"] if order else DEMO_ACCOUNTS[index % 2][0]
                name = db.execute("SELECT name FROM users WHERE email=?", (owner,)).fetchone()[0]
                value = {**value, "customer": name, "createdAt": "2026-10-22T20:00:00+00:00", "demo": True, "status": "Nuevo", "needsAnalysis": True}
                db.execute("INSERT INTO claims VALUES (?,?,?)", (value["id"], owner, encode(value)))

    def authenticate(self, email, password):
        with self.connect() as db:
            row = db.execute("SELECT * FROM users WHERE email=?", (str(email).strip().lower(),)).fetchone()
        if not row:
            # Mantiene un coste similar para cuentas inexistentes.
            hashlib.scrypt(str(password).encode(), salt=b"smartclaim-demo!", n=2**14, r=8, p=1)
            return None
        supplied = hashlib.scrypt(str(password).encode(), salt=bytes.fromhex(row["salt"]), n=2**14, r=8, p=1).hex()
        return {key: row[key] for key in ("email", "name", "role")} if hmac.compare_digest(supplied, row["password_hash"]) else None

    def _user(self, db, user):
        row = db.execute("SELECT email,name,role FROM users WHERE email=?", (user.get("email"),)).fetchone()
        if not row:
            raise PermissionError("La sesión no corresponde a una cuenta válida.")
        return dict(row)

    def snapshot(self, user):
        with self.connect() as db:
            user = self._user(db, user)
            is_agent = user["role"] == "agent"
            where, params = ("", ()) if is_agent else (" WHERE owner=?", (user["email"],))
            claims = [json.loads(row[0]) for row in db.execute("SELECT payload FROM claims" + where, params)]
            if not is_agent:
                visible = ("id", "customer", "order", "description", "channel", "createdAt", "status", "demo", "category", "confidence")
                public_claims = []
                for claim in claims:
                    public = {key: claim[key] for key in visible if key in claim}
                    public.update(schemaVersion=2, category=claim.get("category", "Pendiente de análisis del agente"), confidence=claim.get("confidence", 0), draft="", evidence=[], audit=[], revisions=[], approval=None, sent=None)
                    if claim.get("sent"):
                        public["sent"] = {key: claim["sent"][key] for key in ("text", "at", "actor", "channel", "simulated") if key in claim["sent"]}
                    public_claims.append(public)
                claims = public_claims
            orders = {row["id"]: json.loads(row["payload"]) for row in db.execute("SELECT id,payload FROM orders" + where, params)}
            revision = int(db.execute("SELECT payload FROM metadata WHERE key='revision'").fetchone()[0])
            reviews = [json.loads(row[0]) for row in db.execute("SELECT payload FROM faq_reviews" + where, params)]
            artifact = db.execute("SELECT payload FROM metadata WHERE key='artifacts'").fetchone() if is_agent else None
        artifacts = json.loads(artifact[0]) if artifact else {}
        artifacts["faqReviews"] = reviews
        return {"claims": claims, "orders": orders, "revision": revision, "artifacts": artifacts, "user": user}

    def create_session(self, user):
        token = secrets.token_urlsafe(32)
        with self.connect() as db:
            user = self._user(db, user)
            db.execute("DELETE FROM sessions WHERE expires < ?", (time.time(),))
            db.execute("INSERT INTO sessions VALUES (?,?,?)", (hashlib.sha256(token.encode()).hexdigest(), user["email"], time.time() + 86400))
        return token

    def resume_session(self, token):
        if not token or not isinstance(token, str):
            return None
        with self.connect() as db:
            row = db.execute("SELECT u.email,u.name,u.role FROM sessions s JOIN users u ON u.email=s.email WHERE s.token_hash=? AND s.expires>?", (hashlib.sha256(token.encode()).hexdigest(), time.time())).fetchone()
        return dict(row) if row else None

    def revoke_session(self, token):
        if token:
            with self.connect() as db:
                db.execute("DELETE FROM sessions WHERE token_hash=?", (hashlib.sha256(token.encode()).hexdigest(),))

    def get_order(self, user, order_id):
        # El mismo filtro se aplica aun si el cliente adivina un ID ajeno.
        with self.connect() as db:
            user = self._user(db, user)
            row = db.execute("SELECT owner,payload FROM orders WHERE id=?", (order_id,)).fetchone()
            if not row or (user["role"] != "agent" and row["owner"] != user["email"]):
                return None
            return json.loads(row["payload"])

    def save(self, user, incoming, expected_revision):
        if not isinstance(incoming, dict) or not isinstance(incoming.get("claims"), list):
            raise ValueError("El formato del registro no es válido.")
        if len(encode(incoming)) > 8_000_000:
            raise ValueError("El registro es demasiado grande. Exporta las capturas fuera de la base local.")
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            user = self._user(db, user)
            revision = int(db.execute("SELECT payload FROM metadata WHERE key='revision'").fetchone()[0])
            if expected_revision != revision:
                raise ValueError("Otro registro cambió. Se recargó el estado del servidor; vuelve a realizar tu último cambio.")
            is_agent = user["role"] == "agent"
            for candidate in incoming["claims"]:
                if not isinstance(candidate, dict) or not candidate.get("id"):
                    raise ValueError("Reclamo sin identificador válido.")
                row = db.execute("SELECT owner,payload FROM claims WHERE id=?", (candidate["id"],)).fetchone()
                if row:
                    if not is_agent:
                        if row["owner"] != user["email"]:
                            raise PermissionError("No puedes modificar reclamos de otra cuenta.")
                        # El cliente consulta o registra casos; solo el agente edita o aprueba respuestas.
                        old = json.loads(row["payload"])
                        for key in ("approval", "sent", "specialistReview", "revisions"):
                            if candidate.get(key) and candidate.get(key) != old.get(key):
                                raise PermissionError("La edición, aprobación y envío corresponden a un agente.")
                        continue
                    old = json.loads(row["payload"])
                    if old.get("sent") and candidate != old:
                        raise ValueError("Un envío registrado es inmutable.")
                    approval = candidate.get("approval")
                    if approval and candidate.get("escalation") and not candidate.get("specialistReview"):
                        raise PermissionError("Documenta la revisión especializada antes de aprobar.")
                    if approval and (approval.get("text") != candidate.get("draft") or approval.get("revision") != candidate.get("revision")):
                        raise ValueError("La aprobación debe corresponder al texto y versión actuales.")
                    if candidate.get("sent") and not old.get("sent"):
                        # Debe existir una aprobación guardada, no una aprobación y envío fabricados en una sola petición.
                        previous_approval = old.get("approval")
                        if not previous_approval or candidate["sent"].get("text") != previous_approval.get("text") or previous_approval.get("text") != candidate.get("draft") or previous_approval.get("revision") != candidate.get("revision"):
                            raise PermissionError("Guarda una aprobación vigente antes de registrar un envío.")
                        candidate["sent"]["actor"] = user["name"]
                        candidate["sent"]["at"] = timestamp()
                        candidate["sent"]["simulated"] = True
                    if approval and approval != old.get("approval"):
                        approval["actor"], approval["at"] = user["name"], timestamp()
                    db.execute("UPDATE claims SET payload=? WHERE id=?", (encode(candidate), candidate["id"]))
                else:
                    for key in ("customer", "order", "description"):
                        if not isinstance(candidate.get(key), str) or not candidate[key].strip():
                            raise ValueError("Nombre, pedido y descripción son obligatorios.")
                    order = db.execute("SELECT owner FROM orders WHERE id=?", (candidate["order"],)).fetchone()
                    if not is_agent and (not order or order["owner"] != user["email"]):
                        raise PermissionError("Solo puedes registrar reclamos de tus propios pedidos.")
                    owner = order["owner"] if order else user["email"]
                    # No se confía en aprobaciones o análisis que un cliente adjunte a un caso nuevo.
                    payload = {key: candidate[key] for key in ("id", "customer", "order", "description", "channel") if key in candidate}
                    payload.update(createdAt=timestamp(), status="Nuevo", demo=False, needsAnalysis=True)
                    if not is_agent:
                        payload["customer"] = user["name"]
                    db.execute("INSERT INTO claims VALUES (?,?,?)", (payload["id"], owner, encode(payload)))
            for review in incoming.get("faqReviews", []):
                if not isinstance(review, dict) or not all(str(review.get(k, "")).strip() for k in ("id", "question", "reason")):
                    raise ValueError("La solicitud de revisión necesita pregunta y motivo.")
                existing = db.execute("SELECT owner FROM faq_reviews WHERE id=?", (review["id"],)).fetchone()
                if existing:
                    if not is_agent:
                        if existing["owner"] != user["email"]:
                            raise PermissionError("La solicitud pertenece a otra cuenta.")
                        continue
                    if review.get("status") == "Revisada":
                        review["reviewedBy"] = user["name"]
                    db.execute("UPDATE faq_reviews SET payload=? WHERE id=?", (encode(review), review["id"]))
                else:
                    review = {**review, "status": "Pendiente", "actor": user["name"], "createdAt": timestamp()}
                    db.execute("INSERT INTO faq_reviews VALUES (?,?,?)", (review["id"], user["email"], encode(review)))
            if is_agent:
                artifacts = {key: incoming[key] for key in ("scrum", "measurements") if key in incoming}
                db.execute("INSERT OR REPLACE INTO metadata VALUES ('artifacts',?)", (encode(artifacts),))
            db.execute("UPDATE metadata SET payload=? WHERE key='revision'", (str(revision + 1),))
        return revision + 1
