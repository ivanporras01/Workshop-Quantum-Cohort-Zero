# Workshop Quantum Cohort Zero

A separate, responsive five-day workshop companion aligned to the **Palm Beach State College Cohort Zero agenda**, held **November 9, 10, 12, 13 and 14, 2026** (Eastern Time).

**Scope:** This is a new standalone static educational portal, *not* a change to MathHub, Python Practice or Quantum Computing for Workforce.

## Agenda fidelity

- Sessions, speakers and times are stored in `payload/agenda.json.b64` (decoded to `dist/src/agenda.json` during the build) based on the supplied two-page PBSC document. The downloadable `/resources/PBSC-Cohort-Zero-Agenda.pdf` is a **reformatted workshop agenda summary**, not a byte-for-byte copy of the source PDF.
- November 12: The agenda gives **no start/end time** for `Post Quantum Cryptology Implementation`; this portal does **not** invent one.
- November 13: `Python for Quantum` speaker is **TBA**.
- November 14: `Future Projects` has **no stated presenter or time**.
- Monday's break ends at 6:10 PM and the next item begins 6:15 PM, preserving the five-minute gap.
- All interactive activities are additional companion material, clearly distinguished from official agenda content.

## Learning features

1. Monday: Bloch sphere six reference states, X/H/Z gates, measurement probabilities and a copyable Qiskit starter.
2. Tuesday: polarization angle explorer (Malus's law) and conceptual BB84 basis-matching example.
3. Thursday: PQC vs QKD explainer with implementation migration workflow.
4. Friday: copyable Python exercise connecting amplitudes to probabilities.
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

Cloudflare dashboard → **Workers & Pages** → **Create application** → **Connect GitHub** → select the new repository. Configure:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --config wrangler.jsonc` |
| Root directory | `/` |
| Worker name | `workshop-quantum-cohort-zero` |

The Worker config specifies the `dist` directory as its static asset directory. A successful deployment should provide a URL shaped like `https://workshop-quantum-cohort-zero.<YOUR-WORKERS-SUBDOMAIN>.workers.dev/`. **This is an example URL shape, not a verified live link.** In Cloudflare, open **Deployments** and **Visit** to copy the actual address and verify the agenda and all interactive controls. Confirm the `src/agenda.json` request and the PDF resolve in the published build.

Alternatively, in a terminal authenticated to your Cloudflare account:

```bash
npm install
npm run check
npm run deploy
```

Do not change the existing project's Workers or account routes. A new Worker is published independently.
## Maintain the session lessons

`src/lessons.json` contains the 18 substantive learning guides. Each item is identified by the source agenda date and exact session title. The original agenda is stored separately in `payload/agenda.json.b64`; do not change session times or speaker credits when editing educational explanations. The build copies the lessons into `dist/src/lessons.json`. CI verifies complete coverage, step-by-step content, and the website's Learn tab.
