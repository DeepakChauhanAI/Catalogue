import React, { useRef, useEffect } from 'react';
import {
  X, Lightbulb, ExternalLink,
  CheckCircle2, Clock, Calendar, Users, Layers, ArrowRight, Tag, Sparkles, Activity, ShieldCheck
} from 'lucide-react';
import { RESEARCH_TYPES, normalizeDeliverables } from '../../data/catalogData';
import { DeliverableIcon, getDeliverableClass } from './deliverableUtils';

export default function ResearchDetailModal({
  study,
  projects = {},
  onClose,
  onNavigateToProject
}) {
  const modalBodyRef = useRef(null);

  useEffect(() => {
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [study?.id]);

  if (!study) return null;

  const isHealth = study.domain === 'healthcare';
  const isCompleted = study.status === 'completed' || study.status === 'concluded';
  const isInProgress = study.status === 'in-progress';

  const typeConfig = RESEARCH_TYPES.find(t => t.id === study.type);
  const typeLabel = typeConfig ? typeConfig.label : (study.type || 'Tech Spike');

  const targetProjectId = study.projectId || study.relatedProjects?.[0];
  const relatedProject = targetProjectId ? projects[targetProjectId] : null;

  const findingsList = study.keyTakeaways || study.keyFindings || [];
  const authorText = study.author || (study.leadResearchers || []).join(', ');
  const deliverablesList = normalizeDeliverables(study.deliverables);

  return (
    <div
      className="modal-overlay animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        className="modal research-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '960px',
          maxHeight: 'calc(100vh - 3.5rem)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-light, #e2e8f0)'
        }}
      >
        {/* Modal Header Bar */}
        <div
          className="modal-header"
          style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--border-light, #e2e8f0)',
            borderTop: `4px solid ${isHealth ? '#10b981' : '#6366f1'}`,
            padding: '1.15rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <span className="badge badge-brand font-mono" style={{ fontSize: '0.78rem', fontWeight: 800 }}>
              {study.code}
            </span>
            <span className={`badge ${isHealth ? 'badge-health' : 'badge-sec'}`} style={{ fontSize: '0.74rem' }}>
              {isHealth ? <Activity size={11} /> : <ShieldCheck size={11} />}
              <span>{isHealth ? 'Healthcare AI' : 'InfoSec'}</span>
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
              {typeLabel}
            </span>
            <span className={`badge ${isCompleted ? 'badge-health' : isInProgress ? 'badge-amber' : 'badge-neutral'}`}>
              <span className={`lifecycle-dot ${isCompleted ? 'active' : isInProgress ? 'on-hold' : 'slate'}`} style={{ width: 6, height: 6 }} />
              <span>{isCompleted ? 'Adopted in Project' : isInProgress ? 'Active Spike' : 'Explored / Inactive'}</span>
            </span>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close research note modal"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm, 6px)',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted, #64748b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: 2-Column Executive Brief */}
        <div
          ref={modalBodyRef}
          className="modal-body"
          style={{
            background: '#ffffff',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '1.5rem 1.75rem'
          }}
        >
          <div className="research-modal-2col">
            {/* Left Column (65%): Narrative, Decision, Context, Takeaways */}
            <div className="research-detail-narrative">
              {/* Title & Byline */}
              <div>
                <h2 className="t-xl" style={{ fontWeight: 900, lineHeight: 1.3, color: 'var(--text-primary)', margin: 0 }}>
                  {study.title}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '0.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {authorText && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users size={13} color="var(--primary)" />
                      <span>{authorText}</span>
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} />
                    <span>{study.date}</span>
                  </span>
                </div>
              </div>

              {/* Project Decision & Outcome Callout Box */}
              {study.decision && (
                <div style={{
                  padding: '1rem 1.25rem',
                  background: isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99, 102, 241, 0.08)',
                  borderLeft: `4px solid ${isCompleted ? '#10b981' : '#6366f1'}`,
                  borderRadius: 'var(--radius-sm, 6px)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                    <Sparkles size={15} color={isCompleted ? '#10b981' : '#6366f1'} />
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: isCompleted ? '#059669' : '#4f46e5', margin: 0 }}>
                      Project Decision & Outcome
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    {study.decision}
                  </p>
                </div>
              )}

              {/* Problem Context / Hypothesis */}
              <div>
                <div className="detail-section-title">
                  Why We Researched This (Problem Context)
                </div>
                <div className="card" style={{ padding: '1rem 1.2rem', background: 'var(--bg-subtle, #f8fafc)', border: '1px solid var(--border-light, #e2e8f0)' }}>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    {study.context || study.abstract}
                  </p>
                </div>
              </div>

              {/* Key Takeaways & Findings Checklist */}
              <div>
                <div className="detail-section-title">
                  Key Takeaways & Findings ({findingsList.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {findingsList.map((takeaway, idx) => (
                    <div key={idx} className="finding-checklist-card">
                      <span style={{ flexShrink: 0, marginTop: 1 }}>
                        <CheckCircle2 size={16} color="var(--color-health, #10b981)" />
                      </span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (35%): Deliverables Vault & Connected Project */}
            <div className="research-detail-sidebar">
              {/* Deliverables Vault */}
              <div>
                <div className="detail-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Deliverables & Collateral Vault</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                    {deliverablesList.length} item{deliverablesList.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {deliverablesList.map((deliv, idx) => {
                    const badgeClass = getDeliverableClass(deliv.type);
                    return (
                      <a
                        key={deliv.id || idx}
                        href={deliv.url}
                        target="_blank"
                        rel="noreferrer"
                        className="deliverable-vault-item"
                        title={`Open ${deliv.title || 'Deliverable'}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                          <span className={`collateral-icon-badge ${badgeClass}`}>
                            <DeliverableIcon type={deliv.type} size={16} />
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {deliv.title || 'Deliverable Link'}
                            </div>
                            {deliv.notes && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {deliv.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <ExternalLink size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </a>
                    );
                  })}

                  {deliverablesList.length === 0 && (
                    <div className="card" style={{ padding: '1.25rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      No external deliverables attached yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Connected Solution Card */}
              <div>
                <div className="detail-section-title">
                  Associated Solution
                </div>

                {relatedProject ? (
                  <div className="connected-solution-preview">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {relatedProject.name}
                      </span>
                      <span className={`badge ${relatedProject.domain === 'healthcare' ? 'badge-health' : 'badge-sec'}`} style={{ fontSize: '0.66rem' }}>
                        {relatedProject.domain === 'healthcare' ? 'HealthCare AI' : 'InfoSec'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.85rem' }}>
                      {relatedProject.tagline}
                    </p>

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                      onClick={() => {
                        onClose();
                        if (onNavigateToProject) onNavigateToProject(relatedProject.id);
                      }}
                    >
                      <span>Jump to Project Workspace</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="card" style={{ padding: '0.9rem 1rem', background: 'var(--bg-subtle, #f8fafc)', border: '1px solid var(--border-light, #e2e8f0)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <Sparkles size={13} />
                      <span>Standalone Technology Spike</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      General organizational research exploring foundation technologies, shared architectures, or multi-project infrastructure.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="modal-footer"
          style={{
            background: 'var(--bg-canvas, #f8fafc)',
            borderTop: '1px solid var(--border-light, #e2e8f0)',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Code: <strong>{study.code}</strong> · Domain: <strong>{isHealth ? 'HealthCare AI' : 'InfoSec'}</strong>
          </span>

          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm, 6px)',
              background: '#ffffff',
              border: '1px solid var(--border-medium, #cbd5e1)',
              color: 'var(--text-primary, #0f172a)',
              cursor: 'pointer'
            }}
          >
            Close Brief
          </button>
        </div>
      </div>
    </div>
  );
}
