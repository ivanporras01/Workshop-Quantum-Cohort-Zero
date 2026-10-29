// Public-exposition Bloch sphere shared as a self-contained, testable workshop component.
// SVG depicts pure one-qubit states in Bloch space, never a particle trajectory.
export const REFERENCE_STATES = Object.freeze({
  '|0⟩': {v:[0,0,1], formula:'|0⟩', explanation:'North pole. A Z-basis measurement gives 0 with certainty.'},
  '|1⟩': {v:[0,0,-1], formula:'|1⟩', explanation:'South pole. A Z-basis measurement gives 1 with certainty.'},
  '|+⟩': {v:[1,0,0], formula:'(|0⟩ + |1⟩) / √2', explanation:'Equal Z probabilities with amplitudes in phase. An X-basis measurement gives + with certainty.'},
  '|−⟩': {v:[-1,0,0], formula:'(|0⟩ − |1⟩) / √2', explanation:'Equal Z probabilities with a relative minus sign. An X-basis measurement gives − with certainty.'},
  '|+i⟩': {v:[0,1,0], formula:'(|0⟩ + i|1⟩) / √2', explanation:'Equal Z probabilities with +i relative phase. A Y-basis measurement gives + with certainty.'},
  '|−i⟩': {v:[0,-1,0], formula:'(|0⟩ − i|1⟩) / √2', explanation:'Equal Z probabilities with −i relative phase. A Y-basis measurement gives − with certainty.'}
});
const MEASURE={
  Z:{axis:2,plus:'|0⟩',minus:'|1⟩'},
  X:{axis:0,plus:'|+⟩',minus:'|−⟩'},
  Y:{axis:1,plus:'|+i⟩',minus:'|−i⟩'}
};
export function measureBloch(vector,basis='Z'){
  const axis=MEASURE[basis];
  if(!axis||!Array.isArray(vector)||vector.length!==3||!vector.every(Number.isFinite)) throw Error('Invalid Bloch vector or basis');
  const norm=Math.hypot(...vector);
  if(norm>1.000001)throw Error('Bloch vector must have length at most 1');
  const plus=Math.max(0,Math.min(1,(1+vector[axis.axis])/2));
  return {plus,minus:1-plus,labels:[axis.plus,axis.minus]};
}
export function applyBlochGate(vector,gate){
  const [x,y,z]=vector;
  let result;
  switch(gate){
    case 'X': result=[x,-y,-z];break;
    case 'Y': result=[-x,y,-z];break;
    case 'Z': result=[-x,-y,z];break;
    case 'H': result=[z,-y,x];break;
    case 'Reset': result=[0,0,1];break;
    default: throw Error('Unknown quantum gate: '+gate);
  }
  // Signed zero has no physical significance; normalize it for tests and readouts.
  return result.map(v=>Object.is(v,-0)?0:v);
}
function vecPoint(v){
  const [x,y,z]=v;
  return {x:260+127*x-72*y,y:260-126*z+49*y};
}
const REFERENCES=[
  ['|0⟩','+Z',[0,0,1],0,-24],
  ['|1⟩','−Z',[0,0,-1],0,28],
  ['|+⟩','+X',[1,0,0],28,-2],
  ['|−⟩','−X',[-1,0,0],-35,-2],
  ['|+i⟩','+Y',[0,1,0],-22,27],
  ['|−i⟩','−Y',[0,-1,0],25,-8]
];
function labelMarkup(v,preset){
  return REFERENCES.map(([name,axis,position,dx,dy])=>{
    const p=vecPoint(position), on=name===preset;
    return `<g class="bloch-reference ${on?'selected':''}"><circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${on?7.5:5}"/>
      <text x="${(p.x+dx).toFixed(2)}" y="${(p.y+dy).toFixed(2)}" text-anchor="middle" class="bloch-reference-name">${name}</text>
      <text x="${(p.x+dx).toFixed(2)}" y="${(p.y+dy+17).toFixed(2)}" text-anchor="middle" class="bloch-reference-axis">${axis}</text></g>`;
  }).join('');
}
function blochIllustration(vector,preset){
  const tip=vecPoint(vector);
  return `<svg class="public-bloch-svg" viewBox="0 0 520 518" role="img" aria-label="Bloch sphere with six labeled reference states and the selected qubit state vector">
    <defs>
      <radialGradient id="publicBlochFill" cx="34%" cy="23%" r="80%"><stop stop-color="#236479" stop-opacity=".84"/><stop offset="1" stop-color="#092139" stop-opacity=".55"/></radialGradient>
      <linearGradient id="publicBlochArrow" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#d3ff84"/><stop offset="1" stop-color="#b1ff91"/></linearGradient>
      <filter id="publicBlochGlow"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <text x="260" y="28" text-anchor="middle" class="public-bloch-heading">THE BLOCH SPHERE</text>
    <text x="260" y="55" text-anchor="middle" class="public-bloch-caption">One qubit. Six reference states.</text>
    <circle cx="260" cy="260" r="148" fill="url(#publicBlochFill)" stroke="#6bbcca" stroke-width="1.6" opacity=".97"/>
    <ellipse cx="260" cy="260" rx="148" ry="50" fill="none" stroke="#6dd5d1" stroke-opacity=".65"/>
    <ellipse cx="260" cy="260" rx="51" ry="148" fill="none" stroke="#83b6c3" stroke-opacity=".43"/>
    <ellipse cx="260" cy="260" rx="51" ry="148" transform="rotate(31 260 260)" fill="none" stroke="#82afc3" stroke-opacity=".32"/>
    <path d="M260 109V411 M109 260H411 M170 200L350 321" fill="none" stroke="#87b7cb" stroke-dasharray="5 8" stroke-opacity=".46"/>
    ${labelMarkup(vector,preset)}
    <path d="M260 260 L${tip.x.toFixed(2)} ${tip.y.toFixed(2)}" stroke="#c0ff88" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${tip.x.toFixed(2)}" cy="${tip.y.toFixed(2)}" r="14" fill="#b8ff86" opacity=".28" filter="url(#publicBlochGlow)"/>
    <circle cx="${tip.x.toFixed(2)}" cy="${tip.y.toFixed(2)}" r="7.3" fill="#d2ff86"/>
    <circle cx="260" cy="260" r="4" fill="#ddf9ff"/>
  </svg>`;
}
function matchedState(vector){
  return Object.entries(REFERENCE_STATES).find(([,s])=>s.v.every((v,i)=>Math.abs(v-vector[i])<1e-8));
}
export function renderBlochSphere({vector=[0,0,1],basis='Z',trace=['Start']}={}){
  const matched=matchedState(vector),current=matched?.[0]||'Custom state';
  const stateData=matched?.[1]||{formula:'α|0⟩ + β|1⟩',explanation:'The vector shows a pure single-qubit state. Compare different measurement bases to see why relative phase matters.'};
  const p=measureBloch(vector,basis);
  const button=(name,data,chosen)=>`<button type="button" class="chip-button public-bloch-button" data-${data}="${name}" aria-pressed="${chosen}">${name}</button>`;
  const summary=`<strong class="public-state-formula">${stateData.formula}</strong><p class="public-state-explanation">${stateData.explanation}</p>`;
  const bars=p.labels.map((label,i)=>{
    const n=i?p.minus:p.plus;
    return `<div class="public-measure-row"><span>Measure ${label} in ${basis} basis</span><strong>${(n*100).toFixed(0)}%</strong><div class="public-measure-track"><div class="${i?'secondary':''}" style="width:${(n*100).toFixed(1)}%"></div></div></div>`;
  }).join('');
  return `<section class="public-bloch-panel" aria-label="Interactive Bloch sphere explorer">
    <div class="public-bloch-main">
      <p class="public-bloch-step">01 · CHOOSE A REFERENCE STATE</p>
      <div class="public-bloch-presets" id="bloch-presets">${Object.keys(REFERENCE_STATES).map(s=>button(s,'state',s===current)).join('')}</div>
      ${blochIllustration(vector,current)}
      ${summary}
    </div>
    <div class="public-bloch-controls">
      <div class="public-bloch-control-group"><p class="public-bloch-step">02 · CHOOSE A MEASUREMENT BASIS</p>
        <div class="public-bloch-basis" id="bloch-basis">${['Z','X','Y'].map(b=>button(b+' basis','basis',b===basis).replace('data-basis="'+b+' basis"','data-basis="'+b+'"')).join('')}</div>
        <p class="public-bloch-help">A single measurement returns one outcome. The bars show ideal probabilities over many identically prepared qubits.</p>
        ${bars}
      </div>
      <div class="public-bloch-control-group"><p class="public-bloch-step">03 · APPLY A GATE AND EXPLAIN</p>
        <div class="public-bloch-gates" id="bloch-gates">${['H','X','Y','Z','Reset'].map(g=>button(g,'gate',false)).join('')}</div>
        <p class="public-bloch-vector">Bloch vector r = (${vector.map(n=>n.toFixed(2)).join(', ')})</p>
        <p class="public-bloch-trace">State changes: ${trace.join(' → ')}</p>
      </div>
      <div class="public-bloch-challenge"><strong>Try this live:</strong> Reset → H → Z → H. Why does a phase change turn into a certain measurement of 1?</div>
    </div>
  </section>`;
}