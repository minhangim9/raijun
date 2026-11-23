/* 라이준 v2.5 — 스티커 북, 선물(인벤토리), 스티커 놀이(붙이기 · 같은 모양 잇기 · 숫자-개수 잇기 · 도형 이름 잇기), 선물 선반 */
(function(){
'use strict';
var R=window.R,$=R.$,say=R.say,wait=R.wait;
R.MODS=R.MODS||{};
function L5(ko,en,es,zh,fr){return {ko:ko,en:en,es:es,zh:zh,fr:fr}}
var STK=['log','ele','field','sprout','berry','share','cart','goal','planet','bridge','station','compare','boat','p_board','p_shape','p_num','p_name'];
var GN={fig_raijun:L5('라이준 피규어','Raijun figure','Figura de Raijun','莱俊小玩偶','Figurine Raijun'),fig_raa:L5('라아 피규어','Raa figure','Figura de Raa','拉阿小玩偶','Figurine Raa'),
  cert:L5('상장','Certificate','Diploma','奖状','Diplôme'),ride_shape_cart:L5('도형 수레 (탈것)','Shape cart (ride)','Carrito de formas','形状小车（坐骑）','Chariot des formes'),ride_boat:L5('작은 배 (탈것)','Little boat (ride)','Barquito','小船（坐骑）','Petit bateau'),key_hatch:L5('비밀 문 열쇠','Secret door key','Llave secreta','秘密之门钥匙','Clé secrète')};
var NEXT=L5('다음 화에서 탈 수 있어요','Ready for the next episode','Listo para el próximo episodio','下一集可以坐','Prêt pour le prochain épisode');
function need(g){var n=g.need;if(n)return R.T(L5('스티커 '+n+'개','Stickers: '+n,'Pegatinas: '+n,n+'张贴纸','Autocollants : '+n));return R.T(g.sticker==='cart'?L5('수레 스티커','Cart sticker','Pegatina del carrito','小车贴纸','Autocollant chariot'):L5('배 스티커','Boat sticker','Pegatina del barco','小船贴纸','Autocollant bateau'))}
/* ---------- art ---------- */
function shapeIcon(k,col,sz){col=col||({circle:'#ffb43c',square:'#2f86e0',tri:'#e2343c'})[k];var d=k==='circle'?'<circle cx="50" cy="50" r="40" fill="'+col+'" stroke="#5a3a10" stroke-width="5"/>':k==='square'?'<rect x="12" y="12" width="76" height="76" rx="8" fill="'+col+'" stroke="#173a66" stroke-width="5"/>':'<polygon points="50,8 93,88 7,88" fill="'+col+'" stroke="#7a1820" stroke-width="5" stroke-linejoin="round"/>';
  return '<svg viewBox="0 0 100 100" width="'+(sz||100)+'" height="'+(sz||100)+'">'+d+'</svg>'}
R.shapeIcon=shapeIcon;
function berry(sz){return '<svg viewBox="0 0 100 110" width="'+sz+'" height="'+sz*1.1+'"><path d="M50 26C14 22 8 66 50 104C92 66 86 22 50 26Z" fill="#ff3b4e" stroke="#c4182c" stroke-width="4"/><path d="M50 30L30 14L44 20L50 4L56 20L70 14Z" fill="#3f9a2c"/></svg>'}
function certHTML(small){var t=R.T(L5('상장','Certificate','Diploma','奖状','Diplôme')),b=R.T(L5('숫자·도형 박사','Numbers & Shapes Star','Estrella de Números y Formas','数字形状小博士','Champion des chiffres et des formes')),
  m=R.T(L5('라이준, 라아와 함께 숫자와 도형을 멋지게 배웠어요!','You learned numbers and shapes with Raijun and Raa!','¡Aprendiste números y formas con Raijun y Raa!','你和莱俊、拉阿一起学会了数字和形状！','Tu as appris les chiffres et les formes avec Raijun et Raa !'));
  var d=(R.inv.items.cert&&R.inv.items.cert.got||new Date().toISOString()).slice(0,10);
  return '<div class="cert'+(small?' sm':'')+'"><div class="cT">🏅 '+t+'</div><div class="cB">'+b+'</div><div class="cM">'+m+'</div><div class="cS">⭐⭐⭐</div><img class="cR1" src="'+R.u('img/raijun.webp')+'" alt=""><img class="cR2" src="'+R.u('img/raa.webp')+'" alt=""><div class="cD">'+d+'</div></div>'}
function cartArt(){return '<div class="rideArt"><div style="position:absolute;left:4%;top:0;width:28%;height:30%">'+R.shapeSVG('tri')+'</div><div style="position:absolute;left:10%;top:28%;width:80%;height:42%">'+R.shapeSVG('square',true,true)+'</div><div style="position:absolute;left:10%;top:62%;width:34%;height:36%">'+R.shapeSVG('circle')+'</div><div style="position:absolute;left:56%;top:62%;width:34%;height:36%">'+R.shapeSVG('circle')+'</div></div>'}
function boatArt(){return '<div class="rideArt"><svg viewBox="0 0 100 100" width="100%" height="100%"><polygon points="52,8 52,62 86,62" fill="#ffffff" stroke="#1b6b8f" stroke-width="4"/><polygon points="48,18 48,62 20,62" fill="#ffd24a" stroke="#c98a16" stroke-width="4"/><path d="M8 66H92L80 88H20Z" fill="#e2343c" stroke="#7a1820" stroke-width="4" stroke-linejoin="round"/><path d="M4 94Q20 88 36 94T68 94T96 94" stroke="#5fc6ff" stroke-width="5" fill="none"/></svg></div>'}
function keyArt(){return '<div class="rideArt"><svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="30" cy="50" r="20" fill="#ffd24a" stroke="#c98a10" stroke-width="5"/><circle cx="30" cy="50" r="7" fill="#fff4da"/><path d="M48 46H92V56H84V66H76V56H68V64H60V56H48Z" fill="#ffd24a" stroke="#c98a10" stroke-width="4" stroke-linejoin="round"/></svg></div>'}
function figArt(w){return '<div class="figArt"><img src="'+R.u('img/'+w+'.webp')+'" alt=""><div class="ped"></div></div>'}
R.giftArt=function(id){if(id==='key_hatch')return keyArt();return id==='fig_raijun'?figArt('raijun'):id==='fig_raa'?figArt('raa'):id==='cert'?certHTML(true):id==='ride_shape_cart'?cartArt():boatArt()};
/* ---------- sticker book (HUD button) ---------- */
R.onBook=function(){var b=$('#bookN');if(b)b.textContent=String(Object.keys(R.inv.stickers).length)};R.onBook();
R.openBook=function(){R.audioInit();R.sfx.tap();if($('#book')){$('#book').remove();return}var bk=R.el('div',null,null,$('#stage'));bk.id='book';
  var html='<div class="bkGrid">'+STK.map(function(k){var s=R.inv.stickers[k];return '<div class="bkC'+(s?' on':'')+'">'+(s?s.icon:'')+'</div>'}).join('')+'</div><div class="bkBtns"><button class="big" id="bkPlay">'+R.u2('play')+'</button><button class="big alt" id="bkShelf">'+R.u2('shelf')+'</button><button class="big alt" id="bkClose">✕</button></div>';
  bk.innerHTML=html;R.show('sb_open');
  $('#bkClose').onclick=function(e){e.stopPropagation();R.sfx.tap();bk.remove()};
  $('#bkPlay').onclick=function(e){e.stopPropagation();bk.remove();R.runMod('playmenu')};
  $('#bkShelf').onclick=function(e){e.stopPropagation();bk.remove();R.runMod('shelf')}};
/* ---------- gift popup ---------- */
R.showGift=function(id){var g=R.el('div','giftPop','<div class="gpArt">'+R.giftArt(id)+'</div><div class="gpName">🎁 '+R.T(GN[id])+'</div>'+(id.indexOf('ride_')===0?'<div class="gpNext">'+R.T(NEXT)+'</div>':''),$('#stage'));R.sfx.chime();R.cheer();
  var t0=performance.now();return say('gf_new').then(function(){return say('g_'+id)}).then(function(){return wait(Math.max(0,(R.FAST?300:3200)-(performance.now()-t0)))}).then(function(){g.remove()},function(e){g.remove();throw e})};
/* ---------- line matching engine ---------- */
var COLX=[420,1180],ROWY=[350,572,794];
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function scene(bg){R.clearScene(bg||'bg_forest');R.char('raijun',30,24,250);R.char('raa',1340,24,220)}
function matchLines(left,right,onOk){var W=$('#world');var sv=R.el('div','svgLayer','<svg viewBox="0 0 1600 900" width="1600" height="900"><defs><radialGradient id="lbS" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#c3cddf"/><stop offset="1" stop-color="#7c8aa3"/></radialGradient><radialGradient id="lbG" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff6cf"/><stop offset=".45" stop-color="#ffd24a"/><stop offset="1" stop-color="#d97a08"/></radialGradient></defs></svg>',W);var svg=sv.firstChild;
  function item(o,col,row){var e=R.el('div','mtItem'+(o.txt?' txt':''),o.html,W);e.style.left=(COLX[col]-125)+'px';e.style.top=(ROWY[row]-100)+'px';e.dataset.k=o.key;return e}
  var L=left.map(function(o,i){return item(o,0,i)}),Rr=right.map(function(o,i){return item(o,1,i)});
  L.forEach(function(e){R.el('i','mBead st',null,e)});Rr.forEach(function(e){R.el('i','mBead en',null,e)});
  var NS='http://www.w3.org/2000/svg',lastB=0;
  function mk(x1,y1){var g=document.createElementNS(NS,'g');svg.appendChild(g);g._a=[x1,y1];g._n=0;return g}
  function lay(g,x2,y2,silent){var a=g._a,d=Math.hypot(x2-a[0],y2-a[1]),SP=132,n=Math.floor(d/SP),ang=Math.atan2(y2-a[1],x2-a[0]);
    var want=n*2;while(g.childNodes.length<want){var isB=(g.childNodes.length%2)===1;var c;
      if(isB){c=document.createElementNS(NS,'circle');c.setAttribute('r','30');c.setAttribute('fill','url(#lbS)');c.setAttribute('stroke','#8995ab');c.setAttribute('stroke-width','3');c.setAttribute('class','lbead');
        if(!silent){R.sfx.bead(Math.min(1,g.childNodes.length/12));var t=performance.now();if(t-lastB>45){lastB=t;R.vib(15)}}}
      else{c=document.createElementNS(NS,'path');c.setAttribute('d','M-11 -16L9 0L-11 16');c.setAttribute('fill','none');c.setAttribute('stroke','#ff7a1a');c.setAttribute('stroke-width','9');c.setAttribute('stroke-linecap','round');c.setAttribute('stroke-linejoin','round')}
      g.appendChild(c)}
    while(g.childNodes.length>want)g.removeChild(g.lastChild);
    for(var i=0;i<want;i++){var c=g.childNodes[i],f=(Math.floor(i/2)+(i%2?1:.5))*SP/d;var xx=a[0]+(x2-a[0])*f,yy=a[1]+(y2-a[1])*f;
      if(i%2){c.setAttribute('cx',xx);c.setAttribute('cy',yy)}else c.setAttribute('transform','translate('+xx+' '+yy+') rotate('+(ang*180/Math.PI)+')')}}
  function gold(g){[].forEach.call(g.childNodes,function(c){if(c.tagName==='circle'){c.setAttribute('fill','url(#lbG)');c.setAttribute('stroke','#b35f05')}else c.setAttribute('stroke','#d08a10')})}
  var lastNo=0;
  function setT(){R.targets=L.filter(function(e){return !e.dataset.done}).map(function(e){return {type:'drag',el:e,to:Rr.filter(function(r){return r.dataset.k===e.dataset.k&&!r.dataset.done})[0]}})}
  setT();R.hint('h_drag',function(){var t=R.targets[0];return t&&t.el});
  return R.mk(function(res){var left=L.length;
    L.forEach(function(e){var pid=null,ln=null;
      e.addEventListener('pointerdown',function(ev){ev.preventDefault();ev.stopPropagation();if(e.dataset.done||pid!==null)return;R.audioInit();pid=ev.pointerId;try{e.setPointerCapture(pid)}catch(x){}var r=R.rectStage(e);ln=mk(r.x+r.w+40,r.cy);lay(ln,r.x+r.w+40,r.cy);e.classList.add('go');R.sfx.bead(0);R.vib(15)});
      e.addEventListener('pointermove',function(ev){if(ev.pointerId!==pid)return;var p=R.toStage(ev.clientX,ev.clientY);lay(ln,p[0],p[1])});
      function up(ev){if(ev.pointerId!==pid)return;pid=null;var p=R.toStage(ev.clientX,ev.clientY);var hit=null;Rr.forEach(function(r){var q=R.rectStage(r);if(!r.dataset.done&&(Math.hypot(p[0]-q.cx,p[1]-q.cy)<170||(p[0]>q.x-40&&p[0]<q.x+q.w+40&&p[1]>q.y-30&&p[1]<q.y+q.h+30)))hit=r});
        if(hit&&hit.dataset.k===e.dataset.k){var q=R.rectStage(hit);lay(ln,q.x-40,q.cy,true);gold(ln);e.dataset.done=hit.dataset.done=1;e.classList.add('done');hit.classList.add('done');R.sfx.ding();R.vib([20,30,40]);R.hop(Math.random()<.5?'raijun':'raa');left--;R.clearHint();setT();onOk&&onOk(e.dataset.k);
          if(left===0){R.targets=[];setTimeout(res,R.FAST?50:1600)}else R.hint('h_drag',function(){var t=R.targets[0];return t&&t.el})}
        else{ln.remove();e.classList.remove('go');R.sfx.tap();if(hit&&performance.now()-lastNo>3000){lastNo=performance.now();R.show('lm_no')}}ln=null}
      e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up)})})}
var NAMES3={circle:L5('동그라미','Circle','Círculo','圆形','Rond'),square:L5('네모','Square','Cuadrado','正方形','Carré'),tri:L5('세모','Triangle','Triángulo','三角形','Triangle')};
function group(n,kind){var h='';for(var i=0;i<n;i++)h+=kind==='berry'?berry(58):shapeIcon(kind,null,56);return '<div class="grp">'+h+'</div>'}
async function pshape(){await R.transition(function(){scene('bg_space')});await say('lm1');
  var K=shuffle(['circle','square','tri']),K2=shuffle(K);var alt={circle:'#9be15d',square:'#ffd24a',tri:'#b388ff'};
  await matchLines(K.map(function(k){return {key:k,html:shapeIcon(k,null,150)}}),K2.map(function(k){return {key:k,html:shapeIcon(k,alt[k],k==='circle'?110:140)}}),function(k){R.show('sh_'+k)});
  await say('pl_done');await R.award('p_shape','🔺')}
async function pnum(){await R.transition(function(){scene('bg_forest')});await say('nc1');
  var N=shuffle([1,2,3]),N2=shuffle(N);
  await matchLines(N.map(function(n){return {key:String(n),html:'<b class="dig">'+n+'</b>'}}),N2.map(function(n){return {key:String(n),html:group(n,'berry')}}),function(k){R.show('cnt'+k)});
  R.clearScene();scene('bg_forest');await say('nc2');
  var M=shuffle([2,3,4]),M2=shuffle(M),KK={2:'tri',3:'circle',4:'square'};
  await matchLines(M.map(function(n){return {key:String(n),html:'<b class="dig">'+n+'</b>'}}),M2.map(function(n){return {key:String(n),html:group(n,KK[n])}}),function(k){R.show('cnt'+k)});
  await say('nc_ok');await say('pl_done');await R.award('p_num','🔢')}
async function pname(){await R.transition(function(){scene('bg_space')});await say('sn1');
  var K=shuffle(['circle','square','tri']),K2=shuffle(K);
  await matchLines(K.map(function(k){return {key:k,html:shapeIcon(k,null,150)}}),K2.map(function(k){return {key:k,txt:1,html:'<span>'+R.T(NAMES3[k])+'</span>'}}),function(k){R.show('sh_'+k)});
  await say('pl_done');await R.award('p_name','🔤')}
var STARTER=['⭐','🌈','🌼','🐟','🍓','🦋'];
async function pboard(){await R.transition(function(){R.clearScene('bg_sea');R.char('raijun',30,24,230);R.char('raa',1360,24,200)});
  var W=$('#world');R.inv.board.slice(-6).forEach(function(p){var e=R.el('div','placedStk',p.icon,W);e.style.left=p.x+'px';e.style.top=p.y+'px'});
  var tray=R.el('div','tray',null,W);tray.style.cssText+=';left:330px;right:330px;bottom:20px;height:175px';
  var own=Object.keys(R.inv.stickers).map(function(k){return R.inv.stickers[k].icon});var icons=own.concat(STARTER).slice(0,8);
  var stk=icons.map(function(ic,i){var e=R.el('div','stk',ic,W);var x=380+i*120,y=812;e.style.left=x+'px';e.style.top=y+'px';e.dataset.hx=x;e.dataset.hy=y;return e});
  var spots=[[470,340],[800,300],[1090,360]].map(function(p){var d=R.el('div','dropHint',null,W);d.style.left=p[0]+'px';d.style.top=p[1]+'px';return d});
  await say('bd1');var placed=0;
  await R.mk(function(res){
    function setT(){var sp=spots.filter(function(s){return !s.dataset.done})[0];R.targets=sp?stk.map(function(e){return {type:'drag',el:e,to:sp}}):[]}
    setT();R.hint('h_drag',function(){return stk[0]});
    stk.forEach(function(e){var pid=null,ox,oy;
      e.addEventListener('pointerdown',function(ev){ev.preventDefault();ev.stopPropagation();if(pid!==null)return;R.audioInit();pid=ev.pointerId;try{e.setPointerCapture(pid)}catch(x){}var p=R.toStage(ev.clientX,ev.clientY);ox=p[0]-parseFloat(e.style.left);oy=p[1]-parseFloat(e.style.top);e.classList.add('drag');R.sfx.tap()});
      e.addEventListener('pointermove',function(ev){if(ev.pointerId!==pid)return;var p=R.toStage(ev.clientX,ev.clientY);e.style.left=(p[0]-ox)+'px';e.style.top=(p[1]-oy)+'px'});
      function up(ev){if(ev.pointerId!==pid)return;pid=null;e.classList.remove('drag');var x=parseFloat(e.style.left),y=parseFloat(e.style.top);
        if(y<640){var c=R.el('div','placedStk',e.innerHTML,W);c.style.left=x+'px';c.style.top=y+'px';R.inv.board.push({icon:e.innerHTML,x:Math.round(x),y:Math.round(y)});if(R.inv.board.length>24)R.inv.board.shift();R.saveInv();
          var sp=spots.filter(function(s){return !s.dataset.done}).sort(function(a,b){return Math.hypot(parseFloat(a.style.left)-x,parseFloat(a.style.top)-y)-Math.hypot(parseFloat(b.style.left)-x,parseFloat(b.style.top)-y)})[0];if(sp){sp.dataset.done=1;sp.remove()}
          placed++;R.sfx.clunk();R.vib(20);R.hop('raa');R.show('bd_put');setT();if(placed>=3){R.clearHint();R.targets=[];setTimeout(res,R.FAST?50:1200)}}
        e.style.left=e.dataset.hx+'px';e.style.top=e.dataset.hy+'px'}
      e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up)})});
  await say('bd_done');await R.award('p_board','🖼️')}
/* ---------- play menu ---------- */
var TILES=[['pboard','🖼️',L5('스티커 붙이기','Sticker picture','Pegar pegatinas','贴贴纸','Coller des autocollants')],['pshape','🔺🔵',L5('같은 모양 잇기','Match the shapes','Une formas iguales','连一样的形状','Relier les formes')],['pnum','1️⃣🍓',L5('숫자와 개수 잇기','Numbers and amounts','Números y cantidades','数字和数量','Chiffres et quantités')],['pname','🔺🔤',L5('도형과 이름 잇기','Shapes and names','Formas y nombres','形状和名字','Formes et noms')],['shelf','🎁',L5('선물 선반','Gift shelf','Regalos','礼物架','Cadeaux')]];
async function playMenu(){R.clearScene('bg_forest');R.char('raijun',30,24,250);R.char('raa',1350,24,220);var W=$('#world');
  var tl=TILES.map(function(t,i){var e=R.el('div','tile','<i>'+t[1]+'</i><span>'+R.T(t[2])+'</span>',W);e.style.left=(110+i*282)+'px';e.style.top='350px';e.dataset.k=t[0];return e});
  R.show('pm_hi');
  var e=await R.mk(function(res){R.targets=tl.map(function(x){return {type:'tap',el:x}});tl.forEach(function(x){x.onpointerdown=function(ev){ev.stopPropagation();R.audioInit();R.sfx.tap();res(x)}})});
  R.targets=[];setTimeout(function(){R.runMod(e.dataset.k)},0);await R.mk(function(){})}
/* ---------- gift shelf ---------- */
async function shelf(){R.clearScene('bg_forest');R.char('raijun',30,24,250);R.char('raa',1350,24,220);var W=$('#world');
  var bd=R.el('div','shelfBoard',null,W);bd.style.cssText+=';left:160px;top:592px;width:1290px';
  R.GIFTS.forEach(function(g,i){var own=R.inv[g.kind][g.id];var e=R.el('div','gSlot'+(own?' on':''),own?R.giftArt(g.id)+'<span>'+R.T(GN[g.id])+'</span>'+(g.kind==='rides'?'<em>'+R.T(NEXT)+'</em>':''):'<i>🔒</i><span>'+need(g)+'</span>',W);
    e.style.left=(175+i*210)+'px';e.style.top='330px';e.onpointerdown=function(ev){ev.stopPropagation();R.audioInit();R.sfx.tap();R.show(own?'g_'+g.id:'shelf_lock')}});
  await say('shelf_hi');await R.choice([{t:R.UI?{ko:R.UI.ko.back,en:R.UI.en.back,es:R.UI.es.back,zh:R.UI.zh.back,fr:R.UI.fr.back}:'btn_next'}])}
function mod(key,act,after){R.MODS[key]={key:key,calm:true,acts:[act],finale:function(){return Promise.resolve()},after:after,share:{ko:'',en:''},next:{ko:'',en:''}}}
mod('playmenu',playMenu,'menu');mod('pboard',pboard,'playmenu');mod('pshape',pshape,'playmenu');mod('pnum',pnum,'playmenu');mod('pname',pname,'playmenu');mod('shelf',shelf,'menu');
})();
