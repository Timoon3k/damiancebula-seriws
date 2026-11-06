const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8081').replace(/\/$/, '');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  const results = [];
  fs.mkdirSync('artifacts/screenshots', {recursive:true});
  try {
    for (const width of [1440,768,390,360]) {
      const p = await browser.newPage({viewport:{width,height:900}, deviceScaleFactor:2, reducedMotion:'reduce'});
      await p.goto(root, {waitUntil:'networkidle'});
      await p.locator('.brand-uploaded-lockup.is-fitted').waitFor();
      const image = p.locator('.brand img');
      assert.equal(await image.getAttribute('data-logo-tone'), 'dark');
      assert.match(await image.evaluate(i => getComputedStyle(i).filter), /invert\(1\)/);
      assert.equal(await p.locator('.brand-wordmark').count(), 0, 'Full wordmark is not duplicated');
      const metrics = await p.locator('.brand-uploaded-lockup').evaluate(box => {
        const img = box.querySelector('img');
        const renderedWidth = img.getBoundingClientRect().width;
        return {width:box.clientWidth, height:box.clientHeight, childWidth:renderedWidth,
          naturalWidth:img.naturalWidth, currentSrc:img.currentSrc, srcset:img.getAttribute('srcset'), sizes:img.getAttribute('sizes'),
          devicePixelRatio, sourcePixelsPerDevicePixel:img.naturalWidth / renderedWidth / devicePixelRatio,
          overflow:document.documentElement.scrollWidth > innerWidth};
      });
      assert(metrics.width >= 240, 'Full wordmark stays legible');
      assert(metrics.childWidth > metrics.width, 'Whitespace is removed from the visible frame');
      assert.equal(metrics.overflow, false);
      assert.equal(metrics.naturalWidth, 2048, 'The original upload is used even when the selected attachment is a 220px crop');
      assert(!metrics.currentSrc.includes('cropped-'), 'Do not render the destructive Customizer crop');
      assert.equal(metrics.srcset, null, 'No thumbnail can replace the original');
      assert.equal(metrics.sizes, null);
      assert(metrics.sourcePixelsPerDevicePixel >= 1, 'Enough source resolution for a retina display');
      await p.locator('.site-header').screenshot({path:`artifacts/screenshots/logo-custom-${width}.png`});
      results.push({width,...metrics,contrast:'dark-to-light',duplicateWordmark:false});
      await p.close();
    }
    fs.mkdirSync('artifacts/test-results', {recursive:true});
    fs.writeFileSync('artifacts/test-results/branding.json', JSON.stringify(results,null,2));
    console.log('PASS: original logo restored from 220px crop; retina resolution, contrast, transparent margins and desktop/mobile layout');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
