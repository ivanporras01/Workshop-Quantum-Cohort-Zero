import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inflateSync} from 'node:zlib';
import {DESIGNS,renderLessonExperience,getDesign} from '../src/learning-experiences.js';

const base=new URL('../',import.meta.url);
const read=async path=>readFile(new URL(path,base),'utf8');
const agenda=async()=>JSON.parse(inflateSync(Buffer.from((await read('payload/agenda.json.b64')).trim(),'base64')).toString('utf8'));
const lessons=async()=>JSON.parse(await read('src/lessons.json')).lessons;

test('all 18 agenda teaching sessions have a dedicated visual learning experience',async()=>{
 const ag=await agenda(),ls=await lessons();
 const keys=ag.days.flatMap(d=>d.sessions.filter(x=>x.kind!=='break').map(x=>d.date+'|'+x.title));
 assert.equal(keys.length,18);
 assert.deepEqual(Object.keys(DESIGNS).sort(),keys.sort());
 assert.equal(Object.keys(DESIGNS).length,18);
 const types=Object.values(DESIGNS).map(d=>d.type);
 assert.ok(new Set(types).size>=12,'A public workshop should have varied instructional visual formats');
 for(const l of ls){
  const design=getDesign(l),markup=renderLessonExperience(l);
  assert.ok(design,l.title+' missing design');
  for(const field of ['eyebrow','idea','why','prompt','take'])assert.ok(design[field].length>25,l.title+': '+field+' is too brief');
  assert.ok(markup.includes('data-visual-type="'+design.type+'"'),l.title+' missing working visual');
  assert.ok(markup.includes('visual-caution'),l.title+' missing limitations');
  assert.ok(markup.includes('visual-exhibit-heading'),l.title+' missing instructions');
 }
});
test('concepts and visualization come before worked example and practice in lesson template',async()=>{
 const app=await read('src/app.js');
 const concept=app.indexOf("const opening=design?");
 const tiles=app.indexOf("const concepts=");
 const visual=app.indexOf("const visual=(design?");
 const steps=app.indexOf("const worked=");
 const practice=app.indexOf("const practice=");
 const takeaway=app.indexOf("const closing=");
 assert.ok(concept>=0&&concept<tiles&&tiles<visual&&visual<steps&&steps<practice&&practice<takeaway);
 assert.match(app,/guided-example/);
 assert.match(app,/wireLessonExperiences/);
 assert.match(app,/WELCOME TO COHORT ZERO/);
 assert.match(app,/No quantum background needed/);
});
test('every interactive teaching type renders a distinguishable activity',async()=>{
 const ls=await lessons();
 for(const l of ls){
  const design=getDesign(l);
  const html=renderLessonExperience(l);
  assert.ok(html.length>550,design.type+' lesson lacks visual substance');
  switch(design.type){
   case 'qubit':case 'polar':case 'python':case 'wave':case 'interference':
    assert.match(html,/data-demo-slider=/);break;
   case 'sphere':assert.match(html,/sphere-lesson-graphic/);break;
   case 'circuit':assert.match(html,/circuit-stage/);assert.match(html,/data-demo-option/);break;
   case 'bb84':assert.match(html,/bb84-demo-grid/);break;
   default:assert.match(html,/data-demo-option/);
  }
 }
});
