import React, { useMemo, useState } from 'react';
import {
  Search, SlidersHorizontal, LayoutGrid, List, Sparkles, Activity, ShieldCheck,
  CheckCircle2, PauseCircle, Archive, BookOpen, Layers
} from 'lucide-react';
import ProjectCard from './ProjectCard';
import { DOMAIN_FILTERS, LIFECYCLE_STATUSES } from '../../data/catalogData';
import { filterProducts } from '../../data/filters';

export default function DemoView({ products, searchRef, onOpenDetail, onOpenVideo, onOpenFlow, onOpenContact }) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [status, setStatus] = useState('all');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('catalogue_view_mode') || 'grid');

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('catalogue_view_mode', mode);
  };

  const filtered = useMemo(
    () => filterProducts(products, { domain, status, query }),
    [products, domain, status, query]
  );

  const healthProjects = products.filter(p => p.domain === 'healthcare').length;
  const secProjects = products.filter(p => p.domain === 'infosec').length;
  const activeProjects = products.filter(p => (p.lifecycle?.status || 'active') === 'active').length;
  const onHoldProjects = products.filter(p => p.lifecycle?.status === 'on-hold').length;
  const collateralReadyCount = products.filter(p =>
    (p.collateral?.presentations?.length > 0) || (p.collateral?.sharepoint?.length > 0)
  ).length;

  return (
    <main className="showcase">
      <div className="showcase-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 className="t-hero" style={{ fontWeight: 900 }}>Solutions & Projects</h1>
          </div>
          <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Comprehensive showcase of organizational solutions, presentation decks, technical collateral, and interactive demos
          </p>
        </div>
        <div className="showcase-tools">
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              ref={searchRef}
              className="search-input"
              style={{ paddingLeft: '2rem', minWidth: 260 }}
              placeholder="Search projects, decks, SharePoint… (Ctrl+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span style={{ color: 'var(--text-faint)', display: 'flex' }}><SlidersHorizontal size={16} /></span>
          <select className="filter-select" value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="Filter by domain">
            {DOMAIN_FILTERS.map(d => (
              <option key={d.id} value={d.id}>{d.label === 'All Domains' ? 'All Domains' : d.label}</option>
            ))}
          </select>

          {/* Grid vs List View Switcher */}
          <div className="view-mode-toggle" role="group" aria-label="View layout switcher">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              title="Grid View"
              aria-label="Switch to Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              title="List View"
              aria-label="Switch to List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Telemetry Pulse Bar */}
      <div className="portfolio-pulse-bar">
        <div className="pulse-stats-group">
          <div className="pulse-stat-item">
            <span className="pulse-beacon" />
            <span>Catalogued Solutions: <strong>{products.length}</strong></span>
          </div>
          <div className="pulse-stat-item">
            <CheckCircle2 size={13} color="var(--color-emerald, #10b981)" />
            <span>Active Sprint: <strong>{activeProjects}</strong></span>
          </div>
          {onHoldProjects > 0 && (
            <div className="pulse-stat-item">
              <PauseCircle size={13} color="var(--color-amber, #f59e0b)" />
              <span>On-Hold / Paused: <strong>{onHoldProjects}</strong></span>
            </div>
          )}
          <div className="pulse-stat-item">
            <BookOpen size={13} color="var(--primary)" />
            <span>Collateral Linked: <strong>{collateralReadyCount}/{products.length}</strong></span>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="pulse-domain-pills">
          <button
            type="button"
            className={`pulse-domain-btn ${domain === 'all' ? 'active' : ''}`}
            onClick={() => setDomain('all')}
          >
            All Domains ({products.length})
          </button>
          <button
            type="button"
            className={`pulse-domain-btn ${domain === 'healthcare' ? 'active-health' : ''}`}
            onClick={() => setDomain('healthcare')}
          >
            <Activity size={12} color="var(--color-health)" /> HealthCare ({healthProjects})
          </button>
          <button
            type="button"
            className={`pulse-domain-btn ${domain === 'infosec' ? 'active-sec' : ''}`}
            onClick={() => setDomain('infosec')}
          >
            <ShieldCheck size={12} color="var(--color-sec)" /> InfoSec ({secProjects})
          </button>
        </div>
      </div>

      {/* Secondary Lifecycle Status Filter Bar - only when multiple states exist (e.g. Admin) */}
      {new Set(products.map(p => p.lifecycle?.status || 'active')).size > 1 && (
        <div className="lifecycle-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Layers size={14} />
            <span><strong>Lifecycle State:</strong></span>
          </div>
          <div className="lifecycle-pills">
            {LIFECYCLE_STATUSES.map(ls => {
              const count = ls.id === 'all'
                ? products.length
                : products.filter(p => (p.lifecycle?.status || 'active') === ls.id).length;

              if (count === 0 && ls.id !== 'all') return null;

              return (
                <button
                  key={ls.id}
                  type="button"
                  className={`lifecycle-btn ${status === ls.id ? 'active' : ''} ${ls.dotClass}`}
                  onClick={() => setStatus(ls.id)}
                >
                  <span className={`lifecycle-dot ${ls.dotClass}`} />
                  <span>{ls.id === 'all' ? 'All Lifecycle States' : ls.label}</span>
                  <span className="lifecycle-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={viewMode === 'grid' ? 'projects-grid' : 'projects-list'}>
        {filtered.map(p => (
          <ProjectCard
            key={p.id}
            product={p}
            viewMode={viewMode}
            onOpenDetail={onOpenDetail}
            onOpenVideo={onOpenVideo}
            onOpenFlow={onOpenFlow}
            onOpenContact={onOpenContact}
          />
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3.5rem 2rem', gridColumn: '1 / -1' }}>
            <p className="t-md" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>No projects match your filter criteria</p>
            <p className="t-sm" style={{ marginTop: '0.4rem' }}>Try clearing your search keyword, category, or lifecycle status filter</p>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '1.2rem', marginInline: 'auto' }}
              onClick={() => { setQuery(''); setDomain('all'); setStatus('all'); }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
