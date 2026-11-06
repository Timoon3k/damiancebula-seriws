const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const root = (process.env.BASE_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');
const routes = [
  { path: '/', name: 'home', selector: '.mini-gallery' },
  { path: '/serwis-klimatyzacji-stalowa-wola/', name: 'climate', selector: '.mini-gallery' },
  { path: '/realizacje/', name: 'projects', selector: '.gallery-grid' },
];
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  fs.mkdirSync('artifacts/screenshots', { recursive: true });
  const checks = [];
  const errors = [];
  try {
    for (const width of [1440, 768, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => errors.push(error.message));
      for (const route of routes) {
        const response = await page.goto(root + route.path, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, route.path);
        const gallery = page.locator(route.selector);
        await gallery.scrollIntoViewIfNeeded();
        // Inspect each frame after bringing it into view. On mobile the home
        // gallery is a native horizontal strip, so off-screen slides are expected.
        const carousel = route.name === 'home' && width <= 700;
        const photos = [];
        for (const figure of await gallery.locator('figure').all()) {
          await figure.scrollIntoViewIfNeeded();
          await figure.locator('img').evaluate(image => image.decode());
          await figure.locator('a').focus();
          photos.push(await figure.evaluate(figure => {
            const image = figure.querySelector('img');
            const anchor = figure.querySelector('a');
            const caption = figure.querySelector('figcaption');
            const frame = anchor.getBoundingClientRect();
            const bounds = image.getBoundingClientRect();
            const gallery = figure.parentElement;
            const viewport = gallery.getBoundingClientRect();
            const scale = Math.min(frame.width / image.naturalWidth,frame.height / image.naturalHeight);
            return {
              natural:[image.naturalWidth,image.naturalHeight],
              fit:getComputedStyle(image).objectFit,
              transform:getComputedStyle(image).transform,
              frame:{width:frame.width,height:frame.height,left:frame.left,right:frame.right},
              imageBox:{width:bounds.width,height:bounds.height,left:bounds.left,top:bounds.top},
              contained:{width:image.naturalWidth * scale,height:image.naturalHeight * scale},
              caption:caption ? {text:caption.textContent,height:caption.getBoundingClientRect().height,scrollHeight:caption.scrollHeight,clientHeight:caption.clientHeight} : null,
              source:image.currentSrc,
              galleryViewport:{left:viewport.left,right:viewport.right},
              galleryScrollLeft:gallery.scrollLeft,
            };
          }));
        }
        if (carousel) {
          const scroll = await gallery.evaluate(el => ({overflow:getComputedStyle(el).overflowX,scrollWidth:el.scrollWidth,width:el.clientWidth}));
          assert.equal(scroll.overflow,'auto','Mobile gallery uses native scrolling');
          assert(scroll.scrollWidth > scroll.width,'Other client photos are available by swiping');
          assert(photos.some(photo => photo.galleryScrollLeft > 0),'Keyboard focus reaches later slides');
        }
        assert.ok(photos.length >= 3, `${route.name}: real gallery photos`);
        for (const [index, photo] of photos.entries()) {
          const label = `${route.name} ${width} photo ${index + 1}`;
          assert.ok(photo.natural[0] > 0 && photo.natural[1] > 0, `${label}: loaded`);
          assert.equal(photo.fit, 'contain', `${label}: entire photo fits frame`);
          assert.equal(photo.transform, 'none', `${label}: no image zoom cropping`);
          const expectedRatio = route.selector === '.mini-gallery' && width > 1050 ? 4 / 5 : 4 / 3;
          assert.ok(Math.abs(photo.frame.width / photo.frame.height - expectedRatio) < .02, `${label}: intended responsive frame ratio`);
          assert.ok(Math.abs(photo.imageBox.width - photo.frame.width) < 1 && Math.abs(photo.imageBox.height - photo.frame.height) < 1, `${label}: intrinsic WP dimensions do not overflow frame`);
          assert.ok(photo.contained.width <= photo.frame.width + 1 && photo.contained.height <= photo.frame.height + 1, `${label}: original contents fit`);
          assert.ok(photo.frame.left >= -1 && photo.frame.right <= width + 1, `${label}: every frame can be brought fully into the viewport`);
          if (carousel) assert(photo.frame.left >= photo.galleryViewport.left - 1 && photo.frame.right <= photo.galleryViewport.right + 1, `${label}: focused slide is fully inside the scrolling strip`);
          assert.ok(!photo.source.includes('editorial-'), `${label}: authentic client work`);
          if (photo.caption) {
            assert.ok(photo.caption.text.trim(), `${label}: readable caption`);
            assert.ok(photo.caption.height > 15 && photo.caption.scrollHeight <= photo.caption.clientHeight + 1, `${label}: caption is not clipped`);
          }
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route.name} ${width}: no horizontal overflow`);
        // Keep a fixed header above the crop while photographing the entire gallery.
        const galleryHeight = (await gallery.boundingBox()).height;
        const headerHeight = await page.locator('.site-header').evaluate(header => header.getBoundingClientRect().height);
        await page.setViewportSize({ width, height: Math.max(1000, Math.ceil(galleryHeight + headerHeight + 100)) });
        await gallery.evaluate((element, offset) => scrollTo(0, Math.max(0, element.getBoundingClientRect().top + scrollY - offset - 24)), headerHeight);
        if (carousel) await gallery.evaluate(el => el.scrollTo({left:0,behavior:'instant'}));
        await gallery.screenshot({ path: `artifacts/screenshots/gallery-${route.name}-${width}.png` });
        await page.setViewportSize({ width, height: 1000 });
        const portraitIndex = photos.findIndex(photo => photo.natural[1] > photo.natural[0]);
        assert.ok(portraitIndex >= 0, `${route.name}: portrait photos remain in gallery`);
        const opener = gallery.locator('figure a').nth(portraitIndex);
        const href = await opener.getAttribute('href');
        await opener.click();
        const dialog = page.locator('dialog[open]');
        await dialog.waitFor();
        await dialog.locator('img').evaluate(image => image.decode());
        assert.equal(await dialog.locator('img').getAttribute('src'), href, `${route.name}: full source opens`);
        assert.equal(await dialog.locator('img').evaluate(image => getComputedStyle(image).objectFit), 'contain', `${route.name}: lightbox fits entire photo`);
        if (route.name === 'projects') await dialog.screenshot({ path: `artifacts/screenshots/gallery-lightbox-${width}.png` });
        await page.keyboard.press('Escape');
        assert.equal(await opener.evaluate(anchor => document.activeElement === anchor), true, `${route.name}: lightbox returns focus`);
        checks.push({ width, route: route.path, photos, nativeCarousel:carousel, allSlidesKeyboardReachable:carousel, lightbox: true });
      }
      await page.close();
    }
    assert.deepEqual(errors, [], 'No gallery JavaScript errors');
    fs.mkdirSync('artifacts/test-results', { recursive: true });
    fs.writeFileSync('artifacts/test-results/gallery.json', JSON.stringify({ checks, errors }, null, 2));
    console.log(`PASS: ${checks.length} galleries at 1440/768/390px; complete image framing, native mobile carousel, keyboard reachability, captions, authentic photos, lightbox and focus`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
