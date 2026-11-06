(() => {
  'use strict';
  document.documentElement.classList.replace('no-js', 'js');
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const revealed = new WeakSet();
  const animations = new Map();
  let observer;

  function motionStage(stage) {
    root.dataset.dcMotion = stage;
    window.dispatchEvent(new CustomEvent('dc:motion', {detail:{stage}}));
  }

  function show(element) {
    animations.get(element)?.cancel();
    animations.delete(element);
    observer?.unobserve(element);
    element.classList.remove('dc-reveal-pending');
    revealed.add(element);
  }

  function stopMotion() {
    observer?.disconnect();
    for (const [element, animation] of animations) {
      animation.cancel();
      element.classList.remove('dc-reveal-pending');
      revealed.add(element);
    }
    animations.clear();
    document.querySelectorAll('.dc-reveal-pending').forEach(show);
  }

  function reveal(element, delay) {
    observer.unobserve(element);
    if (revealed.has(element)) return;
    revealed.add(element);
    if (reduced.matches || !element.animate || element.matches(':focus-within')) {
      element.classList.remove('dc-reveal-pending');
      return;
    }
    // Prepare the animation before removing the pending style: there is no frame
    // in which visible content is painted and subsequently hidden again.
    const animation = element.animate([
      {opacity:0, transform:'translateY(16px)'},
      {opacity:1, transform:'translateY(0)'}
    ], {duration:620, delay, easing:'cubic-bezier(.22,1,.36,1)', fill:'both'});
    animation.id = 'dc-group-reveal';
    animations.set(element, animation);
    element.classList.remove('dc-reveal-pending');
    animation.finished.catch(() => {}).finally(() => {
      if (animations.get(element) === animation) animations.delete(element);
      animation.cancel();
    });
  }

  function revealGroups(main) {
    if (reduced.matches || typeof IntersectionObserver !== 'function' || !Element.prototype.animate) return;
    const related = '.services, .process, .local-projects, .service-strip, .split-section, .gallery-grid, .mini-gallery, [data-reveal-stagger]';
    observer = new IntersectionObserver(entries => {
      const siblings = new Map();
      for (const entry of entries) {
        if (!entry.isIntersecting || !entry.target.isConnected) continue;
        const parent = entry.target.parentElement;
        const index = parent?.matches(related) ? (siblings.get(parent) || 0) : 0;
        if (parent?.matches(related)) siblings.set(parent, index + 1);
        reveal(entry.target, Math.min(index * 60, 90));
      }
    }, {threshold:0, rootMargin:'0px'});
    const selector = '.services > .service-card, .process > div, .local-projects > div, .service-strip > div, .split-section > *, .gallery-grid > figure, .mini-gallery > figure, main > .text-section, main > .faq, [data-reveal]';
    const candidates = [...main.querySelectorAll(selector)].filter(element => !element.matches('.hero') && !element.closest('.hero') && !element.querySelector('h1'));
    const groups = new Set(candidates);
    for (const element of candidates) {
      let nested = false;
      for (let parent = element.parentElement; parent && parent !== main; parent = parent.parentElement) {
        if (groups.has(parent)) { nested = true; break; }
      }
      if (nested || revealed.has(element)) continue;
      const box = element.getBoundingClientRect();
      element.classList.add('dc-reveal-group');
      // Initial and incoming hero/above-fold content is never hidden. Only groups
      // fully outside the viewport are prepared before their first intersection.
      if (box.bottom <= 0 || (box.top < innerHeight && box.right > 0 && box.left < innerWidth) || element.matches(':focus-within')) {
        revealed.add(element);
        continue;
      }
      element.classList.add('dc-reveal-pending');
      observer.observe(element);
    }
  }

  // navigation.js owns the modal and restores the scroll position before replacement.
  function closeMenu() { return window.dcCloseMenu?.({restoreFocus:false}); }
  document.addEventListener('focusin', event => {
    const group = event.target.closest('.dc-reveal-group');
    if (group) show(group);
  });

  const dialog = document.querySelector('.lightbox');
  let opener;
  if (dialog) {
    dialog.querySelector('button')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('lightbox-open');
      if (opener?.isConnected) opener.focus();
    });
  }

  function init() {
    observer?.disconnect();
    const main = document.querySelector('#main');
    main.querySelectorAll('.mini-gallery a, .gallery-grid a').forEach(anchor => anchor.addEventListener('click', event => {
      if (!dialog || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      opener = anchor;
      const alt = anchor.querySelector('img').alt;
      dialog.querySelector('img').src = anchor.href;
      dialog.querySelector('img').alt = alt;
      dialog.querySelector('p').textContent = alt;
      document.body.classList.add('lightbox-open');
      dialog.showModal();
    }));
    revealGroups(main);
    main.querySelectorAll('[data-ajax-contact]').forEach(form => form.addEventListener('submit', async event => {
      if (!form.reportValidity()) return;
      event.preventDefault();
      const button = form.querySelector('[type=submit]');
      const status = form.querySelector('.form-status');
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      status.textContent = 'Wysyłanie wiadomości…';
      const data = new FormData(form);
      data.set('dc_ajax', '1');
      try {
        const response = await fetch(form.getAttribute('action'), {method:'POST', body:data, credentials:'same-origin', signal:AbortSignal.timeout(20000)});
        const result = await response.json();
        status.textContent = result.message;
        status.classList.toggle('error', !result.success);
        if (result.success) form.reset();
      } catch {
        status.textContent = 'Nie udało się potwierdzić wysyłki. Sprawdź połączenie lub zadzwoń: 794 225 139.';
        status.classList.add('error');
      } finally {
        button.disabled = false;
        form.removeAttribute('aria-busy');
        status.focus();
      }
    }));
    window.dispatchEvent(new CustomEvent('dc:navigation'));
    motionStage('idle');
  }

  // Warm only the incoming hero image while the current page stays fully visible.
  // A bounded wait and an abort listener keep rapid navigation and failures safe.
  function readyHero(main, signal) {
    const source = main.querySelector('.hero-media img');
    if (!source?.getAttribute('src') || signal.aborted) return Promise.resolve();
    return new Promise(resolve => {
      const image = new Image();
      let timer;
      const done = () => {
        clearTimeout(timer);
        signal.removeEventListener('abort', done);
        image.onload = null;
        image.onerror = null;
        resolve();
      };
      image.onload = () => image.decode ? image.decode().catch(() => {}).then(done) : done();
      image.onerror = done;
      signal.addEventListener('abort', done, {once:true});
      timer = setTimeout(done, 1200);
      if (source.hasAttribute('sizes')) image.sizes = source.getAttribute('sizes');
      if (source.hasAttribute('srcset')) image.srcset = source.getAttribute('srcset');
      image.src = source.getAttribute('src');
    });
  }

  // Full WordPress URLs and server-rendered content remain the source of truth.
  let controller;
  let generation = 0;
  const announcer = document.createElement('div');
  announcer.className = 'screen-reader-text';
  announcer.setAttribute('aria-live', 'polite');
  document.body.append(announcer);
  history.replaceState({...history.state, dc:true}, '', location.href);
  async function navigate(url, push = true) {
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;
    const current = ++generation;
    stopMotion();
    root.classList.add('is-navigating');
    document.querySelector('main').setAttribute('aria-busy', 'true');
    motionStage('loading');
    const menuClosed = closeMenu();
    try {
      const response = await fetch(url, {headers:{'X-Requested-With':'DCNavigation'}, credentials:'same-origin', signal});
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Navigation unavailable');
      const next = new DOMParser().parseFromString(await response.text(), 'text/html');
      const incoming = next.querySelector('#main');
      if (!incoming || !next.querySelector('.site-header') || !next.querySelector('script[src*="dc-serwis/assets/site.js"]')) throw new Error('Other layout');
      if (current !== generation) return;
      if (next.querySelector('.google-reviews')) { location.assign(url); return; }
      await Promise.all([menuClosed, readyHero(incoming, signal)]);
      if (current !== generation) return;
      if (dialog?.open) dialog.close();
      document.querySelector('#main').replaceWith(incoming);
      document.title = next.title;
      document.body.className = next.body.className;
      const selector = 'meta[name="description"],meta[name^="twitter:"],meta[property^="og:"],link[rel="canonical"],script[type="application/ld+json"],meta[name="robots"]';
      document.head.querySelectorAll(selector).forEach(element => element.remove());
      next.head.querySelectorAll(selector).forEach(element => document.head.append(element.cloneNode(true)));
      document.querySelector('#primary-nav').innerHTML = next.querySelector('#primary-nav').innerHTML;
      if (push) history.pushState({dc:true}, '', response.url);
      scrollTo({top:0, left:0, behavior:'instant'});
      incoming.focus({preventScroll:true});
      announcer.textContent = document.title;
      init();
      const hash = new URL(url).hash;
      if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    } catch (error) {
      if (error.name !== 'AbortError' && current === generation) location.assign(url);
    } finally {
      if (current === generation) {
        root.classList.remove('is-navigating');
        document.querySelector('main').removeAttribute('aria-busy');
        motionStage('idle');
      }
    }
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target || anchor.hasAttribute('download') || anchor.closest('.mini-gallery, .gallery-grid, #wpadminbar') || anchor.hasAttribute('data-no-ajax')) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin || !['http:','https:'].includes(url.protocol) || /\/wp-(admin|login|json)|\.(zip|webp|png|jpg|pdf)$/i.test(url.pathname) || url.search || (url.pathname === location.pathname && url.hash)) return;
    event.preventDefault();
    navigate(url.href);
  });
  addEventListener('popstate', () => navigate(location.href, false));
  addEventListener('pageshow', event => {
    if (event.persisted) {
      stopMotion();
      document.querySelector('main').removeAttribute('aria-busy');
      motionStage('idle');
    }
    root.classList.remove('is-navigating');
  });
  reduced.addEventListener('change', () => {
    stopMotion();
    if (!reduced.matches) revealGroups(document.querySelector('#main'));
  });
  init();
})();
