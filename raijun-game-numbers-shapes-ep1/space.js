/* 라이준 우주 도형 놀이 — 발달장애 아동도 편하게: 큰 목표, 너그러운 따라쓰기, 한 번에 한 안내, 실패음 없음 */
(function(){
'use strict';
var R=window.R,$=R.$,say=R.say,wait=R.wait;
function U(b,u,v){return [b.x+u*b.s,b.y+v*b.s]}
function SU(b,arr){return arr.map(function(s){return s.map(function(p){return U(b,p[0],p[1])})})}
var NAME={earth:{ko:'지구',en:'Earth',es:'Tierra',zh:'地球',fr:'Terre'},mars:{ko:'화성',en:'Mars',es:'Marte',zh:'火星',fr:'Mars'},jupiter:{ko:'목성',en:'Jupiter',es:'Júpiter',zh:'木星',fr:'Jupiter'}};
function planetSVG(k){var u='pl'+Math.random().toString(36).slice(2,7);
  if(k==='earth')return '<svg viewBox="0 0 100 100"><defs><radialGradient id="'+u+'" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#9fe0ff"/><stop offset=".6" stop-color="#2a7fd6"/><stop offset="1" stop-color="#0b2f6b"/></radialGradient><clipPath id="c'+u+'"><circle cx="50" cy="50" r="48"/></clipPath></defs><circle cx="50" cy="50" r="48" fill="url(#'+u+')"/><g clip-path="url(#c'+u+')" fill="#4fbf4a" opacity=".95"><path d="M20 30q10-12 24-6t6 16-14 8-14 12-8-10 6-20z"/><path d="M58 52q14-6 22 4t-4 22-18 6-6-16 6-16z"/><path d="M60 14q10 0 14 6t-8 6-6-12z"/></g><circle cx="50" cy="50" r="48" fill="none" stroke="#bfefff" stroke-width="3" opacity=".7"/><ellipse cx="34" cy="28" rx="14" ry="7" fill="#fff" opacity=".35"/></svg>';
  if(k==='mars')return '<svg viewBox="0 0 100 100"><defs><radialGradient id="'+u+'" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffb07a"/><stop offset=".6" stop-color="#d4502a"/><stop offset="1" stop-color="#6b1d0e"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#'+u+')"/><circle cx="64" cy="60" r="8" fill="#a33a1c" opacity=".7"/><circle cx="36" cy="66" r="5" fill="#a33a1c" opacity=".7"/><circle cx="58" cy="32" r="4" fill="#a33a1c" opacity=".6"/><ellipse cx="34" cy="28" rx="14" ry="7" fill="#fff" opacity=".3"/></svg>';
  return '<svg viewBox="0 0 100 100"><defs><radialGradient id="'+u+'" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff0cf"/><stop offset="1" stop-color="#b9773a"/></radialGradient><clipPath id="c'+u+'"><circle cx="50" cy="50" r="48"/></clipPath></defs><circle cx="50" cy="50" r="48" fill="url(#'+u+')"/><g clip-path="url(#c'+u+')"><rect x="0" y="24" width="100" height="8" fill="#c98a4a"/><rect x="0" y="40" width="100" height="10" fill="#e0a868"/><rect x="0" y="58" width="100" height="9" fill="#b26a32"/><rect x="0" y="74" width="100" height="6" fill="#d89a5a"/><ellipse cx="66" cy="62" rx="10" ry="6" fill="#c8452a"/></g><ellipse cx="34" cy="26" rx="14" ry="7" fill="#fff" opacity=".35"/></svg>'}
var PL={};
function planet(k,x,y,r,instant){var p=PL[k];if(!p){p={el:R.el('div','planet',planetSVG(k),$('#world')),lb:R.el('div','plabel',R.T(NAME[k]),$('#world'))};p.el.dataset.k=k;PL[k]=p;instant=true}
  if(instant){p.el.style.transition='none';p.lb.style.transition='none'}
  p.el.style.left=(x-r)+'px';p.el.style.top=(y-r)+'px';p.el.style.width=p.el.style.height=(2*r)+'px';p.lb.style.left=x+'px';p.lb.style.top=(y+r+8)+'px';p.x=x;p.y=y;p.r=r;
  if(instant){void p.el.offsetWidth;p.el.style.transition='';p.lb.style.transition=''}return p}
var HOME={earth:[1180,600,200],mars:[800,470,95],jupiter:[470,400,40]};
function home(){['earth','mars','jupiter'].forEach(function(k){if(PL[k])planet(k,HOME[k][0],HOME[k][1],HOME[k][2])})}
function scene(){R.clearScene('bg_space');PL={};R.char('raijun',30,20,330);R.char('raa',240,20,280)}
function stars(){for(var i=0;i<40;i++){var s=R.el('div',null,null,$('#world'));s.style.cssText='position:absolute;left:'+(Math.random()*1600)+'px;top:'+(Math.random()*500)+'px;width:6px;height:6px;border-radius:50%;background:#fff;opacity:'+(.3+Math.random()*.6)+''}}
/* ---------------- A: 크다/작다, 원근 ---------------- */
async function actA(){
  await R.transition(function(){scene();stars()});R.setBgm(true);
  R.rays(true,800,300);
  await say('sp0');R.rays(false);
  var steps=[['a1','a2','earth',230],['a3','a4','mars',160],['a5','a6','jupiter',105]];
  for(var i=0;i<3;i++){var s=steps[i];
    await say(s[0]);
    await R.trace({strokes:[R.circlePts(800,570,s[3])],lw:80});
    R.sfx.chime();R.vib([20,30,40]);var p=planet(s[2],800,570,s[3],true);p.el.classList.add('pop3d');R.sparks(800,570,16);
    await wait(500);var h=HOME[s[2]];R.cam({z:1.06},800);planet(s[2],h[0],h[1],h[2]);
    await say(s[1]);R.cam({},600);
  }
  // 원근 데모: 카메라가 지구에서 목성으로
  R.cam({z:1.5,ox:'74%',oy:'66%'},1200);await wait(1200);R.cam({z:1.5,ox:'29%',oy:'44%'},1600);await wait(1400);R.cam({},1000);
  await say('a7');
  // 비밀: 목성이 진짜 제일 커요
  var real=R.el('div',null,'<div class="planet" style="position:absolute;left:0;top:0;width:520px;height:520px;transition:none">'+planetSVG('jupiter')+'</div><div class="planet" style="position:absolute;left:560px;top:430px;width:48px;height:48px;transition:none">'+planetSVG('earth')+'</div>',$('#fx'));
  real.style.cssText='position:absolute;left:420px;top:330px;transform:scale(0);transform-origin:40% 60%;transition:transform 1s cubic-bezier(.3,1.4,.5,1);z-index:13';
  await wait(30);real.style.transform='scale(1)';R.rays(true,700,560);
  await say('a8');real.style.transform='scale(0)';R.rays(false);await wait(600);real.remove();
  // 퀴즈: 큰 것, 작은 것 (틀려도 실패음 없이 다시 보기)
  await quiz('a9','earth','a_big');await quiz('a10','jupiter','a_small');
  await R.praise();await R.award('planet','🌍');
}
async function quiz(q,want,ok){
  await say(q);
  for(;;){var els=['earth','mars','jupiter'].map(function(k){return PL[k].el});R.targets=[{type:'tap',el:PL[want].el}];R.hint('h_tap',function(){return PL[want].el});
    var k=await R.mk(function(res){els.forEach(function(e){e.onpointerdown=function(ev){ev.stopPropagation();R.audioInit();res(e.dataset.k)}})});
    els.forEach(function(e){e.onpointerdown=null});R.clearHint();R.targets=[];
    if(k===want){var p=PL[k];R.sfx.ding();R.sparks(p.x,p.y,18);p.el.classList.remove('pop3d');void p.el.offsetWidth;p.el.classList.add('pop3d');await say(ok);return}
    R.sfx.tap();await say('a_look');}
}
/* ---------------- B: 세모 다리 ---------------- */
function truss(pts,dir){var svg='<svg class="svgLayer" viewBox="0 0 1600 900">';for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1];var n=4;for(var j=0;j<n;j++){var t0=j/n,t1=(j+1)/n,tm=(j+.5)/n;var x0=a[0]+(b[0]-a[0])*t0,y0=a[1]+(b[1]-a[1])*t0,x1=a[0]+(b[0]-a[0])*t1,y1=a[1]+(b[1]-a[1])*t1,xm=a[0]+(b[0]-a[0])*tm,ym=a[1]+(b[1]-a[1])*tm;
    var px=dir==='h'?xm:xm+38,py=dir==='h'?ym-38:ym;svg+='<polygon points="'+x0+','+y0+' '+x1+','+y1+' '+px+','+py+'" fill="rgba(255,120,130,.85)" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>'}
    svg+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="#ffd36a" stroke-width="10" stroke-linecap="round"/>'}
  var l=R.el('div',null,svg+'</svg>',$('#world'));l.className='svgLayer bridgeT';l.style.opacity=0;l.style.transition='opacity .8s';setTimeout(function(){l.style.opacity=1},50);return l}
async function actB(){
  await R.transition(function(){scene();stars();['earth','mars','jupiter'].forEach(function(k){planet(k,HOME[k][0],HOME[k][1],HOME[k][2],true)})});
  await say('b_1');
  var done={},first=true;
  for(;;){
    var c=await R.choice([{t:'btn_upright',icon:'<svg viewBox="0 0 100 100" width="70" height="70"><polygon points="50,8 94,90 6,90" fill="#ff7b84" stroke="#fff" stroke-width="6"/></svg>'},{t:'btn_lying',icon:'<svg viewBox="0 0 100 100" width="70" height="70"><polygon points="10,6 94,50 10,94" fill="#ff7b84" stroke="#fff" stroke-width="6"/></svg>'}]);
    var up=c===0;document.querySelectorAll('.bridgeT').forEach(function(e){e.remove()});home();await wait(300);
    await say(up?'b_up':'b_lie');
    var st=up?[[[800,370],[610,750]],[[800,370],[990,750]],[[610,750],[990,750]]]:[[[620,380],[620,740]],[[620,380],[980,560]],[[620,740],[980,560]]];
    await R.trace({strokes:st,lw:80});
    R.morphFx(800,560,['tri','tri']);R.sfx.chime();
    var pos=up?{earth:[330,560,120],mars:[800,560,80],jupiter:[1270,560,52]}:{earth:[1350,390,70],mars:[1350,600,52],jupiter:[1350,790,38]};
    ['earth','mars','jupiter'].forEach(function(k){var p=pos[k];planet(k,p[0],p[1],p[2])});
    await wait(1100);truss([pos.earth,pos.mars,pos.jupiter],up?'h':'v');R.sfx.clunk();R.vib([20,30,20]);
    await say(up?'b_upd':'b_lied');done[up?'u':'l']=1;
    if(done.u&&done.l)break;
    await say('b_again');var a=await R.choice([{t:'btn_yes'},{t:'btn_next',alt:1}]);if(a===1)break;
  }
  await R.praise();await R.award('bridge','🔺');
}
/* ---------------- C: 네모 역 + 점선 길 ---------------- */
function stationSVG(){return '<svg viewBox="0 0 100 100"><rect x="14" y="36" width="72" height="58" rx="6" fill="#7fc4ff" stroke="#fff" stroke-width="4"/><polygon points="8,40 50,8 92,40" fill="#ff7b84" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><rect x="40" y="62" width="20" height="32" rx="3" fill="#2f5f9a"/><circle cx="28" cy="54" r="7" fill="#ffe37a"/><circle cx="72" cy="54" r="7" fill="#ffe37a"/></svg>'}
async function actC(){
  await R.transition(function(){scene();stars();['earth','mars','jupiter'].forEach(function(k){planet(k,HOME[k][0],HOME[k][1],HOME[k][2],true)})});
  await say('c1');
  var plan=[
    {k:'earth',q:'c_big',s:300,line:'c_line_s',ok:'c_e',path:[[620,700],[960,700]]},
    {k:'mars',q:'c_mid',s:210,line:'c_line_c',ok:'c_m',path:R.bez([560,820],[860,880],[560,560],[760,580],30)},
    {k:'jupiter',q:'c_small',s:140,line:'c_line_d',ok:'c_j',path:[[760,800],[500,470]]}];
  for(var i=0;i<plan.length;i++){var P=plan[i],s=P.s,b={x:800-s/2,y:600-s/2,s:s};
    await say(P.q);
    await R.trace({strokes:SU(b,[[[0,0],[0,1]],[[0,0],[1,0]],[[1,0],[1,1]],[[0,1],[1,1]]]),lw:Math.max(60,s/4)});
    var st=R.el('div','station',stationSVG(),$('#world'));st.style.transition='none';st.style.left=b.x+'px';st.style.top=b.y+'px';st.style.width=st.style.height=s+'px';st.classList.add('pop3d');R.sfx.chime();R.vib(30);
    await say('c_st');
    var p0=P.path[0];st.classList.remove('pop3d');st.style.transition='';void st.offsetWidth;st.style.left=(p0[0]-50)+'px';st.style.top=(p0[1]-100)+'px';st.style.width=st.style.height='100px';
    var d='M'+P.path.map(function(p){return p[0]+' '+p[1]}).join(' L');var g=R.el('div',null,'<svg viewBox="0 0 1600 900"><path d="'+d+'" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="4 26" stroke-linecap="round"/></svg>',$('#world'));g.className='svgLayer';
    await wait(1200);await say(P.line);
    await R.trace({strokes:[P.path],lw:80,onStroke:function(){}});
    g.remove();var pl=PL[P.k],w=Math.max(70,pl.r*1.1);
    st.style.left=(pl.x-w/2)+'px';st.style.top=(pl.y-pl.r-w*.82)+'px';st.style.width=st.style.height=w+'px';R.sfx.whoosh();
    await wait(1250);R.sfx.clunk();R.vib([30,20,30]);R.sparks(pl.x,pl.y-pl.r,16);
    await say(P.ok);
  }
  await R.praise();await R.award('station','🏠');
}
/* ---------------- D: 같은 크기 잇기, >, = ---------------- */
async function actD(){
  await R.transition(function(){scene();stars()});
  var PP={earth:[1200,430,95],mars:[1200,620,65],jupiter:[1200,800,40]};
  ['earth','mars','jupiter'].forEach(function(k){planet(k,PP[k][0],PP[k][1],PP[k][2],true)});
  var CC={jupiter:[560,430],earth:[560,620],mars:[560,800]};
  var svg=R.el('div',null,'<svg viewBox="0 0 1600 900"></svg>',$('#world'));svg.className='svgLayer';var S=svg.firstChild;
  var circ={};Object.keys(CC).forEach(function(k){var r=PP[k][2],c=R.el('div','mcircle',null,$('#world'));c.style.cssText+=';left:'+(CC[k][0]-r)+'px;top:'+(CC[k][1]-r)+'px;width:'+2*r+'px;height:'+2*r+'px;border:8px solid #fff;background:rgba(255,255,255,.15);box-sizing:border-box;box-shadow:0 0 30px rgba(160,220,255,.8)';c.dataset.k=k;circ[k]=c});
  await say('d1');
  var left=['earth','mars','jupiter'];
  while(left.length){
    R.targets=left.map(function(k){return {type:'drag',el:circ[k],to:PL[k].el}});R.hint('h_drag',function(){return circ[left[0]]});
    var res=await R.mk(function(done){var line=null,pid=null,from=null,pick=null;
      function sp(e){return R.toStage(e.clientX,e.clientY)}
      left.forEach(function(k){var c=circ[k];c.onpointerdown=function(e){e.preventDefault();e.stopPropagation();if(pid!==null)return;R.audioInit();pid=e.pointerId;from=k;try{c.setPointerCapture(pid)}catch(x){}R.sfx.tap();line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',CC[k][0]);line.setAttribute('y1',CC[k][1]);line.setAttribute('x2',CC[k][0]);line.setAttribute('y2',CC[k][1]);line.setAttribute('stroke','#ffd36a');line.setAttribute('stroke-width','16');line.setAttribute('stroke-linecap','round');S.appendChild(line)};
        c.onpointermove=function(e){if(e.pointerId!==pid)return;var p=sp(e);line.setAttribute('x2',p[0]);line.setAttribute('y2',p[1])};
        c.onpointerup=c.onpointercancel=function(e){if(e.pointerId!==pid)return;pid=null;var p=sp(e),hit=null;['earth','mars','jupiter'].forEach(function(q){var P=PL[q];if(Math.hypot(p[0]-P.x,p[1]-P.y)<P.r+70)hit=q});
          if(!hit){line.remove();return}done({from:from,to:hit,line:line})}})});
    left.forEach(function(k){var c=circ[k];c.onpointerdown=c.onpointermove=c.onpointerup=c.onpointercancel=null});R.clearHint();R.targets=[];
    var P=PL[res.to];
    if(res.from===res.to){res.line.setAttribute('x2',P.x-P.r);res.line.setAttribute('y2',P.y);res.line.setAttribute('stroke','#7dff9a');R.sfx.ding();R.vib([20,20,40]);R.sparks(P.x,P.y,14);circ[res.from].style.borderColor='#7dff9a';left.splice(left.indexOf(res.from),1);
      await say(res.from==='earth'?'d_e':res.from==='mars'?'d_m':'d_j')}
    else{res.line.remove();R.sfx.tap();await say('calm_retry')}
  }
  await say('d_same');
  // > 기호
  await R.transition(function(){$('#world').innerHTML='';PL={};stars()});
  var big=R.el('div','planet',planetSVG('earth'),$('#world'));big.style.cssText+=';left:280px;top:410px;width:300px;height:300px';
  var sm=R.el('div','planet',planetSVG('jupiter'),$('#world'));sm.style.cssText+=';left:1090px;top:510px;width:100px;height:100px';
  await say('d2');
  var b={x:650,y:410,s:300};
  await R.trace({strokes:[SU(b,[[[.3,.2],[.7,.5],[.3,.8]]])[0]],lw:80,fit:400,cy:560});
  R.popText('&gt;',800,560);R.sfx.chime();big.classList.add('pop3d');
  await say('d3');
  // = 기호
  await R.transition(function(){$('#world').innerHTML='';stars();[[330,420],[1070,420]].forEach(function(p){var e=R.el('div','planet',planetSVG('mars'),$('#world'));e.style.cssText+=';left:'+p[0]+'px;top:'+p[1]+'px;width:200px;height:200px'})});
  await say('d4');
  await R.trace({strokes:[[[650,480],[950,480]],[[650,600],[950,600]]],lw:70,fit:220,fitW:520,cy:540});
  R.popText('=',800,540);R.sfx.chime();
  await R.praise();await R.award('compare','⚖️');
}
/* ---------------- E: 배 · 크다/작다 ---------------- */
var G={
  '배':[[[.12,.22],[.12,.8]],[[.46,.22],[.46,.8]],[[.12,.5],[.46,.5]],[[.12,.8],[.46,.8]],[[.66,.12],[.66,.9]],[[.66,.48],[.78,.48]],[[.82,.12],[.82,.9]]],
  '크':[[[.28,.12],[.72,.12],[.68,.48]],[[.3,.3],[.7,.3]],[[.1,.7],[.9,.7]]],
  '다':[[[.15,.25],[.5,.25]],[[.15,.25],[.15,.75],[.52,.75]],[[.7,.1],[.7,.9]],[[.7,.5],[.86,.5]]],
  '작':[[[.15,.12],[.48,.12],[.18,.45]],[[.33,.27],[.52,.45]],[[.7,.06],[.7,.6]],[[.7,.32],[.86,.32]],[[.2,.7],[.8,.7],[.8,.94]]]};
async function word(w){var n=w.length,s=n===1?420:330,x0=800-n*s/2;var strokes=[];for(var i=0;i<n;i++)strokes=strokes.concat(SU({x:x0+i*s,y:n===1?310:360,s:s},G[w[i]]));await R.trace({strokes:strokes,lw:n===1?66:56,fit:n===1?470:400,fitW:n===1?960:1100,cx:n===1?880:800,cy:n===1?555:575,sx:n===1?1.5:1.2})}
function boatSVG(){return '<svg viewBox="0 0 200 160"><line x1="100" y1="10" x2="100" y2="110" stroke="#8a5422" stroke-width="7"/><polygon points="104,14 104,100 170,100" fill="#fff" stroke="#9ad" stroke-width="3"/><polygon points="96,24 96,100 40,100" fill="#ffd36a" stroke="#e0a030" stroke-width="3"/><path d="M14 108h172l-26 42H40z" fill="#c9672e" stroke="#7a3a12" stroke-width="5" stroke-linejoin="round"/><rect x="40" y="118" width="120" height="8" rx="4" fill="#ffd36a"/><circle cx="60" cy="136" r="5" fill="#fff"/><circle cx="100" cy="136" r="5" fill="#fff"/><circle cx="140" cy="136" r="5" fill="#fff"/></svg>'}
async function actE(){
  var rj,ra;
  await R.transition(function(){R.clearScene('bg_sea');PL={};rj=R.char('raijun',40,30,330);ra=R.char('raa',250,30,280)});
  await say('e_1');
  await word('배');
  var bt=R.el('div','boat',boatSVG(),$('#world'));bt.style.left='540px';bt.style.top='560px';bt.style.width='320px';bt.style.height='256px';bt.style.transform='scale(0)';
  R.sfx.chime();R.rays(true,700,690);await wait(40);bt.style.transform='scale(1)';R.sparks(700,690,18);
  await say('e_boat');R.rays(false);bt.classList.add('bob');
  await say('e_2');
  var c=await R.choice([{t:'btn_big',icon:'⬆️'},{t:'btn_small',icon:'⬇️'}]);
  if(c===1){await say('e_wsmall');await word('작다');bt.classList.remove('bob');bt.style.transform='scale(.55)';R.sfx.whoosh();await wait(1200);await say('e_issmall');await say('e_tobig')}
  else await say('e_wbig');
  await word('크다');bt.classList.remove('bob');bt.style.transform='scale(1.5)';R.sfx.fanfare();R.sparks(700,690,20);await wait(1200);
  await say('e_isbig');
  // 모두 탑승
  [rj,ra].forEach(function(e){e.style.transition='all .8s cubic-bezier(.4,1.4,.5,1)'});rj.style.left='560px';rj.style.bottom='250px';rj.style.height='220px';ra.style.left='690px';ra.style.bottom='250px';ra.style.height='190px';R.sfx.boing();await wait(900);
  var crew=R.el('div',null,'<img class="rider" src="img/raijun.webp" style="position:absolute;left:28%;bottom:52%;height:60%"><img class="rider" src="img/raa.webp" style="position:absolute;left:52%;bottom:52%;height:52%">',bt);crew.style.cssText='position:absolute;inset:0;z-index:-1';rj.style.opacity=0;ra.style.opacity=0;
  await say('e_go');await R.choice([{t:'btn_go',icon:'⛵'}]);
  R.sfx.horn();R.vib([40,40,80]);bt.style.left='1120px';bt.style.top='470px';bt.style.transform='scale(.7)';R.cam({z:1.15,ox:'70%',oy:'60%'},5000);
  await wait(5000);R.sfx.whistle(1);R.char('puss',1300,190,170);
  await say('e_arrive');R.cam({},800);await R.praise();await R.award('boat','⛵');
}
async function finale(){await say('sp_end')}
R.MODS=R.MODS||{};
R.MODS.space={key:'space',calm:true,acts:[actA,actB,actC,actD,actE],finale:finale,
  share:{ko:'우리 아이가 동그라미를 그려 지구·화성·목성을 만들고, "배"와 "크다"를 써서 섬까지 항해했어요! ⛵ — 라이준 우주 도형 놀이',en:'My child drew circles to make Earth, Mars and Jupiter, then wrote "boat" and "big" to sail to the island! ⛵ — Raijun Space Shapes',es:'¡Dibujé círculos para hacer la Tierra, Marte y Júpiter, y navegué hasta la isla! ⛵ — Raijun Formas del espacio',zh:'我画圆做出了地球、火星和木星，还坐船到了小岛！⛵——莱俊太空形状游戏',fr:'J’ai dessiné des ronds pour faire la Terre, Mars et Jupiter, puis j’ai navigué jusqu’à l’île ! ⛵ — Raijun Formes de l’espace'},
  next:{ko:'또 하고 싶으면 처음부터 눌러요. 천천히, 여러 번 해도 좋아요.',en:'Play again any time. Slowly and many times is great.',es:'Juega otra vez cuando quieras. ¡Despacio y muchas veces está genial!',zh:'想玩就再玩一次吧。慢慢来，多玩几次也很好！',fr:'Rejoue quand tu veux. Doucement et plusieurs fois, c’est très bien !'}};
})();
