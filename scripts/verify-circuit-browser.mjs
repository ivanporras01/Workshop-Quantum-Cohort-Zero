import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const origin=(process.env.WORKSHOP_URL||'https://workshop-quantum-cohort-zero.hectorporras0916.workers.dev').replace(/\/$/,'');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
const page=await context.newPage();page.setDefaultTimeout(18000);
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const action=id=>page.locator('[data-action="'+id+'"]');
const joint=()=>page.locator('#joint-probabilities strong').allTextContents();
async function download(id){const promise=page.waitForEvent('download');await action(id).click();const d=await promise;return {name:d.suggestedFilename(),text:await readFile(await d.path(),'utf8')};}
try{
 const response=await page.goto(origin+'/circuit-lab.html',{waitUntil:'domcontentloaded'});
 assert.equal(response.status(),200);await page.locator('#qubit-count').waitFor();
 assert.equal(await page.locator('[data-gate-pick]').count(),38);
 assert.equal(await page.locator('[data-orbit]').count(),1);
 await page.locator('[data-gate-pick="H"]').click();await action('add').click();
 assert.deepEqual(await joint(),['50.0%','50.0%']);
 await action('undo').click();assert.deepEqual(await joint(),['100.0%','0.0%']);await action('redo').click();
 await page.locator('#measure-basis').selectOption('X');assert.deepEqual(await page.locator('#local-probabilities strong').allTextContents(),['100.0%','0.0%']);
 console.log('PASS CIRCUIT: H, undo/redo and basis predictions.');

 await page.locator('#example').selectOption('Bell pair');
 assert.equal(await page.locator('[data-orbit]').count(),2);
 assert.deepEqual(await joint(),['50.0%','0.0%','0.0%','50.0%']);
 assert.equal(await page.locator('.sphere-values').filter({hasText:'Purity 0.500'}).count(),2);
 await action('start').click();assert.match(await page.locator('#step-position').innerText(),/Step 0 \/ 2/);
 await action('next').click();assert.match(await page.locator('#step-position').innerText(),/Step 1 \/ 2/);
 await action('end').click();await page.locator('#measure-basis').selectOption('Z');
 await page.locator('#shots').fill('1000');await action('sample').click();assert.match(await page.locator('#shot-summary').innerText(),/1000 shots · Z basis/);
 await action('measure').click();const measured=await joint();assert.equal(measured.filter(p=>p==='100.0%').length,1);assert.ok(measured[0]==='100.0%'||measured[3]==='100.0%');await action('end').click();
 assert.deepEqual(await joint(),['50.0%','0.0%','0.0%','50.0%']);
 await page.locator('#qubit-count').selectOption('1');assert.match(await page.locator('#lab-status').innerText(),/Remove gates/);assert.equal(await page.locator('#qubit-count').inputValue(),'2');
 console.log('PASS CIRCUIT: Bell reduced states, step playback, sampling, measurement collapse and wire validation.');

 await page.locator('[data-column="1"]').click();await page.locator('[data-gate-pick="CP"]').click();
 await page.locator('#gate-control').selectOption('0');await page.locator('#gate-target').selectOption('1');await page.locator('[data-param="0"]').fill('45');await action('update').click();
 let exported=JSON.parse((await download('json')).text);assert.equal(exported.ops[1].gate,'CP');assert.equal(exported.ops[1].params[0],45);
 await action('left').click();exported=JSON.parse((await download('json')).text);assert.equal(exported.ops[0].gate,'CP');
 await action('right').click();await action('duplicate').click();assert.equal(await page.locator('[data-column]').count(),3);
 await action('delete').click();assert.equal(await page.locator('[data-column]').count(),2);
 await page.locator('#project-name').fill('Classroom circuit');await download('json');
 assert.equal(JSON.parse((await download('json')).text).name,'Classroom circuit');
 const py=await download('qiskit');assert.equal(py.name,'quantum-circuit.py');assert.match(py.text,/Statevector.from_instruction/);
 const svg=await download('svg');assert.match(svg.text,/<svg xmlns=/);
 await page.locator('#import-circuit').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":1,"n":99}')});
 assert.match(await page.locator('#lab-status').innerText(),/Choose 1, 2 or 3/);assert.equal(await page.locator('[data-column]').count(),2);
 await page.locator('#import-circuit').setInputFiles({name:'restored.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
 assert.match(await page.locator('#lab-status').innerText(),/Imported circuit/);
 console.log('PASS CIRCUIT: parameter edit on first click, reorder, duplicate, delete, validated import and JSON/Python/SVG downloads.');

 await page.locator('#example').selectOption('GHZ state');await action('share').click();
 const shared=await page.locator('#share-link').inputValue();assert.ok(shared.startsWith(origin+'/circuit-lab.html#circuit='));
 await page.goto(shared,{waitUntil:'domcontentloaded'});await page.locator('#qubit-count').waitFor();
 assert.equal(await page.locator('#qubit-count').inputValue(),'3');assert.deepEqual(await joint(),['50.0%','0.0%','0.0%','0.0%','0.0%','0.0%','0.0%','50.0%']);
 await page.locator('[data-orbit="0"]').focus();await page.keyboard.press('ArrowRight');
 await action('start').click();await action('play').click();await page.locator('#step-position').filter({hasText:'Step 3 / 3'}).waitFor({timeout:12000});
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('#qubit-count').waitFor();assert.equal(await page.locator('[data-column]').count(),3);
 console.log('PASS CIRCUIT: share-link round trip, keyboard sphere orbit, autoplay and restore.');

 await page.setViewportSize({width:390,height:844});
 for(const example of ['Superposition','Bell pair','GHZ state','Toffoli logic','Swap a state']){
  await page.locator('#example').selectOption(example);
  const size=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
  assert.ok(size.scrollWidth<=size.width+4,example+' overflows mobile: '+JSON.stringify(size));
 }
 await page.locator('#theme').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');await page.locator('#theme').click();
 await page.screenshot({path:'circuit-lab-mobile.png',fullPage:true});
 console.log('PASS CIRCUIT: responsive 1/2/3-qubit layouts and color themes.');

 await page.goto(origin+'/',{waitUntil:'domcontentloaded'});await page.locator('[data-bq="H"]').waitFor();
 await page.locator('.bq-more-gates summary').click();await page.locator('[data-bq="RX"]').click();
 await page.locator('#compare-basis').selectOption('Y');assert.deepEqual(await page.locator('.bq-probabilities em').allTextContents(),['0%','100%']);
 await page.locator('[data-bq="undo"]').click();await page.locator('#compare-basis').selectOption('Z');assert.deepEqual(await page.locator('.bq-probabilities em').allTextContents(),['100%','0%']);
 assert.ok(await page.getByRole('link',{name:/Build circuits in the full Bloch/}).count());
 console.log('PASS CIRCUIT: expanded homepage gates, Y measurement, undo and direct lab gateway.');
 assert.deepEqual(errors,[]);
 console.log('PASS LIVE CIRCUIT LAB: all new public interactions verified.');
}finally{await browser.close();}
