// Ideal statevector simulator. q0 is the least-significant bit (Qiskit convention).
export const VERSION=1, MAX_QUBITS=3, MAX_GATES=128;
const C=(r=0,i=0)=>[r,i], add=(a,b)=>[a[0]+b[0],a[1]+b[1]], mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]], conj=a=>[a[0],-a[1]], scale=(a,s)=>[a[0]*s,a[1]*s], abs2=a=>a[0]*a[0]+a[1]*a[1], exp=a=>[Math.cos(a),Math.sin(a)];
const rad=d=>d*Math.PI/180;
const singles=[
 ['I','Identity',0,'Keep the state unchanged.'],
 ['H','Hadamard',0,'Exchange the Z and X axes. H prepares a superposition from |0⟩.'],
 ['X','Pauli X',0,'Rotate 180° around X; exchange |0⟩ and |1⟩.'],
 ['Y','Pauli Y',0,'Rotate 180° around Y; exchange populations and change phases.'],
 ['Z','Pauli Z',0,'Rotate 180° around Z; change the relative phase.'],
 ['S','Phase S',0,'Add 90° to the phase of |1⟩.'],
 ['Sdg','S dagger',0,'Undo S: add −90° to the phase of |1⟩.'],
 ['T','Phase T',0,'Add 45° to the phase of |1⟩.'],
 ['Tdg','T dagger',0,'Undo T: add −45° to the phase of |1⟩.'],
 ['SX','Square root of X',0,'Two SX gates equal X, including its global phase.'],
 ['SXdg','SX dagger',0,'Undo the square root of X.'],
 ['RX','X rotation',1,'Rotate the Bloch vector around X by θ.'],
 ['RY','Y rotation',1,'Rotate the Bloch vector around Y by θ.'],
 ['RZ','Z rotation',1,'Rotate the Bloch vector around Z by θ.'],
 ['P','Phase rotation',1,'Multiply the |1⟩ amplitude by exp(iθ).'],
 ['U','Universal one-qubit gate',3,'U(θ,φ,λ) = P(φ) RY(θ) P(λ). Covers every one-qubit unitary up to global phase.']
];
export const GATES=Object.fromEntries(singles.map(([id,name,params,description])=>[id,{id,name,params,description,targets:1,controls:0,group:'Single qubit'}]));
for(const base of ['X','Y','Z','H','S','Sdg','T','Tdg','SX','RX','RY','RZ','P','U']){
 const id='C'+base; GATES[id]={...GATES[base],id,name:'Controlled '+GATES[base].name,base,controls:1,group:'Controlled',description:'Apply '+base+' to the target only when the control is |1⟩. The control and target must be different qubits.'};
}
for(const [id,name,params,targets,controls,description] of [
 ['SWAP','Swap',0,2,0,'Exchange the quantum states of two qubits.'],
 ['iSWAP','iSWAP',0,2,0,'Exchange |01⟩ and |10⟩ and multiply each by i.'],
 ['RXX','XX interaction',1,2,0,'Apply exp(−iθ X⊗X / 2).'],
 ['RYY','YY interaction',1,2,0,'Apply exp(−iθ Y⊗Y / 2).'],
 ['RZZ','ZZ interaction',1,2,0,'Apply exp(−iθ Z⊗Z / 2).'],
 ['CCX','Toffoli',0,1,2,'Flip the target only when both controls are |1⟩.'],
 ['CCZ','Controlled-controlled Z',0,1,2,'Apply Z only when both controls are |1⟩.'],
 ['CSWAP','Fredkin',0,2,1,'Swap the two targets only when the control is |1⟩.']
])GATES[id]={id,name,params,targets,controls,description,group:controls===2||id==='CSWAP'?'Three qubits':'Two qubits'};
export function gateLabel(id){return id.replace('dg','†').replace('RX','Rx').replace('RY','Ry').replace('RZ','Rz');}
export function singleMatrix(id,params=[]){
 const [t=0,p=0,l=0]=params.map(rad), c=Math.cos(t/2),s=Math.sin(t/2),h=1/Math.SQRT2;
 switch(id){
  case 'I':return [[C(1),C()],[C(),C(1)]];
  case 'H':return [[C(h),C(h)],[C(h),C(-h)]];
  case 'X':return [[C(),C(1)],[C(1),C()]];
  case 'Y':return [[C(),C(0,-1)],[C(0,1),C()]];
  case 'Z':return [[C(1),C()],[C(),C(-1)]];
  case 'S':case 'Sdg':case 'T':case 'Tdg':return [[C(1),C()],[C(),exp(({S:90,Sdg:-90,T:45,Tdg:-45})[id]*Math.PI/180)]];
  case 'SX':return [[C(.5,.5),C(.5,-.5)],[C(.5,-.5),C(.5,.5)]];
  case 'SXdg':return [[C(.5,-.5),C(.5,.5)],[C(.5,.5),C(.5,-.5)]];
  case 'RX':return [[C(c),C(0,-s)],[C(0,-s),C(c)]];
  case 'RY':return [[C(c),C(-s)],[C(s),C(c)]];
  case 'RZ':return [[exp(-t/2),C()],[C(),exp(t/2)]];
  case 'P':return [[C(1),C()],[C(),exp(t)]];
  case 'U':return [[C(c),scale(exp(l),-s)],[scale(exp(p),s),scale(exp(p+l),c)]];
  default:throw Error('Unknown one-qubit gate.');
 }
}
function dagger(m){return m[0].map((_,i)=>m.map(row=>conj(row[i])));}
export function blankProject(n=1){return {version:VERSION,name:'My quantum circuit',n,initial:Array.from({length:n},()=>({theta:0,phi:0})),ops:[]};}
export function validateProject(input){
 if(!input||input.version!==VERSION||!Number.isInteger(input.n)||input.n<1||input.n>MAX_QUBITS)throw Error('Choose 1, 2 or 3 qubits in a version 1 circuit.');
 const p=blankProject(input.n);p.name=String(input.name||p.name).slice(0,80);
 if(!Array.isArray(input.initial)||input.initial.length!==p.n)throw Error('Each qubit needs an initial state.');
 p.initial=input.initial.map(a=>{
  if(!a||!Number.isFinite(a.theta)||a.theta<0||a.theta>180||!Number.isFinite(a.phi)||Math.abs(a.phi)>3600)throw Error('Initial angles must be finite: θ from 0° to 180°.');
  return {theta:a.theta,phi:a.phi};
 });
 if(!Array.isArray(input.ops)||input.ops.length>MAX_GATES)throw Error('A circuit can contain at most '+MAX_GATES+' gates.');
 p.ops=input.ops.map(op=>{
  const g=GATES[op?.gate];if(!g)throw Error('Unknown gate in circuit.');
  if(!Array.isArray(op.targets)||op.targets.length!==g.targets||!Array.isArray(op.controls)||op.controls.length!==g.controls)throw Error('Incorrect wires for '+g.id+'.');
  const wires=[...op.targets,...op.controls];
  if(wires.some(q=>!Number.isInteger(q)||q<0||q>=p.n)||new Set(wires).size!==wires.length)throw Error('Gate wires must be distinct and inside the circuit.');
  if(!Array.isArray(op.params)||op.params.length!==g.params||op.params.some(a=>!Number.isFinite(a)||Math.abs(a)>3600))throw Error('Angles must be finite and within ±3600°.');
  return {gate:g.id,targets:[...op.targets],controls:[...op.controls],params:[...op.params],inverse:op.inverse===true};
 });return p;
}
export function prepare(p){
 return Array.from({length:2**p.n},(_,i)=>{
  let a=C(1);p.initial.forEach((s,q)=>{const t=rad(s.theta)/2;a=mul(a,i&(1<<q)?scale(exp(rad(s.phi)),Math.sin(t)):C(Math.cos(t)));});return a;
 });
}
function applySingle(state,q,m,controls=[]){
 const out=state.map(a=>[...a]),bit=1<<q,mask=controls.reduce((s,c)=>s|(1<<c),0);
 for(let i=0;i<state.length;i++)if(!(i&bit)&&(i&mask)===mask){
  const a=state[i],b=state[i|bit];out[i]=add(mul(m[0][0],a),mul(m[0][1],b));out[i|bit]=add(mul(m[1][0],a),mul(m[1][1],b));
 }return out;
}
export function applyOperation(state,op){
 const g=GATES[op.gate];if(!g)throw Error('Unknown gate.');
 if(op.gate==='SWAP'||op.gate==='iSWAP'||op.gate==='CSWAP'){
  const [a,b]=op.targets.map(q=>1<<q),mask=op.controls.reduce((s,q)=>s|(1<<q),0),out=state.map(z=>[...z]);
  for(let i=0;i<state.length;i++)if(!!(i&a)!==!!(i&b)&&(i&mask)===mask){out[i^(a|b)]=op.gate==='iSWAP'?mul(state[i],C(0,op.inverse?-1:1)):[...state[i]];}return out;
 }
 if(['RXX','RYY','RZZ'].includes(op.gate)){
  const id=op.gate.slice(1,2),pauli=singleMatrix(id),transformed=applySingle(applySingle(state,op.targets[0],pauli),op.targets[1],pauli),t=rad(op.params[0])*(op.inverse?-1:1)/2;
  return state.map((a,i)=>add(scale(a,Math.cos(t)),mul(C(0,-Math.sin(t)),transformed[i])));
 }
 const id=op.gate==='CCX'?'X':op.gate==='CCZ'?'Z':g.base||g.id;
 let m=singleMatrix(id,op.params);if(op.inverse)m=dagger(m);
 return applySingle(state,op.targets[0],m,op.controls);
}
export function simulate(project,until=project.ops.length){
 const p=validateProject(project),states=[prepare(p)],limit=Math.max(0,Math.min(p.ops.length,Math.trunc(until)));
 for(let i=0;i<limit;i++)states.push(applyOperation(states.at(-1),p.ops[i]));
 return {state:states.at(-1),states,step:limit};
}
export function probabilities(state){return state.map(abs2);}
export function reducedQubit(state,q){
 let p0=0,p1=0,c=C();const bit=1<<q;
 for(let i=0;i<state.length;i++)if(!(i&bit)){p0+=abs2(state[i]);p1+=abs2(state[i|bit]);c=add(c,mul(conj(state[i]),state[i|bit]));}
 const vector=[2*c[0],2*c[1],p0-p1].map(x=>Math.abs(x)<1e-12?0:x),length=Math.min(1,Math.hypot(...vector)),e=(1+length)/2;
 const entropy=(e>0?-e*Math.log2(e):0)+(e<1?-(1-e)*Math.log2(1-e):0);
 return {vector,length,purity:(1+length*length)/2,entropy,matrix:[[C(p0),conj(c)],[c,C(p1)]]};
}
export function measureOne(state,q,basis='Z',random=Math.random){
 if(!['X','Y','Z'].includes(basis))throw Error('Unknown measurement basis.');
 let s=state.map(a=>[...a]);
 if(basis==='Y')s=applySingle(s,q,singleMatrix('Sdg'));
 if(basis!=='Z')s=applySingle(s,q,singleMatrix('H'));
 const p0=probabilities(s).reduce((sum,p,i)=>sum+(!(i&(1<<q))?p:0),0);
 const outcome=random()<p0?0:1,probability=outcome?1-p0:p0;
 if(probability<1e-14)throw Error('Cannot select a zero-probability outcome.');
 s=s.map((a,i)=>!!(i&(1<<q))===!!outcome?scale(a,1/Math.sqrt(probability)):C());
 if(basis!=='Z')s=applySingle(s,q,singleMatrix('H'));
 if(basis==='Y')s=applySingle(s,q,singleMatrix('S'));
 return {state:s,outcome,probability};
}
export function sampleShots(state,shots=1024,basis='Z',random=Math.random){
 if(!Number.isInteger(shots)||shots<1||shots>10000||!['X','Y','Z'].includes(basis))throw Error('Use 1–10000 shots and an X, Y or Z basis.');
 let s=state;const n=Math.log2(state.length);
 for(let q=0;q<n;q++){if(basis==='Y')s=applySingle(s,q,singleMatrix('Sdg'));if(basis!=='Z')s=applySingle(s,q,singleMatrix('H'));}
 const ps=probabilities(s),counts=ps.map(()=>0);
 for(let k=0;k<shots;k++){let r=random(),j=0;while(j<ps.length-1&&r>=ps[j]){r-=ps[j];j++;}counts[j]++;}
 return {counts,probabilities:ps,shots,basis};
}
export function operationMatrix(n,op){
 const cols=Array.from({length:2**n},(_,j)=>applyOperation(Array.from({length:2**n},(_,i)=>C(i===j?1:0)),op));
 return cols.map((_,i)=>cols.map(col=>col[i]));
}
export function complexText(a,digits=3){
 const f=x=>Math.abs(x)<10**(-digits)?'0':Number(x.toFixed(digits)).toString();
 if(Math.abs(a[1])<10**(-digits))return f(a[0]);if(Math.abs(a[0])<10**(-digits))return f(a[1])+'i';
 return f(a[0])+(a[1]<0?' − ':' + ')+f(Math.abs(a[1]))+'i';
}
const op=(gate,targets,controls=[],params=[])=>({gate,targets,controls,params,inverse:false});
export const EXAMPLES={
 'Superposition':{n:1,ops:[op('H',[0])],why:'H turns |0⟩ into |+⟩. Z measurements are 50/50; X measurements are certain +.'},
 'Phase becomes a bit':{n:1,ops:[op('H',[0]),op('Z',[0]),op('H',[0])],why:'The middle Z changes phase. The final H makes that phase visible as a certain |1⟩ outcome.'},
 'Rotation sweep':{n:1,ops:[op('RY',[0],[],[60]),op('RZ',[0],[],[90])],why:'RY sets the populations; RZ changes phase. Compare the X, Y and Z measurement bases.'},
 'Bell pair':{n:2,ops:[op('H',[0]),op('CX',[1],[0])],why:'H on q0 followed by CX creates (|00⟩ + |11⟩)/√2. Each local sphere is at the center even though the combined state is pure.'},
 'Uncompute a Bell pair':{n:2,ops:[op('H',[0]),op('CX',[1],[0]),op('CX',[1],[0]),op('H',[0])],why:'Reverse the preparation. The second CX removes entanglement; H then returns the register to |00⟩.'},
 'GHZ state':{n:3,ops:[op('H',[0]),op('CX',[1],[0]),op('CX',[2],[0])],why:'Three qubits share a state with only |000⟩ and |111⟩ as possible Z outcomes.'},
 'Toffoli logic':{n:3,ops:[op('X',[0]),op('X',[1]),op('CCX',[2],[0,1])],why:'The target q2 flips because both control qubits are 1. Step backward to see the condition.'},
 'Swap a state':{n:2,ops:[op('RY',[0],[],[60]),op('P',[0],[],[45]),op('SWAP',[0,1])],why:'The prepared state moves from q0 to q1; SWAP exchanges states rather than copying them.'}
};
export function exampleProject(name){const e=EXAMPLES[name];if(!e)throw Error('Unknown example.');return validateProject({...blankProject(e.n),name,ops:e.ops});}
export function qiskitCode(project){
 const p=validateProject(project),lines=['# Quantum / Zero — ideal circuit; install qiskit and numpy.','# Displayed bitstrings are q[n-1] ... q0. No hardware job is submitted.','from qiskit import QuantumCircuit','from qiskit.quantum_info import Statevector','from qiskit.circuit.library import UnitaryGate','import numpy as np','','qc = QuantumCircuit('+p.n+')'];
 p.initial.forEach((s,q)=>{if(s.theta)lines.push('qc.ry('+rad(s.theta)+', '+q+')');if(s.phi)lines.push('qc.p('+rad(s.phi)+', '+q+')');});
 const py=a=>'complex('+a[0]+', '+a[1]+')',matrix=m=>'np.array(['+m.map(row=>'['+row.map(py).join(', ')+']').join(', ')+'], dtype=complex)';
 for(const o of p.ops){
  const g=GATES[o.gate],t=o.targets,c=o.controls,pars=o.params.map(rad);
  if(g.targets===1){
   const base=o.gate==='CCX'?'X':o.gate==='CCZ'?'Z':g.base||g.id;
   let m=singleMatrix(base,o.params);if(o.inverse)m=dagger(m);
   if(!c.length&&!o.inverse){const method=({I:'id',Sdg:'sdg',Tdg:'tdg',SXdg:'sxdg'})[base]||base.toLowerCase();lines.push('qc.'+method+'('+[...pars,...t].join(', ')+')');}
   else{lines.push('gate = UnitaryGate('+matrix(m)+', label='+JSON.stringify(gateLabel(o.gate)+(o.inverse?' inverse':''))+')');if(c.length)lines.push('gate = gate.control('+c.length+')');lines.push('qc.append(gate, ['+[...c,...t].join(', ')+'])');}
  }else if(o.gate==='SWAP')lines.push('qc.swap('+t.join(', ')+')');
  else if(o.gate==='CSWAP')lines.push('qc.cswap('+[...c,...t].join(', ')+')');
  else if(['RXX','RYY','RZZ'].includes(o.gate))lines.push('qc.'+o.gate.toLowerCase()+'('+[pars[0]*(o.inverse?-1:1),...t].join(', ')+')');
  else {const small={...o,targets:[0,1],controls:[]};lines.push('qc.unitary('+matrix(operationMatrix(2,small))+', ['+t.join(', ')+'], label="iSWAP")');}
 }
 lines.push('','state = Statevector.from_instruction(qc)','print(qc.draw(output="text"))','print(state.probabilities_dict())','# A fresh copy adds terminal Z measurements for future sampler use.','measured_circuit = qc.copy()','measured_circuit.measure_all()');
 return lines.join('\n')+'\n';
}
