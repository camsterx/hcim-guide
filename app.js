import {chapters, planned} from './data/chapters.js';
const ROOT = document.getElementById('app');
const conf=window.HCIM_CONFIG || {};
const supabase = window.supabase?.createClient && conf.supabaseUrl && conf.supabasePublishableKey
  ? window.supabase.createClient(conf.supabaseUrl,conf.supabasePublishableKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
  : null;
const all=chapters.flatMap(ch=>ch.steps.map(s=>({ch,id:s[0],title:s[1],description:s[2],tag:s[3],risk:s[4]||''})));
const ids=new Set(all.map(s=>s.id));
const index=new Map(all.map((s,i)=>[s.id,i+1]));
const safe=(value)=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const read=(key,otherwise)=>{try{return JSON.parse(localStorage.getItem(key))??otherwise;}catch{return otherwise;}};
const store=(key,data)=>{try{localStorage.setItem(key,JSON.stringify(data));}catch{}};
const deviceKey='rhr-guest-v1';
let session=null, done=new Set(read(deviceKey,[]).filter(id=>ids.has(id))),pending={}, profile={},syncState='Local only',syncing=false,loaded=false,modal=false,flash='',showDone=true,authVersion=0;
const key=()=>session?'rhr-'+session.user.id+'-v1':deviceKey;
const pendingKey=()=> 'rhr-pending-'+session.user.id+'-v1';
const localWrite=()=>store(key(),[...done]);
const nextStep=()=>all.find(s=>!done.has(s.id));
const count=chapter=>chapter.steps.filter(s=>done.has(s[0])).length;
const route=()=>{try{return decodeURIComponent(location.hash.slice(1))||'/guide';}catch{return '/guide';}};
const href=ch=>'#/chapter/'+encodeURIComponent(ch.id);
function stateLabel(){return session?syncState:(supabase?'Not signed in — stored on this device':'Cloud unavailable — stored on this device');}
function show(text){flash=text;render();window.setTimeout(()=>{if(flash===text){flash='';render();}},5000);}
function navigation(current){
  return '<div class="nav-header">THE ROUTE</div>'+
   '<a class="nav-link '+(current==='/guide'?'selected':'')+'" href="#/guide">📜 All steps <span>'+done.size+'/'+all.length+'</span></a>'+
   chapters.map(ch=>'<a class="nav-link '+(current===href(ch).slice(1)?'selected':'')+'" href="'+href(ch)+'"><span class="nav-number">'+ch.number+'</span><span class="nav-name">'+safe(ch.title)+'<small>'+count(ch)+'/'+ch.steps.length+' completed</small></span></a>').join('')+
   '<div class="nav-header upcoming">COMING NEXT</div>'+planned.map(ch=>'<div class="nav-planned"><span class="nav-number">'+ch.number+'</span><span>'+safe(ch.title)+'</span></div>').join('');
}
function stepHTML(s){
 const yes=done.has(s.id),risk=!!s.risk,number=index.get(s.id);
 const attention=risk?'FOCUSED PLAY':s.tag==='Semi-AFK'?'SEMI-AFK':s.tag==='Low attention'?'LOW ATTENTION':'STEP';
 const isNext=nextStep()?.id===s.id;
 return '<article class="step '+(yes?'is-done ':'')+(isNext?'is-next':'')+'" id="step-'+safe(s.id)+'">'+
 '<button class="check" type="button" data-step="'+safe(s.id)+'" aria-label="'+(yes?'Mark incomplete':'Mark complete')+': '+safe(s.title)+'" aria-pressed="'+yes+'">'+(yes?'✓':'')+'</button>'+
 '<div class="step-body"><div class="step-eyebrow"><span>#'+String(number).padStart(3,'0')+'</span> <span class="type '+(risk?'danger':'')+'">'+attention+'</span></div>'+
 '<h3>'+safe(s.title)+'</h3><p>'+safe(s.description)+'</p>'+
 (risk?'<div class="risk"><strong>⚠ HARDCORE RISK — DO NOT AFK</strong><p>'+safe(s.risk)+'</p></div>':'')+
 '<div class="step-foot"><span>'+safe(s.tag)+'</span></div></div></article>';
}
function chapterHTML(ch,standalone=false){
 const items=all.filter(s=>s.ch.id===ch.id).filter(s=>showDone||!done.has(s.id));
 const i=chapters.indexOf(ch);
 return '<section class="chapter" id="section-'+ch.id+'"><div class="chapter-heading"><div class="chapter-count">CHAPTER '+ch.number+' · '+safe(ch.region)+'</div><h2>'+safe(ch.title)+'</h2><p>'+safe(ch.subtitle)+'</p><div class="chapter-progress"><span>'+count(ch)+' of '+ch.steps.length+' done</span><div class="bar"><div style="width:'+(count(ch)/ch.steps.length*100)+'%"></div></div></div></div>'+
 (items.length?items.map(stepHTML).join(''):'<div class="empty">Every step in this chapter is complete. Nice work.</div>')+
 (standalone?'<div class="pager"><a href="'+(i===0?'#/guide':href(chapters[i-1]))+'">← '+(i===0?'Full guide':'Previous chapter')+'</a><a href="'+(i===chapters.length-1?'#/guide':href(chapters[i+1]))+'">'+(i===chapters.length-1?'Full guide':'Next chapter')+' →</a></div>':'')+'</section>';
}
function progressHero(){
 let s=nextStep(),next=s?'#step-'+s.id:'#top';
 return '<div class="hero"><div class="eyebrow">RED HELM ROAD · HCIM FIRST</div><h1>Your road to max.</h1><p>One continuous, Oziris-style route. Follow each step in order, protect your red helmet and build towards maxing while working from home.</p>'+
 '<div class="hero-stats"><div><strong>'+done.size+'<em> / '+all.length+'</em></strong><small>Steps completed</small></div><div><strong>'+chapters.length+'</strong><small>Chapters available</small></div><div><strong>2,376</strong><small>Max total goal</small></div></div>'+
 '<div class="overall"><div class="bar"><div style="width:'+(done.size/all.length*100)+'%"></div></div><span>'+Math.round(done.size/all.length*100)+'% complete</span></div>'+
 '<a class="primary-button" href="'+next+'">↳ Resume '+(s?'step #'+index.get(s.id):'guide')+'</a></div>';
}
function guideHTML(current){
 let one=chapters.find(c=>href(c).slice(1)===current),subset=one?[one]:chapters;
 return (one?'<div class="mini-header"><a href="#/guide">← Full guide</a><span>CHAPTER '+one.number+'</span></div>':progressHero())+
 '<div class="guide-tools"><div><strong>'+(one?'Chapter walkthrough':'Continuous walkthrough')+'</strong><small>Saved ticks · Always protect HCIM status</small></div><label class="toggle"><input id="show-done" type="checkbox" '+(showDone?'checked':'')+'/> Show completed</label></div>'+
 '<div class="safety-banner">🛡️ <div><strong>Hardcore rule:</strong> If work might interrupt you, stop in a safe spot first. Wintertodt is an unsafe death — zero warmth can cost the red helmet. Check preparation before all dangerous steps.</div></div>'+
 subset.map(c=>chapterHTML(c,!!one)).join('')+
 (!one?'<div class="end-note"><strong>Next chapters are being written.</strong> Your saved step IDs will remain the same when new chapters are added.</div>':'');
}
function settingsHTML(){
 return '<div class="hero small"><div class="eyebrow">ACCOUNT &amp; BACKUP</div><h1>Your progress.</h1><p>Sign in using an email link to sync your ticks privately between devices.</p></div>'+
 '<div class="settings-panel"><h2>Cloud saving</h2><p><strong>'+safe(stateLabel())+'</strong></p><p>'+(session?'Signed in as '+safe(session.user.email)+'.': 'Not signed in. Completed ticks are currently stored only in this browser.')+'</p><div class="button-row"><button class="primary-button" data-act="account">'+(session?'Manage account':'Sign in')+'</button>'+(session?'<button class="ghost" data-act="sync">Retry sync</button><button class="ghost" data-act="merge">Merge this device’s guest ticks</button>':'')+'</div></div>'+
 '<div class="settings-panel"><h2>Account milestones</h2><p>Optional character information saved privately when signed in.</p><form id="profile"><label>OSRS name<input name="rsn" maxlength="30" value="'+safe(profile.rsn||'')+'" placeholder="New HCIM name"></label><label>Total level<input name="total_level" type="number" min="1" max="2376" value="'+safe(profile.total_level||'')+'"></label><label>Firemaking<input name="firemaking_level" type="number" min="1" max="99" value="'+safe(profile.firemaking_level||'')+'"></label><label>Herblore<input name="herblore_level" type="number" min="1" max="99" value="'+safe(profile.herblore_level||'')+'"></label><button class="primary-button" type="submit">Save milestones</button></form></div>'+
 '<div class="settings-panel"><h2>Progress backup</h2><p>Download completed step IDs and import them again if needed. Keep the backup private.</p><div class="button-row"><button class="ghost" data-act="export">Download backup</button><label class="ghost" for="import-file">Import JSON backup</label><input type="file" id="import-file" accept=".json,application/json" hidden></div></div>';
}
function modalHTML(){
 if(!modal)return '';
 return '<div class="overlay" role="presentation"><div class="dialog" role="dialog" aria-modal="true" aria-label="Cloud account"><button class="exit" data-act="close" aria-label="Close">×</button>'+
 '<div class="eyebrow">CLOUD PROGRESS</div><h2>'+(session?'Your account':'Save on any device')+'</h2>'+
 (session?'<p>Signed in as <strong>'+safe(session.user.email)+'</strong>.</p><p>'+safe(stateLabel())+'</p><div class="button-row"><button class="ghost" data-act="sync">Retry sync</button><button class="ghost" data-act="signout">Sign out</button></div>'
 :!supabase?'<p>Supabase could not load. Check your connection and try again.</p>'
 :'<p>Enter your email and we’ll send a secure sign-in link. Use the same address on your phone and PC.</p><form id="login"><label>Email<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label><button class="primary-button" type="submit">Email me a sign-in link</button></form>')+'</div></div>';
}
function render(){
 const current=route(),page=current==='/settings'?settingsHTML():guideHTML(current);
 ROOT.innerHTML='<div id="top" class="layout"><aside class="sidebar"><a class="brand" href="#/guide"><span class="brand-icon">♜</span><span>RED HELM ROAD<small>HARDCORE IRONMAN</small></span></a>'+navigation(current)+'<div class="sidebar-bottom">Unofficial OSRS guide. Safety over speed.</div></aside><main class="content"><header class="topbar"><button class="menu" data-act="menu" aria-label="Open chapters">☰</button><a class="topbrand" href="#/guide">RED HELM ROAD</a><a href="#/settings" class="sync-tag">'+(session?'☁ ':'◯ ')+safe(stateLabel())+'</a></header>'+(flash?'<div class="notice" role="status">'+safe(flash)+'</div>':'')+page+'<footer>Unofficial Old School RuneScape guide · Not affiliated with Jagex · Hardcore status first</footer></main></div>'+modalHTML();
}
function mark(id){
 if(!ids.has(id))return;
 const value=!done.has(id);
 value?done.add(id):done.delete(id);
 localWrite();
 if(session){pending[id]=value;store(pendingKey(),pending);syncState='Waiting to sync';if(loaded)void push();}
 render();
}
let authChangeToken=0;
async function setSession(s){
 let token=++authChangeToken;
 const id=s?.user?.id;
 if(id && session?.user?.id===id && loaded)return;
 session=s;loaded=false;
 if(!id){pending={};profile={};done=new Set(read(deviceKey,[]).filter(x=>ids.has(x)));syncState='Local only';render();return;}
 done=new Set(read(key(),[]).filter(x=>ids.has(x)));
 pending=read(pendingKey(),{});
 syncState='Loading your cloud progress…';render();
 const [r,p]=await Promise.all([
 supabase.from('step_progress').select('step_id,is_completed').eq('user_id',id),
 supabase.from('hcim_profiles').select('rsn,total_level,firemaking_level,herblore_level').eq('user_id',id).maybeSingle()
 ]);
 if(token!==authChangeToken || session?.user?.id!==id)return;
 if(r.error){syncState='Cloud read failed — device copy retained: '+r.error.message;render();return;}
 let fromCloud=new Set((r.data||[]).filter(x=>x.is_completed&&ids.has(x.step_id)).map(x=>x.step_id));
 for(const [sid,value] of Object.entries(pending)){if(ids.has(sid))value?fromCloud.add(sid):fromCloud.delete(sid);}
 done=fromCloud;localWrite();
 if(!p.error && p.data)profile=p.data;
 loaded=true;syncState='All changes synced';render();
 if(Object.keys(pending).length)void push();
}
async function push(){
 if(syncing||!session||!loaded)return;
 syncing=true;syncState='Syncing…';render();
 const owner=session.user.id;
 while(session?.user?.id===owner && Object.keys(pending).length){
 const [sid,value]=Object.entries(pending)[0];
 try{
 const {error}=await supabase.from('step_progress').upsert({user_id:owner,step_id:sid,is_completed:value,updated_at:new Date().toISOString()},{onConflict:'user_id,step_id'});
 if(error)throw error;
 if(session?.user?.id!==owner)break;
 if(pending[sid]===value)delete pending[sid];
 store(pendingKey(),pending);
 }catch(e){syncing=false;syncState='Sync error — stored on this device: '+e.message;render();return;}
 }
 syncing=false;
 if(session?.user?.id===owner){syncState='All changes synced';render();}
}
async function beginAuth(){
 if(!supabase)return;
 try {
  const {data,error}=await supabase.auth.getSession();if(error)throw error;
  await setSession(data.session);
  supabase.auth.onAuthStateChange((event,s)=>{if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)){Promise.resolve().then(()=>setSession(s)).catch(e=>show('Sign-in error: '+e.message));}});
 }catch(e){syncState='Sign-in unavailable: '+e.message;render();}
}
async function signIn(email){
 const dest=location.origin+location.pathname;
 const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:dest}});
 if(error)throw error;
 modal=false;show('Sign-in link sent. Check your email and open the link.');
}
async function saveProfile(f){
 const values={rsn:String(f.get('rsn')||'').slice(0,30),total_level:f.get('total_level')?Number(f.get('total_level')):null,firemaking_level:f.get('firemaking_level')?Number(f.get('firemaking_level')):null,herblore_level:f.get('herblore_level')?Number(f.get('herblore_level')):null};
 if(!session){show('Sign in to save milestones across devices.');return;}
 const {error}=await supabase.from('hcim_profiles').upsert({user_id:session.user.id,...values,updated_at:new Date().toISOString()},{onConflict:'user_id'});
 if(error)throw error;
 profile=values;show('Milestones saved.');
}
function exportBackup(){
 const backup={version:1,completed:[...done],exportedAt:new Date().toISOString()};
 const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='red-helm-road-progress.json';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function mergeIds(arr){
 let n=0;
 for(const id of arr){if(!ids.has(id)||done.has(id))continue;done.add(id);n++;if(session)pending[id]=true;}
 localWrite();if(session){store(pendingKey(),pending);if(loaded)void push();}
 show(n+' steps merged into your progress.');
}
document.addEventListener('click',async ev=>{
 const tick=ev.target.closest('[data-step]');if(tick){mark(tick.dataset.step);return;}
 const btn=ev.target.closest('[data-act]');if(!btn)return;
 const action=btn.dataset.act;
 try{
 if(action==='account'){modal=true;render();}
 if(action==='close'){modal=false;render();}
 if(action==='signout'){await supabase.auth.signOut();modal=false;await setSession(null);}
 if(action==='sync'){if(session){if(loaded)await push();else await setSession(session);}modal=false;}
 if(action==='merge')mergeIds(read(deviceKey,[]));
 if(action==='export')exportBackup();
 if(action==='menu')document.body.classList.toggle('nav-open');
 }catch(e){show('Could not finish: '+e.message);}
});
document.addEventListener('change',async ev=>{
 if(ev.target.id==='show-done'){showDone=ev.target.checked;render();}
 if(ev.target.id==='import-file'){
 try{const file=ev.target.files[0];if(!file)return;const data=JSON.parse(await file.text());if(!Array.isArray(data.completed))throw Error('Backup format not recognised');mergeIds(data.completed);}
 catch(e){show('Import failed: '+e.message);}
 }
});
document.addEventListener('submit',async ev=>{
 if(!['login','profile'].includes(ev.target.id))return;ev.preventDefault();
 const form=ev.target;const btn=form.querySelector('button[type=submit]');btn.disabled=true;
 try{const data=new FormData(form);if(form.id==='login')await signIn(String(data.get('email')||'').trim());else await saveProfile(data);}
 catch(e){show('Error: '+e.message);}
 finally{btn.disabled=false;}
});
window.addEventListener('hashchange',()=>{document.body.classList.remove('nav-open');render();window.scrollTo({top:0,behavior:'instant'});});
window.addEventListener('online',()=>{if(Object.keys(pending).length)void push();});
render();void beginAuth();
