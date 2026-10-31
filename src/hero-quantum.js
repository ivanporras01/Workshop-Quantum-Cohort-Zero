import {REFERENCE_STATES,applyBlochGate,measureBloch} from './bloch-sphere.js';
export function projectBloch(v,azimuth=-28){
 const a=azimuth*Math.PI/180,c=Math.cos(a),s=Math.sin(a),x=c*v[0]-s*v[1],depth=s*v[0]+c*v[1];
 return [180+126*x,165-119*v[2]+40*depth];
}
export function heroSphere(v,azimuth){
 const point=v=>projectBloch(v,azimuth).map(n=>n.toFixed(2));
 const path=fn=>Array.from({length:97},(_,i)=>(i?'L':'M')+point(fn(i*Math.PI/48)).join(' ')).join(' ');
 const [x,y]=point(v);
 return `<svg viewBox="0 0 360 330" role="img" aria-label="Rotatable Bloch sphere: a state vector, not a particle trajectory"><defs><radialGradient id="hero-sphere-fill" cx="30%" cy="25%"><stop stop-color="#237c91" stop-opacity=".8"/><stop offset="1" stop-color="#0b233c" stop-opacity=".8"/></radialGradient></defs><circle cx="180" cy="165" r="128" fill="url(#hero-sphere-fill)" stroke="#67dace" stroke-opacity=".6"/>${[0,Math.PI/3,2*Math.PI/3].map(a=>`<path d="${path(t=>[Math.cos(t)*Math.cos(a),Math.cos(t)*Math.sin(a),Math.sin(t)])}" class="hq-grid"/>`).join('')}<path d="${path(t=>[Math.cos(t),Math.sin(t),0])}" class="hq-equator"/>${[[1,0,0],[0,1,0],[0,0,1]].map((p,i)=>`<path d="M${point(p.map(n=>-n)).join(' ')} L${point(p).join(' ')}" class="hq-axis"/><text x="${+point(p)[0]+8}" y="${+point(p)[1]-8}">${['+X','+Y','|0⟩'][i]}</text>`).join('')}<text x="187" y="306">|1⟩</text><line x1="180" y1="165" x2="${x}" y2="${y}" class="hq-vector"/><circle cx="${x}" cy="${y}" r="16" fill="#c8ff89" opacity=".15"/><circle cx="${x}" cy="${y}" r="6" fill="#d0ff93"/><circle cx="180" cy="165" r="3" fill="white"/></svg>`;
}
export function renderHeroQuantum(){return `<div class="hq-header"><span>YOUR FIRST QUANTUM EXPERIMENT</span><span class="hq-live">LIVE MODEL</span></div><div class="hq-predict">Predict: what will H do to |0⟩?</div><div class="hq-sphere"></div><div class="hq-readout" aria-live="polite"></div><div class="hq-probabilities"></div><div class="hq-starter"><button data-hq-action="Reset">1 · Prepare |0⟩</button><button data-hq-action="H">2 · Apply H</button><button data-hq-action="measure">3 · Measure</button></div><p class="hq-message" role="status">A Z measurement of |0⟩ gives 0 with certainty. Apply H to discover superposition.</p><details class="hq-advanced"><summary>Explore all controls</summary><div class="hq-presets">${Object.keys(REFERENCE_STATES).map((s,i)=>`<button data-hq-preset="${i}">${s}</button>`).join('')}</div><label>Measurement basis <select id="hero-basis"><option>Z</option><option>X</option><option>Y</option></select></label><div class="hq-gates">${['H','X','Y','Z','S','T','Reset'].map(g=>`<button data-hq-action="${g}">${g}</button>`).join('')}</div><label>State balance θ <input id="hero-theta" type="range" min="0" max="180" value="0"></label><label>Relative phase φ <input id="hero-phi" type="range" min="0" max="360" value="0"></label><label>Rotate camera <input id="hero-camera" type="range" min="-180" max="180" value="-28"></label><p>Rotating the camera changes only your view. Gates change the quantum state. Angles prepare a fresh pure state.</p><button data-hq-action="sample">Sample 200 fresh preparations</button><button data-hq-action="full">Open the complete Bloch laboratory ↗</button></details><p class="hq-footnote">One qubit · ideal simulation · no quantum hardware</p>`;}
export function wireHeroQuantum(root,{onFull}={}){
 let v=[0,0,1],basis='Z',camera=-28;
 const q=s=>root.querySelector(s),message=t=>q('.hq-message').textContent=t;
 const paint=()=>{
  q('.hq-sphere').innerHTML=heroSphere(v,camera);
  const p=measureBloch(v,basis),match=Object.entries(REFERENCE_STATES).find(([,s])=>s.v.every((n,i)=>Math.abs(n-v[i])<1e-7));
  q('.hq-readout').textContent=match?match[1].formula:`Bloch (x, y, z) = (${v.map(n=>n.toFixed(2)).join(', ')})`;
  q('.hq-probabilities').innerHTML=p.labels.map((l,i)=>`<div><span>${l}</span><i><b style="width:${100*(i?p.minus:p.plus)}%"></b></i><strong>${(100*(i?p.minus:p.plus)).toFixed(0)}%</strong></div>`).join('');
  q('#hero-theta').value=Math.acos(Math.max(-1,Math.min(1,v[2])))*180/Math.PI;
  q('#hero-phi').value=(Math.atan2(v[1],v[0])*180/Math.PI+360)%360;
 };
 root.querySelectorAll('[data-hq-action]').forEach(b=>b.onclick=()=>{
  const a=b.dataset.hqAction;if(a==='full'){onFull?.();return;}
  if(a==='sample'){const p=measureBloch(v,basis);let n=0;for(let i=0;i<200;i++)if(Math.random()<p.plus)n++;message(`200 freshly prepared qubits in ${basis}: ${p.labels[0]} = ${n}, ${p.labels[1]} = ${200-n}. Frequencies fluctuate around the predicted probabilities. The prepared state is unchanged.`);return;}
  if(a==='measure'){const p=measureBloch(v,basis),plus=Math.random()<p.plus;v=[0,0,0];v[{X:0,Y:1,Z:2}[basis]]=plus?1:-1;message(`One ${basis} measurement returned ${p.labels[plus?0:1]}. The sphere now shows the collapsed state. Repeating the same measurement gives the same outcome until the state changes.`);}
  else{v=applyBlochGate(v,a);message(a==='Reset'?'Fresh |0⟩ prepared. Predict the result, then apply H.':`${a} applied. Compare the state and ${basis}-basis probabilities. `+({H:'H exchanges the X and Z axes and reverses Y.',X:'X rotates the state by 180° around X.',Y:'Y rotates the state by 180° around Y.',Z:'Z changes relative phase: a 180° rotation around Z.',S:'S adds 90° of relative phase.',T:'T adds 45° of relative phase.'}[a]));}
  paint();
 });
 root.querySelectorAll('[data-hq-preset]').forEach(b=>b.onclick=()=>{v=[...Object.values(REFERENCE_STATES)[+b.dataset.hqPreset].v];message('Fresh reference state prepared. Compare measurement bases.');paint();});
 q('#hero-basis').onchange=e=>{basis=e.target.value;message(`Now predicting ${basis}-basis outcomes. Choosing a basis does not perform a measurement.`);paint();};
 q('#hero-camera').oninput=e=>{camera=+e.target.value;paint();message('Camera rotated. The quantum state and its probabilities have not changed.');};
 for(const id of ['hero-theta','hero-phi'])q('#'+id).oninput=()=>{const t=+q('#hero-theta').value*Math.PI/180,p=+q('#hero-phi').value*Math.PI/180;v=[Math.sin(t)*Math.cos(p),Math.sin(t)*Math.sin(p),Math.cos(t)];message('New pure state prepared from θ and φ. Predict its measurement probabilities.');paint();};
 paint();
}
