/* 1화 · 숫자·도형 모험: 마리와 네모 밭 */
(function(){
'use strict';
var R=window.R,$=R.$,say=R.say,wait=R.wait;
R.MODS=R.MODS||{};
function U(b,u,v){return [b.x+u*b.s,b.y+v*b.s]}
function strokesUnit(b,arr){return arr.map(function(s){return s.map(function(p){return U(b,p[0],p[1])})})}
function logEl(w,h){var l=R.el('div','log3d');l.style.width=w+'px';l.style.height=h+'px';return l}
function heroes(bg){R.clearScene(bg);R.char('raijun',40,30,350);R.char('raa',280,30,300)}
var E_IMG=['mari','mari2','mari3'];
function elephants(n,pos){var out=[];for(var i=0;i<n;i++){var p=pos[i];out.push(R.char('mari',p[0],p[1],p[2],{id:'ele'+i,img:E_IMG[i]}))}return out}
var EPOS=[[470,300,270],[1010,300,240],[760,360,200]];
/* ---- acts ---- */
async function intro(){
  R.clearScene('bg_forest');R.setBgm(true);
  R.map(null);
  await say('i1');
  R.sfx.whistle(1);var p=R.char('puss',1250,560,170);
  await say('i2');R.map(STOPS,0);await say('map1');
  R.char('raijun',40,30,350);R.sfx.boing();await say('i3');
  R.char('raa',280,30,300);await say('i4');
  // 어두미 low-angle cinematic entrance with candy hammer
  p.remove();var e=R.char('eodumi',1150,10,400,{enter:false});e.style.transformOrigin='50% 100%';e.style.transform='scale(.2)';e.style.transition='transform .5s cubic-bezier(.3,1.7,.5,1)';
  R.cam({z:1.4,rx:-10,ox:'82%',oy:'100%',y:40},1000);await wait(500);e.style.transform='scale(1.25)';R.sfx.thump();R.vib([60,40,60]);R.burst(1330,500);R.sparks(1330,500,30);
  await wait(400);e.style.transform='scale(1.25) rotate(-8deg)';await wait(180);e.style.transform='scale(1.25) rotate(6deg)';R.sfx.thump();await wait(180);e.style.transform='scale(1.15)';
  await say('i5');R.cam({},800);e.style.transform='scale(1)';
  await say('i6');await R.choice([{t:'btn_ready'}]);
}
async function bridge(){
  await R.transition(function(){heroes('bg_river')});
  
  await say('b1');await say('b2');
  var a=await R.choice([{t:{ko:'1 하나',en:'1 One',es:'1 Uno',zh:'1 一',fr:'1 Un'}},{t:{ko:'2 둘',en:'2 Two',es:'2 Dos',zh:'2 二',fr:'2 Deux'}},{t:{ko:'3 셋',en:'3 Three',es:'3 Tres',zh:'3 三',fr:'3 Trois'}}]);
  await say(a===0?'b2a':'b2b');
  await say('b3');
  var b={x:550,y:250,s:500};
  await R.trace({strokes:[[U(b,.5,.06),U(b,.5,.98)]],lw:80,fit:540});
  await R.bigNum('1','num1','pop_en1');
  await say('b4');
  R.show('countdown');var cd=['1','2','3'];for(var i=0;i<3;i++){R.popText(cd[i],800,470);R.sfx.tap();R.vib(20);await wait(650)}
  R.hideBubble();await R.choice([{t:{ko:'팡! 👏',en:'POP! 👏',es:'¡PUM! 👏',zh:'砰！👏',fr:'POP ! 👏'}}]);
  R.sfx.pop();R.vib([40,30,80]);R.rays(true,800,470);var lg=logEl(620,140);lg.classList.add('pop3d');lg.style.left='490px';lg.style.top='400px';$('#world').appendChild(lg);R.burst(800,470);R.sparks(800,470,24);R.countPop(1,800,330);
  await R.play('cnt1');R.rays(false);
  var ed=R.char('eodumi',1260,40,330);await say('b5');
  // 어두미가 통나무를 '다리 놓을 자리(강 위 빈칸)'에 와르르 쏟아요
  R.sfx.rain();R.vib([30,40,30]);R.cam({z:1.08,ox:'52%',oy:'62%'},700);var pile=[];
  for(var k=0;k<14;k++){var l=logEl(230,56);l.classList.add('rain');l.style.left=(490+Math.random()*450)+'px';l.style.setProperty('--dy',(700+Math.random()*80)+'px');l.style.setProperty('--r',(Math.random()*40-20)+'deg');l.style.animationDelay=(k*.07)+'s';$('#fx').appendChild(l);pile.push(l)}
  await wait(1300);R.sfx.thump();
  await say('b6');
  // 하나만 남기고 나머지는 강물 따라 천천히 둥실둥실 떠내려가요
  pile.forEach(function(l,i){l.style.transition='transform 2.2s ease-in, opacity 2.2s ease-in';l.style.transform=getComputedStyle(l).transform;l.classList.remove('rain');void l.offsetWidth;l.style.transform='translate('+(i%2?60:-60)+'px,'+(700+260)+'px) rotate('+(i*13)+'deg)';l.style.opacity='0'});R.sfx.water();R.cam({},900);
  await wait(1200);pile.forEach(function(l){l.remove()});
  await say('b7');
  lg.classList.remove('pop3d');lg.style.transition='all 1.1s cubic-bezier(.45,0,.3,1)';void lg.offsetWidth;lg.style.left='470px';lg.style.top='520px';lg.style.width='700px';lg.style.height='92px';R.sfx.whoosh();
  await wait(950);R.sfx.thump();R.vib(60);R.sparks(820,560,24);
  await say('b8');await R.praise(['p8']);
  await R.award('log','<div class="log3d" style="position:relative;display:inline-block;width:60px;height:24px"></div>');
  await R.walkTo('raijun',300,1000);await mapGo(1);
}
async function elephantsAct(){
  await R.transition(function(){heroes('bg_forest');R.char('eodumi',1360,30,300)});
  
  await say('e1');await say('e2');await say('e3');
  var b={x:560,y:240,s:500};
  var p1=R.bez([.28,.16],[.45,0],[.88,.1],[.5,.47]),p2=R.bez([.5,.47],[.95,.52],[.85,1.02],[.26,.86]);
  await R.trace({strokes:[strokesUnit(b,[p1.concat(p2.slice(1))])[0]],lw:76,fit:540});
  await R.bigNum('3','num3','pop_en3');
  await say('e4');
  var spots=[[600,460],[800,400],[1000,460]];var made=[];
  for(var i=0;i<3;i++){var eg=R.el('div','bubbleEgg',null,$('#world'));eg.style.left=spots[i][0]+'px';eg.style.top=spots[i][1]+'px';made.push(eg)}
  for(var j=0;j<3;j++){
    var tg=made.filter(function(m){return !m.dataset.done});R.targets=tg.map(function(m){return {type:'tap',el:m}});R.hint('h_tap',function(){return tg[0]});
    var hit=await R.mk(function(res){tg.forEach(function(m){m.onpointerdown=function(e){e.stopPropagation();R.audioInit();res(m)}})});
    R.clearHint();R.targets=[];hit.dataset.done=1;hit.onpointerdown=null;var r=R.rectStage(hit);hit.classList.add('vanish');R.sfx.pop();R.vib([30,30]);R.burst(r.cx,r.cy);R.sparks(r.cx,r.cy,20);
    var ph=EPOS[j];var el=R.char('mari',r.cx-ph[2]*.42,900-r.cy-ph[2]*.55,ph[2],{id:'ele'+j,img:E_IMG[j]});
    R.countPop(j+1,r.cx,r.cy-120);await R.play('cnt'+(j+1));
  }
  R.morphFx(800,420,['circle','square','circle']);
  await say('e5');await say('e6');await say('e7');await R.praise(['p7']);
  await R.award('ele','<img src="img/mari.webp" alt="">');
  await mapGo(2);
}
function fieldScene(withField){
  heroes('bg_forest');R.char('eodumi',1360,30,300);
  elephants(3,[[230,300,270],[1150,300,250],[900,370,200]]);
  var f=R.el('div','field',null,$('#world'));f.id='field';f.style.left='420px';f.style.top='430px';f.style.width='760px';f.style.height='460px';
  var c=R.el('canvas',null,null,f);c.width=760;c.height=460;c.getContext('2d').drawImage(grassCanvas(),0,0);f.style.display=withField?'':'none';return f;
}
async function field(){
  await R.transition(function(){fieldScene(false)});
  await say('f1');await say('f2');
  var b={x:590,y:260,s:420};
  var cnt=['cnt1','cnt2','cnt3','cnt4'];
  await R.trace({strokes:strokesUnit(b,[[[0,0],[0,1]],[[0,0],[1,0]],[[1,0],[1,1]],[[0,1],[1,1]]]),lw:66,fit:440,onStroke:function(i,p){R.countPop(i+1,p[0],p[1]);R.play(cnt[i]).catch(function(){})}});
  var nm=R.el('div','sv',R.shapeSVG('square',true),$('#fx'));nm.style.cssText='position:absolute;left:640px;top:250px;width:320px;height:320px';nm.classList.add('pop3d');R.sfx.boing();
  await say('f3');nm.style.transition='all .8s cubic-bezier(.5,0,.3,1)';nm.style.left='700px';nm.style.top='640px';nm.style.width='200px';nm.style.height='200px';nm.style.opacity='0';
  var f=$('#field');f.style.display='';f.style.opacity=0;f.style.transition='opacity .6s';void f.offsetWidth;f.style.opacity=1;R.sfx.thump();await wait(900);nm.remove();
  await say('f4');
  await rub(f);
  await say('f6');await R.praise(['p7']);
  await R.award('field','<svg viewBox="0 0 10 10" width="56" height="56"><rect x="1" y="1" width="8" height="8" rx="1" fill="#a8743f" stroke="#6b4220"/></svg>');
  await mapGo(3);
}
var FW=760,FH=460;
function soilCanvas(){var c=document.createElement('canvas');c.width=FW;c.height=FH;var x=c.getContext('2d');x.fillStyle='#4a2a12';x.fillRect(0,0,FW,FH);var rows=14,rh=FH/rows;
  for(var j=0;j<rows;j++){var y=j*rh;var g=x.createLinearGradient(0,y,0,y+rh);g.addColorStop(0,'#2c170a');g.addColorStop(.35,'#5a3418');g.addColorStop(.6,'#7a4a24');g.addColorStop(1,'#3a200e');x.fillStyle=g;x.fillRect(0,y,FW,rh)}
  for(var i=0;i<900;i++){x.fillStyle=Math.random()<.5?'rgba(30,15,5,.55)':'rgba(120,75,40,.5)';var r=1+Math.random()*3;x.beginPath();x.arc(Math.random()*FW,Math.random()*FH,r,0,6.3);x.fill()}return c}
function grassCanvas(){var c=document.createElement('canvas');c.width=FW;c.height=FH;var x=c.getContext('2d');x.fillStyle='#6b6a34';x.fillRect(0,0,FW,FH);
  for(var i=0;i<700;i++){x.fillStyle=['rgba(96,128,48,.6)','rgba(120,150,60,.5)','rgba(110,80,40,.5)','rgba(70,100,40,.5)'][i%4];x.beginPath();x.ellipse(Math.random()*FW,Math.random()*FH,2+Math.random()*7,1+Math.random()*3,Math.random()*3,0,6.3);x.fill()}return c}
var SOIL=null;
function rub(f){
  var c=f.querySelector('canvas'),x=c.getContext('2d');SOIL=SOIL||soilCanvas();x.drawImage(grassCanvas(),0,0);
  var pat=x.createPattern(SOIL,'no-repeat');var GX=12,GY=7,done={},n=0,half=false,last=null;
  var eles=[].slice.call(document.querySelectorAll('[id^=ele]'));var mari=eles[0];if(mari)mari.style.transition='left .35s ease-out';
  R.targets=[{type:'rub',el:f}];R.hint('h_rub',function(){return f});
  return R.mk(function(res){
    var active=null;
    function mv(e){if(active===null||e.pointerId!==active)return;var r=f.getBoundingClientRect();var u=(e.clientX-r.left)/r.width,v=(e.clientY-r.top)/r.height;if(u<-.05||u>1.05||v<-.05||v>1.05)return;
      var px=u*FW,py=v*FH;x.save();x.strokeStyle=pat;x.lineCap='round';x.lineJoin='round';x.lineWidth=120;x.beginPath();if(last){x.moveTo(last[0],last[1])}else x.moveTo(px-0.1,py);x.lineTo(px,py);x.stroke();x.restore();
      // 흙덩이 (갈색 입자)
      if(Math.random()<.35){var p=R.toStage(e.clientX,e.clientY);var d=R.el('div','clod',null,$('#fx'));d.style.left=p[0]+'px';d.style.top=p[1]+'px';d.style.setProperty('--x',((Math.random()-.5)*80)+'px');setTimeout(function(){d.remove()},800)}
      var steps=last?Math.ceil(Math.hypot(px-last[0],py-last[1])/20):1;
      for(var s=0;s<=steps;s++){var qx=last?last[0]+(px-last[0])*s/steps:px,qy=last?last[1]+(py-last[1])*s/steps:py;
        for(var dx=-1;dx<=1;dx++)for(var dy=-1;dy<=1;dy++){var X=Math.floor(qx/FW*GX)+dx,Y=Math.floor(qy/FH*GY)+dy;if(X<0||Y<0||X>=GX||Y>=GY)continue;var cx=(X+.5)*FW/GX,cy=(Y+.5)*FH/GY;if(Math.hypot(cx-qx,cy-qy)>70)continue;var k=X+','+Y;if(done[k])continue;done[k]=1;n++;if(n%5===0){R.sfx.thump();R.vib(15)}}}
      last=[px,py];
      if(mari){var sp=R.toStage(e.clientX,e.clientY);mari.style.left=Math.max(380,Math.min(1060,sp[0]-140))+'px'}
      eles.forEach(function(el){el.classList.add('push')});
      if(!half&&n>GX*GY*.45){half=true;R.show('f5')}
      if(n>=GX*GY*.85)finish()}
    function finish(){f.removeEventListener('pointermove',mv);f.removeEventListener('pointerdown',dn);eles.forEach(function(el){el.classList.remove('push')});
      x.globalAlpha=0;var t0=performance.now();(function fill(){var a=Math.min(1,(performance.now()-t0)/700);x.globalAlpha=a*.25;x.drawImage(SOIL,0,0);x.globalAlpha=1;if(a<1)requestAnimationFrame(fill);else{x.drawImage(SOIL,0,0)}})();
      R.clearHint();R.targets=[];R.sfx.fanfare();setTimeout(res,600)}
    function dn(e){R.audioInit();active=e.pointerId;last=null;try{f.setPointerCapture(e.pointerId)}catch(z){}mv(e)}
    function up(e){if(e.pointerId===active){active=null;last=null;eles.forEach(function(el){el.classList.remove('push')})}}
    f.style.pointerEvents='auto';f.style.touchAction='none';f.addEventListener('pointermove',mv);f.addEventListener('pointerdown',dn);f.addEventListener('pointerup',up);f.addEventListener('pointercancel',up);
  });
}
function sproutSVG(berry){return '<svg viewBox="0 0 100 140" width="100%" height="100%"><path d="M50 140V60" stroke="#3f9a2c" stroke-width="9" stroke-linecap="round"/><path d="M50 80Q15 70 10 40Q40 40 50 75" fill="#6fd04a"/><path d="M50 70Q85 55 92 25Q60 28 50 65" fill="#5fc03a"/>'+(berry?'<path d="M50 40 C20 40 22 0 50 10 C78 0 80 40 50 40Z" transform="translate(0,-2) scale(1)" fill="#4fb03a"/><path d="M50 18C18 18 14 60 50 92C86 60 82 18 50 18Z" fill="#ff3b4e"/><g fill="#ffe08a"><circle cx="38" cy="40" r="3"/><circle cx="60" cy="38" r="3"/><circle cx="50" cy="55" r="3"/><circle cx="40" cy="66" r="3"/><circle cx="62" cy="62" r="3"/></g>':'')+'</svg>'}
async function seeds(){
  await R.transition(function(){fieldScene(true);var f=$('#field');SOIL=SOIL||soilCanvas();f.querySelector('canvas').getContext('2d').drawImage(SOIL,0,0);});
  var f=$('#field');var HP=[[190,130],[570,130],[190,330],[570,330]];var holes=HP.map(function(p){var h=R.el('div','hole',null,f);h.style.left=p[0]+'px';h.style.top=p[1]+'px';return h});
  var bk=R.el('div','basket',null,$('#world'));bk.style.left='1190px';bk.style.top='730px';R.char('eodumi',1420,30,250,{enter:false});
  await say('s1');
  var seedEls=[];for(var i=0;i<4;i++){var s=R.el('div','seed',null,$('#world'));s.style.left=(1240+i*62)+'px';s.style.top=(720+(i%2)*26)+'px';seedEls.push(s)}
  var placed=[];
  for(var k=0;k<4;k++){
    var left=seedEls.filter(function(s){return !s.dataset.done});R.targets=left.map(function(s){return {type:'tap',el:s}});R.hint('h_tap',function(){return left[0]});
    var s=await R.mk(function(res){left.forEach(function(sd){sd.onpointerdown=function(e){e.stopPropagation();R.audioInit();res(sd)}})});
    R.clearHint();R.targets=[];s.dataset.done=1;s.onpointerdown=null;var hr=R.rectStage(holes[k]);s.style.left=hr.cx+'px';s.style.top=hr.cy+'px';R.sfx.pop();R.vib(20);
    placed.push(hr);await wait(450);R.sparks(hr.cx,hr.cy,10);R.countPop(k+1,hr.cx,hr.cy-90);await R.play('cnt'+(k+1));
  }
  await say('s2');
  var sps=await watering(placed);
  await wait(300);await say('s4');
  var big=sps[1];big.innerHTML=sproutSVG(true);big.style.transition='all .8s cubic-bezier(.3,1.7,.5,1)';big.style.width='180px';big.style.height='250px';big.style.left=(parseFloat(big.style.left)-45)+'px';big.style.top=(parseFloat(big.style.top)-130)+'px';R.sfx.fanfare();R.cheer();
  await say('s5');await R.praise(['p8']);
  await R.award('sprout','<svg viewBox="0 0 100 140" width="60" height="70">'+sproutSVG(false).replace(/<svg[^>]*>|<\/svg>/g,'')+'</svg>');
  await mapGo(4);
}
/* ---- watering by number (after seeds) ---- */
function cloudSVG(){return '<svg viewBox="0 0 300 170"><ellipse cx="150" cy="150" rx="120" ry="14" fill="rgba(0,0,0,.12)"/><g fill="#ffffff" stroke="#9cc8e8" stroke-width="5"><circle cx="90" cy="90" r="52"/><circle cx="160" cy="70" r="64"/><circle cx="225" cy="95" r="48"/><rect x="60" y="90" width="190" height="50" rx="25"/></g><g fill="#2a4a66"><circle cx="128" cy="92" r="7"/><circle cx="180" cy="92" r="7"/></g><path d="M138 112q16 12 32 0" stroke="#2a4a66" stroke-width="5" fill="none" stroke-linecap="round"/></svg>'}
async function watering(holes){
  await say('w1');R.hop('raa');await say('w2');
  var b={x:600,y:170,s:400};
  var p1=R.bez([.28,.16],[.45,0],[.88,.1],[.5,.47]),p2=R.bez([.5,.47],[.95,.52],[.85,1.02],[.26,.86]);
  await R.trace({strokes:[strokesUnit(b,[p1.concat(p2.slice(1))])[0]],lw:70,fit:520});
  await R.play('cnt3');
  var cl=R.el('div','cloud',cloudSVG(),$('#world'));cl.style.left='560px';cl.style.top='330px';
  var badge=R.el('div','cntBadge','0',$('#world'));badge.style.left='880px';badge.style.top='360px';
  var sps=holes.map(function(hr){var sv=R.el('div','sprout',sproutSVG(false),$('#world'));sv.style.left=(hr.cx-45)+'px';sv.style.top=(hr.cy-120)+'px';sv.style.width='90px';sv.style.height='126px';sv.style.transform='scale(0)';return sv});
  await say('w3');
  for(var n=1;n<=3;n++){
    await R.waitTap(cl,'h_tap');R.sfx.water();R.vib([20,20,20]);badge.textContent=String(n);
    holes.forEach(function(hr){for(var d=0;d<4;d++){var dp=R.el('div','drop',null,$('#fx'));var ox=620+Math.random()*180;dp.style.left=ox+'px';dp.style.top='450px';dp.style.setProperty('--x',(hr.cx-ox+(Math.random()-.5)*40)+'px');dp.style.setProperty('--y',(hr.cy-450)+'px');dp.style.animationDelay=(d*.08)+'s';setTimeout(function(e){e.remove()}.bind(null,dp),1400)}});
    R.countPop(n,930,330);await R.play('cnt'+n);
    sps.forEach(function(sv,i){setTimeout(function(){sv.style.transform='scale('+(n/3).toFixed(2)+')'},i*120)});R.sfx.boing();R.cheer();await wait(500)
  }
  cl.style.transition='opacity .6s';cl.style.opacity='0';badge.remove();setTimeout(function(){cl.remove()},700);
  await say('w_done');return sps;
}
/* strawberry svg */
function berrySVG(){return '<svg viewBox="0 0 100 110"><path d="M50 26C14 22 8 66 50 104C92 66 86 22 50 26Z" fill="#ff3b4e" stroke="#c4182c" stroke-width="3"/><g fill="#ffe08a"><circle cx="36" cy="48" r="3.5"/><circle cx="62" cy="46" r="3.5"/><circle cx="50" cy="62" r="3.5"/><circle cx="38" cy="74" r="3.5"/><circle cx="62" cy="72" r="3.5"/><circle cx="50" cy="86" r="3"/></g><path d="M50 30L30 14L44 20L50 4L56 20L70 14Z" fill="#3f9a2c"/></svg>'}
/* ---- harvest: count 6 strawberries ---- */
async function harvest(){
  await R.transition(function(){fieldScene(true);var f=$('#field');SOIL=SOIL||soilCanvas();f.querySelector('canvas').getContext('2d').drawImage(SOIL,0,0);R.char('eodumi',1420,30,250,{enter:false})});
  var W=$('#world');var PL=[[620,790],[980,790],[800,880]];PL.forEach(function(p){var sv=R.el('div','sprout grow',sproutSVG(false),W);sv.style.cssText+=';left:'+(p[0]-80)+'px;top:'+(p[1]-224)+'px;width:160px;height:224px'});
  var BP=[];PL.forEach(function(p){BP.push([p[0]-40,p[1]-150],[p[0]+40,p[1]-135])});
  var bk=R.el('div','basket',null,W);bk.style.left='1190px';bk.style.top='730px';
  var bs=BP.map(function(p){var e=R.el('div','berry',berrySVG(),W);e.style.left=p[0]+'px';e.style.top=p[1]+'px';return e});var hc=R.el('div','cntBadge','🍓 <b>0</b>',W);hc.style.left='1230px';hc.style.top='560px';hc.style.fontSize='52px';
  await say('hv1');
  for(var k=0;k<6;k++){
    var left=bs.filter(function(e){return !e.dataset.done});R.targets=left.map(function(e){return {type:'tap',el:e}});R.hint('h_tap',function(){return left[0]});
    var e=await R.mk(function(res){left.forEach(function(x){x.onpointerdown=function(ev){ev.stopPropagation();R.audioInit();res(x)}})});
    R.clearHint();R.targets=[];e.dataset.done=1;e.onpointerdown=null;e.style.pointerEvents='none';R.sfx.pop();R.vib(20);
    var x0=parseFloat(e.style.left),y0=parseFloat(e.style.top);R.countPop(k+1,x0,y0-90);hc.innerHTML='🍓 <b>'+(k+1)+'</b>';
    e.style.left=(1240+(k%3)*60)+'px';e.style.top=(740-Math.floor(k/3)*40)+'px';e.style.width='70px';e.style.height='76px';e.style.margin='-38px -35px';var tg=R.el('div','numTag',String(k+1),W);tg.style.left=(1240+(k%3)*60)+'px';tg.style.top=(740-Math.floor(k/3)*40-62)+'px';
    R.hop(k%2?'raa':'raijun');await R.play('cnt'+(k+1));
  }
  await R.bigNum('6','num6','pop_en6');
  await say('hv2');await R.praise();
  await R.award('berry','🍓');
  await mapGo(5);
}
/* ---- sharing with forest friends ---- */
var GL={1:function(b){return [[U(b,.5,.06),U(b,.5,.98)]]},
  2:function(b){var c=R.bez([.22,.3],[.24,.0],[.84,.0],[.74,.38],20);return [c.concat([[.2,.92],[.84,.92]]).map(function(p){return U(b,p[0],p[1])})]}};
async function share(){
  var A=[{who:'rabbit',x:790,h:270,n:2,l:'rb1',dg:'dg2r',ty:'rb_ty',rem:'rem4'},{who:'squirrel',x:1070,h:230,n:1,l:'sq1',dg:'dg1s',ty:'sq_ty',rem:'rem3'},{who:'hedgehog',x:1350,h:200,n:2,l:'hh1',dg:'dg2h',ty:'hh_ty',rem:'rem1'}];
  await R.transition(function(){R.clearScene('bg_forest');R.char('raijun',20,30,290);R.char('raa',200,30,250)});
  var W=$('#world');var bk=R.el('div','basket',null,W);bk.style.cssText+=';left:410px;top:740px;width:240px;height:120px';
  var BB=[[460,750],[520,740],[580,750],[480,790],[540,785],[600,795]];var bs=BB.map(function(p){var e=R.el('div','berry',berrySVG(),W);e.style.left=p[0]+'px';e.style.top=p[1]+'px';e.dataset.hx=p[0];e.dataset.hy=p[1];return e});
  var badge=R.el('div','cntBadge','🍓 6',W);badge.style.left='440px';badge.style.top='620px';badge.style.fontSize='48px';
  await say('an_in');
  var left=6,firstTwo=true;
  for(var ai=0;ai<A.length;ai++){var a=A[ai];
    var ch=R.char(a.who,a.x-a.h*.35,40,a.h);var plate=R.el('div','plate',null,W);plate.style.left=(a.x-110)+'px';plate.style.top='820px';
    var need=R.el('div','need','🍓 <b>?</b>',W);need.style.left=a.x+'px';need.style.top=(900-40-a.h-80)+'px';
    await wait(500);R.hop(ch);await say(a.l);
    await say(a.n===2?'wr2':'wr1');need.style.visibility='hidden';
    await R.trace({strokes:GL[a.n]({x:620,y:190,s:380}),lw:70,fit:500,cy:480});
    need.style.visibility='';need.querySelector('b').textContent=String(a.n);
    if(a.n===2&&firstTwo){firstTwo=false;await R.bigNum('2','num2','pop_en2')}else{R.popText(String(a.n),800,380);await R.play(a.n===2?'num2':'num1')}
    await say(a.dg);
    var got=0;
    while(got<a.n){
      var avail=bs.filter(function(e){return !e.dataset.done});
      var e=await dragBerry(avail,plate);
      e.dataset.done=1;e.style.pointerEvents='none';got++;left--;
      e.style.left=(a.x-40+got*40-(a.n===1?20:0))+'px';e.style.top='815px';R.sfx.clunk();R.vib([20,20]);
      R.countPop(got,a.x,600-a.h*.2);badge.textContent='🍓 '+left;await R.play('cnt'+got);
      if(got<a.n)await say('drag_more');
    }
    R.hop(ch);R.sfx.chime();await say(a.ty);R.cheer();await say(a.rem);
  }
  await say('left1');await say('share1');
  await R.award('share','🤝');
  await mapGo(6);
}
function dragBerry(avail,plate){
  R.targets=avail.map(function(e){return {type:'drag',el:e,to:plate}});R.hint('h_drag',function(){return avail[0]});
  return R.mk(function(res){var off=[];
    avail.forEach(function(e){var pid=null,ox,oy;
      function dn(ev){ev.preventDefault();ev.stopPropagation();if(pid!==null)return;R.audioInit();pid=ev.pointerId;try{e.setPointerCapture(pid)}catch(x){}var p=R.toStage(ev.clientX,ev.clientY);ox=p[0]-parseFloat(e.style.left);oy=p[1]-parseFloat(e.style.top);e.classList.add('drag');R.sfx.tap();R.vib(12)}
      function mv(ev){if(ev.pointerId!==pid)return;var p=R.toStage(ev.clientX,ev.clientY);e.style.left=(p[0]-ox)+'px';e.style.top=(p[1]-oy)+'px'}
      function up(ev){if(ev.pointerId!==pid)return;pid=null;e.classList.remove('drag');var pr=R.rectStage(plate),x=parseFloat(e.style.left),y=parseFloat(e.style.top);
        if(Math.hypot(x-pr.cx,y-pr.cy)<200){off.forEach(function(f){f()});R.clearHint();R.targets=[];res(e)}else{e.style.left=e.dataset.hx+'px';e.style.top=e.dataset.hy+'px'}}
      e.addEventListener('pointerdown',dn);e.addEventListener('pointermove',mv);e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up);
      off.push(function(){e.removeEventListener('pointerdown',dn);e.removeEventListener('pointermove',mv);e.removeEventListener('pointerup',up);e.removeEventListener('pointercancel',up)})})})}
var STOPS=['🌲','🌉','🐘','🟫','🌱','🍓','🐰','🛒','🐋','🏁'];
async function mapGo(i){R.map(STOPS,i);await say('map_go')}
/* cart builder + ride */
async function cart(){
  await R.transition(function(){R.clearScene('bg_forest');R.char('raijun',40,30,300);R.char('raa',1330,30,260)});
  await say('k1');R.show('k2');
  var W=$('#world');var SL=[{k:'square',x:680,y:330,w:240,h:240},{k:'circle',x:660,y:520,w:130,h:130},{k:'circle',x:810,y:520,w:130,h:130},{k:'tri',x:540,y:220,w:130,h:130}];
  var pole=R.el('div',null,null,W);pole.style.cssText='position:absolute;left:605px;top:300px;width:12px;height:200px;background:#8a5422;border-radius:6px;transform:rotate(-18deg);transform-origin:top';
  var slotEls=SL.map(function(s){var d=R.el('div','slot',null,W);d.style.cssText+=';left:'+s.x+'px;top:'+s.y+'px;width:'+s.w+'px;height:'+s.h+'px;border-radius:'+(s.k==='circle'?'50%':s.k==='tri'?'8px':'20px');if(s.k==='tri')d.style.clipPath='polygon(50% 0,100% 100%,0 100%)';return d});
  var tray=R.el('div','tray',null,W);
  var kinds=['circle','tri','square','circle'],blocks=[],filled=0;
  kinds.forEach(function(k,i){var b=R.el('div','blk',R.shapeSVG(k,k==='square'),W);var tx=360+i*235,ty=700;b.style.left=tx+'px';b.style.top=ty+'px';b.style.width='190px';b.style.height='190px';blocks.push({el:b,k:k,home:[tx,ty],slot:null})});
  function free(k,x,y){var best=-1,bd=1e9;SL.forEach(function(s,i){if(s.k!==k||blocks.some(function(b){return b.slot===i}))return;var d=x==null?0:Math.hypot(x-(s.x+s.w/2),y-(s.y+s.h/2));if(d<bd){bd=d;best=i}});return {i:best,d:bd}}
  await R.mk(function(res){
    function snap(bk,i){var s=SL[i];bk.slot=i;bk.el.classList.add('fly');bk.el.style.pointerEvents='none';bk.el.style.left=s.x+'px';bk.el.style.top=s.y+'px';bk.el.style.width=s.w+'px';bk.el.style.height=s.h+'px';slotEls[i].style.opacity=0;filled++;R.sfx.clunk();R.vib([25,30,25]);R.sparks(s.x+s.w/2,s.y+s.h/2,12);R.show(bk.k==='square'?'k_sq':bk.k==='circle'?'k_ci':'k_tr');R.popText(String(filled),s.x+s.w/2,s.y-20);
      R.targets=blocks.filter(function(b){return b.slot==null}).map(function(b){return {type:'tap',el:b.el}});
      if(filled===4){R.clearHint();setTimeout(res,700)}}
    R.targets=blocks.map(function(b){return {type:'tap',el:b.el}});R.hint('h_drag',function(){var b=blocks.filter(function(b){return b.slot==null})[0];return b&&b.el});
    blocks.forEach(function(bk){var e=bk.el,pid=null,sx,sy,ox,oy,moved;
      e.addEventListener('pointerdown',function(ev){ev.preventDefault();ev.stopPropagation();if(pid!==null||bk.slot!=null)return;R.audioInit();pid=ev.pointerId;try{e.setPointerCapture(pid)}catch(x){}var p=R.toStage(ev.clientX,ev.clientY);sx=p[0];sy=p[1];ox=p[0]-parseFloat(e.style.left);oy=p[1]-parseFloat(e.style.top);moved=false;e.classList.remove('fly');e.classList.add('drag');R.sfx.tap();R.vib(12)});
      e.addEventListener('pointermove',function(ev){if(ev.pointerId!==pid)return;var p=R.toStage(ev.clientX,ev.clientY);if(Math.hypot(p[0]-sx,p[1]-sy)>14)moved=true;e.style.left=(p[0]-ox)+'px';e.style.top=(p[1]-oy)+'px'});
      function up(ev){if(ev.pointerId!==pid)return;pid=null;e.classList.remove('drag');var cx=parseFloat(e.style.left)+95,cy=parseFloat(e.style.top)+95;var f=moved?free(bk.k,cx,cy):free(bk.k);
        if(f.i>=0&&f.d<(moved?320:1e9))snap(bk,f.i);else{e.classList.add('fly');e.style.left=bk.home[0]+'px';e.style.top=bk.home[1]+'px'}}
      e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up)});
  });
  R.sfx.fanfare();await R.praise();
  // ride
  W.innerHTML='';var c=R.el('div','sv',null,W);c.id='cartRide';c.style.cssText='position:absolute;left:80px;top:430px;width:380px;height:380px';
  c.innerHTML='<div class="sv" style="position:absolute;left:-4%;top:-18%;width:30%;height:30%">'+R.shapeSVG('tri')+'</div><img class="rider" src="'+R.u('img/raijun.webp')+'" style="position:absolute;left:14%;bottom:42%;height:62%"><img class="rider" src="'+R.u('img/raa.webp')+'" style="position:absolute;left:50%;bottom:42%;height:52%;animation-delay:-.4s"><div class="sv" style="position:absolute;left:8%;top:45%;width:84%;height:40%">'+R.shapeSVG('square',true,true)+'</div><div class="sv wh" style="position:absolute;left:8%;top:70%;width:32%;height:32%">'+R.shapeSVG('circle')+'</div><div class="sv wh" style="position:absolute;left:60%;top:70%;width:32%;height:32%">'+R.shapeSVG('circle')+'</div>';
  var berry=R.el('div',null,berrySVG(),c);berry.style.cssText='position:absolute;left:80%;top:22%;width:16%;height:18%';
  $('#bgimg').style.transition='none';$('#cast').innerHTML='';
  await say('k3');
  var wheels=c.querySelectorAll('.wh .spin');
  await R.mk(function(res){var hold=0,v=0,x=0,last=performance.now(),ang=0;var holders={};
    function dn(e){if(e.target.closest('button'))return;R.audioInit();holders[e.pointerId]=1;hold=1}function up(e){delete holders[e.pointerId];hold=Object.keys(holders).length?1:0}
    var st=$('#stage');st.addEventListener('pointerdown',dn);st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
    R.onCancel.push(function(){st.removeEventListener('pointerdown',dn);st.removeEventListener('pointerup',up)});
    R.targets=[{type:'hold'}];R.hint('h_hold',function(){return [800,600]});R.ride={hold:function(on){hold=on?1:0}};
    (function step(t){if(!document.getElementById('cartRide'))return;var dt=Math.min(.05,(t-last)/1000);last=t;v+=hold?dt*(R.FAST?3000:420):-dt*500;v=Math.max(0,Math.min(R.FAST?3000:260,v));x+=v*dt;ang+=v*dt*1.2;
      wheels.forEach(function(w){w.style.transform='rotate('+ang+'deg)'});c.style.left=(80+x*.85)+'px';c.style.transform='translateY('+(v>0?-Math.abs(Math.sin(t/90))*6:0)+'px)';
      $('#bgimg').style.transform='scale(1.25) translateX('+(-x*.18)+'px)';if(hold&&v>20&&Math.random()<.1)R.vib(8);
      if(x>=1150){R.clearHint();R.targets=[];st.removeEventListener('pointerdown',dn);st.removeEventListener('pointerup',up);R.sfx.ding();res();return}requestAnimationFrame(step)})(performance.now())});
  await R.award('cart','🛒');await mapGo(7);
  await R.transition(function(){R.clearScene('bg_sea');$('#bgimg').style.transition='';R.char('raijun',140,40,330);R.char('raa',400,40,290);var p=R.char('puss',1050,120,300);});
  R.map(STOPS,8);R.sfx.whistle(2);await say('sea1');R.hop('puss');
  var g=R.el('div','berry',berrySVG(),$('#world'));g.style.left='420px';g.style.top='560px';g.style.pointerEvents='none';g.style.transition='left 1.2s ease-in-out, top 1.2s ease-in-out';
  await say('gift');R.sfx.whoosh();g.style.left='1150px';g.style.top='620px';await wait(1250);R.sfx.chime();R.hop('puss');R.cheer();
  await say('puss_ty');await say('z1');
}
/* ---- v2.6 Zone C: candy-land goal flag & secret hatch (conversational) ---- */
function flagSVG(){var h='';for(var r=0;r<4;r++)for(var c=0;c<6;c++)if((r+c)%2===0)h+='<rect x="'+(c*35)+'" y="'+(r*35)+'" width="35" height="35" fill="#2b2b33"/>';
  return '<svg viewBox="0 0 210 140" width="210" height="140"><path d="M0 0H210V140H0Z" fill="#fff" stroke="#5a5a66" stroke-width="4"/>'+h+'</svg>'}
function starSVG(){return '<svg viewBox="0 0 100 100" width="110" height="110"><polygon points="50,5 61,37 95,38 68,58 78,92 50,72 22,92 32,58 5,38 39,37" fill="#ffd23a" stroke="#c98a10" stroke-width="5" stroke-linejoin="round"/><ellipse cx="40" cy="38" rx="10" ry="6" fill="#fff6c8"/></svg>'}
function hatchSVG(){return '<svg viewBox="0 0 260 130" width="260" height="130"><ellipse cx="130" cy="72" rx="126" ry="54" fill="#5d6470"/><ellipse cx="130" cy="64" rx="118" ry="50" fill="#9aa3ae" stroke="#4a515c" stroke-width="5"/><ellipse cx="130" cy="64" rx="92" ry="38" fill="none" stroke="#6f7884" stroke-width="5"/>'+
  [[40,64],[220,64],[130,20],[130,108],[66,32],[194,32],[66,96],[194,96]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#4a515c"/>'}).join('')+
  '<ellipse cx="130" cy="64" rx="30" ry="16" fill="#3a8fd6" stroke="#1c4f7c" stroke-width="4"/><circle cx="130" cy="58" r="7" fill="#123047"/><path d="M126 60L122 76H138L134 60Z" fill="#123047"/>'+
  '<g class="hmark"><path d="M186 46l22-12 8 12-22 12z" fill="#ff6fa5" stroke="#b8326b" stroke-width="3"/><path d="M199 52l14 26" stroke="#b8326b" stroke-width="5" stroke-linecap="round"/><path d="M172 70q8-6 16 0q-8 6-16 0z" fill="#6f7884"/></g></svg>'}
async function goal(){
  await say('c0');R.hop('puss');R.sfx.whoosh();
  await R.transition(function(){R.clearScene('bg_candy');R.char('raijun',20,40,300);R.char('raa',195,40,270)});
  R.map(STOPS,9);var W=$('#world');
  var pole=R.el('div','gPole',null,W);var star=R.el('div','gStar',starSVG(),W);var flag=R.el('div','gFlag',flagSVG(),W);
  var hatch=R.el('div','gHatch',hatchSVG(),W);
  var PX=1330,TOP=250,BASE=690;flag.style.left=(PX+10)+'px';flag.style.top=BASE+'px';
  await say('c1');await say('c2');
  // countdown 3-2-1 on gumdrops along the path
  var CD=[[3,470,650],[2,700,615],[1,930,580]];
  var drops=CD.map(function(d){var e=R.el('div','cdBtn','<b>'+d[0]+'</b>',W);e.style.left=(d[1]-90)+'px';e.style.top=(d[2]-90)+'px';return e});
  for(var i=0;i<3;i++){var e=drops[i];e.classList.add('next');await R.waitTap(e,'h_tap');e.classList.remove('next');e.classList.add('on');R.sfx.bead(i/3);R.vib(15);
    R.countPop(CD[i][0],CD[i][1],CD[i][2]-130);R.play('cnt'+CD[i][0]).catch(function(){});
    (function(el){setTimeout(function(){el.remove()},650)})(e);R.walkTo('raijun',20+(i+1)*130,700);R.walkTo('raa',195+(i+1)*130,700);await wait(900);if(i<2&&!R.FAST)R.show('c2n')}
  await say('c3');R.walkTo('raijun',860,900);await R.walkTo('raa',1090,900);R.hop('raijun');
  // raise the flag: drag up along a bead guide on the pole
  var beads=[];for(var y=BASE-10;y>TOP+40;y-=78){var b=R.el('div','gBead',null,W);b.style.left=(PX-36)+'px';b.style.top=(y-22)+'px';b.dataset.y=y;beads.push(b)}
  var topMk=R.el('div','gTopMk',null,W);topMk.style.left=(PX+20)+'px';topMk.style.top=(TOP+10)+'px';
  await say('c4');
  await R.mk(function(res){var pid=null,oy=0;R.targets=[{type:'drag',el:flag,to:topMk}];R.hint('h_drag',function(){return flag});
    flag.addEventListener('pointerdown',function(ev){ev.preventDefault();ev.stopPropagation();if(pid!==null)return;R.audioInit();pid=ev.pointerId;try{flag.setPointerCapture(pid)}catch(x){}oy=R.toStage(ev.clientX,ev.clientY)[1]-parseFloat(flag.style.top);R.sfx.tap();R.vib(12)});
    flag.addEventListener('pointermove',function(ev){if(ev.pointerId!==pid)return;var y=Math.max(TOP,Math.min(BASE,R.toStage(ev.clientX,ev.clientY)[1]-oy));flag.style.top=y+'px';
      beads.forEach(function(b){if(!b.classList.contains('on')&&y<=+b.dataset.y-40){b.classList.add('on');R.sfx.bead(1-(+b.dataset.y-TOP)/(BASE-TOP));R.vib(15)}});
      if(y<=TOP+30){pid=null;flag.style.top=TOP+'px';beads.forEach(function(b){b.classList.add('on')});R.clearHint();R.targets=[];res()}});
    function up(ev){if(ev.pointerId===pid)pid=null}flag.addEventListener('pointerup',up);flag.addEventListener('pointercancel',up)});
  topMk.remove();star.classList.add('win');R.sfx.fanfare();R.vib([30,40,60]);R.cheer();R.hop('raa');
  await say('c5');await R.award('goal','🏁');await say('c6');
  // secret hatch — characters go there together, child investigates
  beads.forEach(function(b){b.remove()});
  R.walkTo('raijun',300,1000);await R.walkTo('raa',840,1000);$('#cast .ch[data-who="raa"]').classList.add('crouch');
  await say('c7');await R.waitTap(hatch,'h_tap');hatch.classList.add('wig');R.sfx.clunk();R.vib([20,30,20]);setTimeout(function(){hatch.classList.remove('wig')},700);
  await say('c8');hatch.classList.add('mark');
  var eo=R.char('eodumi',1600,30,260);eo.style.transition='left .9s ease-out';void eo.offsetWidth;eo.style.left='1390px';await wait(900);
  await say('c9');eo.style.left='1700px';$('#cast .ch[data-who="raa"]').classList.remove('crouch');R.hop('raa');
  try{R.inv.episodes.ep1_hatch={state:'locked',seen:new Date().toISOString(),needs:'key_hatch'};R.saveInv()}catch(e){}
  await say(R.inv.items&&R.inv.items.key_hatch?'c10k':'c10');R.cheer();
}
async function finale(){
  await say('z3');
}
R.MODS.ep1={key:'ep1',calm:false,stops:STOPS,mapAt:[0,0,1,2,3,4,5,6,8],acts:[intro,bridge,elephantsAct,field,seeds,harvest,share,cart,goal],finale:finale,
  share:{ko:'숫자 1·2·3을 쓰고, 딸기 6개를 수확해서 숲속 친구들과 나눴어요! 남은 1개는 푸스에게 선물! 🍓 — 라이준 숫자·도형 1화',en:'My child wrote 3 and three elephants popped out! We planted 4 seeds, watered 3 times, picked 6 strawberries, shared 2, 1 and 2 with forest friends and gave the last one to Puss the orca! — Raijun Numbers & Shapes Ep.1',es:'¡Escribí los números 1, 2 y 3, coseché 6 fresas y las compartí con los amigos del bosque! La última fue un regalo para Puss. 🍓 — Raijun Números y Formas, ep. 1',zh:'我写了数字1、2、3，收获了6个草莓，和森林朋友们分享，最后一个送给了普斯！🍓——莱俊数字形状 第1集',fr:'J’ai écrit les chiffres 1, 2 et 3, cueilli 6 fraises et partagé avec les amis de la forêt ! La dernière, c’était un cadeau pour Puss. 🍓 — Raijun Chiffres et Formes, épisode 1'},
  next:{ko:'다음 2화: 반원과 반쪽 지도의 비밀!',en:'Next, Ep.2: semicircles and the half map!',es:'Próximo, episodio 2: ¡semicírculos y el medio mapa!',zh:'下一集：半圆和半张地图的秘密！',fr:'Prochain épisode 2 : les demi-cercles et la moitié de carte !'}};
})();
