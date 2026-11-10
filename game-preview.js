'use strict';

// Keep all three real scenes warm. Selecting a tab only reveals and restarts
// its already-rendered game; no screenshot or poster is ever displayed.
(() => {
  const titles = {racing:'한글 레이싱',stairs:'한글 계단',break:'통글자 브레이크'};
  const viewport = document.querySelector('#preview-viewport');
  const slot = document.querySelector('#preview-frame-slot');
  const loading = document.querySelector('#preview-loading');
  const panel = document.querySelector('#game-panel');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = new Map();
  let selected = 'racing';
  let inView = false;
  let wantsPlay = !reducedMotion.matches;

  function resize() {
    viewport.style.setProperty('--preview-scale', String(viewport.clientWidth / 1104));
  }
  function send(scene, action) {
    // 같은 출처로만 보냅니다. (출처가 'null'로 잡히는 미리보기 환경에서는 대상 창을 직접 지정한 메시지만 보냅니다.)
    const target = location.origin && location.origin !== 'null' ? location.origin : '*';
    scene.frame.contentWindow?.postMessage({type:'glim-preview-control',action},target);
  }
  function sync() {
    const active = scenes.get(selected);
    viewport.classList.toggle('is-ready',!!active?.ready);
    panel.setAttribute('aria-busy',String(!active?.ready));
    loading.setAttribute('aria-label',active?.error ? '게임을 다시 불러와 주세요' : `${titles[selected]} 불러오는 중`);
    for (const [key,scene] of scenes) {
      scene.wrap.classList.toggle('is-selected',key===selected);
      if (scene.ready) send(scene,key===selected && inView && wantsPlay && !document.hidden ? 'play':'pause');
    }
  }
  function createScene(key) {
    const old = scenes.get(key);
    if (old) {clearTimeout(old.timer);old.wrap.remove();}
    const wrap = document.createElement('div');
    wrap.className = 'game-scene';
    wrap.dataset.game = key;
    wrap.setAttribute('aria-hidden','true');
    const frame = document.createElement('iframe');
    frame.className = 'game-preview-frame';
    frame.title = `${titles[key]} 자동 플레이`;
    frame.width = '1104';
    frame.height = '694';
    frame.tabIndex = -1;
    frame.setAttribute('sandbox','allow-scripts allow-same-origin');
    frame.setAttribute('referrerpolicy','no-referrer');
    frame.setAttribute('aria-hidden','true');
    const scene = {frame,wrap,ready:false,error:false,timer:null};
    scenes.set(key,scene);
    wrap.append(frame);
    slot.append(wrap);
    frame.src = `previews/${key}/index.html`;
    frame.addEventListener('load',()=>{send(scene,'pause');if(scene.ready)sync();});
    scene.timer = setTimeout(()=>{
      if(scene.ready)return;
      scene.error=true;
      if(key===selected){
        loading.classList.add('is-error');
        const retry=document.createElement('button');
        retry.type='button';retry.textContent='게임 다시 불러오기';
        retry.addEventListener('click',()=>{loading.classList.remove('is-error');loading.replaceChildren(document.createElement('span'));createScene(key);sync();});
        loading.replaceChildren(retry);
      }
    },30000);
  }
  window.addEventListener('message', event => {
    if(event.origin!==location.origin)return;
    const data=event.data;
    if(!data||data.type!=='glim-preview-ready'||!titles[data.game])return;
    const scene=scenes.get(data.game);
    if(!scene||event.source!==scene.frame.contentWindow)return;
    scene.ready=true;scene.error=false;clearTimeout(scene.timer);
    scene.wrap.classList.add('is-ready');
    if(data.game===selected){loading.classList.remove('is-error');loading.replaceChildren(document.createElement('span'));}
    resize();sync();
  });
  window.addEventListener('glim-game-change', event => {
    const key=event.detail?.key;
    if(!titles[key])return;
    selected=key;wantsPlay=true;
    loading.classList.remove('is-error');loading.replaceChildren(document.createElement('span'));
    const scene=scenes.get(key);
    if(scene?.error)createScene(key);
    else if(scene?.ready)send(scene,'restart');
    sync();
  });
  panel.addEventListener('keydown',event=>{
    if(event.key==='Escape'){wantsPlay=false;sync();}
  });
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',()=>{for(const scene of scenes.values())send(scene,'pause');});
  window.addEventListener('pageshow',()=>{resize();sync();});
  reducedMotion.addEventListener('change',event=>{if(event.matches){wantsPlay=false;sync();}});
  window.addEventListener('resize',resize,{passive:true});
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(viewport);
  if('IntersectionObserver'in window){
    new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0.01,rootMargin:'80px 0px'}).observe(viewport);
  }else inView=true;
  for(const key of Object.keys(titles))createScene(key);
  resize();sync();
})();
