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
