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
