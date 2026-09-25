// LocalStorage CRUD for projects, demo inquiries, and research studies.
// Admin saves write through here; the Demo persona reads the same store,
// so edits reflect instantly and survive reloads.
import { CATALOG_DATA, RESEARCH_DATA } from './catalogData.js';

const PROJECTS_KEY = 'catalogue_projects';
const INQUIRIES_KEY = 'catalogue_inquiries';
const DELETED_KEY = 'catalogue_deleted_projects';
const RESEARCHES_KEY = 'catalogue_researches';
const DELETED_RESEARCH_KEY = 'catalogue_deleted_researches';

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export function createDefaultProject() {
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;
  const id = `project-${Date.now()}`;

  return {
    id,
    domain: 'healthcare',
    name: '',
    version: '1.0.0',
    badge: 'Enterprise Solution',
    tagline: '',
    summary: '',
    targetClient: 'Enterprise clients, department heads, system architects',
    arch: 'Modern Web Stack',
    storage: 'Cloud Database',
    protocols: 'REST, WebSocket',
    tags: ['AI', 'Platform'],
    category: 'Healthcare AI',
    lastUpdated: formattedDate,
    bannerTag: 'NEW',
    lifecycle: {
      status: 'active',
      statusNote: 'Active sprint initiative',
      lastActiveDate: formattedDate,
      revivalReadiness: 'Production Ready',
      owner: 'Product Team Lead',
      department: 'Engineering & Architecture'
    },
    collateral: {
      presentations: [
        {
          id: `ppt-${Date.now()}`,
          title: 'Executive Client Presentation Deck',
          type: 'Client Pitch Deck',
          format: 'PPTX',
          url: '',
          lastModified: formattedDate,
          notes: 'Standard client pitch and demonstration deck'
        }
      ],
      sharepoint: [
        {
          id: `sp-${Date.now()}`,
          title: 'Project Official SharePoint Site',
          category: 'Project Root',
          url: '',
          notes: 'Primary collaboration folder on SharePoint'
        }
      ],
      designAndDocs: [],
      recordings: [],
      governance: {
        productOwner: '',
        techLead: '',
        department: '',
        accessLevel: 'Internal Org SSO Required'
      }
    },
    repository: { githubUrl: '', branch: 'main', isPublic: false },
    links: { productionUrl: '', stagingUrl: '' },
    demoFlow: {
      completeFlow: {
        enabled: true,
        sandboxUrl: 'http://localhost:3000',
        credentialsHint: 'No login required'
      },
      demoVideo: {
        enabled: false,
        videoUrl: 'https://mdn.github.io/shared-assets/videos/flower.mp4',
        videoDuration: '2:00',
        videoFileName: '',
        videoSpecs: '',
        thumbnailUrl: '',
        chapters: [
          { timestamp: '0:00', title: 'Product Overview', description: 'Introduction to key capabilities' }
        ]
      },
      contactDemo: {
        enabled: true,
        inquiryEmail: 'sales-demos@enterprise.com'
      }
    },
    talkTrack: '',
    versions: [
      {
        id: 'v1.0.0',
        versionNumber: 'v1.0.0',
        releaseName: 'Initial Release',
        status: 'active',
        releaseDate: formattedDate,
        uniqueFeatures: [
          'Interactive client demonstration flow'
        ],
        deployments: [
          {
            id: `dep-${Date.now()}-1`,
            name: 'Local Dev Server',
            platform: 'Local Server',
            env: 'Development',
            url: 'http://localhost:3000',
            status: 'Running',
            regionOrPort: 'Port :3000',
            note: 'Local developer sandbox'
          }
        ]
      }
    ],
    deployments: [
      { name: 'Live Web Demo', env: 'Web Sandbox', url: 'http://localhost:3000', status: 'Active demo instance', color: 'emerald' }
    ],
    features: [
      { name: 'Primary Capability', status: 'Live', note: 'Interactive client demonstration mode' }
    ],
    roadmap: [
      { title: 'Enterprise System Integration', priority: 'High', status: 'in-progress', note: 'Standardized REST/webhook endpoints and external system interoperability connectors' },
      { title: 'Advanced Role-Based Access Controls', priority: 'Medium', status: 'planned', note: 'Fine-grained permission matrices, audit logs, and unified SSO/SAML authentication' },
      { title: 'Mobile & Offline Optimization', priority: 'Low', status: 'planned', note: 'Local client caching and background sync for low-connectivity environments' },
      { title: 'Core Architecture Foundation', priority: 'High', status: 'completed', note: 'Secure API infrastructure, schema migrations, and real-time event pipeline' }
    ]
  };
}

export function getProjects() {
  const overrides = read(PROJECTS_KEY) || {};
  const deleted = new Set(read(DELETED_KEY) || []);
  const projects = {};
  for (const [id, seed] of Object.entries(CATALOG_DATA)) {
    if (deleted.has(id)) continue;
    const override = overrides[id];
    if (override) {
      const rawRoadmap = (Array.isArray(override.roadmap) && override.roadmap.length > 0)
        ? override.roadmap
        : (seed.roadmap || null);
      const roadmap = rawRoadmap ? rawRoadmap.map(r => ({ ...r, status: r.status || 'planned' })) : null;

      const rawVersions = (Array.isArray(override.versions) && override.versions.length > 0)
        ? override.versions
        : (seed.versions || null);
      const versions = rawVersions ? structuredClone(rawVersions) : null;

      const demoFlow = {
        ...seed.demoFlow,
        ...(override.demoFlow || {}),
        demoVideo: {
          ...seed.demoFlow?.demoVideo,
          ...(override.demoFlow?.demoVideo || {}),
          thumbnailUrl: override.demoFlow?.demoVideo?.thumbnailUrl || seed.demoFlow?.demoVideo?.thumbnailUrl || ''
        }
      };

      const lifecycle = {
        ...seed.lifecycle,
        ...(override.lifecycle || {})
      };

      const collateral = {
        ...seed.collateral,
        ...(override.collateral || {})
      };

      projects[id] = { ...seed, ...override, demoFlow, roadmap, versions, lifecycle, collateral };
    } else {
      const baseRoadmap = seed.roadmap ? seed.roadmap.map(r => ({ ...r, status: r.status || 'planned' })) : null;
      const baseVersions = seed.versions ? structuredClone(seed.versions) : null;
      projects[id] = { ...structuredClone(seed), roadmap: baseRoadmap, versions: baseVersions };
    }
  }
  // Projects added at runtime (no seed) survive too
  for (const [id, extra] of Object.entries(overrides)) {
    if (!projects[id] && !deleted.has(id)) projects[id] = extra;
  }
  return projects;
}

export function saveProject(project) {
  const overrides = read(PROJECTS_KEY) || {};
  overrides[project.id] = project;
  write(PROJECTS_KEY, overrides);
  const deleted = new Set(read(DELETED_KEY) || []);
  if (deleted.has(project.id)) {
    deleted.delete(project.id);
    write(DELETED_KEY, Array.from(deleted));
  }
}

export function deleteProject(id) {
  const overrides = read(PROJECTS_KEY) || {};
  delete overrides[id];
  write(PROJECTS_KEY, overrides);
  const deleted = new Set(read(DELETED_KEY) || []);
  deleted.add(id);
  write(DELETED_KEY, Array.from(deleted));
}

// ----------------------------------------------------
// Research Studies CRUD
// ----------------------------------------------------

export function createDefaultResearch() {
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  const id = `res-${Date.now()}`;
  const codeNum = String(Date.now()).slice(-4);

  return {
    id,
    code: `RES-${codeNum}`,
    title: '',
    projectId: '',
    projectName: '',
    domain: 'healthcare',
    type: 'tech-eval',
    status: 'completed',
    author: 'Engineering & Product Team',
    leadResearchers: ['Engineering & Product Team'],
    date: formattedDate,
    context: '',
    abstract: '',
    decision: '',
    keyTakeaways: [
      'Preliminary evaluation highlights initial baseline findings.',
      'Recommended proceeding with proof-of-concept testing.'
    ],
    keyFindings: [
      'Preliminary evaluation highlights initial baseline findings.',
      'Recommended proceeding with proof-of-concept testing.'
    ],
    deliverables: {
      pptUrl: '',
      sharepointFolder: '',
      prototypeUrl: '',
      notesUrl: '',
      whitepaperUrl: ''
    },
    relatedProjects: [],
    tags: ['Technology Evaluation', 'Internal Research']
  };
}

export function getResearches() {
  const overrides = read(RESEARCHES_KEY) || {};
  const deleted = new Set(read(DELETED_RESEARCH_KEY) || []);
  const researches = {};

  for (const [id, seed] of Object.entries(RESEARCH_DATA)) {
    if (deleted.has(id)) continue;
    const override = overrides[id];
    if (override) {
      researches[id] = { ...seed, ...override };
    } else {
      researches[id] = structuredClone(seed);
    }
  }

  // Runtime added
  for (const [id, extra] of Object.entries(overrides)) {
    if (!researches[id] && !deleted.has(id)) {
      researches[id] = extra;
    }
  }

  return researches;
}

export function saveResearch(research) {
  const overrides = read(RESEARCHES_KEY) || {};
  overrides[research.id] = research;
  write(RESEARCHES_KEY, overrides);
  const deleted = new Set(read(DELETED_RESEARCH_KEY) || []);
  if (deleted.has(research.id)) {
    deleted.delete(research.id);
    write(DELETED_RESEARCH_KEY, Array.from(deleted));
  }
}

export function deleteResearch(id) {
  const overrides = read(RESEARCHES_KEY) || {};
  delete overrides[id];
  write(RESEARCHES_KEY, overrides);
  const deleted = new Set(read(DELETED_RESEARCH_KEY) || []);
  deleted.add(id);
  write(DELETED_RESEARCH_KEY, Array.from(deleted));
}

export function resetToDefaults() {
  localStorage.removeItem(PROJECTS_KEY);
  localStorage.removeItem(DELETED_KEY);
  localStorage.removeItem(RESEARCHES_KEY);
  localStorage.removeItem(DELETED_RESEARCH_KEY);
}

export function getInquiries() {
  return read(INQUIRIES_KEY) || [];
}

export function submitInquiry(inquiry) {
  const inquiries = getInquiries();
  inquiries.push({ ...inquiry, submittedAt: new Date().toISOString() });
  write(INQUIRIES_KEY, inquiries);
}
