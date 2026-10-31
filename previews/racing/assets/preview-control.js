/* Website autoplay adapter for the supplied Glim racing engine. No data collection. */
(() => {
  'use strict';
  let engine = null, paused = false, lastTime = 0, age = 0, tasks = [], serial = 0;
  let chosenGate = null, pointer = null;
  const parentOrigin = (() => { try { return new URL(document.referrer || location.href).origin; } catch (_) { return location.origin; } })();
  const targetOrigin = parentOrigin === 'null' ? '*' : parentOrigin;
  function announce() { if (window.parent !== window) window.parent.postMessage({type:'glim-preview-ready',game:'racing'}, targetOrigin); }
  // Keep the initial poster a real engine frame, including when the parent pauses before mount.
  function paintFrame() {
    if (!engine || !engine._root) return;
    engine.recalc();
    if (engine._car && engine.W) {
      const offset=engine.W*engine.laneCPct(engine.carLane)/100-engine._car.clientWidth/2-engine.W*.5;
      engine._car.style.transform='translateX('+offset+'px)';
    }
    if (engine._gate) engine._gate.style.transform='translateY('+engine.gateY+'px)';
  }
  function setPaused(value) {
    paused = value;
    document.documentElement.classList.toggle('preview-paused', value);
    if (engine) engine._hold = value;
    lastTime = 0;
  }
  function restart() {
    if (!engine) return;
    tasks = []; age = 0; lastTime = 0; chosenGate = null;
    if (pointer) pointer.classList.remove('show');
    if (engine._fx) engine._fx.replaceChildren();
    engine.setState({big:null,banner:null,gateDoors:null,tut:null,theme:'초원'});
    engine.startStage();
    engine._hold = paused;
    // Keep three original words; one pass creates an approximately 12 second loop.
    engine.queue = [0,1,2]; engine.qpos = 0;
    tasks = [];
    engine.setState({banner:null});
    engine.nextWord();
    // Start with the first actual gate visible below the picture, without advancing any answer.
    engine.gateY=218;
    paintFrame();
    requestAnimationFrame(paintFrame);
    if (engine._score) engine._score.textContent='0';
    if (engine._dist) engine._dist.textContent='000000';
  }
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.origin !== parentOrigin) return;
    const data = event.data;
    if (!data || typeof data !== 'object' || data.type !== 'glim-preview-control') return;
    if (data.action === 'play') setPaused(false);
    else if (data.action === 'pause') setPaused(true);
    else if (data.action === 'restart') restart();
  });
  window.__GLIM_PREVIEW_ATTACH__ = component => {
    engine = component;
    // Expose a read-only snapshot for review; no user/session information is recorded.
    window.__GLIM_PREVIEW_STATE__ = () => ({game:'racing',paused,elapsed:Math.round(age),correct:engine.correctCount,questions:engine.totalCount,lane:engine.tgt,word:engine.word && engine.word[0],character:engine.props.animal,gateY:engine.gateY,gate:engine.gate && {correct:engine.gate.correct,lane:engine.gate.ci}});
    // Scheduling shares the preview clock, so pause freezes gates and delayed effects together.
    engine.later = (fn, ms) => { const id=++serial; tasks.push({id,remaining:Math.max(0,ms),fn});return id; };
    engine.stageClear = () => { engine.showBig('참 잘했어요! ⭐','#fff'); };
    // All original steering, gate construction, collision, scoring and feedback methods are retained.
    const originalBuildDoors = engine.buildDoors.bind(engine);
    engine.buildDoors = () => {
      const built = originalBuildDoors();
      // Alternate the correct lane deterministically for a clear product demonstration.
      const desired = (engine.qpos + 1) % engine.lanes;
      if (desired !== built.ci) {
        const old = built.ci;
        [built.opts[old],built.opts[desired]]=[built.opts[desired],built.opts[old]];
        [built.doors[old].text,built.doors[desired].text]=[built.doors[desired].text,built.doors[old].text];
        built.ci = desired;
      }
      return built;
    };
    pointer = document.createElement('div');pointer.className='preview-pointer';pointer.setAttribute('aria-hidden','true');
    pointer.innerHTML='<span class="preview-tap"></span><svg viewBox="0 0 32 38"><path d="M6 2v26l7-6 5 12 6-3-6-12 10-1Z" fill="#fff" stroke="#584635" stroke-width="2.5" stroke-linejoin="round"/></svg>';
    document.body.appendChild(pointer);
    restart();
    engine._hold = paused;
    requestAnimationFrame(() => {
      paintFrame();
      const images=[...document.images].map(img => img.decode ? img.decode().catch(()=>{}) : Promise.resolve());
      const landscape=['forest-left.svg','forest-right.svg','earth-grain.svg','path-edge-left.svg','path-edge-right.svg'].map(file => new Promise(resolve => {
        const art=new Image(); art.onload=()=>resolve(); art.onerror=()=>resolve(); art.src='./assets/'+file;
      }));
      Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), ...images, ...landscape]).then(() => requestAnimationFrame(announce));
    });
    requestAnimationFrame(tick);
  };
  function tick(now) {
    const delta = lastTime ? Math.min(64,now-lastTime) : 0; lastTime=now;
    if (!paused && engine) {
      age+=delta;
      const current=tasks;tasks=[];
      for (const task of current) {
        task.remaining-=delta;
        if (task.remaining<=0) { if (engine._alive) task.fn(); }
        else tasks.push(task);
      }
      const gate = engine.gate;
      if (gate && gate!==chosenGate && age>=550 && engine.gateY > Math.max(48,engine.stopY*.29)) {
        chosenGate=gate;
        engine.moveTo(gate.ci);
        pointer.style.left=engine.laneCPct(gate.ci)+'%';
        pointer.style.top='82%';
        pointer.classList.remove('show');void pointer.offsetWidth;pointer.classList.add('show');
        engine.later(()=>pointer.classList.remove('show'),850);
      }
      if (age>=12800) restart();
    }
    requestAnimationFrame(tick);
  }
})();
