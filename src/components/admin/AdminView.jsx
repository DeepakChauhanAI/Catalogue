import React, { useState } from 'react';
import {
  FolderKanban, Inbox, Pencil, Sparkles, Play, Calendar, Plus, Trash2, X,
  ChevronLeft, ChevronRight, ImageIcon, Eye, Mail, Activity, ShieldCheck,
  TrendingUp, CheckCircle2, Server, LayoutGrid, List
} from 'lucide-react';
import EditProjectView from './EditProjectView';
import ProjectCard from '../demo/ProjectCard';
import { getInquiries, createDefaultProject } from '../../data/storageService';

const NAV = [
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'inquiries', label: 'Demo Requests', icon: Inbox }
];

export default function AdminView({ projects, onSaveProject, onDeleteProject, onPreviewProject }) {
  const [view, setView] = useState('projects');
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [adminViewMode, setAdminViewMode] = useState(() => {
    try { return localStorage.getItem('catalogue_admin_view_mode') || 'grid'; } catch { return 'grid'; }
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('catalogue_admin_sidebar_collapsed') === 'true'; } catch { return false; }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem('catalogue_admin_sidebar_collapsed', String(next)); } catch {}
      return next;
    });
  };

  const handleViewModeChange = (mode) => {
    setAdminViewMode(mode);
    try { localStorage.setItem('catalogue_admin_view_mode', mode); } catch {}
  };

  const list = Object.values(projects);
  const inquiries = getInquiries();
  const editing = editingId ? projects[editingId] : null;

  // Executive Telemetry Computations
  const healthCount = list.filter(p => p.domain === 'healthcare').length;
  const secCount = list.filter(p => p.domain === 'infosec').length;
  const flowCount = list.filter(p => p.demoFlow?.completeFlow?.enabled).length;
  const videoCount = list.filter(p => p.demoFlow?.demoVideo?.enabled).length;
  const flowPct = Math.round((flowCount / (list.length || 1)) * 100);
  const videoPct = Math.round((videoCount / (list.length || 1)) * 100);

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} aria-label="Admin navigation">
        <div className="navbar-brand" style={{
          padding: isSidebarCollapsed ? '0 0 0.75rem' : '0 0.5rem 0.75rem',
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 'var(--radius-sm)', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 900
          }}>DF</div>
          {!isSidebarCollapsed && (
            <div>
              <div className="t-sm" style={{ fontWeight: 800 }}>DemoFlow</div>
              <div className="t-xs" style={{ color: 'var(--text-muted)' }}>Admin Portal</div>
            </div>
          )}
        </div>

        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => { setView(n.id); setEditingId(null); setIsCreating(false); }}
            className={`admin-nav-item ${view === n.id && !editing && !isCreating ? 'active' : ''}`}
            title={isSidebarCollapsed ? n.label : undefined}
          >
            <n.icon size={16} />
            {!isSidebarCollapsed && (
              <>
                <span style={{ flex: 1, textAlign: 'left' }}>{n.label}</span>
                {n.id === 'inquiries' && inquiries.length > 0 && (
                  <span className="badge badge-brand" style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}>{inquiries.length}</span>
                )}
              </>
            )}
          </button>
        ))}

        {/* Sidebar Footer with Right-Aligned Subtle < or > Toggle */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? 'Expand sidebar (>)' : 'Collapse sidebar (<)'}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </aside>

      <div className="admin-content-area">
        <main className="admin-main">
          {isCreating ? (
            <EditProjectView
              project={createDefaultProject()}
              isNew={true}
              onCancel={() => setIsCreating(false)}
              onSave={(p) => {
                onSaveProject(p, true);
                setIsCreating(false);
              }}
            />
          ) : editing ? (
            <EditProjectView
              project={editing}
              isNew={false}
              onCancel={() => setEditingId(null)}
              onSave={(p) => {
                onSaveProject(p, false);
                setEditingId(null);
              }}
            />
          ) : view === 'projects' ? (
            <>
              {/* Top Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <div>
                  <h1 className="t-xl" style={{ fontWeight: 900, marginBottom: '0.3rem' }}>Operations Command Center</h1>
                  <p className="t-sm" style={{ color: 'var(--text-secondary)' }}>
                    Manage solutions portfolio, configure interactive capabilities, and review deployments
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Grid vs List View Switcher for Admin */}
                  <div className="view-mode-toggle" role="group" aria-label="Admin view layout switcher">
                    <button
                      type="button"
                      className={`view-toggle-btn ${adminViewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => handleViewModeChange('grid')}
                      title="Grid View"
                      aria-label="Switch to Grid View"
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      type="button"
                      className={`view-toggle-btn ${adminViewMode === 'list' ? 'active' : ''}`}
                      onClick={() => handleViewModeChange('list')}
                      title="List View"
                      aria-label="Switch to List View"
                    >
                      <List size={15} />
                    </button>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => { setIsCreating(true); setEditingId(null); }}
                  >
                    <Plus size={15} /> Add Project
                  </button>
                </div>
              </div>

              {/* Executive Operations KPI Dashboard */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span className="admin-kpi-label">Active Solutions</span>
                    <FolderKanban size={16} className="admin-kpi-icon" />
                  </div>
                  <div className="admin-kpi-val">{list.length}</div>
                  <div className="admin-kpi-sub">
                    <span style={{ color: 'var(--color-health)' }}>{healthCount} HealthCare</span> · <span style={{ color: 'var(--color-sec)' }}>{secCount} InfoSec</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span className="admin-kpi-label">Sandbox Readiness</span>
                    <Sparkles size={16} color="var(--primary)" />
                  </div>
                  <div className="admin-kpi-val">{flowPct}%</div>
                  <div className="admin-kpi-sub">
                    <CheckCircle2 size={12} color="var(--color-health)" />
                    <span>{flowCount} of {list.length} Interactive Flows active</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span className="admin-kpi-label">Video Coverage</span>
                    <Play size={16} color="var(--text-secondary)" />
                  </div>
                  <div className="admin-kpi-val">{videoPct}%</div>
                  <div className="admin-kpi-sub">
                    <span>{videoCount} walkthroughs configured</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <span className="admin-kpi-label">Client Inquiries</span>
                    <Inbox size={16} color="var(--text-secondary)" />
                  </div>
                  <div className="admin-kpi-val">{inquiries.length}</div>
                  <div className="admin-kpi-sub">
                    <span>{inquiries.length > 0 ? 'Submissions from demo showcase' : 'No pending inquiries'}</span>
                  </div>
                </div>
              </div>

              {/* Unified Rich Project Cards (Grid or List Layout) */}
              <div className={adminViewMode === 'grid' ? 'projects-grid' : 'projects-list'}>
                {list.map(p => (
                  <ProjectCard
                    key={p.id}
                    product={p}
                    viewMode={adminViewMode}
                    isAdmin={true}
                    onEdit={(id) => setEditingId(id)}
                    onPreview={onPreviewProject}
                    onDelete={(prod) => setProjectToDelete(prod)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <div>
                  <h1 className="t-xl" style={{ fontWeight: 900, marginBottom: '0.3rem' }}>Client Demo Requests</h1>
                  <p className="t-sm" style={{ color: 'var(--text-secondary)' }}>
                    {inquiries.length === 0 ? 'No requests yet — submissions from the client contact form land here.' :
                      `${inquiries.length} lead${inquiries.length > 1 ? 's' : ''} submitted from the Project Showcase`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {inquiries.map((q, i) => (
                  <div key={i} className="card" style={{ padding: '1.15rem 1.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span className="t-md" style={{ fontWeight: 800 }}>{q.name}</span>
                          <span className="badge badge-brand">{q.company || 'Enterprise Stakeholder'}</span>
                        </div>
                        <div className="t-xs" style={{ color: 'var(--primary)', marginTop: '0.25rem' }}>
                          {q.email} · Solution: <strong>{q.projectName}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span className="t-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                          {new Date(q.submittedAt).toLocaleString()}
                        </span>
                        <a
                          href={`mailto:${q.email}?subject=Demo Request: ${encodeURIComponent(q.projectName)}&body=Hi ${encodeURIComponent(q.name)},\n\nThank you for requesting a demo of ${encodeURIComponent(q.projectName)}.`}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                          title="Open Email Client"
                        >
                          <Mail size={12} /> Contact Client
                        </a>
                      </div>
                    </div>

                    {q.message && (
                      <div className="talk-track-quote" style={{ marginTop: '0.75rem' }}>
                        <p>"{q.message}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Confirmation modal for project deletion */}
      {projectToDelete && (
        <div className="modal-overlay" onClick={() => setProjectToDelete(null)} role="dialog" aria-modal="true" aria-label="Confirm project deletion">
          <div className="modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="t-md" style={{ fontWeight: 800 }}>Delete Project</h3>
              <button className="modal-close" onClick={() => setProjectToDelete(null)} aria-label="Close dialog"><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p className="t-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Are you sure you want to delete <strong>{projectToDelete.name}</strong>? This will remove the project from both the Admin Portal and the client Showcase.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setProjectToDelete(null)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={() => {
                  onDeleteProject(projectToDelete.id, projectToDelete.name);
                  setProjectToDelete(null);
                }}
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
