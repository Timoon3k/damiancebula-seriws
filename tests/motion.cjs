const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8081').replace(/\/$/, '');
const paths = ['/serwis-klimatyzacji-stalowa-wola/', '/serwis-agd-stalowa-wola/', '/realizacje/', '/o-firmie/', '/kontakt/', '/'];

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox']});
  const errors = [];
  const report = [];
  fs.mkdirSync('artifacts/screenshots', {recursive: true});
  for (const mobile of [false, true]) {
    const context = await browser.newContext({viewport: mobile ? {width: 390, height: 844} : {width: 1440, height: 900}, reducedMotion: 'no-preference'});
    await context.route('**/*', route => route.request().url().startsWith(root) ? route.continue() : route.abort());
    await context.addInitScript(() => {
      // Safari and older browsers do not need the View Transitions API.
      Object.defineProperty(document, 'startViewTransition', {value: undefined, configurable: true});
      window.dcMotionTest = true;
      window.dcMotionSamples = [];
      window.dcMotionEvents = [];
      addEventListener('dc:motion', event => window.dcMotionEvents.push({stage: event.detail.stage, time: performance.now()}));
      function sample() {
        document.getAnimations().filter(animation => animation.id.startsWith('dc-')).forEach(animation => {
          const target = animation.effect.target;
          const style = getComputedStyle(target);
          window.dcMotionSamples.push({id: animation.id, path: location.pathname, opacity: Number(style.opacity), transform: style.transform, playState: animation.playState, duration: animation.effect.getTiming().duration, stage: document.documentElement.dataset.dcMotion, tag: target.tagName});
        });
        requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(root, {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => window.dcMotionSamples.some(sample => sample.id === 'dc-title-enter' && sample.opacity > 0 && sample.opacity < .95 && sample.transform !== 'none'));
    await page.waitForFunction(() => document.documentElement.dataset.dcMotion === 'idle');
    assert.equal(await page.evaluate(() => document.startViewTransition), undefined);
    assert.equal(await page.locator('h1').evaluate(element => getComputedStyle(element).opacity), '1');
    assert.equal(await page.locator('h1').evaluate(element => getComputedStyle(element).transform), 'none');
    for (const path of paths) {
      await page.evaluate(() => { window.dcMotionSamples = []; window.dcMotionEvents = []; });
      if (mobile) await page.getByRole('button', {name: /Menu/}).click();
      await page.locator(`#primary-nav a[href="${root}${path}"]`).click();
      await page.waitForURL(root + path);
      if (path === paths[0]) await page.screenshot({path: `artifacts/screenshots/motion-active-${mobile ? 390 : 1440}.png`, animations: 'allow'});
      await page.waitForFunction(() => document.documentElement.dataset.dcMotion === 'idle' && !document.documentElement.classList.contains('is-navigating'));
      const samples = await page.evaluate(() => window.dcMotionSamples);
      const visibleMotion = id => samples.some(sample => sample.id === id && sample.playState === 'running' && sample.opacity > 0 && sample.opacity < .98 && sample.transform !== 'none');
      assert.ok(visibleMotion('dc-page-leave'), `Visible page exit on ${mobile ? 'mobile' : 'desktop'}: ${path}`);
      assert.ok(visibleMotion('dc-page-enter'), `Visible page entry: ${path}`);
      assert.ok(visibleMotion('dc-title-enter'), `Visible title entry: ${path}`);
      assert.ok(visibleMotion('dc-navigation-wipe'), `Visible geometric orange wipe: ${path}`);
      assert.ok(samples.every(sample => sample.duration <= 530), 'Every animation has a bounded duration');
      assert.ok(Math.max(...samples.filter(sample => sample.id === 'dc-page-leave').map(sample => sample.duration)) + 330 <= 650, 'Combined exit and staggered entrance stay below 650 ms');
      assert.equal(await page.evaluate(() => window.dcMotionTest), true, 'Real AJAX navigation preserves the window');
      assert.equal(await page.locator('main').evaluate(element => getComputedStyle(element).opacity), '1');
      assert.equal(await page.locator('main').evaluate(element => getComputedStyle(element).transform), 'none');
      assert.equal(await page.locator('#main[aria-busy]').count(), 0);
      report.push({mobile, path, realContentAnimation: true, geometricWipe: true, viewTransitionsAvailable: false});
    }
    // Scroll reveal uses running content animations, without hidden waiting nodes.
    await page.evaluate(() => { window.dcMotionSamples = []; document.querySelector('.local-projects').scrollIntoView({behavior: 'instant', block: 'center'}); });
    await page.waitForFunction(() => window.dcMotionSamples.some(sample => sample.id === 'dc-section-reveal' && sample.opacity > 0 && sample.opacity < .98 && sample.transform !== 'none'));
    await page.waitForFunction(() => !document.getAnimations().some(animation => animation.id.startsWith('dc-')));
    // Two fast destinations must leave neither an old page nor a stuck overlay.
    await page.evaluate(({root, paths}) => {
      document.querySelector(`#primary-nav a[href="${root}${paths[0]}"]`).click();
      document.querySelector(`#primary-nav a[href="${root}${paths[1]}"]`).click();
    }, {root, paths});
    await page.waitForURL(root + paths[1]);
    await page.waitForFunction(() => document.documentElement.dataset.dcMotion === 'idle' && !document.documentElement.classList.contains('is-navigating') && !document.getAnimations().some(animation => animation.id.startsWith('dc-')));
    assert.equal(await page.locator('.dc-motion-wipe').evaluate(element => getComputedStyle(element).opacity), '0');
    assert.equal(await page.locator('#main[aria-busy]').count(), 0);
    assert.equal(await page.evaluate(() => window.dcMotionTest), true);
    await page.goBack();
    await page.waitForURL(root + '/');
    await page.waitForFunction(() => document.documentElement.dataset.dcMotion === 'idle' && !document.documentElement.classList.contains('is-navigating'));
    await page.screenshot({path: `artifacts/screenshots/motion-settled-${mobile ? 390 : 1440}.png`});
    await context.close();
  }
  const reduced = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
  await reduced.route('**/*', route => route.request().url().startsWith(root) ? route.continue() : route.abort());
  const page = await reduced.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(root, {waitUntil: 'networkidle'});
  assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.id.startsWith('dc-')).length), 0);
  await page.getByRole('button', {name: /Menu/}).click();
  await page.locator(`#primary-nav a[href="${root}${paths[0]}"]`).click();
  await page.waitForURL(root + paths[0]);
  await page.waitForFunction(() => !document.documentElement.classList.contains('is-navigating'));
  assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.id.startsWith('dc-')).length), 0);
  assert.equal(await page.locator('h1').evaluate(element => getComputedStyle(element).opacity), '1');
  assert.equal(await page.locator('.dc-motion-wipe').evaluate(element => getComputedStyle(element).display), 'none');
  assert.deepEqual(errors, [], 'No animation JavaScript errors');
  fs.mkdirSync('artifacts/test-results', {recursive: true});
  fs.writeFileSync('artifacts/test-results/motion.json', JSON.stringify({routes: report, initialHero: true, scrollReveal: true, rapidNavigation: true, history: true, reducedMotion: true, errors}, null, 2));
  await browser.close();
  console.log('PASS: actual initial/page/scroll animations on desktop/mobile, no View Transitions API, rapid AJAX, history and reduced motion');
})().catch(error => { console.error(error); process.exit(1); });
