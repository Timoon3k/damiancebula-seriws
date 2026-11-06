const root = (process.env.BASE_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');
const mockMap = require('./mock-map.cjs');
const {chromium} = require('playwright');
const {default:AxeBuilder} = require('@axe-core/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const routes = ['/','/serwis-klimatyzacji-stalowa-wola/','/serwis-agd-stalowa-wola/','/realizacje/','/o-firmie/','/kontakt/','/polityka-prywatnosci/'];

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  const results = [];
  async function audit(page,width,route,state='page') {
    const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    results.push({width,route,state,violations:result.violations.map(v => ({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n => n.target)}))});
  }
  try {
    for (const width of [1440,390]) {
      const context = await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
      await mockMap(context);
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(root + route,{waitUntil:'networkidle'});
        await audit(page,width,route);
      }
      if (width === 390) {
        await page.getByRole('button',{name:/^Menu/}).click();
        assert.equal(await page.locator('#dc-mobile-menu').evaluate(el => el.matches(':modal')),true);
        await audit(page,width,routes[routes.length-1],'mobile-modal-open');
      }
      await context.close();
    }
    fs.mkdirSync('artifacts/test-results',{recursive:true});
    fs.writeFileSync('artifacts/test-results/accessibility.json',JSON.stringify(results,null,2));
    console.log(JSON.stringify(results.filter(result => result.violations.length),null,2));
    assert(results.every(result => !result.violations.length),'Accessibility violations');
    console.log(`PASS: ${results.length} axe WCAG A/AA checks, including the open mobile modal`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error);process.exitCode=1; });
