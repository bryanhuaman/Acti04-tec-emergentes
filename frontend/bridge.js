/* Protocolo oficial de componentes Streamlit; los permisos viven en Python. */
window.SmartClaimBridge = {
  hosted: window.parent !== window,
  revision: null,
  pending: false,
  ready() {
    window.parent.postMessage({isStreamlitMessage:true,type:'streamlit:componentReady',apiVersion:1},'*');
    window.parent.postMessage({isStreamlitMessage:true,type:'streamlit:setFrameHeight',height:900},'*');
  },
  logout() { window.parent.postMessage({isStreamlitMessage:true,type:'streamlit:setComponentValue',value:{requestId:crypto.randomUUID(),type:'logout'}},'*'); },
  refresh() {
    if(this.pending)return;
    this.pending=true;
    window.parent.postMessage({isStreamlitMessage:true,type:'streamlit:setComponentValue',value:{requestId:crypto.randomUUID(),type:'refresh'}},'*');
  },
  save(snapshot) {
    if(this.pending) throw new Error('Espera a que termine de guardarse el cambio anterior.');
    this.pending=true;
    document.getElementById('save-status').textContent='Guardando en el servidor…';
    window.parent.postMessage({isStreamlitMessage:true,type:'streamlit:setComponentValue',value:{requestId:crypto.randomUUID(),type:'save',expectedRevision:this.revision,state:snapshot}},'*');
  },
};
window.addEventListener('message',event=>{
  if(event.source!==window.parent||event.data?.type!=='streamlit:render')return;
  const args=event.data.args;
  if(!args?.snapshot)return;
  if(args.session_token) document.cookie='smartclaim_demo_session='+encodeURIComponent(args.session_token)+'; Path=/; Max-Age=86400; SameSite=Strict'+(location.protocol==='https:'?'; Secure':'');
  SmartClaimBridge.revision=args.snapshot.revision;
  SmartClaimBridge.pending=false;
  window.applyServerState?.(args.snapshot,args.error||'');
});
