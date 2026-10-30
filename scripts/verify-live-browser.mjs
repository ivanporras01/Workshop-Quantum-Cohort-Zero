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

 await page.locator('#start-beginner-learning').click();
 assert.equal(await page.locator('#tab-learn').getAttribute('aria-selected'),'true','Primary button should open beginner learning');
 assert.match(await page.locator('#topic-0-0 [data-beginner-title]').innerText(),/computing/i);
 console.log('PASS BROWSER: homepage Start learning from zero opens the first beginner explanation');
 await page.locator('#tab-learn').click();
 await page.locator('#learning-content .topic-card').first().waitFor();
 assert.ok(await page.locator('#learning-content .topic-card').count()>=3);
 await page.locator('#learning-content .guided-worked').first().waitFor();
 const teachingOrder=await page.locator('#topic-0-0').evaluate(node=>{
   const selectors=['.concept-opening','.concept-teaching','.visual-exhibit','.guided-worked','.lesson-practice','.lesson-takeaway'];
   return selectors.map(selector=>node.querySelector(selector)?.getBoundingClientRect().top ?? -1);
 });
 assert.ok(teachingOrder.every((x,i)=>x>=0&&(i===0||x>teachingOrder[i-1])),'Concept-first instructional order');
 assert.match(await page.locator('#learning-content .learning-hero h3').innerText(),/curiosity becomes discovery/i);
 assert.equal(await page.locator('#learning-content .visual-exhibit').count(),4);
 await page.locator('#topic-0-0 .visual-choice').nth(1).click();
 assert.match(await page.locator('#topic-0-0 .visual-reveal').innerText(),/ideal qubit.*operation.*basis/i);
 const guided=page.locator('#topic-0-0 [data-guided-example]');
 assert.match(await guided.locator('[data-guided-progress]').innerText(),/Step 1 of 4/);
 await guided.locator('[data-guided-next]').click();
 assert.match(await guided.locator('[data-guided-progress]').innerText(),/Step 2 of 4/);
 await guided.locator('[data-guided-next]').click();
 await guided.locator('[data-guided-next]').click();
 assert.ok(await guided.locator('[data-guided-result]').isVisible());
 await guided.locator('[data-guided-reset]').click();
 assert.match(await guided.locator('[data-guided-progress]').innerText(),/Step 1 of 4/);
 console.log('PASS BROWSER: concept-first welcome, four vivid visuals and guided examples with revealed results');
 await page.locator('.lesson-jump-link[href="#topic-0-1"]').click();
 assert.ok(await page.locator('#topic-0-1 > details').evaluate(el=>el.open),'Topic navigation must expand the selected lesson');

 const firstConcept=page.locator('#topic-0-1 [data-beginner-guide]');
 assert.match(await firstConcept.locator('[data-beginner-title]').innerText(),/classical bit/i);
 await firstConcept.locator('[data-beginner-next]').click();
 assert.match(await firstConcept.locator('[data-beginner-title]').innerText(),/qubit/i);
 assert.match(await firstConcept.locator('[data-beginner-text]').innerText(),/probability amplitudes/i);
 await firstConcept.locator('[data-beginner-step="4"]').click();
 assert.match(await firstConcept.locator('[data-beginner-text]').innerText(),/Hadamard/i);
 const sphere=page.locator('#topic-0-1 [data-qubit-lesson]');
 await sphere.locator('.public-bloch-svg').waitFor();
 assert.equal(await sphere.locator('[data-state]').count(),6);
 for(const g of ['H','X','Y','Z','S','T','Reset'])assert.equal(await sphere.locator('[data-gate="'+g+'"]').count(),1);
 await sphere.locator('[data-qubit-theta]').evaluate(el=>{el.value='90';el.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.equal((await sphere.locator('[data-qubit-p0]').innerText()).trim(),'50%');
 assert.equal((await sphere.locator('[data-qubit-p1]').innerText()).trim(),'50%');
 await sphere.locator('[data-qubit-phi]').evaluate(el=>{el.value='90';el.dispatchEvent(new Event('input',{bubbles:true}));});
 await sphere.locator('[data-basis="Y"]').click();
 assert.equal((await sphere.locator('.public-measure-row strong').first().innerText()).trim(),'100%');
 await sphere.locator('[data-state="|0⟩"]').click();
 await sphere.locator('[data-gate="H"]').click();
 assert.equal((await sphere.locator('[data-qubit-p0]').innerText()).trim(),'50%');
 console.log('PASS BROWSER: beginner bit vs qubit teaching, Bloch θ/φ controls, S/T gates, X/Y/Z bases, live probabilities');

 // Embedded sphere changes must not alter the independent Explore experiment.
 await page.locator('#tab-explore').click();
 await page.locator('#panel-explore .public-bloch-svg').waitFor();
 assert.equal((await page.locator('#panel-explore .public-measure-row strong').first().innerText()).trim(),'100%','Explore keeps its initial state after embedded lesson interactions');

 assert.equal(await page.locator('#bloch-presets [data-state]').count(),6);
 assert.equal(await page.locator('#bloch-basis [data-basis]').count(),3);
 await page.locator('#bloch-presets [data-state="|+⟩"]').click();
 await page.locator('#bloch-basis [data-basis="X"]').click();
 assert.equal((await page.locator('#panel-explore .public-measure-row strong').first().innerText()).trim(),'100%');
 await page.locator('#bloch-basis [data-basis="Z"]').click();
 assert.equal((await page.locator('#panel-explore .public-measure-row strong').first().innerText()).trim(),'50%');
 assert.ok((await page.locator('#panel-explore .public-state-formula').innerText()).includes('√2'));
 console.log('PASS BROWSER: Bloch six-state presets, X/Z bases and probability values');

 for(const gate of ['Reset','H','Z','H'])await page.locator('#bloch-gates [data-gate="'+gate+'"]').click();
 assert.equal((await page.locator('#panel-explore .public-measure-row strong').first().innerText()).trim(),'0%');
 assert.equal((await page.locator('#panel-explore .public-measure-row strong').nth(1).innerText()).trim(),'100%');
 assert.ok((await page.locator('#panel-explore .public-bloch-trace').innerText()).includes('H → Z → H'));
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

 const expectedCounts=[4,4,3,3,4];
 for(let day=0;day<5;day++){
   await page.locator('#day-nav [data-day="'+day+'"]').click();
   await page.locator('#tab-learn').click();
   const num=await page.locator('#learning-content .enhanced-topic').count();
   assert.equal(num,expectedCounts[day],'Unexpected number of lessons on workshop day '+day);
   for(const selector of ['.beginner-guide','.concept-opening','.concept-teaching','.visual-exhibit','.guided-worked','.lesson-practice','.lesson-takeaway']){
     assert.equal(await page.locator('#learning-content .enhanced-topic '+selector).count(),num,'Incomplete learning progression: '+selector+' on day '+day);
   }
 }
 console.log('PASS BROWSER: every one of 18 lessons follows concept → explanation → visualization → guided example → questions → takeaway');

 await page.locator('#day-nav [data-day="4"]').click();
 await page.locator('#tab-learn').click();
 await page.locator('#topic-4-2 > details').evaluate(el=>el.open=true);
 const lab=page.locator('#topic-4-2 [data-lab-guide]');
 await lab.locator('.lab-diagram-link img').waitFor();
 assert.ok((await lab.locator('.lab-diagram-link').getAttribute('href')).includes('/src/applied-waves-circuit.svg'));
 assert.equal(await lab.locator('[data-lab-step]').count(),8);
 assert.equal(await lab.locator('.lab-material').count(),7);
 assert.equal(await lab.locator('.lab-result-card').count(),3);
 await lab.locator('[data-lab-step="0"]').check();
 assert.match(await lab.locator('[data-lab-progress]').innerText(),/1 of 8/);
 await lab.locator('[data-lab-reset]').click();
 assert.match(await lab.locator('[data-lab-progress]').innerText(),/0 of 8/);
 await lab.locator('[data-lab-phase]').evaluate(el=>{el.value='90';el.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.equal((await lab.locator('[data-lab-vpp]').innerText()).trim(),'1.414 Vpp');
 assert.equal((await lab.locator('[data-lab-ratio]').innerText()).trim(),'0.500');
 await lab.locator('[data-lab-phase]').evaluate(el=>{el.value='180';el.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.equal((await lab.locator('[data-lab-vpp]').innerText()).trim(),'0.000 Vpp');
 assert.match(await lab.locator('.lab-quantum-takeaway').innerText(),/cos²/);
 console.log('PASS BROWSER: full Saturday circuit diagram, materials, guided wiring, checklist, numerical results and quantum analogy');

 await page.locator('#tab-explore').click();
 await page.locator('#wave-phase').evaluate(el=>{el.value='180';el.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.ok((await page.locator('#wave-status').innerText()).includes('0.000'));
 console.log('PASS BROWSER: Saturday interference simulator at 180°');

 await page.setViewportSize({width:390,height:844});
 await page.goto(origin+'/?day=2026-11-09',{waitUntil:'domcontentloaded'});
 await page.locator('#day-nav [data-day]').first().waitFor();
 await page.locator('#tab-explore').click();
 await page.locator('#panel-explore .public-bloch-svg').waitFor();
 await page.locator('#bloch-presets [data-state="|−i⟩"]').click();
 await page.locator('#bloch-basis [data-basis="Y"]').click();
 assert.equal((await page.locator('#panel-explore .public-measure-row strong').nth(1).innerText()).trim(),'100%');
 const mobile=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:window.innerWidth}));
 assert.ok(mobile.scrollWidth<=mobile.width+8,'Mobile document overflows horizontally: '+JSON.stringify(mobile));
 console.log('PASS BROWSER: mobile view, Y measurement and no horizontal overflow');

 // Exercise the new concept lessons on the mobile viewport as well.
 assert.equal(await page.locator('[data-concept]').count(),8);
 await page.locator('[data-concept="superposition"]').click();
 await page.locator('#qa-basis').selectOption('X');
 await page.locator('[data-qa-action="sample"]').click();
 assert.match(await page.locator('[data-qa-visual]').innerText(),/200 shots/);
 assert.equal(await page.locator('.qa-bars').first().locator('strong').first().innerText(),'100.0%');
 await page.locator('[data-concept="entanglement"]').click();
 await page.locator('#qa-basisA').selectOption('X');
 await page.locator('#qa-basisB').selectOption('X');
 assert.deepEqual(await page.locator('.qa-bars').first().locator('strong').allTextContents(),['50.0%','0.0%','0.0%','50.0%']);
 await page.locator('#qa-kind').selectOption('mixture');
 assert.deepEqual(await page.locator('.qa-bars').first().locator('strong').allTextContents(),['25.0%','25.0%','25.0%','25.0%']);
 await page.locator('[data-concept="teleportation"]').click();
 for(let branch=0;branch<4;branch++){
   await page.locator('#qa-outcome').selectOption(String(branch));
   for(let step=0;step<4;step++)await page.locator('[data-qa-action="next"]').click();
   assert.match(await page.locator('.qa-teleport-scene').innerText(),/Ideal fidelity = 100.0%/);
   assert.ok(await page.locator('[data-qa-action="next"]').isDisabled());
 }
 await page.locator('[data-concept="interference"]').click();
 await page.locator('[data-qa-action="phase180"]').click();
 assert.deepEqual(await page.locator('.qa-bars').last().locator('strong').allTextContents(),['0.0%','100.0%']);
 await page.locator('[data-concept="gates"]').click();
 await page.locator('[data-qa-action="HZH"]').click();
 assert.deepEqual(await page.locator('.qa-bars strong').allTextContents(),['0.0%','100.0%']);
 await page.locator('[data-concept="nocloning"]').click();
 assert.match(await page.locator('.qa-result').innerText(),/Bell pair/);
 await page.locator('[data-concept="noise"]').click();
 await page.locator('[data-qa-action="noise50"]').click();
 assert.deepEqual(await page.locator('.qa-bars').last().locator('strong').allTextContents(),['75.0%','25.0%']);
 await page.locator('[data-concept="security"]').click();
 await page.locator('#qa-eve').selectOption('on');
 assert.match(await page.locator('.qa-stat-grid').innerText(),/25.0%/);
 console.log('PASS BROWSER: eight concept lessons, fresh shots, Bell comparison, four teleportation branches, phase, gates, no-cloning, dephasing and QKD');
 for(let d=0;d<5;d++){
   await page.locator('[data-journey-day="'+d+'"]').click();
   assert.match(await page.locator('.day-plan-purpose').innerText(),/./);
   await page.locator('.day-plan-details summary').click();
   assert.equal(await page.locator('.day-sequence article').count(),expectedCounts[d]);
   await page.locator('[data-day-study="0"]').click();
   assert.ok(await page.locator('#panel-learn').isVisible());
   await page.locator('.day-concept-links button').first().click();
   assert.ok(await page.locator('#qa-panel h3').isVisible());
 }
 for(const concept of ['superposition','entanglement','teleportation','interference','gates','nocloning','noise','security']){
   await page.locator('[data-concept="'+concept+'"]').click();
   const size=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
   assert.ok(size.scrollWidth<=size.width+8,concept+' overflows mobile viewport: '+JSON.stringify(size));
 }
 console.log('PASS BROWSER: five daily plans, lesson links, concept links and mobile layout for all eight models');

 assert.deepEqual(jsErrors,[],'Browser should not encounter uncaught JavaScript errors');
 console.log('PASS LIVE BROWSER: all public workshop interactions verified on desktop and mobile.');
} finally {
 await browser.close();
}
