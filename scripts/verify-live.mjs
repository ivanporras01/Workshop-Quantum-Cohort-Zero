import assert from 'node:assert/strict';

const origin=process.env.WORKSHOP_URL||'https://workshop-quantum-cohort-zero.hectorporras0916.workers.dev';
const base=origin.replace(/\/$/,'');
const pollMs=7000,attempts=15;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function get(path){
 const response=await fetch(base+path,{signal:AbortSignal.timeout(12000),headers:{'Cache-Control':'no-cache'}});
 if(!response.ok)throw Error(path+' responded HTTP '+response.status);
 return response;
}
let last='';
for(let i=1;i<=attempts;i++){
 try{
  const [main,study,agenda,code,styles,pdf,bloch,design]=await Promise.all([
   get('/'),get('/src/lessons.json'),get('/src/agenda.json'),get('/src/app.js'),get('/src/styles.css'),get('/resources/PBSC-Cohort-Zero-Agenda.pdf'),get('/src/bloch-sphere.js'),get('/src/bloch-sphere.css')
  ]);
  const html=await main.text(),lessons=await study.json(),a=await agenda.json(),js=await code.text(),css=await styles.text(),blochJs=await bloch.text(),blochCss=await design.text();
  assert.equal(a.days.length,5);
  assert.equal(lessons.lessons.length,18);
  assert.ok(html.includes('id="tab-learn"'));
  assert.ok(html.includes('id="panel-learn"'));
  assert.ok(js.includes('function learn(')&&js.includes('data-agenda-lesson'));
  assert.ok(css.includes('.topic-card'));
  assert.ok(html.includes('/src/bloch-sphere.css'));
  assert.ok(js.includes("from './bloch-sphere.js'"));
  assert.ok(blochJs.includes('THE BLOCH SPHERE')&&blochJs.includes('measureBloch('));
  assert.ok(blochJs.includes('data-basis=')&&blochJs.includes('data-state='));
  assert.ok(blochCss.includes('.public-bloch-panel'));

  const actual=a.days.flatMap(d=>d.sessions.filter(s=>s.kind!=='break').map(s=>d.date+'|'+s.title)).sort();
  const provided=lessons.lessons.map(l=>l.date+'|'+l.title).sort();
  assert.deepEqual(provided,actual);
  assert.ok(Number(pdf.headers.get('Content-Length')||0)!==0);
  console.log('PASS LIVE: Cloudflare serves all 18 detailed lessons, original 5-day agenda, enhanced Bloch sphere controls, interactive JS, responsive styling, and agenda PDF.');
  process.exit(0);
 }catch(error){
  last=String(error);
  console.log('Production check '+i+'/'+attempts+': '+last.slice(0,260));
  if(i<attempts)await pause(pollMs);
 }
}
throw Error('Cloudflare content not verified: '+last);
