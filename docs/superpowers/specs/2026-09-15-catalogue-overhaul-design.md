# Catalogue Overhaul — Design Spec

Date: 2026-09-15
Project: `D:\Project Files\Catalogue` (React 19 + Vite demo hub, 6 products, ~4300 lines)

## Problem

The app's stated goal — a presenter's console for live client demos with a
client-safe shared-screen mode — is not what the code delivers:

1. **Presenter safety is inverted.** Default state shows all credentials;
   `.blur-mask:hover` unblurs passwords on a stray mouse hover.
2. **The primary action is buried.** Launching a real deployment is 2 clicks
   deep inside a modal tab; cards surface only 2 of up to 4 deployments
   labeled by `dep.env.split(' ')[0]` ("Local", "AWS" — meaningless).
3. **No keyboard control.** No Escape handling anywhere; two stacked modals.
4. **Filters are broken.** 3 of 7 tag chips return zero products (verified by
   running the filter against the data); "Operations" matches only the wrong
   product. Filtering is substring-matching prose instead of reading tags.
5. **Product data is fiction.** OPD claims "Node.js, Redis Queue, Go
   Microservices"; the real repo is FastAPI + SQLite + React 19 + Gemini Live.
   DermaDesk claims a "51-class AI"; the real repo ships an LLM top-3
   differential. CC Scanner claims a "Golang + Rust engine"; the real repo is
   Python + Presidio/spaCy. PQC lists a TLS prober as a live deployment; the
   repo deliberately does not wire it in.
6. **Dead weight.** `App.css` (never imported), `src/assets/*` (unreferenced),
   `original_index.html` (109KB), `demoConfig` (60 lines, never rendered),
   a bottom matrix table that duplicates cards and ignores filters.

## Goal

One app, two modes:

- **Shared mode (default):** client-safe. Credentials never render in the
  DOM; "Copy" writes to clipboard silently so the presenter pastes into the
  login form while the client watches.
- **Presenter mode:** unlocked via the AuthModal (repurposed from decorative
  to functional gate). Credentials render in the clear.

A two-pane launch console (left rail: 6 products grouped by domain; right
pane: selected product inline — no modals), keyboard-driven, with data that
matches the four real repos.

## Verified Product Data (source of truth for `catalogData.js`)

Derived from reading the four repos on 2026-09-15. Anything not listed here
as verified is deleted from the catalogue rather than carried forward.

### OPD Intelligence (`OpdIQ_Workspace/OPD-2.0`)
- **Stack (real):** React 19 + TypeScript + Vite + Tailwind v4 + Zustand
  frontend; FastAPI (Python) + SQLite WAL backend; Google Gemini Live voice;
  JWT auth with role guards. (README + package.json + requirements.txt)
- **Deployments (real):** Frontend `http://localhost:5173`; FastAPI
  `http://localhost:8000` (Swagger at `/docs`); public waiting-room display
  `/waiting-room` (no login).
- **Personas (real, from README):** dr.rao/doctor123 (doctor console),
  kiosk/kiosk123 (touch kiosk), dhara/dhara123 (voice intake),
  admin/admin123 (admin console).
- **Features (real):** doctor console with call/skip/no-show queue + EMR
  prescription writer with voice dictation; self-service touch kiosk
  (numpad phone lookup, family disambiguation, dynamic symptom branching,
  bilingual TTS, thermal-style token); Dhara conversational voice intake
  (Gemini Live full-duplex, 7-point clinical checklist, emergency red-flag
  alerts); waiting-room TV display with bilingual audio chime; admin console
  (branding, departments, doctors, immutable audit log); anti-deadlock
  sequential token engine (SQLite WAL + shared `issue_token()` pipeline).
- **Deleted claims:** Node/Redis/Go/TimescaleDB stack, SMS/WhatsApp
  broadcast, ML wait-time prediction engine, 15,000 patients, 28
  departments, -40% wait, NABH/ISO 27001 compliance.

### DermaDesk AI (`DermaDesk`)
- **Stack (real):** Next.js 16 (App Router) + React 19 + TypeScript PWA;
  NestJS 11 backend on :4001 (web on :3000 proxying); Socket.IO realtime;
  MongoDB with in-memory fallback; external AI inference via
  `AI_SERVICE_BASE_URL` (FastAPI bridge) with OpenAI/Gemini LLM fallback.
- **Deployments (real):** desktop `http://localhost:3000`; LAN
  `http://<LAN-IP>:3000`; backend `:4001`; mobile QR upload
  `/quick-upload/:token` (no login).
- **Features (real):** 6-section clinical intake — 46 questions (27 base +
  19 conditional) with dynamic branching; QR mobile camera upload with
  realtime socket sync into image questions; Fitzpatrick phototype visual
  selector; AI differential (LLM top-3 ranked, multimodal image+intake);
  physician verdict loop (Correct/Partial/Incorrect + confidence + final
  diagnosis, visit locking); doctor vs frontdesk role separation; zero-setup
  demo mode (seeded psoriasis case at `/workspace?demo=psoriasis`).
- **Deleted claims:** "51-class multimodal AI", "94.2% accuracy", "21+
  question" (it's 46 — better, use the real number), HIPAA/HL7 FHIR mapped.

### Panacea PQC Scanner (`PQC New`)
- **Stack (real):** Python 3.11+; `panacea` CLI (Click) + FastAPI + HTMX +
  Jinja2 web dashboard on `http://localhost:8000`; SQLModel over
  SQLite/PostgreSQL (Alembic migrations); boto3.
- **Deployments (real):** local web dashboard `http://localhost:8000`
  (unauthenticated by default; Basic auth via `PQC_WEB_USERNAME`/`PASSWORD`
  env); CLI for CI/scheduled scans.
- **Features (real, from README + feature_guide):** 35 AWS collectors across
  42 service APIs (read-only, metadata-only); 10-class NIST PQC taxonomy
  (derived from NIST IR 8105 / SP 800-57 Rev. 5); Mosca 6-factor Quantum
  -Adjusted Risk Score with configurable horizon
  (`PQC_QUANTUM_HORIZON_YEAR`); 6-edge dependency graph including
  absence-of-encryption findings; CycloneDX 1.7 CBOM export
  (schema-validated in CI); honest coverage-gap reporting (denied
  permissions named, not silently dropped); multi-account/multi-region/
  multi-partition scanning.
- **Corrected claim:** the TLS/STARTTLS prober exists in code
  (`pqc_scanner/core/tls_prober.py`) but is deliberately NOT wired into
  collectors (belongs to a separate on-prem process per `EXTENSION.md`).
  The catalogue must not list it as a live feature or deployment.

### Credit Card Scanner (`CC_Number_Detection_Tool-main/.../deepak-scanner-update_new`)
- **Name (real):** Central CC Scanner — in-house replacement for ControlCase
  CDD.
- **Stack (real):** Python; FastAPI + Jinja2 web UI on
  `http://127.0.0.1:5050` (Swagger at `/docs`); agentless streaming readers
  (SMB/SFTP/local) — nothing installed on scanned hosts; Microsoft Presidio
  + spaCy NER detection; 183 regression tests.
- **Features (real):** agentless read-only file scanning across Windows
  (SMB) and Linux (SSH/SFTP) fleets from one central host; detection
  pipeline: byte prefilter → ~30-format text extraction → Luhn + BIN →
  Presidio CREDIT_CARD → spaCy context scoring; masking at point of
  detection (PAN/CVV/expiry/track data); suppression (test cards,
  tokenised BINs); resumable checkpoint state (SQLite); tamper-evident
  PCI-DSS Req-10 audit trail; QSA-defensible masked reports.
- **Deleted claims:** Golang/Rust engine, multi-cloud AWS/GCP/Azure
  connectors, 120k records/sec, Kafka interceptor, "100% Luhn accuracy"
  as a stat.

### DermaDX and PCI-DSS Compliance Manager
No repo was provided. **Decision: remove both entries and their simulators.**
Six products with two fictional ones undermines the four real ones in front
of a client who checks. (If the user overrides, they return as explicit
"Concept — not yet built" entries.)

## Architecture

### Shell: two-pane console, hash routing, no router dependency

```
App.jsx
├── Sidebar (left rail, fixed)
│   ├── brand + mode badge (SHARED / PRESENTER)
│   ├── product list grouped by domain (1–6 hotkey numbers)
│   ├── filter: domain (All / HealthCare / InfoSec) — works at all widths
│   ├── search input (Ctrl/Cmd+K focuses it)
│   └── keyboard legend (1–6 jump, Esc back, Ctrl+K search)
├── DetailPane (right, scrolls)
│   ├── ProductHeader: name, tagline, domain badge, version
│   ├── LaunchPanel: every deployment as a row — label (real env name),
│   │   status dot (from dep.status/dep.color), [Open] button,
│   │   [Copy creds] (shared mode: clipboard only; presenter mode: also
│   │   renders user/pass inline)
│   ├── SimulatorPanel: "Run offline simulator" toggle → renders the
│   │   existing per-product simulator inline
│   ├── TalkTrack card (presenter mode only — clients never see this)
│   └── Tabs: Overview · Specs · Features · Roadmap (inline, not modal)
└── AuthModal (repurposed: the gate for shared → presenter mode)
```

- **Routing:** `window.location.hash` (`#/` grid-less list is the default
  view; `#/opd` selects a product). `hashchange` listener in App; ~15
  lines; refresh-safe; shareable URLs. No dependency added.
- **Default view** (no hash): rail + a compact "portfolio overview" pane
  (counts per domain, per-domain one-line pitches). One screen, no modal.
- **No modals except AuthModal.** Dossier content renders in the right pane.

### Modes and credential safety (root-cause fix)

- State: `mode: 'shared' | 'presenter'`, default `'shared'`, persisted to
  `localStorage`.
- **Shared mode:** `dep.pass` is never present in the React tree. The
  LaunchPanel's "Copy creds" button calls
  `navigator.clipboard.writeText()` directly; the rendered component holds
  only a "copied ✓" state. TalkTrack section is not rendered at all.
- **Presenter mode:** AuthModal (existing component, restyled) requires the
  presenter passphrase; on success sets mode. Personas list stays as quick
  presets. The navbar toggle switches back to shared instantly (one click
  when a client walks in).
- `.blur-mask` CSS and its hover-reveal deleted.

### Filtering (root-cause fix)

- Each product in `catalogData.js` gains `tags: []` (verified real tags,
  e.g. opd: `['queue', 'voice-ai', 'kiosk', 'clinical-intake']`).
- `filterProducts(products, {domain, tags, query})` matches: domain exact;
  tag membership exact (not substring); query substring against
  name/tagline/arch only.
- Chips derive from the union of product tags. A chip with zero matches
  cannot exist because chips ARE the tags.
- `filterProducts` lives in `src/data/filters.js` (pure function,
  importable by the self-check).

### Styling

- All repeated layout moves from inline style objects into `index.css`
  utility classes; the existing token system stays and is used everywhere.
- Type scale: 6 sizes (0.8 / 0.875 / 1 / 1.25 / 1.5 / 2rem). **0.8rem
  floor** — projector legibility is a hard requirement for this app.
- `:focus-visible` outlines on every interactive element (currently zero).
- Theme: initialized from `localStorage` → `prefers-color-scheme` → dark;
  applied via one `useEffect` in App; Navbar's imperative
  `document.documentElement.setAttribute` removed.

### Keyboard

One `keydown` listener in App:
- `Esc`: product → overview; search focused → blur; AuthModal open → close.
- `1`–`6`: select product (when not typing in an input).
- `Ctrl/Cmd+K`: focus search.

### Deletions

| Item | Reason |
|---|---|
| `src/App.css` | Vite template leftover, never imported |
| `src/assets/hero.png`, `react.svg`, `vite.svg` | unreferenced |
| `original_index.html` (109KB) | superseded pre-React version |
| `demoConfig` (catalogData) | never rendered; simulators are bespoke |
| Bottom matrix table (App.jsx) | duplicates cards, ignores filters |
| `AuthModal` passkey theater | replaced by the real mode gate |
| Vite README | replaced by a real project README |
| DermaDX + PCI Manager entries | no repo; fictional (pending confirm) |

### Components after the overhaul

```
src/
├── App.jsx                 (shell: routing, mode, keyboard, filters)
├── components/
│   ├── Sidebar.jsx         (rail: brand, product list, search, filters)
│   ├── DetailPane.jsx      (header, launch panel, tabs)
│   ├── OverviewPane.jsx    (default view)
│   ├── LaunchPanel.jsx     (deployment rows + credential copy)
│   ├── AuthModal.jsx       (repurposed mode gate)
│   ├── Toast.jsx           (kept as-is)
│   └── simulators/         (all 6 kept, restyled to match)
└── data/
    ├── catalogData.js      (rewritten from verified facts above)
    └── filters.js          (pure filterProducts + self-check)
```

Simulators: the four real products' simulators stay (DermaDesk, OPD, CC,
PQC). DermaDX and PCI simulators are deleted with their entries. The
remaining simulators get a light restyle pass only — layout classes, type
scale; their interactive logic is untouched.

### Data schema change

`deployments[]` entries become:
```js
{ name, url, env, status, color, user, pass }
```
(same shape) — but `env` must be a short human label chosen from the real
repo facts ("Doctor Console", "Touch Kiosk", "FastAPI :8000"), never
`env.split(' ')[0]`.

## Error handling

- Empty filter state: existing reset-filters empty state, kept.
- Dead URL (deployment not running): can't detect without fetching (CORS
  makes it unreliable) — out of scope. The status dot reflects configured
  status only, labeled as such.
- Clipboard API failure (non-secure context): fallback `textarea+execCommand`
  copy, ~8 lines.

## Verification

1. `demo()` self-check in `filters.js` (run with `node --experimental...` or
   imported by a tiny `npm run check` script):
   - every tag chip matches ≥1 product;
   - every domain filter returns > 0 when tag = All;
   - shared mode predicate: rendering LaunchPanel in shared mode never
     includes the pass string (test by rendering to string with
   react-dom/server — one assert).
2. Manual check per repo fact: each `deployments[].url` in catalogData
   matches the port/host documented in that repo's README.
3. `npm run build` passes; oxlint passes.
4. Manual keyboard pass: Esc/1–6/Ctrl+K behave as specced.

## Out of scope

- Real auth (the AuthModal gate is a speed bump, not security — the
  passphrase is client-side by design; noted in README).
- Live health checks on deployment URLs.
- Any backend.
