import test from 'node:test';
import assert from 'node:assert/strict';
import {measureEncoded, simulateBB84, splitForTesting, seededRandom, xorBits} from '../src/qkd-model.js';

test('compatible basis measurement preserves either bit; incompatible basis can produce either outcome',()=>{
 for(const basis of ['Z','X'])for(const bit of [0,1]){
  assert.equal(measureEncoded(bit,basis,basis,()=>.01),bit);
  assert.equal(measureEncoded(bit,basis,basis,()=>.99),bit);
  assert.equal(measureEncoded(bit,basis,basis==='Z'?'X':'Z',()=>.01),0);
  assert.equal(measureEncoded(bit,basis,basis==='Z'?'X':'Z',()=>.99),1);
 }
});
test('noiseless sifting preserves bits; intercept-resend approaches the independently derived one-quarter error rate',()=>{
 for(const eve of [false,true]){
  const rows=simulateBB84({count:80000,eve,rng:seededRandom(8401)});
  const sifted=rows.filter(r=>r.keep),errors=sifted.filter(r=>r.bit!==r.bobBit).length;
  assert.ok(Math.abs(sifted.length/rows.length-.5)<.015);
  if(eve)assert.ok(Math.abs(errors/sifted.length-.25)<.015);
  else assert.equal(errors,0);
  assert.ok(rows.some(r=>!r.keep&&r.bit===r.bobBit),'Some discarded bits match by chance');
 }
});
test('public test bits and wrong-basis bits never appear among remaining candidates',()=>{
 const rows=simulateBB84({count:100,eve:true,rng:seededRandom(1049)}),r=splitForTesting(rows,seededRandom(11));
 assert.equal(r.kept.length,r.sample.length+r.remaining.length);
 assert.ok(r.remaining.every(x=>x.keep&&!r.sampleIds.has(x.id)));
 assert.ok(r.sample.every(x=>x.keep&&r.sampleIds.has(x.id)));
 assert.equal(r.qber,r.sample.filter(x=>x.bit!==x.bobBit).length/r.sample.length);
 const empty=splitForTesting([{id:1,bit:0,bobBit:0,keep:false}]);
 assert.equal(empty.qber,null);assert.deepEqual(empty.remaining,[]);
});
test('noise can cause sifted errors without Eve, and public XOR example round-trips',()=>{
 const rows=simulateBB84({count:5000,noise:.1,rng:seededRandom(23)});
 assert.ok(rows.some(r=>r.keep&&r.bit!==r.bobBit&&r.eveBasis===null));
 const message='1011',key='0110';assert.equal(xorBits(message,key),'1101');
 assert.equal(xorBits(xorBits(message,key),key),message);
 assert.throws(()=>xorBits('101','10'));assert.throws(()=>xorBits('101','x10'));
});
