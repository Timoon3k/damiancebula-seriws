(() => {
  'use strict';
  document.documentElement.classList.replace('no-js', 'js');
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const animations = new Set();
  const revealed = new WeakSet();
  let motionEpoch = 0;
  const wipe = document.createElement('div');
  wipe.className = 'dc-motion-wipe'; wipe.setAttribute('aria-hidden', 'true'); document.body.append(wipe);

  function motionStage(stage) {
    root.dataset.dcMotion = stage;
    window.dispatchEvent(new CustomEvent('dc:motion', {detail: {stage}}));
  }

  function stopMotion() {
    motionEpoch++;
    animations.forEach(animation => animation.cancel());
    animations.clear();
    motionStage('idle');
  }

  function play(element, frames, options, id) {
    if (!element || reduced.matches || !element.animate) return Promise.resolve();
    const animation = element.animate(frames, {fill: 'both', easing: 'cubic-bezier(.2,.7,.25,1)', ...options});
    animation.id = id;
    animations.add(animation);
    // Cancel removes fill styles after completion and on interrupted navigation.
    return animation.finished.catch(() => {}).finally(() => { animations.delete(animation); animation.cancel(); });
  }

  function enter(main, initial) {
    if (reduced.matches || !main.animate) { motionStage('idle'); return Promise.resolve(); }
    const epoch = motionEpoch;
    motionStage(initial ? 'intro' : 'entering');
    const title = main.querySelector('h1');
    const intro = main.querySelector('.hero-intro') || title?.nextElementSibling;
    const jobs = [
      play(title, [{opacity: .25, clipPath: 'inset(0 0 100% 0)', transform: 'translateY(20px)'}, {opacity: 1, clipPath: 'inset(0)', transform: 'none'}], {duration: 380, delay: initial ? 0 : 30}, 'dc-title-enter'),
      play(intro, [{opacity: .3, clipPath: 'inset(0 0 100% 0)', transform: 'translateY(14px)'}, {opacity: 1, clipPath: 'inset(0)', transform: 'none'}], {duration: 340, delay: 70}, 'dc-intro-enter'),
      play(main.querySelector('.hero-media'), [{opacity: .3, transform: 'scale(1.035)'}, {opacity: 1, transform: 'none'}], {duration: 330}, 'dc-hero-enter')
    ];
    if (!initial) jobs.push(play(main, [{opacity: .25, transform: 'translateY(16px)'}, {opacity: 1, transform: 'none'}], {duration: 340}, 'dc-page-enter'));
    return Promise.all(jobs).then(() => { if (epoch === motionEpoch) motionStage('idle'); });
  }

  function revealSections() {
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      let stagger = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting || !entry.target.isConnected) continue;
        const element = entry.target;
        observer.unobserve(element);
        if (revealed.has(element)) continue;
        revealed.add(element);
        // A shutter reveals the text itself, without splitting words or hiding
        // content while waiting for JavaScript. No blur or scroll event loop.
        if (element.matches(':focus-within') || entry.boundingClientRect.bottom <= 0) continue;
        play(element, [
          {opacity: .3, clipPath: 'inset(0 0 100% 0)', transform: 'translateY(18px)'},
          {opacity: 1, clipPath: 'inset(0)', transform: 'none'}
        ], {duration: 460, delay: Math.min(stagger++ * 35, 105)}, 'dc-text-reveal');
      }
    }, {threshold: .12, rootMargin: '0px 0px -20px 0px'});
    const main = document.querySelector('#main');
    const intro = main.querySelector('.hero-intro') || main.querySelector('h1')?.nextElementSibling;
    main.querySelectorAll('h2, h3, p, figcaption, .check-list li').forEach(element => {
      if (revealed.has(element) || element === intro || element.closest('.hero, form, .form-status, .map-embed, .google-reviews')) return;
      element.classList.add('dc-reveal-text');
      observer.observe(element);
    });
  }
  // navigation.js owns the drawer, including its focus and scroll restoration.
  function closeMenu() { return window.dcCloseMenu?.({restoreFocus:false}); }
  document.addEventListener('focusin', event => {
    const target = event.target.closest('.dc-reveal-text');
    if (!target) return;
    // Keyboard users must never land on text that is temporarily clipped.
    animations.forEach(animation => { if (animation.effect?.target === target) animation.cancel(); });
  });
  const dialog = document.querySelector('.lightbox');
  let opener;
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('lightbox-open'); if (opener?.isConnected) opener.focus(); });
  function init(initial = false) {
    observer?.disconnect();
    document.querySelectorAll('.mini-gallery a, .gallery-grid a').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); opener = a; dialog.querySelector('img').src = a.href;
      const alt = a.querySelector('img').alt; dialog.querySelector('img').alt = alt; dialog.querySelector('p').textContent = alt;
      document.body.classList.add('lightbox-open'); dialog.showModal();
    }));
    revealSections();
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
    window.dispatchEvent(new CustomEvent('dc:navigation'));
    return enter(document.querySelector('#main'), initial);
  }
  // Progressive enhancement: real server-rendered WordPress URLs remain crawlable.
  let controller;
  let generation = 0;
  const announcer = document.createElement('div'); announcer.className = 'screen-reader-text'; announcer.setAttribute('aria-live', 'polite'); document.body.append(announcer);
  history.replaceState({dc:true}, '', location.href);
  async function navigate(url, push = true) {
    controller?.abort(); controller = new AbortController(); const current = ++generation;
    observer?.disconnect(); stopMotion();
    document.documentElement.classList.add('is-navigating'); document.querySelector('main').setAttribute('aria-busy', 'true');
    const menuClosed = closeMenu();
    try {
      const response = await fetch(url, {headers:{'X-Requested-With':'DCNavigation'},credentials:'same-origin',signal:controller.signal});
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Navigation unavailable');
      const next = new DOMParser().parseFromString(await response.text(), 'text/html');
      const incoming = next.querySelector('#main');
      if (!incoming || !next.querySelector('.site-header') || !next.querySelector('script[src*="dc-serwis/assets/site.js"]')) throw new Error('Other layout');
      if (current !== generation) return;
      if (next.querySelector('.google-reviews')) { location.assign(url); return; }
      await menuClosed;
      if (current !== generation) return;
      if (!reduced.matches) {
        motionStage('leaving');
        play(wipe, [{opacity: 0, clipPath: 'inset(0 0 0 100%)'}, {opacity: 1, clipPath: 'inset(0)', offset: .4}, {opacity: 0, clipPath: 'inset(0 100% 0 0)'}], {duration: 580, easing: 'cubic-bezier(.4,0,.2,1)'}, 'dc-navigation-wipe');
        await play(document.querySelector('#main'), [{opacity: 1, transform: 'none'}, {opacity: .18, transform: 'translateY(-14px)'}], {duration: 190, easing: 'ease-in'}, 'dc-page-leave');
      }
      if (current !== generation) return;
      {
        document.querySelector('#main').replaceWith(incoming);
        document.title = next.title; document.body.className = next.body.className;
        const selector = 'meta[name="description"],meta[name^="twitter:"],meta[property^="og:"],link[rel="canonical"],script[type="application/ld+json"],meta[name="robots"]';
        document.head.querySelectorAll(selector).forEach(el => el.remove()); next.head.querySelectorAll(selector).forEach(el => document.head.append(el.cloneNode(true)));
        document.querySelector('#primary-nav').innerHTML = next.querySelector('#primary-nav').innerHTML;
        if (push) history.pushState({dc:true}, '', response.url);
        window.scrollTo({top: 0, left: 0, behavior: 'instant'}); incoming.focus({preventScroll:true}); announcer.textContent = document.title;
        const entrance = init();
        if (new URL(url).hash) document.getElementById(decodeURIComponent(new URL(url).hash.slice(1)))?.scrollIntoView();
        await entrance;
      }
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
  addEventListener('pageshow', event => {
    if (event.persisted) { stopMotion(); document.querySelector('main').removeAttribute('aria-busy'); }
    document.documentElement.classList.remove('is-navigating');
  });
  reduced.addEventListener('change', () => { observer?.disconnect(); stopMotion(); if (!reduced.matches) revealSections(); });
  init(true);
})();
