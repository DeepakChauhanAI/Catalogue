import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Play, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { redactDeployments } from '../data/filters';

import DermaDeskSimulator from './simulators/DermaDeskSimulator';
import OPDSimulator from './simulators/OPDSimulator';
import CCScannerSimulator from './simulators/CCScannerSimulator';
import PQCSimulator from './simulators/PQCSimulator';

const SIMULATORS = {
  dermadesk: DermaDeskSimulator,
  opd: OPDSimulator,
  cc_scanner: CCScannerSimulator,
  pqc_scanner: PQCSimulator
};

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export default function DetailPane({ product, mode, onUnlock, showToast }) {
  const [tab, setTab] = useState('overview');
  const [simRunning, setSimRunning] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const isShared = mode === 'shared';
  const isHealth = product.domain === 'healthcare';
  const deployments = redactDeployments(product.deployments, mode);
  const Simulator = SIMULATORS[product.id];

  const handleCopy = async (idx) => {
    const dep = product.deployments[idx]; // unredacted on purpose — clipboard only
    const ok = await copyText(`${dep.user} / ${dep.pass}`);
    if (ok) {
      setCopiedIdx(idx);
      showToast('Credentials copied — paste into the login form');
      setTimeout(() => setCopiedIdx(null), 2000);
    } else {
      showToast('Copy failed — clipboard unavailable');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Tech Specs' },
    { id: 'features', label: `Features (${product.features.length})` },
    ...(product.roadmap ? [{ id: 'roadmap', label: 'Roadmap' }] : [])
  ];

  return (
    <main className="pane">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h1 className="t-xl" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{product.name}</h1>
            <span className={`badge ${isHealth ? 'badge-health' : 'badge-sec'}`}>{product.badge}</span>
          </div>
          <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{product.tagline}</p>
        </div>
        <a href="#/" className="btn-ghost t-xs">← All solutions (Esc)</a>
      </div>

      {/* Launch panel */}
      <section className="card" style={{ marginTop: '1.5rem' }}>
        <div className="t-label" style={{ marginBottom: '0.75rem' }}>Launch — {product.deployments.length} environment{product.deployments.length > 1 ? 's' : ''}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {deployments.map((dep, idx) => (
            <div key={idx} className="launch-row">
              <div style={{ minWidth: 0 }}>
                <div className="t-sm" style={{ fontWeight: 700 }}>{dep.name}</div>
                <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-mono">{dep.env}</span> · {dep.status}
                </div>
                {dep.url && <div className="t-xs font-mono" style={{ color: 'var(--color-brand)', marginTop: '0.15rem' }}>{dep.url}</div>}
              </div>
              <div className="actions">
                {dep.user && dep.pass && isShared && (
                  <button onClick={() => handleCopy(idx)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.7rem' }}>
                    {copiedIdx === idx ? <Check size={13} color="var(--color-health)" /> : <Copy size={13} />}
                    {copiedIdx === idx ? 'Copied' : 'Copy creds'}
                  </button>
                )}
                {dep.url && (
                  <a href={dep.url} target="_blank" rel="noreferrer" className={isHealth ? 'btn-health' : 'btn-sec'} style={{ fontSize: '0.8rem', padding: '0.4rem 0.7rem' }}>
                    Open <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {isShared && product.deployments.some(d => d.pass) && (
          <div className="t-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-faint)', marginTop: '0.85rem' }}>
            <ShieldCheck size={14} />
            Shared mode: passwords copy to the clipboard without appearing on screen.
            <button onClick={onUnlock} style={{ color: 'var(--color-brand)', fontWeight: 700, textDecoration: 'underline' }}>Presenter mode</button>
          </div>
        )}
        {!isShared && (
          <div className="t-xs font-mono" style={{ marginTop: '0.85rem', color: 'var(--text-secondary)' }}>
            {product.deployments.filter(d => d.user).map(d => `${d.user} / ${d.pass}`).join('   ·   ')}
          </div>
        )}
      </section>

      {/* Simulator */}
      {Simulator && (
        <section className="card" style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div className="t-label">Offline fallback</div>
              <div className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Runs entirely in-browser — use when the client network blocks the real deployment.
              </div>
            </div>
            <button onClick={() => setSimRunning(s => !s)} className={isHealth ? 'btn-health' : 'btn-sec'}>
              <Play size={14} /> {simRunning ? 'Hide simulator' : 'Run simulator'}
            </button>
          </div>
          {simRunning && <div className="animate-fade-in" style={{ marginTop: '1.25rem' }}><Simulator /></div>}
        </section>
      )}

      {/* Talk track — presenter only */}
      {!isShared && product.talkTrack && (
        <section style={{
          marginTop: '1.25rem', padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-sm)',
          background: isHealth ? 'var(--color-health-soft)' : 'var(--color-sec-soft)',
          border: `1px solid ${isHealth ? 'var(--color-health-border)' : 'var(--color-sec-border)'}`
        }}>
          <div className="t-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: isHealth ? 'var(--color-health)' : 'var(--color-sec)' }}>
            <MessageSquareQuote size={14} /> Talk track — presenter only
          </div>
          <p className="t-sm" style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.3rem' }}>"{product.talkTrack}"</p>
        </section>
      )}

      {/* Tabs */}
      <div className="tab-bar" style={{ marginTop: '1.75rem' }} role="tablist">
        {tabs.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div className="t-label">Summary</div>
            <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.6 }}>{product.summary}</p>
          </div>
          <div>
            <div className="t-label">Built for</div>
            <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{product.targetClient}</p>
          </div>
        </div>
      )}

      {tab === 'specs' && (
        <div className="card animate-fade-in">
          {[
            ['Stack', product.arch],
            ['Storage', product.storage],
            ['Protocols', product.protocols]
          ].map(([label, value]) => (
            <div key={label} className="spec-row">
              <span className="t-label">{label}</span>
              <span className="t-sm font-mono" style={{ color: 'var(--color-brand)' }}>{value}</span>
            </div>
          ))}
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

      {tab === 'roadmap' && product.roadmap && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {product.roadmap.map(r => (
            <div key={r.title} className="card" style={{ padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <span className="t-sm" style={{ fontWeight: 700 }}>{r.title}</span>
                <p className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>{r.note}</p>
              </div>
              <span className={`badge ${r.priority === 'High' ? 'badge-health' : 'badge-neutral'}`}>{r.priority}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
