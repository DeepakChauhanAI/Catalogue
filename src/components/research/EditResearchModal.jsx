import React, { useState } from 'react';
import {
  X, Lightbulb, CheckCircle2,
  Plus, Trash2, Save, ExternalLink
} from 'lucide-react';
import { DOMAIN_FILTERS, RESEARCH_STATUSES, RESEARCH_TYPES, normalizeDeliverables } from '../../data/catalogData';
import {
  DELIVERABLE_CATEGORIES,
  DELIVERABLE_PRESETS,
  DeliverableIcon,
  getDeliverableClass
} from './deliverableUtils';

export default function EditResearchModal({
  study,
  projects = {},
  isNew = false,
  onClose,
  onSave
}) {
  const [draft, setDraft] = useState(() => {
    const d = structuredClone(study);
    if (!d.keyTakeaways && d.keyFindings) d.keyTakeaways = [...d.keyFindings];
    if (!d.context && d.abstract) d.context = d.abstract;
    if (!d.projectId && d.relatedProjects?.[0]) d.projectId = d.relatedProjects[0];
    return d;
  });
  const [deliverables, setDeliverables] = useState(() => {
    return normalizeDeliverables(study?.deliverables);
  });
  const [newTakeaway, setNewTakeaway] = useState('');
  const [error, setError] = useState('');

  const projectList = Object.values(projects);

  const handleFieldChange = (field, value) => {
    setDraft(d => {
      const updated = { ...d, [field]: value };
      if (field === 'context') updated.abstract = value;
      if (field === 'projectId') {
        const found = projects[value];
        if (found) {
          updated.projectName = found.name;
          updated.domain = found.domain || updated.domain;
          updated.relatedProjects = [value];
        }
      }
      return updated;
    });
  };

  const handleAddPreset = (preset) => {
    const newItem = {
      id: `deliv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: preset.title,
      url: '',
      type: preset.type,
      notes: preset.notes || ''
    };
    setDeliverables(prev => [...prev, newItem]);
  };

  const handleAddBlankDeliverable = () => {
    const newItem = {
      id: `deliv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: '',
      url: '',
      type: 'document',
      notes: ''
    };
    setDeliverables(prev => [...prev, newItem]);
  };

  const handleUpdateDeliverable = (index, field, value) => {
    setDeliverables(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      if (field === 'type') {
        const cat = DELIVERABLE_CATEGORIES.find(c => c.id === value);
        if (cat && (!next[index].notes || DELIVERABLE_CATEGORIES.some(c => c.defaultNotes === next[index].notes))) {
          next[index].notes = cat.defaultNotes;
        }
      }
      return next;
    });
  };

  const handleRemoveDeliverable = (index) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTakeaway = () => {
    if (!newTakeaway.trim()) return;
    setDraft(d => {
      const updated = [...(d.keyTakeaways || d.keyFindings || []), newTakeaway.trim()];
      return {
        ...d,
        keyTakeaways: updated,
        keyFindings: updated
      };
    });
    setNewTakeaway('');
  };

  const handleRemoveTakeaway = (idx) => {
    setDraft(d => {
      const updated = (d.keyTakeaways || d.keyFindings || []).filter((_, i) => i !== idx);
      return {
        ...d,
        keyTakeaways: updated,
        keyFindings: updated
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!draft.title?.trim()) {
      setError('Title is required');
      return;
    }
    if (!draft.code?.trim()) {
      setError('Note Code is required (e.g. SPIKE-01)');
      return;
    }
    if (!draft.context?.trim() && !draft.abstract?.trim()) {
      setError('Problem context / why we researched this is required');
      return;
    }

    const cleanedDeliverables = deliverables
      .map(d => ({
        ...d,
        title: d.title?.trim() || '',
        url: d.url?.trim() || '',
        type: d.type || 'link',
        notes: d.notes?.trim() || ''
      }))
      .filter(d => d.title || d.url);

    const finalDraft = {
      ...draft,
      abstract: draft.context || draft.abstract,
      keyFindings: draft.keyTakeaways || draft.keyFindings || [],
      deliverables: cleanedDeliverables
    };
    onSave(finalDraft, isNew);
    onClose();
  };

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
        className="modal research-edit-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '840px',
          maxHeight: 'calc(100vh - 3.5rem)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-light, #e2e8f0)'
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--border-light, #e2e8f0)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="collateral-icon-badge docs">
              <Lightbulb size={18} />
            </span>
            <div>
              <h2 className="t-lg" style={{ fontWeight: 800 }}>
                {isNew ? 'New Project Research Note / Spike' : `Edit Research: ${draft.code}`}
              </h2>
              <p className="t-xs" style={{ color: 'var(--text-muted)' }}>
                Track tech evaluations, architecture spikes, user discovery, and decisions for specific projects
              </p>
            </div>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close editor"
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

        {/* Form Body */}
        <form
          onSubmit={handleSave}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden'
          }}
        >
          <div
            className="modal-body"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '1.5rem'
            }}
          >
          {error && (
            <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-rose)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
              {error}
            </div>
          )}

          {/* Row 1: Code, Project & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-field">
              <label className="form-label">Note Code <span style={{ color: 'var(--color-rose)' }}>*</span></label>
              <input
                className="form-input font-mono"
                value={draft.code || ''}
                onChange={(e) => handleFieldChange('code', e.target.value)}
                placeholder="e.g. SPIKE-01"
                required
              />
              <span className="form-hint">Unique identifier for tracking</span>
            </div>

            <div className="form-field">
              <label className="form-label">
                Associated Project <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(Optional)</span>
              </label>
              <select
                className="form-select"
                value={draft.projectId || draft.relatedProjects?.[0] || ''}
                onChange={(e) => handleFieldChange('projectId', e.target.value)}
              >
                <option value="">None / Standalone Tech Research (Unrelated)</option>
                {projectList.map(p => (
                  <option key={p.id} value={p.id}>Project: {p.name}</option>
                ))}
              </select>
              <span className="form-hint">Leave blank if this spike is independent or not project-specific</span>
            </div>

            <div className="form-field">
              <label className="form-label">Research Status <span style={{ color: 'var(--color-rose)' }}>*</span></label>
              <select
                className="form-select"
                value={draft.status || 'completed'}
                onChange={(e) => handleFieldChange('status', e.target.value)}
              >
                <option value="completed">Completed & Adopted</option>
                <option value="in-progress">Active Spike / In-Progress</option>
                <option value="evaluated">Explored / Inactive</option>
              </select>
              <span className="form-hint">Current adoption or evaluation state</span>
            </div>
          </div>

          {/* Row 2: Research Type & Domain */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-field">
              <label className="form-label">Research Type <span style={{ color: 'var(--color-rose)' }}>*</span></label>
              <select
                className="form-select"
                value={draft.type || 'tech-eval'}
                onChange={(e) => handleFieldChange('type', e.target.value)}
              >
                {RESEARCH_TYPES.filter(t => t.id !== 'all').map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Domain Area <span style={{ color: 'var(--color-rose)' }}>*</span></label>
              <select
                className="form-select"
                value={draft.domain || 'healthcare'}
                onChange={(e) => handleFieldChange('domain', e.target.value)}
              >
                <option value="healthcare">HealthCare AI</option>
                <option value="infosec">InfoSec & Cryptography</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="form-field" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Topic / Research Title <span style={{ color: 'var(--color-rose)' }}>*</span></label>
            <input
              className="form-input"
              style={{ fontWeight: 600 }}
              value={draft.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Evaluation: Whisper API vs Azure Speech for Multilingual OPD Clinics"
              required
            />
          </div>

          {/* Author & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-field">
              <label className="form-label">Author / Lead Contributors</label>
              <input
                className="form-input"
                value={draft.author || (draft.leadResearchers || []).join(', ')}
                onChange={(e) => {
                  handleFieldChange('author', e.target.value);
                  handleFieldChange('leadResearchers', e.target.value.split(',').map(s => s.trim()).filter(Boolean));
                }}
                placeholder="e.g. Ramesh Patel (Backend Lead), Dr. Sarah Lin"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Date Completed / Updated</label>
              <input
                className="form-input"
                value={draft.date || ''}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                placeholder="e.g. Sep 2026"
              />
            </div>
          </div>

          {/* Context / Why We Researched This */}
          <div className="form-field" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              Why We Researched This (Problem Context) <span style={{ color: 'var(--color-rose)' }}>*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={draft.context || draft.abstract || ''}
              onChange={(e) => handleFieldChange('context', e.target.value)}
              placeholder="Explain the background problem, technology question, or spike rationale..."
              required
              style={{ minHeight: '90px' }}
            />
            <span className="form-hint">Summarize the core technical question, bottleneck, or decision needed</span>
          </div>

          {/* Project Decision & Outcome */}
          <div className="form-field" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              Decision & Outcome <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(Optional)</span>
            </label>
            <textarea
              className="form-textarea"
              rows={2}
              value={draft.decision || ''}
              onChange={(e) => handleFieldChange('decision', e.target.value)}
              placeholder="What was decided? e.g. Adopted Whisper-large-v3 locally; passed hospital sovereignty clearance and cut cloud API latency by 35%."
              style={{ minHeight: '75px' }}
            />
            <span className="form-hint">State the conclusion, tool selection, or architectural recommendation</span>
          </div>

          {/* Key Takeaways List */}
          <div className="form-field" style={{ marginBottom: '1.35rem' }}>
            <label className="form-label">
              Key Takeaways & Findings ({((draft.keyTakeaways || draft.keyFindings) || []).length})
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.65rem' }}>
              {((draft.keyTakeaways || draft.keyFindings) || []).map((takeaway, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-subtle, #f1f5f9)', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm, 6px)', border: '1px solid var(--border-light, #e2e8f0)' }}>
                  <CheckCircle2 size={15} color="var(--color-health, #059669)" style={{ flexShrink: 0 }} />
                  <span className="t-xs" style={{ flex: 1, color: 'var(--text-primary, #0f172a)' }}>{takeaway}</span>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => handleRemoveTakeaway(idx)}
                    style={{ padding: '0.25rem', color: 'var(--color-rose, #f43f5e)', cursor: 'pointer' }}
                    title="Remove takeaway"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-input"
                value={newTakeaway}
                onChange={(e) => setNewTakeaway(e.target.value)}
                placeholder="Type a concrete takeaway, benchmark result, or finding..."
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTakeaway(); } }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddTakeaway}
                style={{ flexShrink: 0, padding: '0.6rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={15} /> Add
              </button>
            </div>
          </div>

          {/* Deliverables & Collateral Vault (Dynamic Admin Editor) */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', background: 'var(--bg-subtle, #f8fafc)', border: '1px solid var(--border-light, #e2e8f0)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
              <div>
                <h4 className="t-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', fontWeight: 800, margin: 0 }}>
                  Deliverables & Collateral Vault ({deliverables.length})
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Define custom deliverables, titles, and collateral links for this research study
                </p>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddBlankDeliverable}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={13} /> Add Custom Deliverable
              </button>
            </div>

            {/* Quick Presets Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem', paddingTop: '0.2rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '0.2rem' }}>
                Quick Presets:
              </span>
              {DELIVERABLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => handleAddPreset(preset)}
                  title={`Quick add ${preset.title}`}
                >
                  <DeliverableIcon type={preset.type} size={12} />
                  <span>+ {preset.title}</span>
                </button>
              ))}
            </div>

            {/* Deliverables List */}
            {deliverables.length === 0 ? (
              <div style={{
                padding: '1.25rem',
                textAlign: 'center',
                background: '#ffffff',
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px dashed var(--border-medium, #cbd5e1)',
                color: 'var(--text-muted)'
              }}>
                <p style={{ fontSize: '0.8rem', margin: '0 0 0.4rem', fontWeight: 600 }}>
                  No deliverables attached yet.
                </p>
                <p style={{ fontSize: '0.74rem', margin: 0, color: 'var(--text-secondary)' }}>
                  Click one of the quick presets above (Slide Deck, SharePoint, PoC Sandbox, ADR) or "+ Add Custom Deliverable" to attach collateral.
                </p>
              </div>
            ) : (
              <div className="edit-deliverables-container">
                {deliverables.map((deliv, index) => {
                  const badgeClass = getDeliverableClass(deliv.type);
                  return (
                    <div key={deliv.id || index} className="edit-deliverable-card">
                      {/* Top Row: Icon, Custom Title Input, Category Selector, Delete button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span className={`collateral-icon-badge ${badgeClass}`} style={{ width: 28, height: 28 }}>
                          <DeliverableIcon type={deliv.type} size={15} />
                        </span>

                        <div style={{ flex: '1 1 200px' }}>
                          <input
                            className="form-input"
                            style={{ fontSize: '0.82rem', fontWeight: 600, padding: '0.4rem 0.65rem' }}
                            value={deliv.title || ''}
                            onChange={(e) => handleUpdateDeliverable(index, 'title', e.target.value)}
                            placeholder="Deliverable Title (e.g. Architecture ADR, Slide Deck, Figma...)"
                          />
                        </div>

                        <div style={{ width: '175px' }}>
                          <select
                            className="form-select"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
                            value={deliv.type || 'link'}
                            onChange={(e) => handleUpdateDeliverable(index, 'type', e.target.value)}
                          >
                            {DELIVERABLE_CATEGORIES.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => handleRemoveDeliverable(index)}
                          style={{
                            padding: '0.35rem',
                            color: 'var(--color-rose, #f43f5e)',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remove this deliverable"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Bottom Row: URL Input, Notes / Subtitle, Preview Link */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '2 1 240px' }}>
                          <input
                            className="form-input font-mono"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
                            value={deliv.url || ''}
                            onChange={(e) => handleUpdateDeliverable(index, 'url', e.target.value)}
                            placeholder="https://company.sharepoint.com/... or https://github.com/..."
                          />
                        </div>

                        <div style={{ flex: '1 1 180px' }}>
                          <input
                            className="form-input"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', color: 'var(--text-secondary)' }}
                            value={deliv.notes || ''}
                            onChange={(e) => handleUpdateDeliverable(index, 'notes', e.target.value)}
                            placeholder="Subtitle / Notes (optional)"
                          />
                        </div>

                        {deliv.url && (
                          <a
                            href={deliv.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-ghost"
                            style={{
                              padding: '0.35rem 0.55rem',
                              fontSize: '0.74rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              color: 'var(--primary, #4f46e5)',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap'
                            }}
                            title="Test open link in new tab"
                          >
                            <ExternalLink size={12} /> Test
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          </div>

          {/* Footer Buttons */}
          <div
            className="modal-footer"
            style={{
              background: 'var(--bg-canvas, #f8fafc)',
              borderTop: '1px solid var(--border-light, #e2e8f0)',
              padding: '1rem 1.5rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              flexShrink: 0
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{
                padding: '0.5rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm, 8px)',
                background: '#ffffff',
                border: '1px solid var(--border-medium, #cbd5e1)',
                color: 'var(--text-primary, #0f172a)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm, 8px)',
                cursor: 'pointer'
              }}
            >
              <Save size={14} />
              <span>{isNew ? 'Save Research Note' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
