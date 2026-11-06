/** Local fonts and visible keyboard actions are part of the new visual contract. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const root=(process.env.BASE_URL||'http://127.0.0.1:8081').replace(/\/$/,'');
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  const checks=[];
  try {
    for(const width of [1440,390]) {
      const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
      await page.goto(root,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const fonts=await page.evaluate(()=>({
        family:getComputedStyle(document.body).fontFamily,
        polish:document.fonts.check('600 40px Manrope','Zażółć gęślą jaźń'),
        resources:performance.getEntriesByType('resource').map(r=>r.name).filter(name=>/\.woff2(?:\?|$)/.test(name)),
      }));
      assert.match(fonts.family,/Manrope/);
      assert.equal(fonts.polish,true,'The Polish heading font is loaded');
      assert.equal(new Set(fonts.resources).size,2,'Only two small local font subsets are needed');
      assert(fonts.resources.every(url=>new URL(url).origin===new URL(root).origin),'No external font service');
      await page.keyboard.press('Tab');
      const button=page.locator('.local-copy .button');
      await button.focus();
      const focusedButton=await button.evaluate(el=>({visible:el.matches(':focus-visible'),clip:getComputedStyle(el).clipPath,outline:getComputedStyle(el).outlineStyle}));
      assert.equal(focusedButton.visible,true);
      assert.equal(focusedButton.clip,'none','The button cut cannot clip its keyboard outline');
      assert.equal(focusedButton.outline,'solid');
      const card=page.locator('.services .service-card').first();
      await card.locator('.card-link').focus();
      const focusedCard=await card.evaluate(el=>({within:el.matches(':focus-within'),outline:getComputedStyle(el).outlineStyle,width:parseFloat(getComputedStyle(el).outlineWidth)}));
      assert.equal(focusedCard.within,true);
      assert.equal(focusedCard.outline,'solid','The service panel has a visible focus boundary');
      assert(focusedCard.width>=2);
      checks.push({width,fonts,focusedButton,focusedCard});
      await page.close();
    }
    fs.mkdirSync('artifacts/test-results',{recursive:true});
    fs.writeFileSync('artifacts/test-results/premium-design.json',JSON.stringify({checks,localFonts:true,polishGlyphs:true,visibleKeyboardFocus:true},null,2));
    console.log('PASS: local Polish font subsets and unclipped keyboard focus at1440/390px');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
