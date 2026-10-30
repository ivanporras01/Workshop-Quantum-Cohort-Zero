// Ideal instructional models. No hardware is connected; all angles are degrees.
const rad = d => d * Math.PI / 180;
const clean = n => Math.abs(n) < 1e-12 ? 0 : n;
export function pureState(theta = 90, phi = 0) {
  if (!Number.isFinite(theta) || theta < 0 || theta > 180 || !Number.isFinite(phi)) throw Error('Invalid state angles');
  return [[Math.cos(rad(theta) / 2), 0], [Math.sin(rad(theta) / 2) * Math.cos(rad(phi)), Math.sin(rad(theta) / 2) * Math.sin(rad(phi))]];
}
export function blochOf([a, b]) {
  return [2 * (a[0] * b[0] + a[1] * b[1]), 2 * (a[0] * b[1] - a[1] * b[0]), a[0] ** 2 + a[1] ** 2 - b[0] ** 2 - b[1] ** 2].map(clean);
}
export function probabilities(vector, basis = 'Z') {
  const axis = {X: 0, Y: 1, Z: 2}[basis];
  if (axis === undefined) throw Error('Unknown measurement basis');
  const p = Math.max(0, Math.min(1, (1 + vector[axis]) / 2));
  return [p, 1 - p];
}
export function sampleCounts(probs, shots = 200, rng = Math.random) {
  if (!Number.isInteger(shots) || shots < 1 || probs.some(p => !Number.isFinite(p) || p < 0) || Math.abs(probs.reduce((a,b)=>a+b,0)-1)>1e-8) throw Error('Invalid sampling distribution');
  const counts = probs.map(() => 0);
  for (let n = 0; n < shots; n++) {
    const r = rng(); let total = 0, selected = probs.length - 1;
    for (let k = 0; k < probs.length; k++) {total += probs[k]; if (r < total) {selected = k; break;}}
    counts[selected]++;
  }
  return counts;
}
export function interference(phi = 0, coherence = 1) {
  if (coherence < 0 || coherence > 1) throw Error('Invalid coherence');
  return [(1 + coherence * Math.cos(rad(phi))) / 2, (1 - coherence * Math.cos(rad(phi))) / 2];
}
// Phi+ has correlations XX=+1, YY=-1, ZZ=+1. A classical 00/11 mixture
// has only ZZ=+1. Looking at ZZ alone cannot distinguish the two.
export function pairProbabilities(kind = 'bell', a = 'Z', b = 'Z') {
  if (!['bell','mixture','product'].includes(kind) || !['X','Y','Z'].includes(a) || !['X','Y','Z'].includes(b)) throw Error('Unknown pair or basis');
  if (kind === 'product') {
    const pa = a === 'X' ? 1 : 0.5, pb = b === 'X' ? 1 : 0.5;
    return [pa*pb,pa*(1-pb),(1-pa)*pb,(1-pa)*(1-pb)];
  }
  const correlation = a === b ? (kind === 'bell' ? (a === 'Y' ? -1 : 1) : (a === 'Z' ? 1 : 0)) : 0;
  return [(1+correlation)/4,(1-correlation)/4,(1-correlation)/4,(1+correlation)/4];
}
const add = (a,b) => [a[0]+b[0],a[1]+b[1]];
const mul = (a,b) => [a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const zero = () => [0,0];
const H = [[[Math.SQRT1_2,0],[Math.SQRT1_2,0]],[[Math.SQRT1_2,0],[-Math.SQRT1_2,0]]];
export function singleGate(state, target, matrix) {
  const n = Math.log2(state.length), mask = 1 << (n-1-target), out = state.map(zero);
  for (let i = 0; i < state.length; i++) if (!(i & mask)) {
    out[i] = add(mul(matrix[0][0],state[i]),mul(matrix[0][1],state[i|mask]));
    out[i|mask] = add(mul(matrix[1][0],state[i]),mul(matrix[1][1],state[i|mask]));
  }
  return out;
}
export function cnot(state, control, target) {
  const n = Math.log2(state.length), c = 1 << (n-1-control), t = 1 << (n-1-target), out = state.map(zero);
  for (let i = 0; i < state.length; i++) out[(i&c)? i^t : i] = state[i].slice();
  return out;
}
export function fidelity(a,b) {
  let inner = [0,0];
  for (let i=0;i<a.length;i++) inner = add(inner,mul([a[i][0],-a[i][1]],b[i]));
  return Math.min(1,inner[0]**2+inner[1]**2);
}
export function teleport(theta = 70, phi = 40, outcome = 0) {
  if (!Number.isInteger(outcome) || outcome < 0 || outcome > 3) throw Error('Invalid measurement branch');
  const input = pureState(theta,phi);
  const prepared = Array.from({length:8},zero); prepared[0]=input[0];prepared[4]=input[1];
  const shared = cnot(singleGate(prepared,1,H),1,2);
  const bellMeasurement = singleGate(cnot(shared,0,1),0,H);
  const branch = bellMeasurement.slice(outcome*2,outcome*2+2);
  const probability = branch.flat().reduce((s,x)=>s+x*x,0);
  const before = branch.map(a=>a.map(x=>x/Math.sqrt(probability)));
  let after = before.map(a=>a.slice());
  const mQ = outcome >> 1, mA = outcome & 1;
  if(mA)after = [after[1],after[0]];
  if(mQ)after[1] = after[1].map(x=>-x);
  return {input,shared,bellMeasurement,before,after,probability,mQ,mA,correction:['I (no gate)','X','Z','X, then Z'][outcome],fidelity:fidelity(input,after)};
}
export function cloningAttempt(theta = 90) {
  const input=pureState(theta,0), a=input[0][0], b=input[1][0];
  const actual=[[a,0],[0,0],[0,0],[b,0]];
  const target=[[a*a,0],[a*b,0],[a*b,0],[b*b,0]];
  return {actual:actual.map(z=>z[0]**2),target:target.map(z=>z[0]**2),fidelity:fidelity(actual,target)};
}
export function dephase(theta,phi,strength) {
  if(strength<0 || strength>1)throw Error('Invalid dephasing strength');
  const [x,y,z]=blochOf(pureState(theta,phi));
  return [(1-strength)*x,(1-strength)*y,z];
}
// Intercept-resend on every signal, noiseless BB84, random independent bases.
// These are long-run expectations, not a real QKD security assessment.
export function bb84Expectations(eve = false) {return {sifted:0.5,qber:eve?0.25:0};}
