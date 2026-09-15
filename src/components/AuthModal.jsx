import React, { useState } from 'react';
import { X, Lock, ShieldAlert } from 'lucide-react';

// ponytail: client-side speed bump, not security — the passphrase ships in the bundle by design
const PRESENTER_PASSPHRASE = 'UniversalDemo#2026';

export default function AuthModal({ onClose, onSuccess }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === PRESENTER_PASSPHRASE) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(9, 13, 22, 0.75)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="card animate-fade-in"
        style={{ maxWidth: 420, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #0284c7, #6366f1)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Lock size={17} />
            </div>
            <div>
              <h3 className="t-md" style={{ fontWeight: 800 }}>Enter Presenter Mode</h3>
              <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
                Credentials become visible on screen
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <label className="t-xs" style={{ fontWeight: 700, display: 'block', marginBottom: '0.3rem' }} htmlFor="passphrase">
          Presenter passphrase
        </label>
        <input
          id="passphrase"
          type="password"
          className="search-input font-mono"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          autoFocus
        />
        {error && (
          <div className="t-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-rose)', marginTop: '0.5rem' }}>
            <ShieldAlert size={14} /> Wrong passphrase
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.1rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Stay shared</button>
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>Unlock</button>
        </div>
      </form>
    </div>
  );
}
