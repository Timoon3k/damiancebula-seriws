/** Read-only guard for the premium redesign: content, SEO and real client photographs. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const repo = path.resolve(__dirname,'..');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8081').replace(/\/$/,'');
const origin = new URL(root).origin;
const baselinePath = path.join(__dirname,'fixtures/premium-baseline.json');
const routes = ['/','/serwis-klimatyzacji-stalowa-wola/','/serwis-agd-stalowa-wola/','/realizacje/','/o-firmie/','/kontakt/','/polityka-prywatnosci/'];
const imagePattern = /\.(avif|webp|png|jpe?g)$/i;
const normalize = value => {
  if (typeof value === 'string') return value.split(origin).join('__ORIGIN__');
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item]) => [key,normalize(item)]));
  return value;
};
function filesBelow(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => {
    const file = path.join(directory,entry.name);
    return entry.isDirectory() ? filesBelow(file) : [file];
  });
}
function protectedImages() {
  const files = [
    ...filesBelow(path.join(repo,'assets/photos')),
    ...filesBelow(path.join(repo,'assets/source-web')),
    ...filesBelow(path.join(repo,'wp-content/themes/dc-serwis/assets/images')).filter(file => !path.basename(file).startsWith('editorial-')),
  ].filter(file => imagePattern.test(file)).sort();
  return Object.fromEntries(files.map(file => [path.relative(repo,file).split(path.sep).join('/'),crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
}
(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  const pages = [];
  try {
    const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    await context.route('**/*',route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort('blockedbyclient'));
    const page = await context.newPage();
    for (const route of routes) {
      const response = await page.goto(root+route,{waitUntil:'domcontentloaded'});
      assert.equal(response.status(),200,`Cannot capture ${route}: expected HTTP200`);
      await page.locator('#main h1').waitFor();
      const result = await page.evaluate(() => {
        const clean = value => (value || '').replace(/\s+/gu,' ').trim();
        const main = document.getElementById('main');
        return {
          text:clean(main.textContent),
          headings:[...main.querySelectorAll('h1,h2,h3')].map(el => ({level:el.tagName,text:clean(el.textContent)})),
          title:document.title,
          description:document.querySelector('meta[name="description"]')?.content || '',
          canonical:document.querySelector('link[rel="canonical"]')?.href || '',
          robots:document.querySelector('meta[name="robots"]')?.content || '',
          schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
          serviceLinks:[...main.querySelectorAll('a[href]')].filter(el => !el.closest('.mini-gallery,.gallery-grid')).map(el => ({href:el.href,text:clean(el.textContent)})),
          clientGallery:[...main.querySelectorAll('.mini-gallery a,.gallery-grid a')].map(el => ({href:el.href,src:el.querySelector('img')?.src || '',alt:el.querySelector('img')?.alt || '',caption:clean(el.closest('figure')?.querySelector('figcaption')?.textContent)})),
        };
      });
      assert.equal(result.headings.filter(item => item.level === 'H1').length,1,`${route}: one H1`);
      assert(result.clientGallery.every(item => !item.src.includes('editorial-') && !item.href.includes('editorial-')),`${route}: real projects must not become generated editorial photographs`);
      pages.push({route,...normalize(result)});
    }
  } finally { await browser.close(); }
  const current = {formatVersion:1,note:'Public local WordPress page content and real image checksums captured before the premium redesign. __ORIGIN__ makes the check portable. No credentials, cookies, form values or nonces are stored.',pages,protectedImages:protectedImages()};
  if (process.argv.includes('--record')) {
    assert(!fs.existsSync(baselinePath),'Baseline already exists. Do not overwrite acceptance evidence automatically.');
    fs.writeFileSync(baselinePath,JSON.stringify(current,null,2)+'\n');
    console.log(`RECORDED: ${pages.length} public pages and ${Object.keys(current.protectedImages).length} original/client image checksums`);
    return;
  }
  const baseline = JSON.parse(fs.readFileSync(baselinePath,'utf8'));
  assert.equal(baseline.formatVersion,current.formatVersion);
  for (let index=0; index<baseline.pages.length; index++) {
    const before=baseline.pages[index], after=current.pages[index];
    assert.equal(after.route,before.route,'The same seven public routes are checked');
    for (const key of Object.keys(before).filter(key => key !== 'route')) {
      assert.deepEqual(after[key],before[key],`${before.route}: ${key} changed during the visual redesign`);
    }
  }
  assert.deepEqual(current.protectedImages,baseline.protectedImages,'Original client photographs or their optimized theme variants changed');
  const report={version:'1.6',routes:pages.map(page => page.route),pageCount:pages.length,mainTextPreserved:true,headingTextAndOrderPreserved:true,titleDescriptionCanonicalRobotsSchemaPreserved:true,internalServiceLinksPreserved:true,clientGalleryHrefsAltsAndCaptionsPreserved:true,protectedImageFiles:Object.keys(current.protectedImages).length,clientImageChecksumsPreserved:true,externalRequestsBlocked:true};
  fs.mkdirSync(path.join(repo,'artifacts/test-results'),{recursive:true});
  fs.writeFileSync(path.join(repo,'artifacts/test-results/premium-preservation.json'),JSON.stringify(report,null,2)+'\n');
  console.log(`PASS: ${pages.length} pages preserve exact normalized main text, headings, SEO, links and real galleries; ${report.protectedImageFiles} client/original images are byte-for-byte unchanged`);
})().catch(error => { console.error(error);process.exitCode=1; });
