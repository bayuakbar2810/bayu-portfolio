(() => {
  'use strict';
  const key = 'bayu-portfolio-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  const valid = (value) => value === 'light' || value === 'dark';
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch { /* Private browsing may deny storage; switching still works. */ }
  const apply = () => {
    const theme = preference || (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#101923' : '#f6f8fb';
  };
  apply();
  system.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : null;
    apply();
  });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-switch').forEach((group) => {
      group.hidden = false;
      group.addEventListener('click', (event) => {
        const button = event.target.closest('[data-theme-choice]');
        if (!button) return;
        preference = button.dataset.themeChoice;
        try { localStorage.setItem(key, preference); } catch { /* Optional persistence. */ }
        apply();
      });
    });
    apply();
  });
})();
