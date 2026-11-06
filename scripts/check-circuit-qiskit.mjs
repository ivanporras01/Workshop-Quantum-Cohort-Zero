import {writeFile} from 'node:fs/promises';
import {GATES,blankProject,simulate,qiskitCode} from '../src/circuit-model.js';
const examples=[];
for(const g of Object.values(GATES))for(const inverse of [false,true]){
 const p=blankProject(3);p.initial=[{theta:47,phi:33},{theta:99,phi:-56},{theta:130,phi:81}];
 const op={gate:g.id,controls:Array.from({length:g.controls},(_,i)=>i),targets:Array.from({length:g.targets},(_,i)=>g.controls+i),params:[73,-41,128].slice(0,g.params),inverse};p.ops=[op];
 examples.push({name:g.id+(inverse?' inverse':''),code:qiskitCode(p),expected:simulate(p).state});
}
await writeFile(process.argv[2],JSON.stringify(examples));
console.log('Generated '+examples.length+' independent Qiskit comparisons.');
