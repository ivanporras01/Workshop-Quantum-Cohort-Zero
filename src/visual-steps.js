import {STORIES, LESSON_STORIES} from './visual-story-content.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const storyForLesson=lesson=>STORIES[LESSON_STORIES[lesson.date+'|'+lesson.title]];
export function renderStepDiagram(v={}) {
 const caption=v.caption?`<p class="vs-caption">${esc(v.caption)}</p>`:'';
 if(v.type==='flow')return `<div class="vs-flow">${v.nodes.map((n,i)=>`<article class="${v.active===i?'vs-active':''}"><span class="vs-number">${i+1}</span><strong>${esc(n.label)}</strong><p>${esc(n.detail)}</p></article>`).join('')}</div>${caption}`;
 if(v.type==='bars')return `<div class="vs-bars">${v.labels.map((label,i)=>`<div><b>${esc(label)}</b><div class="vs-track"><i style="width:${Math.max(0,Math.min(1,v.values[i]))*100}%"></i></div><strong>${(v.values[i]*100).toFixed(0)}%</strong></div>`).join('')}</div>${caption}`;
 if(v.type==='sphere') {
  const [x,y,z]=v.vector,px=180+100*x-38*y,py=140-100*z+32*y;
  return `<svg class="vs-sphere" viewBox="0 0 360 290" role="img" aria-label="${esc(v.caption||'Bloch state vector')}"><circle cx="180" cy="140" r="100" class="vs-sphere-fill"/><ellipse cx="180" cy="140" rx="100" ry="32" class="vs-line"/><ellipse cx="180" cy="140" rx="40" ry="100" class="vs-line"/><path d="M60 140H300M180 20V260M225 102L132 180" class="vs-axis"/><text x="190" y="20">|0⟩</text><text x="190" y="275">|1⟩</text><text x="302" y="145">+X</text><text x="100" y="198">+Y</text><path d="M180 140L${px} ${py}" class="vs-vector"/><circle cx="${px}" cy="${py}" r="8" class="vs-dot"/><circle cx="180" cy="140" r="3" class="vs-dot"/></svg>${caption}`;
 }
 if(v.type==='circuit')return `<div class="vs-circuit" role="img" aria-label="Circuit from left to right: zero, ${esc(v.gates.join(', '))}"><span>|0⟩</span>${v.gates.map(g=>`<i aria-hidden="true"></i><b>${esc(g)}</b>`).join('')}</div>${caption}`;
 if(v.type==='compare')return `<div class="vs-compare">${[v.left,v.right].map(n=>`<article><h6>${esc(n.title)}</h6>${n.lines.map(l=>`<p>${esc(l)}</p>`).join('')}</article>`).join('')}</div>${caption}`;
 if(v.type==='polar') {
  const r=v.angle*Math.PI/180,dx=60*Math.cos(r),dy=-60*Math.sin(r),intensity=Math.cos(r)**2;
  return `<svg class="vs-polar" viewBox="0 0 520 220" role="img" aria-label="${esc(v.caption)}"><text x="100" y="24" text-anchor="middle">Prepared horizontal</text><circle cx="100" cy="105" r="62" class="vs-sphere-fill"/><path d="M45 105H155" class="vs-vector"/><path d="M180 105H245" class="vs-axis"/><text x="330" y="24" text-anchor="middle">Analyzer: ${v.angle}°</text><circle cx="330" cy="105" r="62" class="vs-sphere-fill"/><path d="M${330-dx} ${105-dy}L${330+dx} ${105+dy}" class="vs-vector"/><text x="260" y="207" text-anchor="middle">Transmission probability / intensity fraction: ${(intensity*100).toFixed(0)}%</text></svg>${caption}`;
 }
 if(v.type==='bits')return `<div class="vs-bits">${v.rows.map(r=>`<div><strong>${esc(r.label)}</strong><span>${r.values.map(b=>`<b>${esc(b)}</b>`).join('')}</span></div>`).join('')}</div>${caption}`;
 return '';
}
export function renderVisualStory(id) {
 const s=STORIES[id];if(!s)return '';
 return `<section class="visual-story" data-visual-story="${id}" aria-label="${esc(s.title)} step-by-step explanation"><header class="vs-heading"><span class="qs-kicker">SEE THE IDEA / ONE STEP AT A TIME</span><h4>${esc(s.title)}</h4><p>${esc(s.summary)}</p></header><nav class="vs-step-nav" aria-label="${esc(s.title)} steps">${s.steps.map((p,i)=>`<button type="button" data-vs-step="${i}" aria-pressed="${i===0}"><b>${i+1}</b><span>${esc(p.title)}</span></button>`).join('')}</nav><div data-vs-stage></div><div class="qs-navigation"><button type="button" data-vs-prev>← Previous</button><span data-vs-position role="status"></span><button type="button" data-vs-next>Next step →</button></div><p class="vs-source">Explore further: <a href="${esc(s.source.url)}" target="_blank" rel="noopener">${esc(s.source.label)}</a></p></section>`;
}
export function wireVisualStories(root) {
 root.querySelectorAll('[data-visual-story]').forEach(el=>{
  if(el.dataset.vsWired)return;el.dataset.vsWired='true';const s=STORIES[el.dataset.visualStory];let step=0;
  const paint=()=>{const p=s.steps[step];el.querySelector('[data-vs-stage]').innerHTML=`<div class="vs-stage"><div class="vs-copy"><span class="qs-kicker">STEP ${step+1} / ${s.steps.length}</span><h5>${esc(p.title)}</h5><p>${esc(p.explanation)}</p></div><figure class="vs-diagram">${renderStepDiagram(p.visual)}</figure><p class="vs-notice"><b>Notice:</b> ${esc(p.notice)}</p></div>`;el.querySelectorAll('[data-vs-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===step)));el.querySelector('[data-vs-position]').textContent=`Step ${step+1} of ${s.steps.length}`;el.querySelector('[data-vs-prev]').disabled=step===0;const n=el.querySelector('[data-vs-next]');n.disabled=step===s.steps.length-1;n.textContent=n.disabled?'Ready to experiment ✓':'Next step →';};
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-vs-step'))step=+b.dataset.vsStep;else if(b.hasAttribute('data-vs-prev'))step=Math.max(0,step-1);else if(b.hasAttribute('data-vs-next'))step=Math.min(s.steps.length-1,step+1);else return;paint();});paint();
 });
}
