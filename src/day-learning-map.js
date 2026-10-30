// Companion learning outcomes. Official dates, times and presenters remain in agenda.json.
export const DAY_PATHS = [
  {
    date:'2026-11-09',label:'MON 09',title:'Understand a qubit',verb:'FOUNDATIONS',
    question:'How can a quantum state predict a classical measurement?',
    outcome:'Explain a qubit, prepare a superposition, change its basis, and read a small circuit.',
    concepts:['superposition','gates','interference'],
    goals:['Distinguish a bit, an amplitude and a probability.','Use the Bloch sphere to compare |0⟩, |1⟩, |+⟩ and |−⟩.','Predict H → H and H → Z → H before measuring.'],
    sequence:[
      ['Welcome and Program Introduction','Orient yourself: distinguish a theory, an ideal simulation and a physical measurement.','Write one question you want the workshop to answer.'],
      ['Introduction to Quantum Computing and Qubits','Start with 0/1 readouts. Build an equal superposition and connect squared amplitudes to repeated outcomes.','Prepare |+⟩; compare one shot with 200 new preparations.'],
      ['Introduction to Bloch Sphere and gates','Read the axes; change θ and φ; compare X and Z measurements. Apply H, X and Z in order.','Explain why |+⟩ and |−⟩ look identical in Z but different in X.'],
      ['Introduction to IBM Qiskit','Identify wires, initialization, gates, classical bits and measurement in a circuit. Separate drawing from execution.','Draw an H circuit and record the probability distribution you expect.']
    ],
    extension:'Preview a Bell pair after mastering one-qubit gates. Entanglement and teleportation receive their guided companion exploration on Day 2.',
    evidence:'A labeled Bloch sketch, a two-gate prediction, and an explanation of why one shot does not reveal a whole state.',
    boundary:'Today builds the language of states and measurements. Tomorrow uses it to understand communication.'
  },
  {
    date:'2026-11-10',label:'TUE 10',title:'Connect quantum systems',verb:'COMMUNICATION',
    question:'What can quantum states contribute to communication?',
    outcome:'Relate networks and polarization to QKD, and explore entanglement and teleportation step by step.',
    concepts:['entanglement','teleportation','security','nocloning'],
    goals:['Separate encryption, authentication and key distribution.','Compare a Bell pair with an ordinary correlated mixture in more than one basis.','Explain teleportation’s shared pair, two classical bits and conditional correction.'],
    sequence:[
      ['Review of previous day','Reconnect state preparation, gates, measurement basis and repeated shots.','Describe what H does to |0⟩ and how X-basis measurement differs from Z.'],
      ['Intro to Computer Networking and Encryption','Trace sender → channel → receiver. Identify a key, a ciphertext and an authenticated exchange.','Explain which security goal encryption addresses and why identity still matters.'],
      ['Energy Polarization','Rotate an ideal analyzer; connect angle to transmitted intensity. Introduce compatible and incompatible bases.','Compare 0°, 45° and 90° and label which observations are classical optics.'],
      ['Quantum Key Distribution','Follow preparation, transmission, basis comparison, sifting and sample checking. Learn why sifting alone is insufficient.','Compare the ideal intercept-resend error model with the no-eavesdropper model.']
    ],
    extension:'Companion enrichment: build a Bell pair, compare Z/Z with X/X results, and walk through teleportation. These are added learning activities, not new official sessions or claims about a presenter’s talk.',
    evidence:'A QKD process sketch and a teleportation explanation naming all three qubits, the two classical bits, and Bob’s correction.',
    boundary:'Today studies quantum communication. Day 3 studies protective algorithms that run on classical computers.'
  },
  {
    date:'2026-11-12',label:'THU 12',title:'Protect classical networks',verb:'QUANTUM-SAFE SECURITY',
    question:'How do ordinary systems prepare for quantum threats?',
    outcome:'Distinguish PQC from QKD and outline a careful migration and validation process.',
    concepts:['security','nocloning'],
    goals:['Explain why quantum-resistant does not mean quantum hardware is required.','Distinguish key establishment from digital signatures.','Identify dependencies, test interoperability and plan a staged rollout.'],
    sequence:[
      ['Review of previous day','Recap polarized states, incompatible measurements and the steps beyond QKD sifting.','Sort the words: channel, key, ciphertext, basis, authentication.'],
      ['Introduction to Post Quantum Cryptology','Contrast quantum key distribution with mathematical cryptography on classical devices. Discuss vulnerability and migration.','Explain why adding a quantum-themed label does not make a system secure.'],
      ['Post Quantum Cryptology Implementation','Connect the implementation session to inventory, selection, testing, key lifecycle, monitoring and recovery.','Draft a small migration checklist with an observable pass/fail result for each check.']
    ],
    extension:'Revisit no-cloning as a quantum information principle. It does not establish the security of a PQC implementation; that requires cryptographic analysis and implementation testing.',
    evidence:'A two-column QKD/PQC comparison and a migration checklist covering one example application.',
    boundary:'Today focuses on security architecture and implementation. Day 4 develops the coding and documentation skills to investigate results.'
  },
  {
    date:'2026-11-13',label:'FRI 13',title:'Program, sample, explain',verb:'TECHNICIAN SKILLS + PYTHON',
    question:'How do we turn a prediction into reproducible evidence?',
    outcome:'Read circuit logic, analyze measurement counts, and document a repeatable test.',
    concepts:['gates','entanglement','teleportation','noise'],
    goals:['Separate a mathematical model, a simulator and a hardware run.','Calculate probabilities from amplitudes and frequencies from counts.','Record settings, expected results, observations and limitations.'],
    sequence:[
      ['Review of previous day','Restate the distinction between quantum communication and classical quantum-resistant cryptography.','Name one test you would perform before deploying a new cryptographic implementation.'],
      ['Role of the Quantum Technician','Practice equipment awareness, calibration records, repeatability and clear handoffs.','Write a test record with setup, prediction, observation and next action.'],
      ['Python for Quantum','Use values, lists and loops to model probabilities and summarize shots. Read H/CNOT and conditional-correction circuit logic.','Compare repeated Bell-pair samples; explain shot variation and distinguish it from the dephasing model.']
    ],
    extension:'Use the Bell-pair and teleportation controls to predict code behavior before running a simulator. The browser labs are ideal JavaScript models, not Python execution or connected QPUs.',
    evidence:'A short annotated probability calculation, a count summary and a repeatable test record.',
    boundary:'Today develops computational evidence. Day 5 adds physical instrument readings and checks where the analogy stops.'
  },
  {
    date:'2026-11-14',label:'SAT 14',title:'Measure waves in the lab',verb:'APPLIED ENERGY WAVES',
    question:'What does the oscilloscope show—and what does it not show?',
    outcome:'Build the guided classical wave experiment, compare phases, and explain the connection to quantum interference.',
    concepts:['interference','noise'],
    goals:['Identify amplitude, frequency, period and relative phase.','Predict the equal-resistor sum for 0°, 90° and 180°.','Distinguish a classical analogy from evidence of a quantum effect.'],
    sequence:[
      ['Review of previous day','Review predictions, repeated trials and how to record a result with units.','State your hypothesis before changing a control.'],
      ['Polarity and energy waves','Distinguish voltage polarity, wave phase and polarization; inspect how time shifts alter relative phase.','Sketch two equal-frequency waves with a quarter-period delay.'],
      ['Applied energy waves','Use the circuit diagram, parts list and wiring sequence. Compare both inputs and their passive combined output.','Measure at 0°, 90° and 180°; record settings, units, deviations and uncertainty.'],
      ['Future Projects','Turn an observation into a testable next question. State what equipment and evidence would actually be required.','Propose one follow-up and identify whether it is classical optics, simulation or a quantum experiment.']
    ],
    extension:'Connect the phase slider to H → phase → H in the quantum concept explorer. The resistor circuit demonstrates classical wave addition; it does not create entanglement, measure a qubit or perform teleportation.',
    evidence:'A completed lab record with three phase settings, predicted versus measured results, and a paragraph explaining the analogy’s limits.',
    boundary:'Today integrates the week’s ideas with measurement practice and a clearly scoped next project.'
  }
];
export const CONCEPT_LABELS={superposition:'Superposition & measurement',interference:'Phase & interference',entanglement:'Entanglement',teleportation:'Quantum teleportation',gates:'Quantum gates',nocloning:'No-cloning',noise:'Decoherence',security:'QKD & PQC'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderJourney(){return '<div class="journey-heading"><span class="eyebrow plain">YOUR FIVE-DAY LEARNING MAP</span><h2>A different purpose. Every day.</h2><p>Follow the official agenda, then use the connected visual activities to make each idea concrete.</p></div><div class="journey-grid">'+DAY_PATHS.map((d,i)=>'<button class="journey-day" data-journey-day="'+i+'"><span class="journey-number">0'+(i+1)+'</span><span class="journey-date">'+d.label+' · NOV</span><strong>'+d.title+'</strong><small>'+d.verb+'</small><p>'+d.outcome+'</p><span class="journey-open">Open Day '+(i+1)+' →</span></button>').join('')+'</div>';}
export function renderDayPlan(i){const d=DAY_PATHS[i];return '<section class="day-learning-plan" aria-label="Day '+(i+1)+' learning plan"><div class="day-plan-purpose"><span>TODAY’S GUIDING QUESTION</span><h4>'+d.question+'</h4><p>'+d.outcome+'</p></div><div class="day-concept-links">'+d.concepts.map(id=>'<button data-open-concept="'+id+'">'+CONCEPT_LABELS[id]+' ↗</button>').join('')+'</div><details class="day-plan-details"><summary>Day '+(i+1)+' in detail: objectives, activities & evidence</summary><h5>By the end of today, you can…</h5><ul>'+d.goals.map(g=>'<li>'+esc(g)+'</li>').join('')+'</ul><div class="day-sequence">'+d.sequence.map((s,j)=>'<article><span>0'+(j+1)+'</span><div><h5>'+esc(s[0])+'</h5><p>'+esc(s[1])+'</p><p class="day-task"><strong>Try it:</strong> '+esc(s[2])+'</p><button type="button" data-day-study="'+j+'">Open this lesson →</button></div></article>').join('')+'</div><p class="day-extension"><strong>Connected visual activities.</strong> '+esc(d.extension)+'</p><p><strong>Evidence of learning:</strong> '+esc(d.evidence)+'</p><p class="day-boundary">'+esc(d.boundary)+'</p></details></section>';}
