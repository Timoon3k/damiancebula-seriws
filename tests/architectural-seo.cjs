/** Semantic before/after comparison using the actual pre-change local HTML. */
const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const assert=require('node:assert/strict');
const repo=path.resolve(__dirname,'..');const root=(process.env.BASE_URL||'http://127.0.0.1:8081').replace(/\/$/,'');const origin=new URL(root).origin;
const baselineFile=path.join(__dirname,'fixtures/architectural-baseline.json');
const routes=['/','/serwis-klimatyzacji-stalowa-wola/','/serwis-agd-stalowa-wola/','/realizacje/','/o-firmie/','/kontakt/','/polityka-prywatnosci/'];
function collect({html,url}){
 const doc=html?new DOMParser().parseFromString(html,'text/html'):document;
 if(html){const base=doc.createElement('base');base.href=url;doc.head.prepend(base)}
 const clean=v=>(v||'').replace(/\s+/gu,' ').trim();
 const main=doc.querySelector('#main');if(!main)throw new Error('No main in captured page');
 const copy=main.cloneNode(true);copy.querySelectorAll('.architectural-hero-cta').forEach(el=>el.remove());
 return {text:clean(copy.textContent),headings:[...main.querySelectorAll('h1,h2,h3')].map(el=>({tag:el.tagName,text:clean(el.textContent)})),legalAndSeoText:[...main.querySelectorAll('p,summary,li,address')].filter(el=>!el.closest('.architectural-hero-cta')).map(el=>clean(el.textContent)),title:doc.title,metadata:[...doc.head.querySelectorAll('meta[name="description"],meta[name="robots"],meta[name^="twitter:"],meta[property^="og:"]')].map(el=>({name:el.getAttribute('name')||el.getAttribute('property'),content:el.content})),canonical:[...doc.querySelectorAll('link[rel="canonical"]')].map(el=>el.href),schema:[...doc.querySelectorAll('script[type="application/ld+json"]')].map(el=>JSON.parse(el.textContent)),links:[...doc.querySelectorAll('a[href]')].filter(el=>!el.closest('.architectural-hero-cta,.footer-menu')).map(el=>({href:el.href,text:clean(el.textContent)})),galleries:[...main.querySelectorAll('.mini-gallery a,.gallery-grid a')].map(el=>({href:el.href,src:el.querySelector('img').src,alt:el.querySelector('img').alt,caption:clean(el.closest('figure').querySelector('figcaption')?.textContent)})),lang:doc.documentElement.lang};
}
function normalize(v){if(typeof v==='string')return v.split(origin).join('__ORIGIN__');if(Array.isArray(v))return v.map(normalize);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,normalize(x)]));return v}
function xrobots(headers){const entry=Object.entries(headers||{}).find(([k])=>k.toLowerCase()==='x-robots-tag');return entry?String(entry[1]):''}
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});let baseline;
 try{const context=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce'});await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());const page=await context.newPage();
 if(process.argv.includes('--record-from-raw')){
  assert(!fs.existsSync(baselineFile),'Never overwrite pre-change evidence');
  const rawFile='/tmp/dc-architectural-seo/local-before-raw.json';const raw=JSON.parse(fs.readFileSync(rawFile,'utf8'));assert.equal(raw.length,7);
  const pages=[];for(const entry of raw){assert.equal(entry.status,200);const data=await page.evaluate(collect,{html:entry.html,url:root+entry.route});pages.push({route:entry.route,httpStatus:entry.status,xRobotsTag:xrobots(entry.headers),...normalize(data)})}
  const images=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/premium-baseline.json'),'utf8')).protectedImages;
  baseline={sourceCommit:'c007e40',source:'Actual HTTP HTML captured before architectural changes; semantic extraction excludes only the explicitly new hero CTA and footer navigation.',capturedAt:fs.statSync(rawFile).mtime.toISOString(),pages,protectedImages:images};fs.writeFileSync(baselineFile,JSON.stringify(baseline,null,2)+'\n');console.log('RECORDED: pre-change HTTP HTML semantic baseline, including OG/Twitter, legal text and29 protected images');return;
 }
 baseline=JSON.parse(fs.readFileSync(baselineFile,'utf8'));const checks=[];
 for(const before of baseline.pages){const response=await page.goto(root+before.route,{waitUntil:'domcontentloaded'});const after={route:before.route,httpStatus:response.status(),xRobotsTag:xrobots(await response.allHeaders()),...normalize(await page.evaluate(collect,{html:null,url:root+before.route}))};assert.deepEqual(after,before,`SEO/text/link/photo change on ${before.route}`);checks.push({route:before.route,unchanged:true})}
 for(const [file,hash]of Object.entries(baseline.protectedImages)){const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,file))).digest('hex');assert.equal(actual,hash,`Client image modified: ${file}`)}
 const report={version:'2.0.0',sourceCommit:baseline.sourceCommit,baselineCapturedAt:baseline.capturedAt,pages:checks,protectedImages:Object.keys(baseline.protectedImages).length,headingsTextLegalMetadataOgTwitterCanonicalRobotsSchemaLinksGalleryUnchanged:true,productionSnapshotVerified:false,productionReason:'Network proxy denies the production host; local baseline is explicitly separate.',databaseReset:false};fs.mkdirSync(path.join(repo,'artifacts/test-results'),{recursive:true});fs.writeFileSync(path.join(repo,'artifacts/test-results/architectural-seo.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS:7 complete local SEO/text/social/schema/legal/gallery snapshots unchanged;29 client files unchanged; production separately pending');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
