// Saturday's Applied Energy Waves Lab — fully supervised classical interference demo.
// The lab is a pedagogical analogy. It does not prepare, manipulate or measure qubits.
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
export const LAB_EQUIPMENT=[
  'Two-channel synchronized function generator (or two phase-locked sources)',
  'Oscilloscope with a 1 MΩ, high-impedance input and appropriately rated probes',
  'Two 10 kΩ resistors (1/4 W or greater)',
  'Breadboard or terminal strip',
  'Two BNC-to-breadboard breakouts or suitable low-voltage signal leads',
  'Oscilloscope probe and common-ground connections',
  'Low-voltage jumper wires and a lab notebook'
];
export const LAB_STEPS=[
  ['Review the wiring','With both generator outputs disabled, place R1 and R2 on the breadboard so their far ends meet at a single Vout junction. Do not join generator signal outputs directly.'],
  ['Connect channel A','Connect generator CH1 signal output to the free end of R1 (10 kΩ). Keep the coaxial shield on the designated common-ground rail.'],
  ['Connect channel B','Connect generator CH2 signal output to the free end of R2 (10 kΩ). Connect its shield to the same ground rail, provided the instruments are designed for this common reference.'],
  ['Connect the oscilloscope','Connect oscilloscope probe tip to Vout and the probe ground to common ground. Use the 1 MΩ input setting (not 50 Ω termination) and match the probe attenuation factor.'],
  ['Set up both waveforms','Select SINE, 1 kHz, 2 Vpp at the actual high-impedance load, 0 V offset, on both synchronized channels. Verify generator amplitude-display mode and output impedance settings.'],
  ['Check the starting condition','Enable outputs only after the wiring is reviewed. Set relative phase to 0°. Confirm the oscilloscope displays about 2 Vpp at Vout.'],
  ['Change one variable','Vary CH2 phase relative to CH1: 0°, 90°, then 180°. Record Vout amplitude, frequency, and the phase setting at each point.'],
  ['Compare and document','Compare measured output with the ideal prediction; record oscilloscope coupling, timebase, volts/div, probe settings, resistor values, and reasons for any residual error.']
];
export const LAB_RESULTS=[
  {phase:0,vpp:2.000,ratio:1,desc:'Constructive combination. Both signals are aligned, so the passive average is approximately the same 2 Vpp amplitude as each input.'},
  {phase:90,vpp:Math.SQRT2,ratio:0.5,desc:'Intermediate output. The phase offset produces approximately 1.414 Vpp across the high-impedance oscilloscope input.'},
  {phase:180,vpp:0,ratio:0,desc:'Destructive combination. Equal and opposite signals ideally cancel; small real residuals may remain.'}
];
export const idealLabOutcome=phaseDegrees=>{
  const radians=Number(phaseDegrees)*Math.PI/180;
  if(!Number.isFinite(radians))throw Error('Phase must be a finite number.');
  return {vpp:2*Math.abs(Math.cos(radians/2)),normalizedSquared:Math.cos(radians/2)**2};
};
function checklist(){
  return LAB_STEPS.map(([heading,explanation],i)=>`<li class="lab-connection-step"><label><input type="checkbox" data-lab-step="${i}" aria-label="Completed: ${esc(heading)}"/><span class="lab-step-index">${String(i+1).padStart(2,'0')}</span><span class="lab-step-copy"><strong>${esc(heading)}</strong><span>${esc(explanation)}</span></span></label></li>`).join('');
}
function equipment(){
  return LAB_EQUIPMENT.map((x,i)=>`<li class="lab-material"><span class="lab-material-count">${i+1}</span><span>${esc(x)}</span></li>`).join('');
}
export function renderLabGuide(){
  return `<section class="lab-guide" data-lab-guide="true" id="applied-waves-lab-guide" aria-label="Applied Energy Waves circuit laboratory">
    <div class="lab-hero"><span class="lab-kicker">SATURDAY LAB · APPLIED ENERGY WAVES</span><h5>Build it. Observe it. Explain the science.</h5><p>Presented by <strong>Hector Porras</strong> · A hands-on introduction to classical wave interference, related to quantum computing by a carefully explained analogy.</p><div class="lab-tags"><span>1 kHz</span><span>2 Vpp each</span><span>2 × 10 kΩ</span><span>0° → 90° → 180°</span></div></div>
    <div class="lab-bridge"><span class="lab-kicker">BEFORE WE BUILD · THE QUANTUM CONNECTION</span><h6>Why are we doing this in a quantum computing workshop?</h6><div class="lab-analogy-pair">
      <div><strong>Classical electronics</strong><p>Two sinusoidal voltages, v₁(t) and v₂(t), are combined. Their <em>relative phase</em> controls the resulting voltage amplitude that the oscilloscope reads.</p></div>
      <div><strong>Quantum circuits</strong><p>Probability amplitudes also have phase. In the ideal <code>H → P(φ) → H</code> circuit, phase changes the probability of measuring 0: <strong>P(0) = cos²(φ/2)</strong>.</p></div>
    </div><p class="lab-analogy-note"><strong>Important distinction:</strong> an oscilloscope measures classical voltage, not quantum probability or a qubit. Only the normalized <em>squared</em> classical amplitude shares this dependence with the example quantum probability.</p></div>
    <div class="lab-diagram-block"><div class="lab-subhead"><span class="lab-kicker">THE PHYSICAL CIRCUIT</span><h6>Two inputs. Two resistors. One measured output.</h6><p>Each source reaches the Vout junction <em>through its own 10 kΩ resistor</em>. The oscilloscope measures Vout with a high-impedance input.</p></div>
      <a class="lab-diagram-link" href="/src/applied-waves-circuit.svg" target="_blank" rel="noopener" aria-label="Open large laboratory circuit diagram in a new tab"><img loading="lazy" src="/src/applied-waves-circuit.svg" alt="Correct passive circuit: synchronized CH1 output through R1 10 kilohms and synchronized CH2 output through R2 10 kilohms meet at Vout, observed on a high-impedance oscilloscope channel with common BNC grounds." /></a>
      <div class="lab-diagram-actions"><a href="/src/applied-waves-circuit.svg" target="_blank" rel="noopener">View full-size circuit diagram ↗</a><a href="/src/applied-waves-circuit.svg" download="Hector-Porras-Applied-Energy-Waves-Circuit.svg">Download circuit diagram ↓</a></div>
      <p class="lab-critical"><strong>Never connect the two active generator outputs directly.</strong> The two resistors must remain between each generator output and the junction. Use only equipment-approved shared ground connections.</p>
    </div>
    <div class="lab-two-column"><section class="lab-materials"><div class="lab-subhead"><span class="lab-kicker">PREPARATION</span><h6>Materials and equipment</h6></div><ul>${equipment()}</ul></section><section class="lab-parameters"><div class="lab-subhead"><span class="lab-kicker">INSTRUMENT SETTINGS</span><h6>Start with these values</h6></div><dl><div><dt>Waveform</dt><dd>Sine, both outputs</dd></div><div><dt>Frequency</dt><dd>1,000 Hz (T = 1 ms)</dd></div><div><dt>Amplitude</dt><dd>2 Vpp per input (1 V peak)</dd></div><div><dt>Offset</dt><dd>0 V DC</dd></div><div><dt>Resistors</dt><dd>R1 = R2 = 10 kΩ</dd></div><div><dt>Scope input</dt><dd>1 MΩ, not 50 Ω</dd></div><div><dt>Relative phase</dt><dd>0°, 90°, 180°</dd></div></dl></section></div>
    <section class="lab-connections"><div class="lab-subhead"><span class="lab-kicker">GUIDED ASSEMBLY</span><h6>Step-by-step wiring and measurements</h6><p>Follow each step with instructor supervision. Check off a completed step to see your progress.</p></div><div class="lab-check-progress" aria-live="polite" data-lab-progress>0 of ${LAB_STEPS.length} steps completed</div><ol>${checklist()}</ol><button type="button" class="lab-reset" data-lab-reset>Reset checklist</button></section>
    <section class="lab-results"><div class="lab-subhead"><span class="lab-kicker">PREDICT, THEN MEASURE</span><h6>Expected oscilloscope observations</h6><p>Assuming matched 2 Vpp sources, equal 10 kΩ resistors, and a high-impedance oscilloscope input:</p></div>
      <div class="lab-expected-grid">${LAB_RESULTS.map(r=>`<div class="lab-result-card"><span class="lab-phase">PHASE ${r.phase}°</span><strong>${r.vpp.toFixed(3)} Vpp</strong><p>${esc(r.desc)}</p></div>`).join('')}</div>
      <div class="lab-equations"><div><strong>Equal-resistor average</strong><code>Vout ≈ (V₁ + V₂) / 2</code></div><div><strong>Amplitude vs. phase</strong><code>Vout (Vpp) ≈ 2 |cos(φ/2)|</code></div><div><strong>Squared normalized output</strong><code>(Vout / 2 Vpp)² = cos²(φ/2)</code></div></div>
      <div class="lab-interactive-phase"><label for="lab-phase-setting">Choose a phase difference: <output id="lab-phase-setting-label">0°</output></label><input id="lab-phase-setting" data-lab-phase type="range" min="0" max="180" step="5" value="0"/><div class="lab-live-stats"><div><small>Predicted output</small><strong data-lab-vpp>2.000 Vpp</strong></div><div><small>Normalized squared output</small><strong data-lab-ratio>1.000</strong></div></div><p data-lab-interference>0°: constructive combination. The output is approximately the input amplitude.</p></div>
      <div class="lab-quantum-takeaway"><strong>Quantum connection:</strong> In the ideal <code>H → P(φ) → H</code> example, the probability of measuring 0 is <code>cos²(φ/2)</code>. This matches the normalized <em>squared</em> amplitude of this classical circuit. Their physical observables are different.</div>
    </section>
    <section class="lab-notebook"><div class="lab-subhead"><span class="lab-kicker">YOUR EVIDENCE</span><h6>Record these results for your lab report</h6></div><div class="lab-table-wrap"><table><thead><tr><th>Phase</th><th>Ideal Vout</th><th>Measured Vout</th><th>Notes / uncertainty</th></tr></thead><tbody>${LAB_RESULTS.map(r=>`<tr><th>${r.phase}°</th><td>${r.vpp.toFixed(3)} Vpp</td><td>_____________</td><td>__________________</td></tr>`).join('')}</tbody></table></div><p>Also record oscilloscope volts/div, time/div, probe factor, input impedance, generator amplitude mode, resistor values, and the actual measured phase. At 180°, small residual voltage may result from amplitude mismatch, finite phase accuracy, source resistance, or electrical noise.</p></section>
    <div class="lab-safety" role="note"><strong>Instructor safety reminder.</strong> Use only low-voltage function-generator outputs, never mains circuits. Turn outputs off while wiring. Many bench oscilloscope probe-ground clips and function-generator BNC shields are connected to protective earth: attach them only to the approved common ground. Never clip a grounded probe to an arbitrary live node. Use a synchronized dual-output source; two unrelated free-running generators may drift in phase. Confirm the oscilloscope input is 1 MΩ; a 50 Ω termination would heavily load this high-resistance network and invalidate the expected table.</div>
  </section>`;
}
export function wireLabGuide(root){
  for(const section of root.querySelectorAll('[data-lab-guide]')){
    const items=[...section.querySelectorAll('[data-lab-step]')];
    const status=section.querySelector('[data-lab-progress]');
    const refresh=()=>{const done=items.filter(i=>i.checked).length;status.textContent=done+' of '+items.length+' steps completed';};
    items.forEach(i=>i.addEventListener('change',refresh));
    section.querySelector('[data-lab-reset]')?.addEventListener('click',()=>{items.forEach(i=>i.checked=false);refresh();});
    const slider=section.querySelector('[data-lab-phase]');
    if(slider){
      const update=()=>{const angle=Number(slider.value),result=idealLabOutcome(angle);
        section.querySelector('#lab-phase-setting-label').textContent=angle+'°';
        section.querySelector('[data-lab-vpp]').textContent=result.vpp.toFixed(3)+' Vpp';
        section.querySelector('[data-lab-ratio]').textContent=result.normalizedSquared.toFixed(3);
        section.querySelector('[data-lab-interference]').textContent=angle===0?'0°: constructive combination. The output is approximately the input amplitude.':angle===180?'180°: destructive combination. The predicted ideal output nearly vanishes.':angle+'°: partial cancellation reduces the combined output amplitude.';
      };
      slider.addEventListener('input',update);update();
    }
  }
}