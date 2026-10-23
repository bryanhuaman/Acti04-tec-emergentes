"""SmartClaim AI: demostración académica con permisos y datos locales."""
from pathlib import Path
import uuid

import streamlit as st
import streamlit.components.v1 as components

from app_store import DEMO_ACCOUNTS, DEMO_PASSWORD, Store

ROOT = Path(__file__).resolve().parent
st.set_page_config(page_title="SmartClaim AI · Atención asistida", layout="wide", initial_sidebar_state="collapsed")


@st.cache_resource
def get_store():
    return Store()


store = get_store()
if "smartclaim_user" not in st.session_state:
    token = st.context.cookies.get("smartclaim_demo_session")
    restored = store.resume_session(token)
    if restored:
        st.session_state.smartclaim_user = restored
        st.session_state.smartclaim_token = token
if "smartclaim_user" not in st.session_state:
    st.title("SmartClaim AI")
    st.write("Demostración académica · atención de reclamos con revisión humana")
    st.info("Sin conexión con PedidosYa ni con servicios externos de IA. Usa únicamente los datos y cuentas ficticios de esta demostración.")
    with st.form("smartclaim_login"):
        email = st.text_input("Correo de demostración", value="agente@example.test")
        password = st.text_input("Contraseña de demostración", type="password")
        submitted = st.form_submit_button("Iniciar sesión", type="primary")
    if submitted:
        user = store.authenticate(email, password)
        if user:
            st.session_state.smartclaim_user = user
            st.session_state.smartclaim_token = store.create_session(user)
            st.rerun()
        else:
            st.error("Correo o contraseña incorrectos.")
    with st.expander("Cuentas públicas de demostración", expanded=True):
        for email, name, role in DEMO_ACCOUNTS:
            st.write(f"{email} · {name} · {'agente' if role == 'agent' else 'cliente'}")
        st.code(DEMO_PASSWORD, language=None)
        st.caption("Cada cliente recibe solo sus pedidos y reclamos. La cuenta de agente accede a la bandeja compartida. Estas cuentas públicas no son apropiadas para datos reales.")
else:
    user = st.session_state.smartclaim_user
    if "smartclaim_component_key" not in st.session_state:
        st.session_state.smartclaim_component_key = "smartclaim_" + uuid.uuid4().hex
    with st.sidebar:
        st.subheader("Sesión de demostración")
        st.write(user["name"])
        st.caption(user["email"])
        if st.button("Cerrar sesión"):
            store.revoke_session(st.session_state.get("smartclaim_token"))
            st.session_state.pop("smartclaim_token", None)
            st.session_state.pop("smartclaim_component_key", None)
            del st.session_state.smartclaim_user
            st.session_state.pop("smartclaim_last_request", None)
            st.rerun()
    st.markdown("""
        <style>
        [data-testid="stMainBlockContainer"], [data-testid="stAppViewBlockContainer"] {
          max-width: none; padding: 3.75rem 0 0;
        }
        [data-testid="stVerticalBlock"] { gap: 0; }
        .st-key-smartclaim-shell iframe {
          display: block; width: 100%; border: 0;
          height: calc(100vh - 3.75rem); height: calc(100dvh - 3.75rem);
        }
        </style>
    """, unsafe_allow_html=True)
    component = components.declare_component("smartclaim", path=str(ROOT / "frontend"))
    with st.container(key="smartclaim-shell"):
        event = component(snapshot=store.snapshot(user), session_token=st.session_state.get("smartclaim_token"), acknowledged_request=st.session_state.get("smartclaim_last_request", ""), error=st.session_state.pop("smartclaim_error", ""), key=st.session_state.smartclaim_component_key, default=None)
    if isinstance(event, dict) and event.get("requestId") and event["requestId"] != st.session_state.get("smartclaim_last_request"):
        st.session_state.smartclaim_last_request = event["requestId"]
        try:
            if event.get("type") == "save":
                store.save(user, event.get("state"), event.get("expectedRevision"))
            elif event.get("type") == "logout":
                store.revoke_session(st.session_state.get("smartclaim_token"))
                for name in ("smartclaim_user", "smartclaim_token", "smartclaim_component_key", "smartclaim_last_request"):
                    st.session_state.pop(name, None)
            elif event.get("type") != "refresh":
                raise ValueError("Operación no reconocida.")
        except (ValueError, PermissionError) as error:
            st.session_state.smartclaim_error = str(error)
        st.rerun()
