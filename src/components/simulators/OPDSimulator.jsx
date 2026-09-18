import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, Zap, ArrowRight, ArrowLeft, CheckCircle, CheckCircle2, 
  RefreshCw, AlertCircle, AlertTriangle, Volume2, Mic, Printer, QrCode, 
  Building2, Stethoscope, Activity, FileText, Sparkles, UserCheck, 
  Calendar, Pill, FlaskConical, Check, Search, Phone, ShieldCheck, Play, Radio
} from 'lucide-react';

export default function OPDSimulator() {
  const [stage, setStage] = useState(1);
  
  // Intake Channel: 'kiosk' | 'dhara'
  const [intakeMode, setIntakeMode] = useState('kiosk');
  
  // Patient & Demographics
  const [patientPhone, setPatientPhone] = useState('9876543210');
  const [patientName, setPatientName] = useState('Priya Sharma');
  const [patientAge, setPatientAge] = useState(38);
  const [patientGender, setPatientGender] = useState('Female');
  const [visitType, setVisitType] = useState('new'); // 'new' | 'revisit_same' | 'revisit_new_issue'
  
  // Kiosk / Dhara Clinical Checklist Triage
  const [chiefComplaint, setChiefComplaint] = useState('High-grade fever with chills & severe body aches');
  const [duration, setDuration] = useState('3 days');
  const [severity, setSeverity] = useState(8);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Chills & Rigors', 'Headache', 'Nausea & Vomiting', 'Joint & Muscle Pain']);
  const [medicalHistory, setMedicalHistory] = useState(['Essential Hypertension (Amlodipine 5mg)', 'Penicillin Allergy']);
  
  // Dhara Voice Simulation State
  const [isDharaListening, setIsDharaListening] = useState(false);
  
  // Waiting Room TV & Announcements
  const [isSpeakingChime, setIsSpeakingChime] = useState(false);
  const [spokenAnnouncementText, setSpokenAnnouncementText] = useState('');
  
  // Doctor Queue State
  const [doctorStatus, setDoctorStatus] = useState('waiting'); // 'waiting' | 'called' | 'in_room' | 'completed'
  const [consultationTimer, setConsultationTimer] = useState(0);
  
  // Doctor AI Dictation & SOAP Note
  const [isDictating, setIsDictating] = useState(false);
  const [dictationDone, setDictationDone] = useState(true);
  const [isStructuringSoap, setIsStructuringSoap] = useState(false);
  const [soapExtracted, setSoapExtracted] = useState(true);
  
  // Prescription & Sign-off State
  const [prescriptionSigned, setPrescriptionSigned] = useState(false);
  const [isPrintingTicket, setIsPrintingTicket] = useState(false);
  const [ticketPrintedNotice, setTicketPrintedNotice] = useState(false);

  // Symptoms list for interactive toggle
  const availableSymptoms = [
    'Chills & Rigors',
    'Headache',
    'Nausea & Vomiting',
    'Joint & Muscle Pain',
    'Cough & Cold',
    'Sore Throat',
    'Abdominal Cramps',
    'Loss of Appetite'
  ];

  // Toggle symptom chip
  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  // Play spoken bilingual chime announcement (Web Speech API with graceful fallback)
  const handlePlayChime = () => {
    setIsSpeakingChime(true);
    const announcementEn = "Token Number GEN-104, Priya Sharma. Please proceed to Consultation Room 4 for Doctor Rao.";
    const announcementHi = "टोकन नंबर GEN-104, प्रिया शर्मा, कृपया कमरा नंबर 4 में डॉक्टर राव से मिलें।";
    setSpokenAnnouncementText(`${announcementEn} / ${announcementHi}`);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(announcementEn);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          setTimeout(() => {
            setIsSpeakingChime(false);
          }, 1000);
        };
        utterance.onerror = () => setIsSpeakingChime(false);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setTimeout(() => setIsSpeakingChime(false), 3000);
      }
    } else {
      setTimeout(() => setIsSpeakingChime(false), 3000);
    }
  };

  // Simulate Dictation
  const handleTriggerDictation = () => {
    setIsDictating(true);
    setTimeout(() => {
      setIsDictating(false);
      setDictationDone(true);
    }, 1500);
  };

  // Simulate SOAP Structuring
  const handleExtractSoap = () => {
    setIsStructuringSoap(true);
    setTimeout(() => {
      setIsStructuringSoap(false);
      setSoapExtracted(true);
    }, 1000);
  };

  // Simulate Ticket Print
  const handlePrintTicket = () => {
    setIsPrintingTicket(true);
    setTimeout(() => {
      setIsPrintingTicket(false);
      setTicketPrintedNotice(true);
      setTimeout(() => setTicketPrintedNotice(false), 4000);
    }, 800);
  };

  // Reset simulation
  const handleReset = () => {
    setStage(1);
    setIntakeMode('kiosk');
    setDoctorStatus('waiting');
    setConsultationTimer(0);
    setIsSpeakingChime(false);
    setSpokenAnnouncementText('');
    setPrescriptionSigned(false);
    setDictationDone(true);
    setSoapExtracted(true);
  };

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
            <Activity size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              OPD Intelligence 2.0 — Live Clinical Journey
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Kiosk / Voice &rarr; SQLite WAL Token &rarr; TV Display &rarr; Doctor Rail &rarr; AI SOAP &rarr; EMR Rx
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { num: 1, label: 'Intake' },
            { num: 2, label: 'Token Receipt' },
            { num: 3, label: 'Waiting Room TV' },
            { num: 4, label: 'Doctor Console' },
            { num: 5, label: 'AI Dictation' },
            { num: 6, label: 'EMR Prescription' }
          ].map(s => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStage(s.num)}
              style={{
                padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-xs)', fontSize: '0.7rem', fontWeight: 600,
                background: stage === s.num ? 'var(--color-health)' : 'var(--bg-subtle)',
                color: stage === s.num ? '#fff' : 'var(--text-muted)',
                border: '1px solid ' + (stage === s.num ? 'var(--color-health)' : 'var(--border-subtle)')
              }}
            >
              {s.num}. {s.label}
            </button>
          ))}
          <button 
            type="button" 
            onClick={handleReset} 
            style={{ padding: '0.25rem 0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }} 
            title="Reset Simulation"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* STAGE 1: PATIENT SELF-SERVICE INTAKE */}
      {stage === 1 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Header & Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', letterSpacing: '0.05em' }}>
                Stage 1: Patient Self-Service Clinical Intake
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Numpad Phone Search &bull; Family Disambiguation &bull; Symptom Triage Tree
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'inline-flex', background: 'var(--bg-subtle)', padding: '0.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setIntakeMode('kiosk')}
                style={{
                  padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: 'var(--radius-xs)',
                  background: intakeMode === 'kiosk' ? 'var(--bg-surface)' : 'transparent',
                  color: intakeMode === 'kiosk' ? 'var(--color-health)' : 'var(--text-muted)',
                  boxShadow: intakeMode === 'kiosk' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Touch Kiosk Mode
              </button>
              <button
                type="button"
                onClick={() => setIntakeMode('dhara')}
                style={{
                  padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: 'var(--radius-xs)',
                  background: intakeMode === 'dhara' ? 'var(--bg-surface)' : 'transparent',
                  color: intakeMode === 'dhara' ? 'var(--color-health)' : 'var(--text-muted)',
                  boxShadow: intakeMode === 'dhara' ? 'var(--shadow-sm)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '0.3rem'
                }}
              >
                <Sparkles size={12} />
                Dhara AI Voice (Gemini Live)
              </button>
            </div>
          </div>

          {/* Identity & Lookup Box */}
          <div style={{ background: 'var(--bg-subtle)', padding: '0.9rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Patient Phone Lookup (Touch Numpad)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="var(--color-health)" />
                <input 
                  type="text" 
                  value={patientPhone} 
                  readOnly 
                  style={{ fontWeight: 700, fontSize: '0.85rem', padding: '0.35rem 0.6rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface)', width: '130px' }} 
                />
                <span className="badge badge-health" style={{ fontSize: '0.65rem' }}>Verified Patient Found</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Family Members Under Phone
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => { setPatientName('Priya Sharma'); setPatientAge(38); setPatientGender('Female'); }}
                  style={{
                    padding: '0.25rem 0.6rem', fontSize: '0.7rem', borderRadius: 'var(--radius-xs)',
                    background: patientName === 'Priya Sharma' ? 'var(--color-health-soft)' : 'var(--bg-surface)',
                    border: '1px solid ' + (patientName === 'Priya Sharma' ? 'var(--color-health)' : 'var(--border-subtle)'),
                    color: patientName === 'Priya Sharma' ? 'var(--color-health)' : 'var(--text-secondary)',
                    fontWeight: 700
                  }}
                >
                  ✓ Priya Sharma (38/F)
                </button>
                <button 
                  type="button" 
                  onClick={() => { setPatientName('Ramesh Sharma'); setPatientAge(42); setPatientGender('Male'); }}
                  style={{
                    padding: '0.25rem 0.6rem', fontSize: '0.7rem', borderRadius: 'var(--radius-xs)',
                    background: patientName === 'Ramesh Sharma' ? 'var(--color-health-soft)' : 'var(--bg-surface)',
                    border: '1px solid ' + (patientName === 'Ramesh Sharma' ? 'var(--color-health)' : 'var(--border-subtle)'),
                    color: patientName === 'Ramesh Sharma' ? 'var(--color-health)' : 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  Ramesh Sharma (42/M)
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Visit Classification
              </label>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => setVisitType('new')}
                  style={{
                    padding: '0.25rem 0.55rem', fontSize: '0.68rem', fontWeight: 700, borderRadius: 'var(--radius-xs)',
                    background: visitType === 'new' ? 'var(--color-health)' : 'var(--bg-surface)',
                    color: visitType === 'new' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid ' + (visitType === 'new' ? 'var(--color-health)' : 'var(--border-subtle)')
                  }}
                >
                  New Acute Concern
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('revisit_same')}
                  style={{
                    padding: '0.25rem 0.55rem', fontSize: '0.68rem', fontWeight: 600, borderRadius: 'var(--radius-xs)',
                    background: visitType === 'revisit_same' ? 'var(--color-health)' : 'var(--bg-surface)',
                    color: visitType === 'revisit_same' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid ' + (visitType === 'revisit_same' ? 'var(--color-health)' : 'var(--border-subtle)')
                  }}
                >
                  Follow-up Revisit
                </button>
              </div>
            </div>
          </div>

          {/* MODE A: TOUCH KIOSK QUESTION TREE */}
          {intakeMode === 'kiosk' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                    1. Primary Symptom / Chief Complaint
                  </label>
                  <input 
                    type="text" 
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', fontSize: '0.8rem', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                    2. Duration of Symptoms
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {['1 day', '3 days', '1 week', '>2 weeks'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        style={{
                          flex: 1, padding: '0.45rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: 'var(--radius-xs)',
                          background: duration === d ? 'var(--color-health)' : 'var(--bg-subtle)',
                          color: duration === d ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid ' + (duration === d ? 'var(--color-health)' : 'var(--border-subtle)')
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Severity Scale 1-10 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    3. Severity Scale (1 - 10)
                  </label>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: severity >= 7 ? 'var(--color-rose)' : 'var(--color-health)' }}>
                    {severity} / 10 &bull; {severity >= 7 ? 'High / Acute' : 'Moderate'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSeverity(n)}
                      style={{
                        flex: 1, padding: '0.4rem 0', fontSize: '0.75rem', fontWeight: 700, borderRadius: 'var(--radius-xs)',
                        background: severity === n ? (n >= 7 ? '#ef4444' : 'var(--color-health)') : 'var(--bg-subtle)',
                        color: severity === n ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid ' + (severity === n ? 'transparent' : 'var(--border-subtle)')
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Associated Symptoms Multi-select */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  4. Associated Symptoms (Touch to toggle)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {availableSymptoms.map(sym => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleSymptom(sym)}
                        style={{
                          padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600,
                          background: isSelected ? 'var(--color-health-soft)' : 'var(--bg-subtle)',
                          color: isSelected ? 'var(--color-health)' : 'var(--text-secondary)',
                          border: '1px solid ' + (isSelected ? 'var(--color-health)' : 'var(--border-subtle)'),
                          display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* MODE B: DHARA GEMINI LIVE VOICE ASSISTANT */
            <div style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.04) 0%, rgba(99, 102, 241, 0.04) 100%)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: 44, height: 44, borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #059669, #4f46e5)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    boxShadow: '0 0 16px rgba(5, 150, 105, 0.35)'
                  }}>
                    <Mic size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Dhara — Conversational AI Voice Intake
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Gemini Live Full-Duplex PCM Audio &bull; Hindi &amp; English Bilingual
                    </div>
                  </div>
                </div>

                <span className="badge badge-health" style={{ fontSize: '0.7rem' }}>
                  <Radio size={12} className="animate-pulse" /> 16kHz PCM Stream Active
                </span>
              </div>

              {/* Streaming Transcript Display */}
              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                <div style={{ color: 'var(--color-health)', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Dhara (AI Voice Assistant):
                </div>
                <div style={{ color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '0.4rem' }}>
                  "नमस्ते प्रिया जी, आपको यह बुखार कितने दिनों से है और क्या साथ में ठंड या उल्टी की शिकायत भी है?"
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <strong>Priya Sharma:</strong> "I've had 102°F fever since 3 days with severe chills, shivering and headache."
                </div>
              </div>

              {/* 7-Point Clinical Checklist (Gemini Live Extraction) */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Live 7-Point Clinical Checklist Extraction (Zero Data Loss)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  {[
                    { label: 'Chief Complaint', val: 'High Fever & Chills', done: true },
                    { label: 'Onset / Duration', val: '3 Days Acute', done: true },
                    { label: 'Severity (1-10)', val: '8 / 10 Severe', done: true },
                    { label: 'Aggravating Factors', val: 'Worsens at night / chills', done: true },
                    { label: 'Associated Signs', val: 'Headache, Nausea, Myalgia', done: true },
                    { label: 'Medical History', val: 'Hypertension (Amlodipine)', done: true },
                    { label: 'Medications / Allergies', val: 'Penicillin Allergy', done: true },
                  ].map((f, i) => (
                    <div key={i} style={{ padding: '0.4rem 0.6rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{f.label}</span>
                      <span style={{ color: 'var(--color-health)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <CheckCircle2 size={12} /> {f.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '0.6rem 0.75rem', background: 'var(--color-health-soft)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-health-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--color-health)', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>Emergency Red-Flag Scan: Negative for acute stroke / chest pain / altered mental status. Safe for general OPD.</span>
              </div>
            </div>
          )}

          {/* Department Recommendation & Proceed Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={16} color="var(--color-health)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Routed Department: <strong style={{ color: 'var(--text-primary)' }}>General Medicine (Room 4 &bull; Dr. Rao)</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setDoctorStatus('waiting');
                setStage(2);
              }}
              className="btn-health"
            >
              <span>Generate Ticket &amp; Route to Queue &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: THERMAL TOKEN ISSUANCE (SQLite WAL Engine) */}
      {stage === 2 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', letterSpacing: '0.05em' }}>
                  Stage 2: Sequential Queue Allocation (Anti-Deadlock Engine)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Atomic SQLite WAL Transaction &bull; Sequential Collison-Proof Ticket
                </div>
              </div>
              <span className="badge badge-health" style={{ fontSize: '0.68rem' }}>PRAGMA journal_mode=WAL</span>
            </div>

            {/* Simulated Thermal Ticket Slip */}
            <div style={{ 
              maxWidth: 380, margin: '0 auto 1.25rem', padding: '1.25rem', 
              background: '#fff', color: '#0f172a', borderRadius: 'var(--radius-sm)', 
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)', border: '1px dashed #94a3b8',
              textAlign: 'center', fontFamily: 'monospace'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                City Care Multispecialty Hospital
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.75rem' }}>
                Outpatient Department &bull; Queue Kiosk Receipt
              </div>

              <div style={{ borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '0.75rem 0', margin: '0.5rem 0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Your Token Number</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#059669', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
                  GEN-104
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                  Estimated Wait: ~18 Mins (3 ahead)
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.75rem', color: '#334155' }}>
                <div><strong>Patient:</strong> Priya Sharma (38 / Female)</div>
                <div><strong>Doctor:</strong> Dr. A. K. Rao (MD, Medicine)</div>
                <div><strong>Room:</strong> Consultation Room 4 (1st Floor)</div>
                <div><strong>Department:</strong> General Medicine</div>
                <div><strong>Time Issued:</strong> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              {/* Barcode representation */}
              <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ letterSpacing: '0.3em', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
                  ||||| | |||| ||| || ||||
                </div>
                <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '0.2rem' }}>
                  TXN: SQLITE_WAL_#4892 &bull; Please wait in Hall B
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={() => setStage(1)} 
                className="btn-secondary"
              >
                &larr; Back to Intake
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handlePrintTicket}
                  disabled={isPrintingTicket}
                  className="btn-secondary"
                >
                  <Printer size={14} />
                  <span>{isPrintingTicket ? 'Dispensing Slip...' : 'Simulate Physical Ticket Print'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStage(3)}
                  className="btn-health"
                >
                  <span>Proceed to Waiting Room TV Display &rarr;</span>
                </button>
              </div>
            </div>

            {ticketPrintedNotice && (
              <div className="animate-fade-in" style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: 'var(--color-health-soft)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-health-border)', fontSize: '0.72rem', color: 'var(--color-health)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <CheckCircle size={14} />
                <span>Thermal paper slip dispensed successfully from Kiosk thermal printer tray.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: PUBLIC WAITING ROOM TV DISPLAY */}
      {stage === 3 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            
            {/* TV Screen Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building2 size={20} color="var(--color-health)" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
                    CITY CARE MULTISPECIALTY HOSPITAL
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    LOBBY WAITING DISPLAY &bull; LIVE PATIENT CALLOUT SYSTEM
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-health)', fontWeight: 700 }}>
                  <span className="status-dot online" /> LIVE SYNC
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                  10:42 AM
                </div>
              </div>
            </div>

            {/* Currently Serving Hero Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              
              <div style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(16, 185, 129, 0.02))', border: '2px solid var(--color-health)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-health)', letterSpacing: '0.08em' }}>
                      Currently Serving
                    </span>
                    <span style={{ padding: '0.2rem 0.5rem', background: 'var(--color-health)', color: '#fff', borderRadius: 'var(--radius-xs)', fontSize: '0.65rem', fontWeight: 800 }}>
                      IN ROOM
                    </span>
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-health)', margin: '0.3rem 0', letterSpacing: '-0.02em' }}>
                    GEN-103
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Vijay Anand (48 / M)
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Dr. A. K. Rao (MD)</span>
                  <strong style={{ color: 'var(--color-health)' }}>Room 4</strong>
                </div>
              </div>

              {/* Next in Line Queue Rail */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Upcoming Patients in Line
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { token: 'GEN-104', name: 'Priya Sharma', wait: '~2 mins', status: doctorStatus === 'called' ? 'CALLING NOW' : 'NEXT', highlight: true },
                    { token: 'GEN-105', name: 'Rajesh Gupta', wait: '~16 mins', status: 'Waiting', highlight: false },
                    { token: 'GEN-106', name: 'Sunita Devi', wait: '~28 mins', status: 'Waiting', highlight: false }
                  ].map(p => (
                    <div 
                      key={p.token} 
                      style={{ 
                        padding: '0.6rem 0.75rem', 
                        borderRadius: 'var(--radius-xs)', 
                        background: p.highlight ? 'var(--color-health-soft)' : 'var(--bg-surface)',
                        border: '1px solid ' + (p.highlight ? 'var(--color-health)' : 'var(--border-subtle)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: p.highlight ? 'var(--color-health)' : 'var(--text-primary)' }}>
                          {p.token}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {p.name}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: p.highlight ? 'var(--color-health)' : 'var(--text-muted)' }}>
                          {p.status}
                        </span>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{p.wait}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio Chime & Spoken Callout Trigger */}
            <div style={{ background: 'var(--bg-subtle)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Volume2 size={20} color="var(--color-health)" />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Spoken Web Speech Chime Announcement
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Plays clear audio chime + synthesized voice in English &amp; Hindi
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlayChime}
                disabled={isSpeakingChime}
                style={{
                  padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-xs)', fontSize: '0.75rem', fontWeight: 700,
                  background: isSpeakingChime ? '#047857' : 'var(--color-health)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                <Play size={12} />
                <span>{isSpeakingChime ? 'Speaking Callout...' : 'Play Bilingual TV Callout Audio'}</span>
              </button>
            </div>

            {spokenAnnouncementText && (
              <div className="animate-fade-in" style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: 'var(--color-health-soft)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-health-border)', fontSize: '0.72rem', color: 'var(--color-health)' }}>
                <strong>Broadcast Announcement:</strong> "{spokenAnnouncementText}"
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" onClick={() => setStage(2)} className="btn-secondary">&larr; Back to Ticket</button>
            <button type="button" onClick={() => setStage(4)} className="btn-health">Proceed to Doctor Console (Dr. Rao) &rarr;</button>
          </div>
        </div>
      )}

      {/* STAGE 4: DOCTOR QUEUE DASHBOARD & CLINICAL INTAKE REVIEW */}
      {stage === 4 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            
            {/* Doctor Console Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Stethoscope size={20} color="var(--color-health)" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Doctor Consultation Station &bull; Dr. A. K. Rao (MD, Medicine)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Room 4 &bull; Active Queue Management &amp; Structured Triage Review
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span className="badge badge-health">Waiting: 3</span>
                <span className="badge badge-brand">Serving: 1</span>
                <span className="badge badge-neutral">Completed: 6</span>
              </div>
            </div>

            {/* Patient Header & Lifecycle Call Controls */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-health)' }}>GEN-104</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Priya Sharma</span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>38 Y / Female</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Intake Channel: {intakeMode === 'kiosk' ? 'Self-Service Touch Kiosk' : 'Dhara Voice AI Assistant'} &bull; Phone: 98765-43210
                  </div>
                </div>

                {/* Calling Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorStatus('called');
                      handlePlayChime();
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    <Volume2 size={13} />
                    <span>Call Patient (Broadcast to TV)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDoctorStatus('in_room')}
                    style={{
                      fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', fontWeight: 700,
                      background: doctorStatus === 'in_room' ? 'var(--color-health)' : 'var(--bg-surface)',
                      color: doctorStatus === 'in_room' ? '#fff' : 'var(--color-health)',
                      border: '1px solid var(--color-health)'
                    }}
                  >
                    <CheckCircle size={13} />
                    <span>{doctorStatus === 'in_room' ? '✓ Patient In-Chair' : 'Mark Patient Arrived'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Red Flag Alert Banner */}
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.25)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
                <strong>Clinical Triage Alert:</strong> Acute high-grade fever (severity 8/10) with rigors &amp; persistent nausea for 3 days. Patient reports Penicillin hypersensitivity.
              </div>
            </div>

            {/* Structured 7-Point Intake Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.9rem', marginBottom: '1rem' }}>
              
              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Chief Complaint &amp; Timeline
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {chiefComplaint}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Duration: <strong>{duration}</strong> &bull; Onset: <strong>Sudden spike with chills</strong>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Associated Symptoms
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {selectedSymptoms.map(s => (
                    <span key={s} style={{ padding: '0.15rem 0.45rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', fontSize: '0.68rem', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                      &bull; {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Medical History &amp; Allergies
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div>&bull; <strong>Medical:</strong> Essential Hypertension (Amlodipine 5mg OD)</div>
                  <div>&bull; <strong style={{ color: 'var(--color-rose)' }}>Allergies:</strong> Penicillin (Severe urticaria)</div>
                  <div>&bull; <strong>Last Visit:</strong> 28 days ago (Hypertension follow-up, BP 142/90)</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={() => setStage(3)} className="btn-secondary">&larr; Back to Waiting Room TV</button>
              <button type="button" onClick={() => setStage(5)} className="btn-health">Proceed to Doctor Dictation &amp; SOAP &rarr;</button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: AI VOICE DICTATION & STRUCTURED SOAP NOTE */}
      {stage === 5 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', letterSpacing: '0.05em' }}>
                  Stage 5: Hands-Free Voice Dictation &amp; Gemini SOAP Engine
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Microphone Dictation &bull; Realtime Transcription &bull; Automatic SOAP Structuring
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleTriggerDictation}
                  disabled={isDictating}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Mic size={13} />
                  <span>{isDictating ? 'Transcribing Doctor Speech...' : 'Simulate Doctor Dictation'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExtractSoap}
                  disabled={isStructuringSoap}
                  className="btn-health"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Sparkles size={13} />
                  <span>{isStructuringSoap ? 'Extracting SOAP...' : 'Re-Run Gemini SOAP'}</span>
                </button>
              </div>
            </div>

            {/* Doctor Dictation Raw Transcript Audio Box */}
            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <Mic size={14} color="var(--color-health)" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Spoken Clinical Dictation (Dr. Rao)
                </span>
                <span className="badge badge-health" style={{ marginLeft: 'auto', fontSize: '0.62rem' }}>Whisper / Gemini Transcribed</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.45 }}>
                "Patient Priya Sharma presents on day 3 of acute febrile illness with temperature reaching 102.8°F, chills, retro-orbital headache, nausea, and severe arthralgia. Pharyngeal examination shows mild erythema without tonsillar exudate. Chest is clear on auscultation bilaterally. Abdomen soft, no hepatosplenomegaly. Blood pressure 124/82, pulse 98 bpm. Impression is acute viral febrile syndrome, suspecting Dengue fever prodrome. Advised oral Paracetamol 650mg TDS, Pantoprazole 40mg OD, oral hydration salts, and urgent Complete Blood Count with Dengue NS1 antigen testing."
              </p>
            </div>

            {/* Structured SOAP Notes 4-Box Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
              
              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-brand)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  S — Subjective
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  38F with 3-day history of acute fever, rigors, retro-orbital pain, severe generalized myalgias, and nausea. Denies cough, dysuria, or diarrhea. Known hypertensive on Amlodipine.
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-health)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  O — Objective
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Temp: 102.4°F &bull; BP: 124/82 mmHg &bull; HR: 98 bpm &bull; SpO2: 99% RA. Alert, oriented. Pharynx mildly hyperemic. Chest clear. Abdomen soft, non-tender. No petechial rash.
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  A — Assessment
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong>Acute Febrile Illness (Suspected Dengue / Viral Syndrome)</strong> [ICD-10: R50.9]. Differential: Chikungunya, Acute pharyngitis. Low suspicion of malaria.
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  P — Plan
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  1. Tab. Paracetamol 650mg TDS x 5 days.<br />
                  2. Tab. Pantoprazole 40mg OD x 5 days.<br />
                  3. Electral ORS hydration (2.5L/day).<br />
                  4. CBC + Dengue NS1 antigen stat.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={() => setStage(4)} className="btn-secondary">&larr; Back to Doctor Console</button>
              <button type="button" onClick={() => setStage(6)} className="btn-health">Generate Official EMR Prescription &rarr;</button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 6: EMR PRESCRIPTION WRITER & DIGITAL SIGN-OFF */}
      {stage === 6 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', letterSpacing: '0.05em' }}>
                  Stage 6: Branded EMR Prescription &amp; Clinical Sign-Off
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Hospital Letterhead Rx &bull; Drug Interactions Checked &bull; Digital Consultation Finalization
                </div>
              </div>

              <span className="badge badge-health" style={{ fontSize: '0.68rem' }}>
                Official EMR Document #RX-2026-9021
              </span>
            </div>

            {/* Official Hospital Letterhead Prescription Card */}
            <div style={{ 
              background: '#fff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', 
              padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '1.25rem' 
            }}>
              
              {/* Header Letterhead */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--color-health)', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    CITY CARE MULTISPECIALTY HOSPITAL
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-health)', fontWeight: 700 }}>
                    DEPARTMENT OF INTERNAL MEDICINE &bull; OUTPATIENT CLINIC
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    Sector 14, Health City, New Delhi &bull; Ph: +91 11 4982 0000 &bull; Web: www.citycarehospital.in
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Dr. A. K. Rao, MD
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    MBBS, MD (Internal Medicine)
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                    Reg. No: KMC-58291 &bull; Room 4
                  </div>
                </div>
              </div>

              {/* Patient Meta Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-xs)', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <div><strong>Patient:</strong> Priya Sharma</div>
                <div><strong>Age/Gender:</strong> 38 Y / Female</div>
                <div><strong>Token:</strong> GEN-104</div>
                <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>Allergies:</strong> <span style={{ color: '#ef4444', fontWeight: 700 }}>Penicillin</span></div>
              </div>

              {/* Diagnosis Banner */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Provisional Diagnosis:
                </span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Acute Febrile Illness — Suspected Dengue Fever (ICD-10: R50.9)
                </span>
              </div>

              {/* Rx Table */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Pill size={15} color="var(--color-health)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    Prescribed Medications (Rx)
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)' }}>
                        <th style={{ padding: '0.4rem 0.6rem', fontWeight: 700, color: 'var(--text-secondary)' }}>#</th>
                        <th style={{ padding: '0.4rem 0.6rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Medication &amp; Dosage</th>
                        <th style={{ padding: '0.4rem 0.6rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Frequency</th>
                        <th style={{ padding: '0.4rem 0.6rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Timing</th>
                        <th style={{ padding: '0.4rem 0.6rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.4rem 0.6rem', fontWeight: 700 }}>1</td>
                        <td style={{ padding: '0.4rem 0.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tab. Paracetamol 650 mg</td>
                        <td style={{ padding: '0.4rem 0.6rem' }}>1-1-1 (Thrice daily)</td>
                        <td style={{ padding: '0.4rem 0.6rem', color: 'var(--color-health)', fontWeight: 600 }}>After Food</td>
                        <td style={{ padding: '0.4rem 0.6rem' }}>5 Days</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.4rem 0.6rem', fontWeight: 700 }}>2</td>
                        <td style={{ padding: '0.4rem 0.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tab. Pantoprazole 40 mg</td>
                        <td style={{ padding: '0.4rem 0.6rem' }}>1-0-0 (Morning once)</td>
                        <td style={{ padding: '0.4rem 0.6rem', color: '#d97706', fontWeight: 600 }}>Before Food (Empty stomach)</td>
                        <td style={{ padding: '0.4rem 0.6rem' }}>5 Days</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.4rem 0.6rem', fontWeight: 700 }}>3</td>
                        <td style={{ padding: '0.4rem 0.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>Electral ORS Sachets</td>
                        <td style={{ padding: '0.4rem 0.6rem' }}>Frequent sips in 1L water</td>
                        <td style={{ padding: '0.4rem 0.6rem' }}>Throughout the day</td>
                        <td style={{ padding: '0.4rem 0.6rem' }}>3 Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lab Tests Ordered */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <FlaskConical size={14} color="var(--color-brand)" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    Diagnostic Investigations Ordered (Stat)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.2rem 0.55rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    ✓ Complete Blood Count (CBC with Platelet count)
                  </span>
                  <span style={{ padding: '0.2rem 0.55rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    ✓ Dengue Serology (NS1 Antigen &amp; Dengue IgM/IgG)
                  </span>
                  <span style={{ padding: '0.2rem 0.55rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    ✓ Routine Urine Examination
                  </span>
                </div>
              </div>

              {/* Advice & Follow Up */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  <strong>Clinical Advice:</strong> Adequate bed rest, high fluid intake (minimum 2.5-3 Litres/day), avoid Aspirin/Ibuprofen. Return immediately if bleeding spots, severe pain, or persistent vomiting occurs.
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Next Follow-Up Date: <strong style={{ color: 'var(--text-primary)' }}>After 3 Days (CBC review)</strong>
                  </div>
                  <div style={{ marginTop: '0.5rem', textAlign: 'center', minWidth: 140 }}>
                    <div style={{ fontFamily: 'cursive', fontSize: '0.95rem', color: 'var(--color-health)', fontWeight: 700 }}>
                      Dr. A. K. Rao
                    </div>
                    <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-medium)', paddingTop: '0.15rem' }}>
                      Digitally Signed on OPD-2.0 Platform
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Sign-off Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setStage(5)} className="btn-secondary">&larr; Back to AI SOAP Note</button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!prescriptionSigned ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPrescriptionSigned(true);
                      setDoctorStatus('completed');
                    }}
                    className="btn-health"
                  >
                    <UserCheck size={14} />
                    <span>Confirm &amp; Digitally Sign Prescription</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ padding: '0.45rem 0.85rem', background: 'var(--color-health-soft)', color: 'var(--color-health)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-health-border)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle size={15} /> Consultation Completed &amp; Rx Dispatched
                    </div>

                    <button
                      type="button"
                      onClick={() => window.print ? window.print() : null}
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Printer size={13} />
                      <span>Print Rx</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
