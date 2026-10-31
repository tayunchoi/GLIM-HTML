/* Website-only autoplay adapter around the supplied live game engine. */
(() => {
  'use strict';
  const game = window.__GLIM_GAME__;
  const pointer = document.getElementById('previewPointer');
  let playing = true, ready = false, pageSuspended = false, time = 0, selected = null;
  let pending = null, pointerAge = 0, loops = 0, presses = 0;
  const answered = new Set();

  function clearPointer() {
    pointer.classList.remove('is-on');
    if (selected) selected.classList.remove('preview-selected');
    selected = null;
    pending = null;
  }
  function restart() {
    if (!ready) return;
    time = 0; answered.clear(); clearPointer();
    game.previewStart();
    loops++;
  }
  function setPlaying(value) {
    playing = value;
    const active = ready && playing && !pageSuspended;
    document.documentElement.classList.toggle('preview-paused', !active);
    window.__GLIM_PREVIEW_PLAYING = active;
    if (ready) game.pause(!active);
  }
  window.addEventListener('message', event => {
    if (event.source !== window.parent) return;
    const data = event.data;
    if (!data || typeof data !== 'object' || data.type !== 'glim-preview-control') return;
    if (data.action === 'play') setPlaying(true);
    else if (data.action === 'pause') setPlaying(false);
    else if (data.action === 'restart') { restart(); setPlaying(true); }
  });

  window.addEventListener('pagehide', () => {
    pageSuspended = true;
    setPlaying(playing);
  });
  window.addEventListener('pageshow', event => {
    pageSuspended = false;
    if (!event.persisted || !ready) return;
    // Restore both clocks together; the parent then reapplies its playback intent.
    restart();
    setPlaying(playing);
    notifyAfterPaint();
  });

  window.__GLIM_PREVIEW_TICK__ = dt => {
    if (!ready || !playing || pageSuspended || document.hidden) return;
    time += dt;
    if (time >= 14 || game.state().mode !== 'playing') { restart(); return; }
    if (selected) {
      pointerAge += dt;
      if (pending && pointerAge >= .22) {
        game.press(pending.wi);
        answered.add(pending.id);
        pending = null;
        presses++;
      }
      if (pointerAge > .82) clearPointer();
      return;
    }
    const state = game.state();
    const target = state.live.find(m => !answered.has(m.id) && !m.pendingHits && m.revealed !== false && m.age >= 2.45);
    if (!target) return;
    const button = document.getElementById('iconGrid').children[target.wi];
    if (!button || button.disabled) return;
    const box = button.getBoundingClientRect();
    pointer.style.left = (box.left + box.width * .67) + 'px';
    pointer.style.top = (box.top + box.height * .55) + 'px';
    pointer.classList.add('is-on');
    button.classList.add('preview-selected');
    selected = button; pending = target; pointerAge = 0;
  };

  function notifyAfterPaint() {
    // Keep the parent loading cover until the complete first arena frame has painted.
    requestAnimationFrame(() => {
      game.quiet();
      requestAnimationFrame(() => {
        window.parent.postMessage({type:'glim-preview-ready',game:'break'}, '*');
      });
    });
  }

  // Only local source assets and original registered poses are awaited.
  Promise.all([
    window.GlimAssetCharacters?.ready(),
    window.GlimBattleArt?.loaded,
    window.GlimIllustration?.ready,
    document.fonts?.load?.('400 24px Jua', '배 소 귀 통글자 브레이크 점 COMBO STAGE 0123456789'),
    document.fonts?.ready
  ]).then(() => {
    ready = true; restart(); setPlaying(playing);
    notifyAfterPaint();
  }).catch(error => {
    console.error('[glim-break-preview] local assets could not load', error);
  });
  window.__GLIM_PREVIEW__ = {
    state: () => ({ready, playing, pageSuspended, time, loops, presses, game: game.state()}),
    restart
  };
})();
