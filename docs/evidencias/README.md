# Evidencias técnicas de la demostración

Archivos generados durante la revisión del 23/10/2026. Son evidencias de funcionamiento de esta web, **no** de reuniones Scrum, participación del equipo o cierres históricos de Jira.

- `escritorio-claro.png`, `escritorio-oscuro.png`, `movil-claro.png`, `movil-oscuro.png`: capturas de la interfaz ejecutada en Streamlit con una cuenta de demostración.
- `tablero-local-demostracion.png`: captura actual de las quince tarjetas inicializadas con el estado declarado en la resolución. No es una captura de Jira ni acredita un cierre histórico.
- `evaluacion-local.json`: ejecución del motor de reglas y generación extractiva sobre los 38 casos sintéticos etiquetados; incluye corpus, configuración, referencia del informe, resultados por caso y latencia local. No contiene tiempos manuales inventados ni métricas operativas de PedidosYa.
- `accesibilidad.json`: revisión automática con axe-core de ocho vistas en dos anchos y dos temas (32 comprobaciones), sin incidencias automáticas detectadas en esa ejecución. No es una certificación completa de accesibilidad.

Las pruebas reproducibles están en `tests/`. La muestra permite observar errores y límites del clasificador. Los valores de latencia varían entre ejecuciones; la huella del corpus y la muestra permite identificar su configuración.
