import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {BEGINNER_GUIDES,beginnerGuideFor,renderBeginnerGuide} from '../src/beginner-path.js';
import {blochVector,blochAngles,renderInteractiveBlochLesson} from '../src/qubit-lesson.js';
import {applyBlochGate,measureBloch} from '../src/bloch-sphere.js';
const read=async name=>readFile(new URL('../'+name,import.meta.url),'utf8');

test('all 18 topics explain fundamentals from zero before interactive problems',async()=>{
 const lessons=JSON.parse(await read('src/lessons.json')).lessons;
 const keys=Object.keys(BEGINNER_GUIDES);
 assert.equal(keys.length,18);
 assert.equal(lessons.length,18);
 let steps=0;
 for(const l of lessons){
  const g=beginnerGuideFor(l);
  assert.ok(g,l.title+' missing beginner explanation');
  assert.ok(g.steps.length>=4,l.title+' needs more explanation');
  steps+=g.steps.length;
  for(const e of g.steps){
   assert.ok(e.title.length>8,e.title);
   assert.ok(e.explanation.length>70,l.title+': '+e.title+' is not explanatory');
  }
  const html=renderBeginnerGuide(l);
  assert.match(html,/NO PREVIOUS EXPERIENCE REQUIRED/);
  assert.match(html,/data-beginner-step="0"/);
  assert.match(html,/data-beginner-next/);
 }
 assert.ok(steps>=72,'Expected a genuinely complete beginner curriculum');
 const intro=BEGINNER_GUIDES['2026-11-09|Introduction to Quantum Computing and Qubits'];
 const all=intro.steps.map(x=>x.explanation).join(' ');
 for(const idea of ['classical bit','qubit','0 or 1','amplitudes','measure','Hadamard','phase']){
  assert.ok(all.toLowerCase().includes(idea.toLowerCase()),idea+' missing');
 }
 const app=await read('src/app.js');
 assert.ok(app.includes('renderBeginnerGuide(lesson)'));
 assert.ok(app.includes('wireBeginnerGuides(root)'));
 assert.ok(app.indexOf("const beginner=renderBeginnerGuide")<app.indexOf("const worked="));
});
test('Bloch angles and measurement probabilities behave correctly',()=>{
 const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-9,x+' vs '+y);
 assert.deepEqual(blochVector(0,0),[0,0,1]);
 assert.deepEqual(blochVector(180,0),[0,0,-1]);
 const x=blochVector(90,0),y=blochVector(90,90);
 near(x[0],1);near(x[1],0);near(x[2],0);
 near(y[1],1);near(y[0],0);near(y[2],0);
 near(measureBloch(y,'Y').plus,1);
 near(measureBloch(y,'Z').plus,.5);
 const angles=blochAngles(y);
 near(angles.theta,90);near(angles.phi,90);
 near(measureBloch(applyBlochGate([0,0,1],'H'),'Z').plus,.5);
 const s=applyBlochGate(x,'S');near(s[0],0);near(s[1],1);
 const t=applyBlochGate(x,'T');near(t[0],Math.SQRT1_2);near(t[1],Math.SQRT1_2);
 const markup=renderInteractiveBlochLesson();
 for(const control of ['data-qubit-lesson','data-qubit-theta','data-qubit-phi','data-qubit-mount','data-qubit-p0','data-qubit-p1'])assert.ok(markup.includes(control));
});
test('the public site includes beginner gateway and production bundles',async()=>{
 const html=await read('index.html'),build=await read('scripts/build.mjs');
 assert.match(html,/From a classical bit to a quantum qubit/);
 assert.match(html,/Start learning from zero/);
 assert.match(html,/beginner-path.css/);
 for(const name of ['beginner-path.js','beginner-path.css','qubit-lesson.js'])assert.ok(build.includes("'"+name+"'"));
});
