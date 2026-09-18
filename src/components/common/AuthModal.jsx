import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    const trimmed = password.trim();
    if (!trimmed) {
      setError('Please enter your administrator password');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      // Accept admin123, admin, password, or UniversalDemo#2026
      if (lower === 'admin123' || lower === 'admin' || lower === 'password' || trimmed === 'UniversalDemo#2026') {
        setIsAuthenticating(false);
        onSuccess({
          role: 'admin',
          roleLabel: 'Portfolio Administrator'
        });
      } else {
        setIsAuthenticating(false);
        setError('Invalid password. Demo password: admin123');
      }
    }, 300);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div
        className="modal"
        style={{
          maxWidth: 440,
          width: '92%',
          padding: '1.75rem',
          position: 'relative',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.28)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="modal-close"
          aria-label="Close Authentication Dialog"
          style={{ position: 'absolute', top: '1.1rem', right: '1.1rem' }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-subtle)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 id="auth-modal-title" className="t-md" style={{ fontWeight: 800, margin: 0 }}>
              Admin Console Access
            </h2>
            <p className="t-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Role-Based Access Verification
            </p>
          </div>
        </div>

        <p className="t-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Portfolio Administration privileges allow managing releases, inspecting deployment infrastructure endpoints, and editing solution catalogs.
        </p>

        {/* Administrator Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-field" style={{ margin: 0 }}>
            <label htmlFor="admin-password-input" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={12} /> Administrator Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password-input"
                type="password"
                placeholder="Enter password (demo: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="current-password"
                disabled={isAuthenticating}
                style={{ width: '100%', paddingLeft: '2.2rem' }}
              />
              <KeyRound
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none'
                }}
              />
            </div>
            <span className="hint" style={{ fontSize: '0.72rem' }}>
              Demo password: <code>admin123</code>
            </span>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--color-rose)',
              background: 'rgba(244, 63, 94, 0.1)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.78rem'
            }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.25rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isAuthenticating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? 'Verifying...' : 'Sign In as Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
