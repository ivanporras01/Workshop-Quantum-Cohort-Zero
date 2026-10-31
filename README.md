# Workshop Quantum Cohort Zero

A separate, responsive five-day workshop companion aligned to the **Palm Beach State College Cohort Zero agenda**, held **November 9, 10, 12, 13 and 14, 2026** (Eastern Time).

**Scope:** This standalone workshop portal is maintained separately from MathHub, Python Practice and Quantum Computing for Workforce.

## Agenda fidelity

- Sessions, speakers and times are stored in `payload/agenda.json.b64` (decoded to `dist/src/agenda.json` during the build) based on the supplied two-page PBSC document. The downloadable `/resources/PBSC-Cohort-Zero-Agenda.pdf` is the approved, professionally designed two-page agenda, retained in `payload/agenda.pdf.b64` and copied unchanged during each build.
- November 12: The agenda gives **no start/end time** for `Post Quantum Cryptology Implementation`; this portal does **not** invent one.
- November 13: `Python for Quantum` speaker is **TBA**.
- November 14: `Future Projects` has **no stated presenter or time**.
- Monday's break ends at 6:10 PM and the next item begins 6:15 PM, preserving the five-minute gap.
- All interactive activities are additional companion material, clearly distinguished from official agenda content.

## Learning features

1. Monday: Bloch sphere six reference states, θ/φ controls, X/Y/Z measurement bases, H/X/Y/Z/S/T gates, superposition, interference and a Qiskit starter.
2. Tuesday: polarization angle explorer (Malus's law), BB84, and supplementary entanglement, teleportation and no-cloning lessons.
3. Thursday: PQC vs QKD explainer with implementation migration workflow.
4. Friday: Python exercises connecting amplitudes to probabilities, Bell-pair sampling, teleportation circuit logic and a dephasing model.
5. Saturday: interactive *classical* two-signal interference oscilloscope simulator, including phase controls. It is not quantum hardware.

Each day has its exact **Agenda**, **Learn**, **Explore**, and **My Notes** tabs. The Learn tab contains 18 session-matched lessons across the five dates: substantive explanations, guided worked examples, common mistakes, vocabulary, independent practice with revealed reasoning, and relevant official external resources. Click **Study this topic** beside an agenda item to jump to its full lesson. These lessons are supplemental preparation, **not official presenter transcripts**. Notes/completion checkmarks are saved **only in that browser's local storage**. No user accounts, server, tracking or student-grade collection. The portal works on desktop and mobile and includes light/dark display.

## Test locally

```bash
node --test tests/*.test.mjs
npm run build
python3 -m http.server 8080 --directory dist
```
Open http://localhost:8080 in a browser. No JavaScript framework is needed; the build copies static assets and generates the printable agenda summary.

## Published portal

https://workshop-quantum-cohort-zero.hectorporras0916.workers.dev/

By Dr. Luis Pentzke and Professor Hector Porras. All 18 teaching sessions include beginner explanations, a visual activity, a guided example, independent practice and a takeaway.

## Deployment configuration

Source repository: `ivanporras01/Workshop-Quantum-Cohort-Zero`. Maintain the existing repository and Worker when applying updates.

The existing Cloudflare Worker is already connected to this repository. Push verified updates to `main`; Cloudflare builds and deploys them automatically. Keep these settings on the existing Worker:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --config wrangler.jsonc` |
| Root directory | `/` |
| Worker name | `workshop-quantum-cohort-zero` |

The Worker serves the generated `dist` directory at the existing public URL above. The published 1.1.0 update passed the build, all 27 automated tests, byte-for-byte production asset checks, and browser checks on desktop and mobile on October 30, 2026. After future changes, wait for the Cloudflare build, `verify`, `live-production-check`, and `live-browser-check` jobs to succeed before confirming completion.

Alternatively, in a terminal authenticated to your Cloudflare account:

```bash
npm install
npm run check
npm run deploy
```

Maintain the existing Worker, repository connection, public URL and account routes. Do not create another Worker or portal for routine updates.
## Maintain the session lessons

`src/lessons.json` contains the 18 substantive learning guides. Each item is identified by the source agenda date and exact session title. The original agenda is stored separately in `payload/agenda.json.b64`; do not change session times or speaker credits when editing educational explanations. The build copies the lessons into `dist/src/lessons.json`. CI verifies complete coverage, step-by-step content, and the website's Learn tab.



## Visual concept update · 1.1.0

The homepage now provides eight accessible interactive lessons: superposition and measurement, entanglement, teleportation, phase and interference, quantum gates, no-cloning, dephasing, and QKD versus PQC. Each includes an explanation, an adjustable ideal model, a guided experiment, a conceptual checkpoint and a primary reference.

Five daily learning plans map objectives, practice and evidence to the unchanged official sessions on November 9, 10, 12, 13 and 14. Entanglement and teleportation are explicitly marked as companion enrichment for the communication and Python days, not additional scheduled presenter sessions.

The quantum math tests cover state normalization, basis dependence, Bell versus mixture correlations, no-signaling marginals, all four teleportation branches for complex inputs, no-cloning, dephasing and sampling. Production checks compare the new source assets byte for byte; browser checks exercise the controls and all five daily plans on a mobile viewport.

All models are instructional software. No QPU is connected. The oscilloscope/resistor activity remains a classical analogy, not a physical quantum experiment.

## Completion update · 1.1.1

Replaced the generated plain-text PDF with the approved dark navy and teal two-page agenda. Added arrow/Home/End keyboard navigation and one tab stop for the active content tab, visible focus, reduced-motion support, and a complete five-day notebook download. Official unconfirmed times/presenters remain explicitly unconfirmed. Live verification now checks the exact PDF bytes.

## Visual learning update · 1.2.0

The homepage now has an active Bloch sphere using the same tested gate and measurement math as the full laboratory. A three-action beginner path introduces preparation, H and measurement. Expand controls for six reference states, all seven existing gate/reset actions, X/Y/Z measurements, angle preparation, fresh-preparation sampling and a separate camera rotation. Measurement collapses the displayed state; camera rotation preserves the state. Eight lightweight vector scenes now illustrate the concept cards. Existing agenda, lesson order, PDF and workshop branding are retained.

## Consistent sphere and bit comparison · 1.3.0

Homepage, bit/qubit comparison and full laboratory now use the same six-reference-state SVG renderer with unique gradient/filter IDs per instance. The classical card includes an interactive switch, memory cell and logic-level trace. The quantum card includes preparation, H/Z operations, Z/X probabilities and actual simulated state collapse. The guided phase experiment distinguishes superposition from a classical 50/50 mixture. Browser checks cover both cards and shared sphere labels.
