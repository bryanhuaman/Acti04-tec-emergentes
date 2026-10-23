# Revisión de cumplimiento · SmartClaim AI

Revisión del 23 de octubre de 2026, hora de Lima. Se contrastaron las pautas del profesor, la resolución correcta y el comportamiento ejecutado de esta web. Los PDF son fuentes de requisitos y evidencia declarada; sus afirmaciones no se convierten automáticamente en resultados probados de esta implementación.

## Referencias y alcance

1. [Pautas del profesor](referencia/PAUTAS-PROFESOR.pdf), páginas 1–3: cinco semanas, roles, al menos diez HU con aceptación/prioridad/SP, tablero, dos sprints, Review/Retro, entregables E1/E2 y presentación de diez minutos.
2. [Grupo 4 - Actividad 04.pdf](referencia/Grupo%204%20-%20Actividad%2004.pdf): resolución vigente. Roles y arquitectura en p. 3; quince HU en pp. 4–6; sprints y Jira en p. 7; fichas C en pp. 8–9; evidencias y su limitación temporal en pp. 10–30; estado final en p. 31; resultados y pendientes en p. 32; referencias en p. 33.
3. [Repositorio citado por el informe](https://github.com/Jhanfranco07/Clasificador-de-Reclamos), consultado en el commit `86691f7da69554ab5173afd5cb0bd5464d5169e4`. Se contrastaron su README y `models/training_report.txt`, que registran 105 ejemplos, 27 casos de validación, exactitud 0,7407 y F1 macro 0,73. No se ejecutó ni se modificó ese otro repositorio; tampoco se presenta su afirmación de 24 pruebas como una prueba ejecutada de esta web.

El plan anterior de Delivery G4 con 12 HU y sprints de noviembre **no corresponde a la resolución correcta**. Se corrigió la web a SmartClaim AI, 15 HU, Jira TE-4 a TE-18 y sprints de septiembre/octubre.

El usuario eligió una demostración funcional **sin claves**. Esta implementación usa Streamlit + SQLite, reglas y generación extractiva. El informe describe React/Vite + FastAPI, TF-IDF/regresión logística y servicios externos de IA/embeddings/pgvector. Son implementaciones distintas. No se afirma que esta web implemente ese stack, entrene ese modelo o haya validado sus servicios externos.

## Dictamen

La web anterior **no cumplía íntegramente**: mostraba otro backlog, cifras de evaluación fijas, botones sin registro real y no aislaba pedidos por usuario. Se corrigieron los flujos que se pueden verificar en un prototipo sin claves.

Las capacidades de HU-01 a HU-06 y HU-08 a HU-15 pueden demostrarse aquí con los límites indicados. **HU-07 no puede declararse terminada:** no hay generación por IA real ni validación del servicio externo. El texto extractivo de demostración permite practicar la revisión, pero no cumple ese requisito tecnológico.

La actividad formal **todavía tiene pendientes documentales**. El propio informe señala falta de comentarios de Review, acuerdos de retrospectiva y capturas definitivas. El equipo debe aportar esas evidencias y la participación individual. El código y una cuenta pública de demostración no las certifican.

## Pautas del profesor frente a la resolución y la web

| Requisito | Evaluación | Evidencia / acción |
| --- | --- | --- |
| Plantilla A: PO, SM y Developers; todos participan | Roles coincidentes con la resolución. Participación real no acreditable mediante esta web. | Se muestran los seis integrantes y las responsabilidades corregidas. Conservar evidencias individuales del tablero, registros y repositorio. |
| Plantilla B: mínimo diez HU, formato usuario/funcionalidad/beneficio, criterio, prioridad y SP | La resolución contiene quince; se muestran completas. | 68 SP: 47 comprometidos y 21 de mejoras futuras. Enlaces TE-4 a TE-18. |
| Una tarjeta por HU, con responsable; tres columnas | Corregido en la demostración. | Quince tarjetas y controles de estado/responsable. Los responsables funcionales se proponen a partir de los roles; comprobar la asignación efectiva en Jira. |
| Cinco semanas: organización y dos sprints de dos semanas | Los dos ciclos de catorce días están documentados; falta explicitar la semana inicial de organización. | Sprint 1: 25/09–09/10; Sprint 2: 09–23/10. No se inventan fechas de organización realizadas. |
| Sprint Goal, historias comprometidas y resultado | Coincide con lo declarado en el PDF. | Sprint 1: 12/12 SP; Sprint 2: 27/35 SP; HU-07 en curso. Ambos figuran cerrados en Jira el 23/10 según informe. |
| Daily de 10–15 minutos al menos dos veces por semana | Exigencia reconocida; realización no verificada. | El docente no exige actas. Mantener tablero actualizado y evidencia del seguimiento. |
| Review y retrospectiva en una ficha por sprint | La estructura está disponible; el contenido real sigue parcialmente pendiente. | Formularios completos con tipo de registro, Review, qué funcionó, mejora y responsable, captura y fecha de edición. No se fabricaron comentarios del docente ni acuerdos. |
| Captura al cierre de cada sprint | Pendiente en la resolución. | Las imágenes originales fueron obtenidas el 23/10 mediante filtros y no son fotografías históricas de cada cierre. La web admite PNG/JPEG definitivos; su SVG es solo una exportación del tablero local actual. |
| E1: roles + backlog + enlace o documento | La resolución y la vista Scrum contienen los componentes. | [Plan actualizado](PLAN-SCRUM.md), PDF original y enlace vigente a Jira TE. |
| E2: dos fichas, capturas, backlog final y demo de diez minutos | Preparado para completar; no se declara formalmente concluido. | Exportación HTML imprimible a PDF con pendientes explícitos y [guion de diez minutos](DEMO-10-MINUTOS.md). Completar evidencias, presentación y archivo `EDP4-TE-Grupo04.rar`. |

## Matriz de las quince historias

“Verificado en prototipo” describe el comportamiento probado aquí; no cambia Jira ni sustituye la aceptación del Product Owner. El estado del informe se conserva aunque una mejora futura tenga ahora una demostración adicional.

| HU / Jira / SP | Estado del informe | Hallazgo previo y corrección | Verificación y límite |
| --- | --- | --- | --- |
| HU-01 / TE-4 / 3 | Hecho · Sprint 1 | El registro era solo del navegador y aceptaba información inconsistente. Ahora el servidor rechaza campos vacíos, asigna cuenta propietaria y fecha, y guarda en SQLite. | Cliente registra un pedido propio; el agente lo encuentra en otra sesión. Validación de espacios tanto en dominio como en servidor. Datos de demostración. |
| HU-02 / TE-5 / 3 | Hecho · Sprint 1 | Había controles decorativos de orden y paginación. Se implementaron lista compartida, búsqueda, filtros, orden y detalle; se eliminó paginación ficticia. | El agente recarga la bandeja y atiende el caso creado por un cliente. El cliente consulta solo sus casos. |
| HU-03 / TE-6 / 3 | Hecho · Sprint 1 | “Usar” y “revisar” solo mostraban un aviso. Ahora una plantilla puede guardarse en un caso, con origen; las preguntas ambiguas crean solicitudes y se registra su decisión. | FAQ reconocidas sin IA; revisión persistida y visible para el agente. Las respuestas son de demostración, no condiciones oficiales de PedidosYa. |
| HU-04 / TE-7 / 3 | Hecho · Sprint 1 | La página exponía todos los registros al navegador. Se añadieron autenticación de demostración, roles resueltos en servidor y filtros por cuenta. | Camila no recibe ni consulta DG4-2026-1187; Sofía no recibe DG4-2026-1042. Tampoco se envían al cliente borradores internos o auditoría. SQLite y cuentas públicas académicas, sin integración externa. |
| HU-05 / TE-8 / 5 | Hecho · Sprint 2 | Categorías dependían de unas pocas ramas poco explícitas. Ahora el dominio calcula categoría, confianza heurística y derivación desde el texto. | Casos normales, sensibles, ambiguos, múltiples y desconocidos probados. **No es** el modelo ML del otro repositorio; sus errores se muestran en Evaluación. |
| HU-06 / TE-9 / 8 | Hecho · Sprint 2 | No existía un corpus legible; los fragmentos estaban copiados en cada caso. Se incorporaron doce documentos ficticios con 24 fragmentos y recuperación de hasta tres. | Se comprueba que cada fragmento exista en su documento y que la versión coincida. Selección local por reglas; no embeddings ni pgvector. |
| HU-07 / TE-10 / 8 | En curso · Sprint 2 | El borrador fijo no acreditaba IA. Se ofrece una alternativa extractiva con cliente, pedido, descripción y contexto, etiquetada como demostración. | **Pendiente de IA real y validación externa**, como en el informe. Sin claves, esta HU no puede marcarse aceptada por su criterio tecnológico. |
| HU-08 / TE-11 / 3 | Hecho · Sprint 2 | Se amplió la trazabilidad: documentos completos, fragmentos, plantillas FAQ y registro de pedido. | El agente puede abrir el documento citado; una respuesta directa identifica su plantilla o registro. |
| HU-09 / TE-12 / 3 | Hecho · Sprint 2 | Editar una respuesta aprobada no invalidaba correctamente la aprobación. Ahora toda edición crea una revisión y exige volver a aprobar. | Borrador editable, versión original y cambios conservados. No se admite texto vacío ni modificación de un envío ya registrado. |
| HU-10 / TE-13 / 3 | Hecho · Sprint 2 | La aprobación era una etiqueta sin flujo de envío verificable. Ahora se guarda el texto exacto, responsable, versión y fecha; el servidor exige una aprobación previamente guardada para ese texto. | Se rechazan envíos sin aprobación, con cambios o desde perfil cliente. El envío es **simulado**, sin correo, WhatsApp ni otra comunicación externa. |
| HU-11 / TE-14 / 5 | Hecho · Sprint 2 | El motivo de escalamiento era fijo. Ahora es obligatorio registrar motivo y responsable; una revisión especializada documenta la decisión antes de retomar la aprobación. | Se verifica derivación manual y automática, bloqueo antes de revisión y trazabilidad. |
| HU-12 / TE-15 / 5 | Por hacer · futuro | En la versión anterior HU-12 estaba incorrectamente asignada al reporte. Se corrigió a advertencia/abstención cuando no hay respaldo. | Sin evidencia no se propone una resolución; casos sensibles también se abstienen aunque haya documentos. La función adicional no altera el estado histórico del backlog. |
| HU-13 / TE-16 / 5 | Por hacer · futuro | Faltaba el historial completo. Se conservan original, valores anteriores y posteriores, versión, persona y fecha. | Dos ediciones consecutivas conservan ambos estados. La importación local antigua preserva el registro anterior y no confía en aprobaciones sin trazabilidad. |
| HU-14 / TE-17 / 8 | Por hacer · futuro | El reporte era fijo y “exportar” solo mostraba un aviso. Ahora calcula métricas de 38 casos etiquetados y descarga corpus, muestra, configuración y resultados. | Se prueba que cambiar etiquetas cambia métricas, que la huella cambia con la muestra y que no se inventan tiempos manuales. Comparación humana solo con casos emparejados medidos. Latencia local, sin red/LLM; respaldo extractivo no equivale a fidelidad semántica de IA. |
| HU-15 / TE-18 / 3 | Por hacer · futuro | El backlog anterior omitía esta historia. Se incorporó y cada referencia muestra documento, fragmento y versión. | Las versiones se contrastan con el corpus en pruebas. Documentos académicos ficticios, sin garantía de vigencia de políticas comerciales. |

## Pruebas ejecutadas

- **18 pruebas Node** del dominio: validación, recuperación, datos del caso, abstención, historial, aprobación/envío, escalamiento, plantillas, migración, métricas, muestra y totales del informe.
- **17 pruebas Python de servidor**: autenticación y sesión revocable, permisos, separación de pedidos y reclamos, escritura concurrente, bloqueo de aprobaciones/envíos indebidos, protección de borradores internos, revisión de FAQ y persistencia de artefactos.
- **8 pruebas de integración y navegador**: flujo entre cuentas cliente/agente, exportaciones y tiempos emparejados, quince tarjetas y ficha complementaria, teclado y diálogos, recarga/cierre de sesión, temas e integración Streamlit. La prueba de diseño incluye **80 combinaciones**: ocho vistas × cinco anchos (320, 390, 768, 1024 y 1440) × dos temas.

Las pruebas del servidor usan bases temporales. Las de navegador usan una instancia separada con SQLite de prueba. Los datos generados por esas pruebas no constituyen evidencia de trabajo del equipo, reuniones o aceptación formal de historias.

La comprobación automática de accesibilidad y las capturas actuales se guardan en [evidencias](evidencias/README.md). Una verificación automática no certifica por sí sola toda la accesibilidad.

## Resultados medidos y limitaciones

La muestra local de 38 casos sintéticos incluye paráfrasis no cubiertas y una negación. El clasificador del prototipo obtiene F1 macro **0,8840**, exactitud **0,8421** y Recall@3 **0,8571**. Son resultados del dominio local y **no** del modelo TF-IDF/regresión logística del informe, ni del desempeño de PedidosYa. La latencia se vuelve a medir en cada ejecución y no se fija como una constante.

La evaluación conserva sus errores: seis casos de clasificación no coinciden con la etiqueta esperada. Las reglas no comprenden lenguaje general ni manejan todas las negaciones. El respaldo extractivo comprueba coincidencia del texto citado con el corpus; no es una evaluación semántica independiente de un LLM. No se afirmaron tiempos manuales si no existen mediciones emparejadas.

Las cuentas son ficticias y públicas. No se aportan endurecimiento de producción, administración de usuarios ni pruebas del servicio externo. SQLite pertenece a esta instancia; un despliegue con disco efímero puede perder datos. Los respaldos son necesarios para conservar registros complementarios. El tablero y las fichas locales no actualizan Jira.

## Acciones pendientes del equipo

1. Documentar la semana de organización para completar las cinco semanas de la pauta.
2. Incorporar feedback real de las dos Sprint Review y confirmar mejoras/responsables de retrospectiva.
3. Añadir capturas definitivas o mantener claramente identificadas las preliminares, sin presentarlas como cierres históricos.
4. Verificar responsables en Jira y evidencias de participación de los seis integrantes.
5. Preparar la exposición y el empaquetado solicitado por el profesor.
6. Si se desea cerrar HU-07, ejecutar y documentar la validación del servicio real en la implementación correspondiente. Esta revisión conserva la elección actual de un prototipo sin claves.
