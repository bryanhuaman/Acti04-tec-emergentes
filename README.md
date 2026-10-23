# SmartClaim AI · Demostración de la Actividad 04

Web académica para registrar reclamos, consultar pedidos propios, recuperar políticas de demostración y revisar respuestas. Está alineada con **Grupo 4 - Actividad 04.pdf**, que contiene **15 HU**, y conserva el diseño adaptable con temas claro, oscuro y automático.

**Esta web es un prototipo sin claves, en Streamlit + SQLite.** El informe describe otra implementación, en React/Vite y FastAPI, en [Clasificador-de-Reclamos](https://github.com/Jhanfranco07/Clasificador-de-Reclamos). Aquí se usan reglas y propuestas extractivas; no hay IA generativa real, conexión con PedidosYa ni mensajes externos. **HU-07 / TE-10 continúa pendiente de validación externa.**

Lee la [evaluación de cumplimiento](docs/REVISION-ACTIVIDAD.md) y el [plan Scrum actualizado](docs/PLAN-SCRUM.md).

## Ejecutar con Streamlit

Python 3.10+ y Streamlit 1.41+:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

En Windows usa `py -m venv .venv` y `.venv\Scripts\Activate.ps1`. En Streamlit Cloud, selecciona `streamlit_app.py` como entrada. Las dependencias oficiales están en `requirements.txt`; `requirement.txt` es solo un alias.

### Cuentas públicas de demostración

| Cuenta | Perfil | Pedido visible de ejemplo |
| --- | --- | --- |
| camila@example.test | Cliente | DG4-2026-1042, DG4-2026-0974 |
| sofia@example.test | Cliente | DG4-2026-1187 |
| agente@example.test | Agente | Bandeja compartida |

Contraseña de todas las cuentas: `SmartClaim-demo-2026`. Son datos de acceso ficticios y públicos; no sirven para un entorno con datos reales. El servidor autentica las sesiones, resuelve los roles y filtra los pedidos y reclamos por cuenta. Los clientes no reciben borradores internos ni auditoría del agente; reciben únicamente la respuesta final registrada como envío simulado.

La sesión se conserva al recargar mediante un identificador aleatorio con caducidad de 24 horas, almacenado como hash en SQLite; cerrar sesión lo revoca. Se trata de autenticación de demostración, sin recuperación de cuenta, gestión de usuarios ni endurecimiento para producción.

## Qué permite probar

- **Cliente:** registrar un reclamo de un pedido propio, consultar sus casos y pedidos, buscar FAQ y solicitar revisión de una pregunta ambigua.
- **Agente:** revisar la bandeja compartida, categoría calculada y hasta tres fragmentos, leer los doce documentos de demostración, editar borradores y conservar su historial.
- **Control humano:** aprobar la versión exacta del texto, invalidar la aprobación al editar, registrar un envío simulado y derivar casos con motivo y responsable. Los casos sensibles requieren una decisión especializada antes de aprobar.
- **Evaluación:** ejecutar 38 casos sintéticos etiquetados, ver los errores, F1 macro, Recall@3, respaldo extractivo, enrutamiento, abstención y latencia local. Exportar muestra, configuración, resultados y corpus a JSON.
- **Tiempos:** medir de verdad la preparación manual y asistida de los mismos casos. La comparación permanece sin datos hasta disponer de muestras emparejadas.
- **Scrum:** consultar las 15 HU, roles, prioridades, SP y enlaces TE-4 a TE-18; actualizar un tablero local con responsable por tarjeta; completar dos fichas C, adjuntar PNG/JPEG y exportar un informe HTML imprimible a PDF y el tablero SVG.

La página mantiene el estado histórico del informe: Sprint 1 **12/12 SP**, Sprint 2 **27/35 SP**, HU-07 en curso y HU-12 a HU-15 como mejoras futuras. Los complementos de esta web no actualizan Jira ni certifican reuniones, participación o aceptación de historias.

## Datos y persistencia

SQLite se crea en `.local/smartclaim.sqlite3`, fuera del control de versiones. `SMARTCLAIM_DB_PATH` permite otra ubicación. Se usa control de revisión para rechazar escrituras desactualizadas en lugar de sobrescribir cambios de otra sesión. El botón **Actualizar** recarga la bandeja.

En alojamientos con disco efímero, la base puede perderse al reconstruir o reiniciar la instancia. Exporta respaldos desde Configuración. No se importan automáticamente datos de navegadores de la versión anterior a la base compartida; sus claves de almacenamiento no se borran. No ingreses datos reales o sensibles: las cuentas son públicas y el respaldo contiene la información visible para la sesión.

El corpus contiene **12 documentos ficticios y 24 fragmentos**, identificados y versionados. Las políticas no representan condiciones oficiales de PedidosYa. La clasificación utiliza reglas y confianza heurística, no un modelo ML ni probabilidades calibradas.

## Diseño y accesibilidad

El tema automático sigue a Streamlit; en modo estático sigue al sistema. La selección se conserva en el navegador. La tipografía usa fuentes del sistema, los controles táctiles tienen al menos 44 px y las tablas anchas se desplazan dentro de su contenedor. Se puede navegar con teclado, saltar al contenido y cerrar menús o diálogos con Escape.

## Pruebas

Instala las dependencias de desarrollo y Chromium:

```bash
pip install -r requirements-dev.txt
python -m playwright install chromium
```

Inicia una instancia con una base **de prueba**, separada de los datos que quieras conservar:

```bash
SMARTCLAIM_DB_PATH=/tmp/smartclaim-tests.sqlite3 streamlit run streamlit_app.py --server.port=8502 --server.headless=true
```

En otra terminal:

```bash
node --test tests/domain.test.cjs
UI_BASE_URL=http://127.0.0.1:8502 python -m unittest discover -s tests -v
```

Node.js 18+ solo es necesario para las pruebas del dominio, no para ejecutar Streamlit. En Windows configura las variables con `$env:SMARTCLAIM_DB_PATH` y `$env:UI_BASE_URL`. `UI_BROWSER_EXECUTABLE` permite usar otro Chromium ya instalado.

Las pruebas verifican permisos en el servidor, versiones/aprobaciones, recuperación y abstención, métricas y muestras, exportaciones, sesión, flujo cliente/agente y ocho secciones en cinco anchos y ambos temas. Las pruebas de navegador escriben reclamos, mediciones y registros complementarios en su base de prueba; no deben apuntar a una instancia con información real.

## Vista estática opcional

`bash start-server.sh` o `start-server.bat` sirve **solo `frontend/`** en el puerto 4173, para revisar el diseño local. No ofrece cuentas autenticadas ni acceso a la base compartida. El flujo con aislamiento de usuarios debe comprobarse en Streamlit. `ABRIR-DIRECTO.bat` abre esa vista sin servidor.

## Documentos del proyecto

- [Pautas del profesor](docs/referencia/PAUTAS-PROFESOR.pdf).
- [Resolución vigente de la actividad](docs/referencia/Grupo%204%20-%20Actividad%2004.pdf).
- [Plan Scrum](docs/PLAN-SCRUM.md), [auditoría de cumplimiento](docs/REVISION-ACTIVIDAD.md) y [guion de presentación](docs/DEMO-10-MINUTOS.md).

La entrega formal aún necesita los comentarios de Review, acuerdos de retrospectiva, evidencia individual y capturas definitivas identificados como pendientes en el informe. La web permite registrarlos; no los inventa.
