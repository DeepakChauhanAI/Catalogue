import React, { useRef, useState } from 'react';
import {
  ArrowLeft, Info, MonitorPlay, ImageIcon, Settings, Play, Trash2, Upload,
  CheckCircle, Plus, X, MessageSquareQuote, Milestone, ChevronLeft, ChevronRight,
  Server, Cloud, Sparkles, FileText, Presentation, Folder, PauseCircle
} from 'lucide-react';

const TABS = [
  { id: 'info', label: 'Project Info & Lifecycle', icon: Info },
  { id: 'collateral', label: 'Collateral & Documents', icon: FileText },
  { id: 'deployments', label: 'Deployments & Versions', icon: Server },
  { id: 'demo', label: 'Demo Mode', icon: MonitorPlay },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'roadmap', label: 'Roadmap', icon: Milestone },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const TOGGLES = [
  {
    path: 'completeFlow.enabled',
    title: 'Complete Flow Demo',
    desc: 'Allow users to experience the interactive demo flow'
  },
  {
    path: 'demoVideo.enabled',
    title: 'Demo Video',
    desc: 'Show demo video on the project card'
  },
  {
    path: 'contactDemo.enabled',
    title: 'Contact Us for Demo',
    desc: 'Show contact form to request a live demo'
  }
];

const mb = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// Reads real width/height from the picked file so the specs line is honest
function probeVideo(file, objectUrl) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      resolve({ width: v.videoWidth || 1280, height: v.videoHeight || 720 });
      URL.revokeObjectURL(v.src);
    };
    v.onerror = () => resolve({ width: 1280, height: 720 });
    v.src = objectUrl;
  });
}

export default function EditProjectView({ project, isNew = false, onCancel, onSave }) {
  const [tab, setTab] = useState('info');
  const [draft, setDraft] = useState(() => {
    const d = structuredClone(project);
    if (!Array.isArray(d.versions) || d.versions.length === 0) {
      d.versions = [
        {
          id: 'v1.0.0',
          versionNumber: d.version || 'v1.0.0',
          releaseName: 'Initial Release',
          status: 'active',
          releaseDate: d.lastUpdated || 'Sep 2026',
          uniqueFeatures: (d.features || []).map(f => f.name),
          deployments: (d.deployments || []).map((dep, i) => ({
            id: `dep-${i}`,
            name: dep.name,
            platform: dep.env?.includes('3000') || dep.env?.includes('5173') || dep.env?.includes('8000') ? 'Local Server' : 'AWS Cloud',
            env: 'Production',
            url: dep.url,
            status: 'Healthy',
            regionOrPort: dep.env,
            note: dep.status
          }))
        }
      ];
    }
    return d;
  });

  const [activeVersionIdx, setActiveVersionIdx] = useState(0);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [error, setError] = useState('');
  // ponytail: uploaded video persists as metadata only — localStorage can't
  // hold blobs, so the preview URL is session-scoped. Upgrade path: object
  // store / IndexedDB when real uploads matter.
  const [upload, setUpload] = useState(null); // { url, name, specs } from a picked file
  const [progress, setProgress] = useState(null); // 0–100 while "uploading"
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const [newPpt, setNewPpt] = useState({ title: '', type: 'Client Pitch Deck', format: 'PPTX', url: '', notes: '' });
  const [newSp, setNewSp] = useState({ title: '', category: 'PRDs & Specs', url: '', notes: '' });
  const [newDoc, setNewDoc] = useState({ title: '', type: 'Figma', url: '', notes: '' });

  const addPpt = () => {
    if (!newPpt.title?.trim() || !newPpt.url?.trim()) return;
    const current = draft.collateral?.presentations || [];
    const item = {
      ...newPpt,
      id: `ppt-${Date.now()}`,
      lastModified: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setField('collateral.presentations', [...current, item]);
    setNewPpt({ title: '', type: 'Client Pitch Deck', format: 'PPTX', url: '', notes: '' });
  };

  const removePpt = (idx) => {
    const current = draft.collateral?.presentations || [];
    setField('collateral.presentations', current.filter((_, i) => i !== idx));
  };

  const addSp = () => {
    if (!newSp.title?.trim() || !newSp.url?.trim()) return;
    const current = draft.collateral?.sharepoint || [];
    const item = { ...newSp, id: `sp-${Date.now()}` };
    setField('collateral.sharepoint', [...current, item]);
    setNewSp({ title: '', category: 'PRDs & Specs', url: '', notes: '' });
  };

  const removeSp = (idx) => {
    const current = draft.collateral?.sharepoint || [];
    setField('collateral.sharepoint', current.filter((_, i) => i !== idx));
  };

  const addDoc = () => {
    if (!newDoc.title?.trim() || !newDoc.url?.trim()) return;
    const current = draft.collateral?.designAndDocs || [];
    const item = { ...newDoc, id: `doc-${Date.now()}` };
    setField('collateral.designAndDocs', [...current, item]);
    setNewDoc({ title: '', type: 'Figma', url: '', notes: '' });
  };

  const removeDoc = (idx) => {
    const current = draft.collateral?.designAndDocs || [];
    setField('collateral.designAndDocs', current.filter((_, i) => i !== idx));
  };

  const addVersion = () => {
    const currentVers = Array.isArray(draft.versions) ? draft.versions : [];
    const nextNum = `v${currentVers.length + 1}.0.0`;
    const newVer = {
      id: `ver-${Date.now()}`,
      versionNumber: nextNum,
      releaseName: 'Feature Release',
      status: 'beta',
      releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      uniqueFeatures: [],
      deployments: [
        {
          id: `dep-${Date.now()}`,
          name: 'Local Dev Server',
          platform: 'Local Server',
          env: 'Development',
          url: 'http://localhost:3000',
          status: 'Running',
          regionOrPort: 'Port :3000',
          note: 'Sandbox instance'
        }
      ]
    };
    setDraft(prev => ({ ...prev, versions: [...currentVers, newVer] }));
    setActiveVersionIdx(currentVers.length);
  };

  const removeVersion = (idx) => {
    if (draft.versions.length <= 1) {
      setError('A project must have at least one version.');
      return;
    }
    setDraft(prev => {
      const next = prev.versions.filter((_, i) => i !== idx);
      return { ...prev, versions: next };
    });
    setActiveVersionIdx(Math.max(0, idx - 1));
  };

  const updateVersionField = (verIdx, field, val) => {
    setDraft(prev => {
      const next = structuredClone(prev);
      if (!next.versions[verIdx]) return next;
      next.versions[verIdx][field] = val;
      return next;
    });
  };

  const addUniqueFeature = (verIdx) => {
    const trimmed = newFeatureText.trim();
    if (!trimmed) return;
    setDraft(prev => {
      const next = structuredClone(prev);
      if (!next.versions[verIdx]) return next;
      if (!Array.isArray(next.versions[verIdx].uniqueFeatures)) {
        next.versions[verIdx].uniqueFeatures = [];
      }
      next.versions[verIdx].uniqueFeatures.push(trimmed);
      return next;
    });
    setNewFeatureText('');
  };

  const removeUniqueFeature = (verIdx, featIdx) => {
    setDraft(prev => {
      const next = structuredClone(prev);
      if (!next.versions[verIdx] || !Array.isArray(next.versions[verIdx].uniqueFeatures)) return next;
      next.versions[verIdx].uniqueFeatures.splice(featIdx, 1);
      return next;
    });
  };

  const addDeploymentTarget = (verIdx) => {
    const newDep = {
      id: `dep-${Date.now()}`,
      name: 'AWS Cloud Instance',
      platform: 'AWS Cloud',
      env: 'Production',
      url: 'https://',
      status: 'Healthy',
      regionOrPort: 'us-east-1',
      note: ''
    };
    setDraft(prev => {
      const next = structuredClone(prev);
      if (!next.versions[verIdx]) return next;
      if (!Array.isArray(next.versions[verIdx].deployments)) {
        next.versions[verIdx].deployments = [];
      }
      next.versions[verIdx].deployments.push(newDep);
      return next;
    });
  };

  const updateDeploymentField = (verIdx, depIdx, field, val) => {
    setDraft(prev => {
      const next = structuredClone(prev);
      if (!next.versions[verIdx] || !next.versions[verIdx].deployments[depIdx]) return next;
      next.versions[verIdx].deployments[depIdx][field] = val;
      return next;
    });
  };

  const removeDeploymentTarget = (verIdx, depIdx) => {
    setDraft(prev => {
      const next = structuredClone(prev);
      if (!next.versions[verIdx] || !Array.isArray(next.versions[verIdx].deployments)) return next;
      next.versions[verIdx].deployments.splice(depIdx, 1);
      return next;
    });
  };

  const pickThumbnail = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setField('demoFlow.demoVideo.thumbnailUrl', evt.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setField('demoFlow.demoVideo.thumbnailUrl', '');
  };

  const setField = (path, value) => setDraft(d => {
    const next = structuredClone(d);
    const keys = path.split('.');
    let obj = next;
    while (keys.length > 1) {
      const k = keys.shift();
      if (!obj[k]) obj[k] = {};
      obj = obj[k];
    }
    obj[keys[0]] = value;
    return next;
  });

  const video = draft.demoFlow.demoVideo;
  const currentFile = upload ?? (video.videoFileName
    ? { url: video.videoUrl, name: video.videoFileName, specs: video.videoSpecs }
    : null);

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const url = URL.createObjectURL(file);
    const { width, height } = await probeVideo(file, url);
    const specs = `${file.type.split('/')[1]?.toUpperCase() || 'MP4'} • ${width}x${height} • ${mb(file.size)}`;
    setProgress(15);
    setTimeout(() => setProgress(60), 200);
    setTimeout(() => setProgress(90), 450);
    setTimeout(() => {
      setProgress(null);
      setUpload({ url, name: file.name, specs });
      setField('demoFlow.demoVideo.enabled', true);
    }, 700);
  };

  const removeVideo = () => {
    if (upload) URL.revokeObjectURL(upload.url);
    setUpload(null);
    setDraft(d => ({
      ...d,
      demoFlow: {
        ...d.demoFlow,
        demoVideo: { ...d.demoFlow.demoVideo, enabled: false, videoFileName: '', videoSpecs: '' }
      }
    }));
  };

  const save = () => {
    if (!draft.name?.trim()) {
      setError('Project name is required.');
      setTab('info');
      return;
    }
    setError('');

    const merged = structuredClone(draft);
    merged.name = merged.name.trim();

    if (isNew) {
      const slug = merged.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'project';
      merged.id = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    if (upload) {
      merged.demoFlow.demoVideo.videoFileName = upload.name;
      merged.demoFlow.demoVideo.videoSpecs = upload.specs;
      if (upload.url) {
        merged.demoFlow.demoVideo.videoUrl = upload.url;
      }
    }

    if (Array.isArray(merged.roadmap)) {
      const filteredRoadmap = merged.roadmap.filter(r => r && r.title?.trim()).map(r => ({
        ...r,
        status: r.status || 'planned'
      }));
      merged.roadmap = filteredRoadmap.length > 0 ? filteredRoadmap : null;
    }

    if (Array.isArray(merged.versions)) {
      merged.versions = merged.versions.filter(v => v && v.versionNumber?.trim());
      const activeVer = merged.versions.find(v => v.status === 'active') || merged.versions[0];
      if (activeVer) {
        merged.version = activeVer.versionNumber;
      }
    }

    onSave(merged);
  };

  const setChapter = (i, field, value) => {
    setField('demoFlow.demoVideo.chapters', video.chapters.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c));
  };

  const ROADMAP_STAGES = [
    { id: 'in-progress', label: 'In Development', dotClass: 'in-progress' },
    { id: 'planned', label: 'Planned', dotClass: 'planned' },
    { id: 'completed', label: 'Completed', dotClass: 'completed' }
  ];

  const addRoadmapItem = (status = 'planned') => {
    const current = Array.isArray(draft.roadmap) ? draft.roadmap : [];
    setField('roadmap', [...current, { title: '', priority: 'Medium', status, note: '' }]);
  };

  const loadDefaultRoadmap = () => {
    setField('roadmap', [
      { title: 'Enterprise System Integration', priority: 'High', status: 'in-progress', note: 'Standardized REST/webhook endpoints and external system interoperability connectors' },
      { title: 'Advanced Role-Based Access Controls', priority: 'Medium', status: 'planned', note: 'Fine-grained permission matrices, audit logs, and unified SSO/SAML authentication' },
      { title: 'Mobile & Offline Optimization', priority: 'Low', status: 'planned', note: 'Local client caching and background sync for low-connectivity environments' },
      { title: 'Core Security Architecture', priority: 'High', status: 'completed', note: 'Enterprise cryptography compliance, tamper-evident logging, and audit verification' }
    ]);
  };

  const updateRoadmapItem = (index, field, value) => {
    const current = Array.isArray(draft.roadmap) ? [...draft.roadmap] : [];
    current[index] = { ...current[index], [field]: value };
    setField('roadmap', current);
  };

  const moveRoadmapItem = (index, targetStatus) => {
    updateRoadmapItem(index, 'status', targetStatus);
  };

  const removeRoadmapItem = (index) => {
    const current = Array.isArray(draft.roadmap) ? draft.roadmap : [];
    const next = current.filter((_, idx) => idx !== index);
    setField('roadmap', next.length > 0 ? next : null);
  };

  const activeVersion = draft.versions?.[activeVersionIdx] || draft.versions?.[0];

  return (
    <div>
      {/* Header */}
      <button onClick={onCancel} className="back-link" style={{ marginBottom: '0.9rem' }}>
        <ArrowLeft size={14} /> Back to Projects
      </button>
      <h1 className="t-xl" style={{ fontWeight: 900 }}>
        {isNew ? 'Create New Project' : `Edit Project: ${draft.name || project.name}`}
      </h1>
      <p className="t-sm" style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 1.25rem' }}>
        {isNew
          ? 'Add a new solution to the enterprise catalog and configure its demo showcase'
          : 'Configure demo mode options and content'}
      </p>

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-sm)',
          background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--color-rose)', fontSize: '0.875rem', fontWeight: 600
        }}>
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar" role="tablist">
        {TABS.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? 'active' : ''}`}>
            <t.icon size={14} style={{ verticalAlign: '-2px', marginRight: '0.35rem' }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== Project Info ===== */}
      {tab === 'info' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid">
            <div className="form-field">
              <label>Project name *</label>
              <input
                placeholder="e.g. TeleHealth AI Platform"
                value={draft.name}
                onChange={(e) => { setField('name', e.target.value); if (error) setError(''); }}
                autoFocus={isNew}
              />
            </div>
            <div className="form-field">
              <label>Domain</label>
              <select
                value={draft.domain || 'healthcare'}
                onChange={(e) => {
                  setField('domain', e.target.value);
                  if (isNew && !draft.category) {
                    setField('category', e.target.value === 'healthcare' ? 'Healthcare AI' : 'InfoSec');
                  }
                }}
              >
                <option value="healthcare">HealthCare (Green accent)</option>
                <option value="infosec">InfoSec / Security (Purple accent)</option>
              </select>
            </div>
            <div className="form-field">
              <label>Category</label>
              <input
                placeholder="e.g. Healthcare AI or InfoSec"
                value={draft.category}
                onChange={(e) => setField('category', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Badge text</label>
              <input
                placeholder="e.g. Doctor-First Clinical or Enterprise Security"
                value={draft.badge}
                onChange={(e) => setField('badge', e.target.value)}
              />
            </div>
            <div className="form-field span-2">
              <label>Tagline (Card summary)</label>
              <input
                placeholder="One sentence describing the solution for the showcase card"
                value={draft.tagline}
                onChange={(e) => setField('tagline', e.target.value)}
              />
            </div>
            <div className="form-field span-2">
              <label>Full Overview / Summary (Detail view)</label>
              <textarea
                placeholder="Detailed explanation of the project capabilities, architecture, and value proposition..."
                value={draft.summary}
                onChange={(e) => setField('summary', e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>
            <div className="form-field span-2">
              <label>Built for / Target Client</label>
              <input
                placeholder="e.g. Hospital COOs, clinic directors, compliance officers"
                value={draft.targetClient}
                onChange={(e) => setField('targetClient', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Tech stack (arch)</label>
              <input
                placeholder="e.g. Next.js 16 + TypeScript, FastAPI, Redis"
                value={draft.arch}
                onChange={(e) => setField('arch', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Storage</label>
              <input
                placeholder="e.g. SQLite (WAL mode) or MongoDB"
                value={draft.storage}
                onChange={(e) => setField('storage', e.target.value)}
              />
            </div>
            <div className="form-field span-2">
              <label>Protocols</label>
              <input
                placeholder="e.g. REST, WebSocket, gRPC"
                value={draft.protocols}
                onChange={(e) => setField('protocols', e.target.value)}
              />
            </div>
          </div>

          <div className="t-label" style={{ marginTop: '0.5rem' }}>Source & deployment tracking</div>
          <div className="form-grid">
            <div className="form-field">
              <label>GitHub URL</label>
              <input placeholder="https://github.com/org/repo" value={draft.repository?.githubUrl || ''}
                onChange={(e) => setField('repository.githubUrl', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Branch</label>
              <input value={draft.repository?.branch || 'main'} onChange={(e) => setField('repository.branch', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Production URL</label>
              <input placeholder="https://app.enterprise.com" value={draft.links?.productionUrl || ''}
                onChange={(e) => setField('links.productionUrl', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Staging URL</label>
              <input placeholder="http://localhost:3000" value={draft.links?.stagingUrl || ''}
                onChange={(e) => setField('links.stagingUrl', e.target.value)} />
            </div>
          </div>

          {/* Operational Lifecycle & Governance */}
          <div className="t-label" style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PauseCircle size={14} color="var(--primary)" />
            <span>Operational Lifecycle & Governance</span>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Lifecycle Status</label>
              <select
                value={draft.lifecycle?.status || 'active'}
                onChange={(e) => setField('lifecycle.status', e.target.value)}
              >
                <option value="active">🟢 Active Development (Live Sprints)</option>
                <option value="on-hold">🟡 On-Hold / Paused (Temporarily Parked)</option>
                <option value="maintenance">🔵 Production / Maintenance (Stable Live)</option>
                <option value="incubation">🟣 Incubation / PoC (Early Prototype)</option>
                <option value="archived">⚪ Archived / Sunset (Historical Reference)</option>
              </select>
            </div>
            <div className="form-field">
              <label>Revival Readiness</label>
              <select
                value={draft.lifecycle?.revivalReadiness || 'Production Ready'}
                onChange={(e) => setField('lifecycle.revivalReadiness', e.target.value)}
              >
                <option value="Production Ready">Production Ready</option>
                <option value="High — Fully Validated">High — Fully Validated</option>
                <option value="Medium — Needs Dependency Refresh">Medium — Needs Dependency Refresh</option>
                <option value="Low — Architectural Prototype">Low — Architectural Prototype</option>
              </select>
            </div>
            <div className="form-field">
              <label>Last Active Date</label>
              <input
                placeholder="e.g. Sep 2026 or May 2026"
                value={draft.lifecycle?.lastActiveDate || ''}
                onChange={(e) => setField('lifecycle.lastActiveDate', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Data Access Level</label>
              <input
                placeholder="e.g. Internal Org SSO Required"
                value={draft.collateral?.governance?.accessLevel || 'Internal Org SSO Required'}
                onChange={(e) => setField('collateral.governance.accessLevel', e.target.value)}
              />
            </div>
            <div className="form-field span-2">
              <label>Status Note / Paused Reason (Shown on Card)</label>
              <textarea
                placeholder="e.g. Core algorithm verified; pilot paused pending hospital facility renovation schedule..."
                value={draft.lifecycle?.statusNote || ''}
                onChange={(e) => setField('lifecycle.statusNote', e.target.value)}
                style={{ minHeight: '55px' }}
              />
            </div>
            <div className="form-field">
              <label>Product Owner / Clinical Lead</label>
              <input
                placeholder="e.g. Dr. Sarah Lin (Clinical Director)"
                value={draft.collateral?.governance?.productOwner || draft.lifecycle?.owner || ''}
                onChange={(e) => {
                  setField('collateral.governance.productOwner', e.target.value);
                  setField('lifecycle.owner', e.target.value);
                }}
              />
            </div>
            <div className="form-field">
              <label>Technical Lead / Architect</label>
              <input
                placeholder="e.g. Alex Mercer (Principal Architect)"
                value={draft.collateral?.governance?.techLead || ''}
                onChange={(e) => setField('collateral.governance.techLead', e.target.value)}
              />
            </div>
          </div>

          <div className="form-field" style={{ marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquareQuote size={14} /> Presenter talk track (internal notes)
            </label>
            <textarea
              placeholder="Instructions and talking points for the presenter during live demonstrations..."
              value={draft.talkTrack || ''}
              onChange={(e) => setField('talkTrack', e.target.value)}
              style={{ minHeight: '65px' }}
            />
          </div>
        </div>
      )}

      {/* ===== Project Collateral & Docs Tab ===== */}
      {tab === 'collateral' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 className="t-md" style={{ fontWeight: 800 }}>Project Collateral & Documents</h3>
            <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Manage official presentation decks, SharePoint directories, design canvases, and demo recordings for <strong>{draft.name || 'this project'}</strong>.
            </p>
          </div>

          {/* Section 1: Presentation Decks */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Presentation size={16} color="var(--color-rose, #f43f5e)" />
                <span className="t-sm" style={{ fontWeight: 800 }}>Presentations & Pitch Decks ({draft.collateral?.presentations?.length || 0})</span>
              </div>
            </div>

            {/* Existing PPTs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.2rem' }}>
              {(draft.collateral?.presentations || []).map((ppt, pIdx) => (
                <div key={ppt.id || pIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.9rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="t-sm" style={{ fontWeight: 700 }}>{ppt.title}</span>
                      <span className="badge badge-rose" style={{ fontSize: '0.66rem' }}>{ppt.type}</span>
                      <span className="format-pill">{ppt.format}</span>
                    </div>
                    {ppt.notes && <div className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{ppt.notes}</div>}
                    <div className="t-xs font-mono" style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{ppt.url}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => removePpt(pIdx)}
                    style={{ color: 'var(--color-rose)', padding: '0.3rem' }}
                    title="Remove presentation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {(!draft.collateral?.presentations || draft.collateral.presentations.length === 0) && (
                <div className="t-xs" style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No presentations registered yet. Add one below.
                </div>
              )}
            </div>

            {/* Add New PPT Sub-form */}
            <div style={{ background: 'rgba(99, 102, 241, 0.04)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-light)' }}>
              <div className="t-xs" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>+ Register New Presentation Deck</div>
              <div className="form-grid" style={{ marginBottom: '0.6rem' }}>
                <div className="form-field">
                  <label>Deck Title *</label>
                  <input
                    placeholder="e.g. Executive Client Pitch Deck"
                    value={newPpt.title}
                    onChange={(e) => setNewPpt(p => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>Presentation Type</label>
                  <select
                    value={newPpt.type}
                    onChange={(e) => setNewPpt(p => ({ ...p, type: e.target.value }))}
                  >
                    <option value="Client Pitch Deck">Client Pitch Deck</option>
                    <option value="Technical Deep Dive">Technical Deep Dive</option>
                    <option value="Architecture Overview">Architecture Overview</option>
                    <option value="Sales Brief">Sales Brief</option>
                  </select>
                </div>
                <div className="form-field span-2">
                  <label>SharePoint / PowerPoint Web URL *</label>
                  <input
                    placeholder="https://company.sharepoint.com/:p:/r/.../deck.pptx"
                    value={newPpt.url}
                    onChange={(e) => setNewPpt(p => ({ ...p, url: e.target.value }))}
                  />
                </div>
                <div className="form-field span-2">
                  <label>Description / Notes</label>
                  <input
                    placeholder="e.g. 14-slide executive presentation covering intake UX and clinical flow"
                    value={newPpt.notes}
                    onChange={(e) => setNewPpt(p => ({ ...p, notes: e.target.value }))}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={addPpt}
                disabled={!newPpt.title?.trim() || !newPpt.url?.trim()}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={13} /> Add Presentation to Collateral
              </button>
            </div>
          </div>

          {/* Section 2: SharePoint Directories */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Folder size={16} color="var(--primary)" />
                <span className="t-sm" style={{ fontWeight: 800 }}>SharePoint & Cloud Repositories ({draft.collateral?.sharepoint?.length || 0})</span>
              </div>
            </div>

            {/* Existing SharePoint List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.2rem' }}>
              {(draft.collateral?.sharepoint || []).map((sp, sIdx) => (
                <div key={sp.id || sIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.9rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="t-sm" style={{ fontWeight: 700 }}>{sp.title}</span>
                      <span className="badge badge-brand" style={{ fontSize: '0.66rem' }}>{sp.category}</span>
                    </div>
                    {sp.notes && <div className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{sp.notes}</div>}
                    <div className="t-xs font-mono" style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{sp.url}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => removeSp(sIdx)}
                    style={{ color: 'var(--color-rose)', padding: '0.3rem' }}
                    title="Remove SharePoint link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {(!draft.collateral?.sharepoint || draft.collateral.sharepoint.length === 0) && (
                <div className="t-xs" style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No SharePoint folders registered yet. Add one below.
                </div>
              )}
            </div>

            {/* Add New SharePoint Sub-form */}
            <div style={{ background: 'rgba(99, 102, 241, 0.04)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-light)' }}>
              <div className="t-xs" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>+ Register SharePoint Directory</div>
              <div className="form-grid" style={{ marginBottom: '0.6rem' }}>
                <div className="form-field">
                  <label>Folder / Document Title *</label>
                  <input
                    placeholder="e.g. Official Project Workspace Root"
                    value={newSp.title}
                    onChange={(e) => setNewSp(s => ({ ...s, title: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <select
                    value={newSp.category}
                    onChange={(e) => setNewSp(s => ({ ...s, category: e.target.value }))}
                  >
                    <option value="Project Root">Project Root</option>
                    <option value="PRDs & Specs">PRDs & Specs</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Compliance & Legal">Compliance & Legal</option>
                    <option value="Sprint Deliverables">Sprint Deliverables</option>
                  </select>
                </div>
                <div className="form-field span-2">
                  <label>SharePoint URL *</label>
                  <input
                    placeholder="https://company.sharepoint.com/sites/..."
                    value={newSp.url}
                    onChange={(e) => setNewSp(s => ({ ...s, url: e.target.value }))}
                  />
                </div>
                <div className="form-field span-2">
                  <label>Description / Notes</label>
                  <input
                    placeholder="e.g. Master collaboration drive for clinical engineering documents"
                    value={newSp.notes}
                    onChange={(e) => setNewSp(s => ({ ...s, notes: e.target.value }))}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={addSp}
                disabled={!newSp.title?.trim() || !newSp.url?.trim()}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={13} /> Add SharePoint Link to Collateral
              </button>
            </div>
          </div>

          {/* Section 3: Technical Design, Architecture & API Specs */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} color="var(--color-sec, #818cf8)" />
                <span className="t-sm" style={{ fontWeight: 800 }}>Design Systems & API Contracts ({draft.collateral?.designAndDocs?.length || 0})</span>
              </div>
            </div>

            {/* Existing Docs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.2rem' }}>
              {(draft.collateral?.designAndDocs || []).map((doc, dIdx) => (
                <div key={doc.id || dIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.9rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="t-sm" style={{ fontWeight: 700 }}>{doc.title}</span>
                      <span className="badge badge-sec" style={{ fontSize: '0.66rem' }}>{doc.type}</span>
                    </div>
                    {doc.notes && <div className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{doc.notes}</div>}
                    <div className="t-xs font-mono" style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{doc.url}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => removeDoc(dIdx)}
                    style={{ color: 'var(--color-rose)', padding: '0.3rem' }}
                    title="Remove documentation link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {(!draft.collateral?.designAndDocs || draft.collateral.designAndDocs.length === 0) && (
                <div className="t-xs" style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No design or API specifications registered yet.
                </div>
              )}
            </div>

            {/* Add New Doc Sub-form */}
            <div style={{ background: 'rgba(99, 102, 241, 0.04)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-light)' }}>
              <div className="t-xs" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>+ Register Design / API Specification</div>
              <div className="form-grid" style={{ marginBottom: '0.6rem' }}>
                <div className="form-field">
                  <label>Document / System Title *</label>
                  <input
                    placeholder="e.g. Figma Clinical Design System"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc(d => ({ ...d, title: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>Resource Type</label>
                  <select
                    value={newDoc.type}
                    onChange={(e) => setNewDoc(d => ({ ...d, type: e.target.value }))}
                  >
                    <option value="Figma">Figma Board</option>
                    <option value="API Docs">OpenAPI / Swagger Spec</option>
                    <option value="Draw.io">System Architecture Schema</option>
                    <option value="Wiki">Technical Wiki / Confluence</option>
                  </select>
                </div>
                <div className="form-field span-2">
                  <label>URL *</label>
                  <input
                    placeholder="https://www.figma.com/file/... or http://localhost:.../docs"
                    value={newDoc.url}
                    onChange={(e) => setNewDoc(d => ({ ...d, url: e.target.value }))}
                  />
                </div>
                <div className="form-field span-2">
                  <label>Description / Notes</label>
                  <input
                    placeholder="e.g. Doctor review interface wireframes and patient mobile QR screens"
                    value={newDoc.notes}
                    onChange={(e) => setNewDoc(d => ({ ...d, notes: e.target.value }))}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={addDoc}
                disabled={!newDoc.title?.trim() || !newDoc.url?.trim()}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={13} /> Add Design / API Spec to Collateral
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Deployments & Versions ===== */}
      {tab === 'deployments' && (
        <div className="animate-fade-in admin-ver-edit-container">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h3 className="t-md" style={{ fontWeight: 800 }}>Project Releases & Deployment Targets</h3>
              <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Track multiple product versions, define unique features per release, and manage deployed environments (AWS, Local Server, On-Premise, etc.)
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              onClick={addVersion}
            >
              <Plus size={14} /> Add New Version
            </button>
          </div>

          {/* Version Selector Rail */}
          <div className="admin-ver-rail">
            {draft.versions.map((v, vIdx) => {
              const isActive = activeVersionIdx === vIdx;
              return (
                <button
                  key={v.id || vIdx}
                  type="button"
                  className={`ver-rail-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveVersionIdx(vIdx)}
                >
                  <span className={`status-dot ${v.status === 'active' ? 'green' : v.status === 'beta' ? 'amber' : 'gray'}`} />
                  <span>{v.versionNumber || `Version ${vIdx + 1}`}</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.66rem', padding: '0.1rem 0.35rem' }}>
                    {v.deployments?.length || 0} Targets
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Version Editor */}
          {activeVersion && (
            <div className="card" style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Top Controls: Version Details */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                    Configuring: {activeVersion.versionNumber || 'New Version'}
                  </span>
                  <span className={`badge ${activeVersion.status === 'active' ? 'badge-health' : activeVersion.status === 'beta' ? 'badge-brand' : 'badge-neutral'}`}>
                    {activeVersion.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>

                {draft.versions.length > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ color: 'var(--color-rose)', borderColor: 'rgba(244, 63, 94, 0.3)', fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                    onClick={() => removeVersion(activeVersionIdx)}
                  >
                    <Trash2 size={13} /> Remove Version
                  </button>
                )}
              </div>

              {/* Version Metadata Form */}
              <div className="form-grid">
                <div className="form-field">
                  <label>Version Number *</label>
                  <input
                    placeholder="e.g. v2.1.0"
                    value={activeVersion.versionNumber}
                    onChange={(e) => updateVersionField(activeVersionIdx, 'versionNumber', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Release Name</label>
                  <input
                    placeholder="e.g. Doctor-First Clinical Flow"
                    value={activeVersion.releaseName || ''}
                    onChange={(e) => updateVersionField(activeVersionIdx, 'releaseName', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Release Date</label>
                  <input
                    placeholder="e.g. Sep 12, 2026"
                    value={activeVersion.releaseDate || ''}
                    onChange={(e) => updateVersionField(activeVersionIdx, 'releaseDate', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Release Lifecycle Status</label>
                  <select
                    value={activeVersion.status || 'active'}
                    onChange={(e) => updateVersionField(activeVersionIdx, 'status', e.target.value)}
                  >
                    <option value="active">Active / Current Stable</option>
                    <option value="beta">Beta / In Development</option>
                    <option value="deprecated">Deprecated / Legacy</option>
                    <option value="planned">Planned / Upcoming</option>
                  </select>
                </div>
              </div>

              {/* Section: Unique Features for this Version */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.15rem', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={14} color="var(--primary)" /> Unique Features in {activeVersion.versionNumber}
                    </span>
                    <span className="t-xs" style={{ color: 'var(--text-muted)' }}>
                      List capabilities specific to or introduced by this release
                    </span>
                  </div>
                </div>

                {/* Feature Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.85rem' }}>
                  {(activeVersion.uniqueFeatures || []).map((feat, fIdx) => (
                    <span key={fIdx} className="ver-tag-pill">
                      <span>{feat}</span>
                      <button
                        type="button"
                        className="ver-tag-remove"
                        onClick={() => removeUniqueFeature(activeVersionIdx, fIdx)}
                        title="Remove feature tag"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(!activeVersion.uniqueFeatures || activeVersion.uniqueFeatures.length === 0) && (
                    <span className="t-xs" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No unique features tagged yet. Add key differentiator features below.
                    </span>
                  )}
                </div>

                {/* Add Feature input */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    placeholder="Type a unique feature (e.g. Zero-login QR photo sync, Multimodal LLM differential)..."
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addUniqueFeature(activeVersionIdx);
                      }
                    }}
                    style={{ fontSize: '0.82rem' }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => addUniqueFeature(activeVersionIdx)}
                    style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}
                  >
                    <Plus size={13} /> Add Feature
                  </button>
                </div>
              </div>

              {/* Section: Deployment Environments */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Cloud size={15} color="var(--primary)" /> Deployed Environments ({activeVersion.deployments?.length || 0})
                    </span>
                    <span className="t-xs" style={{ color: 'var(--text-muted)' }}>
                      Where {activeVersion.versionNumber} is hosted and running (Local Server, AWS Cloud, On-Premise, etc.)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                    onClick={() => addDeploymentTarget(activeVersionIdx)}
                  >
                    <Plus size={13} /> Add Deployment Target
                  </button>
                </div>

                {/* Deployment Targets List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(activeVersion.deployments || []).map((dep, depIdx) => (
                    <div key={dep.id || depIdx} className="dep-edit-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>#{depIdx + 1}</span>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{dep.name || 'Deployment Instance'}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ color: 'var(--color-rose)', borderColor: 'rgba(244, 63, 94, 0.3)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                          onClick={() => removeDeploymentTarget(activeVersionIdx, depIdx)}
                          title="Remove deployment target"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>

                      <div className="form-grid">
                        <div className="form-field">
                          <label>Instance Name *</label>
                          <input
                            placeholder="e.g. AWS ECS Production or Local Dev Server"
                            value={dep.name}
                            onChange={(e) => updateDeploymentField(activeVersionIdx, depIdx, 'name', e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Target Platform *</label>
                          <select
                            value={dep.platform || 'AWS Cloud'}
                            onChange={(e) => updateDeploymentField(activeVersionIdx, depIdx, 'platform', e.target.value)}
                          >
                            <option value="Local Server">Local Server (e.g. localhost, local port)</option>
                            <option value="AWS Cloud">AWS Cloud (EC2, ECS, Lambda, CloudFront)</option>
                            <option value="Docker / K8s">Docker / Kubernetes Cluster</option>
                            <option value="On-Premise">On-Premise Server / Private LAN</option>
                            <option value="GCP / Azure">GCP / Azure Cloud</option>
                            <option value="Other">Other Custom Host</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label>Environment Tier</label>
                          <select
                            value={dep.env || 'Production'}
                            onChange={(e) => updateDeploymentField(activeVersionIdx, depIdx, 'env', e.target.value)}
                          >
                            <option value="Production">Production</option>
                            <option value="Staging">Staging</option>
                            <option value="Development">Development</option>
                            <option value="Testing">Testing</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label>Endpoint / Access URL</label>
                          <input
                            placeholder="http://localhost:3000 or https://..."
                            value={dep.url || ''}
                            onChange={(e) => updateDeploymentField(activeVersionIdx, depIdx, 'url', e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Region / Port / Host</label>
                          <input
                            placeholder="e.g. us-east-1, Port :3000, Internal LAN"
                            value={dep.regionOrPort || ''}
                            onChange={(e) => updateDeploymentField(activeVersionIdx, depIdx, 'regionOrPort', e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Health / Operational Status</label>
                          <select
                            value={dep.status || 'Healthy'}
                            onChange={(e) => updateDeploymentField(activeVersionIdx, depIdx, 'status', e.target.value)}
                          >
                            <option value="Healthy">Healthy / Active</option>
                            <option value="Running">Running</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Provisioning">Provisioning</option>
                            <option value="Offline">Offline</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-field" style={{ margin: 0 }}>
                        <label>Internal Deployment Notes</label>
                        <input
                          placeholder="e.g. Multi-AZ auto-scaled cluster, seeded demo account credentials..."
                          value={dep.note || ''}
                          onChange={(e) => updateDeploymentField(activeVersionIdx, depIdx, 'note', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  {(!activeVersion.deployments || activeVersion.deployments.length === 0) && (
                    <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-light)' }}>
                      <p className="t-sm" style={{ color: 'var(--text-secondary)' }}>No deployment environments configured for this version yet.</p>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ marginTop: '0.75rem', fontSize: '0.78rem' }}
                        onClick={() => addDeploymentTarget(activeVersionIdx)}
                      >
                        <Plus size={13} /> Add First Deployment Target
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== Demo Mode ===== */}
      {tab === 'demo' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h3 className="t-md" style={{ fontWeight: 800 }}>Demo Mode Configuration</h3>
            <p className="t-sm" style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0.9rem' }}>
              Choose which demo options to display for this project
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {TOGGLES.map(t => (
                <div key={t.path} className="admin-project-row" style={{ padding: '0.85rem 1.1rem' }}>
                  <span>
                    <span className="t-sm" style={{ fontWeight: 700, display: 'block' }}>{t.title}</span>
                    <span className="t-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</span>
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={draft.demoFlow[t.path.split('.')[0]][t.path.split('.')[1]]}
                      onChange={(e) => setField(`demoFlow.${t.path}`, e.target.checked)}
                      aria-label={t.title}
                    />
                    <span className="track" />
                  </label>
                </div>
              ))}
            </div>

            {/* Complete Flow Sandbox Configuration */}
            {draft.demoFlow.completeFlow.enabled && (
              <div style={{
                marginTop: '1rem', padding: '1rem',
                background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)'
              }}>
                <div className="t-xs" style={{ fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  Complete Flow Settings
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Sandbox URL</label>
                    <input
                      placeholder="http://localhost:3000/demo or live sandbox URL"
                      value={draft.demoFlow.completeFlow.sandboxUrl}
                      onChange={(e) => setField('demoFlow.completeFlow.sandboxUrl', e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Credentials / Demo hint</label>
                    <input
                      placeholder="e.g. No login required or demo / pass123"
                      value={draft.demoFlow.completeFlow.credentialsHint}
                      onChange={(e) => setField('demoFlow.completeFlow.credentialsHint', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Media Link when Demo Video is active */}
            {draft.demoFlow.demoVideo.enabled && (
              <div className="card" style={{ marginTop: '0.85rem', padding: '0.85rem 1rem', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt="Cover thumbnail"
                      style={{ width: 54, height: 34, borderRadius: 'var(--radius-xs)', objectFit: 'cover', border: '1px solid var(--border-medium)', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: 44, height: 34, borderRadius: 'var(--radius-xs)', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Play size={16} color="var(--primary)" />
                    </div>
                  )}
                  <div>
                    <div className="t-xs" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>{currentFile ? currentFile.name : (video.videoUrl ? 'Streaming video linked' : 'No video file or URL added yet')}</span>
                      {video.thumbnailUrl ? (
                        <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                          <CheckCircle size={10} /> Thumbnail Active
                        </span>
                      ) : (
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                          No Cover Thumbnail
                        </span>
                      )}
                    </div>
                    <div className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {video.thumbnailUrl ? 'Custom poster active for card banner & video modal' : 'Upload video file, set custom thumbnail image/URL, and manage chapters in Media tab'}
                    </div>
                  </div>
                </div>
                <button type="button" className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }} onClick={() => setTab('media')}>
                  Manage in Media Tab →
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ===== Media (Consolidated Video & Asset Hub) ===== */}
      {tab === 'media' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Section 1: Video File Upload */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 className="t-md" style={{ fontWeight: 800 }}>Demo Video File</h3>
                <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Upload an MP4 or WebM video file to showcase on the project card and interactive video modal
                </p>
              </div>
              {!draft.demoFlow.demoVideo.enabled && (
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                  Video toggle is off in Demo Mode
                </span>
              )}
            </div>

            {currentFile ? (
              <div className="video-upload-card">
                <div className="video-thumb">
                  {currentFile.url
                    ? <video src={currentFile.url} muted preload="metadata" />
                    : <Play size={22} fill="currentColor" />}
                  <span className="duration-badge">{video.videoDuration}</span>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="t-sm" style={{ fontWeight: 700 }}>{currentFile.name}</div>
                  <div className="t-xs" style={{ color: 'var(--text-muted)', margin: '0.15rem 0 0.4rem' }}>
                    {currentFile.specs}
                  </div>
                  <span className="badge badge-success"><CheckCircle size={12} /> Upload complete</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={13} /> Replace Video
                  </button>
                  <button type="button" className="btn-danger" onClick={removeVideo}>
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="video-upload-card"
                style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', padding: '2rem 1rem' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <span style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Upload size={22} style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                  <span className="t-sm" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Click to upload a demo video
                  </span>
                  <span className="t-xs" style={{ display: 'block', marginTop: '0.2rem' }}>
                    MP4 or WebM — shown on the project card when Demo Video is enabled
                  </span>
                </span>
              </button>
            )}

            {progress !== null && (
              <div style={{ marginTop: '0.75rem' }}>
                <div className="t-xs" style={{ color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Uploading… {progress}%
                </div>
                <div className="upload-progress"><div style={{ width: `${progress}%` }} /></div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="video/*" hidden onChange={pickFile} />
          </section>

          {/* Section: Demo Video Thumbnail / Cover Poster */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 className="t-md" style={{ fontWeight: 800 }}>Demo Video Thumbnail / Cover Poster</h3>
                <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Preview image displayed on the project card banner in the client showcase and as the video player poster
                </p>
              </div>
              {video.thumbnailUrl ? (
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                  <CheckCircle size={12} /> Custom Thumbnail Active
                </span>
              ) : (
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                  Default Gradient Cover
                </span>
              )}
            </div>

            {video.thumbnailUrl ? (
              <div className="video-upload-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                  position: 'relative',
                  width: '180px',
                  height: '102px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                  background: '#0f172a'
                }}>
                  <img
                    src={video.thumbnailUrl}
                    alt="Video thumbnail cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.15) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)', color: '#0f172a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                    }}>
                      <Play size={15} fill="currentColor" />
                    </span>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="t-sm" style={{ fontWeight: 700 }}>Custom Cover Poster</div>
                  <div className="t-xs" style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0.6rem', wordBreak: 'break-all' }}>
                    {video.thumbnailUrl.startsWith('data:') ? 'Custom uploaded image (data payload)' : video.thumbnailUrl}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="btn-secondary" onClick={() => thumbnailInputRef.current?.click()} style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
                      <Upload size={13} /> Replace Cover Image
                    </button>
                    <button type="button" className="btn-danger" onClick={removeThumbnail} style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
                      <Trash2 size={13} /> Remove Thumbnail
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="video-upload-card"
                style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', padding: '1.75rem 1rem' }}
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <span style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ImageIcon size={24} style={{ display: 'block', margin: '0 auto 0.5rem', color: 'var(--primary)' }} />
                  <span className="t-sm" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Click to upload a video thumbnail / cover poster
                  </span>
                  <span className="t-xs" style={{ display: 'block', marginTop: '0.2rem' }}>
                    PNG, JPG, or WebP — recommended 16:9 ratio (e.g. 1280×720). Shown on project card banner and player.
                  </span>
                </span>
              </button>
            )}

            <input ref={thumbnailInputRef} type="file" accept="image/*" hidden onChange={pickThumbnail} />

            <div style={{ marginTop: '0.75rem' }}>
              <div className="form-field">
                <label>Or enter thumbnail image URL</label>
                <input
                  placeholder="https://images.unsplash.com/... or relative image path"
                  value={video.thumbnailUrl || ''}
                  onChange={(e) => setField('demoFlow.demoVideo.thumbnailUrl', e.target.value)}
                />
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="t-xs" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Quick sample covers:</span>
                <button
                  type="button"
                  className="badge badge-neutral"
                  style={{ cursor: 'pointer', border: '1px solid var(--border-medium)' }}
                  onClick={() => setField('demoFlow.demoVideo.thumbnailUrl', '/mockups/dermadesk_concept_thumb.jpg')}
                >
                  Clinical Dermatology
                </button>
                <button
                  type="button"
                  className="badge badge-neutral"
                  style={{ cursor: 'pointer', border: '1px solid var(--border-medium)' }}
                  onClick={() => setField('demoFlow.demoVideo.thumbnailUrl', '/mockups/opd_concept_thumb.jpg')}
                >
                  OPD & Voice Intake
                </button>
                <button
                  type="button"
                  className="badge badge-neutral"
                  style={{ cursor: 'pointer', border: '1px solid var(--border-medium)' }}
                  onClick={() => setField('demoFlow.demoVideo.thumbnailUrl', '/mockups/cc_scanner_concept_thumb.jpg')}
                >
                  Card Shield & Masking
                </button>
                <button
                  type="button"
                  className="badge badge-neutral"
                  style={{ cursor: 'pointer', border: '1px solid var(--border-medium)' }}
                  onClick={() => setField('demoFlow.demoVideo.thumbnailUrl', '/mockups/pqc_concept_thumb.jpg')}
                >
                  Post-Quantum Lattice
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Streaming URL Fallback & Duration */}
          <section>
            <h3 className="t-md" style={{ fontWeight: 800, marginBottom: '0.2rem' }}>Streaming URL & Duration</h3>
            <p className="t-sm" style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Web or CDN video link fallback and total duration
            </p>
            <div className="form-grid">
              <div className="form-field">
                <label>Demo video URL</label>
                <input placeholder="https://…/product-demo.mp4" value={video.videoUrl}
                  onChange={(e) => setField('demoFlow.demoVideo.videoUrl', e.target.value)} />
                <span className="hint">Streams in client player when no file is uploaded.</span>
              </div>
              <div className="form-field">
                <label>Duration (M:SS)</label>
                <input value={video.videoDuration}
                  onChange={(e) => setField('demoFlow.demoVideo.videoDuration', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Section 3: Video Chapters */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div>
                <h3 className="t-md" style={{ fontWeight: 800 }}>Video Chapters</h3>
                <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Timestamped sections allowing clients to skip to key features
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setField('demoFlow.demoVideo.chapters',
                  [...(video.chapters || []), { timestamp: '0:00', title: '', description: '' }])}
              >
                <Plus size={13} /> Add Chapter
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {(video.chapters || []).map((c, i) => (
                <div key={i} className="admin-project-row" style={{ alignItems: 'flex-start', padding: '0.85rem 1rem' }}>
                  <div className="form-grid" style={{ flex: 1, minWidth: 260 }}>
                    <div className="form-field">
                      <label>Timestamp</label>
                      <input value={c.timestamp} onChange={(e) => setChapter(i, 'timestamp', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label>Title</label>
                      <input value={c.title} onChange={(e) => setChapter(i, 'title', e.target.value)} />
                    </div>
                    <div className="form-field span-2">
                      <label>Description</label>
                      <input value={c.description} onChange={(e) => setChapter(i, 'description', e.target.value)} />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="modal-close" aria-label="Remove chapter"
                    onClick={() => setField('demoFlow.demoVideo.chapters', video.chapters.filter((_, idx) => idx !== i))}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ===== Roadmap Kanban Manager ===== */}
      {tab === 'roadmap' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 className="t-md" style={{ fontWeight: 800 }}>Project Roadmap Milestones</h3>
                <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Manage upcoming horizons, active development, and shipped milestones visible in the client showcase
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={loadDefaultRoadmap}
                  title="Load sample milestones"
                >
                  Load Sample Milestones
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => addRoadmapItem('planned')}
                >
                  <Plus size={14} /> Add Milestone
                </button>
              </div>
            </div>

            {/* 3-Column Kanban Board Editor */}
            <div className="kanban-board">
              {ROADMAP_STAGES.map((stage, stageIdx) => {
                const stageItemsWithIndices = (Array.isArray(draft.roadmap) ? draft.roadmap : [])
                  .map((item, originalIdx) => ({ item, originalIdx }))
                  .filter(({ item }) => (item.status || 'planned') === stage.id);

                return (
                  <div key={stage.id} className="kanban-col">
                    <div className="kanban-col-header">
                      <div className="kanban-col-title">
                        <span className={`kanban-stage-dot ${stage.dotClass}`} />
                        <span>{stage.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="kanban-col-count">{stageItemsWithIndices.length}</span>
                        <button
                          type="button"
                          className="admin-col-add-btn"
                          onClick={() => addRoadmapItem(stage.id)}
                          title={`Add milestone to ${stage.label}`}
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </div>

                    <div className="kanban-col-cards">
                      {stageItemsWithIndices.length === 0 ? (
                        <div className="kanban-empty-col">
                          <p style={{ margin: 0, marginBottom: '0.5rem' }}>No items in {stage.label.toLowerCase()}</p>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                            onClick={() => addRoadmapItem(stage.id)}
                          >
                            <Plus size={12} /> Add First Item
                          </button>
                        </div>
                      ) : (
                        stageItemsWithIndices.map(({ item, originalIdx }) => (
                          <div key={originalIdx} className="admin-kanban-card">
                            <div className="admin-kanban-card-header">
                              <div className="admin-stage-actions">
                                <button
                                  type="button"
                                  className="admin-move-btn"
                                  disabled={stageIdx === 0}
                                  title={stageIdx > 0 ? `Move left to ${ROADMAP_STAGES[stageIdx - 1].label}` : 'Cannot move left'}
                                  onClick={() => moveRoadmapItem(originalIdx, ROADMAP_STAGES[stageIdx - 1].id)}
                                >
                                  <ChevronLeft size={13} />
                                </button>
                                <button
                                  type="button"
                                  className="admin-move-btn"
                                  disabled={stageIdx === ROADMAP_STAGES.length - 1}
                                  title={stageIdx < ROADMAP_STAGES.length - 1 ? `Move right to ${ROADMAP_STAGES[stageIdx + 1].label}` : 'Cannot move right'}
                                  onClick={() => moveRoadmapItem(originalIdx, ROADMAP_STAGES[stageIdx + 1].id)}
                                >
                                  <ChevronRight size={13} />
                                </button>
                              </div>

                              <button
                                type="button"
                                className="modal-close"
                                style={{ width: 22, height: 22, padding: 0 }}
                                aria-label="Remove milestone"
                                title="Remove milestone"
                                onClick={() => removeRoadmapItem(originalIdx)}
                              >
                                <X size={13} />
                              </button>
                            </div>

                            <div className="form-field" style={{ margin: 0, textAlign: 'left' }}>
                              <input
                                placeholder="Milestone Title *"
                                style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}
                                value={item.title || ''}
                                onChange={(e) => updateRoadmapItem(originalIdx, 'title', e.target.value)}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', textAlign: 'left' }}>
                              <div className="form-field" style={{ margin: 0, textAlign: 'left' }}>
                                <select
                                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}
                                  value={item.priority || 'Medium'}
                                  onChange={(e) => updateRoadmapItem(originalIdx, 'priority', e.target.value)}
                                >
                                  <option value="High">High Priority</option>
                                  <option value="Medium">Medium Priority</option>
                                  <option value="Low">Low Priority</option>
                                </select>
                              </div>

                              <div className="form-field" style={{ margin: 0, textAlign: 'left' }}>
                                <select
                                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}
                                  value={item.status || 'planned'}
                                  onChange={(e) => updateRoadmapItem(originalIdx, 'status', e.target.value)}
                                >
                                  <option value="in-progress">In Development</option>
                                  <option value="planned">Planned</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>
                            </div>

                            <div className="form-field" style={{ margin: 0, textAlign: 'left' }}>
                              <textarea
                                rows={2}
                                placeholder="Context, scope, or roadmap details…"
                                style={{ fontSize: '0.775rem', resize: 'vertical', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}
                                value={item.note || ''}
                                onChange={(e) => updateRoadmapItem(originalIdx, 'note', e.target.value)}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ===== Settings ===== */}
      {tab === 'settings' && (
        <div className="animate-fade-in">
          <div className="form-grid">
            <div className="form-field">
              <label>Version</label>
              <input value={draft.version || '1.0.0'} onChange={(e) => setField('version', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Last updated (shown on client card)</label>
              <input value={draft.lastUpdated} onChange={(e) => setField('lastUpdated', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Demo inquiry email</label>
              <input value={draft.demoFlow.contactDemo.inquiryEmail}
                onChange={(e) => setField('demoFlow.contactDemo.inquiryEmail', e.target.value)} />
              <span className="hint">Internal recipient for client demo requests.</span>
            </div>
            <div className="form-field">
              <label>Featured banner tag</label>
              <input placeholder="FEATURED, NEW (leave blank for none)" value={draft.bannerTag || ''}
                onChange={(e) => setField('bannerTag', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="edit-footer">
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" onClick={save}>
          {isNew ? 'Create Project' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
