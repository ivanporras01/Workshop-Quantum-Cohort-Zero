import {mkdir,readFile,writeFile,copyFile,cp} from 'node:fs/promises';
import {join} from 'node:path';
import {inflateSync} from 'node:zlib';
const base=new URL('../',import.meta.url).pathname,dist=join(base,'dist');
await mkdir(join(dist,'src'),{recursive:true});await mkdir(join(dist,'resources'),{recursive:true});
await copyFile(join(base,'index.html'),join(dist,'index.html'));
await copyFile(join(base,'favicon.svg'),join(dist,'favicon.svg'));
for(const name of ['app.js','styles.css','lessons.json','bloch-sphere.js','bloch-sphere.css','learning-experiences.js','learning-experiences.css'])await copyFile(join(base,'src',name),join(dist,'src',name));
const compressed=(await readFile(join(base,'payload/agenda.json.b64'),'utf8')).trim();
const decoded=inflateSync(Buffer.from(compressed,'base64')).toString('utf8');
const agenda=JSON.parse(decoded);
if(agenda.days.length!==5)throw new Error('Five workshop dates are required');
await writeFile(join(dist,'src','agenda.json'),decoded);
const clean=x=>String(x??'').normalize('NFKD').replace(/[^\x20-\x7E]/g,'');
const esc=x=>clean(x).replaceAll('\\','\\\\').replaceAll('(','\\(').replaceAll(')','\\)');
const printedTime=x=>{if(!x)return 'Time not specified';const [h,m]=x.split(':').map(Number);return (h%12||12)+':'+String(m).padStart(2,'0')+(h<12?' AM':' PM')};
const lines=['Workshop Quantum Cohort Zero','Palm Beach State College | November 9, 10, 12, 13, and 14, 2026','Reformatted from the instructor-supplied two-page Cohort Zero agenda',''];
for(const d of agenda.days){lines.push(d.day+', '+d.date+' | '+d.theme);for(const s of d.sessions){const when=s.start&&s.end?printedTime(s.start)+' - '+printedTime(s.end):'Time not specified';lines.push('  '+when+' | '+s.title);if(s.speaker)lines.push('    '+s.speaker);if(s.note)lines.push('    '+s.note);}lines.push('');}
const split=x=>{let out=[];while(x.length>96){let i=x.lastIndexOf(' ',96);if(i<30)i=96;out.push(x.slice(0,i));x='    '+x.slice(i).trimStart();}out.push(x);return out};
const rows=lines.flatMap(split),pages=[];for(let i=0;i<rows.length;i+=47)pages.push(rows.slice(i,i+47));
const objects=[null,'<< /Type /Catalog /Pages 2 0 R >>',null,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
const pageIds=[];
for(const page of pages){
  const stream=page.map((line,i)=>'BT /F1 '+(i===0?'17':'10')+' Tf 46 '+(786-i*15)+' Td ('+esc(line)+') Tj ET').join('\n');
  const pageId=objects.length;objects.push('');const streamId=objects.length;objects.push('<< /Length '+Buffer.byteLength(stream)+' >>\nstream\n'+stream+'\nendstream');
  objects[pageId]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 3 0 R >> >> /Contents '+streamId+' 0 R >>';pageIds.push(pageId);
}
objects[2]='<< /Type /Pages /Count '+pageIds.length+' /Kids ['+pageIds.map(id=>id+' 0 R').join(' ')+'] >>';
let pdf='%PDF-1.4\n',offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=Buffer.byteLength(pdf);pdf+=i+' 0 obj\n'+objects[i]+'\nendobj\n'}const xref=Buffer.byteLength(pdf);pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';for(let i=1;i<objects.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';
await writeFile(join(dist,'resources','PBSC-Cohort-Zero-Agenda.pdf'),pdf,'binary');
await writeFile(join(dist,'build-info.json'),JSON.stringify({name:'Workshop Quantum Cohort Zero',dates:agenda.dates,version:'1.0.1',builtAt:new Date().toISOString()}));
console.log('Generated 5-day interactive workshop plus reformatted agenda PDF.');
