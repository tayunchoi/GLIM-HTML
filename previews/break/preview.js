/* 글림 홈페이지 · 통글자 브레이크 자동 재생 (법사토끼)
   실제 게임 엔진을 그대로 돌리고, 글자 괴물이 왼쪽 → 오른쪽 → 가운데 순서로 한 마리씩 내려오고,
   내려올 때마다 법사토끼가 그림 버튼을 눌러 별 마법으로 맞히는 장면을 반복합니다. 소리·저장·전송 없음. */
(() => {
  'use strict';
  const game = window.__GLIM_GAME__;
  const pointer = document.getElementById('previewPointer');
  // 한 마리씩: 왼쪽 → 오른쪽 → 가운데. 앞의 괴물을 맞힌 뒤에 다음 괴물이 내려옵니다.
  // (x는 화면 폭 비율, wi는 그림 버튼 순서 배·소·귀)
  const PLAN = [
    {wi: 0, x: .19},
    {wi: 2, x: .81},
    {wi: 1, x: .50}
  ];
  const TRAVEL = 6, FIRST_DELAY = .25, ATTACK_AGE = 2.3, NEXT_DELAY = .75, END_PAUSE = 1.7;
  let playing = true, ready = false, pageSuspended = false;
  let time = 0, index = 0, phase = 'wait', nextAt = FIRST_DELAY, currentId = null, loops = 0, presses = 0;
  let selected = null, pending = null, pointerAge = 0;

  function clearPointer() {
    pointer.classList.remove('is-on');
    if (selected) selected.classList.remove('preview-selected');
    selected = null; pending = null;
  }
  function restart() {
    if (!ready) return;
    time = 0; index = 0; phase = 'wait'; nextAt = FIRST_DELAY; currentId = null; clearPointer();
    game.previewStart();
    loops++;
  }
  function setPlaying(value) {
    playing = value;
    const active = ready && playing && !pageSuspended;
    document.documentElement.classList.toggle('preview-paused', !active);
    window.__GLIM_PREVIEW_PLAYING = active;
  }
  window.addEventListener('message', event => {
    if (event.source !== window.parent) return;
    const data = event.data;
    if (!data || typeof data !== 'object' || data.type !== 'glim-preview-control') return;
    if (data.action === 'play') setPlaying(true);
    else if (data.action === 'pause') setPlaying(false);
    else if (data.action === 'restart') { restart(); setPlaying(true); }
  });
  window.addEventListener('pagehide', () => { pageSuspended = true; setPlaying(playing); });
  window.addEventListener('pageshow', event => {
    pageSuspended = false;
    if (!event.persisted || !ready) return;
    restart(); setPlaying(playing); notifyAfterPaint();
  });

  window.__GLIM_PREVIEW_TICK__ = dt => {
    if (!ready || !playing || pageSuspended || document.hidden) return;
    time += dt;
    const state = game.state();
    if (state.mode !== 'playing' || time > 30) { restart(); return; }
    if (selected) {
      pointerAge += dt;
      if (pending && pointerAge >= .24) { game.press(pending.wi); pending = null; presses++; }
      if (pointerAge > .8) clearPointer();
    }
    const target = currentId == null ? null : state.live.find(m => m.id === currentId);
    if (phase === 'wait') {
      // 화면에 괴물이 없을 때만 다음 괴물이 내려온다
      if (time < nextAt) return;
      if (index >= PLAN.length) { restart(); return; }
      const p = PLAN[index];
      const m = game.previewSpawn(p.wi, p.x, TRAVEL, index);
      currentId = m && m.id; phase = 'fall';
    } else if (phase === 'fall') {
      if (!target) { phase = 'wait'; nextAt = time + NEXT_DELAY; index++; return; }
      if (target.age < ATTACK_AGE || selected) return;
      const button = document.getElementById('iconGrid').children[target.wi];
      if (!button || button.disabled) return;
      const box = button.getBoundingClientRect();
      pointer.style.left = (box.left + box.width * .6) + 'px';
      pointer.style.top = (box.top + box.height * .55) + 'px';
      pointer.classList.add('is-on');
      button.classList.add('preview-selected');
      selected = button; pending = target; pointerAge = 0; phase = 'attack';
    } else if (phase === 'attack') {
      // 마법이 맞아 괴물이 사라지면 잠깐 쉬고 다음 괴물
      if (target) return;
      index++; currentId = null; phase = 'wait';
      nextAt = time + (index >= PLAN.length ? END_PAUSE : NEXT_DELAY);
    }
  };

  function notifyAfterPaint() {
    requestAnimationFrame(() => {
      game.quiet();
      requestAnimationFrame(() => {
        window.parent.postMessage({type: 'glim-preview-ready', game: 'break'}, '*');
      });
    });
  }
  const settle = v => { try { return typeof v === 'function' ? v() : v; } catch (_) { return null; } };
  Promise.all([
    settle(window.GlimAssetCharacters && window.GlimAssetCharacters.ready),
    settle(window.GlimBattleArt && window.GlimBattleArt.loaded),
    settle(window.GlimIllustration && window.GlimIllustration.ready),
    document.fonts && document.fonts.load ? document.fonts.load('400 24px Jua', '배 소 귀 통글자 브레이크 COMBO STAGE 0123456789').catch(() => {}) : null,
    document.fonts ? document.fonts.ready : null
  ].map(p => Promise.resolve(p).catch(() => {}))).then(() => {
    ready = true; restart(); setPlaying(playing);
    notifyAfterPaint();
  });
  window.__GLIM_PREVIEW__ = {
    state: () => ({ready, playing, pageSuspended, time, loops, presses, index, phase, game: game.state()}),
    restart
  };
})();
