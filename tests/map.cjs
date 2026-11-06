/** All Google Maps requests are intercepted; this check never contacts Google. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');
const siteOrigin = new URL(root).origin;
const mockMap = '<!doctype html><html lang="pl"><title>Lokalna atrapa mapy Google</title><body>Mapa testowa — bez połączenia z Google</body></html>';

async function mapContext(browser, options = {}, blockMap = false) {
  const context = await browser.newContext({reducedMotion:'reduce', ...options});
  const requests = [];
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === siteOrigin) { return route.continue(); }
    if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps')) {
      requests.push(url.href);
      if (blockMap) { return route.abort('blockedbyclient'); }
      return route.fulfill({status:200, contentType:'text/html; charset=utf-8', body:mockMap});
    }
    return route.abort('blockedbyclient');
  });
  return {context, requests};
}

async function checkEmbed(page, requests, expectedRequests) {
  const map = page.locator('.map-embed');
  const iframe = map.locator('iframe');
  await iframe.waitFor({state:'visible'});
  assert.equal(await iframe.count(), 1, 'Contact contains one directly embedded map');
  assert.equal(await map.locator('button, [data-map-src]').count(), 0, 'Map has no consent or activation button');
  assert.match(await map.innerText(), /Aleje Jana Pawła II 42/);
  assert.equal(await iframe.getAttribute('loading'), 'eager');
  assert.equal(await iframe.getAttribute('referrerpolicy'), 'no-referrer');
  assert.match(await iframe.getAttribute('title'), /Adres firmy/);
  const src = new URL(await iframe.getAttribute('src'));
  assert.equal(src.origin, 'https://www.google.com');
  assert.equal(src.pathname, '/maps');
  assert.equal(src.searchParams.get('output'), 'embed');
  assert.match(src.searchParams.get('q'), /Aleje Jana Pawła II 42/);
  await page.frameLocator('.map-embed iframe').getByText('Mapa testowa — bez połączenia z Google').waitFor();
  assert.equal(requests.length, expectedRequests, 'Map loads automatically without any click');
  const fallback = map.getByRole('link', {name:/Otwórz w Google Maps/});
  assert.equal(await fallback.getAttribute('target'), '_blank');
  assert.match(await fallback.getAttribute('rel'), /noopener/);
  assert.match(await fallback.getAttribute('href'), /^https:\/\/www\.google\.com\/maps\?q=/);
  assert.equal(await fallback.isVisible(), true);
}

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    fs.mkdirSync('artifacts/screenshots', {recursive:true});
    const desktop = await mapContext(browser);
    const page = await desktop.context.newPage();
    await page.goto(root + '/kontakt/');
    await checkEmbed(page, desktop.requests, 1);
    await page.locator('.map-embed').screenshot({path:'artifacts/screenshots/map-contact-1440.png'});

    // Real AJAX navigation must keep the document and initialize the server-rendered iframe.
    await page.evaluate(() => { window.dcMapTestMarker = true; });
    await page.locator('#primary-nav a').filter({hasText:'O firmie'}).click();
    await page.waitForURL(root + '/o-firmie/');
    await page.locator('.map-embed').waitFor({state:'detached'});
    assert.equal(desktop.requests.length, 1, 'Other pages do not load a map');
    await page.locator('#primary-nav a').filter({hasText:'Kontakt'}).click();
    await page.waitForURL(root + '/kontakt/');
    assert.equal(await page.evaluate(() => window.dcMapTestMarker), true, 'AJAX navigation keeps the document');
    await checkEmbed(page, desktop.requests, 2);
    await desktop.context.close();

    const mobile = await mapContext(browser, {viewport:{width:390, height:844}, isMobile:true, hasTouch:true});
    const mobilePage = await mobile.context.newPage();
    await mobilePage.goto(root + '/kontakt/');
    await checkEmbed(mobilePage, mobile.requests, 1);
    await mobilePage.locator('.map-embed').screenshot({path:'artifacts/screenshots/map-contact-390.png'});
    assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'Map does not overflow mobile viewport');
    await mobile.context.close();

    const noJS = await mapContext(browser, {javaScriptEnabled:false});
    const noJSPage = await noJS.context.newPage();
    await noJSPage.goto(root + '/kontakt/');
    await checkEmbed(noJSPage, noJS.requests, 1);
    await noJS.context.close();

    const blocked = await mapContext(browser, {}, true);
    const blockedPage = await blocked.context.newPage();
    await blockedPage.goto(root + '/kontakt/');
    const fallback = blockedPage.locator('.map-embed').getByRole('link', {name:/Otwórz w Google Maps/});
    assert.equal(await fallback.isVisible(), true, 'A blocked frame leaves the external map link available');
    assert.match(await blockedPage.locator('.map-embed').innerText(), /Aleje Jana Pawła II 42/);
    assert.equal(blocked.requests.length, 1, 'Blocked map was attempted automatically');
    await blocked.context.close();

    const interceptedMapRequests = desktop.requests.length + mobile.requests.length + noJS.requests.length + blocked.requests.length;
    const results = {automaticEmbed:true, noConsentButton:true, confirmedAddress:true, ajaxAutomaticEmbed:true, mobileAutomaticEmbed:true, noJavaScriptAutomaticEmbed:true, blockedFrameFallback:true, externalGoogleContact:false, interceptedMapRequests};
    fs.mkdirSync('artifacts/test-results', {recursive:true});
    fs.writeFileSync('artifacts/test-results/map.json', JSON.stringify(results, null, 2));
    console.log('PASS: automatic Contact map, AJAX, mobile, no JavaScript and blocked-frame fallback; all Google traffic intercepted');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
