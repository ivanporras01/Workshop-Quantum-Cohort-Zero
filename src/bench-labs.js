export const WORKBOOKS=[
 {id:'one-bnc',title:'One BNC · Waves, pulses & quantum control',pages:12,cables:'1 cable',file:'/resources/labs/PBSC_Quantum_Workshop_One_BNC_Complete_Lab.pdf',description:'Four guided experiments: amplitude, Hz and time, pulse width, and manually triggered bursts. Includes an explicitly assumed qubit rotation model.'},
 {id:'two-bnc',title:'Two BNC · Phase & interference',pages:14,cables:'2 cables',file:'/resources/labs/PBSC_Quantum_Workshop_Phase_Interference_Complete_Lab.pdf',description:'Compare two synchronized channels, measure relative phase and compute their sum. Explore constructive and destructive interference and the quantum analogy.'}
];
function renderBurstLab() {
 return `<article id="lab-3-burst" class="workbook-card">
  <span>1 BNC cable · 5 minutes</span>
  <h4>D · Triggered Sine Burst</h4>
  <p>Compare a 5-cycle and a 10-cycle packet at the same frequency. Predict what happens to the packet duration when you double the number of cycles.</p>
  <ol>
   <li>With the generator output off, connect generator <strong>CH1 OUT</strong> to oscilloscope <strong>CH1 IN</strong>. Use <strong>High Z</strong> on the generator when the scope input is <strong>1 MΩ</strong>.</li>
   <li>Set the generator to <strong>Sine, 2 kHz, 1 Vpp, 0 V offset</strong>. Select <strong>Burst → N Cycle → 5 cycles</strong>, choose manual triggering, then enable CH1 output.</li>
   <li>Set the scope to <strong>1 ms/div</strong> and trigger on the rising edge of CH1 near <strong>+0.1 V</strong>. Position the trigger near the left side so the full packet fits. Press <strong>SINGLE</strong> on the scope, then <strong>TRIGGER</strong> on the generator.</li>
   <li>Count the cycles and measure the packet. Set the generator to <strong>10 cycles</strong>, press <strong>SINGLE</strong> again and repeat the capture.</li>
  </ol>
  <p><strong>Expected:</strong> 5 cycles take <strong>2.5 ms</strong> and 10 cycles take <strong>5.0 ms</strong>. Each cycle still takes <strong>0.5 ms</strong>.</p>
  <p>At fixed amplitude, the longer burst delivers more energy to the same resistive load. In a superconducting qubit, the duration of a calibrated microwave pulse helps set the rotation angle.</p>
  <a class="primary-button" href="/hands-on-labs.html?preset=burst#simulator">Open the burst simulation →</a>
 </article>`;
}

export function renderDigitalLabs(){return `<section class="digital-labs" aria-label="PBSC hands-on laboratory workbooks"><span class="lab-kicker">SATURDAY, NOVEMBER 14 · 10:00 AM–1:00 PM EASTERN</span><h3>Your paper-free laboratory bench</h3><p>Read the complete guides here, open a full-screen PDF, or use the digital generator and scope for the presentation.</p><a class="primary-button" href="/hands-on-labs.html#simulator">Open the digital instrument simulator →</a>${renderBurstLab()}<div class="workbook-grid">${WORKBOOKS.map(w=>`<article class="workbook-card"><span>${w.cables} · ${w.pages} pages · English</span><h4>${w.title}</h4><p>${w.description}</p><button type="button" data-workbook="${w.id}">Read in this page</button><a href="${w.file}" target="_blank" rel="noopener">Open PDF ↗</a><a href="${w.file}" download>Download PDF ↓</a></article>`).join('')}</div><section class="workbook-reader" data-workbook-reader hidden><h4 data-workbook-title></h4><p>The PDF viewer provides zoom and page navigation. On phones, use “Open PDF” if the embedded viewer is unavailable.</p><a data-workbook-open target="_blank" rel="noopener">Open PDF in a new tab ↗</a><iframe data-workbook-frame title="Workshop laboratory workbook" loading="lazy"></iframe><label>My observations for this workbook<textarea data-workbook-notes rows="5" placeholder="Settings, measurements, predictions and questions..."></textarea></label><p data-workbook-status role="status">Notes stay in this browser only.</p><button type="button" data-workbook-export>Download my observations</button></section><p class="lab-analogy-note">The physical lab measures classical signals. Quantum rotations and probabilities in the workbooks are models, not measurements from these instruments.</p></section>`;}
export function wireDigitalLabs(root){
 root.querySelectorAll('.digital-labs').forEach(section=>{
  let current=null;const reader=section.querySelector('[data-workbook-reader]'),notes=section.querySelector('[data-workbook-notes]'),status=section.querySelector('[data-workbook-status]');
  section.querySelectorAll('[data-workbook]').forEach(button=>button.addEventListener('click',()=>{
   current=WORKBOOKS.find(w=>w.id===button.dataset.workbook);reader.hidden=false;section.querySelector('[data-workbook-title]').textContent=current.title;
   section.querySelector('[data-workbook-frame]').src=current.file+'#view=FitH';section.querySelector('[data-workbook-open]').href=current.file;
   try{notes.value=localStorage.getItem('pbsc:lab:'+current.id)||'';status.textContent='Notes stay in this browser only.';}catch{notes.value='';status.textContent='Browser storage is unavailable. Download your observations to keep them.';}
   reader.scrollIntoView({behavior:'smooth',block:'start'});
  }));
  notes.addEventListener('input',()=>{if(!current)return;try{localStorage.setItem('pbsc:lab:'+current.id,notes.value);status.textContent='Saved in this browser only.';}catch{status.textContent='Could not save in this browser. Download your observations.';}});
  section.querySelector('[data-workbook-export]').addEventListener('click',()=>{if(!current)return;const url=URL.createObjectURL(new Blob([current.title+'\n\n'+notes.value],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='PBSC-'+current.id+'-observations.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 });
}
