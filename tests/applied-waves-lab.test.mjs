import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {LAB_EQUIPMENT,LAB_STEPS,LAB_RESULTS,idealLabOutcome,renderLabGuide} from '../src/applied-waves-lab.js';
const read=async path=>readFile(new URL('../'+path,import.meta.url),'utf8');

test('Lab guide includes circuit, materials, procedures, safety and quantum analogy',async()=>{
 const h=renderLabGuide();
 assert.equal(LAB_EQUIPMENT.length,7);
 assert.equal(LAB_STEPS.length,8);
 for(const anchor of ['src/applied-waves-circuit.svg','Hector Porras','materials','data-lab-step','data-lab-phase','Common','1 MΩ','50 Ω','two active generator outputs','H → P(φ) → H','not quantum']) {
  assert.ok(h.toLowerCase().includes(anchor.toLowerCase()),'Missing '+anchor);
 }
 assert.ok(h.indexOf('BEFORE WE BUILD')<h.indexOf('THE PHYSICAL CIRCUIT'));
 assert.ok(h.indexOf('Materials and equipment')<h.indexOf('Step-by-step wiring'));
 assert.ok(h.indexOf('Step-by-step wiring')<h.indexOf('Expected oscilloscope'));
 assert.ok(h.indexOf('Expected oscilloscope')<h.indexOf('Record these results'));
 for(const [i,item] of LAB_STEPS.entries())assert.match(h,new RegExp('data-lab-step="'+i+'"'));
});
test('Predicted voltage and corresponding quantum analogy are numerically correct',()=>{
 for(const x of LAB_RESULTS){
  const predicted=idealLabOutcome(x.phase);
  assert.ok(Math.abs(predicted.vpp-x.vpp)<1e-9);
  assert.ok(Math.abs(predicted.normalizedSquared-x.ratio)<1e-9);
 }
 assert.ok(Math.abs(idealLabOutcome(90).vpp-Math.SQRT2)<1e-12);
 assert.equal(idealLabOutcome(0).vpp,2);
 assert.ok(idealLabOutcome(180).vpp<1e-12);
 assert.throws(()=>idealLabOutcome('no phase'),/Phase must be/);
});
test('Schematic and its assets are included in Cloudflare production',async()=>{
 const svg=await read('src/applied-waves-circuit.svg');
 const build=await read('scripts/build.mjs');
 const app=await read('src/app.js');
 const html=await read('index.html');
 for(const t of ['R1 = 10 kΩ','R2 = 10 kΩ','Vout','Common ground','two active generator outputs']){
  assert.ok(svg.toLowerCase().includes(t.toLowerCase()),t+' omitted from schematic');
 }
 for(const f of ['applied-waves-lab.js','applied-waves-lab.css','applied-waves-circuit.svg'])assert.ok(build.includes("'"+f+"'"),f+' not built');
 assert.match(app,/renderLabGuide\(\)/);
 assert.match(app,/wireLabGuide\(root\)/);
 assert.ok(app.includes("lesson.title==='Applied energy waves'"),'Lab should be attached only to the Saturday applied waves topic');
 assert.ok(html.includes('/src/applied-waves-lab.css'));
});
