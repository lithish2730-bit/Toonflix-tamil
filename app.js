const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const KEY='toonflix_catalogue_v1', FAV='toonflix_favourites_v1', HISTORY='toonflix_history_v1';
const demo = [
 {id:'demo1',title:'Midnight Signal',type:'movie',genre:'Mystery',year:'2025',description:'A mysterious signal brings a quiet town together in this sample catalogue entry. Replace this demo item with a video you own or are licensed to distribute.',poster:'',video:'',featured:true},
 {id:'demo2',title:'Red Horizon',type:'movie',genre:'Adventure',year:'2024',description:'A journey into the unknown changes everything. This is placeholder content for testing the app layout.',poster:'',video:''},
 {id:'demo3',title:'The Last Station',type:'series',genre:'Drama',year:'2025',description:'Every arrival carries a secret. Add your own authorized episodes through the Content Studio.',poster:'',video:'',episodes:[]},
 {id:'demo4',title:'Neon Streets',type:'movie',genre:'Action',year:'2024',description:'Fast-paced city nights and unexpected choices. Demo catalogue entry.',poster:'',video:''},
 {id:'demo5',title:'Little Big World',type:'series',genre:'Family',year:'2025',description:'A warm family adventure, ready for your own episode links.',poster:'',video:'',episodes:[]},
 {id:'demo6',title:'Echoes of Home',type:'movie',genre:'Drama',year:'2023',description:'A story about memories, family, and finding your way back.',poster:'',video:''},
 {id:'demo7',title:'Pixel Quest',type:'series',genre:'Animation',year:'2025',description:'A colourful animated adventure. Replace with content you are allowed to share.',poster:'',video:'',episodes:[]}
];
let catalogue=loadCatalogue(), favourites=loadArray(FAV), history=loadArray(HISTORY), currentView='home', query='';
function loadCatalogue(){try{const v=JSON.parse(localStorage.getItem(KEY));return Array.isArray(v)?v:structuredClone(demo)}catch{return structuredClone(demo)}}
function loadArray(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch{return []}}
function save(){localStorage.setItem(KEY,JSON.stringify(catalogue));localStorage.setItem(FAV,JSON.stringify(favourites));localStorage.setItem(HISTORY,JSON.stringify(history))}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.add('hidden'),2600)}
function posterMarkup(item){return item.poster?`<img src="${esc(item.poster)}" alt="${esc(item.title)} poster" loading="lazy" onerror="this.remove()">`:`<div class="poster-placeholder"><span class="p-top">TOONFLIX ORIGINALS</span><strong>${esc(item.title)}</strong><small>${esc((item.genre||'FEATURED').toUpperCase())} • TAMIL</small></div>`}
function card(item){const saved=favourites.includes(item.id);return `<article class="movie-card" data-detail="${esc(item.id)}"><div class="poster">${posterMarkup(item)}<span class="poster-badge">${item.type==='series'?'SERIES':'MOVIE'}</span><button class="fav-btn ${saved?'saved':''}" data-fav="${esc(item.id)}" aria-label="Toggle favourite">${saved?'♥':'♡'}</button></div><div class="card-title">${esc(item.title)}</div><div class="card-meta"><span>${esc(item.genre||'General')}</span><span>•</span><span>${esc(item.year||'New')}</span></div></article>`}
function section(title,subtitle,items,view){if(!items.length)return '';return `<section class="section"><div class="section-head"><div><h2>${title}</h2><p>${subtitle}</p></div>${view?`<button class="see-all" data-goto="${view}">VIEW ALL ↗</button>`:''}</div><div class="cards">${items.map(card).join('')}</div></section>`}
function filtered(items){const q=query.trim().toLowerCase();return items.filter(i=>!q||[i.title,i.genre,i.description].join(' ').toLowerCase().includes(q))}
function render(){
 const all=filtered(catalogue), movies=all.filter(i=>i.type==='movie'), series=all.filter(i=>i.type==='series');
 $('#hero').classList.toggle('hidden',currentView!=='home'||!!query);
 $('#notice').classList.toggle('hidden',!!query);
 let html='';
 if(currentView==='home'){html=section('Trending Movies','Popular picks from your catalogue',movies.slice(0,5),'movies')+section('Latest Movies','Recently added to your collection',[...movies].reverse().slice(0,5),'movies')+section('Web Series','Stories to watch episode by episode',series.slice(0,5),'series')+section('Continue Watching','Pick up where you left off',all.filter(i=>history.includes(i.id)),'mylist')}
 else if(currentView==='movies')html=section('All Movies','Browse your movie catalogue',movies);
 else if(currentView==='series')html=section('All Series','Explore seasons and episodes',series);
 else if(currentView==='mylist')html=section('My List','Your saved titles',all.filter(i=>favourites.includes(i.id)))+section('Watch History','Recently played',all.filter(i=>history.includes(i.id)));
 if(!html)html=`<div class="empty"><b>${query?'No titles found':'Nothing here yet'}</b>${query?'Try a different search.':'Open Admin to add movies and series to your catalogue.'}</div>`;
 $('#contentView').innerHTML=html;
 $$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
}
function openDetails(id){const item=catalogue.find(i=>i.id===id);if(!item)return;const saved=favourites.includes(id);
 const episodes=item.episodes||[];
 $('#detailsBody').innerHTML=`<div class="detail-hero"><div class="detail-poster">${posterMarkup(item)}</div><div class="detail-copy"><span class="detail-meta">${esc(item.type.toUpperCase())} • ${esc(item.genre||'GENERAL')} • ${esc(item.year||'NEW')}</span><h2>${esc(item.title)}</h2><p>${esc(item.description||'No description added yet.')}</p><div class="hero-buttons"><button class="primary-btn" data-play="${esc(id)}">▶ ${item.type==='series'?'Play first episode':'Play now'}</button><button class="secondary-btn" data-fav="${esc(id)}">${saved?'♥ Added to My List':'♡ Add to My List'}</button></div></div></div>${item.type==='series'?`<section class="section"><div class="section-head"><div><h2>Episodes</h2><p>${episodes.length} episode${episodes.length===1?'':'s'} available</p></div></div><div class="episode-list">${episodes.length?episodes.map((e,n)=>`<div class="episode-row"><div class="episode-play">▶</div><div><b>${esc(e.title||`Episode ${n+1}`)}</b><small>Episode ${n+1}</small></div><button class="play-now" data-episode="${esc(id)}" data-epindex="${n}">PLAY ↗</button></div>`).join(''):'<div class="empty">No episodes yet. Add episodes in Admin.</div>'}</div></section>`:''}`;
 $('#detailsModal').classList.remove('hidden');
}

function openPlayer(item, video, label) {
  if (!video) {
    toast('No video URL added yet.');
    return;
  }

  const url = video.trim();
  $('#playerBody').innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'video-frame';

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    const v = document.createElement('video');
    v.src = url;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = 'metadata';
    wrap.appendChild(v);
  } else {
    const msg = document.createElement('div');
    msg.style.cssText =
      'padding:24px;text-align:center;color:#bbb;font-size:13px';
    msg.textContent =
      'This link is not a supported direct video URL. Use an authorized video source.';
    wrap.appendChild(msg);
  }

  $('#playerBody').append(wrap);

  const cap = document.createElement('div');
  cap.className = 'player-caption';
  cap.textContent = label || item.title;
  $('#playerBody').append(cap);

  history = [item.id, ...history.filter(x => x !== item.id)].slice(0, 20);
  save();
  $('#playerModal').classList.remove('hidden');
  render();
}
function playItem(id,episodeIndex=null){const item=catalogue.find(i=>i.id===id);if(!item)return;if(item.type==='series'&&episodeIndex===null){if(item.episodes?.length){openPlayer(item,item.episodes[0].video,`${item.title} — ${item.episodes[0].title||'Episode 1'}`)}else toast('Add episode video links in Admin first.')}else if(episodeIndex!==null){const ep=item.episodes?.[episodeIndex];if(ep)openPlayer(item,ep.video,`${item.title} — ${ep.title||`Episode ${episodeIndex+1}`}`)}else openPlayer(item,item.video)}
function toggleFav(id){favourites=favourites.includes(id)?favourites.filter(x=>x!==id):[...favourites,id];save();render();if(!$('#detailsModal').classList.contains('hidden'))openDetails(id);toast(favourites.includes(id)?'Added to My List':'Removed from My List')}
function showAdmin(){renderAdmin();$('#adminModal').classList.remove('hidden')}
function renderAdmin(){$('#adminList').innerHTML='<h3 style="font:600 13px Space Grotesk">Catalogue items ('+catalogue.length+')</h3>'+catalogue.map(i=>`<div class="admin-item"><div><b>${esc(i.title)}</b><small>${esc(i.type)} • ${esc(i.genre||'General')}</small></div><button data-delete="${esc(i.id)}">Remove</button></div>`).join('')}
function closeModal(id){$('#'+id).classList.add('hidden')}
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-view]');if(nav){currentView=nav.dataset.view;query='';$('#searchInput').value='';render();window.scrollTo({top:0,behavior:'smooth'});return}
 const goto=e.target.closest('[data-goto]');if(goto){currentView=goto.dataset.goto;render();return}
 const fav=e.target.closest('[data-fav]');if(fav){e.stopPropagation();toggleFav(fav.dataset.fav);return}
 const detail=e.target.closest('[data-detail]');if(detail){openDetails(detail.dataset.detail);return}
 const play=e.target.closest('[data-play]');if(play){playItem(play.dataset.play);return}
 const ep=e.target.closest('[data-episode]');if(ep){playItem(ep.dataset.episode,Number(ep.dataset.epindex));return}
 const del=e.target.closest('[data-delete]');if(del){catalogue=catalogue.filter(i=>i.id!==del.dataset.delete);favourites=favourites.filter(x=>x!==del.dataset.delete);history=history.filter(x=>x!==del.dataset.delete);save();render();renderAdmin();toast('Item removed');return}
 const close=e.target.closest('[data-close]');if(close){closeModal(close.dataset.close);return}
});
$('#homeBtn').onclick=()=>{currentView='home';query='';$('#searchInput').value='';render();window.scrollTo({top:0,behavior:'smooth'})};
$('#adminOpen').onclick=showAdmin;
$('#searchToggle').onclick=()=>{$('#searchBar').classList.toggle('hidden');if(!$('#searchBar').classList.contains('hidden'))$('#searchInput').focus()};
$('#searchInput').addEventListener('input',e=>{query=e.target.value;render()});
$('#clearSearch').onclick=()=>{$('#searchInput').value='';query='';render()};
$('#heroExplore').onclick=()=>{currentView='movies';render();$('#contentView').scrollIntoView({behavior:'smooth'})};
$('#heroInfo').onclick=()=>toast('Use Admin to add authorized video links and episode details.');
$('#contentForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const type=f.get('type');const episodes=String(f.get('episodes')||'').split('\n').map(s=>s.trim()).filter(Boolean).map((line,n)=>{const parts=line.split('|');return {title:(parts[0]||`Episode ${n+1}`).trim(),video:(parts.slice(1).join('|')||'').trim()}});const item={id:'user_'+Date.now(),title:String(f.get('title')).trim(),type,genre:String(f.get('genre')||'').trim()||'General',year:String(new Date().getFullYear()),description:String(f.get('description')||'').trim(),poster:String(f.get('poster')||'').trim(),video:String(f.get('video')||'').trim(),episodes:type==='series'?episodes:undefined};catalogue.unshift(item);save();e.currentTarget.reset();render();renderAdmin();toast('Added to catalogue');});
$('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(catalogue,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='toonflix-catalogue.json';a.click();URL.revokeObjectURL(a.href);toast('Catalogue export started')};
$('#importFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data))throw Error();catalogue=data;save();render();renderAdmin();toast('Catalogue imported')}catch{toast('Invalid catalogue JSON file')}e.target.value=''};
$('#resetBtn').onclick=()=>{if(confirm('Reset the catalogue to demo titles? This removes your local catalogue changes.')){catalogue=structuredClone(demo);favourites=[];history=[];save();render();renderAdmin();toast('Demo catalogue restored')}};
['detailsModal','playerModal','adminModal'].forEach(id=>$('#'+id).addEventListener('click',e=>{if(e.target.id===id)closeModal(id)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape') ['detailsModal','playerModal','adminModal'].forEach(closeModal)});
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
render();
