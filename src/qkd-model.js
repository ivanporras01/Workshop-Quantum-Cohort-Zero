// Educational BB84 model. This software never produces a cryptographic key.
export const randomBit = (rng = Math.random) => rng() < .5 ? 0 : 1;
export function measureEncoded(bit, preparedBasis, measurementBasis, rng = Math.random) {
  return preparedBasis === measurementBasis ? bit : randomBit(rng);
}
export function seededRandom(seed = 1049) {
  let state = seed >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
}
export function simulateBB84({count = 12, eve = false, noise = 0, rng = Math.random} = {}) {
  if (!Number.isInteger(count) || count < 1 || count > 100000 || noise < 0 || noise > 1) throw new RangeError('Invalid model settings');
  return Array.from({length: count}, (_, i) => {
    const bit = randomBit(rng), basis = randomBit(rng) ? 'X' : 'Z', bobBasis = randomBit(rng) ? 'X' : 'Z';
    const eveBasis = eve ? (randomBit(rng) ? 'X' : 'Z') : null;
    const eveBit = eve ? measureEncoded(bit, basis, eveBasis, rng) : null;
    let bobBit = measureEncoded(eve ? eveBit : bit, eve ? eveBasis : basis, bobBasis, rng);
    if (noise > 0 && rng() < noise) bobBit = 1 - bobBit;
    return {id: i + 1, bit, basis, bobBasis, bobBit, eveBasis, eveBit, keep: basis === bobBasis};
  });
}
export function splitForTesting(rows, rng = Math.random) {
  const kept = rows.filter(r => r.keep), shuffled = kept.slice();
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  const sampleIds = new Set(shuffled.slice(0, Math.ceil(kept.length / 3)).map(r => r.id));
  const sample = kept.filter(r => sampleIds.has(r.id)), remaining = kept.filter(r => !sampleIds.has(r.id));
  const errors = sample.filter(r => r.bit !== r.bobBit).length;
  return {kept, sample, remaining, sampleIds, errors, qber: sample.length ? errors / sample.length : null};
}
export function xorBits(message, key) {
  if (message.length !== key.length || !/^[01]+$/.test(message + key)) throw new Error('Equal-length binary strings required');
  return [...message].map((bit, i) => Number(bit) ^ Number(key[i])).join('');
}
export const stateName = (bit, basis) => basis === 'Z' ? (bit ? '|1⟩ · vertical' : '|0⟩ · horizontal') : (bit ? '|−⟩ · −45°' : '|+⟩ · +45°');
