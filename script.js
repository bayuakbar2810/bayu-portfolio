(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  const setMenu = (expanded) => {
    menuButton.setAttribute('aria-expanded', String(expanded));
    navigation.dataset.collapsed = String(mobileQuery.matches && !expanded);
    menuButton.querySelector('.menu-label').textContent = expanded ? 'Tutup' : 'Menu';
  };
  setMenu(false);
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileQuery.addEventListener('change', () => setMenu(false));
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', (event) => {
    if (mobileQuery.matches && !event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
  const filters = document.querySelector('.project-filters');
  const projects = [...document.querySelectorAll('.project-card')];
  const filterStatus = document.querySelector('#filter-status');
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filters.querySelectorAll('button').forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    projects.forEach((project) => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
    });
    filterStatus.textContent = `${projects.filter((project) => !project.hidden).length} proyek ditampilkan.`;
  });
  const dialog = document.querySelector('#image-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const dialogCaption = document.querySelector('#dialog-caption');
  const dialogError = document.querySelector('#dialog-error');
  let trigger = null;
  let backdropPointerDown = false;
  const closeDialog = () => dialog.close();
  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      if (typeof dialog.showModal !== 'function') {
        window.location.assign(button.dataset.lightbox);
        return;
      }
      trigger = button;
      dialogError.hidden = true;
      dialogImage.hidden = false;
      dialogCaption.textContent = button.dataset.caption;
      dialogImage.alt = button.dataset.caption;
      dialogImage.src = button.dataset.lightbox;
      dialog.showModal();
      document.body.classList.add('modal-open');
      document.querySelector('#close-dialog').focus();
    });
  });
  dialogImage.addEventListener('error', () => {
    dialogImage.hidden = true;
    dialogError.hidden = false;
  });
  document.querySelector('#close-dialog').addEventListener('click', closeDialog);
  const outsideDialog = (event) => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', (event) => { backdropPointerDown = outsideDialog(event); });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && backdropPointerDown && outsideDialog(event)) closeDialog();
    backdropPointerDown = false;
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialogImage.removeAttribute('src');
    trigger?.focus();
  });
  const navLinks = [...navigation.querySelectorAll('a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
  }
  document.querySelector('#copyright-year').textContent = String(new Date().getFullYear());
})();
