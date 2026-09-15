import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

const DOMAIN_COLORS = { healthcare: 'var(--color-health)', infosec: 'var(--color-sec)' };

export default function OverviewPane({ products, filtered, filteredBy, onReset }) {
  const pitch = {
    healthcare: 'Clinical intake, AI differentials, and hospital queue operations — verified against the running codebases.',
    infosec: 'Agentless PAN discovery and post-quantum cryptographic risk — verified against the running codebases.'
  };

  return (
    <main className="pane">
      <h1 className="t-hero" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
        Solution Portfolio
      </h1>
      <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: 640 }}>
        Launchpad for client demonstrations. Every deployment, credential, and feature below is
        verified against the actual product repositories.
      </p>

      {filteredBy && (
        <div className="card" style={{ marginTop: '1.25rem', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="t-sm" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} of {products.length} solutions match your filters
          </span>
          <button onClick={onReset} className="btn-secondary"><RotateCcw size={14} /> Reset filters</button>
        </div>
      )}

      {['healthcare', 'infosec'].map(d => {
        const items = filtered.filter(p => p.domain === d);
        if (!items.length) return null;
        return (
          <section key={d} style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <h2 className="t-lg" style={{ color: DOMAIN_COLORS[d] }}>{d === 'healthcare' ? 'HealthCare' : 'InfoSec'}</h2>
              <span className="t-xs" style={{ color: 'var(--text-faint)' }}>{items.length} solutions</span>
            </div>
            <p className="t-xs" style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0.85rem' }}>{pitch[d]}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {items.map(p => (
                <a key={p.id} href={`#/${p.id}`} className="card" style={{ display: 'block', transition: 'all var(--transition-fast)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${p.domain === 'healthcare' ? 'badge-health' : 'badge-sec'}`}>{p.badge}</span>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <h3 className="t-md" style={{ fontWeight: 800, marginTop: '0.6rem' }}>{p.name}</h3>
                  <div className="t-xs" style={{ color: DOMAIN_COLORS[p.domain], fontWeight: 600, marginTop: '0.15rem' }}>{p.tagline}</div>
                  <div className="t-xs font-mono" style={{ color: 'var(--text-faint)', marginTop: '0.6rem' }}>{p.version}</div>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <h3 className="t-md" style={{ fontWeight: 800 }}>No solutions match your filters</h3>
          <p className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Reset the search or switch the domain back to All.</p>
          <button onClick={onReset} className="btn-secondary" style={{ marginTop: '0.85rem' }}><RotateCcw size={14} /> Reset filters</button>
        </div>
      )}
    </main>
  );
}
