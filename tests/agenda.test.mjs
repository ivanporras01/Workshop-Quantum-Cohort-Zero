import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inflateSync} from 'node:zlib';
const root=new URL('../',import.meta.url);
const read=async path=>readFile(new URL(path,root),'utf8');
const agenda=async()=>JSON.parse(inflateSync(Buffer.from((await read('payload/agenda.json.b64')).trim(),'base64')).toString('utf8'));
test('exact five days with original workshop presenters and unassigned sessions',async()=>{
 const d=await agenda();
 assert.equal(d.days.length,5);
 assert.deepEqual(d.dates,['2026-11-09','2026-11-10','2026-11-12','2026-11-13','2026-11-14']);
 assert.equal(d.days[0].sessions.find(s=>s.title.includes('Qiskit')).end,'21:00');
 assert.equal(d.days[2].sessions.find(s=>s.title.includes('Implementation')).start,null);
 assert.equal(d.days[3].sessions.find(s=>s.title==='Python for Quantum').speaker,'TBA');
 assert.equal(d.days[4].sessions.find(s=>s.title==='Applied energy waves').speaker,'Prof Hector Porras, PBSC');
});
test('interactive learning activities cover all five days',async()=>{
 const s=await read('src/app.js');
 for(const keyword of ['Bloch','Qiskit','polarization','BB84','Python','wave-phase','post-quantum'])assert.match(s,new RegExp(keyword,'i'));
 assert.match(s,/localStorage/);
 assert.match(s,/download-notes/);
 assert.ok(s.length>11000);
});
test('static markup references locally generated script, styles and agenda',async()=>{
 const h=await read('index.html'),c=await read('src/styles.css');
 assert.match(h,/\/src\/app.js/);assert.match(h,/\/src\/styles.css/);assert.match(h,/\/resources\/PBSC-Cohort-Zero-Agenda.pdf/);
 assert.ok(c.length>9000);
 assert.match(c,/@media/);
});


test('every agenda teaching session has detailed, correctly matched educational content',async()=>{
 const agendaData=await agenda();
 const study=JSON.parse(await read('src/lessons.json'));
 const sessionKeys=agendaData.days.flatMap(d=>d.sessions.filter(s=>s.kind!=='break').map(s=>d.date+'|'+s.title));
 const lessonKeys=study.lessons.map(l=>l.date+'|'+l.title);
 assert.equal(sessionKeys.length,18,'All non-break agenda sessions must be included');
 assert.equal(lessonKeys.length,sessionKeys.length);
 assert.deepEqual([...lessonKeys].sort(),[...sessionKeys].sort(),'No missing, renamed or invented sessions');
 assert.equal(new Set(lessonKeys).size,lessonKeys.length,'No duplicate lessons');
 for(const l of study.lessons){
  assert.ok(l.overview.length>=70,l.title+': substantive introduction');
  assert.ok(l.concepts.length>=3,l.title+': at least 3 teaching explanations');
  for(const c of l.concepts){assert.ok(c.heading.length>=4);assert.ok(c.text.length>=110,l.title+': shallow concept '+c.heading)}
  assert.ok(l.worked.steps.length>=4,l.title+': step-by-step example missing');
  assert.ok(l.worked.result.length>=40,l.title+': example conclusion missing');
  assert.ok(l.practice.question.length>=25&&l.practice.answer.length>=40,l.title+': insufficient practice feedback');
  assert.ok(l.misconception.length>=40,l.title+': common error guidance missing');
  for(const r of l.resources){assert.match(r.url,/^https:\/\//);assert.ok(r.label.length>=8)}
 }
 assert.ok(study.basis.includes('not official'),'Supplementary status must be disclosed');
});
test('Learn section loads and renders all agenda topics in production assets',async()=>{
 const js=await read('src/app.js');
 const h=await read('index.html');
 const build=await read('scripts/build.mjs');
 assert.match(h,/id="tab-learn"/);assert.match(h,/id="panel-learn"/);
 assert.match(js,/function learn\(/);assert.match(js,/st\.lessons/);
 assert.match(js,/lesson-practice/);assert.match(js,/worked-exercise/);
 assert.match(js,/data-open-explore/);
 assert.match(js,/\/src\/lessons\.json/);assert.match(build,/'lessons\.json'/);
});
