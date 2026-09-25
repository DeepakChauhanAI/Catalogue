import React, { useState, useMemo } from 'react';
import {
  FolderKanban, Inbox, Pencil, Sparkles, Play, Calendar, Plus, Trash2, X,
  ChevronLeft, ChevronRight, ImageIcon, Eye, Mail, Activity, ShieldCheck,
  TrendingUp, CheckCircle2, Server, LayoutGrid, List, Lightbulb, BookOpen,
  PauseCircle, FileText, Search, Clock, Presentation, ExternalLink,
  Code2, Tag, ArrowUpRight, RotateCcw
} from 'lucide-react';
import EditProjectView from './EditProjectView';
import ProjectCard from '../demo/ProjectCard';
import ResearchCard from '../research/ResearchCard';
import ResearchListRow from '../research/ResearchListRow';
import EditResearchModal from '../research/EditResearchModal';
import ResearchDetailModal from '../research/ResearchDetailModal';
import { getInquiries, createDefaultProject, createDefaultResearch } from '../../data/storageService';
import { filterResearches } from '../../data/filters';
import { RESEARCH_TYPES, RESEARCH_STATUSES, normalizeDeliverables } from '../../data/catalogData';
import { DeliverableIcon, getDeliverableClass } from '../research/deliverableUtils';

const NAV = [
  { id: 'projects', label: 'Solutions & Projects', icon: FolderKanban },
  { id: 'research', label: 'Project Research & Studies', icon: Lightbulb },
  { id: 'inquiries', label: 'Demo Requests', icon: Inbox }
];

export default function AdminView({
  projects,
  researches = {},
  onSaveProject,
  onDeleteProject,
  onPreviewProject,
  onSaveResearch,
  onDeleteResearch
}) {
  const [view, setView] = useState('projects');
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Research Management State
  const [editingResearchId, setEditingResearchId] = useState(null);
  const [isCreatingResearch, setIsCreatingResearch] = useState(false);
  const [researchToDelete, setResearchToDelete] = useState(null);
  const [previewResearchId, setPreviewResearchId] = useState(null);

  const [adminViewMode, setAdminViewMode] = useState(() => {
    try { return localStorage.getItem('catalogue_admin_view_mode') || 'grid'; } catch { return 'grid'; }
  });
  const [researchViewMode, setResearchViewMode] = useState(() => {
    try { return localStorage.getItem('catalogue_admin_research_view_mode') || 'grid'; } catch { return 'grid'; }
  });
  const [researchQuery, setResearchQuery] = useState('');
  const [researchDomain, setResearchDomain] = useState('all');
  const [researchStatus, setResearchStatus] = useState('all');
  const [researchType, setResearchType] = useState('all');
  const [researchProjectId, setResearchProjectId] = useState('all');

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

  const handleResearchViewModeChange = (mode) => {
    setResearchViewMode(mode);
    try { localStorage.setItem('catalogue_admin_research_view_mode', mode); } catch {}
  };

  const list = Object.values(projects);
  const researchList = Object.values(researches);
  const inquiries = getInquiries();
  const editing = editingId ? projects[editingId] : null;
  const editingResearch = editingResearchId ? researches[editingResearchId] : null;
  const previewResearch = previewResearchId ? researches[previewResearchId] : null;

  // Filtered research list
  const filteredResearchList = useMemo(() => {
    return filterResearches(researchList, {
      domain: researchDomain,
      status: researchStatus,
      type: researchType,
      projectId: researchProjectId,
      query: researchQuery
    });
  }, [researchList, researchDomain, researchStatus, researchType, researchProjectId, researchQuery]);



  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} aria-label="Admin navigation">


        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => {
              setView(n.id);
              setEditingId(null);
              setIsCreating(false);
              setEditingResearchId(null);
              setIsCreatingResearch(false);
            }}
            className={`admin-nav-item ${view === n.id && !editing && !isCreating ? 'active' : ''}`}
            title={isSidebarCollapsed ? n.label : undefined}
          >
            <n.icon size={16} />
            {!isSidebarCollapsed && (
              <span style={{ flex: 1, textAlign: 'left' }}>{n.label}</span>
            )}
          </button>
        ))}

        {/* Sidebar Footer with Collapse Toggle */}
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
          {/* Creating or Editing Project */}
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
                  <h1 className="t-xl" style={{ fontWeight: 900, marginBottom: '0.3rem' }}>Solutions & Projects Command Center</h1>
                  <p className="t-sm" style={{ color: 'var(--text-secondary)' }}>
                    Manage organization solutions portfolio, lifecycle statuses, PowerPoint presentations, and SharePoint directories
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
                    <Plus size={15} /> Add Solution
                  </button>
                </div>
              </div>


              {/* Unified Rich Project Cards */}
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
          ) : view === 'research' ? (
            /* Research Studies Management View */
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <div>
                  <h1 className="t-xl" style={{ fontWeight: 900, marginBottom: '0.3rem' }}>Project Research & Studies</h1>
                  <p className="t-sm" style={{ color: 'var(--text-secondary)' }}>
                    Manage internal technology evaluations, competitor analyses, feasibility studies, and project outcomes
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsCreatingResearch(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Plus size={15} /> Add Research Study
                </button>
              </div>


              {/* Research Interactive Command & Filter Toolbar */}
              <div className="research-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.9rem 1.15rem' }}>
                {/* Top Row: Search Input + Mode Toggle + Add Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.85rem', width: '100%', flexWrap: 'wrap' }}>
                  <div className="research-search-wrap" style={{ flex: '1 1 300px', maxWidth: 'none' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="search-input"
                      placeholder="Search notes, evaluations, studies... (Ctrl+K)"
                      value={researchQuery}
                      onChange={(e) => setResearchQuery(e.target.value)}
                      aria-label="Search research notes"
                    />
                    <span className="search-shortcut-hint">Ctrl+K</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                    {/* Grid vs List View Switcher */}
                    <div className="view-mode-toggle" role="group" aria-label="Research layout toggle">
                      <button
                        type="button"
                        className={`view-toggle-btn ${researchViewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => handleResearchViewModeChange('grid')}
                        title="Grid View"
                        aria-label="Switch to Grid View"
                      >
                        <LayoutGrid size={15} />
                      </button>
                      <button
                        type="button"
                        className={`view-toggle-btn ${researchViewMode === 'list' ? 'active' : ''}`}
                        onClick={() => handleResearchViewModeChange('list')}
                        title="List View"
                        aria-label="Switch to List View"
                      >
                        <List size={15} />
                      </button>
                    </div>

                    <button
                      className="btn-primary"
                      onClick={() => { setIsCreatingResearch(true); setEditingResearchId(null); }}
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={14} /> Add Note
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Filter Strip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', width: '100%', borderTop: '1px solid var(--border-light, #e2e8f0)', paddingTop: '0.65rem' }}>
                  {/* Domain Filter Pills */}
                  <div className="pulse-domain-pills">
                    <button
                      type="button"
                      className={`pulse-domain-btn ${researchDomain === 'all' ? 'active' : ''}`}
                      onClick={() => setResearchDomain('all')}
                    >
                      All ({researchList.length})
                    </button>
                    <button
                      type="button"
                      className={`pulse-domain-btn ${researchDomain === 'healthcare' ? 'active-health' : ''}`}
                      onClick={() => setResearchDomain('healthcare')}
                    >
                      <Activity size={12} color="var(--color-health)" /> HealthCare
                    </button>
                    <button
                      type="button"
                      className={`pulse-domain-btn ${researchDomain === 'infosec' ? 'active-sec' : ''}`}
                      onClick={() => setResearchDomain('infosec')}
                    >
                      <ShieldCheck size={12} color="var(--color-sec)" /> InfoSec
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    className="filter-select"
                    value={researchStatus}
                    onChange={(e) => setResearchStatus(e.target.value)}
                    style={{ fontSize: '0.78rem', height: 34, padding: '0 0.65rem' }}
                    aria-label="Filter by research status"
                  >
                    {RESEARCH_STATUSES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>

                  {/* Research Type Dropdown */}
                  <select
                    className="filter-select"
                    value={researchType}
                    onChange={(e) => setResearchType(e.target.value)}
                    style={{ fontSize: '0.78rem', height: 34, padding: '0 0.65rem' }}
                    aria-label="Filter by research type"
                  >
                    {RESEARCH_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>

                  {/* Associated Solution Dropdown */}
                  <select
                    className="filter-select"
                    value={researchProjectId}
                    onChange={(e) => setResearchProjectId(e.target.value)}
                    style={{ fontSize: '0.78rem', height: 34, padding: '0 0.65rem' }}
                    aria-label="Filter by associated project"
                  >
                    <option value="all">All Solutions</option>
                    {list.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  {/* Reset Filters button */}
                  {(researchDomain !== 'all' || researchStatus !== 'all' || researchType !== 'all' || researchProjectId !== 'all' || researchQuery) && (
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        setResearchQuery('');
                        setResearchDomain('all');
                        setResearchStatus('all');
                        setResearchType('all');
                        setResearchProjectId('all');
                      }}
                      title="Reset all filters"
                    >
                      <RotateCcw size={12} /> Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content: Grid vs Table / List */}
              {researchViewMode === 'grid' ? (
                <div className="research-grid">
                  {filteredResearchList.map(study => (
                    <ResearchCard
                      key={study.id}
                      study={study}
                      projects={projects}
                      isAdmin={true}
                      onOpenDetail={(id) => setPreviewResearchId(id)}
                      onEdit={(id) => setEditingResearchId(id)}
                      onDelete={(std) => setResearchToDelete(std)}
                      onNavigateToProject={onPreviewProject}
                    />
                  ))}
                </div>
              ) : (
                /* Executive Modern List Rows View */
                <div className="research-list-container">
                  {filteredResearchList.map(study => (
                    <ResearchListRow
                      key={study.id}
                      study={study}
                      projects={projects}
                      isAdmin={true}
                      onOpenDetail={(id) => setPreviewResearchId(id)}
                      onEdit={(id) => setEditingResearchId(id)}
                      onDelete={(std) => setResearchToDelete(std)}
                      onNavigateToProject={onPreviewProject}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {filteredResearchList.length === 0 && (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 2rem', marginTop: '1rem' }}>
                  <Lightbulb size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4, color: 'var(--primary)' }} />
                  <h3 className="t-md" style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    No research notes match your filters
                  </h3>
                  <p className="t-sm" style={{ color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 1.25rem' }}>
                    We couldn't find any research studies matching your current query or category selections.
                  </p>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setResearchQuery('');
                      setResearchDomain('all');
                      setResearchStatus('all');
                      setResearchType('all');
                      setResearchProjectId('all');
                    }}
                    style={{ margin: '0 auto', fontSize: '0.8rem' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Inquiries View */
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
                Are you sure you want to delete <strong>{projectToDelete.name}</strong>? This will remove the project and its associated collateral.
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

      {/* Confirmation modal for research deletion */}
      {researchToDelete && (
        <div className="modal-overlay" onClick={() => setResearchToDelete(null)} role="dialog" aria-modal="true" aria-label="Confirm study deletion">
          <div className="modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="t-md" style={{ fontWeight: 800 }}>Delete Research Study</h3>
              <button className="modal-close" onClick={() => setResearchToDelete(null)} aria-label="Close dialog"><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p className="t-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Are you sure you want to delete research study <strong>{researchToDelete.code}: {researchToDelete.title}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setResearchToDelete(null)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={() => {
                  if (onDeleteResearch) onDeleteResearch(researchToDelete.id);
                  setResearchToDelete(null);
                }}
              >
                Delete Study
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creating Research Modal */}
      {isCreatingResearch && (
        <EditResearchModal
          study={createDefaultResearch()}
          projects={projects}
          isNew={true}
          onClose={() => setIsCreatingResearch(false)}
          onSave={(std) => {
            if (onSaveResearch) onSaveResearch(std, true);
            setIsCreatingResearch(false);
          }}
        />
      )}

      {/* Editing Research Modal */}
      {editingResearch && (
        <EditResearchModal
          study={editingResearch}
          projects={projects}
          isNew={false}
          onClose={() => setEditingResearchId(null)}
          onSave={(std) => {
            if (onSaveResearch) onSaveResearch(std, false);
            setEditingResearchId(null);
          }}
        />
      )}

      {/* Previewing Research Modal */}
      {previewResearch && (
        <ResearchDetailModal
          study={previewResearch}
          projects={projects}
          onClose={() => setPreviewResearchId(null)}
          onNavigateToProject={onPreviewProject}
        />
      )}
    </div>
  );
}
