import assert from 'node:assert/strict';
import {chromium} from 'playwright';

// Public-only read/write localStorage tests; no student, account or server data is changed.
const origin=(process.env.WORKSHOP_URL||'https://workshop-quantum-cohort-zero.hectorporras0916.workers.dev').replace(/\/$/,'');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:960},acceptDownloads:true});
page.setDefaultTimeout(18000);
const jsErrors=[];
page.on('pageerror',e=>jsErrors.push(String(e)));
try{
 const response=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:25000});
 assert.equal(response?.status(),200,'Live site must return HTTP 200');
 await page.locator('#day-nav [data-day]').first().waitFor();
 assert.equal(await page.locator('#day-nav [data-day]').count(),5);
 console.log('PASS BROWSER: five-day agenda renders in Chromium');

 const identity=await page.evaluate(()=>({
   href:location.href,
   title:document.title,
   canonical:document.querySelector('link[rel="canonical"]')?.href,
   icon:document.querySelector('link[rel="icon"]')?.getAttribute('href'),
   pageText:document.body.innerText,
   hrefs:[...document.querySelectorAll('a[href]')].map(a=>a.href),
   meta:[...document.querySelectorAll('meta[content]')].map(a=>a.content)
 }));
 assert.equal(identity.href,origin+'/','The public site should not redirect through another hostname');
 assert.equal(identity.canonical,origin+'/');
 assert.equal(identity.icon,'/favicon.svg');
 assert.ok(identity.title.startsWith('Workshop Quantum Cohort Zero'));
 const documentValues=[identity.title,identity.pageText,...identity.hrefs,...identity.meta];
 for(const value of documentValues)assert.ok(!/chatgpt|chat\.openai\.com|openai\.com/i.test(value),'Unexpected third-party branding or URL in public website');
 const favicon=await page.request.get(origin+'/favicon.svg');
 assert.equal(favicon.status(),200);
 assert.ok((await favicon.text()).includes('Quantum Zero workshop emblem'));
 console.log('PASS BROWSER: direct Cloudflare URL, independent title, favicon, canonical, all visible links and metadata have no ChatGPT branding');
 await page.context().grantPermissions(['clipboard-read','clipboard-write'],{origin});
 await page.locator('#copy-public-link').click();
 const copied=await page.evaluate(()=>navigator.clipboard.readText());
 assert.equal(copied,origin+'/');
 console.log('PASS BROWSER: Copy public website link copies only the clean workers.dev URL');

 await page.goto(origin+'/?utm_source=referral&utm_medium=chat&day=2026-11-09',{waitUntil:'domcontentloaded'});
 await page.locator('#day-nav [data-day]').first().waitFor();
 const cleanTracking=await page.evaluate(()=>({href:location.href,day:new URLSearchParams(location.search).get('day')}));
 assert.ok(!cleanTracking.href.includes('utm_'),'Tracking parameters must not remain in visible website URLs');
 assert.equal(cleanTracking.day,'2026-11-09','Clean link must preserve the selected workshop day');
 console.log('PASS BROWSER: inbound tracking labels disappear from address bar without losing selected workshop day');
 await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
 await page.locator('#day-nav [data-day]').first().waitFor();

 await page.locator('#tab-learn').click();
 await page.locator('#learning-content .topic-card').first().waitFor();
 assert.ok(await page.locator('#learning-content .topic-card').count()>=3);
 await page.locator('#learning-content .worked-exercise').first().waitFor();
 console.log('PASS BROWSER: detailed learning lessons and worked examples render');

 await page.locator('#tab-explore').click();
 await page.locator('.public-bloch-svg').waitFor();
 assert.equal(await page.locator('#bloch-presets [data-state]').count(),6);
 assert.equal(await page.locator('#bloch-basis [data-basis]').count(),3);
 await page.locator('#bloch-presets [data-state="|+⟩"]').click();
 await page.locator('#bloch-basis [data-basis="X"]').click();
 assert.equal((await page.locator('.public-measure-row strong').first().innerText()).trim(),'100%');
 await page.locator('#bloch-basis [data-basis="Z"]').click();
 assert.equal((await page.locator('.public-measure-row strong').first().innerText()).trim(),'50%');
 assert.ok((await page.locator('.public-state-formula').innerText()).includes('√2'));
 console.log('PASS BROWSER: Bloch six-state presets, X/Z bases and probability values');

 for(const gate of ['Reset','H','Z','H'])await page.locator('#bloch-gates [data-gate="'+gate+'"]').click();
 assert.equal((await page.locator('.public-measure-row strong').first().innerText()).trim(),'0%');
 assert.equal((await page.locator('.public-measure-row strong').nth(1).innerText()).trim(),'100%');
 assert.ok((await page.locator('.public-bloch-trace').innerText()).includes('H → Z → H'));
 console.log('PASS BROWSER: Reset → H → Z → H produces |1⟩ in Z basis');

 await page.locator('#tab-agenda').click();
 await page.locator('[data-agenda-lesson]').first().click();
 assert.equal(await page.locator('#tab-learn').getAttribute('aria-selected'),'true');
 assert.ok(await page.locator('.topic-card details[open]').count()>=1);
 console.log('PASS BROWSER: agenda Study this topic opens the correct learning tab');

 await page.locator('#tab-notes').click();
 await page.locator('#workshop-notes').fill('Workshop smoke-test note');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#day-nav [data-day]').first().waitFor();
 await page.locator('#tab-notes').click();
 assert.equal(await page.locator('#workshop-notes').inputValue(),'Workshop smoke-test note');
 console.log('PASS BROWSER: private browser-local notes survive page reload');

 await page.locator('#day-nav [data-day="1"]').click();
 await page.locator('#tab-explore').click();
 await page.locator('#pol-angle').evaluate(el=>{el.value='60';el.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.equal((await page.locator('#pol-result').innerText()).trim(),'25.0%');
 await page.locator('#bb84').click();
 assert.ok((await page.locator('#bb84-result').innerText()).includes('simulated'));
 console.log('PASS BROWSER: polarization and BB84 educational demos');

 await page.locator('#day-nav [data-day="4"]').click();
 await page.locator('#tab-explore').click();
 await page.locator('#wave-phase').evaluate(el=>{el.value='180';el.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.ok((await page.locator('#wave-status').innerText()).includes('0.000'));
 console.log('PASS BROWSER: Saturday interference simulator at 180°');

 await page.setViewportSize({width:390,height:844});
 await page.goto(origin+'/?day=2026-11-09',{waitUntil:'domcontentloaded'});
 await page.locator('#day-nav [data-day]').first().waitFor();
 await page.locator('#tab-explore').click();
 await page.locator('.public-bloch-svg').waitFor();
 await page.locator('#bloch-presets [data-state="|−i⟩"]').click();
 await page.locator('#bloch-basis [data-basis="Y"]').click();
 assert.equal((await page.locator('.public-measure-row strong').nth(1).innerText()).trim(),'100%');
 const mobile=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:window.innerWidth}));
 assert.ok(mobile.scrollWidth<=mobile.width+8,'Mobile document overflows horizontally: '+JSON.stringify(mobile));
 console.log('PASS BROWSER: mobile view, Y measurement and no horizontal overflow');

 assert.deepEqual(jsErrors,[],'Browser should not encounter uncaught JavaScript errors');
 console.log('PASS LIVE BROWSER: all public workshop interactions verified on desktop and mobile.');
} finally {
 await browser.close();
}