const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');
const root=(process.env.BASE_URL||'http://127.0.0.1:8081').replace(/\/$/,'');
const paths=['/serwis-klimatyzacji-stalowa-wola/','/serwis-agd-stalowa-wola/','/o-firmie/','/cennik/','/porady/','/kontakt/','/'];
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const errors=[],checks=[];
 try{for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,reducedMotion:'no-preference'});
  await context.route('**/*',route=>route.request().url().startsWith(root)?route.continue():route.abort());
  await context.addInitScript(()=>{
   window.dcStableDocument=true;window.dcFrameSamples=[];window.dcRevealSamples=[];
   requestAnimationFrame(function sample(){const main=document.querySelector('#main'),title=main?.querySelector('h1');if(main&&title){const m=getComputedStyle(main),h=getComputedStyle(title);window.dcFrameSamples.push({path:location.pathname,mainOpacity:m.opacity,titleOpacity:h.opacity,mainMask:m.clipPath,titleMask:h.clipPath,wipe:!!document.querySelector('.dc-motion-wipe'),busy:document.documentElement.classList.contains('is-navigating')})}
    for(const a of document.getAnimations().filter(a=>a.id==='dc-group-reveal')){const el=a.effect.target,s=getComputedStyle(el);window.dcRevealSamples.push({probe:el.dataset.probe,tag:el.tagName,opacity:Number(s.opacity),transform:s.transform,clip:s.clipPath,duration:a.effect.getTiming().duration,delay:a.effect.getTiming().delay,hero:!!el.closest('.hero')})}requestAnimationFrame(sample)});
  });
  const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(root,{waitUntil:'networkidle'});await p.waitForFunction(()=>document.documentElement.dataset.dcMotion==='idle');
  assert.equal(await p.locator('.dc-motion-wipe').count(),0);assert.equal(await p.locator('h1').evaluate(e=>getComputedStyle(e).opacity),'1');
  const target=p.locator('.local-projects > .local-copy').first();await target.evaluate(e=>e.dataset.probe='local-copy');
  assert.equal(await target.evaluate(e=>e.classList.contains('dc-reveal-pending')),true,'Only below-fold groups can wait to reveal');
  await target.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
  await p.waitForFunction(()=>window.dcRevealSamples.some(s=>s.probe==='local-copy'&&s.opacity>.05&&s.opacity<.95&&s.transform!=='none'));
  await p.waitForFunction(()=>!document.getAnimations().some(a=>a.id==='dc-group-reveal'));
  assert.equal(await target.evaluate(e=>getComputedStyle(e).opacity),'1');
  await p.evaluate(()=>{window.dcRevealSamples=[];scrollTo({top:0,behavior:'instant'})});await p.waitForFunction(()=>scrollY===0);await target.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await p.waitForTimeout(150);
  assert.equal(await p.evaluate(()=>window.dcRevealSamples.some(s=>s.probe==='local-copy')),false,'Repeated scroll never re-hides a revealed group');
  for(const path of paths){if(mobile)await p.locator('.menu-toggle').click();await p.locator(`#primary-nav a[href="${root}${path}"]`).click();await p.waitForURL(root+path);await p.waitForFunction(()=>!document.documentElement.classList.contains('is-navigating'));assert.equal(await p.evaluate(()=>window.dcStableDocument),true);assert.equal(await p.locator('#main').evaluate(e=>e===document.activeElement),true);assert.equal(await p.locator('h1').evaluate(e=>getComputedStyle(e).opacity),'1');checks.push({mobile,path,stableAjax:true,heroImmediatelyVisible:true})}
  await p.evaluate(({root,paths})=>{document.querySelector(`#primary-nav a[href="${root}${paths[0]}"]`).click();document.querySelector(`#primary-nav a[href="${root}${paths[1]}"]`).click()},{root,paths});await p.waitForURL(root+paths[1]);await p.waitForFunction(()=>!document.documentElement.classList.contains('is-navigating'));await p.goBack();await p.waitForURL(root+'/');await p.waitForFunction(()=>!document.documentElement.classList.contains('is-navigating'));
  const frames=await p.evaluate(()=>window.dcFrameSamples),reveals=await p.evaluate(()=>window.dcRevealSamples);
  assert(frames.length>10);assert(frames.every(f=>f.mainOpacity==='1'&&f.titleOpacity==='1'&&f.mainMask==='none'&&f.titleMask==='none'&&!f.wipe),'No frame dims or masks the whole page or hero');
  assert(reveals.every(s=>s.clip==='none'&&!s.hero&&s.duration>=500&&s.duration<=750&&s.delay<=90),'Only subtle group motion is used');
  await context.close();
 }
 const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const p=await reduced.newPage();await p.goto(root,{waitUntil:'networkidle'});assert.equal(await p.locator('.dc-reveal-pending').count(),0);assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.id==='dc-group-reveal').length),0);await reduced.close();
 const nojs=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});const n=await nojs.newPage();await n.goto(root);assert.equal(await n.locator('h1').evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await n.locator('#primary-nav').isVisible(),true);await nojs.close();
 assert.deepEqual(errors,[]);fs.mkdirSync('artifacts/test-results',{recursive:true});fs.writeFileSync('artifacts/test-results/motion.json',JSON.stringify({checks,frameVisibility:true,noShutter:true,noPageDimming:true,heroImmediate:true,groupRevealOnce:true,reducedMotion:true,noJavaScript:true,rapidNavigation:true,history:true,errors},null,2));console.log(`PASS:${checks.length} stable desktop/touch AJAX routes; no masked/dimmed hero/main frames, group-only reveal once, rapid navigation/history/reduced/noJS`);
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
