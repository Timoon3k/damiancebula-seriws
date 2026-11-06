(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-nav');
  if (!header || !nav) return;

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const shell = document.createElement('div');
  shell.className = 'site-header-shell';
  header.before(shell);
  shell.append(header);
  root.classList.add('dc-navigation-ready');

  let headerHeight = 0;
  let toolbarHeight = 0;
  let scheduled = false;
  let sections = [];
  let preferredLink = null;
  let preferredPosition = null;
  const nativeCurrent = new WeakMap();
  const cleanPath = path => path.replace(/\/+$/, '') || '/';

  function measure() {
    headerHeight = header.getBoundingClientRect().height;
    shell.style.height = `${headerHeight}px`;
    root.style.setProperty('--dc-header-height', `${headerHeight}px`);
  }

  function restoreCurrent() {
    sections.forEach(({link}) => {
      if (!link.isConnected) return;
      const value = nativeCurrent.get(link);
      if (value) link.setAttribute('aria-current', value);
      else link.removeAttribute('aria-current');
    });
  }

  function refresh() {
    restoreCurrent();
    sections = [];
    preferredLink = null;
    preferredPosition = null;
    const hero = document.querySelector('main .home-hero');
    root.classList.toggle('dc-scrollspy', Boolean(hero));
    if (hero) {
      const cards = document.querySelectorAll('main .services .service-card');
      const homePath = cleanPath(new URL(document.querySelector('.brand').href).pathname);
      const targets = [
        {path: homePath, target: hero},
        {path: `${homePath === '/' ? '' : homePath}/serwis-klimatyzacji-stalowa-wola`, target: document.getElementById('klimatyzacja') || cards[0]},
        {path: `${homePath === '/' ? '' : homePath}/serwis-agd-stalowa-wola`, target: document.getElementById('agd') || cards[1]},
        {path: `${homePath === '/' ? '' : homePath}/realizacje`, target: document.getElementById('moje-prace')},
        {path: `${homePath === '/' ? '' : homePath}/o-firmie`, target: document.getElementById('o-mnie')},
        {path: `${homePath === '/' ? '' : homePath}/kontakt`, target: document.querySelector('footer #kontakt')}
      ];
      nav.querySelectorAll('a[href]').forEach(link => {
        const url = new URL(link.href);
        if (url.origin !== location.origin || url.search || url.hash) return;
        const match = targets.find(item => cleanPath(item.path) === cleanPath(url.pathname));
        if (!match?.target) return;
        nativeCurrent.set(link, link.getAttribute('aria-current'));
        sections.push({link, target: match.target, home: match.target === hero});
      });
    }
    measure();
    schedule();
  }

  function update() {
    scheduled = false;
    const toolbar = document.getElementById('wpadminbar');
    toolbarHeight = toolbar ? Math.max(0, toolbar.getBoundingClientRect().bottom) : 0;
    root.style.setProperty('--dc-sticky-offset', `${toolbarHeight}px`);
    const shellTop = shell.getBoundingClientRect().top + scrollY;
    header.classList.toggle('is-sticky', scrollY > shellTop + headerHeight - toolbarHeight);
    if (!sections.length) return;

    // Cards and local information share rows on desktop. One current link is
    // announced; a clicked member stays selected until another row is reached.
    const positions = sections.map(section => ({...section, top: section.target.getBoundingClientRect().top + scrollY})).sort((a, b) => a.top - b.top);
    const groups = [];
    positions.forEach(section => {
      const last = groups[groups.length - 1];
      if (last && Math.abs(section.top - last.top) < 48) last.items.push(section);
      else groups.push({top: section.top, items: [section]});
    });
    const line = scrollY + headerHeight + toolbarHeight + Math.min(120, innerHeight * .16);
    let group = groups[0];
    groups.forEach(candidate => { if (candidate.top <= line) group = candidate; });
    if (scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 3) group = groups[groups.length - 1];
    // A short page may prevent the selected lower section reaching the top.
    // Keep that explicit selection at its clamped destination until scrolling.
    if (preferredLink && Math.abs(scrollY - preferredPosition) < 4) {
      group = groups.find(candidate => candidate.items.some(item => item.link === preferredLink)) || group;
    }
    const active = group.items.find(item => item.link === preferredLink) || group.items[0];
    sections.forEach(section => {
      if (section.link === active.link) section.link.setAttribute('aria-current', section.home ? 'page' : 'location');
      else section.link.removeAttribute('aria-current');
    });
  }

  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }

  // Keep real WordPress destinations in href for crawlers, no-JS and new tabs.
  // Only a regular click in the home page menu becomes an in-page journey.
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('#primary-nav a') : null;
    if (!link || link.target || link.hasAttribute('download') || link.hasAttribute('data-no-scrollspy')) return;
    const section = sections.find(item => item.link === link);
    if (!section) return;
    event.preventDefault();
    preferredLink = link;
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    const top = section.home ? 0 : Math.max(0, section.target.getBoundingClientRect().top + scrollY - headerHeight - toolbarHeight - 16);
    preferredPosition = Math.min(top, Math.max(0, document.documentElement.scrollHeight - innerHeight));
    window.scrollTo({top, behavior: reduced.matches ? 'instant' : 'smooth'});
    if (!section.target.hasAttribute('tabindex')) {
      section.target.setAttribute('tabindex', '-1');
      section.target.addEventListener('blur', () => section.target.removeAttribute('tabindex'), {once: true});
    }
    section.target.focus({preventScroll: true});
    schedule();
  }, true);

  addEventListener('scroll', schedule, {passive: true});
  const clearPreference = () => { preferredLink = null; preferredPosition = null; schedule(); };
  addEventListener('wheel', clearPreference, {passive: true});
  addEventListener('touchstart', clearPreference, {passive: true});
  addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key) && event.target instanceof Element && !event.target.closest('input,textarea,select,button')) clearPreference();
  });
  addEventListener('resize', () => { measure(); schedule(); }, {passive: true});
  addEventListener('pageshow', refresh);
  addEventListener('dc:navigation', refresh);
  if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); schedule(); }).observe(header);
  refresh();
})();
