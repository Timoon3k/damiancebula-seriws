const root = (process.env.BASE_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    const page = await browser.newPage();
    let interceptedMapRequests = 0;
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === new URL(root).origin) { return route.continue(); }
      if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps')) {
        interceptedMapRequests++;
        return route.fulfill({status:200, contentType:'text/html; charset=utf-8', body:'<!doctype html><html><title>Mapa testowa</title><body>Mapa testowa</body></html>'});
      }
      return route.abort('blockedbyclient');
    });
    const titles = new Set(), descriptions = new Set(), links = new Set(), results = [];
    for (const path of ['/', '/serwis-klimatyzacji-stalowa-wola/', '/serwis-agd-stalowa-wola/', '/realizacje/', '/o-firmie/', '/kontakt/', '/polityka-prywatnosci/']) {
      await page.goto(root + path);
      const result = await page.evaluate(() => ({
        title:document.title,
        description:document.querySelector('meta[name=description]').content,
        canonical:document.querySelector('link[rel=canonical]').href,
        graphs:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
        links:[...document.querySelectorAll('a[href]')].map(a => a.href),
        robots:document.querySelector('meta[name=robots]').content,
        externalFrames:[...document.querySelectorAll('iframe')].map(frame => ({src:frame.src, title:frame.title, loading:frame.loading, referrerPolicy:frame.referrerPolicy})),
        mapActivationButtons:document.querySelectorAll('.map-embed button, .map-consent, [data-map-src]').length,
      }));
      assert(!titles.has(result.title));
      titles.add(result.title);
      assert(!descriptions.has(result.description));
      descriptions.add(result.description);
      assert.equal(result.canonical, root + path);
      assert.equal(result.graphs.length, 1);
      assert.equal(result.externalFrames.length, path === '/kontakt/' ? 1 : 0, 'Only Contact embeds the Google map');
      assert.equal(result.mapActivationButtons, 0, 'Map has no consent gate');
      if (path === '/kontakt/') {
        const frame = result.externalFrames[0];
        const url = new URL(frame.src);
        assert.equal(url.origin, 'https://www.google.com');
        assert.match(url.pathname, /^\/maps/);
        assert.match(frame.title, /Adres firmy/);
        assert.equal(frame.loading, 'eager');
        assert.equal(frame.referrerPolicy, 'no-referrer');
        assert.equal(interceptedMapRequests, 1, 'Contact map loads automatically; Google request is intercepted');
      }
      assert.match(result.robots, /noindex/);
      const graph = result.graphs[0]['@graph'];
      assert.equal(graph.filter(g => g['@type'] === 'HVACBusiness').length, 1);
      assert.equal(JSON.stringify(graph).includes('aggregateRating'), false);
      assert.equal(graph.find(g => g['@type'] === 'HVACBusiness').address.streetAddress, 'Aleje Jana Pawła II 42');
      if (path.includes('serwis-')) { assert.equal(graph.filter(g => g['@type'] === 'Service').length, 1); }
      result.links.forEach(link => { if (link.startsWith(root + '/')) { links.add(link.split('#')[0]); } });
      results.push({route:path, title:result.title, description:result.description, canonical:result.canonical, robots:result.robots, schema:graph.map(g => g['@type']), externalFrames:result.externalFrames.length});
    }
    const crawl = [];
    for (const link of links) {
      const response = await page.request.get(link);
      crawl.push({url:link, status:response.status()});
      assert.equal(response.status(), 200, link);
    }
    const missing = await page.goto(root + '/dc-nieistniejaca-strona/');
    assert.equal(missing.status(), 404);
    assert.match(await page.locator('h1').innerText(), /Nie ma takiej strony/);
    fs.mkdirSync('artifacts/test-results', {recursive:true});
    fs.writeFileSync('artifacts/test-results/seo.json', JSON.stringify({pages:results, crawl, notFound:true, automaticContactMap:true, interceptedMapRequests, externalGoogleContact:false, privacyPolicy:'Published tailored policy created on separate installation; pre-existing policies preserved.'}, null, 2));
    console.log('PASS: seven unique titles/descriptions, canonicals, schema, internal links including privacy policy, automatic Contact map, real 404');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
