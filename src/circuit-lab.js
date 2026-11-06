import {GATES,gateLabel,blankProject,validateProject,simulate,probabilities,reducedQubit,measureOne,sampleShots,operationMatrix,complexText,EXAMPLES,exampleProject,qiskitCode,MAX_GATES} from './circuit-model.js';
const root=document.querySelector('#lab'),key='quantum-zero-circuit-v1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=x=>JSON.parse(JSON.stringify(x)),deg=x=>(x*Math.PI/180),pct=x=>(100*x).toFixed(1)+'%';
let project=blankProject(),step=0,selected=-1,target=0,form={gate:'H',target:0,second:1,control:1,control2:2,params:[90,0,0],inverse:false};
let message='Start with |0⟩. Select H and click Add gate to prepare your first superposition.',error=false,undo=[],redo=[],timer=null,preview=null,shotsResult=null,basis='Z',shots=1024;
let camera={yaw:32,pitch:18,zoom:1},storage=true,share='',guide='',loading=false;
try{const saved=localStorage.getItem(key);if(saved)project=validateProject(JSON.parse(saved));document.documentElement.dataset.theme=localStorage.getItem('quantum-zero-lab-theme')||'dark';}catch{storage=false;}
function decode(s){return new TextDecoder().decode(Uint8Array.from(atob(s),c=>c.charCodeAt(0)));}
function encode(s){return btoa(String.fromCharCode(...new TextEncoder().encode(s)));}
if(location.hash.startsWith('#circuit=')){try{const raw=decode(location.hash.slice(9));if(raw.length>60000)throw Error('Shared circuit is too large.');project=validateProject(JSON.parse(raw));message='Shared circuit loaded. Run it, inspect it or download your own copy.';}catch(e){message='Could not load shared circuit: '+e.message;error=true;}}
step=project.ops.length;
function save(){if(location.hash.startsWith('#circuit='))history.replaceState(null,'',location.pathname+location.search);try{localStorage.setItem(key,JSON.stringify(project));storage=true;}catch{storage=false;}}
function notify(text,bad=false){message=text;error=bad;}
function stop(){if(timer)clearInterval(timer);timer=null;}
function commit(next,text){next=validateProject(next);stop();undo.push(clone(project));if(undo.length>80)undo.shift();redo=[];project=next;target=Math.min(target,project.n-1);step=project.ops.length;preview=null;shotsResult=null;share='';guide='';save();notify(text);}
function current(){return preview||simulate(project,step).state;}
function button(action,text,disabled=false,cls=''){return '<button type="button" data-action="'+action+'" class="'+cls+'" '+(disabled?'disabled':'')+'>'+text+'</button>';}
function options(values,selectedValue){return values.map(([value,label])=>'<option value="'+esc(value)+'" '+(String(value)===String(selectedValue)?'selected':'')+'>'+esc(label)+'</option>').join('');}
function qubitOptions(value){return options(Array.from({length:project.n},(_,q)=>[q,'q'+q]),value);}
function htmlMatrix(m){return '<div class="matrix-wrap"><div class="matrix" style="grid-template-columns:repeat('+m.length+',max-content)">'+m.flat().map(a=>'<span>'+esc(complexText(a))+'</span>').join('')+'</div></div>';}
function projectPoint(v,r=110){const a=deg(camera.yaw),b=deg(camera.pitch),u=v[0]*Math.cos(a)-v[1]*Math.sin(a),w=v[0]*Math.sin(a)+v[1]*Math.cos(a),y=v[2]*Math.cos(b)-w*Math.sin(b);return [180+r*camera.zoom*u,160-r*camera.zoom*y,v[2]*Math.sin(b)+w*Math.cos(b)];}
function sphereSvg(vector,q,history){
 const color=['#d5ff8d','#86f0e0','#c5b3ff'][q],f=x=>x.toFixed(2),point=v=>projectPoint(v);
 let grid='';
 for(let axis=0;axis<3;axis++)for(let k=0;k<64;k++){
  const a=2*Math.PI*k/64,b=2*Math.PI*(k+1)/64,v=[0,0,0],w=[0,0,0];v[(axis+1)%3]=Math.cos(a);v[(axis+2)%3]=Math.sin(a);w[(axis+1)%3]=Math.cos(b);w[(axis+2)%3]=Math.sin(b);const p=point(v),t=point(w);
  grid+='<path d="M'+f(p[0])+' '+f(p[1])+'L'+f(t[0])+' '+f(t[1])+'" stroke="#7ac4cf" stroke-opacity="'+(p[2]>=0?'.55':'.17')+'" fill="none"/>';
 }
 let axes='';for(const [label,v] of [['|+⟩',[1,0,0]],['|−⟩',[-1,0,0]],['|+i⟩',[0,1,0]],['|−i⟩',[0,-1,0]],['|0⟩',[0,0,1]],['|1⟩',[0,0,-1]]]){
  const p=point(v),t=point(v.map(x=>x*1.18));axes+='<path d="M180 160L'+f(p[0])+' '+f(p[1])+'" stroke="#9fc6d7" stroke-opacity=".35" stroke-dasharray="3 6"/><circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="3.5" fill="#a0dfe6"/><text x="'+f(t[0])+'" y="'+f(t[1]+4)+'" text-anchor="middle" fill="#e8ffff" font-size="13">'+label+'</text>';
 }
 const tip=point(vector),trail=history.map(v=>point(v).slice(0,2).map(f).join(',')).join(' ');
 return '<svg viewBox="0 0 360 330" role="img" aria-label="Bloch sphere for q'+q+', vector '+vector.map(x=>x.toFixed(3)).join(', ')+'"><defs><radialGradient id="sphereGlow'+q+'"><stop stop-color="#215e73"/><stop offset="1" stop-color="#0b263e"/></radialGradient></defs><circle cx="180" cy="160" r="'+f(110*camera.zoom)+'" fill="url(#sphereGlow'+q+')" stroke="#66a8be" stroke-opacity=".65"/>'+grid+axes+(history.length>1?'<polyline points="'+trail+'" fill="none" stroke="'+color+'" stroke-opacity=".4" stroke-width="1.4" stroke-dasharray="3 5"/>':'')+'<path d="M180 160L'+f(tip[0])+' '+f(tip[1])+'" stroke="'+color+'" stroke-width="4" stroke-linecap="round"/><circle cx="'+f(tip[0])+'" cy="'+f(tip[1])+'" r="6" fill="'+color+'"/><circle cx="180" cy="160" r="2.5" fill="#f2ffff"/><text x="180" y="316" text-anchor="middle" fill="#adcddc" font-size="11">Drag to orbit · arrow keys to rotate</text></svg>';
}
function gateSymbol(op,n,x=42,start=0){
 const h=n*54,rows=[...op.targets,...op.controls].map(q=>27+q*54),color=op.controls.length?'#c8b7ff':'#9ae5d6';
 let s=Array.from({length:n},(_,q)=>'<path d="M'+start+' '+(27+q*54)+'H'+(start+84)+'" stroke="#4f788b" stroke-width="1.5"/>').join('');
 if(rows.length>1)s+='<path d="M'+x+' '+Math.min(...rows)+'V'+Math.max(...rows)+'" stroke="'+color+'" stroke-width="2"/>';
 for(const q of op.controls)s+='<circle cx="'+x+'" cy="'+(27+q*54)+'" r="5" fill="'+color+'"/>';
 for(const q of op.targets){
  const y=27+q*54;
  if(['SWAP','CSWAP','iSWAP'].includes(op.gate))s+='<path d="M'+(x-8)+' '+(y-8)+'l16 16m-16 0l16-16" stroke="'+color+'" stroke-width="2.5"/>';
  else{s+='<rect x="'+(x-24)+'" y="'+(y-17)+'" width="48" height="34" rx="7" fill="#183d51" stroke="'+color+'"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" fill="#f0fffc" font-size="11" font-family="system-ui">'+esc(gateLabel(GATES[op.gate].base||(op.gate==='CCX'?'X':op.gate==='CCZ'?'Z':op.gate)))+(op.inverse?'†':'')+'</text>';}
 }return s;
}
function circuitSvg(){
 const w=Math.max(420,project.ops.length*84+100),h=project.n*54+80;
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><rect width="100%" height="100%" fill="#092338"/><text x="18" y="24" fill="#ecfffa" font-size="14" font-family="system-ui">'+esc(project.name)+'</text>'+Array.from({length:project.n},(_,q)=>'<text x="16" y="'+(66+q*54)+'" fill="#bce4e8" font-size="13" font-family="monospace">q'+q+'</text>').join('')+'<g transform="translate(60 35)">'+project.ops.map((o,i)=>gateSymbol(o,project.n,42+i*84,i*84)).join('')+'</g></svg>';
}
function render(){
 const active=document.activeElement,focusId=active?.id,focusAction=active?.dataset?.action,focusGate=active?.dataset?.gatePick;
 const sim=simulate(project,step),s=preview||sim.state,g=GATES[form.gate],local=reducedQubit(s,target),component=local.vector[['X','Y','Z'].indexOf(basis)],stateP=probabilities(s),initial=project.initial[target];
 const groupNames=[...new Set(Object.values(GATES).map(g=>g.group))];
 root.innerHTML='<section class="setupbar panel" aria-label="Circuit settings"><label class="name">Circuit name<input id="project-name" value="'+esc(project.name)+'" maxlength="80"></label><label class="size">Qubits<select id="qubit-count">'+options([[1,'1 qubit'],[2,'2 qubits'],[3,'3 qubits']],project.n)+'</select></label><label class="examples">Worked examples<select id="example"><option value="">Choose an example…</option>'+Object.keys(EXAMPLES).map(k=>'<option>'+esc(k)+'</option>').join('')+'</select></label>'+button('undo','↶ Undo',!undo.length)+button('redo','↷ Redo',!redo.length)+'</section>'+
 '<div class="lab-grid"><aside class="sidebar"><section class="panel"><p class="eyebrow">01 / PREPARE</p><h2>Initial states</h2><div class="controls-grid"><label class="wide">Qubit to prepare & inspect<select id="inspect-qubit">'+qubitOptions(target)+'</select></label><label class="wide">Reference state<select id="initial-preset"><option value="">Custom angles</option>'+options([['0','|0⟩ · north'],['1','|1⟩ · south'],['+','|+⟩ · +X'],['-','|−⟩ · −X'],['+i','|+i⟩ · +Y'],['-i','|−i⟩ · −Y']],({})['unused'])+'</select></label><label>θ polar angle (°)<input id="initial-theta" type="number" min="0" max="180" step="1" value="'+initial.theta+'"></label><label>φ relative phase (°)<input id="initial-phi" type="number" min="-3600" max="3600" step="1" value="'+initial.phi+'"></label></div><p class="muted" style="font-size:12px">|ψ⟩ = cos(θ/2)|0⟩ + exp(iφ) sin(θ/2)|1⟩</p>'+button('prepare','Apply initial state',false,'primary')+'<p class="save-note">Preparation changes the input; it keeps the gates in your circuit.</p></section>'+
 '<section class="panel"><p class="eyebrow">02 / CHOOSE A GATE</p><h2>The gate library</h2><div class="gate-groups">'+groupNames.map(group=>'<h3>'+group+'</h3><div class="gate-grid">'+Object.values(GATES).filter(x=>x.group===group).map(x=>'<button class="gate" data-gate-pick="'+x.id+'" aria-pressed="'+(x.id===form.gate)+'" title="'+esc(x.name)+'" '+(x.targets+x.controls>project.n?'disabled':'')+'>'+gateLabel(x.id)+'</button>').join('')+'</div>').join('')+'</div><div class="gate-help"><strong>'+esc(g.name)+'</strong><p>'+esc(g.description)+'</p></div><div class="controls-grid"><label>Target qubit<select id="gate-target">'+qubitOptions(form.target)+'</select></label>'+(g.targets>1?'<label>Second target<select id="gate-second">'+qubitOptions(form.second)+'</select></label>':'')+(g.controls>0?'<label>Control qubit<select id="gate-control">'+qubitOptions(form.control)+'</select></label>':'')+(g.controls>1?'<label>Second control<select id="gate-control2">'+qubitOptions(form.control2)+'</select></label>':'')+Array.from({length:g.params},(_,i)=>'<label>'+['θ','φ','λ'][i]+' angle (°)<input data-param="'+i+'" type="number" min="-3600" max="3600" step="1" value="'+form.params[i]+'"></label>').join('')+'</div><label class="inverse"><input id="inverse" type="checkbox" '+(form.inverse?'checked':'')+'> Use inverse (dagger)</label><div class="row gate-actions">'+button('add','+ Add gate',project.ops.length>=MAX_GATES,'primary')+(selected>=0?button('update','Update selected'):button('insert','Insert at playhead',project.ops.length>=MAX_GATES))+'</div><p class="save-note">Disabled gates need more qubits. Gates act from left to right. All angles use degrees.</p></section></aside>'+
 '<div class="view-column"><section class="panel"><div class="view-head"><div><p class="eyebrow">03 / WATCH THE STATE</p><h2>The Bloch sphere'+(project.n>1?'s':'')+'</h2><p>One sphere per qubit · q0 is the rightmost bit in outcome labels</p></div><span class="badge">'+(preview?'Measured preview':'Ideal statevector')+'</span></div><div class="sphere-grid count-'+project.n+'" style="--count:'+project.n+'">'+Array.from({length:project.n},(_,q)=>{const r=reducedQubit(s,q);return '<article class="sphere-card '+(q===target?'selected':'')+'"><div class="qtitle">QUBIT '+q+'<button data-inspect="'+q+'">Inspect q'+q+'</button></div><div class="sphere-drawing" data-orbit="'+q+'" tabindex="0" role="group" aria-label="Rotate Bloch sphere q'+q+'">'+sphereSvg(r.vector,q,preview?[]:sim.states.map(state=>reducedQubit(state,q).vector))+'</div><div class="sphere-values">r = ('+r.vector.map(x=>x.toFixed(3)).join(', ')+')<br>Length <strong>'+r.length.toFixed(3)+'</strong> · Purity <strong>'+r.purity.toFixed(3)+'</strong></div><p class="sphere-info">'+(r.length>.999999?'Pure local state · vector on the surface.':'Mixed local state · this qubit is entangled with the rest of this pure register.')+'</p></article>';}).join('')+'</div><div class="camera"><label>Orbit '+Math.round(camera.yaw)+'°<input id="camera-yaw" type="range" min="-180" max="180" value="'+camera.yaw+'"></label><label>Tilt '+Math.round(camera.pitch)+'°<input id="camera-pitch" type="range" min="-80" max="80" value="'+camera.pitch+'"></label><label>Zoom<input id="camera-zoom" aria-label="Sphere zoom" type="range" min="0.65" max="1.1" step=".05" value="'+camera.zoom+'"></label>'+button('camera-reset','Reset view')+'</div><p class="preview-label">Viewing '+(preview?'the state after one measurement':'step '+step+' of '+project.ops.length)+'.</p><div class="tip">'+(guide?esc(guide):'The arrow is a state representation, not a particle. Dotted lines connect gate-boundary states; they are not a physical trajectory. Orbiting the view changes the camera only.')+'</div></section>'+
 '<section class="panel"><div class="row spread"><h2>Inspect q'+target+'</h2><label>Measurement basis<select id="measure-basis">'+options([['Z','Z · 0 / 1'],['X','X · + / −'],['Y','Y · +i / −i']],basis)+'</select></label></div><p class="muted" style="font-size:12px">Changing this basis changes the prediction display; it does not apply a gate or perform a measurement.</p><div class="prob-rows" id="local-probabilities">'+probRows([(1+component)/2,(1-component)/2],basis==='Z'?['|0⟩','|1⟩']:basis==='X'?['|+⟩','|−⟩']:['|+i⟩','|−i⟩'])+'</div><details><summary style="margin-top:18px">Density matrix & entanglement entropy</summary>'+htmlMatrix(local.matrix)+'<p class="muted" style="font-size:12px">Local entropy: '+local.entropy.toFixed(4)+' bits. For this globally pure simulation, zero means this qubit is separable from the rest; one is maximal entanglement across this one-qubit partition.</p></details></section></div></div>'+
 '<section class="panel circuit-panel"><div class="row spread"><div><p class="eyebrow">04 / BUILD & REPLAY</p><h2>Your circuit</h2></div><span class="save-note">'+project.ops.length+' / '+MAX_GATES+' gates · '+(storage?'Saved in this browser':'Local saving unavailable; download a copy')+'</span></div><div class="circuit-scroll"><div class="circuit-track"><div class="wire-labels">'+Array.from({length:project.n},(_,q)=>'<span>q'+q+'</span>').join('')+'</div>'+project.ops.map((o,i)=>'<button data-column="'+i+'" class="circuit-col '+(i+1===step?'active ':'')+(selected===i?'selected ':'')+(i>=step?'future':'')+'" aria-label="Step '+(i+1)+' '+esc(gateLabel(o.gate))+'" title="'+esc(gateLabel(o.gate))+(o.params.length?' ('+o.params.join(', ')+'°)':'')+(o.inverse?' inverse':'')+'"><span>'+String(i+1).padStart(2,'0')+'</span><svg viewBox="0 0 84 '+project.n*54+'">'+gateSymbol(o,project.n)+'</svg><span>'+esc(gateLabel(o.gate))+(o.params.length?' '+o.params[0]+'°':'')+'</span></button>').join('')+(!project.ops.length?'<p class="empty-circuit">Your wires are ready. Choose a gate and click Add gate, or load a worked example.</p>':'')+'</div></div><div class="transport">'+button('start','|◀ Initial state',!step&&!preview)+button('previous','← Step back',!step&&!preview)+button('play',timer?'Ⅱ Pause':'▶ Play',!project.ops.length)+button('next','Step forward →',step>=project.ops.length&&!preview)+button('end','Run to end',!project.ops.length&&!preview,'primary')+'<span class="position" id="step-position">Step '+step+' / '+project.ops.length+'</span>'+button('clear','Clear gates',!project.ops.length)+'</div><p class="save-note">Click a circuit column to select it, inspect the output after that gate, or edit its controls and angles. Add appends; Insert uses the current playhead.</p>'+
 (selected>=0?'<div class="editbar"><strong>Selected: step '+(selected+1)+' · '+esc(gateLabel(project.ops[selected].gate))+'</strong>'+button('left','← Move left',selected===0)+button('right','Move right →',selected===project.ops.length-1)+button('duplicate','Duplicate',project.ops.length>=MAX_GATES)+button('toggle-inverse','Invert gate')+button('insert','Insert at playhead',project.ops.length>=MAX_GATES)+button('delete','Remove',false,'danger')+button('deselect','Done editing')+'</div>':'')+
 '<div class="status '+(error?'error':'')+'" role="status" aria-live="polite" id="lab-status">'+esc(message)+'</div></section>'+
 '<div class="readout-grid"><section class="panel"><p class="eyebrow">THE WHOLE REGISTER</p><h2>Joint Z probabilities</h2><p class="muted" style="font-size:12px">Bitstrings read q'+(project.n-1)+' … q0. These probabilities alone do not determine the full quantum state.</p><div class="prob-rows" id="joint-probabilities">'+probRows(stateP,stateP.map((_,i)=>'|'+i.toString(2).padStart(project.n,'0')+'⟩'))+'</div></section>'+
 '<section class="panel"><p class="eyebrow">05 / MEASURE & COMPARE</p><h2>From predictions to outcomes</h2><div class="measurement-controls"><label>Fresh-copy shots<input id="shots" type="number" min="1" max="10000" value="'+shots+'"></label><label>Basis for all sampled qubits<select id="sample-basis">'+options([['Z','Z basis'],['X','X basis'],['Y','Y basis']],basis)+'</select></label>'+button('sample','Sample fresh copies',false,'primary')+button('measure','Measure q'+target+' once')+'<p class="save-note wide">Sampling repeats the current state, not the collapsed result of the preceding shot. A single measurement changes only the preview. Run the circuit again to reset it.</p></div>'+
 (shotsResult?'<p class="shot-summary" id="shot-summary">'+shotsResult.shots+' shots · '+shotsResult.basis+' basis · '+(preview?'measured preview':'step '+step)+'</p><div class="prob-rows">'+probRows(shotsResult.counts.map(c=>c/shotsResult.shots),shotsResult.counts.map((_,i)=>i.toString(2).padStart(project.n,'0')),{counts:shotsResult.counts})+'</div>'+button('csv','Download counts CSV'):'')+'</section></div>'+
 '<details class="panel details-panel"><summary>Statevector: amplitudes, probabilities & phases</summary><p>Amplitudes include complex numbers. A common global phase does not change measurement probabilities.</p><div class="table-scroll"><table><thead><tr><th>Basis state</th><th>Complex amplitude</th><th>Probability</th><th>Phase</th></tr></thead><tbody>'+s.map((a,i)=>'<tr><td>|'+i.toString(2).padStart(project.n,'0')+'⟩</td><td>'+esc(complexText(a,5))+'</td><td>'+pct(stateP[i])+'</td><td>'+(stateP[i]<1e-12?'Undefined (zero amplitude)':'<i class="phase-dot" style="background:hsl('+(Math.atan2(a[1],a[0])*180/Math.PI+180)+',65%,65%)"></i>'+(Math.atan2(a[1],a[0])*180/Math.PI).toFixed(1)+'°')+'</td></tr>').join('')+'</tbody></table></div></details>'+
 '<details class="panel details-panel"><summary>Selected gate matrix on the full register</summary><p>Matrix order: |'+(0).toString(2).padStart(project.n,'0')+'⟩ through |'+(2**project.n-1).toString(2)+'⟩. Columns show where each input basis state goes.</p>'+ '<div id="gate-matrix">'+matrixForForm()+'</div></details>'+
 '<section class="panel export-panel"><p class="eyebrow">KEEP YOUR WORK</p><h2>Save, share & continue in Qiskit</h2><p class="muted" style="font-size:12px">Exports contain the complete preparation and unitary circuit. Playback position, sampled counts and temporary measurement collapse are not part of the exported circuit.</p><div class="row">'+button('json','Download circuit JSON')+'<label class="upload-label">Import circuit JSON<input type="file" id="import-circuit" accept=".json,application/json" aria-label="Import circuit JSON"></label>'+button('qiskit','Download Qiskit Python')+button('svg','Download circuit SVG')+button('share','Copy share link')+'</div>'+(share?'<label>Shareable circuit link<input class="share-output" id="share-link" readonly value="'+esc(share)+'"></label>':'')+'<details><summary>Preview generated Qiskit code</summary><textarea id="qiskit-code" aria-label="Generated Qiskit Python" readonly>'+esc(qiskitCode(project))+'</textarea></details><p class="save-note">Autosave is local to this browser. Download JSON for a durable copy. Anyone with a share link can see its circuit.</p></section>';
 const restore=focusId?root.querySelector('#'+CSS.escape(focusId)):focusAction?root.querySelector('[data-action="'+focusAction+'"]'):focusGate?root.querySelector('[data-gate-pick="'+focusGate+'"]'):null;
 if(restore&&!restore.disabled)restore.focus({preventScroll:true});
}
function probRows(ps,labels,{counts=null}={}){return ps.map((p,i)=>'<div class="prob-row"><span>'+esc(labels[i])+'</span><div class="bar"><i style="width:'+Math.max(0,Math.min(100,p*100))+'%"></i></div><strong>'+(counts?counts[i]:pct(p))+'</strong></div>').join('');}
function buildOp(){const g=GATES[form.gate];return {gate:g.id,targets:g.targets===2?[form.target,form.second]:[form.target],controls:g.controls===2?[form.control,form.control2]:g.controls===1?[form.control]:[],params:form.params.slice(0,g.params),inverse:form.inverse};}
function matrixForForm(){try{const op=buildOp();validateProject({...blankProject(project.n),ops:[op]});return htmlMatrix(operationMatrix(project.n,op));}catch{return '<p class="muted">Choose distinct, available wires to see this gate matrix.</p>';}}
function updateSpheres(){const sim=simulate(project,step),s=preview||sim.state;root.querySelectorAll('[data-orbit]').forEach(el=>{const q=+el.dataset.orbit;el.innerHTML=sphereSvg(reducedQubit(s,q).vector,q,preview?[]:sim.states.map(st=>reducedQubit(st,q).vector));});}
function updateFormForN(){form.target=Math.min(form.target,project.n-1);form.second=project.n>1?(form.target===0?1:0):0;form.control=project.n>1?(form.target===0?1:0):0;form.control2=[0,1,2].find(q=>q!==form.target&&q!==form.control)??2;if(GATES[form.gate].targets+GATES[form.gate].controls>project.n)form.gate='H';}
function selectOp(i){selected=i;step=i+1;preview=null;shotsResult=null;const o=project.ops[i];form={gate:o.gate,target:o.targets[0],second:o.targets[1]??1,control:o.controls[0]??(o.targets[0]===0?1:0),control2:o.controls[1]??2,params:[...o.params,...[90,0,0]].slice(0,3),inverse:o.inverse};notify('Editing step '+(i+1)+'. Change the gate settings, then click Update selected.');}
function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function setStep(n){stop();step=Math.max(0,Math.min(n,project.ops.length));preview=null;shotsResult=null;notify('Showing the state after '+step+' gate'+(step===1?'':'s')+'.');}
root.addEventListener('click',async e=>{
 const pick=e.target.closest('[data-gate-pick]'),col=e.target.closest('[data-column]'),inspect=e.target.closest('[data-inspect]'),a=e.target.closest('[data-action]');
 if(!pick&&!col&&!inspect&&!a)return;
 try{
  if(pick){form.gate=pick.dataset.gatePick;const chosen=GATES[form.gate],unused=Array.from({length:project.n},(_,q)=>q).filter(q=>q!==form.target);if(chosen.targets>1)form.second=unused.shift();if(chosen.controls>0)form.control=unused.shift();if(chosen.controls>1)form.control2=unused.shift();notify(GATES[form.gate].name+' selected. Set its wires and angles, then add or update.');}
  else if(col){stop();selectOp(+col.dataset.column);}
  else if(inspect){target=+inspect.dataset.inspect;}
  else{
   const action=a.dataset.action,next=clone(project),o=buildOp();
   if(['add','insert','update'].includes(action)){
    validateProject({...blankProject(project.n),ops:[o]});
    if(action==='update'){if(selected<0)throw Error('Select a circuit column first.');next.ops[selected]=o;}
    else if(action==='insert')next.ops.splice(step,0,o);else next.ops.push(o);
    commit(next,gateLabel(o.gate)+' '+(action==='update'?'updated.':'added to your circuit.'));if(action!=='update')selected=-1;
   }else if(action==='prepare'){next.initial[target]={theta:Number(root.querySelector('#initial-theta').value),phi:Number(root.querySelector('#initial-phi').value)};commit(next,'Initial state updated; your gates are preserved.');}
   else if(action==='clear'){next.ops=[];commit(next,'Gates cleared. Undo restores the previous circuit.');selected=-1;}
   else if(action==='undo'||action==='redo'){
    const from=action==='undo'?undo:redo,to=action==='undo'?redo:undo;if(!from.length)return;stop();to.push(clone(project));project=from.pop();step=project.ops.length;selected=-1;target=Math.min(target,project.n-1);preview=null;shotsResult=null;share='';guide='';updateFormForN();save();notify(action==='undo'?'Last edit undone.':'Edit restored.');
   }else if(['left','right','delete','duplicate','toggle-inverse'].includes(action)){
    if(selected<0)throw Error('Select a circuit column first.');let index=selected;
    if(action==='left'||action==='right'){const j=selected+(action==='left'?-1:1);if(j<0||j>=next.ops.length)return;[next.ops[selected],next.ops[j]]=[next.ops[j],next.ops[selected]];index=j;}
    else if(action==='delete'){next.ops.splice(selected,1);index=-1;}
    else if(action==='duplicate'){next.ops.splice(selected+1,0,clone(next.ops[selected]));index++;}
    else next.ops[selected].inverse=!next.ops[selected].inverse;
    commit(next,'Circuit updated. Undo is available.');selected=index;if(index>=0)selectOp(index);
   }else if(action==='deselect'){selected=-1;}
   else if(action==='start')setStep(0);
   else if(action==='previous')setStep(step-1);
   else if(action==='next')setStep(step+1);
   else if(action==='end')setStep(project.ops.length);
   else if(action==='play'){
    if(timer){stop();notify('Playback paused.');}
    else{preview=null;shotsResult=null;if(step>=project.ops.length)step=0;timer=setInterval(()=>{step++;if(step>=project.ops.length)stop();notify('Playback: step '+step+' of '+project.ops.length+'.');render();},800);notify('Playing one gate at a time.');}
   }else if(action==='camera-reset'){camera={yaw:32,pitch:18,zoom:1};}
   else if(action==='sample'){shots=Number(root.querySelector('#shots').value);shotsResult=sampleShots(current(),shots,basis);notify('Sampled '+shots+' fresh copies of the state at the current step.');}
   else if(action==='measure'){stop();const m=measureOne(current(),target,basis);preview=m.state;shotsResult=null;notify('One '+basis+' measurement of q'+target+' returned '+(basis==='Z'?m.outcome:(m.outcome?'−':'+'))+'. This collapsed preview is temporary. Run to end to prepare the circuit again.');}
   else if(action==='json'){download(JSON.stringify(project,null,2)+'\n','quantum-circuit.json','application/json');notify('Circuit JSON downloaded.');}
   else if(action==='qiskit'){download(qiskitCode(project),'quantum-circuit.py','text/x-python');notify('Qiskit Python downloaded.');}
   else if(action==='svg'){download(circuitSvg(),'quantum-circuit.svg','image/svg+xml');notify('Circuit diagram downloaded as SVG.');}
   else if(action==='csv'){if(!shotsResult)return;download('basis,outcome,count,shots\n'+shotsResult.counts.map((count,i)=>[shotsResult.basis,i.toString(2).padStart(project.n,'0'),count,shotsResult.shots].join(',')).join('\n')+'\n','quantum-counts.csv','text/csv');notify('Counts downloaded.');}
   else if(action==='share'){const encoded=encode(JSON.stringify(project));if(encoded.length>14000)throw Error('This circuit is too large for a practical share link. Download circuit JSON instead.');share=location.origin+location.pathname+'#circuit='+encoded;try{await navigator.clipboard.writeText(share);notify('Share link copied. It contains your complete circuit.');}catch{notify('Your share link is ready below. Select it and copy it.');}}
  }
 }catch(err){notify(err.message,true);}
 render();
});
root.addEventListener('change',async e=>{
 const el=e.target;
 try{
  if(el.id==='project-name'){undo.push(clone(project));if(undo.length>80)undo.shift();redo=[];project.name=el.value.slice(0,80)||'My quantum circuit';save();share='';notify('Circuit renamed.');root.querySelector('#lab-status').textContent=message;root.querySelector('#share-link')?.parentElement.remove();root.querySelector('[data-action="undo"]').disabled=false;root.querySelector('[data-action="redo"]').disabled=true;return;}
  else if(el.id==='qubit-count'){
   const n=+el.value,next=clone(project);if(next.ops.some(o=>[...o.targets,...o.controls].some(q=>q>=n)))throw Error('Remove gates on the higher-numbered qubits before reducing the circuit size.');
   next.n=n;next.initial=Array.from({length:n},(_,q)=>next.initial[q]||{theta:0,phi:0});commit(next,'Circuit now has '+n+' qubit'+(n===1?'':'s')+'.');selected=-1;updateFormForN();
  }else if(el.id==='example'&&el.value){const name=el.value;commit(exampleProject(name),'Loaded '+name+'. Use Step forward to inspect each gate.');guide=EXAMPLES[name].why;selected=-1;target=0;updateFormForN();}
  else if(el.id==='inspect-qubit'){target=+el.value;}
  else if(el.id==='initial-preset'&&el.value){const states={'0':[0,0],'1':[180,0],'+':[90,0],'-':[90,180],'+i':[90,90],'-i':[90,-90]},[theta,phi]=states[el.value],next=clone(project);next.initial[target]={theta,phi};commit(next,'Prepared '+el.selectedOptions[0].textContent+' on q'+target+'.');}
  else if(el.id==='gate-target')form.target=+el.value;
  else if(el.id==='gate-second')form.second=+el.value;
  else if(el.id==='gate-control')form.control=+el.value;
  else if(el.id==='gate-control2')form.control2=+el.value;
  else if(el.dataset.param!==undefined){form.params[+el.dataset.param]=Number(el.value);root.querySelector('#gate-matrix').innerHTML=matrixForForm();return;}
  else if(el.id==='inverse')form.inverse=el.checked;
  else if(el.id==='measure-basis'||el.id==='sample-basis'){basis=el.value;shotsResult=null;}
  else if(el.id==='shots'){shots=Number(el.value);return;}
  else if(el.id==='initial-theta'||el.id==='initial-phi')return;
  else if(el.id==='import-circuit'){
   const file=el.files?.[0];if(!file)return;if(file.size>60000)throw Error('Circuit JSON must be smaller than 60 KB.');
   const next=validateProject(JSON.parse(await file.text()));commit(next,'Imported circuit. Its content was validated before loading.');selected=-1;target=0;updateFormForN();
  }else return;
 }catch(err){notify(err.message,true);}
 render();
});
root.addEventListener('input',e=>{
 const t=e.target;if(t.id==='camera-yaw')camera.yaw=+t.value;else if(t.id==='camera-pitch')camera.pitch=+t.value;else if(t.id==='camera-zoom')camera.zoom=+t.value;else return;
 updateSpheres();
});
let drag=null;
root.addEventListener('pointerdown',e=>{if(!e.target.closest('[data-orbit]'))return;drag={x:e.clientX,y:e.clientY,yaw:camera.yaw,pitch:camera.pitch};root.setPointerCapture(e.pointerId);e.preventDefault();});
root.addEventListener('pointermove',e=>{if(!drag)return;camera.yaw=((drag.yaw+(e.clientX-drag.x)*.5+540)%360)-180;camera.pitch=Math.max(-80,Math.min(80,drag.pitch+(e.clientY-drag.y)*.5));root.querySelector('#camera-yaw').value=camera.yaw;root.querySelector('#camera-pitch').value=camera.pitch;updateSpheres();});
root.addEventListener('pointerup',()=>{drag=null;});root.addEventListener('pointercancel',()=>{drag=null;});
root.addEventListener('keydown',e=>{if(!e.target.closest('[data-orbit]'))return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();camera.yaw=((camera.yaw+(e.key==='ArrowLeft'?-8:e.key==='ArrowRight'?8:0)+540)%360)-180;camera.pitch=Math.max(-80,Math.min(80,camera.pitch+(e.key==='ArrowUp'?8:e.key==='ArrowDown'?-8:0)));updateSpheres();}});
document.querySelector('#theme').onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='light'?'dark':'light';try{localStorage.setItem('quantum-zero-lab-theme',document.documentElement.dataset.theme);}catch{}};
document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notify('Full screen is unavailable in this browser. Your lab remains usable.');render();}};
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select')||e.target.closest('[data-orbit]'))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();root.querySelector('[data-action="'+(e.shiftKey?'redo':'undo')+'"]')?.click();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();}});
updateFormForN();render();
