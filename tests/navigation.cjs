const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8081').replace(/\/$/, '');
const climate = '/serwis-klimatyzacji-stalowa-wola/';
const agd = '/serwis-agd-stalowa-wola/';

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox']});
  const errors = [];
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  await context.route('**/*', route => route.request().url().startsWith(root) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(root, {waitUntil: 'networkidle'});
  await page.waitForSelector('.site-header-shell');
  await page.evaluate(() => { window.dcNavigationTest = true; });
  const menuLink = path => page.locator(`#primary-nav a[href="${root}${path}"]`);
  const waitCurrent = (targetPage, path, current = 'location') => targetPage.waitForFunction(({path, current}) => {
    const link = [...document.querySelectorAll('#primary-nav a')].find(a => new URL(a.href).pathname === path);
    return link?.getAttribute('aria-current') === current;
  }, {path, current});
  const homeMainTop = await page.locator('main').evaluate(element => element.getBoundingClientRect().top + scrollY);
  assert.equal(await menuLink(climate).getAttribute('href'), root + climate, 'Service URL remains crawlable');

  await menuLink(climate).click();
  await page.waitForFunction(() => document.querySelector('.site-header').classList.contains('is-sticky'));
  await waitCurrent(page, climate);
  assert.equal(await page.url(), root + '/', 'Home menu scroll keeps the real page URL');
  assert.equal(await menuLink(climate).getAttribute('aria-current'), 'location');
  assert.equal(await page.locator('.site-header').evaluate(element => getComputedStyle(element).position), 'fixed');
  assert.equal(await page.locator('.site-header').evaluate(element => getComputedStyle(element).animationName), 'none', 'Reduced motion disables sticky animation');
  const stickyMainTop = await page.locator('main').evaluate(element => element.getBoundingClientRect().top + scrollY);
  assert.ok(Math.abs(homeMainTop - stickyMainTop) < 1, 'Sticky header reserves its original layout height');
  await menuLink(agd).click();
  await waitCurrent(page, agd);
  assert.equal(await menuLink(agd).getAttribute('aria-current'), 'location', 'A selected card wins a shared desktop row');
  await menuLink('/o-firmie/').click();
  await waitCurrent(page, '/o-firmie/');
  assert.equal(await menuLink('/o-firmie/').getAttribute('aria-current'), 'location', 'Clamped lower section keeps its selected link');
  await page.keyboard.press('End');
  await page.waitForFunction(() => document.querySelector('#primary-nav a[aria-current="location"]')?.textContent.trim() === 'Kontakt');
  assert.equal(await page.locator('#primary-nav').count(), 1);
  assert.equal(await page.locator('.site-header').count(), 1, 'No duplicate header or interactive IDs');
  assert.equal(await page.locator('#primary-nav [aria-current]').count(), 1, 'One current item is announced');
  fs.mkdirSync('artifacts/screenshots', {recursive: true});
  await page.screenshot({path: 'artifacts/screenshots/sticky-menu-1440.png'});

  await menuLink('/').click();
  await page.waitForFunction(() => scrollY === 0 && !document.querySelector('.site-header').classList.contains('is-sticky'));
  await page.locator('.services .card-link').first().click();
  await page.waitForURL(root + climate);
  await page.waitForFunction(() => !document.documentElement.classList.contains('dc-scrollspy'));
  assert.equal(await page.evaluate(() => window.dcNavigationTest), true, 'AJAX preserves the document');
  assert.equal(await menuLink(climate).getAttribute('aria-current'), 'page', 'Subpage uses page current semantics');
  assert.equal(await page.locator('#primary-nav [aria-current="location"]').count(), 0);
  await page.goBack();
  await page.waitForURL(root + '/');
  await page.waitForFunction(() => document.documentElement.classList.contains('dc-scrollspy') && Boolean(document.querySelector('main .home-hero')));
  await menuLink(agd).click();
  await waitCurrent(page, agd);
  assert.equal(await menuLink(agd).getAttribute('aria-current'), 'location', 'Scrollspy rebinds after AJAX history');

  const mobile = await context.newPage();
  await mobile.setViewportSize({width: 390, height: 844});
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto(root, {waitUntil: 'networkidle'});
  const mobileRoutes = [climate, agd, '/o-firmie/', '/realizacje/', '/kontakt/'];
  for (const path of mobileRoutes) {
    await mobile.getByRole('button', {name: /Menu/}).click();
    await mobile.locator(`#primary-nav a[href="${root}${path}"]`).click();
    await waitCurrent(mobile, path);
    assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(await mobile.locator(`#primary-nav a[href="${root}${path}"]`).getAttribute('aria-current'), 'location', `Mobile section ${path}`);
  }
  await mobile.getByRole('button', {name: /Menu/}).click();
  assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await mobile.keyboard.press('Escape');
  assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(await mobile.locator('.menu-toggle').evaluate(element => document.activeElement === element), true);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await mobile.screenshot({path: 'artifacts/screenshots/sticky-menu-390.png'});

  // Automatic scrollspy follows vertically separated mobile sections, without clicks.
  for (const [selector, path] of [['.services .service-card:first-child', climate], ['.services .service-card:last-child', agd], ['#o-mnie', '/o-firmie/'], ['#moje-prace', '/realizacje/']]) {
    await mobile.evaluate(selector => {
      dispatchEvent(new Event('wheel'));
      const header = document.querySelector('.site-header');
      const top = document.querySelector(selector).getBoundingClientRect().top + scrollY - header.getBoundingClientRect().height - 20;
      scrollTo({top, behavior: 'instant'});
    }, selector);
    await mobile.waitForFunction(path => {
      const link = [...document.querySelectorAll('#primary-nav a')].find(a => new URL(a.href).pathname === path);
      return link?.getAttribute('aria-current') === 'location';
    }, path);
  }

  const nojs = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
  await nojs.route('**/*', route => route.request().url().startsWith(root) ? route.continue() : route.abort());
  const fallback = await nojs.newPage();
  await fallback.goto(root, {waitUntil: 'networkidle'});
  assert.equal(await fallback.locator('#primary-nav').isVisible(), true);
  assert.equal(await fallback.locator('.site-header-shell').count(), 0);
  await fallback.locator(`#primary-nav a[href="${root}${climate}"]`).click();
  await fallback.waitForURL(root + climate);
  assert.equal(await fallback.locator('h1').count(), 1, 'No-JS menu follows the service page');
  assert.deepEqual(errors, [], 'No navigation JavaScript errors');
  fs.mkdirSync('artifacts/test-results', {recursive: true});
  fs.writeFileSync('artifacts/test-results/navigation.json', JSON.stringify({sticky: true, reservedHeaderSpace: true, desktopScrollspy: true, mobileScrollspy: true, ajaxHistory: true, nativeUrls: true, mobileKeyboard: true, reducedMotion: true, noJs: true, errors}, null, 2));
  await browser.close();
  console.log('PASS: sticky header, reserved layout space, desktop/mobile scrollspy, AJAX history, keyboard, reduced motion and no-JS URLs');
})().catch(error => { console.error(error); process.exit(1); });
