import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, LayoutGrid, List, CheckCircle2, Clock, Calendar, Play, Sparkles,
  Activity, ShieldCheck, MessageSquareQuote, Users, ExternalLink, ArrowRight,
  Layers, Server, Cpu, Lock, Copy, Check, Eye, Cloud, Presentation, Folder,
  FileText, PauseCircle, Archive, Building2, Lightbulb
} from 'lucide-react';
import { RESEARCH_DATA } from '../data/catalogData';

const DEFAULT_ROADMAP_ITEMS = [
  { title: 'Enterprise System Integration', priority: 'High', status: 'in-progress', note: 'Standardized REST/webhook endpoints and external system interoperability connectors' },
  { title: 'Advanced Role-Based Access Controls', priority: 'Medium', status: 'planned', note: 'Fine-grained permission matrices, audit logs, and unified SSO/SAML authentication' },
  { title: 'Mobile & Offline Optimization', priority: 'Low', status: 'planned', note: 'Local client caching and background sync for low-connectivity environments' },
  { title: 'Core Security Architecture', priority: 'High', status: 'completed', note: 'Enterprise cryptography compliance, tamper-evident logging, and audit verification' }
];

const STAGES = [
  { id: 'in-progress', label: 'In Development', dotClass: 'in-progress', badgeClass: 'badge-brand' },
  { id: 'planned', label: 'Planned', dotClass: 'planned', badgeClass: 'badge-neutral' },
  { id: 'completed', label: 'Completed', dotClass: 'completed', badgeClass: 'badge-health' }
];

// Client-facing detail view (opened from a ProjectCard).
// Privacy guard: no launch panel, credentials, or deployment URLs here —
// repository/links/deployments render only in the Admin persona.
export default function DetailPane({
  product,
  researches,
  onBack,
  onOpenVideo,
  onOpenFlow,
  onOpenContact,
  isPreviewFromAdmin = false,
  onNavigateToResearch
}) {
  const [tab, setTab] = useState('overview');
  const [roadmapView, setRoadmapView] = useState('board');
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [copiedCollateral, setCopiedCollateral] = useState(null);

  // Reset scroll to the very top whenever a project overview is opened or switched
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [product?.id]);

  const isHealth = product.domain === 'healthcare';
  const { demoFlow } = product;
  const thumbnailUrl = product.thumbnailUrl || demoFlow?.demoVideo?.thumbnailUrl;

  const versions = (Array.isArray(product.versions) && product.versions.length > 0)
    ? product.versions
    : [
        {
          id: 'v1.0.0',
          versionNumber: product.version || 'v1.0.0',
          releaseName: 'Current Release',
          status: 'active',
          releaseDate: product.lastUpdated,
          uniqueFeatures: (product.features || []).map(f => f.name),
          deployments: (product.deployments || []).map((dep, i) => ({
            id: `dep-${i}`,
            name: dep.name,
            platform: dep.env?.includes('3000') || dep.env?.includes('5173') || dep.env?.includes('8000') ? 'Local Server' : 'AWS Cloud',
            env: 'Production',
            url: dep.url,
            status: 'Healthy',
            regionOrPort: dep.env
          }))
        }
      ];

  const [selectedVersionId, setSelectedVersionId] = useState(() => versions[0]?.id || versions[0]?.versionNumber);
  const currentVersion = versions.find(v => (v.id || v.versionNumber) === selectedVersionId) || versions[0];

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const heroBannerStyle = thumbnailUrl ? {
    backgroundImage: isHealth
      ? `linear-gradient(to top, rgba(6, 78, 59, 0.95) 0%, rgba(6, 78, 59, 0.45) 45%, rgba(6, 78, 59, 0.15) 100%), url(${thumbnailUrl})`
      : `linear-gradient(to top, rgba(30, 27, 75, 0.96) 0%, rgba(49, 46, 129, 0.48) 45%, rgba(30, 27, 75, 0.15) 100%), url(${thumbnailUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : undefined;

  const roadmapItems = (Array.isArray(product.roadmap) && product.roadmap.length > 0)
    ? product.roadmap
    : DEFAULT_ROADMAP_ITEMS;

  const collateralCount = (product.collateral?.presentations?.length || 0) +
    (product.collateral?.sharepoint?.length || 0) +
    (product.collateral?.designAndDocs?.length || 0) +
    (product.collateral?.recordings?.length || 0);

  const allResearches = researches ? Object.values(researches) : Object.values(RESEARCH_DATA);
  const relatedResearches = allResearches.filter(r =>
    r.projectId === product.id || (r.relatedProjects || []).includes(product.id)
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'collateral', label: `Documents & Collateral (${collateralCount})` },
    { id: 'specs', label: 'Tech Specs' },
    { id: 'features', label: `Features (${product.features?.length || 0})` },
    { id: 'roadmap', label: `Roadmap (${roadmapItems.length})` },
    ...(isPreviewFromAdmin ? [{ id: 'deployments', label: `Deployments & Versions (${versions.length})` }] : [])
  ];

  const getStageItems = (stageId) => roadmapItems.filter(r => (r.status || 'planned') === stageId);

  return (
    <main className="pane">
      {/* Admin Preview Mode Banner */}
      {isPreviewFromAdmin && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.65rem 1.2rem',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          fontSize: '0.86rem',
          color: 'var(--primary)'
        }}>
          <Eye size={16} />
          <span><strong>Admin Preview Mode:</strong> Viewing client showcase for <strong>{product.name}</strong></span>
        </div>
      )}

      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h1 className="t-xl" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{product.name}</h1>
            <span className={`badge ${isHealth ? 'badge-health' : 'badge-sec'}`}>{product.badge}</span>
          </div>
          <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{product.tagline}</p>
        </div>
        <button onClick={onBack} className="back-link">
          <ArrowLeft size={14} /> {isPreviewFromAdmin ? 'Back to Admin' : 'All projects (Esc)'}
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginTop: '1.75rem' }} role="tablist">
        {tabs.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== UPGRADED EXECUTIVE OVERVIEW ===== */}
      {tab === 'overview' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 1. Hero Media & Quick Action Showcase */}
          <div className={`detail-hero-banner ${isHealth ? 'banner-health' : 'banner-sec'}`} style={heroBannerStyle}>
            <div className="banner-top-bar">
              <span className={`domain-chip ${isHealth ? 'health' : 'sec'}`}>
                {isHealth ? <Activity size={12} /> : <ShieldCheck size={12} />}
                <span>{isHealth ? 'HealthCare AI' : 'InfoSec'}</span>
              </span>
              {product.bannerTag && <span className="banner-tag">{product.bannerTag}</span>}
            </div>

            <div className="detail-hero-content">
              <div>
                <span className="badge badge-neutral" style={{ marginBottom: '0.45rem', fontSize: '0.72rem', background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}>
                  {product.category} · {product.version || '1.0.0'}
                </span>
                <h2 className="detail-hero-title">{product.name}</h2>
                <p className="detail-hero-subtitle">{product.tagline}</p>
              </div>

              {/* Quick Launch Buttons on Hero */}
              <div className="detail-hero-actions">
                {demoFlow?.demoVideo?.enabled && onOpenVideo && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onOpenVideo(product.id)}
                    style={{ background: '#fff', color: 'var(--text-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                  >
                    <Play size={15} fill="currentColor" color="var(--primary)" />
                    <span>Watch Video ({demoFlow.demoVideo.videoDuration || 'Demo'})</span>
                  </button>
                )}
                {demoFlow?.completeFlow?.enabled && onOpenFlow && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onOpenFlow(product.id)}
                    style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}
                  >
                    <Sparkles size={15} />
                    <span>Launch Sandbox</span>
                  </button>
                )}
                {demoFlow?.contactDemo?.enabled && onOpenContact && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onOpenContact(product.id)}
                    style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}
                  >
                    <Calendar size={15} />
                    <span>Request Live Demo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Solution Vitals Bar */}
          <div className="detail-vitals-strip">
            <div className="vitals-item">
              <span className="vitals-label">Domain</span>
              <span className="vitals-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {isHealth ? <Activity size={13} color="var(--color-health)" /> : <ShieldCheck size={13} color="var(--color-sec)" />}
                {isHealth ? 'HealthCare AI' : 'InfoSec'}
              </span>
            </div>
            <div className="vitals-divider" />
            <div className="vitals-item">
              <span className="vitals-label">Architecture</span>
              <span className="vitals-val font-mono" title={product.arch}>
                {product.arch?.split(';')[0]?.split('(')[0] || 'Modern Web Stack'}
              </span>
            </div>
            <div className="vitals-divider" />
            <div className="vitals-item">
              <span className="vitals-label">Last Verified</span>
              <span className="vitals-val">{product.lastUpdated || 'Current'}</span>
            </div>
            <div className="vitals-divider" />
            <div className="vitals-item">
              <span className="vitals-label">Core Tags</span>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {(product.tags || []).map(t => (
                  <span key={t} className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Operational / Lifecycle Status Banner */}
          {product.lifecycle?.status && product.lifecycle.status !== 'active' && (
            <div className={`lifecycle-status-banner ${product.lifecycle.status}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span className={`lifecycle-status-icon ${product.lifecycle.status}`}>
                  {product.lifecycle.status === 'on-hold' && <PauseCircle size={20} />}
                  {product.lifecycle.status === 'maintenance' && <CheckCircle2 size={20} />}
                  {product.lifecycle.status === 'archived' && <Archive size={20} />}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span className="t-sm" style={{ fontWeight: 800 }}>
                      Operational Status: {product.lifecycle.status === 'on-hold' ? 'On-Hold / Paused' : product.lifecycle.status === 'maintenance' ? 'Production / Maintenance' : 'Archived'}
                    </span>
                    {product.lifecycle.revivalReadiness && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                        Revival Readiness: <strong>{product.lifecycle.revivalReadiness}</strong>
                      </span>
                    )}
                  </div>
                  <p className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.55 }}>
                    {product.lifecycle.statusNote}
                  </p>
                  <div className="lifecycle-meta-row" style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Last Active: <strong>{product.lifecycle.lastActiveDate || 'Recorded'}</strong></span>
                    <span>Custodian: <strong>{product.lifecycle.owner || 'Lead Engineering'}</strong></span>
                    <span>Department: <strong>{product.lifecycle.department || 'Enterprise Systems'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Collateral Strip */}
          <div className="quick-collateral-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <FileText size={14} color="var(--primary)" />
              <span><strong>Collateral Quick Links:</strong></span>
            </div>
            <div className="quick-collateral-actions">
              {product.collateral?.presentations?.[0] && (
                <a
                  href={product.collateral.presentations[0].url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="quick-collateral-btn ppt"
                  title="Open executive pitch deck in PowerPoint"
                >
                  <Presentation size={13} />
                  <span>{product.collateral.presentations[0].title || 'Open Pitch Deck'}</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {product.collateral?.sharepoint?.[0] && (
                <a
                  href={product.collateral.sharepoint[0].url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="quick-collateral-btn sp"
                  title="Open official SharePoint project site"
                >
                  <Folder size={13} />
                  <span>{product.collateral.sharepoint[0].title || 'SharePoint Site'}</span>
                  <ExternalLink size={11} />
                </a>
              )}
              <button
                type="button"
                className="quick-collateral-btn all"
                onClick={() => setTab('collateral')}
                title="View complete documentation vault"
              >
                <span>View All ({collateralCount}) Assets →</span>
              </button>
            </div>
          </div>

          {/* Admin Operations Quick Link Banner (Preview Mode only) */}
          {isPreviewFromAdmin && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '0.85rem 1.25rem',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Server size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    Deployments & Versions Configured
                  </div>
                  <div className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {versions.length} release{versions.length > 1 ? 's' : ''} tracked across {versions.reduce((acc, v) => acc + (v.deployments?.length || 0), 0)} operational environments (AWS Cloud, Local Server, On-Premise).
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setTab('deployments')}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>View Deployments Tab</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* 3. Executive Bento Grid: Summary + Enterprise Fit */}
          <div className="overview-bento-grid">
            {/* Card A: Executive Summary */}
            <div className="card overview-card">
              <div className="overview-card-header">
                <span className="overview-card-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
                  <Sparkles size={16} />
                </span>
                <div>
                  <h3 className="t-md" style={{ fontWeight: 800 }}>Executive Solution Summary</h3>
                  <span className="t-xs" style={{ color: 'var(--text-muted)' }}>Core mission and clinical/technical impact</span>
                </div>
              </div>
              <p className="t-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: '0.75rem' }}>
                {product.summary}
              </p>
              {product.talkTrack && (
                <div className="talk-track-quote">
                  <MessageSquareQuote size={18} className="quote-icon" />
                  <p className="t-xs" style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    "{product.talkTrack}"
                  </p>
                </div>
              )}
            </div>

            {/* Card B: Target Audience & Enterprise Context */}
            <div className="card overview-card">
              <div className="overview-card-header">
                <span className="overview-card-icon" style={{ background: isHealth ? 'rgba(5, 150, 105, 0.1)' : 'rgba(124, 58, 237, 0.1)', color: isHealth ? 'var(--color-health)' : 'var(--color-sec)' }}>
                  <Users size={16} />
                </span>
                <div>
                  <h3 className="t-md" style={{ fontWeight: 800 }}>Enterprise Fit & Audience</h3>
                  <span className="t-xs" style={{ color: 'var(--text-muted)' }}>Target stakeholders and deployment environments</span>
                </div>
              </div>
              <p className="t-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.75rem' }}>
                {product.targetClient}
              </p>

              {Array.isArray(product.deployments) && product.deployments.length > 0 && (
                <div style={{ marginTop: '1rem', borderTop: '1px dashed var(--border-light)', paddingTop: '0.85rem' }}>
                  <div className="t-label" style={{ marginBottom: '0.5rem' }}>Verified Target Environments</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {product.deployments.slice(0, 3).map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.775rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</span>
                        <span className="font-mono t-xs" style={{ color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-xs)' }}>
                          {d.env}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Core Capabilities At-a-Glance (Top 3 Pillars) */}
          {Array.isArray(product.features) && product.features.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 className="t-md" style={{ fontWeight: 800 }}>Core Architectural Capabilities</h3>
                  <span className="t-xs" style={{ color: 'var(--text-muted)' }}>Top architectural capabilities verified in this release</span>
                </div>
                <button type="button" className="btn-secondary" style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }} onClick={() => setTab('features')}>
                  View all ({product.features.length}) features →
                </button>
              </div>

              <div className="overview-pillars-grid">
                {product.features.slice(0, 3).map((f, i) => (
                  <div key={i} className="card pillar-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span className="t-sm" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.name}</span>
                      <span className="badge badge-health" style={{ fontSize: '0.68rem' }}>{f.status}</span>
                    </div>
                    <p className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.45rem', lineHeight: 1.55 }}>
                      {f.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Demonstration Modalities */}
          <div>
            <h3 className="t-md" style={{ fontWeight: 800, marginBottom: '0.3rem' }}>Interactive Demonstration Modalities</h3>
            <p className="t-sm" style={{ color: 'var(--text-secondary)', marginBottom: '0.9rem' }}>
              Explore hands-on sandbox environments, recorded walkthroughs, or schedule team demonstrations
            </p>

            <div className="overview-demo-grid">
              {/* Tile 1: Interactive Flow */}
              <div className={`overview-demo-card ${demoFlow?.completeFlow?.enabled ? 'active' : 'disabled'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="demo-mode-icon flow"><Sparkles size={18} /></span>
                  <div>
                    <div className="t-sm" style={{ fontWeight: 700 }}>Interactive Flow Sandbox</div>
                    <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
                      {demoFlow?.completeFlow?.enabled ? (demoFlow.completeFlow.credentialsHint || 'Live interactive session') : 'Not available for this release'}
                    </div>
                  </div>
                </div>
                {demoFlow?.completeFlow?.enabled && onOpenFlow && (
                  <button type="button" className="btn-secondary" style={{ fontSize: '0.78rem', marginTop: '0.75rem', width: '100%', justifyContent: 'center' }} onClick={() => onOpenFlow(product.id)}>
                    Launch Interactive Flow →
                  </button>
                )}
              </div>

              {/* Tile 2: Demo Video Walkthrough */}
              <div className={`overview-demo-card ${demoFlow?.demoVideo?.enabled ? 'active' : 'disabled'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="demo-mode-icon video"><Play size={18} fill="currentColor" /></span>
                  <div>
                    <div className="t-sm" style={{ fontWeight: 700 }}>Guided Video Walkthrough</div>
                    <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
                      {demoFlow?.demoVideo?.enabled ? `${demoFlow.demoVideo.videoDuration || 'Full'} · ${demoFlow.demoVideo.chapters?.length || 0} chapters` : 'Video walkthrough coming soon'}
                    </div>
                  </div>
                </div>
                {demoFlow?.demoVideo?.enabled && onOpenVideo && (
                  <button type="button" className="btn-secondary" style={{ fontSize: '0.78rem', marginTop: '0.75rem', width: '100%', justifyContent: 'center' }} onClick={() => onOpenVideo(product.id)}>
                    Watch Video Walkthrough →
                  </button>
                )}
              </div>

              {/* Tile 3: Contact Consultation */}
              <div className={`overview-demo-card ${demoFlow?.contactDemo?.enabled ? 'active' : 'disabled'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="demo-mode-icon contact"><Calendar size={18} /></span>
                  <div>
                    <div className="t-sm" style={{ fontWeight: 700 }}>Schedule Live Presentation</div>
                    <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
                      {demoFlow?.contactDemo?.enabled ? 'Direct inquiry to the engineering & demo team' : 'Contact via department channels'}
                    </div>
                  </div>
                </div>
                {demoFlow?.contactDemo?.enabled && onOpenContact && (
                  <button type="button" className="btn-secondary" style={{ fontSize: '0.78rem', marginTop: '0.75rem', width: '100%', justifyContent: 'center' }} onClick={() => onOpenContact(product.id)}>
                    Request Team Demo →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== UPGRADED ARCHITECTURAL BLUEPRINT & SECURITY DASHBOARD ===== */}
      {tab === 'specs' && (
        <div className="tech-blueprint-container animate-fade-in">
          {/* 1. Multi-Tier System Topology Map */}
          <div className="blueprint-flow-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="overview-card-icon" style={{ background: isHealth ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)', color: isHealth ? 'var(--color-health)' : 'var(--color-sec)' }}>
                  <Layers size={18} />
                </span>
                <div>
                  <h3 className="t-md" style={{ fontWeight: 800 }}>Architectural Topology & Pipeline</h3>
                  <p className="t-xs" style={{ color: 'var(--text-secondary)' }}>Multi-tier verified execution flow from presentation to persistence</p>
                </div>
              </div>
              <span className="badge badge-brand font-mono" style={{ fontSize: '0.72rem' }}>
                Runtime: {product.version || 'Enterprise Spec'}
              </span>
            </div>

            <div className="blueprint-flow-steps">
              {((product.id === 'dermadesk' ? [
                { tier: '01 / Presentation', name: 'Clinical PWA Workspace', tech: 'Next.js 16 (React 19 + TS)', desc: 'Doctor-first responsive workspace with dynamic 6-section intake branching.' },
                { tier: '02 / Gateway', name: 'Mobile Sync Gateway', tech: 'NestJS 11 + Socket.IO', desc: 'Secure zero-login QR mobile camera bridge and real-time photo ingestion.' },
                { tier: '03 / Intelligence', name: 'AI Differential Engine', tech: 'OpenAI / Gemini Multimodal', desc: 'Top-3 differential diagnosis generation with clinical confidence scoring.' },
                { tier: '04 / Persistence', name: 'Clinical Vault', tech: 'MongoDB (In-Memory Fallback)', desc: 'Locked visit records, physician sign-off loops, and immutable audit logs.' }
              ] : product.id === 'opd' ? [
                { tier: '01 / Client UX', name: 'Kiosk & TV Displays', tech: 'React 19 + Tailwind v4 + Zustand', desc: 'Self-service registration kiosk, waiting-room TV chimes, and doctor rail.' },
                { tier: '02 / Audio Gateway', name: 'Voice Streaming Gateway', tech: 'FastAPI + WebSocket (/ws/voice)', desc: 'Bi-directional audio streaming bridge connecting client mic to AI core.' },
                { tier: '03 / Conversational AI', name: 'Dhara Voice Assistant', tech: 'Google Gemini Live Audio', desc: 'Full-duplex Hindi/English conversational triage and 7-point clinical checklists.' },
                { tier: '04 / Queue Core', name: 'Token Engine & DB', tech: 'SQLite WAL (Collision-Free)', desc: 'Sequential token dispensing, doctor EMR console, and printable branded Rx.' }
              ] : (product.id === 'cc_scanner' || product.id === 'cc') ? [
                { tier: '01 / Architecture', name: 'Agentless Readers', tech: 'Native SMB (445) & SSH/SFTP (22)', desc: 'Direct in-memory network file streaming across Windows and Linux fleets without agents.' },
                { tier: '02 / Engine', name: 'Extraction & Concurrency', tech: 'Two-Level Thread Pool + 30 Formats', desc: 'Pool of systems x pool of files with format-aware streaming text parsers.' },
                { tier: '03 / Intelligence', name: 'Presidio + spaCy NER', tech: 'Luhn Mod-10 + NLP Context Scoring', desc: 'Pre-filters non-PAN bytes, validates issuer checksums, and scores nearby entity context.' },
                { tier: '04 / Compliance', name: 'Masking & QSA Pack', tech: 'Zero-Disk Volatile Memory + Audit Log', desc: 'Masks at point of detection (Req 3.4) with SHA-256 tamper-evident evidence export.' }
              ] : [
                { tier: '01 / Interface', name: 'Executive Dashboard & CLI', tech: 'FastAPI Dashboard + CLI', desc: 'Interactive posture browser, compliance reporting, and CLI automation.' },
                { tier: '02 / Discovery', name: 'Cloud Collectors', tech: '35 AWS Collectors (42 APIs)', desc: 'Read-only inventorying across KMS, ACM, CloudFront, ELB, and Secrets.' },
                { tier: '03 / Risk Analysis', name: 'Mosca 6-Factor Engine', tech: 'NIST IR 8105 & SP 800-57', desc: 'Quantum risk horizon scoring (CRQC) and algorithm deprecation mapping.' },
                { tier: '04 / Compliance', name: 'CBOM Generator', tech: 'CycloneDX 1.7 Validator', desc: 'Schema-validated Cryptographic Bill of Materials for auditor sign-off.' }
              ])).map((step, idx) => (
                <div key={idx} className="flow-step-box">
                  <span className="flow-step-number">{step.tier}</span>
                  <span className="flow-step-name">{step.name}</span>
                  <span className="flow-step-tech">{step.tech}</span>
                  <span className="flow-step-desc">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Verified Target Environments & Endpoints */}
          <div className="card" style={{ padding: '1.35rem 1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="overview-card-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
                  <Server size={18} />
                </span>
                <div>
                  <h3 className="t-md" style={{ fontWeight: 800 }}>Verified Service Interfaces & Endpoints</h3>
                  <p className="t-xs" style={{ color: 'var(--text-secondary)' }}>Host runtime configurations and network bindings</p>
                </div>
              </div>
              <span className="badge badge-health">
                <CheckCircle2 size={11} /> {product.deployments?.length || 2} Interfaces Healthy
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="endpoints-table">
                <thead>
                  <tr>
                    <th>Component Name</th>
                    <th>Environment</th>
                    <th>Runtime Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(product.deployments || [
                    { name: 'Core Application Service', env: 'Web :3000', status: 'Active Service', url: 'http://localhost:3000' },
                    { name: 'Backend API Gateway', env: 'API :4001', status: 'Operational', url: 'http://localhost:4001' }
                  ]).map((dep, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{dep.name}</td>
                      <td>
                        <span className="badge badge-neutral font-mono" style={{ fontSize: '0.72rem' }}>
                          {dep.env}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <span className="pulse-beacon" style={{ width: 6, height: 6 }} />
                          {dep.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="copy-endpoint-btn"
                          onClick={() => {
                            navigator.clipboard?.writeText(dep.url || dep.env);
                            setCopiedEndpoint(dep.name);
                            setTimeout(() => setCopiedEndpoint(null), 2000);
                          }}
                          title="Copy host location"
                        >
                          {copiedEndpoint === dep.name ? <Check size={11} color="var(--color-health)" /> : <Copy size={11} />}
                          <span>{copiedEndpoint === dep.name ? 'Copied' : 'Copy'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Enterprise Compliance & Security Posture */}
          <div className="card" style={{ padding: '1.35rem 1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="overview-card-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--color-health)' }}>
                <ShieldCheck size={18} />
              </span>
              <div>
                <h3 className="t-md" style={{ fontWeight: 800 }}>Enterprise Security & Compliance Posture</h3>
                <p className="t-xs" style={{ color: 'var(--text-secondary)' }}>Privacy boundaries, cryptographic controls, and standards conformance</p>
              </div>
            </div>

            <div className="compliance-matrix-grid">
              {(isHealth ? [
                { title: 'HIPAA Security Alignment', desc: 'In-memory zero persistence fallback mode prevents clinical PII from resting unencrypted.', icon: ShieldCheck },
                { title: 'Physician Verdict Loop', desc: 'Mandatory human sign-off and diagnostic locking before records are finalized.', icon: Users },
                { title: 'HL7 / FHIR Schema Ready', desc: 'Exportable JSON payloads structured to interface with hospital EHR repositories.', icon: CheckCircle2 },
                { title: 'Ephemeral Handshake Security', desc: 'Zero-login QR pairing using single-use, time-delimited WebSocket session tokens.', icon: Lock }
              ] : [
                { title: 'NIST SP 800-57 & IR 8105', desc: 'Formal cryptographic asset classification aligned with federal quantum transition mandates.', icon: ShieldCheck },
                { title: 'CycloneDX 1.7 CBOM Standard', desc: 'Schema-validated Cryptographic Bill of Materials for software supply chain compliance.', icon: CheckCircle2 },
                { title: 'Zero-Trust IAM Collector Scopes', desc: '100% read-only discovery collectors; zero policy alteration or credentials write capability.', icon: Lock },
                { title: 'Mosca 6-Factor CRQC Risk Scoring', desc: 'Algorithmic prioritization protecting assets against harvest-now-decrypt-later attacks.', icon: Cpu }
              ]).map((item, idx) => (
                <div key={idx} className="compliance-badge-card">
                  <span className="compliance-icon">
                    <item.icon size={15} />
                  </span>
                  <div>
                    <div className="t-sm" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                    <div className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.45 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Core Runtime Specifications Bento */}
          <div className="card" style={{ padding: '1.25rem 1.4rem' }}>
            <h4 className="t-sm" style={{ fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Core Infrastructure Specifications
            </h4>
            {[
              ['Application Stack', product.arch],
              ['Persistence Layer', product.storage],
              ['Supported Protocols', product.protocols]
            ].map(([label, value]) => (
              <div key={label} className="spec-row">
                <span className="t-label">{label}</span>
                <span className="t-sm font-mono" style={{ color: 'var(--primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== DOCUMENTS & COLLATERAL HUB ===== */}
      {tab === 'collateral' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header Card */}
          <div className="card" style={{ padding: '1.4rem 1.6rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span className="domain-chip sec" style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}>
                    <FileText size={12} /> Project Collateral
                  </span>
                  <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
                    {collateralCount} Verified Artifact{collateralCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <h2 className="t-lg" style={{ fontWeight: 800, margin: 0 }}>
                  Project Collateral, SharePoint & Presentations
                </h2>
                <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', maxWidth: '760px', lineHeight: 1.55 }}>
                  The official collateral repository for <strong>{product.name}</strong>. Access verified PowerPoint decks, official SharePoint sites, system architecture specifications, and client demo recordings.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                <span className="badge badge-neutral" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                  Access: <strong>{product.collateral?.governance?.accessLevel || 'Internal Org SSO'}</strong>
                </span>
                <span className="t-xs" style={{ color: 'var(--text-muted)' }}>
                  Last audit: {product.lastUpdated}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive & Client Presentations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Presentation size={17} color="var(--color-rose, #f43f5e)" />
              <h3 className="t-md" style={{ fontWeight: 800 }}>Presentations & Pitch Decks</h3>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                {product.collateral?.presentations?.length || 0}
              </span>
            </div>

            {(!product.collateral?.presentations || product.collateral.presentations.length === 0) ? (
              <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No presentation decks registered yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {product.collateral.presentations.map((ppt, idx) => (
                  <div key={ppt.id || idx} className="card collateral-card ppt">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="collateral-icon-badge ppt">
                          <Presentation size={16} />
                        </span>
                        <div>
                          <span className="badge badge-rose" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
                            {ppt.type || 'Presentation'}
                          </span>
                        </div>
                      </div>
                      <span className="format-pill">{ppt.format || 'PPTX'}</span>
                    </div>

                    <h4 className="collateral-title" style={{ marginTop: '0.65rem' }}>{ppt.title}</h4>
                    {ppt.notes && <p className="collateral-notes">{ppt.notes}</p>}

                    <div className="collateral-card-footer">
                      <span className="t-xs" style={{ color: 'var(--text-muted)' }}>
                        Modified: {ppt.lastModified || 'Recent'}
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn-ghost"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', height: 'auto' }}
                          onClick={() => {
                            if (ppt.url) {
                              navigator.clipboard?.writeText(ppt.url);
                              setCopiedCollateral(ppt.id || idx);
                              setTimeout(() => setCopiedCollateral(null), 2000);
                            }
                          }}
                          title="Copy presentation link"
                        >
                          {copiedCollateral === (ppt.id || idx) ? <Check size={12} color="var(--color-health)" /> : <Copy size={12} />}
                          <span>{copiedCollateral === (ppt.id || idx) ? 'Copied' : 'Copy'}</span>
                        </button>
                        {ppt.url ? (
                          <a
                            href={ppt.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <span>Open Deck</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="t-xs" style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>Link pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: SharePoint & Cloud Repositories */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Folder size={17} color="var(--primary)" />
              <h3 className="t-md" style={{ fontWeight: 800 }}>SharePoint & Cloud Drives</h3>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                {product.collateral?.sharepoint?.length || 0}
              </span>
            </div>

            {(!product.collateral?.sharepoint || product.collateral.sharepoint.length === 0) ? (
              <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No SharePoint repositories registered yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {product.collateral.sharepoint.map((sp, idx) => (
                  <div key={sp.id || idx} className="card collateral-card sp">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="collateral-icon-badge sp">
                          <Folder size={16} />
                        </span>
                        <span className="badge badge-brand" style={{ fontSize: '0.68rem' }}>
                          {sp.category || 'General'}
                        </span>
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>SharePoint</span>
                    </div>

                    <h4 className="collateral-title" style={{ marginTop: '0.65rem' }}>{sp.title}</h4>
                    {sp.notes && <p className="collateral-notes">{sp.notes}</p>}

                    <div className="collateral-card-footer">
                      <span className="t-xs font-mono" style={{ color: 'var(--text-muted)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sp.url ? new URL(sp.url).pathname : 'SharePoint'}
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn-ghost"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', height: 'auto' }}
                          onClick={() => {
                            if (sp.url) {
                              navigator.clipboard?.writeText(sp.url);
                              setCopiedCollateral(sp.id || idx);
                              setTimeout(() => setCopiedCollateral(null), 2000);
                            }
                          }}
                          title="Copy SharePoint link"
                        >
                          {copiedCollateral === (sp.id || idx) ? <Check size={12} color="var(--color-health)" /> : <Copy size={12} />}
                          <span>{copiedCollateral === (sp.id || idx) ? 'Copied' : 'Copy'}</span>
                        </button>
                        {sp.url ? (
                          <a
                            href={sp.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <span>Open Folder</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="t-xs" style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>Link pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Technical Specifications, Architecture & Design */}
          {product.collateral?.designAndDocs?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Layers size={17} color="var(--color-sec, #818cf8)" />
                <h3 className="t-md" style={{ fontWeight: 800 }}>Design Systems & API Contracts</h3>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  {product.collateral.designAndDocs.length}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {product.collateral.designAndDocs.map((doc, idx) => (
                  <div key={doc.id || idx} className="card collateral-card docs">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-sec" style={{ fontSize: '0.68rem' }}>{doc.type || 'Specification'}</span>
                      <span className="t-xs" style={{ color: 'var(--text-muted)' }}>Interactive Canvas / Schema</span>
                    </div>

                    <h4 className="collateral-title" style={{ marginTop: '0.65rem' }}>{doc.title}</h4>
                    {doc.notes && <p className="collateral-notes">{doc.notes}</p>}

                    <div className="collateral-card-footer">
                      <span className="t-xs font-mono" style={{ color: 'var(--text-muted)' }}>{doc.type}</span>
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <span>Open Resource</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Recorded Walkthroughs & Demos */}
          {product.collateral?.recordings?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Play size={17} color="var(--color-health)" />
                <h3 className="t-md" style={{ fontWeight: 800 }}>Recorded Client Walkthroughs</h3>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  {product.collateral.recordings.length}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {product.collateral.recordings.map((rec, idx) => (
                  <div key={rec.id || idx} className="card collateral-card rec">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-health" style={{ fontSize: '0.68rem' }}>{rec.platform || 'Recorded Session'}</span>
                      <span className="t-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                        <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                        {rec.duration || 'Session'}
                      </span>
                    </div>

                    <h4 className="collateral-title" style={{ marginTop: '0.65rem' }}>{rec.title}</h4>
                    {rec.notes && <p className="collateral-notes">{rec.notes}</p>}

                    <div className="collateral-card-footer">
                      <span className="t-xs" style={{ color: 'var(--text-muted)' }}>
                        Recorded: {rec.recordedDate || 'Archived'}
                      </span>
                      {rec.url && (
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Watch Recording</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Governance & Organizational Custodianship */}
          <div className="card" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.1rem' }}>
              <span className="overview-card-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
                <Building2 size={18} />
              </span>
              <div>
                <h3 className="t-md" style={{ fontWeight: 800 }}>Governance, Ownership & Custodianship</h3>
                <p className="t-xs" style={{ color: 'var(--text-secondary)' }}>Organizational points of contact and permissions</p>
              </div>
            </div>

            <div className="governance-grid">
              <div className="gov-item">
                <span className="gov-label">Product Owner / Clinical Lead</span>
                <span className="gov-val">{product.collateral?.governance?.productOwner || product.lifecycle?.owner || 'Assigned Lead'}</span>
              </div>
              <div className="gov-item">
                <span className="gov-label">Technical Lead / Architect</span>
                <span className="gov-val">{product.collateral?.governance?.techLead || 'System Architecture Group'}</span>
              </div>
              <div className="gov-item">
                <span className="gov-label">Department / Business Unit</span>
                <span className="gov-val">{product.collateral?.governance?.department || product.lifecycle?.department || 'Engineering Division'}</span>
              </div>
              <div className="gov-item">
                <span className="gov-label">Data Clearance & Access Requirement</span>
                <span className="gov-val font-mono">{product.collateral?.governance?.accessLevel || 'Internal Org SSO Required'}</span>
              </div>
            </div>
          </div>

          {/* Section 6: Internal Project Research & Tech Spikes (Admin / Inter-Enterprise Only) */}
          {isPreviewFromAdmin && relatedResearches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Lightbulb size={17} color="var(--primary)" />
                <h3 className="t-md" style={{ fontWeight: 800 }}>Internal Research, Tech Spikes & Evaluations</h3>
                <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>
                  {relatedResearches.length} Documented
                </span>
              </div>
              <p className="t-xs" style={{ color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Technology evaluations, feasibility spikes, and user research conducted specifically for <strong>{product.name}</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {relatedResearches.map(res => {
                  const isCompleted = res.status === 'completed' || res.status === 'concluded';
                  return (
                    <div key={res.id} className="card" style={{ padding: '1.25rem 1.4rem', borderLeft: `3px solid ${isCompleted ? 'var(--color-health)' : 'var(--primary)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-brand font-mono" style={{ fontSize: '0.72rem' }}>{res.code}</span>
                          <span className={`badge ${isCompleted ? 'badge-health' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                            {isCompleted ? 'Adopted in Project' : 'Active Spike'}
                          </span>
                        </div>
                        <span className="t-xs" style={{ color: 'var(--text-muted)' }}>{res.date}</span>
                      </div>

                      <h4 className="t-md" style={{ fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                        {res.title}
                      </h4>
                      <p className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.55 }}>
                        {res.context || res.abstract}
                      </p>

                      {res.decision && (
                        <div style={{
                          marginTop: '0.65rem',
                          padding: '0.5rem 0.75rem',
                          background: isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99, 102, 241, 0.08)',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.75rem'
                        }}>
                          <span style={{ fontWeight: 800, color: isCompleted ? 'var(--color-health)' : 'var(--primary)', marginRight: '0.4rem' }}>
                            Project Decision:
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>
                            {res.decision}
                          </span>
                        </div>
                      )}

                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
                          Contributor: <strong>{res.author || (res.leadResearchers || []).join(', ')}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {res.deliverables?.pptUrl && (
                            <a href={res.deliverables.pptUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                              <Presentation size={12} /> Slide Deck (PPT)
                            </a>
                          )}
                          {res.deliverables?.sharepointFolder && (
                            <a href={res.deliverables.sharepointFolder} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                              <Folder size={12} /> SharePoint Notes
                            </a>
                          )}
                          {onNavigateToResearch && (
                            <button
                              type="button"
                              className="btn-primary"
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              onClick={() => onNavigateToResearch(res.id)}
                            >
                              <span>View Spike Brief</span>
                              <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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

      {tab === 'roadmap' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Roadmap Toolbar with stage pills and view switcher */}
          <div className="roadmap-toolbar">
            <div className="roadmap-summary-pills">
              {STAGES.map(s => {
                const count = getStageItems(s.id).length;
                return (
                  <span key={s.id} className="roadmap-summary-pill">
                    <span className={`kanban-stage-dot ${s.dotClass}`} />
                    {s.label}: <strong>{count}</strong>
                  </span>
                );
              })}
            </div>

            <div className="roadmap-view-toggle" role="group" aria-label="Roadmap layout toggle">
              <button
                type="button"
                className={`roadmap-view-btn ${roadmapView === 'board' ? 'active' : ''}`}
                onClick={() => setRoadmapView('board')}
                title="Board View"
              >
                <LayoutGrid size={13} /> Board
              </button>
              <button
                type="button"
                className={`roadmap-view-btn ${roadmapView === 'list' ? 'active' : ''}`}
                onClick={() => setRoadmapView('list')}
                title="List View"
              >
                <List size={13} /> List
              </button>
            </div>
          </div>

          {/* Board View */}
          {roadmapView === 'board' ? (
            <div className="kanban-board">
              {STAGES.map(stage => {
                const items = getStageItems(stage.id);
                return (
                  <div key={stage.id} className="kanban-col">
                    <div className="kanban-col-header">
                      <div className="kanban-col-title">
                        <span className={`kanban-stage-dot ${stage.dotClass}`} />
                        <span>{stage.label}</span>
                      </div>
                      <span className="kanban-col-count">{items.length}</span>
                    </div>

                    <div className="kanban-col-cards">
                      {items.length === 0 ? (
                        <div className="kanban-empty-col">
                          No milestones in this stage
                        </div>
                      ) : (
                        items.map((r, idx) => (
                          <div key={r.title || idx} className="kanban-card">
                            <div className="kanban-card-top">
                              <span className="kanban-card-title">{r.title}</span>
                              <span className={`badge ${
                                stage.id === 'completed'
                                  ? 'badge-health'
                                  : r.priority === 'High'
                                  ? 'badge-health'
                                  : r.priority === 'Medium'
                                  ? 'badge-brand'
                                  : 'badge-neutral'
                              }`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                                {stage.id === 'completed' ? 'Shipped' : `${r.priority || 'Medium'}`}
                              </span>
                            </div>
                            {r.note && (
                              <p className="kanban-card-note">{r.note}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {roadmapItems.map((r, idx) => {
                const stage = STAGES.find(s => s.id === (r.status || 'planned')) || STAGES[1];
                return (
                  <div key={r.title || idx} className="card" style={{ padding: '0.9rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="t-sm" style={{ fontWeight: 700 }}>{r.title}</span>
                        <span className="roadmap-summary-pill" style={{ padding: '0.1rem 0.45rem', fontSize: '0.7rem' }}>
                          <span className={`kanban-stage-dot ${stage.dotClass}`} />
                          {stage.label}
                        </span>
                      </div>
                      {r.note && <p className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.5 }}>{r.note}</p>}
                    </div>
                    <span className={`badge ${r.priority === 'High' ? 'badge-health' : r.priority === 'Medium' ? 'badge-brand' : 'badge-neutral'}`}>
                      {r.priority || 'Medium'} Priority
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== ADMIN ONLY: DEPLOYMENTS & VERSIONS ===== */}
      {tab === 'deployments' && isPreviewFromAdmin && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Bar */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span className="domain-chip sec" style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}>
                    <Server size={12} /> Admin Operations Matrix
                  </span>
                  <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
                    {versions.length} Version{versions.length > 1 ? 's' : ''} Tracked
                  </span>
                </div>
                <h2 className="t-lg" style={{ fontWeight: 800, margin: 0 }}>
                  Deployments & Multi-Version Architecture
                </h2>
                <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '720px' }}>
                  Audit live deployment endpoints, verify cloud vs. local infrastructure health, and review distinct feature capabilities across released builds.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-neutral" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  Total Endpoints: <strong style={{ marginLeft: '0.3rem', color: 'var(--text-primary)' }}>{versions.reduce((acc, v) => acc + (v.deployments?.length || 0), 0)}</strong>
                </span>
              </div>
            </div>

            {/* Version Selector Rail */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <div className="t-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.6rem' }}>
                Select Release Version:
              </div>
              <div className="admin-ver-rail" style={{ paddingBottom: '0.25rem' }}>
                {versions.map((v, vIdx) => {
                  const vKey = v.id || v.versionNumber || `ver-${vIdx}`;
                  const isSelected = (currentVersion?.id || currentVersion?.versionNumber) === (v.id || v.versionNumber);
                  return (
                    <button
                      key={vKey}
                      type="button"
                      className={`ver-rail-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedVersionId(v.id || v.versionNumber)}
                      style={{
                        padding: '0.55rem 1rem',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <span className={`status-dot ${v.status === 'active' ? 'green' : v.status === 'beta' ? 'amber' : 'gray'}`} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>{v.versionNumber}</div>
                        {v.releaseName && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{v.releaseName}</div>
                        )}
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '0.12rem 0.4rem', marginLeft: '0.25rem' }}>
                        {v.deployments?.length || 0} Targets
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Version Details Showcase */}
          {currentVersion && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
              {/* Left Column: Deployed Infrastructure Targets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Server size={18} color="var(--primary)" />
                    <h3 className="t-md" style={{ fontWeight: 800, margin: 0 }}>
                      Deployment Endpoints ({currentVersion.deployments?.length || 0})
                    </h3>
                  </div>
                  <span className={`badge ${currentVersion.status === 'active' ? 'badge-health' : currentVersion.status === 'beta' ? 'badge-brand' : 'badge-neutral'}`}>
                    Build Status: {currentVersion.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>

                {(!currentVersion.deployments || currentVersion.deployments.length === 0) ? (
                  <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Server size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    <div className="t-sm" style={{ fontWeight: 600 }}>No active deployment targets for {currentVersion.versionNumber}</div>
                    <div className="t-xs" style={{ marginTop: '0.25rem' }}>Deployment environments can be configured in the project editor.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {currentVersion.deployments.map((dep, depIdx) => {
                      const isAWS = dep.platform?.toLowerCase().includes('aws') || dep.platform?.toLowerCase().includes('cloud');
                      const isLocal = dep.platform?.toLowerCase().includes('local');
                      const isProd = dep.env?.toLowerCase().includes('prod');

                      return (
                        <div key={dep.id || depIdx} className="card" style={{ padding: '1.15rem 1.3rem', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {/* Target Header */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-sm)',
                                background: isAWS ? 'rgba(245, 158, 11, 0.12)' : isLocal ? 'rgba(59, 130, 246, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                                color: isAWS ? '#f59e0b' : isLocal ? '#3b82f6' : '#10b981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {isAWS ? <Cloud size={18} /> : isLocal ? <Server size={18} /> : <Layers size={18} />}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                  {dep.name || `${dep.platform} Deployment`}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                                  <span className="t-xs" style={{ color: 'var(--text-muted)' }}>
                                    Platform: <strong>{dep.platform}</strong>
                                  </span>
                                  {dep.regionOrPort && (
                                    <>
                                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                                      <span className="t-xs" style={{ color: 'var(--text-muted)' }}>
                                        {dep.regionOrPort}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span className={`badge ${isProd ? 'badge-sec' : 'badge-brand'}`} style={{ fontSize: '0.7rem' }}>
                                {dep.env || 'Production'}
                              </span>
                              <span className="badge badge-health" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span className="status-dot green" style={{ width: '6px', height: '6px' }} />
                                {dep.status || 'Healthy'}
                              </span>
                            </div>
                          </div>

                          {/* URL & Action Bar */}
                          {dep.url && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.75rem',
                              padding: '0.5rem 0.85rem',
                              background: 'var(--bg-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-light)',
                              flexWrap: 'wrap'
                            }}>
                              <code style={{ fontSize: '0.78rem', color: 'var(--text-primary)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                                {dep.url}
                              </code>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <button
                                  type="button"
                                  className="btn-ghost"
                                  onClick={() => handleCopy(dep.url, dep.id || depIdx)}
                                  title="Copy URL"
                                  style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                >
                                  {copiedEndpoint === (dep.id || depIdx) ? (
                                    <>
                                      <Check size={12} color="var(--color-emerald)" />
                                      <span style={{ color: 'var(--color-emerald)' }}>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                                <a
                                  href={dep.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-primary"
                                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                                >
                                  <span>Open Endpoint</span>
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Unique Capabilities & Version Intelligence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Version Highlights Card */}
                <div className="card" style={{ padding: '1.3rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
                      <Sparkles size={16} color="var(--primary)" />
                      <h3 className="t-md" style={{ fontWeight: 800, margin: 0 }}>
                        Capabilities in {currentVersion.versionNumber}
                      </h3>
                    </div>
                    <p className="t-xs" style={{ color: 'var(--text-secondary)' }}>
                      Distinct features and improvements delivered in {currentVersion.releaseName || currentVersion.versionNumber}.
                    </p>
                  </div>

                  {(!currentVersion.uniqueFeatures || currentVersion.uniqueFeatures.length === 0) ? (
                    <div className="t-xs" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Standard capabilities aligned with core project features.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {currentVersion.uniqueFeatures.map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.45rem 0.6rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}>
                          <CheckCircle2 size={15} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span className="t-sm" style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Release Metadata */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Release Date</span>
                      <span style={{ fontWeight: 600 }}>{currentVersion.releaseDate || product.lastUpdated || 'Current'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Release State</span>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{currentVersion.status || 'Active'}</span>
                    </div>
                    {product.repository?.githubUrl && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Source Repository</span>
                        <a href={product.repository.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                          <span>GitHub ({product.repository.branch || 'main'})</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Architecture & Stack Capsule */}
                <div className="card" style={{ padding: '1.15rem 1.3rem', background: 'var(--bg-surface)' }}>
                  <div className="t-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.65rem' }}>
                    Underlying Architecture
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    {product.arch && (
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Stack: </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{product.arch}</strong>
                      </div>
                    )}
                    {product.storage && (
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Storage: </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{product.storage}</strong>
                      </div>
                    )}
                    {product.protocols && (
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Protocols: </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{product.protocols}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
