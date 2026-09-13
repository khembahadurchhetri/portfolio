const $=selector=>document.querySelector(selector);
const form=$('#editor'); let csrf='', posts=[], uploading=false, dirty=false;
const status=message=>{$('#status').textContent=message;$('#editor-status').textContent=message;};
function markDirty(){dirty=true;status('Unsaved changes. Click Save entry to store your text and attachment.');}
form.addEventListener('input',markDirty);
window.addEventListener('beforeunload',event=>{if(dirty||uploading){event.preventDefault();event.returnValue='';}});
async function api(route,options={}) {
  if(window.JournalBackend?.enabled){
    try{return await window.JournalBackend.request(route,options);}
    catch(error){if(error.status===401)showLogin();throw error;}
  }
  let response;
  try {response=await fetch(route,{...options,headers:{...(options.body && !(options.body instanceof File)?{'Content-Type':'application/json'}:{}),'X-CSRF-Token':csrf,...options.headers}});}
  catch {throw new Error('Cannot reach the server. Keep this page open, run npm start, then try again.');}
  if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('The journal backend is unavailable at this address. Use http://localhost:3000/admin after running npm start.');
  const result=await response.json();
  if(!response.ok){if(response.status===401)showLogin();throw new Error(result.error||'Request failed.');}return result;
}
function showLogin(){csrf='';posts=[];if(!dirty)form.reset();$('#entries').replaceChildren();$('#media-preview').replaceChildren();$('#workspace').hidden=true;$('#logout').hidden=true;$('#login-panel').hidden=false;}
function showWorkspace(){$('#workspace').hidden=false;$('#logout').hidden=false;$('#login-panel').hidden=true;}
function list(){const filter=$('#visibility-filter').value, category=$('#category-filter').value;$('#entries').replaceChildren();for(const post of posts.filter(p=>(filter==='all'||p.visibility===filter)&&(!category||p.category===category))){const button=document.createElement('button');button.type='button';button.className='entry-button';button.textContent=post.title;button.setAttribute('aria-current',String(form.elements.id.value===post.id));const meta=document.createElement('small');meta.textContent=`${post.category} · ${post.visibility}${post.sample?' · Sample':''}`;button.append(meta);button.addEventListener('click',()=>edit(post));$('#entries').append(button);}if(!$('#entries').children.length)$('#entries').textContent='No entries yet.';}
async function refresh(){
  posts=await api('/api/admin/posts');
  const select=$('#category-filter'), selected=select.value;
  select.replaceChildren();
  for(const category of ['',...new Set(['Books','Movies','Notes','Photos & videos','Vlogs','Quotes','News',...posts.map(post=>post.category)])]){
    const option=document.createElement('option');option.value=category;option.textContent=category||'All categories';select.append(option);
  }
  select.value=[...select.options].some(option=>option.value===selected)?selected:'';
  list();
}
async function preview(url){$('#media-preview').replaceChildren();if(!url)return;try{if(window.JournalBackend?.enabled)url=await window.JournalBackend.media(url,true);const r=await fetch(url,{method:'HEAD'});if(!r.ok)throw new Error();const media=document.createElement(r.headers.get('content-type')?.startsWith('video/')?'video':'img');media.src=url;if(media.tagName==='VIDEO')media.controls=true;else media.alt='Entry attachment';$('#media-preview').append(media);}catch{status('Attachment preview unavailable.');}}
function edit(post){if(uploading)return;if(dirty&&!confirm('Discard unsaved changes and open another entry?'))return;dirty=false;form.reset();for(const key of ['id','title','category','text','url','image','visibility'])form.elements[key].value=post?.[key]|| (key==='visibility'?'draft':'');form.elements.sample.checked=post?.sample===true;$('#editor-heading').textContent=post?'Edit entry':'New entry';$('#delete').hidden=!post;preview(post?.image);list();}
$('#login').addEventListener('submit',async event=>{event.preventDefault();const button=event.submitter;button.disabled=true;try{const data=Object.fromEntries(new FormData(event.target));const result=await api('/api/login',{method:'POST',body:JSON.stringify(data)});csrf=result.csrf;event.target.reset();showWorkspace();await refresh();if(!dirty)edit(null);status(dirty?'Signed in again. Your unsaved text is still here; click Save entry.':'Signed in. Your private entries are available here.');}catch(error){status(error.message);}finally{button.disabled=false;}});
$('#logout').addEventListener('click',async()=>{if(uploading)return;if(dirty&&!confirm('Discard unsaved changes and sign out?'))return;try{await api('/api/logout',{method:'POST'});dirty=false;showLogin();status('Signed out.');}catch(error){status(error.message);}});
$('#new').addEventListener('click',()=>edit(null));$('#visibility-filter').addEventListener('change',list);$('#category-filter').addEventListener('change',list);
$('#upload').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;if(file.size>20*1024*1024){status('Choose a file smaller than 20 MB.');event.target.value='';return;}uploading=true;$('#save').disabled=true;$('#delete').disabled=true;$('#remove-media').disabled=true;status('Uploading attachment…');try{const result=await api('/api/admin/media',{method:'POST',body:file,headers:{'Content-Type':'application/octet-stream'}});form.elements.image.value=result.url;dirty=true;await preview(result.url);status('Attachment uploaded privately. Save the entry to attach it.');}catch(error){status(error.message);}finally{uploading=false;$('#save').disabled=false;$('#delete').disabled=false;$('#remove-media').disabled=false;event.target.value='';}});
$('#remove-media').addEventListener('click',()=>{form.elements.image.value='';markDirty();preview('');});
form.addEventListener('submit',async event=>{event.preventDefault();if(uploading)return;$('#save').disabled=true;try{const data=Object.fromEntries(new FormData(form));data.sample=form.elements.sample.checked;const id=data.id;const saved=await api('/api/admin/posts'+(id?'/'+id:''),{method:id?'PUT':'POST',body:JSON.stringify(data)});dirty=false;edit(saved);status(`Saved as ${saved.visibility}.`);try{await refresh();}catch{status('Entry saved, but the list could not refresh. Reload when the connection returns.');}}catch(error){status(error.message);}finally{$('#save').disabled=false;}});
$('#delete').addEventListener('click',async()=>{const id=form.elements.id.value;if(!id||!confirm('Delete this entry permanently?'))return;try{await api('/api/admin/posts/'+id,{method:'DELETE'});dirty=false;await refresh();edit(null);status('Entry deleted.');}catch(error){status(error.message);}});
(async()=>{try{const result=await api('/api/session');csrf=result.csrf;showWorkspace();await refresh();edit(null);}catch{showLogin();}})();
