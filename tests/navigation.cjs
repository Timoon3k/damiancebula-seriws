const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8081').replace(/\/$/, '');
const routes = ['/serwis-klimatyzacji-stalowa-wola/', '/serwis-agd-stalowa-wola/', '/realizacje/', '/o-firmie/', '/kontakt/'];

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox']});
  const errors = [];
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  await context.route('**/*', route => route.request().url().startsWith(root) ? route.continue() : route.abort());
  const current = (page, path) => page.waitForFunction(path => {
    const link = [...document.querySelectorAll('#primary-nav a')].find(a => new URL(a.href).pathname === path);
    return link?.getAttribute('aria-current') === 'page' && !document.documentElement.classList.contains('is-navigating');
  }, path);
  async function visit(page, path, mobile = false) {
    if (mobile) await page.getByRole('button', {name: /Menu/}).click();
    await page.locator(`#primary-nav a[href="${root}${path}"]`).click();
    await page.waitForURL(root + path);
    await current(page, path);
    assert.equal(await page.evaluate(() => window.dcNavigationTest), true, 'AJAX preserves the document');
    assert.equal(await page.locator('#primary-nav [aria-current="location"]').count(), 0);
    assert.equal(await page.locator('#primary-nav [aria-current="page"]').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dc-scrollspy')), false);
    assert.equal(await page.locator('main').evaluate(element => document.activeElement === element), true, 'New main receives keyboard focus');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  }
  fs.mkdirSync('artifacts/screenshots', {recursive: true});
  for (const mobile of [false, true]) {
    const page = await context.newPage();
    if (mobile) await page.setViewportSize({width: 390, height: 844});
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(root, {waitUntil: 'networkidle'});
    await page.waitForSelector('.site-header-shell');
    await page.evaluate(() => { window.dcNavigationTest = true; });
    const mainTop = await page.locator('main').evaluate(element => element.getBoundingClientRect().top + scrollY);
    await page.evaluate(() => scrollTo({top: 650, behavior: 'instant'}));
    await page.waitForFunction(() => document.querySelector('.site-header').classList.contains('is-sticky'));
    assert.equal(await page.locator('.site-header').evaluate(element => getComputedStyle(element).position), 'fixed');
    assert.equal(await page.locator('.site-header').evaluate(element => getComputedStyle(element).animationName), 'none');
    assert.ok(Math.abs(mainTop - await page.locator('main').evaluate(element => element.getBoundingClientRect().top + scrollY)) < 1, 'Sticky header reserves its layout height');
    assert.equal(await page.locator('#primary-nav a[aria-current="page"]').getAttribute('href'), root + '/', 'Scrolling does not alter current page');
    assert.equal(await page.locator('.site-header').count(), 1);
    assert.equal(await page.locator('#primary-nav').count(), 1);
    await page.screenshot({path: `artifacts/screenshots/sticky-menu-${mobile ? 390 : 1440}.png`});
    await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
    await page.waitForFunction(() => !document.querySelector('.site-header').classList.contains('is-sticky'));
    // Every home menu item must open its real page; Back uses the AJAX router.
    for (const path of routes) {
      await visit(page, path, mobile);
      await page.goBack();
      await page.waitForURL(root + '/');
      await current(page, '/');
      assert.equal(await page.locator('main .home-hero').count(), 1);
      assert.equal(await page.evaluate(() => window.dcNavigationTest), true);
    }
    // Menu links also work while moving directly between subpages.
    for (const path of [...routes, '/']) await visit(page, path, mobile);
    if (mobile) {
      await page.getByRole('button', {name: /Menu/}).click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('.menu-toggle').evaluate(element => document.activeElement === element), true);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.close();
  }
  const nojs = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
  await nojs.route('**/*', route => route.request().url().startsWith(root) ? route.continue() : route.abort());
  const fallback = await nojs.newPage();
  await fallback.goto(root, {waitUntil: 'networkidle'});
  assert.equal(await fallback.locator('#primary-nav').isVisible(), true);
  assert.equal(await fallback.locator('.site-header-shell').count(), 0);
  assert.equal(await fallback.locator('h1').evaluate(element => getComputedStyle(element).opacity), '1', 'Content stays visible without JavaScript');
  await fallback.locator(`#primary-nav a[href="${root}${routes[0]}"]`).click();
  await fallback.waitForURL(root + routes[0]);
  assert.equal(await fallback.locator('h1').count(), 1);
  assert.deepEqual(errors, [], 'No navigation JavaScript errors');
  fs.mkdirSync('artifacts/test-results', {recursive: true});
  fs.writeFileSync('artifacts/test-results/navigation.json', JSON.stringify({sticky: true, reservedHeaderSpace: true, scrollspyDisabled: true, desktopPages: routes, mobilePages: routes, ajaxHistory: true, nativeUrls: true, mobileKeyboard: true, reducedMotion: true, noJs: true, errors}, null, 2));
  await browser.close();
  console.log('PASS: sticky header, desktop/mobile page links, AJAX history, no scrollspy, keyboard, reduced motion and no-JS URLs');
})().catch(error => { console.error(error); process.exit(1); });
