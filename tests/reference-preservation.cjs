/**
 * 3.0 protects the existing SEO and client material against the immutable local
 * c007e40 snapshot. The newly authorised homepage composition and global menus
 * are deliberately outside the old visual/content contract; the retained local
 * copy, SEO paragraphs and every original gallery remain inside it.
 */
const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const repo = path.resolve(__dirname, '..');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8081').replace(/\/$/, '');
const origin = new URL(root).origin;
assert(['127.0.0.1', 'localhost'].includes(new URL(root).hostname), 'Run only against the isolated local WordPress');
const baselinePath = path.join(__dirname, 'fixtures/architectural-baseline.json');
const baselineBytes = fs.readFileSync(baselinePath);
const baselineHash = crypto.createHash('sha256').update(baselineBytes).digest('hex');
const baseline = JSON.parse(baselineBytes);
assert.equal(baseline.sourceCommit, 'c007e40');

function normalize(value) {
  if (typeof value === 'string') return value.split(origin).join('__ORIGIN__');
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalize(item)]));
  return value;
}
function xrobots(headers) {
  const entry = Object.entries(headers).find(([name]) => name.toLowerCase() === 'x-robots-tag');
  return entry ? String(entry[1]) : '';
}
function collect() {
  const clean = text => (text || '').replace(/\s+/gu, ' ').trim();
  const main = document.querySelector('#main');
  if (!main) throw new Error('The expected WordPress main is absent');
  const copy = main.cloneNode(true);
  copy.querySelectorAll('.architectural-hero-cta,.local-city-photo').forEach(element => element.remove());
  const links = container => [...container.querySelectorAll('a[href]')].filter(element => !element.closest('.architectural-hero-cta,.local-city-photo')).map(element => ({href: element.href, text: clean(element.textContent)}));
  const paragraphs = container => [...container.querySelectorAll('p,summary,li,address')].filter(element => !element.closest('.architectural-hero-cta,.local-city-photo')).map(element => clean(element.textContent));
  const seo = main.querySelector('.text-section');
  const local = main.querySelector('.local-copy');
  return {
    text: clean(copy.textContent),
    headings: [...main.querySelectorAll('h1,h2,h3')].filter(element => !element.closest('.local-city-photo')).map(element => ({tag: element.tagName, text: clean(element.textContent)})),
    legalAndSeoText: paragraphs(copy),
    title: document.title,
    metadata: [...document.head.querySelectorAll('meta[name="description"],meta[name="robots"],meta[name^="twitter:"],meta[property^="og:"]')].map(element => ({name: element.getAttribute('name') || element.getAttribute('property'), content: element.content})),
    canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(element => element.href),
    schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(element => JSON.parse(element.textContent)),
    links: links(main),
    galleries: [...main.querySelectorAll('.mini-gallery a,.gallery-grid a')].map(element => ({href: element.href, src: element.querySelector('img').src, alt: element.querySelector('img').alt, caption: clean(element.closest('figure').querySelector('figcaption')?.textContent)})),
    lang: document.documentElement.lang,
    homeSeo: seo ? {heading: clean(seo.querySelector('h2')?.textContent), paragraphs: paragraphs(seo), links: links(seo)} : null,
    homeLocal: local ? {heading: clean(local.querySelector('h2')?.textContent), paragraphs: paragraphs(local), links: links(local)} : null,
    h1Count: main.querySelectorAll('h1').length,
  };
}

/** The old collector captured the global chrome as well as main links. Validate
 * its exact boundary before selecting main; no arbitrary matching-link removal. */
function originalMainLinks(page) {
  const links = page.links;
  assert.deepEqual(links.slice(2, 8).map(link => link.text), ['Strona główna', 'Klimatyzacja', 'Serwis AGD', 'Realizacje', 'O firmie', 'Kontakt']);
  assert.equal(links[0].text, 'Przejdź do treści');
  assert.equal(links[8].href, 'tel:+48794225139');
  assert.equal(links[9].href, 'tel:+48794225139');
  assert.deepEqual(links.slice(-5).map(link => link.text), ['794 225 139', 'Skontaktuj się', 'kontakt@damiancebula-serwis.pl', 'Polityka prywatności', 'majewskitomasz.pl']);
  return links.slice(10, -5);
}

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
  const checks = [];
  try {
    const context = await browser.newContext({javaScriptEnabled: false, reducedMotion: 'reduce'});
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    for (const before of baseline.pages) {
      const response = await page.goto(root + before.route, {waitUntil: 'domcontentloaded'});
      assert.equal(response.status(), before.httpStatus, `HTTP status: ${before.route}`);
      assert.equal(xrobots(await response.allHeaders()), before.xRobotsTag, `X-Robots-Tag: ${before.route}`);
      const after = normalize(await page.evaluate(collect));
      for (const field of ['title', 'metadata', 'canonical', 'schema', 'galleries', 'lang']) {
        assert.deepEqual(after[field], before[field], `Protected ${field} changed: ${before.route}`);
      }
      assert.equal(after.h1Count, 1, `Exactly one H1: ${before.route}`);
      const mainLinks = originalMainLinks(before);
      if (before.route === '/') {
        assert(after.homeSeo && after.homeLocal, 'Retain editable local SEO and authentic project context');
        assert.deepEqual(after.homeSeo, {
          heading: before.headings.at(-1).text,
          paragraphs: before.legalAndSeoText.slice(-2),
          links: mainLinks.slice(-2),
        }, 'Existing homepage SEO heading, paragraphs and local service links');
        assert.deepEqual(after.homeLocal, {
          heading: before.headings.find(heading => heading.text.startsWith('Lokalny serwis')).text,
          paragraphs: before.legalAndSeoText.slice(-4, -2),
          links: mainLinks.filter(link => link.text === 'Poznaj serwis'),
        }, 'Existing local service copy and link');
        const h1 = after.headings.find(heading => heading.tag === 'H1').text;
        assert(/klimatyzacj/i.test(h1) && /AGD/.test(h1) && /Stalowej Woli/.test(h1), 'New hero still targets both services and Stalowa Wola');
      } else {
        for (const field of ['text', 'headings', 'legalAndSeoText']) {
          assert.deepEqual(after[field], before[field], `Protected inner-page ${field}: ${before.route}`);
        }
        assert.deepEqual(after.links, mainLinks, `Protected main links: ${before.route}`);
      }
      checks.push({route: before.route, metadataAndSchema: 'unchanged', gallery: 'unchanged', existingMainContent: before.route === '/' ? 'retained local SEO and project context; new composition authorised' : 'unchanged'});
    }

    const extra = [];
    const titles = new Set(baseline.pages.map(item => item.title));
    const descriptions = new Set(baseline.pages.map(item => item.metadata.find(meta => meta.name === 'description')?.content));
    for (const slug of ['cennik', 'porady']) {
      const response = await page.goto(`${root}/${slug}/`, {waitUntil: 'domcontentloaded'});
      assert.equal(response.status(), 200, `New reference navigation must have a working /${slug}/ page`);
      const after = normalize(await page.evaluate(collect));
      assert.equal(after.h1Count, 1);
      assert.equal(after.canonical.length, 1);
      assert.equal(after.canonical[0], `__ORIGIN__/${slug}/`);
      const description = after.metadata.filter(meta => meta.name === 'description');
      assert.equal(description.length, 1);
      assert(description[0].content.length >= 70 && description[0].content.length <= 180, `Useful concise meta description: ${slug}`);
      assert(!titles.has(after.title), `Unique title: ${slug}`);
      assert(!descriptions.has(description[0].content), `Unique description: ${slug}`);
      titles.add(after.title); descriptions.add(description[0].content);
      assert(after.text.split(/\s+/u).length >= 150, `Substantive content, not an empty menu destination: ${slug}`);
      for (const target of ['serwis-klimatyzacji-stalowa-wola', 'serwis-agd-stalowa-wola', 'kontakt']) {
        assert(after.links.some(link => link.href === `__ORIGIN__/${target}/`), `Related local service/contact link: ${slug} -> ${target}`);
      }
      assert(!/\b\d+(?:[,.]\d{2})?\s*(?:zł|PLN)\b/u.test(after.text), `No invented service prices: ${slug}`);
      assert(!/\b(?:603\s*421\s*987|24\/7|całodobow[ay]|20 lat|10 lat)\b/ui.test(after.text), `No mockup-only phone or unsupported claims: ${slug}`);
      extra.push({route: `/${slug}/`, h1: 1, uniqueMetadata: true, substantiveContent: true, relatedServiceLinks: true});
    }

    for (const [file, expected] of Object.entries(baseline.protectedImages)) {
      const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, file))).digest('hex');
      assert.equal(actual, expected, `Original client image modified: ${file}`);
    }
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(baselinePath)).digest('hex'), baselineHash, 'The immutable pre-change fixture must not be rewritten');
    const report = {
      version: '3.0.0', checkedAt: new Date().toISOString(), sourceCommit: baseline.sourceCommit,
      baselineCapturedAt: baseline.capturedAt, baselineSha256: baselineHash,
      pages: checks, newPages: extra, protectedImages: Object.keys(baseline.protectedImages).length,
      authorisedChanges: ['homepage hero/service/process composition', 'global navigation and footer organisation', 'cyan/snowflake identity'],
      productionSnapshotVerified: false,
      productionReason: 'The available fixture is an isolated local WordPress snapshot; production host access remains blocked by the environment proxy.',
      databaseReset: false,
    };
    fs.mkdirSync(path.join(repo, 'artifacts/test-results'), {recursive: true});
    fs.writeFileSync(path.join(repo, 'artifacts/test-results/reference-preservation.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`PASS: ${checks.length} existing SEO/social/schema snapshots, protected local/legal/service copy, all galleries, ${Object.keys(baseline.protectedImages).length} original image hashes; ${extra.length} substantive new pages. Production comparison remains separately unverified.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
