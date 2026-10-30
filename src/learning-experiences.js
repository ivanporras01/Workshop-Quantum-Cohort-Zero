// Workshop Quantum Cohort Zero — professionally sequenced, public-facing concept experiences.
// Companion visualizations are instructional models, not claims of hardware measurements.
export const DESIGNS={
 '2026-11-09|Welcome and Program Introduction':{
  type:'journey',eyebrow:'YOUR QUANTUM JOURNEY STARTS HERE',
  idea:'Quantum learning begins with a question—not a formula.',
  why:'Over five days, you will move from basic states to secure communications, Python, and real laboratory measurement skills.',
  prompt:'Follow the scientific journey. Select each stage to see how a good scientific investigation develops.',
  take:'Prediction, simulation, and experiment are three different kinds of evidence.'
 },
 '2026-11-09|Introduction to Quantum Computing and Qubits':{
  type:'qubit',eyebrow:'CLASSICAL INFORMATION → QUANTUM INFORMATION',
  idea:'A qubit is described by amplitudes. Squared magnitudes become measurement probabilities.',
  why:'Knowing what a state predicts is the foundation for interpreting every later gate and circuit.',
  prompt:'Change the Bloch polar angle. Observe the Z-basis probabilities change continuously while any single measurement still returns 0 or 1.',
  take:'A measurement gives one classical result; probabilities describe repeated preparations.'
 },
 '2026-11-09|Introduction to Bloch Sphere and gates':{
  type:'sphere',eyebrow:'ONE QUBIT, A WHOLE SPHERE OF DIRECTIONS',
  idea:'The Bloch sphere maps a pure qubit state to a point on a unit sphere.',
  why:'The X, Y and Z directions make relative phase and basis changes easier to see.',
  prompt:'Use the six reference states, then open the full Bloch sphere to explore H, X, Y and Z gates.',
  take:'Equal probabilities in one basis do not mean two quantum states are identical.'
 },
 '2026-11-09|Introduction to IBM Qiskit':{
  type:'circuit',eyebrow:'FROM A MODEL TO A QUANTUM CIRCUIT',
  idea:'A quantum circuit is an ordered set of operations, followed by an optional measurement.',
  why:'Qiskit lets you represent, inspect, and eventually run circuits while making the sequence explicit.',
  prompt:'Select a gate and compare the predicted measurement probabilities of the circuit.',
  take:'Drawing a Qiskit circuit is not the same as executing it on hardware.'
 },
 '2026-11-10|Review of previous day':{
  type:'review',eyebrow:'RECONNECT MONDAY’S BIG IDEAS',
  idea:'A state, a gate, and a measurement are three distinct parts of a quantum experiment.',
  why:'Reviewing their roles prevents confusion when quantum concepts meet network security.',
  prompt:'Select a stage and explain aloud what is happening to the qubit.',
  take:'Name the state, operation, and basis before predicting an outcome.'
 },
 '2026-11-10|Intro to Computer Networking and Encryption':{
  type:'network',eyebrow:'HOW DOES INFORMATION STAY SECURE?',
  idea:'A network carries data; cryptography helps protect it against observation, tampering, and impersonation.',
  why:'Quantum risk matters because many digital security systems rely on public-key cryptography.',
  prompt:'Select confidentiality, integrity, or authentication to see which security problem it addresses.',
  take:'Encryption, integrity, and authentication are different protections.'
 },
 '2026-11-10|Energy Polarization':{
  type:'polar',eyebrow:'LIGHT HAS A DIRECTION OF OSCILLATION',
  idea:'Linear polarization describes the electric field’s direction perpendicular to the path of light.',
  why:'Polarization can represent classical wave orientation and can also encode photon polarization states.',
  prompt:'Rotate a second ideal polarizer to see Malus’s law I/I₀ = cos²θ in action.',
  take:'Real optical hardware has losses and leakage; the demo is an ideal classical intensity model.'
 },
 '2026-11-10|Quantum Key Distribution':{
  type:'bb84',eyebrow:'SHARED KEYS USING QUANTUM STATES',
  idea:'In BB84, two participants independently choose measurement bases and retain matching-basis positions.',
  why:'The basis choices help detect some forms of interception, but key security requires much more than a sifted string.',
  prompt:'Generate an eight-position example and see which bits survive basis sifting.',
  take:'BB84 basis sifting is a teaching model—not an operational secure key service.'
 },
 '2026-11-12|Review of previous day':{
  type:'review',eyebrow:'REVIEW THE COMMUNICATION CHAIN',
  idea:'Communications security, polarization, and QKD connect physics with information systems.',
  why:'Thursday’s post-quantum discussion builds on these distinctions.',
  prompt:'Connect the network, the polarized signal, and basis-matching steps before advancing.',
  take:'Quantum key distribution and post-quantum cryptography are not synonyms.'
 },
 '2026-11-12|Introduction to Post Quantum Cryptology':{
  type:'pqc',eyebrow:'SECURITY DESIGNED FOR THE QUANTUM ERA',
  idea:'Post-quantum cryptography uses classical algorithms designed to resist known quantum attacks.',
  why:'Organizations need secure key establishment and signatures as vulnerable public-key systems evolve.',
  prompt:'Choose a task to see whether a key-encapsulation or signature algorithm fits it.',
  take:'ML-KEM establishes secrets; ML-DSA and SLH-DSA provide digital signatures.'
 },
 '2026-11-12|Post Quantum Cryptology Implementation':{
  type:'migration',eyebrow:'FROM STANDARD TO REAL DEPLOYMENT',
  idea:'A secure algorithm is only one component of a functioning secure system.',
  why:'Real deployments must manage devices, libraries, client compatibility, certificates, and failure recovery.',
  prompt:'Walk through a four-stage migration and reveal the evidence needed at each phase.',
  take:'The safest migration includes inventory, interoperable testing, monitoring, and rollback.'
 },
 '2026-11-13|Review of previous day':{
  type:'review',eyebrow:'REVISIT THE CRYPTOGRAPHY DECISIONS',
  idea:'Choose the cryptographic primitive based on the security requirement, not its popularity.',
  why:'Friday’s technician and Python topics rely on careful requirements, reproducibility, and testing.',
  prompt:'Revisit key establishment, digital signatures, and deployment evidence.',
  take:'Standards, configuration, testing, and operations are all part of cryptographic security.'
 },
 '2026-11-13|Role of the Quantum Technician':{
  type:'technician',eyebrow:'TURN IDEAS INTO REPRODUCIBLE MEASUREMENTS',
  idea:'Quantum technicians use instruments, safety practices, and documentation to make experiments repeatable.',
  why:'A correct measurement is as much about setup, reference, and uncertainty as it is about the result.',
  prompt:'Inspect an equipment signal chain and discover where errors can enter.',
  take:'A trace is meaningful only when instrument settings and conditions are documented.'
 },
 '2026-11-13|Python for Quantum':{
  type:'python',eyebrow:'MAKE THE MATHEMATICS EXECUTABLE',
  idea:'Python makes amplitudes, probabilities, simulation data, and experimental records easier to analyze.',
  why:'Even a few lines of readable code can test a prediction before using a large framework.',
  prompt:'Adjust the two real amplitudes. Watch the squares sum to one and inspect the corresponding Python logic.',
  take:'For complex amplitudes, compute probability with abs(a)**2, not a*a.'
 },
 '2026-11-14|Review of previous day':{
  type:'review',eyebrow:'PREPARE TO EXPLAIN WHAT YOU MEASURE',
  idea:'Scientific results require clear settings, a mathematical model, and an honest conclusion.',
  why:'The Saturday lab compares an ideal wave prediction to real instrument readings.',
  prompt:'Review the process of predicting, checking, documenting, and evaluating evidence.',
  take:'Every experimental conclusion needs its conditions and limitations.'
 },
 '2026-11-14|Polarity and energy waves':{
  type:'wave',eyebrow:'A WAVE IS A SIGNAL THAT CHANGES OVER TIME',
  idea:'Amplitude, frequency, phase, and polarity determine how an electrical waveform is measured.',
  why:'Without these definitions, oscilloscope traces can be interpreted incorrectly.',
  prompt:'Change frequency to see the period respond. Compare peak and peak-to-peak voltage.',
  take:'Period T = 1/f; a zero-offset sine with peak amplitude A has 2A peak-to-peak.'
 },
 '2026-11-14|Applied energy waves':{
  type:'interference',eyebrow:'OBSERVE CLASSICAL WAVE INTERFERENCE',
  idea:'Two synchronized waves can reinforce or cancel depending on their relative phase.',
  why:'This model prepares participants to observe and record oscilloscope data, and to understand an analogy to quantum interference.',
  prompt:'Move from 0° to 180° and compare the ideal equal-resistor averaging output.',
  take:'Classical interference is an analogy here; it is not a quantum device measurement.'
 },
 '2026-11-14|Future Projects':{
  type:'projects',eyebrow:'TURN A WORKSHOP IDEA INTO A REAL PROJECT',
  idea:'The strongest project begins with a testable question and ends with reproducible evidence.',
  why:'A scoped demonstration connects quantum knowledge to technician, software, and workforce skills.',
  prompt:'Choose a capstone direction and see the smallest credible deliverable.',
  take:'A smaller tested project is better than a broad project with unverified claims.'
 }
};
export const getDesign=lesson=>DESIGNS[lesson.date+'|'+lesson.title]||null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const sequence=(steps,title)=>`<div class="concept-sequence" aria-label="${esc(title)}">${steps.map((s,i)=>`<div class="sequence-node"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(s)}</strong></div>`).join('')}</div>`;
const stat=(title,value,id,help)=>`<div class="stage-stat"><small>${title}</small><strong id="${id}">${value}</strong><span>${help}</span></div>`;
const VISUAL_PATHS={
 'Review steps':{labels:['RECALL','PREDICT','VERIFY'],notes:['What is the concept?','What should occur?','What does the evidence show?'],caption:'Review the previous concepts before attempting a new topic.'},
 'Secure communications':{labels:['SENDER','PROTECTION','RECEIVER'],notes:['Data and identity','TLS: keys + authenticity','Verify and decrypt'],caption:'Encryption protects content; authentication verifies identity, and integrity detects tampering.'},
 'Post-quantum security':{labels:['RISK','PQC METHOD','MIGRATION'],notes:['Legacy RSA / ECC','ML-KEM or ML-DSA','Pilot and validate'],caption:'NIST post-quantum standards have different uses: ML-KEM establishes secrets and ML-DSA signs messages.'},
 'Technician instrument chain':{labels:['SOURCE','CIRCUIT','MEASURE'],notes:['Generator output','Controlled test network','Scope + documented data'],caption:'Record the signal reference, equipment settings, units, and uncertainties at each stage.'}
};
const visualSvg=variant=>{
 const model=VISUAL_PATHS[variant]||VISUAL_PATHS['Review steps'];
 const xs=[102,310,518];
 const nodes=xs.map((x,i)=>`<g><circle cx="${x}" cy="92" r="47" fill="${['#194c5b','#273d60','#2d4b4d'][i]}" stroke="${['#7fe5da','#bbb5ff','#caf0aa'][i]}" stroke-width="2"/><text x="${x}" y="95" font-size="13" fill="#f4ffff" font-weight="750" text-anchor="middle">${esc(model.labels[i])}</text><text x="${x}" y="160" font-size="11" fill="#bcdce4" text-anchor="middle">${esc(model.notes[i])}</text></g>`).join('');
 return `<div class="concept-flow-diagram"><svg class="exhibit-diagram" viewBox="0 0 620 188" role="img" aria-label="${esc(variant)} topic-specific visual explanation"><rect x="6" y="6" width="608" height="176" rx="17" fill="#09263b" stroke="#477587"/><path d="M151 92H259 M358 92H467" stroke="#9bd9d7" stroke-width="3" stroke-dasharray="5 7" fill="none"/><path d="m247 86 12 6-12 6 m208-12 12 6-12 6" stroke="#d2ffb4" stroke-width="2" fill="none"/>${nodes}</svg><p class="concept-flow-caption">${esc(model.caption)}</p></div>`;
};
const demoChoice=(options)=>`<div class="visual-options">${options.map((o,i)=>`<button type="button" class="visual-choice" data-demo-option="${i}" aria-pressed="${i===0}">${esc(o.label)}</button>`).join('')}</div><div class="visual-reveal" data-demo-message aria-live="polite">${esc(options[0].text)}</div>`;
const simpleOptions={
 journey:[
  ['Ask a question','What do we want to know? Example: what outcome follows a Hadamard gate?'],
  ['Choose a model','Define the ideal qubit, operation, basis and assumptions.'],
  ['Predict','Calculate a result before seeing the simulation or measurement.'],
  ['Observe','Record what a simulator or instrument actually returns.'],
  ['Explain','Compare evidence with the model and report limitations.']
 ],
 circuit:[
  ['H on |0⟩','Hadamard prepares |+⟩. Ideal Z measurement: P(0)=50%, P(1)=50%.'],
  ['X on |0⟩','Pauli X prepares |1⟩. Ideal Z measurement: P(1)=100%.'],
  ['Z on |0⟩','Pauli Z leaves |0⟩ unchanged. Ideal Z measurement: P(0)=100%.']
 ],
 network:[
  ['Confidentiality','A shared secret and symmetric encryption help keep content private against passive observers.'],
  ['Integrity','Authenticated encryption or message authentication helps detect unauthorized modification.'],
  ['Authentication','Verified identities and signatures help prevent impersonation; encryption alone does not identify the sender.']
 ],
 pqc:[
  ['Establish a secret','ML-KEM is a NIST-standardized key encapsulation mechanism for establishing shared secrets.'],
  ['Sign software','ML-DSA is a NIST-standardized digital signature algorithm for authenticity and integrity.'],
  ['Alternative signature','SLH-DSA is a NIST-standardized hash-based digital signature scheme.']
 ],
 technician:[
  ['Signal source','Check waveform, frequency, amplitude, output impedance and instrument safety settings.'],
  ['Test circuit','Record components, connections, common ground and controlled changes.'],
  ['Oscilloscope','Verify probe attenuation, channel coupling, timebase, triggering and measurement scale.'],
  ['Lab record','Save conditions, units, screenshots, uncertainty, and the observed conclusion.']
 ],
 migration:[
  ['Inventory','Find affected TLS endpoints, firmware signers, VPNs, PKI dependencies and devices.'],
  ['Prioritize','Classify data retention, sensitivity and upgrade constraints.'],
  ['Test','Check algorithm/protocol interoperability, performance and rollback in a pilot.'],
  ['Roll out','Deploy progressively with monitoring and incident response.']
 ],
 projects:[
  ['Bloch-sphere visualizer','Deliver: six states, X/Y/Z measurement probabilities, gates, and a documented model test.'],
  ['BB84 basis simulator','Deliver: a reproducible seeded example of random bases, sifting, and clear security limitations.'],
  ['Applied waves lab','Deliver: a safe wiring diagram, phase predictions, oscilloscope screenshots and measurement uncertainty.'],
  ['Python quantum notebook','Deliver: normalized complex amplitudes, sample probabilities, plots, and explanations.']
 ],
 review:[
  ['Recall the concept','Explain the most important idea aloud in ordinary words, without reading the formula.'],
  ['Predict a result','State an assumption and predict what one example should produce.'],
  ['Check the evidence','Compare your prediction with the simulator, code or measurement, clearly labeling the source.']
 ]
};
function choiceCard(type,caption='Choose a stage'){
 const options=simpleOptions[type].map(([label,text])=>({label,text}));
 return `<div class="interactive-stage"><span class="stage-caption">${caption}</span>${demoChoice(options)}</div>`;
}
function svgWave(phase=0,freq=2){
 const samples=Array.from({length:165},(_,i)=>{const x=15+i*3.6,t=i/164*2*Math.PI*freq;return{x,a:Math.sin(t),b:Math.sin(t+phase),sum:(Math.sin(t)+Math.sin(t+phase))/2}});
 const poly=key=>samples.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)},${(95-p[key]*54).toFixed(2)}`).join(' ');
 return `<svg class="exhibit-wave" viewBox="0 0 620 190" role="img" aria-label="Theoretical sine waves and their equal-weight combined signal"><rect width="620" height="190" rx="15" fill="#071e32"/><path d="M0 95H620 M0 48H620 M0 142H620" stroke="#416377" stroke-dasharray="4 7"/><path d="${poly('a')}" stroke="#64dfd5" stroke-width="2.5" fill="none"/><path d="${poly('b')}" stroke="#bdb0ff" stroke-width="2.5" fill="none"/><path d="${poly('sum')}" stroke="#d7fa9c" stroke-width="3.1" fill="none"/><text x="16" y="179" fill="#89e8dd" font-size="12">A</text><text x="37" y="179" fill="#c6baff" font-size="12">B</text><text x="58" y="179" fill="#dcffac" font-size="12">AVERAGE</text></svg>`;
}
function sliderLab(type){
 if(type==='qubit')return `<div class="slider-stage"><div class="concept-comparison"><div><span class="mini-symbol">0 / 1</span><strong>Classical bit</strong><small>One definite value at a time.</small></div><div><span class="mini-symbol">α|0⟩ + β|1⟩</span><strong>Qubit state</strong><small>Complex amplitudes and measurement probabilities.</small></div></div><label for="angle-qubit">Bloch polar angle θ: <output id="angle-qubit-label">90°</output></label><input id="angle-qubit" data-demo-slider="qubit" type="range" min="0" max="180" value="90" step="5"/><div class="stage-stats">${stat('P(0)','50%','qubit-p0','Z-basis measurement')}${stat('P(1)','50%','qubit-p1','Z-basis measurement')}</div><p class="visual-explainer">Ideal model: P(0) = cos²(θ/2) and P(1) = sin²(θ/2).</p></div>`;
 if(type==='polar')return `<div class="slider-stage"><div class="polar-stage"><div class="polar-axis"><span class="polar-beam">E →</span><span class="polar-filter" id="polar-filter">▥</span><span class="polar-light" id="polar-light">Light transmitted</span></div></div><label for="angle-polar">Angle between ideal polarizers: <output id="angle-polar-label">45°</output></label><input id="angle-polar" data-demo-slider="polar" type="range" min="0" max="90" value="45" step="5"/><div class="stage-stats">${stat('Ideal transmitted intensity','50.0%','polar-value','I / I₀ = cos²θ')}${stat('Analyzer angle','45°','polar-angle-read','0° aligned; 90° crossed')}</div><p class="visual-explainer">This is a classical ideal-optics model. Always follow supervised optical safety rules.</p></div>`;
 if(type==='python')return `<div class="slider-stage"><div class="stage-code"><span>Python preview</span><pre>from math import radians, sin, cos\nangle = radians(<b id="py-angle-code">45</b>)\na, b = cos(angle), sin(angle)\np0, p1 = abs(a)**2, abs(b)**2</pre></div><label for="angle-python">Real-state parameter angle: <output id="angle-python-label">45°</output></label><input id="angle-python" data-demo-slider="python" type="range" min="0" max="90" value="45" step="5"/><div class="stage-stats">${stat('P(0)','0.500','python-p0','abs(a)²')}${stat('P(1)','0.500','python-p1','abs(b)²')}</div><p class="visual-explainer">Try 30° or 60°. The two probabilities still sum to 1 (within rounding).</p></div>`;
 if(type==='wave'||type==='interference')return `<div class="slider-stage"><div id="demo-wave" class="wave-stage">${svgWave(0,2)}</div><label for="angle-${type}">${type==='wave'?'Frequency (Hz)':'Relative phase between sources'}: <output id="angle-${type}-label">${type==='wave'?'2 Hz':'0°'}</output></label><input id="angle-${type}" data-demo-slider="${type}" type="range" min="${type==='wave'?'1':'0'}" max="${type==='wave'?'5':'180'}" value="${type==='wave'?'2':'0'}" step="${type==='wave'?'1':'15'}"/><div class="stage-stats">${stat(type==='wave'?'Period':'Ideal output voltage',type==='wave'?'0.500 s':'2.000 Vpp','wave-main',type==='wave'?'T = 1/f':'Equal 10 kΩ resistors, two 2 Vpp sources')}${stat(type==='wave'?'Input amplitude':'Normalized squared output',type==='wave'?'2.0 V peak':'1.000','wave-secondary',type==='wave'?'4.0 V peak-to-peak':'cos²(φ/2)')}</div><p class="visual-explainer">The traces depict an ideal classical model. Do not directly connect two active generator outputs; follow supervised low-voltage lab procedures.</p></div>`;
 return '';
}
function sphereDiagram(){
 return `<div class="sphere-lesson-graphic"><svg viewBox="0 0 620 245" role="img" aria-label="Six Bloch reference directions: positive and negative X, Y and Z"><ellipse cx="310" cy="125" rx="106" ry="93" fill="#143b58" stroke="#79ced2" stroke-width="2"/><ellipse cx="310" cy="125" rx="106" ry="25" fill="none" stroke="#9bd9db"/><ellipse cx="310" cy="125" rx="34" ry="93" fill="none" stroke="#8daabd"/><path d="M310 125 380 85" stroke="#d7fb91" stroke-width="4" stroke-linecap="round"/><circle cx="380" cy="85" r="7" fill="#e0ffad"/><g font-size="17" fill="#e6ffff" text-anchor="middle"><text x="310" y="22">|0⟩ +Z</text><text x="310" y="238">|1⟩ −Z</text><text x="465" y="136">|+⟩ +X</text><text x="155" y="136">|−⟩ −X</text><text x="210" y="205">|+i⟩ +Y</text><text x="405" y="54">|−i⟩ −Y</text></g></svg><div class="sphere-hint"><strong>All six reference states</strong><p>Choose X, Y, or Z when measuring. The basis matters. Open the full interactive Bloch sphere below to explore gates.</p><button type="button" class="visual-link-action" data-demo-open-explore="true">Open the full interactive Bloch sphere ↗</button></div></div>`;
}
function circuitDiagram(){
 return `<div class="circuit-stage"><svg viewBox="0 0 620 174" role="img" aria-label="Qiskit circuit with initial state, one selected gate, and measurement"><rect x="8" y="7" width="604" height="158" rx="18" fill="#0a2941" stroke="#356c7d"/><text x="32" y="64" fill="#c1e9e7" font-size="24">|0⟩</text><path d="M100 60H550" stroke="#b4eae2" stroke-width="3"/><rect x="225" y="28" width="88" height="64" rx="10" fill="#8ae2d5"/><text id="circuit-gate" x="269" y="69" font-size="27" font-weight="bold" text-anchor="middle" fill="#06313e">H</text><rect x="467" y="28" width="76" height="64" rx="10" fill="#a9b7ff"/><text x="505" y="69" font-size="19" text-anchor="middle" fill="#1a2650">M</text><path d="M505 92V139H565" stroke="#a9b7ff" stroke-width="3" stroke-dasharray="5 4"/><text x="32" y="139" font-size="14" fill="#c2d6e3">one qubit</text><text x="566" y="145" font-size="14" fill="#c2d6e3">c[0]</text></svg></div>`;
}
function bb84Diagram(){return `<div class="bb84-stage"><p>Illustrative eight-position basis comparison (not a secure QKD implementation).</p><button type="button" class="visual-link-action" id="bb84-try">Generate another basis sample ↻</button><div class="bb84-grid" id="bb84-demo-grid" role="table" aria-label="BB84 sample basis matching"></div><p class="visual-reveal" id="bb84-demo-result">Matching basis positions are retained; different bases are discarded.</p></div>`;}
export function renderLessonExperience(lesson){
 const d=getDesign(lesson);
 if(!d)return '';
 const type=d.type;
 const map={
  journey:()=>choiceCard('journey','Explore the five stages of scientific inquiry'),
  qubit:()=>sliderLab('qubit'),
  sphere:()=>sphereDiagram(),
  circuit:()=>circuitDiagram()+choiceCard('circuit','What happens when you change the gate?'),
  review:()=>visualSvg('Review steps')+choiceCard('review','Revisit the learning cycle'),
  network:()=>visualSvg('Secure communications')+choiceCard('network','What protection is needed?'),
  polar:()=>sliderLab('polar'),
  bb84:()=>bb84Diagram(),
  pqc:()=>visualSvg('Post-quantum security')+choiceCard('pqc','Choose the cryptographic task'),
  migration:()=>choiceCard('migration','Explore the migration process'),
  technician:()=>visualSvg('Technician instrument chain')+choiceCard('technician','Inspect each laboratory subsystem'),
  python:()=>sliderLab('python'),
  wave:()=>sliderLab('wave'),
  interference:()=>sliderLab('interference'),
  projects:()=>choiceCard('projects','Choose a future project')
 };
 const visual=map[type]?.()||'';
 return `<section class="visual-exhibit" data-visual-type="${type}"><header class="visual-exhibit-heading"><span class="visual-eyebrow">SEE IT · INTERACT WITH THE IDEA</span><h5>${esc(d.prompt)}</h5></header>${visual}<div class="visual-caution">Instructional illustration · idealized model or conceptual workflow. Physical hardware, cryptographic security, and laboratory performance must be independently verified.</div></section>`;
}
function update(bb,type,n){
 const find=id=>bb.querySelector('#'+id);
 const out=(id,text)=>{const e=find(id);if(e)e.textContent=text};
 if(type==='qubit'){
  const p=Math.cos(n*Math.PI/360)**2;
  out('angle-qubit-label',n+'°');out('qubit-p0',(p*100).toFixed(0)+'%');out('qubit-p1',((1-p)*100).toFixed(0)+'%');
 }
 if(type==='polar'){
  const p=Math.cos(n*Math.PI/180)**2;
  out('angle-polar-label',n+'°');out('polar-value',(p*100).toFixed(1)+'%');out('polar-angle-read',n+'°');
  const el=find('polar-filter');if(el)el.style.transform=`rotate(${n}deg)`;
  const light=find('polar-light');if(light)light.style.opacity=String(.18+.82*p);
 }
 if(type==='python'){
  const p=Math.cos(n*Math.PI/180)**2;
  out('angle-python-label',n+'°');out('py-angle-code',n);out('python-p0',p.toFixed(3));out('python-p1',(1-p).toFixed(3));
 }
 if(type==='wave'||type==='interference'){
  const phase=type==='wave'?0:n*Math.PI/180;
  const freq=type==='wave'?n:2;
  const visual=find('demo-wave');if(visual)visual.innerHTML=svgWave(phase,freq);
  out('angle-'+type+'-label',n+(type==='wave'?' Hz':'°'));
  out('wave-main',type==='wave'?(1/n).toFixed(3)+' s':(2*Math.abs(Math.cos(phase/2))).toFixed(3)+' Vpp');
  out('wave-secondary',type==='wave'?'2.0 V peak':Math.pow(Math.cos(phase/2),2).toFixed(3));
 }
}
function generateBB84(bb){
 const r=()=>Math.random()<.5?0:1;
 const rows=Array.from({length:8},()=>({alice:r(),bob:r(),bit:r()}));
 const kept=rows.filter(q=>q.alice===q.bob);
 const grid=bb.querySelector('#bb84-demo-grid');
 if(grid)grid.innerHTML=rows.map((q,i)=>`<div class="bb84-token ${q.alice===q.bob?'keep':'discard'}"><span>#${i+1}</span><strong>${q.alice?'X':'Z'} / ${q.bob?'X':'Z'}</strong><small>${q.alice===q.bob?'Keep '+q.bit:'Discard'}</small></div>`).join('');
 const result=bb.querySelector('#bb84-demo-result');
 if(result)result.textContent=`Kept ${kept.length} of 8 matching-basis positions. This demo omits authentication, eavesdropping detection, error correction and privacy amplification.`;
}
export function wireLessonExperiences(root,openExplore){
 root.querySelectorAll('.visual-exhibit').forEach(exhibit=>{
  exhibit.querySelectorAll('[data-demo-option]').forEach(button=>{
   button.addEventListener('click',()=>{
    const parent=button.closest('.interactive-stage');
    parent.querySelectorAll('[data-demo-option]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const type=exhibit.dataset.visualType;
    const option=simpleOptions[type]?.[Number(button.dataset.demoOption)];
    const e=parent.querySelector('[data-demo-message]');
    if(e&&option)e.textContent=option[1];
    const gate=exhibit.querySelector('#circuit-gate');
    if(gate&&type==='circuit')gate.textContent=option?.[0].charAt(0)||'H';
   });
  });
  exhibit.querySelectorAll('[data-demo-slider]').forEach(el=>el.addEventListener('input',()=>update(exhibit,el.dataset.demoSlider,+el.value)));
  const bb=exhibit.querySelector('#bb84-try');
  if(bb){bb.addEventListener('click',()=>generateBB84(exhibit));generateBB84(exhibit);}
  exhibit.querySelectorAll('[data-demo-open-explore]').forEach(button=>button.addEventListener('click',()=>openExplore?.()));
 });
}
