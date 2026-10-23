# Delivery G4 · Atención asistida

Aplicación del proyecto de Tecnologías Emergentes del Grupo 04. Incluye el plan Scrum y un prototipo navegable para registrar reclamos, clasificar casos, recuperar políticas, proponer respuestas y exigir revisión humana antes de aprobarlas.

## Ejecutar con Streamlit

Se recomienda Python 3.10 o superior.

### Windows PowerShell

```powershell
cd ruta\a\delivery-g4
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
streamlit run streamlit_app.py
```

Si PowerShell bloquea la activación, ejecuta primero:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

### macOS o Linux

```bash
cd /ruta/a/delivery-g4
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

Streamlit abrirá el navegador automáticamente. Si no lo hace, visita `http://localhost:8501`.

En Streamlit Cloud, sube este repositorio y configura:

- **Main file path:** `streamlit_app.py`
- **Python dependencies:** se detectan desde `requirements.txt`

El archivo `requirement.txt` singular se incluye como alias por compatibilidad con entregas académicas; el archivo oficial que utiliza Streamlit es `requirements.txt`.

## Estructura del repositorio

```text
delivery-g4/
├── streamlit_app.py              # Entrada de la aplicación
├── requirements.txt              # Dependencia oficial de Streamlit
├── requirement.txt               # Alias solicitado para la entrega
├── frontend/
│   ├── index.html                # Estructura de la interfaz
│   ├── styles.css                # Diseño responsive
│   └── app.js                    # Navegación y funcionalidades simuladas
├── docs/
│   ├── PLAN-SCRUM.md             # Plan Scrum completo
│   └── referencia/               # PDF original de la tarea
└── .gitignore
```

## Funcionalidades

- Bandeja de reclamos con búsqueda, filtros y detalle.
- Registro validado con identificador, clasificación y nivel de confianza.
- Recuperación de hasta tres fragmentos con documento y versión.
- Borradores editables, auditoría, aprobación humana y escalamiento.
- Preguntas frecuentes con respuestas validadas y revisión de ambiguas.
- Consulta de pedidos simulados y manejo de identificadores inexistentes.
- Reporte reproducible con clasificación, recuperación, fidelidad, enrutamiento, abstención, latencia y comparación manual/asistida.
- Product Backlog completo con 12 historias, 52 SP, dos sprints, fichas y tablero inicial.

Los cambios de reclamos se conservan en `localStorage` dentro del navegador del usuario.

## Ejecución estática opcional

La carpeta `frontend/` también puede abrirse sin Streamlit. En Windows usa `ABRIR-DIRECTO.bat` o abre `frontend/index.html`. Para un servidor local ejecuta `start-server.bat` y visita `http://localhost:4173/frontend/`.
