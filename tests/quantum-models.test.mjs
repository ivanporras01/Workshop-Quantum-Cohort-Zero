import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inflateSync} from 'node:zlib';
import {pureState,blochOf,probabilities,sampleCounts,interference,pairProbabilities,teleport,cloningAttempt,dephase} from '../src/quantum-models.js';
import {DAY_PATHS,CONCEPT_LABELS} from '../src/day-learning-map.js';
import {CONCEPTS} from '../src/quantum-concept-content.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const nearArray=(a,b)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));};
test('pure states normalize and reference measurements distinguish relative phase',()=>{
 for(const theta of [0,37,90,123,180])for(const phi of [0,41,90,180,270,360]){
  const state=pureState(theta,phi),v=blochOf(state);
  near(state.flat().reduce((s,x)=>s+x*x,0),1);near(Math.hypot(...v),1);
  for(const basis of ['X','Y','Z'])near(probabilities(v,basis).reduce((a,b)=>a+b),1);
 }
 nearArray(probabilities(blochOf(pureState(90,0)),'X'),[1,0]);
 nearArray(probabilities(blochOf(pureState(90,180)),'X'),[0,1]);
 nearArray(probabilities(blochOf(pureState(90,0)),'Z'),[.5,.5]);
 nearArray(probabilities(blochOf(pureState(90,180)),'Z'),[.5,.5]);
});
test('interference reproduces deterministic and balanced reference outcomes',()=>{
 nearArray(interference(0),[1,0]);nearArray(interference(90),[.5,.5]);nearArray(interference(180),[0,1]);nearArray(interference(360),[1,0]);
 nearArray(interference(0,0),[.5,.5]);nearArray(interference(180,0),[.5,.5]);
});
test('Bell, correlated mixture and product states differ in the required bases',()=>{
 nearArray(pairProbabilities('bell','Z','Z'),[.5,0,0,.5]);
 nearArray(pairProbabilities('mixture','Z','Z'),[.5,0,0,.5]);
 nearArray(pairProbabilities('bell','X','X'),[.5,0,0,.5]);
 nearArray(pairProbabilities('mixture','X','X'),[.25,.25,.25,.25]);
 nearArray(pairProbabilities('bell','Y','Y'),[0,.5,.5,0]);
 nearArray(pairProbabilities('product','X','X'),[1,0,0,0]);
});
test('local Bell outcomes stay 50/50 regardless of the other observer basis',()=>{
 for(const a of ['X','Y','Z'])for(const b of ['X','Y','Z']){
  const p=pairProbabilities('bell',a,b);near(p[0]+p[1],.5);near(p[0]+p[2],.5);near(p.reduce((s,x)=>s+x,0),1);
 }
});
test('teleportation restores arbitrary complex states in all four branches',()=>{
 for(const theta of [0,15,70,90,135,180])for(const phi of [0,40,90,180,271])for(let outcome=0;outcome<4;outcome++){
  const t=teleport(theta,phi,outcome);
  near(t.probability,.25);near(t.fidelity,1);nearArray(blochOf(t.after),blochOf(t.input));
  near(t.shared.flat().reduce((s,x)=>s+x*x,0),1);
  near(t.bellMeasurement.flat().reduce((s,x)=>s+x*x,0),1);
 }
});
test('before correction, teleportation branch bits have the declared order',()=>{
 const base=blochOf(pureState(70,40));
 const expected=[base,[base[0],-base[1],-base[2]],[-base[0],-base[1],base[2]],[-base[0],base[1],-base[2]]];
 for(let i=0;i<4;i++)nearArray(blochOf(teleport(70,40,i).before),expected[i]);
});
test('CNOT basis copying fails to produce two independent superposition copies',()=>{
 nearArray(cloningAttempt(0).actual,cloningAttempt(0).target);
 nearArray(cloningAttempt(180).actual,cloningAttempt(180).target);
 nearArray(cloningAttempt(90).actual,[.5,0,0,.5]);nearArray(cloningAttempt(90).target,[.25,.25,.25,.25]);near(cloningAttempt(90).fidelity,.5);
});
test('dephasing preserves Z populations while suppressing X coherence',()=>{
 for(const d of [0,.25,.5,.75,1]){
  const v=dephase(90,0,d);nearArray(probabilities(v,'Z'),[.5,.5]);near(probabilities(v,'X')[0],1-d/2);near(Math.hypot(...v),1-d);
 }
 nearArray(dephase(0,0,1),[0,0,1]);
});
test('sampling conserves shot count and respects zero-probability events',()=>{
 let state=123456789;const rng=()=>{state=(1664525*state+1013904223)>>>0;return state/2**32;};
 nearArray(sampleCounts([1,0],200,rng),[200,0]);
 const c=sampleCounts([.5,0,0,.5],10000,rng);assert.equal(c[1],0);assert.equal(c[2],0);assert.equal(c.reduce((s,x)=>s+x),10000);assert.ok(Math.abs(c[0]-5000)<200);
 assert.throws(()=>sampleCounts([1,1],20));
});
test('daily plans match every official teaching session without creating agenda slots',async()=>{
 const packed=(await readFile(new URL('../payload/agenda.json.b64',import.meta.url),'utf8')).trim();
 const agenda=JSON.parse(inflateSync(Buffer.from(packed,'base64')));
 assert.deepEqual(DAY_PATHS.map(d=>d.date),agenda.days.map(d=>d.date));
 for(let i=0;i<5;i++)assert.deepEqual(DAY_PATHS[i].sequence.map(s=>s[0]),agenda.days[i].sessions.filter(s=>s.kind!=='break').map(s=>s.title));
 const ids=new Set(CONCEPTS.map(c=>c.id));
 for(const d of DAY_PATHS)for(const id of d.concepts){assert.ok(ids.has(id));assert.ok(CONCEPT_LABELS[id]);}
 for(const c of CONCEPTS)for(const day of c.days)assert.ok(DAY_PATHS[day].concepts.includes(c.id));
});
