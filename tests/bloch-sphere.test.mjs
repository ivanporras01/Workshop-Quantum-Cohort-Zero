import test from 'node:test';
import assert from 'node:assert/strict';
import {REFERENCE_STATES,measureBloch,applyBlochGate,renderBlochSphere} from '../src/bloch-sphere.js';

test('All six Bloch reference states have correct measurement statistics',()=>{
 const sample=[
  ['|0⟩','Z',1],['|1⟩','Z',0],
  ['|+⟩','X',1],['|−⟩','X',0],
  ['|+i⟩','Y',1],['|−i⟩','Y',0]
 ];
 for(const [state,basis,plus] of sample){
  const p=measureBloch(REFERENCE_STATES[state].v,basis);
  assert.equal(p.plus,plus,state+' in '+basis);
  assert.equal(p.minus,1-plus);
 }
 for(const [state,{v}] of Object.entries(REFERENCE_STATES)){
  assert.equal(measureBloch(v,'Z').plus+measureBloch(v,'Z').minus,1);
  assert.ok(Math.abs(Math.hypot(...v)-1)<1e-10,state+' is a valid pure state');
 }
});
test('Every gate retains unit norm and expected Bloch rotation',()=>{
 const zero=[0,0,1];
 const plus=applyBlochGate(zero,'H');
 assert.deepEqual(plus,[1,0,0]);
 assert.deepEqual(applyBlochGate(plus,'Z'),[-1,0,0]);
 assert.deepEqual(applyBlochGate(applyBlochGate(plus,'Z'),'H'),[0,0,-1]);
 assert.deepEqual(applyBlochGate(zero,'X'),[0,0,-1]);
 assert.deepEqual(applyBlochGate([1,0,0],'Y'),[-1,0,0]);
 for(const {v} of Object.values(REFERENCE_STATES)){
  for(const gate of ['H','X','Y','Z']){
   const result=applyBlochGate(v,gate);
   assert.ok(Math.abs(Math.hypot(...result)-1)<1e-10);
  }
 }
});
test('The public sphere offers six states, three bases, labeled gates and explanations',()=>{
 const html=renderBlochSphere({vector:[1,0,0],basis:'X',trace:['Start','H']});
 for(const preset of Object.keys(REFERENCE_STATES)){
  assert.ok(html.includes('data-state="'+preset+'"'),preset);
  assert.ok(html.includes(preset),'Missing state label '+preset);
 }
 for(const basis of ['X','Y','Z'])assert.ok(html.includes('data-basis="'+basis+'"'));
 for(const gate of ['X','Y','Z','H','Reset'])assert.ok(html.includes('data-gate="'+gate+'"'));
 assert.match(html,/THE BLOCH SPHERE/);
 assert.match(html,/One qubit\. Six reference states/);
 assert.match(html,/Measure \|\+⟩ in X basis/);
 assert.match(html,/100%/);
 assert.match(html,/Gate sequence|State changes/);
 assert.match(html,/Start → H/);
});
