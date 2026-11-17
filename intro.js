(() => {
  'use strict';
  const dialog = document.querySelector('#spotlight-intro');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const audio = document.querySelector('#intro-audio');
  const replay = document.querySelector('#intro-replay');
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let dismissTimer;
  let closeTimer;
  let opening = 0;

  const stopSound = () => {
    audio.pause();
    audio.currentTime = 0;
  };
  const enter = (silent = false) => {
    if (closing || !dialog.open) return;
    closing = true;
    window.clearTimeout(dismissTimer);
    if (silent) stopSound();
    dialog.classList.add('is-leaving');
    closeTimer = window.setTimeout(() => dialog.close(), reduced.matches ? 0 : 520);
  };
  const open = () => {
    if (dialog.open) return;
    const currentOpening = ++opening;
    closing = false;
    stopSound();
    dialog.classList.remove('is-leaving');
    root.classList.remove('intro-arrived');
    dialog.showModal();
    root.classList.add('intro-open');
    audio.volume = 0.42;
    // Best-effort autoplay. Respect the browser's policy; never delay entry
    // or request permission if first-visit audio is blocked.
    audio.play().then(() => {
      if (!dialog.open || currentOpening !== opening) audio.pause();
    }).catch(() => { /* The animation continues silently when autoplay is denied. */ });
    dismissTimer = window.setTimeout(() => enter(), reduced.matches ? 400 : 1900);
  };
  dialog.addEventListener('cancel', () => { stopSound(); });
  dialog.addEventListener('close', () => {
    window.clearTimeout(dismissTimer);
    window.clearTimeout(closeTimer);
    root.classList.remove('intro-open');
    dialog.classList.remove('is-leaving');
    closing = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    root.classList.add('intro-arrived');
    const title = document.querySelector('#hero-title');
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSound(); });
  document.querySelector('#skip-intro').addEventListener('click', () => enter(true));
  replay.hidden = false;
  replay.addEventListener('click', open);
  // Start on opening the portfolio, while preserving direct section links.
  if (!window.location.hash || window.location.hash === '#home') open();
})();
