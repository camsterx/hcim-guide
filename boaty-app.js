import {sections, episodes, sourceUrl, sourceRevision} from './data/b0aty-index.js';
import {notes} from './data/b0aty-notes.js';
import {wikiEnrichment} from './data/wiki-enrichment.js';
// Full Wiki-derived section text is fetched from a revision-pinned, third-party CC BY-NC-SA mirror.
// It is not bundled or republished in this repository.
const guideDataUrls=[
 './data/b0aty-guide.json',
 'https://raw.githubusercontent.com/nandobrazil/hcim-guide-plugin/dcff9863f11f260c58077ab49b1b26545d820335/src/main/resources/guide.json',
 'https://cdn.jsdelivr.net/gh/nandobrazil/hcim-guide-plugin@dcff9863f11f260c58077ab49b1b26545d820335/src/main/resources/guide.json'
];

const root=document.getElementById('app');
const cfg=window.HCIM_CONFIG||{};
const supabase=window.supabase?.createClient && cfg.supabaseUrl && cfg.supabasePublishableKey
?window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}}):null;
const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const save=(key,data)=>{try{localStorage.setItem(key,JSON.stringify(data));}catch{}};
const guestKey='rhr-b0aty-guest-v1';
const userKey=id=>'rhr-b0aty-user-'+id+'-v1';
const pendingKey=id=>'rhr-b0aty-pending-'+id+'-v1';
const selectionKey='rhr-b0aty-selection-v1';
const stepID=(s,i)=>s.id+'-step-'+String(i+1).padStart(3,'0');
const extrasBefore=id=>wikiEnrichment.inserts[id]||[];
const idsForBank=s=>Array.from({length:s.sourceStepCount},(_,i)=>stepID(s,i)).flatMap(id=>[...extrasBefore(id).map(x=>x.id),id]);
const allIDs=new Set(sections.flatMap(s=>[s.id,...idsForBank(s),...(notes[s.id]?.steps||[]).map(n=>s.id+'-'+n[0])]));
const stepsFor=s=>sourceSections?.[s.section-1]?.steps||[];
const sourceCount=()=>sections.reduce((n,s)=>n+idsForBank(s).length,0);
const sourceCompleted=()=>sections.reduce((n,s)=>n+idsForBank(s).filter(id=>completed.has(id)).length,0);
let sourceSections=null,sourceStatus='Loading the complete route…',wikiExpanded=true;
const resourceOpen=new Set();

const bankCompleted=s=>idsForBank(s).every(id=>completed.has(id));
const bankDone=()=>sections.filter(bankCompleted).length;
const stepDone=s=>notes[s.id]?.steps.filter(n=>completed.has(s.id+'-'+n[0])).length||0;
const firstPending=()=>sections.findIndex(s=>!bankCompleted(s));
const sectionHash=()=>{const m=location.hash.match(/^#\/bank\/(\d+)$/);return m?Math.min(sections.length-1,Math.max(0,Number(m[1]))):null};
let current=sectionHash()??load(selectionKey,5);
if(!Number.isInteger(current)||current<0||current>=sections.length)current=0;
let completed=new Set(load(guestKey,[]).filter(x=>allIDs.has(x)));
let queued={},session=null,cloudLoaded=false,syncing=false,syncStatus='Local progress only';
let modal=false,message='',activeSearch='',onlyRemaining=false,authToken=0;
const key=()=>session?userKey(session.user.id):guestKey;
const syncKey=()=>pendingKey(session.user.id);
const writeLocal=()=>save(key(),[...completed]);
const sourceAnchor=s=>sourceUrl+(s.title.toLowerCase().startsWith('bank ')?'#'+encodeURIComponent(s.title.replace(/ /g,'_')):'');
const currentSection=()=>sections[current];
function announce(t){message=t;render();}
function routeTo(i){
 current=Math.max(0,Math.min(sections.length-1,i));
 save(selectionKey,current);
 if(location.hash!=='#/bank/'+current){location.hash='#/bank/'+current;}else render();
}
function sourceLink(s,label){
 return '<a target="_blank" rel="noopener noreferrer" href="'+escapeHTML(sourceAnchor(s))+'">'+(label||'Read B0aty’s full instructions')+' ↗</a>';
}
function sidebarHTML(){
 const grouped=episodes.map((ep,i)=>{
  const list=sections.map((s,j)=>({...s,sectionIndex:j})).filter(s=>s.episode===ep);
  const done=list.filter(s=>bankCompleted(s)).length;
  const active=list.some(s=>s.sectionIndex===current);
  return '<div class="episode '+(active?'open':'')+'"><button class="episode-head" data-episode="'+i+'"><span>EP '+(i+1)+'</span><strong>'+escapeHTML(ep.replace(/^Episode \d+ ?[-–]? ?/,''))+'</strong><small>'+done+'/'+list.length+'</small></button><div class="banks">'+list.map(s=>{
   let selected=s.sectionIndex===current;
   return '<button class="bank-link '+(selected?'selected':'')+'" data-bank="'+s.sectionIndex+'"><span class="bank-dot '+(completed.has(s.id)?'done':'')+'">'+(completed.has(s.id)?'✓':String(s.sectionIndex+1).padStart(2,'0'))+'</span><span>'+escapeHTML(s.title)+'</span></button>';
  }).join('')+'</div></div>';
 }).join('');
 return '<aside class="sidebar"><a class="brand" href="#/bank/0"><span class="brand-emblem">♜</span><span><strong>RED HELM ROAD</strong><small>B0ATY HCIM V3 TRACKER</small></span></a><div class="sidebar-top">THE FULL ROUTE <small>'+bankDone()+' / '+sections.length+' banks</small></div>'+grouped+'<div class="sidebar-bottom"><a href="./original.html">Previous guide archive ↗</a><a target="_blank" rel="noopener noreferrer" href="'+sourceUrl+'">Original OSRS Wiki guide ↗</a></div></aside>';
}
function stepTextLabel(text){
 const clean=String(text).replace(/https?:\/\/[^\s<>"']+/g,'').replace(/\s*[-–]\s*(?:Safespot guide|Video guide)[^\n]*$/i,'').trim();
 return clean||String(text);
}
function urlsIn(text){
 return [...String(text).matchAll(/https?:\/\/[^\s<>"']+/g)].map(m=>m[0].replace(/[),.;]+$/,'')).filter(x=>/^https?:\/\//i.test(x));
}
function videoEmbed(url){
 try{
  const u=new URL(url),host=u.hostname.toLowerCase();let id='';
  if(host==='youtu.be'||host==='www.youtu.be')id=u.pathname.split('/')[1];
  else if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host))id=u.searchParams.get('v')||(u.pathname.startsWith('/embed/')?u.pathname.split('/')[2]:'');
  if(!/^[A-Za-z0-9_-]{11}$/.test(id))return '';
  const rawTime=u.searchParams.get('t')||u.searchParams.get('start')||'0';
  const seconds=/^\d+$/.test(rawTime)?Number(rawTime):(/^\d+m\d+s$/.test(rawTime)?Number(rawTime.split('m')[0])*60+Number(rawTime.split('m')[1].replace('s','')):0);
  return '<div class="step-video"><iframe loading="lazy" title="Video guide" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen src="https://www.youtube-nocookie.com/embed/'+id+'?start='+Math.max(0,seconds)+'"></iframe></div>';
 }catch{return ''}
}
function resourceHTML(step){
 const added=wikiEnrichment.notes[step.id]||[],imgs=wikiEnrichment.images[step.id]||[];
 const links=[...new Set([step.text,...added].flatMap(urlsIn))];
 if(!added.length&&!imgs.length&&!links.length)return '';
 const descriptions=added.map(t=>'<p>'+escapeHTML(t.replace(/https?:\/\/[^\s<>"']+/g,'').trim())+'</p>').join('');
 const urls=links.map(url=>'<a href="'+escapeHTML(url)+'" target="_blank" rel="noopener noreferrer">Open linked guide ↗</a>'+videoEmbed(url)).join('');
 const images=imgs.map(file=>'<a target="_blank" rel="noopener noreferrer" href="https://jbbuckler.github.io/B0aty-HCIM-Guide-/assets/'+encodeURIComponent(file)+'"><img loading="lazy" alt="Guide reference image" src="https://jbbuckler.github.io/B0aty-HCIM-Guide-/assets/'+encodeURIComponent(file)+'"></a>').join('');
 return '<details class="step-resources" data-resource-id="'+escapeHTML(step.id)+'" '+(resourceOpen.has(step.id)?'open':'')+'><summary>Wiki notes, images & videos <span aria-hidden="true">▾</span></summary><div class="step-resource-content">'+descriptions+urls+images+'</div></details>';
}
function wikiHTML(s){
 const list=stepsFor(s),loading=!sourceSections,inconsistent=!loading&&s.sourceStepCount!==list.length;
 const items=idsForBank(s),count=items.filter(id=>completed.has(id)).length;
 let body='';
 if(loading)body='<div class="source-only"><p>'+escapeHTML(sourceStatus)+'</p><button class="primary" data-action="reload-source">Retry loading instructions</button></div>';
 else if(inconsistent)body='<div class="risk-note">The route source changed. Its step counts need checking before displaying it, so saved ticks never attach to the wrong task.</div>';
 else {
  let number=0;
  const rows=list.flatMap((st,i)=>{
   const id=stepID(s,i);
   return [...extrasBefore(id).map(x=>({id:x.id,text:x.text})),{id,text:wikiEnrichment.overrides[id]||st.text}];
  });
  body='<div class="wiki-steps">'+rows.map(st=>{
   const done=completed.has(st.id),danger=/stronghold of security|taverley dungeon|wilderness|wintertodt|aggressive|catablepon|spider max|if you take .*damage|boss|zulrah|demon|fighting|kill a bear|raid|inferno|warlord|witches house/i.test(st.text);
   const label=stepTextLabel(st.text);
   return '<div class="wiki-step '+(done?'done':'')+'"><button type="button" class="wiki-step-check" aria-label="'+(done?'Untick ':'Tick ')+escapeHTML(label)+'" aria-pressed="'+done+'" data-toggle="'+escapeHTML(st.id)+'"><span class="check" aria-hidden="true">'+(done?'✓':'')+'</span></button><div class="wiki-step-body"><span class="wiki-step-number">'+String(++number).padStart(2,'0')+(danger?' · ⚠ FOCUSED PLAY':'')+'</span><span class="wiki-step-text '+(done?'step-done':'')+'">'+escapeHTML(label)+'</span>'+resourceHTML(st)+'</div></div>';
  }).join('')+'</div>';
 }
 return '<details id="wiki-notes" class="wiki-collapsible" '+(wikiExpanded?'open':'')+'><summary><span><strong>Complete route checklist</strong><small>'+count+' / '+items.length+' steps ticked · Tap the square to complete a step</small></span><span class="chevron">▾</span></summary><div class="wiki-body">'+body+'<div class="wiki-credit">Source: <a href="'+escapeHTML(sourceUrl)+'" target="_blank" rel="noopener noreferrer">OSRS Wiki HCIM route</a> and its contributors. Additional reference images from a community adaptation. Wiki-derived text is attributed under <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 3.0</a>. This is a snapshot and may differ from the latest Wiki changes.</div></div></details>';
}

async function loadWikiData(){
 sourceStatus='Loading the complete route…';render();
 try{
  let json=null,lastError=null;
  for(const url of guideDataUrls){
   try{
    const response=await fetch(url,{mode:'cors'});
    if(!response.ok)throw Error('HTTP '+response.status);
    json=await response.json();
    break;
   }catch(error){lastError=error;}
  }
  if(!json)throw lastError||Error('All instruction sources are unavailable');
  if(!Array.isArray(json.sections)||json.sections.length!==sections.length)throw Error('Section count changed; verification needed');
  if(sections.some((s,i)=>json.sections[i].steps?.length!==s.sourceStepCount))throw Error('Source section count changed; saved step IDs protected');
  sourceSections=json.sections;sourceStatus='Instructions loaded';render();
 }catch(error){sourceStatus='Could not load the mirrored Wiki instructions: '+error.message+'. You can retry without losing existing progress.';render();}
}
function viewHTML(){
 const s=currentSection(),i=current;
 const count=bankDone(),rate=(count/sections.length*100).toFixed(1);
 const list=sections.map((s,j)=>({s,j})).filter(x=>!onlyRemaining||!bankCompleted(x.s));
 const stepCount=sourceCount(),stepCountDone=sourceCompleted();
 const progress='<div class="progress-bar"><div style="width:'+rate+'%"></div></div>';
 const options=episodes.map(ep=>'<optgroup label="'+escapeHTML(ep)+'">'+list.filter(x=>x.s.episode===ep).map(x=>'<option value="'+x.j+'" '+(x.j===current?'selected':'')+'>'+escapeHTML(x.s.title)+' · #'+(x.j+1)+'</option>').join('')+'</optgroup>').join('');
 return '<div class="topbar"><button class="menu" data-action="menu" aria-label="Toggle chapter menu">☰</button><div class="brand-mini">RED HELM ROAD <span>· B0ATY HCIM V3</span></div><button class="cloud" data-action="account">'+(session?'☁ '+escapeHTML(syncStatus):'◯ '+(supabase?'Sign in to save':'Offline save'))+'</button></div>'+
 '<div class="intro"><div class="eyebrow">CADVYN · HARDCORE IRONMAN</div><h1>Follow the route. <span>Keep the helm.</span></h1><p>Follow B0aty HCIM V3 here: every step has its own tickbox, and the full Wiki-derived notes live in a collapsible section. Additional HCIM warnings help you decide when to stop for work.</p>'+
 '<div class="metrics"><div><b>'+count+' <small>/ '+sections.length+'</small></b><label>Banks completed</label></div><div><b>'+stepCountDone+' <small>/ '+stepCount+'</small></b><label>Individual steps ticked</label></div><div><b>'+episodes.length+'</b><label>Episodes indexed</label></div></div>'+progress+'</div>'+
 '<div class="notice">🛡️ <span><b>HCIM first:</b> Save risky quests, Stronghold trips, Wintertodt and PvM for uninterrupted periods. This adaptation tracks the Wiki; never treat a risk badge as a complete safety assessment.</span></div>'+
 '<div class="jump"><label for="bank-select">Jump to a bank / section</label><select id="bank-select">'+options+'</select><label class="hide"><input id="hide-completed" type="checkbox" '+(onlyRemaining?'checked':'')+'> Hide completed</label></div>'+
 '<div class="chapter"><div class="chapter-top"><span>'+escapeHTML(s.episode)+' · '+(i+1)+' of '+sections.length+'</span><span>'+(s.requiresAttention?'⚠ Attention required':'Route checkpoint')+'</span></div><h2>'+escapeHTML(s.title)+'</h2><p><strong>'+idsForBank(s).length+' individually tickable instructions</strong> are inside the expandable section below. Check each one as you complete it — no need to leave this site.</p>'+
 '<div class="video-links">'+sourceLink(s,'Original OSRS Wiki steps')+(s.youtubeId?' <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v='+encodeURIComponent(s.youtubeId)+'">Episode video ↗</a>':'')+'</div></div>'+
 wikiHTML(s)+
 '<div class="complete-panel '+(completed.has(s.id)?'finished':'')+'"><div><h3>'+(completed.has(s.id)?'Bank completed':'Finished every step in this bank?')+'</h3><p>'+(completed.has(s.id)?'Bank and steps are complete.':'Tick the steps individually above, or use this shortcut to mark them all complete.')+'</p></div><button data-toggle="'+s.id+'" class="primary">'+(completed.has(s.id)?'✓ Completed · Undo':'Mark all steps complete ✓')+'</button></div>'+
 '<div class="pager"><button data-bank="'+(i-1)+'" '+(i<=0?'disabled':'')+'>← Previous</button><button data-action="resume">Next unfinished</button><button data-bank="'+(i+1)+'" '+(i>=sections.length-1?'disabled':'')+'>Next →</button></div>'+
 '<div class="bottom-links"><a href="./original.html">View previous 99 Firemaking route</a><span>Source index: '+escapeHTML(sourceRevision)+' · Unofficial fan project, no affiliation with Jagex</span></div>';
}
function modalHTML(){
 if(!modal)return '';
 return '<div class="overlay"><div class="dialog"><button class="close" data-action="close">×</button><small class="eyebrow">CLOUD PROGRESS</small><h2>'+(session?'Account connected':'Sign in to sync')+'</h2>'+
 (session?'<p>Signed in as <strong>'+escapeHTML(session.user.email)+'</strong>.</p><p>Status: '+escapeHTML(syncStatus)+'</p><div class="buttons"><button data-action="sync">Sync now</button><button data-action="merge">Import guest progress from this browser</button><button data-action="signout">Sign out</button></div>'
 :!supabase?'<p>Supabase could not load. Check your internet connection.</p>'
 :'<p>Enter your email address for a secure sign-in link. Use the same account on all devices.</p><form id="login"><input type="email" name="email" required placeholder="Email address"><button type="submit" class="primary">Send sign-in link</button></form>')+
 '<hr><p>Download a private progress backup at any time.</p><div class="buttons"><button data-action="export">Download backup</button><label class="upload" for="import-file">Import JSON backup</label><input type="file" hidden id="import-file" accept="application/json,.json"></div></div></div>';
}
function render(){
 if(!root)return;
 root.innerHTML='<div class="layout">'+sidebarHTML()+'<main class="main">'+(message?'<div class="flash">'+escapeHTML(message)+'<button data-action="dismiss">×</button></div>':'')+viewHTML()+'</main></div>'+modalHTML();
}
function toggle(id){
 if(!allIDs.has(id))return;
 const bank=sections.find(s=>s.id===id);
 const state=bank?!bankCompleted(bank):!completed.has(id);
 const update=(key,value)=>{value?completed.add(key):completed.delete(key);if(session)queued[key]=value;};
 if(bank){
  update(id,state);
  for(const step of idsForBank(bank))update(step,state);
 }else{
  update(id,state);
  const owner=sections.find(s=>idsForBank(s).includes(id));
  if(owner){
   const allDone=bankCompleted(owner);
   update(owner.id,allDone);
  }
 }
 writeLocal();if(session){save(syncKey(),queued);syncStatus='Waiting to sync';if(cloudLoaded)void sync();}
 render();
}
let cloudCounter=0;
async function loadSession(newSession){
 const task=++cloudCounter,id=newSession?.user?.id;
 if(id && session?.user?.id===id && cloudLoaded)return;
 session=newSession;cloudLoaded=false;
 if(!id){queued={};completed=new Set(load(guestKey,[]).filter(x=>allIDs.has(x)));syncStatus='Local progress only';render();return;}
 completed=new Set(load(userKey(id),[]).filter(x=>allIDs.has(x)));
 queued=load(pendingKey(id),{});
 syncStatus='Loading saved progress…';render();
 let rows=[],failed=null;
 for(let offset=0;offset<10000;offset+=1000){
  const page=await supabase.from('step_progress').select('step_id,is_completed').eq('user_id',id).order('step_id',{ascending:true}).range(offset,offset+999);
  if(page.error){failed=page.error;break;}
  rows.push(...(page.data||[]));
  if((page.data||[]).length<1000)break;
 }
 if(task!==cloudCounter||session?.user?.id!==id)return;
 if(failed){syncStatus='Offline copy retained (cloud read failed)';render();return;}
 const server=new Set(rows.filter(x=>x.is_completed&&allIDs.has(x.step_id)).map(x=>x.step_id));
 for(const [step,value] of Object.entries(queued)){if(!allIDs.has(step))continue;value?server.add(step):server.delete(step);}
 completed=server;writeLocal();cloudLoaded=true;syncStatus='All changes synced';render();
 if(Object.keys(queued).length)void sync();
}
async function sync(){
 if(!session||!cloudLoaded||syncing)return;
 syncing=true;const id=session.user.id;syncStatus='Syncing…';render();
 while(session?.user?.id===id && Object.keys(queued).length){
  const batch=Object.entries(queued).slice(0,80);
  try {
   const now=new Date().toISOString();
   const {error}=await supabase.from('step_progress').upsert(batch.map(([step,value])=>({user_id:id,step_id:step,is_completed:value,updated_at:now})),{onConflict:'user_id,step_id'});
   if(error)throw error;
   if(session?.user?.id!==id)break;
   for(const [step,value] of batch)if(queued[step]===value)delete queued[step];
   save(pendingKey(id),queued);
  }catch(e){syncing=false;syncStatus='Upload failed — changes retained locally';render();return;}
 }
 syncing=false;if(session?.user?.id===id){syncStatus='All changes synced';render();}
}
async function startAuth(){
 if(!supabase)return;
 try{
 const {data,error}=await supabase.auth.getSession();if(error)throw error;await loadSession(data.session);
 supabase.auth.onAuthStateChange((event,s)=>{if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))Promise.resolve().then(()=>loadSession(s)).catch(e=>announce('Account error: '+e.message));});
 }catch(e){syncStatus='Sign-in unavailable';render();}
}
function backup(){
 const obj={guide:'B0aty HCIM V3 route',version:1,completed:[...completed],exportedAt:new Date().toISOString()};
 const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='cadvyn-hcim-b0aty-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function merge(ids){
 let n=0;for(const id of ids){if(!allIDs.has(id)||completed.has(id))continue;completed.add(id);n++;if(session)queued[id]=true;}
 writeLocal();if(session){save(syncKey(),queued);if(cloudLoaded)void sync();}
 announce(n+' additional checkpoint(s) imported.');
}
document.addEventListener('click',async e=>{
 const checkbox=e.target.closest('[data-toggle]');if(checkbox){toggle(checkbox.dataset.toggle);return;}
 const go=e.target.closest('[data-bank]');if(go){routeTo(Number(go.dataset.bank));return;}
 const ep=e.target.closest('[data-episode]');if(ep){const i=Number(ep.dataset.episode),j=sections.findIndex(x=>x.episode===episodes[i]);routeTo(j);return;}
 const btn=e.target.closest('[data-action]');if(!btn)return;
 try{
  const a=btn.dataset.action;
  if(a==='menu'){document.body.classList.toggle('nav-open');return;}
  if(a==='account'){modal=true;render();}
  if(a==='close'){modal=false;render();}
  if(a==='dismiss'){message='';render();}
  if(a==='resume'){const i=firstPending();routeTo(i===-1?sections.length-1:i);}
  if(a==='signout'){await supabase.auth.signOut();modal=false;await loadSession(null);}
  if(a==='sync'){if(cloudLoaded)await sync();else await loadSession(session);modal=false;render();}
  if(a==='merge')merge(load(guestKey,[]));
  if(a==='export')backup();
  if(a==='reload-source')void loadWikiData();
 }catch(err){announce('Action failed: '+err.message);}
});
document.addEventListener('toggle',e=>{if(e.target.id==='wiki-notes')wikiExpanded=e.target.open;const id=e.target.dataset?.resourceId;if(id){e.target.open?resourceOpen.add(id):resourceOpen.delete(id);}},true);
document.addEventListener('change',async e=>{
 if(e.target.id==='bank-select'){routeTo(Number(e.target.value));return;}
 if(e.target.id==='hide-completed'){onlyRemaining=e.target.checked;render();return;}
 if(e.target.id==='import-file'){try{const f=e.target.files[0];if(!f)return;const raw=JSON.parse(await f.text());if(!Array.isArray(raw.completed))throw Error('Invalid backup');merge(raw.completed);}catch(err){announce('Import failed: '+err.message);}}
});
document.addEventListener('submit',async e=>{
 if(e.target.id!=='login')return;e.preventDefault();
 try{
 const email=String(new FormData(e.target).get('email')||'').trim();
 const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
 if(error)throw error;modal=false;announce('Email sign-in link sent. Check your inbox.');
 }catch(err){announce('Sign-in failed: '+err.message);}
});
window.addEventListener('hashchange',()=>{const n=sectionHash();if(n!==null){current=n;save(selectionKey,n);}document.body.classList.remove('nav-open');render();window.scrollTo(0,0);});
window.addEventListener('online',()=>{if(Object.keys(queued).length)void sync();});
render();void loadWikiData();void startAuth();