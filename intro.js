(() => {
  'use strict';
  const dialog = document.querySelector('#spotlight-intro');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const audio = document.querySelector('#intro-audio');
  const replay = document.querySelector('#intro-replay');
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const status = dialog.querySelector('.intro-entry-status');
  const unlockButton = document.querySelector('#unlock-intro');
  let waitingForGesture = false;
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
    waitingForGesture = false;
    unlockButton.hidden = true;
    status.textContent = 'Memasuki portofolio…';
    stopSound();
    dialog.classList.remove('is-leaving');
    root.classList.remove('intro-arrived');
    dialog.showModal();
    root.classList.add('intro-open');
    audio.volume = 0.65;
    // Autoplay where permitted; otherwise request a real user gesture.
    audio.play().then(() => {
      if (!dialog.open || currentOpening !== opening) audio.pause();
    }).catch((error) => {
      if (!dialog.open || closing || currentOpening !== opening) return;
      if (error.name !== 'NotAllowedError') return;
      window.clearTimeout(dismissTimer);
      waitingForGesture = true;
      status.textContent = 'Selamat datang. Ketuk atau klik layar untuk melanjutkan.';
      unlockButton.hidden = false;
      unlockButton.focus({ preventScroll: true });
    });
    dismissTimer = window.setTimeout(() => enter(), reduced.matches ? 400 : 1900);
  };
  const unlock = (event) => {
    if (!event.isTrusted || !waitingForGesture || closing || !dialog.open) return;
    if (event.target.closest('.theme-switch, #skip-intro')) return;
    waitingForGesture = false;
    unlockButton.hidden = true;
    status.textContent = 'Memasuki portofolio…';
    const currentOpening = opening;
    audio.currentTime = 0;
    audio.play().then(() => {
      if (!dialog.open || currentOpening !== opening) { audio.pause(); return; }
      dismissTimer = window.setTimeout(() => enter(), reduced.matches ? 350 : 950);
    }).catch(() => { enter(); });
  };
  dialog.addEventListener('click', unlock);
  dialog.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target === unlockButton) {
      event.preventDefault();
      unlock(event);
    }
  });
  dialog.addEventListener('cancel', () => { stopSound(); });
  dialog.addEventListener('close', () => {
    window.clearTimeout(dismissTimer);
    window.clearTimeout(closeTimer);
    root.classList.remove('intro-open');
    dialog.classList.remove('is-leaving');
    closing = false;
    waitingForGesture = false;
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
