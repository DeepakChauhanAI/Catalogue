import React, { useMemo, useState } from 'react';
import {
  Search, SlidersHorizontal, Lightbulb, CheckCircle2, Clock,
  Sparkles, Activity, ShieldCheck, Plus, Layers, Filter,
  LayoutGrid, List, ArrowUpRight, Presentation, Folder, Code2, Eye, Pencil, Trash2, RotateCcw
} from 'lucide-react';
import ResearchCard from './ResearchCard';
import ResearchListRow from './ResearchListRow';
import ResearchDetailModal from './ResearchDetailModal';
import { DOMAIN_FILTERS, RESEARCH_STATUSES, RESEARCH_TYPES, normalizeDeliverables } from '../../data/catalogData';
import { filterResearches } from '../../data/filters';
import { DeliverableIcon, getDeliverableClass } from './deliverableUtils';

export default function ResearchView({
  researches,
  projects = {},
  isAdmin = false,
  searchRef,
  onOpenProjectDetail,
  onNavigateToProjectsHub,
  onCreateResearch,
  onEditResearch,
  onDeleteResearch
}) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [projectId, setProjectId] = useState('all');
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    try { return localStorage.getItem('catalogue_research_showcase_view_mode') || 'grid'; } catch { return 'grid'; }
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try { localStorage.setItem('catalogue_research_showcase_view_mode', mode); } catch {}
  };

  const researchList = useMemo(() => Object.values(researches), [researches]);

  const filtered = useMemo(
    () => filterResearches(researchList, { domain, status, type, projectId, query }),
    [researchList, domain, status, type, projectId, query]
  );

  const healthCount = researchList.filter(r => r.domain === 'healthcare').length;
  const secCount = researchList.filter(r => r.domain === 'infosec').length;
  const completedCount = researchList.filter(r => r.status === 'completed' || r.status === 'concluded').length;
  const inProgressCount = researchList.filter(r => r.status === 'in-progress').length;
  const projectList = Object.values(projects);

  const activeStudy = selectedStudyId ? researches[selectedStudyId] : null;

  return (
    <main className="showcase">
      {/* Header Bar */}
      <div className="showcase-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="t-hero" style={{ fontWeight: 900 }}>Project Research & Studies</h1>
            <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>Studies & Evaluations</span>
          </div>
          <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Internal technology evaluations, competitor analyses, feasibility studies, and user research conducted for organizational projects
          </p>
        </div>

        <div className="showcase-tools">
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              ref={searchRef}
              className="search-input"
              style={{ paddingLeft: '2rem', minWidth: 260 }}
              placeholder="Search research notes, studies, evaluations… (Ctrl+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Project Filter */}
          <select
            className="filter-select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            aria-label="Filter by associated project"
          >
            <option value="all">All Projects</option>
            {projectList.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            className="filter-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Filter by research type"
          >
            {RESEARCH_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle" role="group" aria-label="Research layout toggle">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              title="Grid View"
              aria-label="Switch to Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              title="List / Table View"
              aria-label="Switch to List / Table View"
            >
              <List size={14} />
            </button>
          </div>

          {isAdmin && onCreateResearch && (
            <button
              type="button"
              className="btn-primary"
              onClick={onCreateResearch}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
            >
              <Plus size={15} />
              <span>New Research Note</span>
            </button>
          )}
        </div>
      </div>

      {/* Research Telemetry Bar */}
      <div className="portfolio-pulse-bar">
        <div className="pulse-stats-group">
          <div className="pulse-stat-item">
            <Lightbulb size={13} color="var(--primary)" />
            <span>Research Notes: <strong>{researchList.length}</strong></span>
          </div>
          <div className="pulse-stat-item">
            <CheckCircle2 size={13} color="var(--color-emerald, #10b981)" />
            <span>Completed & Adopted: <strong>{completedCount}</strong></span>
          </div>
          <div className="pulse-stat-item">
            <Clock size={13} color="var(--color-amber, #f59e0b)" />
            <span>In Progress: <strong>{inProgressCount}</strong></span>
          </div>
          <div className="pulse-stat-item">
            <Layers size={13} color="var(--color-sec, #818cf8)" />
            <span>Covered Projects: <strong>{new Set(researchList.map(r => r.projectId || r.relatedProjects?.[0]).filter(Boolean)).size}</strong></span>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="pulse-domain-pills">
          <button
            type="button"
            className={`pulse-domain-btn ${domain === 'all' ? 'active' : ''}`}
            onClick={() => setDomain('all')}
          >
            All ({researchList.length})
          </button>
          <button
            type="button"
            className={`pulse-domain-btn ${domain === 'healthcare' ? 'active-health' : ''}`}
            onClick={() => setDomain('healthcare')}
          >
            <Activity size={12} color="var(--color-health)" /> HealthCare ({healthCount})
          </button>
          <button
            type="button"
            className={`pulse-domain-btn ${domain === 'infosec' ? 'active-sec' : ''}`}
            onClick={() => setDomain('infosec')}
          >
            <ShieldCheck size={12} color="var(--color-sec)" /> InfoSec ({secCount})
          </button>
        </div>
      </div>

      {/* Research Status Pills Bar */}
      <div className="lifecycle-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Lightbulb size={14} />
          <span><strong>Research Status:</strong></span>
        </div>
        <div className="lifecycle-pills">
          {RESEARCH_STATUSES.map(rs => {
            const count = rs.id === 'all'
              ? researchList.length
              : researchList.filter(r => r.status === rs.id || (rs.id === 'completed' && r.status === 'concluded')).length;

            if (count === 0 && rs.id !== 'all') return null;

            return (
              <button
                key={rs.id}
                type="button"
                className={`lifecycle-btn ${status === rs.id ? 'active' : ''}`}
                onClick={() => setStatus(rs.id)}
              >
                <span className={`lifecycle-dot ${rs.id === 'completed' ? 'active' : rs.id === 'in-progress' ? 'in-progress' : 'on-hold'}`} />
                <span>{rs.label}</span>
                <span className="lifecycle-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Grid vs Table / List */}
      {viewMode === 'grid' ? (
        <div className="research-grid">
          {filtered.map(study => (
            <ResearchCard
              key={study.id}
              study={study}
              projects={projects}
              isAdmin={isAdmin}
              onOpenDetail={setSelectedStudyId}
              onEdit={onEditResearch}
              onDelete={onDeleteResearch}
              onNavigateToProject={(projId) => {
                if (onOpenProjectDetail) {
                  onOpenProjectDetail(projId);
                }
              }}
            />
          ))}
        </div>
      ) : (
        /* Executive Modern List Rows View */
        <div className="research-list-container">
          {filtered.map(study => (
            <ResearchListRow
              key={study.id}
              study={study}
              projects={projects}
              isAdmin={isAdmin}
              onOpenDetail={setSelectedStudyId}
              onEdit={onEditResearch}
              onDelete={onDeleteResearch}
              onNavigateToProject={(projId) => {
                if (onOpenProjectDetail) {
                  onOpenProjectDetail(projId);
                }
              }}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3.5rem 2rem', gridColumn: '1 / -1', marginTop: '1rem' }}>
          <p className="t-md" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>No project research notes match your filter</p>
          <p className="t-sm" style={{ marginTop: '0.4rem' }}>Try clearing your search query or selecting All Projects / Types</p>
          <button
            type="button"
            className="btn-secondary"
            style={{ marginTop: '1.2rem', marginInline: 'auto' }}
            onClick={() => { setQuery(''); setDomain('all'); setStatus('all'); setType('all'); setProjectId('all'); }}
          >
            Reset Research Filters
          </button>
        </div>
      )}

      {/* Research Detail Modal */}
      {activeStudy && (
        <ResearchDetailModal
          study={activeStudy}
          projects={projects}
          onClose={() => setSelectedStudyId(null)}
          onNavigateToProject={(projId) => {
            setSelectedStudyId(null);
            if (onOpenProjectDetail) onOpenProjectDetail(projId);
          }}
        />
      )}
    </main>
  );
}
