const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const root='http://127.0.0.1:8080';
const routes=['/','/serwis-klimatyzacji-stalowa-wola/','/serwis-agd-stalowa-wola/','/realizacje/','/o-firmie/','/kontakt/'];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const errors=[];const failures=[];const results=[];
 for(const width of [1440,768,390,360,1024,1280,1536]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}); const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400 && r.url().startsWith(root)) failures.push([r.status(),r.url()]);});
  for(const route of routes){
   const response=await page.goto(root+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);
   assert.equal(await page.locator('h1').count(),1,`H1 ${route}`);
   assert.equal(await page.locator('html').getAttribute('lang'),'pl-PL');
   assert.equal(await page.locator('link[rel=canonical]').count(),1);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   assert.equal(overflow,false,`Overflow ${width} ${route}`);
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}scrollTo(0,0)});
   await page.waitForFunction(()=>[...document.querySelectorAll('img[src]')].every(i=>i.complete&&i.naturalWidth>0));
   if([1440,768,390].includes(width)) await page.screenshot({path:`artifacts/screenshots/${route==='/'?'home':route.split('/')[1]}-${width}.png`,fullPage:true});
   results.push({width,route,status:response.status()});
  }
  await context.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto(root);await page.evaluate(()=>window.dcTestMarker=1);
 await page.locator('#primary-nav a').filter({hasText:'Klimatyzacja'}).click();await page.waitForURL('**/serwis-klimatyzacji-stalowa-wola/');
 assert.equal(await page.evaluate(()=>window.dcTestMarker),1,'AJAX preserves document');
 assert.match(await page.title(),/Serwis klimatyzacji/);assert.equal(await page.locator('#main').evaluate(el=>el===document.activeElement),true);
 await page.goBack();await page.waitForURL(root+'/');await page.waitForFunction(()=>document.querySelector('h1')?.textContent.includes('Naprawiamy'));
 await page.goto(root+'/realizacje/');const photo=page.locator('.gallery-grid a').first();await photo.focus();await page.keyboard.press('Enter');await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await photo.evaluate(el=>document.activeElement===el),true);
 const mobile=await browser.newPage({viewport:{width:390,height:844}});await mobile.goto(root);await mobile.getByRole('button',{name:'Menu'}).click();assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await mobile.keyboard.press('Escape');assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const n=await nojs.newPage();await n.goto(root+'/kontakt/');assert.equal(await n.locator('form[action*="admin-post"]').count(),1);assert.equal(await n.locator('#primary-nav').isVisible(),true,'Mobile no-JS navigation');
 await n.locator('[name=dc_name]').fill('Test bez JS');await n.locator('[name=dc_email]').fill('test@example.test');await n.locator('[name=dc_message]').fill('Syntetyczny test wygaśniętego formularza.');await n.locator('[name=dc_privacy]').check();
 await n.locator('[name=dc_nonce]').evaluate(el=>el.value='invalid');await n.getByRole('button',{name:'Wyślij wiadomość'}).click();await n.waitForURL('**/kontakt/?dc_status=expired#contact');assert.match(await n.locator('.form-status').innerText(),/Formularz wygasł/);await nojs.close();
 assert.deepEqual(errors,[],'JavaScript errors');assert.deepEqual(failures,[],'Failed resources');
 fs.mkdirSync('artifacts/test-results',{recursive:true});fs.writeFileSync('artifacts/test-results/browser.json',JSON.stringify({checks:results,ajax:true,history:true,lightbox:true,mobileMenu:true,noJsForm:true,errors,failures},null,2));
 console.log(`PASS: ${results.length} page/viewport checks, AJAX navigation/history, lightbox, mobile menu, no-JS form`);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
