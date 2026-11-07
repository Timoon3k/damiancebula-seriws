/** Test actual painted copper pixels, including after AJAX URL changes. */
const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');
const mockMap=require('./mock-map.cjs');
const root=(process.env.BASE_URL||'http://127.0.0.1:8081').replace(/\/$/,'');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const checks=[];
 try{
  for(const width of [1440,390]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});await mockMap(context);const page=await context.newPage();
   await page.goto(root,{waitUntil:'networkidle'});await page.evaluate(()=>window.dcLogoNavigationMarker=true);
   for(const route of ['','/serwis-klimatyzacji-stalowa-wola/','/serwis-agd-stalowa-wola/','/']){
    if(route){if(width===390)await page.getByRole('button',{name:/^Menu/}).click();await page.locator('#primary-nav a[href="'+root+route+'"]').click();await page.waitForURL(root+route);await page.waitForFunction(()=>document.documentElement.dataset.dcMotion==='idle');assert.equal(await page.evaluate(()=>window.dcLogoNavigationMarker),true,'AJAX preserves this document');}
    await page.locator('.brand img').evaluate(image=>image.decode());
    const png=await page.locator('.brand').screenshot({animations:'disabled'});
    const copperPixels=await page.evaluate(async base64=>{
     const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const context=canvas.getContext('2d');context.drawImage(image,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;let copper=0;for(let i=0;i<pixels.length;i+=4)if(Math.abs(pixels[i]-156)<=2&&Math.abs(pixels[i+1]-79)<=2&&Math.abs(pixels[i+2]-44)<=2&&pixels[i+3]>240)copper++;return copper;
    },png.toString('base64'));
    assert(copperPixels>200,'Visible logo contains real copper glyph pixels after navigation, not an empty filter result');checks.push({width,route:route||'/',copperPixels});
   }
   await context.close();
  }
  fs.mkdirSync('artifacts/test-results',{recursive:true});fs.writeFileSync('artifacts/test-results/branding-navigation.json',JSON.stringify({actualPaintedPixels:true,ajaxStable:true,checks},null,2)+'\n');console.log('PASS:8 actually painted copper logo states before/after desktop and mobile AJAX.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
