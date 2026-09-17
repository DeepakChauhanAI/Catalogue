import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { DOMAIN_FILTERS } from '../../data/catalogData';
import { filterProducts } from '../../data/filters';

export default function DemoView({ products, searchRef, onOpenDetail, onOpenVideo, onOpenFlow, onOpenContact }) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('catalogue_view_mode') || 'grid');

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('catalogue_view_mode', mode);
  };

  const filtered = useMemo(
    () => filterProducts(products, { domain, query }),
    [products, domain, query]);

  const healthProjects = products.filter(p => p.domain === 'healthcare').length;
  const secProjects = products.filter(p => p.domain === 'infosec').length;
  const flowEnabledCount = products.filter(p => p.demoFlow?.completeFlow?.enabled).length;

  return (
    <main className="showcase">
      <div className="showcase-header">
        <div>
          <h1 className="t-hero" style={{ fontWeight: 900 }}>Project Showcase</h1>
          <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Explore our interactive demos and product walkthroughs
          </p>
        </div>
        <div className="showcase-tools">
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              ref={searchRef}
              className="search-input"
              style={{ paddingLeft: '2rem', minWidth: 240 }}
              placeholder="Search projects…  (Ctrl+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span style={{ color: 'var(--text-faint)', display: 'flex' }}><SlidersHorizontal size={16} /></span>
          <select className="filter-select" value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="Filter by category">
            {DOMAIN_FILTERS.map(d => (
              <option key={d.id} value={d.id}>{d.label === 'All' ? 'All Categories' : d.label}</option>
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
            <span>Verified Solutions: <strong>{products.length}</strong></span>
          </div>
          <div className="pulse-stat-item">
            <Sparkles size={13} color="var(--primary)" />
            <span>Sandbox Ready: <strong>{flowEnabledCount}/{products.length}</strong></span>
          </div>
          <div className="pulse-stat-item">
            <ShieldCheck size={13} color="var(--color-health)" />
            <span>Compliance: <strong>NIST & HIPAA Aligned</strong></span>
          </div>
        </div>

        <div className="pulse-domain-pills">
          <button
            type="button"
            className={`pulse-domain-btn ${domain === 'all' ? 'active' : ''}`}
            onClick={() => setDomain('all')}
          >
            All ({products.length})
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
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem', gridColumn: '1 / -1' }}>
            <p className="t-md" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>No projects match your search</p>
            <p className="t-sm" style={{ marginTop: '0.3rem' }}>Try a different keyword or category</p>
          </div>
        )}
      </div>
    </main>
  );
}
