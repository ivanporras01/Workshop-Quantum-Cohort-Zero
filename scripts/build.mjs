import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {join} from 'node:path';
import {inflateSync} from 'node:zlib';
const root=new URL('../',import.meta.url).pathname,dist=join(root,'dist');
await mkdir(join(dist,'src'),{recursive:true});await mkdir(join(dist,'resources'),{recursive:true});
await copyFile(join(root,'index.html'),join(dist,'index.html'));
for(const name of ['app.js','styles.css','agenda.json']){
 const encoded=(await readFile(join(root,'payload',name+'.b64'),'utf8')).trim();
 await writeFile(join(dist,'src',name),inflateSync(Buffer.from(encoded,'base64')));
}
const agenda=JSON.parse(await readFile(join(dist,'src','agenda.json'),'utf8'));
if(agenda.days.length!==5)throw Error('Expected exactly five workshop days');
await writeFile(join(dist,'build-info.json'),JSON.stringify({project:'Workshop Quantum Cohort Zero',days:agenda.dates,version:'1.0.0',builtAt:new Date().toISOString()}));
console.log('Built Workshop Quantum Cohort Zero with 5 days and all interactive assets.');