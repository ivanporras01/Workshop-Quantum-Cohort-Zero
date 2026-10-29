# Workshop Quantum Cohort Zero

A separate, responsive five-day workshop companion aligned to the **Palm Beach State College Cohort Zero agenda**, held **November 9, 10, 12, 13 and 14, 2026** (Eastern Time).

**Scope:** This is a new standalone static educational portal, *not* a change to MathHub, Python Practice or Quantum Computing for Workforce.

## Agenda fidelity

- Sessions, speakers and times are transcribed into `src/agenda.json` from the supplied two-page PBSC document, available to download inside the portal (`/resources/PBSC-Cohort-Zero-Agenda.pdf`).
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

Each day has its exact agenda, an Explore tab, and optional private notes/completion checkmarks saved **only in that browser's local storage**. No user accounts, server, tracking or student-grade collection. The portal works on desktop and mobile and includes light/dark display.

## Test locally

```bash
node --test tests/*.test.mjs
npm run build
python3 -m http.server 8080 --directory dist
```
Open http://localhost:8080 in a browser. No JavaScript framework or build tooling is required beyond Node.js for copying assets.

## Publish to GitHub and Cloudflare Workers

Create a **new** repository named `Workshop-Quantum-Cohort-Zero` under your GitHub account (for example `ivanporras01/Workshop-Quantum-Cohort-Zero`). Upload/push this project's files without changing the other repositories.

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