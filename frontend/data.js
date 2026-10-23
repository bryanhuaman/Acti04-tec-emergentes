(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.DeliveryData=data;})(globalThis,function(){
return {
  "sourceDocs": [
    {
      "id": "POL-01",
      "title": "Política de entregas",
      "version": "v2.4",
      "date": "12 oct 2026",
      "description": "Plazos, incidencias y compensaciones por demora.",
      "type": "Operaciones",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-01-F01",
          "text": "Si un pedido supera el plazo prometido, verificar su estado antes de informar una nueva estimación de entrega."
        },
        {
          "id": "POL-01-F02",
          "text": "Comunicar únicamente el estado y el tiempo que figuren en el registro del pedido; no inventar horarios."
        }
      ]
    },
    {
      "id": "POL-02",
      "title": "Pedido incompleto",
      "version": "v1.8",
      "date": "08 oct 2026",
      "description": "Procedimiento para faltantes y productos equivocados.",
      "type": "Calidad",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-02-F01",
          "text": "Ante productos faltantes o equivocados, contrastar el comprobante con el detalle del pedido y registrar los artículos afectados."
        },
        {
          "id": "POL-02-F02",
          "text": "La reposición o devolución por faltantes requiere validación del agente; no confirmar una compensación antes de esa revisión."
        }
      ]
    },
    {
      "id": "POL-03",
      "title": "Reembolsos y devoluciones",
      "version": "v3.1",
      "date": "30 sep 2026",
      "description": "Criterios de devolución, abonos y medios de pago.",
      "type": "Finanzas",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-03-F01",
          "text": "Para una solicitud de reembolso, registrar el motivo y verificar el pago y la incidencia antes de autorizar una devolución."
        },
        {
          "id": "POL-03-F02",
          "text": "Una devolución aprobada se gestiona al medio de pago original; el agente debe verificar el plazo aplicable antes de comunicarlo."
        }
      ]
    },
    {
      "id": "POL-04",
      "title": "Incidentes de pago",
      "version": "v1.5",
      "date": "28 sep 2026",
      "description": "Cobros duplicados, pagos rechazados y conciliaciones.",
      "type": "Pagos",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-04-F01",
          "text": "Ante un posible cobro duplicado, verificar las autorizaciones y el estado de ambas transacciones antes de pedir una reversa."
        },
        {
          "id": "POL-04-F02",
          "text": "Un pago rechazado o no reconocido requiere comprobación del registro de pagos; no solicitar claves bancarias ni el número completo de tarjeta."
        }
      ]
    },
    {
      "id": "POL-05",
      "title": "Atención de pedidos sensibles",
      "version": "v2.0",
      "date": "21 sep 2026",
      "description": "Escalamiento y lenguaje para casos de alto impacto.",
      "type": "Atención",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-05-F01",
          "text": "Los reportes de alergia, intoxicación, lesiones, amenazas o riesgo para la salud requieren atención especializada inmediata."
        },
        {
          "id": "POL-05-F02",
          "text": "Los casos sensibles no deben recibir una resolución automática ni una garantía de seguridad del producto."
        }
      ]
    },
    {
      "id": "POL-06",
      "title": "Código de conducta",
      "version": "v1.3",
      "date": "14 sep 2026",
      "description": "Estándares de comunicación y registro de casos.",
      "type": "Atención",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-06-F01",
          "text": "La respuesta debe ser respetuosa, describir hechos verificados y distinguir una solicitud registrada de una solución ya autorizada."
        },
        {
          "id": "POL-06-F02",
          "text": "Conservar en el historial la propuesta, sus cambios y la identidad declarada de la persona que la revisó."
        }
      ]
    },
    {
      "id": "POL-07",
      "title": "Compensaciones",
      "version": "v2.2",
      "date": "08 sep 2026",
      "description": "Montos y condiciones para compensar incidencias.",
      "type": "Finanzas",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-07-F01",
          "text": "Las compensaciones por demoras o fallos se evalúan según la incidencia verificada y requieren autorización humana."
        },
        {
          "id": "POL-07-F02",
          "text": "No prometer importes, cupones ni devoluciones sin una autorización registrada y una política aplicable."
        }
      ]
    },
    {
      "id": "POL-08",
      "title": "Zonas de cobertura",
      "version": "v1.7",
      "date": "02 sep 2026",
      "description": "Cobertura operativa, horarios y restricciones.",
      "type": "Operaciones",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-08-F01",
          "text": "Para consultas de cobertura, comprobar la zona y la dirección del pedido antes de confirmar disponibilidad."
        },
        {
          "id": "POL-08-F02",
          "text": "Un cambio de dirección necesita revisión del estado operativo; no asegurar que sea posible durante una entrega."
        }
      ]
    },
    {
      "id": "POL-09",
      "title": "Pedidos cancelados",
      "version": "v1.9",
      "date": "25 ago 2026",
      "description": "Causales, comunicación y recuperación de pagos.",
      "type": "Operaciones",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-09-F01",
          "text": "Si un pedido cancelado registra un cobro, verificar su estado de pago y solicitar la revisión de devolución."
        },
        {
          "id": "POL-09-F02",
          "text": "La cancelación y el reembolso son procesos distintos; informar al cliente del estado confirmado de cada uno."
        }
      ]
    },
    {
      "id": "POL-10",
      "title": "Evidencia fotográfica",
      "version": "v1.2",
      "date": "18 ago 2026",
      "description": "Requisitos para reportar calidad y faltantes.",
      "type": "Calidad",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-10-F01",
          "text": "Los productos dañados o en malas condiciones requieren registrar evidencia de la incidencia y una evaluación antes de proponer reposición."
        },
        {
          "id": "POL-10-F02",
          "text": "Solicitar solo la evidencia necesaria del producto; evitar fotografías que expongan información personal innecesaria."
        }
      ]
    },
    {
      "id": "POL-11",
      "title": "Escalamiento especializado",
      "version": "v1.1",
      "date": "10 ago 2026",
      "description": "Rutas de revisión para casos sensibles o ambiguos.",
      "type": "Atención",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-11-F01",
          "text": "Derivar a revisión especializada los casos sensibles, ambiguos, con varias incidencias o sin evidencia suficiente."
        },
        {
          "id": "POL-11-F02",
          "text": "Registrar el motivo de la derivación, la fecha y la persona responsable; la revisión debe quedar documentada antes de retomar la respuesta."
        }
      ]
    },
    {
      "id": "POL-12",
      "title": "Protección de datos",
      "version": "v2.0",
      "date": "02 ago 2026",
      "description": "Tratamiento seguro de datos de clientes y pedidos.",
      "type": "Legal",
      "fictional": true,
      "fragments": [
        {
          "id": "POL-12-F01",
          "text": "No solicitar contraseñas, códigos de verificación ni datos bancarios completos para atender un reclamo."
        },
        {
          "id": "POL-12-F02",
          "text": "Las solicitudes sobre filtración de datos o acceso indebido deben escalarse y limitarse a información necesaria para la revisión."
        }
      ]
    }
  ],
  "faqItems": [
    {
      "id": "FAQ-01",
      "question": "¿Cuánto demora la entrega de mi pedido?",
      "answer": "El tiempo estimado aparece en el detalle del pedido y puede variar según la zona y la demanda. Si el pedido supera el plazo prometido, revisaremos el caso y aplicaremos la política de compensación correspondiente.",
      "tag": "Entrega",
      "source": "POL-01 · Política de entregas · v2.4"
    },
    {
      "id": "FAQ-02",
      "question": "¿Cómo puedo solicitar un reembolso?",
      "answer": "Registra un reclamo indicando el número de pedido y el motivo. El agente validará la incidencia y, si corresponde, solicitará el reembolso al medio de pago original dentro de los plazos de la política.",
      "tag": "Pagos",
      "source": "POL-03 · Reembolsos y devoluciones · v3.1"
    },
    {
      "id": "FAQ-03",
      "question": "¿Qué hago si mi pedido llegó incompleto?",
      "answer": "Conserva el comprobante y registra los productos faltantes en el reclamo. El equipo verificará el detalle del pedido y ofrecerá reposición o devolución según el caso.",
      "tag": "Calidad",
      "source": "POL-02 · Pedido incompleto · v1.8"
    },
    {
      "id": "FAQ-04",
      "question": "¿Puedo cambiar la dirección de entrega?",
      "answer": null,
      "tag": "Revisión requerida",
      "source": "Sin evidencia suficiente"
    },
    {
      "id": "FAQ-05",
      "question": "¿Qué pasa si veo un cobro duplicado?",
      "answer": "Verificaremos la autorización y el estado de la transacción. Si se confirma el cobro duplicado, se solicitará la reversa siguiendo el procedimiento para incidentes de pago.",
      "tag": "Pagos",
      "source": "POL-04 · Incidentes de pago · v1.5"
    }
  ],
  "orders": {},
  "defaultClaims": [],
  "stories": [
    [
      "HU-01",
      "Como cliente, quiero registrar un reclamo, para solicitar atención cuando tenga un inconveniente con mi pedido.",
      "El reclamo se guarda con identificador y estado; no se permiten descripciones vacías.",
      1,
      3,
      1
    ],
    [
      "HU-02",
      "Como agente, quiero consultar una bandeja de reclamos, para identificar los casos pendientes de atención.",
      "El agente visualiza la lista y puede ingresar al detalle de un reclamo.",
      2,
      3,
      1
    ],
    [
      "HU-03",
      "Como cliente, quiero resolver consultas básicas, para obtener orientación rápida sobre el servicio.",
      "El sistema responde preguntas frecuentes reconocidas y permite consultar información general.",
      3,
      3,
      1
    ],
    [
      "HU-04",
      "Como cliente, quiero consultar el estado de mi pedido, para conocer su situación actual.",
      "El sistema muestra el estado de un pedido registrado sin exponer pedidos de otros usuarios.",
      4,
      3,
      1
    ],
    [
      "HU-05",
      "Como agente, quiero visualizar la categoría sugerida de un reclamo, para organizar mejor su atención.",
      "Se presenta una categoría calculada a partir del texto del reclamo.",
      5,
      5,
      2
    ],
    [
      "HU-06",
      "Como agente, quiero recuperar políticas relacionadas con el reclamo, para sustentar mi respuesta.",
      "Se muestran fragmentos documentales relacionados con el caso.",
      6,
      8,
      2
    ],
    [
      "HU-07",
      "Como agente, quiero recibir un borrador generado por IA, para preparar una respuesta con mayor rapidez.",
      "Se produce un borrador que utiliza los datos del caso y el contexto recuperado; falta validación externa.",
      7,
      8,
      2
    ],
    [
      "HU-08",
      "Como agente, quiero consultar las fuentes utilizadas, para verificar la información del borrador.",
      "Se visualizan las referencias o fragmentos de la documentación consultada.",
      8,
      3,
      2
    ],
    [
      "HU-09",
      "Como agente, quiero editar el borrador, para adecuar la respuesta a las particularidades del reclamo.",
      "El texto puede modificarse antes de su aprobación.",
      9,
      3,
      2
    ],
    [
      "HU-10",
      "Como agente, quiero aprobar una respuesta, para mantener el control de la comunicación al cliente.",
      "El agente dispone de una acción de revisión y aprobación del contenido propuesto.",
      10,
      3,
      2
    ],
    [
      "HU-11",
      "Como agente, quiero escalar un reclamo, para solicitar revisión cuando el caso requiera atención especializada.",
      "El caso puede derivarse mediante una acción de escalamiento.",
      11,
      5,
      2
    ],
    [
      "HU-12",
      "Como agente, quiero que el sistema advierta cuando no encuentre respaldo suficiente, para evitar respuestas sin fundamento.",
      "Ante falta de información, se solicita revisión en lugar de generar una respuesta afirmativa.",
      12,
      5,
      0
    ],
    [
      "HU-13",
      "Como supervisor, quiero consultar el historial de cambios de cada respuesta, para revisar las decisiones tomadas.",
      "Se registran versiones, modificaciones y responsable de la edición.",
      13,
      5,
      0
    ],
    [
      "HU-14",
      "Como equipo, queremos medir la calidad de clasificación y recuperación, para detectar oportunidades de mejora.",
      "Se genera un reporte con muestra, F1 macro, Recall@3 y tiempos de respuesta.",
      14,
      8,
      0
    ],
    [
      "HU-15",
      "Como agente, quiero identificar con claridad la política y su versión, para comprobar que la información esté actualizada.",
      "Cada referencia muestra el documento y la versión consultada.",
      15,
      3,
      0
    ]
  ],
  "members": [
    {
      "name": "Joseph Alexander Chombo Morocho",
      "role": "Product Owner",
      "responsibility": "Prioriza el Product Backlog y valida los criterios de aceptación."
    },
    {
      "name": "Ariel Bryand Astete Vargas",
      "role": "Scrum Master",
      "responsibility": "Facilita Scrum, coordina el seguimiento y ayuda a resolver impedimentos."
    },
    {
      "name": "Jhan Franco Pérez Ancieta",
      "role": "Developer",
      "responsibility": "Frontend, backend, integración de componentes y pruebas técnicas."
    },
    {
      "name": "Adrian Alonso Rioja Ocaña",
      "role": "Developer",
      "responsibility": "Integración de IA generativa y pruebas del servicio externo de generación."
    },
    {
      "name": "Gonzalo Mauricio Cáceres Murga",
      "role": "Developer",
      "responsibility": "Clasificación de reclamos, Machine Learning y evaluación de resultados."
    },
    {
      "name": "Bryan Adrian Huaman Chavez",
      "role": "Developer",
      "responsibility": "Consultas de pedidos, recuperación documental, RAG y fuentes."
    }
  ],
  "owners": [
    "Jhan Franco Pérez Ancieta",
    "Jhan Franco Pérez Ancieta",
    "Bryan Adrian Huaman Chavez",
    "Bryan Adrian Huaman Chavez",
    "Gonzalo Mauricio Cáceres Murga",
    "Bryan Adrian Huaman Chavez",
    "Adrian Alonso Rioja Ocaña",
    "Bryan Adrian Huaman Chavez",
    "Jhan Franco Pérez Ancieta",
    "Joseph Alexander Chombo Morocho",
    "Ariel Bryand Astete Vargas",
    "Adrian Alonso Rioja Ocaña",
    "Jhan Franco Pérez Ancieta",
    "Gonzalo Mauricio Cáceres Murga",
    "Bryan Adrian Huaman Chavez"
  ],
  "jira": "https://jhanfranco.atlassian.net/jira/software/projects/TE/boards/37/backlog",
  "sprints": [
    {
      "id": 1,
      "name": "Sistema base",
      "start": "2026-09-25",
      "end": "2026-10-09",
      "closed": "2026-10-23",
      "goal": "Permitir que el cliente consulte pedidos y registre reclamos, y que el agente pueda revisarlos."
    },
    {
      "id": 2,
      "name": "Inteligencia artificial y revisión",
      "start": "2026-10-09",
      "end": "2026-10-23",
      "closed": "2026-10-23",
      "goal": "Integrar clasificación automática, recuperación documental, borradores con IA y revisión humana."
    }
  ],
  "evaluationCases": [
    {
      "id": "EV-01",
      "description": "El repartidor lleva una hora de retraso.",
      "expectedCategory": "Demora en entrega",
      "expectedDocuments": [
        "POL-01",
        "POL-07"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-02",
      "description": "Mi pedido llega tarde y todavía lo estoy esperando.",
      "expectedCategory": "Demora en entrega",
      "expectedDocuments": [
        "POL-01",
        "POL-07"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-03",
      "description": "Mi comida no llega desde hace 40 minutos.",
      "expectedCategory": "Demora en entrega",
      "expectedDocuments": [
        "POL-01",
        "POL-07"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-04",
      "description": "Faltan dos bebidas del pedido.",
      "expectedCategory": "Pedido incompleto",
      "expectedDocuments": [
        "POL-02"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-05",
      "description": "Recibí productos equivocados.",
      "expectedCategory": "Pedido incompleto",
      "expectedDocuments": [
        "POL-02"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-06",
      "description": "El restaurante olvidó incluir mi postre.",
      "expectedCategory": "Pedido incompleto",
      "expectedDocuments": [
        "POL-02"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-07",
      "description": "Tengo un cobro duplicado en mi tarjeta.",
      "expectedCategory": "Cobro duplicado",
      "expectedDocuments": [
        "POL-04"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-08",
      "description": "Me cobraron dos veces la misma orden.",
      "expectedCategory": "Cobro duplicado",
      "expectedDocuments": [
        "POL-04"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-09",
      "description": "Aparecen dos cargos por el pedido.",
      "expectedCategory": "Cobro duplicado",
      "expectedDocuments": [
        "POL-04"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-10",
      "description": "Mi pago fue rechazado.",
      "expectedCategory": "Incidente de pago",
      "expectedDocuments": [
        "POL-04"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-11",
      "description": "El cargo de mi tarjeta no es reconocido.",
      "expectedCategory": "Incidente de pago",
      "expectedDocuments": [
        "POL-04"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-12",
      "description": "El pedido figura entregado pero no lo recibí.",
      "expectedCategory": "Pedido no recibido",
      "expectedDocuments": [
        "POL-01",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-13",
      "description": "Nunca recibí la entrega que aparece como entregada.",
      "expectedCategory": "Pedido no recibido",
      "expectedDocuments": [
        "POL-01",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-14",
      "description": "La caja llegó dañada y la comida en malas condiciones.",
      "expectedCategory": "Producto en mal estado",
      "expectedDocuments": [
        "POL-10",
        "POL-03"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-15",
      "description": "El envase está roto.",
      "expectedCategory": "Producto en mal estado",
      "expectedDocuments": [
        "POL-10",
        "POL-03"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-16",
      "description": "¿Cuál es el estado de mi pedido?",
      "expectedCategory": "Seguimiento de pedido",
      "expectedDocuments": [
        "POL-01"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-17",
      "description": "Necesito seguimiento de la orden.",
      "expectedCategory": "Seguimiento de pedido",
      "expectedDocuments": [
        "POL-01"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-18",
      "description": "Quiero solicitar un reembolso.",
      "expectedCategory": "Reembolso o devolución",
      "expectedDocuments": [
        "POL-03"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-19",
      "description": "Deseo devolver mi compra.",
      "expectedCategory": "Reembolso o devolución",
      "expectedDocuments": [
        "POL-03"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-20",
      "description": "Se canceló mi pedido pero me cobraron.",
      "expectedCategory": "Pago de pedido cancelado",
      "expectedDocuments": [
        "POL-09",
        "POL-03"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-21",
      "description": "Mi orden fue cancelada.",
      "expectedCategory": "Pago de pedido cancelado",
      "expectedDocuments": [
        "POL-09"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-22",
      "description": "¿Tienen cobertura en mi zona?",
      "expectedCategory": "Cobertura o dirección",
      "expectedDocuments": [
        "POL-08"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-23",
      "description": "Quiero cambiar la dirección del pedido.",
      "expectedCategory": "Cobertura o dirección",
      "expectedDocuments": [
        "POL-08"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-24",
      "description": "La comida me causó una alergia.",
      "expectedCategory": "Caso sensible",
      "expectedDocuments": [
        "POL-05",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-25",
      "description": "Tengo una intoxicación después de comer.",
      "expectedCategory": "Caso sensible",
      "expectedDocuments": [
        "POL-05",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-26",
      "description": "Han filtrado mis datos personales.",
      "expectedCategory": "Caso sensible",
      "expectedDocuments": [
        "POL-12",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-27",
      "description": "El repartidor me amenazó.",
      "expectedCategory": "Caso sensible",
      "expectedDocuments": [
        "POL-05",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-28",
      "description": "Faltan bebidas y además tengo un cobro duplicado.",
      "expectedCategory": "Varias incidencias",
      "expectedDocuments": [
        "POL-02",
        "POL-04",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-29",
      "description": "La comida llegó dañada y con dos cargos en tarjeta.",
      "expectedCategory": "Varias incidencias",
      "expectedDocuments": [
        "POL-10",
        "POL-04",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-30",
      "description": "Tal vez falta algo, pero no estoy seguro.",
      "expectedCategory": "Pedido incompleto",
      "expectedDocuments": [
        "POL-02",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-31",
      "description": "Necesito ayuda con algo extraño.",
      "expectedCategory": "Otros",
      "expectedDocuments": [],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-32",
      "description": "Quiero felicitar al equipo.",
      "expectedCategory": "Otros",
      "expectedDocuments": [],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-33",
      "description": "La bolsa solo traía la mitad de lo que pagué.",
      "expectedCategory": "Pedido incompleto",
      "expectedDocuments": [
        "POL-02"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-34",
      "description": "Veo el mismo débito repetido en el banco.",
      "expectedCategory": "Cobro duplicado",
      "expectedDocuments": [
        "POL-04"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-35",
      "description": "Quiero recuperar el importe que aboné.",
      "expectedCategory": "Reembolso o devolución",
      "expectedDocuments": [
        "POL-03"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-36",
      "description": "El almuerzo estaba podrido.",
      "expectedCategory": "Producto en mal estado",
      "expectedDocuments": [
        "POL-10",
        "POL-03"
      ],
      "expectedRoute": "review",
      "expectedAbstention": false
    },
    {
      "id": "EV-37",
      "description": "Mi hijo se enfermó con la comida.",
      "expectedCategory": "Caso sensible",
      "expectedDocuments": [
        "POL-05",
        "POL-11"
      ],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    },
    {
      "id": "EV-38",
      "description": "La entrega fue normal, no hubo retraso.",
      "expectedCategory": "Otros",
      "expectedDocuments": [],
      "expectedRoute": "escalate",
      "expectedAbstention": true
    }
  ],
  "corpusVersion": "corpus-academico-v1",
  "datasetVersion": "casos-sinteticos-v1",
  "reportedStatus": {
    "HU-01": "Hecho",
    "HU-02": "Hecho",
    "HU-03": "Hecho",
    "HU-04": "Hecho",
    "HU-05": "Hecho",
    "HU-06": "Hecho",
    "HU-07": "En curso",
    "HU-08": "Hecho",
    "HU-09": "Hecho",
    "HU-10": "Hecho",
    "HU-11": "Hecho",
    "HU-12": "Por hacer",
    "HU-13": "Por hacer",
    "HU-14": "Por hacer",
    "HU-15": "Por hacer"
  },
  "reportReference": {
    "name": "Grupo 4 - Actividad 04.pdf",
    "project": "SmartClaim AI",
    "officialRepository": "https://github.com/Jhanfranco07/Clasificador-de-Reclamos",
    "checkedCommit": "86691f7da69554ab5173afd5cb0bd5464d5169e4",
    "training": {
      "examples": 105,
      "validation": 27,
      "accuracy": 0.7407,
      "macroF1": 0.73
    },
    "note": "Resultados citados en el informe y contrastados con training_report.txt; no son mediciones de esta demostración."
  }
};
});
