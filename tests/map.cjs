/** No Google requests leave this browser: external requests are intercepted. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');
(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    const context = await browser.newContext({reducedMotion:'reduce'});
    let googleRequests = 0;
    let pendingMap;
    const holdResponse = new Promise(resolve => { pendingMap = resolve; });
    let holdNextMap = false;
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') { return route.continue(); }
      if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps')) {
        googleRequests++;
        if (holdNextMap) { await holdResponse; }
        return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="pl"><title>Lokalna atrapa mapy Google</title><body>Mapa testowa — bez połączenia z Google</body></html>'});
      }
      return route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    await page.goto(root + '/kontakt/');
    const map = page.locator('.map-consent');
    await map.locator('[data-map-src]').waitFor();
    assert.equal(await map.locator('iframe').count(), 0);
    assert.equal(googleRequests, 0, 'No external map request before consent');
    assert.match(await map.innerText(), /Aleje Jana Pawła II 42/);
    const fallback = map.getByRole('link', {name:/Otwórz w Google Maps/});
    assert.equal(await fallback.getAttribute('target'), '_blank');
    assert.match(await fallback.getAttribute('href'), /^https:\/\/www\.google\.com\/maps\?q=/);
    await map.getByRole('button', {name:'Włącz mapę Google'}).click();
    await page.waitForFunction(() => document.querySelector('.map-consent')?.dataset.mapState === 'loaded');
    assert.equal(googleRequests, 1, 'Exactly one intercepted request after consent');
    assert.equal(await map.locator('iframe').getAttribute('loading'), 'eager');
    assert.match(await map.locator('iframe').getAttribute('title'), /Adres firmy/);
    assert.equal(await map.getByRole('button').isEnabled(), true);

    // Navigate away and back through the real AJAX router, preserving this window marker.
    await page.evaluate(() => { window.dcMapTestMarker = true; });
    await page.locator('#primary-nav a').filter({hasText:'O firmie'}).click();
    await page.waitForURL(root + '/o-firmie/');
    await page.locator('#primary-nav a').filter({hasText:'Kontakt'}).click();
    await page.waitForURL(root + '/kontakt/');
    assert.equal(await page.evaluate(() => window.dcMapTestMarker), true, 'AJAX navigation keeps the document');
    assert.equal(await page.locator('.map-consent iframe').count(), 0, 'Returning by AJAX requires fresh consent');
    assert.equal(googleRequests, 1, 'AJAX navigation makes no Google request without consent');
    await page.clock.install();
    holdNextMap = true;
    await page.locator('.map-consent [data-map-src]').click();
    await page.waitForFunction(() => document.querySelector('.map-consent')?.dataset.mapState === 'loading');
    assert.equal(await page.locator('.map-consent [data-map-src]').isDisabled(), true);
    assert.equal(await page.locator('.map-viewport').getAttribute('aria-busy'), 'true');
    await page.clock.fastForward(16000);
    await page.waitForFunction(() => document.querySelector('.map-consent')?.dataset.mapState === 'error');
    assert.equal(await page.locator('.map-consent iframe').count(), 0, 'Timed out iframe is removed');
    assert.match(await page.locator('.map-status').innerText(), /Nie udało się wczytać mapy/);
    assert.equal(await page.locator('.map-consent [data-map-src]').isEnabled(), true, 'Timeout provides an enabled retry');
    assert.equal(await page.locator('.map-consent a[data-no-ajax]').isVisible(), true);
    holdNextMap = false;
    pendingMap();
    await page.locator('.map-consent [data-map-src]').click();
    await page.waitForFunction(() => document.querySelector('.map-consent')?.dataset.mapState === 'loaded');
    assert.equal(await page.locator('.map-consent iframe').count(), 1);
    assert.equal(await page.locator('.map-status').getAttribute('role'), 'status');
    assert.equal(await page.locator('.map-viewport').getAttribute('aria-busy'), null);
    const results = {noRequestBeforeConsent:true,confirmedAddress:true,accessibleStatus:true,ajaxConsent:true,timeoutAndRetry:true,externalGoogleContact:false,interceptedMapRequests:googleRequests};
    fs.mkdirSync('artifacts/test-results', {recursive:true});
    fs.writeFileSync('artifacts/test-results/map.json', JSON.stringify(results,null,2));
    console.log('PASS: map address, consent, AJAX, fallback, accessible loading, timeout and retry; Google traffic intercepted');
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
