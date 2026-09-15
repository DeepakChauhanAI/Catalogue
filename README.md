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
