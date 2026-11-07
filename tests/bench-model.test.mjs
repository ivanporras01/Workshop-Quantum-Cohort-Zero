import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PRESETS,periodUs,phaseTimeUs,burstTimeUs,sumVpp,sample} from '../src/bench-model.js';
import {WORKBOOKS,renderDigitalLabs} from '../src/bench-labs.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('bench frequency and timing use Hz, seconds and microseconds consistently',()=>{
 near(periodUs(500),2000);near(periodUs(1000),1000);near(periodUs(2000),500);near(phaseTimeUs(90,1000),250);near(burstTimeUs(4,1000),4000);assert.throws(()=>periodUs(0));
});
test('equal sine waves reinforce, partially interfere, or cancel',()=>{
 near(sumVpp(1,0),2);near(sumVpp(1,90),Math.SQRT2);near(sumVpp(1,180),0);
 const s={...PRESETS.sum,output:true};for(let i=0;i<100;i++)near(sample(i/100000,s)+sample(i/100000,s,2),0);
});
test('pulse duration and high/low levels agree with the workbook',()=>{
 const s={...PRESETS.pulse,output:true};near(sample(.00005,s),1);near(sample(.00015,s),0);near(sample(.00105,s),1);
});
test('manual burst is zero outside its finite N-cycle envelope',()=>{
 const s={...PRESETS.burst,output:true,cycles:2};near(sample(-.001,s),0);near(sample(.00025,s),.5);near(sample(.00225,s),0);near(sample(.00025,{...s,output:false}),0);
});
test('both real PDF workbooks have matching production links and valid headers',async()=>{
 const html=renderDigitalLabs();for(const w of WORKBOOKS){assert.ok(html.includes(w.file));const b=await readFile(new URL('..'+w.file,import.meta.url));assert.equal(b.subarray(0,5).toString(),'%PDF-');assert.ok(b.length>100000);}
});
