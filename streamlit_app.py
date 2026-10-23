"""Entrada de Streamlit para Delivery G4.

La experiencia visual vive en frontend/ para que pueda ejecutarse también como
sitio estático. Aquí se embeben los tres archivos del frontend en un componente
HTML, conservando la navegación y las interacciones del prototipo al desplegar
en Streamlit Cloud.
"""

from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components


ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "frontend"


def load_frontend() -> str:
    index = (FRONTEND / "index.html").read_text(encoding="utf-8")
    styles = (FRONTEND / "styles.css").read_text(encoding="utf-8")
    script = (FRONTEND / "app.js").read_text(encoding="utf-8")

    # El componente HTML se ejecuta en un iframe aislado. Incrustar CSS y JS
    # evita depender de rutas relativas o de un servidor de archivos externo.
    html = index.replace(
        '<link rel="stylesheet" href="styles.css" />',
        f"<style>\n{styles}\n</style>",
    )
    html = html.replace(
        '<script src="app.js"></script>',
        f"<script>\n{script}\n</script>",
    )
    return html


st.set_page_config(
    page_title="Delivery G4 · Atención asistida",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
      #MainMenu, header, footer { visibility: hidden; }
      [data-testid="stAppViewContainer"] > .main { padding: 0 !important; }
      [data-testid="stAppViewBlockContainer"] { max-width: none !important; padding: 0 !important; }
      [data-testid="stDecoration"] { display: none; }
    </style>
    """,
    unsafe_allow_html=True,
)

components.html(load_frontend(), height=2050, scrolling=True)
