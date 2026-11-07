/** Local-only regression evidence for the 2.1 editorial, branding and footer refinements. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const mockMap=require('./mock-map.cjs');

const root=(process.env.BASE_URL||'http://127.0.0.1:8081').replace(/\/$/,'');
const origin=new URL(root).origin;
assert(['127.0.0.1','localhost'].includes(new URL(root).hostname),'Use an isolated local WordPress, never production.');
const routes=['/','/serwis-klimatyzacji-stalowa-wola/','/serwis-agd-stalowa-wola/','/realizacje/','/o-firmie/','/kontakt/','/polityka-prywatnosci/'];
const editorialCounts=new Map([[routes[0],3],[routes[1],2],[routes[2],2]]);
const expectedFooterLinks=[...routes.slice(0,6).map(route=>root+route),root+'/kontakt/',root+'/polityka-prywatnosci/','tel:+48794225139','https://majewskitomasz.pl/'].sort();
const screenshotDir=path.resolve('artifacts/screenshots/refinement');
const checkedAssets=new Set();

async function asset(page,url,kind,width){
  assert.equal(new URL(url).origin,origin,'Every tested asset is served locally');
  if(checkedAssets.has(url))return;
  const response=await page.request.get(url);
  assert.equal(response.status(),200,`Available ${kind}: ${url}`);
  const bytes=await response.body();
  assert(bytes.length>100,`Nonempty ${kind}: ${url}`);
  if(kind==='WebP'){
    assert.match(response.headers()['content-type'],/^image\/webp\b/);
    assert.equal(bytes.subarray(0,4).toString(),'RIFF');
    assert.equal(bytes.subarray(8,12).toString(),'WEBP');
  }else{
    assert.match(response.headers()['content-type'],/^image\/png\b/);
    assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
    assert.equal(bytes.readUInt32BE(16),width,`${width}px favicon width`);
    assert.equal(bytes.readUInt32BE(20),width,`${width}px favicon height`);
  }
  checkedAssets.add(url);
}

(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  const checks=[];const errors=[];const failedResources=[];const sceneSets=[];
  fs.mkdirSync(screenshotDir,{recursive:true});
  try{
    for(const width of [1440,768,390,360]){
      const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
      await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort('blockedbyclient'));
      await mockMap(context);
      const page=await context.newPage();
      page.on('pageerror',error=>errors.push(error.message));
      page.on('response',response=>{if(response.url().startsWith(root+'/')&&response.status()>=400)failedResources.push({url:response.url(),status:response.status()});});
      const scenes=[];
      for(const route of routes){
        const response=await page.goto(root+route,{waitUntil:'networkidle'});
        assert.equal(response.status(),200,route);
        await page.evaluate(async()=>{
          await document.fonts.ready;
          for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,30));}
          await Promise.all([...document.images].filter(image=>image.getAttribute('src')).map(image=>image.decode()));
          scrollTo(0,0);
        });
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width}px ${route}: no horizontal overflow`);
        const footer=page.locator('.site-footer');
        const footerData=await footer.evaluate(element=>({text:element.textContent,addresses:element.querySelectorAll('address').length,links:[...element.querySelectorAll('a[href]')].map(anchor=>anchor.href).sort()}));
        assert.equal(footerData.addresses,0,'No postal-address element remains in the footer');
        assert.doesNotMatch(footerData.text,/Aleje Jana Pawła II|37-450|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i,'Footer contains no address or email text');
        assert.deepEqual(footerData.links,expectedFooterLinks,'Footer retains precisely the navigation, phone, contact CTA, policy and creator links');
        const graphs=await page.locator('script[type="application/ld+json"]').evaluateAll(scripts=>scripts.flatMap(script=>{const value=JSON.parse(script.textContent);return value['@graph']||[value]}));
        const business=graphs.find(value=>[value['@type']].flat().includes('HVACBusiness'));
        assert.equal(business?.address?.streetAddress,'Aleje Jana Pawła II 42','Business schema still has the actual address');
        assert.equal(business.address.postalCode,'37-450');
        if(route==='/kontakt/'){
          const main=page.locator('#main');
          assert.match(await main.innerText(),/Aleje Jana Pawła II 42, 37-450 Stalowa Wola/,'Contact retains the postal address');
          assert((await main.locator('a[href="mailto:kontakt@damiancebula-serwis.pl"]').count())>=1,'Contact retains the email action');
        }
        if(editorialCounts.has(route)){
          const photos=await page.locator('.hero-media img,.service-card img,.split-section>figure img').evaluateAll(images=>images.map(image=>({src:image.src,currentSrc:image.currentSrc,srcset:image.srcset,alt:image.alt,natural:[image.naturalWidth,image.naturalHeight],hero:!!image.closest('.hero-media'),loading:image.loading,priority:image.fetchPriority})));
          assert.equal(photos.length,editorialCounts.get(route),`${route}: all authored illustration placements exist`);
          for(const photo of photos){
            assert(photo.natural.every(dimension=>dimension>0),'Every editorial photo decoded successfully');
            assert.match(photo.alt,/^Zdjęcie ilustracyjne: .{10,}/u,'An illustration is described accurately as an illustration');
            assert.equal(photo.loading,photo.hero?'eager':'lazy','Only the immediately visible hero is eager');
            assert.equal(photo.priority,photo.hero?'high':'low','Below-fold illustrations yield bandwidth to the hero');
            const stem=path.basename(new URL(photo.src).pathname).replace(/-\d+\.webp$/,'');
            assert.match(stem,/^editorial-architecture-[a-z-]+$/,'Only the illustrative image families are inspected');
            scenes.push(stem);
            assert.equal(new URL(photo.currentSrc).origin,origin);
            const candidates=photo.srcset.split(',').map(part=>{const [url,size]=part.trim().split(/\s+/);return {url,width:Number(size.replace(/w$/,''))}});
            assert.deepEqual(candidates.map(candidate=>candidate.width),[480,960,1536],'Every placement has the three responsive sizes');
            for(const candidate of candidates){
              assert.equal(path.basename(new URL(candidate.url).pathname),`${stem}-${candidate.width}.webp`,'srcset variants belong to this particular scene');
              await asset(page,candidate.url,'WebP');
            }
          }
        }
        let composition;
        if(route==='/'){
          composition=await page.locator('.services>.service-card').first().evaluate(card=>{
            const heading=card.querySelector('h2').getBoundingClientRect();
            const intro=card.querySelector('p').getBoundingClientRect();
            const photo=card.querySelector('figure').getBoundingClientRect();
            return {headingBottom:heading.bottom,introBottom:intro.bottom,headingTop:heading.top,photoTop:photo.top,photoBottom:photo.bottom};
          });
          if(width<=390){
            assert(composition.headingBottom<=composition.photoTop&&composition.introBottom<=composition.photoTop,'Mobile Climate heading and description precede its photo');
          }else if(width===1440){
            assert(composition.photoBottom<=composition.headingTop,'Desktop Climate remains a photo-first composition');
          }
          const brand=await page.locator('.brand').evaluate(element=>{
            const flood=element.querySelector('#dc-brand-copper .brand-ink-color');
            return {flood:flood?getComputedStyle(flood).floodColor:null,accent:getComputedStyle(document.querySelector('.home-hero .accent')).color,filter:getComputedStyle(element.querySelector('img')).filter};
          });
          assert.equal(brand.flood,'rgb(156, 79, 44)','SVG alpha treatment uses the exact copper ink');
          assert.equal(brand.flood,brand.accent,'Logo ink and highlighted hero text have the same computed color');
          assert(brand.filter.includes('#dc-brand-copper'),'The visible logo uses the SVG copper filter');
          const icons=await page.locator('head link[rel="icon"],head link[rel="apple-touch-icon"]').evaluateAll(links=>links.map(link=>({rel:link.rel,sizes:link.sizes.value,href:link.href})));
          for(const size of [32,192,180]){
            const icon=icons.find(icon=>size===180?icon.rel==='apple-touch-icon':icon.rel==='icon'&&icon.sizes===`${size}x${size}`);
            assert(icon,`Native ${size}px favicon link is present`);
            const url=new URL(icon.href);
            assert.equal(url.searchParams.get('ver'),'2.1.0','Favicon is versioned with the new theme');
            assert.equal(path.basename(url.pathname),`dc-favicon-copper-${size}.png`);
            await asset(page,url.href,'PNG',size);
          }
          // Capture-only paint hint: Chromium otherwise culls off-screen sizes=auto photos.
          await page.addStyleTag({content:'img{content-visibility:visible!important}'});
          if([1440,768,390].includes(width))await page.screenshot({path:path.join(screenshotDir,`home-${width}.png`),fullPage:true,animations:'disabled'});
          if([1440,390].includes(width))await footer.screenshot({path:path.join(screenshotDir,`footer-${width}.png`),animations:'disabled'});
          if(width<=390){
            await page.evaluate(()=>scrollTo(0,0));
            await page.locator('.brand').screenshot({path:path.join(screenshotDir,`logo-${width}.png`),animations:'disabled'});
          }
        }
        checks.push({width,route,footerContactDetailsRemoved:true,requiredFooterLinks:footerData.links.length,schemaAddressPreserved:true,...(composition?{composition}:{} )});
      }
      assert.equal(scenes.length,7,'Seven illustrations are checked across home, Climate and AGD');
      assert.equal(new Set(scenes).size,7,'Every authored placement uses a different scene, including between pages');
      sceneSets.push({width,scenes});
      await context.close();
    }
    assert.deepEqual(errors,[],'No page JavaScript errors');
    assert.deepEqual(failedResources,[],'No failed local assets');
    fs.mkdirSync('artifacts/test-results',{recursive:true});
    fs.writeFileSync('artifacts/test-results/editorial-refinement.json',JSON.stringify({version:'2.1.0',checks,sceneSets,checkedResponsiveAssets:checkedAssets.size,logoExactCopper:true,faviconsVersionedAndDecoded:true,externalMapMocked:true,cityPhotoVerification:'pending-network-access',realCityPhotoObtained:false,errors,failedResources},null,2)+'\n');
    console.log(`PASS: ${checks.length} local refinement views; seven distinct scenes, mobile/desktop ordering, clean footer, preserved Contact/schema, exact copper logo and versioned PNG favicons.`);
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
