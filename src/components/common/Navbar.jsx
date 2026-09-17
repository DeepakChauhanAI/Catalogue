import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({
  persona,
  authRole = 'client',
  onGoToLanding,
  onSignOut
}) {
  const isAdmin = persona === 'admin' && authRole === 'admin';

  return (
    <header className="navbar">
      {/* Brand / Logo as Home Button */}
      <button
        type="button"
        onClick={onGoToLanding}
        className="navbar-brand-btn"
        title="Return to Homepage / Landing Page"
      >
        <BrandLogo size={24} />
        <div style={{ textAlign: 'left' }}>
          <div className="t-sm" style={{ fontWeight: 800, lineHeight: 1.2 }}>Enterprise Hub</div>
          <div className="t-xs" style={{ color: 'var(--text-muted)' }}>
            {isAdmin ? 'Portfolio Admin Console' : 'Client Showcase'}
          </div>
        </div>
      </button>

      {/* Right Side Header Items: Status Badge & Subtle Exit/LogOut Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {isAdmin ? (
          <span className="badge badge-brand" style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={12} />
            <span>Admin Console</span>
          </span>
        ) : (
          <span className="badge badge-health" style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}>
            Client Showcase
          </span>
        )}

        <button
          type="button"
          className="btn-ghost"
          onClick={onSignOut || onGoToLanding}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            padding: 0,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title={isAdmin ? "Sign out & return to landing page" : "Exit to landing page"}
          aria-label={isAdmin ? "Sign out" : "Exit to landing page"}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
