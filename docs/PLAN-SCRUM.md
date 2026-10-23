# SmartClaim AI · Plan Scrum según la resolución de la Actividad 04

La referencia vigente es [Grupo 4 - Actividad 04.pdf](referencia/Grupo%204%20-%20Actividad%2004.pdf). Las [pautas del profesor](referencia/PAUTAS-PROFESOR.pdf) establecen los criterios de entrega. El antiguo plan de Delivery G4 con 12 HU pertenece a otra versión y no rige esta revisión.

Curso: Tecnologías Emergentes. Profesor: Tovar Galarreta, Juan Carlos Alfredo. Grupo 04.

## Plantilla A · Roles

| Rol | Integrante | Responsabilidad del informe |
| --- | --- | --- |
| Product Owner | Joseph Alexander Chombo Morocho | Prioriza el Product Backlog y valida los criterios de aceptación. |
| Scrum Master | Ariel Bryand Astete Vargas | Facilita Scrum, coordina el seguimiento y ayuda a resolver impedimentos. |
| Developer | Jhan Franco Pérez Ancieta | Frontend, backend, integración de componentes y pruebas técnicas. |
| Developer | Adrian Alonso Rioja Ocaña | Integración de IA generativa y pruebas del servicio externo de generación. |
| Developer | Gonzalo Mauricio Cáceres Murga | Clasificación de reclamos, Machine Learning y evaluación de resultados. |
| Developer | Bryan Adrian Huaman Chavez | Consultas de pedidos, recuperación documental, RAG y fuentes. |

## Plantilla B · Product Backlog

| HU / Jira | Historia | Criterio de aceptación | Prioridad | SP | Sprint | Estado declarado en el informe |
| --- | --- | --- | ---: | ---: | --- | --- |
| HU-01 / TE-4 | Como cliente, quiero registrar un reclamo, para solicitar atención cuando tenga un inconveniente con mi pedido. | El reclamo se guarda con identificador y estado; no se permiten descripciones vacías. | 1 | 3 | Sprint 1 | Hecho |
| HU-02 / TE-5 | Como agente, quiero consultar una bandeja de reclamos, para identificar los casos pendientes de atención. | El agente visualiza la lista y puede ingresar al detalle de un reclamo. | 2 | 3 | Sprint 1 | Hecho |
| HU-03 / TE-6 | Como cliente, quiero resolver consultas básicas, para obtener orientación rápida sobre el servicio. | El sistema responde preguntas frecuentes reconocidas y permite consultar información general. | 3 | 3 | Sprint 1 | Hecho |
| HU-04 / TE-7 | Como cliente, quiero consultar el estado de mi pedido, para conocer su situación actual. | El sistema muestra el estado de un pedido registrado sin exponer pedidos de otros usuarios. | 4 | 3 | Sprint 1 | Hecho |
| HU-05 / TE-8 | Como agente, quiero visualizar la categoría sugerida de un reclamo, para organizar mejor su atención. | Se presenta una categoría calculada a partir del texto del reclamo. | 5 | 5 | Sprint 2 | Hecho |
| HU-06 / TE-9 | Como agente, quiero recuperar políticas relacionadas con el reclamo, para sustentar mi respuesta. | Se muestran fragmentos documentales relacionados con el caso. | 6 | 8 | Sprint 2 | Hecho |
| HU-07 / TE-10 | Como agente, quiero recibir un borrador generado por IA, para preparar una respuesta con mayor rapidez. | Se produce un borrador que utiliza los datos del caso y el contexto recuperado; falta validación externa. | 7 | 8 | Sprint 2 | En curso |
| HU-08 / TE-11 | Como agente, quiero consultar las fuentes utilizadas, para verificar la información del borrador. | Se visualizan las referencias o fragmentos de la documentación consultada. | 8 | 3 | Sprint 2 | Hecho |
| HU-09 / TE-12 | Como agente, quiero editar el borrador, para adecuar la respuesta a las particularidades del reclamo. | El texto puede modificarse antes de su aprobación. | 9 | 3 | Sprint 2 | Hecho |
| HU-10 / TE-13 | Como agente, quiero aprobar una respuesta, para mantener el control de la comunicación al cliente. | El agente dispone de una acción de revisión y aprobación del contenido propuesto. | 10 | 3 | Sprint 2 | Hecho |
| HU-11 / TE-14 | Como agente, quiero escalar un reclamo, para solicitar revisión cuando el caso requiera atención especializada. | El caso puede derivarse mediante una acción de escalamiento. | 11 | 5 | Sprint 2 | Hecho |
| HU-12 / TE-15 | Como agente, quiero que el sistema advierta cuando no encuentre respaldo suficiente, para evitar respuestas sin fundamento. | Ante falta de información, se solicita revisión en lugar de generar una respuesta afirmativa. | 12 | 5 | Backlog futuro | Por hacer |
| HU-13 / TE-16 | Como supervisor, quiero consultar el historial de cambios de cada respuesta, para revisar las decisiones tomadas. | Se registran versiones, modificaciones y responsable de la edición. | 13 | 5 | Backlog futuro | Por hacer |
| HU-14 / TE-17 | Como equipo, queremos medir la calidad de clasificación y recuperación, para detectar oportunidades de mejora. | Se genera un reporte con muestra, F1 macro, Recall@3 y tiempos de respuesta. | 14 | 8 | Backlog futuro | Por hacer |
| HU-15 / TE-18 | Como agente, quiero identificar con claridad la política y su versión, para comprobar que la información esté actualizada. | Cada referencia muestra el documento y la versión consultada. | 15 | 3 | Backlog futuro | Por hacer |

Total: **15 HU y 68 SP**. Comprometidos en los sprints: **47 SP**; terminados según informe: **39 SP**. Mejoras futuras: **21 SP**.

## Sprints y fichas C

| Sprint | Fechas de referencia | Objetivo | Compromiso | Resultado declarado |
| --- | --- | --- | --- | --- |
| 1 · Sistema base | 25/09–09/10/2026 | Permitir que el cliente consulte pedidos y registre reclamos, y que el agente pueda revisarlos. | HU-01 a HU-04 · 12 SP | 4 historias · 12/12 SP |
| 2 · Inteligencia artificial y revisión | 09–23/10/2026 | Integrar clasificación automática, recuperación documental, borradores con IA y revisión humana. | HU-05 a HU-11 · 35 SP | 6 historias · 27/35 SP; HU-07 en curso, 8 SP |

Ambos sprints figuran cerrados en Jira el 23/10/2026 según el PDF. Cada ciclo tiene 14 días de referencia. El informe no fecha de manera explícita la semana inicial de organización; el equipo debe documentarla para completar las cinco semanas de la pauta, sin inventar reuniones ni fechas realizadas.

### Sprint 1

- Historias terminadas: HU-01 a HU-04 (12 SP).
- No terminadas: ninguna comprometida.
- Incremento declarado: registro de reclamos, bandeja, consultas frecuentes y pedidos.
- Review: demostración y comentarios pendientes de documentar.
- Retrospectiva: el incremento integra las funciones principales; acuerdos pendientes de documentar.
- Mejora propuesta: integrar clasificación y recuperación documental; responsable del acuerdo pendiente de confirmar.
- Captura definitiva: pendiente. El PDF conserva capturas preliminares obtenidas el 23/10/2026.

### Sprint 2

- Historias terminadas: HU-05, HU-06, HU-08, HU-09, HU-10 y HU-11 (27 SP).
- No terminada: HU-07 / TE-10 (8 SP), validación externa de generación pendiente.
- Incremento declarado: clasificación, recuperación, fuentes, edición, aprobación y escalamiento.
- Review: demostración y comentarios pendientes de documentar.
- Retrospectiva: se incorporó revisión humana; acuerdos pendientes de documentar.
- Mejora propuesta: completar y documentar la validación externa; responsable pendiente de confirmar.
- Captura definitiva: pendiente. El PDF conserva evidencia preliminar, no una fotografía histórica de cierre.

## Tablero y seguimiento

Tablero vigente: https://jhanfranco.atlassian.net/jira/software/projects/TE/boards/37/backlog. Historias: TE-4 a TE-18. Columnas: Por hacer / En curso / Hecho. Una tarjeta por historia y responsable. La web muestra las 15, permite registros complementarios y conserva una columna con el estado original del informe. No sincroniza cambios con Jira.

Los responsables funcionales propuestos en la web derivan de la distribución de roles. El informe no especifica en texto un responsable nominal para cada tarjeta; la asignación efectiva debe comprobarse en Jira. No se atribuye participación real a nadie por una selección en la demostración.

La pauta requiere seguimientos de 10–15 minutos al menos dos veces por semana. No exige actas, pero sí tablero actualizado y evidencia de participación de todos.

## Alcance técnico

El informe describe una implementación React/Vite + FastAPI, TF-IDF/regresión logística y servicios externos de IA en https://github.com/Jhanfranco07/Clasificador-de-Reclamos. Esta web es una demostración distinta en Streamlit + SQLite con reglas y generación extractiva, sin claves. **No valida HU-07** ni presenta sus métricas como resultados del modelo del informe.

HU-12 a HU-15 continúan en backlog futuro en el registro histórico, aunque sus funciones se puedan ensayar en esta demostración. Una mejora técnica local no equivale a aceptación formal del Product Owner ni actualiza Jira.

Las fichas pueden completarse y exportarse desde la sección Plan Scrum. La exportación HTML permite imprimir a PDF, conservando etiquetas de simulación y pendientes. El tablero SVG exportado es una representación local actual, no una captura histórica de Jira.
