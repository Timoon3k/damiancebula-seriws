(() => {
  'use strict';
  document.documentElement.classList.replace('no-js', 'js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const nav = document.querySelector('#primary-nav');
  const toggle = document.querySelector('.menu-toggle');
  function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
  const dialog = document.querySelector('.lightbox');
  let opener;
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('lightbox-open'); if (opener?.isConnected) opener.focus(); });
  function init() {
    observer?.disconnect();
    document.querySelectorAll('[data-map-src]').forEach(button => button.addEventListener('click', () => {
      const frame = document.createElement('iframe'); frame.src = button.dataset.mapSrc;
      frame.title = 'Mapa Google — lokalizacja firmy'; frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer';
      frame.allowFullscreen = true; button.replaceWith(frame);
    }));
    document.querySelectorAll('.mini-gallery a, .gallery-grid a').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); opener = a; dialog.querySelector('img').src = a.href;
      const alt = a.querySelector('img').alt; dialog.querySelector('img').alt = alt; dialog.querySelector('p').textContent = alt;
      document.body.classList.add('lightbox-open'); dialog.showModal();
    }));
    if (!reduced.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
      document.querySelectorAll('main section:not(.hero), main .service-card, main .faq details').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
    }
    document.querySelectorAll('[data-ajax-contact]').forEach(form => form.addEventListener('submit', async e => {
      if (!form.reportValidity()) return;
      e.preventDefault(); const button = form.querySelector('[type=submit]'); const status = form.querySelector('.form-status');
      button.disabled = true; form.setAttribute('aria-busy', 'true'); status.textContent = 'Wysyłanie wiadomości…';
      const data = new FormData(form); data.set('dc_ajax', '1');
      try {
        const response = await fetch(form.getAttribute('action'), {method:'POST',body:data,credentials:'same-origin',signal:AbortSignal.timeout(20000)});
        const result = await response.json(); status.textContent = result.message; status.classList.toggle('error', !result.success);
        if (result.success) form.reset();
      } catch { status.textContent = 'Nie udało się potwierdzić wysyłki. Sprawdź połączenie lub zadzwoń: 794 225 139.'; status.classList.add('error'); }
      finally { button.disabled = false; form.removeAttribute('aria-busy'); status.focus(); }
    }));
  }
  // Progressive enhancement: real server-rendered WordPress URLs remain crawlable.
  let controller;
  let generation = 0;
  const announcer = document.createElement('div'); announcer.className = 'screen-reader-text'; announcer.setAttribute('aria-live', 'polite'); document.body.append(announcer);
  history.replaceState({dc:true}, '', location.href);
  async function navigate(url, push = true) {
    controller?.abort(); controller = new AbortController(); const current = ++generation;
    document.documentElement.classList.add('is-navigating'); document.querySelector('main').setAttribute('aria-busy', 'true'); closeMenu();
    try {
      const response = await fetch(url, {headers:{'X-Requested-With':'DCNavigation'},credentials:'same-origin',signal:controller.signal});
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Navigation unavailable');
      const next = new DOMParser().parseFromString(await response.text(), 'text/html');
      const incoming = next.querySelector('#main');
      if (!incoming || !next.querySelector('.site-header') || !next.querySelector('script[src*="dc-serwis/assets/site.js"]')) throw new Error('Other layout');
      if (current !== generation) return;
      if (next.querySelector('.google-reviews')) { location.assign(url); return; }
      const swap = () => {
        document.querySelector('#main').replaceWith(incoming);
        document.title = next.title; document.body.className = next.body.className;
        const selector = 'meta[name="description"],meta[name^="twitter:"],meta[property^="og:"],link[rel="canonical"],script[type="application/ld+json"],meta[name="robots"]';
        document.head.querySelectorAll(selector).forEach(el => el.remove()); next.head.querySelectorAll(selector).forEach(el => document.head.append(el.cloneNode(true)));
        document.querySelector('#primary-nav').innerHTML = next.querySelector('#primary-nav').innerHTML;
        if (push) history.pushState({dc:true}, '', response.url);
        init(); window.scrollTo(0, 0); incoming.focus({preventScroll:true}); announcer.textContent = document.title;
        if (new URL(url).hash) document.getElementById(decodeURIComponent(new URL(url).hash.slice(1)))?.scrollIntoView();
      };
      if (document.startViewTransition && !reduced.matches) await document.startViewTransition(swap).finished;
      else swap();
    } catch (error) { if (error.name !== 'AbortError' && current === generation) location.assign(url); }
    finally { if (current === generation) { document.documentElement.classList.remove('is-navigating'); document.querySelector('main').removeAttribute('aria-busy'); } }
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download') || a.closest('.mini-gallery, .gallery-grid, #wpadminbar') || a.hasAttribute('data-no-ajax')) return;
    const url = new URL(a.href);
    if (url.origin !== location.origin || !['http:','https:'].includes(url.protocol) || /\/wp-(admin|login|json)|\.(zip|webp|png|jpg|pdf)$/i.test(url.pathname) || url.search || (url.pathname === location.pathname && url.hash)) return;
    e.preventDefault(); navigate(url.href);
  });
  addEventListener('popstate', () => navigate(location.href, false));
  addEventListener('pageshow', () => document.documentElement.classList.remove('is-navigating'));
  init();
})();
