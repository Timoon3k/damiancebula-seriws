/**
 * Integration evidence for the owner's blue reference layout. These checks use
 * semantic content and relative geometry, rather than freezing CSS values or
 * requiring a screenshot to match the implementation that produced it.
 *
 * Run only on the isolated WordPress fixture. Google is intercepted locally.
 * The fixture has no Trustindex configuration; set EXPECT_TRUSTINDEX=1 only when
 * deliberately testing a real configured widget. Original galleries and SEO
 * snapshots are checked independently by reference-preservation.cjs.
 */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = (process.env.BASE_URL || 'http://127.0.0.1:8081').replace(/\/$/, '');
const origin = new URL(root).origin;
assert(['127.0.0.1', 'localhost'].includes(new URL(root).hostname), 'Use isolated local WordPress, never production.');
const routes = ['/', '/serwis-klimatyzacji-stalowa-wola/', '/serwis-agd-stalowa-wola/', '/realizacje/', '/o-firmie/', '/cennik/', '/porady/', '/kontakt/', '/polityka-prywatnosci/'];
const widths = [1440, 967, 768, 390, 360];
const screenshotDir = path.resolve('artifacts/screenshots/reference-design');
const report = {checkedAt: new Date().toISOString(), externalGoogleContact: false, fixtureReviewsConfigured: process.env.EXPECT_TRUSTINDEX === '1', views: [], navigation: [], failures: [], javascriptErrors: [], failedLocalResources: []};
const verifiedAssets = new Set();

function check(condition, label, details) {
  if (!condition) report.failures.push({label, ...(details === undefined ? {} : {details})});
}

async function isolatedContext(browser, options) {
  const context = await browser.newContext(options);
  const maps = [];
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps')) {
      maps.push(url.href);
      return route.fulfill({status: 200, contentType: 'text/html; charset=utf-8', body: '<!doctype html><html lang="pl"><title>Mapa testowa</title><body>Mapa testowa — bez kontaktu z Google</body></html>'});
    }
    return route.abort('blockedbyclient');
  });
  return {context, maps};
}

function observe(page, label) {
  page.on('pageerror', error => report.javascriptErrors.push({label, message: error.message}));
  page.on('response', response => {
    if (new URL(response.url()).origin === origin && response.status() >= 400) report.failedLocalResources.push({label, url: response.url(), status: response.status()});
  });
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 650) {
      scrollTo({top: y, behavior: 'instant'});
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    await Promise.allSettled([...document.images].filter(image => image.getAttribute('src')).map(image => image.decode()));
    scrollTo({top: 0, behavior: 'instant'});
  });
}

async function branding(page, label) {
  // A gradient can paint the header while every ancestor backgroundColor is
  // transparent. Sample an empty corner of the actually painted logo area.
  const painted = await page.locator('.brand').screenshot({animations: 'disabled'});
  const paintedBackground = await page.evaluate(async base64 => {
    const image = new Image();
    image.src = 'data:image/png;base64,' + base64;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    return `rgb(${red}, ${green}, ${blue})`;
  }, painted.toString('base64'));
  const values = await page.locator('.brand').evaluate((element, background) => {
    const style = node => getComputedStyle(node);
    const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const luminance = color => rgb(color).map(value => {
      const channel = value / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const strong = element.querySelector('strong');
    const small = element.querySelector('small');
    const contrast = node => {
      const a = luminance(style(node).color), b = luminance(background);
      return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    };
    const icon = element.querySelector('img');
    return {name: strong?.textContent, strapline: small?.textContent, background, foreground: strong ? style(strong).color : null, accent: small ? style(small).color : null, contrast: strong && small ? [contrast(strong), contrast(small)] : [], icon: icon?.currentSrc, decoded: !!icon?.complete && icon.naturalWidth > 0, filter: icon ? style(icon).filter : null, accessibleName: element.getAttribute('aria-label')};
  }, paintedBackground);
  check(values.name === 'Damian Cebula' && values.strapline === 'SERWIS', `${label}: reference wordmark is readable`, values);
  check(values.contrast.length === 2 && values.contrast.every(ratio => ratio >= 4.5), `${label}: wordmark has AA contrast on navy`, values);
  check(values.decoded && /\/dc-cog-snowflake\.svg(?:\?|$)/.test(values.icon || '') && values.filter === 'none', `${label}: default mark remains a crisp unfiltered SVG`, values);
  check(/Damian Cebula/.test(values.accessibleName || ''), `${label}: home logo has an accessible company name`, values);
  const channels = color => (color?.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const [red, green, blue] = channels(values.accent);
  check(blue > red + 40 && green > red + 40, `${label}: brand uses a cyan accent`, values.accent);
  const background = channels(values.background);
  check(background.length === 3 && Math.max(...background) < 100 && background[2] > background[0], `${label}: brand sits on a dark navy surface`, values.background);
  return values;
}

async function favicons(page, label) {
  const icons = await page.locator('head link[rel="icon"],head link[rel="apple-touch-icon"]').evaluateAll(elements => elements.map(element => ({href: element.href, rel: element.rel, sizes: element.sizes.value})));
  for (const size of [32, 192, 180]) {
    const icon = icons.find(item => size === 180 ? item.rel === 'apple-touch-icon' : item.rel === 'icon' && item.sizes === `${size}x${size}`);
    check(!!icon, `${label}: native ${size}px icon exists`, icons);
    if (!icon) continue;
    const url = new URL(icon.href);
    check(url.origin === origin && new RegExp(`/dc-favicon-blue-${size}\\.png$`).test(url.pathname), `${label}: favicon belongs to the blue identity`, icon);
    if (verifiedAssets.has(icon.href)) continue;
    const response = await page.request.get(icon.href);
    const bytes = await response.body();
    check(response.status() === 200 && bytes.length > 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.readUInt32BE(16) === size && bytes.readUInt32BE(20) === size, `${label}: ${size}px icon is a valid PNG`, {url: icon.href, status: response.status(), bytes: bytes.length});
    verifiedAssets.add(icon.href);
  }
}

async function homeGeometry(page, width) {
  const geometry = await page.evaluate(() => {
    const rect = element => {
      if (!element) return null;
      const {x, y, width, height, top, right, bottom, left} = element.getBoundingClientRect();
      return {x, y, width, height, top, right, bottom, left, centerX: x + width / 2};
    };
    const hero = document.querySelector('.home-hero');
    const media = hero?.querySelector('.hero-media');
    const why = document.querySelector('.reference-why');
    return {hero: rect(hero), heading: rect(hero?.querySelector('h1')), image: rect(media), imageClip: media ? getComputedStyle(media).clipPath : null, services: rect(document.querySelector('.reference-services')), cards: [...document.querySelectorAll('.reference-services .service-card')].map(rect), why: rect(why), whyHeading: rect(why?.querySelector('h2')), whyImage: rect(why?.querySelector('figure')), pictures: [hero?.querySelector('img')?.src, why?.querySelector('figure img')?.src]};
  });
  const label = `${width}px home`;
  check(geometry.pictures.every(Boolean) && new Set(geometry.pictures).size === 2, `${label}: hero and why use distinct photos`, geometry.pictures);
  check(geometry.cards.length === 2, `${label}: two service panels`, geometry.cards);
  if (width >= 967 && geometry.hero && geometry.image && geometry.heading && geometry.services && geometry.why && geometry.whyImage && geometry.whyHeading && geometry.cards.length === 2) {
    check(geometry.hero.width >= width * .9 && geometry.image.centerX > width * .5 && geometry.heading.centerX < width * .58, `${label}: heading left and large photograph right`, geometry);
    check(geometry.imageClip !== 'none', `${label}: photograph has the reference diagonal boundary`, geometry.imageClip);
    check(Math.abs(geometry.cards[0].top - geometry.cards[1].top) <= 3 && geometry.cards[0].right <= geometry.cards[1].left + 3, `${label}: service panels share one row`, geometry.cards);
    check(geometry.services.top > geometry.hero.top + geometry.hero.height * .5 && Math.abs(geometry.services.top - geometry.hero.bottom) < geometry.hero.height * .3, `${label}: service panels bridge the bottom of the hero`, geometry);
    check(geometry.whyHeading.centerX < geometry.whyImage.centerX && geometry.why.top >= geometry.services.top + geometry.services.height * .8, `${label}: why copy left and photograph right below services`, geometry);
  }
  return geometry;
}

async function contactMap(page, maps, label) {
  const map = page.locator('.map-embed');
  check(await map.locator('iframe').count() === 1, `${label}: Contact has one map iframe`);
  check(await map.locator('button,[data-map-src]').count() === 0, `${label}: map has no activation or consent button`);
  const frame = map.locator('iframe');
  if (await frame.count()) {
    const src = new URL(await frame.getAttribute('src'));
    check(src.hostname === 'www.google.com' && src.pathname.startsWith('/maps') && (src.searchParams.get('output') === 'embed' || src.pathname === '/maps/embed'), `${label}: valid Google embed URL`, src.href);
    check(await frame.getAttribute('loading') === 'eager' && maps.length > 0, `${label}: map is requested immediately without a click`, maps);
    await page.frameLocator('.map-embed iframe').getByText('Mapa testowa — bez kontaktu z Google').waitFor();
  }
  check(await map.getByRole('link', {name: /Otwórz w Google Maps/}).count() === 1, `${label}: external map fallback remains available`);
}

async function mobileModal(page, width) {
  const button = page.getByRole('button', {name: /^Menu/});
  await button.click();
  const modal = page.locator('#dc-mobile-menu');
  await modal.waitFor({state: 'visible'});
  const bounds = await modal.boundingBox();
  check(await modal.evaluate(element => element.matches(':modal')), `${width}px: navigation is a native modal`);
  check(bounds && Math.abs(bounds.x + bounds.width - width) <= 2 && bounds.x >= 8, `${width}px: menu opens against the right edge with a backdrop`, bounds);
  check(await page.locator('#primary-nav').count() === 1 && await modal.locator('#primary-nav').count() === 1, `${width}px: modal contains the sole navigation`);
  check(await page.locator('body').evaluate(element => getComputedStyle(element).position) === 'fixed', `${width}px: background cannot scroll while menu is open`);
  await page.screenshot({path: path.join(screenshotDir, `menu-${width}.png`), animations: 'disabled'});
  await page.keyboard.press('Escape');
  await modal.waitFor({state: 'hidden'});
  check(await button.evaluate(element => element === document.activeElement), `${width}px: Escape returns focus to Menu`);
}

(async () => {
  fs.mkdirSync(screenshotDir, {recursive: true});
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
  try {
    for (const width of widths) {
      const {context, maps} = await isolatedContext(browser, {viewport: {width, height: 1000}, reducedMotion: 'reduce'});
      const page = await context.newPage();
      observe(page, `${width}px static views`);
      for (const route of routes) {
        const label = `${width}px ${route}`;
        try {
          const response = await page.goto(root + route, {waitUntil: 'networkidle'});
          check(response?.status() === 200, `${label}: HTTP 200`, response?.status());
          await settle(page);
          const view = await page.evaluate(() => {
            const main = document.querySelector('#main');
            const headings = [...main.querySelectorAll('h1')];
            return {overflow: document.documentElement.scrollWidth > innerWidth + 1, h1: headings.map(element => ({text: element.textContent.trim(), visible: element.checkVisibility({checkOpacity: true, checkVisibilityCSS: true}) && element.getBoundingClientRect().height > 0})), brokenImages: [...document.images].filter(image => image.getAttribute('src') && (!image.complete || !image.naturalWidth)).map(image => image.currentSrc || image.src), phoneLinks: [...document.querySelectorAll('a[href^="tel:"]')].map(element => element.getAttribute('href')), text: document.body.innerText, reviews: main.querySelectorAll('.google-reviews').length};
          });
          check(!view.overflow, `${label}: no horizontal overflow`);
          check(view.h1.length === 1 && view.h1[0].visible, `${label}: one visible H1`, view.h1);
          check(view.brokenImages.length === 0, `${label}: all images complete and decoded`, view.brokenImages);
          check(view.phoneLinks.length > 0 && view.phoneLinks.every(phone => phone.replace(/[\s()-]/g, '') === 'tel:+48794225139'), `${label}: only the confirmed phone number is used`, view.phoneLinks);
          check(!/603[\s-]*421[\s-]*987/.test(view.text), `${label}: mockup-only phone was not copied`);
          check(!/0?8[:.]00\s*[-–—]\s*(?:18|14)[:.]00/u.test(view.text), `${label}: mockup-only business hours were not copied`);
          if (!report.fixtureReviewsConfigured) check(view.reviews === 0, `${label}: unconfigured Trustindex does not fabricate reviews`);
          const brand = await branding(page, label);
          await favicons(page, label);
          let geometry;
          if (route === '/') {
            geometry = await homeGeometry(page, width);
            await page.screenshot({path: path.join(screenshotDir, `home-${width}.png`), fullPage: true, animations: 'disabled'});
            if ([768, 390, 360].includes(width)) await mobileModal(page, width);
          }
          if (route === '/kontakt/') await contactMap(page, maps, label);
          report.views.push({width, route, h1: view.h1, brokenImages: view.brokenImages, overflow: view.overflow, brand, ...(geometry ? {geometry} : {})});
        } catch (error) { report.failures.push({label, error: error.message}); }
      }
      await context.close();
    }

    for (const width of [1440, 390]) {
      const {context, maps} = await isolatedContext(browser, {viewport: {width, height: 1000}, reducedMotion: 'no-preference', ...(width === 390 ? {isMobile: true, hasTouch: true} : {})});
      const page = await context.newPage();
      observe(page, `${width}px AJAX`);
      try {
        await page.goto(root, {waitUntil: 'networkidle'});
        await page.evaluate(() => { window.dcReferenceMarker = true; });
        for (const route of ['/serwis-klimatyzacji-stalowa-wola/', '/serwis-agd-stalowa-wola/', '/cennik/', '/porady/', '/kontakt/', '/']) {
          if (await page.getByRole('button', {name: /^Menu/}).isVisible()) await page.getByRole('button', {name: /^Menu/}).click();
          await page.locator(`#primary-nav a[href="${root}${route}"]`).click();
          await page.waitForURL(root + route);
          await page.waitForFunction(() => document.documentElement.dataset.dcMotion === 'idle' && !document.documentElement.classList.contains('is-navigating'));
          check(await page.evaluate(() => window.dcReferenceMarker === true), `${width}px ${route}: AJAX preserves the document`);
          check(await page.locator('main').evaluate(element => element === document.activeElement), `${width}px ${route}: incoming main receives focus`);
          check(!await page.locator('#dc-mobile-menu').evaluate(element => element.open), `${width}px ${route}: modal closes during navigation`);
          const brand = await branding(page, `${width}px AJAX ${route}`);
          await favicons(page, `${width}px AJAX ${route}`);
          if (route === '/kontakt/') await contactMap(page, maps, `${width}px AJAX Contact`);
          report.navigation.push({width, route, brand, sameDocument: await page.evaluate(() => window.dcReferenceMarker === true)});
        }
        await page.goBack();
        await page.waitForURL(root + '/kontakt/');
        await page.waitForFunction(() => document.documentElement.dataset.dcMotion === 'idle');
        await contactMap(page, maps, `${width}px Back Contact`);
        await branding(page, `${width}px Back`);
        await favicons(page, `${width}px Back`);
        check(await page.evaluate(() => window.dcReferenceMarker === true), `${width}px: Back preserves the document`);
        await page.goForward();
        await page.waitForURL(root + '/');
        await page.waitForFunction(() => document.documentElement.dataset.dcMotion === 'idle');
        await branding(page, `${width}px Forward home`);
        check(await page.locator('.home-hero h1').isVisible(), `${width}px: Forward restores the homepage`);
      } catch (error) { report.failures.push({label: `${width}px AJAX/history`, error: error.message}); }
      await context.close();
    }
  } finally {
    await browser.close();
    check(report.javascriptErrors.length === 0, 'No JavaScript errors', report.javascriptErrors);
    check(report.failedLocalResources.length === 0, 'No failed local assets or pages', report.failedLocalResources);
    report.checkedAssets = verifiedAssets.size;
    fs.mkdirSync('artifacts/test-results', {recursive: true});
    fs.writeFileSync('artifacts/test-results/reference-design.json', JSON.stringify(report, null, 2) + '\n');
  }
  assert.deepEqual(report.failures, [], 'Reference design regressions; see artifacts/test-results/reference-design.json');
  console.log(`PASS: ${report.views.length} reference views at ${widths.join('/')}px; blue identity, relative desktop composition, all images, confirmed phone, immediate mocked map, modal and ${report.navigation.length} AJAX routes plus Back/Forward.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
