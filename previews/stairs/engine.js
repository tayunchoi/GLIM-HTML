/* Local website preview extracted from the user-supplied engine. */
const previewStorage = (() => {
  const values = new Map();
  return {getItem:key=>values.has(key)?values.get(key):null,
    setItem:(key,value)=>values.set(key,String(value)),
    removeItem:key=>values.delete(key),clear:()=>values.clear()};
})();

/* =========================================================
   글림 — 한글 계단 · PDF v5 (9판 구성 / 인지메트릭 / 게임 BGM)
   나라 3종(단어/음절/음소) × 38세트 × 9판: 소개 → 짧은 하·중·상 → 긴 하·중·상 → 추격 → 정상. 전체 342단계.
   속도 = 정답당 시간바 회복량 하3.3/중2.5/상1.8, 최대 2회분. 오답은 원래 층으로 충돌 반동(추가 시간 차감 없음). 시간 0은 놓침 기록 후 다음 층으로 자동 이동.
   PDF v5 적용: 2~7판은 시간바로 측정. 8판 추격판은 시간바 없이 추격물만 표시하고 계산 제외. 9판은 정상.
   지표 4종(효율 유지율·수행 효율성·혼동쌍 유지율·오답 후 정답률) + 파지율. 아래 v9 모듈이 기존 규칙을 대체.
   콘솔: GLIM.metrics(country,setA,setB) / GLIM.profile() / GLIM.rx / GLIM.reset()
   ========================================================= */
const PATTERNS={"word":[[null,["clean","clean","clean","clean","sim","clean","clean"],["clean","clean","clean","sim","clean","clean","clean"],["clean","clean","clean","clean","clean","sim","clean"],["clean","clean","sim","clean","clean","clean","clean","clean","clean","clean","clean","clean","sim","clean","clean"],["clean","clean","clean","sim","clean","clean","clean","clean","clean","clean","sim","clean","clean","clean","clean"],["clean","clean","clean","sim","clean","clean","clean","sim","clean","clean","clean","clean","clean","clean","clean"],null],[null,["clean","clean","clean","clean","clean","clean","sim"],["clean","clean","sim","clean","clean","clean","clean"],["clean","clean","clean","sim","clean","clean","sim"],["clean","clean","clean","clean","clean","clean","clean","clean","sim","clean","clean","clean","clean","clean","sim"],["clean","clean","clean","sim","clean","sim","clean","clean","clean","clean","clean","clean","clean","clean","sim"],["clean","clean","sim","clean","clean","clean","clean","clean","sim","clean","sim","clean","clean","clean","clean"],null],[null,["clean","clean","clean","clean","clean","clean","sim"],["clean","clean","sim","clean","clean","clean","sim"],["clean","clean","clean","clean","sim","clean","sim"],["clean","clean","clean","fog","sim","clean","clean","clean","clean","clean","sim","clean","sim","clean","clean"],["clean","clean","clean","sim","clean","sim","clean","sim","clean","clean","clean","clean","clean","fog","clean"],["clean","clean","fog","sim","clean","clean","fog","clean","clean","clean","clean","sim","clean","sim","clean"],null],[null,["clean","clean","clean","clean","sim","clean","sim"],["clean","clean","clean","sim","clean","clean","sim"],["clean","clean","clean","clean","sim","fog","sim"],["clean","clean","clean","clean","clean","clean","fog","sim","clean","sim","clean","clean","clean","clean","sim"],["clean","clean","clean","sim","clean","clean","clean","clean","clean","fog","clean","sim","fog","sim","clean"],["clean","clean","clean","clean","clean","clean","clean","sim","clean","clean","fog","sim","fog","sim","clean"],null],[null,["clean","clean","sim","clean","fog","clean","sim"],["clean","clean","sim","fog","clean","sim","clean"],["clean","clean","sim","clean","sim","fog","clean"],["clean","clean","clean","fog","sim","clean","clean","sim","clean","clean","clean","sim","fog","clean","clean"],["clean","clean","clean","clean","fog","clean","sim","clean","sim","clean","sim","fog","clean","clean","clean"],["clean","clean","clean","clean","clean","clean","sim","clean","sim","fog","sim","fog","clean","clean","clean"],null],[null,["clean","clean","fog","sim","clean","clean","sim"],["clean","clean","fog","sim","clean","clean","sim"],["clean","clean","clean","sim","fog","sim","clean"],["clean","clean","clean","clean","fog","clean","clean","sim","clean","clean","clean","sim","fog","clean","sim"],["clean","clean","clean","sim","fog","sim","fog","clean","clean","sim","clean","clean","clean","clean","sim"],["clean","clean","clean","sim","clean","sim","fog","clean","sim","clean","fog","sim","clean","fog","clean"],null],[null,["clean","clean","clean","fog","sim","clean","sim"],["clean","clean","sim","clean","fog","clean","sim"],["clean","clean","clean","fog","clean","sim","sim"],["clean","clean","clean","sim","sim","clean","sim","wind","clean","clean","fog","clean","fog","sim","clean"],["clean","clean","fog","clean","sim","clean","clean","sim","fog","clean","sim","clean","wind","clean","sim"],["clean","clean","clean","fog","clean","sim","fog","sim","clean","wind","sim","fog","clean","sim","sim"],null],[null,["clean","clean","clean","sim","clean","fog","sim"],["clean","clean","fog","clean","sim","sim","clean"],["clean","clean","sim","clean","sim","fog","clean"],["clean","clean","wind","fog","clean","clean","clean","sim","clean","sim","clean","fog","sim","sim","clean"],["clean","clean","wind","clean","clean","sim","clean","sim","fog","sim","clean","fog","sim","fog","sim"],["clean","clean","clean","sim","fog","clean","fog","sim","clean","sim","fog","sim","sim","wind","clean"],null],[null,["clean","clean","clean","sim","fog","sim","clean"],["clean","clean","sim","clean","fog","sim","clean"],["clean","clean","sim","fog","clean","sim","clean"],["clean","clean","sim","clean","sim","clean","fog","clean","fog","clean","wind","fog","clean","sim","sim"],["clean","clean","sim","sim","clean","fog","wind","fog","clean","fog","sim","clean","sim","sim","clean"],["clean","clean","sim","clean","fog","wind","fog","sim","fog","sim","sim","clean","clean","sim","wind"],null],[null,["clean","clean","sim","clean","fog","clean","sim"],["clean","clean","sim","sim","fog","clean","clean"],["clean","clean","clean","sim","fog","clean","sim"],["clean","clean","fog","sim","fog","clean","clean","wind","clean","sim","sim","fog","clean","sim","sim"],["clean","clean","sim","sim","fog","clean","wind","fog","wind","sim","sim","clean","sim","fog","clean"],["clean","clean","clean","fog","wind","sim","clean","fog","wind","sim","sim","clean","sim","fog","sim"],null],[null,["clean","clean","sim","clean","fog","sim","clean"],["clean","clean","fog","clean","sim","sim","clean"],["clean","clean","fog","sim","clean","sim","clean"],["clean","clean","fog","wind","clean","sim","wind","sim","sim","clean","fog","clean","fog","sim","sim"],["clean","clean","fog","sim","clean","clean","sim","fog","wind","clean","sim","sim","fog","wind","sim"],["clean","clean","sim","sim","fog","clean","sim","fog","sim","wind","clean","clean","fog","sim","wind"],null],[null,["clean","clean","sim","fog","sim","clean","clean"],["clean","clean","sim","clean","fog","sim","clean"],["clean","clean","clean","fog","clean","sim","sim"],["clean","clean","fog","clean","clean","sim","clean","wind","fog","sim","sim","wind","fog","sim","sim"],["clean","clean","fog","clean","sim","clean","sim","fog","sim","wind","clean","fog","sim","sim","wind"],["clean","clean","sim","wind","fog","sim","sim","fog","clean","sim","clean","sim","wind","fog","clean"],null],[null,["clean","clean","clean","fog","sim","clean","sim"],["clean","clean","fog","clean","sim","clean","sim"],["clean","clean","sim","fog","sim","clean","clean"],["clean","clean","sim","fog","clean","clean","sim","fog","sim","fog","clean","both","wind","wind","sim"],["clean","clean","fog","clean","sim","fog","sim","sim","wind","both","clean","fog","clean","wind","sim"],["clean","clean","fog","wind","fog","sim","fog","wind","clean","sim","fog","sim","clean","both","sim"],null],[null,["clean","clean","clean","sim","fog","clean","sim"],["clean","clean","clean","clean","sim","fog","sim"],["clean","clean","fog","sim","clean","clean","sim"],["clean","clean","sim","sim","clean","clean","both","wind","fog","sim","clean","fog","wind","fog","sim"],["clean","clean","fog","clean","fog","sim","sim","fog","sim","wind","both","wind","fog","sim","clean"],["clean","clean","sim","fog","sim","fog","wind","clean","both","wind","fog","sim","sim","fog","clean"],null],[null,["clean","clean","sim","sim","clean","fog","clean"],["clean","clean","fog","clean","sim","sim","clean"],["clean","clean","sim","sim","clean","fog","clean"],["clean","clean","sim","fog","wind","both","clean","fog","sim","fog","wind","fog","sim","both","clean"],["clean","clean","fog","clean","both","sim","fog","wind","both","sim","fog","wind","fog","sim","clean"],["clean","clean","fog","sim","sim","fog","sim","wind","fog","clean","both","both","wind","fog","sim"],null],[null,["clean","clean","fog","clean","sim","sim","clean"],["clean","clean","clean","sim","fog","sim","clean"],["clean","clean","sim","clean","fog","clean","sim"],["clean","clean","fog","sim","sim","fog","clean","both","both","wind","sim","fog","wind","fog","sim"],["clean","clean","fog","sim","sim","fog","sim","fog","sim","wind","both","both","clean","fog","wind"],["clean","clean","fog","sim","both","wind","fog","wind","both","sim","fog","sim","wind","fog","sim"],null]],"syl":[[null,["clean","clean","clean","clean","clean","sim","clean"],["clean","clean","clean","sim","clean","sim","clean"],["clean","clean","clean","sim","clean","sim","clean"],["clean","clean","clean","sim","clean","fog","sim","clean","clean","sim","clean","clean","clean","clean","clean"],["clean","clean","fog","sim","clean","clean","clean","clean","clean","clean","sim","clean","sim","clean","clean"],["clean","clean","sim","fog","clean","sim","clean","fog","clean","clean","clean","clean","clean","clean","sim"],null],[null,["clean","clean","clean","sim","clean","sim","clean"],["clean","clean","clean","sim","clean","clean","sim"],["clean","clean","sim","clean","fog","clean","sim"],["clean","clean","clean","clean","clean","clean","sim","clean","sim","clean","clean","clean","sim","fog","clean"],["clean","clean","clean","sim","clean","clean","sim","fog","clean","fog","clean","clean","clean","sim","clean"],["clean","clean","sim","clean","fog","clean","sim","clean","clean","clean","sim","clean","clean","fog","clean"],null],[null,["clean","clean","sim","clean","fog","sim","clean"],["clean","clean","sim","fog","clean","sim","clean"],["clean","clean","sim","sim","fog","clean","clean"],["clean","clean","sim","fog","clean","clean","clean","clean","sim","sim","wind","fog","sim","clean","clean"],["clean","clean","clean","fog","clean","sim","sim","wind","clean","fog","clean","clean","sim","clean","sim"],["clean","clean","sim","sim","clean","sim","fog","clean","fog","clean","clean","sim","fog","sim","wind"],null],[null,["clean","clean","fog","sim","clean","sim","clean"],["clean","clean","clean","sim","fog","sim","clean"],["clean","clean","sim","clean","fog","sim","clean"],["clean","clean","sim","fog","clean","sim","sim","wind","clean","fog","clean","sim","clean","clean","clean"],["clean","clean","fog","sim","sim","fog","clean","clean","sim","clean","fog","sim","sim","wind","clean"],["clean","clean","clean","fog","sim","sim","clean","fog","clean","fog","sim","sim","wind","sim","clean"],null],[null,["clean","clean","sim","clean","fog","clean","sim"],["clean","clean","sim","fog","clean","clean","sim"],["clean","clean","sim","fog","sim","clean","clean"],["clean","clean","sim","fog","wind","fog","clean","sim","clean","sim","fog","sim","clean","sim","wind"],["clean","clean","fog","sim","sim","clean","sim","sim","clean","sim","fog","wind","clean","fog","wind"],["clean","clean","sim","fog","sim","wind","clean","sim","fog","clean","fog","sim","wind","sim","clean"],null],[null,["clean","clean","sim","fog","clean","sim","clean"],["clean","clean","clean","fog","clean","sim","sim"],["clean","clean","sim","clean","clean","fog","sim"],["clean","clean","fog","sim","wind","fog","clean","fog","clean","sim","sim","wind","sim","clean","sim"],["clean","clean","sim","sim","fog","sim","clean","fog","wind","sim","wind","sim","clean","fog","clean"],["clean","clean","clean","fog","clean","sim","sim","fog","sim","wind","clean","wind","sim","fog","sim"],null]],"pho":[[null,["clean","clean","clean","clean","sim","clean","clean"],["clean","clean","clean","clean","sim","clean","clean"],["clean","clean","clean","sim","clean","clean","clean"],["clean","clean","clean","clean","clean","sim","clean","clean","clean","clean","clean","clean","sim","clean","clean"],["clean","clean","clean","clean","sim","clean","clean","clean","clean","clean","clean","clean","sim","clean","clean"],["clean","clean","clean","clean","clean","sim","clean","clean","clean","clean","clean","clean","sim","clean","clean"],null],[null,["clean","clean","clean","sim","clean","clean","clean"],["clean","clean","clean","sim","clean","clean","clean"],["clean","clean","sim","clean","sim","clean","clean"],["clean","clean","clean","clean","sim","clean","clean","clean","sim","clean","clean","clean","clean","clean","clean"],["clean","clean","clean","clean","clean","clean","sim","clean","clean","sim","clean","clean","clean","clean","sim"],["clean","clean","clean","clean","sim","clean","clean","clean","sim","clean","clean","clean","clean","sim","clean"],null],[null,["clean","clean","clean","clean","sim","clean","clean"],["clean","clean","sim","clean","sim","clean","clean"],["clean","clean","clean","clean","sim","clean","sim"],["clean","clean","clean","clean","sim","clean","clean","clean","clean","clean","fog","sim","clean","sim","clean"],["clean","clean","clean","clean","sim","clean","sim","fog","clean","clean","sim","clean","clean","clean","clean"],["clean","clean","clean","clean","clean","clean","sim","fog","clean","sim","fog","sim","clean","clean","clean"],null],[null,["clean","clean","clean","sim","clean","sim","clean"],["clean","clean","clean","sim","clean","clean","sim"],["clean","clean","fog","sim","clean","clean","sim"],["clean","clean","clean","fog","sim","clean","clean","sim","clean","clean","clean","clean","clean","sim","clean"],["clean","clean","clean","clean","sim","clean","sim","clean","fog","clean","fog","clean","sim","clean","clean"],["clean","clean","clean","clean","clean","sim","clean","sim","clean","fog","clean","clean","fog","clean","sim"],null],[null,["clean","clean","clean","sim","clean","fog","sim"],["clean","clean","fog","sim","clean","sim","clean"],["clean","clean","sim","clean","fog","clean","sim"],["clean","clean","clean","sim","fog","sim","fog","clean","clean","clean","sim","clean","clean","clean","clean"],["clean","clean","sim","clean","clean","clean","clean","clean","fog","clean","sim","fog","clean","clean","sim"],["clean","clean","fog","sim","clean","fog","clean","clean","clean","clean","sim","clean","sim","clean","clean"],null],[null,["clean","clean","sim","clean","sim","fog","clean"],["clean","clean","clean","clean","sim","fog","sim"],["clean","clean","sim","clean","fog","clean","sim"],["clean","clean","sim","fog","clean","clean","clean","sim","clean","fog","sim","clean","clean","clean","clean"],["clean","clean","clean","clean","clean","sim","fog","sim","fog","clean","clean","sim","clean","sim","clean"],["clean","clean","sim","fog","sim","clean","fog","sim","clean","clean","clean","clean","clean","fog","sim"],null],[null,["clean","clean","fog","sim","clean","clean","sim"],["clean","clean","fog","clean","sim","sim","clean"],["clean","clean","fog","clean","sim","clean","sim"],["clean","clean","sim","clean","fog","sim","clean","clean","clean","wind","clean","fog","sim","sim","clean"],["clean","clean","sim","fog","clean","clean","clean","clean","sim","wind","sim","sim","clean","fog","clean"],["clean","clean","clean","fog","sim","fog","clean","sim","sim","fog","sim","wind","clean","sim","clean"],null],[null,["clean","clean","sim","clean","sim","fog","clean"],["clean","clean","sim","fog","clean","clean","sim"],["clean","clean","sim","clean","clean","fog","sim"],["clean","clean","clean","sim","fog","clean","sim","sim","clean","clean","wind","fog","clean","sim","clean"],["clean","clean","wind","clean","sim","fog","sim","fog","sim","sim","clean","clean","clean","fog","sim"],["clean","clean","sim","clean","fog","clean","sim","wind","clean","fog","sim","sim","fog","clean","sim"],null],[null,["clean","clean","clean","sim","fog","sim","clean"],["clean","clean","fog","clean","sim","sim","clean"],["clean","clean","fog","clean","clean","sim","sim"],["clean","clean","fog","clean","clean","sim","fog","clean","sim","sim","clean","wind","clean","fog","sim"],["clean","clean","clean","sim","clean","fog","wind","fog","sim","clean","sim","sim","clean","fog","sim"],["clean","clean","fog","sim","sim","wind","fog","clean","clean","sim","sim","clean","fog","sim","wind"],null],[null,["clean","clean","fog","sim","clean","clean","sim"],["clean","clean","clean","fog","sim","sim","clean"],["clean","clean","clean","sim","sim","fog","clean"],["clean","clean","clean","wind","clean","clean","sim","fog","sim","fog","sim","sim","fog","clean","sim"],["clean","clean","sim","clean","fog","wind","fog","clean","sim","fog","sim","sim","wind","sim","clean"],["clean","clean","sim","fog","clean","fog","sim","wind","sim","sim","clean","fog","clean","wind","sim"],null],[null,["clean","clean","fog","sim","sim","clean","clean"],["clean","clean","fog","clean","clean","sim","sim"],["clean","clean","clean","fog","sim","clean","sim"],["clean","clean","fog","wind","sim","clean","clean","fog","sim","wind","fog","sim","clean","sim","sim"],["clean","clean","sim","fog","sim","fog","clean","wind","clean","fog","sim","wind","sim","sim","clean"],["clean","clean","sim","clean","fog","clean","sim","clean","sim","sim","wind","fog","wind","fog","sim"],null],[null,["clean","clean","clean","sim","fog","clean","sim"],["clean","clean","clean","sim","fog","sim","clean"],["clean","clean","sim","clean","fog","sim","clean"],["clean","clean","fog","wind","clean","sim","fog","clean","sim","wind","fog","sim","sim","clean","sim"],["clean","clean","fog","sim","clean","wind","clean","wind","fog","sim","clean","sim","fog","sim","sim"],["clean","clean","wind","sim","fog","clean","clean","clean","sim","fog","sim","sim","fog","sim","wind"],null],[null,["clean","clean","sim","fog","clean","sim","clean"],["clean","clean","fog","clean","sim","sim","clean"],["clean","clean","fog","sim","clean","sim","clean"],["clean","clean","sim","fog","clean","both","sim","wind","fog","sim","wind","fog","clean","sim","clean"],["clean","clean","sim","clean","wind","sim","fog","clean","fog","sim","sim","fog","clean","both","wind"],["clean","clean","fog","sim","both","wind","sim","fog","sim","fog","clean","clean","fog","sim","wind"],null],[null,["clean","clean","sim","fog","sim","clean","clean"],["clean","clean","clean","clean","fog","sim","sim"],["clean","clean","sim","clean","fog","sim","clean"],["clean","clean","fog","sim","fog","sim","wind","clean","both","clean","fog","wind","clean","sim","sim"],["clean","clean","sim","sim","fog","wind","both","wind","fog","sim","clean","fog","clean","fog","sim"],["clean","clean","fog","sim","clean","fog","sim","clean","both","sim","fog","wind","fog","sim","wind"],null],[null,["clean","clean","fog","sim","clean","sim","clean"],["clean","clean","fog","sim","clean","sim","clean"],["clean","clean","sim","sim","fog","clean","clean"],["clean","clean","fog","sim","both","clean","fog","wind","clean","fog","sim","fog","sim","both","wind"],["clean","clean","fog","sim","fog","sim","wind","both","both","clean","fog","wind","fog","sim","clean"],["clean","clean","fog","clean","fog","sim","sim","fog","wind","both","both","wind","sim","fog","sim"],null],[null,["clean","clean","clean","sim","fog","sim","clean"],["clean","clean","fog","sim","sim","clean","clean"],["clean","clean","clean","sim","sim","fog","clean"],["clean","clean","fog","clean","both","sim","fog","sim","fog","wind","fog","sim","both","wind","sim"],["clean","clean","fog","sim","fog","sim","wind","wind","both","both","clean","fog","sim","fog","sim"],["clean","clean","fog","wind","sim","fog","sim","fog","sim","fog","sim","both","wind","both","wind"],null]]};
const SETS=[
 {theme:0,type:'1음절 무받침',words:[['배','🍐',['매','베']],['소','🐮',['노','서']],['귀','👂',['뀌','기']]]},
 {theme:0,type:'1음절 무받침',words:[['해','☀️',['헤','새']],['개','🐶',['내','거']],['쥐','🐭',['주','지']]]},
 {theme:0,type:'1음절 무받침',words:[['게','🦀',['케','거']],['비','🌧️',['미','보']],['혀','👅',['허','여']]]},
 {theme:0,type:'1음절 무받침',words:[['이','🦷',['어','오']],['자','📏',['차','저']],['뼈','🦴',['벼','뻐']]]},
 {theme:0,type:'1음절 받침',words:[['꽃','🌸',['꼬','꼭']],['별','⭐',['벼','벌']],['집','🏠',['지','짐']]]},
 {theme:0,type:'1음절 받침',words:[['산','⛰️',['사','삼']],['공','⚽',['고','곤']],['밥','🍚',['바','박']]]},
 {theme:1,type:'2음절 무받침',words:[['포도','🍇',['보도','포더']],['시계','⏰',['시게','시개']],['조개','🐚',['조게','조가']]]},
 {theme:1,type:'2음절 무받침',words:[['사자','🦁',['사차','자자']],['나비','🦋',['나미','나피']],['우유','🥛',['오유','우요']]]},
 {theme:1,type:'받침(뒤)',words:[['버섯','🍄',['버서','버석']],['화분','🪴',['화부','화붐']],['사슴','🦌',['사스','사습']]]},
 {theme:1,type:'받침(뒤)',words:[['수박','🍉',['수바','수반']],['구름','☁️',['구르','구릉']],['주먹','👊',['주머','주멍']]]},
 {theme:1,type:'받침(앞)',words:[['장미','🌹',['자미','잠미']],['열쇠','🔑',['여쇠','염쇠']],['국수','🍜',['구수','궁수']]]},
 {theme:1,type:'받침(앞)',words:[['딸기','🍓',['따기','딸끼']],['감자','🥔',['가자','감차']],['침대','🛏️',['치대','침배']]]},
 {theme:2,type:'받침 1개',words:[['거울','🪞',['거우','거운']],['사람','🧍',['사라','사림']],['바늘','🪡',['바느','바눌']]]},
 {theme:2,type:'양받침',words:[['연필','✏️',['연피','여필']],['동전','🪙',['동저','도전']],['얼음','🧊',['얼으','어름']]]},
 {theme:2,type:'양받침',words:[['안경','👓',['안겅','아경']],['병원','🏥',['병워','벼원']],['선물','🎁',['선무','서물']]]},
 {theme:2,type:'양받침',words:[['양말','🧦',['양마','얌말']],['창문','🪟',['창무','찬문']],['눈물','😢',['눈무','누물']]]},
];
const COUNTRIES=[
 {key:'word',name:'단어나라',sets:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],themes:['초원','숲','설원'],themeOf:s=>SETS[s].theme,lens:[6,7,7,7,15,15,15,21]},
 {key:'syl', name:'음절나라',sets:[6,7,8,9,10,11],themes:['모래','절벽','등대'],themeOf:(s,l)=>[0,0,1,1,2,2][l],lens:[6,7,7,7,15,15,15,21]},
 {key:'pho', name:'음소나라',sets:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],themes:['돌탑','종탑','첨탑'],themeOf:s=>SETS[s].theme,lens:[4,5,5,5,10,10,10,10]},
];
const PANS=[{name:'소개판',sp:null},{name:'7층·하',sp:'low'},{name:'7층·중',sp:'mid'},{name:'7층·상',sp:'high'},{name:'15층·하',sp:'low'},{name:'15층·중',sp:'mid'},{name:'15층·상',sp:'high'},{name:'정상판',sp:'low',top:true}];
const THEMES=[
 {emoji:'🌿',ground:'#5bbf5a',skyLo:['#4fa3e0','#9ad8f5','#dff5c8'],skyHi:['#2f7fc4','#7fc0ea','#ffffff'],decor:['🌸','🌼','🍀','🐦','🌳'],card:'#6cc46a'},
 {emoji:'🌲',ground:'#2f7a4a',skyLo:['#2e6b4f','#5aa27a','#cfe8b8'],skyHi:['#1f4d6b','#4f8fb3','#dff0ff'],decor:['🌳','🌲','🍄','🦉','🍂'],card:'#3f9a5e'},
 {emoji:'❄️',ground:'#e8f2fb',skyLo:['#7fb3e6','#c9e4f7','#ffffff'],skyHi:['#3a4f8f','#8aa3d6','#ffffff'],decor:['❄️','⛄','🌲','🏔️','✨'],card:'#7fb3e6'},
];
let panLabel=(c,pi)=>{const P=PANS[pi];if(!P.sp||P.top)return P.name;return c.lens[pi]+(c.key==='word'?'층':'단어')+'·'+(P.sp==='low'?'하':P.sp==='mid'?'중':'상');};
const BUDGET={low:3.3,mid:2.5,high:1.8},SLOWER={high:'mid',mid:'low',low:'low'};
const FOG_DELAY=.45;
const RX_DEFAULT={eff:0,sus:0,inh:0,dis:0,rec:0};   // 처방 단계 (효율·지속·억제·변별·회복)

// ===== 자모 =====
const CHO=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNG=['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGL=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const decom=s=>{const c=s.charCodeAt(0)-0xAC00;return [CHO[(c/588)|0],JUNG[((c%588)/28)|0],(c%28)?JONGL[c%28]:null];};
const compose=(ch,j,k)=>String.fromCharCode(0xAC00+CHO.indexOf(ch)*588+JUNG.indexOf(j)*28+(k?JONGL.indexOf(k):0));
const choG=[['ㅁ','ㅂ','ㅍ'],['ㄴ','ㄷ','ㅌ','ㄹ'],['ㅅ','ㅈ','ㅊ'],['ㄱ','ㅋ'],['ㅎ']];
const jungG=[['ㅏ','ㅓ','ㅡ'],['ㅗ','ㅜ'],['ㅣ','ㅐ','ㅔ']];
const jongG=[['ㄴ','ㅇ','ㅁ'],['ㄹ'],['ㄱ','ㄷ','ㅂ']];
const rnd=a=>a[Math.random()*a.length|0];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
function crossPick(groups,excl){const gi=groups.findIndex(g=>g.indexOf(excl)>=0);let pool=[];groups.forEach((g,i)=>{if(i!==gi)pool=pool.concat(g);});if(!pool.length)pool=[].concat.apply([],groups);return rnd(pool);}
function simPick(groups,c){const g=groups.find(g=>g.indexOf(c)>=0);if(!g||g.length<2)return null;const o=g.filter(x=>x!==c);return rnd(o);}
function distSylClean(t){const d=decom(t);const c=crossPick(choG,d[0]),j=crossPick(jungG,d[1]),k=d[2]?crossPick(jongG,d[2]):null;let r=compose(c,j,k);return r===t?compose('ㄱ',j,k):r;}
function distSylSim(t){const d=decom(t);const which=Math.random()<.5?0:1;let c=d[0],j=d[1];if(which===0){const s=simPick(choG,d[0]);if(s)c=s;else j=simPick(jungG,d[1])||j;}else{const s=simPick(jungG,d[1]);if(s)j=s;else c=simPick(choG,d[0])||c;}const r=compose(c,j,d[2]);return r===t?distSylClean(t):r;}
function distJamo(slot,c,sim){const g=slot===0?choG:slot===1?jungG:jongG;if(sim){const s=simPick(g,c);if(s)return s;}let d=crossPick(g,c),n=0;while(d===c&&n++<10)d=crossPick(g,c);return d;}

// ===== 저장 =====
const LS={get(k,d){try{const v=previewStorage.getItem('glim.st4.'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{previewStorage.setItem('glim.st4.'+k,JSON.stringify(v));}catch(e){}}};
let prog=()=>LS.get('prog',{});
let starsOf=(c,s,p)=>(((prog()[c]||{})[s]||{})[p])||0;
let setCleared=(c,s)=>starsOf(c,s,7)>0;
let setUnlocked=(c,s)=>s===0||setCleared(c,s-1);
let panUnlocked=(c,s,p)=>p===0||starsOf(c,s,p-1)>0;
let totalStars=()=>LS.get('stars',0);
let weak=()=>LS.get('weak',{});
let rxLoad=c=>Object.assign({},RX_DEFAULT,(LS.get('rx',{})[c]||{}));

// ===== 판 생성 =====
const cw=(setIdx,wi)=>{const w=SETS[setIdx].words[wi];return {word:w[0],emoji:w[1],sims:w[2],set:setIdx};};
function pickWeighted(pool,n){const wk=weak();const out=[];let p=pool.slice();while(out.length<n&&p.length){const ws=p.map(o=>1+(wk[o.word]||0)*2);const tot=ws.reduce((a,b)=>a+b,0);let r=Math.random()*tot,k=0;for(;k<p.length;k++){r-=ws[k];if(r<=0)break;}k=Math.min(k,p.length-1);out.push(p[k]);p.splice(k,1);if(!p.length&&out.length<n)p=pool.slice();}return out;}
function arrangeNoRun(items,maxRun){for(let t=0;t<300;t++){const a=shuffle(items);let ok=true;for(let i=maxRun;i<a.length;i++){let same=true;for(let k=1;k<=maxRun;k++)if(a[i-k].word!==a[i].word)same=false;if(same){ok=false;break;}}if(ok)return a;}return shuffle(items);}
function unitsOf(country,o){ // 단어 → 층 단위 목록
  if(country.key==='word')return [{ch:o.word,type:'word'}];
  if(country.key==='syl')return o.word.split('').map((ch,i)=>({ch,type:'syl',syl:i}));
  const u=[];o.word.split('').forEach((s,si)=>{decom(s).forEach((j,slot)=>{if(j)u.push({ch:j,type:'jamo',slot,syl:si});});});return u;
}
function buildPan(ci,sl,pi,rx){
  const country=COUNTRIES[ci],setIdx=country.sets[sl],own=[0,1,2].map(i=>cw(setIdx,i)),pan=PANS[pi],W=country.lens[pi];
  let list=[];
  if(pi===0){for(let r=0;r<W/3;r++)list=list.concat(own);if(W%3)list=list.concat(own.slice(0,W%3));}
  else if(!pan.top){const base=Math.floor(W/3),extra=W-base*3;for(let r=0;r<base;r++)list=list.concat(own);for(let e=0;e<extra;e++)list.push(own[(pi-1+e)%3]);}  // 7층: 2·2·3 로테이션
  else{ // 정상 혼합
    const ownN=sl===0?W:Math.round(W*9/21);for(let r=0;r<Math.floor(ownN/3);r++)list=list.concat(own);for(let e=0;e<ownN%3;e++)list.push(own[e]);
    if(sl>0){const recent=[],earlier=[];for(let s=0;s<sl;s++)for(let i=0;i<3;i++)(s>=sl-2?recent:earlier).push(cw(country.sets[s],i));
      const oldN=W-ownN,fr=earlier.length?Math.round(oldN/2):oldN;list=list.concat(pickWeighted(recent,fr));if(earlier.length)list=list.concat(pickWeighted(earlier,oldN-fr));}
  }
  const words=arrangeNoRun(list,2).map(o=>Object.assign({isOld:o.set!==setIdx},o));
  // 변수 패턴 (단어 단위)
  let pat;
  if(pi===0)pat=words.map(()=>'clean');
  else if(!pan.top){const P=PATTERNS[country.key][sl][pi];pat=words.map((w,i)=>P[Math.round(i*(P.length-1)/Math.max(1,words.length-1))]);}
  else{const P=PATTERNS[country.key][sl][4];const cnt={};P.forEach(k=>{if(k!=='clean')cnt[k]=(cnt[k]||0)+1;});pat=words.map(()=>'clean');const idx=shuffle(words.map((w,i)=>i).filter(i=>i>=2));let q=0;Object.keys(cnt).forEach(k=>{for(let n=0;n<cnt[k]&&q<idx.length;n++)pat[idx[q++]]=k;});}
  // 처방: 지속 1단 → 15층 판 8층째 쉼터
  const plan=[];const pool=words.map(w=>w.word);let floorNo=0;
  words.forEach((o,wi)=>{
    const units=unitsOf(country,o);const v=pat[wi];
    let vFloor=units.length-1;if(country.key==='pho'){vFloor=units.length>1?1+Math.floor(Math.random()*(units.length-1)):0;}
    units.forEach((u,ui)=>{
      const vr=(ui===vFloor)?v:'clean';const isSim=vr==='sim'||vr==='both';
      let dist,distType=isSim?'sim':'dissim';
      if(u.type==='word'){if(isSim)dist=rnd(o.sims);else{const c=[...new Set(pool.filter(w=>w!==o.word&&w.length===o.word.length))];const all=c.length?c:[...new Set(pool.filter(w=>w!==o.word))];dist=all.length?rnd(all):rnd(o.sims);}}
      else if(u.type==='syl'){dist=isSim?distSylSim(u.ch):distSylClean(u.ch);}
      else dist=distJamo(u.slot,u.ch,isSim);
      let side=Math.random()<.5?0:1;const L=plan.length;if(L>=3&&plan[L-1].side===side&&plan[L-2].side===side&&plan[L-3].side===side)side=1-side;
      plan.push({word:o.word,emoji:o.emoji,isOld:o.isOld,setOf:o.set,units,ui,ch:u.ch,uType:u.type,slot:u.slot,syl:u.syl,dist,distType,side,v:vr,relaxed:false,redo:false,hint:false});
      floorNo++;
    });
  });
  if(pan.sp&&pan.sp!=='low'&&rx.eff>=1){plan[0].relaxed=true;plan[1].relaxed=true;}   // 효율 처방: 첫 2층 한 단 느리게
  if(pi>=4&&pi<=6&&rx.sus>=1){plan.splice(8,0,{rest:true});}                          // 지속 처방: 8층째 쉼터
  return plan;
}

// Preview is deliberately silent.
function initAudio(){} function beep(){} function sfx(){} function say(){}

// ===== 캔버스 =====
const FONT_STACK='"Jua","Noto Sans KR","Noto Color Emoji","Malgun Gothic","Apple SD Gothic Neo","DejaVu Sans",sans-serif';
const W=1280,H=720,CX=W/2;const STEP_H=112,STEP_DX=150,WS=0.86,CHAR_SY=536,SIGN_W=196,SIGN_H=84;
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d');let scale=1;
function resize(){const s=Math.min(innerWidth/W,innerHeight/H);scale=s;canvas.width=W*devicePixelRatio;canvas.height=H*devicePixelRatio;canvas.style.width=W*s+'px';canvas.style.height=H*s+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
addEventListener('resize',resize);resize();
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function txt(t,x,y,size,color,align){ctx.font=size+'px '+FONT_STACK;ctx.textAlign=align||'center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(t,x,y);}
function shadowOn(b,y,a){ctx.shadowColor='rgba(0,0,0,'+(a||.25)+')';ctx.shadowBlur=b;ctx.shadowOffsetY=y;}
function shadowOff(){ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;}
const hex=c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];
function lerpC(a,b,f){const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*f)).join(',')+')';}
function rgba(c,a){const A=hex(c);return 'rgba('+A.join(',')+','+a+')';}

// ===== 상태 =====
const G={phase:'title',charKind:LS.get('char',0),hat:LS.get('hat',0),mute:false,selOpen:false,t:0,ci:0,sl:0,pi:0,mapSel:-1,combo:0,plan:[],i:0};
window.G=G;
const ovClear=document.getElementById('clear');
const HATS=[{name:'없음',cost:0},{name:'빨간 모자',cost:30},{name:'왕관',cost:100},{name:'날개',cost:200}];
const toast=(text,t)=>{G.toast={text,t:t||1.8};};
const candPos=side=>({x:G.pos.x+(side?1:-1)*STEP_DX,y:G.pos.y-STEP_H});
const country=()=>COUNTRIES[G.ci], setIdx=()=>country().sets[G.sl], themeIdx=()=>country().themeOf(setIdx(),G.sl);

function resetVisual(){G.pos={x:0,y:0};G.char={x:0,y:0,groundY:0,face:1,jump:0,bump:0,bumpDir:1,land:0,motion:null,inputLock:0,lastLand:G.t};G.pendingAdvance=false;G.transitionItem=null;G.cam={x:0,y:0};G.floors=[{x:0,y:0,land:0}];G.fx=[];G.shake=0;G.flash=0;G.toast=null;G.hint=3;G.combo=0;G.maxCombo=0;}
function startPan(ci,sl,pi){
  G.ci=ci;G.sl=sl;G.pi=pi;G.rx=rxLoad(COUNTRIES[ci].key);
  const pan=PANS[pi];resetVisual();
  G.plan=buildPan(ci,sl,pi,G.rx);G.i=0;G.balloons=3;G.slides=0;G.sessionStars=0;G.redoUntil=-1;G.prevWrong=false;G.floorErr=false;G.replays=0;G.early=0;G.rest=0;
  G.wrongRun={};G.attempt=(LS.get('attempts',{})[ci+'-'+sl+'-'+pi]||0)+1;{const a=LS.get('attempts',{});a[ci+'-'+sl+'-'+pi]=G.attempt;LS.set('attempts',a);}
  G.budget=pan.sp?BUDGET[pan.sp]:0;G.timeMax=G.budget*2;G.time=G.timeMax;G.floorBorn=G.t;G.nOK=0;G.nAns=0;
  G.phase='play';ovClear.style.display='none';initAudio();
  toast(country().themes[themeIdx()]+'  '+(sl+1)+'번 산  '+panLabel(COUNTRIES[ci],pi)+(pan.top?' 🚩':''),2);
  onNewFloor();
}
function curItem(){return G.plan[G.i];}
function floorBudget(){const it=curItem();if(!it||it.rest||!G.budget)return G.budget;return it.relaxed?BUDGET[SLOWER[PANS[G.pi].sp]]:G.budget;}
function onNewFloor(){
  G.floorBorn=G.t;G.replays=0;G.early=0;const it=curItem();if(!it)return;
  if(it.rest){toast('쉼터 · 별을 주워요',1.5);return;}
  const wr=G.wrongRun[it.word]||0;if(wr>=2&&!it.hint){it.hint=true;}   // 발판(힌트)
  if(G.rx.dis>=1&&it.distType==='sim'&&!it.hint){it.hint=true;it.hintSay=true;}  // 변별 처방 1단: 혼동 층 직전 음성 1회 더 (힌트 취급)
  if(it.ui===0||it.hintSay)say(it.word);
}
function goMap(){G.phase='map';G.mapSel=-1;ovClear.style.display='none';}
function goTitle(){G.phase='title';G.selOpen=false;ovClear.style.display='none';}

// ===== 입력 =====
function climbTo(tgt,extra){
  const c=G.char,style=CHARS[G.charKind];
  const floor=Object.assign({x:tgt.x,y:tgt.y,land:0},extra||{});
  G.floors.push(floor);if(G.floors.length>14)G.floors.shift();
  G.transitionItem=curItem();G.pendingAdvance=true;
  c.motion={type:'climb',elapsed:0,duration:style.duration,from:{x:c.x,y:c.y},to:{x:tgt.x,y:tgt.y},floor,contact:false};
  c.jump=1;c.bump=0;c.land=0;G.pos=tgt;
}
function finishAscent(){
  G.pendingAdvance=false;G.transitionItem=null;
  if(G.phase!=='play')return;
  if(G.i>=G.plan.length)panClear();else onNewFloor();
}
function options(it){return it.side===0?[it.ch,it.dist]:[it.dist,it.ch];}
function bumpWeak(word,ok){const w=weak();w[word]=Math.max(0,(w[word]||0)+(ok?-.5:1));LS.set('weak',w);}
function logRow(it,side,ok,rt){
  if(G.pi===0)return;const pan=PANS[G.pi];const c=country();
  const rec={ts:Date.now(),country:c.key,set:G.sl,pan:G.pi,speed:pan.sp,len:c.lens[G.pi],attempt:G.attempt,floor:G.i+1,word:it.word,unit:it.ch,unitType:it.uType,setType:SETS[it.setOf].type,isOld:it.isOld,
    v:it.v,distType:it.distType,picked:options(it)[side],ok,rt,timeLeft:+(G.time/Math.max(.01,G.timeMax)).toFixed(2),early:G.early,afterError:G.prevWrong,replay:G.replays,combo:G.combo,
    hint:!!it.hint,relaxed:!!it.relaxed,redo:G.i<G.redoUntil,top:!!pan.top,retry:!!it.retried};
  const log=LS.get('log',[]);log.push(rec);while(log.length>8000)log.shift();LS.set('log',log);
}
function slide(reason){
  G.slides++;sfx('slide');G.shake=.5;G.flash=.4;toast(reason+' · 미끄러졌어요!',2);
  const back=Math.min(3,G.i);G.i-=back;G.redoUntil=G.i+3;
  for(let k=0;k<back;k++){if(G.floors.length>1)G.floors.pop();}
  const f=G.floors[G.floors.length-1],c=G.char;G.pos={x:f.x,y:f.y};c.jump=0;c.bump=0;
  c.motion={type:'slide',elapsed:0,duration:.42,from:{x:c.x,y:c.y},to:{x:f.x,y:f.y},floor:f,contact:false};
  G.pendingAdvance=true;G.transitionItem=curItem();
  G.time=G.timeMax;G.balloons=3;G.combo=0;G.prevWrong=false;G.floorErr=false;
  // 미끄러진 층은 새 표지판(같은 단어)으로
  for(let k=G.i;k<G.redoUntil&&k<G.plan.length;k++){const it=G.plan[k];if(it&&!it.rest){it.side=Math.random()<.5?0:1;it.retried=false;}}
}
function choose(side){
  if(G.phase!=='play'||G.pendingAdvance||G.char.motion||G.char.inputLock>0)return;initAudio();
  const it=curItem();if(!it)return;
  const tgt=candPos(side),other=candPos(1-side);G.char.face=side?1:-1;
  if(it.rest){climbTo(tgt,{star:true});G.sessionStars++;sfx('star');G.i++;return;}
  const fogOn=(it.v==='fog'||it.v==='both')&&G.t-G.floorBorn<FOG_DELAY;
  if(fogOn){G.early++;if(G.rx.inh>=1){G.time=Math.min(G.timeMax,G.time+.3);G.fx.push({x:G.pos.x,y:G.pos.y-230,vx:0,vy:-30,life:.8,text:'잠깐!',color:'#e07b2a'});}return;}
  const ok=side===it.side,rt=+(G.t-G.floorBorn).toFixed(2);
  logRow(it,side,ok,rt);bumpWeak(it.word,ok);G.nAns++;
  if(ok){
    G.nOK++;G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);G.sessionStars++;G.prevWrong=G.floorErr;G.floorErr=false;G.wrongRun[it.word]=0;sfx('step');
    if(G.budget)G.time=Math.min(G.timeMax,G.time+floorBudget());
    climbTo(tgt,{sign:options(it)[side]});
    if(G.combo>0&&G.combo%5===0){G.sessionStars+=3;G.fx.push({x:tgt.x,y:tgt.y-260,vx:0,vy:-30,life:1.1,text:G.combo+'콤보! ⭐+3',color:'#ff5a7a',big:true});sfx('combo');}
    if(it.ui===it.units.length-1&&it.uType!=='word')sfx('word');
    G.i++;
  }else{
    G.combo=0;G.floorErr=true;G.wrongRun[it.word]=(G.wrongRun[it.word]||0)+1;sfx('wrong');G.shake=.35;G.flash=.3;v13BounceWrong(it,side);
    if(G.budget&&G.rx.rec<1)G.time=Math.max(0,G.time-G.budget*.5);
    // The selected wrong sign is marked; the current floor remains active.
    if(G.rx.rec>=2&&!it.redoInserted){it.redoInserted=true;const copy=Object.assign({},it,{redoInserted:true,hint:false,side:Math.random()<.5?0:1});copy.retried=false;copy.isRedo=true;G.plan.splice(Math.min(G.plan.length,G.i+2),0,copy);}  // 회복 2단: 되돌이 계단
    if(G.balloons>0){G.balloons--;sfx('pop');popBalloon();it.retried=true;G.floorBorn=G.t;}
    else slide('풍선이 다 터졌어요');
  }
}
function panClear(){
  const pan=PANS[G.pi],acc=G.nAns?G.nOK/G.nAns:1;
  const stars=pan.top?(G.slides===0?3:G.slides===1?2:1):(G.slides===0&&acc>=.9?3:G.slides<=1&&acc>=.7?2:1);
  const p=prog();p[G.ci]=p[G.ci]||{};p[G.ci][G.sl]=p[G.ci][G.sl]||{};p[G.ci][G.sl][G.pi]=Math.max(p[G.ci][G.sl][G.pi]||0,stars);LS.set('prog',p);
  LS.set('stars',totalStars()+G.sessionStars);
  G.phase='clear';G.char.lastLand=G.t;sfx('clear');
  let note='';
  if(pan.top&&G.sl%2===1){const j=judgeBlock(G.ci,Math.floor(G.sl/2));if(j)note='';}
  document.getElementById('clTitle').textContent=pan.top?'🚩 정상!':panLabel(country(),G.pi)+' 완주!';
  document.getElementById('clStars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
  document.getElementById('clSub').textContent=(G.sl+1)+'번 산 · 정답률 '+Math.round(acc*100)+'% · 미끄러짐 '+G.slides+'회 · ⭐ '+G.sessionStars+' · 최대 '+G.maxCombo+'콤보';
  const last=G.pi===7&&G.sl===country().sets.length-1;
  document.getElementById('nextPan').style.display=last?'none':'';
  ovClear.style.display='flex';
}
function popBalloon(){const c=G.char;for(let i=0;i<10;i++)G.fx.push({x:c.x+(Math.random()-.5)*40,y:c.y-150,vx:(Math.random()-.5)*300,vy:(Math.random()-.5)*300,life:.5,dot:true,color:['#ff5a7a','#ffd166','#5be38a'][G.balloons%3]});}
document.getElementById('nextPan').addEventListener('click',()=>{if(G.pi<PANS.length-1)startPan(G.ci,G.sl,G.pi+1);else startPan(G.ci,G.sl+1,0);});
document.getElementById('toMap').addEventListener('click',goMap);

// ===== 메트릭 & 판정 =====
const corr=a=>{const x=a.filter(l=>l.ok).length/a.length;return Math.max(0,(x-.5)/.5);};
const med=a=>{if(!a.length)return null;const s=a.slice().sort((x,y)=>x-y);return s[s.length>>1];};
const r2=v=>v==null||isNaN(v)||!isFinite(v)?null:+v.toFixed(2);
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
function computeMetrics(log){
  const valid=log.filter(l=>l.pan>0&&!l.top&&!l.hint&&!l.relaxed&&!l.redo&&!l.retry);
  const clean=valid.filter(l=>l.v==='clean'&&!l.afterError);
  const m={n:valid.length,nClean:clean.length};
  const lbl=n=>n<18?'참고':n<36?'관찰':'신뢰';
  // (1) 지속: 15층 판 뒤 절반 / 앞 절반 (같은 속도), 깨끗한 행
  const sus=[];['low','mid','high'].forEach(sp=>{const q=clean.filter(l=>l.len>=10&&l.speed===sp);const half=q.length?Math.max(...q.map(l=>l.floor))/2:0;const a=q.filter(l=>l.floor<=half),b=q.filter(l=>l.floor>half);if(a.length>=4&&b.length>=4&&corr(a)>.05)sus.push(corr(b)/corr(a));});
  m.sustain={v:r2(avg(sus)),n:clean.filter(l=>l.len>=10).length};m.sustain.label=lbl(m.sustain.n);
  // (2) 효율: 상/하 (같은 길이)
  const eff=[];[[7,7],[15,10]].forEach(([L,min])=>{const lo=clean.filter(l=>(L===7?l.len<10:l.len>=10)&&l.speed==='low'),hi=clean.filter(l=>(L===7?l.len<10:l.len>=10)&&l.speed==='high');if(lo.length>=6&&hi.length>=6&&corr(lo)>.05)eff.push(corr(hi)/corr(lo));});
  m.efficiency={v:r2(avg(eff)),n:clean.filter(l=>l.speed!=='mid').length};m.efficiency.label=lbl(m.efficiency.n);
  // (3) 억제: 안개 층 중 조기입력 없이 정답
  const fog=valid.filter(l=>l.v==='fog'||l.v==='both');
  m.inhibition={v:fog.length?r2(fog.filter(l=>l.ok&&l.early===0).length/fog.length):null,n:fog.length};m.inhibition.label=lbl(fog.length);
  const okrt=valid.filter(l=>l.ok).map(l=>l.rt),rtMed=med(okrt),errs=valid.filter(l=>!l.ok);
  m.fastErrorRate=errs.length>=5&&rtMed?r2(errs.filter(l=>l.rt<rtMed*.5).length/errs.length):null;
  // (4) 변별: 혼동 층 / 깨끗한 행
  const sim=valid.filter(l=>l.v==='sim'||l.v==='both');
  m.discrimination={v:(sim.length>=6&&clean.length>=6&&corr(clean)>.05)?r2(corr(sim)/corr(clean)):null,n:sim.length,byType:{}};m.discrimination.label=lbl(sim.length);
  [...new Set(valid.map(l=>l.setType))].forEach(t=>{const s=sim.filter(l=>l.setType===t),c=clean.filter(l=>l.setType===t);if(s.length>=4&&c.length>=4&&corr(c)>.05)m.discrimination.byType[t]=r2(corr(s)/corr(c));});
  // (5) 회복: 오답 직후 / 깨끗
  const pe=valid.filter(l=>l.afterError&&l.v==='clean');
  m.recovery={v:(pe.length>=4&&clean.length>=6&&corr(clean)>.05)?r2(corr(pe)/corr(clean)):null,rtRatio:(pe.length>=4&&rtMed)?r2(med(pe.filter(l=>l.ok).map(l=>l.rt))/rtMed):null,n:pe.length};m.recovery.label=lbl(pe.length);
  // 보조
  m.baseRT=r2(med(clean.filter(l=>l.ok&&l.speed==='low').map(l=>l.rt)));m.accClean=r2(clean.length?clean.filter(l=>l.ok).length/clean.length:null);
  const top=log.filter(l=>l.top&&!l.redo&&!l.retry),old=top.filter(l=>l.isOld),own=top.filter(l=>!l.isOld);
  m.retention=(old.length>=6&&own.length>=6&&corr(own)>.05)?r2(corr(old)/corr(own)):null;
  return m;
}
function judgeBlock(ci,b){
  const key=COUNTRIES[ci].key;const log=LS.get('log',[]).filter(l=>l.country===key&&(l.set===2*b||l.set===2*b+1));
  if(log.length<20)return null;
  const m=computeMetrics(log),rxAll=LS.get('rx',{}),rx=Object.assign({},RX_DEFAULT,rxAll[key]||{}),flags=[];
  const bad=(x,n)=>x.v!=null&&x.v<.6&&x.n>=5;
  // 1단계: 기존 처방 점검
  const chk=(k,x,max)=>{if(rx[k]>0){if(x.v==null||x.n<6)return;if(x.v>=.6){rx[k]=Math.max(0,rx[k]-1);flags.push(k+'↓');}else if(rx[k]<max){rx[k]++;flags.push(k+'↑');}else flags.push(k+' 무반응');}};
  chk('eff',m.efficiency,1);chk('sus',m.sustain,2);chk('inh',m.inhibition,2);chk('dis',m.discrimination,2);chk('rec',m.recovery,2);
  // 2단계: 새 처방 1개 (효율→지속→억제→변별→회복), 읽기 계열·조절 계열 각 1개
  const reading=rx.eff>0||rx.sus>0,ctrl=rx.inh>0||rx.dis>0||rx.rec>0;let fired=false;
  if(!reading&&!fired&&bad(m.efficiency)){rx.eff=1;fired=true;flags.push('효율 발동');}
  if(!reading&&!fired&&bad(m.sustain)){rx.sus=1;fired=true;flags.push('지속 발동');}
  if(!ctrl&&!fired&&bad(m.inhibition)){rx.inh=1;fired=true;flags.push('억제 발동');}
  if(!ctrl&&!fired&&bad(m.discrimination)&&!(m.efficiency.v!=null&&m.efficiency.v<.6)){rx.dis=1;fired=true;flags.push('변별 발동');}
  if(!ctrl&&!fired&&bad(m.recovery)){rx.rec=(m.recovery.rtRatio!=null&&m.recovery.rtRatio>2)?1:2;fired=true;flags.push('회복 발동');}
  rxAll[key]=rx;LS.set('rx',rxAll);
  const prof=LS.get('profile',[]);prof.push({country:key,block:b+1,sets:[2*b+1,2*b+2],at:Date.now(),metrics:m,flags,rx});LS.set('profile',prof);
  console.log('[글림 계단] '+COUNTRIES[ci].name+' 블록 '+(b+1)+' 판정',m,flags,rx);return {m,flags,rx};
}
window.GLIM={metrics(c,a,b){const key=c||country().key;const log=LS.get('log',[]).filter(l=>l.country===key&&(a==null||(l.set>=a-1&&l.set<=(b||a)-1)));return computeMetrics(log);},profile(){return LS.get('profile',[]);},get rx(){return LS.get('rx',{});},setRx(c,o){const r=LS.get('rx',{});r[c]=Object.assign(rxLoad(c),o);LS.set('rx',r);},log(){return LS.get('log',[]);},reset(){Object.keys(previewStorage).filter(k=>k.startsWith('glim.st4.')).forEach(k=>previewStorage.removeItem(k));location.reload();},unlockAll(){const p={};COUNTRIES.forEach((c,ci)=>{p[ci]={};c.sets.forEach((s,sl)=>{p[ci][sl]={};for(let k=0;k<8;k++)p[ci][sl][k]=1;});});LS.set('prog',p);}};

// ===== 입력 바인딩 =====
addEventListener('keydown',e=>{
  if(window.GLIM_REPORT_OPEN)return;
  if(!G.assetsReady){if(G.assetError&&(e.key==='Enter'||e.key===' '))location.reload();return;}
  if(e.repeat&&(e.key==='ArrowLeft'||e.key==='ArrowRight'||e.key.toLowerCase()==='a'||e.key.toLowerCase()==='d')){e.preventDefault();return;}
  if(G.phase==='title'){if(G.selOpen){if(e.key==='Escape'||e.key==='Enter'||e.key===' '){G.selOpen=false;e.preventDefault();}return;}if(e.key==='Enter'||e.key===' '){G.phase='map';e.preventDefault();}return;}
  if(G.phase==='map'){if(e.key==='Escape')G.mapSel=-1;return;}
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){choose(0);e.preventDefault();}
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){choose(1);e.preventDefault();}
  if(e.key==='m'||e.key==='M')console.log('[글림 계단] 현재 산 메트릭',GLIM.metrics(country().key,G.sl+1));});
function toLogical(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)/scale,y:(e.clientY-r.top)/scale};}
const UI={play:{x:CX-186,y:582,w:170,h:96},char:{x:CX+16,y:582,w:170,h:96},home:{x:24,y:20,w:56,h:44},mute:{x:W-80,y:20,w:56,h:44},seg:{x:CX-240,y:512,w:480,h:48}};
const SEL={cy:210,ch:190,cw:150,gap:26,hy:430,hh:84};
const MAP={x0:90,y0:120,cw:262,ch:128,gx:16,gy:14};
const inR=(p,r)=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h;
function panRect(k){return {x:CX-316+(k%4)*158,y:220+((k/4)|0)*150,w:146,h:136};}
canvas.addEventListener('pointerdown',e=>{if(!G.assetsReady){if(G.assetError)location.reload();return;}const p=toLogical(e);initAudio();
  if(G.phase==='title'){
    if(G.selOpen){
      const layout=v8CharacterSelectionLayout();
      for(const card of layout.cards){
        if(inR(p,card)){G.charKind=card.index;G.charSelectedAt=G.t;LS.set('char',card.index);sfx('step');return;}
      }
      for(const card of layout.hats){
        if(inR(p,card)){const i=card.index;if(totalStars()>=HATS[i].cost){G.hat=i;LS.set('hat',i);sfx('star');}else sfx('wrong');return;}
      }
      if(inR(p,layout.close)||!inR(p,layout.panel))G.selOpen=false;
      return;}
    if(inR(p,UI.mute)){G.mute=!G.mute;return;}
    if(inR(p,UI.seg)){G.ci=Math.min(2,Math.floor((p.x-UI.seg.x)/(UI.seg.w/3)));G.sl=0;return;}
    if(inR(p,UI.play)){G.phase='map';return;}
    if(inR(p,UI.char)){G.selOpen=true;return;}
    return;}
  if(G.phase==='map'){
    if(inR(p,UI.home)){goTitle();return;}
    if(G.mapSel>=0){for(let k=0;k<8;k++){if(inR(p,panRect(k))){if(panUnlocked(G.ci,G.mapSel,k))startPan(G.ci,G.mapSel,k);else sfx('wrong');return;}}G.mapSel=-1;return;}
    const n=country().sets.length;
    for(let i=0;i<n;i++){const r={x:MAP.x0+(i%4)*(MAP.cw+MAP.gx),y:MAP.y0+((i/4)|0)*(MAP.ch+MAP.gy),w:MAP.cw,h:MAP.ch};if(inR(p,r)){if(setUnlocked(G.ci,i)){G.mapSel=i;sfx('step');}else sfx('wrong');return;}}
    return;}
  if(G.phase!=='play')return;
  if(inR(p,UI.home)){goMap();return;}
  if(G.pendingAdvance)return;
  if(v7ReplayHit(p)){G.replays++;const it=curItem();if(it&&!it.rest)say(it.word);return;}
  choose(p.x<CX?0:1);});

// ===== 업데이트 =====
function smoothUnit(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}
function updateMotion(dt){
  const c=G.char,m=c.motion;
  if(m){
    m.elapsed=Math.min(m.duration,m.elapsed+dt);const p=m.elapsed/m.duration;
    if(m.type==='bump'){
      // Approach the wrong stair, collide, recoil, and land back on the original stair.
      if(p<.32){const f=smoothUnit(p/.32);c.x=m.from.x+(m.impact.x-m.from.x)*f;c.y=m.from.y+(m.impact.y-m.from.y)*f;}
      else{const f=smoothUnit((p-.32)/.68);c.x=m.impact.x+(m.from.x-m.impact.x)*f;c.y=m.impact.y+(m.from.y-m.impact.y)*f-Math.sin(Math.PI*f)*16;}
      c.groundY=m.from.y;c.jump=0;
      if(p>=.32&&!m.contact){m.contact=true;G.shake=.18;G.flash=.16;}
    }else if(m.type==='slide'){
      const k=smoothUnit(p);c.x=m.from.x+(m.to.x-m.from.x)*k;
      c.y=m.from.y+(m.to.y-m.from.y)*k;c.groundY=c.y;c.jump=0;
    }else{
      // Hold the planted foot for preparation, push off, then place the lead foot on the next stair.
      const f=Math.max(0,Math.min(1,(p-.14)/.66)),k=smoothUnit(f),arc=CHARS[G.charKind].arc;
      const rise=1-Math.pow(1-f,8); // Lift the leading foot clear of the tall tread before crossing its edge.
      c.x=m.from.x+(m.to.x-m.from.x)*k;
      c.groundY=m.from.y+(m.to.y-m.from.y)*k;
      c.y=m.from.y+(m.to.y-m.from.y)*rise-Math.sin(f*Math.PI)*arc;c.jump=1-p;
      if(p>=.8&&!m.contact){m.contact=true;m.floor.land=1;c.land=1;}
    }
    if(p>=1){
      c.x=m.to.x;c.y=m.to.y;c.groundY=m.to.y;c.jump=0;c.motion=null;c.lastLand=G.t;
      if(m.type==='bump'){c.land=.55;c.inputLock=0;G.floorBorn=G.t;}
      if(m.type==='slide'){m.floor.land=1;c.land=1;}
      if(G.pendingAdvance)finishAscent();
    }
  }else{c.x=G.pos.x;c.y=G.pos.y;c.groundY=G.pos.y;}
}
function update(dt){
  G.t+=dt;G.hint=Math.max(0,G.hint-dt);const c=G.char;
  // The next item starts after landing: animation time is excluded from response time and countdown.
  if(G.phase==='play'&&!G.pendingAdvance&&!(c.motion&&c.motion.type==='bump')&&G.budget&&curItem()&&!curItem().rest){
    G.time-=dt;
    if(G.time<=0){G.time=0;slide('시간이 다 됐어요');}
    else if(G.time/G.timeMax<.25&&Math.floor(G.t*4)!==Math.floor((G.t-dt)*4))sfx('tick');
  }
  if(c.land>0)c.land=Math.max(0,c.land-dt*6);if(c.bump>0)c.bump=Math.max(0,c.bump-dt*3.8);
  c.inputLock=Math.max(0,c.inputLock-dt);
  updateMotion(dt);
  // Following the character rather than the future step keeps the planted-foot preparation stable.
  G.cam.x+=(c.x-G.cam.x)*Math.min(1,dt*8);G.cam.y+=(c.groundY-G.cam.y)*Math.min(1,dt*8);
  G.floors.forEach(f=>{if(f.land>0)f.land=Math.max(0,f.land-dt*4);});
  G.shake=Math.max(0,G.shake-dt);G.flash=Math.max(0,G.flash-dt);
  if(G.toast){G.toast.t-=dt;if(G.toast.t<=0)G.toast=null;}
  for(const f of G.fx){f.life-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.dot)f.vy+=600*dt;}
  G.fx=G.fx.filter(f=>f.life>0);
}

// ===== 렌더 =====
const sx=x=>CX+(x-G.cam.x)*WS, sy=y=>CHAR_SY+(y-G.cam.y)*WS;
function drawStep(x,y,alpha,dip){ctx.save();ctx.globalAlpha=alpha;ctx.translate(sx(x),sy(y)+dip);ctx.scale(WS,WS);shadowOn(18,12,.28);ctx.fillStyle='#8d7bd6';rr(-104,10,208,40,12);ctx.fill();shadowOff();ctx.fillStyle='#f6f2ff';rr(-104,0,208,26,12);ctx.fill();ctx.fillStyle='#e2dbff';rr(-96,16,192,8,4);ctx.fill();ctx.restore();}
function drawPost(x,y){ctx.save();ctx.translate(sx(x),sy(y));ctx.scale(WS,WS);ctx.fillStyle='#5b4a3a';rr(-5,-72,10,74,3);ctx.fill();ctx.fillStyle='#7a6450';rr(-5,-72,4,74,2);ctx.fill();ctx.restore();}
function drawSign(x,y,text,sway,hidden,glow){
  drawPost(x,y);ctx.save();ctx.translate(sx(x),sy(y));ctx.scale(WS,WS);ctx.translate(sway||0,0);
  const w=SIGN_W,h=SIGN_H,cy=-72-h/2;
  shadowOn(14,8,.22);ctx.fillStyle='#fffdf7';rr(-w/2,cy-h/2,w,h,18);ctx.fill();shadowOff();
  ctx.strokeStyle=glow?(Math.floor(G.t*6)%2?'#ffd166':'#ffb347'):'#e9e2d3';ctx.lineWidth=glow?6:3;rr(-w/2+5,cy-h/2+5,w-10,h-10,14);ctx.stroke();
  if(hidden){ctx.fillStyle='rgba(230,230,240,.95)';for(let i=-2;i<=2;i++){ctx.beginPath();ctx.arc(i*36,cy+Math.sin(G.t*4+i)*6,34,0,Math.PI*2);ctx.fill();}}
  else{const size=text.length>=3?38:text.length===2?46:54;txt(text,0,cy+3,size,'#2b2a3a');}
  ctx.restore();
}
function ell(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
/* Character art: eight transparent poses per animal, in one embedded atlas.
   Frame order: front idle / side ready / crouch / push / rise / contact / settle / happy.
   All cells share a foot anchor; a pose change moves the limbs without rotating a flat cutout. */
const STAIR_SPRITES=[{"name":"토끼","atlas":"assets/04f7ad03551e.webp","width":1024,"height":512,"cell":256,"anchorX":128,"anchorY":238,"displayHeight":132,"frames":[{"x":0,"y":0,"w":256,"h":256,"headY":-95.09,"headX":0},{"x":256,"y":0,"w":256,"h":256,"headY":-97.16,"headX":10.21},{"x":512,"y":0,"w":256,"h":256,"headY":-87.36,"headX":10.95},{"x":768,"y":0,"w":256,"h":256,"headY":-103.86,"headX":10.83},{"x":0,"y":256,"w":256,"h":256,"headY":-100.77,"headX":10.89},{"x":256,"y":256,"w":256,"h":256,"anchorY":215.84,"headY":-87.28,"headX":10.61},{"x":512,"y":256,"w":256,"h":256,"headY":-92,"headX":10.27},{"x":768,"y":256,"w":256,"h":256,"headY":-94.06,"headX":0}]},{"name":"강아지","atlas":"assets/4620dd3bc2e7.webp","width":1024,"height":512,"cell":256,"anchorX":128,"anchorY":238,"displayHeight":132,"frames":[{"x":0,"y":0,"w":256,"h":256,"headY":-95.61,"headX":0},{"x":256,"y":0,"w":256,"h":256,"headY":-97.67,"headX":9.7},{"x":512,"y":0,"w":256,"h":256,"headY":-86.33,"headX":10.55},{"x":768,"y":0,"w":256,"h":256,"headY":-103.86,"headX":9.98},{"x":0,"y":256,"w":256,"h":256,"headY":-97.67,"headX":10.38},{"x":256,"y":256,"w":256,"h":256,"anchorY":203.42,"headY":-81.39,"headX":9.76},{"x":512,"y":256,"w":256,"h":256,"headY":-93.55,"headX":10.38},{"x":768,"y":256,"w":256,"h":256,"headY":-93.55,"headX":0}]},{"name":"곰돌이","atlas":"assets/869234b93a80.webp","width":1024,"height":512,"cell":256,"anchorX":128,"anchorY":238,"displayHeight":132,"frames":[{"x":0,"y":0,"w":256,"h":256,"headY":-95.09,"headX":0},{"x":256,"y":0,"w":256,"h":256,"headY":-99.22,"headX":8.11},{"x":512,"y":0,"w":256,"h":256,"headY":-86.84,"headX":9.08},{"x":768,"y":0,"w":256,"h":256,"headY":-103.86,"headX":8.51},{"x":0,"y":256,"w":256,"h":256,"headY":-96.64,"headX":8.73},{"x":256,"y":256,"w":256,"h":256,"anchorY":216.56,"headY":-87.13,"headX":8.11},{"x":512,"y":256,"w":256,"h":256,"headY":-89.94,"headX":8},{"x":768,"y":256,"w":256,"h":256,"headY":-93.55,"headX":0}]},{"name":"삐약이","atlas":"assets/c6be48998687.webp","width":1024,"height":512,"cell":256,"anchorX":128,"anchorY":238,"displayHeight":132,"frames":[{"x":0,"y":0,"w":256,"h":256,"headY":-102.83,"headX":0},{"x":256,"y":0,"w":256,"h":256,"headY":-101.8,"headX":9.36},{"x":512,"y":0,"w":256,"h":256,"headY":-89.94,"headX":9.76},{"x":768,"y":0,"w":256,"h":256,"headY":-103.86,"headX":9.25},{"x":0,"y":256,"w":256,"h":256,"headY":-97.16,"headX":9.47},{"x":256,"y":256,"w":256,"h":256,"anchorY":202.95,"headY":-80.11,"headX":9.36},{"x":512,"y":256,"w":256,"h":256,"headY":-96.13,"headX":9.13},{"x":768,"y":256,"w":256,"h":256,"headY":-97.67,"headX":0}]},{"name":"고양이","atlas":"assets/8d10cfe12855.webp","width":1774,"height":887,"cell":443.5,"anchorX":221.75,"anchorY":412.45500000000004,"displayHeight":121.2788,"frames":[{"x":0,"y":0,"w":444,"h":444,"anchorX":233.8,"anchorY":430,"headX":0,"headY":-93.73},{"x":444,"y":0,"w":443,"h":444,"anchorX":221.29,"anchorY":432,"headX":8,"headY":-95.37},{"x":887,"y":0,"w":443,"h":444,"anchorX":255.95,"anchorY":434,"headX":8,"headY":-85.8},{"x":1330,"y":0,"w":444,"h":444,"anchorX":223.04,"anchorY":441,"headX":8,"headY":-101.93},{"x":0,"y":444,"w":444,"h":443,"anchorX":255.86,"anchorY":402,"headX":8,"headY":-98.92},{"x":444,"y":444,"w":443,"h":443,"anchorX":271.16,"anchorY":368,"headX":8,"headY":-84.16},{"x":887,"y":444,"w":443,"h":443,"anchorX":257.79,"anchorY":401,"headX":8,"headY":-87.71},{"x":1330,"y":444,"w":444,"h":443,"anchorX":229.72,"anchorY":402,"headX":0,"headY":-94.82}]},{"name":"여우","atlas":"assets/92f0c34f6351.webp","width":1774,"height":887,"cell":443.5,"anchorX":221.75,"anchorY":412.45500000000004,"displayHeight":119.2702,"frames":[{"x":0,"y":0,"w":444,"h":444,"anchorX":235.23,"anchorY":419,"headX":0,"headY":-94.73},{"x":444,"y":0,"w":443,"h":444,"anchorX":219.57,"anchorY":420,"headX":8,"headY":-96.61},{"x":887,"y":0,"w":443,"h":444,"anchorX":228.7,"anchorY":423,"headX":8,"headY":-83.97},{"x":1330,"y":0,"w":444,"h":444,"anchorX":211.97,"anchorY":423,"headX":8,"headY":-100.38},{"x":0,"y":444,"w":444,"h":443,"anchorX":231.96,"anchorY":406,"headX":8,"headY":-96.61},{"x":444,"y":444,"w":443,"h":443,"anchorX":228.55,"anchorY":379,"headX":8,"headY":-82.63},{"x":887,"y":444,"w":443,"h":443,"anchorX":235.42,"anchorY":404,"headX":8,"headY":-90.43},{"x":1330,"y":444,"w":444,"h":443,"anchorX":232.02,"anchorY":410,"headX":0,"headY":-94.73}]},{"name":"펭귄","atlas":"assets/807f399f04a7.webp","width":1774,"height":887,"cell":443.5,"anchorX":221.75,"anchorY":412.45500000000004,"displayHeight":118.046,"frames":[{"x":0,"y":0,"w":444,"h":444,"anchorX":227.42,"anchorY":436,"headX":0,"headY":-101.73},{"x":444,"y":0,"w":443,"h":444,"anchorX":212.79,"anchorY":436,"headX":8,"headY":-101.73},{"x":887,"y":0,"w":443,"h":444,"anchorX":237.62,"anchorY":439,"headX":8,"headY":-90.82},{"x":1330,"y":0,"w":444,"h":444,"anchorX":210.86,"anchorY":433,"headX":8,"headY":-101.73},{"x":0,"y":444,"w":444,"h":443,"anchorX":215.85,"anchorY":400,"headX":8,"headY":-94.81},{"x":444,"y":444,"w":443,"h":443,"anchorX":224.51,"anchorY":376,"headX":8,"headY":-85.23},{"x":887,"y":444,"w":443,"h":443,"anchorX":211.25,"anchorY":415,"headX":8,"headY":-92.68},{"x":1330,"y":444,"w":444,"h":443,"anchorX":216.17,"anchorY":416,"headX":0,"headY":-99.6}]}];
const STAIR_MOTION=[
  {name:'토끼',duration:.36,arc:34,hatY:-100},
  {name:'강아지',duration:.35,arc:24,hatY:-96},
  {name:'곰돌이',duration:.39,arc:19,hatY:-94},
  {name:'삐약이',duration:.33,arc:39,hatY:-94},
  {name:'고양이',duration:0.35,arc:30,hatY:-94},
  {name:'여우',duration:0.34,arc:32,hatY:-95},
  {name:'펭귄',duration:0.37,arc:23,hatY:-99}
];
const CHARS=STAIR_SPRITES.map((sprite,i)=>Object.assign({},STAIR_MOTION[i],sprite));
G.charKind=Math.max(0,Math.min(CHARS.length-1,Number(G.charKind)||0));
G.hat=Math.max(0,Math.min(3,Number(G.hat)||0));
const STAIR_ASSET_LOADS=STAIR_SPRITES.map((sprite,i)=>{
  const img=new Image();img.decoding='async';
  const ready=new Promise((resolve,reject)=>{
    img.onload=()=>img.naturalWidth?resolve():reject(new Error('character '+i));
    img.onerror=()=>reject(new Error('character '+i));img.src=sprite.atlas;
    if(img.complete&&img.naturalWidth)resolve();
  });return {img,ready};
});
const STAIR_IMAGES=STAIR_ASSET_LOADS.map(a=>a.img);
const STAIR_ASSETS_READY=Promise.all(STAIR_ASSET_LOADS.map(a=>a.ready));
window.GLIM_ASSETS_READY=STAIR_ASSETS_READY;
function drawHat(kind,hat,frameIndex){
  const ch=CHARS[kind],f=ch.frames[frameIndex]||ch.frames[0];
  const y=f.headY==null?ch.hatY:f.headY,x=f.headX||0;
  ctx.save();ctx.translate(x,0);
  if(hat===1){ctx.fillStyle='#e63946';rr(-22,y-12,44,22,11);ctx.fill();ell(0,y+8,24,6,'#e63946');ctx.fillStyle='#b8202c';rr(6,y+4,32,8,4);ctx.fill();ell(0,y-13,5,5,'#ffd166');}
  else if(hat===2){ctx.fillStyle='#ffd166';ctx.beginPath();ctx.moveTo(-20,y+8);ctx.lineTo(-20,y-14);ctx.lineTo(-10,y-2);ctx.lineTo(0,y-20);ctx.lineTo(10,y-2);ctx.lineTo(20,y-14);ctx.lineTo(20,y+8);ctx.closePath();ctx.fill();ell(0,y-18,4,4,'#ff5a7a');ell(-19,y-13,3,3,'#5bb8ff');ell(19,y-13,3,3,'#5bb8ff');}
  ctx.restore();
}
function drawWings(){const f=Math.sin(G.t*9)*4;ctx.globalAlpha=.92;ell(-40,-46+f,18,11,'#fff');ell(40,-46+f,18,11,'#fff');ell(-54,-38+f,12,7,'#fff');ell(54,-38+f,12,7,'#fff');ctx.globalAlpha=1;}
function drawCharacter(kind,x,y,scl,flip,squash,pose,hat){
  const ch=CHARS[kind],img=STAIR_IMAGES[kind];if(!ch||!img||!img.complete||!img.naturalWidth)return;
  const pi=Math.max(0,Math.min(ch.frames.length-1,Math.floor(pose||0))),f=ch.frames[pi];
  const unit=(ch.displayHeight||132)/(ch.cell||256),ax=f.anchorX==null?(ch.anchorX==null?128:ch.anchorX):f.anchorX,ay=f.anchorY==null?(ch.anchorY==null?238:ch.anchorY):f.anchorY;
  const sq=squash||1;
  ctx.save();ctx.translate(x,y);ctx.scale(scl*(flip||1)*sq,scl/sq);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  if(hat===3)drawWings();
  ctx.drawImage(img,f.x,f.y,f.w,f.h,-ax*unit,-ay*unit,f.w*unit,f.h*unit);
  drawHat(kind,hat||0,pi);ctx.restore();
}
function characterPose(){
  const c=G.char,m=c.motion;
  if(m){
    if(m.type==='bump'){const p=m.elapsed/m.duration;return p<.24?3:p<.6?4:6;}
    if(m.type==='slide')return m.elapsed/m.duration<.65?4:6;
    const p=m.elapsed/m.duration;
    return p<.06?1:p<.18?2:p<.34?3:p<.66?4:p<.82?5:p<.96?6:1;
  }
  if(c.bump>.55)return 2;if(c.bump>0||c.land>.3)return 6;
  if(G.phase==='clear')return 7;
  return G.t-c.lastLand<.6?1:0;
}
function drawBalloons(){const cols=['#ff5a7a','#ffd166','#5be38a'];for(let i=0;i<G.balloons;i++){const bx=(i-1)*24+Math.sin(G.t*2+i)*4,by=-150-Math.cos(G.t*1.7+i)*4;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-88);ctx.quadraticCurveTo(bx/2,by+40,bx,by+18);ctx.stroke();ell(bx,by,14,17,cols[i]);ctx.globalAlpha=.5;ell(bx-5,by-6,4,6,'#fff');ctx.globalAlpha=1;}}
function drawChar(){
  const c=G.char,m=c.motion,pose=characterPose();
  const bumpX=c.bump>0?Math.sin(c.bump*Math.PI)*c.bumpDir*24:0,bumpY=c.bump>0?-Math.sin(c.bump*Math.PI)*8:0;
  const idle=!m&&c.land===0&&c.bump===0;
  const breath=idle?Math.sin(G.t*2.8+G.charKind)*.004:0;
  const sq=c.land>0?1+Math.sin(c.land*Math.PI)*.025:1+breath;
  const lift=Math.max(0,(c.groundY||0)-c.y),shadowScale=1-Math.min(.4,lift/120);
  const floor=G.floors[G.floors.length-1],grounded=!m||m.contact;
  const treadDip=grounded&&floor?Math.sin(floor.land*Math.PI)*8:0;
  ctx.save();ctx.globalAlpha=.18-Math.min(.07,lift*.001);
  ell(sx(c.x)+bumpX,sy(c.groundY)+3+treadDip,29*WS*shadowScale,6*WS*shadowScale,'#403452');ctx.restore();
  ctx.save();ctx.translate(sx(c.x)+bumpX,sy(c.y)+bumpY+treadDip);
  if(G.combo>=10){const cols=['#ff5a7a','#ffb347','#ffd166','#5be38a','#5bb8ff','#b98cff'];ctx.globalAlpha=.65;for(let i=0;i<6;i++){ctx.strokeStyle=cols[i];ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-56*WS,62+i*4,G.t*2+i*1.05,G.t*2+i*1.05+1.1);ctx.stroke();}ctx.globalAlpha=1;}
  if(G.phase==='play'&&G.budget){ctx.save();ctx.scale(WS,WS);drawBalloons();ctx.restore();}
  drawCharacter(G.charKind,0,0,WS*1.05,c.face,sq,pose,G.hat);ctx.restore();
}
function drawPrompt(){
  const it=G.transitionItem||curItem();const y=176;
  shadowOn(20,10,.25);ctx.fillStyle='#fff';rr(CX-52,y-52,104,104,26);ctx.fill();shadowOff();
  if(!it||it.rest){txt('⭐',CX,y+4,60,'#000');return;}
  txt(it.emoji,CX,y+4,60,'#000');ctx.fillStyle='rgba(43,42,58,.08)';ctx.beginPath();ctx.arc(CX+40,y-40,13,0,Math.PI*2);ctx.fill();txt('🔊',CX+40,y-39,13,'#000');
  if(it.uType==='word')return;
  const units=it.units,groups=[];
  if(it.uType==='syl')units.forEach((u,i)=>groups.push([i]));else{let cur=-1;units.forEach((u,i)=>{if(u.syl!==cur){cur=u.syl;groups.push([]);}groups[groups.length-1].push(i);});}
  const bw=it.uType==='syl'?50:42,gap=6,ggap=18;let total=0;groups.forEach((g,gi)=>{total+=g.length*bw+(g.length-1)*gap+(gi?ggap:0);});
  let x=CX-total/2;const yy=y+92;
  groups.forEach((g,gi)=>{if(gi)x+=ggap;g.forEach((ui,k)=>{const u=units[ui];const done=ui<it.ui,cur=ui===it.ui;const cx=x+bw/2;
    if(cur){const p=1+Math.sin(G.t*6)*.05;ctx.save();ctx.translate(cx,yy);ctx.scale(p,p);ctx.translate(-cx,-yy);}
    const slotCol=u.slot===0?'#5bb8ff':u.slot===1?'#5be38a':'#ffb347';
    shadowOn(8,4,.18);ctx.fillStyle=done?'#5be38a':cur?(it.uType==='jamo'?slotCol:'#ffd166'):'#fff';rr(cx-bw/2,yy-bw/2,bw,bw,12);ctx.fill();shadowOff();
    if(!done&&!cur){ctx.strokeStyle='#e5e1f0';ctx.lineWidth=2;rr(cx-bw/2+3,yy-bw/2+3,bw-6,bw-6,9);ctx.stroke();}
    txt(done?u.ch:cur?'?':'',cx,yy+2,it.uType==='syl'?28:24,done?'#fff':'#2b2a3a');
    if(cur)ctx.restore();x+=bw+(k<g.length-1?gap:0);});});
}
function drawDecor(){const set=THEMES[themeIdx()].decor;ctx.globalAlpha=.85;for(let i=0;i<10;i++){const wx=i*263+((i*7)%3)*40,wy=-i*151;const x=(((wx-G.cam.x*.35)%W)+W)%W,y=((((wy-G.cam.y*.35)%(H+140))+H+140)%(H+140))-70;if(y<120)continue;txt(set[i%set.length],x,y,34+(i%3)*10,'#000');}ctx.globalAlpha=1;}
function drawSky(theme,prog){
  const th=THEMES[theme];const grd=ctx.createLinearGradient(0,0,0,H);for(let k=0;k<3;k++)grd.addColorStop([0,.55,1][k],lerpC(th.skyLo[k],th.skyHi[k],prog));ctx.fillStyle=grd;v7FillViewport();
  ctx.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<26;i++){const x=(i*173+G.cam.x*.05)%W,y=((i*97-G.cam.y*.05)%260+260)%260;ctx.globalAlpha=(.3+.4*Math.abs(Math.sin(G.t*1.3+i)))*prog;ctx.beginPath();ctx.arc(x,y,1.6,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  const gz=th.ground;const hill=(col,amp,base,px,py,freq)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=20){const wx=x+G.cam.x*px;ctx.lineTo(x,base-G.cam.y*py+Math.sin(wx*freq)*amp+Math.sin(wx*freq*2.7)*amp*.35);}ctx.lineTo(W,H);ctx.closePath();ctx.fill();};
  hill(rgba(gz,.35),34,440,.12,.10,.006);hill(rgba(gz,.55),46,540,.22,.16,.009);
  ctx.fillStyle='rgba(255,255,255,.75)';for(let i=0;i<6;i++){const cx=(((i*330-G.cam.x*.3+G.t*8)%(W+320))+W+320)%(W+320)-160,cy=(((i*151-G.cam.y*.3)%(H+200))+H+200)%(H+200)-100;ctx.beginPath();ctx.arc(cx,cy,24,0,Math.PI*2);ctx.arc(cx+28,cy-10,30,0,Math.PI*2);ctx.arc(cx+60,cy,22,0,Math.PI*2);ctx.fill();}
}
function render(){
  if(G.phase==='title'){drawSky(0,.2);renderTitle();return;}
  if(G.phase==='map'){drawSky(G.mapSel>=0?country().themeOf(country().sets[G.mapSel],G.mapSel):0,.3);renderMap();return;}
  const n=G.plan.length;drawSky(themeIdx(),Math.min(1,(G.pi+Math.min(1,G.i/Math.max(1,n)))/8));drawDecor();
  ctx.save();if(G.shake>0)ctx.translate((Math.random()-.5)*G.shake*22,(Math.random()-.5)*G.shake*22);
  G.floors.forEach((f,i)=>{const depth=G.floors.length-1-i,a=Math.max(.2,1-depth*.09);drawStep(f.x,f.y,a,Math.sin(f.land*Math.PI)*8);if(f.star)txt('⭐',sx(f.x),sy(f.y)-30,26,'#000');});
  const it=curItem();
  if(G.phase==='play'&&!G.pendingAdvance&&it){const ops=it.rest?['⭐','⭐']:options(it);
    for(let side=0;side<2;side++){const p=candPos(side);drawStep(p.x,p.y,1,0);
      if(it.rest){txt('⭐',sx(p.x),sy(p.y)-60*WS+Math.sin(G.t*5+side)*6,48*WS,'#000');continue;}
      const sway=it.v==='wind'?Math.sin(G.t*3+side)*10:0,hidden=(it.v==='fog'||it.v==='both')&&G.t-G.floorBorn<FOG_DELAY,glow=it.hint&&!it.hintSay&&side===it.side;
      drawSign(p.x,p.y,ops[side],sway,hidden,glow);}}
  drawChar();
  for(const f of G.fx){ctx.globalAlpha=Math.max(0,Math.min(1,f.life));
    if(f.dot){ell(sx(f.x),sy(f.y),5,5,f.color);}
    else if(f.text){ctx.save();ctx.translate(sx(f.x),sy(f.y));shadowOn(10,4,.3);ctx.fillStyle=f.color;const w=f.big?150:104;rr(-w/2,-24,w,48,24);ctx.fill();shadowOff();txt(f.text,0,2,f.big?24:26,'#fff');ctx.restore();}
    ctx.globalAlpha=1;}
  ctx.restore();
  // HUD
  const pan=PANS[G.pi];
  ctx.fillStyle='rgba(255,255,255,.18)';rr(UI.home.x,UI.home.y,UI.home.w,UI.home.h,22);ctx.fill();txt('⌂',UI.home.x+UI.home.w/2,UI.home.y+UI.home.h/2+1,26,'#fff');
  ctx.fillStyle='rgba(255,255,255,.18)';rr(UI.home.x+64,UI.home.y,290,UI.home.h,22);ctx.fill();txt(country().name+' · '+(G.sl+1)+'번 산 · '+(G.sl*8+G.pi+1)+'단계 '+panLabel(country(),G.pi),UI.home.x+64+145,UI.home.y+UI.home.h/2+1,19,'#fff');
  const shown=Math.min(G.i,n);ctx.save();shadowOn(0,3,.35);txt(String(shown),CX,48,66,'#fff');ctx.restore();txt('/ '+n+'층',CX+38+String(shown).length*16,58,22,'rgba(255,255,255,.85)');
  const bx=CX-230,by=92,bw=460,bh=16;
  if(G.budget&&it&&!it.rest){const f=G.time/G.timeMax;ctx.fillStyle='rgba(0,0,0,.28)';rr(bx,by,bw,bh,8);ctx.fill();const fw=bw*f;if(fw>0){ctx.fillStyle=f<.25?'#ff5a7a':f<.5?'#ffd166':'#5be38a';rr(bx,by,fw,bh,8);ctx.fill();ctx.fillStyle='rgba(255,255,255,.35)';rr(bx+3,by+3,Math.max(0,fw-6),5,2);ctx.fill();}txt('⏱',bx-22,by+8,18,'#fff');}
  else if(it&&it.rest)txt('시간 멈춤 · 별을 주워요',CX,by+8,20,'rgba(255,255,255,.9)');
  else txt('연습 중 · 시간 없어요',CX,by+8,20,'rgba(255,255,255,.9)');
  if(G.combo>=2){ctx.fillStyle='rgba(255,90,122,.85)';rr(CX+70,146,128,34,17);ctx.fill();txt('🔥 '+G.combo+' 콤보',CX+134,164,20,'#fff');}
  ctx.fillStyle='rgba(255,255,255,.18)';rr(W-150,20,126,44,22);ctx.fill();txt('⭐ '+G.sessionStars,W-87,43,24,'#fff');
  for(let s=0;s<8;s++){const x=W-250+s*22,y=86;ctx.fillStyle=s<G.pi?'#ffd166':s===G.pi?'#fff':'rgba(255,255,255,.3)';ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();}txt('🚩',W-250+7*22+20,86,16,'#000');
  drawPrompt();
  if(G.toast){const a=Math.min(1,G.toast.t*3);ctx.save();ctx.globalAlpha=a;shadowOn(16,8,.3);ctx.fillStyle='#fff';rr(CX-200,H-120,400,60,30);ctx.fill();shadowOff();txt(G.toast.text,CX,H-88,24,'#2b2a3a');ctx.restore();}
  if(G.hint>0&&G.phase==='play'){ctx.globalAlpha=Math.min(1,G.hint);txt('◀',CX-300,CHAR_SY-40,60,'rgba(255,255,255,.8)');txt('▶',CX+300,CHAR_SY-40,60,'rgba(255,255,255,.8)');ctx.globalAlpha=1;}
  if(G.flash>0){ctx.fillStyle='rgba(255,70,90,'+(G.flash*.7)+')';v7FillViewport();}
}
function btn(r,col,shadow){shadowOn(0,0,0);ctx.fillStyle=shadow;rr(r.x,r.y+8,r.w,r.h,22);ctx.fill();ctx.fillStyle=col;rr(r.x,r.y,r.w,r.h,22);ctx.fill();ctx.fillStyle='rgba(255,255,255,.22)';rr(r.x+8,r.y+8,r.w-16,r.h/2-8,14);ctx.fill();}
function renderTitle(){
  ctx.fillStyle='rgba(0,0,0,.18)';v7FillViewport();
  const px=CX-260,py=60,pw=520,ph=170;shadowOn(30,16,.35);ctx.fillStyle='#2b2f5c';rr(px,py,pw,ph,30);ctx.fill();shadowOff();
  ctx.strokeStyle='#ffd166';ctx.lineWidth=6;rr(px+10,py+10,pw-20,ph-20,24);ctx.stroke();ctx.fillStyle='#ffd166';rr(CX-150,py-12,300,30,15);ctx.fill();txt('G L I M',CX,py+4,18,'#2b2f5c');
  ctx.save();shadowOn(0,6,.4);txt('한글 계단',CX,py+82,78,'#fff');ctx.restore();txt('HANGUL STAIRS',CX,py+138,18,'#ffd166');
  txt('⭐ 모은 별 '+totalStars(),CX,py+ph+26,22,'rgba(255,255,255,.9)');
  const cy=468;shadowOn(18,12,.28);ctx.fillStyle='#8d7bd6';rr(CX-120,cy+10,240,40,12);ctx.fill();shadowOff();ctx.fillStyle='#f6f2ff';rr(CX-120,cy,240,26,12);ctx.fill();
  const breath=1+Math.sin(G.t*2.4)*.004;ctx.globalAlpha=.18;ell(CX,cy+2,44,9,'#403452');ctx.globalAlpha=1;drawCharacter(G.charKind,CX,cy,1.62,1,breath,G.charSelectedAt!=null&&G.t-G.charSelectedAt<.7?7:0,G.hat);
  const sg=UI.seg;ctx.fillStyle='rgba(255,255,255,.18)';rr(sg.x,sg.y,sg.w,sg.h,24);ctx.fill();
  for(let i=0;i<3;i++){const x=sg.x+i*sg.w/3;const on=i===G.ci;if(on){ctx.fillStyle='#fff';rr(x+4,sg.y+4,sg.w/3-8,sg.h-8,20);ctx.fill();}txt(COUNTRIES[i].name,x+sg.w/6,sg.y+sg.h/2+1,22,on?'#2b2a3a':'#fff');}
  const pulse=1+Math.sin(G.t*4)*.02;ctx.save();ctx.translate(UI.play.x+UI.play.w/2,UI.play.y+UI.play.h/2);ctx.scale(pulse,pulse);ctx.translate(-(UI.play.x+UI.play.w/2),-(UI.play.y+UI.play.h/2));
  btn(UI.play,'#ff8a3d','#c9621e');ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(UI.play.x+70,UI.play.y+26);ctx.lineTo(UI.play.x+112,UI.play.y+48);ctx.lineTo(UI.play.x+70,UI.play.y+70);ctx.closePath();ctx.fill();ctx.restore();
  btn(UI.char,'#8d7bd6','#5f4fa8');drawCharacter(G.charKind,UI.char.x+UI.char.w/2-26,UI.char.y+82,.6,1,1,0,G.hat);txt('캐릭터',UI.char.x+UI.char.w/2+34,UI.char.y+UI.char.h/2+1,22,'#fff');
  ctx.fillStyle='rgba(255,255,255,.18)';rr(UI.mute.x,UI.mute.y,UI.mute.w,UI.mute.h,22);ctx.fill();txt(G.mute?'🔇':'🔊',UI.mute.x+UI.mute.w/2,UI.mute.y+UI.mute.h/2+1,22,'#fff');
  if(G.selOpen){ctx.fillStyle='rgba(21,26,51,.75)';v7FillViewport();txt('캐릭터 고르기',CX,160,38,'#fff');
    const n=CHARS.length,x0=CX-(n*SEL.cw+(n-1)*SEL.gap)/2;
    for(let i=0;i<n;i++){const x=x0+i*(SEL.cw+SEL.gap),y=SEL.cy;const on=i===G.charKind;shadowOn(16,8,.3);ctx.fillStyle=on?'#fff':'rgba(255,255,255,.85)';rr(x,y,SEL.cw,SEL.ch,24);ctx.fill();shadowOff();if(on){ctx.strokeStyle='#ff8a3d';ctx.lineWidth=5;rr(x+4,y+4,SEL.cw-8,SEL.ch-8,20);ctx.stroke();}drawCharacter(i,x+SEL.cw/2,y+140,1.02,1,1+Math.sin(G.t*2.4+i)*.004,on&&G.charSelectedAt!=null&&G.t-G.charSelectedAt<.7?7:0,G.hat);txt(CHARS[i].name,x+SEL.cw/2,y+168,20,'#2b2a3a');}
    txt('꾸미기  (별을 모으면 열려요)',CX,SEL.hy-22,22,'rgba(255,255,255,.9)');const st=totalStars();
    for(let i=0;i<HATS.length;i++){const x=x0+i*(SEL.cw+SEL.gap),y=SEL.hy;const on=i===G.hat,open=st>=HATS[i].cost;shadowOn(12,6,.3);ctx.fillStyle=on?'#fff':open?'rgba(255,255,255,.85)':'rgba(255,255,255,.35)';rr(x,y,SEL.cw,SEL.hh,20);ctx.fill();shadowOff();if(on){ctx.strokeStyle='#ff8a3d';ctx.lineWidth=4;rr(x+3,y+3,SEL.cw-6,SEL.hh-6,17);ctx.stroke();}txt(HATS[i].name,x+SEL.cw/2,y+28,20,open?'#2b2a3a':'#6a6880');txt(open?(i===0?'—':'열림'):'🔒 ⭐'+HATS[i].cost,x+SEL.cw/2,y+58,18,open?'#5f4fa8':'#6a6880');}}
}
function renderMap(){
  const c=country();ctx.fillStyle='rgba(0,0,0,.2)';v7FillViewport();
  ctx.fillStyle='rgba(255,255,255,.18)';rr(UI.home.x,UI.home.y,UI.home.w,UI.home.h,22);ctx.fill();txt('⌂',UI.home.x+UI.home.w/2,UI.home.y+UI.home.h/2+1,26,'#fff');
  ctx.save();shadowOn(0,4,.35);txt(c.name+' · 어느 산을 오를까요?',CX,58,38,'#fff');ctx.restore();txt('⭐ '+totalStars(),W-87,43,24,'#fff');
  c.sets.forEach((setIdx,i)=>{const x=MAP.x0+(i%4)*(MAP.cw+MAP.gx),y=MAP.y0+((i/4)|0)*(MAP.ch+MAP.gy);const s=SETS[setIdx],ti=c.themeOf(setIdx,i),th=THEMES[ti],un=setUnlocked(G.ci,i),done=setCleared(G.ci,i);
    shadowOn(14,8,.25);ctx.fillStyle=un?'#fff':'rgba(255,255,255,.45)';rr(x,y,MAP.cw,MAP.ch,22);ctx.fill();shadowOff();
    ctx.fillStyle=un?th.card:'#b9b7c9';rr(x,y,64,MAP.ch,22);ctx.fill();ctx.fillRect(x+40,y,24,MAP.ch);txt(String(i+1),x+32,y+46,40,'#fff');txt(th.emoji,x+32,y+94,26,'#000');
    if(un){txt(s.words.map(w=>w[1]).join(' '),x+160,y+38,32,'#000');txt(s.words.map(w=>w[0]).join(' · '),x+160,y+74,21,'#2b2a3a');
      let done8=0;for(let k=0;k<8;k++)if(starsOf(G.ci,i,k)>0)done8++;txt(c.themes[ti]+' · '+done8+'/8 단계'+(done?'  🚩':''),x+160,y+106,17,'#8a879c');}
    else txt('🔒',x+160,y+64,40,'#000');});
  if(G.mapSel>=0){const i=G.mapSel,setIdx=c.sets[i],s=SETS[setIdx],ti=c.themeOf(setIdx,i);
    ctx.fillStyle='rgba(21,26,51,.78)';v7FillViewport();
    txt(THEMES[ti].emoji+' '+(i+1)+'번 산  ·  '+s.words.map(w=>w[1]+w[0]).join('  '),CX,120,32,'#fff');txt(s.type+'  ·  '+c.themes[ti]+'  ·  '+(i*8+1)+'~'+(i*8+8)+'단계',CX,162,19,'rgba(255,255,255,.8)');
    for(let k=0;k<8;k++){const r=panRect(k),un=panUnlocked(G.ci,i,k),st=starsOf(G.ci,i,k),P=PANS[k],L=c.lens[k];
      shadowOn(16,8,.3);ctx.fillStyle=un?'#fff':'rgba(255,255,255,.35)';rr(r.x,r.y,r.w,r.h,20);ctx.fill();shadowOff();
      txt(k===0?'⛺':k===7?'🚩':k<4?'🥾':'🧗',r.x+r.w/2,r.y+32,30,'#000');txt((i*8+k+1)+'단계',r.x+r.w/2,r.y+62,15,'#8a879c');
      txt(panLabel(c,k),r.x+r.w/2,r.y+84,20,un?'#2b2a3a':'#6a6880');
      txt(P.sp?(L+(c.key==='word'?'층':'단어')+' · ⏱ '+(P.sp==='low'?'느림':P.sp==='mid'?'보통':'빠름')):(L+'층 · 연습'),r.x+r.w/2,r.y+106,13,un?'#5f4fa8':'#6a6880');
      txt(un?('★'.repeat(st)+'☆'.repeat(3-st)):'🔒',r.x+r.w/2,r.y+124,18,un?'#ffb347':'#6a6880');}
    txt('단계를 누르면 시작해요',CX,540,20,'rgba(255,255,255,.8)');}
}
let last=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;if(G.phase==='play'||G.phase==='clear')update(dt);else G.t+=dt;render();}
function renderLoading(failed){
  shadowOff();ctx.fillStyle='#e9e4fb';v7FillViewport();
  ctx.fillStyle='#fff';rr(CX-270,H/2-85,540,170,28);ctx.fill();
  txt(failed?'캐릭터를 불러오지 못했어요':'캐릭터를 불러오고 있어요…',CX,H/2-12,28,'#594b78');
  txt(failed?'화면을 누르면 다시 열어요':'잠깐만 기다려 주세요',CX,H/2+32,19,'#8a7b9e');
}
/* Nine quiet storybook landscapes. UI text and answer signs remain live Canvas elements. */
const V6_SCENES=[{"key":"meadow","name":"초원","src":"assets/e713e4925ac4.webp"},{"key":"forest","name":"숲","src":"assets/adb2bd1cf318.webp"},{"key":"snow","name":"설원","src":"assets/d4acbd96b853.webp"},{"key":"beach","name":"해변","src":"assets/f7ad97d06be2.webp"},{"key":"jungle","name":"정글","src":"assets/ed962b8c5734.webp"},{"key":"volcano","name":"화산","src":"assets/4caf456badaa.webp"},{"key":"stone_tower","name":"돌탑","src":"assets/da55d226890b.webp"},{"key":"ice_tower","name":"얼음탑","src":"assets/b933ec0d97e2.webp"},{"key":"fire_tower","name":"불꽃탑","src":"assets/64b12f845176.webp"}];
const V6_SCENE_IMAGES=V6_SCENES.map(scene=>{
  const image=new Image();
  const ready=new Promise((resolve,reject)=>{image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Scene: '+scene.key));});
  image.src=scene.src;
  return {image,ready};
});
const V6_BACKGROUNDS_READY=Promise.all(V6_SCENE_IMAGES.map(entry=>entry.ready));
const V6_FONT_READY=document.fonts&&document.fonts.load
  ?Promise.all([document.fonts.load('28px Jua'),document.fonts.load('28px "Noto Sans KR"'),document.fonts.load('28px "Noto Color Emoji"')]).catch(()=>[])
  :Promise.resolve();
window.GLIM_ASSETS_READY=Promise.all([STAIR_ASSETS_READY,V6_BACKGROUNDS_READY,V6_FONT_READY]);
function v6WorldIndex(theme){return G.phase==='title'?0:Math.max(0,Math.min(8,G.ci*3+theme));}
function drawSky(theme,prog){
  const index=v6WorldIndex(theme),img=V6_SCENE_IMAGES[index].image;
  ctx.save();shadowOff();ctx.globalAlpha=1;
  const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;
  if(iw&&ih){
    const zoom=Math.max(W/iw,H/ih)*1.055,dw=iw*zoom,dh=ih*zoom;
    const playing=G.phase==='play'||G.phase==='clear';
    const shiftX=playing?-Math.tanh((G.cam?G.cam.x:0)/1100)*14:0;
    const shiftY=playing?(Math.max(0,Math.min(1,prog))-.5)*18:0;
    ctx.drawImage(img,(W-dw)/2+shiftX,(H-dh)/2+shiftY,dw,dh);
  }else{ctx.fillStyle='#f1eddf';v7FillViewport();}
  if(G.phase==='play'||G.phase==='clear'){
    const wash=ctx.createLinearGradient(0,0,0,150);
    wash.addColorStop(0,'rgba(255,250,237,.40)');wash.addColorStop(1,'rgba(255,250,237,0)');
    ctx.fillStyle=wash;ctx.fillRect(0,0,W,150);
  }
  ctx.restore();
}
function drawDecor(){
  const index=v6WorldIndex(themeIdx()),snow=index===2,sea=index===5;
  ctx.save();shadowOff();
  // Sparse movement stays in the margins, leaving the reading and landing area quiet.
  for(let i=0;i<7;i++){
    const left=i%2===0,x=(left?63:W-76)+Math.sin(G.t*.26+i*2.8)*25;
    const y=145+((i*83+G.t*(snow?13:7))%505);
    ctx.globalAlpha=snow?.58:.26;
    if(snow||sea)ell(x,y,snow?2.6:2,snow?2.6:1.2,snow?'#fffdf8':'#fff8d5');
    else{
      ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(G.t*.4+i)*.7+i);
      ctx.fillStyle=index===8?'#c8b3c9':index===3?'#d4bb80':'#a5b483';
      ctx.beginPath();ctx.ellipse(0,0,2.3,5.3,0,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }
  ctx.restore();
}

/* v6 presentation layer. The existing progression, input routing and sprite art are reused. */
Object.assign(UI,{
  play:{x:430,y:602,w:276,h:74},
  char:{x:724,y:602,w:170,h:74},
  home:{x:28,y:24,w:74,h:46},
  mute:{x:1178,y:24,w:74,h:46},
  seg:{x:340,y:527,w:600,h:52}
});
Object.assign(SEL,{cy:202,ch:236,cw:180,gap:22,hy:496,hh:76});
Object.assign(MAP,{x0:92,y0:164,cw:260,ch:110,gx:18,gy:20});
function panRect(k){return {x:254+(k%4)*198,y:226+((k/4)|0)*169,w:182,h:151};}

const v6sC={ink:'#6f5546',muted:'#8d7c68',paper:'#fff9eb',line:'#dccdb4',sage:'#769d7b',sageDeep:'#4d7157',rose:'#dca49b',butter:'#efd78b'};
const v6sAccents=[['#86a889','#6f957d','#91b4c5'],['#d6b77f','#bc9985','#81aead'],['#a7aa91','#b5a087','#a2a9c8']];
function v6sBox(x,y,w,h,r,fill,line,depth){
  ctx.save();
  if(depth){ctx.shadowColor='rgba(94,72,46,.09)';ctx.shadowBlur=12;ctx.shadowOffsetY=depth;}
  ctx.fillStyle=fill;rr(x,y,w,h,r);ctx.fill();shadowOff();
  if(line){ctx.strokeStyle=line;ctx.lineWidth=1.5;rr(x,y,w,h,r);ctx.stroke();}
  ctx.restore();
}
function v6sFit(t,x,y,size,color,maxWidth,align){
  while(size>13){ctx.font=size+'px '+FONT_STACK;if(ctx.measureText(t).width<=maxWidth)break;size--;}
  txt(t,x,y,size,color,align);
}
function v6sLine(points,color,width,dash){
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';
  if(dash)ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();
}
function v6sCheck(x,y,size,color){v6sLine([[x-size*.44,y],[x-size*.10,y+size*.30],[x+size*.46,y-size*.35]],color,Math.max(2.5,size*.17));}
function v6sLock(x,y,color,scale){
  ctx.save();ctx.translate(x,y);ctx.scale(scale||1,scale||1);ctx.lineWidth=2.4;ctx.strokeStyle=color;
  ctx.beginPath();ctx.arc(0,-3,5.5,Math.PI,0);ctx.stroke();
  v6sBox(-8,-3,16,13,4,color);ell(0,2,1.3,1.8,'#fff9eb');ctx.restore();
}
function v6sStar(x,y,r,color){
  ctx.save();ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,d=i%2?r*.47:r;const px=x+Math.cos(a)*d,py=y+Math.sin(a)*d;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.restore();
}
function v6sHomeButton(r){
  v6sBox(r.x,r.y,r.w,r.h,17,'#fff9ed','#d9cfb9',2);
  const x=r.x+24,y=r.y+24;v6sLine([[x-9,y-2],[x,y-10],[x+9,y-2]],v6sC.ink,2.3);
  v6sLine([[x-6,y-2],[x-6,y+7],[x+6,y+7],[x+6,y-2]],v6sC.ink,2.2);
  txt('홈',r.x+53,y,17,v6sC.ink);
}
function v6sSoundButton(){
  const r=UI.mute;v6sBox(r.x,r.y,r.w,r.h,17,'#fff9ed','#d9cfb9',2);
  const x=r.x+25,y=r.y+24;ctx.save();ctx.strokeStyle=v6sC.ink;ctx.fillStyle=v6sC.ink;ctx.lineWidth=2;ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(x-9,y-4);ctx.lineTo(x-5,y-4);ctx.lineTo(x+1,y-9);ctx.lineTo(x+1,y+9);ctx.lineTo(x-5,y+4);ctx.lineTo(x-9,y+4);ctx.closePath();ctx.stroke();
  if(G.mute){v6sLine([[x+6,y-4],[x+13,y+4]],v6sC.ink,2);v6sLine([[x+6,y+4],[x+13,y-4]],v6sC.ink,2);}else{ctx.beginPath();ctx.arc(x+1,y,7,-.65,.65);ctx.stroke();ctx.beginPath();ctx.arc(x+1,y,12,-.65,.65);ctx.stroke();}ctx.restore();
  txt(G.mute?'끔':'켬',r.x+55,y,15,v6sC.ink);
}
function v6sClose(x,y){
  v6sBox(x-20,y-20,40,40,15,'#f0e9d9','#daccb5');
  v6sLine([[x-5,y-5],[x+5,y+5]],v6sC.ink,2.2);v6sLine([[x+5,y-5],[x-5,y+5]],v6sC.ink,2.2);
}
function v6sFlag(x,y,color,s){
  ctx.save();ctx.translate(x,y);ctx.scale(s||1,s||1);v6sLine([[0,15],[0,-18]],v6sC.ink,2.4);
  ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(1,-18);ctx.quadraticCurveTo(13,-23,24,-16);ctx.lineTo(24,-2);ctx.quadraticCurveTo(12,-9,1,-3);ctx.closePath();ctx.fill();ctx.restore();
}
function v6sMountain(x,y,scale,color,kind){
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-39,19);ctx.quadraticCurveTo(-27,-10,-15,-24);ctx.quadraticCurveTo(-9,-29,-4,-19);ctx.lineTo(10,3);ctx.quadraticCurveTo(20,-15,27,-2);ctx.lineTo(40,20);ctx.closePath();ctx.fill();
  if(kind===2){ctx.fillStyle='#fffaf0';ctx.beginPath();ctx.moveTo(-23,-12);ctx.lineTo(-15,-24);ctx.quadraticCurveTo(-9,-29,-4,-19);ctx.lineTo(1,-10);ctx.lineTo(-7,-13);ctx.lineTo(-12,-8);ctx.lineTo(-16,-15);ctx.closePath();ctx.fill();}
  else {v6sLine([[-17,18],[-9,9],[-13,2],[-6,-5]],'rgba(255,249,235,.75)',3);}
  ctx.restore();
}
function v6sFlower(x,y,s,color){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);v6sLine([[0,13],[0,0]],'#93ac78',1.6);
  for(let i=0;i<5;i++){const a=i*Math.PI*.4;ell(Math.cos(a)*4,Math.sin(a)*4,3.3,3.3,color);}
  ell(0,0,2.1,2.1,'#dcb879');ctx.restore();
}
function v6sIsland(x,y,w,h,grass){
  ctx.save();ell(x,y+10,w*.50,h*.72,'rgba(106,97,72,.08)');
  ctx.fillStyle='#d8c6a5';ctx.beginPath();ctx.moveTo(x-w*.49,y);ctx.bezierCurveTo(x-w*.43,y+h,x+w*.35,y+h*1.18,x+w*.49,y);ctx.closePath();ctx.fill();
  ell(x,y,w*.50,h*.38,grass||'#bbcc94');
  v6sLine([[x-w*.34,y+h*.48],[x-w*.28,y+h*.52]],'#b7a584',2);
  v6sLine([[x+w*.22,y+h*.51],[x+w*.29,y+h*.42]],'#b7a584',2);
  ctx.restore();
}
function v6sStone(x,y,w,h){
  v6sBox(x-w/2,y,w,h,9,'#d1bea1','#bfa98a',3);
  v6sBox(x-w/2,y-5,w,14,8,'#f7ebcf','#d8c3a0');
  v6sLine([[x-w*.28,y+h*.45],[x-w*.13,y+h*.45]],'#bca382',1.5);
}
function renderTitle(){
  ctx.save();shadowOff();
  const wash=ctx.createLinearGradient(0,0,0,450);wash.addColorStop(0,'rgba(255,249,235,.80)');wash.addColorStop(1,'rgba(255,249,235,0)');ctx.fillStyle=wash;ctx.fillRect(0,0,W,450);
  v6sBox(34,25,90,38,16,'rgba(255,250,239,.86)','#dfd2bb');txt('글림',79,45,23,v6sC.ink);
  v6sSoundButton();
  txt('한글 계단',CX,137,83,v6sC.ink);
  txt('한 칸씩, 함께 올라요',CX,203,27,'#887761');
  // A small traversable-looking island puts the actual game characters at the center.
  v6sIsland(CX,477,572,51,'#bed29f');
  v6sIsland(401,488,112,23,'#c7d8ac');v6sIsland(918,490,112,23,'#c7d8ac');
  v6sStone(491,466,106,31);v6sStone(538,440,101,42);v6sStone(599,414,103,59);
  // Back steps continue beyond the hero and suggest the first ascent.
  v6sStone(732,432,95,54);v6sStone(792,406,92,45);v6sStone(850,380,87,42);
  v6sFlag(865,351,v6sC.rose,.78);
  const companions=Array.from({length:Math.min(3,CHARS.length-1)},(_,i)=>(G.charKind+i+1)%CHARS.length);
  const poses=[{x:400,y:483,s:.78,dir:1},{x:798,y:402,s:.72,dir:-1},{x:918,y:486,s:.72,dir:-1}];
  companions.forEach((kind,i)=>{const p=poses[i];ell(p.x,p.y+1,22*p.s,4*p.s,'rgba(105,88,64,.12)');drawCharacter(kind,p.x,p.y,p.s,p.dir,1+Math.sin(G.t*2.1+i)*.003,0,0);});
  v6sFlower(450,487,.86,'#f1c4b2');v6sFlower(877,487,.70,'#fff9e9');v6sFlower(987,514,.70,'#f3e4a6');
  v6sIsland(CX,469,171,22,'#c3d59b');
  const breath=1+Math.sin(G.t*2.4)*.004;ell(CX,465,40,6,'rgba(112,88,60,.12)');
  drawCharacter(G.charKind,CX,464,1.58,1,breath,G.charSelectedAt!=null&&G.t-G.charSelectedAt<.7?7:0,G.hat);
  const sg=UI.seg;v6sBox(sg.x,sg.y,sg.w,sg.h,22,'#f0ead7','#d8cdb2',2);
  for(let i=0;i<3;i++){
    const x=sg.x+i*sg.w/3,on=i===G.ci;
    if(on)v6sBox(x+4,sg.y+4,sg.w/3-8,sg.h-8,18,'#fffaf0','#d2b98f');
    txt(COUNTRIES[i].name,x+sg.w/6,sg.y+sg.h/2+1,25,on?v6sC.ink:'#9b8d73');
  }
  const p=UI.play;v6sBox(p.x,p.y+5,p.w,p.h,22,'#64896a');v6sBox(p.x,p.y,p.w,p.h,22,'#84aa80','#6c936d');
  txt('계단 오르기',p.x+p.w/2-15,p.y+p.h/2,30,'#fffbee');
  v6sLine([[p.x+p.w-40,p.y+30],[p.x+p.w-32,p.y+37],[p.x+p.w-40,p.y+44]],'#fffbee',3);
  const ch=UI.char;v6sBox(ch.x,ch.y+4,ch.w,ch.h,22,'#cdb79b');v6sBox(ch.x,ch.y,ch.w,ch.h,22,'#fff5df','#d8c1a0');
  txt('친구 고르기',ch.x+ch.w/2,ch.y+ch.h/2,24,v6sC.ink);
  // Saved stars remain available without competing with the primary action.
  v6sBox(28,661,94,39,15,'rgba(255,249,235,.95)','#d9cbb1');v6sStar(50,681,9,'#d8b461');v6sFit(String(totalStars()),81,682,20,'#807056',46);
  ctx.restore();
  if(G.selOpen)v6sRenderSelection();
}
/* Character picker: one shared responsive layout drives painting and hit targets. */
function v8CharacterSelectionLayout(){
  const v=typeof V7_VIEW==='object'?V7_VIEW:{left:0,top:0,width:W,height:H,portrait:false};
  const portrait=!!v.portrait,cols=portrait?(v.height/v.width>=1.60?2:3):4;
  const rows=Math.max(1,Math.ceil(CHARS.length/cols)),gap=portrait?22:18;
  const panelW=portrait?Math.min(1160,v.width-64):1040,pad=portrait?48:52;
  const headerH=portrait?142:108,footerH=portrait?68:40;
  const hatCols=portrait&&cols===2?2:4,hatRows=Math.ceil(HATS.length/hatCols);
  const hatGap=portrait?18:16,hatH=portrait?(hatCols===2?104:88):70,hatLabelH=portrait?58:38;
  const hatAreaH=hatLabelH+hatRows*hatH+(hatRows-1)*hatGap;
  const targetCardH=portrait?(cols===2?420:350):(rows===1?236:184);
  const maxPanelH=portrait?v.height-72:Math.min(v.height-56,664);
  const cardH=Math.min(targetCardH,(maxPanelH-headerH-footerH-hatAreaH-(rows-1)*gap)/rows);
  const gridH=rows*cardH+(rows-1)*gap,panelH=headerH+gridH+hatAreaH+footerH;
  const panel={x:CX-panelW/2,y:v.top+(v.height-panelH)/2,w:panelW,h:panelH};
  const cardW=(panelW-pad*2-(cols-1)*gap)/cols,cards=[];
  for(let i=0;i<CHARS.length;i++){
    const row=Math.floor(i/cols),count=Math.min(cols,CHARS.length-row*cols);
    const rowW=count*cardW+(count-1)*gap;
    cards.push({index:i,x:CX-rowW/2+(i%cols)*(cardW+gap),y:panel.y+headerH+row*(cardH+gap),w:cardW,h:cardH});
  }
  const hatLabelY=panel.y+headerH+gridH+(portrait?30:23);
  const hatsY=panel.y+headerH+gridH+hatLabelH;
  const hatW=(panelW-pad*2-(hatCols-1)*hatGap)/hatCols,hats=[];
  for(let i=0;i<HATS.length;i++)hats.push({index:i,x:panel.x+pad+(i%hatCols)*(hatW+hatGap),y:hatsY+Math.floor(i/hatCols)*(hatH+hatGap),w:hatW,h:hatH});
  const closeSize=portrait?70:46,titleY=panel.y+(portrait?72:55);
  const close={x:panel.x+panel.w-(portrait?104:77),y:titleY-closeSize/2,w:closeSize,h:closeSize};
  return {portrait,cols,panel,cards,hats,close,titleY,hatLabelY,footerY:panel.y+panelH-footerH/2,font:portrait?(cols===2?47:38):25};
}
function v6sRenderSelection(){
  const layout=v8CharacterSelectionLayout(),p=layout.panel,portrait=layout.portrait;
  const fills=['#f3ecd7','#ecdfcf','#ead5bc','#f5e8b0','#e5eadd','#f5dec8','#e2ebef'];
  ctx.save();ctx.fillStyle='rgba(72,68,52,.49)';v7FillViewport();
  v6sBox(p.x,p.y,p.w,p.h,portrait?40:30,v6sC.paper,'#d0bda1',10);
  txt('함께 올라갈 친구',CX,layout.titleY,portrait?53:34,v6sC.ink);
  const close=layout.close;
  v6sBox(close.x,close.y,close.w,close.h,portrait?22:16,'#f0e9d9','#daccb5');
  const cx=close.x+close.w/2,cy=close.y+close.h/2,arm=close.w*.14;
  v6sLine([[cx-arm,cy-arm],[cx+arm,cy+arm]],v6sC.ink,portrait?4:2.5);
  v6sLine([[cx+arm,cy-arm],[cx-arm,cy+arm]],v6sC.ink,portrait?4:2.5);
  for(const card of layout.cards){
    const i=card.index,on=i===G.charKind,x=card.x,y=card.y,w=card.w,h=card.h;
    v6sBox(x,y,w,h,portrait?28:22,on?'#fffdf5':'#f2eadb',on?'#7b9e77':'#dfd1b9',on?4:1);
    if(on){ctx.save();ctx.strokeStyle='#80a279';ctx.lineWidth=portrait?4:3;rr(x+2,y+2,w-4,h-4,portrait?26:20);ctx.stroke();ctx.restore();}
    const footY=y+h*.755,spriteScale=Math.min((h*.69)/132,(w*.82)/132);
    ell(x+w/2,y+h*.49,Math.min(w*.34,h*.29),h*.21,fills[i%fills.length]);
    ell(x+w/2,footY+2,Math.min(w*.23,h*.22),Math.max(4,h*.025),'rgba(104,85,56,.10)');
    drawCharacter(i,x+w/2,footY,spriteScale,1,1+Math.sin(G.t*2.4+i)*.004,on&&G.charSelectedAt!=null&&G.t-G.charSelectedAt<.7?7:0,G.hat);
    v6sFit(CHARS[i].name,x+w/2,y+h*.895,layout.font,v6sC.ink,w-24);
    if(on){const radius=portrait?19:12;ell(x+w-radius-14,y+radius+13,radius,radius,'#83a77d');v6sCheck(x+w-radius-14,y+radius+13,radius,'#fff9eb');}
  }
  txt('작은 꾸미기',layout.hats[0].x,layout.hatLabelY,portrait?34:21,v6sC.ink,'left');
  const starX=p.x+p.w-(portrait?176:125);
  v6sStar(starX,layout.hatLabelY,portrait?15:9,'#d7b266');
  txt(String(totalStars()),starX+(portrait?27:17),layout.hatLabelY+1,portrait?31:18,v6sC.muted,'left');
  for(const card of layout.hats){
    const i=card.index,x=card.x,y=card.y,w=card.w,h=card.h,on=i===G.hat,open=totalStars()>=HATS[i].cost;
    v6sBox(x,y,w,h,portrait?23:17,on?'#e7edda':'#f3ecdf',on?'#8ba782':'#ded0b7');
    const titleSize=portrait?34:21,subSize=portrait?26:16;
    v6sFit(i===0?'그대로':HATS[i].name,x+w/2,y+h*.33,titleSize,open?v6sC.ink:'#a39887',w-22);
    if(open){if(on)v6sCheck(x+w/2-(portrait?31:22),y+h*.73,portrait?14:10,'#65815f');txt(on?'선택':'열림',x+w/2+(on?(portrait?8:6):0),y+h*.74,subSize,on?'#64815f':'#a18a69');}
    else {v6sLock(x+w/2-(portrait?42:29),y+h*.69,'#a59881',portrait?.88:.64);v6sStar(x+w/2-(portrait?14:10),y+h*.73,portrait?9:6,'#c3ae81');txt(String(HATS[i].cost),x+w/2+(portrait?22:15),y+h*.74,subSize,'#9a886b');}
  }
  txt('친구를 누르면 바로 바뀌어요',CX,layout.footerY,portrait?31:19,'#95836b');ctx.restore();
}

function renderMap(){
  const c=country();ctx.save();shadowOff();
  ctx.fillStyle='rgba(255,249,235,.66)';v7FillViewport();
  v6sHomeButton(UI.home);txt(c.name,CX,57,37,v6sC.ink);txt('어느 산을 오를까요?',CX,109,23,'#8a7b63');
  v6sIsland(211,137,124,16,'#c8d6ad');drawCharacter(G.charKind,211,133,.68,1,1+Math.sin(G.t*2.4)*.004,0,G.hat);
  v6sBox(1103,25,148,43,17,'#fff9eb','#d9cbb1');v6sStar(1129,46,10,'#d3ad58');txt(String(totalStars()),1194,47,23,'#897350');
  // A single dashed route follows the same row-major progression as the original hitboxes.
  ctx.save();ctx.strokeStyle='#d1c3a4';ctx.lineWidth=3;ctx.setLineDash([3,8]);ctx.lineCap='round';ctx.beginPath();
  c.sets.forEach((_,i)=>{
    const x=MAP.x0+(i%4)*(MAP.cw+MAP.gx)+MAP.cw/2,y=MAP.y0+((i/4)|0)*(MAP.ch+MAP.gy)+MAP.ch/2;
    if(!i)ctx.moveTo(x,y);
    else if(i%4){ctx.lineTo(x,y);}
    else{const py=y-MAP.ch-MAP.gy,gapy=py+MAP.ch/2+MAP.gy/2;ctx.lineTo(W-61,py);ctx.quadraticCurveTo(W-47,py,W-47,gapy);ctx.lineTo(61,gapy);ctx.quadraticCurveTo(48,gapy,48,y);ctx.lineTo(x,y);}
  });ctx.stroke();ctx.restore();
  c.sets.forEach((setIdx,i)=>{
    const x=MAP.x0+(i%4)*(MAP.cw+MAP.gx),y=MAP.y0+((i/4)|0)*(MAP.ch+MAP.gy),s=SETS[setIdx],ti=c.themeOf(setIdx,i),accent=v6sAccents[G.ci][ti];
    const un=setUnlocked(G.ci,i),done=setCleared(G.ci,i);let finished=0;for(let k=0;k<8;k++)if(starsOf(G.ci,i,k)>0)finished++;
    v6sBox(x,y,MAP.cw,MAP.ch,21,un?'#fffaf0':'#efeee1',un?'#d0bea0':'#d7d3be',un?4:1);
    const numColor=un?accent:'#c3c6ad';ell(x+30,y+31,20,20,numColor);txt(String(i+1),x+30,y+32,25,un?'#fffaf0':'#f6f3e8');
    txt(c.themes[ti],x+60,y+29,18,un?'#7c765d':'#a8a794','left');
    if(done){ell(x+MAP.cw-25,y+27,12,12,'#e4edcf');v6sCheck(x+MAP.cw-25,y+27,12,'#749065');}
    else if(!un)v6sLock(x+MAP.cw-26,y+25,'#aaa991',.74);
    if(un){
      v6sFit(s.words.map(w=>w[0]).join('   '),x+MAP.cw/2,y+61,25,v6sC.ink,MAP.cw-24);
      for(let k=0;k<8;k++){v6sBox(x+25+k*18,y+86,12,6,3,k<finished?accent:'#e6decd');}
      txt(finished+'/8',x+MAP.cw-31,y+88,17,'#9a8769');
    }else{
      v6sMountain(x+MAP.cw/2+6,y+66,.52,'#d8dcc4',ti);
      txt('앞 산을 오르면 열려요',x+MAP.cw/2,y+92,15,'#aaa68f');
    }
  });
  if(c.sets.length<=8){
    const by=645;v6sIsland(991,by,208,30,'#c4d3aa');v6sStone(935,by-6,74,20);v6sStone(998,by-26,75,34);v6sFlag(1045,by-58,v6sC.rose,.65);
    drawCharacter(G.charKind,994,by-29,.75,1,1+Math.sin(G.t*2.4)*.004,0,G.hat);txt('한 걸음씩, 정상까지',350,608,29,'#9b9d7e');
  }
  ctx.restore();if(G.mapSel>=0)v6sRenderPans();
}
function v6sRenderPans(){
  const c=country(),i=G.mapSel,s=SETS[c.sets[i]],ti=c.themeOf(c.sets[i],i),accent=v6sAccents[G.ci][ti];
  ctx.save();ctx.fillStyle='rgba(72,68,52,.45)';v7FillViewport();
  v6sBox(208,85,864,555,29,v6sC.paper,'#d0bca0',9);v6sClose(1031,126);
  v6sMountain(286,142,.75,accent,ti);txt((i+1)+'번 산  '+c.themes[ti],CX,136,34,v6sC.ink);
  v6sFit(s.words.map(w=>w[1]+' '+w[0]).join('     '),CX,184,26,'#8d775c',650);
  const next=Array.from({length:8},(_,k)=>k).find(k=>panUnlocked(G.ci,i,k)&&!starsOf(G.ci,i,k));
  for(let k=0;k<8;k++){
    const r=panRect(k),un=panUnlocked(G.ci,i,k),st=starsOf(G.ci,i,k),P=PANS[k],L=c.lens[k],current=k===next;
    v6sBox(r.x,r.y,r.w,r.h,20,un?'#fffdf5':'#f0eddf',current?'#90a780':'#dccfb7',un?3:1);
    if(current){ctx.save();ctx.strokeStyle='#94ad86';ctx.lineWidth=2.5;rr(r.x+1,r.y+1,r.w-2,r.h-2,19);ctx.stroke();ctx.restore();}
    txt((i*8+k+1)+'단계',r.x+r.w/2,r.y+25,17,un?'#958367':'#aaa591');
    if(!un)v6sLock(r.x+r.w-22,r.y+21,'#b1aa94',.62);
    v6sFit(k===0?'첫걸음':k===7?'정상으로!':L+(c.key==='word'?'층':'단어'),r.x+r.w/2,r.y+65,30,un?v6sC.ink:'#aea58e',r.w-26);
    txt(k===0?'연습':k===7?'정상 도전':P.sp==='low'?'천천히':P.sp==='mid'?'보통':'빠르게',r.x+r.w/2,r.y+97,19,un?'#8a9172':'#b5ab94');
    if(un){for(let q=0;q<3;q++)v6sStar(r.x+r.w/2+(q-1)*23,r.y+126,8,q<st?'#d8b35b':'#e8dec4');}
    else{v6sLine([[r.x+r.w/2-22,r.y+126],[r.x+r.w/2+22,r.y+126]],'#d5cebb',2);}
  }
  txt('단계를 누르면 출발해요',CX,598,21,'#958367');ctx.restore();
}
function renderLoading(failed){
  shadowOff();ctx.fillStyle='#f1eddd';v7FillViewport();
  v6sBox(CX-270,H/2-85,540,170,28,'#fff9eb','#d9cbb1',4);
  txt(failed?'캐릭터를 불러오지 못했어요':'친구들이 준비하고 있어요',CX,H/2-12,28,'#6f5546');
  txt(failed?'화면을 누르면 다시 열어요':'잠깐만 기다려 주세요',CX,H/2+32,19,'#98856b');
}

/* v6 · picture-book playfield. World positions, answer data and timing are unchanged. */
const V6_PLAYPALETTES = [
  { material:'grass', ink:'#6f5546', edge:'#ab9175', stone:'#d5c3a8', shade:'#bba486', top:'#e0e9ce', rim:'#a7bf8a', leaf:'#85a572', wood:'#c6a17e', paper:'#fff9eb' },
  { material:'wood', ink:'#6f5546', edge:'#927451', stone:'#b69773', shade:'#977957', top:'#cadbb8', rim:'#8fad78', leaf:'#75976c', wood:'#ba9571', paper:'#fff9eb' },
  { material:'snow', ink:'#6f5546', edge:'#a8b9bb', stone:'#c6d3d5', shade:'#a9bdc2', top:'#fffdf6', rim:'#e5eeee', leaf:'#99b5a9', wood:'#c4a48b', paper:'#fffaf0' },
  { material:'sandstone', ink:'#6f5546', edge:'#bca079', stone:'#e0bf93', shade:'#c9a87f', top:'#f2ddb5', rim:'#dabb87', leaf:'#adb38a', wood:'#c5a57c', paper:'#fff9e9' },
  { material:'cliff', ink:'#6f5546', edge:'#b5927e', stone:'#d9b5a0', shade:'#c39986', top:'#dee6cd', rim:'#aaba91', leaf:'#8aa078', wood:'#c4a084', paper:'#fff9eb' },
  { material:'sea', ink:'#6f5546', edge:'#a2b9b0', stone:'#ccd9d3', shade:'#aebfb7', top:'#f5eedb', rim:'#96b9ae', leaf:'#7faaa0', wood:'#bcae92', paper:'#fffaf0' },
  { material:'lichen', ink:'#6f5546', edge:'#a49b84', stone:'#c4bfaf', shade:'#aaa392', top:'#dedcc5', rim:'#aebb94', leaf:'#91a177', wood:'#bca183', paper:'#fff9eb' },
  { material:'masonry', ink:'#6f5546', edge:'#b1a183', stone:'#ded0b4', shade:'#c2b395', top:'#faf0d4', rim:'#a8ae7e', leaf:'#929967', wood:'#c0a47c', paper:'#fff9e9' },
  { material:'spire', ink:'#6f5546', edge:'#aa9bb3', stone:'#c8bfd4', shade:'#ada0bc', top:'#f8efdc', rim:'#d8c9bb', leaf:'#a699b0', wood:'#bca492', paper:'#fffaf0' }
];
function v6pPalette(){ return V6_PLAYPALETTES[Math.max(0,Math.min(8,(G.ci||0)*3+themeIdx()))]; }
function v6pPath(points){
  ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
  for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
  ctx.closePath();
}
function v6pLeaf(x,y,s,angle,col){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle||0);ctx.fillStyle=col;
  ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-s,-s*.3,-s*.8,-s*1.4,0,-s*1.8);
  ctx.bezierCurveTo(s*.7,-s*1.2,s*.7,-s*.4,0,0);ctx.fill();ctx.restore();
}
function v6pStar(x,y,r,fill,stroke){
  ctx.save();ctx.translate(x,y);ctx.beginPath();
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rad=i%2?r*.48:r;const xx=Math.cos(a)*rad,yy=Math.sin(a)*rad;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}
  ctx.closePath();ctx.lineJoin='round';ctx.lineWidth=Math.max(1.25,r*.095);ctx.fillStyle=fill||'#efd78b';ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}ctx.restore();
}
function v6pArrow(x,y,dir,s,col){
  ctx.save();ctx.translate(x,y);ctx.scale(dir||1,1);ctx.strokeStyle=col||'#6f5546';ctx.lineWidth=2.8;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(-s*.8,0);ctx.lineTo(s*.8,0);ctx.moveTo(s*.15,-s*.65);ctx.lineTo(s*.8,0);ctx.lineTo(s*.15,s*.65);ctx.stroke();ctx.restore();
}
function v6pSpeaker(x,y,size,muted){
  ctx.save();ctx.translate(x,y);ctx.scale(size/20,size/20);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#6f5546';ctx.fillStyle='#6f5546';ctx.lineWidth=1.8;
  v6pPath([[-8,-3],[-4,-3],[1,-7],[1,7],[-4,3],[-8,3]]);ctx.fill();
  ctx.beginPath();if(muted){ctx.moveTo(5,-4);ctx.lineTo(10,4);ctx.moveTo(10,-4);ctx.lineTo(5,4);}else{ctx.arc(0,0,7,-.6,.6);ctx.moveTo(10,-7);ctx.arc(0,0,12,-.62,.62);}ctx.stroke();ctx.restore();
}
function v6pClock(x,y){
  ctx.save();ctx.strokeStyle='#997e61';ctx.lineWidth=1.8;ctx.lineCap='round';ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.moveTo(x,y-4);ctx.lineTo(x,y);ctx.lineTo(x+3,y+1);ctx.stroke();ctx.restore();
}
function v6pCard(x,y,w,h,r,fill,stroke){
  ctx.save();ctx.shadowColor='rgba(103,78,55,.10)';ctx.shadowBlur=12;ctx.shadowOffsetY=4;
  ctx.fillStyle=fill||'#fff9eb';rr(x,y,w,h,r||18);ctx.fill();shadowOff();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;rr(x+.75,y+.75,w-1.5,h-1.5,Math.max(1,(r||18)-1));ctx.stroke();}ctx.restore();
}

function drawStep(x,y,alpha,dip){
  const p=v6pPalette(),material=p.material;
  ctx.save();ctx.globalAlpha=alpha==null?1:alpha;ctx.translate(sx(x),sy(y)+(dip||0));ctx.scale(WS,WS);
  ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2;
  // The entire 208 px tread is solid, with its flat contact line at world y = 0.
  ctx.shadowColor='rgba(83,67,49,.13)';ctx.shadowBlur=12;ctx.shadowOffsetY=8;
  ctx.beginPath();ctx.moveTo(-104,11);ctx.lineTo(104,11);ctx.lineTo(104,34);ctx.quadraticCurveTo(104,47,91,48);
  ctx.lineTo(-88,48);ctx.quadraticCurveTo(-104,48,-104,34);ctx.closePath();ctx.fillStyle=p.stone;ctx.fill();shadowOff();ctx.strokeStyle=p.edge;ctx.stroke();
  ctx.fillStyle=p.shade;ctx.beginPath();ctx.moveTo(-101,33);ctx.quadraticCurveTo(-44,43,4,39);ctx.quadraticCurveTo(57,36,101,30);ctx.lineTo(101,34);ctx.quadraticCurveTo(101,45,89,45);ctx.lineTo(-87,45);ctx.quadraticCurveTo(-101,45,-101,33);ctx.fill();
  if(material==='wood'){
    ctx.strokeStyle='rgba(111,85,70,.25)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-88,31);ctx.bezierCurveTo(-58,28,-20,36,5,31);ctx.moveTo(24,30);ctx.quadraticCurveTo(60,25,87,28);ctx.moveTo(-61,40);ctx.quadraticCurveTo(-40,38,-18,40);ctx.stroke();
    ctx.beginPath();ctx.ellipse(78,37,8,3,0,0,Math.PI*2);ctx.stroke();
  }else if(material==='sandstone'||material==='cliff'){
    ctx.strokeStyle=material==='sandstone'?'rgba(171,130,82,.27)':'rgba(154,114,92,.26)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-85,29);ctx.quadraticCurveTo(-46,33,-6,29);ctx.moveTo(17,36);ctx.quadraticCurveTo(48,31,86,34);ctx.moveTo(-61,41);ctx.lineTo(-29,39);ctx.stroke();
  }else if(material==='masonry'){
    ctx.strokeStyle='rgba(145,125,88,.31)';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(-96,35);ctx.lineTo(95,35);ctx.moveTo(-35,24);ctx.lineTo(-35,35);ctx.moveTo(49,35);ctx.lineTo(49,45);ctx.stroke();
  }else if(material==='spire'){
    ctx.strokeStyle='rgba(137,117,156,.28)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-73,30);ctx.lineTo(-73,40);ctx.moveTo(-67,30);ctx.lineTo(-67,40);ctx.moveTo(67,30);ctx.lineTo(67,40);ctx.moveTo(73,30);ctx.lineTo(73,40);ctx.stroke();
  }else{
    ctx.strokeStyle=material==='snow'||material==='sea'?'rgba(133,158,152,.35)':'rgba(132,107,80,.27)';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(-80,32);ctx.lineTo(-69,30);ctx.moveTo(69,38);ctx.lineTo(84,35);ctx.moveTo(29,31);ctx.lineTo(36,33);ctx.stroke();
  }
  ctx.beginPath();ctx.moveTo(-92,0);ctx.lineTo(92,0);ctx.quadraticCurveTo(104,0,104,11);
  ctx.lineTo(104,17);ctx.quadraticCurveTo(103,24,95,24);
  if(material==='snow'){ctx.bezierCurveTo(87,24,89,33,81,33);ctx.bezierCurveTo(73,33,75,24,65,24);ctx.lineTo(-58,24);ctx.bezierCurveTo(-68,24,-64,30,-73,30);ctx.bezierCurveTo(-82,30,-79,24,-94,24);}
  else{ctx.quadraticCurveTo(54,26,20,22);ctx.quadraticCurveTo(-36,27,-94,24);}
  ctx.quadraticCurveTo(-104,24,-104,17);ctx.lineTo(-104,11);ctx.quadraticCurveTo(-104,0,-92,0);ctx.closePath();
  ctx.fillStyle=p.top;ctx.fill();ctx.strokeStyle=p.edge;ctx.lineWidth=1.7;ctx.stroke();
  ctx.strokeStyle=p.rim;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-89,19);ctx.quadraticCurveTo(-40,22,0,20);ctx.quadraticCurveTo(51,24,87,19);ctx.stroke();
  ctx.strokeStyle=material==='snow'?'#ffffff':'rgba(255,255,248,.64)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-84,5);ctx.lineTo(84,5);ctx.stroke();
  if(material==='grass'||material==='wood'||material==='cliff'){
    ctx.strokeStyle=p.leaf;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(-88,12);ctx.quadraticCurveTo(-92,8,-96,8);ctx.moveTo(-88,12);ctx.lineTo(-86,7);ctx.moveTo(87,13);ctx.quadraticCurveTo(91,8,95,9);ctx.stroke();
  }else if(material==='snow'){
    ell(-85,11,5,2,'#ffffff');ell(84,10,7,2,'#ffffff');
  }else if(material==='sandstone'){
    for(const dot of [[-88,12,1.2],[-81,15,.8],[-74,10,1],[80,11,1.1],[88,15,.9]])ell(dot[0],dot[1],dot[2],dot[2],'#d8b983');
  }else if(material==='lichen'){
    ell(-85,12,6,2.5,'#bdc5a4');ell(-76,14,3,2,'#c9ceaf');ell(83,12,7,2.3,'#b7c09a');
  }else if(material==='sea'){
    ctx.strokeStyle='#b1c9bd';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-93,13);ctx.quadraticCurveTo(-84,10,-75,13);ctx.moveTo(75,12);ctx.quadraticCurveTo(84,15,93,12);ctx.stroke();
  }
  ctx.restore();
}

function drawPost(x,y,sway){
  const p=v6pPalette();ctx.save();ctx.translate(sx(x),sy(y));ctx.scale(WS,WS);ctx.rotate(-(sway||0)/114);
  ctx.fillStyle=p.wood;rr(-6,-78,12,79,4);ctx.fill();ctx.strokeStyle='#9e7e5c';ctx.lineWidth=1.6;ctx.stroke();
  ctx.strokeStyle='rgba(255,243,215,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-2,-65);ctx.lineTo(-2,-10);ctx.stroke();ctx.restore();
}
function drawSign(x,y,text,sway,hidden,glow){
  const p=v6pPalette(),w=SIGN_W,h=SIGN_H,cy=-72-h/2;
  drawPost(x,y,sway);
  ctx.save();ctx.translate(sx(x),sy(y));ctx.scale(WS,WS);ctx.rotate(-(sway||0)/114);
  ctx.translate(0,cy);ctx.lineJoin='round';
  if(glow){ctx.save();ctx.shadowColor='rgba(221,185,90,.62)';ctx.shadowBlur=13;ctx.strokeStyle='rgba(224,189,91,'+(.65+.2*Math.sin(G.t*4))+')';ctx.lineWidth=5;rr(-w/2-3,-h/2-3,w+6,h+6,17);ctx.stroke();ctx.restore();}
  ctx.shadowColor='rgba(89,66,45,.15)';ctx.shadowBlur=10;ctx.shadowOffsetY=5;
  ctx.fillStyle=p.wood;rr(-w/2,-h/2,w,h,14);ctx.fill();shadowOff();
  ctx.strokeStyle='#a38261';ctx.lineWidth=2;rr(-w/2+1,-h/2+1,w-2,h-2,13);ctx.stroke();
  ctx.fillStyle=p.paper;rr(-w/2+9,-h/2+7,w-18,h-14,9);ctx.fill();ctx.strokeStyle='rgba(163,128,91,.34)';ctx.lineWidth=1.5;ctx.stroke();
  // Fasteners live on the frame, outside the uncluttered reading area.
  for(const xx of [-w/2+5,w/2-5])for(const yy of [-h/2+15,h/2-15]){ell(xx,yy,1.8,1.8,'#937454');}
  if(hidden){
    // Do not draw the answer under fog: the 0.45 s visibility rule remains exact.
    ctx.save();rr(-w/2+10,-h/2+8,w-20,h-16,8);ctx.clip();ctx.fillStyle='#e7e8df';ctx.fillRect(-w/2,-h/2,w,h);
    for(let i=-3;i<=3;i++){const fy=Math.sin(G.t*2.5+i)*3;ell(i*33,fy+7,29,24,'#f4f3e9');ell(i*32+9,fy-19,24,15,'#eeeee4');}
    ctx.restore();
  }else{
    const t=String(text),size=t.length>=3?42:t.length===2?50:54;txt(t,0,3,size,'#5e493c');
  }
  ctx.restore();
}

function drawBalloons(){
  const cols=['#dfa69d','#ebd28c','#b6cdae'];ctx.save();
  for(let i=0;i<G.balloons;i++){
    const bx=(i-1)*24+Math.sin(G.t*2+i)*4,by=-150-Math.cos(G.t*1.7+i)*4;
    ctx.strokeStyle='rgba(133,103,77,.65)';ctx.lineWidth=1.25;ctx.beginPath();ctx.moveTo(0,-88);ctx.bezierCurveTo(bx*.3,-106,bx*.3,by+36,bx,by+18);ctx.stroke();
    ctx.fillStyle=cols[i%cols.length];ctx.strokeStyle='rgba(137,107,80,.60)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(bx,by,14,17,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    v6pPath([[bx,by+15],[bx-3,by+20],[bx+3,by+20]]);ctx.fillStyle=cols[i%cols.length];ctx.fill();
    ctx.globalAlpha=.43;ell(bx-5,by-6,3,5,'#fffaf0');ctx.globalAlpha=1;
  }ctx.restore();
}

function drawPrompt(){
  const it=G.transitionItem||curItem(),y=176;
  ctx.save();ctx.shadowColor='rgba(103,78,55,.12)';ctx.shadowBlur=15;ctx.shadowOffsetY=5;
  ell(CX,y,54,54,'#fff9eb');shadowOff();ctx.strokeStyle='#d6c2a1';ctx.lineWidth=2;ctx.beginPath();ctx.arc(CX,y,53,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='#f0e7d5';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(CX,y,47,0,Math.PI*2);ctx.stroke();
  if(!it||it.rest){v6pStar(CX,y+1,30,'#efd78b','#c6a665');ctx.restore();return;}
  txt(it.emoji,CX,y-1,60,'#000');
  ell(CX+30,y+32,11,11,'#efe7d6');v6pSpeaker(CX+30,y+32,12,G.mute);ctx.restore();
  if(it.uType==='word')return;
  const units=it.units,groups=[];
  if(it.uType==='syl')units.forEach((u,i)=>groups.push([i]));
  else{let cur=-1;units.forEach((u,i)=>{if(u.syl!==cur){cur=u.syl;groups.push([]);}groups[groups.length-1].push(i);});}
  const bw=it.uType==='syl'?50:42,gap=6,ggap=18;let total=0;
  groups.forEach((g,gi)=>{total+=g.length*bw+(g.length-1)*gap+(gi?ggap:0);});
  let x=CX-total/2;const yy=y+92;
  groups.forEach((g,gi)=>{if(gi)x+=ggap;g.forEach((ui,k)=>{
    const u=units[ui],done=ui<it.ui,cur=ui===it.ui,cx=x+bw/2,slotCol=u.slot===0?'#c4dce3':u.slot===1?'#ccddbd':'#efdbad';
    ctx.save();if(cur){const pulse=1+Math.sin(G.t*5)*.02;ctx.translate(cx,yy);ctx.scale(pulse,pulse);ctx.translate(-cx,-yy);}
    v6pCard(cx-bw/2,yy-bw/2,bw,bw,12,done?'#d4e3c8':cur?(it.uType==='jamo'?slotCol:'#efdcaa'):'#fff9ed',cur?'#af9164':'#d9cdb7');
    txt(done?u.ch:cur?'?':'',cx,yy+2,it.uType==='syl'?28:24,done?'#5d7454':'#655040');ctx.restore();
    x+=bw+(k<g.length-1?gap:0);
  });});
}

function v6pHUD(n,it){
  const p=v6pPalette(),r=UI.home,c=country(),shown=Math.min(G.i,n),ratio=shown/Math.max(1,n);
  v6pCard(r.x,r.y,r.w,r.h,17,'#fff9eb','#dac9ac');
  v6pArrow(r.x+18,r.y+r.h/2,-1,8,p.ink);if(r.w>=70)txt('지도',r.x+r.w/2+10,r.y+r.h/2+1,16,p.ink);
  v6pCard(118,20,256,64,20,'rgba(255,249,235,.94)');
  ell(146,42,14,14,'#e4e9d4');v6pLeaf(143,49,7,-.35,p.leaf);v6pLeaf(148,50,6,.55,p.leaf);
  txt(c.name,169,41,21,p.ink,'left');txt(c.themes[themeIdx()]+' · '+(G.sl+1)+'번 산',140,66,15,'#9a8165','left');
  v6pCard(CX-136,12,272,74,23,'rgba(255,249,235,.96)');
  txt(String(shown),CX-28,42,42,p.ink,'right');txt('/ '+n+'층',CX-15,46,21,'#9b8468','left');
  const rx=CX-85,ry=74,rw=170;ctx.strokeStyle='#e8dec9';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx+rw,ry);ctx.stroke();
  ctx.strokeStyle='#9cb58b';ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx+rw*ratio,ry);ctx.stroke();
  for(let k=0;k<5;k++)ell(rx+rw*k/4,ry,2.5,2.5,k/4<=ratio?'#91aa7e':'#ded3bc');
  ell(rx+rw*ratio,ry,4.5,4.5,'#a5bc8b');
  const bx=CX-184,by=100,bw=368,bh=10;
  if(G.budget&&it&&!it.rest){
    v6pClock(bx-18,by+5);ctx.fillStyle='rgba(215,205,181,.78)';rr(bx,by,bw,bh,5);ctx.fill();
    const f=Math.max(0,Math.min(1,G.time/G.timeMax));ctx.save();rr(bx,by,bw,bh,5);ctx.clip();ctx.fillStyle=f<.25?'#ce9084':f<.5?'#dfbf73':'#9bb58a';ctx.fillRect(bx,by,bw*f,bh);ctx.restore();
  }else txt(it&&it.rest?'쉬어 가요':'천천히 올라가요',CX,105,15,'#937a5f');
  v6pCard(W-150,24,122,46,17,'#fff9eb','#dac9ac');v6pStar(W-124,47,12,'#efd78b','#c3a364');txt(String(G.sessionStars||0),W-68,48,24,p.ink);
  txt('산길 '+(G.pi+1)+'/8',W-219,47,16,p.ink);
  const p0=W-239,py=89,pw=198;ctx.strokeStyle='rgba(196,179,147,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p0,py);ctx.lineTo(p0+pw,py);ctx.stroke();
  for(let i=0;i<8;i++){
    const px=p0+pw*i/7;ell(px,py,i===G.pi?8:5,i===G.pi?8:5,i<G.pi?'#a6bb8e':i===G.pi?'#efd78b':'#ede4cf');
    if(i===G.pi){ctx.strokeStyle='#bfa675';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.stroke();txt(String(i+1),px,py+.5,10,'#795e42');}
  }
  if(G.combo>=2){
    const cue=G.transitionItem||it,cbx=cue&&!cue.rest&&cue.uType==='jamo'?v7jLayout(cue).panel.x+v7jLayout(cue).panel.w+16:CX+72;v6pCard(cbx,145,114,33,15,'#f7e2d5');v6pStar(cbx+15,162,7,'#ddbc6e');txt(G.combo+' 콤보',cbx+64,163,17,'#aa7866');
  }
  drawPrompt();
  if(G.phase==='play'){
    for(let side=0;side<2;side++){
      const hx=CX+(side?300:-300),hy=630;ctx.save();ctx.globalAlpha=G.pendingAdvance?.50:.84;
      v6pCard(hx-78,hy-24,156,52,24,'rgba(255,249,235,.96)','#deceb3');
      v6pArrow(hx-32,hy+2,side?1:-1,11,'#92785d');txt(side?'오른쪽':'왼쪽',hx+18,hy+3,18,'#8b735b');ctx.restore();
    }
  }
}

function render(){
  if(G.phase==='title'){drawSky(0,.2);renderTitle();return;}
  if(G.phase==='map'){drawSky(G.mapSel>=0?country().themeOf(country().sets[G.mapSel],G.mapSel):0,.3);renderMap();return;}
  const n=G.plan.length;drawSky(themeIdx(),Math.min(1,(G.pi+Math.min(1,G.i/Math.max(1,n)))/8));drawDecor();
  ctx.save();if(G.shake>0)ctx.translate((Math.random()-.5)*G.shake*22,(Math.random()-.5)*G.shake*22);
  G.floors.forEach((f,i)=>{
    const depth=G.floors.length-1-i,a=Math.max(.2,1-depth*.09);drawStep(f.x,f.y,a,Math.sin(f.land*Math.PI)*8);
    if(f.star)v6pStar(sx(f.x),sy(f.y)-30,13,'#efd78b','#c6a665');
  });
  const it=curItem();
  if(G.phase==='play'&&!G.pendingAdvance&&it){
    const ops=it.rest?['⭐','⭐']:options(it);
    for(let side=0;side<2;side++){
      const p=candPos(side);drawStep(p.x,p.y,1,0);
      if(it.rest){v6pStar(sx(p.x),sy(p.y)-60*WS+Math.sin(G.t*5+side)*6,25*WS,'#efd78b','#c6a665');continue;}
      const sway=it.v==='wind'?Math.sin(G.t*3+side)*10:0,hidden=(it.v==='fog'||it.v==='both')&&G.t-G.floorBorn<FOG_DELAY,glow=it.hint&&!it.hintSay&&side===it.side;
      drawSign(p.x,p.y,ops[side],sway,hidden,glow);
    }
  }
  drawChar();
  const softColors={'#ff5a7a':'#d29b90','#5be38a':'#a8bd90','#ffd166':'#e9ce85','#e07b2a':'#c39a62'};
  for(const f of G.fx){
    ctx.globalAlpha=Math.max(0,Math.min(1,f.life));
    if(f.dot)ell(sx(f.x),sy(f.y),4,4,softColors[f.color]||f.color);
    else if(f.text){
      ctx.save();ctx.translate(sx(f.x),sy(f.y));const fs=f.big?22:24;ctx.font=fs+'px '+FONT_STACK;const fw=Math.max(106,Math.min(250,ctx.measureText(f.text).width+34));
      v6pCard(-fw/2,-23,fw,46,18,'#fff9eb',softColors[f.color]||f.color);txt(f.text,0,1,fs,'#796047');ctx.restore();
    }
    ctx.globalAlpha=1;
  }
  ctx.restore();
  v6pHUD(n,it);
  if(G.toast){
    ctx.save();ctx.globalAlpha=Math.min(1,G.toast.t*3);v6pCard(CX-210,H-127,420,52,24,'#fff9eb','#dfceb0');
    let fs=22;ctx.font=fs+'px '+FONT_STACK;while(fs>17&&ctx.measureText(G.toast.text).width>380){fs--;ctx.font=fs+'px '+FONT_STACK;}
    txt(G.toast.text,CX,H-100,fs,'#796047');ctx.restore();
  }
  if(G.flash>0){ctx.fillStyle='rgba(202,126,112,'+(G.flash*.45)+')';v7FillViewport();}
}

/* Full-window landscape with a uniform, undistorted 1280 x 720 interaction plane. */
var V7_VIEW;
function resize(){
  const dpr=Math.max(1,Math.min(2,devicePixelRatio||1));
  const vw=Math.max(1,innerWidth),vh=Math.max(1,innerHeight);
  const s=Math.min(vw/W,vh/H),ox=(vw-W*s)/2,oy=(vh-H*s)/2;
  scale=s;
  canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);
  canvas.style.width=vw+'px';canvas.style.height=vh+'px';
  canvas.style.left='0';canvas.style.top='0';canvas.style.transform='none';
  ctx.setTransform(dpr*s,0,0,dpr*s,ox*dpr,oy*dpr);
  V7_VIEW={left:-ox/s,top:-oy/s,width:vw/s,height:vh/s,scale:s,offsetX:ox,offsetY:oy,dpr,portrait:vh>vw*1.08};
  window.GLIM_FULL_VIEWPORT=true;
}
function toLogical(e){
  const r=canvas.getBoundingClientRect();
  return {x:(e.clientX-r.left)/scale+V7_VIEW.left,y:(e.clientY-r.top)/scale+V7_VIEW.top};
}
function v7FillViewport(color){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H};
  if(color!=null)ctx.fillStyle=color;
  ctx.fillRect(v.left-1,v.top-1,v.width+2,v.height+2);
}
function drawSky(theme,prog){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H};
  const index=v6WorldIndex(theme),img=V6_SCENE_IMAGES[index].image;
  ctx.save();shadowOff();ctx.globalAlpha=1;
  const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;
  if(iw&&ih){
    const zoom=Math.max(v.width/iw,v.height/ih)*1.055,dw=iw*zoom,dh=ih*zoom;
    const playing=G.phase==='play'||G.phase==='clear';
    const dx=playing?-Math.tanh((G.cam?G.cam.x:0)/1100)*12:0;
    const dy=playing?(Math.max(0,Math.min(1,prog))-.5)*16:0;
    ctx.drawImage(img,v.left+(v.width-dw)/2+dx,v.top+(v.height-dh)/2+dy,dw,dh);
  }else v7FillViewport('#f1eddf');
  if(G.phase==='play'||G.phase==='clear'){
    const wash=ctx.createLinearGradient(0,v.top,0,150);
    wash.addColorStop(0,'rgba(255,250,237,.45)');wash.addColorStop(1,'rgba(255,250,237,0)');
    ctx.fillStyle=wash;ctx.fillRect(v.left,v.top,v.width,150-v.top);
  }
  ctx.restore();
}


/* v7.1 · thin stair body, retaining the y=0 tread and 208 px contact width. */
function v7StepBody(p, material){
  const wood=material==='wood';
  // Restore the earlier 48 px total thickness; keep the tread and foot anchor fixed.
  ctx.save();ctx.translate(0,15);ctx.scale(1,(48-15)/(125-15));ctx.translate(0,-15);
  ctx.shadowColor='rgba(77,65,50,.10)';ctx.shadowBlur=8;ctx.shadowOffsetY=5;
  ctx.beginPath();ctx.moveTo(-99,15);ctx.lineTo(100,15);ctx.lineTo(98,110);
  ctx.quadraticCurveTo(98,122,87,125);ctx.lineTo(-86,125);
  ctx.quadraticCurveTo(-99,123,-99,111);ctx.closePath();
  const face=ctx.createLinearGradient(-96,22,104,127);
  face.addColorStop(0,lerpC(p.stone,'#fff9e9',.15));face.addColorStop(.75,p.stone);face.addColorStop(1,p.shade);
  ctx.fillStyle=face;ctx.fill();shadowOff();ctx.lineWidth=1.6;ctx.strokeStyle=p.edge;ctx.stroke();
  // A quiet side return gives each riser thickness without changing the foothold.
  ctx.fillStyle=p.shade;v6pPath([[79,22],[99,15],[97,111],[88,124],[79,124]]);ctx.fill();
  ctx.strokeStyle=rgba(p.edge,.62);ctx.lineWidth=1.3;
  ctx.beginPath();ctx.moveTo(79,28);ctx.lineTo(79,119);ctx.stroke();
  ctx.strokeStyle='rgba(255,252,239,.35)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-95,31);ctx.lineTo(-95,110);ctx.stroke();
  // The upper face is the crisp riser immediately below the rounded tread.
  ctx.fillStyle=rgba(p.shade,.42);ctx.fillRect(-96,23,192,11);
  ctx.strokeStyle=rgba(p.edge,.43);ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(-93,36);ctx.lineTo(76,36);ctx.stroke();
  if(wood){
    // Broad joined planks; grain is sparse so it cannot compete with letters.
    ctx.strokeStyle=rgba(p.edge,.45);ctx.lineWidth=1.6;
    for(const yy of [65,96]){ctx.beginPath();ctx.moveTo(-96,yy);ctx.lineTo(78,yy);ctx.stroke();}
    ctx.strokeStyle='rgba(255,244,217,.32)';ctx.lineWidth=1.3;
    for(const yy of [67,98]){ctx.beginPath();ctx.moveTo(-89,yy);ctx.lineTo(74,yy);ctx.stroke();}
    ctx.strokeStyle=rgba(p.edge,.34);ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(-82,48);ctx.bezierCurveTo(-54,43,-32,53,-3,49);
    ctx.moveTo(10,81);ctx.bezierCurveTo(25,77,46,86,64,81);
    ctx.moveTo(-63,112);ctx.bezierCurveTo(-29,105,0,113,29,109);ctx.stroke();
    ctx.beginPath();ctx.ellipse(49,50,9,3,0,0,Math.PI*2);ctx.stroke();
    for(const xx of [-84,65])for(const yy of [49,81,111])ell(xx,yy,1.6,1.6,rgba(p.edge,.65));
  }else{
    // Offset masonry courses make the continuous support read as built stairs.
    ctx.strokeStyle=rgba(p.edge,material==='masonry'?.45:.34);ctx.lineWidth=1.45;
    ctx.beginPath();ctx.moveTo(-96,66);ctx.quadraticCurveTo(-16,68,78,65);
    ctx.moveTo(-96,98);ctx.quadraticCurveTo(-8,96,78,99);
    ctx.moveTo(-22,37);ctx.lineTo(-23,66);
    ctx.moveTo(28,67);ctx.lineTo(30,97);
    ctx.moveTo(-49,98);ctx.lineTo(-48,122);ctx.stroke();
    ctx.strokeStyle='rgba(255,252,239,.28)';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(-90,69);ctx.lineTo(18,70);ctx.moveTo(-13,100);ctx.lineTo(70,101);ctx.stroke();
    if(material==='sandstone'||material==='cliff'){
      ctx.strokeStyle=rgba(p.edge,.22);ctx.lineWidth=1.2;
      ctx.beginPath();ctx.moveTo(-77,47);ctx.quadraticCurveTo(-54,51,-37,47);
      ctx.moveTo(-71,85);ctx.quadraticCurveTo(-45,81,-18,85);
      ctx.moveTo(2,113);ctx.quadraticCurveTo(38,108,61,112);ctx.stroke();
    }else if(material==='snow'){
      ctx.fillStyle='#f9fcf7';ctx.beginPath();ctx.moveTo(-91,26);ctx.lineTo(-64,26);
      ctx.bezierCurveTo(-67,33,-65,45,-73,46);ctx.bezierCurveTo(-80,45,-77,32,-91,32);ctx.fill();
    }else if(material==='lichen'||material==='grass'){
      ell(-90,38,6,2.5,rgba(p.rim,.65));ell(-83,40,4,2,rgba(p.rim,.52));
      ell(73,100,3,6,rgba(p.rim,.45));
    }else if(material==='spire'){
      ctx.strokeStyle=rgba(p.edge,.3);ctx.beginPath();ctx.moveTo(-71,46);ctx.lineTo(-71,56);
      ctx.moveTo(-66,46);ctx.lineTo(-66,56);ctx.moveTo(51,79);ctx.lineTo(51,88);ctx.stroke();
    }
  }
  // The thin body retains its quiet base bevel.
  ctx.strokeStyle=rgba(p.edge,.43);ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-84,121);ctx.lineTo(77,121);ctx.stroke();
  ctx.restore();
}

function drawStep(x,y,alpha,dip){
  const p=v6pPalette(),material=p.material;
  ctx.save();ctx.globalAlpha=alpha==null?1:alpha;
  ctx.translate(sx(x),sy(y)+(dip||0));ctx.scale(WS,WS);
  ctx.lineJoin='round';ctx.lineCap='round';
  v7StepBody(p,material);
  // Broad tread: its horizontal rear edge remains exactly at the foot anchor.
  ctx.beginPath();ctx.moveTo(-94,0);ctx.lineTo(94,0);
  ctx.quadraticCurveTo(104,0,104,9);ctx.lineTo(104,18);
  ctx.quadraticCurveTo(104,26,95,26);ctx.lineTo(-95,26);
  ctx.quadraticCurveTo(-104,26,-104,18);ctx.lineTo(-104,9);
  ctx.quadraticCurveTo(-104,0,-94,0);ctx.closePath();
  ctx.fillStyle=p.top;ctx.fill();ctx.strokeStyle=p.edge;ctx.lineWidth=1.7;ctx.stroke();
  // The downturned front edge and narrow light bevel define the actual step.
  ctx.fillStyle=p.rim;ctx.beginPath();ctx.moveTo(-102,17);
  ctx.quadraticCurveTo(0,21,102,17);ctx.lineTo(102,19);
  ctx.quadraticCurveTo(102,24,94,24);ctx.lineTo(-94,24);
  ctx.quadraticCurveTo(-102,24,-102,19);ctx.closePath();ctx.fill();
  ctx.strokeStyle=material==='snow'?'#ffffff':'rgba(255,255,247,.72)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-88,4);ctx.lineTo(88,4);ctx.stroke();
  ctx.strokeStyle=rgba(p.edge,.26);ctx.lineWidth=1.1;
  ctx.beginPath();ctx.moveTo(-90,16);ctx.quadraticCurveTo(-1,18,91,16);ctx.stroke();
  if(material==='grass'||material==='wood'||material==='cliff'){
    ctx.strokeStyle=p.leaf;ctx.lineWidth=1.6;ctx.beginPath();
    ctx.moveTo(-88,12);ctx.quadraticCurveTo(-93,8,-96,9);ctx.moveTo(-88,12);ctx.lineTo(-87,7);
    ctx.moveTo(89,13);ctx.quadraticCurveTo(91,9,95,9);ctx.stroke();
  }else if(material==='snow'){
    ell(-85,11,5,2,'#ffffff');ell(84,10,7,2,'#ffffff');
  }else if(material==='sandstone'){
    for(const d of [[-87,11,1.1],[-79,14,.8],[81,11,1],[90,13,.9]])ell(d[0],d[1],d[2],d[2],'#d8b983');
  }else if(material==='lichen'){
    ell(-85,12,6,2.5,'#bdc5a4');ell(-76,14,3,2,'#c9ceaf');ell(83,12,7,2.3,'#b7c09a');
  }else if(material==='sea'){
    ctx.strokeStyle='#b1c9bd';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-93,13);
    ctx.quadraticCurveTo(-84,10,-75,13);ctx.moveTo(75,12);ctx.quadraticCurveTo(84,15,93,12);ctx.stroke();
  }
  ctx.restore();
}


/* Home lettering: soft enamel colours, a cream rim, and a shallow painted edge. */
function v72Text(text,x,y,size,color,align,kind){
  ctx.save();ctx.font=size+'px '+FONT_STACK;ctx.textAlign=align||'center';ctx.textBaseline='middle';ctx.lineJoin='round';
  if(kind==='primary'){
    ctx.strokeStyle='#608053';ctx.lineWidth=Math.max(1,size*.047);ctx.strokeText(text,x,y+size*.035);
    ctx.fillStyle='#5c7c51';ctx.fillText(text,x,y+size*.042);
  }else if(kind==='brand'){
    ctx.strokeStyle='rgba(255,251,235,.9)';ctx.lineWidth=size*.075;ctx.strokeText(text,x,y);
  }else if(kind==='eyebrow'||kind==='tagline'){
    ctx.strokeStyle='rgba(255,250,232,.86)';ctx.lineWidth=size*.075;ctx.strokeText(text,x,y);
  }else if(kind==='selected'){
    ctx.strokeStyle='#fffef2';ctx.lineWidth=size*.065;ctx.strokeText(text,x,y);
  }
  ctx.fillStyle=color;ctx.fillText(text,x,y);ctx.restore();
}
function v72HomeLogo(text,x,y,size,align){
  ctx.save();ctx.font=size+'px '+FONT_STACK;ctx.textAlign='left';ctx.textBaseline='middle';ctx.lineJoin='round';
  const glyphs=Array.from(text),tracking=size*.012,metrics=glyphs.map(ch=>ctx.measureText(ch).width);
  const width=metrics.reduce((a,b)=>a+b,0)+tracking*(glyphs.length-1);
  let xx=x-(align==='center'?width/2:align==='right'?width:0),letter=0;
  glyphs.forEach((ch,i)=>{
    if(ch===' '){xx+=metrics[i]+tracking;return;}
    const dy=[size*.035,size*.008,-size*.018,-size*.046][letter]||0,yy=y+dy;
    // Every Hangul block remains upright and intact; the baseline rises like the nearby stairs.
    ctx.strokeStyle='#c7b28c';ctx.lineWidth=size*.139;ctx.strokeText(ch,xx,yy+size*.053);
    ctx.strokeStyle='#fff9e6';ctx.lineWidth=size*.126;ctx.strokeText(ch,xx,yy);
    ctx.strokeStyle=letter<2?'#59764e':'#9a7d4b';ctx.lineWidth=size*.037;ctx.strokeText(ch,xx,yy+size*.020);
    const fill=ctx.createLinearGradient(0,yy-size*.41,0,yy+size*.36);
    if(letter<2){fill.addColorStop(0,'#a8be8b');fill.addColorStop(.46,'#91ad78');fill.addColorStop(1,'#789863');}
    else{fill.addColorStop(0,'#efcf82');fill.addColorStop(.48,'#e5bf70');fill.addColorStop(1,'#cfaa5e');}
    ctx.fillStyle=fill;ctx.fillText(ch,xx,yy);
    xx+=metrics[i]+tracking;letter++;
  });
  ctx.restore();return width;
}
function v72HomeSoundButton(){
  const r=UI.mute;v6sBox(r.x,r.y,r.w,r.h,17,'#fff9ed','#d9cfb9',2);
  const x=r.x+25,y=r.y+24;ctx.save();ctx.strokeStyle=v6sC.ink;ctx.fillStyle=v6sC.ink;ctx.lineWidth=2;ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(x-9,y-4);ctx.lineTo(x-5,y-4);ctx.lineTo(x+1,y-9);ctx.lineTo(x+1,y+9);ctx.lineTo(x-5,y+4);ctx.lineTo(x-9,y+4);ctx.closePath();ctx.stroke();
  if(G.mute){v6sLine([[x+6,y-4],[x+13,y+4]],v6sC.ink,2);v6sLine([[x+6,y+4],[x+13,y-4]],v6sC.ink,2);}else{ctx.beginPath();ctx.arc(x+1,y,7,-.65,.65);ctx.stroke();ctx.beginPath();ctx.arc(x+1,y,12,-.65,.65);ctx.stroke();}ctx.restore();
  v72Text(G.mute?'끔':'켬',r.x+55,y,15,'#716246','center','selected');
}


/* Home: a garden stairway with one continuous flight and a real stepping cycle. */
const V7_HOME_COLORS={ink:'#695140',soft:'#8e7b62',sage:'#71976b',deep:'#52724c',cream:'#fff8e8',edge:'#b19a77'};
function v7hPolygon(points,fill,stroke,width){
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width||1.5;ctx.stroke();}
}
function v7hLine(points,col,width){v6sLine(points,col,width||2);}
function v7hLeaf(x,y,size,angle,color){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=color;
  ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-size,-size*.2,-size*.8,-size*1.3,0,-size*1.65);ctx.bezierCurveTo(size*.8,-size*1.2,size*.8,-size*.1,0,0);ctx.fill();ctx.restore();
}
function v7hPlant(x,y,s,flower){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  v7hLine([[0,9],[0,-21]],'#8b9f66',2);v7hLeaf(0,2,11,-.8,'#9cb575');v7hLeaf(0,-6,9,.8,'#aec58c');
  if(flower){for(let i=0;i<5;i++){const a=i*2*Math.PI/5;ell(Math.cos(a)*5,-21+Math.sin(a)*5,4.5,4.5,flower);}ell(0,-21,3.6,3.6,'#d7ad5d');}
  ctx.restore();
}
function v7hStairData(){return {x:665,y:622,run:88,rise:48,n:6,bx:-31,by:-29};}
function v7hFoot(s,i){return {x:s.x+i*s.run+s.run*.46+s.bx*.45,y:s.y-i*s.rise+s.by*.45};}
function v7hStairway(s,groundBottom){
  const {x,y,run,rise,n,bx,by}=s,end=x+n*run,top=y-(n-1)*rise,bottom=Math.max(870,groundBottom||870);
  // A planted bank anchors the flight to the ground and the upper garden.
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  ctx.fillStyle='#c9d59f';ctx.beginPath();ctx.moveTo(x-115,y+74);ctx.bezierCurveTo(x-60,y+4,x+23,y+22,x+78,y-7);ctx.bezierCurveTo(x+212,y-58,end-60,top-37,end+52,top-22);ctx.bezierCurveTo(end+147,top-47,end+269,top+64,end+308,top+194);ctx.lineTo(end+320,bottom);ctx.lineTo(x-350,bottom);ctx.closePath();ctx.fill();
  ctx.fillStyle='#b3c58d';ctx.beginPath();ctx.moveTo(x-11,y+90);ctx.bezierCurveTo(x+165,y+36,end+32,top+108,end+244,top+56);ctx.lineTo(end+320,bottom);ctx.lineTo(x-18,bottom);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(158,178,115,.45)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(end+52,top+155);ctx.bezierCurveTo(end-46,top+202,x+207,y+41,x+86,y+131);ctx.stroke();
  // Quiet planting belongs to the bank, outside the walkable stone surfaces.
  v7hPlant(x-62,y+40,1.3,'#f9edc9');v7hPlant(end+41,top+81,1.2,'#efc2a6');v7hPlant(end+111,top+210,.95,'#fff7db');
  ell(end+22,top-4,88,19,'#c4d49c');
  // A single sawtooth sidewall joins every tread. The lower edge follows the hill.
  const outline=[[x,y]];
  for(let i=0;i<n;i++){outline.push([x+(i+1)*run,y-i*rise]);if(i<n-1)outline.push([x+(i+1)*run,y-(i+1)*rise]);}
  outline.push([end+7,top+80],[x+5,y+82],[x-2,y+46]);
  ctx.shadowColor='rgba(95,78,51,.13)';ctx.shadowBlur=15;ctx.shadowOffsetY=10;
  v7hPolygon(outline,'#cbb793','#a58e6e',2);shadowOff();
  ctx.save();v7hPolygon(outline);ctx.clip();
  const grad=ctx.createLinearGradient(x,y-40,end,top+90);grad.addColorStop(0,'rgba(240,219,179,.20)');grad.addColorStop(1,'rgba(111,93,65,.07)');ctx.fillStyle=grad;ctx.fillRect(x-10,top,end-x+24,y-top+98);
  // Staggered masonry seams follow the incline, with tiny chips at each tread.
  for(let i=0;i<n;i++){
    const xx=x+i*run,yy=y-i*rise;
    v7hLine([[xx+run,yy+5],[xx+run,yy+67]],'rgba(154,128,94,.48)',1.7);
    v7hLine([[xx+8,yy+48],[xx+37,yy+47],[xx+run-5,yy+30]],'rgba(154,128,94,.27)',1.6);
    v7hLine([[xx+run*.46,yy+47],[xx+run*.47,yy+76]],'rgba(154,128,94,.26)',1.4);
    v7hLine([[xx+14,yy+22],[xx+22,yy+21]],'rgba(242,224,188,.63)',2.3);
    v7hLine([[xx+run-21,yy+14],[xx+run-26,yy+18],[xx+run-23,yy+23]],'rgba(162,137,101,.37)',1.4);
  }ctx.restore();
  // Upper landing runs into the hill, so the last step does not hang in the air.
  v7hPolygon([[end-run,top],[end+78,top],[end+78+bx,top+by],[end-run+bx,top+by]],'#e8debe','#aa9674',1.5);
  v7hLine([[end+20,top-21],[end+40,top-18],[end+57,top-22]],'#c1c993',4);
  for(let i=n-1;i>=0;i--){
    const xx=x+i*run,yy=y-i*rise;
    // Rise faces have their own projected depth. They connect exactly to the next tread.
    if(i>0){
      v7hPolygon([[xx,yy],[xx+bx,yy+by],[xx+bx,yy+rise+by],[xx,yy+rise]],'#b7a07d','#9f8867',1.6);
      v7hLine([[xx+bx+5,yy+by+15],[xx-5,yy+13]],'rgba(229,211,176,.44)',1.6);
    }
    const tone=i%2?'#eee2c5':'#f0e5cb';
    v7hPolygon([[xx-2,yy],[xx+run,yy],[xx+run+bx,yy+by],[xx+bx-2,yy+by]],tone,'#aa9371',1.6);
    // Rounded-looking bevels read as a thick, weight-bearing stone nosing.
    v7hPolygon([[xx-2,yy],[xx+run,yy],[xx+run,yy+7],[xx+5,yy+8],[xx-2,yy+5]],'#dfcaa3');
    v7hLine([[xx+5,yy+1],[xx+run-6,yy+1]],'#fff4d9',2.5);
    v7hLine([[xx+6,yy+8],[xx+run-4,yy+7]],'#b59b74',1.3);
    // Sparse shallow stone variation and moss keep the tread readable and clean.
    v7hLine([[xx+bx+7,yy+by+3],[xx+bx+26,yy+by+3]],'#bbc99b',3);
    if(i%2===0)v7hLine([[xx+run-35,yy-16],[xx+run-25,yy-14],[xx+run-17,yy-15]],'rgba(173,153,116,.19)',1.5);
  }
  // An inviting path reaches the first riser from the foreground.
  ctx.fillStyle='#dfd0aa';ctx.beginPath();ctx.moveTo(x+4,y+84);ctx.bezierCurveTo(x-44,y+73,x-102,y+90,x-139,y+115);ctx.bezierCurveTo(x-165,y+198,x-342,bottom-84,x-380,bottom);ctx.lineTo(x+39,bottom);ctx.bezierCurveTo(x-14,bottom-103,x+65,y+117,x+4,y+84);ctx.fill();
  v7hLine([[x-36,y+98],[x-55,y+105]],'rgba(174,153,113,.40)',2);
  v7hPlant(end-91,top+112,.7);v7hPlant(x+148,y+18,.72,'#f3d8bb');
  ctx.restore();
}
function v7hClimber(s){
  const moves=s.n-1,duration=1.08,arrival=moves*duration,period=arrival+1.7;
  const time=((G.t+(G.charSelectedAt==null?.74:-G.charSelectedAt))%period+period)%period;
  let x,y,groundY,pose=1,opacity=1,lift=0,sq=1;
  if(time<arrival){
    const step=Math.min(moves-1,Math.floor(time/duration)),local=(time-step*duration)/duration,a=v7hFoot(s,step),b=v7hFoot(s,step+1);
    const p=Math.max(0,Math.min(1,(local-.18)/.69)),u=smoothUnit(p),rise=1-Math.pow(1-p,6);
    x=a.x+(b.x-a.x)*u;groundY=a.y+(b.y-a.y)*u;
    y=a.y+(b.y-a.y)*rise-Math.sin(p*Math.PI)*18;
    pose=local<.08?1:local<.18?2:local<.30?3:local<.64?4:local<.82?5:local<.93?6:1;
    if(local>=.84&&local<.96)sq=1+Math.sin((local-.84)/.12*Math.PI)*.025;
    lift=Math.max(0,groundY-y);
    if(time<.18)opacity=smoothUnit(time/.18);
  }else{
    const a=v7hFoot(s,moves);x=a.x;y=groundY=a.y;pose=time-arrival<.17?6:7;
    opacity=time>period-.28?Math.max(0,(period-time)/.28):1;
  }
  ctx.save();ctx.globalAlpha=opacity;
  ell(x,groundY+1,32-lift*.11,5.4-lift*.018,'rgba(105,83,57,.15)');
  drawCharacter(G.charKind,x,y,1.22,1,sq,pose,G.hat);
  ctx.restore();
  return {x,y,groundY,pose,opacity,time};
}
function v7hSign(x,y){
  ctx.save();
  v6sBox(x-4,y+6,9,52,4,'#bd9d76','#9e835f');
  v7hPolygon([[x-50,y-34],[x+27,y-34],[x+53,y-9],[x+26,y+17],[x-50,y+17]],'#ede0bd','#a9936c',2);
  v7hLine([[x-41,y-28],[x+23,y-28]],'rgba(255,249,223,.7)',2);
  v72Text('정상',x-4,y-8,23,'#75613d','center','selected');
  ell(x-38,y-7,2,2,'#aa8e64');ctx.restore();
}
function v7hHomeLayout(){
  // Logical content stays inside the laptop/tablet safe area; the garden may bleed beyond it.
  const v=typeof V7_VIEW==='object'?V7_VIEW:null;
  if(v&&v.portrait){
    const h=v.height,t=v.top;
    Object.assign(UI,{play:{x:96,y:t+h*.796,w:1088,h:Math.min(174,h*.075)},char:{x:96,y:t+h*.884,w:1088,h:Math.min(151,h*.07)},seg:{x:96,y:t+h*.720,w:1088,h:Math.min(136,h*.059)},mute:{x:1095,y:t+54,w:104,h:76}});
  }else Object.assign(UI,{play:{x:80,y:500,w:287,h:80},char:{x:381,y:500,w:174,h:80},seg:{x:80,y:414,w:475,h:59},mute:{x:1178,y:24,w:74,h:46}});
}
function v7hDrawCompanions(){
  const friends=Array.from({length:Math.min(3,CHARS.length-1)},(_,i)=>(G.charKind+i+1)%CHARS.length);
  const anchors=[{x:608,y:668,s:.82,face:1},{x:805,y:702,s:.77,face:1},{x:1218,y:382,s:.75,face:-1}];
  friends.forEach((kind,i)=>{const f=anchors[i];ell(f.x,f.y+1,23*f.s,4*f.s,'rgba(106,85,56,.14)');drawCharacter(kind,f.x,f.y,f.s,f.face,1+Math.sin(G.t*2.4+i)*.004,i===2?7:0,0);});
}
function v7hRenderPortrait(v){
  const c=V7_HOME_COLORS,t=v.top,h=v.height,s=v7hStairData(),artScale=Math.min(1.62,h/1400),artY=t+h*.489-460*artScale;
  ctx.save();shadowOff();
  const wash=ctx.createLinearGradient(0,t,0,t+h*.66);wash.addColorStop(0,'rgba(255,249,231,.68)');wash.addColorStop(.65,'rgba(255,249,231,.45)');wash.addColorStop(1,'rgba(255,249,231,0)');ctx.fillStyle=wash;ctx.fillRect(v.left,t,v.width,h);
  v6sBox(96,t+54,139,76,26,'rgba(255,250,237,.92)','#dbccac');v72Text('글림',165,t+93,42,'#678259','center','brand');
  const m=UI.mute;v6sBox(m.x,m.y,m.w,m.h,26,'#fff9ed','#d9cfb9',3);v6pSpeaker(m.x+m.w/2,m.y+m.h/2,39,G.mute);
  v72Text('친구와 떠나는 작은 모험',CX,t+h*.132,40,'#7e8961','center','eyebrow');
  v72HomeLogo('한글 계단',CX,t+h*.198,126,'center');
  v72Text('한 칸씩, 내 힘으로 올라요',CX,t+h*.253,43,'#8d7653','center','tagline');
  ctx.save();ctx.translate(CX-920*artScale,artY);ctx.scale(artScale,artScale);
  v7hStairway(s,(t+h-artY)/artScale+12);v7hDrawCompanions();v7hSign(1160,297);v7hClimber(s);ctx.restore();
  const sg=UI.seg;v6sBox(sg.x,sg.y,sg.w,sg.h,35,'#eee5cd','#d2c09e',3);
  for(let i=0;i<3;i++){
    const xx=sg.x+i*sg.w/3,on=i===G.ci;
    if(on)v6sBox(xx+8,sg.y+8,sg.w/3-16,sg.h-16,28,'#fffaf0','#c4af86',3);
    v72Text(COUNTRIES[i].name,xx+sg.w/6,sg.y+sg.h/2+2,49,on?'#597a4e':'#a19373','center',on?'selected':'');
  }
  const p=UI.play;v6sBox(p.x,p.y+10,p.w,p.h,39,'#5b7c54');v6sBox(p.x,p.y,p.w,p.h,39,'#81a474','#63845c');v72Text('계단 오르기',p.x+p.w/2-20,p.y+p.h/2,60,'#fff9df','center','primary');
  v7hLine([[p.x+p.w-119,p.y+p.h/2-16],[p.x+p.w-102,p.y+p.h/2],[p.x+p.w-119,p.y+p.h/2+16]],'#fffbed',6);
  const ch=UI.char;v6sBox(ch.x,ch.y+8,ch.w,ch.h,35,'#cdb994');v6sBox(ch.x,ch.y,ch.w,ch.h,35,'#fff5de','#d0b993');v72Text('친구 고르기',ch.x+ch.w/2,ch.y+ch.h/2,48,'#816643','center','selected');
  v6sStar(121,t+h*.970,16,'#d1b365');v72Text(String(totalStars()),151,t+h*.970+2,34,'#967439','left');v72Text(CHARS[G.charKind].name+'와 함께',1183,t+h*.970,31,'#7d805c','right');
  ctx.restore();if(G.selOpen)v6sRenderSelection();
}
function renderTitle(){
  v7hHomeLayout();const col=V7_HOME_COLORS,s=v7hStairData();
  if(typeof V7_VIEW==='object'&&V7_VIEW.portrait){v7hRenderPortrait(V7_VIEW);return;}
  ctx.save();shadowOff();
  const view=typeof V7_VIEW==='object'?V7_VIEW:{left:0,top:0,width:W,height:H};
  // A soft cream light behind the type merges into the landscape without becoming a box.
  const wash=ctx.createLinearGradient(0,0,765,0);wash.addColorStop(0,'rgba(255,249,231,.85)');wash.addColorStop(.60,'rgba(255,249,231,.65)');wash.addColorStop(1,'rgba(255,249,231,0)');ctx.fillStyle=wash;ctx.fillRect(view.left,view.top,800-view.left,view.height);
  v6sBox(80,30,80,37,15,'rgba(255,250,237,.91)','#dbccac');v72Text('글림',120,49,24,'#678259','center','brand');v72HomeSoundButton();
  v7hStairway(s);
  v7hDrawCompanions();
  v7hSign(1160,297);v7hClimber(s);
  v72Text('친구와 떠나는 작은 모험',84,179,24,'#7e8961','left','eyebrow');
  v72HomeLogo('한글 계단',77,258,88,'left');
  v72Text('한 칸씩, 내 힘으로 올라요',84,323,27,'#8d7653','left','tagline');
  const sg=UI.seg;v6sBox(sg.x,sg.y,sg.w,sg.h,21,'#eee5cd','#d9c7a5',1);
  for(let i=0;i<3;i++){
    const bx=sg.x+i*sg.w/3,on=i===G.ci;
    if(on){v6sBox(bx+4,sg.y+4,sg.w/3-8,sg.h-8,17,'#fffaf0','#c4af86',2);}
    v72Text(COUNTRIES[i].name,bx+sg.w/6,sg.y+sg.h/2+1,25,on?'#597a4e':'#a19373','center',on?'selected':'');
  }
  const p=UI.play;v6sBox(p.x,p.y+6,p.w,p.h,24,'#5b7c54');v6sBox(p.x,p.y,p.w,p.h,24,'#81a474','#63845c');
  v72Text('계단 오르기',p.x+p.w/2-15,p.y+p.h/2,31,'#fff9df','center','primary');
  v7hLine([[p.x+p.w-39,p.y+32],[p.x+p.w-31,p.y+40],[p.x+p.w-39,p.y+48]],'#fffbed',3.3);
  const ch=UI.char;v6sBox(ch.x,ch.y+5,ch.w,ch.h,24,'#cdb994');v6sBox(ch.x,ch.y,ch.w,ch.h,24,'#fff5de','#d0b993');
  v72Text('친구 고르기',ch.x+ch.w/2,ch.y+ch.h/2,25,'#816643','center','selected');
  v6sStar(98,660,10,'#d1b365');v72Text(String(totalStars()),120,661,23,'#967439','left');
  v72Text(CHARS[G.charKind].name+'와 함께',83,616,18,'#7d805c','left');
  ctx.restore();if(G.selOpen)v6sRenderSelection();
}


/* v7 · Hangul is built inside one syllable square.
   Rendering-only state: learning units, choices, counters, timers and metrics are unchanged. */
const v7jState={flight:null,completed:null,installed:false};
const V7_JAMO_COLORS=['#648999','#72946a','#b28b4c'];
const V7_JAMO_FILLS=['#e7f0f3','#edf2e4','#f7edd7'];
const V7_JAMO_MIXED={
  'ㅘ':['ㅗ','ㅏ'],'ㅙ':['ㅗ','ㅐ'],'ㅚ':['ㅗ','ㅣ'],
  'ㅝ':['ㅜ','ㅓ'],'ㅞ':['ㅜ','ㅔ'],'ㅟ':['ㅜ','ㅣ'],'ㅢ':['ㅡ','ㅣ']
};
function v7jClamp(x){return Math.max(0,Math.min(1,x));}
function v7jEase(x){x=v7jClamp(x);return 1-Math.pow(1-x,3);}

function v7jGroups(it){
  const groups=[];
  (it.units||[]).forEach((u,i)=>{
    let group=groups[groups.length-1];
    if(!group||group.syl!==u.syl){
      group={syl:u.syl,char:it.word[u.syl],indices:[],first:i,last:i,parts:[null,null,null]};
      groups.push(group);
    }
    group.indices.push(i);group.last=i;group.parts[u.slot]=u.ch;
  });
  return groups;
}
function v7jLayout(it){
  const groups=v7jGroups(it),size=groups.length>2?82:94,gap=8;
  const wordWidth=groups.length*size+Math.max(0,groups.length-1)*gap;
  const width=134+wordWidth+24,x=CX-width/2;
  return {
    panel:{x,y:130,w:width,h:154},badge:{x:x+61,y:201,r:43},
    tiles:groups.map((g,i)=>Object.assign({x:x+134+i*(size+gap),y:153,size},g))
  };
}
function v7jSlotLayout(tile){
  const n=tile.size/94,ox=tile.x+tile.size/2,oy=tile.y+tile.size/2;
  const hasFinal=!!tile.parts[2],vowel=tile.parts[1];
  const kind=V7_JAMO_MIXED[vowel]?'mixed':'ㅗㅛㅜㅠㅡ'.includes(vowel)?'horizontal':'vertical';
  const top=-32,upperH=hasFinal?43:64;
  const box=(x,y,w,h,part)=>({x:ox+x*n,y:oy+y*n,w:w*n,h:h*n,part});
  let initial,vowels;
  if(kind==='vertical'){
    initial=[box(-33,top,34,upperH)];
    vowels=[box(8,top,24,upperH,vowel)];
  }else if(kind==='horizontal'){
    const ih=hasFinal?25:38,vh=hasFinal?14:20;
    initial=[box(-29,top,58,ih)];
    vowels=[box(-32,top+upperH-vh,64,vh,vowel)];
  }else{
    const pair=V7_JAMO_MIXED[vowel],ih=hasFinal?25:39,vh=hasFinal?13:19;
    initial=[box(-33,top,34,ih)];
    vowels=[box(-34,top+upperH-vh,39,vh,pair[0]),box(12,top,21,upperH,pair[1])];
  }
  const slots=[{slot:0,boxes:initial},{slot:1,boxes:vowels}];
  if(hasFinal)slots.push({slot:2,boxes:[box(-30,19,60,17,tile.parts[2])]});
  return {kind,hasFinal,slots};
}

// Compatibility jamo use their real outlines, fitted into a Hangul component position.
// The merged state uses the real, precomposed Korean glyph from the embedded font.
function v7jGlyph(ch,r,color,alpha,stretch){
  if(!ch||alpha<=0)return;
  ctx.save();ctx.globalAlpha*=alpha==null?1:alpha;
  ctx.font='100px '+FONT_STACK;ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const m=ctx.measureText(ch),left=m.actualBoundingBoxLeft||0;
  const w=(m.actualBoundingBoxRight||m.width)+left;
  const ascent=m.actualBoundingBoxAscent||78,descent=m.actualBoundingBoxDescent||0,h=ascent+descent;
  let xs=r.w/Math.max(1,w),ys=r.h/Math.max(1,h);
  if(!stretch)xs=ys=Math.min(xs,ys);
  ctx.translate(r.x+(r.w-w*xs)/2,r.y+(r.h-h*ys)/2);
  ctx.scale(xs,ys);ctx.fillStyle=color;ctx.fillText(ch,left,ascent);ctx.restore();
}
function v7jRoundBox(r,fill,stroke,lineWidth,radius){
  ctx.fillStyle=fill;rr(r.x,r.y,r.w,r.h,radius||8);ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth||1.4;ctx.stroke();}
}
function v7jSlot(slot,active){
  const color=V7_JAMO_COLORS[slot.slot];
  ctx.save();
  for(const r of slot.boxes){
    ctx.fillStyle=active?V7_JAMO_FILLS[slot.slot]:'rgba(234,230,218,.32)';
    rr(r.x-3,r.y-3,r.w+6,r.h+6,6);ctx.fill();
    ctx.strokeStyle=active?color:'rgba(175,164,143,.27)';ctx.lineWidth=active?1.8:1;
    ctx.setLineDash(active?[3,4]:[2,5]);ctx.stroke();
  }
  ctx.restore();
}
function v7jDrawParts(tile,done,activeSlot,alpha,merge){
  const layout=v7jSlotLayout(tile),upperDone=done>=2;
  ctx.save();ctx.globalAlpha*=alpha;
  // Already collected initial + vowel become one open syllable above the final slot.
  const joinCV=layout.hasFinal&&upperDone;
  if(joinCV){
    const n=tile.size/94;
    v7jGlyph(compose(tile.parts[0],tile.parts[1],null),
      {x:tile.x+13*n,y:tile.y+13*n,w:68*n,h:45*n},'#5f6957',1,true);
  }
  for(const slot of layout.slots){
    if(joinCV&&slot.slot<2)continue;
    const partDone=done>slot.slot;
    if(!partDone)v7jSlot(slot,activeSlot===slot.slot);
    else for(const box of slot.boxes){
      const r=Object.assign({},box),tight=(merge||0)*.06;
      r.x+=(tile.x+tile.size/2-r.x-r.w/2)*tight;r.y+=(tile.y+tile.size/2-r.y-r.h/2)*tight;
      const ch=box.part||tile.parts[slot.slot];
      v7jGlyph(ch,r,V7_JAMO_COLORS[slot.slot],1,true);
    }
  }
  ctx.restore();
}
function v7jFlightFor(it){
  const f=v7jState.flight;
  return f&&f.item===it&&G.pendingAdvance&&G.char.motion&&G.char.motion.type==='climb'?f:null;
}
function v7jDrawTile(tile,it,flight){
  const active=it.ui>=tile.first&&it.ui<=tile.last;
  let done=Math.min(tile.indices.length,Math.max(0,it.ui-tile.first));
  const age=flight?Math.max(0,G.t-flight.start):0;
  const duration=flight?flight.duration:.36,joinStart=duration*.28,joinDuration=duration*.18;
  const arriving=!!flight&&active,settled=arriving&&age>=joinStart;
  if(settled)done++;
  const complete=done===tile.indices.length;
  const merge=settled?v7jClamp((age-joinStart)/joinDuration):0;
  const pulse=arriving&&complete?Math.sin(v7jClamp((age-joinStart)/(duration*.55))*Math.PI)*.035:0;
  ctx.save();
  ctx.translate(tile.x+tile.size/2,tile.y+tile.size/2);ctx.scale(1+pulse,1+pulse);ctx.translate(-tile.x-tile.size/2,-tile.y-tile.size/2);
  v6pCard(tile.x,tile.y,tile.size,tile.size,19,
    complete?'#f5f8eb':active?'#fffdf6':'rgba(255,253,246,.60)',
    complete?'#aac292':active?'#beaa81':'#e4ddcc');
  if(active&&!complete){
    // A single quiet underline identifies the syllable being assembled.
    ctx.strokeStyle='#c6b58e';ctx.lineWidth=3;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(tile.x+22,tile.y+tile.size+9);ctx.lineTo(tile.x+tile.size-22,tile.y+tile.size+9);ctx.stroke();
  }
  if(complete){
    const a=arriving?merge:1;
    if(a<1)v7jDrawParts(tile,done,-1,1-a,a);
    v7jGlyph(tile.char,{x:tile.x+13,y:tile.y+12,w:tile.size-26,h:tile.size-24},'#5a664f',a,false);
  }else if(active){
    // The vowel's spatial slot gives the block its shape without revealing the answer.
    const slot=settled?-1:it.slot;
    v7jDrawParts(tile,done,slot,1,merge);
  }
  ctx.restore();
}
function v7jDrawFlight(it,layout,flight){
  if(!flight)return;
  const age=Math.max(0,G.t-flight.start),p=v7jClamp(age/(flight.duration*.35));
  if(p>=1)return;
  const tile=layout.tiles.find(t=>t.syl===it.syl),slot=v7jSlotLayout(tile).slots.find(s=>s.slot===it.slot);
  const boxes=slot.boxes,minX=Math.min(...boxes.map(r=>r.x)),maxX=Math.max(...boxes.map(r=>r.x+r.w));
  const minY=Math.min(...boxes.map(r=>r.y)),maxY=Math.max(...boxes.map(r=>r.y+r.h));
  const to={x:(minX+maxX)/2,y:(minY+maxY)/2},k=v7jEase(p);
  const x=flight.from.x+(to.x-flight.from.x)*k,y=flight.from.y+(to.y-flight.from.y)*k-Math.sin(Math.PI*p)*26;
  ctx.save();ctx.globalAlpha=1-v7jClamp((p-.76)/.24);ctx.translate(x,y);ctx.scale(1-.32*k,1-.32*k);
  ctx.shadowColor='rgba(95,77,48,.16)';ctx.shadowBlur=10;ctx.shadowOffsetY=3;
  v7jRoundBox({x:-25,y:-27,w:50,h:54},'#fffdf4',V7_JAMO_COLORS[it.slot],2,12);shadowOff();
  txt(it.ch,0,1,35,V7_JAMO_COLORS[it.slot]);ctx.restore();
}
function v7jDrawCompletedBadge(layout){
  const done=v7jState.completed;
  if(!done||G.t<done.start||G.t>done.end||G.phase!=='play')return;
  const a=Math.min(1,(G.t-done.start)/.07,(done.end-G.t)/.2);
  const width=Math.max(114,66+done.word.length*29),x=layout.panel.x+layout.panel.w+14,y=182;
  ctx.save();ctx.globalAlpha=v7jClamp(a);
  v6pCard(x,y,width,57,18,'#f4f6e9','#bdc99f');
  ctx.strokeStyle='#89a576';ctx.lineWidth=2.8;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(x+17,y+28);ctx.lineTo(x+23,y+34);ctx.lineTo(x+33,y+22);ctx.stroke();
  txt(done.word,x+45+(width-57)/2,y+29,28,'#657654');ctx.restore();
}
function v7jDrawPrompt(it){
  const layout=v7jLayout(it),p=layout.panel,b=layout.badge,flight=v7jFlightFor(it);
  v6pCard(p.x,p.y,p.w,p.h,27,'rgba(255,249,236,.96)','#ded1b8');
  // Picture -> joined word. One card per syllable, never a horizontal row of jamo.
  ctx.save();ctx.shadowColor='rgba(115,89,57,.09)';ctx.shadowBlur=8;ctx.shadowOffsetY=3;
  ell(b.x,b.y,b.r,b.r,'#fffdf5');shadowOff();ctx.strokeStyle='#ded1b8';ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke();
  txt(it.emoji,b.x,b.y-1,53,'#000');
  ell(b.x+27,b.y+31,12,12,'#eee6d4');v6pSpeaker(b.x+27,b.y+31,13,G.mute);ctx.restore();
  const ax=p.x+116,ay=200;
  ctx.save();ctx.strokeStyle='#b8bfa0';ctx.lineWidth=2.7;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(ax-6,ay-6);ctx.lineTo(ax,ay);ctx.lineTo(ax-6,ay+6);ctx.stroke();ctx.restore();
  for(const tile of layout.tiles)v7jDrawTile(tile,it,flight);
  v7jDrawFlight(it,layout,flight);v7jDrawCompletedBadge(layout);
}
function v7ReplayHit(p){
  const it=G.transitionItem||curItem();
  const b=it&&!it.rest&&it.uType==='jamo'?v7jLayout(it).badge:{x:CX,y:176,r:56};
  return Math.hypot(p.x-b.x,p.y-b.y)<b.r+5;
}
function v7JamoAccept(it,tgt){
  if(!it||it.rest||it.uType!=='jamo'){v7jState.flight=null;return;}
  const duration=CHARS[G.charKind].duration;
  v7jState.flight={item:it,ui:it.ui,start:G.t,duration,
    from:{x:sx(tgt.x),y:sy(tgt.y)+(-72-SIGN_H/2)*WS}};
  if(it.ui===it.units.length-1){
    v7jState.completed={word:it.word,start:G.t+duration,end:G.t+duration+.78};
  }
}
function v7InstallJamo(){
  if(v7jState.installed)return;v7jState.installed=true;
  const basePrompt=drawPrompt,baseClimb=climbTo,baseReset=resetVisual;
  drawPrompt=function(){
    const it=G.transitionItem||curItem();
    if(it&&!it.rest&&it.uType==='jamo')v7jDrawPrompt(it);else basePrompt();
  };
  climbTo=function(tgt,extra){
    const it=curItem();
    if(extra&&it&&extra.sign===it.ch)v7JamoAccept(it,tgt);else v7jState.flight=null;
    const result=baseClimb(tgt,extra),flight=v7jState.flight;
    if(flight&&G.char.motion){
      flight.duration=G.char.motion.duration;
      if(v7jState.completed&&it.ui===it.units.length-1){v7jState.completed.start=flight.start+flight.duration;v7jState.completed.end=v7jState.completed.start+.78;}
    }
    return result;
  };
  resetVisual=function(){v7jState.flight=null;v7jState.completed=null;return baseReset();};
}

/* ===== v9_gameplay.js ===== */
const V9_SPEC = {
  "source": "글림_한글계단_쉬운해설_요약본_v5.pdf",
  "wordSets": [
    [
      "배",
      "소",
      "귀"
    ],
    [
      "해",
      "개",
      "쥐"
    ],
    [
      "게",
      "비",
      "혀"
    ],
    [
      "이",
      "자",
      "뼈"
    ],
    [
      "꽃",
      "별",
      "집"
    ],
    [
      "산",
      "공",
      "밥"
    ],
    [
      "포도",
      "시계",
      "조개"
    ],
    [
      "사자",
      "나비",
      "우유"
    ],
    [
      "버섯",
      "화분",
      "사슴"
    ],
    [
      "수박",
      "구름",
      "주먹"
    ],
    [
      "장미",
      "열쇠",
      "국수"
    ],
    [
      "딸기",
      "감자",
      "침대"
    ],
    [
      "거울",
      "사람",
      "바늘"
    ],
    [
      "연필",
      "동전",
      "얼음"
    ],
    [
      "안경",
      "병원",
      "선물"
    ],
    [
      "양말",
      "창문",
      "눈물"
    ]
  ],
  "syllableSets": [
    [
      "포도",
      "시계",
      "조개"
    ],
    [
      "사자",
      "나비",
      "우유"
    ],
    [
      "버섯",
      "화분",
      "사슴"
    ],
    [
      "수박",
      "구름",
      "주먹"
    ],
    [
      "장미",
      "열쇠",
      "국수"
    ],
    [
      "딸기",
      "감자",
      "침대"
    ]
  ],
  "phonemeSets": [
    [
      "배",
      "소",
      "귀"
    ],
    [
      "해",
      "개",
      "쥐"
    ],
    [
      "게",
      "비",
      "혀"
    ],
    [
      "이",
      "자",
      "뼈"
    ],
    [
      "꽃",
      "별",
      "집"
    ],
    [
      "산",
      "공",
      "밥"
    ],
    [
      "포도",
      "시계",
      "조개"
    ],
    [
      "사자",
      "나비",
      "우유"
    ],
    [
      "버섯",
      "화분",
      "사슴"
    ],
    [
      "수박",
      "구름",
      "주먹"
    ],
    [
      "장미",
      "열쇠",
      "국수"
    ],
    [
      "딸기",
      "감자",
      "침대"
    ],
    [
      "거울",
      "사람",
      "바늘"
    ],
    [
      "연필",
      "동전",
      "얼음"
    ],
    [
      "안경",
      "병원",
      "선물"
    ],
    [
      "양말",
      "창문",
      "눈물"
    ]
  ],
  "wordConfusionTotals": [
    9,
    12,
    14,
    15,
    15,
    17,
    19,
    20,
    20,
    21,
    21,
    21,
    21,
    21,
    22,
    24
  ],
  "wordVariantTotals": [
    2,
    4,
    6,
    8,
    9,
    9,
    9,
    10,
    11,
    12,
    12,
    12,
    12,
    13,
    14,
    15
  ],
  "syllableConfusionTotals": [
    14,
    15,
    19,
    20,
    21,
    21
  ],
  "syllableVariantTotals": [
    6,
    8,
    9,
    10,
    12,
    12
  ],
  "fixedAndExamplePatterns": {
    "word1": [
      "○○○○●○○",
      "○○○●○○○",
      "○○○○○●○",
      "○○●○○○○○○○○○●○○",
      "○○○●◇○○○○○●○○○○",
      "○○◇○○○○●○○○●○○○"
    ],
    "word2": [
      "○○○○○○●",
      "○○○●○○○",
      "○○●○◇○●",
      "○○○●○○◇○●○○○○○○",
      "○○◇●○○○○●○●○○○○",
      "○○○●○●○○○○○●○○◇"
    ],
    "word3": [
      "○○●○○○○",
      "○○○○●◇●",
      "○○○●◇○●",
      "○○○●○○○○○○●○○◇●",
      "○○●○○●○○○○○●◇○○",
      "○○○○○○○◇●○●◇●○○"
    ],
    "word4": [
      "○○◇○●○●",
      "○○◇●○○●",
      "○○○○●◇●",
      "○○○○○○◇●○●○○○○●",
      "○○○●○○○○○◇○●◇●○",
      "○○○○○○○●○○◇●○●◇"
    ],
    "word5": [
      "○○●○◇○●",
      "○○●◇○●○",
      "○○●○●◇○",
      "○○○◇●○○●○○○●◇○○",
      "○○○○◇○●○●○●◇○○○",
      "○○○○○○●○●◇●◇○○○"
    ],
    "word6": [
      "○○◇●○○●",
      "○○◇●○○●",
      "○○○●◇●○",
      "○○●○●○●○○○○◇○◇○",
      "○○●○○○○○○●◇○●◇●",
      "○○○●◇●◇○○●○○○○●"
    ],
    "word7_example": [
      "○○●◇●○○",
      "○○●●○○◇",
      "○○●○●○◇",
      "○○●●○●○◇○○○●◇○○",
      "○○○○○○●●○◇○●●◇○",
      "○○○●○◇○○○●○●●◇●"
    ],
    "word13_example": [
      "○○○○◇●●",
      "○○●○●◇○",
      "○○●●○◇○",
      "○○●●○◇●○○◇○○◇●●",
      "○○●◇●◇●○◇○●●○○○",
      "○○●◇●○●●○○○○◇●◇"
    ],
    "syllable1": [
      "○○○○○●○",
      "○○◇●○●○",
      "○○◇●○○●",
      "○○○◇●○●○○●○○○○○",
      "○○●○○○○○●○○●◇○○",
      "○○●◇○●○◇○○○○○○●"
    ],
    "syllable3_example": [
      "○○◇○●●○",
      "○○●◇○○●",
      "○○●●○◇○",
      "○○●●○◇●●○○○○◇○○",
      "○○●○●○○◇○●○○○●◇",
      "○○◇●●◇○○●○○●●○○"
    ],
    "syllable5_example": [
      "○○◇●○○●",
      "○○○●○◇●",
      "○○○○◇●●",
      "○○●●◇○◇○●◇○●○○●",
      "○○○○◇●●○●◇○○●●◇",
      "○○○●●◇○●◇○●●◇○○"
    ]
  },
  "patternLegend": {
    "○": "none",
    "●": "confusion",
    "◇": "terrain"
  },
  "note": "Patterns ending _example are illustrative random samples, not mandatory fixed scripts; syllable2 fixed required but missing exact script in source. phoneme appendix A overrides general 7/15 floors with 5/10 words expanded to jamo floors.",
  "phonemeSetsEvidence": "Implementation assumption to preserve prior 16-set word curriculum. PDF appendix A explicitly specifies same count curve, not an independent phoneme word list."
};
/* PDF v5 gameplay. Nine stages, omission advance, and a dedicated chase stage. */
const V9_THEMES = [
  [
    {key:'word_meadow',name:'초원',world:'산 오르기',hazard:'water',hazardName:'강물',variants:['jump'],emoji:'🌿',ending:'flag',sky:['낮','햇살','노을','저녁','저녁노을']},
    {key:'word_forest',name:'숲',world:'산 오르기',hazard:'darkness',hazardName:'어둠',variants:['collapse'],emoji:'🌲',ending:'flag',sky:['저녁','해 질 녘','밤','깊은 밤','반딧불 밤']},
    {key:'word_snow',name:'설원',world:'산 오르기',hazard:'snow',hazardName:'눈사태',variants:['ice'],emoji:'❄️',ending:'flag',sky:['흐림','눈 내림','눈보라','눈 그친 밤','맑은 밤']}
  ],
  [
    {key:'syl_beach',name:'해변',world:'화산섬 탈출',hazard:'water',hazardName:'파도',variants:['jump'],emoji:'🌊',ending:'boat',sky:['아침','맑은 아침','낮','한낮','푸른 낮']},
    {key:'syl_jungle',name:'정글',world:'화산섬 탈출',hazard:'darkness',hazardName:'어둠',variants:['collapse'],emoji:'🌴',ending:'boat',sky:['낮','오후','저녁','그늘진 숲','저녁숲']},
    {key:'syl_volcano',name:'화산',world:'화산섬 탈출',hazard:'lava',hazardName:'용암',variants:['collapse','jump'],emoji:'🌋',ending:'boat',sky:['저녁','노을','밤','용암 빛','불빛 밤']}
  ],
  [
    {key:'pho_stone',name:'돌탑',world:'하늘 탑 오르기',hazard:'darkness',hazardName:'어둠',variants:['collapse'],emoji:'🏰',ending:'star',sky:['등불','따뜻한 등불','높은 등불','탑의 등불','탑의 빛']},
    {key:'pho_ice',name:'얼음탑',world:'하늘 탑 오르기',hazard:'snow',hazardName:'눈사태',variants:['ice'],emoji:'🧊',ending:'star',sky:['푸른 빛','서리 빛','오로라','얼음 빛','오로라 밤']},
    {key:'pho_fire',name:'불꽃탑',world:'하늘 탑 오르기',hazard:'lava',hazardName:'용암',variants:['jump','ice'],emoji:'🔥',ending:'star',sky:['붉은 빛','불꽃 빛','별빛','불꽃 사이','별하늘']}
  ]
];
function v9Theme(ci=G.ci,sl=G.sl){return V9_THEMES[ci][ci===1?(sl<2?0:sl<4?1:2):(sl<6?0:sl<12?1:2)];}
function v9SkyPhase(pi=G.pi){return pi===0?0:pi<=3?1:pi<=6?2:pi===7?3:4;}
// The PDF says "the second half" and expands phoneme stages in proportion to
// their actual jamo floors. Word/syllable stages start at floor 8; phoneme
// stages use floor(N / 2) + 1. Inserted rests/return stairs never move that cut.
function v3HalfwayFloor(ci,totalFloors){return ci===2?Math.floor(Math.max(0,Number(totalFloors)||0)/2)+1:8;}
function v3ChaserState(item){
  const it=item===undefined?(G.pendingAdvance&&G.transitionItem?G.transitionItem:curItem()):item;
  const meta=it&&it.meta||{},totalFloors=Number(meta.totalMeasurementFloors||G.v9ActualFloors||(G.plan&&G.plan.v9ActualFloors))||0;
  const measurementFloor=Number(meta.measurementFloor)||null,scheduled=!!(G.pi===7&&it&&!it.rest);
  const active=G.phase==='play'&&scheduled&&G.budget>0;
  const catching=!!(active&&G.v9Catch&&G.t>=G.v9Catch.at&&G.t<G.v9Catch.at+G.v9Catch.duration);
  const ratio=G.timeMax?Math.max(0,Math.min(1,G.time/G.timeMax)):1;
  return {active,scheduled,catching,kind:v9Theme().hazard,ratio,startFloor:G.pi===7?1:null,
    measurementFloor,totalFloors,timerSeconds:G.time,timerMax:G.timeMax,
    timerVisible:false,timerBasis:'chaser_distance',policy:'pdf_v5_chase_only',
    initialCatchSeconds:6.6,pushbackSeconds:3.3};
}
function v9StageKey(ci,sl,pi){return (typeof ci==='number'?COUNTRIES[ci].key:ci)+':'+sl+':'+pi;}
function v9CompletedStages(){
  let current=LS.get('v12.completedStages',null);
  if(current&&typeof current==='object'&&!Array.isArray(current))return current;
  current={};const old=LS.get('v9.completedStages',{});
  for(const [key,record] of Object.entries(old||{})){
    if(!record||(!(record.completed===true)&&!(record.stars>0)))continue;
    const match=/^(word|syl|pho):(\d+):([0-7])$/.exec(key);if(!match)continue;
    const oldPan=Number(match[3]),newPan=oldPan===7?8:oldPan;
    current[match[1]+':'+match[2]+':'+newPan]={...record,completed:true,legacyPan:oldPan,
      source:'legacy_pdf_v3',migratedAt:Date.now(),migration:'preserve_completed_stages_insert_unplayed_chase'};
  }
  LS.set('v12.completedStages',current);return current;
}
function v9StageCompleted(ci,sl,pi){const rec=v9CompletedStages()[v9StageKey(ci,sl,pi)];return !!(rec&&(rec.completed===true||rec.stars>0));}
function v9StarsOf(ci,sl,pi){const rec=v9CompletedStages()[v9StageKey(ci,sl,pi)];return rec&&rec.stars>0?rec.stars:0;}
function v9SetUnlocked(ci,sl){return sl===0||v9StageCompleted(ci,sl-1,8)||!!LS.get('v9.teacherStageUnlock',false);}
function v9PanUnlocked(ci,sl,pi){return v9SetUnlocked(ci,sl)&&(pi===0||v9StageCompleted(ci,sl,pi)||v9StageCompleted(ci,sl,pi-1)||!!LS.get('v9.teacherStageUnlock',false));}
function v9StageLabel(ci,sl,pi){
  if(pi===0)return '소개판';if(pi===7)return '추격판';if(pi===8)return '정상판';
  const speed=['하','중','상'][(pi-1)%3];
  return (ci===2?(pi<=3?'5단어':'10단어'):(pi<=3?'7층':'15층'))+' · '+speed;
}
function v9DisplayProgress(){
  const actual=G.plan.filter(x=>!x.rest&&!x.meta?.returnStair),done=actual.filter(x=>x.v9PlanIndex<G.i).length;
  const wordTotal=G.v9WordCount||0;
  const completeWords=new Set(actual.filter(x=>x.v9PlanIndex<G.i&&x.ui===x.units.length-1).map(x=>x.meta.wordOrdinal)).size;
  return {answered:country().key==='pho'?completeWords:done,total:country().key==='pho'?wordTotal:actual.length,
    unit:country().key==='pho'?'단어':'층',floor:done,totalFloors:actual.length,
    label:country().key==='pho'?completeWords+' / '+wordTotal+'단어 · '+done+' / '+actual.length+'층':done+' / '+actual.length+'층'};
}
function v9Rng(seed){let t=seed>>>0;return function(){t+=0x6D2B79F5;let v=t;v=Math.imul(v^v>>>15,v|1);v^=v+Math.imul(v^v>>>7,v|61);return ((v^v>>>14)>>>0)/4294967296;};}
function v9Shuffle(items,rng=Math.random){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function v9PatternCounts(ci,sl,pi){
  const source=V9_SPEC.fixedAndExamplePatterns;
  if(ci===0&&sl<6){const p=source['word'+(sl+1)][pi-1];return {sim:[...p].filter(x=>x==='●').length,terrain:[...p].filter(x=>x==='◇').length};}
  if(ci===1&&sl===0){const p=source.syllable1[pi-1];return {sim:[...p].filter(x=>x==='●').length,terrain:[...p].filter(x=>x==='◇').length};}
  if(ci===1&&sl===1){const p=source.word4[pi-1];return {sim:[...p].filter(x=>x==='●').length,terrain:[...p].filter(x=>x==='◇').length};}
  const wsl=ci===1?[2,3,6,7,10,11][sl]:sl;
  if(ci===2&&sl<6){const p=source['word'+(sl+1)][pi-1];return {sim:[...p].filter(x=>x==='●').length,terrain:[...p].filter(x=>x==='◇').length};}
  const counts={
    6:[[2,2,2,4,4,5],[1,1,1,2,2,2]],
    7:[[2,2,2,4,5,5],[1,1,1,2,2,3]],
    8:[[2,2,2,4,5,5],[1,1,1,2,3,3]],
    9:[[2,2,2,5,5,5],[1,1,1,3,3,3]],
    10:[[2,2,2,5,5,5],[1,1,1,3,3,3]],
    11:[[2,2,2,5,5,5],[1,1,1,3,3,3]],
    12:[[2,2,2,5,5,5],[1,1,1,3,3,3]],
    13:[[2,2,2,5,5,5],[1,1,2,3,3,3]],
    14:[[2,2,3,5,5,5],[1,1,2,3,3,4]],
    15:[[2,3,3,5,5,6],[1,1,2,3,4,4]]
  };
  const c=counts[wsl];return {sim:c[0][pi-1],terrain:c[1][pi-1]};
}
function v9TargetSyllables(word,setOf){
  const ds=[...word].map(decom);
  if(setOf===10||setOf===11)return [0];
  if(setOf>=4&&setOf<=5)return [0];
  if(setOf===8||setOf===9||setOf===12)return [word.length-1];
  if(setOf>=13)return ds.map((d,i)=>d[2]?i:-1).filter(i=>i>=0);
  return ds.map((d,i)=>i);
}
function v3LearningTarget(it){
  const syllables=v9TargetSyllables(it.word,it.setOf),hasCodaTarget=it.setOf>=4&&it.setOf!==6&&it.setOf!==7;
  const slots=hasCodaTarget?[2]:[0,1],slot=Number.isInteger(it.slot)?it.slot:null,syllable=Number.isInteger(it.syl)?it.syl:null;
  const matches=it.uType==='jamo'?syllables.includes(syllable)&&slots.includes(slot):it.uType==='syl'?syllables.includes(syllable):true;
  return {responseSyllable:syllable,responseSlot:slot,responseSlotName:slot===null?null:['initial','medial','final'][slot],
    learningTargetSyllables:syllables,learningTargetSlots:slots,learningTargetMatch:matches};
}
function v9ConfusionEligible(it){
  if(it.uType==='word'||it.uType==='jamo')return true;
  return v9TargetSyllables(it.word,it.setOf).includes(it.syl);
}
function v9SymbolPattern(n,c,v,maxSimRun,rng=Math.random,eligible=null){
  // Backtracking also honors eligibility (e.g. the first coda in 장미).
  const memo=new Set(),all=Array(n).fill('clean');
  const visit=(i,cc,vv,last,run)=>{
    if(cc<0||vv<0||cc+vv>n-i)return false;
    if(i===n)return cc===0&&vv===0;
    const key=[i,cc,vv,last,run].join(':');if(memo.has(key))return false;
    const choices=i<2?['clean']:v9Shuffle(['clean','sim','terrain'],rng);
    for(const s of choices){
      if(s==='sim'&&(!cc||(last==='sim'&&run>=maxSimRun)||(eligible&&!eligible[i])))continue;
      if(s==='terrain'&&(!vv||last==='terrain'))continue;
      all[i]=s;
      if(visit(i+1,cc-(s==='sim'),vv-(s==='terrain'),s,last===s?run+1:1))return true;
    }
    memo.add(key);return false;
  };
  if(visit(0,c,v,'clean',0))return all;
  throw new Error('v9 pattern impossible: '+JSON.stringify({n,c,v,maxSimRun,eligible}));
}
function v9BuildPattern(ci,sl,pi,plan,teacher){
  const n=plan.length;if(pi===0)return Array(n).fill('clean');
  const refPan=pi>=7?4:pi,refLen=refPan<=3?7:15;
  let counts=v9PatternCounts(ci,sl,refPan);
  if(ci===2){const own=COUNTRIES[ci].sets[sl],longLowFloors=[0,1,2].reduce((sum,wi)=>sum+unitsOf(COUNTRIES[ci],cw(own,wi)).length*(wi===0?4:3),0);const scale=(pi>=7?longLowFloors:n)/refLen;counts={sim:Math.round(counts.sim*scale),terrain:Math.round(counts.terrain*scale)};}
  const raw={...counts};
  const maxRun=ci===0&&sl<6?1:2;
  const eligible=plan.map(v9ConfusionEligible);
  let pat;
  if(ci===0&&sl<6&&pi<7)pat=[...V9_SPEC.fixedAndExamplePatterns['word'+(sl+1)][pi-1]].map(x=>x==='●'?'sim':x==='◇'?'terrain':'clean');
  else if(ci===1&&sl===0&&pi<7)pat=[...V9_SPEC.fixedAndExamplePatterns.syllable1[pi-1]].map(x=>x==='●'?'sim':x==='◇'?'terrain':'clean');
  else {
    const rng=(ci===1&&sl===1)||(ci===2&&sl<6)?v9Rng(91841+ci*17003+sl*817+pi*97):Math.random;
    pat=v9SymbolPattern(n,counts.sim,counts.terrain,maxRun,rng,eligible);
  }
  const addCondition=(kind)=>{
    const candidates=v9Shuffle(pat.map((x,i)=>i).filter(i=>i>=2&&pat[i]==='clean'&&(kind!=='sim'||eligible[i])));
    for(const i of candidates){
      const trial=pat.slice();trial[i]=kind;let valid=true,run=0;
      for(let k=0;k<trial.length;k++){
        run=trial[k]==='sim'?run+1:0;if(run>maxRun)valid=false;
        if(k&&trial[k]==='terrain'&&trial[k-1]==='terrain')valid=false;
      }
      if(valid){pat=trial;plan[i].meta.teacherAdjusted=true;plan[i].meta.relaxedRx=true;return;}
    }
  };
  if(teacher.confusion)addCondition('sim');if(teacher.variants)addCondition('terrain');
  plan.v9Counts={reference:raw,actual:{sim:pat.filter(x=>x==='sim').length,terrain:pat.filter(x=>x==='terrain').length},phonemeProportional:ci===2};
  return pat;
}
const V9_SIGN_CMAP = new Set([32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,160,183,215,8205,8212,8220,8221,8230,8593,8594,8595,8722,9200,9201,9650,9654,9664,9673,9679,9680,9728,9729,9733,9734,9825,9829,9917,9924,9968,9978,9999,10024,10052,11088,12593,12594,12595,12596,12597,12598,12599,12600,12601,12602,12603,12604,12605,12606,12607,12608,12609,12610,12611,12612,12613,12614,12615,12616,12617,12618,12619,12620,12621,12622,12623,12624,12625,12626,12627,12628,12629,12630,12631,12632,12633,12634,12635,12636,12637,12638,12639,12640,12641,12642,12643,44032,44033,44036,44039,44040,44041,44042,44048,44049,44050,44051,44052,44053,44054,44055,44057,44058,44059,44060,44061,44064,44067,44068,44076,44077,44079,44080,44081,44088,44089,44092,44096,44107,44109,44116,44120,44124,44144,44145,44148,44151,44152,44154,44160,44161,44163,44164,44165,44166,44169,44170,44171,44172,44173,44176,44179,44180,44188,44189,44191,44192,44193,44200,44201,44202,44204,44207,44208,44216,44217,44219,44220,44221,44225,44228,44232,44236,44245,44247,44256,44257,44260,44263,44264,44266,44268,44271,44272,44273,44275,44277,44278,44284,44285,44288,44292,44294,44300,44301,44303,44305,44312,44316,44318,44320,44329,44332,44333,44340,44341,44344,44348,44356,44357,44359,44361,44368,44372,44376,44385,44387,44389,44396,44397,44400,44403,44404,44405,44406,44411,44412,44413,44415,44417,44418,44424,44425,44428,44432,44444,44445,44452,44471,44480,44481,44484,44488,44496,44497,44499,44508,44512,44516,44536,44537,44540,44543,44544,44545,44552,44553,44555,44557,44564,44592,44593,44596,44599,44600,44602,44608,44609,44611,44613,44614,44618,44620,44621,44622,44624,44628,44630,44636,44637,44639,44640,44641,44645,44648,44649,44652,44656,44664,44665,44667,44668,44669,44676,44677,44678,44684,44732,44733,44734,44736,44740,44748,44749,44751,44752,44753,44754,44760,44761,44764,44776,44779,44781,44788,44792,44796,44807,44808,44813,44816,44844,44845,44848,44850,44852,44860,44861,44863,44865,44866,44867,44872,44873,44880,44892,44893,44900,44901,44921,44928,44932,44936,44944,44945,44949,44956,44984,44985,44988,44992,44999,45000,45001,45003,45005,45006,45007,45012,45020,45032,45033,45040,45041,45044,45048,45056,45057,45060,45068,45072,45076,45084,45085,45096,45124,45125,45128,45130,45132,45134,45139,45140,45141,45143,45145,45149,45180,45181,45184,45188,45196,45197,45199,45201,45208,45209,45210,45212,45215,45216,45217,45218,45224,45225,45227,45228,45229,45230,45231,45233,45235,45236,45237,45240,45243,45244,45252,45253,45255,45256,45257,45264,45265,45268,45272,45280,45285,45320,45321,45323,45324,45327,45328,45330,45331,45336,45337,45339,45340,45341,45347,45348,45349,45352,45355,45356,45364,45365,45367,45368,45369,45376,45377,45380,45384,45392,45393,45396,45397,45400,45404,45408,45432,45433,45436,45439,45440,45442,45448,45449,45451,45453,45458,45459,45460,45464,45468,45480,45516,45520,45524,45532,45533,45535,45544,45545,45548,45552,45561,45563,45565,45572,45573,45576,45579,45580,45588,45589,45591,45593,45600,45620,45628,45656,45660,45664,45672,45673,45684,45685,45692,45700,45701,45705,45712,45713,45716,45719,45720,45721,45722,45728,45729,45731,45733,45734,45738,45740,45744,45748,45768,45769,45772,45775,45776,45778,45784,45785,45787,45789,45794,45796,45797,45798,45800,45803,45804,45805,45806,45807,45811,45812,45813,45815,45816,45817,45818,45819,45823,45824,45825,45828,45831,45832,45840,45841,45843,45844,45845,45852,45908,45909,45910,45912,45915,45916,45918,45919,45924,45925,45927,45929,45931,45934,45936,45937,45940,45943,45944,45952,45953,45955,45956,45957,45964,45968,45972,45984,45985,45992,45996,46020,46021,46024,46027,46028,46030,46032,46036,46037,46039,46041,46043,46045,46048,46052,46056,46076,46096,46104,46108,46112,46120,46121,46123,46132,46160,46161,46164,46167,46168,46176,46177,46179,46181,46188,46208,46216,46237,46244,46248,46252,46261,46263,46265,46272,46276,46280,46288,46293,46300,46301,46304,46307,46308,46310,46316,46317,46319,46321,46328,46356,46357,46360,46363,46364,46372,46373,46375,46376,46377,46378,46384,46385,46388,46392,46400,46401,46403,46404,46405,46411,46412,46413,46416,46420,46428,46429,46431,46432,46433,46496,46497,46500,46504,46506,46507,46512,46513,46515,46516,46517,46523,46524,46525,46528,46532,46540,46541,46543,46544,46545,46552,46572,46608,46609,46612,46616,46629,46636,46640,46644,46657,46664,46692,46696,46748,46749,46752,46756,46763,46764,46769,46804,46832,46836,46840,46848,46849,46853,46888,46889,46892,46895,46896,46904,46905,46907,46916,46920,46924,46932,46933,46944,46948,46952,46960,46961,46963,46965,46972,46973,46976,46979,46980,46988,46989,46991,46992,46993,46994,46998,46999,47000,47001,47004,47007,47008,47016,47017,47019,47020,47021,47028,47029,47032,47047,47049,47084,47085,47088,47091,47092,47100,47101,47103,47104,47105,47111,47112,47113,47116,47119,47120,47128,47129,47131,47133,47140,47141,47144,47148,47156,47157,47159,47160,47161,47168,47172,47185,47187,47196,47197,47200,47203,47204,47212,47213,47215,47217,47224,47228,47245,47272,47280,47284,47288,47296,47297,47299,47301,47308,47312,47316,47325,47327,47329,47336,47337,47340,47343,47344,47352,47353,47355,47357,47364,47384,47392,47420,47421,47424,47428,47436,47439,47441,47448,47449,47452,47456,47464,47465,47467,47469,47476,47477,47480,47483,47484,47492,47493,47495,47497,47498,47501,47502,47532,47533,47536,47539,47540,47548,47549,47551,47553,47560,47561,47564,47566,47567,47568,47569,47570,47576,47577,47579,47581,47582,47585,47587,47588,47589,47592,47595,47596,47604,47605,47607,47608,47609,47610,47616,47617,47624,47637,47672,47673,47676,47679,47680,47682,47688,47689,47691,47693,47694,47699,47700,47701,47704,47707,47708,47716,47717,47719,47720,47721,47728,47729,47732,47736,47747,47748,47749,47751,47756,47784,47785,47787,47788,47791,47792,47794,47800,47801,47803,47805,47812,47816,47832,47833,47868,47872,47876,47885,47887,47889,47896,47900,47904,47913,47915,47924,47925,47926,47928,47931,47932,47933,47934,47940,47941,47943,47945,47949,47951,47952,47956,47960,47969,47971,47980,48008,48012,48016,48036,48040,48044,48052,48055,48064,48065,48068,48071,48072,48080,48081,48083,48085,48120,48121,48124,48127,48128,48130,48136,48137,48139,48140,48141,48143,48145,48148,48149,48150,48151,48152,48155,48156,48157,48158,48159,48164,48165,48167,48169,48173,48176,48177,48180,48183,48184,48192,48193,48195,48196,48197,48201,48204,48205,48208,48221,48260,48261,48264,48267,48268,48270,48276,48277,48279,48281,48282,48288,48289,48292,48295,48296,48304,48305,48307,48308,48309,48316,48317,48320,48324,48333,48335,48336,48337,48341,48344,48348,48372,48373,48374,48376,48379,48380,48388,48389,48391,48393,48400,48404,48420,48428,48448,48456,48457,48460,48464,48472,48473,48484,48488,48512,48513,48516,48519,48520,48521,48522,48528,48529,48531,48533,48537,48538,48540,48548,48560,48568,48576,48577,48596,48597,48600,48604,48617,48624,48628,48632,48640,48643,48645,48652,48653,48656,48659,48660,48668,48669,48671,48673,48708,48709,48712,48715,48716,48718,48724,48725,48727,48729,48730,48731,48736,48737,48740,48744,48746,48752,48753,48755,48756,48757,48763,48764,48765,48768,48772,48780,48781,48783,48784,48785,48792,48793,48808,48848,48849,48852,48855,48856,48864,48867,48868,48869,48876,48897,48904,48905,48920,48921,48923,48924,48925,48960,48961,48964,48968,48976,48977,48981,48988,48989,49009,49044,49072,49093,49100,49101,49104,49108,49116,49119,49121,49212,49213,49233,49240,49244,49248,49256,49257,49296,49297,49300,49304,49312,49313,49315,49317,49324,49325,49327,49328,49331,49332,49333,49334,49340,49341,49343,49344,49345,49349,49352,49353,49356,49359,49360,49368,49369,49371,49372,49373,49380,49381,49384,49388,49396,49397,49399,49401,49406,49408,49412,49416,49424,49429,49436,49437,49438,49439,49440,49443,49444,49446,49447,49452,49453,49455,49456,49457,49462,49464,49465,49468,49471,49472,49480,49481,49483,49484,49485,49492,49493,49496,49500,49508,49509,49511,49512,49513,49520,49524,49528,49541,49548,49549,49550,49552,49555,49556,49558,49564,49565,49567,49569,49573,49576,49577,49580,49584,49597,49604,49608,49612,49620,49623,49624,49632,49636,49640,49648,49649,49651,49660,49661,49664,49668,49676,49677,49679,49681,49688,49689,49692,49695,49696,49704,49705,49707,49709,49711,49713,49714,49716,49736,49744,49745,49748,49752,49760,49765,49772,49773,49776,49780,49788,49789,49791,49793,49800,49801,49808,49816,49819,49821,49828,49829,49832,49835,49836,49837,49844,49845,49847,49849,49884,49885,49888,49891,49892,49899,49900,49901,49903,49905,49910,49912,49913,49915,49916,49920,49928,49929,49932,49933,49939,49940,49941,49944,49948,49956,49957,49960,49961,49989,50024,50025,50028,50032,50034,50040,50041,50044,50045,50052,50056,50060,50112,50136,50137,50140,50143,50144,50146,50152,50153,50157,50164,50165,50168,50184,50192,50212,50220,50224,50228,50236,50237,50248,50276,50277,50280,50284,50292,50293,50297,50304,50324,50332,50360,50364,50409,50416,50417,50420,50424,50426,50431,50432,50433,50444,50448,50452,50460,50472,50473,50476,50480,50488,50489,50491,50493,50500,50501,50504,50505,50506,50508,50509,50510,50515,50516,50517,50519,50520,50521,50525,50526,50528,50529,50532,50536,50544,50545,50547,50548,50549,50556,50557,50560,50564,50567,50572,50573,50575,50577,50581,50583,50584,50588,50592,50601,50612,50613,50616,50617,50619,50620,50621,50622,50628,50629,50630,50631,50632,50633,50634,50636,50638,50640,50641,50644,50648,50656,50657,50659,50661,50668,50669,50670,50672,50676,50678,50679,50684,50685,50686,50687,50688,50689,50693,50694,50695,50696,50700,50704,50712,50713,50715,50716,50724,50725,50728,50732,50733,50734,50736,50739,50740,50741,50743,50745,50747,50752,50753,50756,50760,50768,50769,50771,50772,50773,50780,50781,50784,50796,50799,50801,50808,50809,50812,50816,50824,50825,50827,50829,50836,50837,50840,50844,50852,50853,50855,50857,50864,50865,50868,50872,50873,50874,50880,50881,50883,50885,50892,50893,50896,50900,50908,50909,50912,50913,50920,50921,50924,50928,50936,50937,50941,50948,50949,50952,50956,50964,50965,50967,50969,50976,50977,50980,50984,50992,50993,50995,50997,50999,51004,51005,51008,51012,51018,51020,51021,51023,51025,51026,51027,51028,51029,51030,51031,51032,51036,51040,51048,51051,51060,51061,51064,51068,51069,51070,51075,51076,51077,51079,51080,51081,51082,51086,51088,51089,51092,51094,51095,51096,51098,51104,51105,51107,51108,51109,51110,51116,51117,51120,51123,51124,51132,51133,51135,51136,51137,51144,51145,51148,51150,51152,51160,51165,51172,51176,51180,51200,51201,51204,51207,51208,51210,51216,51217,51219,51221,51222,51228,51229,51232,51235,51236,51244,51245,51247,51249,51256,51260,51264,51272,51273,51276,51277,51284,51312,51313,51316,51319,51320,51322,51328,51329,51331,51333,51334,51335,51339,51340,51341,51348,51357,51359,51361,51368,51388,51389,51396,51400,51404,51412,51413,51415,51417,51424,51425,51428,51445,51452,51453,51456,51459,51460,51461,51462,51468,51469,51471,51473,51480,51500,51508,51536,51537,51540,51544,51552,51553,51555,51564,51568,51572,51580,51592,51593,51596,51599,51600,51608,51609,51611,51613,51648,51649,51652,51655,51656,51658,51664,51665,51667,51669,51670,51673,51674,51676,51677,51680,51682,51684,51687,51692,51693,51695,51696,51697,51704,51705,51708,51712,51720,51721,51723,51724,51725,51732,51736,51749,51753,51788,51789,51792,51796,51804,51805,51807,51808,51809,51816,51837,51844,51864,51900,51901,51904,51908,51916,51917,51919,51921,51923,51928,51929,51936,51948,51956,51976,51984,51988,51992,52000,52001,52033,52040,52041,52044,52048,52056,52057,52061,52068,52088,52089,52124,52152,52180,52196,52199,52201,52236,52237,52240,52244,52252,52253,52257,52258,52263,52264,52265,52268,52270,52271,52272,52280,52281,52283,52284,52285,52286,52292,52293,52296,52299,52300,52308,52309,52311,52312,52313,52320,52324,52326,52328,52336,52337,52341,52376,52377,52380,52383,52384,52392,52393,52395,52396,52397,52404,52405,52408,52411,52412,52420,52421,52423,52425,52432,52436,52452,52460,52464,52481,52488,52489,52492,52495,52496,52504,52505,52507,52509,52516,52520,52524,52537,52572,52576,52580,52588,52589,52591,52593,52600,52616,52628,52629,52632,52635,52636,52644,52645,52647,52649,52656,52676,52684,52688,52712,52716,52720,52728,52729,52731,52733,52740,52744,52748,52756,52761,52768,52769,52772,52775,52776,52784,52785,52787,52789,52824,52825,52828,52831,52832,52833,52840,52841,52843,52845,52852,52853,52856,52859,52860,52868,52869,52871,52873,52880,52881,52884,52887,52888,52896,52897,52899,52900,52901,52908,52909,52929,52964,52965,52968,52971,52972,52980,52981,52983,52984,52985,52992,52993,52996,52999,53000,53008,53009,53011,53013,53020,53024,53028,53036,53037,53039,53040,53041,53048,53076,53077,53080,53083,53084,53092,53093,53095,53097,53104,53105,53108,53112,53120,53125,53132,53153,53160,53168,53188,53216,53217,53220,53223,53224,53232,53233,53235,53237,53244,53248,53252,53265,53272,53293,53300,53301,53304,53308,53316,53317,53319,53321,53328,53332,53336,53344,53356,53357,53360,53363,53364,53372,53373,53377,53412,53413,53416,53419,53420,53428,53429,53431,53433,53440,53441,53444,53447,53448,53449,53456,53457,53459,53460,53461,53468,53469,53472,53475,53476,53484,53485,53487,53488,53489,53496,53517,53552,53553,53556,53559,53560,53562,53568,53569,53571,53572,53573,53580,53581,53584,53587,53588,53596,53597,53599,53601,53608,53612,53628,53636,53640,53664,53665,53668,53671,53672,53680,53681,53683,53685,53690,53692,53696,53720,53748,53752,53767,53769,53776,53804,53805,53808,53811,53812,53820,53821,53823,53825,53832,53852,53860,53888,53889,53892,53896,53904,53905,53909,53916,53920,53924,53932,53937,53944,53945,53948,53951,53952,53954,53960,53961,53963,53965,53972,53976,53980,53988,53989,54000,54001,54004,54007,54008,54016,54017,54019,54021,54028,54029,54030,54032,54035,54036,54038,54044,54045,54047,54048,54049,54053,54056,54057,54060,54063,54064,54072,54073,54075,54076,54077,54084,54085,54140,54141,54144,54147,54148,54156,54157,54159,54160,54161,54168,54169,54172,54175,54176,54184,54185,54187,54189,54196,54200,54204,54212,54213,54216,54217,54224,54232,54241,54243,54252,54253,54256,54259,54260,54268,54269,54271,54273,54280,54281,54301,54336,54340,54364,54368,54372,54381,54383,54392,54393,54396,54399,54400,54402,54408,54409,54411,54413,54420,54441,54476,54480,54484,54492,54495,54504,54508,54512,54520,54523,54525,54532,54533,54536,54539,54540,54548,54549,54551,54553,54588,54589,54592,54595,54596,54604,54605,54607,54609,54616,54617,54620,54623,54624,54625,54629,54632,54633,54635,54637,54644,54645,54648,54651,54652,54660,54661,54663,54664,54665,54672,54693,54728,54729,54732,54735,54736,54738,54744,54745,54747,54749,54756,54757,54760,54763,54764,54772,54773,54775,54777,54784,54785,54788,54792,54800,54801,54803,54804,54805,54812,54816,54820,54829,54840,54841,54844,54847,54848,54853,54856,54857,54859,54861,54865,54868,54869,54872,54876,54887,54889,54896,54897,54900,54915,54917,54924,54925,54928,54932,54941,54943,54945,54952,54956,54960,54969,54971,54980,54981,54984,54987,54988,54993,54996,54997,54999,55001,55008,55012,55016,55024,55029,55036,55037,55040,55044,55057,55064,55065,55068,55072,55080,55081,55083,55085,55092,55093,55096,55100,55108,55111,55113,55120,55121,55124,55126,55127,55128,55129,55136,55137,55139,55141,55145,55148,55152,55156,55164,55165,55169,55176,55177,55180,55183,55184,55192,55193,55195,55197,127783,127794,127795,127800,127801,127804,127807,127808,127810,127812,127815,127817,127824,127827,127834,127836,127873,127956,127968,127973,128026,128038,128045,128046,128054,128066,128069,128074,128083,128207,128263,128266,128273,128274,128293,128546,128681,128719,129364,129371,129406,129408,129409,129417,129419,129420,129460,129463,129482,129485,129495,129510,129689,129694,129695,129697,129716]);
function v9SignTextSupported(text){return [...String(text)].every(ch=>V9_SIGN_CMAP.has(ch.codePointAt(0)));}
function v9SafeSyllableReplacement(syllable,slot,wanted){
  const original=decom(syllable),safeCoda={'밥':'ㄱ','박':'ㄴ','먹':'ㅇ','국':'ㅇ','병':'ㄴ'};
  const pool=slot===0?CHO:slot===1?JUNG:JONGL;
  const candidates=[wanted,slot===2?safeCoda[syllable]:undefined,...pool];
  for(const value of candidates){
    if(value===undefined||value===null||value===original[slot])continue;
    const d=original.slice();d[slot]=value;const glyph=compose(d[0],d[1],d[2]||null);
    if(v9SignTextSupported(glyph))return {glyph,value};
  }
  throw new Error('지원되는 혼동 글자가 없습니다: '+syllable+' / '+slot);
}
function v9ConfusableJamo(slot,ch){
  const pairs={
    initial:{'ㄱ':'ㅋ','ㄲ':'ㄱ','ㄴ':'ㄷ','ㄷ':'ㅌ','ㄸ':'ㄷ','ㄹ':'ㄴ','ㅁ':'ㅂ','ㅂ':'ㅁ','ㅃ':'ㅂ','ㅅ':'ㅈ','ㅆ':'ㅅ','ㅇ':'ㅎ','ㅈ':'ㅊ','ㅉ':'ㅈ','ㅊ':'ㅈ','ㅋ':'ㄱ','ㅌ':'ㄷ','ㅍ':'ㅂ','ㅎ':'ㅇ'},
    medial:{'ㅏ':'ㅓ','ㅐ':'ㅔ','ㅑ':'ㅏ','ㅒ':'ㅖ','ㅓ':'ㅏ','ㅔ':'ㅐ','ㅕ':'ㅓ','ㅖ':'ㅒ','ㅗ':'ㅜ','ㅘ':'ㅝ','ㅙ':'ㅞ','ㅚ':'ㅟ','ㅛ':'ㅗ','ㅜ':'ㅗ','ㅝ':'ㅘ','ㅞ':'ㅙ','ㅟ':'ㅚ','ㅠ':'ㅜ','ㅡ':'ㅣ','ㅢ':'ㅣ','ㅣ':'ㅡ'},
    final:{'ㄱ':'ㅋ','ㄲ':'ㄱ','ㄳ':'ㄱ','ㄴ':'ㅇ','ㄵ':'ㄴ','ㄶ':'ㄴ','ㄷ':'ㅌ','ㄹ':'ㄴ','ㄺ':'ㄹ','ㄻ':'ㄹ','ㄼ':'ㄹ','ㄽ':'ㄹ','ㄾ':'ㄹ','ㄿ':'ㄹ','ㅀ':'ㄹ','ㅁ':'ㅇ','ㅂ':'ㅍ','ㅄ':'ㅂ','ㅅ':'ㅆ','ㅆ':'ㅅ','ㅇ':'ㅁ','ㅈ':'ㅊ','ㅊ':'ㅈ','ㅋ':'ㄱ','ㅌ':'ㄷ','ㅍ':'ㅂ','ㅎ':'ㅇ'}
  };
  return pairs[['initial','medial','final'][slot]][ch]||(slot===1?'ㅏ':'ㄱ');
}
function v9OnePieceWrong(it){
  if(it.uType==='jamo'){
    let d=v9ConfusableJamo(it.slot,it.ch);
    if(!v9SignTextSupported(d)){const pool=it.slot===1?JUNG:it.slot===2?JONGL:CHO;d=pool.find(x=>x&&x!==it.ch&&v9SignTextSupported(x));if(!d)throw new Error('지원되는 자모가 없습니다: '+it.ch);}
    return {dist:d,change:{from:it.ch,to:d,slot:['initial','medial','final'][it.slot],syllable:it.syl,components:1}};
  }
  const chars=[...it.word],target=v9TargetSyllables(it.word,it.setOf);
  const si=it.uType==='syl'?it.syl:target[Math.floor(Math.random()*target.length)];
  const d=decom(chars[si]),hasTargetCoda=it.setOf>=4&&it.setOf!==6&&it.setOf!==7;
  const slot=hasTargetCoda&&d[2]?2:Math.floor(Math.random()*2);
  const old=d[slot],wanted=slot===2&&Math.random()<.5?'':v9ConfusableJamo(slot,old);
  const safe=v9SafeSyllableReplacement(chars[si],slot,wanted),replacement=safe.value;chars[si]=safe.glyph;
  return {dist:it.uType==='word'?chars.join(''):chars[si],change:{from:old,to:replacement||'∅',slot:['initial','medial','final'][slot],syllable:si,components:1}};
}
function v3JamoPairIsConfusable(slot,a,b){
  const groups=slot===1?jungG:slot===2?jongG:choG;
  return a===b||v9ConfusableJamo(slot,a)===b||v9ConfusableJamo(slot,b)===a||groups.some(group=>group.includes(a)&&group.includes(b));
}
function v9OrdinaryWrong(it,own){
  // A one-component alternative such as 해/개 belongs to a confusion trial.
  // Ordinary word/syllable trials require at least two different components.
  if(it.uType==='word'||it.uType==='syl'){
    const ordinary=x=>x!==it.ch&&v9SignTextSupported(x)&&v9JamoChanges(it.ch,x).length>=2;
    const local=it.uType==='word'?own.map(o=>o.word):own.filter(o=>o.word!==it.word).flatMap(o=>[...o.word]);
    const game=it.uType==='word'?SETS.flatMap(s=>s.words.map(w=>w[0])):SETS.flatMap(s=>s.words.flatMap(w=>[...w[0]]));
    const candidates=[...new Set(local)].filter(ordinary),fallback=[...new Set(game)].filter(ordinary);
    const choices=candidates.length?candidates:fallback;
    if(!choices.length)throw new Error('서로 다른 일반 표지판이 없습니다: '+it.ch);
    return choices[Math.floor(Math.random()*choices.length)];
  }
  const ordinaryJamo=x=>x!==it.ch&&v9SignTextSupported(x)&&!v3JamoPairIsConfusable(it.slot,it.ch,x);
  const candidates=[];
  for(const o of own){if(o.word===it.word)continue;for(const u of unitsOf({key:'pho'},o))if(u.slot===it.slot&&ordinaryJamo(u.ch))candidates.push(u.ch);}
  if(candidates.length)return candidates[Math.floor(Math.random()*candidates.length)];
  const game=SETS.flatMap((s,si)=>s.words.flatMap((w,wi)=>unitsOf({key:'pho'},cw(si,wi)))).filter(u=>u.slot===it.slot).map(u=>u.ch);
  const pool=[...new Set(game)].filter(ordinaryJamo);
  if(!pool.length)throw new Error('서로 다른 일반 자모가 없습니다: '+it.ch);
  return pool[Math.floor(Math.random()*pool.length)];
}
function v9ArrangeChunks(chunks,rng=Math.random,priority=new Set()){
  for(let attempt=0;attempt<300;attempt++){
    const left=v9Shuffle(chunks,rng),out=[];let last='',run=0;
    while(left.length){
      let eligible=left.map((c,i)=>i).filter(i=>left[i].word!==last||run+left[i].units.length<=2);
      if(!out.length&&priority.size){const first=eligible.filter(i=>priority.has(left[i].word));if(first.length)eligible=first;}
      if(!eligible.length)break;
      const i=eligible[Math.floor(rng()*eligible.length)],o=left.splice(i,1)[0];out.push(o);run=o.word===last?run+o.units.length:o.units.length;last=o.word;
    }
    if(!left.length)return out;
  }
  return chunks;
}
function v5ArrangeChaseChunks(chunks,ci,sl){
  // Ten syllable floors can be completely occupied after the two calm opening
  // floors. Arrange complete syllable pairs and partial target prompts together
  // with the published confusion count, so a dense coda stage never becomes
  // impossible simply because its chunks were shuffled into the wrong order.
  // For 4/3/3 responses this is four full pairs plus two one-syllable prompts
  // with the other syllable prefilled. Five learned-coda slots remain after
  // one full calm pair, allowing the exact 5-confusion/3-terrain schedule.
  const counts=v9PatternCounts(ci,sl,4),order=v9Shuffle(chunks),used=new Set(),out=[];
  const visit=(last,run)=>{
    if(out.length===order.length){
      const trial=out.flatMap(o=>o.units.map(u=>({word:o.word,setOf:o.set,uType:u.type,syl:u.syl}))),eligible=trial.map(v9ConfusionEligible);
      try{v9SymbolPattern(trial.length,counts.sim,counts.terrain,2,v9Rng(64019+sl),eligible);return true;}catch(e){return false;}
    }
    for(let i=0;i<order.length;i++){
      if(used.has(i))continue;const o=order[i],nextRun=o.word===last?run+o.units.length:o.units.length;if(nextRun>2)continue;
      used.add(i);out.push(o);if(visit(o.word,nextRun))return true;out.pop();used.delete(i);
    }
    return false;
  };
  if(!visit('',0))throw new Error('PDF v5 syllable chase cannot satisfy its coda pattern: '+sl);
  return out;
}
function v9RequestedWords(ci,sl,pi){
  const c=COUNTRIES[ci],set=c.sets[sl],own=[0,1,2].map(i=>cw(set,i));
  const count=(ci===2?[6,5,5,5,10,10,10,7,21]:[6,7,7,7,15,15,15,10,21])[pi];
  let list=[];const priority=new Set();
  if(pi===8){
    if(typeof v5IncomingDeficit==='function')v5IncomingDeficit(ci,sl).forEach(d=>priority.add(d.word));
    if(typeof v9WordSupport==='function'&&typeof V9M!=='undefined')v9WordSupport(ci,sl,V9M.logs).needsReview.forEach(word=>priority.add(word));
  }
  const pickReview=(pool,n)=>{const first=pool.filter(o=>priority.has(o.word)).slice(0,n);return [...first,...pickWeighted(pool,n-first.length)];};
  if(pi!==8){
    const n=Math.floor(count/3);for(let r=0;r<n;r++)list.push(...own);
    for(let k=0;k<count%3;k++)list.push(own[(Math.max(0,pi-1)+k)%3]);
    if(pi>=1&&pi<=3&&typeof v5IncomingDeficit==='function'){
      const focus=v5IncomingDeficit(ci,sl)[0];
      if(focus){
        const source=SETS[focus.setOf]?.words.find(w=>w[0]===focus.word),tracked={word:focus.word,emoji:focus.em||focus.emoji||source?.[1]||'⭐',set:focus.setOf};
        const counts=own.map(o=>({word:o.word,n:list.filter(w=>w.word===o.word).length})),max=Math.max(...counts.map(o=>o.n));
        const target=counts.filter(o=>o.n===max)[(pi-1)%counts.filter(o=>o.n===max).length].word;
        list=list.map(o=>o.word===target?tracked:o);
      }
    }
  }else{
    const oldCount=sl===0?0:(typeof v9SummitOldCount==='function'?v9SummitOldCount(ci,sl):12),ownCount=count-oldCount;
    for(let r=0;r<Math.floor(ownCount/3);r++)list.push(...own);for(let k=0;k<ownCount%3;k++)list.push(own[k]);
    if(oldCount){const recent=[],earlier=[];for(let s=0;s<sl;s++)for(let i=0;i<3;i++)(s>=sl-2?recent:earlier).push(cw(c.sets[s],i));
      const r=earlier.length?Math.ceil(oldCount/2):oldCount;list.push(...pickReview(recent,r));if(earlier.length)list.push(...pickReview(earlier,oldCount-r));
    }
  }
  return {own,list,count,priority};
}
function v9MakePlan(ci,sl,pi,rx){
  const c=COUNTRIES[ci],setOf=c.sets[sl],request=v9RequestedWords(ci,sl,pi),teacher=window.GLIM&&typeof GLIM.teacherDifficulty==='function'?GLIM.teacherDifficulty(c.key):{confusion:0,speed:0,variants:0};
  if(pi===0){
    const first=v5MakeIntroCycle(ci,sl,1),firstOrder=[...new Set(first.map(it=>it.word))].map(word=>request.own.find(o=>o.word===word)),second=v5MakeIntroCycle(ci,sl,2,firstOrder),plan=[...first,...second];
    let previousSide=null,sideRun=0;plan.forEach((it,i)=>{if(it.side===previousSide&&sideRun>=3)it.side=1-it.side;sideRun=it.side===previousSide?sideRun+1:1;previousSide=it.side;it.v9PlanIndex=i;it.meta.measurementFloor=i+1;it.meta.panTrial=i+1;it.meta.totalMeasurementFloors=plan.length;});
    plan.v9WordCount=6;plan.v9ActualFloors=plan.length;plan.v9Teacher={confusion:0,speed:0,variants:0};plan.v9Counts={reference:{sim:0,terrain:0},actual:{sim:0,terrain:0},phonemeProportional:ci===2};return plan;
  }
  const slots=[];
  if(ci===1){
    // Count actual response floors. For an odd final occurrence the other syllable is prefilled.
    const byWord=new Map();request.list.forEach(o=>{if(!byWord.has(o.word))byWord.set(o.word,{o,n:0});byWord.get(o.word).n++;});
    const chunks=[];
    for(const {o,n} of byWord.values()){
      const all=unitsOf(c,o);for(let k=0;k<Math.floor(n/2);k++)chunks.push({...o,units:all,indices:[0,1]});
      if(n%2){const targets=v9TargetSyllables(o.word,o.set),si=targets[(pi+sl)%targets.length];chunks.push({...o,units:[all[si]],allUnits:all,indices:[si],prefilled:all.map((u,i)=>i!==si?i:-1).filter(i=>i>=0)});}
    }
    (pi===7?v5ArrangeChaseChunks(chunks,ci,sl):v9ArrangeChunks(chunks,Math.random,request.priority)).forEach((o,wi)=>o.units.forEach((u,ui)=>slots.push({o,u,ui:o.indices[ui],units:o.allUnits||o.units,wordOrdinal:wi+1,prefilled:o.prefilled||[]})));
  }else{
    (request.priority.size?v9ArrangeChunks(request.list.map(o=>({...o,units:[null]})),Math.random,request.priority):arrangeNoRun(request.list,2)).forEach((o,wi)=>{const units=unitsOf(c,o);units.forEach((u,ui)=>slots.push({o,u,ui,units,wordOrdinal:wi+1,prefilled:[]}));});
  }
  const pan=PANS[pi],measureLength=request.count,plan=[];
  slots.forEach(({o,u,ui,units,wordOrdinal,prefilled},i)=>{
    const side=Math.random()<.5?0:1,last=plan.slice(-3),safeSide=last.length===3&&last.every(x=>x.side===side)?1-side:side;
    plan.push({word:o.word,emoji:o.emoji,isOld:o.set!==setOf,setOf:o.set,units,ui,ch:u.ch,uType:u.type,slot:u.slot,syl:u.syl,
      dist:'',distType:'dissim',side:safeSide,v:'clean',v9Variant:null,v9PlanIndex:i,v9Prefilled:prefilled,relaxed:false,redo:false,hint:false,rxApplied:false,
      meta:{intro:pi===0,chase:pi===7,summit:pi===8,panKind:pi===0?'intro':pi===7?'chase':pi===8?'summit':pi<=3?'short':'long',speed:pan.sp,
        length:measureLength,measureLength,measurementFloor:i+1,panTrial:i+1,wordOrdinal,wordGroup:wordOrdinal,setType:SETS[o.set].type,
        hintUsed:false,relaxedRx:false,stairVariant:null,reclimb:false,sameStepRetry:false,jumpPass:false,
        syllablePrefilled:prefilled.slice(),prefillNotAssessed:prefilled.length>0,phonemeWords:ci===2?request.count:null,
        totalMeasurementFloors:slots.length,measurementHalf:i+1<v3HalfwayFloor(ci,slots.length)?'early':'late',
        environmentVersion:'stairs-pdf-v5-2026-10',deficitReview:request.priority.has(o.word),
        planBasis:ci===1?'actual_response_floors':ci===2?'whole_words_expanded_to_jamo':'word_per_floor'}});
  });
  const pat=v9BuildPattern(ci,sl,pi,plan,teacher),theme=v9Theme(ci,sl);let variantNumber=0;
  plan.forEach((it,i)=>{
    Object.assign(it.meta,v3LearningTarget(it));
    it.v=pat[i];if(it.v==='sim'){const v=v9OnePieceWrong(it);it.dist=v.dist;it.meta.jamoChanged=v.change;it.distType='sim';it.sim=true;}
    else it.dist=v9OrdinaryWrong(it,request.own);
    if(it.v==='terrain'){it.v9Variant=theme.variants[variantNumber++%theme.variants.length];it.meta.stairVariant=it.v9Variant;it.step=it.v9Variant;it.excluded=true;}
  });
  if(pi>0&&pi<7){
    if(rx.eff>=1&&pan.sp!=='low'){
      const warmups=plan.slice(0,2).map((it,i)=>({...it,meta:{...it.meta,panKind:'warmup',measurementFloor:null,panTrial:null,wordOrdinal:'warmup-'+i,wordGroup:'warmup-'+i,
        measurementHalf:null,insertedSupport:true,relaxedRx:true,rxApplied:true,rxReason:'speed_warmup',effectiveSpeed:SLOWER[pan.sp]},
        v:'clean',sim:false,distType:'dissim',dist:v9OrdinaryWrong(it,request.own),v9Variant:null,step:null,excluded:false,hint:false,relaxed:true,rxApplied:true}));
      warmups.forEach(it=>{it.meta.stairVariant=null;delete it.meta.jamoChanged;});plan.unshift(...warmups);
    }
    if(rx.sus>=2&&pi>=4){const it=plan.find(x=>x.meta.measurementHalf==='late'&&x.v==='sim')||plan.find(x=>x.v==='sim');if(it){it.v='clean';it.sim=false;it.distType='dissim';it.dist=v9OrdinaryWrong(it,request.own);it.meta.originalJamoChanged=it.meta.jamoChanged;delete it.meta.jamoChanged;it.meta.confusionRemoved=true;it.meta.rxReason='one_confusion_removed';}}
    if(rx.sus>=1&&pi>=4){const at=plan.findIndex(it=>it.meta.measurementFloor===v3HalfwayFloor(ci,slots.length));
      if(at>=0)plan.splice(at,0,{rest:true,v9PlanIndex:at,meta:{relaxedRx:true,insertedSupport:true,rest:true,panKind:'rest',panTrial:null,measurementFloor:null,totalMeasurementFloors:slots.length,rxReason:'midpoint_rest'}});
    }
  }
  plan.forEach((it,i)=>{it.v9PlanIndex=i;if(teacher.speed&&pi>0&&pi<7){it.meta.teacherAdjusted=true;it.meta.relaxedRx=true;}});
  plan.v9WordCount=request.count;plan.v9ActualFloors=slots.length;plan.v9Teacher=teacher;return plan;
}
function v9RecordEvent(type,details){if(typeof v9Event==='function')return v9Event(type,{ts:Date.now(),type,panId:G.panId,country:country().key,set:G.sl,pan:G.pi,...details});const events=LS.get('v12.events',[]);events.push({ts:Date.now(),type,panId:G.panId,country:country().key,set:G.sl,pan:G.pi,...details});LS.set('v12.events',events);}
function v9PrepareGate(ci,sl,pi){
  const set=COUNTRIES[ci].sets[sl],own=[0,1,2].map(i=>cw(set,i));
  const questions=v9Shuffle(own).map((o,i)=>{const side=Math.random()<.5?0:1,d=own.find(w=>w.word!==o.word).word;return {...o,side,options:side===0?[o.word,d]:[d,o.word],firstCorrect:null,tries:0};});
  G.v9Gate={id:G.panId+':gate',country:COUNTRIES[ci].key,set:sl,pan:pi,questions,index:0,feedback:null,picked:null,correct:0,remaining:3,startedAt:Date.now()};G.phase='gate';say(questions[0].word);
}
function v9SaveGate(){
  const g=G.v9Gate;if(!g)return;
  const rec={id:g.id,game:'stairs',country:g.country,set:g.set,pan:g.pan,wordSet:COUNTRIES[G.ci].sets[G.sl],at:Date.now(),firstCorrect:g.questions.filter(q=>q.firstCorrect===true).length,
    count:3,questions:g.questions.map(q=>({word:q.word,firstCorrect:q.firstCorrect,tries:q.tries,rt:q.firstRT})),completed:true,threshold:null,teacherReview:g.questions.some(q=>q.firstCorrect===false)};
  // This neutral shared key can be used by Racing/Break as well; no cross-game data is fabricated.
  let book;try{book=JSON.parse(previewStorage.getItem('glim.shared.gates.v1')||'[]');if(!Array.isArray(book))book=[];}catch(e){book=[];}
  book.push(rec);try{previewStorage.setItem('glim.shared.gates.v1',JSON.stringify(book));}catch(e){}
  const own=LS.get('v10.gates',[]);own.push(rec);LS.set('v10.gates',own);G.v9LastGate=rec;
}
function v9GateChoose(side){
  const g=G.v9Gate;if(G.phase!=='gate'||!g||g.feedback||side<0||side>1)return;
  const q=g.questions[g.index];if(!q)return;initAudio();const ok=side===q.side;g.picked=side;q.tries++;
  if(q.firstCorrect===null){q.firstCorrect=ok;q.firstRT=+(G.t-(g.floorBorn??G.t)).toFixed(3);if(ok)g.correct++;}
  g.feedback=ok?'ok':'wrong';sfx(ok?'step':'wrong');if(!ok)say(q.word);
  const id=g.id;setTimeout(()=>{
    if(G.phase!=='gate'||!G.v9Gate||G.v9Gate.id!==id)return;
    if(ok){g.index++;g.remaining=3-g.index;if(g.index>=3){v9SaveGate();v9BeginPlay();return;}g.floorBorn=G.t;say(g.questions[g.index].word);}
    g.feedback=null;g.picked=null;
  },ok?720:950);
}
function v9BeginPlay(){
  G.phase='play';G.v9Gate=null;G.floorBorn=G.t;G.time=G.timeMax;
  toast(v9Theme().name+' · '+(G.sl+1)+'세트 · '+v9StageLabel(G.ci,G.sl,G.pi),2);onNewFloor();
}
function v5ReindexPlan(){G.plan.forEach((it,i)=>it.v9PlanIndex=i);}
function v5MakeIntroCycle(ci,sl,cycle,words,prior){
  const c=COUNTRIES[ci],own=[0,1,2].map(i=>cw(c.sets[sl],i)),ordered=words?words.slice():v9Shuffle(own);
  const out=[];
  for(const o of ordered){
    const state=cycle>=3?G.v5IntroState?.[o.word]:null,all=unitsOf(c,o),indices=all.map((u,i)=>i);
    const hint=cycle>=3&&!!state?.needsRetry&&!state?.assistedDone&&(state?.errorCount||0)>=2,wordOrdinal='intro-'+cycle+'-'+o.word;
    for(const ui of indices){const u=all[ui],side=Math.random()<.5?0:1,prefilled=[];
      const it={word:o.word,emoji:o.emoji,isOld:false,setOf:o.set,units:all,ui,ch:u.ch,uType:u.type,slot:u.slot,syl:u.syl,
        dist:'',distType:'dissim',side,v:'clean',v9Variant:null,v9PlanIndex:out.length,v9Prefilled:prefilled,relaxed:false,redo:false,hint,rxApplied:false,
        meta:{intro:true,chase:false,summit:false,panKind:'intro',introCycle:cycle,introEmphasis:hint,hintUsed:hint,hintReason:hint?'intro_two_previous_errors':null,
          speed:null,length:6,measureLength:6,measurementFloor:null,panTrial:null,wordOrdinal,wordGroup:wordOrdinal,setType:SETS[o.set].type,
          relaxedRx:false,stairVariant:null,reclimb:false,sameStepRetry:false,jumpPass:false,syllablePrefilled:prefilled.slice(),prefillNotAssessed:prefilled.length>0,
          phonemeWords:ci===2?6:null,totalMeasurementFloors:null,measurementHalf:null,environmentVersion:'stairs-pdf-v5-2026-10',
          planBasis:ci===1?'complete_words_in_two_untimed_cycles':ci===2?'whole_words_expanded_to_jamo':'word_per_floor'}};
      Object.assign(it.meta,v3LearningTarget(it));it.dist=v9OrdinaryWrong(it,own);out.push(it);
    }
  }
  return out;
}
function v5AppendIntroRetry(){
  if(G.pi!==0)return false;
  const own=[0,1,2].map(i=>cw(country().sets[G.sl],i)),needed=own.filter(o=>G.v5IntroState[o.word]?.needsRetry&&!G.v5IntroState[o.word]?.assistedDone);
  if(!needed.length)return false;
  const cycle=(G.v5IntroCycle||2)+1,order=[...new Set(G.plan.filter(it=>it.meta.introCycle===1).map(it=>it.word))].map(word=>own.find(o=>o.word===word)),added=v5MakeIntroCycle(G.ci,G.sl,cycle,order);
  G.v5IntroCycle=cycle;G.plan.push(...added);v5ReindexPlan();
  G.v9WordCount+=order.length;G.v9ActualFloors+=added.length;G.plan.v9WordCount=G.v9WordCount;G.plan.v9ActualFloors=G.v9ActualFloors;
  added.forEach(it=>{it.meta.panId=G.panId;it.meta.totalMeasurementFloors=G.v9ActualFloors;});
  v9RecordEvent('intro_retry_cycle',{cycle,words:order.map(o=>o.word),needsRetry:needed.map(o=>o.word),emphasized:added.filter(it=>it.hint).map(it=>it.word)});return true;
}
/* Wrong attempts never register a new stair. The same prompt is retried. */
function v13BounceWrong(it,side){
  const c=G.char,from={x:G.pos.x,y:G.pos.y},target=candPos(side),duration=.58;
  c.face=side?1:-1;c.bump=0;c.jump=0;c.land=0;c.inputLock=duration;
  c.motion={type:'bump',elapsed:0,duration,from,to:{...from},
    impact:{x:from.x+(target.x-from.x)*.64,y:from.y-STEP_H*.36},contact:false};
  G.v13WrongFeedback={at:G.t,side,index:G.i,duration:.72};
  G.shake=.2;G.flash=.22;
  it.retried=true;it.meta.timePenaltySeconds=0;
  G.floorBorn=G.t;
}
function v5IntroAnswer(it,side,ok){
  const state=G.v5IntroState[it.word]||(G.v5IntroState[it.word]={errorCount:0,needsRetry:false,assistedDone:false,failedUnit:null});
  if(!ok){
    state.errorCount++;state.needsRetry=true;state.failedUnit=it.ui;
    G.combo=0;G.prevWrong=true;G.floorErr=true;
    G.wrongRun[it.word]=(G.wrongRun[it.word]||0)+1;
    sfx('wrong');v13BounceWrong(it,side);return;
  }
  const fullLast=it.ui===it.units.length-1;
  if(fullLast){state.needsRetry=false;state.failedUnit=null;if(it.meta.introEmphasis)state.assistedDone=true;}
  G.nOK++;G.sessionStars++;G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);
  G.prevWrong=G.floorErr;G.floorErr=false;G.wrongRun[it.word]=0;sfx('step');
  const tgt=candPos(side);
  climbTo(tgt,{sign:options(it)[side],progressIndex:G.i+1,introOutcome:'correct'});
  if(fullLast&&it.uType!=='word')sfx('word');
  G.i++;
}
function v5ResumeAfterPause(pause){
  if(!pause||G.phase!=='play')return;
  G.v5Pause=null;G.char.inputLock=0;
  if(pause.kind==='rest'){
    const it=curItem();if(it?.rest){logRow(it,null,null,null);v9RecordEvent('midpoint_rest',{duration:pause.duration||2,nextMeasurementFloor:G.plan[G.i+1]?.meta.measurementFloor});G.i++;if(G.i>=G.plan.length)panClear();else onNewFloor();}
  }else{G.floorBorn=G.t;G.replays=0;}
}
function installV9Gameplay(){
  PANS.splice(0,PANS.length,{name:'소개판',sp:null},{name:'7층·하',sp:'low'},{name:'7층·중',sp:'mid'},{name:'7층·상',sp:'high'},
    {name:'15층·하',sp:'low'},{name:'15층·중',sp:'mid'},{name:'15층·상',sp:'high'},{name:'추격판',sp:'low',chase:true},{name:'정상판',sp:'low',top:true});
  COUNTRIES[0].lens=[6,7,7,7,15,15,15,10,21];COUNTRIES[1].lens=[6,7,7,7,15,15,15,10,21];COUNTRIES[2].lens=[6,5,5,5,10,10,10,7,21];
  COUNTRIES[1].themes=['해변','정글','화산'];COUNTRIES[2].themes=['돌탑','얼음탑','불꽃탑'];
  v9CompletedStages();panLabel=(c,pi)=>v9StageLabel(COUNTRIES.indexOf(c),G.sl,pi);
  prog=()=>{const p={};COUNTRIES.forEach((c,ci)=>{p[ci]={};c.sets.forEach((s,sl)=>{p[ci][sl]={};for(let pi=0;pi<9;pi++)p[ci][sl][pi]=v9StarsOf(ci,sl,pi);});});return p;};
  starsOf=v9StarsOf;setCleared=(ci,sl)=>Array.from({length:9},(_,pi)=>pi).every(pi=>v9StageCompleted(ci,sl,pi));setUnlocked=v9SetUnlocked;panUnlocked=v9PanUnlocked;
  buildPan=v9MakePlan;
  const baseReset=resetVisual;
  resetVisual=function(){baseReset();G.v9Positions=[{x:0,y:0}];G.floors[0].progressIndex=0;G.v9Catch=null;G.v9TerrainFX=null;G.v9IceRemaining=0;G.v9IceAfterFloor=false;G.v5Pause=null;G.v13WrongFeedback=null;};
  startPan=function(ci,sl,pi){
    if(!COUNTRIES[ci]||sl<0||sl>=COUNTRIES[ci].sets.length||pi<0||pi>8)return;
    if(!v9PanUnlocked(ci,sl,pi)){toast('앞 단계를 완주하면 열려요',2);return;}
    G.ci=ci;G.sl=sl;G.pi=pi;G.rx=rxLoad(COUNTRIES[ci].key);G.v9Theme=v9Theme(ci,sl);resetVisual();
    G.v5IntroState={};G.v5IntroCycle=2;
    G.plan=buildPan(ci,sl,pi,G.rx);G.i=0;G.balloons=3;G.slides=0;G.v5Misses=0;G.sessionStars=0;G.redoUntil=-1;G.prevWrong=false;G.floorErr=false;G.replays=0;G.early=0;G.rest=0;
    G.wrongRun={};G.v9HintedWords={};G.v9StageWrongStreak={};G.v9NewFriend=null;G.v9WordCount=G.plan.v9WordCount;G.v9ActualFloors=G.plan.v9ActualFloors;
    const attempts=LS.get('v12.attempts',{}),k=v9StageKey(ci,sl,pi);G.attempt=(attempts[k]||0)+1;attempts[k]=G.attempt;LS.set('v12.attempts',attempts);
    G.panId='stairs-pdf-v5:'+k+':'+Date.now()+':'+G.attempt;G.v9StartedAt=Date.now();G.v9Committed=false;
    G.v9EffectiveSpeed=PANS[pi].sp;if(pi>0&&pi<7&&G.plan.v9Teacher.speed&&G.v9EffectiveSpeed)G.v9EffectiveSpeed={low:'mid',mid:'high',high:'high'}[G.v9EffectiveSpeed];
    G.budget=G.v9EffectiveSpeed?BUDGET[G.v9EffectiveSpeed]:0;G.timeMax=G.budget*2;G.time=G.timeMax;G.floorBorn=G.t;G.nOK=0;G.nAns=0;G.v9FirstOK=0;G.v9FirstAnswers=0;
    G.plan.forEach(it=>{it.meta=it.meta||{};it.meta.panId=G.panId;it.meta.speed=G.v9EffectiveSpeed;});
    if(typeof v9PreparePanHints==='function')v9PreparePanHints(G.plan);
    ovClear.style.display='none';initAudio();
    if(typeof v5StartStageGate==='function'){if(!v5StartStageGate(ci,sl,pi))v9BeginPlay();}
    else if(pi===0||pi===1){v9PrepareGate(ci,sl,pi);G.v9Gate.floorBorn=G.t;}else v9BeginPlay();
  };
  floorBudget=function(){const it=curItem();if(!it||it.rest||!G.budget)return G.budget;return it.relaxed?BUDGET[SLOWER[G.v9EffectiveSpeed||PANS[G.pi].sp]]:G.budget;};
  onNewFloor=function(){
    G.floorBorn=G.t;G.replays=0;G.early=0;const it=curItem();if(!it)return;
    it.meta=it.meta||{};it.meta.reclimb=false;it.redo=false;it.meta.prevWrong=G.prevWrong;
    if(G.v9IceAfterFloor&&!it.rest){it.meta.afterIce=true;G.v9IceAfterFloor=false;}
    if(it.rest){G.v5Pause={kind:'rest',remaining:2,duration:2,hideSigns:true};return;}
    if(G.budget){const wanted=2*floorBudget(),delta=wanted-G.timeMax;G.timeMax=wanted;G.time=Math.max(0,Math.min(wanted,G.time+Math.max(0,delta)));}
    if(G.pi!==0&&typeof v9PrepareFloor==='function')v9PrepareFloor(it);
    if(it.ui===0||it.v9Prefilled?.length||it.hintSay)say(it.word);
  };
  const originalClimb=climbTo;
  climbTo=function(tgt,extra){
    const it=curItem(),data={...(extra||{}),v9Variant:it?.v9Variant||null};originalClimb(tgt,data);
    if(it?.v9Variant==='jump'&&G.char.motion)G.char.motion.duration+=.1;
    if(it?.v9JumpCompletedWord&&G.char.motion&&typeof v7jState!=='undefined'){const duration=G.char.motion.duration;v7jState.completed={word:it.v9JumpCompletedWord,start:G.t+duration*.52,end:G.t+duration+.78};}
    const next=data.progressIndex??G.i+1;G.v9Positions[next]={...tgt};
    if(next===G.i+2)G.v9Positions[G.i+1]={x:(G.char.motion.from.x+tgt.x)/2,y:(G.char.motion.from.y+tgt.y)/2};
  };
  if(typeof v7jDrawTile==='function'){
    const baseJamoTile=v7jDrawTile;
    v7jDrawTile=function(tile,it,flight){
      if(it?.v9JumpCompletedWord&&flight&&G.t-flight.start>=flight.duration*.52){const completePreview={...it,ui:it.units.length};return baseJamoTile(tile,completePreview,null);}
      return baseJamoTile(tile,it,flight);
    };
  }
  finishAscent=function(){
    const moved=G.v9LandingVariant;G.pendingAdvance=false;G.transitionItem=null;G.v9LandingVariant=null;
    if(G.phase!=='play')return;
    if(moved){G.v9TerrainFX={type:moved,at:G.t,x:G.pos.x,y:G.pos.y};if(moved==='ice'){G.v9IceRemaining=.3;G.char.inputLock=Math.max(G.char.inputLock,.3);G.v9IceAfterFloor=true;}}
    if(G.i>=G.plan.length&&!v5AppendIntroRetry())panClear();else onNewFloor();
  };
  // Compatibility name: a depleted timer now records one omission and advances; no stage ever rolls back.
  slide=function(reason){
    if(G.phase!=='play'||G.pi===0||G.pendingAdvance||G.v5Pause)return;const it=curItem();if(!it||it.rest)return;
    const chaser=v3ChaserState(),first=!it.retried,rt=+(G.t-G.floorBorn).toFixed(3);
    it.meta.outcome='miss';it.meta.omission=true;it.meta.omissionReason=chaser.active?'caught':'timeout';it.meta.waitedSeconds=rt;
    it.meta.sameStepRetry=!!it.retried;it.meta.prevWrong=G.prevWrong;it.meta.hintUsed=!!(it.meta.hintUsed||it.meta.confirmationPrompt||it.hint);
    logRow(it,null,false,rt);if(typeof v9AfterAnswer==='function')v9AfterAnswer(it,null,false,null);
    if(first){bumpWeak(it.word,false);G.v9FirstAnswers++;G.nAns++;G.wrongRun[it.word]=(G.wrongRun[it.word]||0)+1;}
    G.v5Misses++;G.combo=0;G.prevWrong=true;G.floorErr=false;G.v9LandingVariant=null;
    G.v9Catch=chaser.active?{at:G.t,duration:.55,kind:chaser.kind,chaserActive:true,back:0}:null;
    v9RecordEvent('miss',{reason:it.meta.omissionReason,measurementFloor:it.meta.measurementFloor,word:it.word,unit:it.ch,firstAttempt:first,
      outcome:'miss',waitedSeconds:rt,fromFloor:G.i,toFloor:G.i+1,rollback:0,chaserActive:chaser.active,chaser:chaser.active?chaser.kind:null,timeSeconds:G.time,timeMax:G.timeMax});
    G.time=chaser.active?Math.min(G.timeMax,Math.max(0,G.time)+3.3):G.timeMax;sfx('wrong');G.shake=.2;
    const side=G.char.face>=0?1:0,tgt=candPos(side);climbTo(tgt,{progressIndex:G.i+1,omission:true,sign:null});G.i++;
  };
  choose=function(side){
    if(G.phase==='gate'){v9GateChoose(side);return;}
    if(G.phase!=='play'||G.pendingAdvance||G.char.motion||G.char.inputLock>0||G.v5Pause)return;const it=curItem();if(!it||it.rest)return;initAudio();
    let tgt=candPos(side);const other=candPos(1-side);G.char.face=side?1:-1;
    const first=!it.retried,ok=side===it.side,rt=+(G.t-G.floorBorn).toFixed(3),measurement=G.pi>=1&&G.pi<=6;
    it.meta.outcome=ok?'correct':'wrong';it.meta.omission=false;it.meta.omissionReason=null;it.meta.waitedSeconds=null;
    it.meta.hintUsed=!!(it.meta.hintUsed||it.meta.confirmationPrompt||it.hint);it.meta.relaxedRx=!!(it.meta.relaxedRx||it.relaxed||it.rxApplied);it.meta.reclimb=false;it.meta.sameStepRetry=!!it.retried;it.meta.prevWrong=G.prevWrong;
    it.meta.recoveryPenaltyWaived=false;it.meta.timePenaltySeconds=0;it.meta.interactionRevision='single-20261005-v2';
    logRow(it,side,ok,rt);if(typeof v9AfterAnswer==='function')v9AfterAnswer(it,side,ok,rt);if(first)bumpWeak(it.word,ok);
    G.nAns++;if(first){G.v9FirstAnswers++;if(ok)G.v9FirstOK++;}
    if(G.pi===0){v5IntroAnswer(it,side,ok);return;}
    if(ok){
      G.nOK++;G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);G.sessionStars++;G.prevWrong=G.floorErr;G.floorErr=false;G.wrongRun[it.word]=0;sfx('step');
      if(G.budget)G.time=Math.min(G.timeMax,G.time+floorBudget());
      let advance=1;
      if(it.v9Variant==='jump'&&G.i+1<G.plan.length&&!G.plan[G.i+1].rest){
        advance=2;tgt={x:tgt.x,y:G.pos.y-STEP_H*2};const skipped=G.plan[G.i+1];it.v9JumpCompletedWord=null;
        if(it.uType==='jamo'&&skipped.uType==='jamo'&&skipped.meta.wordOrdinal===it.meta.wordOrdinal&&skipped.ui===skipped.units.length-1){it.v9JumpCompletedWord=it.word;skipped.meta.autoFilledVisual=true;}
        skipped.meta.jumpPass=true;skipped.meta.excluded=true;skipped.meta.actualFloor=G.i+2;skipped.meta.outcome='unassessed';logRow(skipped,null,null,null);
        v9RecordEvent('jump_pass',{floor:skipped.meta.measurementFloor,word:skipped.word,unit:skipped.ch,answerRecorded:false,visuallyCompletedWord:it.v9JumpCompletedWord||null});
      }
      if(advance===2)G.prevWrong=false;
      G.v9LandingVariant=it.v9Variant;climbTo(tgt,{sign:options(it)[side],progressIndex:G.i+advance,v9Variant:it.v9Variant});
      if(G.combo>0&&G.combo%5===0){G.sessionStars+=3;G.fx.push({x:tgt.x,y:tgt.y-260,vx:0,vy:-30,life:1.1,text:'★',color:'#ff5a7a',big:true});sfx('combo');}
      if(it.ui===it.units.length-1&&it.uType!=='word')sfx('word');G.i+=advance;
    }else{
      G.combo=0;G.floorErr=true;if(first)G.wrongRun[it.word]=(G.wrongRun[it.word]||0)+1;sfx('wrong');G.shake=.3;G.flash=.2;v13BounceWrong(it,side);
      // No incorrect-answer time penalty. Elapsed thinking time still counts.
      v9RecordEvent('wrong_bounce',{measurementFloor:it.meta.measurementFloor,word:it.word,fromFloor:G.i,toFloor:G.i,timePenaltySeconds:0});
      // The selected wrong sign is marked; the current floor remains active.
      if(measurement&&G.rx.rec>=2&&G.rx._recSubtype==='unaware'&&!it.redoInserted){
        it.redoInserted=true;
        const copy={...it,meta:{...it.meta,measurementFloor:null,panTrial:null,wordOrdinal:'return-'+it.meta.wordOrdinal+'-'+G.i,returnStair:true,insertedSupport:true,relaxedRx:true,sameStepRetry:false,rxReason:'return_stair',outcome:null,prevWrong:false},
          v:'clean',sim:false,distType:'dissim',dist:v9OrdinaryWrong(it,[0,1,2].map(i=>cw(country().sets[G.sl],i))),v9Variant:null,step:null,rxApplied:true,relaxedRx:true,redoInserted:true,hint:false,retried:false,isRedo:true};
        copy.meta.stairVariant=null;delete copy.meta.jamoChanged;copy.meta.hintUsed=false;
        let insertAt=G.i+1,followingOriginals=0;
        while(insertAt<G.plan.length&&followingOriginals<2){const next=G.plan[insertAt];if(!next.rest&&!next.meta?.insertedSupport&&Number(next.meta?.measurementFloor)>0)followingOriginals++;insertAt++;}
        G.plan.splice(insertAt,0,copy);v5ReindexPlan();
      }
      it.retried=true;
      if(G.balloons>0){G.balloons--;sfx('pop');popBalloon();}
      G.floorBorn=G.t;if(G.budget&&G.time<=0)slide(G.pi===7?'caught':'timeout');
    }
  };
  panClear=function(){
    if(G.v9Committed)return;G.v9Committed=true;const pan=PANS[G.pi],acc=G.v9FirstAnswers?G.v9FirstOK/G.v9FirstAnswers:1;
    const stars=pan.chase?(G.v5Misses===0?3:G.v5Misses===1?2:1):(G.balloons===3&&acc>=.9?3:G.balloons>=1&&acc>=.7?2:1);
    const completed=v9CompletedStages(),key=v9StageKey(G.ci,G.sl,G.pi),prev=completed[key];
    completed[key]={at:Date.now(),stars:Math.max(prev?.stars||0,stars),attempt:G.attempt,panId:G.panId,actualFloors:G.v9ActualFloors,wordCount:G.v9WordCount,completed:true,
      source:'played_pdf_v5',measurementVersion:'stairs-pdf-v5-2026-10',misses:G.v5Misses,firstAnswers:G.v9FirstAnswers,firstCorrect:G.v9FirstOK};LS.set('v12.completedStages',completed);
    LS.set('stars',totalStars()+G.sessionStars);v9RecordEvent('stage_complete',{stars,firstAnswers:G.v9FirstAnswers,firstCorrect:G.v9FirstOK,misses:G.v5Misses,balloons:G.balloons,actualFloors:G.v9ActualFloors});
    if(typeof v9AfterPan==='function')v9AfterPan(G.ci,G.sl,G.pi);
    if(pan.top&&G.sl%2===1)judgeBlock(G.ci,Math.floor(G.sl/2));
    if(typeof v9CheckCharacterUnlocks==='function')v9CheckCharacterUnlocks({summit:G.pi===8});
    G.phase='clear';G.char.lastLand=G.t;sfx('clear');
    const ending=country().key==='word'?'깃발을 꽂았어요!':country().key==='syl'?'구조 배가 왔어요!':'탑의 별을 찾았어요!';
    document.getElementById('clTitle').textContent=pan.top?ending:v9StageLabel(G.ci,G.sl,G.pi)+' 완주!';
    document.getElementById('clStars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
    document.getElementById('clSub').textContent=(G.sl+1)+'세트 · '+(G.pi===0?'새 단어를 익혔어요':pan.chase?'놓침 '+G.v5Misses+'회':Math.round(acc*100)+'% 정답 · 놓침 '+G.v5Misses+'회')+
      (G.v9NewFriend?' · '+(typeof v9CharacterNotice==='function'?v9CharacterNotice():G.v9NewFriend.name+'와 친구가 되었어요!'):'');
    const last=G.pi===8&&G.sl===country().sets.length-1;document.getElementById('nextPan').style.display=last?'none':'';
    document.getElementById('nextPan').textContent=G.pi===8?'다음 세트':'다음 단계';ovClear.style.display='flex';
    if(typeof v9RenderEnding==='function')v9RenderEnding();
  };
  const baseUpdate=update;
  update=function(dt){
    const pause=G.phase==='play'?G.v5Pause:null,oldBudget=G.budget;
    if(pause)G.budget=0;
    baseUpdate(dt);
    if(pause){G.budget=oldBudget;if(G.v5Pause===pause&&G.phase==='play'){pause.remaining=Math.max(0,pause.remaining-dt);if(pause.remaining<=0)v5ResumeAfterPause(pause);}}
    if(G.v9IceRemaining>0&&!G.char.motion){G.v9IceRemaining=Math.max(0,G.v9IceRemaining-dt);const p=1-G.v9IceRemaining/.3;G.char.x=G.pos.x+Math.sin(p*Math.PI)*16*G.char.face;}
  };
  const baseMap=goMap,baseTitle=goTitle;
  goMap=function(){G.v9Gate=null;G.v5Pause=null;return baseMap();};goTitle=function(){G.v9Gate=null;G.v5Pause=null;return baseTitle();};
  GLIM.unlockAll=function(){LS.set('v9.teacherStageUnlock',true);toast('단계 연습이 열렸어요',1.5);};
  GLIM.completedStages=v9CompletedStages;GLIM.stagePlan=(ci,sl,pi)=>v9MakePlan(ci,sl,pi,{eff:0,sus:0,dis:0,rec:0});
  GLIM.gates=()=>LS.get('v12.gates',[]);GLIM.events=()=>LS.get('v12.events',[]);GLIM.chaserState=v3ChaserState;
}

/* ===== v9_metrics.js ===== */
/* 글림 한글계단 — PDF v5 기록·4지표·맞춤 도움. Earlier measurements stay archived. */
const V9M = {
  version: 'stairs-pdf-v5-2026-10', storagePrefix:'v12', installed: false, logs: [], profiles: [],
  setReports: [], events: [], rx: {}, checks: {}, teacher: {}, interventions: {}, storageWarning: null,
  metricNames: {eff:'수행 효율성', sus:'효율 유지율', dis:'혼동쌍 유지율', rec:'오답 후 정답률'},
  metricKeys: {eff:'efficiency', sus:'sustain', dis:'discrimination', rec:'recovery'}
};
const v9Copy = value => JSON.parse(JSON.stringify(value));
const v9Num = value => typeof value === 'number' && Number.isFinite(value);
const v9Mean = values => {const a=values.filter(v9Num);return a.length?a.reduce((s,v)=>s+v,0)/a.length:null;};
const v9Band = n => n < 18 ? '참고' : n < 36 ? '관찰' : '신뢰';
const v9Corrected = rows => rows.length ? Math.max(0, (2*rows.filter(r=>r.ok===true).length-rows.length)/rows.length) : null;
let v9LogPacking=null;
function v9PackLogs(logs) {
  if(!v9LogPacking||v9LogPacking.source!==logs||v9LogPacking.data.rows.length>logs.length){
    v9LogPacking={source:logs,data:{encoding:'dictionary-columns-v1',columns:[],dictionaries:[],rows:[]},maps:[]};
  }
  const pack=v9LogPacking,data=pack.data;
  for(let i=data.rows.length;i<logs.length;i++){
    const row=logs[i];
    Object.keys(row).forEach(key=>{
      if(data.columns.includes(key))return;
      data.columns.push(key);data.dictionaries.push([null]);pack.maps.push(new Map([['null',0]]));
      data.rows.forEach(old=>old.push(0));
    });
    const codes=data.columns.map((key,c)=>{
      const value=row[key]===undefined?null:row[key],token=JSON.stringify(value),map=pack.maps[c];
      if(map.has(token))return map.get(token);
      const index=data.dictionaries[c].length;data.dictionaries[c].push(value);map.set(token,index);return index;
    });
    data.rows.push(codes);
  }
  return data;
}
function v9UnpackLogs(data) {
  if(Array.isArray(data))return data;
  if(!data||data.encoding!=='dictionary-columns-v1'||!Array.isArray(data.columns)||!Array.isArray(data.rows))return [];
  return data.rows.map(codes=>{
    const row={};data.columns.forEach((key,c)=>{row[key]=(data.dictionaries[c]||[])[codes[c]]??null;});return row;
  });
}
function v9Store(key,value) {
  try {previewStorage.setItem('glim.st4.'+V9M.storagePrefix+'.'+key,JSON.stringify(key==='log'?v9PackLogs(value):value));}
  catch(error) {V9M.storageWarning={at:Date.now(),code:'local_storage_unavailable',detail:'현재 기록은 메모리에 보관 중입니다. 기록 내보내기로 저장해 주세요.'};}
}
function v9Event(kind,data) {
  const event=Object.assign({at:Date.now(),kind,version:V9M.version},data||{});
  V9M.events.push(event);v9Store('events',V9M.events);return event;
}
function v9CountryKey(value) {
  if(typeof value==='number')return COUNTRIES[value]&&COUNTRIES[value].key;
  return value||COUNTRIES[G.ci||0].key;
}
function v9SetType(value) {
  const type=String(value||'미기록');
  if(/무받침|받침\s*없음/.test(type))return '받침 없음';
  if(/양받침/.test(type))return '양받침';
  if(/앞/.test(type))return '앞 받침';
  if(/받침/.test(type))return '뒤 받침';
  return type;
}
function v9RowReasons(row,allowSummit) {
  const reasons=[];
  if(row.version&&row.version!==V9M.version)reasons.push('different_measurement_environment');
  if(row.intro||row.pan===0||row.panKind==='intro')reasons.push('intro');
  if(row.hint||row.hintUsed)reasons.push('hint');
  if(row.manualReplay||row.replay>0)reasons.push('manual_replay');
  if(row.relaxed||row.relaxedRx||row.rxApplied)reasons.push('relaxed_rx');
  if(row.stairVariant||row.v==='terrain'||row.v==='ice'||row.v==='collapse'||row.v==='jump')reasons.push('stair_variant');
  if(row.redo||row.reclimb)reasons.push('reclimb');
  if(row.retry||row.sameStepRetry)reasons.push('same_step_retry');
  if(row.chase||row.pursuit||row.pan===7||row.panKind==='chase'||row.panKind==='pursuit')reasons.push('pursuit');
  if((row.top||row.summit||row.pan===8||row.panKind==='summit')&&!allowSummit)reasons.push('summit');
  if(row.jumpPass||row.outcome==='jump_pass')reasons.push('jump_pass');
  if(row.rest||row.returnStair)reasons.push(row.rest?'rest':'return_stair');
  if(row.reward||row.rewardFloor)reasons.push('reward');
  if(row.teacherAdjusted||row.teacherAdjustedTrial)reasons.push('teacher_adjusted');
  if(row.prefillNotAssessed)reasons.push('syllable_prefill');
  if(row.insertedSupport)reasons.push('inserted_support');
  if(row.gate||row.panKind==='gate')reasons.push('gate');
  if(typeof row.ok!=='boolean')reasons.push('not_an_answer');
  return [...new Set(reasons)];
}
function v9IsSimilar(row) {return !!row.confusion||row.v==='sim'||row.v==='confusion'||row.distType==='sim';}
function v9PreviousWrong(row) {return !!(row.prevWrong||row.afterError);}
function v9RowLength(row) {return Number(row.measureLength||row.length||row.len)||0;}
function v9MeasurementIndex(row) {
  return Number(row.measurementFloor||row.panTrial||row.floor)||0;
}
function v3MeasurementHalf(row) {
  const floor=v9MeasurementIndex(row),total=row.country==='pho'?Number(row.totalMeasurementFloors):15;
  if(!Number.isFinite(total)||total<=0||floor<1||floor>total)return null;
  const boundary=row.country==='pho'?Math.floor(total/2)+1:8;
  return floor<boundary?'early':'late';
}
function v9RatioPair(name,hard,easy) {
  const hardCorrected=v9Corrected(hard),easyCorrected=v9Corrected(easy);
  const value=hardCorrected!==null&&easyCorrected!==null&&easyCorrected>.05?hardCorrected/easyCorrected:null;
  return {name,value,numeratorN:hard.length,denominatorN:easy.length,
    numeratorCorrected:hardCorrected,denominatorCorrected:easyCorrected,
    autoEligible:value!==null&&hard.length>=5&&easy.length>=5,
    unavailableReason:value===null?(easyCorrected!==null&&easyCorrected<=.05?'baseline_at_or_below_5_percent':'missing_comparison'):null};
}
function v9Metric(name,pairs) {
  const calculated=pairs.filter(p=>p.value!==null),n=pairs.reduce((s,p)=>s+p.numeratorN,0);
  const referenceN=pairs.reduce((s,p)=>s+p.denominatorN,0);
  return {name,v:v9Mean(calculated.map(p=>p.value)),n,referenceN,label:v9Band(n),
    autoEligible:calculated.length>0&&calculated.every(p=>p.autoEligible),
    comparisons:pairs,threshold:.6,
    status:!calculated.length?'미산출':calculated.every(p=>p.autoEligible)?(v9Mean(calculated.map(p=>p.value))<.6?'도움 검토':'유지'):'표본 확인'};
}
function v9JamoChanges(target,distractor) {
  if(!target||!distractor)return [];
  const parts=s=>Array.from(s).map((ch,i)=>{
    const n=ch.codePointAt(0)-0xac00;
    return n>=0&&n<11172?{i,parts:[CHO[Math.floor(n/588)],JUNG[Math.floor(n%588/28)],JONGL[n%28]||'']}:{i,parts:[ch]};
  });
  const a=parts(String(target)),b=parts(String(distractor)),out=[];
  for(let i=0;i<Math.max(a.length,b.length);i++){
    const aa=a[i]?a[i].parts:[],bb=b[i]?b[i].parts:[];
    for(let j=0;j<Math.max(aa.length,bb.length);j++)if((aa[j]||'')!==(bb[j]||''))out.push({syllable:i,slot:aa.length===1?'jamo':['initial','vowel','final'][j],from:aa[j]||'',to:bb[j]||''});
  }
  return out;
}
function v9PairKey(change) {
  if(!change)return '미기록';
  if(typeof change==='string')return change;
  if(Array.isArray(change))return change.map(v9PairKey).join(' · ');
  return (change.slot||'jamo')+':'+(change.from||'∅')+'→'+(change.to||'∅');
}
function v3TypeLearningRow(row){
  if(row.country!=='pho'&&row.unitType!=='jamo')return true;
  if(typeof row.learningTargetMatch==='boolean')return row.learningTargetMatch;
  return Array.isArray(row.learningTargetSyllables)&&Array.isArray(row.learningTargetSlots)&&
    row.learningTargetSyllables.includes(row.responseSyllable)&&row.learningTargetSlots.includes(row.responseSlot);
}
function v3SameResponseContext(a,b){
  if(v9SetType(a.setType)!==v9SetType(b.setType))return false;
  if(a.country==='pho'||a.unitType==='jamo')return (b.country==='pho'||b.unitType==='jamo')&&
    a.responseSlot===b.responseSlot&&a.responseSyllable===b.responseSyllable;
  return a.unitType===b.unitType;
}
function v9ComputeMetrics(log) {
  const rows=Array.isArray(log)?log:[],valid=rows.filter(r=>!v9RowReasons(r,false).length);
  const clean=valid.filter(r=>!v9IsSimilar(r)&&!v9PreviousWrong(r));
  const excludedByReason={};rows.forEach(r=>v9RowReasons(r,false).forEach(x=>excludedByReason[x]=(excludedByReason[x]||0)+1));
  const m={version:V9M.version,n:valid.length,nClean:clean.length,label:v9Band(valid.length),
    totalRows:rows.length,excludedRows:rows.length-valid.length,excludedByReason,threshold:.6,
    correctedAccuracyFormula:'max(0, (accuracy - 0.5) / 0.5)',baselineFloor:.05};
  const countries=[...new Set(valid.map(r=>r.country||'word'))],sustainPairs=[];
  countries.forEach(c=>['low','mid','high'].forEach(speed=>{
    const len=c==='pho'?10:15;
    const q=clean.filter(r=>(r.country||'word')===c&&v9RowLength(r)===len&&r.speed===speed);
    const easy=q.filter(r=>v3MeasurementHalf(r)==='early');
    const hard=q.filter(r=>v3MeasurementHalf(r)==='late');
    sustainPairs.push(v9RatioPair(c+'_'+speed,hard,easy));
  }));
  m.sustain=v9Metric('효율 유지율',sustainPairs);
  m.sustain.description='긴 판 뒤 절반 ÷ 앞 절반, 같은 속도별 비율의 평균';
  m.sustain.splitBasis='word/syllable: floors 1–7 vs 8–15; phoneme: actual jamo floors 1–floor(N/2) vs floor(N/2)+1–N';
  const efficiencyPairs=[];
  countries.forEach(c=>(c==='pho'?[5,10]:[7,15]).forEach(len=>{
    const q=valid.filter(r=>(r.country||'word')===c&&v9RowLength(r)===len);
    efficiencyPairs.push(v9RatioPair(c+'_'+len,q.filter(r=>r.speed==='high'),q.filter(r=>r.speed==='low')));
  }));
  m.efficiency=v9Metric('수행 효율성',efficiencyPairs);
  m.efficiency.description='상 속도 ÷ 하 속도, 같은 길이별 비율의 평균';
  const sim=valid.filter(v9IsSimilar);
  m.discrimination=v9Metric('혼동쌍 유지율',[v9RatioPair('confusion_vs_clean',sim,clean)]);
  m.discrimination.interpretable=m.efficiency.autoEligible&&m.efficiency.v>=.6;
  m.discrimination.interpretationReason=m.discrimination.interpretable?null:'수행 효율성이 0.6 이상이며 비교 표본이 충분할 때 해석합니다.';
  m.discrimination.byType={};m.discrimination.byTypeDetails={};m.discrimination.byJamoPair={};
  [...new Set(valid.map(r=>v9SetType(r.setType)))].forEach(type=>{
    const p=v9RatioPair(type,sim.filter(r=>v9SetType(r.setType)===type&&v3TypeLearningRow(r)),clean.filter(r=>v9SetType(r.setType)===type&&v3TypeLearningRow(r)));
    m.discrimination.byType[type]=p.value;m.discrimination.byTypeDetails[type]=p;
  });
  m.discrimination.byTypePopulation='Phoneme type comparisons include only response syllables/slots targeted by that set, on both sides. Overall confusion retains all eligible phoneme confusion trials.';
  m.discrimination.byTypeOmittedPhonemeRows={confusion:sim.filter(r=>(r.country==='pho'||r.unitType==='jamo')&&!v3TypeLearningRow(r)).length,
    clean:clean.filter(r=>(r.country==='pho'||r.unitType==='jamo')&&!v3TypeLearningRow(r)).length};
  [...new Set(sim.map(r=>v9PairKey(r.jamoChanged)))].forEach(pair=>{
    const a=sim.filter(r=>v9PairKey(r.jamoChanged)===pair);
    m.discrimination.byJamoPair[pair]=v9RatioPair(pair,a,clean.filter(r=>a.some(source=>v3SameResponseContext(source,r))));
  });
  const afterError=valid.filter(v9PreviousWrong);
  m.recovery=v9Metric('오답 후 정답률',[v9RatioPair('after_error_vs_clean',afterError,clean)]);
  const afterTimes=afterError.map(r=>r.rt).filter(v=>v9Num(v)&&v>0),usualTimes=clean.map(r=>r.rt).filter(v=>v9Num(v)&&v>0);
  const usualRT=v9Mean(usualTimes),afterRT=v9Mean(afterTimes);
  m.recovery.rtRatio=usualRT!==null&&usualRT>0&&afterRT!==null?afterRT/usualRT:null;
  m.recovery.rtSampleN={afterError:afterTimes.length,clean:usualTimes.length};
  m.recovery.rtNormalRange=[1.1,1.6];
  m.recovery.responsePattern=m.recovery.rtRatio===null?'unavailable':m.recovery.rtRatio<1.1?'unaware':m.recovery.rtRatio>2?'freeze':m.recovery.rtRatio<=1.6?'normal':'slowed';
  m.baseRT=usualRT;m.accClean=clean.length?clean.filter(r=>r.ok).length/clean.length:null;
  m.retention=v9Retention(rows).v;
  m.readinessLabels=v5ReadinessLabels(rows);
  m.newSupportBlocked=m.readinessLabels.some(x=>x.code==='set_readiness_failed');
  m.missedResponses=valid.filter(r=>r.omission||r.outcome==='miss').length;
  return m;
}
function v9Retention(log) {
  const q=log.filter(r=>(r.summit||r.top||r.pan===8)&&!v9RowReasons(r,true).length);
  const pair=v9RatioPair('previous_words_vs_current',q.filter(r=>r.isOld),q.filter(r=>!r.isOld));
  return {v:pair.value,oldN:pair.numeratorN,currentN:pair.denominatorN,
    oldCorrected:pair.numeratorCorrected,currentCorrected:pair.denominatorCorrected,
    threshold:.8,reviewNeeded:pair.value!==null&&pair.value<.8,comparison:pair};
}
function v9LogRow(it,side,ok,rt) {
  const pan=PANS[G.pi]||{},c=COUNTRIES[G.ci],meta=Object.assign({},it.meta||{});
  const ownSet=c.sets[G.sl],setInfo=SETS[it.setOf==null?ownSet:it.setOf]||{};
  const selected=side===0||side===1?(it.side===0?[it.ch,it.dist]:[it.dist,it.ch])[side]:null;
  const teacher=meta.teacherDifficulty||v9TeacherDifficulty(c.key);
  const chase=typeof v3ChaserState==='function'?v3ChaserState(it):{active:false,scheduled:false,kind:null,startFloor:null,policy:null};
  const target=typeof v3LearningTarget==='function'&&!it.rest?v3LearningTarget(it):{};
  const changed=meta.jamoChanged||it.jamoChanged||(it.uType==='jamo'?{from:it.ch,to:it.dist,slot:target.responseSlotName,syllable:target.responseSyllable,components:1}:
    v9JamoChanges(it.ch,it.dist).map(change=>it.uType==='syl'?{...change,syllable:it.syl}:change));
  const missed=!!(meta.omission||meta.missed||meta.outcome==='miss');
  const state=v5SetIntervention(G.ci,G.sl);
  const rec={version:V9M.version,ts:Date.now(),country:c.key,set:G.sl,pan:G.pi,
    panId:meta.panId||G.panId||c.key+'-'+G.sl+'-'+G.pi+'-'+G.attempt,
    attempt:G.attempt||1,floor:meta.actualFloor||G.i+1,measurementFloor:meta.measurementFloor||it.measurementFloor||meta.panTrial||G.i+1,
    wordOrdinal:meta.wordOrdinal||it.wordOrdinal||it.wordIndex+1||G.i+1,
    totalMeasurementFloors:Number(meta.totalMeasurementFloors||G.v9ActualFloors)||null,
    measurementHalf:meta.measurementHalf||null,
    speed:meta.speed||pan.sp||null,plannedSpeed:pan.sp||null,
    effectiveSpeed:meta.effectiveSpeed||(it.relaxed&&typeof SLOWER!=='undefined'?SLOWER[meta.speed||pan.sp]:meta.speed||pan.sp)||null,
    len:Number(meta.measureLength||meta.length||c.lens[G.pi]),measureLength:Number(meta.measureLength||meta.length||c.lens[G.pi]),
    panKind:meta.panKind||(G.pi===0?'intro':pan.chase||G.pi===7?'chase':pan.top||G.pi===8?'summit':'measurement'),
    word:it.word||null,unit:it.ch||null,unitType:it.uType||null,setOf:it.setOf==null?ownSet:it.setOf,
    ...target,
    setType:v9SetType(meta.setType||setInfo.type),setTypeSource:meta.setType||setInfo.type||'미기록',isOld:!!it.isOld,
    correct:it.ch||null,distractor:it.dist||null,picked:selected,side:side===0||side===1?side:null,correctSide:it.side,
    ok:typeof ok==='boolean'?ok:null,rt:missed?null:v9Num(rt)?rt:null,rtUnit:'seconds',
    responseGiven:side===0||side===1,omission:missed,missed,omissionReason:meta.omissionReason||null,
    waitedSeconds:missed?(v9Num(rt)?rt:v9Num(meta.waitedSeconds)?meta.waitedSeconds:null):null,
    outcome:meta.outcome||(meta.jumpPass?'jump_pass':ok===true?'correct':ok===false?'wrong':'event'),
    timeLeft:(G.pi!==7&&G.timeMax)?Math.max(0,Math.min(1,G.time/G.timeMax)):null,
    timeSeconds:G.pi!==7&&v9Num(G.time)?G.time:null,timeMax:G.pi!==7&&v9Num(G.timeMax)?G.timeMax:null,
    v:it.v||'clean',confusion:meta.confusion===undefined?(it.v==='sim'||it.distType==='sim'):!!meta.confusion,
    distType:it.distType||null,jamoChanged:changed,
    prevWrong:meta.prevWrong===undefined?!!G.prevWrong:!!meta.prevWrong,
    afterError:meta.prevWrong===undefined?!!G.prevWrong:!!meta.prevWrong,
    intro:!!(meta.intro||G.pi===0),hint:!!(meta.hintUsed||meta.hint||it.hint||G.replays>0),hintUsed:!!(meta.hintUsed||meta.hint||it.hint||G.replays>0),
    manualReplay:G.replays>0,
    relaxed:!!(meta.relaxedRx||meta.rxApplied||it.relaxed||it.rxApplied),
    relaxedRx:!!(meta.relaxedRx||meta.rxApplied||it.relaxed||it.rxApplied),
    rxApplied:!!(meta.rxApplied||meta.relaxedRx||it.rxApplied),rxRule:meta.rxRule||meta.rxReason||it.rxRule||null,
    stairVariant:meta.stairVariant||it.stairVariant||it.terrain||null,
    reclimb:!!(meta.reclimb||it.redo||G.i<G.redoUntil),redo:!!(meta.reclimb||it.redo||G.i<G.redoUntil),
    sameStepRetry:!!(meta.sameStepRetry||it.retried),retry:!!(meta.sameStepRetry||it.retried),
    summit:!!(meta.summit||pan.top||G.pi===8),top:!!(meta.summit||pan.top||G.pi===8),chase:!!(meta.chase||pan.chase||G.pi===7),pursuit:!!(meta.chase||pan.chase||G.pi===7),jumpPass:!!meta.jumpPass,
    rest:!!it.rest,returnStair:!!(meta.returnStair||it.returnStair||it.isRedo),reward:meta.reward||it.reward||null,
    gate:!!meta.gate,teacherAdjusted:!!(meta.teacherAdjusted||meta.teacherAdjustedTrial),teacherDifficulty:teacher,
    rx:{eff:G.rx.eff||0,sus:G.rx.sus||0,dis:G.rx.dis||0,rec:G.rx.rec||0},
    replay:G.replays||0,combo:G.combo||0,theme:meta.theme||(typeof v9Theme==='function'?v9Theme(G.ci,G.sl).key:null),
    chaser:chase.active?chase.kind:null,chaserActive:chase.active,chaserScheduled:chase.scheduled,
    themeChaser:chase.kind,chaserStartFloor:chase.startFloor,chaserPolicy:chase.policy,
    chaserSharesTimer:false,chaserRatio:chase.active?chase.ratio:null,chaserRemainingSeconds:chase.active?chase.timerSeconds:null,
    recoveryPenaltyWaived:!!meta.recoveryPenaltyWaived,timePenaltySeconds:0,interactionRevision:'single-20261005-v2',insertedSupport:!!meta.insertedSupport,
    confirmationPrompt:!!meta.confirmationPrompt,confirmationPromptSource:meta.confirmationPromptSource||null,
    confirmationSeconds:meta.confirmationPrompt ? .8 : 0,sustainPauseSeconds:Number(meta.sustainPauseSeconds)||0,
    originalConfusionRemoved:!!(meta.originalConfusionRemoved||meta.confusionRemoved),deficitReplacement:!!meta.deficitReplacement,
    readinessFailed:!!state.readinessFailed,readinessWords:(state.readinessWords||[]).slice(),
    afterIce:!!meta.afterIce,syllablePrefilled:meta.syllablePrefilled||[],prefillNotAssessed:!!meta.prefillNotAssessed,
    planBasis:meta.planBasis||null,originalJamoChanged:meta.originalJamoChanged||null};
  rec.exclusions=v9RowReasons(rec,false);rec.valid=rec.exclusions.length===0;
  rec.clean=rec.valid&&!v9IsSimilar(rec)&&!v9PreviousWrong(rec);
  V9M.logs.push(rec);v9Store('log',V9M.logs);return rec;
}
function v9HintLedger() {
  const id=G.panId||COUNTRIES[G.ci].key+'-'+G.sl+'-'+G.pi+'-'+G.attempt;
  if(!G.v9Hints||G.v9Hints.panId!==id)G.v9Hints={panId:id,words:{}};
  return G.v9Hints;
}
function v9DifferentTwoParts(text,it) {
  const supported=value=>typeof v9SignTextSupported==='function'&&v9SignTextSupported(value);
  if(it.uType==='jamo') {
    const pool=it.slot===1?JUNG:it.slot===2?JONGL.filter(Boolean):CHO;
    const source=it.ch,avoid=new Set([source,it.dist]);
    return pool.find(ch=>supported(ch)&&!avoid.has(ch)&&!(it.slot===1?jungG:it.slot===2?jongG:choG).some(g=>g.includes(source)&&g.includes(ch)))||pool.find(ch=>supported(ch)&&ch!==source)||it.dist;
  }
  const chars=Array.from(text),places=[];
  chars.forEach((ch,i)=>{const n=ch.codePointAt(0)-0xac00;if(n>=0&&n<11172){const d=decom(ch);d.forEach((p,j)=>{if(p)places.push({i,j});});}});
  const desired=it.slot===2||/받침/.test((it.meta||{}).setType||'')?2:0;
  places.sort((a,b)=>(b.j===desired)-(a.j===desired));
  // Search only real, embedded glyphs while keeping two distinct Hangul components changed.
  const replacementPool=place=>{
    const original=decom(chars[place.i])[place.j]||'';
    const common=place.j===0?['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅎ']:
      place.j===1?['ㅏ','ㅓ','ㅗ','ㅜ','ㅡ','ㅣ','ㅐ','ㅔ']:['ㄱ','ㄴ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ',''];
    const all=place.j===0?CHO:place.j===1?JUNG:JONGL;
    return [...new Set(common.concat(all))].filter(ch=>ch!==original);
  };
  for(let a=0;a<places.length;a++)for(let b=a+1;b<places.length;b++){
    const first=places[a],second=places[b];
    for(const x of replacementPool(first))for(const y of replacementPool(second)){
      const candidate=chars.slice(),parts=new Map();
      [first,second].forEach(place=>{if(!parts.has(place.i))parts.set(place.i,decom(chars[place.i]));});
      parts.get(first.i)[first.j]=x;parts.get(second.i)[second.j]=y;
      parts.forEach((d,i)=>{candidate[i]=compose(d[0],d[1],d[2]);});
      const value=candidate.join('');
      if(supported(value)&&v9JamoChanges(text,value).length===2)return value;
    }
  }
  return it.dist;
}
function v9PreparePanHints(plan) {
  const rx=G.rx||{};
  if(G.pi<1||G.pi>6||rx.dis>=1||!Array.isArray(plan))return null;
  const eligible=plan.filter((it,index)=>!(index>0&&((plan[index-1].v9Variant||plan[index-1].stairVariant||plan[index-1].terrain||(plan[index-1].meta||{}).stairVariant)==='jump'))&&it&&!it.rest&&!it.relaxed&&!it.isRedo&&it.meta&&
    Number(it.meta.measurementFloor||it.measurementFloor)>=3&&!it.meta.insertedSupport&&!it.meta.rxApplied&&!it.meta.returnStair);
  if(!eligible.length)return null;
  const selected=eligible[Math.floor(Math.random()*eligible.length)];
  selected.meta.controlPrompt=true;
  return selected.meta.measurementFloor||selected.measurementFloor;
}
function v9PrepareFloor(it) {
  if(!it||it.rest||G.pi===0||(it.meta&&it.meta.intro))return;
  it.meta=it.meta||{};
  const ledger=v9HintLedger(),word=ledger.words[it.word]||(ledger.words[it.word]={wrongRun:0,used:false});
  if(word.wrongRun>=2&&!word.used&&!it.retried&&!it.meta.sameStepRetry){
    it.hint=true;it.hintSay=false;it.meta.hintUsed=true;it.meta.hintReason='two_consecutive_word_errors';word.used=true;
  }
  const rx=G.rx||{},measured=G.pi>=1&&G.pi<=6;
  const prescribed=measured&&rx.dis>=1&&(it.v==='sim'||it.distType==='sim');
  const control=measured&&rx.dis<1&&it.meta.controlPrompt;
  if((prescribed||control)&&!it.retried&&!it.meta.sameStepRetry&&!it.v5PromptShown){
    it.v5PromptShown=true;it.meta.hintUsed=true;
    it.meta.confirmationPrompt=true;it.meta.confirmationPromptSource=prescribed?'discrimination_support':'random_control';
    it.meta.hintReason=prescribed?'discrimination_confirm_800ms':'random_confirm_800ms';
    if(prescribed){it.meta.rxApplied=true;it.meta.relaxedRx=true;it.meta.rxRule='dis1_confirm_800ms';}
    G.v5Pause={kind:'confirm',remaining:.8,duration:.8,hideSigns:true,message:'잘 확인해 보세요!'};
    if(prescribed&&rx.dis>=2&&(!rx._weakestType||rx._weakestType===v9SetType(it.meta.setType))&&
        (it.uType!=='jamo'||typeof v3LearningTarget==='function'&&v3LearningTarget(it).learningTargetMatch)){
      if(!it.v9OriginalDistractor)it.v9OriginalDistractor=it.dist;
      it.dist=v9DifferentTwoParts(it.ch,it);
      const target=it.uType==='jamo'?v3LearningTarget(it):null;
      it.meta.jamoChanged=target?{from:it.ch,to:it.dist,slot:target.responseSlotName,syllable:target.responseSyllable,components:1}:v9JamoChanges(it.ch,it.dist);
      it.meta.rxRule=it.uType==='jamo'?'dis2_phoneme_dissimilar_fallback':it.meta.jamoChanged.length===2?'dis2_two_components':'dis2_safe_existing_pair_fallback';
      it.rxRule=it.meta.rxRule;
    }
    v9Event('confirmation_prompt',{country:COUNTRIES[G.ci].key,set:G.sl,pan:G.pi,panId:G.panId,
      measurementFloor:it.meta.measurementFloor||it.measurementFloor,word:it.word,duration:.8,
      source:it.meta.confirmationPromptSource,countsAsHint:true,timerPaused:true,inputLocked:true});
  }
}
function v9AfterAnswer(it,side,ok,rt) {
  if(!it||it.rest||it.retried||it.isRedo||(it.meta&&(it.meta.sameStepRetry||it.meta.reclimb||it.meta.returnStair||it.meta.jumpPass)))return;
  const ledger=v9HintLedger(),word=ledger.words[it.word]||(ledger.words[it.word]={wrongRun:0,used:false});
  if(ok)word.wrongRun=0;else if(ok===false)word.wrongRun++;
}
function v5CountryIndex(ci) {
  return typeof ci==='number'?ci:COUNTRIES.findIndex(c=>c.key===ci);
}
function v5SetIntervention(ci,sl) {
  const index=v5CountryIndex(ci),country=COUNTRIES[index]&&COUNTRIES[index].key;
  if(!country)return {country:null,set:sl+1,setIndex:sl,readinessFailed:false,floorChecks:[],outgoingDeficits:[]};
  const id=country+':'+sl;
  if(!V9M.interventions[id])V9M.interventions[id]={country,set:sl+1,setIndex:sl,
    floorGateUsed:false,floorGatePendingForPan:null,floorChecks:[],readinessFailed:false,
    readinessWords:[],readinessEvidence:null,incomingDeficits:[],outgoingDeficits:[],deficitEvaluatedAt:null};
  return V9M.interventions[id];
}
function v5IncomingDeficit(ci,sl) {
  if(sl<1)return [];
  const state=v5SetIntervention(ci,sl-1);
  return v9Copy((state.outgoingDeficits||[]).filter(d=>!d.teacherOnly&&d.appliesSet===sl));
}
function v5MarkGateReadiness(ci,sl,record) {
  const state=v5SetIntervention(ci,sl);
  if(record===true||record&&record.readinessFailed){
    state.readinessFailed=true;state.readinessWords=record&&record.readinessWords||[];
    state.readinessEvidence=record===true?null:v9Copy(record);state.readinessMarkedAt=Date.now();
    v9Store('interventions',V9M.interventions);
    v9Event('set_readiness_failed',{country:state.country,set:sl,words:state.readinessWords,
      measurementContinues:true,newBlockSupportInhibited:true});
  }
  return v9Copy(state);
}
function v5ConsumeFloorGate(ci,sl,pi) {
  const state=v5SetIntervention(ci,sl);
  if(state.floorGatePendingForPan!==pi)return false;
  state.floorGatePendingForPan=null;state.floorGateUsed=true;state.floorGateCompletedAt=Date.now();
  v9Store('interventions',V9M.interventions);
  v9Event('measurement_floor_gate_completed',{country:state.country,set:sl,pan:pi});return true;
}
function v5ReadinessLabels(rows) {
  const labels=[],seen=new Set();
  rows.forEach(row=>{
    const id=row.country+':'+row.set;if(seen.has(id))return;seen.add(id);
    const state=V9M.interventions[id];
    if(row.readinessFailed||state&&state.readinessFailed)labels.push({code:'set_readiness_failed',country:row.country,
      set:row.set+1,words:v9Copy(state&&state.readinessWords||row.readinessWords||[]),
      message:'세트 준비 미달 — 측정은 계속하며 이 블록의 새 처방은 보류합니다.'});
  });
  return labels;
}
function v5ActualPanRows(log) {
  // Actual stage accuracy includes hinted and terrain responses, unlike the four metric populations.
  // Inserted support, skipped floors and second choices are not extra questions in the original stage.
  return log.filter(r=>(!r.version||r.version===V9M.version)&&typeof r.ok==='boolean'&&
    !r.intro&&!r.chase&&!r.pursuit&&!r.summit&&!r.top&&r.pan>=1&&r.pan<=6&&
    !r.retry&&!r.sameStepRetry&&!r.rest&&!r.returnStair&&!r.insertedSupport&&!r.jumpPass&&
    r.outcome!=='jump_pass'&&!r.gate&&r.measurementFloor!==0);
}
function v9WordSupport(ci,sl,log) {
  const c=COUNTRIES[ci],setIdx=c.sets[sl],ownWords=SETS[setIdx].words.map(w=>w[0]),incoming=v5IncomingDeficit(ci,sl);
  const words=[...new Set(ownWords.concat(incoming.map(d=>d.word)))];
  const q=log.filter(r=>r.country===c.key&&r.set===sl&&!v9RowReasons(r,false).length&&!v9IsSimilar(r));
  const stats={};words.forEach(word=>{
    const rows=q.filter(r=>r.word===word),correct=rows.filter(r=>r.ok).length;
    stats[word]={n:rows.length,correct,wrong:rows.length-correct,accuracy:rows.length?correct/rows.length:null};
  });
  const deficient=word=>stats[word].n>=3&&stats[word].accuracy<.5;
  const needsReview=ownWords.filter(word=>deficient(word)&&ownWords.filter(w=>w!==word).every(w=>stats[w].n>=1&&stats[w].wrong<=1));
  const repeated=incoming.filter(d=>deficient(d.word)).map(d=>d.word);
  return {words:stats,needsReview:[...new Set(needsReview.concat(repeated))],newDeficits:needsReview,
    repeatedDeficits:repeated,incoming:incoming.map(d=>d.word),
    rule:'current_set_nonconfusion_nonvariant_unassisted_first_attempts_n>=3_accuracy<0.5_other_words_errors<=1',
    repeatedRule:'an incoming deficit still below 0.5 after >=3 eligible rows in the next set triggers teacher review only'};
}
function v5StageOutcomeSummary(log) {
  const grouped=new Map();
  log.forEach(row=>{const key=row.panId||row.country+':'+row.set+':'+row.pan;
    if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(row);});
  return [...grouped].map(([panId,rows])=>{
    const first=rows.filter(r=>typeof r.ok==='boolean'&&!r.retry&&!r.sameStepRetry&&!r.rest&&!r.returnStair&&!r.insertedSupport&&!r.jumpPass),r=rows[0];
    return {country:r.country,set:r.set+1,setIndex:r.set,pan:r.pan+1,panIndex:r.pan,panId,kind:r.panKind,
      firstResponses:first.length,correct:first.filter(r=>r.ok).length,wrong:first.filter(r=>r.ok===false&&!r.omission&&r.outcome!=='miss').length,
      misses:rows.filter(r=>r.omission||r.outcome==='miss').length,caught:rows.filter(r=>r.omissionReason==='caught').length,
      timeouts:rows.filter(r=>r.omissionReason==='timeout').length,accuracy:first.length?first.filter(r=>r.ok).length/first.length:null};
  });
}
function v9AfterPan(ci,sl,pi) {
  const c=COUNTRIES[ci],log=V9M.logs.filter(r=>r.country===c.key&&r.set===sl),state=v5SetIntervention(ci,sl);
  const panId=G.panId||null,panLog=panId?log.filter(r=>r.panId===panId):log.filter(r=>r.pan===pi);
  if(pi>=1&&pi<=6){
    const first=v5ActualPanRows(panLog),accuracy=first.length?first.filter(r=>r.ok).length/first.length:null;
    const duplicate=state.floorChecks.find(check=>check.panId===panId&&check.pan===pi);
    if(duplicate)return v9Copy(duplicate);
    const triggered=accuracy!==null&&accuracy<.6&&!state.floorGateUsed&&state.floorGatePendingForPan===null;
    const check={at:Date.now(),pan:pi,panId,n:first.length,accuracy,triggered,followingPan:triggered?pi+1:null};
    state.floorChecks.push(check);
    if(triggered){state.floorGatePendingForPan=pi+1;state.floorGateTriggeredAt=Date.now();
      v9Event('measurement_floor_gate_scheduled',{country:c.key,set:sl,pan:pi,followingPan:pi+1,n:first.length,accuracy,oncePerSet:true});}
    v9Store('interventions',V9M.interventions);return v9Copy(check);
  }
  if(pi!==8)return null;
  const duplicate=V9M.setReports.find(r=>r.country===c.key&&r.set===sl+1&&r.panId===panId);
  if(duplicate)return duplicate;
  const wordSupport=v9WordSupport(ci,sl,log),retention=v9Retention(panLog),incoming=v5IncomingDeficit(ci,sl);
  const nextExists=sl+1<c.sets.length;
  const outgoing=wordSupport.needsReview.map(word=>{
    const previous=incoming.find(d=>d.word===word),setOf=previous?previous.setOf:c.sets[sl],pair=SETS[setOf].words.find(w=>w[0]===word);
    const consecutiveSets=previous?(previous.consecutiveSets||1)+1:1;
    return {word,setOf,em:pair&&pair[1]||'✨',sourceSet:previous?previous.sourceSet:sl,sourceSetNumber:previous?previous.sourceSetNumber:sl+1,
      detectedSet:sl,detectedSetNumber:sl+1,appliesSet:nextExists?sl+1:null,consecutiveSets,
      teacherOnly:consecutiveSets>=2||!nextExists};
  });
  state.outgoingDeficits=outgoing;state.incomingDeficits=incoming;state.deficitEvaluatedAt=Date.now();
  if(nextExists)v5SetIntervention(ci,sl+1).incomingDeficits=v5IncomingDeficit(ci,sl+1);
  v9Store('interventions',V9M.interventions);
  const supportFlags=outgoing.map(d=>({code:d.consecutiveSets>=2?'word_deficit_repeated_teacher_only':'word_deficit',word:d.word,
    message:d.word+(d.consecutiveSets>=2?' 결손이 두 세트 연속 확인되어 교사 확인만 요청합니다.':nextExists?' 단어를 다음 세트 관문·짧은 판·정상판에서 다시 확인합니다.':' 단어를 교사와 다시 확인해 주세요.'),
    teacherOnly:d.teacherOnly,consecutiveSets:d.consecutiveSets}));
  if(retention.reviewNeeded)supportFlags.push({code:'previous_words_review_needed',message:'이전 단어를 다음 정상판에 15개 배치합니다.'});
  if(state.readinessFailed)supportFlags.push({code:'set_readiness_failed',message:'세트 준비 미달 — 측정값에 라벨을 붙이고 블록의 새 처방을 보류합니다.'});
  const report={at:Date.now(),version:V9M.version,country:c.key,set:sl+1,panId,
    wordSupport,retention,nextSummitPreviousWords:retention.reviewNeeded?15:12,
    outgoingDeficits:outgoing,incomingDeficits:incoming,readinessFailed:state.readinessFailed,
    floorChecks:v9Copy(state.floorChecks),supportFlags};
  V9M.setReports.push(report);v9Store('setReports',V9M.setReports);
  v9Event('set_interventions_evaluated',{country:c.key,set:sl,outgoingDeficits:outgoing,retentionReview:retention.reviewNeeded,
    independentOfBlockPrescriptionLimit:true});
  return report;
}
function v9SummitOldCount(ci,sl) {
  if(sl===0)return 0;
  const key=COUNTRIES[ci].key,reports=V9M.setReports.filter(r=>r.country===key&&r.set===sl);
  const previous=reports[reports.length-1];return previous&&previous.retention.reviewNeeded?15:12;
}
function v9RxLoad(c) {
  const saved=V9M.rx[v9CountryKey(c)]||{};
  const out={eff:Math.min(1,Math.max(0,Number(saved.eff)||0)),sus:Math.min(2,Math.max(0,Number(saved.sus)||0)),
    dis:Math.min(2,Math.max(0,Number(saved.dis)||0)),rec:Math.min(2,Math.max(0,Number(saved.rec)||0))};
  ['_recSubtype','_weakestType'].forEach(k=>{if(saved[k]!=null)out[k]=saved[k];});
  if(out.rec===2&&out._recSubtype!=='unaware')out.rec=1;
  return out;
}
function v9AdvanceSupport(ci,b,m,oldRx,oldChecks,finalSet,options={}) {
  const rx=Object.assign({eff:0,sus:0,dis:0,rec:0},oldRx||{}),checks=v9Copy(oldChecks||{}),flags=[],transitions=[];
  delete rx.inh;
  const keys=['eff','sus','dis','rec'],normalSpeed=m.efficiency.autoEligible&&m.efficiency.v>=.6;
  const rtCounts=m.recovery.rtSampleN||{},rtEnough=rtCounts.afterError>=5&&rtCounts.clean>=5;
  const maxLevel=k=>k==='eff'?1:k==='rec'&&(!rtEnough||m.recovery.responsePattern!=='unaware')?1:2;
  const touched=new Set();
  if(rtEnough)rx._recSubtype=m.recovery.responsePattern;
  const typePairs=Object.entries(m.discrimination.byTypeDetails||{}).filter(([type,p])=>p.autoEligible&&p.value!==null).sort((a,b)=>a[1].value-b[1].value);
  if(typePairs.length)rx._weakestType=typePairs[0][0];
  keys.forEach(k=>{
    const metric=m[V9M.metricKeys[k]],state=checks[k]||(checks[k]={maxBadChecks:0,graduated:false,pendingSince:null});
    if(k==='rec'&&rx.rec===2&&rtEnough&&m.recovery.responsePattern!=='unaware'){
      rx.rec=1;state.maxBadChecks=0;transitions.push({key:k,from:2,to:1,reason:'second_level_requires_unaware_pattern'});touched.add(k);
    }
    if(!metric.autoEligible||metric.v===null||(k==='dis'&&!normalSpeed))return;
    if(rx[k]>0){
      const from=rx[k];
      if(metric.v>=.6){
        rx[k]=Math.max(0,rx[k]-1);state.maxBadChecks=0;
        if(rx[k]===0){state.pendingSince=b+1;state.graduated=false;}
        flags.push(V9M.metricNames[k]+' 도움 '+(rx[k]?'한 단계 줄임':'쉬어 가며 두 세트 확인'));
        transitions.push({key:k,from,to:rx[k],reason:'recovered'});touched.add(k);
      }else if(rx[k]<maxLevel(k)){
        rx[k]++;state.maxBadChecks=0;state.pendingSince=null;
        flags.push(V9M.metricNames[k]+' 도움 한 단계 추가');transitions.push({key:k,from,to:rx[k],reason:'needs_more_support'});touched.add(k);
      }else{
        state.maxBadChecks++;
        if(state.maxBadChecks>=2&&!state.nonresponseFlagged){
          state.nonresponseFlagged=true;flags.push(V9M.metricNames[k]+' 도움 반응을 교사·전문가와 확인해 주세요.');
          transitions.push({key:k,from,to:rx[k],reason:'support_response_review',maxBadChecks:state.maxBadChecks});
        }
      }
    }else if(state.pendingSince!==null&&state.pendingSince<b+1){
      if(metric.v>=.6){state.graduated=true;state.pendingSince=null;flags.push(V9M.metricNames[k]+' 도움 없이 두 세트 유지');transitions.push({key:k,from:0,to:0,reason:'graduated_after_two_sets'});}
      else{state.pendingSince=null;state.graduated=false;}
    }
  });
  let activated=false;
  const readinessFailed=!!(options.readinessFailed||m.newSupportBlocked);
  if(!finalSet&&!readinessFailed&&m.n>=5){
    keys.forEach(k=>{
      const metric=m[V9M.metricKeys[k]],familyBusy=(k==='eff'||k==='sus')?(rx.eff>0||rx.sus>0):(rx.dis>0||rx.rec>0);
      if(activated||touched.has(k)||rx[k]>0||familyBusy||!metric.autoEligible||metric.v===null||metric.v>=.6||(k==='dis'&&!normalSpeed))return;
      rx[k]=1;activated=true;checks[k]={maxBadChecks:0,graduated:false,pendingSince:null,nonresponseFlagged:false};
      flags.push(V9M.metricNames[k]+' 도움 시작');transitions.push({key:k,from:0,to:1,reason:'new_support'});
    });
  }
  if(finalSet)flags.push('마지막 세트: 새 도움을 켜지 않고 기록합니다.');
  if(readinessFailed)flags.push('세트 준비 미달: 이 블록에서는 새 처방을 켜지 않습니다.');
  return {rx,checks,flags,transitions};
}
function v9JudgeBlock(ci,b) {
  const c=COUNTRIES[ci],end=2*b+1;
  if(G.pi!==8||G.sl!==end||G.ci!==ci||end>=c.sets.length)return null;
  const existing=V9M.profiles.find(p=>p.country===c.key&&p.block===b+1);
  if(existing)return {m:existing.metrics,flags:existing.flags,rx:existing.rx,alreadyEvaluated:true};
  const log=V9M.logs.filter(r=>r.country===c.key&&(r.set===2*b||r.set===end));
  const m=v9ComputeMetrics(log),oldRx=v9RxLoad(c.key),oldChecks=V9M.checks[c.key]||{},finalSet=end===c.sets.length-1;
  const readinessFailed=[2*b,end].some(sl=>v5SetIntervention(ci,sl).readinessFailed);
  m.newSupportBlocked=readinessFailed;
  const result=v9AdvanceSupport(ci,b,m,oldRx,oldChecks,finalSet,{readinessFailed});
  V9M.rx[c.key]=result.rx;V9M.checks[c.key]=result.checks;v9Store('rx',V9M.rx);v9Store('checks',V9M.checks);
  const profile={at:Date.now(),country:c.key,block:b+1,sets:[2*b+1,end+1],metrics:m,
    flags:result.flags,transitions:result.transitions,rx:v9Copy(result.rx),
    supportFlags:result.transitions.filter(t=>t.reason==='support_response_review').map(t=>({code:'support_response_review',metric:t.key,message:'도움 방식과 학습 환경을 교사·전문가와 함께 확인해 주세요.'})),
    recordOnly:finalSet,newSupportBlocked:readinessFailed,readinessLabels:m.readinessLabels,version:V9M.version};
  V9M.profiles.push(profile);v9Store('profile',V9M.profiles);
  return {m,flags:result.flags,rx:result.rx,profile};
}
function v9TeacherDifficulty(c,update) {
  const key=v9CountryKey(c),before=Object.assign({confusion:0,speed:0,variants:0},V9M.teacher[key]||{});
  if(update&&typeof update==='object'){
    const after=Object.assign({},before);['confusion','speed','variants'].forEach(k=>{if(k in update)after[k]=Math.min(1,Math.max(0,Math.round(Number(update[k])||0)));});
    V9M.teacher[key]=after;v9Store('teacher',V9M.teacher);v9Event('teacher_difficulty',{country:key,before,after,applies:'next_pan'});return v9Copy(after);
  }
  return v9Copy(before);
}
function v9Report(c) {
  const key=v9CountryKey(c),profiles=V9M.profiles.filter(p=>p.country===key),reports=V9M.setReports.filter(p=>p.country===key);
  const records=V9M.logs.filter(r=>r.country===key),interventions=Object.values(V9M.interventions).filter(s=>s.country===key)
    .map(s=>({...s,incomingDeficits:v5IncomingDeficit(key,s.setIndex)}));
  const gates=LS.get('v12.gates',[]).filter(g=>g.country===key);
  return {country:key,version:V9M.version,source:'글림_한글계단_쉬운해설_요약본_v5.pdf',metrics:v9ComputeMetrics(records),
    latestBlock:profiles[profiles.length-1]||null,blocks:profiles,setReports:reports,rx:v9RxLoad(key),
    teacherDifficulty:v9TeacherDifficulty(key),storageWarning:V9M.storageWarning,gates,
    interventions:v9Copy(interventions),stageOutcomes:v5StageOutcomeSummary(records),
    readinessWarnings:interventions.filter(s=>s.readinessFailed).map(s=>({code:'set_readiness_failed',set:s.set,
      words:s.readinessWords,message:'세트 준비 미달 — 측정은 계속하며 이 블록의 새 처방은 보류합니다.'})),
    gateWarnings:gates.filter(g=>g.teacherReview||g.readinessFailed).map(g=>({code:g.readinessFailed?'set_readiness_failed':'gate_review_needed',
      set:g.set+1,pan:g.pan+1,message:g.readinessFailed?'세트 준비 미달':'관문에서 다시 살펴본 단어가 있어요.',details:g})),
    measurementPolicy:{stages:'세트당 9판: 소개, 측정 6판, 추격판, 정상판. 2~7판만 네 지표에 사용합니다.',
      chaser:'8판 추격판에만 표시하며 시간바는 없습니다. 추격판 전체는 계산에서 제외합니다.',
      omission:'시간 만료는 놓침(오답)으로 기록하고 다음 층으로 갑니다. 첫 시도 놓침은 유효 응답이고, 같은 층 재시도 뒤 놓침은 재시도입니다. 반응이 없으므로 반응 시간은 비우고 대기 시간을 따로 남깁니다.',
      sustain:'긴 판 중간의 2초 휴식과 혼동 한 개 감소는 원본 측정층을 제외하지 않습니다. 혼동 확인 문구가 나온 층은 힌트로 제외합니다.',
      recovery:'오답을 고른 직후의 시간 차감만 면제합니다. 이미 결정된 첫 오답과 다음 원본 층은 계산에 남깁니다.',
      phoneme:'5·10단어를 완전한 자모층으로 펼치며, 긴 판의 실제 자모층 절반을 앞뒤 비교 및 휴식 경계로 사용합니다. 추격판은 7단어 분량입니다. 받침 유형별 비교는 양쪽 모두 해당 학습 위치의 자모만 사용합니다.',
      history:'이전 PDF v3·v2 기록은 보존하며 현재 지표·처방 계산에 합치지 않습니다.'},
    explanation:'학습 게임 안에서 필요한 도움을 살피는 기록입니다. 지표는 보정 정답률의 비율이며 0.6을 기준으로 비교합니다.'};
}
function v5LegacyEnvironment(prefix,schema) {
  return {schema,includedInCurrentMetrics:false,
    records:v9UnpackLogs(LS.get(prefix+'.log',[])),blocks:LS.get(prefix+'.profile',[]),setReports:LS.get(prefix+'.setReports',[]),
    rx:LS.get(prefix+'.rx',{}),reviewState:LS.get(prefix+'.checks',{}),teacherDifficulty:LS.get(prefix+'.teacher',{}),
    events:LS.get(prefix+'.events',[]),gates:LS.get(prefix+'.gates',[])};
}
function v3LegacyPdfV2Records() {return v5LegacyEnvironment('v9','stairs-pdf-v2-2026-10');}
function v5LegacyPdfV3Records() {return v5LegacyEnvironment('v10','stairs-pdf-v3-2026-10');}
function v5PreviousEnvironments() {return [v5LegacyPdfV3Records(),v3LegacyPdfV2Records()];}
function v9ExportJSON(download) {
  const currentGLIM=window.GLIM||{};
  const data={schema:V9M.version,exportedAt:new Date().toISOString(),sourceDocument:'글림_한글계단_쉬운해설_요약본_v5.pdf',
    measurementEnvironment:{stagesPerSet:9,measurementStages:[2,3,4,5,6,7],
      timerRefillSeconds:{low:3.3,mid:2.5,high:1.8},incorrectPenalty:'none; wrong-answer collision returns to the same floor, with countdown paused during animation',interactionRevision:'single-20261005-v2',
      pursuit:{stage:8,nominalFloors:10,phonemeWords:7,timeBar:false,defaultCatchSeconds:6.6,pushbackSeconds:3.3,excludedFromFourMetrics:true},
      summit:{stage:9,nominalFloors:21,speed:'low',timeBar:true,chaser:false,excludedFromFourMetrics:true},
      omission:{outcome:'miss',correct:false,advance:'next_floor',rollback:false,firstAttemptIncluded:true,retryExcluded:true,
        reactionTime:null,waitingTimeField:'waitedSeconds'},
      chaserPolicy:'Only stage 8 has a pursuer. Stages 2–7 and stage 9 use the time bar.',
      chaserTiming:'A separate pursuit budget replaces the time bar only in the excluded pursuit stage.',
      stage7IsMeasured:true,pursuitIsExcludedFromFourMetrics:true,summitIsExcludedFromFourMetrics:true,
      phonemeInterpretation:'Preserve 5/10 complete words expanded to jamo floors. For an N-floor long stage, floor(N/2)+1 is the second-half boundary for sustain and midpoint rest. Pursuit is 7 complete words. Original measurement indices are not shifted by inserted support.',
      phonemeConfusionInterpretation:'The proportional confusion count may exceed available coda slots. Preserve the count curve and actual one-jamo choices; record the response syllable/slot and learning-target match. Overall discrimination includes all valid confusion trials. Type-specific numerator and clean denominator both include only the syllable/slot targeted by the set. Pair-specific clean references match the response slot and syllable.',
      insertedRxRowsShiftMeasurementBoundary:false,nominalFloorCountsAreNotGuaranteedValidRowCounts:true},
    metricsDefinition:{sustain:'long_late_clean / long_early_clean; mean of speed-matched ratios',
      efficiency:'all_valid_high_speed / all_valid_low_speed; mean of length-matched ratios',
      discrimination:'all_valid_confusion / valid_clean',recovery:'all_valid_after_error / valid_clean',
      correction:'max(0, (accuracy - 0.5) / 0.5)',easySideMinimumCorrected:.05,autoSupportMinimumEachSide:5,threshold:.6,
      missedFirstResponses:'incorrect observations in accuracy, not observed reaction times'},
    interventionPolicy:{sustainRest:{seconds:2,signsHidden:true,timerPaused:true,measurementFloorExcluded:false},
      sustainSecondLevel:{removedConfusions:1,convertedMeasurementFloorExcluded:false},
      discriminationConfirmation:{seconds:.8,signsAfterPrompt:true,timerPaused:true,inputLocked:true,hintExcluded:true,
        unprescribedControl:'one random eligible original measurement floor per stage after the first two'},
      recoveryFirstLevel:'time penalty is disabled for everyone; preserve incorrect and retry records',
      deficit:{minimumRows:3,maximumAccuracyExclusive:.5,otherWordMaximumErrors:1,starts:'next set after immediate set evaluation',
        fullGatesBeforeStages:[1,2,3],extraWordGateBeforeStages:[3,4,5,6,7],shortStageExtraOccurrence:true,summitPriority:true,
        consecutiveTwoSets:'teacher review only; no further propagation'},
      measurementFloor:{actualAccuracyExclusive:.6,fullGate:'before next stage, once per set',ledger:'gate only'},
      readinessFailure:'keep labeled measurements; prohibit new four-metric prescriptions in that two-set block',
      immediateInterventionsCountAgainstNewPrescriptionLimit:false,lastCountrySetStartsNoNewPrescription:true},
    records:V9M.logs,blocks:V9M.profiles,setReports:V9M.setReports,rx:V9M.rx,
    reviewState:V9M.checks,teacherDifficulty:V9M.teacher,interventions:V9M.interventions,events:V9M.events,
    gates:LS.get('v12.gates',[]),sharedGatesKey:'glim.shared.gates.v1',storageWarning:V9M.storageWarning,
    characterUnlocks:typeof currentGLIM.characterUnlocks==='function'?currentGLIM.characterUnlocks():null,
    characterUnlockHistory:typeof currentGLIM.characterUnlockHistory==='function'?currentGLIM.characterUnlockHistory():[],
    previousEnvironment:v5LegacyPdfV3Records(),previousEnvironments:v5PreviousEnvironments()};
  const text=JSON.stringify(data,null,2);
  if(download===true){
    const blob=new Blob([text],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='glim_stairs_records_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return text;
}
function installV9Metrics() {
  if(V9M.installed)return;V9M.installed=true;
  V9M.logs=v9UnpackLogs(LS.get('v12.log',[]));V9M.profiles=LS.get('v12.profile',[]);V9M.setReports=LS.get('v12.setReports',[]);
  V9M.rx=LS.get('v12.rx',{});V9M.checks=LS.get('v12.checks',{});V9M.teacher=LS.get('v12.teacher',{});V9M.events=LS.get('v12.events',[]);
  V9M.interventions=LS.get('v12.interventions',{});
  delete RX_DEFAULT.inh;Object.assign(RX_DEFAULT,{eff:0,sus:0,dis:0,rec:0});
  rxLoad=v9RxLoad;logRow=v9LogRow;computeMetrics=v9ComputeMetrics;judgeBlock=v9JudgeBlock;
  const oldGLIM=window.GLIM||{};
  const api=Object.assign({},oldGLIM,{
    version:V9M.version,
    log(){return v9Copy(V9M.logs);},
    metrics(c,a,b){const key=v9CountryKey(c);return v9ComputeMetrics(V9M.logs.filter(r=>r.country===key&&(a==null||(r.set>=a-1&&r.set<=(b||a)-1))));},
    profile(){return v9Copy(V9M.profiles);},setReports(){return v9Copy(V9M.setReports);},
    interventions(c){const key=v9CountryKey(c);return v9Copy(Object.values(V9M.interventions).filter(s=>s.country===key));},
    incomingDeficit(c,sl){return v5IncomingDeficit(v5CountryIndex(c),sl);},
    setRx(c,value){const key=v9CountryKey(c),before=v9RxLoad(key);V9M.rx[key]=Object.assign({},before,value||{});V9M.rx[key]=v9RxLoad(key);v9Store('rx',V9M.rx);v9Event('manual_support',{country:key,before,after:V9M.rx[key]});return v9Copy(V9M.rx[key]);},
    teacherDifficulty:v9TeacherDifficulty,v9Report:v9Report,exportJSON:v9ExportJSON,
    legacyLog(){return LS.get('log',[]);},
    previousEnvironment:v5LegacyPdfV3Records,previousEnvironments:v5PreviousEnvironments,
    reset(){['log','profile','setReports','rx','checks','teacher','events','interventions'].forEach(k=>previewStorage.removeItem('glim.st4.'+V9M.storagePrefix+'.'+k));if(typeof location!=='undefined')location.reload();},
    clearRecords(){V9M.logs=[];V9M.profiles=[];V9M.setReports=[];V9M.events=[];V9M.rx={};V9M.checks={};V9M.interventions={};
      ['log','profile','setReports','events'].forEach(k=>v9Store(k,[]));['rx','checks','interventions'].forEach(k=>v9Store(k,{}));}
  });
  Object.defineProperty(api,'rx',{enumerable:true,get(){return v9Copy(V9M.rx);}});
  window.GLIM=api;
}

/* ===== v9_characters.js ===== */
/* PDF v5 · Friends are permanent rewards for completing every one of a set's
   nine stages. Country conditions are independent of star totals and preview
   progress. Previously earned friends are grandfathered once; old eight-stage
   sets only count after the new chase stage has also been completed. */
var V9_CHARACTERS_INSTALLED=false;
var V5_CHARACTER_UNLOCK_VERSION='stairs-pdf-v5-2026-10';

function v5CompletedSetCounts(){
  const ledger=LS.get('v12.completedStages',{})||{},counts={word:0,syl:0,pho:0,total:0};
  COUNTRIES.forEach(country=>country.sets.forEach((_,set)=>{
    let full=true;
    for(let pan=0;pan<9;pan++){
      const record=ledger[country.key+':'+set+':'+pan];
      const completed=record===true||record&&typeof record==='object'&&record.completed!==false&&
        (record.completed===true||record.at!=null||record.stars!=null);
      if(!completed){full=false;break;}
    }
    if(full){counts[country.key]=(counts[country.key]||0)+1;counts.total++;}
  }));
  return counts;
}

function v9CompletedSetCount(){return v5CompletedSetCounts().total;}

function v5CharacterState(){
  let state=LS.get('v12.characterUnlockState',null);
  if(!state||typeof state!=='object'||state.version!==V5_CHARACTER_UNLOCK_VERSION){
    const old=LS.get('v9.characterUnlocks',{})||{},legacy={};
    for(let i=1;i<CHARS.length;i++)if(old[i]===true)legacy[i]=true;
    const now=Date.now();
    state={version:V5_CHARACTER_UNLOCK_VERSION,createdAt:now,easePhoneme:0,
      granted:{0:{at:now,source:'starter'}},grandfathered:legacy,notified:{0:true},history:[]};
    Object.keys(legacy).forEach(id=>{state.granted[id]={at:now,source:'legacy_earned'};state.notified[id]=true;});
    LS.set('v12.grandfatheredCharacterUnlocks',Object.assign({},legacy));
    LS.set('v12.characterUnlockState',state);
  }
  state.granted=state.granted||{0:{source:'starter'}};
  state.grandfathered=state.grandfathered||{};state.notified=state.notified||{0:true};
  state.history=Array.isArray(state.history)?state.history:[];state.easePhoneme=state.easePhoneme?1:0;
  // A parent-report grant opens access without inventing completed sets or rewards.
  if(LS.get('v12.reportAllCharactersUnlocked',false)===true){
    const missing=CHARS.map((_,id)=>id).filter(id=>!state.granted[id]);
    if(missing.length){
      const at=Date.now();
      missing.forEach(id=>{
        state.granted[id]={at,source:'report_manual_unlock'};
        state.notified[id]=true;
      });
      LS.set('v12.characterUnlockState',state);
    }
  }
  return state;
}

function v5CharacterConditions(index,state){
  state=state||v5CharacterState();
  const totals=Object.fromEntries(COUNTRIES.map(c=>[c.key,c.sets.length]));
  const rules=[[],[['word',2]],[['word',5],['syl',1]],[['syl',3],['pho',2]],
    [['word',10],['pho',5]],[['syl',totals.syl||6],['pho',9]],
    [['word',totals.word||16],['pho',13]]];
  return (rules[index]||[]).map(([country,original])=>({country,
    name:country==='word'?'단어나라':country==='syl'?'음절나라':'음소나라',original,
    required:Math.max(1,original-(country==='pho'?state.easePhoneme:0)),
    relaxed:country==='pho'&&!!state.easePhoneme}));
}

function v5CharacterEligible(index,counts,state){
  return index===0||v5CharacterConditions(index,state).every(c=>(counts[c.country]||0)>=c.required);
}

function v5CharacterSnapshot(){
  const state=v5CharacterState(),counts=v5CompletedSetCounts();
  return {version:V5_CHARACTER_UNLOCK_VERSION,completedSets:counts,
    completionRule:'all_nine_stages_completed_stars_do_not_matter',
    easePhoneme:state.easePhoneme,easeRule:'phoneme_conditions_minus_one_set_once',
    grandfathered:Object.keys(state.grandfathered).filter(k=>state.grandfathered[k]).map(Number),
    characters:CHARS.map((char,id)=>({id,name:char.name,
      unlocked:!!state.granted[id]||v5CharacterEligible(id,counts,state),
      earned:!!state.granted[id],grandfathered:!!state.grandfathered[id],
      notificationPending:id>0&&!state.notified[id]&&(!!state.granted[id]||v5CharacterEligible(id,counts,state)),
      awarded:state.granted[id]||null,
      conditions:v5CharacterConditions(id,state).map(c=>Object.assign({},c,{completed:counts[c.country]||0,
        progress:Math.min(c.required,counts[c.country]||0),met:(counts[c.country]||0)>=c.required}))}))};
}

function v9UnlockedCharacters(){return v5CharacterSnapshot().characters.filter(c=>c.unlocked).map(c=>c.id);}

function v9IsCharacterUnlocked(index){
  const i=Number(index);
  return Number.isInteger(i)&&i>=0&&i<CHARS.length&&v9UnlockedCharacters().includes(i);
}

function v9CheckCharacterUnlocks(options){
  options=options||{};
  const state=v5CharacterState(),counts=v5CompletedSetCounts(),newlyEarned=[];
  CHARS.forEach((char,id)=>{
    if(!state.granted[id]&&v5CharacterEligible(id,counts,state)){
      const award={at:Date.now(),source:state.easePhoneme?'completed_sets_with_phoneme_ease':'completed_sets',
        completedSets:Object.assign({},counts),easePhoneme:state.easePhoneme,
        conditions:v5CharacterConditions(id,state)};
      state.granted[id]=award;newlyEarned.push(id);
      state.history.push({type:'friend_earned',id,name:char.name,...award});
    }
  });
  const fresh=!options.silent&&options.summit?CHARS.map((_,i)=>i).filter(i=>i>0&&state.granted[i]&&!state.notified[i]):[];
  fresh.forEach(id=>{state.notified[id]=true;});
  if(fresh.length)state.history.push({at:Date.now(),type:'summit_friend_notice',ids:fresh.slice()});
  LS.set('v12.characterUnlockState',state);
  if(!state.granted[G.charKind]){G.charKind=0;LS.set('char',0);}
  G.hat=0;G.v9CharacterHint=null;
  G.v9NewFriend=fresh.length?{id:fresh[0],name:CHARS[fresh[0]].name,
    ids:fresh.slice(),names:fresh.map(i=>CHARS[i].name),completedSets:counts.total,
    completedByCountry:Object.assign({},counts),message:'새 친구가 왔어요!'}:null;
  return fresh;
}

function v5SetCharacterUnlockEase(enabled){
  const state=v5CharacterState(),before=state.easePhoneme,after=enabled?1:0;
  if(before!==after){
    state.easePhoneme=after;
    const change={at:Date.now(),type:'teacher_phoneme_condition_ease',before,after,
      rule:'phoneme_conditions_minus_one_set_once',applies:'all_phoneme_unlock_conditions',
      existingFriendsRemainUnlocked:true};
    state.history.push(change);LS.set('v12.characterUnlockState',state);
    if(typeof v9Event==='function')v9Event('teacher_character_unlock_ease',change);
    v9CheckCharacterUnlocks({silent:true});
  }
  return v5CharacterSnapshot();
}

function v9CharacterNotice(){
  const friend=G.v9NewFriend;
  return friend?'새 친구가 왔어요! '+(friend.names||[friend.name]).join(' · '):'';
}

function v9CharacterPickerHint(index){
  const c=v5CharacterSnapshot().characters[index];
  if(!c)return;
  G.v9CharacterHint={text:c.conditions.map(x=>x.name+' '+x.progress+'/'+x.required+'세트').join(' · '),until:G.t+3};
}

function v9SelectCharacter(index){
  if(!v9IsCharacterUnlocked(index)){v9CharacterPickerHint(index);sfx('wrong');return false;}
  v9CheckCharacterUnlocks({silent:true});
  G.charKind=index;G.charSelectedAt=G.t;G.hat=0;G.v9CharacterCursor=index;
  G.v9CharacterHint=null;LS.set('char',index);sfx('step');return true;
}

function v9CharacterSelectionLayout(){
  const v=typeof V7_VIEW==='object'?V7_VIEW:{left:0,top:0,width:W,height:H,portrait:false};
  const portrait=!!v.portrait,cols=portrait?(v.height/v.width>=1.60?2:3):4;
  const rows=Math.max(1,Math.ceil(CHARS.length/cols)),gap=portrait?24:18;
  const panelW=portrait?Math.min(1160,v.width-64):1100,pad=portrait?48:42;
  const headerH=portrait?188:126,footerH=portrait?92:56;
  const maxPanelH=portrait?v.height-72:Math.min(v.height-48,664);
  const targetCardH=portrait?(cols===2?448:354):224;
  const cardH=Math.min(targetCardH,(maxPanelH-headerH-footerH-(rows-1)*gap)/rows);
  const gridH=rows*cardH+(rows-1)*gap,panelH=headerH+gridH+footerH;
  const panel={x:CX-panelW/2,y:v.top+(v.height-panelH)/2,w:panelW,h:panelH};
  const cardW=(panelW-pad*2-(cols-1)*gap)/cols,cards=[];
  for(let i=0;i<CHARS.length;i++){
    const row=Math.floor(i/cols),count=Math.min(cols,CHARS.length-row*cols);
    const rowW=count*cardW+(count-1)*gap;
    cards.push({index:i,x:CX-rowW/2+(i%cols)*(cardW+gap),y:panel.y+headerH+row*(cardH+gap),w:cardW,h:cardH});
  }
  const closeSize=portrait?114:46,titleY=panel.y+(portrait?77:50);
  const close={x:panel.x+panel.w-(portrait?153:77),y:titleY-closeSize/2,w:closeSize,h:closeSize};
  return {portrait,cols,panel,cards,hats:[],close,titleY,subtitleY:panel.y+(portrait?142:91),footerY:panel.y+panelH-footerH/2,font:portrait?(cols===2?47:37):26};
}

function v9RenderCharacterSelection(){
  if(!G.v9PickerWasOpen){G.v9CharacterCursor=G.charKind;G.v9CharacterKeyboard=false;G.v9PickerWasOpen=true;}
  const layout=v9CharacterSelectionLayout(),p=layout.panel,portrait=layout.portrait;
  const snapshot=v5CharacterSnapshot(),count=snapshot.completedSets.total,unlocked=new Set(snapshot.characters.filter(c=>c.unlocked).map(c=>c.id));
  const fills=['#f3ecd7','#ecdfcf','#ead5bc','#f5e8b0','#e5eadd','#f5dec8','#e2ebef'];
  ctx.save();ctx.fillStyle='rgba(72,68,52,.49)';v7FillViewport();
  v6sBox(p.x,p.y,p.w,p.h,portrait?40:30,v6sC.paper,'#d0bda1',10);
  txt('함께 올라갈 친구',CX,layout.titleY,portrait?53:34,v6sC.ink);
  const subtitle=unlocked.size===CHARS.length?'모든 친구와 함께 올라갈 수 있어요':'한 세트의 9판을 모두 마치면 완주 · '+count+'세트';
  v6sFit(subtitle,CX,layout.subtitleY,portrait?34:20,'#8a7e65',p.w-(portrait?100:80));
  const close=layout.close,cx=close.x+close.w/2,cy=close.y+close.h/2,arm=close.w*.14;
  v6sBox(close.x,close.y,close.w,close.h,portrait?29:16,'#f0e9d9','#daccb5');
  v6sLine([[cx-arm,cy-arm],[cx+arm,cy+arm]],v6sC.ink,portrait?5:2.5);
  v6sLine([[cx+arm,cy-arm],[cx-arm,cy+arm]],v6sC.ink,portrait?5:2.5);
  for(const card of layout.cards){
    const i=card.index,open=unlocked.has(i),on=open&&i===G.charKind;
    const x=card.x,y=card.y,w=card.w,h=card.h;
    v6sBox(x,y,w,h,portrait?28:22,on?'#fffdf5':open?'#f2eadb':'#ebe7dc',on?'#7b9e77':open?'#dfd1b9':'#d7d0c0',on?4:1);
    if(on){ctx.save();ctx.strokeStyle='#80a279';ctx.lineWidth=portrait?4:3;rr(x+2,y+2,w-4,h-4,portrait?26:20);ctx.stroke();ctx.restore();}
    if(G.v9CharacterKeyboard&&G.v9CharacterCursor===i){
      ctx.save();ctx.strokeStyle='#987851';ctx.lineWidth=portrait?4:2.5;ctx.setLineDash(portrait?[10,8]:[6,5]);rr(x+7,y+7,w-14,h-14,portrait?23:16);ctx.stroke();ctx.restore();
    }
    const footY=y+h*.50,spriteScale=Math.min((h*.415)/132,(w*.70)/132);
    ell(x+w/2,y+h*.31,Math.min(w*.30,h*.24),h*.15,open?fills[i%fills.length]:'#dddccf');
    ell(x+w/2,footY+2,Math.min(w*.22,h*.20),Math.max(4,h*.022),'rgba(104,85,56,.08)');
    ctx.save();ctx.globalAlpha=open?1:.24;
    drawCharacter(i,x+w/2,footY,spriteScale,1,1+Math.sin(G.t*2.4+i)*.004,on&&G.charSelectedAt!=null&&G.t-G.charSelectedAt<.7?7:0,0);
    ctx.restore();
    if(!open){
      const lockScale=portrait?(layout.cols===2?1.75:1.42):.94;
      v6sLock(x+w/2,y+h*.31,'#998c70',lockScale);
    }
    v6sFit(CHARS[i].name,x+w/2,y+h*.585,layout.font,open?v6sC.ink:'#8d8371',w-24);
    if(open){
      const detail=snapshot.characters[i].grandfathered?'이전 기록에서 만난 친구':on?'함께하는 친구':i===0?'처음부터 함께':'함께 올라가요';
      v6sFit(detail,x+w/2,y+h*.785,portrait?30:18,on?'#6a8860':'#8e9073',w-22);
      if(on){const radius=portrait?20:12;ell(x+w-radius-14,y+radius+13,radius,radius,'#83a77d');v6sCheck(x+w-radius-14,y+radius+13,radius,'#fff9eb');}
    }else{
      const conditions=snapshot.characters[i].conditions,lineH=h*.139;
      const topY=y+h*(conditions.length===1?.795:.722);
      conditions.forEach((c,k)=>{
        const cy=topY+k*lineH,barW=w*.74,barH=portrait?7:4,barX=x+w*.13,barY=cy+h*.040;
        const caption=c.name+' '+c.progress+'/'+c.required+(c.relaxed?' ('+c.original+'→'+c.required+')':'');
        v6sFit(caption,x+w/2,cy,portrait?(layout.cols===2?40:34):17,c.met?'#64895e':'#887d65',w-20);
        v6sBox(barX,barY,barW,barH,barH/2,'#d8d4c7');
        const progress=Math.min(1,c.completed/c.required);
        if(progress>0)v6sBox(barX,barY,barW*progress,barH,barH/2,c.met?'#789a70':'#a1b38d');
      });
    }
  }
  const hint=G.v9CharacterHint&&G.v9CharacterHint.until>G.t?G.v9CharacterHint.text:'함께할 친구를 누르면 바로 바뀌어요';
  v6sFit(hint,CX,layout.footerY,portrait?31:19,G.v9CharacterHint&&G.v9CharacterHint.until>G.t?'#96704c':'#95836b',p.w-70);
  ctx.restore();
}

function v9DrawUnlockedCompanions(){
  const friends=v9UnlockedCharacters().filter(i=>i!==G.charKind).sort((a,b)=>((a-G.charKind+CHARS.length)%CHARS.length)-((b-G.charKind+CHARS.length)%CHARS.length)).slice(0,3);
  const anchors=[{x:608,y:668,s:.82,face:1},{x:805,y:702,s:.77,face:1},{x:1218,y:382,s:.75,face:-1}];
  friends.forEach((kind,i)=>{
    const f=anchors[i];ell(f.x,f.y+1,23*f.s,4*f.s,'rgba(106,85,56,.14)');
    drawCharacter(kind,f.x,f.y,f.s,f.face,1+Math.sin(G.t*2.4+i)*.004,i===2?7:0,0);
  });
}

function installV9Characters(){
  if(V9_CHARACTERS_INSTALLED)return;
  V9_CHARACTERS_INSTALLED=true;G.hat=0;LS.set('hat',0);
  drawHat=function(){};drawWings=function(){};
  const originalDrawCharacter=drawCharacter;
  drawCharacter=function(kind,x,y,scl,flip,squash,pose){return originalDrawCharacter(kind,x,y,scl,flip,squash,pose,0);};
  v8CharacterSelectionLayout=v9CharacterSelectionLayout;
  v6sRenderSelection=v9RenderCharacterSelection;
  v7hDrawCompanions=v9DrawUnlockedCompanions;
  const originalRenderTitle=renderTitle;
  renderTitle=function(){if(!G.selOpen)G.v9PickerWasOpen=false;return originalRenderTitle();};
  v9CheckCharacterUnlocks({silent:true});
  const api=window.GLIM||(window.GLIM={});
  api.characterUnlocks=v5CharacterSnapshot;
  api.setCharacterUnlockEase=v5SetCharacterUnlockEase;
  api.characterUnlockHistory=()=>v5CharacterState().history.slice();
  canvas.addEventListener('pointerdown',function(event){
    if(window.GLIM_REPORT_OPEN||!G.assetsReady||G.phase!=='title'||!G.selOpen)return;
    event.preventDefault();event.stopImmediatePropagation();initAudio();
    const point=toLogical(event),layout=v9CharacterSelectionLayout();G.v9CharacterKeyboard=false;
    for(const card of layout.cards){
      if(inR(point,card)){G.v9CharacterCursor=card.index;v9SelectCharacter(card.index);return;}
    }
    if(inR(point,layout.close)||!inR(point,layout.panel)){G.selOpen=false;G.v9PickerWasOpen=false;}
  },{capture:true,passive:false});
  addEventListener('keydown',function(event){
    if(window.GLIM_REPORT_OPEN||!G.assetsReady||G.phase!=='title'||!G.selOpen)return;
    const keys=['Escape','Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Tab'];
    if(!keys.includes(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(event.key==='Escape'){G.selOpen=false;G.v9PickerWasOpen=false;return;}
    const layout=v9CharacterSelectionLayout();
    let cursor=Number.isInteger(G.v9CharacterCursor)?G.v9CharacterCursor:G.charKind;
    if(event.key==='Enter'||event.key===' '){if(v9SelectCharacter(cursor)){G.selOpen=false;G.v9PickerWasOpen=false;}return;}
    if(event.key==='ArrowLeft')cursor--;
    if(event.key==='ArrowRight')cursor++;
    if(event.key==='ArrowUp')cursor-=layout.cols;
    if(event.key==='ArrowDown')cursor+=layout.cols;
    if(event.key==='Home')cursor=0;
    if(event.key==='End')cursor=CHARS.length-1;
    if(event.key==='Tab')cursor=(cursor+(event.shiftKey?-1:1)+CHARS.length)%CHARS.length;
    G.v9CharacterCursor=Math.max(0,Math.min(CHARS.length-1,cursor));G.v9CharacterKeyboard=true;
  },{capture:true});
}

/* ===== v9_visuals.js ===== */
/* PDF v5 presentation: nine stages, a separate pursuit stage, concise learner UI. */
const V9_VISUAL_WORLDS=[
  {name:'산 오르기',place:'산',goal:'깃발을 꽂으러 가요',action:'산 오르기',trail:'초원 → 숲 → 설원',instruction:'그림과 같은 글자를 밟아요',color:'#789e78',tint:'#e8efdb'},
  {name:'화산섬 탈출',place:'섬',goal:'구조 배를 만나러 가요',action:'섬 탈출하기',trail:'해변 → 정글 → 화산',instruction:'음절을 이어 단어를 만들어요',color:'#709f9c',tint:'#e2eeea'},
  {name:'하늘 탑 오르기',place:'탑',goal:'꼭대기의 별을 만나러 가요',action:'탑 오르기',trail:'돌탑 → 얼음탑 → 불꽃탑',instruction:'자음과 모음을 합쳐 글자를 만들어요',color:'#938daf',tint:'#eae6f0'}
];
const V9_VISUAL_THEMES=[
  {name:'초원',hazard:'water',hazardName:'강물',variants:['jump'],accent:'#7e9f75',palette:{material:'grass',ink:'#6f5546',edge:'#ab9175',stone:'#d5c3a8',shade:'#bba486',top:'#e0e9ce',rim:'#a7bf8a',leaf:'#85a572',wood:'#c6a17e',paper:'#fff9eb'}},
  {name:'숲',hazard:'darkness',hazardName:'어둠',variants:['collapse'],accent:'#638c72',palette:{material:'wood',ink:'#6f5546',edge:'#927451',stone:'#b69773',shade:'#977957',top:'#cadbb8',rim:'#8fad78',leaf:'#75976c',wood:'#ba9571',paper:'#fff9eb'}},
  {name:'설원',hazard:'snow',hazardName:'눈사태',variants:['ice'],accent:'#87aebb',palette:{material:'snow',ink:'#6f5546',edge:'#a8b9bb',stone:'#c6d3d5',shade:'#a9bdc2',top:'#fffdf6',rim:'#e5eeee',leaf:'#99b5a9',wood:'#c4a48b',paper:'#fffaf0'}},
  {name:'해변',hazard:'water',hazardName:'파도',variants:['jump'],accent:'#74a7ad',palette:{material:'sandstone',ink:'#69564a',edge:'#bba386',stone:'#dcc9ab',shade:'#bba787',top:'#f5e4be',rim:'#dec595',leaf:'#84b3a0',wood:'#c4a781',paper:'#fffaeb'}},
  {name:'정글',hazard:'darkness',hazardName:'어둠',variants:['collapse'],accent:'#6b9872',palette:{material:'wood',ink:'#645747',edge:'#867557',stone:'#b2a17b',shade:'#8d8062',top:'#c4d4a1',rim:'#86ac7b',leaf:'#649270',wood:'#b09268',paper:'#fff9e9'}},
  {name:'화산',hazard:'lava',hazardName:'용암',variants:['collapse','jump'],accent:'#c4876b',palette:{material:'masonry',ink:'#6f5149',edge:'#877977',stone:'#aa9a91',shade:'#877671',top:'#e3cab0',rim:'#c6957d',leaf:'#b98965',wood:'#bd967c',paper:'#fff8e8'}},
  {name:'돌탑',hazard:'darkness',hazardName:'어둠',variants:['collapse'],accent:'#a59476',palette:{material:'masonry',ink:'#665544',edge:'#a39984',stone:'#c6bfac',shade:'#a9a18c',top:'#e5dfc9',rim:'#b8b494',leaf:'#93a180',wood:'#b7a082',paper:'#fff8e7'}},
  {name:'얼음탑',hazard:'snow',hazardName:'눈사태',variants:['ice'],accent:'#81a8bc',palette:{material:'snow',ink:'#586477',edge:'#8cabc0',stone:'#b9d3dd',shade:'#8eafc0',top:'#edf8f8',rim:'#b9dce2',leaf:'#86b3bf',wood:'#b5b8b0',paper:'#fffcf2'}},
  {name:'불꽃탑',hazard:'lava',hazardName:'용암',variants:['jump','ice'],accent:'#bc857b',palette:{material:'spire',ink:'#6f545c',edge:'#9f8286',stone:'#bba4a6',shade:'#9b8088',top:'#f0d7bc',rim:'#d5ad91',leaf:'#ba8a91',wood:'#b79889',paper:'#fff9ec'}}
];
const v9VisClamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function v9PlayLayout(){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H,portrait:false};
  const portrait=!!v.portrait&&(G.phase==='play'||G.phase==='clear');
  const px=v.scale||scale||1;
  if(!portrait)return {portrait:false,view:v,zoom:1,footY:CHAR_SY,
    home:{x:28,y:24,w:48,h:48},mute:{x:W-76,y:24,w:48,h:48}};
  const zoom=Math.max(1.55,Math.min(2.5,v.height*.001));
  const hudBottom=v.top+116/px;
  const footY=Math.max(v.top+v.height*.66,hudBottom+24/px+(CHAR_SY-122)*zoom);
  return {portrait:true,view:v,zoom,footY,hudBottom,promptTop:footY+(122-CHAR_SY)*zoom,
    home:{x:v.left+16/px,y:v.top+18/px,w:44/px,h:44/px},
    mute:{x:v.left+v.width-60/px,y:v.top+18/px,w:44/px,h:44/px}};
}
function v9PlayToScreen(p){const l=v9PlayLayout();return l.portrait?{x:CX+(p.x-CX)*l.zoom,y:l.footY+(p.y-CHAR_SY)*l.zoom}:p;}
function v9PlayToWorld(p){const l=v9PlayLayout();return l.portrait?{x:CX+(p.x-CX)/l.zoom,y:CHAR_SY+(p.y-l.footY)/l.zoom}:p;}
function v9ApplyPlayTransform(){const l=v9PlayLayout();if(l.portrait){ctx.translate(CX,l.footY);ctx.scale(l.zoom,l.zoom);ctx.translate(-CX,-CHAR_SY);}}
function v9VisualTheme(ci=G.ci,sl=G.sl){const c=COUNTRIES[ci]||COUNTRIES[0],index=ci*3+c.themeOf(c.sets[Math.max(0,Math.min(c.sets.length-1,sl))],sl);return Object.assign({index},V9_VISUAL_THEMES[index]);}
function v9VisualIndex(theme){return v9VisClamp((G.ci||0)*3+(theme||0),0,8);}
function v9VisualStage(){return G.phase==='title'||G.phase==='map'||G.phase==='gate'?0:G.pi===0?0:G.pi<=3?.24:G.pi<=6?.54:G.pi===7?.78:1;}
function v9VariantName(type){return type==='jump'?'점프 계단':type==='ice'?'얼음 계단':type==='collapse'?'무너지는 계단':'';}
function v9HazardIcon(x,y,kind,size=18,color){
  ctx.save();ctx.translate(x,y);ctx.scale(size/18,size/18);ctx.lineCap='round';ctx.lineJoin='round';
  if(kind==='water'){
    ctx.strokeStyle=color||'#629cac';ctx.lineWidth=2.7;
    for(let row=0;row<2;row++){ctx.beginPath();ctx.moveTo(-13,-4+row*8);ctx.bezierCurveTo(-7,-12+row*8,-3,3+row*8,3,-4+row*8);ctx.bezierCurveTo(8,-11+row*8,10,-3+row*8,14,-5+row*8);ctx.stroke();}
  }else if(kind==='darkness'){
    ctx.fillStyle=color||'#7b7592';ctx.beginPath();ctx.moveTo(-16,8);ctx.bezierCurveTo(-20,-1,-11,-8,-5,-4);ctx.bezierCurveTo(-4,-17,12,-15,12,-3);ctx.bezierCurveTo(21,-1,19,10,9,10);ctx.closePath();ctx.fill();
    ell(-4,-2,2,2,'rgba(255,250,232,.55)');
  }else if(kind==='snow'){
    ctx.strokeStyle=color||'#7ca2b6';ctx.lineWidth=2.3;for(let k=0;k<3;k++){ctx.save();ctx.rotate(k*Math.PI/3);v6sLine([[0,-13],[0,13]],ctx.strokeStyle,2.3);v6sLine([[-4,-7],[0,-3],[4,-7]],ctx.strokeStyle,1.8);v6sLine([[-4,7],[0,3],[4,7]],ctx.strokeStyle,1.8);ctx.restore();}
  }else{
    ctx.fillStyle=color||'#ce8c69';ctx.beginPath();ctx.moveTo(0,-17);ctx.bezierCurveTo(0,-7,14,-5,11,7);ctx.bezierCurveTo(8,16,-10,17,-13,5);ctx.bezierCurveTo(-16,-2,-7,-7,-7,-9);ctx.quadraticCurveTo(-5,-2,0,1);ctx.quadraticCurveTo(5,-5,0,-17);ctx.fill();
    ctx.fillStyle='#f5d291';ctx.beginPath();ctx.moveTo(0,-1);ctx.quadraticCurveTo(9,8,1,12);ctx.quadraticCurveTo(-7,10,0,-1);ctx.fill();
  }ctx.restore();
}
function v9DrawVariantIcon(x,y,type,size=18,color){
  ctx.save();ctx.translate(x,y);ctx.scale(size/18,size/18);
  if(type==='jump'){
    v6sLine([[-9,4],[0,-5],[9,4]],color||'#ae8a42',3);v6sLine([[-9,-4],[0,-13],[9,-4]],color||'#ae8a42',3);
  }else if(type==='collapse'){
    v6sBox(-13,-7,26,17,4,'#b9a080');v6sLine([[-3,-7],[2,-2],[-2,3],[3,10]],color||'#775e4e',2.1);
  }else if(type==='ice'){
    v7hPolygon([[0,-14],[13,0],[0,14],[-13,0]],'#d9edf0',color||'#81abbc',1.6);v6sLine([[-2,-7],[4,-1]],'#ffffff',2.3);
  }ctx.restore();
}
function v9DrawSky(theme,progress){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H},index=v9VisualIndex(theme),img=V6_SCENE_IMAGES[index].image;
  const phase=v9VisualStage(),play=G.phase==='play'||G.phase==='clear';
  ctx.save();shadowOff();ctx.globalAlpha=1;
  const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;
  if(iw&&ih){
    const zoom=Math.max(v.width/iw,v.height/ih)*1.065,dw=iw*zoom,dh=ih*zoom;
    const dx=play?-Math.tanh((G.cam?G.cam.x:0)/1200)*12:Math.sin(G.t*.055)*3;
    const dy=play?(v9VisClamp(progress)-.5)*18:0;
    ctx.drawImage(img,v.left+(v.width-dw)/2+dx,v.top+(v.height-dh)/2+dy,dw,dh);
  }else v7FillViewport('#eee8d8');
  let wash=null,alpha=0;
  if(index===0){wash='#e9a274';alpha=phase*.25;}
  if(index===1){wash='#253a55';alpha=.10+phase*.43;}
  if(index===2){wash=phase>.9?'#344b77':'#c2ccd3';alpha=phase>.9?.34:.07+phase*.18;}
  if(index===3){wash='#edc69e';alpha=(1-phase)*.15;}
  if(index===4){wash='#634d6b';alpha=phase*.30;}
  if(index===5){wash='#303854';alpha=.08+phase*.34;}
  if(index===6){wash='#77593d';alpha=.04;}
  if(index===7){wash='#2b4870';alpha=.04+phase*.22;}
  if(index===8){wash=phase<.8?'#b86c61':'#343960';alpha=phase<.8?.10+phase*.10:.28;}
  if(wash){ctx.globalAlpha=alpha;v7FillViewport(wash);ctx.globalAlpha=1;}
  if(index===7&&phase>.28){
    ctx.save();ctx.globalAlpha=(phase-.28)*.25;ctx.strokeStyle='#bcebd0';ctx.lineWidth=35;
    ctx.beginPath();ctx.moveTo(v.left-50,160);ctx.bezierCurveTo(340,25,840,230,v.left+v.width+70,80);ctx.stroke();
    ctx.strokeStyle='#cdd2f1';ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(v.left-40,191);ctx.bezierCurveTo(350,30,910,264,v.left+v.width+50,102);ctx.stroke();ctx.restore();
  }
  const night=(index===1&&phase>.4)||(index===2&&phase>.9)||(index===5&&phase>.6)||(index===7&&phase>.4)||(index===8&&phase>.6);
  if(night){
    ctx.save();for(let i=0;i<19;i++){const xx=v.left+((i*137+63)%Math.max(1,v.width)),yy=v.top+40+(i*57)%Math.max(100,Math.min(v.height*.3,360));ctx.globalAlpha=.25+.30*(.5+.5*Math.sin(G.t*.8+i));ell(xx,yy,i%4?1.3:2, i%4?1.3:2,'#fff9d9');}ctx.restore();
    if(index===2||index===8){ctx.globalAlpha=.72;ell(v.left+v.width*.82,v.top+v.height*.13,24,24,'#fff0ca');ell(v.left+v.width*.82+9,v.top+v.height*.13-5,23,23,index===2?'#8199b1':'#8e879b');ctx.globalAlpha=1;}
  }
  if(play||G.phase==='gate'){
    const head=ctx.createLinearGradient(0,v.top,0,125);head.addColorStop(0,'rgba(255,250,237,.38)');head.addColorStop(1,'rgba(255,250,237,0)');ctx.fillStyle=head;ctx.fillRect(v.left,v.top,v.width,Math.max(0,140-v.top));
  }ctx.restore();
}
function v9DrawDecor(){
  const theme=v9VisualTheme(),index=theme.index,phase=v9VisualStage();ctx.save();shadowOff();
  const snow=index===2||index===7,fire=index===5||index===8,firefly=index===1||index===4;
  const count=snow?(index===2&&phase>.9?5:phase>.4?14:8):firefly?9:6;
  for(let i=0;i<count;i++){
    const margin=i%2===0?70:W-70,xx=margin+Math.sin(G.t*(snow?.36:.24)+i*2.1)*45;
    const yy=142+((i*91+G.t*(snow?19:fire?-11:5))%490+490)%490;
    if(snow){ctx.globalAlpha=index===2&&phase>.9?.42:.64;ell(xx,yy,i%3?2.1:3,i%3?2.1:3,'#fffef8');}
    else if(firefly){ctx.globalAlpha=.25+.40*(.5+.5*Math.sin(G.t*1.8+i*2));ctx.shadowColor='#f7dc9c';ctx.shadowBlur=11;ell(xx,yy,2.4,2.4,'#fff1ad');shadowOff();}
    else if(fire){ctx.globalAlpha=.32;ell(xx,yy,1.8,3,'#ffd99f');}
    else{ctx.globalAlpha=.20;v7hLeaf(xx,yy,3.2,Math.sin(G.t*.4+i)*.5,theme.accent);}
  }
  if(index===6){
    for(const x of [72,W-72]){ctx.globalAlpha=.16+.025*Math.sin(G.t*2);const g=ctx.createRadialGradient(x,205,1,x,205,73);g.addColorStop(0,'#ffdc8e');g.addColorStop(1,'rgba(255,214,128,0)');ctx.fillStyle=g;ctx.fillRect(x-75,130,150,150);ctx.globalAlpha=1;v6sBox(x-10,189,20,32,6,'#c4a16d','#96774f');ell(x,204,5,10,'#fff0bb');}
  }ctx.restore();
}
function v9HazardGeometry(){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H},theme=v9VisualTheme(),foot=v9PlayToScreen({x:CX,y:G.char?sy(G.char.y):CHAR_SY}).y;
  const bottom=v.top+v.height,ratio=G.timeMax?v9VisClamp(G.time/G.timeMax):1;
  const safe=bottom-30,reach=Math.min(foot+10,bottom-95),catching=G.v9Catch&&G.t-G.v9Catch.at>=0&&G.t-G.v9Catch.at<G.v9Catch.duration;
  let y=reach+(safe-reach)*ratio,catchProgress=null;
  if(catching){catchProgress=v9VisClamp((G.t-G.v9Catch.at)/G.v9Catch.duration);const pulse=Math.sin(Math.min(1,catchProgress/.74)*Math.PI),surge=164*v9PlayLayout().zoom;y=catchProgress<.74?foot+10-pulse*surge:foot+10+(safe-foot-10)*smoothUnit((catchProgress-.74)/.26);}
  return {view:v,bottom,foot,ratio,y,theme,catching,catchProgress};
}
function v9DrawHazard(overCharacter=false){
  const chase=typeof v3ChaserState==='function'?v3ChaserState():{active:false};
  if(G.phase!=='play'||!G.budget||!curItem()||!chase.active){G.v9HazardVisual=null;return;}
  const h=v9HazardGeometry(),kind=h.theme.hazard,v=h.view,bottom=h.bottom,x0=v.left-16,x1=v.left+v.width+16;
  if(overCharacter&&(!h.catching||h.catchProgress>.78))return;
  G.v9HazardVisual={kind,y:h.y,ratio:h.ratio,foot:h.foot,bottom,caught:!!h.catching};
  ctx.save();shadowOff();ctx.globalAlpha=overCharacter?.85:1;
  const colors=kind==='water'?['#c4e8e5','#639cac','#467f9a']:kind==='snow'?['#fcfff9','#dbe6e5','#b6cbd2']:kind==='lava'?['#ffe1a5','#e39a6a','#bc6960']:['#a4a1b3','#69667f','#4a506a'];
  const amp=kind==='water'?8:kind==='snow'?12:kind==='darkness'?18:6,points=[];
  for(let x=x0;x<=x1+40;x+=32){const y=h.y+Math.sin(x/(kind==='water'?53:84)+G.t*(kind==='water'?1.6:.8))*amp+Math.cos(x/129-G.t*.55)*amp*.35;points.push([x,y]);}
  const path=()=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.lineTo(x1+50,bottom+25);ctx.lineTo(x0,bottom+25);ctx.closePath();};
  path();const fill=ctx.createLinearGradient(0,h.y-10,0,Math.max(h.y+130,bottom));fill.addColorStop(0,colors[0]);fill.addColorStop(kind==='darkness'?.14:.065,colors[1]);fill.addColorStop(1,colors[2]);ctx.fillStyle=fill;ctx.fill();
  if(kind==='water'||kind==='lava'){
    ctx.strokeStyle=kind==='water'?'rgba(242,255,247,.86)':'#ffe6b7';ctx.lineWidth=kind==='water'?3.5:4.5;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    if(kind==='lava'){ctx.shadowColor='#ffc781';ctx.shadowBlur=17;}ctx.stroke();shadowOff();
    for(let i=0;i<9;i++){const xx=x0+50+(i*151+G.t*(kind==='water'?11:-8))%(v.width+80),yy=h.y+32+(i%3)*21;ctx.globalAlpha=overCharacter?.4:.45;
      if(kind==='water')v6sLine([[xx-18,yy],[xx-7,yy+2],[xx+10,yy-1]],'#d6edeb',2);
      else{ell(xx,yy,4+i%3,2+i%2,'#ffd59b');}ctx.globalAlpha=overCharacter?.85:1;
    }
  }else if(kind==='snow'){
    ctx.strokeStyle='rgba(255,255,250,.9)';ctx.lineWidth=4;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]+4):ctx.moveTo(p[0],p[1]+4));ctx.stroke();
    for(let i=0;i<12;i++){const xx=x0+(i*123+G.t*19)%(v.width+80),yy=h.y+30+i%3*19;ell(xx,yy,1.8,1.8,'rgba(255,255,255,.8)');}
  }else{
    ctx.globalAlpha=overCharacter?.22:.18;for(let i=0;i<10;i++){const xx=x0+i*v.width/8+Math.sin(G.t*.7+i)*18;ell(xx,h.y+12+Math.sin(i+G.t*.3)*11,77,22,'#c1bac8');}ctx.globalAlpha=overCharacter?.85:1;
  }
  ctx.restore();
}
function v9DrawStepDetail(x,y,alpha,dip){
  const type=G.v9DrawingVariant;if(!type)return;
  ctx.save();ctx.globalAlpha=alpha==null?1:alpha;ctx.translate(sx(x),sy(y)+(dip||0));ctx.scale(WS,WS);ctx.lineCap='round';ctx.lineJoin='round';
  if(type==='jump'){
    v6sBox(-45,24,90,21,7,'#f0d996','#b99c62');
    for(const xx of [-14,14])v6sLine([[xx-7,39],[xx,31],[xx+7,39]],'#9d7a40',2.6);
    ctx.globalAlpha=(alpha==null?1:alpha)*(.15+.06*Math.sin(G.t*4));ell(0,12,80,8,'#f8e6a4');
  }else if(type==='ice'){
    const g=ctx.createLinearGradient(0,0,0,26);g.addColorStop(0,'rgba(242,255,255,.94)');g.addColorStop(.45,'rgba(178,222,232,.82)');g.addColorStop(1,'rgba(125,187,208,.65)');ctx.fillStyle=g;rr(-102,1,204,24,9);ctx.fill();
    v6sLine([[-71,6],[-53,17]],'#ffffff',2.5);v6sLine([[-57,5],[-39,17]],'rgba(255,255,255,.65)',1.7);v6sLine([[37,6],[60,18]],'rgba(255,255,255,.7)',2);
    for(const xx of [-77,72]){v7hPolygon([[xx,23],[xx+5,23],[xx+2,38]],'#c9e9ec','#99c7d4',.8);}
    v9DrawVariantIcon(0,35,'ice',10);
  }else{
    ctx.strokeStyle='#77634f';ctx.lineWidth=2.1;ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(-25,9);ctx.lineTo(-34,15);ctx.lineTo(-26,24);ctx.lineTo(-33,33);ctx.lineTo(-28,48);ctx.moveTo(42,0);ctx.lineTo(35,10);ctx.lineTo(44,17);ctx.lineTo(33,28);ctx.lineTo(39,43);ctx.stroke();
    v6sLine([[-33,15],[-47,19]],'#8e795b',1.4);v6sLine([[33,28],[22,26]],'#8e795b',1.4);
    if(dip>1){for(const q of [-52,16,66]){v7hPolygon([[q,43],[q+6,44],[q+3,50+dip*.6],[q-2,48]],'#b8a17d');}}
  }ctx.restore();
}
function v9DrawTerrainFX(){
  const f=G.v9TerrainFX;if(!f)return;const age=G.t-f.at;if(age<0||age>.72)return;
  const x=sx(f.x),y=sy(f.y);ctx.save();ctx.globalAlpha=1-age/.72;
  if(f.type==='jump'){
    for(let i=0;i<3;i++){v9DrawVariantIcon(x+(i-1)*22,y+34-age*44,'jump',10,'#b69857');}
  }else if(f.type==='ice'){
    for(let i=0;i<5;i++){const dir=i%2?1:-1;ell(x+dir*(15+age*95+i*5),y+6+age*12,3,1.5,'#ecffff');}
  }else if(f.type==='collapse'){
    for(let i=0;i<7;i++){const xx=x+(i-3)*18+Math.sin(i)*age*36,yy=y+29+age*age*180;v7hPolygon([[xx-4,yy],[xx+5,yy-3],[xx+8,yy+4],[xx,yy+9]],'#b69f80');}
  }ctx.restore();
}

function v9VisualStars(ci,sl,pi){return typeof v9StarsOf==='function'?v9StarsOf(ci,sl,pi):starsOf(ci,sl,pi);}
function v9VisualSetOpen(ci,sl){return typeof v9SetUnlocked==='function'?v9SetUnlocked(ci,sl):setUnlocked(ci,sl);}
function v9VisualPanOpen(ci,sl,pi){return typeof v9PanUnlocked==='function'?v9PanUnlocked(ci,sl,pi):panUnlocked(ci,sl,pi);}
function v9MapLayout(){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H,portrait:false},portrait=!!v.portrait,n=country().sets.length;
  const cols=portrait?2:4,rows=Math.ceil(n/cols),x=portrait?68:90,gapX=portrait?22:18,gapY=portrait?18:15;
  const width=portrait?1144:1100,cw=(width-(cols-1)*gapX)/cols,top=portrait?v.top+236:164;
  const ch=portrait?Math.max(94,Math.min(268,(v.height-316-(rows-1)*gapY)/rows)):116;
  const cards=Array.from({length:n},(_,i)=>({index:i,x:x+(i%cols)*(cw+gapX),y:top+Math.floor(i/cols)*(ch+gapY),w:cw,h:ch}));
  return {view:v,portrait,cards,cols,top,titleY:portrait?v.top+90:52,subY:portrait?v.top+157:108,home:{x:portrait?68:28,y:portrait?v.top+44:24,w:portrait?112:74,h:portrait?68:46}};
}
function v9PanLayout(){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H,portrait:false},portrait=!!v.portrait;
  const panel=portrait?{x:60,y:v.top+88,w:1160,h:Math.min(v.height-172,1920)}:{x:180,y:46,w:920,h:628};
  const cols=3,rows=Math.ceil(PANS.length/cols),gx=portrait?22:18,gy=portrait?24:14,margin=portrait?38:42;
  const top=panel.y+(portrait?248:158),cw=(panel.w-2*margin-gx*(cols-1))/cols;
  const ch=(panel.h-(portrait?352:230)-(rows-1)*gy)/rows;
  const cards=Array.from({length:PANS.length},(_,i)=>({index:i,x:panel.x+margin+(i%cols)*(cw+gx),y:top+Math.floor(i/cols)*(ch+gy),w:cw,h:ch}));
  return {portrait,panel,cards,close:{x:panel.x+panel.w-(portrait?108:66),y:panel.y+(portrait?31:24),w:portrait?64:40,h:portrait?64:40},titleY:panel.y+(portrait?65:52),wordY:panel.y+(portrait?137:99),themeY:panel.y+(portrait?194:132),footerY:panel.y+panel.h-(portrait?54:40)};
}
function v9DrawThumbnail(index,x,y,w,h,alpha=1){
  const img=V6_SCENE_IMAGES[index].image;ctx.save();ctx.globalAlpha=alpha;rr(x,y,w,h,Math.min(15,h*.18));ctx.clip();
  if(img.naturalWidth&&img.naturalHeight){const z=Math.max(w/img.naturalWidth,h/img.naturalHeight);ctx.drawImage(img,x+(w-img.naturalWidth*z)/2,y+(h-img.naturalHeight*z)/2,img.naturalWidth*z,img.naturalHeight*z);}
  else{ctx.fillStyle=V9_VISUAL_THEMES[index].accent;ctx.fillRect(x,y,w,h);}ctx.restore();
}
function v9RenderMap(){
  const layout=v9MapLayout(),c=country(),world=V9_VISUAL_WORLDS[G.ci],portrait=layout.portrait,v=layout.view;
  UI.home=layout.home;ctx.save();shadowOff();ctx.fillStyle='rgba(255,249,235,.76)';v7FillViewport();
  v6sHomeButton(UI.home);txt(c.name,CX,layout.titleY,portrait?53:38,v6sC.ink);
  txt(world.name+' · '+world.goal,CX,layout.subY,portrait?30:22,'#8a7864');
  const starBox=portrait?{x:1042,y:v.top+44,w:172,h:68}:{x:1092,y:25,w:160,h:46};
  v6sBox(starBox.x,starBox.y,starBox.w,starBox.h,portrait?24:17,'#fff9eb','#d9cbb1');v6sStar(starBox.x+29,starBox.y+starBox.h/2,portrait?15:10,'#d3ad58');txt(String(totalStars()),starBox.x+starBox.w*.63,starBox.y+starBox.h/2+1,portrait?31:23,'#897350');
  // A narrow route connects every visible card in the actual reading order.
  ctx.save();ctx.lineCap='round';ctx.strokeStyle='#d4c7aa';ctx.lineWidth=portrait?4:2.6;ctx.setLineDash([3,9]);
  layout.cards.forEach((r,i)=>{if(!i||i%layout.cols===0)return;const last=layout.cards[i-1];ctx.beginPath();ctx.moveTo(last.x+last.w,last.y+last.h/2);ctx.lineTo(r.x,r.y+r.h/2);ctx.stroke();});ctx.restore();
  for(const r of layout.cards){
    const i=r.index,s=SETS[c.sets[i]],theme=v9VisualTheme(G.ci,i),open=v9VisualSetOpen(G.ci,i),done=PANS.every((_,k)=>v9VisualStars(G.ci,i,k)>0);
    const finished=PANS.filter((_,k)=>v9VisualStars(G.ci,i,k)>0).length,large=portrait&&r.h>=180;
    v6sBox(r.x,r.y,r.w,r.h,portrait?28:21,open?'#fffaf0':'#f0eee1',open?'#cdbd9f':'#d9d1bc',open?4:1);
    const numX=r.x+(large?40:29),headY=r.y+(large?38:28),numR=large?25:19;
    ell(numX,headY,numR,numR,open?theme.accent:'#bebfac');txt(String(i+1),numX,headY+1,large?29:24,'#fffdf0');
    txt(theme.name,r.x+(large?80:58),headY,large?30:19,open?'#746954':'#aaa18c','left');
    const kindX=r.x+r.w-(large?117:99);v9HazardIcon(kindX,headY,theme.hazard,large?17:12,open?undefined:'#ada995');
    txt(theme.hazardName,kindX+(large?25:18),headY+1,large?23:15,open?'#928066':'#aaa18c','left');
    const tx=r.x+(large?21:11),ty=r.y+(large?75:48),tw=large?117:66,th=large?r.h-111:48;
    v9DrawThumbnail(theme.index,tx,ty,tw,Math.max(25,th),open?1:.43);
    const wordX=tx+tw+(large?20:13),wordW=r.x+r.w-wordX-(large?23:15);
    v6sFit(s.words.map(w=>w[0]).join(' · '),wordX+wordW/2,r.y+(large?r.h*.50:66),large?36:22,open?v6sC.ink:'#a89f8a',wordW);
    if(open){
      const pgX=wordX,pgY=r.y+r.h-(large?38:20),step=Math.min(large?30:16,(wordW-35)/PANS.length),bw=Math.min(large?23:10,step-3);
      for(let k=0;k<PANS.length;k++)v6sBox(pgX+k*step,pgY,bw,large?8:6,4,v9VisualStars(G.ci,i,k)>0?theme.accent:'#e7dfcc');
      txt(finished+'/'+PANS.length,r.x+r.w-(large?38:28),pgY+4,large?24:16,'#978467');
      if(done){ell(r.x+r.w-23,r.y+r.h-23,0,0,'#e3edd9');}
    }else{
      const label='앞 세트 정상에서 열려요';v6sFit(label,wordX+wordW/2,r.y+r.h-(large?38:19),large?21:13,'#aaa08c',wordW);
      v6sLock(r.x+r.w-(large?25:17),r.y+r.h-(large?23:12),'#aaa08c',large?.83:.59);
    }
  }
  if(c.sets.length===6){
    const tail=layout.cards[layout.cards.length-1],y=Math.min(v.top+v.height-92,tail.y+tail.h+(portrait?70:93));
    txt('해변에서 시작해, 정글과 화산을 지나가요',CX,y,portrait?30:26,'#8d987b');
    txt('정상에서 불꽃 신호를 보내면 구조 배가 와요',CX,y+(portrait?49:43),portrait?25:20,'#9a8b71');
  }
  ctx.restore();if(G.mapSel>=0)v9RenderPans();
}
function v9RenderPans(){
  const l=v9PanLayout(),c=country(),sl=G.mapSel,theme=v9VisualTheme(G.ci,sl),s=SETS[c.sets[sl]],world=V9_VISUAL_WORLDS[G.ci],p=l.panel,portrait=l.portrait;
  ctx.save();ctx.fillStyle='rgba(58,58,53,.47)';v7FillViewport();v6sBox(p.x,p.y,p.w,p.h,portrait?38:29,'#fff9eb','#d0bca0',9);
  const r=l.close;v6sBox(r.x,r.y,r.w,r.h,portrait?20:14,'#efe7d8','#d8c8ae');v6sLine([[r.x+r.w*.36,r.y+r.h*.36],[r.x+r.w*.64,r.y+r.h*.64]],'#89715a',portrait?3.2:2.3);v6sLine([[r.x+r.w*.64,r.y+r.h*.36],[r.x+r.w*.36,r.y+r.h*.64]],'#89715a',portrait?3.2:2.3);
  txt((sl+1)+'세트 · '+theme.name,CX,l.titleY,portrait?50:36,v6sC.ink);
  v6sFit(s.words.map(w=>w[1]+' '+w[0]).join('   '),CX,l.wordY,portrait?38:27,'#8b755d',p.w-(portrait?115:160));
  const subtitle=theme.hazardName+'  ·  '+theme.variants.map(v9VariantName).join(' + ');
  v6sFit(subtitle,CX,l.themeY,portrait?29:19,theme.accent,p.w-100);
  const next=l.cards.find(r=>v9VisualPanOpen(G.ci,sl,r.index)&&!v9VisualStars(G.ci,sl,r.index));
  for(const r of l.cards){
    const k=r.index,open=v9VisualPanOpen(G.ci,sl,k),st=v9VisualStars(G.ci,sl,k),current=next&&next.index===k,P=PANS[k],large=portrait&&r.h>190;
    v6sBox(r.x,r.y,r.w,r.h,portrait?25:20,open?'#fffdf6':'#f0eddf',current?theme.accent:'#dbcfb8',open?3:1);
    if(current){ctx.save();ctx.strokeStyle=theme.accent;ctx.lineWidth=3;rr(r.x+2,r.y+2,r.w-4,r.h-4,portrait?23:18);ctx.stroke();ctx.restore();}
    const middle=r.x+r.w/2;txt((sl*PANS.length+k+1)+'단계',middle,r.y+r.h*.17,large?26:17,open?'#948065':'#aca48e');
    if(!open)v6sLock(r.x+r.w-(large?28:18),r.y+(large?27:18),'#b0a68f',large?.82:.62);
    const unit=c.key==='pho'?'단어':'층',length=c.lens[k];
    const title=k===0?'첫걸음':k===7?'추격':P.top?(G.ci===0?'깃발까지':G.ci===1?'구조 배까지':'별까지'):length+unit;
    v6sFit(title,middle,r.y+r.h*.43,large?45:28,open?v6sC.ink:'#b0a48d',r.w-30);
    const sub=k===0?length+unit+' · 연습':k===7?length+unit+' · '+theme.hazardName:P.top?length+unit+' · 정상':P.sp==='low'?'천천히':P.sp==='mid'?'보통':'빠르게';
    v6sFit(sub,middle,r.y+r.h*.67,large?29:18,open?'#8b8f73':'#b3aa94',r.w-25);
    if(open){for(let q=0;q<3;q++)v6sStar(middle+(q-1)*(large?34:23),r.y+r.h*.87,large?13:8,q<st?'#d8b35b':'#e7dcc4');}
    else v6sLine([[middle-22,r.y+r.h*.87],[middle+22,r.y+r.h*.87]],'#d4ccba',2);
  }
  txt('정상에 닿으면 다음 세트가 열려요',CX,l.footerY,portrait?30:20,'#978267');ctx.restore();
}
function v9GateLayout(){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H,portrait:false},portrait=!!v.portrait;
  if(portrait){const top=v.top+Math.max(80,(v.height-1010)/2);return {portrait,top,questionY:top+330,artY:top+202,footerY:top+875,cards:[{x:130,y:top+433,w:1020,h:171},{x:130,y:top+637,w:1020,h:171}],home:{x:68,y:v.top+50,w:112,h:68}};}
  return {portrait,top:71,questionY:341,artY:249,footerY:620,cards:[{x:298,y:405,w:312,h:130},{x:670,y:405,w:312,h:130}],home:{x:28,y:24,w:74,h:46}};
}
function v9RenderGate(){
  const g=G.v9Gate,l=v9GateLayout(),world=V9_VISUAL_WORLDS[G.ci],theme=v9VisualTheme();UI.home=l.home;
  drawSky(themeIdx(),0);drawDecor();ctx.save();ctx.fillStyle='rgba(255,249,234,.57)';v7FillViewport();v6sHomeButton(UI.home);
  const p=l.portrait,question=g&&g.questions&&g.questions[g.index];
  txt('출발 전, 그림을 살펴봐요',CX,l.top+(p?20:28),p?54:38,v6sC.ink);
  txt(country().name+' · '+(G.sl+1)+'세트',CX,l.top+(p?83:82),p?32:22,'#947d61');
  for(let i=0;i<3;i++){const xx=CX+(i-1)*(p?54:36);ell(xx,l.top+(p?132:127),p?12:8,p?12:8,i<(g?g.index:0)?theme.accent:i===(g?g.index:0)?'#e6c47a':'#e2d6c1');}
  v6pCard(CX-(p?108:73),l.artY-(p?38:19),p?216:146,p?186:137,p?38:27,'#fff9ec','#d7c6a8');
  txt(question?question.emoji:'✨',CX,l.artY+(p?54:43),p?105:78,'#000');
  txt('그림과 같은 글자를 골라요',CX,l.questionY,p?40:27,'#826d55');
  for(let side=0;side<2;side++){
    const r=l.cards[side],chosen=g&&g.picked===side,feedback=chosen&&g.feedback;
    const hint=question&&question.tries>0&&question.firstCorrect===false&&question.side===side;
    const fill=feedback==='ok'?'#e9efd9':feedback==='wrong'?'#f6e4d9':'#fffaf0',line=feedback==='ok'?'#8da67a':feedback==='wrong'?'#ce9983':hint?'#adab6b':'#c7b393';
    v6sBox(r.x,r.y+7,r.w,r.h,p?30:24,'#d1bea0');v6sBox(r.x,r.y,r.w,r.h,p?30:24,fill,line,2);
    if(hint){ctx.save();ctx.strokeStyle='#dcc371';ctx.globalAlpha=.48+.20*Math.sin(G.t*4);ctx.lineWidth=p?6:4;rr(r.x+2,r.y+2,r.w-4,r.h-4,p?28:22);ctx.stroke();ctx.restore();}
    v6sFit(question?question.options[side]:'',r.x+r.w/2,r.y+r.h/2,p?70:52,'#68513e',r.w-90);
    if(feedback==='ok'){ell(r.x+r.w-36,r.y+32,16,16,'#93b080');v6sCheck(r.x+r.w-36,r.y+32,16,'#fff9e9');}
  }
  const msg=g&&g.feedback==='ok'?'잘 찾았어요!':g&&g.feedback==='wrong'?'괜찮아요. 빛나는 글자를 골라요':'세 그림을 살펴보면 계단이 시작돼요';
  txt(msg,CX,l.footerY,p?34:22,g&&g.feedback==='ok'?'#6b9168':'#9a8064');ctx.restore();
}

let v9BaseHomeStairway=null;
function v9HomeStairway(s,groundBottom){
  if(G.ci===0){v9BaseHomeStairway(s,groundBottom);return;}
  const {x,y,run,rise,n,bx,by}=s,end=x+n*run,top=y-(n-1)*rise,bottom=Math.max(870,groundBottom||870),sea=G.ci===1;
  const palette=V9_VISUAL_THEMES[G.ci*3].palette;
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  if(sea){
    const ocean=ctx.createLinearGradient(0,y+26,0,bottom);ocean.addColorStop(0,'#afcfca');ocean.addColorStop(1,'#84b6b9');ctx.fillStyle=ocean;ctx.fillRect(x-100,y+95,end-x+490,bottom-y);
    for(let i=0;i<5;i++){const yy=y+132+i*43;v6sLine([[x+Math.sin(G.t*.4+i)*14-58,yy],[x+14,yy-5],[x+82,yy]],'rgba(238,249,229,.6)',3);}
    ctx.fillStyle='#e6d5af';ctx.beginPath();ctx.moveTo(x-164,y+89);ctx.bezierCurveTo(x-70,y+25,x+20,y+62,x+123,y+68);ctx.bezierCurveTo(end+70,top-47,end+244,top+7,end+309,top+153);ctx.lineTo(end+255,bottom);ctx.lineTo(x-230,bottom);ctx.closePath();ctx.fill();
    ell(end+57,top+15,112,25,'#cbd7aa');
    v7hLine([[end+95,top+21],[end+90,top-33],[end+111,top-96]],'#b59a70',8);
    for(let i=0;i<4;i++)v7hLeaf(end+108,top-91,26,(i-1.5)*.78,'#88ab86');
    v7hLine([[x-65,y+49],[x-46,y+12]],'#c4b085',3);ell(x-38,y+38,13,7,'#f9edcf');
  }else{
    // Large masonry terraces belong to the tower and carry the same continuous stair flight.
    v7hPolygon([[x-89,y+47],[end+82,top-6],[end+155,top+37],[end+139,bottom],[x-104,bottom]],'#beb5a0','#a49680',2);
    ctx.save();v7hPolygon([[x-89,y+47],[end+82,top-6],[end+155,top+37],[end+139,bottom],[x-104,bottom]]);ctx.clip();
    for(let j=0;j<8;j++){const yy=top+59+j*74;v6sLine([[x-89,yy],[end+148,yy]],'rgba(144,131,108,.25)',2);for(let i=0;i<4;i++){const xx=x+45+i*167+(j%2)*75;v6sLine([[xx,yy],[xx,yy+72]],'rgba(144,131,108,.23)',1.8);}}
    ctx.restore();
    v6sBox(end+30,top+65,74,129,35,'#8f8e86','#a09580');v6sBox(end+42,top+80,50,114,25,'#b9c6c3');v6sStar(end+67,top+119,14,'#f6e1a1');
    ell(x-47,y+95,65,13,'rgba(91,79,58,.12)');v6sBox(x-78,y+36,58,61,12,'#d3c8ae','#aa987a');v6sBox(x-82,y+29,66,20,7,'#e9e0c7','#b19f80');
  }
  const outline=[[x,y]];for(let i=0;i<n;i++){outline.push([x+(i+1)*run,y-i*rise]);if(i<n-1)outline.push([x+(i+1)*run,y-(i+1)*rise]);}outline.push([end+7,top+80],[x+5,y+82],[x-2,y+46]);
  ctx.shadowColor='rgba(88,75,55,.14)';ctx.shadowBlur=14;ctx.shadowOffsetY=9;v7hPolygon(outline,palette.stone,palette.edge,2);shadowOff();
  for(let i=n-1;i>=0;i--){
    const xx=x+i*run,yy=y-i*rise;
    if(i>0)v7hPolygon([[xx,yy],[xx+bx,yy+by],[xx+bx,yy+rise+by],[xx,yy+rise]],palette.shade,palette.edge,1.6);
    v7hPolygon([[xx-2,yy],[xx+run,yy],[xx+run+bx,yy+by],[xx+bx-2,yy+by]],palette.top,palette.edge,1.6);
    v7hPolygon([[xx-2,yy],[xx+run,yy],[xx+run,yy+7],[xx+5,yy+8],[xx-2,yy+5]],palette.rim);
    v7hLine([[xx+5,yy+1],[xx+run-6,yy+1]],'#fff5dd',2.5);v7hLine([[xx+run,yy+7],[xx+run,yy+67]],rgba(palette.edge,.6),1.8);
    v7hLine([[xx+13,yy+39],[xx+31,yy+40],[xx+58,yy+29]],rgba(palette.edge,.25),1.5);
  }
  v7hPolygon([[end-run,top],[end+74,top],[end+74+bx,top+by],[end-run+bx,top+by]],palette.top,palette.edge,1.6);
  if(sea){v7hPlant(end+67,top+43,.95,'#f3cdb2');}
  else{v6sStar(end+32,top-35,24,'#efd890');ell(end+32,top-35,41,41,'rgba(248,226,168,.09)');}
  ctx.restore();
}
function v9HomeSign(x,y){
  ctx.save();v6sBox(x-4,y+6,9,52,4,'#bd9d76','#9e835f');
  v7hPolygon([[x-50,y-34],[x+27,y-34],[x+53,y-9],[x+26,y+17],[x-50,y+17]],'#ede0bd','#a9936c',2);
  v7hLine([[x-41,y-28],[x+23,y-28]],'rgba(255,249,223,.7)',2);
  v72Text(G.ci===0?'정상':G.ci===1?'구조 배':'별',x-4,y-8,23,'#75613d','center','selected');ell(x-38,y-7,2,2,'#aa8e64');ctx.restore();
}
function v9RenderTitle(){
  v7hHomeLayout();const v=V7_VIEW||{left:0,top:0,width:W,height:H,portrait:false},portrait=v.portrait,world=V9_VISUAL_WORLDS[G.ci],s=v7hStairData();
  ctx.save();shadowOff();
  if(portrait){
    const t=v.top,h=v.height,artScale=Math.min(1.62,h/1400),artY=t+h*.489-460*artScale;
    const wash=ctx.createLinearGradient(0,t,0,t+h*.66);wash.addColorStop(0,'rgba(255,249,231,.74)');wash.addColorStop(.65,'rgba(255,249,231,.44)');wash.addColorStop(1,'rgba(255,249,231,0)');ctx.fillStyle=wash;ctx.fillRect(v.left,t,v.width,h);
    v6sBox(96,t+54,139,76,26,'rgba(255,250,237,.92)','#dbccac');v72Text('글림',165,t+93,42,'#678259','center','brand');
    const m=UI.mute;v6sBox(m.x,m.y,m.w,m.h,26,'#fff9ed','#d9cfb9',3);v6pSpeaker(m.x+m.w/2,m.y+m.h/2,39,G.mute);
    v72Text(country().name+' · '+world.name,CX,t+h*.132,40,world.color,'center','eyebrow');
    v72HomeLogo('한글 계단',CX,t+h*.198,126,'center');
    v72Text(world.instruction,CX,t+h*.253,40,'#8d7653','center','tagline');
    ctx.save();ctx.translate(CX-920*artScale,artY);ctx.scale(artScale,artScale);v7hStairway(s,(t+h-artY)/artScale+12);v7hDrawCompanions();v9HomeSign(1160,297);v7hClimber(s);ctx.restore();
    const sg=UI.seg;v6sBox(sg.x,sg.y,sg.w,sg.h,35,'#eee5cd','#d2c09e',3);
    for(let i=0;i<3;i++){const xx=sg.x+i*sg.w/3,on=i===G.ci;if(on)v6sBox(xx+8,sg.y+8,sg.w/3-16,sg.h-16,28,'#fffaf0','#c4af86',3);v72Text(COUNTRIES[i].name,xx+sg.w/6,sg.y+sg.h/2+2,49,on?V9_VISUAL_WORLDS[i].color:'#a19373','center',on?'selected':'');}
    const p=UI.play;v6sBox(p.x,p.y+10,p.w,p.h,39,'#5c7d6b');v6sBox(p.x,p.y,p.w,p.h,39,world.color,'#63845c');v72Text(world.action,p.x+p.w/2-20,p.y+p.h/2,60,'#fff9df','center','primary');v7hLine([[p.x+p.w-119,p.y+p.h/2-16],[p.x+p.w-102,p.y+p.h/2],[p.x+p.w-119,p.y+p.h/2+16]],'#fffbed',6);
    const ch=UI.char;v6sBox(ch.x,ch.y+8,ch.w,ch.h,35,'#cdb994');v6sBox(ch.x,ch.y,ch.w,ch.h,35,'#fff5de','#d0b993');v72Text('친구 고르기',ch.x+ch.w/2,ch.y+ch.h/2,48,'#816643','center','selected');
    v6sStar(121,t+h*.970,16,'#d1b365');v72Text(String(totalStars()),151,t+h*.970+2,34,'#967439','left');v72Text(CHARS[G.charKind].name+'와 함께',1183,t+h*.970,31,'#7d805c','right');
  }else{
    Object.assign(UI,{seg:{x:80,y:405,w:475,h:75},play:{x:80,y:511,w:287,h:80},char:{x:381,y:511,w:174,h:80}});
    const wash=ctx.createLinearGradient(0,0,790,0);wash.addColorStop(0,'rgba(255,249,231,.89)');wash.addColorStop(.60,'rgba(255,249,231,.68)');wash.addColorStop(1,'rgba(255,249,231,0)');ctx.fillStyle=wash;ctx.fillRect(v.left,v.top,805-v.left,v.height);
    v6sBox(80,30,80,37,15,'rgba(255,250,237,.91)','#dbccac');v72Text('글림',120,49,24,'#678259','center','brand');v72HomeSoundButton();
    v7hStairway(s);v7hDrawCompanions();v9HomeSign(1160,297);v7hClimber(s);
    v72Text(country().name+' · '+world.name,84,173,24,world.color,'left','eyebrow');v72HomeLogo('한글 계단',77,250,88,'left');v72Text(world.instruction,84,319,26,'#8d7653','left','tagline');
    v6sBox(82,356,467,31,14,'rgba(255,248,228,.81)','#e1d2b6');v6sFit(world.trail,315,373,18,'#948168',438);
    const sg=UI.seg;v6sBox(sg.x,sg.y,sg.w,sg.h,21,'#eee5cd','#d9c7a5',1);
    for(let i=0;i<3;i++){const bx=sg.x+i*sg.w/3,on=i===G.ci;if(on)v6sBox(bx+4,sg.y+4,sg.w/3-8,sg.h-8,17,'#fffaf0','#c4af86',2);v72Text(COUNTRIES[i].name,bx+sg.w/6,sg.y+29,25,on?V9_VISUAL_WORLDS[i].color:'#a19373','center',on?'selected':'');txt(i===0?'산':i===1?'화산섬':'하늘 탑',bx+sg.w/6,sg.y+55,16,on?'#8d806a':'#b0a085');}
    const p=UI.play;v6sBox(p.x,p.y+6,p.w,p.h,24,'#5c7d6b');v6sBox(p.x,p.y,p.w,p.h,24,world.color,'#63845c');v72Text(world.action,p.x+p.w/2-15,p.y+p.h/2,31,'#fff9df','center','primary');v7hLine([[p.x+p.w-39,p.y+32],[p.x+p.w-31,p.y+40],[p.x+p.w-39,p.y+48]],'#fffbed',3.3);
    const ch=UI.char;v6sBox(ch.x,ch.y+5,ch.w,ch.h,24,'#cdb994');v6sBox(ch.x,ch.y,ch.w,ch.h,24,'#fff5de','#d0b993');v72Text('친구 고르기',ch.x+ch.w/2,ch.y+ch.h/2,25,'#816643','center','selected');
    v72Text(CHARS[G.charKind].name+'와 함께',83,630,19,'#7d805c','left');v6sStar(98,671,10,'#d1b365');v72Text(String(totalStars()),120,672,23,'#967439','left');
  }
  ctx.restore();if(G.selOpen)v6sRenderSelection();
}

function v9DrawPrompt(){
  const it=G.transitionItem||curItem(),y=176;
  ctx.save();ctx.shadowColor='rgba(103,78,55,.12)';ctx.shadowBlur=15;ctx.shadowOffsetY=5;ell(CX,y,54,54,'#fff9eb');shadowOff();ctx.strokeStyle='#d6c2a1';ctx.lineWidth=2;ctx.beginPath();ctx.arc(CX,y,53,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#f0e7d5';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(CX,y,47,0,Math.PI*2);ctx.stroke();
  if(!it||it.rest){v6pStar(CX,y+1,30,'#efd78b','#c6a665');ctx.restore();return;}
  txt(it.emoji,CX,y-1,60,'#000');ell(CX+30,y+32,11,11,'#efe7d6');v6pSpeaker(CX+30,y+32,12,G.mute);ctx.restore();
  if(it.uType==='word')return;
  const units=it.units,prefilled=it.v9Prefilled||[],groups=[];
  if(it.uType==='syl')units.forEach((u,i)=>groups.push([i]));
  else{let cur=-1;units.forEach((u,i)=>{if(u.syl!==cur){cur=u.syl;groups.push([]);}groups[groups.length-1].push(i);});}
  const bw=it.uType==='syl'?58:42,gap=6,ggap=15;let total=0;groups.forEach((g,gi)=>{total+=g.length*bw+(g.length-1)*gap+(gi?ggap:0);});let x=CX-total/2;const yy=y+92;
  groups.forEach((g,gi)=>{if(gi)x+=ggap;g.forEach((ui,k)=>{
    const accepted=G.pendingAdvance&&G.transitionItem===it&&G.char.motion?.type==='climb'&&!G.char.motion.floor?.omission&&G.char.motion.elapsed/G.char.motion.duration>=.28;const u=units[ui],given=prefilled.includes(ui),done=ui<it.ui||given||accepted&&ui===it.ui,cur=ui===it.ui&&!given&&!done,cx=x+bw/2,slotCol=u.slot===0?'#c4dce3':u.slot===1?'#ccddbd':'#efdbad';ctx.save();
    if(cur){const pulse=1+Math.sin(G.t*5)*.02;ctx.translate(cx,yy);ctx.scale(pulse,pulse);ctx.translate(-cx,-yy);}
    v6pCard(cx-bw/2,yy-bw/2,bw,bw,12,done?'#d4e3c8':cur?(it.uType==='jamo'?slotCol:'#efdcaa'):'#fff9ed',cur?'#af9164':'#d9cdb7');txt(done?u.ch:cur?'?':'',cx,yy+2,it.uType==='syl'?32:24,done?'#5d7454':'#655040');ctx.restore();x+=bw+(k<g.length-1?gap:0);
  });});
}

function v9DrawPortraitHUD(n,it){
  v3DrawMinimalHUD(n,it);
  ctx.save();v9ApplyPlayTransform();drawPrompt();ctx.restore();
}
function v9RenderPortraitPlay(){
  const l=v9PlayLayout(),n=G.plan.length,it=curItem();drawSky(themeIdx(),v9VisClamp((G.pi+Math.min(1,G.i/Math.max(1,n)))/PANS.length));drawDecor();
  ctx.save();v9ApplyPlayTransform();if(G.shake>0)ctx.translate((Math.random()-.5)*G.shake*9,(Math.random()-.5)*G.shake*9);
  G.floors.forEach((f,i)=>{const depth=G.floors.length-1-i,a=Math.max(.25,1-depth*.075);G.v9DrawingVariant=f.v9Variant||null;drawStep(f.x,f.y,a,Math.sin(f.land*Math.PI)*6);if(f.star)v6pStar(sx(f.x),sy(f.y)-30,13,'#efd78b','#c6a665');});
  if(G.phase==='play'&&!G.pendingAdvance&&it){const ops=it.rest?['⭐','⭐']:options(it);for(let side=0;side<2;side++){const p=candPos(side);G.v9DrawingVariant=it.v9Variant||null;drawStep(p.x,p.y,1,0);if(it.rest){v6pStar(sx(p.x),sy(p.y)-60*WS+Math.sin(G.t*3+side)*4,25*WS,'#efd78b','#c6a665');continue;}v5DrawAnswerSign(it,p,side,ops);}}
  G.v9DrawingVariant=null;ctx.restore();
  // Pursuit fills the real viewport; it must not be magnified with the character board.
  v9DrawHazard();ctx.save();v9ApplyPlayTransform();drawChar();v9DrawTerrainFX();
  const softColors={'#ff5a7a':'#d29b90','#5be38a':'#a8bd90','#ffd166':'#e9ce85','#e07b2a':'#c39a62'};
  for(const f of G.fx)v3DrawPlayFeedback(f);ctx.restore();v9DrawHazard(true);
  v9DrawPortraitHUD(n,it);
  v5DrawSupportPause();
  if(G.flash>0){ctx.fillStyle='rgba(202,126,112,'+(G.flash*.20)+')';v7FillViewport();}
  if(G.phase==='clear'&&G.v9EndingRenderedFor!==G.panId){v9RenderEnding();G.v9EndingRenderedFor=G.panId;}
}
function v9DrawHUD(n,it){
  if(v9PlayLayout().portrait){v9DrawPortraitHUD(n,it);return;}
  v3DrawMinimalHUD(n,it);drawPrompt();
}
function v9Render(){
  const reportLauncher=document.getElementById('glim-report-launcher-v9');
  if(reportLauncher)reportLauncher.hidden=!((G.phase==='title'||G.phase==='map')&&!G.selOpen);
  if(G.phase==='title'){drawSky(0,.2);renderTitle();return;}
  if(G.phase==='map'){drawSky(G.mapSel>=0?country().themeOf(country().sets[G.mapSel],G.mapSel):0,.2);renderMap();return;}
  if(G.phase==='gate'){v9RenderGate();return;}
  if(v9PlayLayout().portrait){v9RenderPortraitPlay();return;}
  const n=G.plan.length,it=curItem();drawSky(themeIdx(),v9VisClamp((G.pi+Math.min(1,G.i/Math.max(1,n)))/PANS.length));drawDecor();
  ctx.save();if(G.shake>0)ctx.translate((Math.random()-.5)*G.shake*12,(Math.random()-.5)*G.shake*12);
  G.floors.forEach((f,i)=>{const depth=G.floors.length-1-i,a=Math.max(.25,1-depth*.075);G.v9DrawingVariant=f.v9Variant||null;drawStep(f.x,f.y,a,Math.sin(f.land*Math.PI)*6);if(f.star)v6pStar(sx(f.x),sy(f.y)-30,13,'#efd78b','#c6a665');});
  if(G.phase==='play'&&!G.pendingAdvance&&it){
    const ops=it.rest?['⭐','⭐']:options(it);for(let side=0;side<2;side++){
      const p=candPos(side);G.v9DrawingVariant=it.v9Variant||null;drawStep(p.x,p.y,1,0);
      if(it.rest){v6pStar(sx(p.x),sy(p.y)-60*WS+Math.sin(G.t*3+side)*4,25*WS,'#efd78b','#c6a665');continue;}
      v5DrawAnswerSign(it,p,side,ops);
    }
  }
  G.v9DrawingVariant=null;v9DrawHazard();drawChar();v9DrawTerrainFX();v9DrawHazard(true);
  const softColors={'#ff5a7a':'#d29b90','#5be38a':'#a8bd90','#ffd166':'#e9ce85','#e07b2a':'#c39a62'};
  for(const f of G.fx)v3DrawPlayFeedback(f);
  ctx.restore();v6pHUD(n,it);
  v5DrawSupportPause();
  if(G.flash>0){ctx.fillStyle='rgba(202,126,112,'+(G.flash*.20)+')';v7FillViewport();}
  if(G.phase==='clear'&&G.v9EndingRenderedFor!==G.panId){v9RenderEnding();G.v9EndingRenderedFor=G.panId;}
}

function v5DrawAnswerSign(it,p,side,ops){
  if(G.v5Pause?.hideSigns&&G.v5Pause.remaining>0)return;
  const glow=!!(it.hint&&!it.hintSay&&side===it.side),emphasis=G.pi===0&&glow;
  ctx.save();
  if(emphasis){const x=sx(p.x),y=sy(p.y)-105*WS;ctx.translate(x,y);ctx.scale(1.065,1.065);ctx.translate(-x,-y);}
  const feedback=G.v13WrongFeedback,age=feedback?G.t-feedback.at:99;
  const wrong=feedback&&feedback.index===G.i&&feedback.side===side&&age<feedback.duration;
  const sway=wrong?Math.sin(age*52)*6*(1-age/feedback.duration):0;
  drawSign(p.x,p.y,ops[side],sway,false,glow);
  if(wrong){
    const x=sx(p.x)+sway,y=sy(p.y)+(-72-SIGN_H/2)*WS;
    ctx.globalAlpha=Math.min(1,(feedback.duration-age)/.16);ctx.strokeStyle='#c55048';ctx.lineWidth=4;ctx.lineCap='round';
    rr(x-SIGN_W*WS/2-4,y-SIGN_H*WS/2-4,SIGN_W*WS+8,SIGN_H*WS+8,16);ctx.stroke();
    const cx=x+SIGN_W*WS/2-4,cy=y-SIGN_H*WS/2+3;
    ell(cx,cy,16,16,'#c55048');ctx.strokeStyle='#fff';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(cx-5,cy-5);ctx.lineTo(cx+5,cy+5);ctx.moveTo(cx+5,cy-5);ctx.lineTo(cx-5,cy+5);ctx.stroke();
  }
  ctx.restore();
}

function v5DrawSupportPause(){
  const pause=G.v5Pause;if(G.phase!=='play'||!pause||pause.remaining<=0)return;
  const l=v9PlayLayout(),v=l.view,k=l.portrait?1/(v.scale||scale||1):1;
  const point=v9PlayToScreen({x:CX,y:342}),confirm=pause.kind==='confirm';
  const width=confirm?Math.min(430*k,v.width-32*k):114*k,height=62*k;
  ctx.save();shadowOff();v6pCard(CX-width/2,point.y-height/2,width,height,21*k,'#fffaf0','#c7bd9c');
  if(confirm){v6sFit('잘 확인해 보세요!',CX,point.y+1*k,25*k,'#71644f',width-30*k);}
  else{
    for(let i=0;i<3;i++){const y=point.y+Math.sin(G.t*3.2+i*.7)*4*k;ell(CX+(i-1)*23*k,y,5*k,5*k,'#a2b68b');}
  }
  ctx.restore();
}

function v9RenderEnding(){
  let host=document.getElementById('v9EndingArt');if(!host){host=document.createElement('div');host.id='v9EndingArt';document.querySelector('#clear .card').insertBefore(host,document.getElementById('clTitle'));}
  if(!PANS[G.pi]?.top){host.style.display='none';host.innerHTML='';return;}host.style.display='block';host.dataset.world=COUNTRIES[G.ci].key;
  const base='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 150" role="img" aria-label="'+(G.ci===0?'정상에 꽂은 깃발':G.ci===1?'신호를 보고 도착한 구조 배':'탑 꼭대기의 별')+'">';
  const sky='<ellipse cx="211" cy="118" rx="158" ry="19" fill="#e9e4d0"/>';
  if(G.ci===0){host.innerHTML=base+sky+'<path d="M81 119 143 66 180 94 239 28 322 118Z" fill="#b9c99e" stroke="#94ac7e" stroke-width="2" stroke-linejoin="round"/><path d="m223 49 16-21 20 24-13-4-7 6-9-8Z" fill="#fff9e7"/><path d="M239 28V5" stroke="#897456" stroke-width="3" stroke-linecap="round"/><path d="M240 6Q258 0 281 10L281 32Q259 22 240 29Z" fill="#d6a09a" stroke="#bc8b7d" stroke-width="1.4"/><g fill="#ebcc79"><path d="m114 32 3 8 9 1-7 6 2 9-7-5-8 5 2-9-7-6 9-1Z"/><path d="m332 56 2 6 7 1-5 5 1 6-5-3-6 3 1-6-5-5 7-1Z"/></g></svg>';
    document.getElementById('clTitle').textContent='깃발을 꽂았어요!';
  }else if(G.ci===1){host.innerHTML=base+'<ellipse cx="213" cy="118" rx="171" ry="20" fill="#dcecea"/><path d="M65 115q21-11 42 0t42 0t42 0t42 0t42 0t42 0t42 0" fill="none" stroke="#a8cccb" stroke-width="3"/><g class="v9Boat"><path d="m133 89 17 29h128l27-29Z" fill="#cda780" stroke="#aa835f" stroke-width="2" stroke-linejoin="round"/><rect x="165" y="56" width="100" height="34" rx="8" fill="#faf4df" stroke="#b6a281" stroke-width="2"/><rect x="181" y="67" width="21" height="16" rx="4" fill="#a9ccce"/><rect x="216" y="67" width="25" height="16" rx="4" fill="#a9ccce"/><path d="M218 56V23" stroke="#9e8a6c" stroke-width="3"/><path d="m220 24 39 10-39 10Z" fill="#c89a92"/></g><path d="m60 101 15-43 29 43Z" fill="#a2b895"/><path d="M83 51c-14-13 12-20 3-36 23 21 24 43 7 47-13 5-20-6-10-11Z" fill="#e6aa73"/><path d="M90 49c-5-8 6-12 3-19 10 12 9 22 1 24Z" fill="#f7df9f"/><g stroke="#dfb77b" stroke-width="2" stroke-linecap="round"><path d="m106 16 9-8M113 37h13M71 22l-9-7"/></g></svg>';
    document.getElementById('clTitle').textContent='구조 배가 왔어요!';
  }else{host.innerHTML=base+sky+'<path d="M151 126 162 49h97l11 77Z" fill="#c9c4b2" stroke="#a99f87" stroke-width="2"/><path d="M151 47h121v17H151Z" fill="#e9dec3" stroke="#ad9f82" stroke-width="2"/><path d="M163 47V31h20v16m17 0V31h21v16m17 0V31h21v16" fill="#e9dec3" stroke="#ad9f82" stroke-width="2"/><path d="M199 126V98a12 12 0 0 1 24 0v28" fill="#9aabae" stroke="#aca48e" stroke-width="2"/><path d="M159 83h101m-81-19v19m48 0v15" fill="none" stroke="#aca58f" stroke-width="1.6"/><g class="v9SummitStar"><circle cx="211" cy="26" r="26" fill="#f3dfa0" opacity=".3"/><path d="m211 5 7 13 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2Z" fill="#edce79" stroke="#c7aa62" stroke-width="1.5" stroke-linejoin="round"/></g><g fill="#d4be88"><circle cx="133" cy="49" r="3"/><circle cx="295" cy="73" r="3"/><circle cx="287" cy="27" r="2"/></g></svg>';
    document.getElementById('clTitle').textContent='별에 도착했어요!';
  }
}

function installV9Visuals(){
  v3InstallConciseControls();
  if(G.v9VisualsInstalled)return;G.v9VisualsInstalled=true;
  V9_VISUAL_THEMES.forEach((theme,i)=>{Object.assign(V6_PLAYPALETTES[i],theme.palette);v6sAccents[Math.floor(i/3)][i%3]=theme.accent;});
  v6WorldIndex=v9VisualIndex;drawSky=v9DrawSky;drawDecor=v9DrawDecor;
  const oldStep=drawStep;drawStep=function(x,y,alpha,dip){oldStep(x,y,alpha,dip);v9DrawStepDetail(x,y,alpha,dip);};
  const oldBalloons=drawBalloons;
  drawBalloons=function(){if(G.pi===0&&(G.phase==='play'||G.phase==='clear'))return;return oldBalloons();};
  drawPrompt=v9DrawPrompt;v6pHUD=v9DrawHUD;render=v9Render;renderMap=v9RenderMap;v6sRenderPans=v9RenderPans;panRect=k=>v9PanLayout().cards[k];
  v9BaseHomeStairway=v7hStairway;v7hStairway=v9HomeStairway;renderTitle=v9RenderTitle;
  const style=document.createElement('style');style.id='v9VisualStyles';style.textContent='#clear .card{max-height:94vh;overflow:auto}#v9EndingArt{width:min(340px,75vw);margin:-16px auto 4px}#v9EndingArt svg{display:block;width:100%;height:auto}.v9Boat{animation:v9BoatFloat 2.7s ease-in-out infinite}.v9SummitStar{animation:v9StarFloat 2.4s ease-in-out infinite;transform-origin:211px 26px}@keyframes v9BoatFloat{50%{transform:translateY(-3px)}}@keyframes v9StarFloat{50%{transform:translateY(-3px) scale(1.025)}}@media(max-height:560px){#v9EndingArt{width:240px;margin:-6px auto 0}}';document.head.appendChild(style);
  canvas.addEventListener('pointerdown',e=>{
    if(window.GLIM_REPORT_OPEN||!G.assetsReady)return;
    const p=toLogical(e);
    if(G.phase==='gate'){
      e.preventDefault();e.stopImmediatePropagation();const l=v9GateLayout();if(inR(p,l.home)){goMap();return;}for(let side=0;side<2;side++)if(inR(p,l.cards[side])){v9GateChoose(side);return;}return;
    }
    if(G.phase==='play'&&v9PlayLayout().portrait){
      e.preventDefault();e.stopImmediatePropagation();const l=v9PlayLayout();
      if(inR(p,l.home)){goMap();return;}if(G.pendingAdvance)return;
      if(v7ReplayHit(v9PlayToWorld(p))){G.replays++;const it=curItem();if(it&&!it.rest)say(it.word);return;}
      if(p.y>=l.view.top+l.view.height*.34)choose(p.x<CX?0:1);
      return;
    }
    if(G.phase!=='map')return;
    // All map clicks use the responsive grid; stop the legacy fixed four-column router.
    e.preventDefault();e.stopImmediatePropagation();
    const layout=v9MapLayout();
    if(inR(p,layout.home)){e.preventDefault();e.stopImmediatePropagation();goTitle();return;}
    if(G.mapSel>=0){
      e.preventDefault();e.stopImmediatePropagation();const pans=v9PanLayout();
      for(const r of pans.cards){if(inR(p,r)){if(v9VisualPanOpen(G.ci,G.mapSel,r.index)){startPan(G.ci,G.mapSel,r.index);}else{sfx('wrong');}return;}}
      if(inR(p,pans.close)||!inR(p,pans.panel))G.mapSel=-1;return;
    }
    for(const r of layout.cards){if(inR(p,r)){e.preventDefault();e.stopImmediatePropagation();if(v9VisualSetOpen(G.ci,r.index)){G.mapSel=r.index;sfx('step');}else sfx('wrong');return;}}
  },{capture:true});
  addEventListener('keydown',e=>{
    if(window.GLIM_REPORT_OPEN||!G.assetsReady||G.phase!=='gate')return;
    const k=e.key.toLowerCase();if(!['arrowleft','arrowright','a','d','1','2','escape'].includes(k))return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
    if(k==='escape'){goMap();return;}v9GateChoose(k==='arrowleft'||k==='a'||k==='1'?0:1);
  },{capture:true});
}



function v3DrawMinimalHUD(n,it){
  const l=v9PlayLayout(),v=l.view,px=v.scale||scale||1,portrait=l.portrait;
  const k=portrait?1/px:1,t=portrait?v.top:0,theme=v9VisualTheme(),p=theme.palette;
  const pr=v9DisplayProgress(),done=v9VisClamp(pr.answered/Math.max(1,pr.total));
  UI.home=l.home;UI.v3Mute=l.mute;
  v10TutorialHome(l.home);
  const m=l.mute;v6pCard(m.x,m.y,m.w,m.h,15*k,'#fff9eb','#dac9ac');
  v6pSpeaker(m.x+m.w/2,m.y+m.h/2,23*k,G.mute);
  const box={x:CX-93*k,y:t+18*k,w:186*k,h:58*k};
  v6pCard(box.x,box.y,box.w,box.h,19*k,'rgba(255,249,235,.97)','#ddcfb7');
  txt(pr.answered+' / '+pr.total,CX,t+42*k,25*k,p.ink);
  const x=CX-65*k,y=t+63*k,w=130*k;
  v6sBox(x,y,w,4*k,2*k,'#e6ddca');
  if(done>0)v6sBox(x,y,Math.max(4*k,w*done),4*k,2*k,theme.accent);
  if(G.budget&&G.pi!==7){
    const ratio=G.timeMax?v9VisClamp(G.time/G.timeMax):1,tx=CX-84*k,ty=t+90*k,tw=168*k;
    const chase=typeof v3ChaserState==='function'?v3ChaserState():{active:false};
    if(chase.active)v9HazardIcon(tx-16*k,ty+3.5*k,theme.hazard,10*k);
    else{
      ctx.save();ctx.strokeStyle='#ac9776';ctx.lineWidth=1.5*k;ctx.beginPath();ctx.arc(tx-16*k,ty+3.5*k,6*k,0,Math.PI*2);ctx.stroke();
      v6sLine([[tx-16*k,ty],[tx-16*k,ty+3.5*k],[tx-12.5*k,ty+5*k]],'#ac9776',1.3*k);ctx.restore();
    }
    v6sBox(tx,ty,tw,7*k,3.5*k,'rgba(220,207,181,.80)');
    ctx.save();rr(tx,ty,tw,7*k,3.5*k);ctx.clip();ctx.fillStyle=ratio<.25?'#c58c79':ratio<.5?'#d9ba78':theme.accent;ctx.fillRect(tx,ty,tw*ratio,7*k);ctx.restore();
    if(it&&it.rest){v6sLine([[CX-3*k,ty-2*k],[CX-3*k,ty+9*k]],'#fff9e9',2*k);v6sLine([[CX+3*k,ty-2*k],[CX+3*k,ty+9*k]],'#fff9e9',2*k);}
  }
  G.v3HUD={progress:done,timerRatio:G.budget&&G.pi!==7&&G.timeMax?v9VisClamp(G.time/G.timeMax):null,timerVisible:!!G.budget&&G.pi!==7,pause:!!G.v5Pause};
}

function v3DrawPlayFeedback(f){
  ctx.save();ctx.globalAlpha=v9VisClamp(f.life);
  if(f.dot){ell(sx(f.x),sy(f.y),4,4,f.color||'#e9ce85');}
  else if(f.text==='이쪽!'){
    const x=sx(f.x),y=sy(f.y);
    v6pCard(x-20,y-20,40,40,16,'#fff9eb','#a8bd90');
    v6sLine([[x-9,y-5],[x,y+4],[x+9,y-5]],'#759b6c',3);
  }else if(f.text){v6pStar(sx(f.x),sy(f.y),15,'#ead08a','#bd9c5d');}
  ctx.restore();
}

function v3InstallConciseControls(){
  window.addEventListener('pointerdown',event=>{
    if(event.target!==canvas||window.GLIM_REPORT_OPEN||G.phase!=='play'||!G.assetsReady)return;
    const p=toLogical(event),layout=v9PlayLayout(),r=layout.mute;
    if(G.v5Pause?.remaining>0&&!inR(p,r)&&!inR(p,layout.home)){
      event.preventDefault();event.stopImmediatePropagation();return;
    }
    if(!inR(p,r))return;
    event.preventDefault();event.stopImmediatePropagation();
    G.mute=!G.mute;LS.set('mute',G.mute);
    if(G.mute){}
    else initAudio();
  },{capture:true,passive:false});
  window.addEventListener('keydown',event=>{
    if(window.GLIM_REPORT_OPEN||G.phase!=='play'||!(G.v5Pause?.remaining>0))return;
    if(['escape','m'].includes(event.key.toLowerCase()))return;
    event.preventDefault();event.stopImmediatePropagation();
  },{capture:true});
}

/* ===== v9_report_ui.js ===== */
/* PDF v5 teacher report. Install after gameplay/metrics and before boot. */
/* PDF v5: isolated measurement history, nine-stage sets, omissions and immediate supports. */
installV9Metrics();
installV9Gameplay();

/* ===== v10_tutorial_logic.js ===== */
/* PDF v5: country-specific, three-choice picture gates.
   The existing compact tutorial renderer still reads the v10 component shape.
   A stage has at most one full current-set gate, even when several reasons
   coincide. A tracked deficit word is a separate one-word check after it.
   All gates remain outside the stair measurements and start gameplay only
   after every required component has been completed. */
const V5_GATE_STORAGE_KEY='v12.gates';
const V5_GATE_MEASUREMENT_VERSION='stairs-pdf-v5-2026-10';
const V5_GATE_SESSION_RECORDS=[];

function v5GateHistory(ci,sl){
  const country=COUNTRIES[ci];
  if(!country)return [];
  const saved=LS.get(V5_GATE_STORAGE_KEY,[]),byId=new Map();
  (Array.isArray(saved)?saved:[]).concat(V5_GATE_SESSION_RECORDS).forEach(record=>{
    if(record&&record.id)byId.set(record.id,record);
  });
  return Array.from(byId.values()).filter(record=>record.country===country.key&&record.set===sl&&
    record.measurementVersion===V5_GATE_MEASUREMENT_VERSION&&record.completed===true);
}

function v5GateTrackedWord(ci,sl){
  const country=COUNTRIES[ci];
  if(!country||typeof v5IncomingDeficit!=='function')return null;
  const incoming=v5IncomingDeficit(ci,sl),candidate=Array.isArray(incoming)?incoming[0]:null;
  if(!candidate||typeof candidate.word!=='string')return null;
  // Use the existing game's word/emoji data, never a generated pseudo-word.
  let sourceWordSet=Number.isInteger(candidate.setOf)?candidate.setOf:null;
  let set=sourceWordSet!==null?SETS[sourceWordSet]:null;
  if(!set||!set.words.some(word=>word[0]===candidate.word)){
    sourceWordSet=country.sets.find(index=>SETS[index].words.some(word=>word[0]===candidate.word));
    set=SETS[sourceWordSet];
  }
  if(!set)return null;
  const wi=set.words.findIndex(word=>word[0]===candidate.word);
  if(wi<0)return null;
  const own=cw(sourceWordSet,wi);
  return {...own,setOf:sourceWordSet,sourceWordSet,
    sourceSet:Number.isInteger(candidate.sourceSet)?candidate.sourceSet:country.sets.indexOf(sourceWordSet)};
}

function v5TrackingWord(ci,sl){return v5GateTrackedWord(ci,sl);}

function v5GatePolicy(ci,sl,pi){
  const country=COUNTRIES[ci];
  if(!country||!Number.isInteger(sl)||sl<0||sl>=country.sets.length||!Number.isInteger(pi)||pi<0||pi>8)
    return {required:false,fullGate:false,fullGateReasons:[],reasons:[],trackedDeficit:null,reinforcementTriggerWords:[],readinessCheck:false,floorGate:false};
  const history=v5GateHistory(ci,sl);
  const latest=pan=>history.filter(record=>record.pan===pan&&record.fullGate===true).slice(-1)[0];
  const first=latest(0),second=latest(1);
  const firstWrong=new Set(first?first.questions.filter(q=>q.role!=='deficit_tracking'&&q.firstCorrect===false).map(q=>q.word):[]);
  const reinforcementTriggerWords=second?second.questions.filter(q=>q.role!=='deficit_tracking'&&q.firstCorrect===false&&firstWrong.has(q.word)).map(q=>q.word):[];
  const trackedDeficit=v5GateTrackedWord(ci,sl),fullGateReasons=[];
  if(pi===0)fullGateReasons.push('initial_set_check');
  if(pi===1)fullGateReasons.push('pre_measurement_check');
  if(pi===2&&reinforcementTriggerWords.length)fullGateReasons.push('repeated_first_attempt_error');
  if(trackedDeficit&&pi<=2)fullGateReasons.push('incoming_deficit');
  const state=typeof v5SetIntervention==='function'?v5SetIntervention(ci,sl):null;
  const floorGate=!!(state&&!state.floorGateUsed&&state.floorGatePendingForPan===pi);
  if(floorGate)fullGateReasons.push('measurement_floor');
  const extraWord=trackedDeficit&&pi>=2&&pi<=6?trackedDeficit:null;
  const fullGate=fullGateReasons.length>0,reasons=fullGateReasons.slice();
  if(extraWord)reasons.push('deficit_tracking');
  return {required:fullGate||!!extraWord,fullGate,fullGateReasons,reasons,
    trackedDeficit:extraWord,incomingDeficit:trackedDeficit,
    reinforcementTriggerWords:Array.from(new Set(reinforcementTriggerWords)),
    readinessCheck:pi===2&&fullGate,floorGate};
}

function v5StartStageGate(ci,sl,pi){
  const policy=v5GatePolicy(ci,sl,pi);
  if(!policy.required)return false;
  v10PrepareTutorial(ci,sl,pi,policy);
  return true;
}

function v10TutorialMode(country){
  return country.key==='syl'?'syllable':country.key==='pho'?'phoneme':'word';
}

function v10TutorialUnitKind(unit){
  return unit.type==='jamo'?(unit.slot===1?'vowel':'consonant'):unit.type==='syl'?'syllable':'word';
}

function v10TutorialPool(country,own){
  // Use the same decomposition as the upcoming game, including final consonants.
  const units=own.flatMap(o=>unitsOf(country,o));
  const unique=list=>Array.from(new Set(list.map(u=>u.ch)));
  return {all:unique(units),units,kinds:units.reduce((kinds,unit)=>{
    const kind=v10TutorialUnitKind(unit);
    if(!kinds[kind])kinds[kind]=[];
    if(!kinds[kind].includes(unit.ch))kinds[kind].push(unit.ch);
    return kinds;
  },{})};
}

function v10TutorialStep(unit,index,pool,word){
  const kind=v10TutorialUnitKind(unit),sameKind=pool.kinds[kind]||[];
  const sameWrong=v9Shuffle(sameKind.filter(ch=>ch!==unit.ch));
  // Two existing vowel pools have only two vowels. Keep their other vowel, then
  // fill the remaining choice from this same set's real game units.
  const otherWrong=v9Shuffle(pool.all.filter(ch=>ch!==unit.ch&&!sameKind.includes(ch)));
  const distractors=sameWrong.concat(otherWrong).slice(0,2);
  if(distractors.length!==2)throw new Error('Tutorial needs three distinct game units in the current set.');
  const options=v9Shuffle([unit.ch,...distractors]);
  return {
    ...unit,answer:unit.ch,componentIndex:index,ordinal:index+1,
    syllable:Number.isInteger(unit.syl)?Array.from(word)[unit.syl]:null,
    kind,options,side:options.indexOf(unit.ch),choiceCount:3,
    optionSource:'current_set_game_units',poolKind:sameKind.length>=3?kind:'mixed',
    poolSize:sameKind.length>=3?sameKind.length:pool.all.length,
    firstCorrect:null,firstRT:null,tries:0,replays:0,replayEvents:[],responses:[],
    completed:false,shownAt:null,shownTime:null,attemptBorn:null,automaticPrompts:0
  };
}

function v10TutorialCurrent(){
  const g=G.v9Gate;
  if(G.phase!=='gate'||!g||!g.questions)return null;
  const q=g.questions[g.index],step=q&&q.steps&&q.steps[g.unitIndex];
  if(!q||!step)return null;
  return {gate:g,question:q,step,wordIndex:g.index,unitIndex:g.unitIndex,
    wordCount:g.questions.length,unitCount:q.steps.length,mode:g.tutorialMode};
}

function v10TutorialSpeak(current){
  if(!current)return;
  current.step.automaticPrompts++;
  say(current.question.word);
}

function v10TutorialShowCurrent(){
  const current=v10TutorialCurrent();
  if(!current)return;
  const {gate:g,question:q,step}=current;
  g.floorBorn=G.t;step.attemptBorn=G.t;
  if(step.shownAt===null){step.shownAt=Date.now();step.shownTime=G.t;}
  if(q.shownAt===null){q.shownAt=Date.now();q.shownTime=G.t;}
  // Aliases retain the old word-question shape for lightweight integrations.
  q.options=step.options;q.side=step.side;q.answer=step.answer;
  v10TutorialSpeak(current);
}

function v10PrepareTutorial(ci,sl,pi,requestedPolicy){
  const country=COUNTRIES[ci],wordSet=country.sets[sl];
  const own=[0,1,2].map(i=>cw(wordSet,i)),pool=v10TutorialPool(country,own);
  const policy=requestedPolicy||v5GatePolicy(ci,sl,pi);
  if(!policy.required)return null;
  const question=(o,role,questionPool,optionSource,sourceSet)=>({
    ...o,role,reason:role==='deficit_tracking'?'deficit_tracking':'current_set_check',
    sourceSet,sourceWordSet:o.set,optionSource,syllables:Array.from(o.word),
    steps:unitsOf(country,o).map((unit,index)=>({...v10TutorialStep(unit,index,questionPool,o.word),optionSource})),
    firstCorrect:null,firstRT:null,tries:0,replays:0,completed:false,shownAt:null,shownTime:null
  });
  const questions=policy.fullGate?v9Shuffle(own).map(o=>question(o,'current_set_check',pool,'current_set_game_units',sl)):[];
  if(policy.trackedDeficit){
    const tracked=policy.trackedDeficit,sourceOwn=[0,1,2].map(i=>cw(tracked.setOf,i));
    questions.push(question(tracked,'deficit_tracking',v10TutorialPool(country,sourceOwn),'deficit_source_set_game_units',tracked.sourceSet));
  }
  const tutorialMode=v10TutorialMode(country);
  G.v9Gate={id:G.panId+':gate',schemaVersion:2,measurementVersion:V5_GATE_MEASUREMENT_VERSION,country:country.key,countryIndex:ci,
    set:sl,wordSet,pan:pi,tutorialMode,mode:tutorialMode,choiceCount:3,
    fullGate:policy.fullGate,fullGateReasons:policy.fullGateReasons.slice(),reasons:policy.reasons.slice(),
    reinforcementTriggerWords:policy.reinforcementTriggerWords.slice(),readinessCheck:policy.readinessCheck,
    trackedDeficit:policy.trackedDeficit?{word:policy.trackedDeficit.word,setOf:policy.trackedDeficit.setOf,sourceSet:policy.trackedDeficit.sourceSet}:null,
    incomingDeficit:policy.incomingDeficit?{word:policy.incomingDeficit.word,setOf:policy.incomingDeficit.setOf,sourceSet:policy.incomingDeficit.sourceSet}:null,
    floorGate:policy.floorGate,
    questions,index:0,unitIndex:0,feedback:null,picked:null,correct:0,remaining:questions.length,
    totalComponents:questions.reduce((sum,q)=>sum+q.steps.length,0),completedComponents:0,totalResponses:0,replays:0,
    startedAt:Date.now(),startedTime:G.t,optionSource:policy.trackedDeficit?'game_units_with_deficit_source_set':'current_set_game_units',
    scoreBasis:'raw_first_attempt',metricsExcluded:true,savedRecord:null};
  G.phase='gate';v10TutorialShowCurrent();
  return G.v9Gate;
}

function v10TutorialReplay(){
  const current=v10TutorialCurrent();
  if(!current||current.gate.feedback)return false;
  const {gate:g,question:q,step}=current;
  initAudio();step.replays++;q.replays++;g.replays++;
  step.replayEvents.push({at:Date.now(),beforeAttempt:step.tries+1,
    sinceShown:+Math.max(0,G.t-(step.shownTime??G.t)).toFixed(3)});
  say(q.word);
  return true;
}

function v10SaveTutorial(){
  const g=G.v9Gate;
  if(!g)return null;
  if(g.savedRecord)return g.savedRecord;
  if(!g.questions.every(q=>q.completed))return null;
  const components=g.questions.flatMap(q=>q.steps),fullQuestions=g.questions.filter(q=>q.role==='current_set_check');
  const readinessWords=g.readinessCheck?fullQuestions.filter(q=>q.firstCorrect===false).map(q=>q.word):[];
  const rec={
    id:g.id,game:'stairs',schemaVersion:2,measurementVersion:V5_GATE_MEASUREMENT_VERSION,country:g.country,set:g.set,pan:g.pan,wordSet:g.wordSet,
    at:Date.now(),startedAt:g.startedAt,tutorialMode:g.tutorialMode,choiceCount:3,
    optionSource:g.optionSource,scoreBasis:'raw_first_attempt',metricsExcluded:true,
    fullGate:g.fullGate,fullGateCount:fullQuestions.length,
    fullGateFirstCorrect:fullQuestions.filter(q=>q.firstCorrect===true).length,
    fullGateReasons:g.fullGateReasons.slice(),reasons:g.reasons.slice(),
    reinforcementTriggerWords:g.reinforcementTriggerWords.slice(),
    trackedDeficit:g.trackedDeficit,incomingDeficit:g.incomingDeficit,
    readinessCheck:g.readinessCheck,readinessFailed:readinessWords.length>0,readinessWords,
    floorGate:g.floorGate,gatePolicy:'pdf_v5_stage_front_checks',
    // A word is first-correct only when every one of its syllables/jamo was
    // correct on the first attempt. The optional fourth task remains separate.
    count:g.questions.length,firstCorrect:g.questions.filter(q=>q.firstCorrect===true).length,
    firstCorrectDefinition:'all_components_correct_on_first_attempt',
    componentCount:components.length,firstCorrectComponents:components.filter(step=>step.firstCorrect===true).length,
    totalResponses:components.reduce((sum,step)=>sum+step.tries,0),replays:g.replays,
    duration:+Math.max(0,G.t-g.startedTime).toFixed(3),timeUnit:'seconds',timeBasis:'game_clock',
    questions:g.questions.map(q=>({
      word:q.word,role:q.role,reason:q.reason,sourceSet:q.sourceSet,sourceWordSet:q.sourceWordSet,optionSource:q.optionSource,
      firstCorrect:q.firstCorrect,tries:q.tries,rt:q.firstRT,replays:q.replays,
      completed:q.completed,componentCount:q.steps.length,
      components:q.steps.map(step=>({
        componentIndex:step.componentIndex,answer:step.answer,type:step.type,kind:step.kind,
        syl:step.syl??null,slot:step.slot??null,syllable:step.syllable,
        options:step.options.slice(),side:step.side,choiceCount:3,optionSource:step.optionSource,
        poolKind:step.poolKind,poolSize:step.poolSize,firstCorrect:step.firstCorrect,
        tries:step.tries,rt:step.firstRT,firstRT:step.firstRT,replays:step.replays,
        automaticPrompts:step.automaticPrompts,completed:step.completed,
        responses:step.responses.map(response=>({...response})),
        replayEvents:step.replayEvents.map(event=>({...event}))
      }))
    })),
    completed:true,completedAt:Date.now(),completedMeasurementVersion:V5_GATE_MEASUREMENT_VERSION,
    threshold:null,teacherReview:g.questions.some(q=>q.firstCorrect===false)
  };
  let shared;
  try{shared=JSON.parse(previewStorage.getItem('glim.shared.gates.v1')||'[]');}catch(e){shared=[];}
  if(!Array.isArray(shared))shared=[];
  try{previewStorage.setItem('glim.shared.gates.v1',JSON.stringify(shared.concat(rec)));}catch(e){}
  const previous=LS.get(V5_GATE_STORAGE_KEY,[]);
  LS.set(V5_GATE_STORAGE_KEY,(Array.isArray(previous)?previous:[]).concat(rec));
  V5_GATE_SESSION_RECORDS.push(rec);
  g.savedRecord=rec;G.v9LastGate=rec;
  if(rec.readinessFailed&&typeof v5MarkGateReadiness==='function')v5MarkGateReadiness(g.countryIndex,g.set,rec);
  // Reserve the once-per-set floor check until it is complete. Leaving a gate
  // for the map does not silently consume a pending check.
  if(g.floorGate&&typeof v5ConsumeFloorGate==='function')v5ConsumeFloorGate(g.countryIndex,g.set,g.pan);
  return rec;
}

function v10TutorialChoose(side){
  const current=v10TutorialCurrent();
  if(!current||current.gate.feedback||!Number.isInteger(side)||side<0||side>=3)return false;
  const {gate:g,question:q,step}=current;
  if(step.completed)return false;
  initAudio();
  const ok=side===step.side,rt=+Math.max(0,G.t-(step.attemptBorn??g.floorBorn??G.t)).toFixed(3);
  g.picked=side;step.tries++;q.tries++;g.totalResponses++;
  step.responses.push({attempt:step.tries,side,choice:step.options[side],correct:ok,rt,
    sinceShown:+Math.max(0,G.t-(step.shownTime??G.t)).toFixed(3),replays:step.replays,at:Date.now()});
  if(step.firstCorrect===null){
    step.firstCorrect=ok;step.firstRT=rt;
    if(q.firstRT===null)q.firstRT=rt;
    if(!ok)q.firstCorrect=false;
  }
  if(ok){step.completed=true;g.completedComponents++;}
  g.feedback=ok?'ok':'wrong';sfx(ok?'step':'wrong');
  if(!ok)v10TutorialSpeak(current);
  const wordIndex=g.index,unitIndex=g.unitIndex;
  setTimeout(()=>{
    if(G.phase!=='gate'||G.v9Gate!==g||g.index!==wordIndex||g.unitIndex!==unitIndex)return;
    if(ok){
      g.unitIndex++;
      if(g.unitIndex>=q.steps.length){
        q.completed=true;q.firstCorrect=q.steps.every(component=>component.firstCorrect===true);
        if(q.firstCorrect)g.correct++;
        g.index++;g.unitIndex=0;g.remaining=g.questions.length-g.index;
        if(g.index>=g.questions.length){v10SaveTutorial();v9BeginPlay();return;}
      }
      g.feedback=null;g.picked=null;v10TutorialShowCurrent();
    }else{
      // The same component and the same three choices remain after a mistake.
      g.feedback=null;g.picked=null;g.floorBorn=G.t;step.attemptBorn=G.t;
    }
  },ok?720:950);
  return true;
}

function v10AuditTutorialPools(){
  return COUNTRIES.flatMap((country,ci)=>country.sets.map((wordSet,sl)=>{
    const own=[0,1,2].map(i=>cw(wordSet,i)),pool=v10TutorialPool(country,own);
    return {country:country.key,countryIndex:ci,set:sl,wordSet,words:own.map(o=>o.word),
      unitPool:pool.all.slice(),unitPoolSize:pool.all.length,
      kinds:Object.fromEntries(Object.entries(pool.kinds).map(([kind,options])=>[kind,{options:options.slice(),count:options.length}])),
      componentCount:pool.units.length,valid:pool.all.length>=3};
  }));
}

function v10InstallTutorialLogic(){
  if(G.v10TutorialLogicInstalled)return;
  G.v10TutorialLogicInstalled=true;
  v9PrepareGate=v10PrepareTutorial;v9SaveGate=v10SaveTutorial;v9GateChoose=v10TutorialChoose;
}

/* ===== v10_tutorial_ui.js ===== */
/* v10: readable three-choice picture tutorials for each learning country.
   Only the gate renderer and gate input are replaced. Install this before
   installV9Visuals so the window capture router owns tutorial input. */
const V10_TUTORIAL_COPY={
  word:{title:'통글자 튜토리얼',instruction:'그림을 보고 통글자를 골라요',unit:'단어'},
  syllable:{title:'음절 튜토리얼',instruction:'그림을 보고 음절을 차례로 골라요',unit:'음절'},
  phoneme:{title:'음소 튜토리얼',instruction:'그림을 보고 음소를 차례로 골라요',unit:'음소'}
};

function v10TutorialVisibleSteps(current){
  return current?current.question.steps.filter(step=>step.completed):[];
}

function v10TutorialLayout(){
  const v=V7_VIEW||{left:0,top:0,width:W,height:H,scale:1,portrait:false};
  const current=v10TutorialCurrent(),mode=current?current.mode:'word';
  const count=mode==='word'?0:Math.max(1,current?current.question.syllables.length:1);
  const portrait=!!v.portrait;
  let l;
  if(portrait){
    const px=v.scale||scale||1,pw=v.width*px,ph=v.height*px;
    const size=Math.min(1.42,Math.max(.82,pw/430),(ph-110)/580);
    const k=size/px,top=v.top+Math.max(88,(ph-580*size)/2)/px;
    const width=Math.min((pw-32)/px,510*k),gap=12*k,cw=(width-gap*2)/3;
    l={portrait,view:v,k,top,mode,questionY:top,progressY:top+48*k,
      mainTop:top+88*k,artSize:146*k,tileSize:90*k,tileGap:12*k,
      assemblyTop:top+263*k,instructionSize:23*k,optionSize:38*k,radius:19*k,
      cards:Array.from({length:3},(_,i)=>({x:CX-width/2+i*(cw+gap),y:top+(count?410:307)*k,w:cw,h:112*k,index:i})),
      home:{x:v.left+16/px,y:v.top+18/px,w:44/px,h:44/px}};
  }else{
    l={portrait,view:v,k:1,top:79,mode,questionY:79,progressY:126,
      mainTop:171,artSize:140,tileSize:92,tileGap:14,assemblyTop:338,
      instructionSize:31,optionSize:53,radius:24,
      cards:Array.from({length:3},(_,i)=>({x:247+i*267,y:count?490:379,w:252,h:124,index:i})),
      home:{x:28,y:24,w:48,h:48}};
  }
  const available=l.portrait?l.cards[2].x+l.cards[2].w-l.cards[0].x:600;
  if(count*l.tileSize+Math.max(0,count-1)*l.tileGap>available)
    l.tileSize=(available-Math.max(0,count-1)*l.tileGap)/count;
  const wordWidth=count*l.tileSize+Math.max(0,count-1)*l.tileGap;
  l.titleY=l.questionY;l.titleSize=l.instructionSize;
  l.replay={x:CX-l.artSize/2,y:l.mainTop,w:l.artSize,h:l.artSize};
  l.artY=l.replay.y+l.replay.h/2;
  l.assembly={x:CX-wordWidth/2,y:l.assemblyTop,w:wordWidth,h:count?l.tileSize:0,tiles:[]};
  l.assembly.tiles=Array.from({length:count},(_,i)=>({x:l.assembly.x+i*(l.tileSize+l.tileGap),
    y:l.assembly.y,w:l.tileSize,h:l.tileSize,size:l.tileSize,index:i}));
  return l;
}

function v10TutorialHome(r){
  const k=r.h/46,x=r.x+r.w/2,y=r.y+r.h/2;
  v6sBox(r.x,r.y,r.w,r.h,15*k,'#fff9ed','#d9cfb9',1.7*k);
  v6sLine([[x-9*k,y-2*k],[x,y-11*k],[x+9*k,y-2*k]],v6sC.ink,2*k);
  v6sLine([[x-7*k,y-2*k],[x-7*k,y+8*k],[x+7*k,y+8*k],[x+7*k,y-2*k]],v6sC.ink,2*k);
}

function v10TutorialProgress(current,l,theme){
  const k=l.portrait?l.k:1.12,w=56*k,gap=10*k,h=6*k;
  const total=current.wordCount*w+(current.wordCount-1)*gap,x=CX-total/2;
  for(let i=0;i<current.wordCount;i++){
    const q=current.gate.questions[i],done=q.steps.filter(step=>step.completed).length;
    const fraction=done/Math.max(1,q.steps.length),active=i===current.wordIndex;
    v6sBox(x+i*(w+gap),l.progressY-h/2,w,h,h/2,active?'#d8c8a7':'#e4dccb');
    if(fraction>0)v6sBox(x+i*(w+gap),l.progressY-h/2,Math.max(h,w*fraction),h,h/2,theme.accent);
  }
}

function v10TutorialPicture(current,l){
  const r=l.replay,k=l.portrait?l.k:1.2;
  v6pCard(r.x,r.y,r.w,r.h,25*k,'#fffaf0','#d9c8ac');
  txt(current.question.emoji,r.x+r.w/2,r.y+r.h*.49,r.h*.65,'#000');
  const x=r.x+r.w-12*k,y=r.y+r.h-11*k;
  ell(x,y,14*k,14*k,'#eee7d5');v6pSpeaker(x,y,18*k,!!G.mute);
}

function v10TutorialBlankTile(tile,active,complete,l,theme){
  const n=tile.size/94;
  v6pCard(tile.x,tile.y,tile.size,tile.size,17*n,
    complete?'#f0f5e6':active?'#fffdf5':'rgba(255,251,240,.74)',
    complete?'#a5be91':active?'#bda77f':'#dcd2bf');
  if(active&&!complete){
    v6sLine([[tile.x+tile.size*.23,tile.y+tile.size+7*n],
      [tile.x+tile.size*.77,tile.y+tile.size+7*n]],theme.accent,3*n);
  }
}

function v10TutorialSyllables(current,l,theme){
  for(const tile of l.assembly.tiles){
    const step=current.question.steps.find(step=>step.syl===tile.index);
    const done=!!(step&&step.completed),active=tile.index===current.step.syl;
    v10TutorialBlankTile(tile,active,done,l,theme);
    if(done)v7jGlyph(step.answer,{x:tile.x+tile.size*.17,y:tile.y+tile.size*.13,w:tile.size*.66,h:tile.size*.72},'#5d6e51',1,false);
    else{
      const n=tile.size/94;
      ctx.save();ctx.strokeStyle=active?'#b5ac91':'#d6cebd';ctx.lineWidth=1.5*n;ctx.setLineDash([3*n,5*n]);
      rr(tile.x+tile.size*.24,tile.y+tile.size*.23,tile.size*.52,tile.size*.54,9*n);ctx.stroke();ctx.restore();
    }
  }
}

function v10TutorialPhonemes(current,l,theme){
  const q=current.question;
  for(const baseTile of l.assembly.tiles){
    const steps=q.steps.filter(step=>step.syl===baseTile.index),parts=[null,null,null];
    steps.forEach(step=>{parts[step.slot]=step.answer;});
    const tile={...baseTile,parts,char:q.syllables[baseTile.index]};
    const complete=steps.length>0&&steps.every(step=>step.completed),active=current.step.syl===tile.index;
    const done=steps.filter(step=>step.completed).length,n=tile.size/94;
    v10TutorialBlankTile(tile,active,complete,l,theme);
    if(complete&&v9SignTextSupported(tile.char)){
      v7jGlyph(tile.char,{x:tile.x+13*n,y:tile.y+12*n,w:tile.size-26*n,h:tile.size-24*n},'#5d6e51',1,false);
      continue;
    }
    if(!active&&!done){
      ell(tile.x+tile.size/2,tile.y+tile.size/2,2.5*n,2.5*n,'#cdc4af');
      continue;
    }
    const layout=v7jSlotLayout(tile),upperDone=steps.some(step=>step.slot===0&&step.completed)&&steps.some(step=>step.slot===1&&step.completed);
    // A selected initial and vowel can join above an empty coda. Only compose
    // an intermediate glyph when the embedded source font actually contains it.
    const cv=layout.hasFinal&&upperDone?compose(parts[0],parts[1],null):null;
    const joined=!!cv&&v9SignTextSupported(cv);
    if(joined)v7jGlyph(cv,{x:tile.x+13*n,y:tile.y+13*n,w:68*n,h:45*n},'#5d6e51',1,true);
    for(const slot of layout.slots){
      if(joined&&slot.slot<2)continue;
      const step=steps.find(step=>step.slot===slot.slot),filled=!!(step&&step.completed);
      const currentSlot=active&&!filled&&current.step.slot===slot.slot;
      for(const box of slot.boxes){
        if(filled){
          const glyph=box.part||parts[slot.slot];
          v7jGlyph(glyph,box,V7_JAMO_COLORS[slot.slot],1,true);
        }else{
          ctx.save();ctx.fillStyle=currentSlot?V7_JAMO_FILLS[slot.slot]:'rgba(235,231,217,.29)';
          rr(box.x-2*n,box.y-2*n,box.w+4*n,box.h+4*n,5*n);ctx.fill();
          ctx.strokeStyle=currentSlot?V7_JAMO_COLORS[slot.slot]:'rgba(175,164,143,.34)';
          ctx.lineWidth=(currentSlot?1.7:1)*n;ctx.setLineDash([3*n,4*n]);ctx.stroke();ctx.restore();
        }
      }
    }
  }
}

function v10TutorialUnitProgress(current,l,theme){
  // Component progress is part of the three word bars and the assembling tiles.
}

function v10TutorialChoices(current,l){
  const g=current.gate,step=current.step,k=l.portrait?l.k:1.2;
  for(let side=0;side<3;side++){
    const r=l.cards[side],picked=g.picked===side,feedback=picked?g.feedback:null;
    const hint=step.tries>0&&step.firstCorrect===false&&!step.completed&&step.side===side;
    const fill=feedback==='ok'?'#e7efd9':feedback==='wrong'?'#f7e6dd':'#fffaf0';
    const line=feedback==='ok'?'#8ca477':feedback==='wrong'?'#cc9984':hint?'#bea456':'#c8b493';
    v6sBox(r.x,r.y+4*k,r.w,r.h,l.radius,'#cdbb9e');
    v6sBox(r.x,r.y,r.w,r.h,l.radius,fill,line,1.7*k);
    if(hint){ctx.save();ctx.strokeStyle='#d6b65e';ctx.globalAlpha=.6+.2*Math.sin(G.t*4);ctx.lineWidth=3*k;
      rr(r.x+2*k,r.y+2*k,r.w-4*k,r.h-4*k,l.radius-2*k);ctx.stroke();ctx.restore();}
    v6sFit(step.options[side],r.x+r.w/2,r.y+r.h/2,l.optionSize,'#68513e',r.w-23*k);
    if(feedback==='ok'){
      const x=r.x+r.w-14*k,y=r.y+14*k;
      ell(x,y,8*k,8*k,'#90ac7f');v6sCheck(x,y,9*k,'#fff9e9');
    }
  }
}

function v10RenderTutorial(){
  const current=v10TutorialCurrent();if(!current)return;
  const l=v10TutorialLayout(),theme=v9VisualTheme(),copy=V10_TUTORIAL_COPY[current.mode];UI.home=l.home;
  drawSky(themeIdx(),0);drawDecor();
  ctx.save();shadowOff();ctx.fillStyle='rgba(255,249,235,.72)';v7FillViewport();
  v10TutorialHome(l.home);
  v6sFit(copy.instruction,CX,l.questionY,l.instructionSize,'#745d49',l.portrait?l.cards[2].x+l.cards[2].w-l.cards[0].x:880);
  v10TutorialProgress(current,l,theme);v10TutorialPicture(current,l);
  if(current.mode==='syllable')v10TutorialSyllables(current,l,theme);
  if(current.mode==='phoneme')v10TutorialPhonemes(current,l,theme);
  v10TutorialChoices(current,l);
  ctx.restore();
}

function v10InstallTutorialUI(){
  if(G.v10TutorialUIInstalled)return;
  G.v10TutorialUIInstalled=true;
  v9GateLayout=v10TutorialLayout;v9RenderGate=v10RenderTutorial;
  // A window capture listener runs before all legacy canvas listeners. An icon
  // click, a third choice, or blank tutorial space can never reach the old
  // left/right stair router; other screens and the report keep their handlers.
  window.addEventListener('pointerdown',function(event){
    if(event.target!==canvas||window.GLIM_REPORT_OPEN||!G.assetsReady||G.phase!=='gate')return;
    event.preventDefault();event.stopImmediatePropagation();
    const p=toLogical(event),l=v10TutorialLayout();
    if(inR(p,l.home)){goMap();return;}
    if(inR(p,l.replay)){v10TutorialReplay();return;}
    for(let side=0;side<3;side++)if(inR(p,l.cards[side])){v9GateChoose(side);return;}
  },{capture:true,passive:false});
  window.addEventListener('keydown',function(event){
    if(window.GLIM_REPORT_OPEN||!G.assetsReady||G.phase!=='gate')return;
    const key=event.key.toLowerCase(),sides={arrowleft:0,a:0,'1':0,arrowdown:1,s:1,'2':1,arrowright:2,d:2,'3':2};
    if(!(key in sides)&&!['escape',' ','r'].includes(key))return;
    event.preventDefault();event.stopImmediatePropagation();if(event.repeat)return;
    if(key==='escape'){goMap();return;}
    if(key===' '||key==='r'){v10TutorialReplay();return;}
    v9GateChoose(sides[key]);
  },{capture:true});
}

/* Three-choice tutorials follow each country's actual game units. */
v10InstallTutorialLogic();
v10InstallTutorialUI();

installV9Visuals();
installV9Characters();

window.GLIM_PDF_SOURCE=window.GLIM_V9_PDF_SOURCE='글림_한글계단_쉬운해설_요약본_v5.pdf';
window.GLIM_V9_IMPLEMENTATION_NOTES={
  "source": "글림_한글계단_쉬운해설_요약본_v5.pdf, 18쪽",
  "stageStructure": "세트마다 소개 1판, 측정 6판, 추격 1판, 정상 1판. 16/6/16세트, 144/54/144단계, 총 342단계.",
  "chaser": "추격물은 8판만. 처음 6.6초 거리, 정답·놓침마다 3.3초 거리 회복. 화면 시간바 없이 진행하며 추격판 전체를 네 지표에서 제외합니다.",
  "omission": "시간 0 또는 추격물에 잡힘은 놓침(오답)으로 기록하고 다음 층으로 갑니다. 실제 입력 없는 놓침의 반응 시간은 null이고 기다린 시간은 별도 기록합니다. 재시도 후 놓침은 같은 층의 최초 응답을 중복 계산하지 않습니다.",
  "characterUnlock": "나라별로 9판을 모두 끝낸 세트 수를 셉니다. 새 기록은 토끼부터 시작하고 나머지 6종은 PDF의 나라별 조건으로 열립니다. 별은 해금에 사용하지 않습니다.",
  "characterRelaxation": "교사 선택의 조건 한 단계 완화는 음소 조건을 1세트만 낮추는 단일 켜기/끄기로 해석했습니다. 기본은 꺼짐이며 변경 이력을 남깁니다. 이미 얻은 친구는 다시 잠그지 않습니다.",
  "syllableLength": "소개6/측정7·15/추격10/정상21개의 실제 음절 응답 층입니다. 홀수 나머지 음절은 미리 채운 칸으로 표시하고 직접 답한 것으로 계산하지 않습니다. 소개는 세 단어를 두 바퀴 돌며 묻는 음절을 바꿉니다.",
  "phonemeLength": "명시된 측정5·10단어와 추격7단어를 실제 자모 층으로 확장합니다. 공통 소개6층·정상21층 표기는 완성 단어와 세 단어 두 번·9/6/6 복습 조건을 함께 만족시키기 어려워, 기존의 소개6단어·정상21단어 확장 방식을 유지한 구현 해석입니다.",
  "phonemeSustain": "음소 긴 판은 실제 자모 층수 N의 앞 floor(N/2)층과 뒤층을 비교합니다. 쉼터도 같은 후반 첫 층에서 시작하며 삽입한 도움 층은 원래 측정 층 번호를 바꾸지 않습니다.",
  "phonemeDis2": "자모 하나를 고르는 음소판에서는 두 조각 다른 글자 대신 뚜렷이 다른 자모로 바꾸고 지원 적용을 기록합니다. 받침 유형별 분석의 분자·분모는 실제 해당 위치의 응답끼리 비교합니다.",
  "sharedGate": "나라별 세 선택지 튜토리얼을 유지합니다. 기본 1·2판 앞, 동일 단어의 첫 응답 중복 오답이면 3판 앞 보강, 준비 미달 라벨, 측정판 바닥에 따른 한 번의 재확인, 다음 세트 결손 단어 추적을 관문 장부에 남깁니다.",
  "measurementSupport": "순수 측정 층수는 유지합니다. 느린 준비 두 층·되돌이 층은 추가하고 제외합니다. 2초 쉼터는 후반 첫 층에서 표지판을 가리는 정지이며, 쉼터 자체는 비응답 기록으로 남겨도 원래 측정 응답층은 추가하거나 제외하지 않습니다. 0.8초 확인 안내를 받은 층은 힌트로 제외하므로 실제 유효 표본 수는 줄 수 있습니다.",
  "recoverySupport": "오답 직후 시간 차감 면제는 응답 이후 적용되므로 그 오답과 다음 층의 최초 응답을 일괄 제외하지 않습니다. 면제 여부를 별도 기록합니다.",
  "manualReplay": "사용자가 정답 음성을 다시 들은 층은 도움을 받은 것으로 제외합니다. 최초 자동 제시 음성은 기본 자극입니다.",
  "progression": "이전 측정·관문·처방은 원래 보관 기록으로 유지합니다. v5 측정은 별도 장부로 계산합니다. 이전 1~7판 완료는 같은 위치, 이전 정상 완료는 새9판 위치로 보존하고 새8판 추격은 미완료로 둡니다. 이미 얻은 친구와 열렸던 세트는 유지합니다.",
  "unresolvedProposals": "PDF의 아직 정해지지 않은 것에 적힌 이름 변경, 네 세트 누적 혼동 지표, 얼음 다음 층의 새 변수는 적용하지 않았습니다."
};

v7InstallJamo();
resetVisual();G.plan=[];G.i=0;G.budget=0;G.sessionStars=0;G.balloons=3;G.rx=RX_DEFAULT;G.phase='title';G.assetsReady=false;G.assetError=false;
renderLoading(false);
// Local preview.js owns asset readiness and the only animation clock.
