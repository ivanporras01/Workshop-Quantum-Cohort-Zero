// Detailed beginner-first explanations for all 18 original workshop topics.
export const BEGINNER_GUIDES={
  "2026-11-09|Welcome and Program Introduction": {
    "heading": "Begin with something familiar",
    "steps": [
      {
        "title": "What is computing?",
        "explanation": "Computing means representing information and following instructions to produce a result. Your phone and laptop already use classical computers. In this workshop we will discover how quantum physics offers another way to represent and process information."
      },
      {
        "title": "What will you learn?",
        "explanation": "On Day 1 you meet bits, qubits, the Bloch sphere, gates and Qiskit. Then you explore communication security, polarization, cryptography, Python, technician work and a supervised classical wave experiment. Each day builds on ideas introduced earlier."
      },
      {
        "title": "What counts as evidence?",
        "explanation": "A mathematical model predicts a result. A simulator calculates from the model. A physical experiment measures an observable with an instrument. These are not interchangeable: label a result so everyone knows where it came from."
      },
      {
        "title": "How will this portal teach you?",
        "explanation": "Every lesson begins with simple explanations, a visual and a guided demonstration. You then work through an example and try a question. You do not need prior physics, cryptography or programming experience."
      }
    ]
  },
  "2026-11-09|Introduction to Quantum Computing and Qubits": {
    "heading": "What is a qubit, and how is it different from a classical bit?",
    "steps": [
      {
        "title": "Start with the classical bit",
        "explanation": "A bit is a basic unit of ordinary digital information. Its logical value is either 0 or 1. Many bits can encode numbers, text, and pictures. Think of a switch that is OFF or ON—an analogy for two definite values."
      },
      {
        "title": "Meet the qubit",
        "explanation": "A qubit is a two-level quantum system whose reference states are written |0⟩ and |1⟩, pronounced ket zero and ket one. Its pure state can be written α|0⟩ + β|1⟩. α and β are complex probability amplitudes, not two ordinary readable bit values."
      },
      {
        "title": "What happens when we measure?",
        "explanation": "A Z-basis measurement of a single qubit gives one classical outcome, 0 or 1. Their probabilities are P(0)=|α|² and P(1)=|β|² and add to 100%. We find the pattern by preparing and measuring many identically prepared qubits."
      },
      {
        "title": "How is quantum computation different?",
        "explanation": "Classical logic acts on definite bit values. Quantum gates transform amplitudes and relative phase, allowing interference before measurement. Some specialized quantum algorithms use these effects; quantum computers are not faster at every task. They do not let you read both outcomes simultaneously."
      },
      {
        "title": "Try your first example",
        "explanation": "Prepare |0⟩, whose Z measurement gives 0 with certainty. Apply H (Hadamard): the result is |+⟩=(|0⟩+|1⟩)/√2, giving 50% for both Z outcomes. Change the measurement to X and the + result is now certain. Watch that happen on the sphere."
      }
    ]
  },
  "2026-11-09|Introduction to Bloch Sphere and gates": {
    "heading": "What do the directions on the Bloch sphere mean?",
    "steps": [
      {
        "title": "Find the poles",
        "explanation": "The north pole represents |0⟩ and the south pole represents |1⟩. A point on the surface represents one pure qubit state. This is a mathematical picture, not a physical spinning ball."
      },
      {
        "title": "Explore the equator",
        "explanation": "Equatorial states have 50/50 Z-basis probabilities, but they differ in relative phase. For example |+⟩ and |−⟩ behave differently when measured in the X basis."
      },
      {
        "title": "Understand angles",
        "explanation": "Polar angle θ moves from north to south. Azimuth φ rotates around the vertical axis. Changing φ may keep Z probabilities unchanged while X or Y probabilities change."
      },
      {
        "title": "Learn what gates do",
        "explanation": "H transforms |0⟩ into |+⟩, X flips the poles, Z changes a relative sign, and S/T rotate relative phase by 90°/45°. Change one gate at a time and examine the result."
      },
      {
        "title": "Basis is a question, not a gate",
        "explanation": "Choosing Z asks about |0⟩ versus |1⟩; X asks about |+⟩ versus |−⟩; Y asks about |+i⟩ versus |−i⟩. Changing basis does not itself prepare a different state."
      }
    ]
  },
  "2026-11-09|Introduction to IBM Qiskit": {
    "heading": "First learn to read a circuit diagram",
    "steps": [
      {
        "title": "A circuit is a sequence",
        "explanation": "Like a recipe, a quantum circuit contains operations in an order. The horizontal line represents a qubit, not an electrical wire. A gate box indicates an operation."
      },
      {
        "title": "Prepare, transform, measure",
        "explanation": "A simple circuit begins at |0⟩, applies H or X, and then measures. Measurement produces a classical bit we can record. Predictions depend on the initial state and order of gates."
      },
      {
        "title": "What is Qiskit?",
        "explanation": "Qiskit is a Python toolkit for constructing, inspecting and analyzing quantum circuits and connecting to supported simulation and hardware services. Calling draw() displays the circuit but does not execute it on a device."
      },
      {
        "title": "Try the simple comparison",
        "explanation": "Predict what an H gate and an X gate do to |0⟩. Use the interactive diagram to compare ideal Z measurement probabilities before exploring Python syntax."
      }
    ]
  },
  "2026-11-10|Review of previous day": {
    "heading": "Reconnect yesterday's three big ideas",
    "steps": [
      {
        "title": "State",
        "explanation": "A quantum state describes the qubit before a measurement; the Bloch sphere shows its direction."
      },
      {
        "title": "Gate",
        "explanation": "An operation changes the state. H, X and Z do not all have the same effect. Order matters."
      },
      {
        "title": "Measurement",
        "explanation": "A basis defines which two possible outcomes are distinguished. Z and X can give different probabilities for the same prepared state."
      },
      {
        "title": "Scientific prediction",
        "explanation": "Name the initial state, operations and basis before looking at a simulated result."
      }
    ]
  },
  "2026-11-10|Intro to Computer Networking and Encryption": {
    "heading": "How does a private message travel?",
    "steps": [
      {
        "title": "The network",
        "explanation": "Computers communicate by sending data over networks. Routers and protocols deliver information between devices; delivery does not guarantee confidentiality."
      },
      {
        "title": "Three security goals",
        "explanation": "Confidentiality keeps content private, integrity helps detect changes, and authentication helps establish identity. Each protects against a different threat."
      },
      {
        "title": "What is encryption?",
        "explanation": "An encryption algorithm transforms plaintext into ciphertext using key material. Symmetric cryptography uses shared secrets; public-key cryptography supports key establishment and signatures."
      },
      {
        "title": "Why quantum enters the story",
        "explanation": "Some present-day public-key methods could be threatened by sufficiently capable future quantum computers. That motivates post-quantum cryptography."
      }
    ]
  },
  "2026-11-10|Energy Polarization": {
    "heading": "What direction does light oscillate?",
    "steps": [
      {
        "title": "First picture a wave",
        "explanation": "Light is an electromagnetic wave. Its electric field changes as the wave propagates. Polarization describes the field's direction of oscillation."
      },
      {
        "title": "What does a polarizer do?",
        "explanation": "An ideal polarizer transmits the electric-field component aligned with its transmission direction. Rotating a second polarizer can decrease the transmitted light."
      },
      {
        "title": "See Malus's law",
        "explanation": "For ideal linearly polarized light, the transmitted intensity fraction through a second polarizer is cos²θ. At 0° it is 100%; at 90° it is ideally zero."
      },
      {
        "title": "The quantum connection",
        "explanation": "Polarization can encode and measure photon qubits. The visual intensity demonstration, however, is classical optics, not a single-photon experiment."
      }
    ]
  },
  "2026-11-10|Quantum Key Distribution": {
    "heading": "Why do Alice and Bob choose bases?",
    "steps": [
      {
        "title": "What is a secret key?",
        "explanation": "A secret key is data used by cryptographic algorithms. Securely agreeing on key material is a difficult communication problem."
      },
      {
        "title": "Meet Alice and Bob",
        "explanation": "Alice sends quantum states using randomly chosen bases. Bob chooses bases independently when measuring. They later discuss which bases they used."
      },
      {
        "title": "Sifting",
        "explanation": "They keep positions where their basis choices matched and discard others. Use the interactive grid to watch this happen to a short example."
      },
      {
        "title": "What real security also needs",
        "explanation": "Real BB84 requires authenticated classical communication, error estimation, reconciliation, privacy amplification and suitable hardware. Basis sifting alone is not a secure protocol."
      }
    ]
  },
  "2026-11-12|Review of previous day": {
    "heading": "Connect networks, light and secret keys",
    "steps": [
      {
        "title": "Networking",
        "explanation": "Messages travel through networks, but they also need appropriate privacy and authenticity protections."
      },
      {
        "title": "Polarization",
        "explanation": "A polarizer changes a transmitted classical intensity; photon polarization can represent quantum measurement states."
      },
      {
        "title": "QKD",
        "explanation": "BB84 compares basis choices and sifts corresponding positions. A demonstration is not a deployed secure system."
      },
      {
        "title": "One essential distinction",
        "explanation": "Quantum key distribution uses physical quantum communication; post-quantum cryptography uses algorithms on ordinary computers."
      }
    ]
  },
  "2026-11-12|Introduction to Post Quantum Cryptology": {
    "heading": "What does post-quantum mean?",
    "steps": [
      {
        "title": "The concern",
        "explanation": "A sufficiently powerful future fault-tolerant quantum computer could threaten some widely used public-key assumptions."
      },
      {
        "title": "PQC in simple terms",
        "explanation": "Post-quantum cryptography consists of classical algorithms designed to resist currently known classical and quantum attacks. It runs on ordinary computers."
      },
      {
        "title": "Different cryptographic jobs",
        "explanation": "ML-KEM helps establish shared secrets. ML-DSA and SLH-DSA are digital signature schemes for authenticity and integrity. A KEM is not a signature."
      },
      {
        "title": "From theory to operations",
        "explanation": "Standard algorithms must be integrated into protocols, software, devices and real operational policies before a system becomes secure."
      }
    ]
  },
  "2026-11-12|Post Quantum Cryptology Implementation": {
    "heading": "What does a real security upgrade involve?",
    "steps": [
      {
        "title": "Find the existing cryptography",
        "explanation": "Inventory networks, certificates, libraries, devices, software and systems using public-key cryptography."
      },
      {
        "title": "Choose the scope",
        "explanation": "Prioritize long-lived sensitive data, systems with upgrade limitations and compatibility needs."
      },
      {
        "title": "Test before deployment",
        "explanation": "Use approved implementations in a pilot. Verify protocol compatibility, key lifecycle, performance, monitoring and rollback."
      },
      {
        "title": "Record the evidence",
        "explanation": "A tested migration includes documented configurations and measurements—not merely an algorithm name."
      }
    ]
  },
  "2026-11-13|Review of previous day": {
    "heading": "Refresh the difference between the tools",
    "steps": [
      {
        "title": "Encryption",
        "explanation": "Encryption helps protect content confidentiality."
      },
      {
        "title": "KEM",
        "explanation": "A key encapsulation mechanism helps establish shared secret key material."
      },
      {
        "title": "Signature",
        "explanation": "A digital signature helps verify authenticity and integrity when trust is properly managed."
      },
      {
        "title": "Deployment",
        "explanation": "Real security also requires protocols, correct implementation, testing and operations."
      }
    ]
  },
  "2026-11-13|Role of the Quantum Technician": {
    "heading": "What does a technician actually do?",
    "steps": [
      {
        "title": "Meet the role",
        "explanation": "A technician prepares equipment, sets controls, records measurements and helps locate faults. Quantum labs may include optical, microwave and computing equipment."
      },
      {
        "title": "Follow a signal",
        "explanation": "A source produces a known input, a device responds, and an instrument measures the output. Each stage needs appropriate connections and reference settings."
      },
      {
        "title": "Reproducible work",
        "explanation": "Document frequency, amplitude, units, calibration, probe settings and uncertainty. Change one thing at a time while troubleshooting."
      },
      {
        "title": "Why this matters",
        "explanation": "Precision and safety are essential in both classical labs and quantum experiments. Our wave lab practices these habits without measuring a qubit."
      }
    ]
  },
  "2026-11-13|Python for Quantum": {
    "heading": "Python is a calculator that follows instructions",
    "steps": [
      {
        "title": "First understand variables",
        "explanation": "A variable is a name for data. For example, angle = 45 stores a number. Python can calculate with the stored value."
      },
      {
        "title": "Meet the sine and cosine functions",
        "explanation": "Sine and cosine describe simple periodic relationships. Trigonometric functions commonly accept angles in radians."
      },
      {
        "title": "Square amplitudes correctly",
        "explanation": "For real a and b, probabilities can be a² and b². For complex amplitudes, use abs(a)**2 and abs(b)**2."
      },
      {
        "title": "Try a change",
        "explanation": "Move the angle slider and compare the Python preview with the displayed results. The probabilities should add to approximately one, allowing for rounding."
      }
    ]
  },
  "2026-11-14|Review of previous day": {
    "heading": "Prepare to document laboratory evidence",
    "steps": [
      {
        "title": "Model versus measurement",
        "explanation": "A model predicts; a simulator calculates; an instrument observes. Never claim simulated results are hardware measurements."
      },
      {
        "title": "Instrument settings",
        "explanation": "Probe attenuation, volts/div, timebase, frequency, grounding and loading can change what appears on the oscilloscope."
      },
      {
        "title": "Controlled experiments",
        "explanation": "Change one parameter at a time and preserve the initial setup information."
      },
      {
        "title": "Explain the result",
        "explanation": "Write the prediction, measurement, uncertainty and reason for any difference."
      }
    ]
  },
  "2026-11-14|Polarity and energy waves": {
    "heading": "Read an oscilloscope signal from zero",
    "steps": [
      {
        "title": "Voltage reference",
        "explanation": "Voltage is a difference between two points. Use the approved ground and probe connections; never attach grounded clips to unsafe nodes."
      },
      {
        "title": "Amplitude",
        "explanation": "For a zero-offset sine wave, 1 V peak means 2 V peak-to-peak. These are different ways of measuring waveform height."
      },
      {
        "title": "Frequency",
        "explanation": "Frequency tells how many cycles occur in one second. The period is T=1/f, so 1 kHz corresponds to 1 millisecond per cycle."
      },
      {
        "title": "Phase",
        "explanation": "Relative phase describes how two same-frequency signals line up. At 0° they align; at 180° the positive peak of one coincides with the negative peak of the other."
      }
    ]
  },
  "2026-11-14|Applied energy waves": {
    "heading": "What are we actually building in the lab?",
    "steps": [
      {
        "title": "What each part does",
        "explanation": "Each function-generator channel creates a low-voltage sine wave. A separate 10 kΩ resistor connects each output to the shared Vout junction. The oscilloscope measures that junction."
      },
      {
        "title": "What changes",
        "explanation": "Both signals stay at the same frequency and amplitude. Only their relative phase changes: 0°, 90° and 180°."
      },
      {
        "title": "Predicted observations",
        "explanation": "For synchronized 2 Vpp sources and a high-impedance scope, ideal Vout is 2.000 Vpp at 0°, 1.414 Vpp at 90°, and almost zero at 180°."
      },
      {
        "title": "Connection to quantum ideas",
        "explanation": "Normalized squared classical amplitude follows cos²(φ/2), the same form as a measurement probability in an ideal H–phase–H circuit. The oscilloscope measures classical voltage, not a qubit."
      },
      {
        "title": "Safety",
        "explanation": "Never connect active generator outputs directly: the resistors must remain in the circuit. Use low voltages, instructor-approved common grounds and a 1 MΩ oscilloscope input."
      }
    ]
  },
  "2026-11-14|Future Projects": {
    "heading": "How do you turn a concept into a demo?",
    "steps": [
      {
        "title": "Ask one question",
        "explanation": "A focused question might ask how changing phase affects probabilities or how a signal changes with relative phase."
      },
      {
        "title": "Choose a method",
        "explanation": "Decide whether a simulator, simple code or supervised physical experiment will supply evidence. State the method clearly."
      },
      {
        "title": "Create a small deliverable",
        "explanation": "A working Bloch sphere, a BB84 basis demonstration, a Python notebook or an oscilloscope measurement are manageable beginner projects."
      },
      {
        "title": "Tell the scientific story",
        "explanation": "Explain the goal, prediction, equipment, actual results, limitations and one next step."
      }
    ]
  }
};

export const beginnerGuideFor=lesson=>BEGINNER_GUIDES[lesson.date+'|'+lesson.title]||null;
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
export function renderBeginnerGuide(lesson){
 const d=beginnerGuideFor(lesson);if(!d)return '';
 return '<section class="beginner-guide" data-beginner-guide aria-label="Step-by-step beginner explanation">'+
 '<header class="beginner-heading"><span class="beginner-kicker">START FROM ZERO · NO PREVIOUS EXPERIENCE REQUIRED</span><h5>'+escapeHTML(d.heading)+'</h5><p>First understand the ideas in plain English. The visual experiment comes after these explanations.</p></header>'+
 '<nav class="beginner-step-nav" aria-label="Explanation sections">'+d.steps.map((x,i)=>'<button type="button" data-beginner-step="'+i+'" aria-pressed="'+(i===0)+'"><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+escapeHTML(x.title)+'</strong></button>').join('')+'</nav>'+
 '<div class="beginner-step-body" aria-live="polite"><span class="beginner-step-count" data-beginner-count>EXPLANATION 1 OF '+d.steps.length+'</span><h6 data-beginner-title>'+escapeHTML(d.steps[0].title)+'</h6><p data-beginner-text>'+escapeHTML(d.steps[0].explanation)+'</p></div>'+
 '<div class="beginner-controls"><button type="button" data-beginner-previous disabled>← Previous explanation</button><span data-beginner-position>1 / '+d.steps.length+'</span><button type="button" data-beginner-next>Next explanation →</button></div>'+
 '<p class="beginner-reassurance">Next: see the concept in a picture, manipulate a model, and follow a worked example before answering questions.</p></section>';
}
export function wireBeginnerGuides(root){
 root.querySelectorAll('[data-beginner-guide]').forEach(panel=>{
  const card=panel.closest('.enhanced-topic'),title=card?.querySelector('.topic-summary strong')?.textContent||'';
  const data=BEGINNER_GUIDES[(card?.dataset.lessonDate||'')+'|'+title];
  if(!data)return;
  const buttons=[...panel.querySelectorAll('[data-beginner-step]')];
  let idx=0;
  const refresh=()=>{
   buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===idx)));
   panel.querySelector('[data-beginner-title]').textContent=data.steps[idx].title;
   panel.querySelector('[data-beginner-text]').textContent=data.steps[idx].explanation;
   panel.querySelector('[data-beginner-count]').textContent='EXPLANATION '+(idx+1)+' OF '+data.steps.length;
   panel.querySelector('[data-beginner-position]').textContent=(idx+1)+' / '+data.steps.length;
   panel.querySelector('[data-beginner-previous]').disabled=idx===0;
   const next=panel.querySelector('[data-beginner-next]');
   next.textContent=idx===data.steps.length-1?'All concepts explained ✓':'Next explanation →';
   next.disabled=idx===data.steps.length-1;
  };
  buttons.forEach((b,i)=>b.addEventListener('click',()=>{idx=i;refresh();}));
  panel.querySelector('[data-beginner-previous]').addEventListener('click',()=>{idx=Math.max(0,idx-1);refresh();});
  panel.querySelector('[data-beginner-next]').addEventListener('click',()=>{idx=Math.min(data.steps.length-1,idx+1);refresh();});
  refresh();
 });
}
