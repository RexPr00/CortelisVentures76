(() => {
  const body = document.body;
  const lock = (on) => body.style.overflow = on ? 'hidden' : '';

  const traps = new Set();
  const focusable = (root) => [...root.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);
  const activateTrap = (root) => {
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const list = focusable(root);
      if (!list.length) return;
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    root.addEventListener('keydown', onKey);
    traps.add(() => root.removeEventListener('keydown', onKey));
    const initial = focusable(root)[0];
    if (initial) initial.focus();
  };
  const clearTraps = () => { traps.forEach(fn => fn()); traps.clear(); };

  document.querySelectorAll('[data-lang]').forEach((block) => {
    const btn = block.querySelector('.lang-toggle');
    btn?.addEventListener('click', () => block.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!block.contains(e.target)) block.classList.remove('open');
    });
  });

  const drawerWrap = document.querySelector('.drawer-wrap');
  const openDrawerBtn = document.querySelector('.burger');
  const closeDrawerBtn = document.querySelector('.drawer-close');
  const openDrawer = () => {
    drawerWrap?.classList.add('open');
    lock(true);
    activateTrap(drawerWrap.querySelector('.drawer'));
  };
  const closeDrawer = () => {
    drawerWrap?.classList.remove('open');
    lock(false);
    clearTraps();
  };
  openDrawerBtn?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawerWrap?.querySelector('.drawer-backdrop')?.addEventListener('click', closeDrawer);

  const modal = document.querySelector('.legal-modal-wrap');
  const openers = document.querySelectorAll('[data-open-privacy]');
  const closeBtns = document.querySelectorAll('[data-close-privacy]');
  const openModal = () => {
    modal?.classList.add('open');
    lock(true);
    activateTrap(modal.querySelector('.legal-modal'));
  };
  const closeModal = () => {
    modal?.classList.remove('open');
    lock(false);
    clearTraps();
  };
  openers.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal?.classList.contains('open')) closeModal();
    if (drawerWrap?.classList.contains('open')) closeDrawer();
  });

  document.querySelectorAll('.faq-item button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const list = item.parentElement;
      list.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      item.classList.toggle('open');
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
