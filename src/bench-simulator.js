import {PRESETS,periodUs,burstTimeUs,sumVpp,sample} from './bench-model.js';
import {renderDigitalLabs,wireDigitalLabs} from './bench-labs.js';
document.getElementById('lab-library').innerHTML=renderDigitalLabs();wireDigitalLabs(document);
const form=document.getElementById('instrument-controls'),canvas=document.getElementById('scope-display'),ctx=canvas.getContext('2d');
let state={...PRESETS.amplitude,output:true},running=true,armed=false,captured=false;let lastDisplay={...state};
const field=name=>form.elements.namedItem(name);
function syncForm(){for(const k of ['wave','frequency','vpp','offset','phase','width','cycles','time','volts'])field(k).value=state[k];for(const k of ['two','math','output','burst'])field(k).checked=state[k];}
function readForm(){
 state={...state};for(const k of ['wave'])state[k]=field(k).value;
 for(const k of ['frequency','vpp','offset','phase','width','cycles','time','volts'])state[k]=Number(field(k).value);
 for(const k of ['two','math','output','burst'])state[k]=field(k).checked;
 state.width=Math.min(state.width,periodUs(state.frequency)*.99);field('width').value=Number(state.width.toFixed(3));
 field('width').max=periodUs(state.frequency)*.99;
 field('phase').disabled=!state.two;field('math').disabled=!state.two;
 document.getElementById('phase-help').textContent=state.two?'CH1 stays at 0°. This control shifts only CH2.':'With one self-triggered channel, phase is re-aligned by the trigger. Enable CH2 to compare relative phase.';
 if(running&&!state.burst)lastDisplay={...state};
 draw();
}
function draw(){
 const dpr=window.devicePixelRatio||1,w=Math.max(280,canvas.clientWidth),h=440;canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
 ctx.fillStyle='#050d16';ctx.fillRect(0,0,w,h);
 const s=lastDisplay,show= !s.burst||captured;const left=52,top=66,pw=w-78,ph=300;
 ctx.fillStyle='#f7df4f';ctx.font='13px system-ui';ctx.fillText(`1  ${(s.volts*1000).toFixed(0)} mV/div${s.two?'     2  '+(s.volts*1000).toFixed(0)+' mV/div':''}`,left,25);
 ctx.fillStyle='#dce9f7';ctx.fillText(`${s.time} µs/div     Trigger: CH1 rising${s.burst?' +0.10 V':s.wave==='pulse'?' '+s.offset.toFixed(2)+' V':' '+s.offset.toFixed(2)+' V'}`,left,46);
 ctx.strokeStyle='#30475d';ctx.lineWidth=.7;for(let i=0;i<=10;i++){const x=left+pw*i/10;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,top+ph);ctx.stroke();}for(let i=0;i<=8;i++){const y=top+ph*i/8;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(left+pw,y);ctx.stroke();}
 const start=s.burst?-s.time*1e-6:0;const range=s.time*10e-6;
 const trace=(fn,col,dash=[])=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash(dash);ctx.beginPath();for(let i=0;i<=2000;i++){let v=show?fn(start+i/2000*range):0;const y=top+ph/2-v/(s.volts*8)*ph;const bounded=Math.max(top,Math.min(top+ph,y));if(i===0)ctx.moveTo(left,bounded);else ctx.lineTo(left+pw*i/2000,bounded);}ctx.stroke();ctx.setLineDash([]);};
 trace(t=>sample(t,s,1),'#ffdf3b');if(s.two)trace(t=>sample(t,s,2),'#49df9f',[6,4]);if(s.two&&s.math)trace(t=>sample(t,s,1)+sample(t,s,2),'#da87ff');
 const startLabel=s.burst?'-'+s.time+' µs':'0 µs';ctx.fillStyle='#9bb1c5';ctx.font='11px system-ui';ctx.fillText(startLabel,left,top+ph+19);ctx.fillText(((start+range)*1e6).toFixed(0)+' µs',left+pw-65,top+ph+19);
 ctx.fillStyle='#dce9f7';ctx.font='12px system-ui';ctx.fillText('Yellow CH1   ·   Green dashed CH2   ·   Magenta Math sum',left,417);
 const meas=document.getElementById('scope-measurements');meas.innerHTML=`<div><small>Frequency</small><strong>${s.output&&show?(s.frequency/1000).toFixed(3)+' kHz':'—'}</strong></div><div><small>Period</small><strong>${s.output&&show?periodUs(s.frequency).toFixed(1)+' µs':'—'}</strong></div><div><small>CH1 peak-to-peak</small><strong>${s.output&&show?s.vpp.toFixed(3):'0.000'} V</strong></div>`+(s.wave==='pulse'?`<div><small>Pulse width / duty</small><strong>${s.width.toFixed(1)} µs / ${(s.width/periodUs(s.frequency)*100).toFixed(1)}%</strong></div>`:'')+(s.two&&s.math?`<div><small>Sum Vpp ${s.wave!=='sine'?'(sampled)':''}</small><strong>${show?sumReading(s).toFixed(3):'0.000'} V</strong></div>`:'')+(s.burst?`<div><small>Burst duration</small><strong>${burstTimeUs(s.cycles,s.frequency).toFixed(1)} µs</strong></div>`:'');
 document.getElementById('scope-status').textContent=armed?'SINGLE: armed - press generator TRIGGER':s.burst&&!captured?'No burst captured - press scope SINGLE, then generator TRIGGER':!running?'STOP - displayed capture is frozen':'RUN - ideal CH1-triggered display';
 document.getElementById('scope-status').classList.toggle('armed',armed);
 document.getElementById('bench-description').textContent=explanation(s);
}
function sumReading(s){if(!s.output)return 0;if(s.wave==='sine')return sumVpp(s.vpp,s.phase);let min=Infinity,max=-Infinity;for(let i=0;i<2000;i++){const t=i/2000/s.frequency,v=sample(t,s,1)+sample(t,s,2);min=Math.min(min,v);max=Math.max(max,v);}return max-min;}
function explanation(s){if(!s.output)return 'Generator output is OFF. The model sends 0 V to the scope.';if(s.burst)return `${s.cycles} complete cycles at ${s.frequency} Hz give τ = N/f = ${(s.cycles/s.frequency*1000).toFixed(3)} ms. This is drive duration, not a measured quantum rotation.`;if(s.two)return `CH1 is fixed. CH2 leads by ${s.phase}°. ${s.math?'The Math trace adds the voltages; a canceled sum does not remove the separate source signals.':'Compare the yellow and green traces using the same time reference.'} Relative phase is the analogy to quantum interference.`;if(s.wave==='pulse')return `The pulse is high for ${s.width} µs in each ${periodUs(s.frequency).toFixed(1)} µs period. Duty cycle is a classical time fraction, not quantum probability.`;return `T = 1/f = ${periodUs(s.frequency).toFixed(1)} µs. Each large horizontal square is ${s.time} µs; each vertical square is ${s.volts} V. Voltage changes height; frequency changes spacing.`;}
form.addEventListener('input',()=>{if(!form.checkValidity())return;readForm();});
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{state={...PRESETS[b.dataset.preset],output:true};running=true;armed=false;captured=false;lastDisplay={...state};syncForm();readForm();document.querySelectorAll('[data-preset]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
document.getElementById('scope-run').addEventListener('click',()=>{running=!running;armed=false;if(running){captured=false;lastDisplay={...state};}draw();});
document.getElementById('scope-single').addEventListener('click',()=>{if(state.burst){armed=true;captured=false;running=false;lastDisplay={...state};}else{armed=false;running=false;lastDisplay={...state};captured=true;}draw();});
document.getElementById('generator-trigger').addEventListener('click',()=>{if(!state.burst){document.getElementById('scope-status').textContent='Select Burst mode for a manual trigger.';return;}if(!armed){document.getElementById('scope-status').textContent='Burst sent; scope was not armed. Press SINGLE first, then TRIGGER.';return;}if(!state.output){document.getElementById('scope-status').textContent='Enable generator output before triggering.';return;}captured=true;armed=false;running=false;lastDisplay={...state};draw();});
document.getElementById('bench-fullscreen').addEventListener('click',async()=>{const el=document.getElementById('simulator');try{if(document.fullscreenElement)await document.exitFullscreen();else await el.requestFullscreen();}catch{document.getElementById('scope-status').textContent='Fullscreen unavailable. Use browser zoom for presentation.';}});
window.addEventListener('resize',draw);syncForm();readForm();
