// LocalStorage CRUD for projects & demo inquiries.
// Admin saves write through here; the Demo persona reads the same store,
// so edits reflect instantly and survive reloads.
import { CATALOG_DATA } from './catalogData.js';

const PROJECTS_KEY = 'catalogue_projects';
const INQUIRIES_KEY = 'catalogue_inquiries';
const DELETED_KEY = 'catalogue_deleted_projects';

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

      projects[id] = { ...seed, ...override, demoFlow, roadmap, versions };
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

export function resetToDefaults() {
  localStorage.removeItem(PROJECTS_KEY);
  localStorage.removeItem(DELETED_KEY);
}

export function getInquiries() {
  return read(INQUIRIES_KEY) || [];
}

export function submitInquiry(inquiry) {
  const inquiries = getInquiries();
  inquiries.push({ ...inquiry, submittedAt: new Date().toISOString() });
  write(INQUIRIES_KEY, inquiries);
}

