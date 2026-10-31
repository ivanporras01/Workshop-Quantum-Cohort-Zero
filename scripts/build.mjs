import {mkdir,readFile,writeFile,copyFile,cp} from 'node:fs/promises';
import {join} from 'node:path';
import {inflateSync} from 'node:zlib';
const base=new URL('../',import.meta.url).pathname,dist=join(base,'dist');
await mkdir(join(dist,'src'),{recursive:true});await mkdir(join(dist,'resources'),{recursive:true});
await copyFile(join(base,'index.html'),join(dist,'index.html'));
await copyFile(join(base,'favicon.svg'),join(dist,'favicon.svg'));
for(const name of ['bit-qubit.js','hero-quantum.js','hero-quantum.css','concept-art.js','app.js','styles.css','lessons.json','bloch-sphere.js','bloch-sphere.css','learning-experiences.js','learning-experiences.css','applied-waves-lab.js','applied-waves-lab.css','applied-waves-circuit.svg','beginner-path.js','beginner-path.css','qubit-lesson.js','quantum-atlas.js','quantum-atlas.css','quantum-models.js','quantum-concept-content.js','day-learning-map.js'])await copyFile(join(base,'src',name),join(dist,'src',name));
const compressed=(await readFile(join(base,'payload/agenda.json.b64'),'utf8')).trim();
const decoded=inflateSync(Buffer.from(compressed,'base64')).toString('utf8');
const agenda=JSON.parse(decoded);
if(agenda.days.length!==5)throw new Error('Five workshop dates are required');
await writeFile(join(dist,'src','agenda.json'),decoded);
// Preserve the approved, visually designed two-page agenda on every deployment.
const pdf=Buffer.from((await readFile(join(base,'payload/agenda.pdf.b64'),'utf8')).trim(),'base64');
if(!pdf.subarray(0,5).equals(Buffer.from('%PDF-')))throw new Error('Invalid workshop agenda PDF');
await writeFile(join(dist,'resources','PBSC-Cohort-Zero-Agenda.pdf'),pdf);
await writeFile(join(dist,'build-info.json'),JSON.stringify({name:'Workshop Quantum Cohort Zero',dates:agenda.dates,version:'1.3.0',revision:process.env.CF_PAGES_COMMIT_SHA||process.env.GITHUB_SHA||'local',builtAt:new Date().toISOString()}));
console.log('Generated 5-day interactive workshop plus approved designed agenda PDF.');

