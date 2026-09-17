import React from 'react';
import { X, ExternalLink, KeyRound, MonitorPlay } from 'lucide-react';

import DermaDeskSimulator from '../simulators/DermaDeskSimulator';
import OPDSimulator from '../simulators/OPDSimulator';
import CCScannerSimulator from '../simulators/CCScannerSimulator';
import PQCSimulator from '../simulators/PQCSimulator';

const SIMULATORS = {
  dermadesk: DermaDeskSimulator,
  opd: OPDSimulator,
  cc_scanner: CCScannerSimulator,
  pqc_scanner: PQCSimulator
};

// Interactive sandbox launcher. The embedded simulator runs entirely in-browser
// (safe on client networks); the sandbox URL is the real deployment.
export default function CompleteFlowModal({ project, onClose }) {
  const { completeFlow } = project.demoFlow;
  const Simulator = SIMULATORS[project.id];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${project.name} complete flow demo`}>
      <div className="modal" style={{ maxWidth: 900 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="t-lg" style={{ fontWeight: 800 }}>Complete Flow Demo — {project.name}</h3>
            <p className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Walk the full product flow step by step
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a
              href={completeFlow.sandboxUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <ExternalLink size={14} /> Launch live sandbox
            </a>
            <span className="badge badge-neutral" style={{ alignSelf: 'center', gap: '0.45rem' }}>
              <KeyRound size={13} /> {completeFlow.credentialsHint}
            </span>
          </div>

          {Simulator ? (
            <section>
              <div className="t-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MonitorPlay size={14} /> Guided walkthrough — runs in your browser
              </div>
              <Simulator />
            </section>
          ) : (
            <p className="t-sm" style={{ color: 'var(--text-muted)' }}>
              No in-browser walkthrough for this project yet — use the live sandbox above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
