import React, { useState } from 'react';
import { X, CalendarCheck } from 'lucide-react';
import { submitInquiry } from '../../data/storageService';

const EMPTY = { name: '', email: '', company: '', message: '' };

export default function ContactDemoModal({ project, onClose, onSubmitted }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Enter a valid work email';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    submitInquiry({ projectId: project.id, projectName: project.name, ...form });
    onSubmitted(`Demo request sent — we'll reach out to ${form.email}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Schedule a demo of ${project.name}`}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="t-lg" style={{ fontWeight: 800 }}>Schedule a Demo</h3>
            <p className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {project.name} — request a live consultation with our product team
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="demo-name">Full name</label>
                <input id="demo-name" value={form.name} onChange={set('name')} placeholder="Jane Smith" />
                {errors.name && <span className="hint" style={{ color: 'var(--color-rose)' }}>{errors.name}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="demo-email">Work email</label>
                <input id="demo-email" type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" />
                {errors.email && <span className="hint" style={{ color: 'var(--color-rose)' }}>{errors.email}</span>}
              </div>
              <div className="form-field span-2">
                <label htmlFor="demo-company">Company</label>
                <input id="demo-company" value={form.company} onChange={set('company')} placeholder="Acme Corp" />
              </div>
              <div className="form-field span-2">
                <label htmlFor="demo-message">What would you like to see?</label>
                <textarea id="demo-message" value={form.message} onChange={set('message')}
                  placeholder="Tell us about your use case…" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary"><CalendarCheck size={14} /> Request Demo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
