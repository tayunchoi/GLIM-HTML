/* Website autoplay: the supplied engine selects syllables and animates every jump. */
(() => {
  'use strict';
  const state = {ready:false,playing:true,time:0,loops:0,presses:0,question:-1,
    questionAge:0,finishedAt:null,pointer:null,error:null};
  let previous = performance.now();

  // Preserve the game data and mechanics while disabling records and tutorial gates.
  logRow = () => {};
  bumpWeak = () => {};
  v9AfterAnswer = () => {};
  v9RecordEvent = () => {};
  v9Event = () => {};
  v9Store = () => {};
  v5StartStageGate = () => false;
  G.mute = true;

  // Same eight-pose rabbit and trajectory, with a slightly longer, legible jump.
  CHARS[0].duration = .56;

  // Only the final demo hold replaces the product's completion/report screen.
  panClear = () => {
    const lastItem = G.plan[G.plan.length - 1];
    state.finishedAt = state.time;
    G.phase = 'play';
    G.v9Committed = true;
    G.pendingAdvance = true;
    G.transitionItem = {...lastItem,ui:lastItem.units.length};
    ovClear.style.display = 'none';
  };

  function restart() {
    if (!state.ready) return;
    previewStorage.clear();
    G.t = 0; G.charKind = 0; G.hat = 0; G.mute = true;
    startPan(1, 0, 0);
    // One complete source intro cycle: 포도 → 시계 → 조개, two syllables each.
    // v5MakeIntroCycle is the source game's own question constructor.
    const words = [0,1,2].map(i => cw(COUNTRIES[1].sets[0], i));
    G.plan = v5MakeIntroCycle(1, 0, 1, words);
    const sides = [0,1,1,0,0,1];
    G.plan.forEach((item,index) => {
      item.side = sides[index];
      item.v9PlanIndex = index;
      item.meta.panId = G.panId;
      item.meta.measurementFloor = index + 1;
      item.meta.totalMeasurementFloors = G.plan.length;
    });
    G.v9WordCount = 3;
    G.v9ActualFloors = G.plan.length;
    G.plan.v9WordCount = 3;
    G.plan.v9ActualFloors = G.plan.length;
    G.plan.v9Teacher = {confusion:0,speed:0,variants:0};
    G.i = 0; G.budget = 0; G.time = G.timeMax = 0;
    G.v5IntroCycle = 1; G.v5IntroState = {};
    v9BeginPlay();
    G.toast = null;
    state.time = 0; state.question = -1; state.questionAge = 0;
    state.finishedAt = null; state.pointer = null; state.loops++;
    previous = performance.now();
    render();
  }

  function setPlaying(value) {
    state.playing = value;
    previous = performance.now();
    window.__GLIM_PREVIEW_PLAYING = state.ready && value;
    document.documentElement.classList.toggle('preview-paused', !value);
  }

  window.addEventListener('message', event => {
    if (event.source !== window.parent) return;
    const data = event.data;
    if (!data || data.type !== 'glim-preview-control') return;
    if (data.action === 'play') setPlaying(true);
    else if (data.action === 'pause') setPlaying(false);
    else if (data.action === 'restart') { restart(); setPlaying(true); }
  });
  // Visibility never changes the requested play state, so pageshow resumes cleanly.
  document.addEventListener('visibilitychange', () => { previous = performance.now(); });
  window.addEventListener('pageshow', () => { previous = performance.now(); resize(); });
  // The iframe is a movie-like demonstration. Website controls own all input.
  window.addEventListener('keydown', event => {
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Escape','a','d','r','1','2','3'].includes(event.key)) {
      event.preventDefault(); event.stopImmediatePropagation();
    }
  }, {capture:true});

  function tick(dt) {
    state.time += dt;
    if (state.finishedAt !== null) {
      if (state.time - state.finishedAt >= 1.12) restart();
      return;
    }
    if (G.pendingAdvance || G.char.motion || G.char.inputLock > 0) return;
    const item = curItem();
    if (!item) return;
    if (state.question !== G.i) {
      state.question = G.i;
      state.questionAge = 0;
      state.pointer = null;
    }
    state.questionAge += dt;
    if (state.questionAge >= 1.02) {
      const p = candPos(item.side);
      state.pointer = {x:sx(p.x),y:sy(p.y)+(-72-SIGN_H/2)*WS,
        age:state.questionAge-1.02,clickedAt:null};
    }
    if (state.questionAge >= 1.40) {
      state.pointer.clickedAt = state.time;
      choose(item.side);
      state.presses++;
    }
  }

  function drawPointer() {
    const pointer = state.pointer;
    if (!pointer || state.finishedAt !== null) return;
    const clickAge = pointer.clickedAt === null ? null : state.time-pointer.clickedAt;
    if (clickAge !== null && clickAge > .28) return;
    ctx.save();
    v9ApplyPlayTransform();
    const opacity = clickAge === null ? Math.min(1,pointer.age/.10) : Math.max(0,1-clickAge/.28);
    ctx.globalAlpha = opacity;
    if (clickAge === null) {
      ctx.strokeStyle = '#6c936b'; ctx.lineWidth = 4;
      rr(pointer.x-SIGN_W*WS/2-5,pointer.y-SIGN_H*WS/2-5,SIGN_W*WS+10,SIGN_H*WS+10,18);
      ctx.stroke();
    }
    const x = pointer.x+SIGN_W*WS*.30, y = pointer.y+SIGN_H*WS*.27;
    if (clickAge !== null) {
      ctx.beginPath();ctx.arc(x,y,15+clickAge*65,0,Math.PI*2);
      ctx.strokeStyle = '#6c936b';ctx.lineWidth = 4;ctx.stroke();
    }
    ctx.translate(x,y);ctx.rotate(-.16);
    ctx.shadowColor='rgba(44,53,42,.24)';ctx.shadowBlur=7;ctx.shadowOffsetY=3;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,31);ctx.lineTo(8,24);
    ctx.lineTo(15,37);ctx.lineTo(22,33);ctx.lineTo(15,21);ctx.lineTo(27,20);ctx.closePath();
    ctx.fillStyle='#fffef7';ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    ctx.lineWidth=2.2;ctx.strokeStyle='#54714f';ctx.stroke();ctx.restore();
  }

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(.05,Math.max(0,(now-previous)/1000));
    previous = now;
    if (!state.ready || !state.playing || document.hidden) return;
    tick(dt);
    update(dt);
    render();
    drawPointer();
  }

  window.__GLIM_PREVIEW__ = {
    state: () => ({ready:state.ready,playing:state.playing,time:state.time,
      loops:state.loops,presses:state.presses,floor:G.i,totalFloors:G.plan.length,
      word:(G.transitionItem||curItem())?.word,unit:curItem()?.ch,
      phase:G.phase,moving:!!G.char.motion,finished:state.finishedAt!==null,error:state.error}),
    restart
  };

  window.GLIM_ASSETS_READY.then(() => {
    state.ready = true; G.assetsReady = true;
    restart(); setPlaying(state.playing);
    requestAnimationFrame(animate);
    window.parent.postMessage({type:'glim-preview-ready',game:'stairs'}, '*');
  }).catch(error => {
    state.error = String(error);
    G.assetError = true; renderLoading(true);
    console.error('[glim-stairs-preview] local assets could not load', error);
  });
})();
