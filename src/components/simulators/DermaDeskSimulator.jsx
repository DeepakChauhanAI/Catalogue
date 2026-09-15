import React, { useState } from 'react';
import { 
  Stethoscope, QrCode, Smartphone, CheckCircle, AlertTriangle, 
  RefreshCw, Sparkles, UserCheck, ShieldCheck, ChevronRight, FileText
} from 'lucide-react';

export default function DermaDeskSimulator() {
  const [stage, setStage] = useState(1);
  const [patientName, setPatientName] = useState('Sarah Jenkins');
  const [skinType, setSkinType] = useState('Type III (Medium / Olive)');
  const [morphology, setMorphology] = useState('Erythematous Plaque');
  const [distribution, setDistribution] = useState('Extensor (Elbows, Knees, Lumbar)');
  const [auspitz, setAuspitz] = useState(true);
  const [koebner, setKoebner] = useState(true);
  const [pruritus, setPruritus] = useState('Moderate');
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [doctorVerification, setDoctorVerification] = useState('correct');
  const [confidenceSlider, setConfidenceSlider] = useState(96);
  const [signed, setSigned] = useState(false);

  const handleRunAi = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAiResult({
        primary: { name: 'Psoriasis Vulgaris', confidence: 92.4, icd: 'L40.0', type: 'Plaque Psoriasis' },
        differentials: [
          { name: 'Nummular Eczema', confidence: 21.6, icd: 'L30.0' },
          { name: 'Lichen Planus', confidence: 7.8, icd: 'L43.9' },
          { name: 'Pityriasis Rosea', confidence: 3.2, icd: 'L42' }
        ],
        rationale: 'Strong correlation between Extensor Plaque distribution, Auspitz sign (+), and micro-scaling detected in 12MP macro capture.'
      });
      setStage(4);
    }, 1200);
  };

  const handleSignEncounter = () => {
    setSigned(true);
  };

  const resetSimulation = () => {
    setStage(1);
    setAiResult(null);
    setSigned(false);
    setDoctorVerification('correct');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Simulation Stepper Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0.85rem 1.25rem', 
        background: 'var(--bg-surface-elevated)', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ 
            width: 34, 
            height: 34, 
            borderRadius: 'var(--radius-sm)', 
            background: 'var(--color-health-soft)', 
            color: 'var(--color-health)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Stethoscope size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              DermaDesk Multimodal Clinical Flow
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Role-Separated: Frontdesk Intake &rarr; QR Camera &rarr; 51-Class AI &rarr; Doctor Verification
            </div>
          </div>
        </div>

        {/* Step indicator badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {[
            { num: 1, label: 'Intake' },
            { num: 2, label: 'Signs' },
            { num: 3, label: 'QR Scan' },
            { num: 4, label: 'AI Diff' },
            { num: 5, label: 'Sign-Off' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setStage(s.num)}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: stage === s.num ? 'var(--color-health)' : 'var(--bg-subtle)',
                color: stage === s.num ? '#fff' : 'var(--text-muted)',
                border: '1px solid ' + (stage === s.num ? 'var(--color-health)' : 'var(--border-subtle)')
              }}
            >
              {s.num}. {s.label}
            </button>
          ))}
          <button onClick={resetSimulation} style={{ padding: '0.25rem 0.5rem', color: 'var(--text-muted)' }} title="Reset Simulation">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Stage 1: Frontdesk Intake */}
      {stage === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              Phase 1: Patient Demographics & Morphology
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Patient Full Name
                </label>
                <input 
                  type="text" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Fitzpatrick Skin Phototype
                </label>
                <select 
                  value={skinType} 
                  onChange={(e) => setSkinType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                >
                  <option>Type I (Pale White / Always burns)</option>
                  <option>Type II (Fair / Usually burns)</option>
                  <option>Type III (Medium / Olive)</option>
                  <option>Type IV (Olive / Moderate brown)</option>
                  <option>Type V (Brown / Dark brown)</option>
                  <option>Type VI (Deeply pigmented / Black)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Primary Lesion Morphology (Q4)
                </label>
                <select 
                  value={morphology} 
                  onChange={(e) => setMorphology(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                >
                  <option>Erythematous Plaque</option>
                  <option>Maculopapular Rash</option>
                  <option>Vesiculobullous Eruption</option>
                  <option>Excoriated Lichenified Patch</option>
                  <option>Targetoid Annular Lesion</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                Distribution & Anatomical Sites (Q9)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Extensor (Elbows, Knees, Lumbar)',
                  'Flexural / Intertriginous (Groin, Axillae)',
                  'Acral (Palms, Soles, Periungual)',
                  'Dermatomal (Unilateral strip)',
                  'Generalized / Symmetrical Trunk'
                ].map(d => (
                  <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-xs)', background: distribution === d ? 'var(--color-health-soft)' : 'transparent' }}>
                    <input 
                      type="radio" 
                      name="dist" 
                      checked={distribution === d} 
                      onChange={() => setDistribution(d)} 
                    />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setStage(2)} 
              className="btn-health" 
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Continue to Stage 2: Clinical Signs &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: Clinical Signs */}
      {stage === 2 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Phase 2: Pathognomonic Signs & Triggers (21+ Engine)
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            These objective signs allow our 51-disease multimodal AI to resolve confusing visually overlapping mimics like Psoriasis vs Nummular Eczema.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Auspitz Sign (Q14)</span>
                <input 
                  type="checkbox" 
                  checked={auspitz} 
                  onChange={(e) => setAuspitz(e.target.checked)} 
                  style={{ width: 16, height: 16 }}
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Pinpoint punctate bleeding upon peeling superficial scale. Highly specific for Psoriasis.
              </p>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Koebner Phenomenon (Q15)</span>
                <input 
                  type="checkbox" 
                  checked={koebner} 
                  onChange={(e) => setKoebner(e.target.checked)} 
                  style={{ width: 16, height: 16 }}
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                New isomorphic lesions appearing along linear scratch or surgical trauma lines.
              </p>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Pruritus Intensity (Q18)</span>
              <select 
                value={pruritus} 
                onChange={(e) => setPruritus(e.target.value)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.75rem' }}
              >
                <option>None / Mild</option>
                <option>Moderate (Tolerable)</option>
                <option>Severe (Sleep-disrupting)</option>
                <option>Intolerable burning pain</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setStage(1)} className="btn-secondary">
              &larr; Back
            </button>
            <button onClick={() => setStage(3)} className="btn-health">
              Proceed to Stage 3: Zero-Login QR Upload &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Stage 3: Zero-Login QR Mobile Upload */}
      {stage === 3 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Phase 3: Zero-Login Mobile Camera QR Bridge (Patented Workflow)
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Clinicians don't log in on their mobile phone. They scan this ephemeral QR code with the iOS/Android native camera. The photo auto-streams directly into Question 27 on this workstation via WebSockets!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            {/* Simulated QR Code on Desktop */}
            <div style={{ background: '#ffffff', color: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'inline-block', padding: '0.75rem', background: '#f8fafc', border: '2px dashed #0284c7', borderRadius: 'var(--radius-sm)' }}>
                <QrCode size={130} color="#0369a1" />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.6rem' }}>
                TOKEN: <code>DDSK-9842-EPHEMERAL</code>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Single-Use &bull; Expires in 4:48 min
              </div>
            </div>

            {/* Mobile Camera Live Stream Simulator */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Smartphone size={18} color="var(--color-brand)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Paired Clinician iPhone 15 Pro</span>
                <span className="badge badge-health" style={{ marginLeft: 'auto' }}>WebSocket Sync</span>
              </div>

              {photoUploaded ? (
                <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xs)', background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
                    12MP
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      macro_lesion_extensor_elbow.raw
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-health)', fontWeight: 600 }}>
                      ✓ Received &amp; Injected to Encounter (12.4 MB)
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Awaiting photo snap from paired mobile camera...
                </div>
              )}

              <button
                onClick={handleRunAi}
                disabled={analyzing}
                className="btn-health"
                style={{ marginTop: '1rem', width: '100%' }}
              >
                {analyzing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Running 51-Class Multimodal AI Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Lock Intake &amp; Run Multimodal AI Differential</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: AI Differential Result */}
      {stage === 4 && aiResult && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <span className="badge badge-health">Multimodal AI Output</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                  #1 {aiResult.primary.name} ({aiResult.primary.confidence}%)
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ICD-10: {aiResult.primary.icd} &bull; Classification: {aiResult.primary.type}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-health)' }}>
                  {aiResult.primary.confidence}%
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Confidence Score</div>
              </div>
            </div>

            {/* Differential diagnoses table */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Secondary Differential Considerations (51-Disease Pool)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {aiResult.differentials.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name} <span style={{ color: 'var(--text-faint)', fontSize: '0.68rem' }}>({d.icd})</span></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 90, height: 6, background: 'var(--border-medium)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ width: `${d.confidence}%`, height: '100%', background: 'var(--color-brand)' }}></div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, width: 40, textAlign: 'right' }}>{d.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--color-health-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-health-border)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              <strong>Clinical Rationale:</strong> {aiResult.rationale}
            </div>

            <button onClick={() => setStage(5)} className="btn-health" style={{ width: '100%' }}>
              Proceed to Stage 5: Doctor Validation &amp; Sign-Off &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Stage 5: Doctor Verification & Active Learning */}
      {stage === 5 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <UserCheck size={18} color="var(--color-health)" />
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', letterSpacing: '0.05em' }}>
              Phase 5: Attending Dermatologist Verification &amp; Active Learning Loop
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Under regulatory guidelines, AI is assistive. The attending specialist certifies the diagnosis, adjusts confidence, and signs the clinical encounter note.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Doctor Assessment of AI Prediction
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { id: 'correct', label: '✓ Correct (Psoriasis)' },
                    { id: 'partial', label: '~ Partial' },
                    { id: 'incorrect', label: '✕ Incorrect' }
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setDoctorVerification(b.id)}
                      style={{
                        flex: 1,
                        padding: '0.45rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid ' + (doctorVerification === b.id ? 'var(--color-health)' : 'var(--border-medium)'),
                        background: doctorVerification === b.id ? 'var(--color-health)' : 'var(--bg-subtle)',
                        color: doctorVerification === b.id ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Doctor Verified Confidence
                  </label>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-health)' }}>
                    {confidenceSlider}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={confidenceSlider} 
                  onChange={(e) => setConfidenceSlider(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--color-health)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Treatment Plan / Rx
                </label>
                <input 
                  type="text" 
                  defaultValue="Clobetasol propionate 0.05% topical ointment BID x 14 days"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.75rem' }}
                />
              </div>
            </div>

            {/* Signed status certificate */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {signed ? (
                <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <ShieldCheck size={44} color="var(--color-health)" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Encounter Signed &amp; Vaulted
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                    SHA-256: 7f8a92b...e41c | HL7 FHIR Synced
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-health)', fontWeight: 600, marginTop: '0.5rem' }}>
                    ✓ Model feedback saved to active learning dataset
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Ready for Clinical Sign-off
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Clicking "Sign &amp; Close Encounter" marks visit status from <code>review_pending</code> to <code>closed</code>, creates an immutable audit record, and updates the local LAN workstation.
                  </p>
                </div>
              )}

              <button
                onClick={handleSignEncounter}
                disabled={signed}
                className="btn-health"
                style={{ width: '100%', opacity: signed ? 0.7 : 1 }}
              >
                {signed ? 'Encounter Completed' : 'Sign & Close Clinical Encounter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
