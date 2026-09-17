// Product facts verified against source repos on 2026-09-15.
// DermaDesk:   D:\Project Files\DermaDesk
// OPD-2.0:     D:\Project Files\OpdIQ_Workspace\OPD-2.0
// CC Scanner:  CC_Number_Detection_Tool-main\deepak-scanner-update_new
// PQC Scanner: D:\Project Files\PQC New
// Anything not verifiable in those repos is not in this file.
// Exception: category / lastUpdated / demoFlow / links are presentation-layer
// demo-hub config, not product facts. githubUrl + productionUrl seed empty —
// no public URLs exist for these repos; Admin fills them in.

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
    category: 'Healthcare AI',
    lastUpdated: 'Sep 12, 2026',
    bannerTag: 'FEATURED',
    repository: { githubUrl: '', branch: 'main', isPublic: false },
    links: { productionUrl: '', stagingUrl: 'http://localhost:3000' },
    demoFlow: {
      completeFlow: { enabled: true, sandboxUrl: 'http://localhost:3000/workspace?demo=psoriasis', credentialsHint: 'No login — seeded psoriasis demo case' },
      demoVideo: {
        enabled: true,
        videoUrl: 'https://mdn.github.io/shared-assets/videos/flower.mp4',
        videoDuration: '4:20',
        videoFileName: 'dermadesk-demo-overview.mp4',
        videoSpecs: 'MP4 • 1280x720 • 45.6 MB',
        thumbnailUrl: '/mockups/dermadesk_concept_thumb.jpg',
        chapters: [
          { timestamp: '0:00', title: 'Intro', description: 'What DermaDesk AI is and who it is for' },
          { timestamp: '1:20', title: 'Clinical Intake', description: 'The 6-section, 46-question intake with conditional branching' },
          { timestamp: '2:45', title: 'QR Photo Capture & AI Differential', description: 'Zero-login mobile capture synced live, physician verdict loop' }
        ]
      },
      contactDemo: { enabled: true, inquiryEmail: 'sales-demos@enterprise.com' }
    },
    talkTrack: 'Open the zero-setup psoriasis demo case, walk the 6 intake sections, then trigger the QR upload — scan it with your own phone and watch the photo land in the desktop workspace live. Close on the physician verdict loop: the AI proposes, the doctor disposes.',
    versions: [
      {
        id: 'v2.1.0',
        versionNumber: 'v2.1.0',
        releaseName: 'Doctor-First Clinical Flow',
        status: 'active',
        releaseDate: 'Sep 12, 2026',
        uniqueFeatures: [
          'Zero-login QR mobile photo capture synced over Socket.IO',
          'Multimodal LLM clinical differential with OpenAI/Gemini fallback',
          'Physician verdict loop & diagnostic visit locking',
          '6-section 46-question dynamic branching intake'
        ],
        deployments: [
          {
            id: 'dep-d1',
            name: 'AWS ECS Production',
            platform: 'AWS Cloud',
            env: 'Production',
            url: 'https://dermadesk.aws.enterprise.health',
            status: 'Healthy',
            regionOrPort: 'us-east-1',
            note: 'Multi-AZ cluster with auto-scaling & HIPAA logging'
          },
          {
            id: 'dep-d2',
            name: 'Local Dev Server',
            platform: 'Local Server',
            env: 'Development',
            url: 'http://localhost:3000',
            status: 'Running',
            regionOrPort: 'Port :3000',
            note: 'Instant seeded psoriasis case at /workspace?demo=psoriasis'
          },
          {
            id: 'dep-d3',
            name: 'NestJS API Gateway',
            platform: 'Local Server',
            env: 'Development',
            url: 'http://localhost:4001',
            status: 'Running',
            regionOrPort: 'Port :4001',
            note: 'Socket.IO websocket gateway & Express backend'
          }
        ]
      },
      {
        id: 'v1.4.0',
        versionNumber: 'v1.4.0',
        releaseName: 'Legacy Clinical Intake Base',
        status: 'deprecated',
        releaseDate: 'Apr 20, 2026',
        uniqueFeatures: [
          'Standard 3-page clinical questionnaire',
          'Manual photo file uploads (no QR mobile sync)',
          'Single-doctor review without differential ranking'
        ],
        deployments: [
          {
            id: 'dep-d4',
            name: 'On-Premise Hospital Server',
            platform: 'On-Premise',
            env: 'Staging',
            url: 'http://192.168.1.50:8080',
            status: 'Maintenance',
            regionOrPort: 'Internal LAN :8080',
            note: 'Legacy EHR test node with static patient records'
          }
        ]
      }
    ],
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
    roadmap: [
      { title: 'Offline mobile capture queue', priority: 'Medium', status: 'in-progress', note: 'PWA service worker offline caching for image capture in low-connectivity examination rooms' },
      { title: 'Multi-clinic EHR FHIR export', priority: 'High', status: 'planned', note: 'Standardized HL7/FHIR observation and diagnostic report integration for hospital EHR networks' },
      { title: 'Multi-lesion longitudinal tracking', priority: 'Medium', status: 'planned', note: 'Side-by-side temporal progression analysis and dermoscopic lesion segmentation' },
      { title: 'Zero-Login QR Handshake v1', priority: 'High', status: 'completed', note: 'Realtime Socket.IO desktop-to-mobile camera bridge and encrypted session tokens' }
    ]
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
    category: 'Healthcare AI',
    lastUpdated: 'Sep 08, 2026',
    repository: { githubUrl: '', branch: 'main', isPublic: false },
    links: { productionUrl: '', stagingUrl: 'http://localhost:5173' },
    demoFlow: {
      completeFlow: { enabled: true, sandboxUrl: 'http://localhost:5173', credentialsHint: 'dr.rao / doctor123 (doctor console)' },
      demoVideo: {
        enabled: true,
        videoUrl: 'https://mdn.github.io/shared-assets/videos/flower.mp4',
        videoDuration: '5:12',
        videoFileName: 'opd-intelligence-demo.mp4',
        videoSpecs: 'MP4 • 1280x720 • 52.1 MB',
        thumbnailUrl: '/mockups/opd_concept_thumb.jpg',
        chapters: [
          { timestamp: '0:00', title: 'Intro', description: 'One system: kiosk, voice intake, doctor console, waiting-room TV' },
          { timestamp: '1:35', title: 'Kiosk & Dhara Voice Intake', description: 'Self-service registration and the Gemini Live checklist' },
          { timestamp: '3:10', title: 'Doctor Console & Prescriptions', description: 'Token queue, EMR review, printable branded Rx' }
        ]
      },
      contactDemo: { enabled: true, inquiryEmail: 'sales-demos@enterprise.com' }
    },
    versions: [
      {
        id: 'v2.0.0',
        versionNumber: 'v2.0.0',
        releaseName: 'Gemini Live & Kiosk Suite',
        status: 'active',
        releaseDate: 'Sep 08, 2026',
        uniqueFeatures: [
          'Dhara Voice Assistant with Gemini Live full-duplex audio',
          'Deadlock-free sequential token engine on SQLite WAL',
          'Doctor Console with printable branded EMR Rx writer',
          'Bilingual waiting-room TV chime announcements'
        ],
        deployments: [
          {
            id: 'dep-o1',
            name: 'Local Kiosk & Doctor Station',
            platform: 'Local Server',
            env: 'Development',
            url: 'http://localhost:5173',
            status: 'Running',
            regionOrPort: 'Port :5173',
            note: 'Frontend Vite dev server with kiosk & doctor routes'
          },
          {
            id: 'dep-o2',
            name: 'FastAPI Backend Engine',
            platform: 'Local Server',
            env: 'Development',
            url: 'http://localhost:8000',
            status: 'Running',
            regionOrPort: 'Port :8000',
            note: 'SQLite WAL token engine and voice streaming API'
          },
          {
            id: 'dep-o3',
            name: 'AWS Cloud Kiosk Pilot',
            platform: 'AWS Cloud',
            env: 'Production',
            url: 'https://opd.aws.hospital-cloud.com',
            status: 'Healthy',
            regionOrPort: 'ap-south-1',
            note: 'Piloting touch-kiosk multi-tenant deployment'
          }
        ]
      },
      {
        id: 'v1.0.0',
        versionNumber: 'v1.0.0',
        releaseName: 'Physical Token Printer',
        status: 'deprecated',
        releaseDate: 'Feb 15, 2026',
        uniqueFeatures: [
          'Basic touch-screen token printing',
          'Simple counter numeric display (no voice audio)'
        ],
        deployments: [
          {
            id: 'dep-o4',
            name: 'Legacy Reception Counter',
            platform: 'On-Premise',
            env: 'Staging',
            url: 'http://192.168.1.20:8000',
            status: 'Maintenance',
            regionOrPort: 'LAN Port :8000',
            note: 'Legacy serial thermal printer gateway'
          }
        ]
      }
    ],
    deployments: [
      { name: 'Web App — Doctor Console', env: 'Vite :5173', url: 'http://localhost:5173', status: 'Doctor console — login required', color: 'emerald', user: 'dr.rao', pass: 'doctor123' },
      { name: 'Kiosk & Voice Intake', env: 'Vite :5173', url: 'http://localhost:5173', status: 'Kiosk + Dhara voice screens — login required', color: 'cyan', user: 'kiosk | dhara', pass: 'kiosk123 | dhara123' },
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
      { title: 'Prescription immutability', priority: 'High', status: 'in-progress', note: 'Server-issued Rx numbers and append-only visit writes (plan §4.2–4.3)' },
      { title: 'Row-level authorization', priority: 'High', status: 'planned', note: 'Per-doctor scoping of queue and patient data (hardening plan §1.4)' },
      { title: 'Consent gate + idle timeout', priority: 'Medium', status: 'planned', note: 'Kiosk consent capture and session expiry (plan §3.5)' },
      { title: 'Bilingual Chime & Token Engine', priority: 'High', status: 'completed', note: 'Sequential SQLite WAL token generation and bilingual audio announcements' }
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
    category: 'Security',
    lastUpdated: 'Aug 28, 2026',
    repository: { githubUrl: '', branch: 'main', isPublic: false },
    links: { productionUrl: '', stagingUrl: 'http://127.0.0.1:5050' },
    demoFlow: {
      completeFlow: { enabled: true, sandboxUrl: 'http://127.0.0.1:5050', credentialsHint: 'No built-in login — trusted network only' },
      demoVideo: {
        enabled: true,
        videoUrl: 'https://mdn.github.io/shared-assets/videos/flower.mp4',
        videoDuration: '3:48',
        videoFileName: 'cc-scanner-evidence-pack.mp4',
        videoSpecs: 'MP4 • 1280x720 • 38.9 MB',
        thumbnailUrl: '/mockups/cc_scanner_concept_thumb.jpg',
        chapters: [
          { timestamp: '0:00', title: 'Intro', description: 'Agentless cardholder-data discovery — the in-house CDD replacement' },
          { timestamp: '1:10', title: 'Detection Pipeline', description: 'Luhn/BIN validation, Presidio + spaCy NER context scoring, mask at detection' },
          { timestamp: '2:30', title: 'QSA Evidence', description: 'Tamper-evident audit trail, resumable scans, coverage-gap registry' }
        ]
      },
      contactDemo: { enabled: false, inquiryEmail: 'sales-demos@enterprise.com' }
    },
    talkTrack: 'Lead with agentless: nothing is installed or executed on scanned machines, files are streamed and discarded, and every PAN is masked the moment it is detected — the scanner disk never holds cardholder data. Then the QSA evidence pack: tamper-evident audit trail, masked findings, coverage-gap registry.',
    versions: [
      {
        id: 'v1.0.0',
        versionNumber: 'v1.0.0',
        releaseName: 'Agentless CDD Core',
        status: 'active',
        releaseDate: 'Aug 28, 2026',
        uniqueFeatures: [
          'Agentless fleet discovery over SMB (Windows) & SFTP (Linux)',
          'Presidio + spaCy NER context scoring after Luhn validation',
          'Immediate in-memory PAN/CVV masking at detection',
          'PCI-DSS Req-10 tamper-evident SHA-256 audit log'
        ],
        deployments: [
          {
            id: 'dep-c1',
            name: 'Central Scanner Console',
            platform: 'Local Server',
            env: 'Development',
            url: 'http://127.0.0.1:5050',
            status: 'Running',
            regionOrPort: 'Port :5050',
            note: 'FastAPI + Jinja2 scanner control center'
          },
          {
            id: 'dep-c2',
            name: 'AWS GovCloud Compliance Worker',
            platform: 'AWS Cloud',
            env: 'Production',
            url: 'https://scanner-gov.sec.aws.internal',
            status: 'Healthy',
            regionOrPort: 'us-gov-west-1',
            note: 'Scheduled S3 bucket and EBS snapshot auditor'
          }
        ]
      }
    ],
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
      { title: 'Remote prefiltering', priority: 'High', status: 'in-progress', note: 'Cut transferred bytes by prefiltering on the source system (parity plan A1)' },
      { title: 'Split-pipeline execution modes', priority: 'Medium', status: 'planned', note: 'Central vs distributed scan execution (parity plan 1.1–1.2)' },
      { title: 'spaCy pipeline optimization', priority: 'Medium', status: 'planned', note: 'Single shared NER model and batched inference for throughput (plan A3)' },
      { title: 'Tamper-Evident SHA-256 Audit Trail', priority: 'High', status: 'completed', note: 'PCI-DSS Req-10 compliant stable host event ledger across re-IP events' }
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
    category: 'Security',
    lastUpdated: 'Aug 15, 2026',
    repository: { githubUrl: '', branch: 'main', isPublic: false },
    links: { productionUrl: '', stagingUrl: 'http://localhost:8000' },
    demoFlow: {
      completeFlow: { enabled: true, sandboxUrl: 'http://localhost:8000', credentialsHint: 'Unauthenticated by default — binds 127.0.0.1' },
      demoVideo: {
        enabled: false,
        videoUrl: '',
        videoDuration: '6:02',
        thumbnailUrl: '/mockups/pqc_concept_thumb.jpg',
        chapters: [
          { timestamp: '0:00', title: 'Intro', description: 'Harvest-Now-Decrypt-Later and why CBOMs matter' },
          { timestamp: '1:45', title: 'AWS Discovery', description: '35 read-only collectors across 42 service APIs' },
          { timestamp: '3:40', title: 'Risk & Export', description: 'NIST taxonomy, Mosca scoring, CycloneDX 1.7 CBOM export' }
        ]
      },
      contactDemo: { enabled: true, inquiryEmail: 'sales-demos@enterprise.com' }
    },
    talkTrack: 'Frame Harvest-Now-Decrypt-Later, then run a scan: watch collectors fan out, the taxonomy bin every key, and the Mosca engine score the estate. The differentiator to land: honest coverage — when a permission is denied, the report says so and names the IAM action, instead of under-reporting silently like the commercial tools.',
    versions: [
      {
        id: 'v1.2.0',
        versionNumber: 'v1.2.0',
        releaseName: 'NIST Taxonomy & Mosca Scoring',
        status: 'active',
        releaseDate: 'Aug 15, 2026',
        uniqueFeatures: [
          '35 AWS read-only collectors covering 42 service APIs',
          '10-class NIST PQC taxonomy classification (IR 8105 / SP 800-57)',
          'Mosca 6-factor quantum-adjusted risk scoring engine',
          'CycloneDX 1.7 Cryptographic BOM (CBOM) XML/JSON export'
        ],
        deployments: [
          {
            id: 'dep-p1',
            name: 'AWS Cloud CBOM Console',
            platform: 'AWS Cloud',
            env: 'Production',
            url: 'https://pqc-scanner.aws.infosec-corp.com',
            status: 'Healthy',
            regionOrPort: 'us-west-2',
            note: 'AWS Organization multi-account scanner console'
          },
          {
            id: 'dep-p2',
            name: 'Local Scanner CLI Dashboard',
            platform: 'Local Server',
            env: 'Development',
            url: 'http://localhost:8000',
            status: 'Running',
            regionOrPort: 'Port :8000',
            note: 'Local FastAPI + HTMX interactive development instance'
          }
        ]
      },
      {
        id: 'v1.0.0',
        versionNumber: 'v1.0.0',
        releaseName: 'Initial KMS Key Audit',
        status: 'deprecated',
        releaseDate: 'Mar 10, 2026',
        uniqueFeatures: [
          'KMS RSA key-length scanner only',
          'Simple CSV export'
        ],
        deployments: [
          {
            id: 'dep-p3',
            name: 'Docker Test Sandbox',
            platform: 'Docker / K8s',
            env: 'Testing',
            url: 'http://localhost:9090',
            status: 'Maintenance',
            regionOrPort: 'Container :9090',
            note: 'Isolated container image for regression verification'
          }
        ]
      }
    ],
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
      { title: 'Global-scope validation', priority: 'High', status: 'in-progress', note: 'L1: region=global stamping and CloudFront min-TLS classification, blocked on admin write access' },
      { title: 'Trigger-based coverage backlog', priority: 'Medium', status: 'planned', note: 'Coverage plan items 5.10–5.16, scheduled on demand rather than by date' },
      { title: 'Mosca 6-Factor Quantum Scoring', priority: 'High', status: 'completed', note: 'Automated CRQC risk calculations and NIST taxonomy cross-referencing' }
    ]
  }
};

export const DOMAIN_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'healthcare', label: 'HealthCare' },
  { id: 'infosec', label: 'InfoSec' }
];
