import React, { useState } from 'react';
import { 
  Stethoscope, QrCode, Smartphone, CheckCircle, AlertTriangle, 
  RefreshCw, Sparkles, UserCheck, ShieldCheck, FileText
} from 'lucide-react';

export default function DermaDeskSimulator() {
  const [stage, setStage] = useState(1);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState({
    primary: { name: 'Psoriasis (Plaque Type)', confidence: 92.4, icd: 'L40.0' },
    differentials: [
      { name: 'Eczema / Dermatitis', confidence: 21.6, icd: 'L30.0' },
      { name: 'Lichen Planus', confidence: 7.8, icd: 'L43.9' }
    ],
    rationale: 'Strong consensus based on extensor distribution, silvery scales, Auspitz sign, and family history.'
  });
  const [doctorVerification, setDoctorVerification] = useState('correct');
  const [signed, setSigned] = useState(false);

  // Form State matching the DEMO_WORKFLOW.md exact flow
  const [form, setForm] = useState({
    age: '30–40', sex: 'Male', skinType: 'Fitzpatrick III', ethnicity: 'Caucasian',
    lesionType: 'Plaque', texture: 'Scaly, Hyperkeratotic, Dry', color: 'Salmon, Red, White', 
    shape: 'Round, Oval', border: 'Well-defined, Raised', size: 'Medium', distribution: 'Extensor, Bilateral', 
    location: 'Elbow, Knee', count: 'Few (2–5)',
    dermatological: 'Scaling, Itching, Dryness', systemic: 'Joint pain',
    duration: 'Months', onset: 'Gradual', course: 'Recurrent', triggers: 'Stress, Cold, Friction',
    history: 'Family history', treatments: 'Topical steroid, Emollient', clinicalSigns: 'Auspitz sign, Koebner phenomenon', secondaryChanges: 'Scale',
    severity: 'Moderate', other: 'Erythematous plaques on extensor elbows.'
  });

  const handleRunAi = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAiResult({
        primary: { name: 'Psoriasis (Plaque Type)', confidence: 92.4, icd: 'L40.0' },
        differentials: [
          { name: 'Eczema / Dermatitis', confidence: 21.6, icd: 'L30.0' },
          { name: 'Lichen Planus', confidence: 7.8, icd: 'L43.9' }
        ],
        rationale: 'Strong consensus based on extensor distribution, silvery scales, Auspitz sign, and family history.'
      });
      setStage(7);
    }, 1200);
  };

  const InputField = ({ label, value }) => (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
        {label}
      </label>
      <input 
        type="text" value={value} readOnly
        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
      />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Simulation Stepper Header */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0.85rem 1.25rem', background: 'var(--bg-surface-elevated)', 
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--color-health-soft)', color: 'var(--color-health)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              DermaDesk Actual Clinical Flow
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              6-Section Intake &rarr; Mobile Image Sync &rarr; AI Interpretation &rarr; Doctor Verification
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { num: 1, label: 'Demographics' }, { num: 2, label: 'Appearance' }, { num: 3, label: 'Symptoms' },
            { num: 4, label: 'Timeline' }, { num: 5, label: 'Management' }, { num: 6, label: 'Images' }, { num: 7, label: 'Verification' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setStage(s.num)}
              style={{
                padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-xs)', fontSize: '0.7rem', fontWeight: 600,
                background: stage === s.num ? 'var(--color-health)' : 'var(--bg-subtle)',
                color: stage === s.num ? '#fff' : 'var(--text-muted)',
                border: '1px solid ' + (stage === s.num ? 'var(--color-health)' : 'var(--border-subtle)')
              }}
            >
              {s.num}. {s.label}
            </button>
          ))}
          <button onClick={() => { 
            setStage(1); 
            setSigned(false); 
            setPhotoUploaded(true); 
            setDoctorVerification('correct'); 
          }} style={{ padding: '0.25rem 0.5rem', color: 'var(--text-muted)' }} title="Reset Simulation">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Stage 1: Demographics */}
      {stage === 1 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Section 1: Patient Demographics
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputField label="What Is Your Age?" value={form.age} />
            <InputField label="What Is Your Sex?" value={form.sex} />
            <InputField label="Skin Type (Fitzpatrick)" value={form.skinType} />
            <InputField label="Ethnic Background" value={form.ethnicity} />
          </div>
          <button onClick={() => setStage(2)} className="btn-health" style={{ marginTop: '1rem', width: '100%' }}>Proceed to Section 2: Appearance &rarr;</button>
        </div>
      )}

      {/* Stage 2: Appearance */}
      {stage === 2 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Section 2: Lesion Appearance
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputField label="Primary Lesion Type" value={form.lesionType} />
            <InputField label="Surface Texture" value={form.texture} />
            <InputField label="Color(s)" value={form.color} />
            <InputField label="Shape" value={form.shape} />
            <InputField label="Borders" value={form.border} />
            <InputField label="Distribution" value={form.distribution} />
            <InputField label="Location" value={form.location} />
            <InputField label="Count" value={form.count} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setStage(1)} className="btn-secondary">&larr; Back</button>
            <button onClick={() => setStage(3)} className="btn-health" style={{ flex: 1 }}>Proceed to Section 3: Symptoms &rarr;</button>
          </div>
        </div>
      )}

      {/* Stage 3: Symptoms */}
      {stage === 3 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Section 3: Symptoms
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <InputField label="Dermatological Sensations" value={form.dermatological} />
            <InputField label="Itch Timing" value={form.itchTiming} />
            <InputField label="Whole-Body Symptoms" value={form.systemic} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setStage(2)} className="btn-secondary">&larr; Back</button>
            <button onClick={() => setStage(4)} className="btn-health" style={{ flex: 1 }}>Proceed to Section 4: Timeline &rarr;</button>
          </div>
        </div>
      )}

      {/* Stage 4: Timeline */}
      {stage === 4 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Section 4: Timeline & Triggers
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputField label="Duration" value={form.duration} />
            <InputField label="Onset" value={form.onset} />
            <InputField label="Course" value={form.course} />
            <InputField label="Triggers / Worsens By" value={form.triggers} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setStage(3)} className="btn-secondary">&larr; Back</button>
            <button onClick={() => setStage(5)} className="btn-health" style={{ flex: 1 }}>Proceed to Section 5: Management &rarr;</button>
          </div>
        </div>
      )}

      {/* Stage 5: Management */}
      {stage === 5 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Section 5: Previous Management & Signs
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputField label="Family/Medical History" value={form.history} />
            <InputField label="Treatments Tried" value={form.treatments} />
            <InputField label="Distinctive Clinical Signs" value={form.clinicalSigns} />
            <InputField label="Secondary Changes" value={form.secondaryChanges} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setStage(4)} className="btn-secondary">&larr; Back</button>
            <button onClick={() => setStage(6)} className="btn-health" style={{ flex: 1 }}>Proceed to Section 6: Images &rarr;</button>
          </div>
        </div>
      )}

      {/* Stage 6: Images */}
      {stage === 6 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Section 6: Impact, Notes & Images (Zero-Login QR Sync)
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div>
              <InputField label="Severity" value={form.severity} />
              <InputField label="Other Notes" value={form.other} />
            </div>

            {/* Mobile Camera Live Stream Simulator */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Smartphone size={16} color="var(--color-brand)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Mobile Scan Pair</span>
                <span className="badge badge-health" style={{ marginLeft: 'auto', fontSize: '0.6rem' }}>WebSocket Sync</span>
              </div>

              {!photoUploaded ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                  <QrCode size={64} color="#0369a1" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.7rem' }}>Awaiting mobile photo upload via QR...</div>
                  <button onClick={() => setPhotoUploaded(true)} className="btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.65rem' }}>Simulate Scan</button>
                </div>
              ) : (
                <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-xs)', background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>12MP</div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)' }}>demo_psoriasis.png</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--color-health)' }}>✓ Uploaded to Encounter</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <button onClick={() => setStage(5)} className="btn-secondary">&larr; Back</button>
            <button onClick={handleRunAi} disabled={analyzing || !photoUploaded} className="btn-health" style={{ flex: 1 }}>
              {analyzing ? (
                <><RefreshCw size={14} className="animate-spin" /><span>Running AI Pipeline...</span></>
              ) : (
                <><Sparkles size={14} /><span>Trigger AI Interpretation &rarr;</span></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Stage 7: AI & Verification */}
      {stage === 7 && aiResult && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <span className="badge badge-health">Multimodal AI Output</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                  #1 {aiResult.primary.name} ({aiResult.primary.confidence}%)
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ICD-10: {aiResult.primary.icd}</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Differential Considerations</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {aiResult.differentials.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name} ({d.icd})</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 90, height: 6, background: 'var(--border-medium)', borderRadius: 'var(--radius-full)' }}>
                        <div style={{ width: `${d.confidence}%`, height: '100%', background: 'var(--color-brand)' }}></div>
                      </div>
                      <span style={{ fontWeight: 600, width: 40, textAlign: 'right' }}>{d.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--color-health-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-health-border)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              <strong>Clinical Rationale:</strong> {aiResult.rationale}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <UserCheck size={18} color="var(--color-health)" />
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)' }}>
                  Doctor Feedback &amp; Finalization
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[{ id: 'correct', label: '✓ Confirm Diagnosis' }, { id: 'incorrect', label: '✕ Reject AI' }].map(b => (
                  <button
                    key={b.id} onClick={() => setDoctorVerification(b.id)}
                    style={{
                      flex: 1, padding: '0.45rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: 'var(--radius-xs)',
                      border: '1px solid ' + (doctorVerification === b.id ? 'var(--color-health)' : 'var(--border-medium)'),
                      background: doctorVerification === b.id ? 'var(--color-health)' : 'var(--bg-subtle)',
                      color: doctorVerification === b.id ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {!signed ? (
                <button onClick={handleSignEncounter} className="btn-health" style={{ width: '100%' }}>
                  <FileText size={14} /> Confirm &amp; Sign Visit Note
                </button>
              ) : (
                <div style={{ padding: '0.75rem', background: 'var(--color-brand-subtle)', color: 'var(--color-brand)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, justifyContent: 'center' }}>
                  <CheckCircle size={16} /> Clinical Encounter Signed Off &amp; Completed
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
