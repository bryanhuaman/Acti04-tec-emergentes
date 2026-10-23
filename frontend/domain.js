/* Reglas del prototipo: módulo puro, compartido por la web y las pruebas. */
(function(root, factory) {
  const data = typeof module === 'object' && module.exports ? require('./data.js') : root.DeliveryData;
  const api = factory(data);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DeliveryDomain = api;
})(globalThis, function(data) {
  'use strict';
  const config = Object.freeze({version:'reglas-v2-extractivo-v2', threshold:.70, maxFragments:3, corpus:data.corpusVersion, dataset:data.datasetVersion, generativeAI:false});
  const copy = value => JSON.parse(JSON.stringify(value));
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const now = () => new Date().toISOString();
  const rules = [
    {category:'Demora en entrega', pattern:/demora|tarde|retras|no llega|esperando/, documents:['POL-01','POL-07']},
    {category:'Pedido incompleto', pattern:/falt|incomplet|olvid|equivoc/, documents:['POL-02']},
    {category:'Cobro duplicado', pattern:/duplicad|dos veces|dos cargos|doble (cobro|cargo)/, documents:['POL-04']},
    {category:'Incidente de pago', pattern:/pago.{0,15}rechaz|cargo.{0,25}no.{0,5}reconoc|pago.{0,15}no.{0,5}reconoc/, documents:['POL-04']},
    {category:'Pedido no recibido', pattern:/no.{0,10}recibi|nunca recibi/, documents:['POL-01','POL-11']},
    {category:'Producto en mal estado', pattern:/malas condiciones|mal estado|danad|envase.{0,15}roto|fria|derram/, documents:['POL-10','POL-03']},
    {category:'Seguimiento de pedido', pattern:/estado.{0,15}(pedido|orden)|seguimiento|novedades/, documents:['POL-01']},
    {category:'Reembolso o devolución', pattern:/reembolso|devolucion|devolver/, documents:['POL-03']},
    {category:'Pago de pedido cancelado', pattern:/cancel/, documents:['POL-09','POL-03']},
    {category:'Cobertura o dirección', pattern:/cobertura|direccion|mi zona/, documents:['POL-08']},
  ];
  function classify(description) {
    const text = normalize(description);
    const sensitive = /alerg|intoxic|lesion|amenaz|riesgo.{0,15}salud|hospital|filtra.{0,15}datos|acceso indebido|contrasena|fraude/.test(text);
    const ambiguous = /tal vez|no (estoy|estamos) segur|no se si|quizas|confus|ambigu/.test(text);
    let matches = rules.filter(rule => rule.pattern.test(text));
    // Estas expresiones describen una sola incidencia, aunque mencionen otro trámite.
    if (matches.some(r=>r.category==='Pedido no recibido')) matches=matches.filter(r=>!['Demora en entrega','Seguimiento de pedido'].includes(r.category));
    if (matches.some(r=>r.category==='Pago de pedido cancelado')) matches=matches.filter(r=>r.category!=='Reembolso o devolución');
    if (matches.some(r=>r.category==='Cobro duplicado')) matches=matches.filter(r=>r.category!=='Incidente de pago');
    const multiple = matches.length > 1;
    const category = sensitive ? 'Caso sensible' : multiple ? 'Varias incidencias' : matches[0]?.category || 'Otros';
    const confidence = sensitive ? .95 : multiple ? .66 : category==='Otros' ? .40 : ambiguous ? .62 : .90;
    const reasons=[];
    if (sensitive) reasons.push('Caso sensible: requiere atención especializada');
    if (multiple) reasons.push('Varias incidencias: '+matches.map(r=>r.category).join(', '));
    if (ambiguous) reasons.push('Descripción ambigua');
    if (confidence<config.threshold) reasons.push('Confianza heurística menor a 0,70');
    if (category==='Otros') reasons.push('Categoría sin una regla específica');
    if (category==='Pedido no recibido') reasons.push('Entrega disputada: requiere revisión especializada');
    let documents = sensitive ? [/filtra|datos|contrasena|acceso indebido/.test(text)?'POL-12':'POL-05','POL-11'] : [...new Set(matches.flatMap(r=>r.documents))];
    if (multiple) documents=[...new Set([matches[0].documents[0],matches[1].documents[0],'POL-11'])];
    else if (ambiguous) documents=[...new Set([...documents,'POL-11'])];
    return {category,confidence,route:reasons.length?'escalate':'review',reasons,documents,sensitive,multiple,ambiguous};
  }
  function retrieve(description, classification=classify(description)) {
    // Primero cubre documentos pertinentes distintos; después añade fragmentos.
    const candidates = classification.documents.map(id=>data.sourceDocs.find(d=>d.id===id)).filter(Boolean);
    const result=[];
    for (let index=0;index<2;index++) for (const doc of candidates) {
      const fragment=doc.fragments[index];
      if(fragment && result.length<config.maxFragments) result.push({id:fragment.id,documentId:doc.id,title:doc.title,version:doc.version,text:fragment.text,ref:`${doc.id} · ${fragment.id}`});
    }
    return result;
  }
  function draftFromEvidence(customer, evidence, route='review', context={}) {
    if (!evidence.length || route==='escalate') return '';
    const greeting=String(customer||'cliente').trim().split(/\s+/)[0];
    return `Hola ${greeting}, registramos tu consulta${context.order?' sobre el pedido '+context.order:''}.${context.description?' Nos indicas: «'+context.description+'».':''} Estas son las indicaciones aplicables, pendientes de validación por un agente:\n\n`+
      evidence.map(e=>`${e.text} [${e.id}]`).join('\n\n')+
      '\n\nLa solución concreta se confirmará después de revisar los datos del pedido. Esta propuesta no autoriza una devolución ni confirma hechos no verificados.';
  }
  function analyze(description,customer='cliente',order='') {
    const classification=classify(description);const evidence=retrieve(description,classification);
    return {...classification,evidence,draft:draftFromEvidence(customer,evidence,classification.route,{description,order})};
  }
  function requireActor(actor) { if(!String(actor||'').trim()) throw new Error('Indica la persona responsable.'); return String(actor).trim(); }
  function audit(claim,type,actor,details={}) { claim.audit ||= [];claim.audit.unshift({type,actor:requireActor(actor),at:now(),...copy(details)}); }
  function createClaim(input,existing=[],timestamp=now()) {
    const customer=String(input.customer||'').trim(), order=String(input.order||'').trim(), description=String(input.description||'').trim();
    if(!customer||!order||!description) throw new Error('Completa nombre, pedido y descripción; no se admiten campos vacíos.');
    const analysis=analyze(description,customer,order);
    const number=Math.max(240,...existing.map(c=>Number(c.id?.replace('DG4-',''))||0))+1;
    const claim={schemaVersion:2,id:input.id||`DG4-${String(number).padStart(4,'0')}`,customer,order,description,channel:input.channel||'Web',createdAt:timestamp,...analysis,
      originalCategory:analysis.category,originalDraft:analysis.draft,revision:0,approval:null,sent:null,revisions:[],audit:[],status:analysis.route==='escalate'?'Escalado':'Pendiente de revisión',avatar:input.avatar||'av-blue',demo:Boolean(input.demo)};
    if(analysis.route==='escalate') claim.escalation={reason:analysis.reasons.join('; '),actor:'Reglas del prototipo',at:timestamp};
    audit(claim,'registro','Reglas del prototipo',{at:timestamp,text:`Registro y clasificación: ${analysis.category}`,reason:analysis.reasons.join('; ')});
    return claim;
  }
  function normalizeClaim(value) {
    if(value.needsAnalysis) return createClaim(value, [], value.createdAt || now());
    if(value.schemaVersion===2) return copy(value);
    // Conserva datos antiguos, pero una aprobación sin texto/fecha verificables no habilita un envío.
    const analysis=analyze(value.description||'',value.customer,value.order);
    const claim={...copy(value),...analysis,schemaVersion:2,legacy:copy(value),createdAt:value.createdAt||null,importedAt:now(),originalCategory:value.originalCategory||value.category,
      originalDraft:value.originalDraft ?? value.draft ?? '',revision:0,approval:null,sent:null,revisions:[],audit:Array.isArray(value.audit)?copy(value.audit):[],status:analysis.route==='escalate'?'Escalado':'Pendiente de revisión'};
    if(analysis.route==='escalate') claim.escalation={reason:analysis.reasons.join('; '),actor:'Reglas del prototipo',at:claim.importedAt};
    audit(claim,'migracion','Reglas del prototipo',{text:'Datos anteriores conservados en el registro de importación. Borrador regenerado con fuentes; se requiere una nueva aprobación.'});
    return claim;
  }
  function canReview(claim) { return !claim.sent && (!claim.escalation || Boolean(claim.specialistReview)); }
  function canApprove(claim) { return canReview(claim) && Boolean(claim.draft?.trim()); }
  function canSend(claim) { return !claim.sent && Boolean(claim.approval) && claim.approval.text===claim.draft && claim.approval.revision===claim.revision && canReview(claim); }
  function editClaim(claim,changes,actor) {
    requireActor(actor);if(claim.sent) throw new Error('Una respuesta enviada no se puede modificar.');
    const before={category:claim.category,draft:claim.draft};const after={...before,...changes};
    if(typeof after.draft!=='string'||(Object.hasOwn(changes,'draft')&&!after.draft.trim())) throw new Error('El borrador no puede quedar vacío.');
    if(!String(after.category||'').trim()) throw new Error('La categoría no puede quedar vacía.');
    if(after.category===before.category&&after.draft===before.draft) return claim;
    claim.category=after.category;claim.draft=after.draft;claim.revision++;
    claim.revisions.push({before,after:copy(after),actor,at:now(),revision:claim.revision});
    claim.approval=null;claim.status=claim.escalation&&!claim.specialistReview?'Escalado':'Pendiente de revisión';
    audit(claim,'edicion',actor,{before,after,text:'Cambios guardados; aprobación anterior invalidada.'});return claim;
  }
  function approve(claim,actor) {
    requireActor(actor);if(!canApprove(claim)) throw new Error('Se necesita un borrador y resolver la revisión especializada antes de aprobar.');
    claim.approval={text:claim.draft,at:now(),actor,revision:claim.revision};claim.status='Aprobado';audit(claim,'aprobacion',actor,{text:claim.draft,revision:claim.revision});return claim;
  }
  function send(claim,actor) {
    requireActor(actor);if(!canSend(claim)) throw new Error('Solo se puede enviar el texto exacto de una aprobación vigente.');
    claim.sent={text:claim.draft,at:now(),actor,approval:copy(claim.approval),channel:claim.channel,simulated:true};claim.status='Enviado';audit(claim,'envio_simulado',actor,{text:claim.draft});return claim;
  }
  function escalate(claim,reason,actor) {
    requireActor(actor);if(claim.sent) throw new Error('El envío ya está registrado.');
    if(String(reason||'').trim().length<8) throw new Error('Explica el motivo del escalamiento (al menos 8 caracteres).');
    claim.escalation={reason:String(reason).trim(),actor,at:now()};claim.specialistReview=null;claim.approval=null;claim.status='Escalado';
    audit(claim,'escalamiento',actor,{reason:claim.escalation.reason,text:'Caso derivado a revisión especializada.'});return claim;
  }
  function specialistReview(claim,reason,actor) {
    requireActor(actor);if(!claim.escalation||claim.sent) throw new Error('Este caso no requiere una revisión especializada pendiente.');
    if(String(reason||'').trim().length<8) throw new Error('Registra la decisión de revisión (al menos 8 caracteres).');
    claim.specialistReview={reason:String(reason).trim(),actor,at:now()};claim.approval=null;
    if(!claim.draft&&claim.evidence.length) {claim.draft=draftFromEvidence(claim.customer,claim.evidence,'review',{description:claim.description,order:claim.order});claim.originalDraft=claim.originalDraft||claim.draft;}
    claim.status='Pendiente de revisión';audit(claim,'revision_especializada',actor,{reason,text:'Revisión documentada; aún se requiere aprobar la respuesta.'});return claim;
  }
  function useFaq(claim,faq,actor) {
    if(!faq?.answer) throw new Error('Esta pregunta requiere revisión y no tiene una respuesta validada.');
    editClaim(claim,{draft:faq.answer},actor);
    claim.directSource={type:'Plantilla validada de demostración',id:faq.id,version:'v1',question:faq.question,source:faq.source,text:faq.answer};
    audit(claim,'plantilla',actor,{text:`Borrador basado en ${faq.id}; no aprobado automáticamente.`});return claim;
  }
  function fingerprint(value) { let hash=2166136261;for(const ch of JSON.stringify(value)) hash=Math.imul(hash^ch.charCodeAt(0),16777619);return (hash>>>0).toString(16).padStart(8,'0'); }
  function mean(values) { return values.length?values.reduce((a,b)=>a+b,0)/values.length:null; }
  function timingSummary(measurements) {
    const valid=measurements.filter(m=>['manual','assisted'].includes(m.mode)&&Number.isFinite(m.durationMs)&&m.durationMs>0&&m.response?.trim());
    const ids=[...new Set(valid.map(m=>m.sampleId))];const pairs=ids.map(id=>({sampleId:id,manual:mean(valid.filter(m=>m.sampleId===id&&m.mode==='manual').map(m=>m.durationMs)),assisted:mean(valid.filter(m=>m.sampleId===id&&m.mode==='assisted').map(m=>m.durationMs))})).filter(p=>p.manual!==null&&p.assisted!==null);
    const manual=mean(pairs.map(p=>p.manual)),assisted=mean(pairs.map(p=>p.assisted));
    return {measurements:valid,manualCount:valid.filter(m=>m.mode==='manual').length,assistedCount:valid.filter(m=>m.mode==='assisted').length,pairs,manualMeanMs:manual,assistedMeanMs:assisted,reduction:manual?1-assisted/manual:null};
  }
  function evaluate(cases=data.evaluationCases,measurements=[],clock=()=>performance.now()) {
    const results=cases.map(sample=>{
      const start=clock(),prediction=analyze(sample.description,'cliente de prueba'),latencyMs=Math.max(0,clock()-start);
      const found=[...new Set(prediction.evidence.map(e=>e.documentId))];
      const recalled=sample.expectedDocuments.filter(id=>found.includes(id)).length;
      const supported=prediction.evidence.filter(e=>prediction.draft.includes(e.text)&&prediction.draft.includes(`[${e.id}]`)).length;
      return {...copy(sample),prediction,latencyMs,recall:sample.expectedDocuments.length?recalled/sample.expectedDocuments.length:null,supportedFragments:prediction.draft?supported:0,usedFragments:prediction.draft?prediction.evidence.length:0};
    });
    const categories=[...new Set(cases.map(c=>c.expectedCategory).concat(results.map(r=>r.prediction.category)))];
    const perCategory=categories.map(category=>{
      const tp=results.filter(r=>r.expectedCategory===category&&r.prediction.category===category).length,fp=results.filter(r=>r.expectedCategory!==category&&r.prediction.category===category).length,fn=results.filter(r=>r.expectedCategory===category&&r.prediction.category!==category).length;
      const precision=tp+fp?tp/(tp+fp):0,recall=tp+fn?tp/(tp+fn):0;
      return {category,tp,fp,fn,precision,recall,f1:precision+recall?2*precision*recall/(precision+recall):0};
    });
    const abstention=results.filter(r=>r.expectedAbstention),latencies=results.map(r=>r.latencyMs).sort((a,b)=>a-b),used=results.reduce((s,r)=>s+r.usedFragments,0),supported=results.reduce((s,r)=>s+r.supportedFragments,0);
    return {generatedAt:now(),config:copy(config),fingerprint:fingerprint({config,documents:data.sourceDocs,cases}),dataset:{version:data.datasetVersion,kind:'Casos sintéticos etiquetados; no representan desempeño en producción',count:cases.length},
      metrics:{macroF1:mean(perCategory.map(c=>c.f1)),classificationAccuracy:results.length?results.filter(r=>r.expectedCategory===r.prediction.category).length/results.length:null,recallAt3:mean(results.filter(r=>r.recall!==null).map(r=>r.recall)),extractiveFidelity:used?supported/used:null,routingAccuracy:results.length?results.filter(r=>r.expectedRoute===r.prediction.route).length/results.length:null,abstentionAccuracy:abstention.length?abstention.filter(r=>!r.prediction.draft).length/abstention.length:null,latencyP50Ms:latencies.length?latencies[Math.ceil(latencies.length*.50)-1]:null,latencyP95Ms:latencies.length?latencies[Math.ceil(latencies.length*.95)-1]:null},
      denominators:{classification:results.length,retrieval:results.filter(r=>r.recall!==null).length,extractiveFragments:used,routing:results.length,abstention:abstention.length,latency:latencies.length},perCategory,results,comparison:timingSummary(measurements)};
  }
  function initialScrum() {
    return {version:2,stories:Object.fromEntries(data.stories.map((s,i)=>[s[0],{status:data.reportedStatus[s[0]],owner:data.owners[i]}])),sprints:Object.fromEntries(data.sprints.map(s=>[s.id,{mode:'Según informe',review:'Pendiente de documentar la demostración y los comentarios de Sprint Review.',retroWorked:s.id===1?'El incremento integra las funciones principales de atención y consulta. Acuerdos pendientes de documentar.':'El flujo incorpora revisión humana de las respuestas. Acuerdos pendientes de documentar.',improvement:s.id===1?'Propuesta: integrar clasificación de reclamos y recuperación documental.':'Propuesta: completar y documentar la validación externa de generación de borradores.',improvementOwner:'Pendiente de confirmar',capture:null,updatedAt:null}])),history:[]};
  }
  function sprintSummary(scrum,id) {
    const selected=data.stories.filter(s=>s[5]===Number(id));
    const done=selected.filter(s=>scrum.stories[s[0]]?.status==='Hecho');
    return {committed:selected.map(s=>s[0]),done:done.map(s=>s[0]),unfinished:selected.filter(s=>!done.includes(s)).map(s=>s[0]),points:selected.reduce((a,s)=>a+s[4],0),donePoints:done.reduce((a,s)=>a+s[4],0)};
  }
  return {config,copy,normalize,classify,retrieve,analyze,draftFromEvidence,createClaim,normalizeClaim,canReview,canApprove,canSend,editClaim,approve,send,escalate,specialistReview,useFaq,fingerprint,timingSummary,evaluate,initialScrum,sprintSummary};
});
