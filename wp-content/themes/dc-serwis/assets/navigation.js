(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  if (!header) return;

  const root = document.documentElement;
  const shell = document.createElement('div');
  shell.className = 'site-header-shell';
  header.before(shell);
  shell.append(header);
  root.classList.add('dc-navigation-ready');

  let headerHeight = 0;
  let scheduled = false;

  function measure() {
    headerHeight = header.getBoundingClientRect().height;
    shell.style.height = `${headerHeight}px`;
    root.style.setProperty('--dc-header-height', `${headerHeight}px`);
  }

  function update() {
    scheduled = false;
    const toolbar = document.getElementById('wpadminbar');
    const toolbarHeight = toolbar ? Math.max(0, toolbar.getBoundingClientRect().bottom) : 0;
    root.style.setProperty('--dc-sticky-offset', `${toolbarHeight}px`);
    const shellTop = shell.getBoundingClientRect().top + scrollY;
    header.classList.toggle('is-sticky', scrollY > shellTop + headerHeight - toolbarHeight);
  }

  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }

  function refresh() {
    measure();
    schedule();
  }

  // Keep the same accessible header in place; the shell reserves its height.
  // Menu destinations and WordPress aria-current="page" remain unchanged.
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', refresh, {passive: true});
  addEventListener('pageshow', refresh);
  addEventListener('dc:navigation', refresh);
  if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(header);
  refresh();
})();
