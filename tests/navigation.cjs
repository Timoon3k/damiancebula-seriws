const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const mockMap = require('./mock-map.cjs');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8081').replace(/\/$/, '');
const routes = ['/serwis-klimatyzacji-stalowa-wola/', '/serwis-agd-stalowa-wola/', '/realizacje/', '/o-firmie/', '/kontakt/'];

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox']});
  const errors = [];
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  await mockMap(context);
  const current = (page, path) => page.waitForFunction(path => {
    const link = [...document.querySelectorAll('#primary-nav a')].find(a => new URL(a.href).pathname === path);
    return link?.getAttribute('aria-current') === 'page' && !document.documentElement.classList.contains('is-navigating');
  }, path);
  async function visit(page, path, mobile = false) {
    if (mobile) {
      await page.getByRole('button', {name: /^Menu/}).click();
      assert.equal(await page.locator('#dc-mobile-menu').evaluate(el => el.matches(':modal')),true);
    }
    await page.locator(`#primary-nav a[href="${root}${path}"]`).click();
    await page.waitForURL(root + path);
    await current(page, path);
    assert.equal(await page.evaluate(() => window.dcNavigationTest), true, 'AJAX preserves the document');
    assert.equal(await page.locator('#primary-nav [aria-current="location"]').count(), 0);
    assert.equal(await page.locator('#primary-nav [aria-current="page"]').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dc-scrollspy')), false);
    assert.equal(await page.locator('main').evaluate(element => document.activeElement === element), true, 'New main receives keyboard focus');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('#dc-mobile-menu').evaluate(el => el.open), false);
    assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).position), 'static');
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
  // A real top-layer modal locks iOS-style scrolling and keeps keyboard focus inside.
  const drawerReports = [];
  for (const width of [360,390,768]) {
    const p = await context.newPage();
    await p.setViewportSize({width,height:844});
    p.on('pageerror',error => errors.push(error.message));
    await p.goto(root,{waitUntil:'networkidle'});
    await p.evaluate(() => scrollTo({top:650,behavior:'instant'}));
    await p.waitForFunction(() => document.querySelector('.site-header').classList.contains('is-sticky'));
    const savedY = await p.evaluate(() => scrollY);
    await p.getByRole('button',{name:/^Menu/}).click();
    const drawer = p.locator('#dc-mobile-menu');
    assert.equal(await drawer.evaluate(el => el.matches(':modal')),true);
    assert.equal(await p.locator('#primary-nav').count(),1,'The same navigation is moved, never cloned');
    assert.equal(await drawer.locator('#primary-nav').count(),1);
    assert.equal(await p.locator('body').evaluate(el => getComputedStyle(el).position),'fixed');
    const rect = await drawer.boundingBox();
    assert(Math.abs(rect.x + rect.width - width) <= 1,'Panel is anchored to the right edge');
    assert(rect.x >= 20,'A visible backdrop remains beside the panel');
    const close = drawer.getByRole('button',{name:'Zamknij menu'});
    assert.equal(await close.evaluate(el => el === document.activeElement),true);
    await p.keyboard.press('Shift+Tab');
    assert.equal(await drawer.locator('.mobile-menu-contact a').evaluate(el => el === document.activeElement),true,'Shift+Tab wraps inside the modal');
    await p.keyboard.press('Tab');
    assert.equal(await close.evaluate(el => el === document.activeElement),true,'Tab wraps back to close');
    await p.locator('main').focus();
    assert.equal(await drawer.evaluate(el => el.contains(document.activeElement)),true,'Background is inert while modal is open');
    const topBeforeWheel = await p.locator('body').evaluate(el => el.style.top);
    await p.mouse.wheel(0,500);
    assert.equal(await p.locator('body').evaluate(el => el.style.top),topBeforeWheel,'Background scroll remains frozen');
    await p.screenshot({path:`artifacts/screenshots/mobile-drawer-${width}.png`});
    await p.mouse.click(8,420);
    assert.equal(await drawer.evaluate(el => el.open),false,'Backdrop closes the modal');
    assert.equal(await p.evaluate(() => scrollY),savedY,'Closing restores the original scroll offset');
    assert.equal(await p.locator('.menu-toggle').evaluate(el => el === document.activeElement),true);
    await p.getByRole('button',{name:/^Menu/}).click();
    await close.click();
    assert.equal(await drawer.evaluate(el => el.open),false,'Close control works');
    await p.getByRole('button',{name:/^Menu/}).click();
    await p.setViewportSize({width:1440,height:900});
    assert.equal(await drawer.evaluate(el => el.open),false,'Desktop resize closes the modal');
    assert.equal(await p.locator('.site-header #primary-nav').count(),1,'Desktop gets the original navigation back');
    assert.equal(await p.locator('.site-header #primary-nav').isVisible(),true);
    assert.equal(await p.locator('body').evaluate(el => getComputedStyle(el).position),'static');
    drawerReports.push({width,rightAligned:true,singleNav:true,nativeModal:true,focusTrap:true,inertBackground:true,scrollRestore:true,backdrop:true,closeControl:true,desktopResize:true});
    await p.close();
  }
  // Test a moving panel with actual touch emulation, rather than only a narrow viewport.
  const touch = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
  await mockMap(touch);
  const touchPage = await touch.newPage();
  touchPage.on('pageerror',error => errors.push(error.message));
  await touchPage.goto(root,{waitUntil:'networkidle'});
  await touchPage.getByRole('button',{name:/^Menu/}).tap();
  await touchPage.waitForFunction(() => document.getAnimations().some(a => a.id === 'dc-menu-enter' && a.playState === 'running' && new DOMMatrixReadOnly(getComputedStyle(a.effect.target).transform).m41 > 0));
  await touchPage.waitForFunction(() => !document.getAnimations().some(a => a.id === 'dc-menu-enter' && a.playState === 'running'));
  await touchPage.keyboard.press('Escape');
  await touchPage.locator('#dc-mobile-menu').waitFor({state:'hidden'});
  assert.equal(await touchPage.locator('.menu-toggle').evaluate(el => el === document.activeElement),true,'Animated ESC returns focus');
  await touchPage.getByRole('button',{name:/^Menu/}).tap();
  await touchPage.locator(`#primary-nav a[href="${root}${routes[0]}"]`).tap();
  await touchPage.waitForURL(root + routes[0]);
  await touchPage.waitForFunction(() => !document.documentElement.classList.contains('is-navigating'));
  assert.equal(await touchPage.locator('#dc-mobile-menu').evaluate(el => el.open),false);
  assert.equal(await touchPage.locator('main').evaluate(el => el === document.activeElement),true,'Closing animation never steals new-page focus');
  await touch.close();

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
  fs.writeFileSync('artifacts/test-results/navigation.json', JSON.stringify({sticky: true, reservedHeaderSpace: true, scrollspyDisabled: true, desktopPages: routes, mobilePages: routes, ajaxHistory: true, nativeUrls: true, mobileKeyboard: true, reducedMotion: true, noJs: true, drawer:drawerReports, touchSlideAnimation:true, errors}, null, 2));
  await browser.close();
  console.log('PASS: right-side modal drawer, focus/inert background, scroll restore, touch animation, desktop resize, sticky, AJAX/history and no-JS URLs');
})().catch(error => { console.error(error); process.exit(1); });
