import React, { useState } from 'react';
import { 
  Users, Clock, Zap, MessageSquare, ArrowRight, 
  TrendingDown, CheckCircle, RefreshCw, AlertCircle
} from 'lucide-react';

export default function OPDSimulator() {
  const [waitingCount, setWaitingCount] = useState(148);
  const [avgWait, setAvgWait] = useState(48); // minutes
  const [rebalanced, setRebalanced] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Ramanathan', dept: 'Dermatology Room 1', queue: 24, status: 'Delayed (+26m)', load: 'heavy' },
    { id: 2, name: 'Dr. Ananya Sharma', dept: 'ENT Room 3', queue: 11, status: 'On Schedule', load: 'normal' },
    { id: 3, name: 'Dr. Vikram Patel', dept: 'Cardiology Room 2', queue: 9, status: 'Ahead (+8m)', load: 'light' },
    { id: 4, name: 'Dr. Priya Shah', dept: 'Fast-Track / Standby Room 5', queue: 3, status: 'Standby Ready', load: 'idle' }
  ]);

  const handleSimulateSurge = () => {
    setWaitingCount(prev => prev + 35);
    setAvgWait(56);
    setRebalanced(false);
    setSmsSent(false);
    setDoctors([
      { id: 1, name: 'Dr. Ramanathan', dept: 'Dermatology Room 1', queue: 38, status: 'Severe Bottleneck (+38m)', load: 'heavy' },
      { id: 2, name: 'Dr. Ananya Sharma', dept: 'ENT Room 3', queue: 16, status: 'Delayed (+12m)', load: 'heavy' },
      { id: 3, name: 'Dr. Vikram Patel', dept: 'Cardiology Room 2', queue: 14, status: 'On Schedule', load: 'normal' },
      { id: 4, name: 'Dr. Priya Shah', dept: 'Fast-Track / Standby Room 5', queue: 4, status: 'Available', load: 'light' }
    ]);
  };

  const handleDynamicRebalance = () => {
    setRebalanced(true);
    setAvgWait(22);
    setDoctors([
      { id: 1, name: 'Dr. Ramanathan', dept: 'Dermatology Room 1', queue: 18, status: 'Load Normalized', load: 'normal' },
      { id: 2, name: 'Dr. Ananya Sharma', dept: 'ENT Room 3', queue: 12, status: 'On Schedule', load: 'normal' },
      { id: 3, name: 'Dr. Vikram Patel', dept: 'Cardiology Room 2', queue: 10, status: 'On Schedule', load: 'normal' },
      { id: 4, name: 'Dr. Priya Shah', dept: 'Fast-Track / Standby Room 5', queue: 16, status: 'Active Surge Relief', load: 'normal' }
    ]);
  };

  const handleSendSMS = () => {
    setSmsSent(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: 'var(--bg-surface-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Clinic Queue
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {waitingCount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Patients</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Average Dwell Time
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: avgWait > 30 ? 'var(--color-amber)' : 'var(--color-health)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {avgWait} mins
            {rebalanced && <TrendingDown size={20} color="var(--color-health)" />}
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Queue Status
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: rebalanced ? 'var(--color-health)' : 'var(--color-amber)', marginTop: '0.35rem' }}>
            {rebalanced ? 'Optimized' : 'Surge Congestion'}
          </div>
        </div>
      </div>

      {/* Doctor Rooms Grid */}
      <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-health)', letterSpacing: '0.05em' }}>
            Live Outpatient Rooms &amp; Consultation Velocities
          </div>
          <span className="badge badge-health">TimescaleDB Live Sync</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {doctors.map(d => (
            <div 
              key={d.id}
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                border: '1px solid ' + (d.load === 'heavy' ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)')
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {d.name}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: d.load === 'heavy' ? 'var(--color-amber)' : 'var(--color-health)' }}>
                  {d.queue} Waiting
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {d.dept}
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: d.load === 'heavy' ? 'var(--color-amber)' : 'var(--text-secondary)' }}>
                <span className={`status-dot ${d.load === 'heavy' ? 'warning' : 'online'}`} />
                <span>{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Interactive Action Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleSimulateSurge}
          className="btn-secondary"
          style={{ flex: 1, minWidth: 160 }}
        >
          <Users size={14} />
          <span>Simulate Morning Walk-in Surge</span>
        </button>

        <button
          onClick={handleDynamicRebalance}
          className="btn-health"
          style={{ flex: 1, minWidth: 200 }}
        >
          <Zap size={14} />
          <span>Trigger Dynamic Rebalance (-40% Wait)</span>
        </button>

        <button
          onClick={handleSendSMS}
          className="btn-secondary"
          style={{ flex: 1, minWidth: 180 }}
        >
          <MessageSquare size={14} />
          <span>Broadcast SMS/WhatsApp Tokens</span>
        </button>
      </div>

      {/* SMS Broadcast Notification Pop */}
      {smsSent && (
        <div className="animate-fade-in" style={{ padding: '0.85rem', background: 'var(--color-health-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-health-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={18} color="var(--color-health)" />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
            <strong>Omnichannel Broadcast Sent:</strong> Dispatched personalized delay-offset SMS tokens to 38 registered smartphones (e.g. <em>"Dear Sarah, Dr. Ramanathan is in surgery. Your consultation moved to Room 5 at 11:15 AM."</em>)
          </div>
        </div>
      )}
    </div>
  );
}
