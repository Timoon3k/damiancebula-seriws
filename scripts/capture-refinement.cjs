/** Real local 2.1 pages; comparison uses the committed 2.0 screenshots. */
const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const mockMap=require('../tests/mock-map.cjs');
const root=(process.env.BASE_URL||'http://127.0.0.1:8081').replace(/\/$/,'');
const origin=new URL(root).origin;
assert(['127.0.0.1','localhost'].includes(new URL(root).hostname),'Local WordPress only');
const routes=['/','/serwis-klimatyzacji-stalowa-wola/','/serwis-agd-stalowa-wola/','/realizacje/','/o-firmie/','/kontakt/','/polityka-prywatnosci/'];
const output=path.resolve('docs/visual/refinement/after');fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const captures=[];
 try{
  for(const width of [1440,768,390]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
   await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());await mockMap(context);
   const page=await context.newPage();
   for(const route of routes){
    const response=await page.goto(root+route,{waitUntil:'networkidle'});assert.equal(response.status(),200);
    await page.evaluate(async()=>{
     await document.fonts.ready;
     for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,35));}
     // Full-page Chromium captures can omit off-screen lazy/auto-size images.
     // Delivery remains lazy in production: these hints exist only in this tab.
     for(const image of document.images){image.loading='eager';if(image.sizes.startsWith('auto,'))image.sizes=image.sizes.replace(/^auto,\s*/,'');image.style.setProperty('content-visibility','visible','important');}
     await Promise.all([...document.images].filter(image=>image.getAttribute('src')).map(image=>image.decode()));
     for(const frame of document.querySelectorAll('.map-viewport')){
      const note=document.createElement('p');note.textContent='Mapa Google — lokalna atrapa testowa';note.style.cssText='position:absolute;inset:0;display:grid;place-items:center;margin:0;padding:24px;background:#dde5e1;color:#192e33;font:14px sans-serif;text-align:center';frame.style.position='relative';frame.append(note);
     }
     scrollTo(0,0);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    });
    await page.waitForTimeout(250);
    const name=route==='/'?'home':route.split('/')[1];const file=path.join(output,`${name}-${width}.jpg`);
    await page.screenshot({path:file,type:'jpeg',quality:84,fullPage:true,animations:'disabled'});
    captures.push({route,width,after:path.relative(process.cwd(),file),before:`docs/visual/architectural/after/${name}-${width}.jpg`});
   }
   await context.close();console.log(`Captured 7 current pages at ${width}px`);
  }
  const report={version:'2.1.0',capturedAt:new Date().toISOString(),beforeCommit:'8ebc717',before:'Existing committed screenshots of the actual 2.0 installation',after:'Current isolated local WordPress',productionScreenshot:false,reducedMotion:true,captureOnlyChanges:'Eager/explicit image sizes and content-visibility for off-screen Chromium painting; labelled Google test placeholder.',captures};
  fs.mkdirSync('artifacts/test-results',{recursive:true});fs.writeFileSync('artifacts/test-results/refinement-visual.json',JSON.stringify(report,null,2)+'\n');console.log('PASS:21 current full-page screenshots, with21 existing 2.0 comparison views.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
