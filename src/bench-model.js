export const PRESETS={
 amplitude:{label:'A · Amplitude',wave:'sine',frequency:1000,vpp:2,offset:0,phase:0,width:100,cycles:1,two:false,math:false,time:200,volts:.5,burst:false},
 frequency:{label:'B · Frequency',wave:'sine',frequency:2000,vpp:2,offset:0,phase:0,width:100,cycles:1,two:false,math:false,time:200,volts:.5,burst:false},
 pulse:{label:'C · Pulse width',wave:'pulse',frequency:1000,vpp:1,offset:.5,phase:0,width:100,cycles:1,two:false,math:false,time:200,volts:.2,burst:false},
 burst:{label:'D · Triggered burst',wave:'sine',frequency:1000,vpp:1,offset:0,phase:0,width:100,cycles:1,two:false,math:false,time:1000,volts:.2,burst:true},
 phase:{label:'Two cables · Relative phase',wave:'sine',frequency:1000,vpp:1,offset:0,phase:90,width:100,cycles:1,two:true,math:false,time:200,volts:.2,burst:false},
 sum:{label:'Two cables · Interference',wave:'sine',frequency:1000,vpp:1,offset:0,phase:180,width:100,cycles:1,two:true,math:true,time:200,volts:.5,burst:false}
};
export function periodUs(f){if(!(f>0))throw Error('Frequency must be positive');return 1e6/f;}
export function phaseTimeUs(deg,f){return deg/360*periodUs(f);}
export function burstTimeUs(cycles,f){return cycles*periodUs(f);}
export function sumVpp(vpp,phase){return 2*vpp*Math.abs(Math.cos(phase*Math.PI/360));}
// t is in seconds. CH2 has positive phase lead; CH1 is the fixed trigger reference.
export function sample(t,s,channel=1){
 if(!s.output)return 0;
 if(s.burst&&(t<0||t>=s.cycles/s.frequency))return s.offset;
 const phase=channel===2?s.phase/360:0;
 const turn=((t*s.frequency+phase)%1+1)%1;
 return s.wave==='pulse'?s.offset+(turn<s.width*1e-6*s.frequency?1:-1)*s.vpp/2:s.offset+s.vpp/2*Math.sin(2*Math.PI*turn);
}

// Separate theoretical models. Neither result is a quantum measurement by the scope.
export function interferenceProbabilities(phase){
 const p0=Math.cos(phase*Math.PI/360)**2;
 return {p0,p1:1-p0};
}
export function assumedBurstRotation(cycles,frequency){
 const duration=cycles/frequency,angle=2*Math.PI*250*duration;
 return {duration,angle,p1:Math.sin(angle/2)**2};
}
export const DEMO_GUIDES={
 amplitude:{title:'A · Amplitude changes height',steps:['Use one BNC: generator CH1 → scope CH1. Keep frequency at 1 kHz and voltage scale at 0.5 V/div.','Try 2, 1 and 0.5 Vpp. Predict 4, 2 and 1 vertical divisions.','Explain: the period stays 1 ms while wave height changes.']},
 frequency:{title:'B · Frequency changes spacing',steps:['Keep amplitude at 2 Vpp and time scale at 200 µs/div.','Try 500, 1000 and 2000 Hz. Predict periods of 2000, 1000 and 500 µs.','At 2 kHz, one cycle spans 2.5 divisions. Explain T = 1/f.']},
 pulse:{title:'C · Pulse width changes time high',steps:['Use 1 kHz, 1 Vpp and +0.5 V offset. The pulse runs between 0 and +1 V.','Try widths of 100, 250 and 500 µs. The full period remains 1000 µs.','Predict duty cycles of 10%, 25% and 50%. These are time fractions.']},
 burst:{title:'D · Arm first, then trigger',steps:['Choose 1–4 burst cycles. Keep the carrier at 1 kHz and amplitude at 1 Vpp.','Press scope SINGLE, then generator TRIGGER. The trace freezes after the packet.','Count complete cycles: duration = N/f. Compare with the explicitly assumed quantum model below.']},
 phase:{title:'Two cables · Compare relative phase',steps:['Cable A: CH1 → input 1. Cable B: CH2 → input 2. CH1 remains the reference.','Move CH2 phase through 0°, 90°, 180°, 270° and 360°.','At 1 kHz, 90° is a 250 µs lead. At 360°, the traces overlap again.']},
 sum:{title:'Two cables · Reveal interference',steps:['The Math function adds CH1 + CH2 digitally. Keep both source amplitudes at 1 Vpp.','Try 0°, 90° and 180°. Predict sum amplitudes of 2, 1.414 and 0 Vpp.','Compare the separate theoretical H → P(φ) → H circuit below. A canceled sum leaves both source signals present.']}
};
