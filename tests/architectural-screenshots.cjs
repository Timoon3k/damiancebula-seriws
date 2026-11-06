/** Local visual evidence. The before view replays captured HTML with c007e40 assets. */
const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');const crypto=require('node:crypto');
const repo=path.resolve(__dirname,'..');
const root=(process.env.BASE_URL||'http://127.0.0.1:8081').replace(/\/$/,'');
const origin=new URL(root).origin;
assert(['127.0.0.1','localhost'].includes(new URL(root).hostname),'Only isolated local WordPress is supported');
const rawFile=process.env.DC_BEFORE_HTML||'/tmp/dc-architectural-seo/local-before-raw.json';
assert(fs.existsSync(rawFile),'Provide the actual pre-change local HTTP capture in DC_BEFORE_HTML; never fabricate a before view.');
const raw=JSON.parse(fs.readFileSync(rawFile,'utf8'));
assert.equal(raw.length,7);
const beforeCommit='c007e40592628316a4484f4b7236aeea2cf9246c';
const assetPrefix='/wp-content/themes/dc-serwis/';
const assetCache=new Map();
const mime={'.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.png':'image/png'};
const output=path.join(repo,'docs/visual/architectural');
const captures=[];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const stage of ['before','after']){
   fs.mkdirSync(path.join(output,stage),{recursive:true});
   for(const width of [1440,768,390]){
    const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
    for(const entry of raw){
     const page=await context.newPage();
     await page.route('**/*',async route=>{
      const request=route.request();const url=new URL(request.url());
      if(url.hostname==='www.google.com'&&url.pathname.startsWith('/maps'))return route.fulfill({contentType:'text/html; charset=utf-8',body:'<!doctype html><html lang="pl"><title>Mapa testowa</title><body style="margin:0;display:grid;place-items:center;height:100vh;background:#dde5e1;color:#192e33;font:16px sans-serif"><p>Mapa Google — lokalna atrapa testowa</p></body></html>'});
      if(url.origin!==origin)return route.abort('blockedbyclient');
      if(stage==='before'&&request.isNavigationRequest()&&request.frame()===page.mainFrame())return route.fulfill({contentType:'text/html; charset=utf-8',body:entry.html});
      if(stage==='before'&&url.pathname.startsWith(assetPrefix)){
       const relative='wp-content/themes/dc-serwis/'+decodeURIComponent(url.pathname.slice(assetPrefix.length));
       if(relative.split('/').includes('..'))return route.abort();
       if(!assetCache.has(relative))assetCache.set(relative,execFileSync('git',['show',beforeCommit+':'+relative],{cwd:repo,maxBuffer:32*1024*1024}));
       return route.fulfill({contentType:mime[path.extname(relative)]||'application/octet-stream',body:assetCache.get(relative)});
      }
      return route.continue();
     });
     const response=await page.goto(root+entry.route,{waitUntil:'networkidle'});assert.equal(response.status(),200);
     await page.evaluate(async()=>{
      await document.fonts.ready;
      for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,35));}
      await Promise.all([...document.images].filter(image=>image.getAttribute('src')).map(image=>image.decode()));
      scrollTo(0,0);
     });
     // Chromium may cull off-screen sizes="auto" images in full-page captures.
     // This capture-only style forces painting; production CSS remains unchanged.
     await page.addStyleTag({content:'img{content-visibility:visible!important}'});
     await page.locator('.map-viewport').evaluateAll(viewports=>viewports.forEach(viewport=>{
      const note=document.createElement('p');note.textContent='Mapa Google — lokalna atrapa testowa';
      note.style.cssText='position:absolute;inset:0;display:grid;place-items:center;margin:0;padding:24px;text-align:center;background:#dde5e1;color:#192e33;font:14px sans-serif;pointer-events:none';
      viewport.style.position='relative';viewport.append(note);
     }));
     await page.waitForTimeout(150);
     const name=entry.route==='/'?'home':entry.route.split('/')[1];
     const file=path.join(output,stage,`${name}-${width}.jpg`);
     await page.screenshot({path:file,type:'jpeg',quality:84,fullPage:true,animations:'disabled'});
     captures.push({stage,route:entry.route,width,file:path.relative(repo,file),bytes:fs.statSync(file).size});
     await page.close();
    }
    await context.close();
   }
   console.log(`Captured ${stage}: seven pages at 1440/768/390px.`);
  }
  const report={capturedAt:new Date().toISOString(),beforeCommit,beforeSource:'Actual pre-change local HTTP HTML, replayed with original theme assets from Git; not a production screenshot.',beforeHtmlSha256:crypto.createHash('sha256').update(fs.readFileSync(rawFile)).digest('hex'),afterSource:'Current running isolated WordPress at '+root,reducedMotion:true,externalMap:'Explicitly labelled local test placeholder; no contact with Google.',captureOnlyStyle:'content-visibility:visible on images prevents off-screen Chromium culling in full-page captures.',captures};
  fs.mkdirSync(path.join(repo,'artifacts/test-results'),{recursive:true});fs.writeFileSync(path.join(repo,'artifacts/test-results/architectural-visual.json'),JSON.stringify(report,null,2)+'\n');
  console.log('PASS: 42 local before/after screenshots; production was not accessed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
