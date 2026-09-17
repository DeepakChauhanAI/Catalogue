import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!passcode) {
      setError('Please enter your administrator passcode');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      // Accept admin123 or admin or password
      if (passcode.trim().toLowerCase() === 'admin123' || passcode.trim().toLowerCase() === 'admin' || passcode.trim().toLowerCase() === 'password') {
        setIsAuthenticating(false);
        onSuccess({
          role: 'admin',
          roleLabel: 'Portfolio Administrator'
        });
      } else {
        setIsAuthenticating(false);
        setError('Invalid passcode. Use demo passcode: admin123');
      }
    }, 350);
  };

  const handleQuickSSO = () => {
    setIsAuthenticating(true);
    setError('');
    setTimeout(() => {
      setIsAuthenticating(false);
      onSuccess({
        role: 'admin',
        roleLabel: 'Portfolio Administrator'
      });
    }, 350);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal"
        style={{
          maxWidth: 460,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
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
            <h2 className="t-md" style={{ fontWeight: 800, margin: 0 }}>
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

        {/* Quick Instant Verification Action */}
        <div style={{
          padding: '1rem',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Quick Demonstration Access
            </span>
            <span className="badge badge-health" style={{ fontSize: '0.66rem', padding: '0.1rem 0.35rem' }}>
              <CheckCircle2 size={10} style={{ marginRight: '0.2rem' }} /> Verified
            </span>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleQuickSSO}
            disabled={isAuthenticating}
            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.65rem' }}
          >
            <Sparkles size={15} />
            <span>{isAuthenticating ? 'Authenticating...' : '1-Click Admin Access (Demo Mode)'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
          <span className="t-xs" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>OR ENTER PASSCODE</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
        </div>

        {/* Manual Passcode Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div className="form-field" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={12} /> Administrator Passcode
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Enter passcode (demo: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                style={{ width: '100%', paddingLeft: '2.2rem' }}
              />
              <KeyRound size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
            <span className="hint" style={{ fontSize: '0.72rem' }}>
              Demo passcode: <code>admin123</code>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
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
