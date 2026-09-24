// Product facts verified against source repos.
// DermaDesk:   D:\Project Files\DermaDesk
// OPD-2.0:     D:\Project Files\OpdIQ_Workspace\OPD-2.0
// CC Scanner:  CC_Number_Detection_Tool-main\deepak-scanner-update_new
// PQC Scanner: D:\Project Files\PQC New
//
// Project Collateral, Lifecycle Governance,
// and Research Studies are tracked here.

export const LIFECYCLE_STATUSES = [
  { id: 'all', label: 'All Lifecycle Statuses', color: 'slate', dotClass: 'all' },
  { id: 'active', label: 'Active Development', color: 'emerald', dotClass: 'active' },
  { id: 'on-hold', label: 'On-Hold / Paused', color: 'amber', dotClass: 'on-hold' },
  { id: 'maintenance', label: 'Production / Maintenance', color: 'sky', dotClass: 'maintenance' },
  { id: 'incubation', label: 'Incubation / PoC', color: 'purple', dotClass: 'incubation' },
  { id: 'archived', label: 'Archived / Sunset', color: 'slate', dotClass: 'archived' }
];

export const RESEARCH_STATUSES = [
  { id: 'all', label: 'All Research Statuses', color: 'slate' },
  { id: 'completed', label: 'Completed & Adopted', color: 'emerald' },
  { id: 'in-progress', label: 'Active Spike / In-Progress', color: 'amber' },
  { id: 'evaluated', label: 'Explored / Inactive', color: 'purple' }
];

export const RESEARCH_TYPES = [
  { id: 'all', label: 'All Research Types' },
  { id: 'tech-eval', label: 'Tech Spike & Tool Evaluation' },
  { id: 'competitor', label: 'Competitor & Market Analysis' },
  { id: 'feasibility', label: 'Architecture & Feasibility' },
  { id: 'user-discovery', label: 'User & Stakeholder Discovery' },
  { id: 'compliance', label: 'Security & Compliance Review' }
];

export const DELIVERABLE_CATEGORIES = [
  { id: 'presentation', label: 'Slide Deck / PPT', defaultNotes: 'Presentation & executive briefing' },
  { id: 'folder', label: 'SharePoint / Cloud Drive', defaultNotes: 'Working directory, notes & spreadsheets' },
  { id: 'code', label: 'PoC Code / Sandbox Repo', defaultNotes: 'Spike implementation sandbox' },
  { id: 'document', label: 'Document / Spec / ADR', defaultNotes: 'Architecture decision & spec' },
  { id: 'design', label: 'Design / Figma Canvas', defaultNotes: 'Interactive canvas & user flow' },
  { id: 'data', label: 'Benchmark / Dataset / Sheet', defaultNotes: 'Evaluation benchmarks & metrics' },
  { id: 'recording', label: 'Video Walkthrough', defaultNotes: 'Recorded session & demo' },
  { id: 'link', label: 'External Resource / Other', defaultNotes: 'External reference resource' }
];

export function normalizeDeliverables(deliverables) {
  if (!deliverables) return [];
  if (Array.isArray(deliverables)) {
    return deliverables.filter(d => d && (d.title || d.url));
  }
  if (Array.isArray(deliverables.items)) {
    return deliverables.items.filter(d => d && (d.title || d.url));
  }
  // Legacy object schema fallback
  const list = [];
  if (deliverables.pptUrl) {
    list.push({
      id: 'legacy-ppt',
      title: 'Slide Deck (PPT)',
      url: deliverables.pptUrl,
      type: 'presentation',
      notes: 'Internal presentation & executive summary'
    });
  }
  if (deliverables.sharepointFolder) {
    list.push({
      id: 'legacy-sp',
      title: 'SharePoint Notes Folder',
      url: deliverables.sharepointFolder,
      type: 'folder',
      notes: 'Working notes, logs, and spreadsheets'
    });
  }
  if (deliverables.prototypeUrl) {
    list.push({
      id: 'legacy-code',
      title: 'PoC Prototype Repository',
      url: deliverables.prototypeUrl,
      type: 'code',
      notes: 'Spike implementation sandbox'
    });
  }
  if (deliverables.whitepaperUrl) {
    list.push({
      id: 'legacy-doc',
      title: 'Whitepaper / Summary Report',
      url: deliverables.whitepaperUrl,
      type: 'document',
      notes: 'Published summary report'
    });
  }
  return list;
}

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
    lifecycle: {
      status: 'active',
      statusNote: 'Active sprint — Multi-lesion longitudinal tracking & FHIR export',
      lastActiveDate: 'Sep 2026',
      revivalReadiness: 'Production Ready',
      owner: 'Dr. Sarah Lin (Clinical Director)',
      department: 'Healthcare Informatics & AI'
    },
    collateral: {
      presentations: [
        {
          id: 'ppt-d1',
          title: 'Executive Client Demonstration Deck',
          type: 'Client Pitch Deck',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/demos/DermaDesk_Client_Deck_2026.pptx',
          lastModified: 'Sep 10, 2026',
          notes: '14-slide executive presentation covering intake UX, QR camera flow, and doctor verification.'
        },
        {
          id: 'ppt-d2',
          title: 'Technical Architecture & Realtime WebSockets',
          type: 'Technical Deep Dive',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/eng/DermaDesk_Architecture_Specification.pptx',
          lastModified: 'Aug 24, 2026',
          notes: 'Detailed NestJS/Next.js and Socket.IO real-time sync architecture for hospital IT review.'
        }
      ],
      sharepoint: [
        {
          id: 'sp-d1',
          title: 'Official Project Workspace Root',
          category: 'Project Root',
          url: 'https://company.sharepoint.com/sites/ClinicalAI-DermaDesk',
          notes: 'Master SharePoint site for clinical documentation, release artifacts, and department records.'
        },
        {
          id: 'sp-d2',
          title: 'Clinical PRD & Branching Question Matrix',
          category: 'PRDs & Specs',
          url: 'https://company.sharepoint.com/sites/ClinicalAI-DermaDesk/Shared%20Documents/Specs/PRD_Branching_Intake_v2.docx',
          notes: 'Complete 46-question conditional branch specification approved by clinical advisors.'
        },
        {
          id: 'sp-d3',
          title: 'HIPAA & Clinical Compliance Audit Folder',
          category: 'Compliance & Legal',
          url: 'https://company.sharepoint.com/sites/ClinicalAI-DermaDesk/Shared%20Documents/Compliance',
          notes: 'Data security review, BAA verification, and PHI isolation evidence.'
        }
      ],
      designAndDocs: [
        {
          id: 'doc-d1',
          title: 'Figma Clinical Design System & Mobile QR Flow',
          type: 'Figma',
          url: 'https://www.figma.com/file/dermadesk-clinical-ui',
          notes: 'Component library, doctor-first tablet interface, and patient zero-login mobile screens.'
        },
        {
          id: 'doc-d2',
          title: 'OpenAPI 3.1 Swagger Specification',
          type: 'API Docs',
          url: 'http://localhost:4001/api/docs',
          notes: 'NestJS REST API documentation, Socket.IO event contracts, and webhook signatures.'
        }
      ],
      recordings: [
        {
          id: 'rec-d1',
          title: 'Q3 Hospital Network Pilot Walkthrough',
          platform: 'MS Stream / Teams',
          url: 'https://company.sharepoint.com/:v:/r/demos/DermaDesk_Live_Demo_Aug2026.mp4',
          duration: '18:40',
          recordedDate: 'Aug 28, 2026',
          notes: 'Recorded live clinical walk-through with dermatology department heads.'
        }
      ],
      governance: {
        productOwner: 'Dr. Sarah Lin (Clinical Director)',
        techLead: 'Alex Mercer (Principal Engineer)',
        department: 'Healthcare Informatics & AI',
        accessLevel: 'Internal Org SSO Required'
      }
    },
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
    lifecycle: {
      status: 'active',
      statusNote: 'Active development — Gemini Live full-duplex voice intake & token synchronization',
      lastActiveDate: 'Sep 2026',
      revivalReadiness: 'Production Ready',
      owner: 'Dr. Ramesh Rao (Medical Director)',
      department: 'Clinical Operations & Telemedicine'
    },
    collateral: {
      presentations: [
        {
          id: 'ppt-o1',
          title: 'OPD Intelligence: Hospital Executive Overview',
          type: 'Client Pitch Deck',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/demos/OPD_Intelligence_Executive_Deck.pptx',
          lastModified: 'Sep 05, 2026',
          notes: 'High-level presentation for hospital boards on queue reduction and patient throughput.'
        },
        {
          id: 'ppt-o2',
          title: 'Voice Intake (Dhara) & Gemini Live Integration',
          type: 'Technical Deep Dive',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/eng/Dhara_Voice_Architecture_2026.pptx',
          lastModified: 'Aug 30, 2026',
          notes: 'Full technical breakdown of bidirectional audio streaming and clinical triage checklist.'
        }
      ],
      sharepoint: [
        {
          id: 'sp-o1',
          title: 'OPD Clinical Engineering SharePoint Portal',
          category: 'Project Root',
          url: 'https://company.sharepoint.com/sites/HospitalOps-OPD',
          notes: 'Main project drive with deployment guidelines, hospital SLA docs, and user feedback logs.'
        },
        {
          id: 'sp-o2',
          title: 'EMR Prescription Writer & Clinical Formulary Specs',
          category: 'PRDs & Specs',
          url: 'https://company.sharepoint.com/sites/HospitalOps-OPD/Shared%20Documents/Specs/Formulary_Rx_Engine.docx',
          notes: 'Medication autocomplete rules, dose frequency validators, and PDF generation specs.'
        }
      ],
      designAndDocs: [
        {
          id: 'doc-o1',
          title: 'Doctor Console & Kiosk UX Workflows',
          type: 'Figma',
          url: 'https://www.figma.com/file/opd-intelligence-console',
          notes: 'High-density doctor consultation view and accessibility-optimized kiosk touchscreens.'
        },
        {
          id: 'doc-o2',
          title: 'FastAPI Interactive Swagger & WS Protocol Docs',
          type: 'API Docs',
          url: 'http://localhost:8000/docs',
          notes: 'Interactive token issuance endpoints and real-time audio WebSocket documentation.'
        }
      ],
      recordings: [
        {
          id: 'rec-o1',
          title: 'Lobby Kiosk & Voice Intake Live Demonstration',
          platform: 'MS Stream / Teams',
          url: 'https://company.sharepoint.com/:v:/r/demos/OPD_Kiosk_Voice_Demo.mp4',
          duration: '14:20',
          recordedDate: 'Sep 02, 2026',
          notes: 'Demonstration of bilingual Hindi/English triage on physical hardware.'
        }
      ],
      governance: {
        productOwner: 'Dr. Ramesh Rao (Medical Director)',
        techLead: 'Karan Sharma (Staff Systems Engineer)',
        department: 'Hospital Systems & Clinical Workflow',
        accessLevel: 'Internal Org SSO Required'
      }
    },
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
    lifecycle: {
      status: 'active',
      statusNote: 'Active sprint — Remote prefiltering and QSA auditor signoff packages',
      lastActiveDate: 'Aug 2026',
      revivalReadiness: 'Production Ready',
      owner: 'Michael Kowalski (Head of Information Security)',
      department: 'Cyber Defense & Regulatory Compliance'
    },
    collateral: {
      presentations: [
        {
          id: 'ppt-c1',
          title: 'PCI-DSS CDD Audit & In-House Replacement Strategy',
          type: 'Client Pitch Deck',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/sec/Central_CC_Scanner_QSA_Brief.pptx',
          lastModified: 'Aug 20, 2026',
          notes: 'Presentation for executive leadership comparing ControlCase licensing against in-house CDD.'
        },
        {
          id: 'ppt-c2',
          title: 'Presidio & spaCy Detection Pipeline Architecture',
          type: 'Technical Deep Dive',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/sec/CC_Detection_Pipeline_Tech_Specs.pptx',
          lastModified: 'Aug 12, 2026',
          notes: 'Deep technical walkthrough of two-tier entropy filtering and Luhn/BIN validator.'
        }
      ],
      sharepoint: [
        {
          id: 'sp-c1',
          title: 'PCI Compliance & QSA Audit Evidence Root',
          category: 'Project Root',
          url: 'https://company.sharepoint.com/sites/Infosec-CC-Scanner',
          notes: 'Central repository of formal QSA audit attestations and tamper-evident SHA-256 logs.'
        },
        {
          id: 'sp-c2',
          title: 'PCI-DSS 4.0 Requirement 10 Compliance Matrix',
          category: 'Compliance & Legal',
          url: 'https://company.sharepoint.com/sites/Infosec-CC-Scanner/Shared%20Documents/Audit/Req10_Audit_Trail_Spec.docx',
          notes: 'Formal audit log verification guidelines signed by external PCI QSA.'
        }
      ],
      designAndDocs: [
        {
          id: 'doc-c1',
          title: 'FastAPI Scanner Console & Findings Matrix',
          type: 'Figma',
          url: 'https://www.figma.com/file/cc-scanner-console-ui',
          notes: 'Console UI wireframes, live scan telemetry, and masked findings grid.'
        },
        {
          id: 'doc-c2',
          title: 'FastAPI Scanner API Specification',
          type: 'API Docs',
          url: 'http://127.0.0.1:5050/docs',
          notes: 'Scanner management REST API and scan trigger endpoints.'
        }
      ],
      recordings: [
        {
          id: 'rec-c1',
          title: 'SMB & SFTP Fleet Scan Live Demonstration',
          platform: 'MS Stream / Teams',
          url: 'https://company.sharepoint.com/:v:/r/sec/Central_Scanner_Fleet_Run.mp4',
          duration: '11:15',
          recordedDate: 'Aug 18, 2026',
          notes: 'Full demonstration streaming files over SMB with real-time PAN masking.'
        }
      ],
      governance: {
        productOwner: 'Michael Kowalski (Head of Information Security)',
        techLead: 'Elena Rostova (Senior Security Engineer)',
        department: 'Information Security & Compliance',
        accessLevel: 'Restricted / Security Clearance Required'
      }
    },
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
    lifecycle: {
      status: 'active',
      statusNote: 'Active sprint — Global-scope validation & CycloneDX 1.7 CBOM exports',
      lastActiveDate: 'Aug 2026',
      revivalReadiness: 'Production Ready',
      owner: 'Nathan Vance (Chief Cryptographer)',
      department: 'Applied Cryptography & Quantum Resilience'
    },
    collateral: {
      presentations: [
        {
          id: 'ppt-p1',
          title: 'Post-Quantum Cryptography: The CISO Survival Guide',
          type: 'Client Pitch Deck',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/sec/PQC_Executive_Roadmap_2026.pptx',
          lastModified: 'Aug 14, 2026',
          notes: 'Executive presentation on Mosca 6-factor risk formula and CRQC horizon deadlines.'
        },
        {
          id: 'ppt-p2',
          title: 'NIST PQC Taxonomy & CBOM Schema Architecture',
          type: 'Technical Deep Dive',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/sec/NIST_Taxonomy_CBOM_TechSpecs.pptx',
          lastModified: 'Aug 02, 2026',
          notes: 'Technical specification of 35 AWS collectors and CycloneDX 1.7 schema validation.'
        }
      ],
      sharepoint: [
        {
          id: 'sp-p1',
          title: 'Quantum Resilience & NIST Migration Portal',
          category: 'Project Root',
          url: 'https://company.sharepoint.com/sites/Infosec-PQC-Migration',
          notes: 'Master SharePoint portal with NIST IR 8105 mapping, algorithm matrices, and key lifecycles.'
        },
        {
          id: 'sp-p2',
          title: 'AWS Read-Only IAM Policy Matrix & Least Privilege Specs',
          category: 'PRDs & Specs',
          url: 'https://company.sharepoint.com/sites/Infosec-PQC-Migration/Shared%20Documents/Specs/IAM_Collector_Matrix.xlsx',
          notes: 'Audit checklist for the 42 read-only AWS APIs across accounts.'
        }
      ],
      designAndDocs: [
        {
          id: 'doc-p1',
          title: 'FastAPI + HTMX PQC Dashboard Architecture',
          type: 'Figma',
          url: 'https://www.figma.com/file/pqc-scanner-dashboard',
          notes: 'Interactive cryptographic dependency graph and CBOM visualizer.'
        },
        {
          id: 'doc-p2',
          title: 'CycloneDX 1.7 Cryptographic BOM Schema Docs',
          type: 'API Docs',
          url: 'https://cyclonedx.org/capabilities/cbom/',
          notes: 'Official schema validation reference for exported CBOM XML/JSON.'
        }
      ],
      recordings: [
        {
          id: 'rec-p1',
          title: 'AWS Multi-Account Cryptographic Discovery Walkthrough',
          platform: 'MS Stream / Teams',
          url: 'https://company.sharepoint.com/:v:/r/sec/PQC_AWS_Scan_Demo.mp4',
          duration: '15:30',
          recordedDate: 'Aug 10, 2026',
          notes: 'End-to-end demonstration running 35 collectors across 3 AWS accounts with CBOM export.'
        }
      ],
      governance: {
        productOwner: 'Nathan Vance (Chief Cryptographer)',
        techLead: 'Dr. Tariq Chen (Principal Security Architect)',
        department: 'Applied Cryptography & Infrastructure Security',
        accessLevel: 'Internal Org SSO Required'
      }
    },
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
  },

  clinical_kiosk: {
    id: 'clinical_kiosk',
    domain: 'healthcare',
    name: 'OmniCare Clinical Kiosk',
    version: 'Electron + React 18',
    badge: 'Self-Service Hardware',
    tagline: 'Patient self-service biometric intake, insurance scan, and symptom triage kiosk',
    summary: 'An autonomous hospital lobby kiosk integrating a thermal boarding pass printer, contactless smartcard reader, digital pulse oximeter, and dynamic touchscreen intake. Streamlines hospital check-in before OPD doctor allocation.',
    targetClient: 'Hospital administration, public health networks, outpatient triage centers',
    arch: 'Electron kiosk runtime + React 18 frontend; local hardware serial communication daemon; secure mTLS gateway to hospital EMR',
    storage: 'Encrypted local SQLite cache with automatic purge upon session end; zero PHI persisted locally',
    protocols: 'Serial RS-232, mTLS, USB HID',
    tags: ['Healthcare', 'Hardware', 'Intake'],
    category: 'Healthcare AI',
    lastUpdated: 'May 14, 2026',
    lifecycle: {
      status: 'on-hold',
      statusNote: 'Hardware certification complete. Pilot deployment paused pending hospital physical renovation schedule (Q1 2027 planned resumption).',
      lastActiveDate: 'May 2026',
      revivalReadiness: 'High — Hardware drivers & software suite fully validated',
      owner: 'Vikram Joshi (Lead Systems Architect)',
      department: 'Clinical Devices & Embedded Systems'
    },
    collateral: {
      presentations: [
        {
          id: 'ppt-k1',
          title: 'OmniCare Kiosk: Hardware Specifications & Deployment Model',
          type: 'Architecture Overview',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/hardware/OmniCare_Kiosk_Hardware_Deck.pptx',
          lastModified: 'May 10, 2026',
          notes: 'Complete mechanical dimensions, touchscreen specs, and power backup requirements.'
        },
        {
          id: 'ppt-k2',
          title: 'Self-Service Patient Experience & Accessibility Review',
          type: 'Client Pitch Deck',
          format: 'PPTX',
          url: 'https://company.sharepoint.com/:p:/r/teams/hardware/Kiosk_Accessibility_Study.pptx',
          lastModified: 'Apr 22, 2026',
          notes: 'ADA and multilingual user experience analysis across 500 patient trial sessions.'
        }
      ],
      sharepoint: [
        {
          id: 'sp-k1',
          title: 'Kiosk Engineering & Vendor Deliverables Root',
          category: 'Project Root',
          url: 'https://company.sharepoint.com/sites/HospitalHardware-Kiosk',
          notes: 'Master SharePoint root for CAD schematics, vendor procurement contracts, and thermal printer driver files.'
        },
        {
          id: 'sp-k2',
          title: 'Biometric Security & Ephemeral Storage Architecture',
          category: 'PRDs & Specs',
          url: 'https://company.sharepoint.com/sites/HospitalHardware-Kiosk/Shared%20Documents/Specs/Kiosk_Storage_Security.docx',
          notes: 'Formal documentation verifying automatic hardware memory wiping between patient sessions.'
        }
      ],
      designAndDocs: [
        {
          id: 'doc-k1',
          title: 'High-Contrast Touchscreen Kiosk UI Flows',
          type: 'Figma',
          url: 'https://www.figma.com/file/omnicare-kiosk-ui',
          notes: 'Large touch targets, virtual numeric keypads, and multilingual voice-over prompts.'
        }
      ],
      recordings: [
        {
          id: 'rec-k1',
          title: 'Physical Kiosk Hardware Simulation & Ticket Printing Demo',
          platform: 'MS Stream / Teams',
          url: 'https://company.sharepoint.com/:v:/r/hardware/Kiosk_Hardware_Lab_Demo.mp4',
          duration: '08:45',
          recordedDate: 'May 04, 2026',
          notes: 'Live lab test demonstrating smartcard scan, symptom selection, and thermal token generation.'
        }
      ],
      governance: {
        productOwner: 'Vikram Joshi (Lead Systems Architect)',
        techLead: 'Anita Deshmukh (Embedded Firmware Engineer)',
        department: 'Clinical Devices & Embedded Systems',
        accessLevel: 'Internal Org SSO Required'
      }
    },
    repository: { githubUrl: '', branch: 'main', isPublic: false },
    links: { productionUrl: '', stagingUrl: 'http://localhost:3000' },
    demoFlow: {
      completeFlow: { enabled: true, sandboxUrl: 'http://localhost:3000', credentialsHint: 'Hardware simulator mode' },
      demoVideo: {
        enabled: true,
        videoUrl: 'https://mdn.github.io/shared-assets/videos/flower.mp4',
        videoDuration: '3:15',
        videoFileName: 'kiosk-hardware-overview.mp4',
        videoSpecs: 'MP4 • 1280x720 • 31.4 MB',
        thumbnailUrl: '/mockups/opd_concept_thumb.jpg',
        chapters: [
          { timestamp: '0:00', title: 'Intro', description: 'Patient self-service check-in kiosk overview' },
          { timestamp: '1:10', title: 'Hardware Integration', description: 'Smartcard reader and thermal ticket printer' },
          { timestamp: '2:15', title: 'Triage Flow', description: 'Bilingual symptom selection and token issuance' }
        ]
      },
      contactDemo: { enabled: true, inquiryEmail: 'sales-demos@enterprise.com' }
    },
    versions: [
      {
        id: 'v1.2.0',
        versionNumber: 'v1.2.0',
        releaseName: 'Embedded Hardware Suite',
        status: 'beta',
        releaseDate: 'May 14, 2026',
        uniqueFeatures: [
          'High-contrast accessible touch interface with 4 language options',
          'USB thermal ticket printer driver with custom barcode rendering',
          'Ephemeral patient session memory with instantaneous zero-wipe',
          'Offline-tolerant queue token fallback when network is interrupted'
        ],
        deployments: [
          {
            id: 'dep-k1',
            name: 'Hardware Test Lab Node',
            platform: 'Local Server',
            env: 'Development',
            url: 'http://localhost:3000',
            status: 'Maintenance',
            regionOrPort: 'USB Serial :COM4',
            note: 'Physical touchscreen prototype connected to test bench'
          }
        ]
      }
    ],
    deployments: [
      { name: 'Kiosk Touch Simulator', env: 'Web :3000', url: 'http://localhost:3000', status: 'Simulated hardware touch mode', color: 'amber' }
    ],
    features: [
      { name: 'Self-Service Patient Registration', status: 'Paused', note: 'Full demographic capture and insurance card barcode scanner' },
      { name: 'Thermal Ticket Printing', status: 'Paused', note: 'High-speed 80mm thermal token print with QR check-in token' },
      { name: 'Multilingual Audio Prompts', status: 'Paused', note: 'Spoken guidance in English, Hindi, and regional dialects' }
    ],
    roadmap: [
      { title: 'Hospital Network Pilot', priority: 'High', status: 'planned', note: 'Pending hospital renovation schedule (Q1 2027)' },
      { title: 'Contactless Palm Biometrics', priority: 'Low', status: 'planned', note: 'Experimental biometric identification evaluation' }
    ]
  }
};

export const RESEARCH_DATA = {
  'spike-derm1m': {
    id: 'spike-derm1m',
    code: 'SPIKE-DERM-01',
    title: 'Multimodal Clinical Feasibility: Gemini 1.5 Pro vs Local Vision for Dermatology Triage',
    projectId: 'dermadesk',
    projectName: 'DermaDesk AI',
    domain: 'healthcare',
    type: 'tech-eval',
    status: 'completed',
    author: 'Arjun Mehta (Principal ML Engineer) & Dr. Sarah Lin (Clinical Lead)',
    leadResearchers: ['Arjun Mehta (Principal ML Engineer)', 'Dr. Sarah Lin (Clinical Lead)'],
    authorDetails: {
      name: 'Arjun Mehta',
      role: 'Principal ML Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    metric: {
      value: '94.2%',
      label: 'Agreement',
      context: 'Model agreement with dermatologist consensus',
      icon: 'trending-up'
    },
    illustrationType: 'derm-images',
    date: 'Aug 2026',
    context: 'Evaluated multimodal LLM (Gemini 1.5 Pro) against a local vision model for dermatology image triage across clinical scenarios and skin conditions.',
    abstract: 'Evaluated multimodal LLM (Gemini 1.5 Pro) against a local vision model for dermatology image triage across clinical scenarios and skin conditions.',
    decision: 'Adopted Gemini 1.5 Pro multimodal API with mandatory physician sign-off. Combined clinical intake answers (ABCD criteria) with photos to cut false alarms by 42%.',
    keyTakeaways: [
      'Pure image classification missed key context; combining the 6-step patient questionnaire with photos improved clinical agreement to 94.2%.',
      'Physician review UI must highlight the AI reasoning step-by-step to prevent doctors from blindly trusting or rejecting suggestions.',
      'Average inference took 2.1 seconds; implemented background worker queue with real-time UI polling so doctors never see a frozen screen.',
      'Decision: Implemented as core differential advisory module in DermaDesk v1.0.'
    ],
    keyFindings: [
      'Pure image classification missed key context; combining the 6-step patient questionnaire with photos improved clinical agreement to 94.2%.',
      'Physician review UI must highlight the AI reasoning step-by-step to prevent doctors from blindly trusting or rejecting suggestions.',
      'Average inference took 2.1 seconds; implemented background worker queue with real-time UI polling so doctors never see a frozen screen.',
      'Decision: Implemented as core differential advisory module in DermaDesk v1.0.'
    ],
    deliverables: {
      pptUrl: 'https://company.sharepoint.com/:p:/r/research/Derm_Model_Spike_Clinical_Deck.pptx',
      sharepointFolder: 'https://company.sharepoint.com/sites/rnd/Derm-Intake-AI-Evaluation',
      prototypeUrl: 'https://github.com/enterprise/derm-model-benchmark-poc',
      whitepaperUrl: 'https://company.sharepoint.com/:b:/r/research/Derm_Model_Spike_Summary.pdf'
    },
    relatedProjects: ['dermadesk'],
    tags: ['Tech Spike', 'Gemini AI', 'Clinical Triage', 'Dermatology']
  },

  'spike-pqc-perf': {
    id: 'spike-pqc-perf',
    code: 'SPIKE-PQC-02',
    title: 'Latency Spike & AWS KMS Evaluation for Post-Quantum TLS Handshakes',
    projectId: 'pqc_scanner',
    projectName: 'Panacea PQC Scanner',
    domain: 'infosec',
    type: 'feasibility',
    status: 'in-progress',
    author: 'Priya Nair (Senior Security Engineer) & Cryptography Team',
    leadResearchers: ['Priya Nair (Senior Security Engineer)', 'Nathan Vance'],
    authorDetails: {
      name: 'Priya Nair',
      role: 'Senior Security Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    metric: {
      value: '+11.4ms',
      label: 'Overhead',
      context: 'Median latency increase in PQC TLS handshake (p50)',
      icon: 'clock'
    },
    illustrationType: 'pqc-shield',
    date: 'Sep 2026',
    context: 'Measured latency impact of post-quantum key exchanges in TLS handshakes and evaluated AWS KMS performance with hybrid PQC configurations.',
    abstract: 'Measured latency impact of post-quantum key exchanges in TLS handshakes and evaluated AWS KMS performance with hybrid PQC configurations.',
    decision: 'Approved hybrid TLS for client edge proxies. Latency impact was negligible (+11.4ms). Added automated CycloneDX 1.7 CBOM scanning directly into CI/CD pipelines to catch legacy RSA keys.',
    keyTakeaways: [
      'Synthetic load testing (15,000 req/sec) showed hybrid X25519 + ML-KEM-768 only added 11.4ms overhead over standard TLS 1.3.',
      'Automated CBOM extraction across AWS CloudTrail and KMS identified 83 unmanaged classical RSA-2048 keys across internal accounts.',
      'Estimated AWS KMS API costs increase by less than $140/month per production account.',
      'Decision: Standardized as the Mosca 6-factor risk algorithm in Panacea PQC Scanner.'
    ],
    keyFindings: [
      'Synthetic load testing (15,000 req/sec) showed hybrid X25519 + ML-KEM-768 only added 11.4ms overhead over standard TLS 1.3.',
      'Automated CBOM extraction across AWS CloudTrail and KMS identified 83 unmanaged classical RSA-2048 keys across internal accounts.',
      'Estimated AWS KMS API costs increase by less than $140/month per production account.',
      'Decision: Standardized as the Mosca 6-factor risk algorithm in Panacea PQC Scanner.'
    ],
    deliverables: {
      pptUrl: 'https://company.sharepoint.com/:p:/r/research/PQC_Spike_Executive_Review.pptx',
      sharepointFolder: 'https://company.sharepoint.com/sites/rnd/PQC-KMS-Spike',
      prototypeUrl: 'https://github.com/enterprise/pqc-handshake-load-test',
      whitepaperUrl: 'https://company.sharepoint.com/:b:/r/research/PQC_Architecture_Decision_Record.pdf'
    },
    relatedProjects: ['pqc_scanner'],
    tags: ['Architecture Spike', 'Post-Quantum', 'AWS KMS', 'TLS 1.3']
  },

  'spike-ambient-nlp': {
    id: 'spike-ambient-nlp',
    code: 'SPIKE-OPD-03',
    title: 'Speech-to-Text Benchmark: Whisper vs Azure Speech for Multilingual OPD Clinics',
    projectId: 'opd',
    projectName: 'Panacea OPD AI Assistant',
    domain: 'healthcare',
    type: 'tech-eval',
    status: 'in-progress',
    author: 'Ramesh Patel (Backend Lead & Voice Team)',
    leadResearchers: ['Ramesh Patel (Backend Lead)', 'Alex Mercer'],
    authorDetails: {
      name: 'Ramesh Patel',
      role: 'Backend Lead & Audio AI',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    metric: {
      value: '4.3%',
      label: 'Error Rate',
      context: 'Medical drug name error rate with pharmacopeia vocabulary biasing',
      icon: 'check-circle'
    },
    illustrationType: 'audio-wave',
    date: 'Sep 2026',
    context: 'Hospital partners required voice dictation for outpatient clinics where doctors speak mixed Hindi-English (Hinglish) with heavy ambient background noise.',
    abstract: 'Hospital partners required voice dictation for outpatient clinics where doctors speak mixed Hindi-English (Hinglish) with heavy ambient background noise.',
    decision: 'Trialling fine-tuned Whisper-large-v3 locally with custom medical drug vocabulary biasing. Cloud APIs had lower latency but failed hospital data sovereignty audits.',
    keyTakeaways: [
      'Injecting hospital pharmacopeia vocabulary into the prompt reduced medical drug name spelling errors from 14.2% down to 4.3%.',
      'Dual-directional microphone arrays cut waiting-room chatter distortion by 35% compared to standard laptop built-in microphones.',
      'SOAP clinical note extraction completed in 1.75 seconds post-consultation with zero physician prompt typing.',
      'Next Step: Live clinical room pilot scheduled across 3 outpatient chambers in Q4 2026.'
    ],
    keyFindings: [
      'Injecting hospital pharmacopeia vocabulary into the prompt reduced medical drug name spelling errors from 14.2% down to 4.3%.',
      'Dual-directional microphone arrays cut waiting-room chatter distortion by 35% compared to standard laptop built-in microphones.',
      'SOAP clinical note extraction completed in 1.75 seconds post-consultation with zero physician prompt typing.',
      'Next Step: Live clinical room pilot scheduled across 3 outpatient chambers in Q4 2026.'
    ],
    deliverables: {
      pptUrl: 'https://company.sharepoint.com/:p:/r/research/OPD_Voice_Spike_Deck.pptx',
      sharepointFolder: 'https://company.sharepoint.com/sites/rnd/OPD-Voice-Benchmarking',
      prototypeUrl: 'https://github.com/enterprise/opd-whisper-streaming-poc',
      whitepaperUrl: 'https://company.sharepoint.com/:b:/r/research/OPD_Voice_Trial_Report.pdf'
    },
    relatedProjects: ['opd'],
    tags: ['Tech Spike', 'Whisper AI', 'Clinical Audio', 'Hinglish NLP']
  },

  'spike-agentless-pan': {
    id: 'spike-agentless-pan',
    code: 'SPIKE-CC-04',
    title: 'Competitor & Architecture Review: Agentless vs Agent-Based Card Data Scanning',
    projectId: 'cc_scanner',
    projectName: 'Central CC Scanner',
    domain: 'infosec',
    type: 'competitor',
    status: 'completed',
    author: 'Michael Kowalski (Cyber Defense Lead) & Security Eng',
    leadResearchers: ['Michael Kowalski (Cyber Defense Lead)', 'Elena Rostova'],
    authorDetails: {
      name: 'Michael Kowalski',
      role: 'Cyber Defense Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    metric: {
      value: '91.6%',
      label: 'Pre-filtered',
      context: 'Binary files eliminated prior to CPU-heavy checksum validation',
      icon: 'shield-check'
    },
    illustrationType: 'stream-audit',
    date: 'Jul 2026',
    context: 'Investigated zero-agent network memory streaming with Shannon entropy pre-filtering for enterprise servers.',
    abstract: 'Investigated zero-agent network memory streaming with Shannon entropy pre-filtering for enterprise servers.',
    decision: 'Built agentless SMB/SSH memory streaming with two-stage Shannon entropy pre-filtering. Avoids any agent software installation on client servers and achieved full PCI-DSS 4.0 audit acceptance.',
    keyTakeaways: [
      'Enterprise security teams gave 100% approval to agentless scanning vs only 20% willing to approve kernel agents on critical machines.',
      'Shannon entropy pre-filtering eliminated 91.6% of binary files prior to executing CPU-heavy Luhn Mod-10 checksum validation.',
      'Zero target system CPU penalty observed during 4.2 GB/sec synthetic network stress scanning.',
      'Decision: Standardized agentless architecture for Central CC Scanner production releases.'
    ],
    keyFindings: [
      'Enterprise security teams gave 100% approval to agentless scanning vs only 20% willing to approve kernel agents on critical machines.',
      'Shannon entropy pre-filtering eliminated 91.6% of binary files prior to executing CPU-heavy Luhn Mod-10 checksum validation.',
      'Zero target system CPU penalty observed during 4.2 GB/sec synthetic network stress scanning.',
      'Decision: Standardized agentless architecture for Central CC Scanner production releases.'
    ],
    deliverables: {
      pptUrl: 'https://company.sharepoint.com/:p:/r/research/Agentless_Scanning_Architecture.pptx',
      sharepointFolder: 'https://company.sharepoint.com/sites/rnd/Agentless-Card-Discovery',
      prototypeUrl: 'https://github.com/enterprise/pan-entropy-streamer',
      whitepaperUrl: 'https://company.sharepoint.com/:b:/r/research/Agentless_DLP_Strategy.pdf'
    },
    relatedProjects: ['cc_scanner'],
    tags: ['Competitor Analysis', 'Agentless', 'PCI DSS', 'Shannon Entropy']
  },

  'spike-kiosk-ux': {
    id: 'spike-kiosk-ux',
    code: 'DISCOVERY-KIOSK-05',
    title: 'User Discovery & Space Constraints for Hospital Check-In Kiosks',
    projectId: 'omnicare_kiosk',
    projectName: 'OmniCare Clinical Kiosk',
    domain: 'healthcare',
    type: 'user-discovery',
    status: 'evaluated',
    author: 'Elena Rostova (Staff UX Researcher) & Hospital Ops',
    leadResearchers: ['Elena Rostova (Staff UX Researcher)', 'Hospital Operations Team'],
    authorDetails: {
      name: 'Elena Rostova',
      role: 'Staff UX Researcher',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    metric: {
      value: '88%',
      label: 'Completion',
      context: 'Patient self-checkout completion rate with 21.5" displays',
      icon: 'users'
    },
    illustrationType: 'kiosk-touch',
    date: 'May 2026',
    context: 'Conducted observational ergonomic studies across 35 staff and 60 patients for outpatient kiosk touchscreens.',
    abstract: 'Conducted observational ergonomic studies across 35 staff and 60 patients for outpatient kiosk touchscreens.',
    decision: 'Recommended pausing large floor-standing hardware rollout due to lobby renovation and tight space constraints. Recommended pivoting to lightweight wall-mounted tablet units for Q1 2027.',
    keyTakeaways: [
      'Elderly patients struggled with small fonts on 15-inch displays; 21.5-inch screens with audio feedback achieved an 88% self-checkout completion rate.',
      'Hospital lobby floor plan was 40% tighter than architectural drawings due to mandatory emergency exit corridors.',
      'Wall-mount tablet enclosures save $3,400 per unit compared to custom metal kiosk cabinetry.',
      'Decision: Kiosk project placed on hold pending hospital renovation; specs updated for wall-mounted tablet units.'
    ],
    keyFindings: [
      'Elderly patients struggled with small fonts on 15-inch displays; 21.5-inch screens with audio feedback achieved an 88% self-checkout completion rate.',
      'Hospital lobby floor plan was 40% tighter than architectural drawings due to mandatory emergency exit corridors.',
      'Wall-mount tablet enclosures save $3,400 per unit compared to custom metal kiosk cabinetry.',
      'Decision: Kiosk project placed on hold pending hospital renovation; specs updated for wall-mounted tablet units.'
    ],
    deliverables: {
      pptUrl: 'https://company.sharepoint.com/:p:/r/research/Kiosk_UX_Discovery_Findings.pptx',
      sharepointFolder: 'https://company.sharepoint.com/sites/rnd/Kiosk-Hardware-Discovery',
      prototypeUrl: 'https://www.figma.com/design/sample-kiosk-ergonomics-2026',
      whitepaperUrl: 'https://company.sharepoint.com/:b:/r/research/Kiosk_Field_Study_Report.pdf'
    },
    relatedProjects: ['omnicare_kiosk'],
    tags: ['User Discovery', 'Hardware Spike', 'Ergonomics', 'Healthcare Ops']
  }
};

export const DOMAIN_FILTERS = [
  { id: 'all', label: 'All Domains' },
  { id: 'healthcare', label: 'HealthCare' },
  { id: 'infosec', label: 'InfoSec' }
];
