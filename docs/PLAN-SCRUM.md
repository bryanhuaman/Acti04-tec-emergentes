# Delivery G4 · Plan Scrum y fichas de sprint

**Curso:** Tecnologías Emergentes · **Grupo:** 04  
**Producto:** sistema de atención asistida de reclamos para una empresa ficticia de reparto de alimentos.

## 1. Propósito del producto

Delivery G4 registra y clasifica reclamos, consulta información de pedidos y preguntas frecuentes, recupera políticas de atención y propone respuestas fundamentadas. Toda respuesta generada queda pendiente de revisión y aprobación de un agente humano. Los casos ambiguos, sensibles, sin evidencia o con confianza menor a **0,70** se escalan.

## 2. Roles del equipo

| Rol | Integrante | Responsabilidad principal |
| --- | --- | --- |
| Product Owner | Joseph Alexander Chombo Morocho | Prioriza historias, valida cumplimiento, clasifica reclamos y aprueba respuestas. |
| Scrum Master | Ariel Bryand Astete Vargas | Organiza reuniones, resuelve impedimentos, participa en escalamiento y evaluación. |
| Developer | Jhan Franco Pérez Ancieta | Registro de reclamos, bandeja de atención y edición de respuestas. |
| Developer | Adrian Alonso Rioja Ocaña | Integración de IA generativa para propuestas fundamentadas. |
| Developer | Gonzalo Mauricio Cáceres Murga | Recuperación de información y visualización de fuentes. |
| Developer | Bryan Adrian Huaman Chavez | Preguntas frecuentes y consulta de pedidos simulados. |

## 3. Product Backlog

| ID | Historia de usuario | Criterio de aceptación | Prioridad | SP | Sprint |
| --- | --- | --- | ---: | ---: | ---: |
| HU-01 | Como cliente, quiero registrar un reclamo para solicitar atención sobre un problema con mi pedido. | Guarda identificador, fecha y estado; rechaza formularios sin descripción. | 1 | 3 | 1 |
| HU-02 | Como agente, quiero consultar la bandeja de reclamos para identificar y atender casos pendientes. | Lista, filtra por estado y muestra el detalle. | 2 | 3 | 1 |
| HU-03 | Como cliente, quiero obtener respuestas a preguntas frecuentes. | Responde con una entrada validada; los casos ambiguos pasan a revisión. | 3 | 3 | 1 |
| HU-04 | Como cliente, quiero consultar el estado de mi pedido. | Un identificador válido muestra el estado; uno inexistente pide verificar el dato. | 4 | 3 | 1 |
| HU-05 | Como agente, quiero ver una categoría sugerida. | Muestra categoría y confianza; menos de 0,70, sensibles u «otros» pasan a revisión. | 5 | 5 | 1 |
| HU-06 | Como agente, quiero recuperar políticas relacionadas con el reclamo. | Recupera hasta tres fragmentos de los documentos e indica origen y versión. | 6 | 8 | 1 |
| HU-07 | Como agente, quiero recibir un borrador basado en las políticas. | Genera un borrador pendiente de revisión; sin evidencia no propone resolución. | 7 | 8 | 2 |
| HU-08 | Como agente, quiero inspeccionar las fuentes utilizadas. | Muestra fragmentos, documento y versión, o la plantilla que sustenta una respuesta directa. | 8 | 3 | 2 |
| HU-09 | Como agente, quiero editar el borrador y corregir la categoría. | Conserva propuesta original, cambios y responsable; no aprueba automáticamente. | 9 | 3 | 2 |
| HU-10 | Como agente, quiero aprobar la respuesta antes del envío. | Solo una respuesta aprobada puede enviarse; registra texto, fecha y responsable. | 10 | 3 | 2 |
| HU-11 | Como agente, quiero escalar casos sensibles o sin evidencia. | Registra motivo y responsable del escalamiento. | 11 | 5 | 2 |
| HU-12 | Como equipo, queremos consultar un reporte reproducible. | Presenta clasificación, recuperación, fidelidad, enrutamiento, abstención, latencia y comparación manual/asistida con muestras y configuración. | 12 | 5 | 2 |

**Total:** 52 puntos de historia · **Sprint 1:** 25 SP · **Sprint 2:** 27 SP.

## 4. Planificación

Antes de los sprints se contempla una semana de organización, del **26 de octubre al 1 de noviembre de 2026**, en horario de Lima.

### Sprint 1 · 02/11 al 16/11/2026 · 14 días

- **Objetivo:** permitir registrar y gestionar reclamos, consultar FAQ y pedidos y recuperar políticas con categoría sugerida.
- **Historias comprometidas:** HU-01 a HU-06 · **25 SP**.
- **Incremento esperado:** prototipo que registra reclamos, muestra su categoría, recupera información de atención e incluye consultas simples.
- **Terminadas:** por determinar al cierre.
- **No terminadas:** por determinar al cierre.
- **Review:** pendiente de demostración del incremento.
- **Retrospectiva:** pendiente de registro del equipo.
- **Mejora acordada:** pendiente de acuerdo.
- **Captura del tablero:** pendiente del cierre del sprint.

### Sprint 2 · 16/11 al 30/11/2026 · 14 días

- **Objetivo:** completar la atención asistida con borradores fundamentados, revisión humana y evaluación reproducible.
- **Historias comprometidas:** HU-07 a HU-12 · **27 SP**.
- **Incremento esperado:** respuestas sugeridas con fuentes, edición, aprobación, escalamiento y reporte de evaluación.
- **Terminadas:** por determinar al cierre.
- **No terminadas:** por determinar al cierre.
- **Review:** pendiente de demostración del incremento.
- **Retrospectiva:** pendiente de registro del equipo.
- **Mejora acordada:** pendiente de acuerdo.
- **Captura del tablero:** pendiente del cierre del sprint.

## 5. Seguimiento

El tablero utiliza las columnas **Por hacer**, **En curso** y **Hecho**. Las historias se identifican en Jira como **DGTE-1 a DGTE-12**. Cada tarjeta contiene historia, criterio de aceptación, prioridad, estimación y sprint. Cada sprint inicia con planificación, mantiene seguimientos de 10 a 15 minutos al menos dos veces por semana y termina con review y retrospectiva.

El prototipo de `index.html` representa este flujo con una bandeja operativa, fuentes, métricas, fichas de sprint y un tablero inicial.
