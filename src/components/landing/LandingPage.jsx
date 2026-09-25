import React from 'react';
import {
  ShieldCheck, Activity, Eye, ArrowRight, Lock, CheckCircle2
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

export default function LandingPage({
  onEnterClient,
  onEnterAdmin
}) {
  return (
    <div className="landing-container animate-fade-in">
      {/* Hero Section */}
      <section className="landing-hero" style={{ flex: 1, justifyContent: 'flex-start', padding: '2rem 1.75rem 3rem' }}>
        {/* Brand Emblem */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <BrandLogo size="hero" className="landing-hero-brand-logo" />
        </div>

        <div className="landing-hero-badge-row">
          <span className="domain-chip health" style={{ fontSize: '0.74rem' }}>
            <Activity size={12} /> HealthCare AI Ecosystem
          </span>
          <span className="domain-chip sec" style={{ fontSize: '0.74rem' }}>
            <ShieldCheck size={12} /> InfoSec & Cryptography Suite
          </span>
        </div>

        <h1 className="landing-hero-title">
          Enterprise Solution Portfolio <br />
          <span className="landing-hero-gradient">& Live Demo Hub</span>
        </h1>

        <p className="landing-hero-subtitle">
          A centralized platform to showcase, govern, and experience enterprise solutions — bridging interactive client sandboxes with multi-version deployment tracking across cloud and on-premise infrastructure.
        </p>

        {/* Dual Gateway Cards */}
        <div className="landing-gateway-grid">
          {/* Gateway Card 1: Client Showcase */}
          <div className="gateway-card" onClick={onEnterClient}>
            <div className="gateway-card-glow" />
            <div className="gateway-top">
              <span className="badge badge-neutral" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                <Eye size={12} style={{ marginRight: '0.3rem' }} /> Instant Guest Access
              </span>
              <span className="t-xs" style={{ color: 'var(--text-muted)' }}>Role: Demo Client</span>
            </div>

            <div className="gateway-content">
              <h3 className="gateway-title">Client Demo Showcase</h3>
              <p className="gateway-desc">
                Interactive executive sandbox for evaluating solution efficacy, clinical workflows, and live threat neutralization.
              </p>

              <ul className="gateway-features">
                <li>
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>4 Production-grade AI & InfoSec solutions</span>
                </li>
                <li>
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>Interactive product sandboxes & video walkthroughs</span>
                </li>
                <li>
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>Executive technical specifications & roadmap milestones</span>
                </li>
                <li>
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>One-click direct demo inquiry & talk-track scheduling</span>
                </li>
              </ul>
            </div>

            <div className="gateway-footer">
              <button type="button" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Enter Client Showcase</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Gateway Card 2: Admin Operations Console */}
          <div className="gateway-card" onClick={onEnterAdmin}>
            <div className="gateway-card-glow" />
            <div className="gateway-top">
              <span className="badge badge-neutral" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                <Lock size={11} style={{ marginRight: '0.3rem' }} /> RBAC Protected
              </span>
              <span className="t-xs" style={{ color: 'var(--text-muted)' }}>Role: Administrator</span>
            </div>

            <div className="gateway-content">
              <h3 className="gateway-title">Portfolio Admin Console</h3>
              <p className="gateway-desc">
                Governance, deployment orchestration, and release lifecycle portal for engineering leads and portfolio administrators.
              </p>

              <ul className="gateway-features">
                <li>
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>Multi-version release management & unique feature tags</span>
                </li>
                <li>
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>Infrastructure audit (AWS Cloud EKS, Local Server ports, On-Prem)</span>
                </li>
                <li>
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>Complete CRUD project catalog creation & metadata editing</span>
                </li>
                <li>
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>Client preview mode & interactive milestone roadmap Kanban</span>
                </li>
              </ul>
            </div>

            <div className="gateway-footer">
              <button type="button" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Lock size={14} />
                <span>Launch Admin Console</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Enterprise Solution Catalogue & Demo Hub · Confidential Internal & Client Operations Portal
        </div>
      </footer>
    </div>
  );
}
