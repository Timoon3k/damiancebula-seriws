(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-nav');
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.getElementById('dc-mobile-menu');
  if (!header || !nav || !toggle) return;

  const root = document.documentElement;
  const shell = document.createElement('div');
  shell.className = 'site-header-shell';
  header.before(shell);
  shell.append(header);
  root.classList.add('dc-navigation-ready');

  let headerHeight = 0;
  let scheduled = false;
  let lockedScroll = null;

  function measure() {
    headerHeight = header.getBoundingClientRect().height;
    shell.style.height = `${headerHeight}px`;
    root.style.setProperty('--dc-header-height', `${headerHeight}px`);
  }

  function update() {
    scheduled = false;
    // iOS scroll locking temporarily fixes the body; keep the header's state.
    if (lockedScroll) return;
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

  function refresh() { measure(); schedule(); }

  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', refresh, {passive:true});
  addEventListener('pageshow', refresh);
  addEventListener('dc:navigation', refresh);
  if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(header);
  refresh();

  if (!drawer || typeof drawer.showModal !== 'function') {
    root.classList.add('dc-menu-unavailable');
    return;
  }

  const mobile = matchMedia('(max-width:800px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const home = document.createComment('Primary navigation desktop position');
  nav.before(home);
  const slot = drawer.querySelector('.mobile-menu-nav');
  const closeButton = drawer.querySelector('.mobile-menu-close');
  let animation = null;
  let closing = null;
  let epoch = 0;

  function lockScroll() {
    const properties = ['position','top','left','right','width','padding-right'];
    const body = document.body;
    const gap = innerWidth - root.clientWidth;
    const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
    lockedScroll = {x:scrollX,y:scrollY,styles:properties.map(property => [property,body.style.getPropertyValue(property),body.style.getPropertyPriority(property)])};
    root.classList.add('dc-menu-open');
    Object.assign(body.style,{position:'fixed',top:`-${lockedScroll.y}px`,left:'0',right:'0',width:'100%'});
    if (gap > 0) body.style.paddingRight = `${padding + gap}px`;
  }

  function unlockScroll() {
    if (!lockedScroll) return;
    const saved = lockedScroll;
    lockedScroll = null;
    for (const [property,value,priority] of saved.styles) {
      if (value) document.body.style.setProperty(property,value,priority);
      else document.body.style.removeProperty(property);
    }
    root.classList.remove('dc-menu-open');
    scrollTo({left:saved.x,top:saved.y,behavior:'instant'});
    schedule();
  }

  function finishClose(restoreFocus) {
    epoch++;
    animation?.cancel();
    animation = null;
    toggle.setAttribute('aria-expanded','false');
    if (drawer.open) drawer.close();
    unlockScroll();
    if (restoreFocus && mobile.matches) toggle.focus({preventScroll:true});
  }

  function closeMenu({restoreFocus=true}={}) {
    if (!drawer.open) return Promise.resolve();
    if (closing) return closing;
    toggle.setAttribute('aria-expanded','false');
    if (reduced.matches || !drawer.animate) {
      finishClose(restoreFocus);
      return Promise.resolve();
    }
    const current = ++epoch;
    const transform = getComputedStyle(drawer).transform;
    animation?.cancel();
    animation = drawer.animate([{transform},{transform:'translateX(100%)'}],{duration:220,easing:'cubic-bezier(.4,0,1,1)',fill:'both'});
    animation.id = 'dc-menu-leave';
    const pending = animation.finished.catch(() => {}).then(() => {
      if (current === epoch) finishClose(restoreFocus);
    });
    closing = pending;
    pending.finally(() => { if (closing === pending) closing = null; });
    return pending;
  }

  function openMenu() {
    if (!mobile.matches || drawer.open) return;
    epoch++;
    animation?.cancel();
    animation = null;
    closing = null;
    lockScroll();
    try { drawer.showModal(); }
    catch { unlockScroll(); return; }
    toggle.setAttribute('aria-expanded','true');
    closeButton.focus({preventScroll:true});
    if (!reduced.matches && drawer.animate) {
      animation = drawer.animate([{transform:'translateX(100%)'},{transform:'translateX(0)'}],{duration:340,easing:'cubic-bezier(.22,1,.36,1)'});
      animation.id = 'dc-menu-enter';
      animation.finished.catch(() => {});
    }
  }

  function placeNavigation() {
    if (mobile.matches) slot.append(nav);
    else {
      finishClose(false);
      home.after(nav);
    }
    refresh();
  }

  window.dcCloseMenu = closeMenu;
  toggle.addEventListener('click',openMenu);
  closeButton.addEventListener('click',() => closeMenu());
  drawer.addEventListener('cancel',event => { event.preventDefault(); closeMenu(); });
  drawer.addEventListener('click',event => {
    if (event.target !== drawer) return;
    const box = drawer.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeMenu();
  });
  drawer.addEventListener('keydown',event => {
    if (event.key !== 'Tab') return;
    const controls = [...drawer.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(element => element.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  nav.addEventListener('click',event => {
    if (event.target.closest('a[href]') && drawer.open) closeMenu({restoreFocus:false});
  });
  drawer.addEventListener('close',() => {
    if (!drawer.open) { toggle.setAttribute('aria-expanded','false'); unlockScroll(); }
  });
  mobile.addEventListener('change',placeNavigation);
  reduced.addEventListener('change',() => { if (drawer.open) finishClose(false); });
  addEventListener('pageshow',event => { if (event.persisted) finishClose(false); });
  placeNavigation();
  root.classList.add('dc-menu-ready');
})();
