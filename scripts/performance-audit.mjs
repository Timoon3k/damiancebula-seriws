#!/usr/bin/env node
/** Reproducible local Lighthouse measurements; never a field-CWV or production claim. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(repo,'package.json'));
const options=Object.fromEntries(process.argv.slice(2).map(value=>{
  const separator=value.indexOf('=');
  return separator<0 ? [value.replace(/^--/,''),true] : [value.slice(0,separator).replace(/^--/,''),value.slice(separator+1)];
}));
if(options.help){
  console.log('Usage: node scripts/performance-audit.mjs [--runs=3] [--base-url=http://127.0.0.1:8081] [--lighthouse=/tmp/dc-performance/node_modules/lighthouse] [--out=artifacts/performance-architectural] [--skip-interactions]');
  process.exit(0);
}
const root=String(options['base-url']||process.env.BASE_URL||'http://127.0.0.1:8081').replace(/\/$/,'');
const origin=new URL(root);
if(!['127.0.0.1','localhost'].includes(origin.hostname)||!['http:','https:'].includes(origin.protocol)) throw new Error('This audit intentionally supports only an isolated local WordPress. It does not contact production.');
const runs=Number(options.runs||3);
if(!Number.isInteger(runs)||runs<1||runs>7) throw new Error('Choose 1–7 runs; the report records the actual count.');
const output=path.resolve(repo,String(options.out||'artifacts/performance-architectural'));
const rawDirectory=path.join(output,'raw');
const lighthouseRoot=path.resolve(String(options.lighthouse||process.env.LIGHTHOUSE_PACKAGE||'/tmp/dc-performance/node_modules/lighthouse'));
const cli=path.join(lighthouseRoot,'cli/index.js');
if(!fs.existsSync(cli)) throw new Error('Lighthouse is not installed. Install pinned Lighthouse 13.6.0 outside this repository, e.g. npm install --prefix /tmp/dc-performance --ignore-scripts lighthouse@13.6.0.');
const lighthouseVersion=JSON.parse(fs.readFileSync(path.join(lighthouseRoot,'package.json'),'utf8')).version;
const chromePath=process.env.CHROMIUM_PATH||'/usr/bin/chromium';
const routes=[{name:'home',path:'/'},{name:'climate',path:'/serwis-klimatyzacji-stalowa-wola/'},{name:'agd',path:'/serwis-agd-stalowa-wola/'}];
fs.mkdirSync(rawDirectory,{recursive:true});
const relevant=/\.(?:css|js|php|json|svg|webp|avif|woff2)$/;
function sourceFingerprint(){
  const files=[];
  function walk(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const absolute=path.join(directory,entry.name);if(entry.isDirectory())walk(absolute);else if(relevant.test(entry.name))files.push(absolute);}}
  walk(path.join(repo,'wp-content/themes/dc-serwis'));
  const digest=crypto.createHash('sha256');
  for(const file of files.sort()){digest.update(path.relative(repo,file));digest.update(fs.readFileSync(file));}
  return digest.digest('hex');
}
function median(numbers){const values=[...numbers].sort((a,b)=>a-b);const half=Math.floor(values.length/2);return values.length%2?values[half]:(values[half-1]+values[half])/2;}
function runNode(args){return new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,args,{cwd:repo,env:{...process.env,CHROME_PATH:chromePath},stdio:['ignore','pipe','pipe'],timeout:180000});
  let log='';
  const record=chunk=>{if(log.length<12000)log+=chunk.toString();};child.stdout.on('data',record);child.stderr.on('data',record);
  child.on('error',reject);child.on('close',code=>code===0?resolve():reject(new Error(`Lighthouse exited ${code}: ${log.slice(-5000)}`)));
});}
const themeHeader=fs.readFileSync(path.join(repo,'wp-content/themes/dc-serwis/style.css'),'utf8');
const themeVersion=themeHeader.match(/^Version:\s*(.+)$/m)?.[1].trim()||'unknown';
const gitHead=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
const fingerprintBefore=sourceFingerprint();
const startedAt=new Date().toISOString();
const auditRuns=[];
console.log(`Lighthouse ${lighthouseVersion}; theme ${themeVersion}; ${runs} cold-browser runs × 3 pages × 2 modes. Only local URLs.`);
for(const mode of ['mobile','desktop']){
  for(const route of routes){
    const response=await fetch(root+route.path,{redirect:'manual'});
    if(response.status!==200)throw new Error(`Local page is not HTTP200: ${route.path}: ${response.status}`);
    for(let index=1;index<=runs;index++){
      const filename=`${mode}-${route.name}-${index}.json`;
      const args=[cli,root+route.path,'--output=json',`--output-path=${path.join(rawDirectory,filename)}`,'--only-categories=performance','--throttling-method=simulate','--quiet','--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --disable-extensions'];
      if(mode==='desktop')args.push('--preset=desktop');
      await runNode(args);
      const lhr=JSON.parse(fs.readFileSync(path.join(rawDirectory,filename),'utf8'));
      if(lhr.runtimeError)throw new Error(`Lighthouse could not audit ${route.path}: ${lhr.runtimeError.message}`);
      const metrics=lhr.audits.metrics?.details?.items?.[0]||{};
      const requests=lhr.audits['network-requests']?.details?.items||[];
      const values={
        lcpMs:lhr.audits['largest-contentful-paint'].numericValue,
        cls:lhr.audits['cumulative-layout-shift'].numericValue,
        tbtMs:lhr.audits['total-blocking-time'].numericValue,
        fcpMs:lhr.audits['first-contentful-paint'].numericValue,
        speedIndexMs:lhr.audits['speed-index'].numericValue,
        transferBytes:lhr.audits['total-byte-weight'].numericValue,
        requestCount:requests.length,
        observedLcpMs:metrics.observedLargestContentfulPaint??null,
      };
      const externalRequests=requests.filter(request=>/^https?:/.test(request.url)&&new URL(request.url).origin!==origin.origin).map(request=>({url:request.url,transferBytes:request.transferSize||0}));
      auditRuns.push({mode,page:route.name,path:route.path,run:index,performanceScore:Math.round(lhr.categories.performance.score*100),...values,externalRequests,runWarnings:lhr.runWarnings||[],settings:lhr.configSettings,environment:lhr.environment,rawReport:path.relative(repo,path.join(rawDirectory,filename))});
      console.log(`${mode} ${route.name} ${index}/${runs}: LCP ${Math.round(values.lcpMs)}ms, CLS ${values.cls.toFixed(4)}, TBT ${Math.round(values.tbtMs)}ms, score ${Math.round(lhr.categories.performance.score*100)}`);
    }
  }
}
const medians=[];
for(const mode of ['mobile','desktop'])for(const route of routes){
  const group=auditRuns.filter(run=>run.mode===mode&&run.page===route.name);
  const result={mode,page:route.name,path:route.path,runs:group.length};
  for(const metric of ['performanceScore','lcpMs','cls','tbtMs','fcpMs','speedIndexMs','transferBytes','requestCount','observedLcpMs']){
    const values=group.map(run=>run[metric]).filter(Number.isFinite);
    result[metric]=values.length?median(values):null;
  }
  result.lcpTargetPassed=result.lcpMs<=2500;
  result.clsTargetPassed=result.cls<=.1;
  medians.push(result);
}
async function captureInteractions(){
  const {chromium}=require('playwright');
  const browser=await chromium.launch({executablePath:chromePath,args:['--no-sandbox']});
  const samples=[];
  let scriptedInteractionCount=0;
  try{
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    await context.route('**/*',route=>new URL(route.request().url()).origin===origin.origin?route.continue():route.abort('blockedbyclient'));
    await context.addInitScript(()=>{
      window.dcPerformanceEvents=[];
      window.dcEventTimingSupported=PerformanceObserver.supportedEntryTypes.includes('event');
      if(window.dcEventTimingSupported)new PerformanceObserver(list=>{for(const entry of list.getEntries())if(entry.interactionId)window.dcPerformanceEvents.push({name:entry.name,startTime:entry.startTime,duration:entry.duration,processingMs:entry.processingEnd-entry.processingStart,interactionId:entry.interactionId});}).observe({type:'event',buffered:true,durationThreshold:16});
    });
    const page=await context.newPage();
    const session=await context.newCDPSession(page);
    await session.send('Emulation.setCPUThrottlingRate',{rate:4});
    await page.goto(root,{waitUntil:'networkidle'});
    const supported=await page.evaluate(()=>window.dcEventTimingSupported);
    for(let index=0;index<3;index++){
      await page.locator('.menu-toggle').tap();scriptedInteractionCount++;
      await page.locator('#dc-mobile-menu').waitFor({state:'visible'});
      await page.getByRole('button',{name:'Zamknij menu'}).tap();scriptedInteractionCount++;
      await page.locator('#dc-mobile-menu').waitFor({state:'hidden'});
    }
    await page.waitForTimeout(100);
    samples.push(...(await page.evaluate(()=>window.dcPerformanceEvents)).map(entry=>({...entry,page:'home'})));
    await page.goto(root+routes[1].path,{waitUntil:'networkidle'});
    const summaries=page.locator('.faq summary');
    for(let index=0;index<Math.min(3,await summaries.count());index++){
      const summary=summaries.nth(index);
      await summary.tap();scriptedInteractionCount++;
      await summary.tap();scriptedInteractionCount++;
    }
    await page.waitForTimeout(100);
    samples.push(...(await page.evaluate(()=>window.dcPerformanceEvents)).map(entry=>({...entry,page:'climate'})));
    const interactions=new Map();
    for(const sample of samples){const key=`${sample.page}:${sample.interactionId}`;interactions.set(key,Math.max(interactions.get(key)||0,sample.duration));}
    const durations=[...interactions.values()].sort((a,b)=>a-b);
    return {method:'Synthetic trusted touch interactions, local network, real CDP 4x CPU throttling, reduced motion; not field INP',eventTimingSupported:supported,durationThresholdMs:16,scriptedInteractionCount,observedGroupedInteractions:durations.length,maxObservedInteractionMs:durations.length?Math.max(...durations):null,syntheticP98InteractionMs:durations.length?durations[Math.ceil(durations.length*.98)-1]:null,fieldInpMeasured:false,samples};
  }finally{await browser.close();}
}
const interactions=options['skip-interactions']?{fieldInpMeasured:false,status:'not run by request'}:await captureInteractions();
const sampleLhr=JSON.parse(fs.readFileSync(path.join(rawDirectory,'mobile-home-1.json'),'utf8'));
const assetUrls=[...new Set((sampleLhr.audits['network-requests']?.details?.items||[]).map(request=>request.url).filter(url=>/^https?:/.test(url)&&new URL(url).origin===origin.origin&&/\.(?:css|js|woff2|webp)(?:\?|$)/.test(url)))].slice(0,10);
const cacheHeaders=[];
for(const url of assetUrls){
  const response=await fetch(url,{method:'HEAD',redirect:'manual'});
  const headers={};
  for(const name of ['cache-control','expires','etag','last-modified','content-type','content-encoding','content-length'])headers[name]=response.headers.get(name);
  cacheHeaders.push({url,status:response.status,headers});
}
const fingerprintAfter=sourceFingerprint();
const summary={
  reportType:'Local laboratory performance audit; not field Core Web Vitals',
  startedAt,finishedAt:new Date().toISOString(),lighthouseVersion,chromeVersion:execFileSync(chromePath,['--version'],{encoding:'utf8'}).trim(),themeVersion,baseUrl:root,
  source:{gitHead,fingerprintBefore,fingerprintAfter,stableDuringAudit:fingerprintBefore===fingerprintAfter},
  method:{runsPerPageAndMode:runs,browserCache:'Lighthouse default storage reset; separate cold browser per run',serverCache:'Local PHP/database may be warm; no production CDN or LiteSpeed cache inferred',throttling:'Lighthouse simulated mobile slow4G/4xCPU and desktop preset; exact settings saved per run',runOrder:'Sequential mobile then desktop; no intentional parallel audits',thirdParty:'Only the local installation is targeted. External requests, if any, are listed per run; active production widgets are not assumed.'},
  targets:{lcpMs:2500,cls:.1,fieldInpMs:200},medians,interactions,cacheHeaders,auditRuns,
  limitations:['No production performance or real-user INP was measured.','Lighthouse TBT is not INP. EventTiming is a small scripted scenario, not a field percentile.','The separate local WordPress intentionally remains noindex; SEO scores are not used for performance acceptance.','Local network, server/cache configuration, plugins and third-party widgets differ from production.'],
};
fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(summary,null,2)+'\n');
const resultDirectory=path.join(repo,'artifacts/test-results');fs.mkdirSync(resultDirectory,{recursive:true});fs.writeFileSync(path.join(resultDirectory,'performance-architectural.json'),JSON.stringify(summary,null,2)+'\n');
if(!summary.source.stableDuringAudit)throw new Error('Theme runtime files changed during the audit. Results are saved but invalid for acceptance; rerun after the changes stop.');
console.log(`Saved ${path.relative(repo,path.join(output,'summary.json'))}; source stable; median targets: ${medians.every(result=>result.lcpTargetPassed&&result.clsTargetPassed)?'all LCP/CLS targets passed':'some LCP/CLS targets failed (see report)'}. Field INP remains unmeasured.`);
