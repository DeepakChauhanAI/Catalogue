# Catalogue Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task in this session (subagent-driven development is NOT to be used — the user has forbidden subagent launches). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the demo hub as a two-pane presenter console with client-safe credential handling and product data verified against the four real repos.

**Architecture:** Hash-routed two-pane shell (Sidebar + DetailPane/OverviewPane, no modals except the AuthModal mode gate). Credential safety by construction: `redactDeployments()` strips passwords at the data boundary before rendering; copy-to-clipboard uses the unredacted closure. Filtering reads a real `tags` field. 4 products (DermaDesk, OPD Intelligence, Central CC Scanner, Panacea PQC); DermaDX and PCI Manager are removed (no repos exist).

**Tech Stack:** React 19, Vite 8, lucide-react. No new dependencies. Plain-ESM data files so `node src/data/filters.js` runs the self-check with zero tooling.

**Spec:** `docs/superpowers/specs/2026-09-15-catalogue-overhaul-design.md`

---

### Task 1: Version-control baseline

The project is not a git repo and this plan deletes many files. Establish safety first.

**Files:** none (repo init only)

- [ ] **Step 1: Initialize git and commit baseline**

```bash
cd "D:/Project Files/Catalogue"
git init
git add -A
git commit -m "chore: baseline before catalogue overhaul"
```

Expected: initial commit succeeds. If `node_modules` is huge, first create `.gitignore` containing `node_modules/` and `dist/` before `git add`.

---

### Task 2: `filters.js` — self-check first (red)

Pure functions + self-check in one plain-ESM file so node runs it directly. The self-check imports `catalogData.js`, which still has the old shape (no `tags`, six products) — so the check must fail before the data rewrite. That failure is the test.

**Files:**
- Create: `src/data/filters.js`

- [ ] **Step 1: Write `src/data/filters.js` with checks and implementations, checks will fail against old data**

```js
import { CATALOG_DATA } from './catalogData.js';

export function filterProducts(products, { domain = 'all', tag = 'All', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return products.filter(p => {
    if (domain !== 'all' && p.domain !== domain) return false;
    if (tag !== 'All' && !p.tags.includes(tag)) return false;
    if (q && !(p.name + ' ' + p.tagline + ' ' + p.arch).toLowerCase().includes(q)) return false;
    return true;
  });
}

export function allTags(products) {
  return ['All', ...new Set(products.flatMap(p => p.tags))];
}

// ponytail: redaction is one shared boundary; per-component guards if products grow custom views
export function redactDeployments(deployments, mode) {
  if (mode === 'presenter') return deployments;
  return deployments.map(({ pass, ...rest }) => rest);
}

export function demo() {
  const products = Object.values(CATALOG_DATA);
  const failures = [];

  // 1. Every tag chip matches at least one product
  for (const tag of allTags(products)) {
    if (tag === 'All') continue;
    if (filterProducts(products, { tag }).length === 0) {
      failures.push(`tag "${tag}" matches zero products`);
    }
  }

  // 2. Domain filters return products when tag = All
  for (const domain of ['all', 'healthcare', 'infosec']) {
    if (filterProducts(products, { domain }).length === 0) {
      failures.push(`domain "${domain}" returns zero products`);
    }
  }

  // 3. Shared mode never carries a pass field
  for (const p of products) {
    const redacted = redactDeployments(p.deployments, 'shared');
    if (redacted.some(d => 'pass' in d)) {
      failures.push(`${p.id}: shared-mode deployment still has a pass field`);
    }
  }

  // 4. Every deployment has a name and env label
  for (const p of products) {
    for (const d of p.deployments) {
      if (!d.name || !d.env) failures.push(`${p.id}: deployment missing name/env`);
    }
  }

  if (failures.length) {
    console.error('FAIL\n  ' + failures.join('\n  '));
    process.exitCode = 1;
  } else {
    console.log(`PASS — ${products.length} products, ${allTags(products).length - 1} tags, all checks green`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/')) demo();
```

- [ ] **Step 2: Run it, verify it fails**

```bash
cd "D:/Project Files/Catalogue" && node src/data/filters.js
```

Expected: `FAIL` with errors like `tag ... matches zero products` (old data has no `tags` field, so `p.tags.includes` throws or every tag matches zero). Any failure output = correct red state.

- [ ] **Step 3: Commit**

```bash
git add src/data/filters.js && git commit -m "feat: filter + redaction module with self-check (red)"
```

---

### Task 3: Rewrite `catalogData.js` from verified facts

**Files:**
- Modify: `src/data/catalogData.js` (full replacement)

Every fact below was verified in the repos on 2026-09-15 (see spec §"Verified Product Data"). Unverifiable claims are deleted, not carried forward.

- [ ] **Step 1: Replace the entire file**

```js
// Product facts verified against source repos on 2026-09-15.
// DermaDesk:   D:\Project Files\DermaDesk
// OPD-2.0:     D:\Project Files\OpdIQ_Workspace\OPD-2.0
// CC Scanner:  CC_Number_Detection_Tool-main\deepak-scanner-update_new
// PQC Scanner: D:\Project Files\PQC New
// Anything not verifiable in those repos is not in this file.

export const CATALOG_DATA = {
  dermadesk: {
    id: 'dermadesk',
    domain: 'healthcare',
    name: 'DermaDesk AI',
    version: 'Next.js 16 + NestJS 11',
    badge: 'Doctor-First Clinical',
    tagline: 'Doctor-first dermatology intake, QR photo capture, and AI differentials with physician sign-off',
    summary: 'A PWA clinical workspace for dermatology: a 6-section, 46-question intake with conditional branching, zero-login QR mobile photo capture synced over Socket.IO, and an LLM multimodal differential that a physician verifies, scores, and locks. Roles separate front-desk intake from doctor review.',
    targetClient: 'Dermatology departments, clinic directors, teledermatology networks',
    arch: 'Next.js 16 (App Router, React 19, TypeScript), NestJS 11 API, Socket.IO, MongoDB with in-memory fallback, external AI inference service with OpenAI/Gemini fallback',
    storage: 'MongoDB (in-memory repository fallback)',
    protocols: 'REST, Socket.IO realtime sync, QR-token mobile upload',
    tags: ['AI', 'Clinical Workflow', 'Realtime'],
    talkTrack: 'Open the zero-setup psoriasis demo case, walk the 6 intake sections, then trigger the QR upload — scan it with your own phone and watch the photo land in the desktop workspace live. Close on the physician verdict loop: the AI proposes, the doctor disposes.',
    deployments: [
      { name: 'Instant Demo — Psoriasis Case', env: 'Web :3000 (no login)', url: 'http://localhost:3000/workspace?demo=psoriasis', status: 'Zero-setup seeded case', color: 'emerald' },
      { name: 'Clinic Workspace', env: 'Web :3000', url: 'http://localhost:3000/login', status: 'Register a clinic via /signup', color: 'cyan' },
      { name: 'NestJS Backend API', env: 'API :4001', url: 'http://localhost:4001', status: 'Express + Socket.IO gateway', color: 'purple' },
      { name: 'QR Mobile Upload', env: 'Phone camera', url: 'http://192.168.1.11:3000/quick-upload', status: 'Token generated per question at runtime', color: 'amber' }
    ],
    features: [
      { name: '6-Section Clinical Intake', status: 'Live', note: '46 questions (27 base + 19 conditional) with dynamic branching across demographics, morphology, symptoms, timeline, prior treatment, and impact' },
      { name: 'Zero-Login QR Mobile Capture', status: 'Live', note: 'Desktop renders a QR token; a phone opens the native camera and photos sync into the image question over Socket.IO' },
      { name: 'Multimodal AI Differential', status: 'Live', note: 'External vision inference with OpenAI/Gemini LLM fallback; ranks the top-3 differential with clinical rationale' },
      { name: 'Physician Verdict Loop', status: 'Live', note: 'Correct/Partial/Incorrect tagging, doctor confidence, final diagnosis, and visit locking for record integrity' },
      { name: 'Role Separation', status: 'Live', note: 'Front-desk runs intake; doctors review AI differentials and sign off' },
      { name: 'Zero-Setup Demo Mode', status: 'Live', note: 'Seeded psoriasis case at /workspace?demo=psoriasis for instant demonstrations' }
    ],
    roadmap: null
  },

  opd: {
    id: 'opd',
    domain: 'healthcare',
    name: 'OPD Intelligence',
    version: 'FastAPI + React 19',
    badge: 'Queue & Intake Platform',
    tagline: 'Hospital outpatient queue, kiosk intake, voice assistant, and doctor console as one system',
    summary: 'An outpatient platform unifying a self-service touch kiosk, a Gemini Live conversational voice intake assistant (Dhara), a doctor console with an EMR prescription writer, and public waiting-room TV displays — all fed by one deadlock-free token engine on SQLite WAL.',
    targetClient: 'Hospital COOs, medical superintendents, clinic chains',
    arch: 'React 19 + TypeScript + Vite + Tailwind v4 + Zustand frontend; FastAPI (Python) + SQLite WAL backend; Google Gemini Live bidirectional audio; JWT with role guards',
    storage: 'SQLite (WAL mode, busy-timeout serialization, auto column migrations)',
    protocols: 'REST, WebSocket voice streaming (/ws/voice), Web Speech announcements',
    tags: ['AI', 'Clinical Workflow', 'Queue Ops'],
    talkTrack: 'Register a patient at the kiosk, watch the token appear on the doctor rail, call the patient and hear the bilingual TV chime. Then hand the mic to Dhara — the Gemini voice intake extracts a 7-point clinical checklist while you watch. Land on the prescription writer with voice dictation.',
    deployments: [
      { name: 'Web App — Doctor Console', env: 'Vite :5173', url: 'http://localhost:5173', status: 'Login: dr.rao / doctor123', color: 'emerald', user: 'dr.rao', pass: 'doctor123' },
      { name: 'Kiosk & Voice Intake', env: 'Vite :5173', url: 'http://localhost:5173', status: 'Login: kiosk / kiosk123 (voice: dhara / dhara123)', color: 'cyan', user: 'kiosk | dhara', pass: 'kiosk123 | dhara123' },
      { name: 'FastAPI Interactive Docs', env: 'API :8000', url: 'http://localhost:8000/docs', status: 'Swagger, no login', color: 'purple' },
      { name: 'Waiting-Room TV Display', env: 'Public route', url: 'http://localhost:5173/waiting-room', status: 'No login — for lobby screens', color: 'amber' }
    ],
    features: [
      { name: 'Doctor Console & EMR Prescriptions', status: 'Live', note: 'Call/skip/no-show queue, intake review, patient history, medication autocomplete, printable branded Rx' },
      { name: 'Voice Dictation for Charts', status: 'Live', note: 'Hands-free prescription entry via /api/dictation/transcribe' },
      { name: 'Self-Service Touch Kiosk', status: 'Live', note: 'Numpad phone lookup, family disambiguation, returning-patient recap, dynamic symptom trees, bilingual TTS' },
      { name: 'Dhara Voice Intake Assistant', status: 'Live', note: 'Gemini Live full-duplex audio (Hindi/English), 7-point clinical checklist, emergency red-flag alerts, dual summaries' },
      { name: 'Waiting-Room TV Display', status: 'Live', note: 'Currently-serving hero card, upcoming rail, bilingual spoken chime on every token call' },
      { name: 'Deadlock-Free Token Engine', status: 'Live', note: 'Shared issue_token() pipeline over SQLite WAL with collision-safe sequential tokens across kiosk and voice channels' }
    ],
    roadmap: [
      { title: 'Row-level authorization', priority: 'High', note: 'Per-doctor scoping of queue and patient data (hardening plan §1.4)' },
      { title: 'Prescription immutability', priority: 'High', note: 'Server-issued Rx numbers and append-only visit writes (plan §4.2–4.3)' },
      { title: 'Consent gate + idle timeout', priority: 'Medium', note: 'Kiosk consent capture and session expiry (plan §3.5)' }
    ]
  },

  cc_scanner: {
    id: 'cc_scanner',
    domain: 'infosec',
    name: 'Central CC Scanner',
    version: 'Presidio + spaCy',
    badge: 'Agentless PAN Discovery',
    tagline: 'Agentless cardholder-data discovery and masking — the in-house ControlCase CDD replacement',
    summary: 'Scans files across Windows (SMB) and Linux (SSH/SFTP) fleets from one central host without installing anything on targets. Streams files, detects PANs with Presidio + spaCy NER context scoring after Luhn/BIN validation, masks at the point of detection, and produces QSA-defensible reports with a tamper-evident audit trail.',
    targetClient: 'CISOs, PCI QSAs, compliance and infrastructure security teams',
    arch: 'Python; FastAPI + Jinja2 web console; streaming SMB/SFTP/local readers; Presidio + spaCy NER detection; 183 regression tests',
    storage: 'SQLite checkpoint/membership index; runtime state under data/ — no cardholder data ever written to scanner disk',
    protocols: 'SMB, SSH/SFTP, HTTP console',
    tags: ['Security', 'PCI DSS', 'Discovery'],
    talkTrack: 'Lead with agentless: nothing is installed or executed on scanned machines, files are streamed and discarded, and every PAN is masked the moment it is detected — the scanner disk never holds cardholder data. Then the QSA evidence pack: tamper-evident audit trail, masked findings, coverage-gap registry.',
    deployments: [
      { name: 'Scanner Console', env: 'FastAPI :5050', url: 'http://127.0.0.1:5050', status: 'No built-in login — trusted network only', color: 'emerald' }
    ],
    features: [
      { name: 'Agentless Read-Only Scanning', status: 'Live', note: 'Streams files over SMB/SFTP from thousands of systems; nothing installed, copied, or executed on targets' },
      { name: 'NLP-Grade PAN Detection', status: 'Live', note: 'Byte prefilter → ~30-format extraction → Luhn + BIN → Presidio CREDIT_CARD → spaCy context scoring' },
      { name: 'Mask at Point of Detection', status: 'Live', note: 'PAN/CVV/expiry/track-data masking before anything leaves the detector' },
      { name: 'Suppression Engine', status: 'Live', note: 'Test cards, tokenised BINs, and custom rules filtered from findings' },
      { name: 'Resumable Scans', status: 'Live', note: 'SQLite checkpoint state; interrupted scans resume without re-reading' },
      { name: 'Tamper-Evident Audit Trail', status: 'Live', note: 'PCI-DSS Req-10 operational log with stable host identity (re-IP safe)' }
    ],
    roadmap: [
      { title: 'Remote prefiltering', priority: 'High', note: 'Cut transferred bytes by prefiltering on the source system (parity plan A1)' },
      { title: 'Split-pipeline execution modes', priority: 'Medium', note: 'Central vs distributed scan execution (parity plan 1.1–1.2)' },
      { title: 'spaCy pipeline optimization', priority: 'Medium', note: 'Single shared NER model and batched inference for throughput (plan A3)' }
    ]
  },

  pqc_scanner: {
    id: 'pqc_scanner',
    domain: 'infosec',
    name: 'Panacea PQC Scanner',
    version: 'v1.0.0a0',
    badge: 'Post-Quantum CBOM',
    tagline: 'AWS cryptographic discovery, NIST taxonomy classification, and Mosca risk scoring with CycloneDX CBOM export',
    summary: 'Discovers cryptographic assets across AWS with 35 read-only collectors over 42 service APIs, classifies each against a 10-class NIST PQC taxonomy, scores quantum-adjusted risk with a 6-factor Mosca engine, maps key-to-resource dependencies, and exports a schema-validated CycloneDX 1.7 CBOM. Coverage gaps are reported loudly — denied permissions are named, never silently dropped.',
    targetClient: 'CISOs, infrastructure security leads, compliance directors facing NIST PQC migration mandates',
    arch: 'Python 3.11+; panacea CLI (Click) + FastAPI + HTMX + Jinja2 dashboard; SQLModel over SQLite/PostgreSQL with Alembic; boto3',
    storage: 'SQLModel — SQLite or PostgreSQL (dual dialect)',
    protocols: 'AWS SDK read-only metadata collection; HTTPS dashboard',
    tags: ['Security', 'Post-Quantum', 'Discovery'],
    talkTrack: 'Frame Harvest-Now-Decrypt-Later, then run a scan: watch collectors fan out, the taxonomy bin every key, and the Mosca engine score the estate. The differentiator to land: honest coverage — when a permission is denied, the report says so and names the IAM action, instead of under-reporting silently like the commercial tools.',
    deployments: [
      { name: 'Web Dashboard', env: 'FastAPI :8000', url: 'http://localhost:8000', status: 'Unauthenticated by default — binds 127.0.0.1', color: 'emerald' },
      { name: 'panacea CLI', env: 'Terminal', url: '', status: 'Headless runs for CI/CD and scheduled scans', color: 'purple' }
    ],
    features: [
      { name: '35 AWS Collectors / 42 APIs', status: 'Live', note: 'Read-only, metadata-only: KMS, ACM, ELB, CloudFront, S3, RDS, Secrets Manager, Route 53 DNSSEC, Signer, and more' },
      { name: '10-Class NIST PQC Taxonomy', status: 'Live', note: 'Derived from NIST IR 8105 / SP 800-57 Rev. 5; unknowns become needs-review, never guesses' },
      { name: 'Mosca 6-Factor Risk Scoring', status: 'Live', note: 'Quantum-adjusted risk per asset with configurable CRQC horizon (PQC_QUANTUM_HORIZON_YEAR)' },
      { name: 'Dependency Graph', status: 'Live', note: 'Six edge types linking keys and certs to the resources they protect, including absence-of-encryption findings' },
      { name: 'CycloneDX 1.7 CBOM Export', status: 'Live', note: 'Schema-validated in CI; algorithms as first-class referenced components' },
      { name: 'Honest Coverage Reporting', status: 'Live', note: 'Denied permissions, throttling, and unavailable services surface as named coverage gaps; incomplete scopes never reconcile' }
    ],
    roadmap: [
      { title: 'Global-scope validation', priority: 'High', note: 'L1: region=global stamping and CloudFront min-TLS classification, blocked on admin write access' },
      { title: 'Trigger-based coverage backlog', priority: 'Medium', note: 'Coverage plan items 5.10–5.16, scheduled on demand rather than by date' }
    ]
  }
};

export const DOMAIN_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'healthcare', label: 'HealthCare' },
  { id: 'infosec', label: 'InfoSec' }
];
```

Note: deployment rows without `user`/`pass` (or with empty `url`, like the CLI row) mean "nothing to copy / nothing to open" — the UI in Task 7 handles both by hiding the respective button.

- [ ] **Step 2: Run the self-check, verify it passes**

```bash
node src/data/filters.js
```

Expected: `PASS — 4 products, 8 tags, all checks green`

- [ ] **Step 3: Commit**

```bash
git add src/data/catalogData.js && git commit -m "feat: catalog data rewritten from verified repo facts (4 products)"
```

---

### Task 4: `index.css` — tokens kept, utilities added, blur-mask deleted

**Files:**
- Modify: `src/index.css` (full replacement)
- Delete: `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `original_index.html`

- [ ] **Step 1: Replace `src/index.css`**

Keep the existing `:root` token block and both `[data-theme]` blocks verbatim (lines 1–104 of the current file). Delete `.blur-mask` and everything under "UTILITY CLASSES" downward; replace with this complete tail:

```css
/* ================= BASE ================= */
* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  font-family: var(--font-body);
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { font-family: var(--font-heading); letter-spacing: -0.02em; color: var(--text-primary); }
code, pre, .font-mono { font-family: var(--font-mono); }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; border: none; background: none; cursor: pointer; color: inherit; }

:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }

/* Type scale: 6 sizes, 0.8rem floor (projector legibility) */
.t-xs { font-size: 0.8rem; }
.t-sm { font-size: 0.875rem; }
.t-md { font-size: 1rem; }
.t-lg { font-size: 1.25rem; }
.t-xl { font-size: 1.5rem; }
.t-hero { font-size: 2rem; }
.t-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--text-muted); }

/* ================= SHELL ================= */
.shell { display: flex; min-height: 100vh; }

.rail {
  width: 300px; flex-shrink: 0; position: sticky; top: 0; height: 100vh;
  display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem 1rem;
  background: var(--bg-surface); border-right: 1px solid var(--border-subtle);
  overflow-y: auto;
}

.pane { flex: 1; min-width: 0; padding: 2rem; max-width: 900px; }

@media (max-width: 900px) {
  .shell { flex-direction: column; }
  .rail { width: 100%; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--border-subtle); }
  .pane { padding: 1.25rem; }
}

/* ================= RAIL ================= */
.rail-brand { display: flex; align-items: center; gap: 0.75rem; }

.rail-section { display: flex; flex-direction: column; gap: 0.4rem; }

.rail-item {
  display: flex; align-items: center; gap: 0.6rem; width: 100%;
  padding: 0.55rem 0.7rem; border-radius: var(--radius-sm);
  color: var(--text-secondary); text-align: left; font-size: 0.875rem; font-weight: 600;
  border: 1px solid transparent; transition: all var(--transition-fast);
}
.rail-item:hover { background: var(--bg-surface-hover); color: var(--text-primary); }
.rail-item.active { background: var(--bg-surface-card); border-color: var(--border-medium); color: var(--text-primary); box-shadow: var(--shadow-sm); }

.rail-key {
  font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-faint);
  border: 1px solid var(--border-subtle); border-radius: var(--radius-xs);
  padding: 0 0.35rem; flex-shrink: 0;
}

.kbd-legend { font-size: 0.8rem; color: var(--text-faint); display: flex; flex-direction: column; gap: 0.3rem; }
.kbd-legend kbd {
  font-family: var(--font-mono); font-size: 0.8rem; background: var(--bg-subtle);
  border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 0 0.35rem;
}

/* ================= CONTROLS ================= */
.search-input {
  width: 100%; padding: 0.55rem 0.75rem; border-radius: var(--radius-sm);
  border: 1px solid var(--border-medium); background: var(--bg-input);
  color: var(--text-primary); font-size: 0.875rem; outline: none;
  transition: border-color var(--transition-fast);
}
.search-input:focus { border-color: var(--color-brand); }

.chip {
  padding: 0.3rem 0.65rem; border-radius: var(--radius-xs); font-size: 0.8rem; font-weight: 600;
  background: var(--bg-subtle); color: var(--text-secondary);
  border: 1px solid var(--border-subtle); transition: all var(--transition-fast);
}
.chip:hover { border-color: var(--border-strong); color: var(--text-primary); }
.chip.active { background: var(--text-primary); color: var(--bg-canvas); border-color: var(--text-primary); }

/* ================= CARDS & PANES ================= */
.card {
  background: var(--bg-surface-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); padding: 1.5rem;
}

.detail-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

.launch-row {
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  padding: 0.85rem 1rem; border-radius: var(--radius-sm);
  background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle);
  flex-wrap: wrap;
}

.launch-row .actions { display: flex; gap: 0.4rem; }

.tab-btn {
  padding: 0.6rem 0; font-size: 0.875rem; font-weight: 600; white-space: nowrap;
  color: var(--text-muted); border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}
.tab-btn:hover { color: var(--text-primary); }
.tab-btn.active { color: var(--color-brand); border-bottom-color: var(--color-brand); }

.tab-bar { display: flex; gap: 1.25rem; border-bottom: 1px solid var(--border-subtle); overflow-x: auto; margin-bottom: 1.25rem; }

.spec-row { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border-subtle); }
.spec-row:last-child { border-bottom: none; }

/* ================= BADGES / DOTS (kept for simulators) ================= */
.badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; line-height: 1; }
.badge-health { background: var(--color-health-soft); color: var(--color-health); border: 1px solid var(--color-health-border); }
.badge-sec { background: var(--color-sec-soft); color: var(--color-sec); border: 1px solid var(--color-sec-border); }
.badge-brand { background: var(--color-brand-soft); color: var(--color-brand); border: 1px solid var(--color-brand-glow); }
.badge-neutral { background: var(--bg-subtle); color: var(--text-secondary); border: 1px solid var(--border-subtle); }

.status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.status-dot.online { background-color: var(--color-health); box-shadow: 0 0 8px var(--color-health); animation: pulse-dot 2s infinite ease-in-out; }
.status-dot.standby { background-color: var(--color-brand); box-shadow: 0 0 8px var(--color-brand); }
.status-dot.warning { background-color: var(--color-amber); box-shadow: 0 0 8px var(--color-amber); }
.status-dot.purple { background-color: var(--color-sec); box-shadow: 0 0 8px var(--color-sec); }

@keyframes pulse-dot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.75; } }

/* ================= BUTTONS ================= */
.btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.55rem 1rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 600; background: linear-gradient(135deg, #0284c7, #4f46e5); color: #fff; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); transition: all var(--transition-fast); }
.btn-primary:hover { background: linear-gradient(135deg, #0369a1, #4338ca); transform: translateY(-1px); }

.btn-health { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 600; background: linear-gradient(135deg, #059669, #0d9488); color: #fff; transition: all var(--transition-fast); }
.btn-health:hover { background: linear-gradient(135deg, #047857, #0f766e); }

.btn-sec { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 600; background: linear-gradient(135deg, #7c3aed, #6366f1); color: #fff; transition: all var(--transition-fast); }
.btn-sec:hover { background: linear-gradient(135deg, #6d28d9, #4f46e5); }

.btn-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; padding: 0.55rem 0.9rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 600; background: var(--bg-subtle); color: var(--text-primary); border: 1px solid var(--border-medium); transition: all var(--transition-fast); }
.btn-secondary:hover { background: var(--bg-surface-hover); border-color: var(--border-strong); }

.btn-ghost { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); transition: all var(--transition-fast); }
.btn-ghost:hover { background: var(--bg-surface-hover); color: var(--text-primary); }

/* ================= ANIMATIONS ================= */
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* Used by CCScannerSimulator but was never defined — spin now actually spins */
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
```

- [ ] **Step 2: Delete dead files**

```bash
rm src/App.css src/assets/hero.png src/assets/react.svg src/assets/vite.svg original_index.html
rmdir src/assets 2>/dev/null; true
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: css tokens + utilities, 0.8rem type floor, focus-visible; delete dead assets"
```

---

### Task 5: `App.jsx` shell — routing, mode, theme, keyboard

**Files:**
- Modify: `src/App.jsx` (full replacement)

- [ ] **Step 1: Replace `src/App.jsx`**

```jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import OverviewPane from './components/OverviewPane';
import DetailPane from './components/DetailPane';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { CATALOG_DATA } from './data/catalogData';
import { filterProducts } from './data/filters';

const PRODUCTS = Object.values(CATALOG_DATA);
const idFromHash = () => decodeURIComponent(window.location.hash.slice(2)) || null;

export default function App() {
  const [domain, setDomain] = useState('all');
  const [tag, setTag] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(idFromHash);
  const [mode, setMode] = useState(() => localStorage.getItem('catalogue-mode') || 'shared');
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('catalogue-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState('');
  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2800);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('catalogue-theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem('catalogue-mode', mode); }, [mode]);

  useEffect(() => {
    const onHash = () => setSelectedId(idFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === 'Escape') {
        if (authOpen) { setAuthOpen(false); return; }
        if (document.activeElement === searchRef.current) { searchRef.current.blur(); return; }
        if (selectedId) window.location.hash = '#/';
        return;
      }
      if (/^[1-9]$/.test(e.key) && !/input|textarea|select/i.test(e.target.tagName)) {
        const p = PRODUCTS[Number(e.key) - 1];
        if (p) window.location.hash = `#/${p.id}`;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [authOpen, selectedId]);

  const filtered = useMemo(
    () => filterProducts(PRODUCTS, { domain, tag, query }),
    [domain, tag, query]);

  const selected = selectedId ? CATALOG_DATA[selectedId] : null;

  const lock = () => { setMode('shared'); showToast('Shared mode — credentials hidden'); };
  const unlock = () => setAuthOpen(true);

  return (
    <div className="shell">
      <Sidebar
        products={PRODUCTS}
        filtered={filtered}
        selectedId={selectedId}
        domain={domain} setDomain={setDomain}
        tag={tag} setTag={setTag}
        query={query} setQuery={setQuery}
        searchRef={searchRef}
        mode={mode} onLock={lock} onUnlock={unlock}
        theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />
      {selected ? (
        <DetailPane product={selected} mode={mode} onUnlock={unlock} showToast={showToast} />
      ) : (
        <OverviewPane
          products={PRODUCTS}
          filtered={filtered}
          filteredBy={domain !== 'all' || tag !== 'All' || query.trim()}
          onReset={() => { setDomain('all'); setTag('All'); setQuery(''); }}
        />
      )}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={() => { setMode('presenter'); setAuthOpen(false); showToast('Presenter mode — credentials visible'); }}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}
```

- [ ] **Step 2: Commit (build will fail until Tasks 6–8 exist — commit anyway, this is the shell checkpoint)**

```bash
git add src/App.jsx && git commit -m "feat: app shell — hash routing, mode, theme, keyboard"
```

---

### Task 6: `Sidebar.jsx`

**Files:**
- Create: `src/components/Sidebar.jsx`

- [ ] **Step 1: Write the component**

```jsx
import React from 'react';
import { Boxes, Search, ShieldCheck, Eye, Sun, Moon, Lock, Unlock } from 'lucide-react';
import { DOMAIN_FILTERS, CATALOG_DATA } from '../data/catalogData';
import { allTags } from '../data/filters';

const DOMAIN_COLORS = { healthcare: 'var(--color-health)', infosec: 'var(--color-sec)' };

export default function Sidebar({
  products, filtered, selectedId,
  domain, setDomain, tag, setTag,
  query, setQuery, searchRef,
  mode, onLock, onUnlock,
  theme, onToggleTheme
}) {
  const isShared = mode === 'shared';
  const tags = allTags(products);
  const byDomain = (d) => products.filter(p => p.domain === d);
  const isDimmed = (id) => !filtered.some(p => p.id === id);

  return (
    <aside className="rail" aria-label="Product navigation">
      <div className="rail-brand">
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
          background: 'linear-gradient(135deg, #0284c7, #4f46e5)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Boxes size={20} />
        </div>
        <div>
          <div className="t-sm" style={{ fontWeight: 800 }}>Demo Hub</div>
          <div className="t-xs" style={{ color: 'var(--text-muted)' }}>Solution launchpad</div>
        </div>
      </div>

      {/* Mode toggle */}
      <button
        onClick={isShared ? onUnlock : onLock}
        title={isShared ? 'Unlock presenter mode (credentials visible)' : 'Return to shared mode (hide credentials)'}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
          padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem', fontWeight: 700,
          background: isShared ? 'var(--color-health-soft)' : 'var(--color-sec-soft)',
          color: isShared ? 'var(--color-health)' : 'var(--color-sec)',
          border: `1px solid ${isShared ? 'var(--color-health-border)' : 'var(--color-sec-border)'}`
        }}
      >
        {isShared ? <ShieldCheck size={16} /> : <Eye size={16} />}
        <span style={{ flex: 1, textAlign: 'left' }}>{isShared ? 'SHARED — client safe' : 'PRESENTER — creds visible'}</span>
        {isShared ? <Unlock size={14} /> : <Lock size={14} />}
      </button>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          ref={searchRef}
          className="search-input"
          style={{ paddingLeft: '2rem' }}
          placeholder="Search solutions…  (Ctrl+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Domain filter */}
      <div className="rail-section" role="group" aria-label="Domain filter">
        {DOMAIN_FILTERS.map(d => (
          <button
            key={d.id}
            onClick={() => setDomain(d.id)}
            className={`chip ${domain === d.id ? 'active' : ''}`}
            style={{ textAlign: 'left' }}
          >
            {d.id !== 'all' && <span className="status-dot" style={{ width: 6, height: 6, background: DOMAIN_COLORS[d.id] }} />}
            {d.label} ({d.id === 'all' ? products.length : byDomain(d.id).length})
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {tags.map(t => (
          <button key={t} onClick={() => setTag(t)} className={`chip ${tag === t ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Product list */}
      <nav className="rail-section" style={{ gap: '0.25rem' }} aria-label="Products">
        {['healthcare', 'infosec'].map(d => (
          <div key={d} className="rail-section" style={{ gap: '0.25rem' }}>
            <div className="t-label" style={{ color: DOMAIN_COLORS[d], marginTop: '0.5rem' }}>
              {d === 'healthcare' ? 'HealthCare' : 'InfoSec'}
            </div>
            {byDomain(d).map(p => {
              const idx = products.indexOf(p) + 1;
              return (
                <a
                  key={p.id}
                  href={`#/${p.id}`}
                  className={`rail-item ${selectedId === p.id ? 'active' : ''}`}
                  style={{ opacity: isDimmed(p.id) ? 0.45 : 1 }}
                >
                  <span className="rail-key">{idx}</span>
                  <span>{p.name}</span>
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Keyboard legend + theme */}
      <div className="kbd-legend">
        <span><kbd>1</kbd>–<kbd>{products.length}</kbd> jump to product</span>
        <span><kbd>Esc</kbd> back to overview</span>
        <span><kbd>Ctrl</kbd>+<kbd>K</kbd> search</span>
      </div>
      <button onClick={onToggleTheme} className="btn-ghost" title="Toggle theme">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        <span className="t-xs">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Sidebar.jsx && git commit -m "feat: sidebar rail — mode gate button, filters, hotkey list"
```

---

### Task 7: `OverviewPane.jsx` and `DetailPane.jsx` (with LaunchPanel)

**Files:**
- Create: `src/components/OverviewPane.jsx`
- Create: `src/components/DetailPane.jsx`

- [ ] **Step 1: Write `src/components/OverviewPane.jsx`**

```jsx
import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

const DOMAIN_COLORS = { healthcare: 'var(--color-health)', infosec: 'var(--color-sec)' };

export default function OverviewPane({ products, filtered, filteredBy, onReset }) {
  const pitch = {
    healthcare: 'Clinical intake, AI differentials, and hospital queue operations — verified against the running codebases.',
    infosec: 'Agentless PAN discovery and post-quantum cryptographic risk — verified against the running codebases.'
  };

  return (
    <main className="pane">
      <h1 className="t-hero" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
        Solution Portfolio
      </h1>
      <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: 640 }}>
        Launchpad for client demonstrations. Every deployment, credential, and feature below is
        verified against the actual product repositories.
      </p>

      {filteredBy && (
        <div className="card" style={{ marginTop: '1.25rem', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="t-sm" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} of {products.length} solutions match your filters
          </span>
          <button onClick={onReset} className="btn-secondary"><RotateCcw size={14} /> Reset filters</button>
        </div>
      )}

      {['healthcare', 'infosec'].map(d => {
        const items = filtered.filter(p => p.domain === d);
        if (!items.length) return null;
        return (
          <section key={d} style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <h2 className="t-lg" style={{ color: DOMAIN_COLORS[d] }}>{d === 'healthcare' ? 'HealthCare' : 'InfoSec'}</h2>
              <span className="t-xs" style={{ color: 'var(--text-faint)' }}>{items.length} solutions</span>
            </div>
            <p className="t-xs" style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0.85rem' }}>{pitch[d]}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {items.map(p => (
                <a key={p.id} href={`#/${p.id}`} className="card" style={{ display: 'block', transition: 'all var(--transition-fast)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${p.domain === 'healthcare' ? 'badge-health' : 'badge-sec'}`}>{p.badge}</span>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <h3 className="t-md" style={{ fontWeight: 800, marginTop: '0.6rem' }}>{p.name}</h3>
                  <div className="t-xs" style={{ color: DOMAIN_COLORS[p.domain], fontWeight: 600, marginTop: '0.15rem' }}>{p.tagline}</div>
                  <div className="t-xs font-mono" style={{ color: 'var(--text-faint)', marginTop: '0.6rem' }}>{p.version}</div>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <h3 className="t-md" style={{ fontWeight: 800 }}>No solutions match your filters</h3>
          <p className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Reset the search or switch the domain back to All.</p>
          <button onClick={onReset} className="btn-secondary" style={{ marginTop: '0.85rem' }}><RotateCcw size={14} /> Reset filters</button>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Write `src/components/DetailPane.jsx`**

The credential boundary: `redactDeployments` feeds the render; the copy handler closes over the *unredacted* product, so passwords reach the clipboard without ever entering the React tree.

```jsx
import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Play, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { redactDeployments } from '../data/filters';

import DermaDeskSimulator from './simulators/DermaDeskSimulator';
import OPDSimulator from './simulators/OPDSimulator';
import CCScannerSimulator from './simulators/CCScannerSimulator';
import PQCSimulator from './simulators/PQCSimulator';

const SIMULATORS = {
  dermadesk: DermaDeskSimulator,
  opd: OPDSimulator,
  cc_scanner: CCScannerSimulator,
  pqc_scanner: PQCSimulator
};

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export default function DetailPane({ product, mode, onUnlock, showToast }) {
  const [tab, setTab] = useState('overview');
  const [simRunning, setSimRunning] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const isShared = mode === 'shared';
  const isHealth = product.domain === 'healthcare';
  const deployments = redactDeployments(product.deployments, mode);
  const Simulator = SIMULATORS[product.id];

  const handleCopy = async (idx) => {
    const dep = product.deployments[idx]; // unredacted on purpose — clipboard only
    const ok = await copyText(`${dep.user} / ${dep.pass}`);
    if (ok) {
      setCopiedIdx(idx);
      showToast('Credentials copied — paste into the login form');
      setTimeout(() => setCopiedIdx(null), 2000);
    } else {
      showToast('Copy failed — clipboard unavailable');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Tech Specs' },
    { id: 'features', label: `Features (${product.features.length})` },
    ...(product.roadmap ? [{ id: 'roadmap', label: 'Roadmap' }] : [])
  ];

  return (
    <main className="pane">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h1 className="t-xl" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{product.name}</h1>
            <span className={`badge ${isHealth ? 'badge-health' : 'badge-sec'}`}>{product.badge}</span>
          </div>
          <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{product.tagline}</p>
        </div>
        <a href="#/" className="btn-ghost t-xs">← All solutions (Esc)</a>
      </div>

      {/* Launch panel */}
      <section className="card" style={{ marginTop: '1.5rem' }}>
        <div className="t-label" style={{ marginBottom: '0.75rem' }}>Launch — {product.deployments.length} environment{product.deployments.length > 1 ? 's' : ''}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {deployments.map((dep, idx) => (
            <div key={idx} className="launch-row">
              <div style={{ minWidth: 0 }}>
                <div className="t-sm" style={{ fontWeight: 700 }}>{dep.name}</div>
                <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-mono">{dep.env}</span> · {dep.status}
                </div>
                {dep.url && <div className="t-xs font-mono" style={{ color: 'var(--color-brand)', marginTop: '0.15rem' }}>{dep.url}</div>}
              </div>
              <div className="actions">
                {dep.user && dep.pass && isShared && (
                  <button onClick={() => handleCopy(idx)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.7rem' }}>
                    {copiedIdx === idx ? <Check size={13} color="var(--color-health)" /> : <Copy size={13} />}
                    {copiedIdx === idx ? 'Copied' : 'Copy creds'}
                  </button>
                )}
                {dep.url && (
                  <a href={dep.url} target="_blank" rel="noreferrer" className={isHealth ? 'btn-health' : 'btn-sec'} style={{ fontSize: '0.8rem', padding: '0.4rem 0.7rem' }}>
                    Open <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {isShared && product.deployments.some(d => d.pass) && (
          <div className="t-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-faint)', marginTop: '0.85rem' }}>
            <ShieldCheck size={14} />
            Shared mode: passwords copy to the clipboard without appearing on screen.
            <button onClick={onUnlock} style={{ color: 'var(--color-brand)', fontWeight: 700, textDecoration: 'underline' }}>Presenter mode</button>
          </div>
        )}
        {!isShared && (
          <div className="t-xs font-mono" style={{ marginTop: '0.85rem', color: 'var(--text-secondary)' }}>
            {product.deployments.filter(d => d.user).map(d => `${d.user} / ${d.pass}`).join('   ·   ')}
          </div>
        )}
      </section>

      {/* Simulator */}
      {Simulator && (
        <section className="card" style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div className="t-label">Offline fallback</div>
              <div className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Runs entirely in-browser — use when the client network blocks the real deployment.
              </div>
            </div>
            <button onClick={() => setSimRunning(s => !s)} className={isHealth ? 'btn-health' : 'btn-sec'}>
              <Play size={14} /> {simRunning ? 'Hide simulator' : 'Run simulator'}
            </button>
          </div>
          {simRunning && <div className="animate-fade-in" style={{ marginTop: '1.25rem' }}><Simulator /></div>}
        </section>
      )}

      {/* Talk track — presenter only */}
      {!isShared && product.talkTrack && (
        <section style={{
          marginTop: '1.25rem', padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-sm)',
          background: isHealth ? 'var(--color-health-soft)' : 'var(--color-sec-soft)',
          border: `1px solid ${isHealth ? 'var(--color-health-border)' : 'var(--color-sec-border)'}`
        }}>
          <div className="t-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: isHealth ? 'var(--color-health)' : 'var(--color-sec)' }}>
            <MessageSquareQuote size={14} /> Talk track — presenter only
          </div>
          <p className="t-sm" style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.3rem' }}>"{product.talkTrack}"</p>
        </section>
      )}

      {/* Tabs */}
      <div className="tab-bar" style={{ marginTop: '1.75rem' }} role="tablist">
        {tabs.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div className="t-label">Summary</div>
            <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.6 }}>{product.summary}</p>
          </div>
          <div>
            <div className="t-label">Built for</div>
            <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{product.targetClient}</p>
          </div>
        </div>
      )}

      {tab === 'specs' && (
        <div className="card animate-fade-in">
          {[
            ['Stack', product.arch],
            ['Storage', product.storage],
            ['Protocols', product.protocols]
          ].map(([label, value]) => (
            <div key={label} className="spec-row">
              <span className="t-label">{label}</span>
              <span className="t-sm font-mono" style={{ color: 'var(--color-brand)' }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'features' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {product.features.map(f => (
            <div key={f.name} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <span className="t-sm" style={{ fontWeight: 700 }}>{f.name}</span>
                <span className="badge badge-health">{f.status}</span>
              </div>
              <p className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.55 }}>{f.note}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'roadmap' && product.roadmap && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {product.roadmap.map(r => (
            <div key={r.title} className="card" style={{ padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <span className="t-sm" style={{ fontWeight: 700 }}>{r.title}</span>
                <p className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>{r.note}</p>
              </div>
              <span className={`badge ${r.priority === 'High' ? 'badge-health' : 'badge-neutral'}`}>{r.priority}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/OverviewPane.jsx src/components/DetailPane.jsx && git commit -m "feat: overview + detail panes, credential-safe launch panel"
```

---

### Task 8: `AuthModal.jsx` — the presenter-mode gate

**Files:**
- Modify: `src/components/AuthModal.jsx` (full replacement)

Deviation from spec (noted): the old persona presets (email + token pairs) are dropped — they were theater for a login that didn't exist. The gate is a single client-side passphrase, as the spec's "out of scope" section already concedes.

- [ ] **Step 1: Replace the file**

```jsx
import React, { useState } from 'react';
import { X, Lock, ShieldAlert } from 'lucide-react';

// ponytail: client-side speed bump, not security — the passphrase ships in the bundle by design
const PRESENTER_PASSPHRASE = 'UniversalDemo#2026';

export default function AuthModal({ onClose, onSuccess }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === PRESENTER_PASSPHRASE) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(9, 13, 22, 0.75)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="card animate-fade-in"
        style={{ maxWidth: 420, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #0284c7, #6366f1)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Lock size={17} />
            </div>
            <div>
              <h3 className="t-md" style={{ fontWeight: 800 }}>Enter Presenter Mode</h3>
              <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
                Credentials become visible on screen
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <label className="t-xs" style={{ fontWeight: 700, display: 'block', marginBottom: '0.3rem' }} htmlFor="passphrase">
          Presenter passphrase
        </label>
        <input
          id="passphrase"
          type="password"
          className="search-input font-mono"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          autoFocus
        />
        {error && (
          <div className="t-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-rose)', marginTop: '0.5rem' }}>
            <ShieldAlert size={14} /> Wrong passphrase
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.1rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Stay shared</button>
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>Unlock</button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AuthModal.jsx && git commit -m "feat: auth modal repurposed as presenter-mode gate"
```

---

### Task 9: Delete superseded components and simulators

**Files:**
- Delete: `src/components/Navbar.jsx`, `src/components/HeroSection.jsx`, `src/components/ProductCard.jsx`, `src/components/ProductDossierModal.jsx`, `src/components/PresenterHUD.jsx`
- Delete: `src/components/simulators/DermaDXSimulator.jsx`, `src/components/simulators/PCIComplianceSimulator.jsx`

- [ ] **Step 1: Delete the files**

```bash
rm src/components/Navbar.jsx src/components/HeroSection.jsx src/components/ProductCard.jsx src/components/ProductDossierModal.jsx src/components/PresenterHUD.jsx
rm src/components/simulators/DermaDXSimulator.jsx src/components/simulators/PCIComplianceSimulator.jsx
```

- [ ] **Step 2: Verify nothing references them**

```bash
grep -rn "Navbar\|HeroSection\|ProductCard\|ProductDossierModal\|PresenterHUD\|DermaDXSimulator\|PCIComplianceSimulator\|demoConfig\|blur-mask\|App.css" src/ index.html
```

Expected: no output (exit code 1). Any hit is an orphan — fix it before continuing.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: delete superseded components, simulators, and dead references"
```

---

### Task 10: README + full verification

**Files:**
- Modify: `README.md` (full replacement)

- [ ] **Step 1: Replace `README.md`**

```markdown
# Enterprise Solution Catalogue & Demo Hub

A presenter's console for live client demonstrations of four in-house products.
Two modes:

- **Shared (default):** client-safe. Passwords never render in the DOM —
  "Copy creds" writes straight to the clipboard for pasting into login forms.
- **Presenter:** unlocked with a passphrase (`UniversalDemo#2026`). Shows
  credentials inline and per-product talk tracks.

## Products (data verified against source repos)

| Product | Domain | Source repo |
|---|---|---|
| DermaDesk AI | HealthCare | `D:\Project Files\DermaDesk` |
| OPD Intelligence | HealthCare | `D:\Project Files\OpdIQ_Workspace\OPD-2.0` |
| Central CC Scanner | InfoSec | `CC_Number_Detection_Tool-main\deepak-scanner-update_new` |
| Panacea PQC Scanner | InfoSec | `D:\Project Files\PQC New` |

Product facts live in `src/data/catalogData.js`. When a product changes,
update that file from the real repo — the app renders only verified data.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

## Keyboard

- `1`–`4` — jump to product
- `Esc` — back to overview / close modal
- `Ctrl+K` — search

## Self-check

```bash
node src/data/filters.js
```

Verifies every filter tag matches at least one product, both domains are
non-empty, and shared-mode deployment data carries no password fields.

## Notes

- The presenter passphrase is a client-side speed bump, not security — it
  ships in the bundle by design. Real credentials are demo values.
- Deployment status dots reflect configured state, not live health checks.
```

- [ ] **Step 2: Run every verification gate**

```bash
node src/data/filters.js        # Expected: PASS — 4 products, 8 tags, all checks green
npm run lint                    # Expected: no errors
npm run build                   # Expected: builds clean
```

- [ ] **Step 3: Manual keyboard pass (dev server)**

```bash
npm run dev
```

Check in the browser: default view is overview; `2` selects OPD; `Esc` returns;
`Ctrl+K` focuses search; typing filters; clicking "SHARED — client safe" opens
the passphrase gate; wrong passphrase shows an error; `UniversalDemo#2026`
unlocks presenter mode and reveals credentials + talk track; reload keeps
mode and theme; refresh on `#/opd` reopens OPD.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: README for the overhauled demo hub"
```

---

## Self-Review (done at plan time)

- **Spec coverage:** two-pane shell ✓ (Tasks 5–7), credential safety by construction ✓ (Task 3 data + Task 7 redaction/copy + Task 8 gate), tags-based filtering ✓ (Tasks 2–3), type scale + focus-visible + theme persistence ✓ (Tasks 4–5), keyboard ✓ (Task 5), deletions ✓ (Tasks 4, 9), README ✓ (Task 10), self-check ✓ (Task 2), clipboard fallback ✓ (Task 7), DermaDX/PCI removal ✓ (Tasks 3, 9).
- **Known deviations from spec:** (1) AuthModal drops persona presets — they were decorative; the gate is a single passphrase (spec already called the auth "a speed bump"). (2) Simulator restyle is a verification pass rather than a rewrite — the kept simulators style exclusively via the surviving CSS vars and classes, so they inherit the new shell automatically; the missing `.animate-spin` definition is added in Task 4. (3) Talk tracks moved from the deleted PresenterHUD into DetailPane, presenter-mode-only, as specced.
- **Type consistency:** `filterProducts` / `allTags` / `redactDeployments` signatures match between Task 2 and their uses in Tasks 5–7. Deployment rows use `{name, env, url, status, color, user?, pass?}` throughout; `roadmap` is `null` for products without one and the tab list omits it conditionally.
