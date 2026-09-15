import React from 'react';
import { Boxes, Search, ShieldCheck, Eye, Sun, Moon, Lock, Unlock } from 'lucide-react';
import { DOMAIN_FILTERS } from '../data/catalogData';
import { allTags } from '../data/filters';

const DOMAIN_COLORS = { healthcare: 'var(--color-health)', infosec: 'var(--color-sec)' };

export default function Sidebar({
  products, filtered, selectedId,
  domain, setDomain, tag, setTag,
  query, setQuery, searchRef,
  mode, onLock, onUnlock,
  theme, onToggleTheme
}) {
  const isShared = mode === 'shared';
  const tags = allTags(products);
  const byDomain = (d) => products.filter(p => p.domain === d);
  const isDimmed = (id) => !filtered.some(p => p.id === id);

  return (
    <aside className="rail" aria-label="Product navigation">
      <div className="rail-brand">
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
          background: 'linear-gradient(135deg, #0284c7, #4f46e5)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Boxes size={20} />
        </div>
        <div>
          <div className="t-sm" style={{ fontWeight: 800 }}>Demo Hub</div>
          <div className="t-xs" style={{ color: 'var(--text-muted)' }}>Solution launchpad</div>
        </div>
      </div>

      {/* Mode toggle */}
      <button
        onClick={isShared ? onUnlock : onLock}
        title={isShared ? 'Unlock presenter mode (credentials visible)' : 'Return to shared mode (hide credentials)'}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
          padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem', fontWeight: 700,
          background: isShared ? 'var(--color-health-soft)' : 'var(--color-sec-soft)',
          color: isShared ? 'var(--color-health)' : 'var(--color-sec)',
          border: `1px solid ${isShared ? 'var(--color-health-border)' : 'var(--color-sec-border)'}`
        }}
      >
        {isShared ? <ShieldCheck size={16} /> : <Eye size={16} />}
        <span style={{ flex: 1, textAlign: 'left' }}>{isShared ? 'SHARED — client safe' : 'PRESENTER — creds visible'}</span>
        {isShared ? <Unlock size={14} /> : <Lock size={14} />}
      </button>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          ref={searchRef}
          className="search-input"
          style={{ paddingLeft: '2rem' }}
          placeholder="Search solutions…  (Ctrl+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Domain filter */}
      <div className="rail-section" role="group" aria-label="Domain filter">
        {DOMAIN_FILTERS.map(d => (
          <button
            key={d.id}
            onClick={() => setDomain(d.id)}
            className={`chip ${domain === d.id ? 'active' : ''}`}
            style={{ textAlign: 'left' }}
          >
            {d.id !== 'all' && <span className="status-dot" style={{ width: 6, height: 6, background: DOMAIN_COLORS[d.id] }} />}
            {d.label} ({d.id === 'all' ? products.length : byDomain(d.id).length})
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {tags.map(t => (
          <button key={t} onClick={() => setTag(t)} className={`chip ${tag === t ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Product list */}
      <nav className="rail-section" style={{ gap: '0.25rem' }} aria-label="Products">
        {['healthcare', 'infosec'].map(d => (
          <div key={d} className="rail-section" style={{ gap: '0.25rem' }}>
            <div className="t-label" style={{ color: DOMAIN_COLORS[d], marginTop: '0.5rem' }}>
              {d === 'healthcare' ? 'HealthCare' : 'InfoSec'}
            </div>
            {byDomain(d).map(p => {
              const idx = products.indexOf(p) + 1;
              return (
                <a
                  key={p.id}
                  href={`#/${p.id}`}
                  className={`rail-item ${selectedId === p.id ? 'active' : ''}`}
                  style={{ opacity: isDimmed(p.id) ? 0.45 : 1 }}
                >
                  <span className="rail-key">{idx}</span>
                  <span>{p.name}</span>
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Keyboard legend + theme */}
      <div className="kbd-legend">
        <span><kbd>1</kbd>–<kbd>{products.length}</kbd> jump to product</span>
        <span><kbd>Esc</kbd> back to overview</span>
        <span><kbd>Ctrl</kbd>+<kbd>K</kbd> search</span>
      </div>
      <button onClick={onToggleTheme} className="btn-ghost" title="Toggle theme">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        <span className="t-xs">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>
    </aside>
  );
}
