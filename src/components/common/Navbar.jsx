import React from 'react';
import { ShieldCheck, LogOut, Layers } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({
  persona,
  authRole = 'client',
  activeHub = 'projects',
  onSwitchHub,
  projectCount = 0,
  researchCount = 0,
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
            {isAdmin ? 'Knowledge & Portfolio Admin' : 'Solutions & Research'}
          </div>
        </div>
      </button>

      {/* Center: Contextual Badge (No duplicate tab switcher) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        {isAdmin ? (
          <span className="badge badge-brand" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', fontWeight: 600 }}>
            <ShieldCheck size={13} style={{ marginRight: '0.35rem' }} />
            Enterprise Management Console
          </span>
        ) : (
          <span className="badge badge-neutral" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', fontWeight: 600 }}>
            <Layers size={13} style={{ marginRight: '0.35rem', color: 'var(--primary)' }} />
            Active Solutions & Projects Portfolio
          </span>
        )}
      </div>

      {/* Right Side Header Items: Status Badge & Subtle Exit/LogOut Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {isAdmin ? (
          <span className="badge badge-brand" style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}>
            Admin Mode
          </span>
        ) : (
          <span className="badge badge-health" style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}>
            Demo Showcase
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
