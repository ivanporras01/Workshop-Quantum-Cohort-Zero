import {REFERENCE_STATES,applyBlochGate,renderBlochSphere,measureBloch} from './bloch-sphere.js';
const clamp=v=>Math.max(-1,Math.min(1,v));
export function blochVector(theta,phi){
 const t=theta*Math.PI/180,p=phi*Math.PI/180;
 return [Math.sin(t)*Math.cos(p),Math.sin(t)*Math.sin(p),Math.cos(t)].map(n=>Math.abs(n)<1e-12?0:n);
}
export function blochAngles(vector,oldPhi=0){
 const theta=Math.acos(clamp(vector[2]))*180/Math.PI;
 const horizontal=Math.hypot(vector[0],vector[1]);
 const phi=horizontal<1e-10?oldPhi:(Math.atan2(vector[1],vector[0])*180/Math.PI+360)%360;
 return {theta,phi};
}
export function renderInteractiveBlochLesson(){
 return '<section class="qubit-live-lesson" data-qubit-lesson aria-label="Learn quantum states with an interactive Bloch sphere">'+
  '<div class="qubit-live-intro"><span>INTERACTIVE LAB · FROM CLASSICAL BITS TO A QUANTUM STATE</span><h6>See a qubit—not just a probability slider.</h6><p>First look at the sphere: the top is |0⟩ and the bottom is |1⟩. Move the two angle controls to point the state vector in a new direction. Then select a measurement basis and see the ideal probabilities change.</p>'+
  '<div class="qubit-live-comparison"><div><small>CLASSICAL BIT</small><strong>0 OR 1</strong><p>One definite logical value. Ordinary digital logic processes bits.</p></div><div><small>IDEAL PURE QUBIT</small><strong>α|0⟩ + β|1⟩</strong><p>Two complex amplitudes define a quantum state. Measurement still returns one classical answer.</p></div></div></div>'+
  '<div class="qubit-live-controls"><div class="qubit-live-angle"><label for="qubit-theta">Polar angle θ: <output data-qubit-theta-label>0°</output></label><input data-qubit-theta id="qubit-theta" type="range" min="0" max="180" step="5" value="0"/><p>Moves the vector between the |0⟩ (north) and |1⟩ (south) poles.</p></div>'+
  '<div class="qubit-live-angle"><label for="qubit-phi">Azimuth / relative phase φ: <output data-qubit-phi-label>0°</output></label><input data-qubit-phi id="qubit-phi" type="range" min="0" max="360" step="5" value="0"/><p>Rotates the vector around the sphere. At the poles, φ has no observable effect.</p></div></div>'+
  '<div class="qubit-angle-readout"><div><span>Z-basis P(0)</span><strong data-qubit-p0>100%</strong></div><div><span>Z-basis P(1)</span><strong data-qubit-p1>0%</strong></div><div><span>Amplitudes (global phase fixed)</span><strong data-qubit-amplitudes>α=1.00, β=0.00</strong></div></div>'+
  '<div class="qubit-sphere-mount" data-qubit-mount></div>'+
  '<div class="qubit-guide-caption"><strong>How to explore:</strong> 1. Choose |0⟩ → 2. Apply H → 3. Compare Z and X measurement bases → 4. Change φ while θ=90°. Notice that the Z bars remain at 50/50 but the X/Y bars change. This is why relative phase matters.</div>'+
  '<p class="qubit-science-note">This sphere describes an ideal pure qubit. The bars predict outcome frequencies over many identically prepared qubits; they do not represent two simultaneous readable classical bits. The simulation is not a hardware measurement.</p>'+
 '</section>';
}
export function wireInteractiveBlochLessons(root){
 root.querySelectorAll('[data-qubit-lesson]').forEach(section=>{
  const state={vector:[0,0,1],basis:'Z',trace:['Start'],theta:0,phi:0};
  const thetaSlider=section.querySelector('[data-qubit-theta]'),phiSlider=section.querySelector('[data-qubit-phi]');
  const update=()=>{
   const ang=blochAngles(state.vector,state.phi);
   state.theta=ang.theta;state.phi=ang.phi;
   thetaSlider.value=String(Math.round(state.theta));phiSlider.value=String(Math.round(state.phi));
   section.querySelector('[data-qubit-theta-label]').textContent=state.theta.toFixed(0)+'°';
   section.querySelector('[data-qubit-phi-label]').textContent=state.phi.toFixed(0)+'°';
   const z=measureBloch(state.vector,'Z');
   section.querySelector('[data-qubit-p0]').textContent=(z.plus*100).toFixed(0)+'%';
   section.querySelector('[data-qubit-p1]').textContent=(z.minus*100).toFixed(0)+'%';
   const a=Math.cos(state.theta*Math.PI/360);
   const b=Math.sin(state.theta*Math.PI/360);
   const re=b*Math.cos(state.phi*Math.PI/180),im=b*Math.sin(state.phi*Math.PI/180);
   section.querySelector('[data-qubit-amplitudes]').textContent='α='+a.toFixed(2)+' · β='+re.toFixed(2)+(im>=0?' + ':' − ')+Math.abs(im).toFixed(2)+'i';
   section.querySelector('[data-qubit-mount]').innerHTML=renderBlochSphere({vector:state.vector,basis:state.basis,trace:state.trace});
  };
  thetaSlider.addEventListener('input',()=>{
   state.vector=blochVector(+thetaSlider.value,state.phi);
   state.trace=['Set θ='+thetaSlider.value+'°'];update();
  });
  phiSlider.addEventListener('input',()=>{
   state.vector=blochVector(state.theta,+phiSlider.value);
   state.phi=+phiSlider.value;
   state.trace=['Set φ='+phiSlider.value+'°'];update();
  });
  section.addEventListener('click',e=>{
   const target=e.target.closest('[data-state],[data-basis],[data-gate]');
   if(!target||!section.contains(target))return;
   if(target.hasAttribute('data-state')){
    const s=REFERENCE_STATES[target.dataset.state];
    if(!s)return;state.vector=s.v.slice();state.trace=['Prepare '+target.dataset.state];
   }else if(target.hasAttribute('data-basis')){
    if(!['X','Y','Z'].includes(target.dataset.basis))return;
    state.basis=target.dataset.basis;
   }else if(target.hasAttribute('data-gate')){
    const gate=target.dataset.gate;
    state.vector=applyBlochGate(state.vector,gate);
    state.trace=gate==='Reset'?['Start']:state.trace.concat(gate).slice(-8);
   }
   update();
  });
  update();
 });
}
