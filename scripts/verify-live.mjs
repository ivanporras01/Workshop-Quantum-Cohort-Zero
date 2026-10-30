import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DESIGNS,renderLessonExperience} from '../src/learning-experiences.js';
import {BEGINNER_GUIDES} from '../src/beginner-path.js';

const origin=process.env.WORKSHOP_URL||'https://workshop-quantum-cohort-zero.hectorporras0916.workers.dev';
const base=origin.replace(/\/$/,'');
const pollMs=7000,attempts=15;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function get(path){
 const response=await fetch(base+path,{signal:AbortSignal.timeout(12000),headers:{'Cache-Control':'no-cache'}});
 if(!response.ok)throw Error(path+' responded HTTP '+response.status);
 return response;
}
let last='';
for(let i=1;i<=attempts;i++){
 try{
  const [main,study,agenda,code,styles,pdf,bloch,design,learning,learningCss,lab,labStyle,schematic,beginner,beginnerCss,qubit]=await Promise.all([
   get('/'),get('/src/lessons.json'),get('/src/agenda.json'),get('/src/app.js'),get('/src/styles.css'),get('/resources/PBSC-Cohort-Zero-Agenda.pdf'),get('/src/bloch-sphere.js'),get('/src/bloch-sphere.css'),get('/src/learning-experiences.js'),get('/src/learning-experiences.css'),get('/src/applied-waves-lab.js'),get('/src/applied-waves-lab.css'),get('/src/applied-waves-circuit.svg'),get('/src/beginner-path.js'),get('/src/beginner-path.css'),get('/src/qubit-lesson.js')
  ]);
  const html=await main.text(),lessons=await study.json(),a=await agenda.json(),js=await code.text(),css=await styles.text(),blochJs=await bloch.text(),blochCss=await design.text(),learningJs=await learning.text(),learningStyles=await learningCss.text(),labJs=await lab.text(),labCss=await labStyle.text(),svg=await schematic.text(),beginnerJs=await beginner.text(),beginnerStyle=await beginnerCss.text(),qubitJs=await qubit.text();
  assert.equal(a.days.length,5);
  assert.equal(lessons.lessons.length,18);
  assert.ok(html.includes('id="tab-learn"'));
  assert.ok(html.includes('id="panel-learn"'));
  assert.ok(js.includes('function learn(')&&js.includes('data-agenda-lesson'));
  assert.ok(css.includes('.topic-card'));
  assert.ok(html.includes('/src/learning-experiences.css'));
  assert.ok(js.includes("from './learning-experiences.js'"));
  assert.ok(js.includes('concept-opening')&&js.includes('guided-worked'));
  assert.ok(learningStyles.includes('.learning-hero')&&learningStyles.includes('.visual-exhibit'));
  assert.ok(html.includes('/src/applied-waves-lab.css'));
  assert.ok(js.includes("from './applied-waves-lab.js'"));
  assert.ok(labCss.includes('.lab-guide')&&labCss.includes('.lab-connection-step'));
  assert.ok(svg.includes('R1 = 10 kΩ')&&svg.includes('R2 = 10 kΩ')&&svg.includes('Vout'));
  const labModule=await import('data:text/javascript;base64,'+Buffer.from(labJs,'utf8').toString('base64'));
  const labHtml=labModule.renderLabGuide();
  assert.equal(labModule.LAB_STEPS.length,8);
  assert.ok(labHtml.includes('data-lab-step="7"')&&labHtml.includes('H → P(φ) → H'));
  assert.ok(Math.abs(labModule.idealLabOutcome(90).vpp-Math.SQRT2)<1e-10);

  // The teaching module imports the qubit lab: verify the published bytes match
  // this exact checked-out version, then execute the local module with normal imports.
  const publishedFiles=[
    ['src/learning-experiences.js',learningJs],
    ['src/qubit-lesson.js',qubitJs],
    ['src/beginner-path.js',beginnerJs]
  ];
  for(const [relative,remote] of publishedFiles){
    const expected=await readFile(new URL('../'+relative,import.meta.url),'utf8');
    assert.equal(remote,expected,'Cloudflare has not deployed latest '+relative);
  }
  assert.ok(html.includes('/src/beginner-path.css'));
  assert.ok(beginnerStyle.includes('.beginner-guide')&&beginnerStyle.includes('.qubit-live-lesson'));
  assert.ok(js.includes("from './beginner-path.js'"));
  assert.ok(js.includes('wireBeginnerGuides(root)'));
  assert.ok(learningJs.includes("from './qubit-lesson.js'"));
  assert.ok(qubitJs.includes('renderInteractiveBlochLesson'));
  assert.equal(Object.keys(BEGINNER_GUIDES).length,18);
  assert.equal(Object.keys(DESIGNS).length,18);
  const demo=renderLessonExperience(lessons.lessons[0]);
  assert.ok(demo.includes('data-visual-type="journey"')&&demo.includes('data-demo-option'));

  assert.ok(html.includes('/src/bloch-sphere.css'));
  assert.ok(js.includes("from './bloch-sphere.js'"));
  assert.ok(blochJs.includes('THE BLOCH SPHERE')&&blochJs.includes('measureBloch('));
  // Import the published component itself and test the actual generated HTML,
  // not templates whose data attributes are dynamically interpolated.
  const liveModule=await import('data:text/javascript;base64,'+Buffer.from(blochJs,'utf8').toString('base64'));
  const sphereHtml=liveModule.renderBlochSphere({vector:[1,0,0],basis:'X',trace:['Start','H']});
  for(const state of ['|0⟩','|1⟩','|+⟩','|−⟩','|+i⟩','|−i⟩'])assert.ok(sphereHtml.includes('data-state="'+state+'"'),state+' control not rendered');
  for(const basis of ['X','Y','Z'])assert.ok(sphereHtml.includes('data-basis="'+basis+'"'),basis+' measurement basis missing');
  for(const gate of ['H','X','Y','Z','S','T','Reset'])assert.ok(sphereHtml.includes('data-gate="'+gate+'"'),gate+' gate missing');
  assert.ok(sphereHtml.includes('Measure |+⟩ in X basis')&&sphereHtml.includes('100%'));
  assert.deepEqual(liveModule.applyBlochGate(liveModule.applyBlochGate(liveModule.applyBlochGate([0,0,1],'H'),'Z'),'H'),[0,0,-1]);
  assert.ok(blochCss.includes('.public-bloch-panel'));

  const actual=a.days.flatMap(d=>d.sessions.filter(s=>s.kind!=='break').map(s=>d.date+'|'+s.title)).sort();
  const provided=lessons.lessons.map(l=>l.date+'|'+l.title).sort();
  assert.deepEqual(provided,actual);
  assert.ok(Number(pdf.headers.get('Content-Length')||0)!==0);
  console.log('PASS LIVE: Cloudflare serves all 18 beginner-first lessons, original 5-day agenda, enhanced Bloch sphere and angles, 75 foundational explanations, guided examples, responsive styling and agenda PDF.');
  process.exit(0);
 }catch(error){
  last=String(error);
  console.log('Production check '+i+'/'+attempts+': '+last.slice(0,260));
  if(i<attempts)await pause(pollMs);
 }
}
throw Error('Cloudflare content not verified: '+last);
