import {renderHeroQuantum,wireHeroQuantum} from './hero-quantum.js';
import {renderQuantumAtlas,wireQuantumAtlas} from './quantum-atlas.js';
import {renderJourney,renderDayPlan} from './day-learning-map.js';
let quantumAtlas;
import {REFERENCE_STATES,applyBlochGate,renderBlochSphere} from './bloch-sphere.js';
import {getDesign,renderLessonExperience,wireLessonExperiences} from './learning-experiences.js';
import {renderBeginnerGuide,wireBeginnerGuides} from './beginner-path.js';
import {renderLabGuide,wireLabGuide} from './applied-waves-lab.js';
// Workshop Quantum Cohort Zero — interactive five-day learning companion.
// Official schedule is read from agenda.json. Educational models are supplementary.
const $=id=>document.getElementById(id),safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])),pad=n=>String(n).padStart(2,'0');
const st={days:[],lessons:[],day:0,tab:'agenda',v:[0,0,1],state:'|0⟩',basis:'Z',trace:['Start'],phase:0,frequency:2},key='cohortzero:v1:';
const store=(k,v)=>{try{localStorage.setItem(key+k,v)}catch{}},read=k=>{try{return localStorage.getItem(key+k)}catch{return null}};
const time=v=>{if(!v)return 'Not specified';let [h,m]=v.split(':').map(Number);return (h%12||12)+':'+pad(m)+(h<12?' AM':' PM')};
const dayDate=i=>st.days[i].date,notesKey=()=> 'notes-'+dayDate(st.day),doneKey=()=> 'done-'+dayDate(st.day);
function toast(t){const e=$('toast');e.textContent=t;e.hidden=false;setTimeout(()=>e.hidden=true,2600)}
function nav(){ $('day-nav').innerHTML=st.days.map((d,i)=>'<button class="day-button '+(i===st.day?'active':'')+'" data-day="'+i+'" '+(i===st.day?'aria-current="date"':'')+'><span class="day-date"><b>'+pad(Number(d.date.slice(-2)))+'</b><small>NOV</small></span><span class="day-copy"><strong>'+safe(d.theme)+'</strong><small>'+safe(d.day)+' · Day '+pad(i+1)+'</small></span>'+(read('done-'+d.date)==='yes'?' ✓':'')+'</button>').join('')+'<div class="side-help"><strong>Learning, one day at a time.</strong><p>Notes and review marks stay on this device.</p></div>';
 $('day-nav').querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>choose(+b.dataset.day)));
}
function choose(i){if(i<0||i>=st.days.length)return;st.day=i;st.tab='agenda';st.v=[0,0,1];st.state='|0⟩';st.basis='Z';st.trace=['Start'];let url=new URL(location.href);url.searchParams.set('day',dayDate(i));history.replaceState(null,'',url.pathname+url.search+url.hash);render();tab('agenda')}
function tab(t){st.tab=t;for(const name of ['agenda','learn','explore','notes']){$('panel-'+name).hidden=name!==t;$('tab-'+name).setAttribute('aria-selected',String(t===name));$('tab-'+name).tabIndex=t===name?0:-1}if(t==='explore'&&st.day===4)draw()}
function render(){let d=st.days[st.day],date=new Date(d.date+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
 $('day-heading').innerHTML='<div class="day-heading"><div class="day-topline"><span class="day-pill">DAY '+pad(st.day+1)+' · '+date.toUpperCase()+'</span><span class="day-ordinal">'+(st.day+1)+' OF 5</span></div><h3>'+safe(d.theme)+'</h3><p>'+safe(d.focus)+'</p></div>';
 $('day-heading').insertAdjacentHTML('beforeend',renderDayPlan(st.day));
 $('day-heading').querySelectorAll('[data-open-concept]').forEach(b=>b.addEventListener('click',()=>quantumAtlas?.open(b.dataset.openConcept,{scroll:true})));
 $('day-heading').querySelectorAll('[data-day-study]').forEach(b=>b.addEventListener('click',()=>{tab('learn');const card=$('topic-'+st.day+'-'+b.dataset.dayStudy);if(card){card.querySelector('details').open=true;card.scrollIntoView({behavior:'instant',block:'start'});}}));
 $('day-position').textContent=pad(st.day+1)+' / 05';$('previous-day').disabled=st.day===0;$('next-day').disabled=st.day===4;
 $('timeline').innerHTML='<p class="session-intro">Official program times and presenters, transcribed from the supplied agenda.</p><div class="timeline">'+d.sessions.map(s=>'<article class="session '+(s.kind==='break'?'break':'')+'"><div class="session-time">'+(s.start?time(s.start):'TBA')+'<small>'+(s.end?'to '+time(s.end):'Time not specified')+'</small></div><div class="timeline-rail"><span class="timeline-dot"></span></div><div class="session-card"><h4>'+safe(s.title)+'</h4>'+(s.speaker?'<p>'+safe(s.speaker)+'</p>':'')+(s.note?'<p class="session-note">'+safe(s.note)+'</p>':'')+(s.kind!=='break'?'<button class="agenda-learn" type="button" data-agenda-lesson="'+safe(s.title)+'">Study this topic ↗</button>':'')+'</div></article>').join('')+'</div><p class="original-note">The Explore activities are additional educational demonstrations; the schedule above follows the source agenda. <a href="/resources/PBSC-Cohort-Zero-Agenda.pdf" target="_blank">Download agenda PDF</a>.</p>';
 $('workshop-notes').value=read(notesKey())||'';$('day-complete').checked=read(doneKey())==='yes';$('note-status').textContent='Stored locally in this browser';nav();learn();explore();
 $('timeline').querySelectorAll('[data-agenda-lesson]').forEach(button=>button.addEventListener('click',()=>{
   const i=d.sessions.filter(s=>s.kind!=='break').findIndex(s=>s.title===button.dataset.agendaLesson);
   tab('learn');
   const card=$('topic-'+st.day+'-'+i);
   if(card){card.querySelector('details').open=true;card.scrollIntoView({behavior:'smooth',block:'start'});}
 }));
}
function learn(){
 const d=st.days[st.day],items=d.sessions.filter(s=>s.kind!=='break').map(s=>({session:s,lesson:st.lessons.find(l=>l.date===d.date&&l.title===s.title)}));
 const intro=st.day===0?{
 eyebrow:'WELCOME TO COHORT ZERO',
 heading:'This is where curiosity becomes discovery.',
 sub:'No science, math or coding background is assumed. We begin with the difference between a classical bit and a quantum qubit, explain each new word, and build understanding with interactive diagrams before any questions.',
 steps:['DISCOVER','VISUALIZE','EXPERIMENT','EXPLAIN'],
 note:'Start with the explanations. Then watch the picture, move the controls, follow the example, and only after that answer a question.'
 }:{
 eyebrow:'WELCOME TO DAY '+String(st.day+1).padStart(2,'0'),
 heading:['','Understand secure quantum communication.','Build a foundation for quantum-safe security.','Develop practical workforce skills.','Turn wave theory into visible evidence.'][st.day],
 sub:'Each topic begins with its key idea and why it matters. Explore the interactive visual, work through the example, and only then try the practice.',
 steps:['LEARN','SEE IT','WORK IT','TRY IT'],
 note:'Navigate the lessons in order, or choose a topic from the list below.'
 };
 const introMarkup='<section class="learning-hero"><div class="learning-hero-main"><span class="learning-hero-kicker">'+safe(intro.eyebrow)+'</span><h3>'+safe(intro.heading)+'</h3><p>'+safe(intro.sub)+'</p><div class="learning-hero-steps">'+intro.steps.map((t,i)=>'<span><em>'+String(i+1).padStart(2,'0')+'</em>'+safe(t)+'</span>').join('')+'</div><p class="learning-hero-note">'+safe(intro.note)+'</p></div><div class="learning-hero-orbit" aria-hidden="true"><svg viewBox="0 0 240 240"><circle cx="120" cy="120" r="85" fill="#103953" stroke="#73e1d9" stroke-width="1.5"/><ellipse cx="120" cy="120" rx="88" ry="29" fill="none" stroke="#9cd7eb"/><ellipse cx="120" cy="120" rx="32" ry="85" fill="none" stroke="#9bc5ff"/><path d="M120 120 172 69" stroke="#d8ff9e" stroke-width="5" stroke-linecap="round"/><circle cx="172" cy="69" r="8" fill="#d8ff9e"/><circle cx="120" cy="120" r="4" fill="#fff"/></svg><span>LEARN BY DISCOVERY</span></div></section>';
 const list=items.map(({session},i)=>'<a href="#topic-'+st.day+'-'+i+'" class="lesson-jump-link"><span>'+String(i+1).padStart(2,'0')+'</span>'+safe(session.title)+'</a>').join('');
 const cards=items.map(({session,lesson},i)=>{
  const when=session.start?time(session.start)+(session.end?' – '+time(session.end):''):'Time not specified in source agenda';
  if(!lesson)return '<article class="topic-card" id="topic-'+st.day+'-'+i+'"><h4>'+safe(session.title)+'</h4><p>Lesson unavailable.</p></article>';
  const design=getDesign(lesson);
  const beginner=renderBeginnerGuide(lesson);
  const opening=design?'<section class="concept-opening"><span class="concept-opening-eyebrow">01 · UNDERSTAND THE BIG IDEA</span><h5>'+safe(design.idea)+'</h5><p>'+safe(lesson.overview)+'</p><div class="concept-why"><span class="why-icon">✳</span><div><strong>Why this matters</strong><p>'+safe(design.why)+'</p></div></div></section>':'<p class="topic-overview">'+safe(lesson.overview)+'</p>';
  const concepts='<section class="concept-teaching"><div class="lesson-section-title"><span>02 · BUILD YOUR UNDERSTANDING</span><h5>Three concepts to know before you experiment</h5></div><div class="concept-tiles">'+lesson.concepts.map((p,j)=>'<section class="lesson-concept"><span class="concept-number">'+String(j+1).padStart(2,'0')+'</span><div><h5>'+safe(p.heading)+'</h5><p>'+safe(p.text)+'</p></div></section>').join('')+'</div></section>';
  const visual=(design?renderLessonExperience(lesson):'')+(lesson.date==='2026-11-14'&&lesson.title==='Applied energy waves'?renderLabGuide():'');
  const steps=lesson.worked.steps;
  const worked='<section class="guided-worked" data-guided-example="true"><div class="lesson-section-title"><span>04 · FOLLOW A GUIDED EXAMPLE</span><h5>'+safe(lesson.worked.title)+'</h5><p>Follow the logic one step at a time. Make a prediction before revealing the next step.</p></div><div class="guided-progress"><span data-guided-progress>Step 1 of '+steps.length+'</span><div class="guided-dots">'+steps.map((x,k)=>'<span class="'+(k===0?'active':'')+'" data-guided-dot="'+k+'">'+String(k+1)+'</span>').join('')+'</div></div><div class="guided-steps">'+steps.map((x,k)=>'<div class="guided-step" data-guided-step="'+k+'" '+(k?'hidden':'')+'><span class="step-big">'+String(k+1).padStart(2,'0')+'</span><p>'+safe(x)+'</p></div>').join('')+'</div><div class="guided-result" data-guided-result hidden><strong>What the example shows</strong><p>'+safe(lesson.worked.result)+'</p></div><div class="guided-actions"><button type="button" data-guided-reset class="guided-button secondary">Start again</button><button type="button" data-guided-next class="guided-button primary">Next step <span aria-hidden="true">→</span></button></div></section>';
  const practice='<section class="lesson-practice"><div class="lesson-section-title"><span>05 · CHECK YOUR UNDERSTANDING</span><h5>Now you try</h5><p>You have already studied the concept, explored a visual and followed an example. Try this one independently.</p></div><p class="practice-question">'+safe(lesson.practice.question)+'</p><details><summary>Reveal the answer and explanation</summary><p>'+safe(lesson.practice.answer)+'</p></details></section>';
  const vocab=lesson.terms.length?'<section class="lesson-vocab"><strong>Key vocabulary</strong><div>'+lesson.terms.map(x=>'<span>'+safe(x)+'</span>').join('')+'</div></section>':'';
  const refs=lesson.resources.length?'<div class="lesson-resources"><strong>Additional reference materials:</strong> '+lesson.resources.map(r=>'<a href="'+safe(r.url)+'" target="_blank" rel="noopener noreferrer">'+safe(r.label)+' ↗</a>').join(' · ')+'</div>':'';
  const closing='<section class="lesson-takeaway"><span>06 · TAKE THIS WITH YOU</span><h5>'+safe(design?.take||lesson.worked.result)+'</h5><p><strong>Common misunderstanding to avoid:</strong> '+safe(lesson.misconception)+'</p>'+vocab+refs+'<button class="lesson-explore-link" type="button" data-open-explore="true">Open the full day’s interactive laboratory ↗</button></section>';
  return '<article class="topic-card enhanced-topic" data-lesson-date="'+safe(lesson.date)+'" id="topic-'+st.day+'-'+i+'"><details '+(i===0?'open':'')+'><summary><span class="topic-number">'+String(i+1).padStart(2,'0')+'</span><span class="topic-summary"><small>'+safe(when)+'</small><strong>'+safe(session.title)+'</strong><span>'+safe(session.speaker||'Presenter not specified in agenda')+'</span></span><span class="topic-toggle" aria-hidden="true">+</span></summary><div class="topic-details">'+beginner+opening+concepts+visual+worked+practice+closing+'</div></details></article>';
 }).join('');
 $('learning-content').innerHTML=introMarkup+'<div class="learning-topic-toolbar"><span class="eyebrow plain">THE LEARNING EXPERIENCE</span><h3>Choose your topic and follow the path.</h3><p>Read the concepts first. Interact with the visual. Work through the example. Then practice.</p></div><nav class="lesson-jump-list" aria-label="Topics for this workshop day">'+list+'</nav>'+cards+'<p class="lesson-origin">All 18 lessons are supplementary educational material, not presenter transcripts. The original program times and speaker credits remain in the Agenda tab.</p>';
 const root=$('learning-content');
 root.querySelectorAll('.lesson-jump-link').forEach(link=>link.addEventListener('click',()=>{
   const card=document.getElementById(link.hash.slice(1));
   if(card)card.querySelector('details').open=true;
 }));
 const openExplore=()=>{tab('explore');document.getElementById('workshop')?.scrollIntoView({behavior:'smooth',block:'start'});};
 root.querySelectorAll('[data-open-explore]').forEach(b=>b.addEventListener('click',openExplore));
 wireBeginnerGuides(root);
 wireLessonExperiences(root,openExplore);
 wireLabGuide(root);
 root.querySelectorAll('[data-guided-example]').forEach(ex=>{
   const steps=[...ex.querySelectorAll('[data-guided-step]')], dots=[...ex.querySelectorAll('[data-guided-dot]')],result=ex.querySelector('[data-guided-result]');
   const label=ex.querySelector('[data-guided-progress]'),next=ex.querySelector('[data-guided-next]');
   let current=0;
   const update=()=>{
     steps.forEach((el,i)=>el.hidden=i!==current);
     dots.forEach((el,i)=>el.classList.toggle('active',i<=current));
     label.textContent='Step '+(current+1)+' of '+steps.length;
     result.hidden=current!==steps.length-1;
     next.disabled=current===steps.length-1;
     next.textContent=current===steps.length-1?'Example complete ✓':'Next step →';
   };
   next.addEventListener('click',()=>{current=Math.min(steps.length-1,current+1);update();});
   ex.querySelector('[data-guided-reset]').addEventListener('click',()=>{current=0;update();});
   update();
 });
}

const box=(title,description,body)=>'<header class="explore-header"><span class="explore-icon">✳</span><div><h3>'+title+'</h3><p>'+description+'</p></div></header><p class="disclaimer">Additional instructional demonstration, not an official agenda session or physical quantum experiment.</p>'+body;
const quizzes=[
 ['Which is a valid Z measurement outcome for one qubit?',['0 or 1','A half bit','A continuously varying value'],0,'A single projective Z measurement returns 0 or 1; probabilities describe repeated results.'],
 ['Does measuring a quantum key in the wrong basis always preserve the intended bit?',['Yes','No','Only with encryption software'],1,'An incompatible basis introduces uncertainty and may reveal detectable error.'],
 ['What is the purpose of post-quantum cryptography?',['Protect ordinary networks against future quantum attacks','Send faster-than-light messages','Replace every classical computer'],0,'PQC uses cryptographic algorithms intended to withstand known classical and quantum attacks.'],
 ['A Python list with 100 measured bits represents what?',['100 samples','100 simultaneous quantum states','100 quantum gates'],0,'Measurement results are classical sample data, which Python can summarize.'],
 ['Two same-frequency sine waves 180° out of phase ideally do what when added?',['Reinforce','Cancel','Double frequency'],1,'Equal-amplitude opposite-phase waves cancel in an ideal linear sum.']
];
function quiz(){let [q,answers,correct,why]=quizzes[st.day];return '<section class="quiz-card"><h4>Check your understanding</h4><p>'+q+'</p><div class="answer-options">'+answers.map((x,i)=>'<button data-choice="'+i+'" aria-pressed="false">'+safe(x)+'</button>').join('')+'</div><p class="explain" id="feedback" hidden aria-live="polite"></p></section>'}
function chooseState(value){const v=REFERENCE_STATES[value]?.v;if(!v)return;st.v=v.slice();st.state=value;st.trace=['Prepare '+value];explore()}
function chooseBasis(value){if(!['X','Y','Z'].includes(value))return;st.basis=value;explore()}
function gate(value){st.v=applyBlochGate(st.v,value);st.state='';st.trace=value==='Reset'?['Start']:st.trace.concat(value).slice(-9);explore()}
function wave(){return '<canvas id="waves" width="730" height="260" role="img" aria-label="Two sine waves and their sum"></canvas><label class="range-label">Relative phase <output id="phase-label">'+st.phase+'°</output><input id="wave-phase" type="range" min="0" max="360" value="'+st.phase+'"></label><label class="range-label">Frequency <output id="freq-label">'+st.frequency+'</output><input id="wave-frequency" type="range" min="1" max="5" value="'+st.frequency+'"></label><p class="lab-output" id="wave-status">Ideal classical wave addition. No hardware is connected.</p>'}
function draw(){let c=$('waves');if(!c)return;let ctx=c.getContext('2d'),w=c.width,h=c.height,phi=st.phase*Math.PI/180;ctx.clearRect(0,0,w,h);ctx.strokeStyle='#476277';ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();[[ '#69d7d6',t=>Math.sin(t)],['#baafff',t=>Math.sin(t+phi)],['#b4fa8b',t=>(Math.sin(t)+Math.sin(t+phi))/2]].forEach(([color,fn])=>{ctx.beginPath();for(let i=0;i<w;i++){let y=h/2-fn(i/w*2*Math.PI*st.frequency)*h*.29;i?ctx.lineTo(i,y):ctx.moveTo(i,y)}ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.stroke()});$('phase-label').textContent=st.phase+'°';$('freq-label').textContent=st.frequency;$('wave-status').textContent='Ideal combined amplitude ratio: '+Math.abs(Math.cos(phi/2)).toFixed(3)+'. Equal signals '+(st.phase===180?'cancel':st.phase===0?'reinforce':'partially interfere')+'.'}
function bb84(){let same=0,kept=0,wrong=0;for(let i=0;i<200;i++){const a=Math.random()<.5,b=Math.random()<.5,bit=Math.random()<.5;if(a===b){same++;kept++;}else if(Math.random()<.5)wrong++;}$('bb84-result').textContent='200 simulated preparations · matching bases: '+same+' · sifted bits: '+kept+'. This is a simplified basis-matching demonstration; not an implemented secure quantum key distribution protocol.'}
function explore(){
 let body='';
 if(st.day===0)body=box('One qubit, six reference states','Public Bloch sphere · X/Y/Z basis selection · interactive gates',renderBlochSphere({vector:st.v,basis:st.basis,trace:st.trace})+'<div class="public-qiskit-block"><h4>IBM Qiskit starter</h4><p>Predict the outcomes first, then try the program in an authorized Python environment.</p><pre class="code-block">from qiskit import QuantumCircuit\nqc = QuantumCircuit(1,1)\nqc.h(0)\nqc.measure(0,0)\nprint(qc.draw())</pre><p class="disclaimer">The drawn circuit is a model; this command does not itself run on quantum hardware.</p></div>');
 if(st.day===1)body=box('Polarization and quantum key distribution','Change a classical polarization angle, then simulate basis sifting','<label class="range-label">Angle between polarizers: <output id="pol-label">0°</output><input type="range" id="pol-angle" min="0" max="90" value="0"></label><div class="stat-readout"><strong id="pol-result">100.0%</strong><div class="progress-bar"><div id="pol-bar" style="width:100%"></div></div><small>Malus law: transmitted fraction = cos²(θ). Classical optical intensity, not a single-photon guarantee.</small></div><button class="primary-button" id="bb84">Simulate BB84 bases</button><p class="lab-output" id="bb84-result">The simulation illustrates basis matching only.</p>');
 if(st.day===2)body=box('Post-quantum cryptography','Compare a practical migration sequence','<p>Post-quantum cryptography protects classical networks using algorithms designed to resist quantum attacks. It is different from quantum key distribution.</p><div class="control-row">'+['Inventory','Prioritize','Test','Deploy'].map((s,i)=>'<button class="chip-button" data-pqc="'+i+'">'+s+'</button>').join('')+'</div><p class="lab-output" id="pqc-out">Choose a stage to see its purpose.</p>');
 if(st.day===3)body=box('Python for quantum','Run and modify this example in a Python environment','<pre class="code-block" id="python-demo">from math import sqrt\namplitudes = [1/sqrt(2), 1/sqrt(2)]\nprobabilities = [abs(a)**2 for a in amplitudes]\nprint(probabilities)</pre><button id="python-show" class="chip-button">Show expected output</button><p class="lab-output" id="python-result">Predict the output before revealing it.</p><p>Experiment: change the amplitudes and check that the sum of probabilities equals 1.</p>');
 if(st.day===4)body=box('Applied energy waves','Explore a classical phase interference model for Saturday’s lab',wave()+'<p>On an oscilloscope, compare waveforms at 0°, 90° and 180°. Document frequency, amplitude, measured phase and uncertainty. This visualization does not measure a qubit.</p><button type="button" class="visual-link-action" id="open-full-waves-lab">Open the circuit diagram, materials, wiring guide and expected results ↗</button>');
 $('explorer').innerHTML=body+quiz();
 $('explorer').querySelectorAll('[data-state]').forEach(b=>b.onclick=()=>chooseState(b.dataset.state));
 $('explorer').querySelectorAll('[data-basis]').forEach(b=>b.onclick=()=>chooseBasis(b.dataset.basis));
 $('explorer').querySelectorAll('[data-gate]').forEach(b=>b.onclick=()=>gate(b.dataset.gate));
 $('pol-angle')?.addEventListener('input',e=>{let theta=+e.target.value,p=Math.cos(theta*Math.PI/180)**2;$('pol-label').textContent=theta+'°';$('pol-result').textContent=(p*100).toFixed(1)+'%';$('pol-bar').style.width=(p*100)+'%'});
 if($('bb84'))$('bb84').onclick=bb84;
 const info=['Review current protocols, certificates, long-lived data and their dependencies.','Prioritize assets by sensitivity and the time their data must remain confidential.','Test approved PQC implementations for interoperability, key lifecycle and failure recovery.','Roll out gradually, monitor performance and retain a tested rollback plan.'];
 document.querySelectorAll('[data-pqc]').forEach(b=>b.onclick=()=>{$('pqc-out').textContent=info[+b.dataset.pqc]});
 if($('python-show'))$('python-show').onclick=()=>{$('python-result').textContent='[0.4999999999999999, 0.4999999999999999] (floating point approximation to [0.5, 0.5])'};
 for(const id of ['wave-phase','wave-frequency'])$(id)?.addEventListener('input',e=>{st[id==='wave-phase'?'phase':'frequency']=+e.target.value;draw()});
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{let q=quizzes[st.day];$('feedback').hidden=false;$('feedback').textContent=(+b.dataset.choice===q[2]?'Correct. ':'Review: ')+q[3];document.querySelectorAll('[data-choice]').forEach(el=>el.setAttribute('aria-pressed',el===b?'true':'false'))});
 if($('open-full-waves-lab'))$('open-full-waves-lab').onclick=()=>{tab('learn');const d=$('learning-content');const section=[...d.querySelectorAll('.topic-card')].find(card=>card.textContent.includes('Applied energy waves'));if(section){const details=section.querySelector('details');if(details)details.open=true;section.scrollIntoView({behavior:'smooth',block:'start'});}};
 if(st.day===4&&st.tab==='explore')draw();
}
function download(name,contents){let u=URL.createObjectURL(new Blob([contents],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),5000)}
function removeTrackingParameters(){
  const url=new URL(location.href);
  let changed=false;
  for(const name of [...url.searchParams.keys()]){
    if(name.toLowerCase().startsWith('utm_')){
      url.searchParams.delete(name);
      changed=true;
    }
  }
  if(changed)history.replaceState(null,'',url.pathname+url.search+url.hash);
}
async function boot(){try{removeTrackingParameters();const [agendaResponse,lessonResponse]=await Promise.all([fetch('/src/agenda.json'),fetch('/src/lessons.json')]);if(!agendaResponse.ok||!lessonResponse.ok)throw Error('workshop content fetch failed');const d=await agendaResponse.json(),study=await lessonResponse.json();st.days=d.days;st.lessons=study.lessons;if(st.days.length!==5||st.lessons.length!==18)throw Error('Five workshop days and eighteen lessons expected');let day=new URLSearchParams(location.search).get('day'),i=st.days.findIndex(v=>v.date===day);if(i!==-1)st.day=i;
 $('hero-quantum').innerHTML=renderHeroQuantum();
 wireHeroQuantum($('hero-quantum'),{onFull:()=>{choose(0);tab('explore');$('workshop').scrollIntoView({behavior:'instant',block:'start'});}});
 $('quantum-concepts').innerHTML=renderQuantumAtlas();
 quantumAtlas=wireQuantumAtlas($('quantum-concepts'),{onDay:i=>{choose(i);$('workshop').scrollIntoView({behavior:'instant',block:'start'});}});
 $('day-learning-map').innerHTML=renderJourney();
 $('day-learning-map').querySelectorAll('[data-journey-day]').forEach(b=>b.addEventListener('click',()=>{choose(+b.dataset.journeyDay);$('workshop').scrollIntoView({behavior:'instant',block:'start'});}));
 let theme=read('theme');if(theme)document.documentElement.dataset.theme=theme;
 document.querySelectorAll('[data-tab]').forEach(b=>{
 b.addEventListener('click',()=>tab(b.dataset.tab));
 b.addEventListener('keydown',e=>{
  const names=['agenda','learn','explore','notes'],current=names.indexOf(b.dataset.tab);
  let next;if(e.key==='ArrowRight')next=(current+1)%names.length;
  else if(e.key==='ArrowLeft')next=(current+names.length-1)%names.length;
  else if(e.key==='Home')next=0;else if(e.key==='End')next=names.length-1;else return;
  e.preventDefault();tab(names[next]);$('tab-'+names[next]).focus();
 });
});$('theme-button').onclick=()=>{let v=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=v;store('theme',v)};
 $('previous-day').onclick=()=>choose(st.day-1);$('next-day').onclick=()=>choose(st.day+1);$('jump-last-day').onclick=()=>choose(4);
 $('start-beginner-learning')?.addEventListener('click',()=>{choose(0);tab('learn');$('topic-0-0')?.querySelector('details')?.setAttribute('open','');});
 $('workshop-notes').oninput=e=>{store(notesKey(),e.target.value);$('note-status').textContent='Saved in this browser'};
 $('day-complete').onchange=e=>{store(doneKey(),e.target.checked?'yes':'no');nav()};
 $('copy-public-link').onclick=async()=>{const clean=location.origin+'/';try{await navigator.clipboard.writeText(clean);toast('Public Cloudflare link copied — paste it directly into your browser or share it');}catch{const el=document.createElement('textarea');el.value=clean;document.body.appendChild(el);el.select();const ok=document.execCommand('copy');el.remove();toast(ok?'Public Cloudflare link copied':'Copy this address: '+clean);}};
 $('download-all-notes').onclick=()=>{download('Cohort-Zero-complete-notebook.md','# Workshop Quantum Cohort Zero\nBy Dr. Luis Pentzke and Professor Hector Porras\n\n'+st.days.map(d=>'## '+d.day+', '+d.date+' - '+d.theme+'\nReviewed: '+(read('done-'+d.date)==='yes'?'Yes':'Not yet')+'\n\n'+(read('notes-'+d.date)||'No notes saved for this day.')).join('\n\n---\n\n'));toast('All five days exported')};
 $('download-notes').onclick=()=>{let d=st.days[st.day];download('Cohort-Zero-'+d.date+'-notes.md','# Workshop Quantum Cohort Zero\n## '+d.day+', '+d.date+'\n\n'+$('workshop-notes').value);toast('Notes saved as a file')};
 render();tab('agenda');
 }catch(e){$('day-heading').innerHTML='<p role="alert">Could not load the workshop agenda. Please refresh the page.</p>';console.error(e)}}
boot();
