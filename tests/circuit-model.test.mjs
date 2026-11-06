import test from 'node:test';
import {applyBlochGate} from '../src/bloch-sphere.js';
import assert from 'node:assert/strict';
import {GATES,blankProject,validateProject,prepare,simulate,applyOperation,probabilities,reducedQubit,measureOne,sampleShots,operationMatrix,exampleProject,qiskitCode} from '../src/circuit-model.js';
const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<e,a+' ≠ '+b);
const same=(a,b)=>a.forEach((z,i)=>z.forEach((n,j)=>near(n,b[i][j])));
function fixture(g,inverse=false){const controls=Array.from({length:g.controls},(_,i)=>i),targets=Array.from({length:g.targets},(_,i)=>g.controls+i);return {gate:g.id,controls,targets,params:[73,-41,128].slice(0,g.params),inverse};}
test('all 38 gates preserve normalization and their daggers reverse arbitrary inputs',()=>{
 assert.equal(Object.keys(GATES).length,38);
 for(const g of Object.values(GATES)){
  const p=blankProject(3);p.initial=[{theta:47,phi:33},{theta:99,phi:-56},{theta:130,phi:81}];
  const initial=prepare(p),op=fixture(g),out=applyOperation(initial,op);
  near(probabilities(out).reduce((a,b)=>a+b,0),1);
  same(applyOperation(out,{...op,inverse:true}),initial);
 }
});
test('unitary matrix columns are orthonormal for every gate, including controlled gates',()=>{
 for(const g of Object.values(GATES)){
  const n=Math.max(1,g.controls+g.targets),m=operationMatrix(n,fixture(g));
  for(let a=0;a<m.length;a++)for(let b=0;b<m.length;b++){
   let re=0,im=0;for(let r=0;r<m.length;r++){re+=m[r][a][0]*m[r][b][0]+m[r][a][1]*m[r][b][1];im+=m[r][a][0]*m[r][b][1]-m[r][a][1]*m[r][b][0];}
   near(re,a===b?1:0);near(im,0);
  }
 }
});
test('Qiskit little-endian ordering: X q1 -> |10>, CX control q1 -> |11>',()=>{
 const p=blankProject(2);p.ops=[{gate:'X',targets:[1],controls:[],params:[]},{gate:'CX',targets:[0],controls:[1],params:[]}];
 assert.deepEqual(probabilities(simulate(p,1).state),[0,0,1,0]);assert.deepEqual(probabilities(simulate(p).state),[0,0,0,1]);
});
test('controlled operations leave the control-zero subspace unchanged',()=>{
 for(const g of Object.values(GATES).filter(g=>g.controls)){const p=blankProject(3);p.initial[2]={theta:73,phi:41};const s=prepare(p);same(applyOperation(s,fixture(g)),s);}
});
test('Bell state is globally pure but each reduced Bloch vector is zero',()=>{
 const s=simulate(exampleProject('Bell pair')).state;[0,1].forEach(q=>{const r=reducedQubit(s,q);same([r.vector.slice(0,2)],[[0,0]]);near(r.vector[2],0);near(r.purity,.5);near(r.entropy,1);});
 const ps=probabilities(s);near(ps[0],.5);near(ps[3],.5);near(ps[1]+ps[2],0);
});
test('GHZ and Toffoli examples preserve the intended correlations and control condition',()=>{
 const ps=probabilities(simulate(exampleProject('GHZ state')).state);near(ps[0],.5);near(ps[7],.5);near(ps.slice(1,7).reduce((a,b)=>a+b,0),0);
 near(probabilities(simulate(exampleProject('Toffoli logic')).state)[7],1);
});
test('uncomputing removes Bell entanglement and returns |00>',()=>near(probabilities(simulate(exampleProject('Uncompute a Bell pair')).state)[0],1));
test('Y phase sign and Y measurement follow the +i convention',()=>{
 const p=blankProject();p.initial[0]={theta:90,phi:90};const s=prepare(p);near(reducedQubit(s,0).vector[1],1);
 const m=measureOne(s,0,'Y',()=>.8);assert.equal(m.outcome,0);near(reducedQubit(m.state,0).vector[1],1);
});
test('measuring one Bell qubit collapses the joint state and repeated measurement agrees',()=>{
 const s=simulate(exampleProject('Bell pair')).state,m=measureOne(s,0,'Z',()=>.8);assert.equal(m.outcome,1);near(probabilities(m.state)[3],1);assert.equal(measureOne(m.state,0,'Z',()=>.1).outcome,1);
});
test('fresh-copy sampling preserves its input and produces correlated Bell results in X/Z',()=>{
 const s=simulate(exampleProject('Bell pair')).state,original=JSON.stringify(s);
 for(const basis of ['X','Z']){const r=sampleShots(s,1000,basis);assert.equal(r.counts[1]+r.counts[2],0);assert.equal(r.counts.reduce((a,b)=>a+b,0),1000);}
 assert.equal(JSON.stringify(s),original);
 const y=sampleShots(s,1000,'Y');assert.equal(y.counts[0]+y.counts[3],0);
});
test('phase detective H Z H gives certain one',()=>near(probabilities(simulate(exampleProject('Phase becomes a bit')).state)[1],1));
test('SX squared is exactly X and iSWAP squared applies the expected sign',()=>{
 const p=blankProject();p.ops=[fixture(GATES.SX),fixture(GATES.SX)];same(simulate(p).state,[[0,0],[1,0]]);
 const s=[[0,0],[1,0],[0,0],[0,0]],op=fixture(GATES.iSWAP);same(applyOperation(applyOperation(s,op),op),[[0,0],[-1,0],[0,0],[0,0]]);
});
test('unsafe or malformed imported circuits are rejected without evaluating code',()=>{
 const p=blankProject(2);
 for(const bad of [{...p,n:4},{...p,initial:[{theta:NaN,phi:0},p.initial[1]]},{...p,ops:[{gate:'CX',targets:[0],controls:[0],params:[]}]},{...p,ops:[{gate:'eval',targets:[0],controls:[],params:[]}]},{...p,ops:Array(129).fill(fixture(GATES.H))}])assert.throws(()=>validateProject(bad));
 assert.throws(()=>sampleShots(prepare(p),10001));assert.throws(()=>sampleShots(prepare(p),2,'A'));
});
test('JSON round-trip is reproducible and Python export uses validated operations',()=>{
 for(const name of ['Bell pair','GHZ state','Rotation sweep']){const p=exampleProject(name);same(simulate(JSON.parse(JSON.stringify(p))).state,simulate(p).state);assert.match(qiskitCode(p),/Statevector.from_instruction/);}
 const p=blankProject();p.name='"); print("injection';assert.ok(!qiskitCode(p).includes('injection'));
});

test('homepage Bloch rotations agree with statevector results for every expanded gate',()=>{
 const initial={theta:63,phi:-31},p=blankProject();p.initial=[initial];const s=prepare(p),vector=reducedQubit(s,0).vector;
 for(const gate of ['H','X','Y','Z','S','Sdg','T','Tdg','SX','SXdg','RX','RY','RZ','P']){
  const expected=reducedQubit(applyOperation(s,{gate,targets:[0],controls:[],params:GATES[gate].params?[73]:[],inverse:false}),0).vector;
  const actual=applyBlochGate(vector,gate,73);actual.forEach((n,i)=>near(n,expected[i]));
 }
});
