const forestEdition=document.documentElement.dataset.edition==='forest';

const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const show=id=>{if(forestEdition&&id!=='trace'&&$('trace').classList.contains('on')){endForestPointer();cancelAnimationFrame(gAnim);$('dot').setAttribute('opacity',0)}
 document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));const n=document.getElementById('nav');n&&n.classList.toggle('on',id!=='start');try{ensureRetryEnabled()}catch(e){}};
let GEN=0,VS=null;const T=(f,ms)=>{const g=GEN;return setTimeout(()=>{if(g===GEN)f()},ms)};
const STAGES=[
 {syl:'가',bg:'gazelle_poster.jpg',jamo:[{n:'ㄱ',name:'기역!',v:'기역!',strokes:['M10 28 H36 Q42 28 42 34 V78']},
   {n:'ㅏ',name:'아!',v:'아!',prompt:'이번엔 ㅏ를 써 볼까?',pv:'이번엔 아를 써 볼까?',strokes:['M68 12 V90','M68 50 H88']}],
  formula:'ㄱ + ㅏ = 가',merge:'기역하고 아가 만나면 가!',mergeT:'기역하고 아가 만나면 가!',name:'가젤의 가!',wow:'우와! 가젤이다!',video:'gazelle.mp4',poster:'gazelle_poster.jpg'},
 {syl:'고',bg:'gorilla_poster.jpg',jamo:[{n:'ㄱ',name:'기역!',v:'기역!',strokes:['M22 20 H70 Q76 20 76 26 V46']},
   {n:'ㅗ',name:'오!',v:'오!',prompt:'이번엔 ㅗ를 써 볼까?',pv:'이번엔 오를 써 볼까?',strokes:['M50 56 V72','M12 78 H88']}],
  formula:'ㄱ + ㅗ = 고',merge:'기역하고 오가 만나면 고!',mergeT:'기역하고 오가 만나면 고!',name:'고릴라의 고!',wow:'우와! 고릴라다!',video:'gorilla.mp4',poster:'gorilla_poster.jpg',animal:'gorilla'},
 {syl:'기',bg:'giraffe_poster.jpg',animal:'giraffe',jamo:[{n:'ㄱ',name:'기역!',v:'기역!',strokes:['M14 30 H44 Q50 30 50 36 V74']},
   {n:'ㅣ',name:'이!',v:'이!',prompt:'이번엔 ㅣ를 써 볼까?',pv:'이번엔 이를 써 볼까?',strokes:['M74 16 V86']}],
  formula:'ㄱ + ㅣ = 기',merge:'기역하고 이가 만나면 기!',mergeT:'기역하고 이가 만나면 기!',name:'기린의 기!',wow:'우와! 기린이다!',video:'giraffe.mp4',poster:'giraffe_poster.jpg'}];
STAGES[0].animal='gazelle';
// ================= modules =================
// ---- settings (persisted) ----
const SET=Object.assign({limit:'0',tol:'normal',size:'M',hand:'right',guide:'on',lift:'on',quiet:(matchMedia('(prefers-reduced-motion: reduce)').matches?'on':'off'),lang:'ko'},JSON.parse(localStorage.getItem('raijun_ep1_set')||'{}'));
const TOL={easy:.18,normal:.13,hard:.09},PADSZ={S:72,M:86,L:94};
function applySet(){localStorage.setItem('raijun_ep1_set',JSON.stringify(SET));const A=$('app');A.style.setProperty('--pad',PADSZ[SET.size]);A.classList.toggle('hand-right',SET.hand==='right');
 document.body.classList.toggle('quiet',SET.quiet==='on');document.documentElement.lang=SET.lang;
 document.querySelectorAll('.seg').forEach(g=>g.querySelectorAll('button').forEach(b=>b.classList.toggle('on',SET[g.dataset.k]===b.dataset.v)));
 document.querySelectorAll('[data-t]').forEach(e=>e.textContent=tr(e.dataset.t));if(typeof BGM!=='undefined'&&BGM){BGM_LV=SET.quiet==='on'?0:.55;BGM.gain.setTargetAtTime(BGM_LV,AC.currentTime,.2);SFXG.gain.value=SET.quiet==='on'?.5:1}
 if(typeof sizeCv==='function')requestAnimationFrame(()=>{sizeCv();if(typeof JM!=='undefined'&&JM.length&&!done)showGuide()})}
document.querySelectorAll('.seg').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;SET[g.dataset.k]=b.dataset.v;applySet();if(g.dataset.k==='lang'&&AC)loadVoices()}));
// parent gate: long-press gear 2 s
(()=>{const g=$('gear');if(forestEdition){g.addEventListener('click',()=>gate(openParent));return}let t;const st_=e=>{e.preventDefault();g.classList.add('hold');t=setTimeout(()=>{g.classList.remove('hold');gate(openParent)},2000)},en=()=>{clearTimeout(t);g.classList.remove('hold')};
 g.addEventListener('pointerdown',st_);['pointerup','pointerleave','pointercancel'].forEach(k=>g.addEventListener(k,en));g.addEventListener('contextmenu',e=>e.preventDefault())})();
$('setclose').onclick=()=>$('settings').classList.remove('on');
// ---- parent gate: (long-press done) + simple math ----
function gate(ok){const a=2+Math.floor(Math.random()*7),b=2+Math.floor(Math.random()*7),r=a+b,opts=[r,r+1+Math.floor(Math.random()*3),r-1-Math.floor(Math.random()*2)].sort(()=>Math.random()-.5);
 $('gq').textContent=`${a} + ${b} = ?`;$('gch').innerHTML='';opts.forEach(v=>{const bt=document.createElement('button');bt.className='btn s';bt.textContent=v;bt.onclick=()=>{if(v===r){$('gate').classList.remove('on');ok()}else gate(ok)};$('gch').appendChild(bt)});$('gate').classList.add('on')}
$('gx').onclick=()=>$('gate').classList.remove('on');
function openParent(){renderProg();$('settings').classList.add('on')}
// ---- progress log (localStorage only) ----
const PROG=JSON.parse(localStorage.getItem('raijun_ep1_prog')||'{"letters":{},"animals":{},"sessions":0}');
function saveProg(){localStorage.setItem('raijun_ep1_prog',JSON.stringify(PROG))}
const today=()=>new Date().toLocaleDateString('sv');
function logLetter(l){const o=PROG.letters[l]||(PROG.letters[l]={count:0,first:today()});o.count++;o.last=today();saveProg()}
function logAnimal(a){const o=PROG.animals[a]||(PROG.animals[a]={count:0,first:today()});o.count++;o.last=today();saveProg()}
function renderProg(){const L=Object.entries(PROG.letters),A=Object.entries(PROG.animals),nm={gazelle:tr('가젤'),gorilla:tr('고릴라'),giraffe:tr('기린')};
 $('prog').innerHTML=`<small>${tr('글자')}: ${L.length?L.map(([k,o])=>`<b>${k}</b> ×${o.count} (${o.first}${o.last!==o.first?' ~ '+o.last:''})`).join(' · '):'—'}<br>${tr('구한 동물')}: ${A.length?A.map(([k,o])=>`${nm[k]} ×${o.count} (${o.first})`).join(' · '):'—'}<br>${tr('시작 횟수')}: ${PROG.sessions}</small>`;
 const u=useGet();$('usage').textContent=`${tr('오늘 사용')}: ${Math.round(u.sec/60)}′`}
$('progclr').onclick=()=>{['raijun_ep1_prog','raijun_ep1_dex','raijun_ep1_use'].forEach(k=>localStorage.removeItem(k));PROG.letters={};PROG.animals={};PROG.sessions=0;DEX.length=0;renderProg()};
// ---- daily time limit ----
function useGet(){const u=JSON.parse(localStorage.getItem('raijun_ep1_use')||'{}');return u.date===today()?u:{date:today(),sec:0}}
let restOn=false;
setInterval(()=>{if(document.hidden||$('start').classList.contains('on'))return;const u=useGet();u.sec+=5;localStorage.setItem('raijun_ep1_use',JSON.stringify(u));
 const lim=+SET.limit||0;if(lim&&u.sec>=lim*60&&!restOn){restOn=true;try{vid.pause()}catch(e){}if(BGM)BGM.gain.setTargetAtTime(0,AC.currentTime,.5);$('rest').classList.add('on');say('라이준도 쉬러 갈 시간이야')}},5000);
// parent can lift the rest screen via long-press anywhere 2s + math
(()=>{let t;const r=$('rest');r.addEventListener('pointerdown',()=>{t=setTimeout(()=>gate(()=>{SET.limit='0';applySet();restOn=false;r.classList.remove('on');if(BGM)BGM.gain.setTargetAtTime(BGM_LV,AC.currentTime,.3)}),2000)});['pointerup','pointercancel'].forEach(k=>r.addEventListener(k,()=>clearTimeout(t)))})();
// ---- i18n: subtitles keyed by the Korean source string ----
const KO_FIX={PRIV:"계정이 없어요. 기록과 설정은 이 기기 브라우저(localStorage)에만 저장되고, 서버 전송·광고·추적기·외부 요청이 없어요. '기록 지우기'로 언제든 삭제할 수 있어요.",AI:'일부 영상·음성은 AI 도구로 만들었어요. 한글 글자는 페이지가 직접 그린 벡터예요.'};
const FR={'잘했어! 이제 N번!':'Bravo ! Maintenant le N !','라이준 한글 1화':'Raijun Hangul – Épisode 1','ㄱ 친구들':'Les amis de ㄱ','시작':'Commencer','소리를 켜 주세요 🔊':'Monte le son 🔊',
 '손가락으로 따라 써 봐!':'Suis le tracé avec ton doigt !','좋아요, 계속!':'Super, continue !','다시 한 번 해 볼까?':'On essaie encore une fois ?','기역!':'Giyeok !','아!':'A !','오!':'O !',
 '이번엔 ㅏ를 써 볼까?':'Maintenant, on écrit ㅏ ?','이번엔 ㅗ를 써 볼까?':'Maintenant, on écrit ㅗ ?','잘했어! 이제 2번!':'Bravo ! Maintenant le 2 !',
 '기역은 그 소리!':'Giyeok fait le son « g » !','기역하고 아가 만나면 가!':'Giyeok et A ensemble... Ga !','기역하고 오가 만나면 고!':'Giyeok et O ensemble... Go !',
 '가젤의 가!':'Ga comme gazelle !','고릴라의 고!':'Go comme gorille !','반짝반짝 다시 한 번!':'Encore une fois, tout brillant !','가!':'Ga !','고!':'Go !',
 '우와! 가젤이다!':'Waouh ! Une gazelle !','우와! 고릴라다!':'Waouh ! Un gorille !','1화 완성! ㄱ 친구들 최고!':'Épisode 1 terminé ! Bravo les amis de ㄱ !',
 '다음 글자 ▶':'Lettre suivante ▶','한 번 더 써 볼까?':'On réécrit ?','한 번 더 보기':'Revoir','처음부터 다시':'Recommencer','고 다시 쓰기':'Réécrire 고','▶ 눌러서 보기':'▶ Touche pour voir',
 '도감':'Album','라이준 동물 도감':'Album des animaux de Raijun','가젤':'Gazelle','고릴라':'Gorille','돌아가기':'Retour','부모님 설정':'Réglages parents',
 '따라쓰기 난이도':'Difficulté','쉬움':'Facile','보통':'Normal','어려움':'Difficile','글자 크기':'Taille des lettres','쓰는 손':'Main','왼손':'Gauche','오른손':'Droite',
 '획순 안내':'Guide de tracé','보이기':'Afficher','숨기기':'Masquer','손 떼고 이어 쓰기':'Continuer après avoir levé le doigt','허용':'Oui','안 함':'Non','조용한 모드':'Mode calme','켜기':'Activer','끄기':'Désactiver','언어':'Langue','닫기':'Fermer',
 '폰을 가로로 돌려 주세요':'Tourne ton téléphone','그냥 할래요':'Continuer quand même','1단계 · 가':'Étape 1 · 가','2단계 · 고':'Étape 2 · 고','다음 글자도 써 볼까?':'On écrit la lettre suivante ?','부모님 확인':'Vérification parent','라이준도 쉬러 갈 시간이야':'Raijun aussi va se reposer !','내일 또 만나요!':'À demain !','계속 ▶':'Continuer ▶',
 '진행 기록':'Progrès','기록 지우기':'Effacer','하루 사용 시간':'Temps par jour','제한 없음':'Illimité','활동지':'Fiche d\'activité','활동지 출력':'Imprimer la fiche','A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠':'A4 · tracer ㄱ / 가 / 고 + coloriage',
 '개인정보':'Confidentialité','PRIV':'Aucun compte. Les progrès et réglages restent dans ce navigateur (localStorage) : pas de serveur, pas de pub, pas de traceur, pas de requête externe. « Effacer » supprime tout.',
 '만든 사람들 · 출처':'Crédits','AI':'Certaines vidéos et voix ont été créées avec des outils d\'IA. Les lettres coréennes sont dessinées en vecteur par la page.','글자':'Lettres','구한 동물':'Animaux sauvés','시작 횟수':'Sessions','오늘 사용':'Aujourd\'hui'};
const I18N=Object.assign({fr:FR},{"en": {"라이준 한글 1화": "Raijun Hangul · Episode 1", "ㄱ 친구들": "ㄱ Friends", "시작": "Start", "소리를 켜 주세요 🔊": "Turn the sound on 🔊", "손가락으로 따라 써 봐!": "Trace it with your finger!", "좋아요, 계속!": "Great, keep going!", "다시 한 번 해 볼까?": "Shall we try one more time?", "기역!": "기역 (giyeok)!", "아!": "아 (a)!", "오!": "오 (o)!", "이번엔 ㅏ를 써 볼까?": "Now let's write ㅏ!", "이번엔 ㅗ를 써 볼까?": "Now let's write ㅗ!", "잘했어! 이제 2번!": "Well done! Now stroke 2!", "기역은 그 소리!": "기역 makes the sound “그” (g)!", "기역하고 아가 만나면 가!": "기역 + 아 together make... 가!", "기역하고 오가 만나면 고!": "기역 + 오 together make... 고!", "가젤의 가!": "가, like gazelle!", "고릴라의 고!": "고, like gorilla!", "반짝반짝 다시 한 번!": "Sparkle — once more!", "가!": "가!", "고!": "고!", "우와! 가젤이다!": "Wow! A gazelle!", "우와! 고릴라다!": "Wow! A gorilla!", "1화 완성! ㄱ 친구들 최고!": "Episode 1 done! ㄱ friends are the best!", "다음 글자 ▶": "Next letter ▶", "한 번 더 써 볼까?": "Write it again?", "한 번 더 보기": "Watch again", "처음부터 다시": "Start over", "고 다시 쓰기": "Write 고 again", "▶ 눌러서 보기": "▶ Tap to watch", "도감": "Album", "라이준 동물 도감": "Raijun's Animal Album", "가젤": "Gazelle", "고릴라": "Gorilla", "돌아가기": "Back", "부모님 설정": "Parent settings", "따라쓰기 난이도": "Tracing difficulty", "쉬움": "Easy", "보통": "Normal", "어려움": "Hard", "글자 크기": "Letter size", "쓰는 손": "Writing hand", "왼손": "Left", "오른손": "Right", "획순 안내": "Stroke-order guide", "보이기": "Show", "숨기기": "Hide", "손 떼고 이어 쓰기": "Continue after lifting finger", "허용": "Yes", "안 함": "No", "조용한 모드": "Quiet mode", "켜기": "On", "끄기": "Off", "언어": "Language", "닫기": "Close", "폰을 가로로 돌려 주세요": "Please turn your phone sideways", "그냥 할래요": "Continue anyway", "1단계 · 가": "Step 1 · 가", "2단계 · 고": "Step 2 · 고", "다음 글자도 써 볼까?": "Shall we write the next letter?", "부모님 확인": "Parent check", "라이준도 쉬러 갈 시간이야": "Raijun needs a rest too!", "내일 또 만나요!": "See you tomorrow!", "계속 ▶": "Continue ▶", "진행 기록": "Progress", "기록 지우기": "Clear records", "하루 사용 시간": "Daily time limit", "제한 없음": "No limit", "활동지": "Activity sheet", "활동지 출력": "Print activity sheet", "A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠": "A4 · trace ㄱ / 가 / 고 + colouring", "개인정보": "Privacy", "PRIV": "No accounts. Progress and settings stay only in this browser (localStorage): no server, no ads, no trackers, no external requests. “Clear records” deletes everything.", "만든 사람들 · 출처": "Credits & sources", "AI": "Some videos and voices were made with AI tools. The Hangul letters are vector drawings rendered by the page.", "글자": "Letters", "구한 동물": "Animals rescued", "시작 횟수": "Sessions", "오늘 사용": "Today", "잘했어! 이제 N번!": "Well done! Now stroke N!"}, "zh": {"라이준 한글 1화": "Raijun 韩文 · 第1集", "ㄱ 친구들": "ㄱ 的朋友们", "시작": "开始", "소리를 켜 주세요 🔊": "请打开声音 🔊", "손가락으로 따라 써 봐!": "用手指跟着写吧！", "좋아요, 계속!": "很好，继续！", "다시 한 번 해 볼까?": "我们再试一次吧？", "기역!": "기역 (giyeok)！", "아!": "아 (a)！", "오!": "오 (o)！", "이번엔 ㅏ를 써 볼까?": "现在来写 ㅏ 吧！", "이번엔 ㅗ를 써 볼까?": "现在来写 ㅗ 吧！", "잘했어! 이제 2번!": "真棒！现在写第2笔！", "기역은 그 소리!": "기역 发 “그” (g) 的音！", "기역하고 아가 만나면 가!": "기역 和 아 在一起…… 가！", "기역하고 오가 만나면 고!": "기역 和 오 在一起…… 고！", "가젤의 가!": "羚羊的 가！", "고릴라의 고!": "大猩猩的 고！", "반짝반짝 다시 한 번!": "闪闪发光，再来一次！", "가!": "가！", "고!": "고！", "우와! 가젤이다!": "哇！是羚羊！", "우와! 고릴라다!": "哇！是大猩猩！", "1화 완성! ㄱ 친구들 최고!": "第1集完成！ㄱ 的朋友们真棒！", "다음 글자 ▶": "下一个字 ▶", "한 번 더 써 볼까?": "再写一次？", "한 번 더 보기": "再看一次", "처음부터 다시": "从头开始", "고 다시 쓰기": "再写一次 고", "▶ 눌러서 보기": "▶ 点一下观看", "도감": "图鉴", "라이준 동물 도감": "Raijun 动物图鉴", "가젤": "羚羊", "고릴라": "大猩猩", "돌아가기": "返回", "부모님 설정": "家长设置", "따라쓰기 난이도": "描写难度", "쉬움": "简单", "보통": "普通", "어려움": "困难", "글자 크기": "字的大小", "쓰는 손": "书写的手", "왼손": "左手", "오른손": "右手", "획순 안내": "笔顺提示", "보이기": "显示", "숨기기": "隐藏", "손 떼고 이어 쓰기": "抬起手指后继续写", "허용": "允许", "안 함": "不允许", "조용한 모드": "安静模式", "켜기": "开", "끄기": "关", "언어": "语言", "닫기": "关闭", "폰을 가로로 돌려 주세요": "请把手机横过来", "그냥 할래요": "直接继续", "1단계 · 가": "第1步 · 가", "2단계 · 고": "第2步 · 고", "다음 글자도 써 볼까?": "我们来写下一个字吧？", "부모님 확인": "家长确认", "라이준도 쉬러 갈 시간이야": "Raijun 也要休息啦！", "내일 또 만나요!": "明天见！", "계속 ▶": "继续 ▶", "진행 기록": "学习记录", "기록 지우기": "清除记录", "하루 사용 시간": "每日使用时间", "제한 없음": "不限制", "활동지": "练习纸", "활동지 출력": "打印练习纸", "A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠": "A4 · 描写 ㄱ / 가 / 고 + 涂色", "개인정보": "隐私", "PRIV": "无需账号。进度和设置只保存在本浏览器（localStorage）：没有服务器、广告、追踪器或外部请求。“清除记录”可随时全部删除。", "만든 사람들 · 출처": "制作与来源", "AI": "部分视频和声音由 AI 工具制作。韩文字母由页面以矢量方式绘制。", "글자": "字", "구한 동물": "救出的动物", "시작 횟수": "次数", "오늘 사용": "今天", "잘했어! 이제 N번!": "真棒！现在写第N笔！"}, "es": {"라이준 한글 1화": "Raijun Hangul · Episodio 1", "ㄱ 친구들": "Amigos de ㄱ", "시작": "Empezar", "소리를 켜 주세요 🔊": "Sube el sonido 🔊", "손가락으로 따라 써 봐!": "¡Sigue el trazo con tu dedo!", "좋아요, 계속!": "¡Muy bien, sigue!", "다시 한 번 해 볼까?": "¿Lo intentamos otra vez?", "기역!": "¡기역 (giyeok)!", "아!": "¡아 (a)!", "오!": "¡오 (o)!", "이번엔 ㅏ를 써 볼까?": "¡Ahora escribimos ㅏ!", "이번엔 ㅗ를 써 볼까?": "¡Ahora escribimos ㅗ!", "잘했어! 이제 2번!": "¡Muy bien! ¡Ahora el trazo 2!", "기역은 그 소리!": "¡기역 suena “그” (g)!", "기역하고 아가 만나면 가!": "기역 y 아 juntos hacen... ¡가!", "기역하고 오가 만나면 고!": "기역 y 오 juntos hacen... ¡고!", "가젤의 가!": "¡가 de gacela!", "고릴라의 고!": "¡고 de gorila!", "반짝반짝 다시 한 번!": "¡Brillando, otra vez!", "가!": "¡가!", "고!": "¡고!", "우와! 가젤이다!": "¡Guau! ¡Una gacela!", "우와! 고릴라다!": "¡Guau! ¡Un gorila!", "1화 완성! ㄱ 친구들 최고!": "¡Episodio 1 completo! ¡Los amigos de ㄱ son geniales!", "다음 글자 ▶": "Siguiente letra ▶", "한 번 더 써 볼까?": "¿Escribir otra vez?", "한 번 더 보기": "Ver otra vez", "처음부터 다시": "Empezar de nuevo", "고 다시 쓰기": "Escribir 고 otra vez", "▶ 눌러서 보기": "▶ Toca para ver", "도감": "Álbum", "라이준 동물 도감": "Álbum de animales de Raijun", "가젤": "Gacela", "고릴라": "Gorila", "돌아가기": "Volver", "부모님 설정": "Ajustes para padres", "따라쓰기 난이도": "Dificultad del trazo", "쉬움": "Fácil", "보통": "Normal", "어려움": "Difícil", "글자 크기": "Tamaño de letra", "쓰는 손": "Mano", "왼손": "Izquierda", "오른손": "Derecha", "획순 안내": "Guía de trazos", "보이기": "Mostrar", "숨기기": "Ocultar", "손 떼고 이어 쓰기": "Seguir tras levantar el dedo", "허용": "Sí", "안 함": "No", "조용한 모드": "Modo tranquilo", "켜기": "Activar", "끄기": "Desactivar", "언어": "Idioma", "닫기": "Cerrar", "폰을 가로로 돌려 주세요": "Gira el teléfono", "그냥 할래요": "Seguir igualmente", "1단계 · 가": "Paso 1 · 가", "2단계 · 고": "Paso 2 · 고", "다음 글자도 써 볼까?": "¿Escribimos la siguiente letra?", "부모님 확인": "Control parental", "라이준도 쉬러 갈 시간이야": "¡Raijun también necesita descansar!", "내일 또 만나요!": "¡Hasta mañana!", "계속 ▶": "Seguir ▶", "진행 기록": "Progreso", "기록 지우기": "Borrar registros", "하루 사용 시간": "Tiempo diario", "제한 없음": "Sin límite", "활동지": "Hoja de actividades", "활동지 출력": "Imprimir hoja", "A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠": "A4 · trazar ㄱ / 가 / 고 + colorear", "개인정보": "Privacidad", "PRIV": "Sin cuentas. El progreso y los ajustes se guardan solo en este navegador (localStorage): sin servidor, sin anuncios, sin rastreadores, sin peticiones externas. «Borrar registros» lo elimina todo.", "만든 사람들 · 출처": "Créditos y fuentes", "AI": "Algunos vídeos y voces se hicieron con herramientas de IA. Las letras coreanas son vectores dibujados por la página.", "글자": "Letras", "구한 동물": "Animales rescatados", "시작 횟수": "Sesiones", "오늘 사용": "Hoy", "잘했어! 이제 N번!": "¡Muy bien! ¡Ahora el trazo N!"}});
const ADD4={"ko": {}, "en": {"다시하기": "Try again", "돌아가기": "Back", "나가기": "Exit", "그만할까요?": "Shall we stop here?", "응, 그만할래": "Yes, stop", "아니, 계속할래": "No, keep playing", "가젤의 사촌 임팔라 친구들이 풀밭을 걸어요!": "The gazelle's cousins, impalas, walk on the grass!", "고릴라가 두 발로 서서 팔을 휘둘러요!": "The gorilla stands on two legs and swings its arms!", "기린이 긴 목을 쭉 뻗어 나뭇잎을 먹어요!": "The giraffe stretches its long neck to eat leaves!"}, "zh": {"다시하기": "再来一次", "돌아가기": "返回", "나가기": "退出", "그만할까요?": "我们要停下来吗？", "응, 그만할래": "好，停下来", "아니, 계속할래": "不，继续玩", "가젤의 사촌 임팔라 친구들이 풀밭을 걸어요!": "羚羊的表亲黑斑羚在草地上走！", "고릴라가 두 발로 서서 팔을 휘둘러요!": "大猩猩用两条腿站着挥舞手臂！", "기린이 긴 목을 쭉 뻗어 나뭇잎을 먹어요!": "长颈鹿伸长脖子吃树叶！"}, "es": {"다시하기": "Otra vez", "돌아가기": "Atrás", "나가기": "Salir", "그만할까요?": "¿Paramos aquí?", "응, 그만할래": "Sí, parar", "아니, 계속할래": "No, seguir", "가젤의 사촌 임팔라 친구들이 풀밭을 걸어요!": "¡Los impalas, primos de la gacela, caminan por la hierba!", "고릴라가 두 발로 서서 팔을 휘둘러요!": "¡El gorila se pone de pie y mueve los brazos!", "기린이 긴 목을 쭉 뻗어 나뭇잎을 먹어요!": "¡La jirafa estira su largo cuello para comer hojas!"}, "fr": {"다시하기": "Recommencer", "돌아가기": "Retour", "나가기": "Sortir", "그만할까요?": "On s'arrête ici ?", "응, 그만할래": "Oui, on s'arrête", "아니, 계속할래": "Non, on continue", "가젤의 사촌 임팔라 친구들이 풀밭을 걸어요!": "Les impalas, cousins de la gazelle, marchent dans l'herbe !", "고릴라가 두 발로 서서 팔을 휘둘러요!": "Le gorille se lève sur deux pattes et agite les bras !", "기린이 긴 목을 쭉 뻗어 나뭇잎을 먹어요!": "La girafe tend son long cou pour manger des feuilles !"}};
const ADD3={ko:{'A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠':'A4 · ㄱ / 가 / 고 / 기 따라 쓰기 + 동물 색칠'},
 en:{'이!':'이 (i)!','이번엔 ㅣ를 써 볼까?':"Now let's write ㅣ!",'기역하고 이가 만나면 기!':'기역 + 이 together make... 기!','기린의 기!':'기, like giraffe!','기!':'기!','우와! 기린이다!':'Wow! A giraffe!','기린':'Giraffe','3단계 · 기':'Step 3 · 기','기 다시 쓰기':'Write 기 again','A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠':'A4 · trace ㄱ / 가 / 고 / 기 + animal colouring'},
 zh:{'이!':'이 (i)！','이번엔 ㅣ를 써 볼까?':'现在来写 ㅣ 吧！','기역하고 이가 만나면 기!':'기역 和 이 在一起…… 기！','기린의 기!':'长颈鹿的 기！','기!':'기！','우와! 기린이다!':'哇！是长颈鹿！','기린':'长颈鹿','3단계 · 기':'第3步 · 기','기 다시 쓰기':'再写一次 기','A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠':'A4 · 描写 ㄱ / 가 / 고 / 기 + 动物涂色'},
 es:{'이!':'¡이 (i)!','이번엔 ㅣ를 써 볼까?':'¡Ahora escribimos ㅣ!','기역하고 이가 만나면 기!':'기역 y 이 juntos hacen... ¡기!','기린의 기!':'¡기 de jirafa!','기!':'¡기!','우와! 기린이다!':'¡Guau! ¡Una jirafa!','기린':'Jirafa','3단계 · 기':'Paso 3 · 기','기 다시 쓰기':'Escribir 기 otra vez','A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠':'A4 · trazar ㄱ / 가 / 고 / 기 + colorear animales'},
 fr:{'이!':'I !','이번엔 ㅣ를 써 볼까?':'Maintenant, on écrit ㅣ ?','기역하고 이가 만나면 기!':'Giyeok et I ensemble... Gi !','기린의 기!':'Gi comme girafe !','기!':'Gi !','우와! 기린이다!':'Waouh ! Une girafe !','기린':'Girafe','3단계 · 기':'Étape 3 · 기','기 다시 쓰기':'Réécrire 기','A4 · ㄱ / 가 / 고 따라 쓰기 + 색칠':'A4 · tracer ㄱ / 가 / 고 / 기 + coloriage des animaux'}};
const ADD5={"en": {"기역하고 아가 만나면 가!": "Giyeok and A together make 가!", "기역하고 오가 만나면 고!": "Giyeok and O together make 고!", "기역하고 이가 만나면 기!": "Giyeok and I together make 기!"}, "zh": {"기역하고 아가 만나면 가!": "기역 和 아 在一起就是 가！", "기역하고 오가 만나면 고!": "기역 和 오 在一起就是 고！", "기역하고 이가 만나면 기!": "기역 和 이 在一起就是 기！"}, "es": {"기역하고 아가 만나면 가!": "¡Giyeok y A juntos hacen 가!", "기역하고 오가 만나면 고!": "¡Giyeok y O juntos hacen 고!", "기역하고 이가 만나면 기!": "¡Giyeok e I juntos hacen 기!"}, "fr": {"기역하고 아가 만나면 가!": "Giyeok et A ensemble font Ga !", "기역하고 오가 만나면 고!": "Giyeok et O ensemble font Go !", "기역하고 이가 만나면 기!": "Giyeok et I ensemble font Gi !"}};for(const L in ADD5)ADD3[L]=Object.assign(ADD3[L]||{},ADD5[L]);
for(const L in ADD4)ADD3[L]=Object.assign(ADD3[L]||{},ADD4[L]);
for(const L in ADD3){I18N[L]=Object.assign(I18N[L]||{},ADD3[L])}
Object.entries({en:['Gazelle photo','Gorilla photo'],zh:['羚羊照片','大猩猩照片'],es:['Foto de gacela','Foto de gorila'],fr:['Photo de gazelle','Photo de gorille']}).forEach(([l,[a,b]])=>{I18N[l]['가젤 사진']=a;I18N[l]['고릴라 사진']=b});
function tr(k){const D=I18N[SET.lang];return D&&D[k]?D[k]:(KO_FIX[k]||k)}
function setMsg(k){$('msg').textContent=tr(k)}
// ---- quiet helpers ----
const qn=n=>SET.quiet==='on'?Math.ceil(n*.3):n;
// ---- 도감 (collection; no scores) ----
const DEX=JSON.parse(localStorage.getItem('raijun_ep1_dex')||'[]');
function rescue(a){logAnimal(a);if(!DEX.includes(a)){DEX.push(a);localStorage.setItem('raijun_ep1_dex',JSON.stringify(DEX))}}
function openDex(){document.querySelectorAll('#dex .card').forEach(c=>{const locked=!DEX.includes(c.dataset.a);c.classList.toggle('lock',locked);if(c instanceof HTMLButtonElement)c.disabled=locked;if(!forestEdition)c.querySelector('.ph').textContent=locked?'?':''});window.__dexBack=document.querySelector('.screen.on').id;show('dex')}
$('dexbtn').onclick=openDex;$('dexclose').onclick=()=>show(window.__dexBack||'start');
// ---- tracing fade levels (per stage, rises on replay) ----
const FADE=[0,0,0];function fadeApply(){const lv=FADE[SI]||0;JM.forEach(m=>m.S.forEach(s=>{s.dash.style.opacity=0;s.shad.style.opacity=[1,.5,.25][lv]}))}
// ---------- stars ----------
const st=$('stars'),sx=st.getContext('2d');let S=[];
function rs(){const r=$('app').getBoundingClientRect();st.width=r.width;st.height=r.height;S=Array.from({length:70},()=>({x:Math.random()*st.width,y:Math.random()*st.height,r:Math.random()*1.6+.4,p:Math.random()*6}))}
rs();addEventListener('resize',()=>{rs();sizeCv();if(drawing){if(forestEdition)endForestPointer();else{drawing=false;retry()}}});
// ---------- audio ----------
const CLIPS={'기역!':'giyeok','아!':'a','오!':'o','이번엔 아를 써 볼까?':'next_a','이번엔 오를 써 볼까?':'next_o','다시 한 번 해 볼까?':'retry',
 '기역하고 아가 만나면 가!':'merge_ga','기역하고 오가 만나면 고!':'merge_go','가젤의 가!':'ga_name','고릴라의 고!':'go_name',
 '우와! 가젤이다!':'wow_ga','우와! 고릴라다!':'wow_go','1화 완성! 기역 친구들 최고!':'final','이!':'i','이번엔 이를 써 볼까?':'next_i','기역하고 이가 만나면 기!':'merge_gi','기린의 기!':'gi_name','우와! 기린이다!':'wow_gi','다음 글자도 써 볼까?':'next_letter','기역은 그 소리!':'sound_g','라이준도 쉬러 갈 시간이야':'rest','그만할까요?':'exit_q','가시 덤불에 친구들이 갇혔어! 글자를 써서 친구들을 구해 줘!':'intro','기역은 한 번! 옆으로 가다가 아래로 꺾어!':'how_g'};
let AC,BUF={},MASTER,BGM,SFXG,bgmNodes={},bgmMode=null,BGM_LV=(SET.quiet==='on'?0:.55);
const OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext;
function render(sec,fn){const O=new OAC(1,Math.ceil(44100*sec),44100);fn(O);return O.startRendering()}
function note(O,f,t,dur,vol,type='sine',att=.005,dst){const o=O.createOscillator(),g=O.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+att);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g).connect(dst||O.destination);o.start(t);o.stop(t+dur+.05)}
function bell(O,f,t,dur,vol){note(O,f,t,dur,vol);note(O,f*2.76,t,dur*.35,vol*.18);note(O,f*5.4,t,dur*.15,vol*.06)}
function noise(O,t,dur,vol,fq){const n=Math.ceil(44100*dur),b=O.createBuffer(1,n,44100),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/n*6);const s=O.createBufferSource();s.buffer=b;const f=O.createBiquadFilter();f.type='bandpass';f.frequency.value=fq;f.Q.value=1;const g=O.createGain();g.gain.value=vol;s.connect(f).connect(g).connect(O.destination);s.start(t)}
const C4=261.63,SC=[0,2,4,7,9];const hz=s=>C4*Math.pow(2,s/12);
function calmLoop(){const bpm=80,b=60/bpm,bars=8,len=bars*4*b;return render(len,O=>{
 const prog=[[0,4,7],[-3,0,4],[-7,-3,0],[-5,-1,2]];
 for(let bar=0;bar<bars;bar++){const ch=prog[bar%4],t0=bar*4*b;
  ch.forEach(s=>{note(O,hz(s),t0,4*b,.05,'sine',.6);note(O,hz(s+12),t0+.02,4*b,.02,'triangle',.8)});
  note(O,hz(ch[0]-12),t0,4*b*.9,.07,'sine',.05);
  for(let i=0;i<8;i++){if((i+bar)%3===1)continue;const s=ch[i%3]+12+(i>3?12:0)*0;bell(O,hz(s+12),t0+i*b/2,1.4,.035)}}})}
function upLoop(){const bpm=128,b=60/bpm,bars=8,len=bars*4*b;return render(len,O=>{
 const prog=[[0,4,7],[5,9,12],[7,11,14],[0,4,7]];const mel=[12,14,16,19,16,14,12,16, 17,16,14,12,14,16,19,24];
 for(let bar=0;bar<bars;bar++){const ch=prog[bar%4],t0=bar*4*b;
  for(let k=0;k<4;k++){const t=t0+k*b;note(O,hz(ch[0]-12+(k%2?7:0)),t,b*.8,.16,'triangle');noise(O,t+b/2,.07,.18,6000);if(k%2)noise(O,t,.12,.25,1500);
   ch.forEach(s=>note(O,hz(s+12),t+b/2,b*.35,.03,'square',.004))}
  for(let i=0;i<8;i++){const s=mel[(bar%2)*8+i];bell(O,hz(s+12),t0+i*b/2,b*.9,.07)}}})}
function fanfare(){return render(2.2,O=>{const seq=[[0,0],[.14,4],[.28,7],[.42,12]];seq.forEach(([t,s])=>{note(O,hz(s+12),t,.5,.12,'sawtooth',.01);note(O,hz(s+24),t,.3,.04,'square')});
 [0,4,7,12].forEach(s=>note(O,hz(s+12),.6,1.5,.08,'sawtooth',.02));[0,4,7].forEach(s=>bell(O,hz(s+24),.6,1.4,.08));noise(O,.6,.3,.25,3000)})}
function chimeBuf(fs,gap,vol,dur){return render(fs.length*gap+dur+.2,O=>fs.forEach((f,i)=>bell(O,f,i*gap,dur,vol)))}
function whooshBuf(){return render(.6,O=>{const n=Math.ceil(44100*.55),b=O.createBuffer(1,n,44100),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 const s=O.createBufferSource();s.buffer=b;const f=O.createBiquadFilter();f.type='bandpass';f.Q.value=2.5;f.frequency.setValueAtTime(500,0);f.frequency.exponentialRampToValueAtTime(4000,.5);const g=O.createGain();g.gain.setValueAtTime(0,0);g.gain.linearRampToValueAtTime(.35,.22);g.gain.linearRampToValueAtTime(0,.55);s.connect(f).connect(g).connect(O.destination);s.start(0)})}
const PENTA=[0,2,4,7,9,12,14,16,19,21];
function unlock(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state!=='running')AC.resume();
 if(!MASTER){MASTER=AC.createGain();MASTER.connect(AC.destination);BGM=AC.createGain();BGM.gain.value=0;BGM.connect(MASTER);SFXG=AC.createGain();SFXG.gain.value=SET.quiet==='on'?.5:1;SFXG.connect(MASTER)}
 const s=AC.createBufferSource();s.buffer=AC.createBuffer(1,1,22050);s.connect(AC.destination);s.start(0);
 if(!BUF._l){BUF._l=1;const J=(k,p)=>p.then(b=>BUF[k]=b).catch(()=>{});
  J('chime',chimeBuf([1046.5,1318.5,1568,2093],.09,.2,1.5));J('soft',chimeBuf([660],.01,.07,.4));J('big',chimeBuf([523,659,784,1046,1318,1568,2093],.08,.16,1.8));J('whoosh',whooshBuf());J('crack',render(.3,O=>{noise(O,0,.09,.5,4200);noise(O,0,.05,.35,9000);const o=O.createOscillator(),g=O.createGain();o.frequency.setValueAtTime(2400,0);o.frequency.exponentialRampToValueAtTime(700,.06);g.gain.setValueAtTime(.25,0);g.gain.exponentialRampToValueAtTime(.001,.08);o.connect(g).connect(O.destination);o.start(0);o.stop(.1)}));
  PENTA.forEach((s,i)=>J('n'+i,render(1.3,O=>bell(O,hz(s+12),0,1.1,.13))));
  J('calm',calmLoop()).then(()=>{if(bgmMode==='calm'||bgmMode===null)bgm('calm')});J('up',upLoop());J('fan',fanfare());
  loadVoices()}}catch(e){}}
const FILEPROTO=location.protocol==='file:';
function loadVoices(){if(FILEPROTO)return;const L=SET.lang;for(const [t,f] of Object.entries(CLIPS))fetch('audio/'+L+'/'+f+'.mp3').then(r=>r.arrayBuffer()).then(a=>new Promise((ok,no)=>AC.decodeAudioData(a,ok,no))).then(b=>{BUF[L+':'+t]=b}).catch(()=>{})}
function playBuf(k,cb,dst){if(!AC||!BUF[k])return false;if(AC.state!=='running')AC.resume();const s=AC.createBufferSource();s.buffer=BUF[k];s.connect(dst||SFXG);if(cb)s.onended=cb;s.start(0);if(k.includes(':')){try{VS&&VS.stop()}catch(e){}VS=s}return true}
function bgm(mode){if(!AC||!BGM)return;bgmMode=mode;if(!BUF[mode])return;const t=AC.currentTime;
 for(const k in bgmNodes){const n=bgmNodes[k];n.g.gain.setTargetAtTime(0,t,.25);try{n.s.stop(t+1.5)}catch(e){}delete bgmNodes[k]}
 const s=AC.createBufferSource(),g=AC.createGain();s.buffer=BUF[mode];s.loop=true;g.gain.value=0;s.connect(g).connect(BGM);g.gain.setTargetAtTime(mode==='up'?1:.8,t+(mode==='up'?1.3:0),.4);
 s.start(t+(mode==='up'?1.3:0));bgmNodes[mode]={s,g};
 if(mode==='up')playBuf('fan');BGM.gain.setTargetAtTime(BGM_LV,t,.2)}
let duckN=0;function duck(on){if(!BGM)return;duckN+=on?1:-1;BGM.gain.setTargetAtTime(duckN>0?BGM_LV*.3:BGM_LV,AC.currentTime,.12)}
const chime=()=>((typeof playSfxKey==='function'&&playSfxKey('chime'))||playBuf('chime')),soft=()=>((typeof playSfxKey==='function'&&playSfxKey('soft'))||playBuf('soft')),big=()=>((typeof playSfxKey==='function'&&playSfxKey('big'))||playBuf('big'));
function say(t,cb){let done=false;const g=GEN;const fin=()=>{if(!done){done=true;duck(false);if(g===GEN)cb&&cb()}};const fb=setTimeout(fin,1200+t.length*190);duck(true);
 if(CLIPS[t]&&(FILEPROTO||!BUF[SET.lang+':'+t])){if(!FILEPROTO&&AC&&BUF._l&&!BUF['_v'+SET.lang]){BUF['_v'+SET.lang]=1;loadVoices()}try{VS&&VS.stop()}catch(e){}const a=playHtmlAudio('audio/'+SET.lang+'/'+CLIPS[t]+'.mp3',SET.quiet==='on'?.6:1)||new Audio('audio/'+SET.lang+'/'+CLIPS[t]+'.mp3');a.onended=()=>{clearTimeout(fb);setTimeout(fin,250)};VS={stop(){try{a.pause()}catch(e){}a.onended=null}};return}
 if(!BUF[SET.lang+':'+t]&&AC&&BUF._l&&!BUF['_v'+SET.lang]){BUF['_v'+SET.lang]=1;loadVoices()}
 if(playBuf(SET.lang+':'+t,()=>{clearTimeout(fb);setTimeout(fin,250)}))return;
 try{if(!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(t);u.lang={ko:'ko-KR',en:'en-US',zh:'zh-CN',es:'es-ES',fr:'fr-FR'}[SET.lang];u.text=tr(t);u.rate=.9;u.pitch=1.3;u.onend=()=>{clearTimeout(fb);setTimeout(fin,250)};speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
document.addEventListener('pointerdown',()=>{if(AC&&AC.state!=='running')AC.resume()},true);
document.addEventListener('visibilitychange',()=>{if(!AC)return;document.hidden?AC.suspend():AC.resume()});
// ---------- letters ----------
let SI=0,STG,JM=[],cj=0,cs=0,done=true;
function mk(tag,at,par){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);par&&par.appendChild(e);return e}
function buildStage(i){SI=i;STG=STAGES[i];const W=$('word');W.innerHTML='';$('guides').innerHTML='';W.classList.remove('big','glow');JM=[];
 if(forestEdition){endForestPointer();clearTimeout(liftWait);liftWait=null}
 $('bg').style.backgroundImage=`url(${STG.bg})`;$('stage').textContent=tr(`${i+1}단계 · ${STG.syl}`);$('formula').textContent=STG.formula;$('formula').style.opacity=0;
 STG.jamo.forEach((j,ji)=>{const g=mk('g',{class:'J'},W);const S=j.strokes.map(d=>({shad:mk('path',{d,class:'shad',fill:'none',stroke:'#ffffff18','stroke-width':11,'stroke-linecap':'round','stroke-linejoin':'round'},g),
   dash:mk('path',{d,class:'dash',fill:'none',stroke:'#ffffffcc','stroke-width':1.6,'stroke-dasharray':'2.2 2.3','stroke-linecap':'round'},g),
   fill:mk('path',{d,class:'fill',fill:'none',stroke:'#ffd34d','stroke-width':11,'stroke-linecap':'round','stroke-linejoin':'round',filter:'url(#gl)',pathLength:1,'stroke-dasharray':'1 2','stroke-dashoffset':1,opacity:0},g)}));
  S.forEach(x=>{x.dash.style.opacity=0;makeBeads(x,g)});JM.push({g,S,j})});
 // big transform for first jamo
 const g0=JM[0].g,bb=g0.getBBox(),sc=Math.min(1.6,64/Math.max(bb.width,bb.height)),tx=50-(bb.x+bb.width/2)*sc,ty=50-(bb.y+bb.height/2)*sc;JM[0].big=`translate(${tx}px,${ty}px) scale(${sc})`;
 JM.forEach((m,k)=>{m.g.style.transition='none';m.g.style.transform=k===0?m.big:'';m.g.style.opacity=k===0?1:0;m.g.getBoundingClientRect();m.g.style.transition=''});
 cj=0;cs=0;popN=0;rewrite=false;done=false;showGuide()}
function curPath(){return JM[cj].S[cs].dash}
function showGuide(){const G=$('guides');G.innerHTML='';if(forestEdition){cancelAnimationFrame(gAnim);$('dot').setAttribute('opacity',0)}
 const p=curPath(),L=p.getTotalLength(),m=$('svg').getScreenCTM().inverse().multiply(p.getScreenCTM());
 const P=l=>{const q=p.getPointAtLength(l);return{x:m.a*q.x+m.c*q.y+m.e,y:m.b*q.x+m.d*q.y+m.f}};const a=P(0),b=P(Math.min(L,6));
 const ang=Math.atan2(b.y-a.y,b.x-a.x),nx=-Math.sin(ang),ny=Math.cos(ang),off=8;
 mk('circle',{cx:a.x,cy:a.y,r:3.6,fill:'#ffd34d',stroke:'#fff8','stroke-width':.6},G);mk('text',{x:a.x,y:a.y+1.6,'text-anchor':'middle','font-size':4.4,fill:'#4a2a00','font-weight':'bold'},G).textContent=String(cs+1);
 const ax=a.x-nx*off+Math.cos(ang)*6,ay=a.y-ny*off+Math.sin(ang)*6,ex=ax+Math.cos(ang)*12,ey=ay+Math.sin(ang)*12;
 if(forestEdition){
  updateForestTarget();
  if(SET.guide==='on'&&(FADE[SI]||0)<2)mk('image',{href:'icons/arrow.png',x:0,y:-4,width:15,height:8,transform:`translate(${ax} ${ay}) rotate(${ang*180/Math.PI})`},G);
 }else{
  const arrow=mk('path',{d:`M${ax} ${ay} L${ex} ${ey} M${ex-Math.cos(ang-0.5)*3.5} ${ey-Math.sin(ang-0.5)*3.5} L${ex} ${ey} L${ex-Math.cos(ang+0.5)*3.5} ${ey-Math.sin(ang+0.5)*3.5}`,stroke:'#ffe08a','stroke-width':1.3,fill:'none','stroke-linecap':'round'},G);
  if(SET.guide!=='on'||(FADE[SI]||0)>=2)arrow.remove();
 }
 if(SET.guide==='on')guide(2)}
let gAnim;function guide(loops=2){cancelAnimationFrame(gAnim);if(SET.guide==='off'||(FADE[SI]||0)>=2||(forestEdition&&forestMotionReduced()))return;const d=$('dot'),p=curPath(),L=p.getTotalLength(),svg=$('svg');let t0=null;const dur=Math.max(900,L*22);
 const f=ts=>{t0??=ts;const k=(ts-t0)/dur;if(k>loops){d.setAttribute('opacity',0);return}
  const q=p.getPointAtLength(L*(k%1)),m=svg.getScreenCTM().inverse().multiply(p.getScreenCTM());
  d.setAttribute('cx',m.a*q.x+m.c*q.y+m.e);d.setAttribute('cy',m.b*q.x+m.d*q.y+m.f);d.setAttribute('opacity',k%1>.9?0:1);gAnim=requestAnimationFrame(f)};gAnim=requestAnimationFrame(f)}
// ---------- tracing: bead-breaking (based on the 2011 Flash bead program) ----------
// Each stroke is a row of glass/silver beads (SVG, drawn in code). The finger must break them in order
// (stroke order + direction). No failure state: if a stroke isn't finished, a gentle demo replays.
const cv=$('cv'),cx=cv.getContext('2d');let DPR=1,drawing=false,last,BP=[],popN=0,rewrite=false,liftWait=null;
const BEAD_R=9.6,BEAD_SP=24.8;
function sizeCv(){const r=cv.getBoundingClientRect();DPR=devicePixelRatio||1;cv.width=r.width*DPR;cv.height=r.height*DPR}
function pos(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function beadLens(p){const L=p.getTotalLength(),d=p.getAttribute('d'),q=d.match(/Q\s*(-?[\d.]+)\s+(-?[\d.]+)/);
 const even=(a,b)=>{const n=Math.max(1,Math.round((b-a)/BEAD_SP)),o=[];for(let i=0;i<=n;i++)o.push(a+(b-a)*i/n);return o};
 if(!q)return even(0,L);
 // shared corner bead: find the length closest to the curve's control point
 const qx=+q[1],qy=+q[2];let bl=0,bd=1e9;for(let l=0;l<=L;l+=.5){const t=p.getPointAtLength(l),dd=Math.hypot(t.x-qx,t.y-qy);if(dd<bd){bd=dd;bl=l}}
 return even(0,bl).concat(even(bl,L).slice(1))}
function makeBeads(s,g){s.beads=beadLens(s.dash).map(l=>{const q=s.dash.getPointAtLength(l),b=mk('g',{class:'bead'},g);
  if(forestEdition){
   mk('image',{href:'icons/bead.png',x:q.x-BEAD_R,y:q.y-BEAD_R,width:BEAD_R*2,height:BEAD_R*2},b);
   return{el:b,l,x:q.x,y:q.y}
  }
  mk('circle',{cx:q.x,cy:q.y,r:BEAD_R,fill:'url(#bd)',stroke:'#ffffffb0','stroke-width':.6},b);
  mk('ellipse',{cx:q.x-BEAD_R*.32,cy:q.y-BEAD_R*.38,rx:BEAD_R*.34,ry:BEAD_R*.22,fill:'#fff',opacity:.85},b);
  mk('circle',{cx:q.x+BEAD_R*.3,cy:q.y+BEAD_R*.35,r:BEAD_R*.14,fill:'#fff',opacity:.45},b);
  return{el:b,l,x:q.x,y:q.y}});s.k=0}
function resetBeads(s){s.k=0;s.beads.forEach(b=>{b.el.classList.remove('pop');b.el.style.opacity=''});s.fill.style.transition='none';s.fill.style.strokeDashoffset=1;s.fill.setAttribute('opacity',0)}
function curStroke(){return JM[cj].S[cs]}
function curPath(){return curStroke().dash}
function bscr(){const s=curStroke(),m=s.dash.getScreenCTM(),r=cv.getBoundingClientRect();BP=s.beads.map(b=>({x:m.a*b.x+m.c*b.y+m.e-r.left,y:m.b*b.x+m.d*b.y+m.f-r.top}));return Math.abs(m.a)*BEAD_R}
let beadPx=20;function tolPx(){return Math.max(22,beadPx*1.55,cv.getBoundingClientRect().width*TOL[SET.tol]*.8)}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const forestWidths={easy:9.6,normal:8,hard:6.5};
let forestPointer=null,forestTarget=null,forestMaskId=0;
const forestMotionReduced=()=>SET.quiet==='on'||reducedMotion.matches;

function updateForestTarget(){
 forestTarget?.classList.remove('is-next');
 const stroke=curStroke();
 forestTarget=stroke.beads[stroke.k]?.el;
 forestTarget?.classList.add('is-next');
}

function forestStrokePoint(event,inverse){
 return new DOMPoint(event.clientX,event.clientY).matrixTransform(inverse);
}

function forestContactRadius(stroke,width){
 const next=stroke.beads[stroke.k];
 const before=stroke.beads[stroke.k-1];
 const after=stroke.beads[stroke.k+1];
 // Separate adjacent targets, including short strokes and curves.
 const gap=bead=>bead?Math.hypot(bead.x-next.x,bead.y-next.y):Infinity;
 return Math.min(width,Math.min(gap(before),gap(after))*.45);
}

function advanceForestStroke(point){
 const stroke=curStroke();
 const next=stroke.beads[stroke.k];
 const width=forestWidths[SET.tol]||forestWidths.normal;
 const contact=Math.hypot(point.x-next.x,point.y-next.y)<=forestContactRadius(stroke,width);
 if(forestPointer.waiting&&!contact)return false;
 if(!forestPointer.waiting){
  // Sample only the live section of this stroke. Nearby branches cannot collect its targets.
  const from=stroke.beads[stroke.k-1]?.l??next.l;
  const points=stroke.pathSamples??=Array.from({length:Math.ceil(stroke.dash.getTotalLength())+1},(_,distance)=>stroke.dash.getPointAtLength(distance));
  let inLane=false;
  for(let i=Math.floor(from);i<=Math.ceil(next.l);i++){
   if(Math.hypot(point.x-points[i].x,point.y-points[i].y)<=width){inLane=true;break}
  }
  if(!inLane){
   forestPointer.waiting=true;
   $('pad').classList.add('trace-paused');
   return false;
  }
 }
 if(contact){
  clearTimeout(liftWait);
  liftWait=null;
  forestPointer.waiting=false;
  $('pad').classList.remove('trace-paused');
  if(!stroke.k)setMsg('좋아요, 계속!');
  popBead();
  if(stroke.k===stroke.beads.length){
   endForestPointer();
   strokeDone();
   return false;
  }
 }
 return true;
}

function moveForestPointer(event){
 if(event.pointerId!==forestPointer?.id)return;
 event.preventDefault();
 const inverse=curStroke().dash.getScreenCTM().inverse();
 const coalesced=event.getCoalescedEvents?.()||[];
 for(const sample of coalesced.length?coalesced:[event]){
  const point=forestStrokePoint(sample,inverse);
  const previous=forestPointer.last;
  forestPointer.last=point;
  // After an exit, only a real contact sample can resume the stroke.
  if(forestPointer.waiting){advanceForestStroke(point);if(!forestPointer)return;continue}
  const count=Math.ceil(Math.hypot(point.x-previous.x,point.y-previous.y)/2);
  for(let i=1;i<=count;i++){
   const t=i/count;
   if(!advanceForestStroke({x:previous.x+(point.x-previous.x)*t,y:previous.y+(point.y-previous.y)*t}))break;
  }
  if(!forestPointer)return;
 }
}

function endForestPointer(){
 const id=forestPointer?.id;
 forestPointer=null;
 drawing=false;
 $('pad').classList.remove('trace-paused');
 if(id!==undefined&&cv.hasPointerCapture(id))cv.releasePointerCapture(id);
}

function startForestPointer(event){
 if(!event.isPrimary||forestPointer)return;
 const stroke=curStroke();
 const point=forestStrokePoint(event,stroke.dash.getScreenCTM().inverse());
 forestPointer={id:event.pointerId,last:point,waiting:true};
 drawing=true;
 $('pad').classList.add('trace-paused');
 cancelAnimationFrame(gAnim);
 $('dot').setAttribute('opacity',0);
 advanceForestStroke(point);
}

function forestEffectLayer(stroke){
 if(stroke.effects)return stroke.effects;
 const id='forest-stroke-mask-'+forestMaskId++;
 const parent=stroke.dash.parentNode;
 const mask=mk('mask',{id,maskUnits:'userSpaceOnUse',x:0,y:0,width:100,height:100},parent);
 mk('path',{d:stroke.dash.getAttribute('d'),fill:'none',stroke:'#fff','stroke-width':BEAD_R*2,'stroke-linecap':'round','stroke-linejoin':'round'},mask);
 stroke.effects=mk('g',{mask:`url(#${id})`,'pointer-events':'none'},parent);
 return stroke.effects;
}

function forestBeadEffect(stroke,bead){
 if(forestMotionReduced())return;
 const layer=forestEffectLayer(stroke);
 const flash=mk('circle',{cx:bead.x,cy:bead.y,r:7,fill:'none',stroke:'#ffce69','stroke-width':1.4,class:'bead-flash'},layer);
 flash.addEventListener('animationend',()=>flash.remove(),{once:true});
 for(let i=0;i<6;i++){
  const angle=i*Math.PI/3;
  const ember=mk('circle',{cx:bead.x,cy:bead.y,r:i%2?1:1.6,fill:i%2?'#ffeeac':'#ffc15b',class:'bead-ember'},layer);
  ember.style.setProperty('--ember-x',Math.cos(angle)*11+'px');
  ember.style.setProperty('--ember-y',Math.sin(angle)*11+'px');
  ember.addEventListener('animationend',()=>ember.remove(),{once:true});
 }
}

function forestStrokeEffect(stroke){
 if(forestMotionReduced())return;
 const gleam=mk('path',{d:stroke.dash.getAttribute('d'),pathLength:1,fill:'none',stroke:'#fff6cc','stroke-width':5,'stroke-linecap':'round',class:'stroke-gleam'},forestEffectLayer(stroke));
 gleam.addEventListener('animationend',()=>gleam.remove(),{once:true});
}

function popBead(){const s=curStroke(),i=s.k,b=s.beads[i];s.k++;b.el.classList.add('pop');
 const L=s.dash.getTotalLength();s.fill.style.transition='stroke-dashoffset .15s';s.fill.setAttribute('opacity',1);s.fill.style.strokeDashoffset=1-Math.min(1,(b.l+(forestEdition?1:BEAD_SP*.5))/L);
 if(forestEdition){updateForestTarget();forestBeadEffect(s,b)}
 else{const r=cv.getBoundingClientRect();shatter(r.left+BP[i].x,r.top+BP[i].y)}
 playBuf('crack');playBuf('n'+Math.min(9,popN++));
 if(!forestEdition&&SET.quiet!=='on'){try{navigator.vibrate&&navigator.vibrate(18)}catch(e){}const P=$('pad');P.classList.remove('shk');void P.offsetWidth;P.classList.add('shk')}}
function check(p){if(!BP.length)return;const s=curStroke(),t=tolPx();
 // sample the finger segment so fast swipes still break every bead in order
 const n=Math.max(1,Math.ceil(Math.hypot(p.x-last.x,p.y-last.y)/(t*.4)));
 for(let j=1;j<=n;j++){const x=last.x+(p.x-last.x)*j/n,y=last.y+(p.y-last.y)*j/n;
  while(s.k<s.beads.length&&Math.hypot(BP[s.k].x-x,BP[s.k].y-y)<t)popBead()}}
cv.addEventListener('pointerdown',e=>{if(done||(forestEdition&&(!e.isPrimary||forestPointer||!$('guides').childElementCount||(e.pointerType==='mouse'&&e.button!==0))))return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}
 if(forestEdition){startForestPointer(e);return}
 beadPx=bscr();last=pos(e);const s=curStroke();clearTimeout(liftWait);liftWait=null;
 drawing=true;cx.clearRect(0,0,cv.width,cv.height);cancelAnimationFrame(gAnim);$('dot').setAttribute('opacity',0);check(last);if(s.k>0)setMsg('좋아요, 계속!')},{passive:false});
cv.addEventListener('pointermove',e=>{if(forestEdition){moveForestPointer(e);return}if(!drawing)return;e.preventDefault();for(const ev of (e.getCoalescedEvents?e.getCoalescedEvents():[e])){const p=pos(ev);cx.lineCap=cx.lineJoin='round';cx.shadowColor='#ffd86b';cx.shadowBlur=16*DPR;cx.strokeStyle='#fffbe6aa';cx.lineWidth=cv.width*.03;cx.beginPath();cx.moveTo(last.x*DPR,last.y*DPR);cx.lineTo(p.x*DPR,p.y*DPR);cx.stroke();const k0=curStroke().k;check(p);if(k0===0&&curStroke().k>0)setMsg('좋아요, 계속!');last=p;if(curStroke().k>=curStroke().beads.length){drawing=false;strokeDone();return}}},{passive:false});
function up(){if(!drawing)return;drawing=false;const s=curStroke();
 if(s.k>=s.beads.length){strokeDone();return}
 if(s.k>0&&SET.lift==='on'){liftWait=setTimeout(()=>{liftWait=null;retry()},2600);return}
 retry()}
function retry(){const s=curStroke();soft();T(()=>{if(!forestEdition||!drawing)say('다시 한 번 해 볼까?')},250);setMsg('다시 한 번 해 볼까?');
 const reset=()=>{cx.clearRect(0,0,cv.width,cv.height);popN=Math.max(0,popN-s.k);resetBeads(s);if(forestEdition)updateForestTarget();guide(1)};
 if(forestEdition)reset();else T(reset,700)}
cv.addEventListener('pointerup',e=>{
 if(forestEdition){if(e.pointerId!==forestPointer?.id)return;forestPointer=null;$('pad').classList.remove('trace-paused')}
 up();
});
for(const event of ['pointercancel','lostpointercapture'])cv.addEventListener(event,e=>{
 if(forestEdition){if(e.pointerId===forestPointer?.id)endForestPointer()}
 else if(event==='pointercancel')up();
});
['touchstart','touchmove','gesturestart'].forEach(t=>document.addEventListener(t,e=>{if(e.target===cv||(!forestEdition&&e.touches&&e.touches.length>1))e.preventDefault()},{passive:false}));
function strokeDone(){const s=curStroke();s.fill.style.transition='';s.fill.setAttribute('opacity',1);s.fill.style.strokeDashoffset=0;s.dash.style.opacity=0;$('guides').innerHTML='';cx.clearRect(0,0,cv.width,cv.height);
 if(forestEdition)forestStrokeEffect(s);
 if(rewrite){chime();burst(.5,.45,25);if(cs+1<JM[cj].S.length)cs++;else if(cj+1<JM.length){cj++;cs=0}else{rewriteDone();return}T(showGuide,450);return}
 if(cs+1<JM[cj].S.length){cs++;playBuf('n9');burst(.5,.45,18);$('msg').textContent=tr('잘했어! 이제 N번!').replace(/N(?=[번笔!! ])/,cs+1);T(showGuide,500);return}
 jamoDone()}
function jamoDone(){done=true;const m=JM[cj];chime();burst(.5,.45,45);setMsg(m.j.name);popN=0;
 if(cj+1<JM.length){say(m.j.v);T(()=>{JM[0].g.style.transform='';const n=JM[cj+1];n.g.style.opacity=1;cj++;cs=0;setMsg(n.j.prompt);say(n.j.pv);T(()=>{done=false;showGuide()},1150)},1600)}
 else{say(m.j.v,()=>{setMsg('기역은 그 소리!');say('기역은 그 소리!',()=>T(merge,300))})}}
function merge(){logLetter('ㄱ');logLetter(STG.syl);JM.forEach(m=>m.S.forEach(s=>s.shad.style.opacity=0));
 T(()=>{$('word').classList.add('big','glow');big();burst(.5,.42,130);$('formula').style.opacity=1;setMsg(STG.mergeT);
  say(STG.merge,()=>T(startRewrite,300))},700)}
// merged syllable rewrite: beads come back on the whole syllable, child breaks them again stroke by stroke
function startRewrite(){$('word').classList.remove('glow');JM.forEach(m=>m.S.forEach(s=>{resetBeads(s);s.shad.style.opacity=.6}));
 rewrite=true;cj=0;cs=0;popN=0;done=false;setMsg('반짝반짝 다시 한 번!');showGuide()}
function rewriteDone(){done=true;rewrite=false;big();burst(.5,.45,90);$('word').classList.add('glow');setMsg(STG.name);say(STG.name,()=>T(()=>playVid(true),400))}
function allStrokes(){return JM.flatMap(m=>m.S)}
// ---------- video ----------
const vid=$('vid');
let vd=false;function vduck(on){if(on===vd||!BGM)return;vd=on;duck(on)}
function startVideo(){vduck(true);vid.currentTime=0;vid.muted=false;vid.play().catch(()=>{vid.muted=true;vid.play().catch(()=>{$('tap').style.display='flex'})})}
function playVid(intro){show('vscreen');$('after').style.visibility='hidden';$('tap').style.display='none';$('next').style.display=SI<STAGES.length-1?'':'none';
 if(vid.getAttribute('src')!==STG.video){vid.src=STG.video;vid.poster=STG.poster;vid.load()}vid.pause();
 bgm('up');rescue(STG.animal);if(intro){say(STG.wow,startVideo)}else startVideo();confetti(qn(80))}
if(!forestEdition)$('tap').textContent=tr('▶ 눌러서 보기');$('tap').onclick=()=>{$('tap').style.display='none';vid.play()};
const PHOTO=[{src:'photos/gazelle.jpg',cr:'Photo: Bob, CC BY 3.0, Wikimedia Commons'},{src:'photos/gorilla.jpg',cr:'Photo: k7hpn, CC BY 2.0, Wikimedia Commons'},{src:'photos/giraffe.jpg',cr:'Photo: Jason Graham, CC0 1.0, Wikimedia Commons'}];
function afterVideo(){if(SI===STAGES.length-1){T(finale,500)}else{show('vscreen');$('after').style.visibility='visible';say('다음 글자도 써 볼까?')}}
function photoStep(){try{vid.pause()}catch(e){}bgm('calm');vduck(false);const P=PHOTO[SI],sv=$('psvg');$('pimg').src=P.src;$('pcr').textContent=P.cr;const nm=STG.name.replace('!','');
 $('pcap').innerHTML=SET.lang!=='ko'?tr(STG.name):`<b>${nm[0]}</b>${nm.slice(1,-1)}<b>${nm.slice(-1)}</b>`;$('pnext').style.visibility='hidden';show('photo');
 sv.innerHTML='';const A=[];STG.jamo.forEach(j=>j.strokes.forEach(d=>{mk('path',{d,fill:'none',stroke:'#ffffff22','stroke-width':11,'stroke-linecap':'round','stroke-linejoin':'round'},sv);A.push(d)}));
 const P2=A.map(d=>mk('path',{d,fill:'none',stroke:'#ffd34d','stroke-width':11,'stroke-linecap':'round','stroke-linejoin':'round',filter:'url(#gl)'},sv));
 P2.forEach(p=>{const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L});
 let i=0;const nx=()=>{if(i>=P2.length){playBuf('chime');say(STG.name,()=>$('pnext').style.visibility='visible');return}const p=P2[i++];playBuf('whoosh');p.style.transition='stroke-dashoffset .8s ease-in-out';requestAnimationFrame(()=>p.style.strokeDashoffset=0);T(nx,950)};T(nx,900)}
$('pnext').onclick=afterVideo;
vid.onended=()=>{if($('vscreen').classList.contains('on'))photoStep()};
$('replay').onclick=()=>{unlock();playVid(false)};
$('again').onclick=()=>{FADE[SI]=Math.min(2,(FADE[SI]||0)+1);startStage(SI)};
$('next').onclick=()=>startStage(SI+1);
function startStage(i,intro){GEN++;try{vid.pause()}catch(e){}show('trace');bgm('calm');requestAnimationFrame(()=>{sizeCv();buildStage(i);fadeApply();setMsg('손가락으로 따라 써 봐!');
 if(intro){const IT='가시 덤불에 친구들이 갇혔어! 글자를 써서 친구들을 구해 줘!',HW='기역은 한 번! 옆으로 가다가 아래로 꺾어!';setMsg(IT);T(()=>say(IT,()=>{setMsg(HW);say(HW,()=>{if($('msg').textContent===tr(HW))setMsg('손가락으로 따라 써 봐!')})}),400)}})}
// ---------- finale ----------
function badgeSVG(svg,syl){svg.innerHTML='';const s=STAGES.find(x=>x.syl===syl);s.jamo.forEach(j=>j.strokes.forEach(d=>mk('path',{d,fill:'none',stroke:'#ffd34d','stroke-width':11,'stroke-linecap':'round','stroke-linejoin':'round',filter:'url(#gl)'},svg)))}
function finale(){show('final');bgm('up');$('final').querySelector('h1').textContent=tr('1화 완성! ㄱ 친구들 최고!');if(!forestEdition){badgeSVG($('b0'),'가');badgeSVG($('b1'),'고');badgeSVG($('b2'),'기')}big();confetti(160);T(()=>say('1화 완성! 기역 친구들 최고!'),900);T(()=>confetti(120),2200)}
$('restart').onclick=()=>startStage(0);$('redo2').onclick=()=>{const L=STAGES.length-1;FADE[L]=Math.min(2,(FADE[L]||0)+1);startStage(L)};
// ---------- orientation ----------
function chkRot(){$('rot').classList.toggle('on',!forestEdition&&innerHeight>innerWidth&&!window.__rotok)}
addEventListener('resize',chkRot);addEventListener('orientationchange',()=>setTimeout(chkRot,300));chkRot();$('rotok').onclick=()=>{window.__rotok=1;chkRot()};
function goLandscape(){try{const el=document.documentElement,rq=el.requestFullscreen||el.webkitRequestFullscreen;if(rq){const p=rq.call(el,{navigationUI:'hide'});(p&&p.then?p:Promise.resolve()).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape')).catch(()=>{})}}catch(e){}}
[['en',{'가시 덤불에 친구들이 갇혔어! 글자를 써서 친구들을 구해 줘!':'Our friends are stuck in the thorny bushes! Write letters to rescue them!','기역은 한 번! 옆으로 가다가 아래로 꺾어!':'ㄱ is one stroke! Go across, then turn down!'}],['zh',{'가시 덤불에 친구들이 갇혔어! 글자를 써서 친구들을 구해 줘!':'朋友们被困在荆棘丛里了！写字来救救它们吧！','기역은 한 번! 옆으로 가다가 아래로 꺾어!':'ㄱ 一笔写成！先横着走，再往下拐！'}],['es',{'가시 덤불에 친구들이 갇혔어! 글자를 써서 친구들을 구해 줘!':'¡Nuestros amigos están atrapados en los espinos! ¡Escribe letras para rescatarlos!','기역은 한 번! 옆으로 가다가 아래로 꺾어!':'¡ㄱ es un solo trazo! ¡Ve hacia el lado y luego baja!'}],['fr',{'가시 덤불에 친구들이 갇혔어! 글자를 써서 친구들을 구해 줘!':'Nos amis sont coincés dans les ronces ! Écris des lettres pour les sauver !','기역은 한 번! 옆으로 가다가 아래로 꺾어!':'ㄱ se fait en un trait ! Va sur le côté, puis descends !'}]].forEach(([l,d])=>{I18N[l]=Object.assign(I18N[l]||{},d)});
applySet();
$('go').onclick=()=>{PROG.sessions++;saveProg();if(!forestEdition)goLandscape();unlock();bgmMode='calm';startStage(0,true)};
// ---------- fx ----------
const fx=$('fx'),fc=fx.getContext('2d');let C=[];const cols=['#ffd34d','#fff','#ff9fd0','#9fe7ff','#c8a2ff'];
function fxs(){if(fx.width!==innerWidth||fx.height!==innerHeight){fx.width=innerWidth;fx.height=innerHeight}}
function burst(ux,uy,n){if(forestEdition)return;n=qn(n);fxs();const r=$('pad').getBoundingClientRect(),x=r.left+r.width*ux,y=r.top+r.height*uy;for(let i=0;i<n;i++){const a=Math.random()*6.28,v=2+Math.random()*6;C.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,g:.12,r:2+Math.random()*4,c:cols[i%5],a:0,life:60+Math.random()*50})}}
function confetti(n){if(forestEdition&&forestMotionReduced())return;n=qn(n);fxs();for(let i=0;i<n;i++)C.push({x:Math.random()*fx.width,y:-20-Math.random()*fx.height*.4,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,g:.02,r:3+Math.random()*4,c:cols[i%5],a:Math.random()*6,life:160})}
function tip(x,y){if(forestEdition)return;fxs();if(SET.quiet==='on'&&Math.random()<.6)return;for(let i=0;i<3;i++){const a=Math.random()*6.28,v=1+Math.random()*3;C.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.03,r:2+Math.random()*3.5,c:cols[(Math.random()*5)|0],a:0,life:35+Math.random()*25})}}
function loop(t){sx.clearRect(0,0,st.width,st.height);sx.fillStyle='#fff';for(const s of S){sx.globalAlpha=.4+.6*Math.abs(Math.sin(t/900+s.p));sx.beginPath();sx.arc(s.x,s.y,s.r,0,7);sx.fill()}
 fc.clearRect(0,0,fx.width,fx.height);C=C.filter(p=>p.life-->0&&p.y<fx.height+30);for(const p of C){if(p.ring){p.r+=2.2;fc.globalAlpha=Math.max(0,p.life/16);fc.strokeStyle=p.c;fc.lineWidth=3;fc.beginPath();fc.arc(p.x,p.y,p.r,0,7);fc.stroke();continue}if(p.sh){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.a+=.3;fc.globalAlpha=Math.min(1,p.life/20);fc.save();fc.translate(p.x,p.y);fc.rotate(p.a);fc.fillStyle=p.c;fc.beginPath();fc.moveTo(0,-p.r*1.6);fc.lineTo(p.r,p.r);fc.lineTo(-p.r,p.r*.6);fc.fill();fc.restore();continue}p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.985;p.a+=.1;fc.globalAlpha=Math.min(1,p.life/30);fc.save();fc.translate(p.x,p.y);fc.rotate(p.a);fc.fillStyle=p.c;fc.beginPath();for(let k=0;k<5;k++){const an=k*1.2566;fc.lineTo(Math.cos(an)*p.r,Math.sin(an)*p.r);fc.lineTo(Math.cos(an+.628)*p.r*.45,Math.sin(an+.628)*p.r*.45)}fc.fill();fc.restore()}
 fc.globalAlpha=1;requestAnimationFrame(loop)}
requestAnimationFrame(loop);
// ---------- navigation (always visible): 다시하기 / 돌아가기 / 나가기 ----------
function curScreen(){return document.querySelector('.screen.on').id}
function stopAll(){GEN++;if(forestEdition)endForestPointer();try{VS&&VS.stop()}catch(e){}try{vid.pause()}catch(e){}try{speechSynthesis.cancel()}catch(e){}cancelAnimationFrame(gAnim);clearTimeout(liftWait);liftWait=null;rewrite=false;
 duckN=0;if(BGM)BGM.gain.setTargetAtTime(BGM_LV,AC.currentTime,.12);closeDexPlay()}
/* nvRetry -> document delegation (RETRY_HARDEN_v2) */
$('nvBack').onclick=()=>{unlock();const s=curScreen();if(s==='dex'){closeDexPlay();show(window.__dexBack||'start');return}stopAll();
 if(s==='trace'){if(cj>0||$('word').classList.contains('big'))startStage(SI);else if(SI>0)startStage(SI-1);else{bgm('calm');show('start')}}
 else if(s==='final')startStage(STAGES.length-1);else startStage(SI)};
$('nvExit').onclick=()=>{$('exitc').classList.add('on');say('그만할까요?')};
$('exNo').onclick=()=>$('exitc').classList.remove('on');
$('exYes').onclick=()=>{$('exitc').classList.remove('on');stopAll();bgm('calm');show('start')};
// ---------- 도감 playback: real animal clips (CC BY, local) + code-synthesized animal sounds ----------
const DEXV={gazelle:{v:'dex_gazelle.mp4',c:'가젤의 사촌 임팔라 친구들이 풀밭을 걸어요!',cr:'Video: brando, CC BY 2.0, Wikimedia Commons (impala)',n:'가젤의 가!'},
 gorilla:{v:'dex_gorilla.mp4',c:'고릴라가 두 발로 서서 팔을 휘둘러요!',cr:'Video: LA Zoo, CC BY 3.0, Wikimedia Commons',n:'고릴라의 고!'},
 giraffe:{v:'dex_giraffe.mp4',c:'기린이 긴 목을 쭉 뻗어 나뭇잎을 먹어요!',cr:'Video: Lennart Hessel, CC BY 3.0, Wikimedia Commons',n:'기린의 기!'}};
let dexSrc=null;
function animalSnd(a){return render(a==='giraffe'?10:a==='gazelle'?8:6,O=>{
 const thud=(t,f,v,d=.12)=>{const o=O.createOscillator(),g=O.createGain();o.frequency.setValueAtTime(f*2,t);o.frequency.exponentialRampToValueAtTime(f,t+.04);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g).connect(O.destination);o.start(t);o.stop(t+d+.02)};
 if(a==='gazelle'){for(let t=.3;t<7.6;t+=.62){[0,.09,.2,.27].forEach((o,i)=>{thud(t+o,140+i*12,.35,.09);noise(O,t+o,.05,.12,2200)})}}
 else if(a==='gorilla'){[.5,3.2].forEach(t0=>{for(let i=0;i<9;i++){thud(t0+i*.13,95+(i%2)*25,.7,.16);noise(O,t0+i*.13,.06,.15,700)}});
  const o=O.createOscillator(),g=O.createGain();o.type='triangle';o.frequency.setValueAtTime(180,1.9);o.frequency.linearRampToValueAtTime(260,2.5);g.gain.setValueAtTime(0,1.9);g.gain.linearRampToValueAtTime(.12,2.1);g.gain.linearRampToValueAtTime(0,2.6);o.connect(g).connect(O.destination);o.start(1.9);o.stop(2.7)}
 else{for(let t=.6;t<9.5;t+=1.6){for(let i=0;i<5;i++)noise(O,t+i*.17,.08,.22,1400+Math.random()*900);noise(O,t-.3,.35,.08,5000)}}})}
function playDex(a){unlock();stopAll();const D=DEXV[a],dv=$('dexvid');dv.src=D.v;dv.loop=true;dv.muted=true;dv.currentTime=0;dv.play().catch(()=>{});
 $('dexcap').textContent=tr(D.c);$('dexcr').textContent=D.cr;$('dexplay').classList.add('on');
 const go=()=>{if(!BUF['as_'+a])return;dexSrc=AC.createBufferSource();dexSrc.buffer=BUF['as_'+a];dexSrc.loop=true;dexSrc.connect(SFXG);dexSrc.start()};
 if(BUF['as_'+a])go();else animalSnd(a).then(b=>{BUF['as_'+a]=b;if($('dexplay').classList.contains('on'))go()});
 T(()=>say(D.n),600)}
function closeDexPlay(){const el=$('dexplay');if(!el)return;el.classList.remove('on');try{$('dexvid').pause()}catch(e){}try{dexSrc&&dexSrc.stop()}catch(e){}dexSrc=null}
document.querySelectorAll('#dex .card').forEach(c=>c.addEventListener('click',()=>{if(!c.classList.contains('lock'))playDex(c.dataset.a)}));
$('dexpx').onclick=()=>{GEN++;closeDexPlay();try{VS&&VS.stop()}catch(e){}};
function shatter(x,y){fxs();const n=SET.quiet==='on'?6:16,gc=['#ffd34d','#fff1a8','#ffb300','#ffffff','#ffe08a'];
 for(let i=0;i<n;i++){const a=Math.random()*6.28,v=2.5+Math.random()*5;C.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,g:.18,r:1.6+Math.random()*3.2,c:gc[i%5],a:Math.random()*6,life:28+Math.random()*22,sh:1})}
 C.push({x,y,ring:1,r:6,life:16,c:'#fff1a8',vx:0,vy:0,g:0,a:0})}



/* RETRY_HARDEN_v2 */
const SFX_SOFT_URI='./assets/25ae7e8787a0261e.wav';
const SFX_CHIME_URI='./assets/e0474a516ff9678f.wav';
function playHtmlAudio(src,vol){try{const a=new Audio(src);a.volume=vol==null?(SET.quiet==='on'?.45:.85):vol;const p=a.play();if(p&&p.catch)p.catch(()=>{});return a}catch(e){return null}}
function playSfxKey(k){const needUri=FILEPROTO||!AC||!BUF[k];if(needUri){const u=k==='soft'?SFX_SOFT_URI:(k==='chime'||k==='big'?SFX_CHIME_URI:null);if(u){playHtmlAudio(u);return true}}return playBuf(k)}
function showRetryToast(){const t=$('retryToast');if(!t)return;t.textContent='다시 쓸게요!';t.classList.remove('on');void t.offsetWidth;t.classList.add('on');clearTimeout(showRetryToast._t);showRetryToast._t=setTimeout(()=>t.classList.remove('on'),1200)}
function ensureRetryEnabled(){const nb=$('nvRetry');if(!nb)return;nb.disabled=false;nb.removeAttribute('disabled');nb.classList.remove('dead');nb.style.pointerEvents='auto';nb.style.opacity='1';const n=$('nav');if(n)n.style.pointerEvents='auto'}
let _retryLock=0;
function doNvRetry(ev){const now=performance.now();if(now-_retryLock<400)return;_retryLock=now;if(ev){try{ev.preventDefault()}catch(e){}try{ev.stopPropagation()}catch(e){}}const nb=$('nvRetry');if(!nb)return;unlock();ensureRetryEnabled();playSfxKey('soft');const P=$('pad');if(P){P.classList.remove('shk');void P.offsetWidth;P.classList.add('shk')}nb.classList.remove('spin');void nb.offsetWidth;nb.classList.add('spin');showRetryToast();const s=curScreen();if(s==='start')return;if(s==='dex'){closeDexPlay();stopAll();startStage(typeof SI==='number'?SI:0);return}stopAll();startStage(s==='final'?STAGES.length-1:SI)}
(function bindRetry(){if(forestEdition){
 const button=$('nvRetry');
 button.addEventListener('click',doNvRetry);
 button.addEventListener('keydown',event=>{
  if(!event.repeat&&(event.key==='Enter'||event.key===' '))doNvRetry(event);
 });
 ensureRetryEnabled();
 return;
 }
 const hit=t=>t&&(t.id==='nvRetry'||(t.closest&&t.closest('#nvRetry')));
 document.addEventListener('pointerdown',e=>{if(hit(e.target))doNvRetry(e)},true);
 document.addEventListener('click',e=>{if(hit(e.target)){e.preventDefault();e.stopPropagation()}},true);
 ensureRetryEnabled()})();

/* RAIJUN-TRACE */
(function(){const $r=id=>document.getElementById(id);let rjBusy=0,rjT=null;
function vis(e){if(!e||e.offsetParent===null)return false;const c=getComputedStyle(e);return c.display!=='none'&&c.visibility!=='hidden'&&+c.opacity>0}
function trect(e){try{const r=document.createRange();r.selectNodeContents(e);const b=r.getBoundingClientRect();return b.width?b:null}catch(x){return null}}
function ov(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top}
window.rjPlace=function(){const rj=$r('rj'),pad=$r('pad');if(!rj||!pad)return;if(rj.parentNode!==document.body)document.body.appendChild(rj);if(!$r('trace').classList.contains('on')){rj.classList.remove('ready');return}
 const P=pad.getBoundingClientRect(),W=innerWidth,H=innerHeight;
 const obs=[...document.querySelectorAll('#gear,#dexbtn,#nav .nb,#pad')].filter(vis).map(e=>e.getBoundingClientRect());
 ['stage','msg','formula'].forEach(i=>{const e=$r(i);if(e&&e.offsetParent!==null&&e.textContent.trim()){const t=trect(e);if(t)obs.push(t)}});
 const left=P.left,right=W-P.right,onLeft=left>=right,g0=onLeft?0:P.right,g1=onLeft?P.left:W;
 let best=null;
 for(let h=H*.38;h>=H*.2;h-=H*.02){const w=h*334/360,bot=H-20,top=bot-h;
  const xs=onLeft?[g1-12-w,(g0+g1-w)/2,g0+12]:[g0+12,(g0+g1-w)/2,g1-12-w];
  for(const x of xs){if(x<4||x+w>W-4)continue;const r={left:x,right:x+w,top:top,bottom:bot};if(!obs.some(o=>ov(r,o))){best=r;break}}
  if(best)break}
 if(!best){rj.classList.remove('ready');rj.style.display='none';return}
 rj.style.display='';Object.assign(rj.style,{left:best.left+'px',top:best.top+'px',width:(best.right-best.left)+'px',height:(best.bottom-best.top)+'px'});rj.classList.add('ready');
 rj.dataset.side=onLeft?'L':'R';rjCover()};
window.rjCover=function(){const rj=$r('rj');if(!rj||rj.style.display==='none'||!$r('trace').classList.contains('on'))return;const q=rj.getBoundingClientRect();let ok=0,n=0;for(const [fx,fy] of [[.5,.3],[.5,.7],[.3,.5],[.7,.5]]){const el=document.elementFromPoint(q.left+q.width*fx,q.top+q.height*fy);n++;if(el&&($r('trace').contains(el)||el===document.body||el===document.documentElement||el.id==='app'||(el.closest&&!el.closest('.screen:not(#trace),[id$=play],[id$=modal],[class*=modal],[class*=overlay]')&&!el.closest('#dexplay'))))ok++}rj.style.visibility=ok>=3?'visible':'hidden'};
function act(c,ms){const a=$r('rja');if(!a)return;a.classList.remove('hop','cheer','tilt');void a.offsetWidth;a.classList.add(c);clearTimeout(rjT);rjT=setTimeout(()=>a.classList.remove(c),ms)}
function orbXY(){const o=$r('rjorb').getBoundingClientRect();return[o.left+o.width/2,o.top+o.height/2]}
window.rjPoint=function(){if(forestEdition)return;try{if(!$r('trace').classList.contains('on'))return;const c=document.querySelector('#guides circle');if(!c)return;const b=c.getBoundingClientRect();if(!b.width)return;
 const tx=b.left+b.width/2,ty=b.top+b.height/2,o=$r('rjorb');o.classList.remove('go');void o.offsetWidth;o.classList.add('go');
 [0,260,520].forEach(d=>setTimeout(()=>{const [x,y]=orbXY(),s=document.createElement('div');s.className='rjspark';s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{s.style.left=tx+'px';s.style.top=ty+'px';s.style.opacity='0';s.style.transform='scale(.5)'}));setTimeout(()=>s.remove(),900)},d))}catch(e){}};
window.rjCheer=function(){if(forestEdition)return;act('cheer',1500);const r=$r('rj').getBoundingClientRect();for(let i=0;i<9;i++){const s=document.createElement('div');s.className='rjstar';s.textContent=i%3?'✨':'⭐';
 s.style.left=(r.left+r.width*(.2+.6*Math.random()))+'px';s.style.top=(r.top+r.height*(.15+.4*Math.random()))+'px';s.style.setProperty('--dx',((Math.random()-.5)*90)+'px');s.style.setProperty('--dy',(-30-Math.random()*60)+'px');s.style.animationDelay=(i*0.08)+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),1900)}};
try{const _sg=showGuide;showGuide=function(){const r=_sg.apply(this,arguments);setTimeout(()=>{rjPlace();rjPoint()},120);return r}}catch(e){}
try{const _sd=strokeDone;strokeDone=function(){act('hop',450);return _sd.apply(this,arguments)}}catch(e){}
try{const _rt=retry;retry=function(){act('tilt',1300);return _rt.apply(this,arguments)}}catch(e){}
try{const _jd=jamoDone;jamoDone=function(){const r=_jd.apply(this,arguments);setTimeout(rjCheer,150);return r}}catch(e){}
try{const _mg=merge;merge=function(){const r=_mg.apply(this,arguments);setTimeout(rjCheer,300);return r}}catch(e){}
addEventListener('resize',()=>setTimeout(rjPlace,60));
new MutationObserver(()=>setTimeout(rjPlace,80)).observe($r('trace'),{attributes:true,attributeFilter:['class']});
setInterval(()=>{if($r('trace').classList.contains('on'))rjPlace()},1500);setInterval(()=>{try{rjCover()}catch(e){}},300);
})();
