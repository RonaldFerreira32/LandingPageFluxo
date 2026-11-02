export function setNavigationState(menu, button, open) {
  menu.classList.toggle('is-open', open);
  button.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

export function setFaqState(item, button, panel, open) {
  item.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
}

function initNavigation(root) {
  const menu = root.querySelector('[data-menu]');
  const button = root.querySelector('[data-menu-toggle]');

  if (!menu || !button) return;

  const closeMenu = () => {
    setNavigationState(menu, button, false);
    root.body?.classList.remove('menu-open');
  };

  button.addEventListener('click', () => {
    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    setNavigationState(menu, button, willOpen);
    root.body?.classList.toggle('menu-open', willOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      button.focus();
    }
  });

  const desktopQuery = window.matchMedia('(min-width: 821px)');
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

function initFaq(root) {
  const items = [...root.querySelectorAll('.faq-item')];

  items.forEach((item) => {
    const button = item.querySelector('[data-faq-button]');
    const panel = item.querySelector('[data-faq-panel]');
    if (!button || !panel) return;

    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';

      items.forEach((otherItem) => {
        const otherButton = otherItem.querySelector('[data-faq-button]');
        const otherPanel = otherItem.querySelector('[data-faq-panel]');
        if (otherButton && otherPanel) {
          setFaqState(otherItem, otherButton, otherPanel, false);
        }
      });

      if (willOpen) setFaqState(item, button, panel, true);
    });
  });
}

function initReveal(root) {
  const elements = [...root.querySelectorAll('.reveal')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -40px',
  });

  elements.forEach((element) => observer.observe(element));
}

function initHeader(root) {
  const header = root.querySelector('[data-header]');
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function init() {
  initNavigation(document);
  initFaq(document);
  initReveal(document);
  initHeader(document);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}

