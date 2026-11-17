(() => {
  'use strict';
  const dialog = document.querySelector('#spotlight-intro');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const audio = document.querySelector('#intro-audio');
  const replay = document.querySelector('#intro-replay');
  const root = document.documentElement;
  const seenKey = 'bayu-spotlight-seen-v1';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;
  let timer;
  let hasSeen = false;
  try { hasSeen = sessionStorage.getItem(seenKey) === '1'; } catch { /* Storage is optional. */ }

  const stopSound = () => {
    audio.pause();
    audio.currentTime = 0;
  };
  const open = () => {
    if (dialog.open) return;
    closing = false;
    stopSound();
    dialog.classList.remove('is-leaving');
    root.classList.remove('intro-arrived');
    dialog.showModal();
    root.classList.add('intro-open');
  };
  const enter = (withSound) => {
    if (closing) return;
    closing = true;
    if (withSound) {
      // Called directly from a visible button click: no autoplay or background loop.
      audio.volume = 0.42;
      audio.currentTime = 0;
      audio.play().catch(() => { /* Audio failure must never block entry. */ });
    } else stopSound();
    dialog.classList.add('is-leaving');
    timer = window.setTimeout(() => dialog.close(), reduced.matches ? 0 : 520);
  };
  dialog.addEventListener('cancel', () => { stopSound(); });
  dialog.addEventListener('close', () => {
    window.clearTimeout(timer);
    root.classList.remove('intro-open');
    dialog.classList.remove('is-leaving');
    closing = false;
    try { sessionStorage.setItem(seenKey, '1'); } catch { /* Keep the page available. */ }
    window.scrollTo({ top: 0, behavior: 'instant' });
    root.classList.add('intro-arrived');
    const title = document.querySelector('#hero-title');
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSound(); });
  document.querySelector('#enter-with-sound').addEventListener('click', () => enter(true));
  document.querySelector('#enter-silent').addEventListener('click', () => enter(false));
  replay.hidden = false;
  replay.addEventListener('click', open);
  // Respect deep links, repeat visits in this tab, and unsupported browsers.
  if (!hasSeen && (!window.location.hash || window.location.hash === '#home')) open();
})();
