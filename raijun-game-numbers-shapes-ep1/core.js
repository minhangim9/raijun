/* 라이준 숫자·도형 v2 — core engine: 16:9 stage, audio/voice, cancel-safe flow, trace, UI */
(function(){
'use strict';
var R=window.R={};
var $=R.$=function(s){return document.querySelector(s)};
var stage=$('#stage'),wrap=$('#wrap');
R.FAST=/[?&]fast/.test(location.search);
R.VER=window.RJ_VER||'dev';R.u=function(p){return p+'?v='+R.VER};
var hub=window.RaijunHub;
var language=hub.read('rj2_set').lang;
R.S={lang:['ko','en','es','zh','fr'].includes(language)?language:'ko'};
R.readSharedSettings=function(){
  var settings=hub.prefs();R.S.snd=settings.sound;R.S.vib=settings.vibration;
};
R.readSharedSettings();
R.save=function(){try{hub.write('rj2_set',{lang:R.S.lang})}catch(e){}};
R.calm=false;
var VIB_OK=('vibrate' in navigator);
/* ---------- stage fit 16:9 ---------- */
R.scale=1;R.ox=0;R.oy=0;
function fit(){
  var W=innerWidth,H=innerHeight,portrait=H>W;
  var hb=Math.max(48,Math.min(100,Math.round(Math.min(W,H)*.12)));
  document.documentElement.style.setProperty('--hb',hb+'px');
  var topRes=portrait?hb+70:0;
  var s=Math.min(W/1600,(H-topRes)/900);R.scale=s;
  R.ox=(W-1600*s)/2;R.oy=portrait?Math.max(topRes,(H-900*s)/2):(H-900*s)/2;
  stage.style.transform='translate('+R.ox+'px,'+R.oy+'px) scale('+s+')';
  var hud=$('#hud');var pad=8;
  if(portrait){hud.style.left='8px';hud.style.right='8px';hud.style.top=(R.oy-hb-10)+'px'}
  else{hud.style.left=(R.ox+pad)+'px';hud.style.right=(W-R.ox-1600*s+pad)+'px';hud.style.top=(R.oy+pad)+'px'}
  var rot=$('#rotate');rot.classList.toggle('hidden',!portrait);
  if(portrait){rot.style.top=(R.oy+900*s+10)+'px'}
  R.resizeTrace&&R.resizeTrace();
}
addEventListener('resize',fit);addEventListener('orientationchange',function(){setTimeout(fit,300)});fit();
R.toStage=function(cx,cy){return [(cx-R.ox)/R.scale,(cy-R.oy)/R.scale]};
R.toClient=function(x,y){return [R.ox+x*R.scale,R.oy+y*R.scale]};
R.rectStage=function(el){var r=el.getBoundingClientRect();var a=R.toStage(r.left,r.top),b=R.toStage(r.right,r.bottom);return {x:a[0],y:a[1],w:b[0]-a[0],h:b[1]-a[1],cx:(a[0]+b[0])/2,cy:(a[1]+b[1])/2}};
/* ---------- cancellation ---------- */
var CANCEL=R.CANCEL={cancel:true};var pending=[];R.runId=0;
R.mk=function(fn){var id=R.runId;return new Promise(function(res,rej){if(id!==R.runId)return rej(CANCEL);var o={rej:rej};pending.push(o);fn(function(v){var i=pending.indexOf(o);if(i>=0)pending.splice(i,1);if(id!==R.runId)rej(CANCEL);else res(v)})})};
R.cancelAll=function(){R.runId++;var p=pending;pending=[];p.forEach(function(o){o.rej(CANCEL)});stopVoice();R.clearHint();R.endTrace();R.targets=[];
  hideBubble();$('#choices').classList.add('hidden');$('#choices').innerHTML='';$('#fx').innerHTML='';R.rays(false);R.onCancel.forEach(function(f){try{f()}catch(e){}});R.onCancel=[]};
R.onCancel=[];
R.wait=function(ms){return R.mk(function(res){setTimeout(res,R.FAST?Math.min(ms,40):ms)})};
/* ---------- audio: WebAudio sfx + synth BGM ---------- */
var AC=null,master=null,bgmG=null;
R.audioInit=function(){if(AC){if(AC.state==='suspended')AC.resume();return}var C=window.AudioContext||window.webkitAudioContext;if(!C)return;try{AC=new C();master=AC.createGain();master.gain.value=R.S.snd?.6:0;master.connect(AC.destination);bgmG=AC.createGain();bgmG.gain.value=0;bgmG.connect(master);startBgm()}catch(e){AC=null}};
function now(){return AC?AC.currentTime:0}
function env(g,t,a,d,v){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d)}
function tone(f,d,type,v,glide,delay,dest){if(!AC)return;var t=now()+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(glide)o.frequency.exponentialRampToValueAtTime(glide,t+d);env(g,t,.01,d,(v||.3)*(R.calm?.6:1));o.connect(g);g.connect(dest||master);o.start(t);o.stop(t+d+.05)}
var nb=null;function noise(d,f1,f2,v,delay){if(!AC)return;if(!nb){nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);var a=nb.getChannelData(0);for(var i=0;i<a.length;i++)a[i]=Math.random()*2-1}var t=now()+(delay||0),s=AC.createBufferSource(),bp=AC.createBiquadFilter(),g=AC.createGain();s.buffer=nb;s.loop=true;bp.type='bandpass';bp.Q.value=1.2;bp.frequency.setValueAtTime(f1,t);bp.frequency.exponentialRampToValueAtTime(f2,t+d);env(g,t,.04,d,(v||.25)*(R.calm?.5:1));s.connect(bp);bp.connect(g);g.connect(master);s.start(t);s.stop(t+d+.1)}
R.sfx={
  tap:function(){tone(660,.08,'triangle',.18)},
  ding:function(){tone(1318,.5,'sine',.22);tone(1976,.6,'sine',.13,0,.06)},
  pop:function(){tone(900,.12,'square',.1,180);noise(.12,3000,800,.18)},
  whoosh:function(){noise(.45,400,3200,.25)},
  clunk:function(){tone(140,.15,'square',.16,70);noise(.08,900,300,.22)},
  thump:function(d){tone(90,.25,'sine',.45,40,d||0);noise(.1,300,120,.25,d||0)},
  boing:function(){tone(220,.35,'sine',.25,520)},
  fanfare:function(){[523,659,784,1046].forEach(function(f,i){tone(f,.3,'triangle',.2,0,i*.12)});tone(1568,.7,'sine',.14,0,.5)},
  chime:function(){[784,988,1175].forEach(function(f,i){tone(f,.6,'sine',.14,0,i*.15)})},
  horn:function(){tone(440,.25,'sawtooth',.1);tone(554,.25,'sawtooth',.08);tone(440,.3,'sawtooth',.1,0,.3);tone(554,.3,'sawtooth',.08,0,.3)},
  rustle:function(){noise(1,500,1500,.2)},
  water:function(){for(var i=0;i<6;i++)tone(900+Math.random()*600,.12,'sine',.08,300,i*.08)},
  whistle:function(n){if(!AC)return;for(var i=0;i<(n||1);i++){var s=now()+i*.7,o=AC.createOscillator(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();o.frequency.setValueAtTime(1100,s);o.frequency.exponentialRampToValueAtTime(1900,s+.25);o.frequency.exponentialRampToValueAtTime(1500,s+.5);l.frequency.value=9;lg.gain.value=40;l.connect(lg);lg.connect(o.frequency);env(g,s,.05,.5,.16);o.connect(g);g.connect(master);o.start(s);l.start(s);o.stop(s+.6);l.stop(s+.6)}},
  rain:function(){for(var i=0;i<12;i++)R.sfx.thump(i*.07)},
  bead:function(p){tone(980+p*500,.06,'sine',.16,260);tone(2400,.018,'square',.035)}
};
var hum=null;
R.humOn=function(){if(!AC||hum)return;var o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=300;o2.frequency.value=603;g.gain.setValueAtTime(0.0001,now());g.gain.exponentialRampToValueAtTime(R.calm?.04:.07,now()+.08);o.connect(g);o2.connect(g);g.connect(master);o.start();o2.start();hum={o:o,o2:o2,g:g}};
R.humSet=function(p){if(hum){hum.o.frequency.setTargetAtTime(300+p*500,now(),.05);hum.o2.frequency.setTargetAtTime(603+p*1000,now(),.05)}};
R.humOff=function(){if(!hum)return;var h=hum;hum=null;h.g.gain.setTargetAtTime(0.0001,now(),.05);setTimeout(function(){try{h.o.stop();h.o2.stop()}catch(e){}},300)};
/* gentle procedural BGM, ducked under voice */
var bgmTimer=null,bstep=0;
function startBgm(){if(bgmTimer)return;var sc=[0,2,4,7,9,12,14,16];bgmTimer=setInterval(function(){if(!AC||!R.S.snd)return;var base=R.calm?220:262;var pat=R.calm?[0,4,2,5,3,6,4,1]:[0,2,4,5,4,2,6,4];var n=sc[pat[bstep%8]];var f=base*Math.pow(2,n/12);tone(f,R.calm?.9:.45,'sine',.5,0,0,bgmG);if(bstep%4===0)tone(base/2,1.2,'triangle',.35,0,0,bgmG);bstep++},R.calm?600:380)}
R.bgm=function(on){if(!bgmG)return;bgmG.gain.setTargetAtTime(on&&R.S.snd?(voicePlaying?.018:.07):0,now(),.3)};
var bgmOn=false;
R.setBgm=function(on){bgmOn=on;R.bgm(on)};
R.setSound=function(on){if(master)master.gain.setTargetAtTime(on?.6:0,now(),.05);R.bgm(bgmOn)};
/* ---------- voice (pre-generated mp3 files) ---------- */
var voice=new Audio();voice.preload='auto';var voicePlaying=false,lastVoice=null;
function duck(on){voicePlaying=on;if(bgmG)bgmG.gain.setTargetAtTime(bgmOn&&R.S.snd?(on?.018:.07):0,now(),.12)}
function stopVoice(){try{voice.pause()}catch(e){}duck(false)}
R.stopVoice=stopVoice;
R.voiceStats={played:0,errors:0,ok:{}};
R.play=function(id,lang){ // resolves when finished
  lastVoice=id;
  return R.mk(function(res){
    if(!R.S.snd||R.FAST){setTimeout(res,R.FAST?30:600);return}
    var L=lang||R.S.lang;var done=false;function fin(){if(done)return;done=true;duck(false);res()}
    try{voice.onended=fin;voice.onerror=function(){R.voiceStats.errors++;fin()};voice.src=R.u('audio/'+L+'/'+id+'.mp3');duck(true);
      var p=voice.play();if(p&&p.catch)p.catch(function(){fin()});R.voiceStats.played++;
      voice.onloadedmetadata=function(){R.voiceStats.ok[id]=voice.duration;setTimeout(fin,(voice.duration||6)*1000+1500)};
      setTimeout(fin,12000)}catch(e){fin()}
  });
};
R.replay=function(){if(lastVoice){R.audioInit();var id=lastVoice;var L=window.LINES[id];if(L)showBubble(L.w,L);if(!R.S.snd)return;try{voice.src=R.u('audio/'+R.S.lang+'/'+id+'.mp3');duck(true);voice.onended=function(){duck(false)};voice.play().catch(function(){})}catch(e){}}};
/* ---------- bubble + lines ---------- */
var NAMES={raijun:{ko:'라이준',en:'Raijun',es:'Raijun',zh:'莱俊',fr:'Raijun'},raa:{ko:'라아',en:'Raa',es:'Raa',zh:'拉阿',fr:'Raa'},eodumi:{ko:'어두미',en:'Eodumi',es:'Eodumi',zh:'小黑',fr:'Eodumi'},puss:{ko:'범고래 푸스',en:'Puss',es:'Puss la orca',zh:'虎鲸普斯',fr:'Puss l’orque'},nemo:{ko:'네모',en:'Nemo',es:'Nemo',zh:'方方',fr:'Nemo'},mari:{ko:'코끼리 마리',en:'Mari',es:'Mari',zh:'大象玛丽',fr:'Mari'},narr:{ko:'이야기',en:'Story',es:'Cuento',zh:'故事',fr:'Histoire'},all:{ko:'다 같이',en:'Everyone',es:'Todos',zh:'大家',fr:'Tous'},tokki:{ko:'토끼',en:'Bunny',es:'Conejita',zh:'小兔子',fr:'Lapinou'},daram:{ko:'다람쥐',en:'Squirrel',es:'Ardilla',zh:'小松鼠',fr:'Écureuil'},gosum:{ko:'고슴도치',en:'Hedgehog',es:'Erizo',zh:'小刺猬',fr:'Hérisson'},en:{ko:'English',en:'English',es:'English',zh:'English',fr:'English'}};
R.LANGS=[['ko','한국어'],['en','English'],['es','Español'],['zh','中文'],['fr','Français']];
var COL={raijun:'#ff8a1e',raa:'#1e9bff',eodumi:'#7a3fa0',puss:'#1b3b5a',nemo:'#2f86e0',mari:'#8a6fc0',narr:'#5a8a3a',all:'#e23a6a',tokki:'#d0608a',daram:'#b8742a',gosum:'#6a5a3a',en:'#1b6b8f'};
R.T=function(o){var l=R.S.lang;if(typeof o==='string'){var L=window.LINES[o];return L?(L[l]||L.en):o}return o[l]||o.en||o.ko};
var bubble=$('#bubble'),curLine=null;
function showBubble(who,L){bubble.classList.remove('hidden');$('#who').textContent=NAMES[who]?(NAMES[who][R.S.lang]||NAMES[who].en):'';$('#who').style.background=COL[who]||COL.narr;var tx=L[R.S.lang]||L.en;$('#line').textContent=tx;bubble.classList.toggle('long',tx.length>(R.S.lang==='zh'?34:66));
  document.querySelectorAll('.ch.talk').forEach(function(c){c.classList.remove('talk')});var c=document.querySelector('.ch[data-who="'+who+'"]');if(c)c.classList.add('talk');R.layoutBubble()}
function hideBubble(){bubble.classList.add('hidden');document.querySelectorAll('.ch.talk').forEach(function(c){c.classList.remove('talk')})}
R.hideBubble=hideBubble;
/* ---- bubble placement: never cover targets, slots, numbers, HUD ---- */
var CANDS=[
 {c:'',s:{left:'50%',right:'auto',top:'148px',bottom:'auto',transform:'translateX(-50%)'}},
 {c:'side',s:{left:'auto',right:'22px',top:'150px',bottom:'auto',transform:'none'}},
 {c:'side',s:{left:'22px',right:'auto',top:'150px',bottom:'auto',transform:'none'}},
 {c:'',s:{left:'50%',right:'auto',top:'auto',bottom:'22px',transform:'translateX(-50%)'}},
 {c:'side',s:{left:'auto',right:'22px',top:'auto',bottom:'22px',transform:'none'}},
 {c:'side',s:{left:'22px',right:'auto',top:'auto',bottom:'22px',transform:'none'}},
 {c:'side',s:{left:'50%',right:'auto',top:'138px',bottom:'auto',transform:'translateX(-50%)'}},
 {c:'side',s:{left:'50%',right:'auto',top:'auto',bottom:'22px',transform:'translateX(-50%)'}}];
var AVOID='.slot,.bignum,.popTxt,.need,.cntBadge,.numTag,.plate,.cloud,.seed,.hole,.berry,.blk,.planet,.station,.mcircle,.bubbleEgg,.mtItem,.stk,.dropHint,.tile,.gSlot,#choices button,#map,.giftPop,#book,.cdBtn,.gFlag,.gStar,.gHatch,.gPole,.gBead';
R.avoidRects=function(){var out=[];function add(e){if(!e||!e.getClientRects().length)return;var r=R.rectStage(e);if(r.w>2&&r.h>2&&r.x<1600&&r.y<900&&r.x+r.w>0&&r.y+r.h>0)out.push(r)}
  (R.targets||[]).forEach(function(t){add(t.el);add(t.to)});document.querySelectorAll(AVOID).forEach(add);
  var tb=R.traceBBox&&R.traceBBox();if(tb){var a=R.toStage(tb[0],tb[1]),b=R.toStage(tb[2],tb[3]);out.push({x:a[0],y:a[1],w:b[0]-a[0],h:b[1]-a[1]})}
  if(!$('#hud').classList.contains('hidden'))document.querySelectorAll('#hud .hb').forEach(add);return out};
function ovArea(b,rs){var s=0;rs.forEach(function(r){var w=Math.min(b.x+b.w,r.x+r.w)-Math.max(b.x,r.x),h=Math.min(b.y+b.h,r.y+r.h)-Math.max(b.y,r.y);if(w>0&&h>0)s+=w*h});return s}
R.ovArea=ovArea;
function applyC(k){var c=CANDS[k];bubble.classList.toggle('side',c.c==='side');for(var p in c.s)bubble.style[p]=c.s[p];bubble._ci=k}
R.layoutBubble=function(){if(bubble.classList.contains('hidden'))return;var rs=R.avoidRects(),best=-1,bo=1e12;
  for(var k=0;k<CANDS.length;k++){applyC(k);var o=ovArea(R.rectStage(bubble),rs);if(o===0)return;if(o<bo){bo=o;best=k}}applyC(best)};
R.bubbleOverlap=function(){if(bubble.classList.contains('hidden'))return 0;return ovArea(R.rectStage(bubble),R.avoidRects())};
setInterval(function(){if(!bubble.classList.contains('hidden')&&R.bubbleOverlap()>0)R.layoutBubble()},250);
R.refreshBubble=function(){if(curLine&&!bubble.classList.contains('hidden'))showBubble(curLine.w,curLine)};
/* say: show + voice, resolves after voice (tap to skip) */
var skipFn=null;
R.say=function(id){var L=window.LINES[id];if(!L){console.warn('no line',id);return R.wait(10)}curLine=L;showBubble(L.w,L);
  var p=R.play(id);var t0=performance.now();
  return R.mk(function(res){var ok=false;function go(){if(ok)return;ok=true;skipFn=null;res()}
    skipFn=function(){if(performance.now()-t0>500){stopVoice();go()}};
    p.then(function(){setTimeout(go,R.FAST?10:350)},function(){})})};
R.show=function(id){var L=window.LINES[id];if(!L)return;curLine=L;showBubble(L.w,L);R.play(id).catch(function(){})};
stage.addEventListener('pointerup',function(e){if(skipFn&&!e.target.closest('button')&&!e.target.closest('.tap,.blk,.seed,.bubbleEgg,.mcircle,.planet,#trace'))skipFn()});
R.praise=function(extra){var ids=['p1','p2','p3','p4','p5','p6'].concat(extra||[]);var id=ids[Math.floor(Math.random()*ids.length)];R.cheer();R.sfx.chime();R.vib([30,40,60]);return R.say(id)};
/* ---------- choices ---------- */
R.choice=function(items){var box=$('#choices');box.innerHTML='';box.classList.remove('hidden');R.targets=[];
  return R.mk(function(res){items.forEach(function(it,i){var b=document.createElement('button');b.className='big'+(it.alt?' alt':'');b.innerHTML=(it.icon||'')+'<span>'+R.T(it.t)+'</span>';b.dataset.i=i;
    b.addEventListener('click',function(ev){ev.stopPropagation();R.audioInit();R.sfx.tap();R.vib(15);box.classList.add('hidden');R.clearHint();R.targets=[];res(i)});box.appendChild(b);R.targets.push({type:'tap',el:b})});
    R.hint('h_tap',function(){return box.children[0]})})};
/* ---------- fx ---------- */
var fx=$('#fx');
R.el=function(tag,cls,html,parent){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(parent)parent.appendChild(e);return e};
R.countPop=function(n,x,y){R.popText('<b>'+n+'</b><small>'+R.T('cnt'+n).replace(/[!！]/g,'')+'</small>',x,y)};
R.popText=function(txt,x,y,en){var e=R.el('div','popTxt'+(en?' en':''),txt,fx);e.style.left=x+'px';e.style.top=y+'px';setTimeout(function(){e.remove()},1700)};
R.sparks=function(){};R._sparksOld=function(x,y,n){for(var i=0;i<(n||14);i++){var s=R.el('div','spark',null,fx);var a=Math.random()*6.28,r=80+Math.random()*200;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--x',Math.cos(a)*r+'px');s.style.setProperty('--y',Math.sin(a)*r+'px');setTimeout(function(e){e.remove()}.bind(null,s),950)}};
R.burst=function(){};R._burstOld=function(x,y){var b=R.el('div','burst',null,fx);b.style.left=x+'px';b.style.top=y+'px';setTimeout(function(){b.remove()},950)};
R.rays=function(){};R._raysOld=function(on,x,y){var r=$('#rays');if(x!=null){r.style.transformOrigin='50% 50%';r.style.left=(x-1200)+'px';r.style.top=(y-850)+'px';r.style.right='auto';r.style.bottom='auto';r.style.width='2400px';r.style.height='1700px'}r.classList.toggle('on',!!on)};
R.vib=function(p){if(R.S.vib&&VIB_OK){try{navigator.vibrate(p)}catch(e){}}};
/* cinematic camera on #cam */
R.cam=function(o,ms){var c=$('#cam');o=o||{};c.style.transition='transform '+(ms==null?900:ms)+'ms cubic-bezier(.45,0,.25,1)';c.style.transformOrigin=(o.ox||'50%')+' '+(o.oy||'60%');
  var t='translate('+(o.x||0)+'px,'+(o.y||0)+'px) scale('+(o.z||1)+')';if(o.r)t='rotate('+o.r+'deg) '+t;c.style.transform=(t==='translate(0px,0px) scale(1)')?'':t};
/* shape-morph polygons (12 pts) */
function poly(kind,cx,cy,r){var p=[];for(var i=0;i<12;i++){var a=-Math.PI/2+i*Math.PI*2/12,x,y;
  if(kind==='circle'){x=cx+Math.cos(a)*r;y=cy+Math.sin(a)*r}
  else if(kind==='square'){var t=i/12*4,side=Math.floor(t),f=t-side;var pts=[[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]];var A=pts[side],B=pts[side+1];x=cx+(A[0]+(B[0]-A[0])*f)*r;y=cy+(A[1]+(B[1]-A[1])*f)*r}
  else{var tt=i/12*3,sd=Math.floor(tt),ff=tt-sd;var T=[[0,-1.1],[1,.75],[-1,.75],[0,-1.1]];var A2=T[sd],B2=T[sd+1];x=cx+(A2[0]+(B2[0]-A2[0])*ff)*r;y=cy+(A2[1]+(B2[1]-A2[1])*ff)*r}
  p.push(x.toFixed(1)+'px '+y.toFixed(1)+'px')}return 'polygon('+p.join(',')+')'}
R.poly=poly;
/* scene transition: shape iris (circle -> square cover, triangle reveal) */
R.transition=function(mid){ /* heroes walk on a little, then a plain cut (no fading layers) */
  if(R.FAST){try{if(mid)mid()}catch(e){console.error(e)}return Promise.resolve()}
  var hs=['raijun','raa'].map(function(w){return document.querySelector('#cast .ch[data-who="'+w+'"]')}).filter(Boolean);
  var pre=hs.length?new Promise(function(r){hs.forEach(function(c){c.style.transition='left .75s ease-in-out, rotate .5s ease';c.style.rotate='0deg';c.classList.add('walking');c.style.left=(parseFloat(c.style.left)+230)+'px'});setTimeout(r,780)}):Promise.resolve();
  return pre.then(function(){try{if(mid)mid()}catch(e){console.error(e)}
    var bi=$('#bgimg');return new Promise(function(res){if(bi.complete&&bi.naturalWidth)return res();var d=false;var f=function(){if(!d){d=true;res()}};bi.addEventListener('load',f,{once:true});bi.addEventListener('error',f,{once:true});setTimeout(f,2500)})})};
/* shape morph reward: circle->triangle->square glow */
R.morphFx=function(){};R._morphOld=function(x,y,seq){var m=R.el('div','morph',null,fx);m.style.left=x+'px';m.style.top=y+'px';seq=seq||['circle','tri','square'];m.style.clipPath=poly(seq[0],150,150,6);
  var i=0;setTimeout(function step(){if(i>=seq.length){m.style.opacity=0;m.style.transform='scale(2.2)';setTimeout(function(){m.remove()},500);return}m.style.clipPath=poly(seq[i],150,150,130);i++;R.sfx.tap();setTimeout(step,420)},30)};
/* ---------- stickers + inventory ---------- */
R.stickers=[];
var INV_KEY=hub.inventoryKey;
var inventoryGroups=['stickers','items','rides','episodes'];
function readInventory(){
  var raw=hub.read(INV_KEY), result={schema:1,board:[]};
  if(raw.schema!==1)raw={};
  inventoryGroups.forEach(function(group){result[group]=hub.record(raw[group])});
  if(Array.isArray(raw.board))result.board=raw.board;
  return result;
}
var lastInventory=readInventory();
R.inv=structuredClone(lastInventory);
R.refreshInv=function(){lastInventory=readInventory();R.inv=structuredClone(lastInventory);R.onBook&&R.onBook()};
R.saveInv=function(){
  var latest=readInventory();
  inventoryGroups.forEach(function(group){
    Object.keys(R.inv[group]).forEach(function(key){
      if(JSON.stringify(lastInventory[group][key])!==JSON.stringify(R.inv[group][key]))latest[group][key]=R.inv[group][key];
    });
  });
  if(JSON.stringify(lastInventory.board)!==JSON.stringify(R.inv.board))latest.board=R.inv.board;
  latest.updated=new Date().toISOString();
  try{hub.write(INV_KEY,latest)}catch(e){return}
  lastInventory=structuredClone(latest);
  R.inv=latest;
};
addEventListener('storage',function(e){if(!e.key||e.key===INV_KEY)R.refreshInv()});
addEventListener('pageshow',function(e){if(e.persisted)R.refreshInv()});
R.GIFTS=[{id:'fig_raijun',kind:'items',need:3},{id:'fig_raa',kind:'items',need:6},{id:'ride_shape_cart',kind:'rides',sticker:'cart'},{id:'cert',kind:'items',need:10},{id:'ride_boat',kind:'rides',sticker:'boat'},{id:'key_hatch',kind:'items',need:12}];
R.newGifts=function(){var n=Object.keys(R.inv.stickers).length,out=[];R.GIFTS.forEach(function(g){if(R.inv[g.kind][g.id])return;if((g.need&&n>=g.need)||(g.sticker&&R.inv.stickers[g.sticker])){R.inv[g.kind][g.id]={got:new Date().toISOString(),usable_in:'next_episodes'};out.push(g)}});if(out.length)R.saveInv();return out};
R.award=function(key,icon){if(R.stickers.some(function(s){return s.key===key}))return R.wait(10);R.stickers.push({key:key,icon:icon});
  if(!R.inv.stickers[key]){R.inv.stickers[key]={icon:icon,got:new Date().toISOString()};R.saveInv()}R.onBook&&R.onBook();R.cheer();R.sfx.fanfare();R.vib([30,30,30,30,90]);
  var big=R.el('div','bignum soft','<b style="font-size:220px">'+icon+'</b>',fx);setTimeout(function(){big.remove()},1500);
  return R.say('sticker').then(function(){var g=R.newGifts();var p=Promise.resolve();g.forEach(function(x){p=p.then(function(){return R.showGift?R.showGift(x.id):null})});return p})};
R.resetStickers=function(){R.stickers=[]};
/* ---------- hints after 3s idle ---------- */
var hintCfg=null,lastInput=performance.now();
stage.addEventListener('pointerdown',function(){lastInput=performance.now();$('#hand').classList.add('hidden')},true);
R.hint=function(id,targetFn){hintCfg={id:id,fn:targetFn,last:performance.now(),n:0};lastInput=performance.now()};
R.clearHint=function(){hintCfg=null;$('#hand').classList.add('hidden')};
setInterval(function(){if(!hintCfg||R.FAST)return;var t=performance.now();if(t-lastInput>3000&&t-hintCfg.last>(hintCfg.n?8000:3000)&&!voicePlaying&&!document.querySelector('#modal:not(.hidden)')){hintCfg.last=t;hintCfg.n++;
  var tg=hintCfg.fn&&hintCfg.fn();if(tg){var p=tg.nodeType?(function(){var r=R.rectStage(tg);return [r.cx,r.cy]})():tg;var h=$('#hand');h.style.left=p[0]+'px';h.style.top=p[1]+'px';h.classList.remove('hidden')}
  if(R.S.snd&&hintCfg.n<=3){try{voice.src=R.u('audio/'+R.S.lang+'/'+hintCfg.id+'.mp3');duck(true);voice.onended=function(){duck(false)};voice.play().catch(function(){})}catch(e){}}}},500);
/* ---------- tap targets (generic) ---------- */
R.targets=[];
R.waitTap=function(el,hintId){R.targets=[{type:'tap',el:el}];R.hint(hintId||'h_tap',function(){return el});return R.mk(function(res){function h(e){e.stopPropagation();el.removeEventListener('pointerdown',h);R.audioInit();R.clearHint();R.targets=[];res(e)}el.addEventListener('pointerdown',h)})};
/* ---------- TRACE ---------- */
var cv=$('#trace'),ctx=cv.getContext('2d'),DPR=1,tr=null;
R.resizeTrace=function(){DPR=Math.min(2.5,(window.devicePixelRatio||1)*R.scale);cv.width=Math.round(1600*DPR);cv.height=Math.round(900*DPR)};R.resizeTrace();
function samplePoly(pts,step){var out=[pts[0]];for(var i=1;i<pts.length;i++){var a=pts[i-1],b=pts[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(d/step));for(var j=1;j<=n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n])}return out}
R.samplePoly=samplePoly;
R.bez=function(p0,p1,p2,p3,n){var o=[];n=n||24;for(var i=0;i<=n;i++){var t=i/n,u=1-t;o.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]])}return o};
R.circlePts=function(cx,cy,r){var o=[];for(var i=0;i<=40;i++){var a=-Math.PI/2-i*Math.PI*2/40;o.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}return o}; // CCW from top
/* opts: strokes (stage px polylines), lw, tol, labels(voice ids per stroke), onStroke(i,midPt), calm */
R.trace=function(opts){
  return R.mk(function(res){
    var raw=opts.strokes,lw0=opts.lw||60;
    if(opts.fit){var xs=[],ys=[];raw.forEach(function(s){s.forEach(function(p){xs.push(p[0]);ys.push(p[1])})});var x0=Math.min.apply(0,xs),x1=Math.max.apply(0,xs),y0=Math.min.apply(0,ys),y1=Math.max.apply(0,ys);
      var sx=opts.sx||1,k=Math.min(opts.fit/Math.max(1,y1-y0),(opts.fitW||1180)/Math.max(1,(x1-x0)*sx));var cx=opts.cx||800,cy=opts.cy||520,bx=(x0+x1)/2,by=(y0+y1)/2;
      raw=raw.map(function(s){return s.map(function(p){return [cx+(p[0]-bx)*k*sx,cy+(p[1]-by)*k]})})}
    var strokes=raw.map(function(s){return samplePoly(s,8)});
    var minL=Math.min.apply(0,strokes.map(function(s){return (s.length-1)*8}));var BR=opts.br||Math.max(40,Math.min(55,minL*.3));
    /* v2.7: sparse beads — centre spacing ~4 radii, so the gap between bead edges is about one bead diameter; a chevron sits in each gap */
    var beads=strokes.map(function(s){var n=s.length,L=(n-1)*8,closed=Math.hypot(s[0][0]-s[n-1][0],s[0][1]-s[n-1][1])<20,nb=Math.max(closed?4:2,Math.round(L/(BR*4))+1),o=[];for(var q=0;q<nb;q++){if(closed&&q===nb-1&&nb>4){}o.push({i:Math.round(q*(n-1)/(nb-1)),t:0})}return o});
    tr={t0:performance.now(),o:opts,strokes:strokes,beads:beads,br:BR,si:0,idx:0,active:null,res:res,parts:[],lastMove:performance.now(),lw:Math.max(lw0,BR*2),tol:opts.tol||(R.calm?170:140),done:false,demo:(R.FAST||opts.noDemo)?null:{t0:performance.now()+350}};
    R.resizeTrace();cv.classList.remove('hidden');R.layoutBubble&&setTimeout(R.layoutBubble,0);R.lean(true);R.targets=[{type:'trace'}];
    if(tr.demo){var rj=document.querySelector('#cast .ch[data-who="raijun"]');if(rj)R.hop('raijun');if(!R._demoSaid){R._demoSaid=1;R.show('demo1')}}
    if(opts.labels&&opts.labels[0]&&!tr.demo)R.show(opts.labels[0]);else if(!tr.demo&&!R._beadIntro){R._beadIntro=1;R.show('bead1')}
    R.hint(R.calm?'h_trace':'h_trace',function(){var p=tr&&tr.strokes[tr.si][tr.idx];return p?[p[0],p[1]]:null});
  });
};
R.endTrace=function(){if(tr){tr=null;R.humOff()}cv.classList.add('hidden');R.lean(false)};
R.traceState=function(){return tr?{demo:!!tr.demo,si:tr.si,idx:tr.idx,n:tr.strokes[tr.si]?tr.strokes[tr.si].length:0,ns:tr.strokes.length}:null};
R.traceBBox=function(){if(!tr)return null;var xs=[],ys=[];tr.strokes.forEach(function(s){s.forEach(function(p){var q=R.toClient(p[0],p[1]);xs.push(q[0]);ys.push(q[1])})});var h=tr.lw*R.scale/2;return [Math.min.apply(0,xs)-h,Math.min.apply(0,ys)-h,Math.max.apply(0,xs)+h,Math.max.apply(0,ys)+h]};
R.traceClientPts=function(){if(!tr||tr.done)return null;return tr.strokes[tr.si].slice(tr.idx).map(function(p){return R.toClient(p[0],p[1])})};
function sp(e){return R.toStage(e.clientX,e.clientY)}
cv.addEventListener('pointerdown',function(e){e.preventDefault();if(!tr||tr.done||tr.active!==null)return;if(tr.demo){tr.demo.skip=1;return}R.audioInit();var u=sp(e),p=tr.strokes[tr.si][tr.idx];
  if(Math.hypot(u[0]-p[0],u[1]-p[1])<tr.tol*1.5){tr.active=e.pointerId;try{cv.setPointerCapture(e.pointerId)}catch(x){}R.vib(15);popTo(0);move(u)}else{tr.nudge=performance.now();R.vib([10,40,10])}});
cv.addEventListener('pointermove',function(e){if(!tr||e.pointerId!==tr.active)return;e.preventDefault();var list=(e.getCoalescedEvents&&e.getCoalescedEvents())||[];if(!list.length)list=[e];for(var i=0;i<list.length&&tr&&tr.active!==null;i++)move(sp(list[i]))});
function endP(e){if(tr&&e.pointerId===tr.active){tr.active=null;R.humOff()}}
['pointerup','pointercancel','lostpointercapture'].forEach(function(n){cv.addEventListener(n,endP)});
var lastBuzz=0;
function move(u){var pts=tr.strokes[tr.si],best=-1,bd=1e9;tr.lastMove=performance.now();
  for(var i=tr.idx;i<Math.min(pts.length,tr.idx+14);i++){var d=Math.hypot(u[0]-pts[i][0],u[1]-pts[i][1]);if(d<bd){bd=d;best=i}}
  if(bd<tr.tol&&best>tr.idx){tr.idx=best;popTo(tr.idx);if(tr.idx>=pts.length-2)strokeDone()}}
function popTo(ix){var bs=tr.beads[tr.si],n=bs.length,t=performance.now();for(var k=0;k<n;k++){var b=bs[k];if(!b.t&&b.i<=ix+2){b.t=t;R.sfx.bead(k/n);if(t-lastBuzz>45){lastBuzz=t;R.vib(15)}}}}
function strokeDone(){var o=tr.o;R.humOff();var tn=performance.now();tr.beads[tr.si].forEach(function(b){if(!b.t)b.t=tn});R.sfx.ding();R.vib([30,40,60]);var pts=tr.strokes[tr.si],e=pts[pts.length-1];R.hop('raa');tr.active=null;var fin=tr.si;
  if(o.onStroke)o.onStroke(fin,pts[Math.floor(pts.length/2)]);tr.si++;
  if(tr.si>=tr.strokes.length){tr.done=performance.now();var r=tr.res;R.clearHint();R.targets=[];setTimeout(function(){if(!tr)return;var keep=o.keep;tr=null;R.lean(false);R.cheer();if(!keep)cv.classList.add('hidden');if(o.quiet||R.FAST)r();else R.praise().then(r,r)},R.FAST?30:700);return}
  tr.idx=0;if(o.labels&&o.labels[tr.si])R.show(o.labels[tr.si])}
function path(pts,ox,oy){ctx.beginPath();for(var i=0;i<pts.length;i++){if(i)ctx.lineTo(pts[i][0]+ox,pts[i][1]+oy);else ctx.moveTo(pts[i][0]+ox,pts[i][1]+oy)}}
function rail(pts,lw,depth,top,side){if(pts.length<2)return;ctx.lineCap='round';ctx.lineJoin='round';if(depth>0)for(var d=depth;d>0;d-=Math.max(1,depth/6)){ctx.strokeStyle=side;ctx.lineWidth=lw;path(pts,d*.6,d);ctx.stroke()}ctx.strokeStyle=top;ctx.lineWidth=lw;path(pts,0,0);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=lw*.16;path(pts,-lw*.2,-lw*.2);ctx.stroke()}
R.drawOrb=function(c,x,y,r){c.save();
  for(var i=0;i<3;i++){c.strokeStyle=['#ffcf3a','#f5b42a','#e89a1e'][i];c.lineWidth=Math.max(3,r*(.18-i*.03));c.beginPath();c.arc(x,y,r*(1.4+i*.5),0,6.29);c.stroke()}
  var cc=c.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r);cc.addColorStop(0,'#fff3c0');cc.addColorStop(.4,'#ffc531');cc.addColorStop(1,'#f07800');c.fillStyle=cc;c.beginPath();c.arc(x,y,r,0,6.29);c.fill();c.restore()};
function star(x,y,r){ctx.beginPath();for(var i=0;i<8;i++){var a=i*Math.PI/4,rr=i%2?r*.35:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();ctx.fill()}
function beadSprite(gold){var s=document.createElement('canvas'),R0=64;s.width=s.height=R0*2+8;var g=s.getContext('2d'),x=R0+4,y=R0+4;
  var cc=g.createRadialGradient(x-R0*.35,y-R0*.4,R0*.08,x,y,R0);if(gold){cc.addColorStop(0,'#fff6cf');cc.addColorStop(.35,'#ffd24a');cc.addColorStop(.8,'#f29a14');cc.addColorStop(1,'#c96a06')}else{cc.addColorStop(0,'#ffffff');cc.addColorStop(.25,'#f3f6fc');cc.addColorStop(.62,'#c3cddf');cc.addColorStop(1,'#7c8aa3')}
  g.fillStyle=cc;g.beginPath();g.arc(x,y,R0,0,6.29);g.fill();g.lineWidth=4;g.strokeStyle=gold?'#b35f05':'#8995ab';g.stroke();
  g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.ellipse(x-R0*.33,y-R0*.4,R0*.32,R0*.2,-.5,0,6.29);g.fill();return s}
var SPR={s:beadSprite(false),g:beadSprite(true)};
function drawBead(x,y,r,gold){var s=gold?SPR.g:SPR.s,k=r/64;ctx.drawImage(s,x-(64+4)*k,y-(64+4)*k,s.width*k,s.height*k)}
function chevron(x,y,ang,s,col,edge){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(-s*.45,-s*.62);ctx.lineTo(s*.35,0);ctx.lineTo(-s*.45,s*.62);
  ctx.lineWidth=s*.42;ctx.strokeStyle=edge;ctx.stroke();ctx.lineWidth=s*.26;ctx.strokeStyle=col;ctx.stroke();ctx.restore()}
function demoPos(d,now){/* tail light: runs every stroke in order, then flies back to the start bead */
  var per=900,gap=250,total=tr.strokes.length*(per+gap),t=now-d.t0;if(t<0)return {p:tr.strokes[0][0],end:false};
  if(t<total){var si=Math.floor(t/(per+gap)),u=Math.min(1,(t-si*(per+gap))/per),s=tr.strokes[si];return {p:s[Math.min(s.length-1,Math.round(u*(s.length-1)))],si:si,end:false}}
  var fly=Math.min(1,(t-total)/550),a=tr.strokes[tr.strokes.length-1],e=a[a.length-1],st=tr.strokes[0][0],f=fly<.5?2*fly*fly:1-Math.pow(-2*fly+2,2)/2;
  return {p:[e[0]+(st[0]-e[0])*f,e[1]+(st[1]-e[1])*f-Math.sin(Math.PI*fly)*120],end:fly>=1}}
function tailLight(x,y,r){ctx.fillStyle='#fff4c2';ctx.beginPath();ctx.arc(x,y,r*1.35,0,6.29);ctx.fill();ctx.lineWidth=5;ctx.strokeStyle='#ff9a1a';ctx.stroke();drawBead(x,y,r,true)}
(function draw(){requestAnimationFrame(draw);if(!tr)return;var now=performance.now(),BR=tr.br;
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,1600,900);ctx.lineCap='round';ctx.lineJoin='round';
  for(var i=tr.si;i<tr.strokes.length;i++){ctx.strokeStyle='rgba(255,248,230,.55)';ctx.lineWidth=BR*.22;path(tr.strokes[i],0,0);ctx.stroke()}
  var pulse=1+.06*Math.sin(now/380);
  // chevrons in the gaps
  for(var i=0;i<tr.strokes.length;i++){var st=tr.strokes[i],bs=tr.beads[i];
    for(var k=0;k+1<bs.length;k++){var a=st[bs[k].i],b=st[bs[k+1].i],mi=Math.round((bs[k].i+bs[k+1].i)/2),m=st[mi],q=st[Math.min(st.length-1,mi+2)],p0=st[Math.max(0,mi-2)],ang=Math.atan2(q[1]-p0[1],q[0]-p0[0]);
      var passed=i<tr.si||(i===tr.si&&bs[k+1].t),isNext=!tr.done&&!tr.demo&&i===tr.si&&bs[k].t&&!bs[k+1].t;
      if(passed)chevron(m[0],m[1],ang,BR*.62,'#ffd24a','#b35f05');
      else if(isNext)chevron(m[0],m[1],ang,BR*.78*pulse,'#ff7a1a','#9a3a06');
      else chevron(m[0],m[1],ang,BR*.62,i===tr.si?'#fff6e4':'rgba(255,246,228,.75)','#8a6a4a')}}
  if(!tr.ovc){tr.ovc=1;for(var i=1;i<tr.strokes.length;i++)tr.beads[i].forEach(function(b){var p=tr.strokes[i][b.i];for(var j=0;j<i;j++)tr.beads[j].forEach(function(c){var q=tr.strokes[j][c.i];if(Math.hypot(p[0]-q[0],p[1]-q[1])<BR*2.1)b.ov=1})})}
  // beads (future-stroke beads that overlap earlier beads stay hidden until their stroke is active)
  for(var i=tr.strokes.length-1;i>=0;i--){var st=tr.strokes[i],bs=tr.beads[i];
    for(var k=0;k<bs.length;k++){var b=bs[k],p=st[b.i],sc=1;if(b.ov&&i>tr.si&&!b.t)continue;if(b.t){var dt=now-b.t;if(dt<240)sc=1+.3*Math.sin(Math.PI*dt/240)}
      drawBead(p[0],p[1],BR*sc*(i<=tr.si?1:.88),!!b.t)}}
  // stroke-order numbers on start beads
  for(var i=tr.si;i<tr.strokes.length;i++){var b0=tr.beads[i][0];if(b0.t)continue;var p0=tr.strokes[i][b0.i],dup=0;for(var j=tr.si;j<i;j++){var q0=tr.strokes[j][tr.beads[j][0].i];if(!tr.beads[j][0].t&&Math.hypot(q0[0]-p0[0],q0[1]-p0[1])<BR)dup=1}if(dup)continue;ctx.fillStyle=i===tr.si?'#d4500f':'#8a6a4a';ctx.font='900 '+Math.round(BR*(i===tr.si?1.0:.85))+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),p0[0],p0[1]+BR*.06)}
  if(tr.demo){var d=tr.demo,dp=demoPos(d,now);tailLight(dp.p[0],dp.p[1],BR*.55);if(dp.end||d.skip){tr.demo=null;tr.lastMove=now;var o=tr.o;if(o.labels&&o.labels[0])R.show(o.labels[0])}return}
  if(!tr.done){var cur=tr.strokes[tr.si],bs=tr.beads[tr.si],nx=-1;for(var k=0;k<bs.length;k++)if(!bs[k].t){nx=k;break}
    if(nx>=0){var p=cur[bs[nx].i];ctx.strokeStyle='#ff7a1a';ctx.lineWidth=8;ctx.beginPath();ctx.arc(p[0],p[1],BR*1.18*(nx===0?pulse:1),0,6.29);ctx.stroke();
      if(nx===0&&tr.active===null)tailLight(p[0]+BR*.9,p[1]-BR*.9,BR*.38)}
    if(R.calm&&tr.active===null&&now-tr.lastMove>10000){tr.idx=Math.min(cur.length-2,tr.idx+6);popTo(tr.idx);tr.lastMove=now-9000;if(tr.idx>=cur.length-2)strokeDone()}}
})();
/* ---------- big number announcement ---------- */
R.bigNum=function(d,voiceId,enId){var b=R.el('div','bignum','<b>'+d+'</b><span>'+R.T(voiceId)+'</span>',fx);setTimeout(R.layoutBubble,0);R.cheer();R.sfx.fanfare();R.vib([40,30,80]);
  return R.say(voiceId).then(function(){if(enId&&R.S.lang==='ko'){R.popText(R.T(enId).replace('!',''),800,760,true);return R.play(enId,'en')}}).then(function(){b.remove();R.rays(false);bubble.classList.remove('side')},function(e){b.remove();R.rays(false);throw e})};
/* ---------- characters ---------- */
['bg_forest','bg_river','bg_space','bg_sea','bg_candy','raijun','raa','eodumi','mari','mari2','mari3','puss','rabbit','squirrel','hedgehog'].forEach(function(n){var i=new Image();i.src=R.u('img/'+n+'.webp')});
R.IMG={raijun:'img/raijun.webp',raa:'img/raa.webp',eodumi:'img/eodumi.webp',mari:'img/mari.webp',mari2:'img/mari2.webp',mari3:'img/mari3.webp',puss:'img/puss.webp',rabbit:'img/rabbit.webp',squirrel:'img/squirrel.webp',hedgehog:'img/hedgehog.webp'};
R.char=function(who,x,bottom,h,opts){opts=opts||{};var c=document.querySelector('#cast .ch[data-who="'+who+'"]'+(opts.id?'#'+opts.id:''));var fresh=!c;
  if(!c){c=R.el('div','ch alive',null,$('#cast'));var im=R.el('img','body',null,c);im.src=R.u(R.IMG[opts.img||who]);im.alt='';im.draggable=false;c.dataset.who=who;if(opts.id)c.id=opts.id;c.style.setProperty('--d',(Math.random()*-3).toFixed(2)+'s')}
  c.style.left=x+'px';c.style.bottom=bottom+'px';c.style.height=h+'px';if(opts.flip)c.querySelector('img').style.scale='-1 1';
  if(fresh){var im0=c.querySelector('img');var cl=function(){var w=c.offsetWidth,l=parseFloat(c.style.left);if(w>0){if(l<8)c.style.left='8px';else if(l+w>1592)c.style.left=(1592-w)+'px'}};if(im0.complete)cl();else im0.addEventListener('load',cl,{once:true})}
  if(opts.enter!==false){var k=(fresh&&(who==='raijun'||who==='raa')&&x<700)?'walkin':'in';c.classList.remove('in','walkin');void c.offsetWidth;c.classList.add(k);setTimeout(function(){c.classList.remove(k)},1300)}return c};
function chEl(w){return typeof w==='string'?document.querySelector('#cast .ch[data-who="'+w+'"]'):w}
R.chEl=chEl;
R.hop=function(w){var c=chEl(w);if(!c)return;c.classList.remove('hop');void c.offsetWidth;c.classList.add('hop');setTimeout(function(){c.classList.remove('hop')},800)};
R.cheer=function(){R.hop('raijun');setTimeout(function(){R.hop('raa')},180)};
R.lean=function(on){return;['raijun','raa'].forEach(function(w){var c=chEl(w);if(!c)return;var left=parseFloat(c.style.left)<800;c.style.rotate=on?(left?'5deg':'-5deg'):'0deg'})};
R.walkTo=function(w,x,ms){var c=chEl(w);if(!c)return R.wait(10);ms=ms||1200;c.style.transition='left '+ms+'ms ease-in-out, rotate .5s ease';c.classList.add('walking');c.style.left=x+'px';return R.wait(ms).then(function(){c.classList.remove('walking')},function(e){c.classList.remove('walking');throw e})};
setInterval(function(){if(!R.targets)return;var tx=null,t=R.targets[0];if(t&&t.el&&t.el.getClientRects().length){tx=R.rectStage(t.el).cx}else{var tb=R.traceBBox&&R.traceBBox();if(tb)tx=R.toStage((tb[0]+tb[2])/2,0)[0]}
  ['raijun','raa'].forEach(function(w){var c=chEl(w);if(!c||c.classList.contains('walking'))return;var cx=parseFloat(c.style.left)+c.offsetWidth/2;var d=tx==null?0:(tx<cx-80?-5:tx>cx+80?5:0);var v=d+'deg';if(c.style.rotate!==v)c.style.rotate=v})},400);
R.clearScene=function(bg){$('#cast').innerHTML='';$('#world').innerHTML='';$('#fx').innerHTML='';R.cam({},0);if(bg)$('#bgimg').src=R.u('img/'+bg+'.webp');$('#bgimg').style.transform=''};
/* journey map toward Puss (top centre, between HUD groups) */
R.map=function(stops,idx){var m=$('#map');if(!m)return;if(!stops){m.classList.add('hidden');return}m.classList.remove('hidden');
  if(m.dataset.n!=stops.length){m.innerHTML='<div class="mLine"></div>'+stops.map(function(s,i){return '<div class="mStop" style="left:'+(i/(stops.length-1)*100)+'%">'+s+'</div>'}).join('')+'<div class="mMe"><img src="'+R.u('img/raijun.webp')+'" alt=""></div>';m.dataset.n=stops.length}
  var me=m.querySelector('.mMe');me.style.left=(idx/(stops.length-1)*100)+'%';m.querySelectorAll('.mStop').forEach(function(s,i){s.classList.toggle('done',i<=idx)})};
/* ---------- modal ---------- */
R.modal=function(qId,btns){var m=$('#modal');$('#mQ').textContent=R.T(qId);var b=$('#mBtns');b.innerHTML='';m.classList.remove('hidden');
  btns.forEach(function(x){var e=document.createElement('button');e.textContent=R.T(x.t);if(x.alt)e.className='alt';e.id=x.id||'';e.onclick=function(ev){ev.stopPropagation();m.classList.add('hidden');R.sfx.tap();x.fn&&x.fn()};b.appendChild(e)});if(R.S.snd&&typeof qId==='string')try{voice.src=R.u('audio/'+R.S.lang+'/'+qId+'.mp3');voice.play().catch(function(){})}catch(e){}};
/* shape svgs */
var uid=0;
R.shapeSVG=function(kind,face,stretch){var d='',u='s'+(uid++);
  if(kind==='square'){d='<defs><linearGradient id="'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#2f86e0"/></linearGradient></defs><rect x="16" y="18" width="78" height="78" rx="10" fill="#174f8f"/><rect x="13" y="14" width="78" height="78" rx="10" fill="#1f62ad"/><rect x="8" y="8" width="78" height="78" rx="10" fill="url(#'+u+')"/><path d="M14 80V18q0-6 6-6h60" stroke="#e6f5ff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>';
    if(face)d+='<circle cx="33" cy="40" r="7" fill="#fff"/><circle cx="61" cy="40" r="7" fill="#fff"/><circle cx="34" cy="41" r="4" fill="#222"/><circle cx="62" cy="41" r="4" fill="#222"/><path d="M36 60q11 9 22 0" stroke="#173a66" stroke-width="4" fill="none" stroke-linecap="round"/>'}
  else if(kind==='circle'){d='<defs><radialGradient id="'+u+'" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffe37a"/><stop offset="1" stop-color="#e0961a"/></radialGradient></defs><circle cx="50" cy="54" r="44" fill="#151515"/><circle cx="50" cy="50" r="44" fill="#333"/><circle cx="50" cy="50" r="36" fill="#4a4a4a"/><g class="spin" style="transform-origin:50px 50px"><circle cx="50" cy="50" r="24" fill="url(#'+u+')" stroke="#b06a10" stroke-width="3"/><path d="M50 28v44M28 50h44M35 35l30 30M65 35L35 65" stroke="#b06a10" stroke-width="4" stroke-linecap="round"/></g>'}
  else{d='<defs><linearGradient id="'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9aa0"/><stop offset="1" stop-color="#e2343c"/></linearGradient></defs><polygon points="56,12 98,92 14,92" fill="#8f1c22"/><polygon points="53,10 95,88 11,88" fill="#b8262d"/><polygon points="50,6 92,84 8,84" fill="url(#'+u+')"/>'}
  return '<svg viewBox="0 0 100 100"'+(stretch?' preserveAspectRatio="none"':'')+'>'+d+'</svg>'};
})();
