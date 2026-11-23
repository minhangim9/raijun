/* 라이준 v2 — 메뉴, HUD(나가기/다시하기/다시 듣기), 활동 실행기 */
(function(){
'use strict';
var R=window.R,$=R.$;
var cur={mod:null,idx:0,state:'menu'};
var UI={ko:{rot:'가로로 돌려주세요',rotSub:'(이대로도 할 수 있어요)',exit:'나가기',restart:'다시하기',replay:'다시 듣기',lang:'언어',snd:'소리',full:'전체',book:'스티커',share:'📤 부모님께 자랑하기',again:'↻ 처음부터',menu:'🏠 메뉴',title:'참 잘했어요!',yesExit:'네, 나갈래요',stay:'계속할래요',thisAct:'이 활동 다시',fromStart:'처음부터',close:'닫기',copied:'자랑 글을 복사했어요! 가족 채팅에 붙여 넣어요.',note:'손가락·마우스·펜 OK · 인터넷 없이도 돼요',h1:'어떤 놀이를 할까요?',sub:'라이준 숫자·도형',c1:'1화 · 숫자·도형 모험',c1s:'푸스를 만나러 가는 여행',c2:'라이준 우주 도형 놀이',c2s:'크다·작다 · 세모 다리 · 역 · 배',play:'🧩 스티커 놀이',shelf:'🎁 선물 선반',langQ:'언어를 골라 주세요',back:'🏠 돌아가기'},
 en:{rot:'Please turn your device sideways',rotSub:'(you can still play like this)',exit:'Exit',restart:'Again',replay:'Replay',lang:'Language',snd:'Sound',full:'Full',book:'Stickers',share:'📤 Show my family',again:'↻ Start over',menu:'🏠 Menu',title:'Great job!',yesExit:'Yes, exit',stay:'Keep playing',thisAct:'This activity',fromStart:'From the start',close:'Close',copied:'Copied! Paste it in your family chat.',note:'Finger, mouse or pen · works offline',h1:'What shall we play?',sub:'Raijun Numbers & Shapes',c1:'Ep.1 · Numbers & Shapes',c1s:'A trip to meet Puss',c2:'Raijun Space Shapes',c2s:'big/small · triangle bridge · stations · boat',play:'🧩 Sticker games',shelf:'🎁 Gift shelf',langQ:'Choose a language',back:'🏠 Go back'},
 es:{rot:'Gira el dispositivo de lado',rotSub:'(también puedes jugar así)',exit:'Salir',restart:'Otra vez',replay:'Repetir',lang:'Idioma',snd:'Sonido',full:'Pantalla',book:'Álbum',share:'📤 Enseñar a mi familia',again:'↻ Empezar de nuevo',menu:'🏠 Menú',title:'¡Muy bien!',yesExit:'Sí, salir',stay:'Seguir jugando',thisAct:'Esta actividad',fromStart:'Desde el principio',close:'Cerrar',copied:'¡Copiado! Pégalo en el chat de la familia.',note:'Dedo, ratón o lápiz · funciona sin internet',h1:'¿A qué jugamos?',sub:'Raijun Números y Formas',c1:'Ep. 1 · Números y formas',c1s:'Un viaje para ver a Puss',c2:'Formas del espacio',c2s:'grande/pequeño · puente · estaciones · barco',play:'🧩 Juegos de pegatinas',shelf:'🎁 Estantería de regalos',langQ:'Elige un idioma',back:'🏠 Volver'},
 zh:{rot:'请把设备横过来',rotSub:'（竖着也可以玩）',exit:'退出',restart:'再来',replay:'再听',lang:'语言',snd:'声音',full:'全屏',book:'贴纸',share:'📤 给家人看看',again:'↻ 从头开始',menu:'🏠 菜单',title:'真棒！',yesExit:'好，退出',stay:'继续玩',thisAct:'重玩这一关',fromStart:'从头开始',close:'关闭',copied:'已复制！贴到家庭群里吧。',note:'手指、鼠标、触控笔都可以 · 没有网络也能玩',h1:'玩什么呢？',sub:'莱俊 数字和形状',c1:'第1集 · 数字形状大冒险',c1s:'去见普斯的旅行',c2:'莱俊太空形状游戏',c2s:'大和小 · 三角桥 · 车站 · 小船',play:'🧩 贴纸游戏',shelf:'🎁 礼物架',langQ:'请选择语言',back:'🏠 返回'},
 fr:{rot:'Tourne l’appareil sur le côté',rotSub:'(tu peux aussi jouer comme ça)',exit:'Sortir',restart:'Rejouer',replay:'Écouter',lang:'Langue',snd:'Son',full:'Écran',book:'Album',share:'📤 Montrer à ma famille',again:'↻ Recommencer',menu:'🏠 Menu',title:'Bravo !',yesExit:'Oui, sortir',stay:'Continuer',thisAct:'Cette activité',fromStart:'Depuis le début',close:'Fermer',copied:'Copié ! Colle-le dans la discussion de la famille.',note:'Doigt, souris ou stylet · marche sans internet',h1:'À quoi on joue ?',sub:'Raijun Chiffres et Formes',c1:'Ép. 1 · Chiffres et formes',c1s:'Un voyage pour voir Puss',c2:'Formes de l’espace',c2s:'grand/petit · pont · gares · bateau',play:'🧩 Jeux d’autocollants',shelf:'🎁 Étagère à cadeaux',langQ:'Choisis une langue',back:'🏠 Retour'}};
function UIo(k){var o={};for(var l in UI)o[l]=UI[l][k];return o}
R.UI=UI;R.u2=function(k){return (UI[R.S.lang]||UI.en)[k]};
function u(k){return (UI[R.S.lang]||UI.en)[k]}
function withoutSymbol(text){return text.replace(/^[^\p{L}\p{N}]+/u,"")}
function applyUI(){var q=function(s,t){var e=$(s);if(e)e.textContent=t};
  q('#rotTxt',u('rot'));q('#rotSub',u('rotSub'));q('#hExit span',u('exit'));q('#hRestart span',u('restart'));q('#hReplay span',u('replay'));q('#hLang span',u('lang'));q('#hSnd span',u('snd'));q('#hFull span',u('full'));
  q('#hLang i',R.S.lang.toUpperCase());q('#hBook span',u('book'));q('#goPlay span',withoutSymbol(u('play')));q('#goShelf span',withoutSymbol(u('shelf')));var ln=R.LANGS.filter(function(x){return x[0]===R.S.lang})[0];q('#mLang span',ln?ln[1]:'');$('#hSnd').classList.toggle('off',!R.S.snd);q('#bShare',u('share'));q('#bAgain',u('again'));q('#bMenu',u('menu'));q('#rTitle',u('title'));
  q('.mTitle h1',u('h1'));q('#goEp1 span',u('c1'));q('#goSpace span',R.S.lang==='ko'?'우주 도형 놀이':u('c2'));document.documentElement.lang=R.S.lang==='zh'?'zh-CN':R.S.lang;R.onBook&&R.onBook()}
applyUI();
function showMenu(){R.cancelAll();R.keepAwake(false);R.map(null);R.setBgm(false);cur.state='menu';cur.mod=null;$('#reward').classList.add('hidden');$('#menu').classList.remove('hidden');$('#hud').classList.add('hidden');R.clearScene('bg_forest');R.resetStickers();R.show('menu_hi')}
async function runFrom(mod,idx){
  R.cancelAll();var runId=R.runId;R.keepAwake(true);cur.mod=mod;cur.idx=idx;cur.state='play';R.calm=!!mod.calm;
  $('#menu').classList.add('hidden');$('#reward').classList.add('hidden');$('#hud').classList.remove('hidden');
  if(idx===0)R.resetStickers();
  try{
    for(var i=idx;i<mod.acts.length;i++){cur.idx=i;if(mod.stops&&i>0)R.map(mod.stops,mod.mapAt[i]);else if(!mod.stops)R.map(null);await mod.acts[i]()}
    await mod.finale();if(runId!==R.runId)return;if(mod.after){if(mod.after==='menu')showMenu();else runFrom(R.MODS[mod.after],0);return}cur.state='reward';reward(mod);
  }catch(e){if(e!==R.CANCEL)console.error(e)}
}
R.CANCEL=R.CANCEL||'CANCEL';
function reward(mod){try{R.inv.episodes[mod.key]={done:new Date().toISOString()};R.saveInv()}catch(e){}var r=$('#reward');r.classList.remove('hidden');var rs=$('#rStickers');rs.innerHTML='';R.stickers.forEach(function(s){R.el('div','st',s.icon,rs)});
  $('#shareTxt').textContent=R.T(mod.share);$('#rNext').textContent=R.T(mod.next);R.sfx.fanfare();R.cam({},0);R.map(null);
  R.hideBubble();R.play('share_hint').catch(function(){})}
/* share card image */
function shareImage(txt){return new Promise(function(res){var c=document.createElement('canvas');c.width=1200;c.height=630;var x=c.getContext('2d');var g=x.createLinearGradient(0,0,0,630);g.addColorStop(0,'#ffe9a8');g.addColorStop(1,'#ffb35c');x.fillStyle=g;x.fillRect(0,0,1200,630);
  var im=new Image();im.onload=function(){x.drawImage(im,40,630-520,520*im.width/im.height,520);fin()};im.onerror=fin;im.src=R.u('img/raijun.webp');
  function fin(){x.fillStyle='#fff';x.beginPath();x.roundRect?x.roundRect(470,70,690,420,40):x.rect(470,70,690,420);x.fill();x.fillStyle='#6b3a0a';x.font='bold 40px sans-serif';var words=txt.split(' '),line='',y=140;
    words.forEach(function(w){if(x.measureText(line+w).width>620){x.fillText(line,500,y);line='';y+=56}line+=w+' '});x.fillText(line,500,y);x.font='bold 30px sans-serif';x.fillStyle='#c2520a';x.fillText('⭐ '+R.stickers.map(function(s){return s.key}).length+' stickers',500,560);
    try{c.toBlob(function(b){res(b)},'image/png')}catch(e){res(null)}}})}
$('#bShare').onclick=async function(){R.sfx.tap();var txt=$('#shareTxt').textContent;var blob=await shareImage(txt);
  try{if(blob&&navigator.canShare){var f=new File([blob],'raijun.png',{type:'image/png'});if(navigator.canShare({files:[f]})){await navigator.share({files:[f],text:txt});return}}
    if(navigator.share){await navigator.share({text:txt});return}}catch(e){if(e&&e.name==='AbortError')return}
  try{await navigator.clipboard.writeText(txt)}catch(e){}
  if(blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='라이준_자랑.png';document.body.appendChild(a);a.click();a.remove()}
  R.popText(u('copied'),800,820)};
$('#bAgain').onclick=function(){R.sfx.tap();if(cur.mod)runFrom(cur.mod,0)};
$('#bMenu').onclick=function(){R.sfx.tap();showMenu()};
function start(key){R.audioInit();R.sfx.tap();var m=R.MODS[key];R.transition(function(){runFrom(m,0)})}
$('#goEp1').onclick=function(){start('ep1')};$('#goSpace').onclick=function(){start('space')};
$('#goPlay').onclick=function(){start('playmenu')};$('#goShelf').onclick=function(){start('shelf')};
R.runMod=function(k,i){runFrom(R.MODS[k],i||0)};R.showMenu=showMenu;
/* language picker (5 languages) */
function pickLang(){R.audioInit();R.sfx.tap();R.stopVoice();R.modal(UIo('langQ'),R.LANGS.map(function(x){return {t:{ko:x[1],en:x[1],es:x[1],zh:x[1],fr:x[1]},id:'lang_'+x[0],alt:x[0]!==R.S.lang,fn:function(){R.S.lang=x[0];R.save();applyUI();R.refreshBubble();if(cur.state==='menu')R.show('menu_hi');else R.replay()}}}))}
R.pickLang=pickLang;$('#mLang').onclick=pickLang;
/* screen wake lock: keep the screen on while the game is active */
var wl=null,wantWL=false;
function wlReq(){if(!wantWL||document.hidden||wl||!('wakeLock' in navigator))return;try{navigator.wakeLock.request('screen').then(function(l){wl=l;R.wakeLockOn=true;l.addEventListener('release',function(){wl=null;R.wakeLockOn=false})}).catch(function(){})}catch(e){}}
R.keepAwake=function(on){wantWL=on;if(on)wlReq();else if(wl){try{wl.release()}catch(e){}wl=null}};
document.addEventListener('visibilitychange',function(){if(!document.hidden)wlReq()});
document.addEventListener('pointerdown',function(){wlReq()},true);
/* HUD */
var paused=null;
$('#hExit').onclick=function(){R.audioInit();R.sfx.tap();R.stopVoice();R.modal('exit_q',[{t:{ko:UI.ko.yesExit,en:UI.en.yesExit},id:'mYes',fn:showMenu},{t:{ko:UI.ko.stay,en:UI.en.stay},alt:1,id:'mNo',fn:function(){R.replay()}}])};
$('#hRestart').onclick=function(){R.audioInit();R.sfx.tap();R.stopVoice();if(!cur.mod)return;R.modal('restart_q',[{t:{ko:UI.ko.thisAct,en:UI.en.thisAct},id:'mAct',fn:function(){var m=cur.mod,i=cur.state==='reward'?m.acts.length-1:cur.idx;R.transition(function(){runFrom(m,i)})}},{t:{ko:UI.ko.fromStart,en:UI.en.fromStart},id:'mAll',fn:function(){var m=cur.mod;R.transition(function(){runFrom(m,0)})}},{t:{ko:UI.ko.close,en:UI.en.close},alt:1,id:'mClose'}])};
$('#hReplay').onclick=function(){R.sfx.tap();R.replay()};
$('#hLang').onclick=function(){pickLang()};$('#hBook').onclick=function(){R.openBook&&R.openBook()};
var hub=window.RaijunHub;
function refreshPreferences(){
  R.readSharedSettings();R.setSound(R.S.snd);if(!R.S.snd)R.stopVoice();applyUI();
}
$('#hSnd').onclick=function(){
  try{hub.setPrefs({sound:!R.S.snd});refreshPreferences()}catch(e){}
};
addEventListener('storage',function(e){if(!e.key||e.key===hub.preferencesKey)refreshPreferences()});
addEventListener('pageshow',function(e){if(e.persisted)refreshPreferences()});
$('#hFull').onclick=function(){var d=document,e=d.documentElement;try{if(!d.fullscreenElement&&!d.webkitFullscreenElement){(e.requestFullscreen||e.webkitRequestFullscreen).call(e);try{screen.orientation.lock('landscape').catch(function(){})}catch(x){}}else (d.exitFullscreen||d.webkitExitFullscreen).call(d)}catch(x){}};
/* portrait: say rotate once */
var rotSaid=false;document.addEventListener('pointerdown',function(){if(!rotSaid&&innerHeight>innerWidth){rotSaid=true;R.audioInit();setTimeout(function(){R.play('rotate').catch(function(){})},50)}},true);
/* first tap anywhere starts audio */
document.addEventListener('pointerdown',function(){R.audioInit()},{once:true,capture:true});
/* keyboard: Esc = exit */
addEventListener('keydown',function(e){if(e.key==='Escape'&&cur.state!=='menu')$('#hExit').click()});
/* Install and cache only the numbers game. */
if('serviceWorker' in navigator){
  addEventListener('load',function(){
    navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).catch(function(error){
      console.warn('숫자·도형 오프라인 준비 실패',error);
    });
  });
}
var navigation=hub.navigation(function(){return cur.state==='play'},function(){R.cancelAll();R.keepAwake(false)},{checkHub:true});
var selected=new URLSearchParams(location.search).get('activity');
var shortcut=hub.numbersActivities.find(function(item){return item.id===selected});
if(shortcut)navigation.invite(shortcut.label,function(){start(shortcut.id)});
/* test hooks */
window.RJ={cur:cur,R:R,state:function(){return {state:cur.state,mod:cur.mod&&cur.mod.key,idx:cur.idx,trace:R.traceState(),targets:R.targets.map(function(t){var o={type:t.type};if(t.el){var r=t.el.getBoundingClientRect();o.x=r.left+r.width/2;o.y=r.top+r.height/2;o.w=r.width;o.h=r.height}if(t.to){var q=t.to.getBoundingClientRect();o.tx=q.left+q.width/2;o.ty=q.top+q.height/2}return o}),bubble:!$('#bubble').classList.contains('hidden')&&$('#line').textContent,bubOv:Math.round(R.bubbleOverlap()),lang:R.S.lang,wake:!!R.wakeLockOn,choices:[].map.call(document.querySelectorAll('#choices:not(.hidden) button'),function(b){var r=b.getBoundingClientRect();return {t:b.textContent,x:r.left+r.width/2,y:r.top+r.height/2}}),modal:!$('#modal').classList.contains('hidden'),stickers:R.stickers.length,voice:R.voiceStats}},traceClientPts:R.traceClientPts,showMenu:showMenu,run:function(k,i){runFrom(R.MODS[k],i||0)}};
R.show('menu_hi');
})();
