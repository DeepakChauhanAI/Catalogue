import React, { useState } from 'react';
import { 
  CreditCard, Search, ShieldAlert, ShieldCheck, 
  Lock, RefreshCw, Terminal, CheckCircle
} from 'lucide-react';

const SAMPLE_FINDINGS = [
  { id: 1, source: '/var/log/checkout.err', raw: '4111 2894 1029 8832', masked: '4111-XXXX-XXXX-8832', bin: 'Visa Debit', luhn: 'VALID', risk: 'CRITICAL', status: 'Exposed' },
  { id: 2, source: 's3://invoices-raw/2026/03.json', raw: '5500 0048 2910 4912', masked: '5500-XXXX-XXXX-4912', bin: 'Mastercard Platinum', luhn: 'VALID', risk: 'CRITICAL', status: 'Exposed' },
  { id: 3, source: 'db_orders.customers.notes', raw: '3782 8224 6310 005', masked: '3782-XXXXXX-10005', bin: 'American Express', luhn: 'VALID', risk: 'CRITICAL', status: 'Exposed' },
  { id: 4, source: '/tmp/db_dump_legacy.sql', raw: '4000 1234 5678 9010', masked: '4000-XXXX-XXXX-9010', bin: 'Visa Classic', luhn: 'VALID', risk: 'CRITICAL', status: 'Exposed' }
];

export default function CCScannerSimulator() {
  const [target, setTarget] = useState('all');
  const [scanning, setScanning] = useState(false);
  const [findings, setFindings] = useState(SAMPLE_FINDINGS);
  const [scannedRecords, setScannedRecords] = useState(148200);
  const [isMasked, setIsMasked] = useState(false);

  const handleRunScan = () => {
    setScanning(true);
    setIsMasked(false);
    let count = 0;
    const interval = setInterval(() => {
      count += 24500;
      setScannedRecords(148200 + count);
      if (count >= 120000) {
        clearInterval(interval);
        setScanning(false);
      }
    }, 200);
  };

  const handleMaskAll = () => {
    setIsMasked(true);
    setFindings(prev => prev.map(f => ({ ...f, status: 'Tokenized & Redacted' })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Control Bar */}
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
            background: 'var(--color-sec-soft)', 
            color: 'var(--color-sec)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <CreditCard size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              PCI-DSS High-Throughput Cardholder Scanner
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Multi-threaded Golang + Rust Engine &bull; Luhn Checksum &amp; BIN Validation
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleRunScan}
            disabled={scanning}
            className="btn-sec"
          >
            {scanning ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Auditing Records ({scannedRecords.toLocaleString()})...</span>
              </>
            ) : (
              <>
                <Search size={14} />
                <span>Trigger Live PCI Audit Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Speed & Throughput Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: 'var(--bg-surface-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Audit Throughput
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            120,000 /sec
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Luhn Checksum Accuracy
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-health)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            100% Validated
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Cleartext PAN Expiries
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isMasked ? 'var(--color-health)' : 'var(--color-rose)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            {isMasked ? '0 Exposed' : `${findings.length} Violations`}
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-card)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            PCI-DSS 4.0 Status
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isMasked ? 'var(--color-health)' : 'var(--color-amber)', marginTop: '0.3rem' }}>
            {isMasked ? 'Compliant' : 'Req 3.4 Breach'}
          </div>
        </div>
      </div>

      {/* Discovered Leaks Table */}
      <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
              Detected Cleartext Cardholder Numbers (PAN)
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Identified in application logs, database dumps, and cloud storage buckets.
            </div>
          </div>

          <button
            onClick={handleMaskAll}
            disabled={isMasked}
            className="btn-sec"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', opacity: isMasked ? 0.6 : 1 }}
          >
            <Lock size={14} />
            <span>{isMasked ? 'All PANs Redacted' : '1-Click Mask & Tokenize All'}</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Source Location</th>
                <th style={{ padding: '0.5rem' }}>Card Number (PAN)</th>
                <th style={{ padding: '0.5rem' }}>Issuer / BIN</th>
                <th style={{ padding: '0.5rem' }}>Luhn Check</th>
                <th style={{ padding: '0.5rem' }}>Remediation Status</th>
              </tr>
            </thead>
            <tbody>
              {findings.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {f.source}
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isMasked ? 'var(--color-health)' : 'var(--color-rose)' }}>
                    {isMasked ? f.masked : f.raw}
                  </td>
                  <td style={{ padding: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {f.bin}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <span className="badge badge-health">{f.luhn}</span>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: isMasked ? 'var(--color-health)' : 'var(--color-rose)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {isMasked ? <CheckCircle size={13} /> : <ShieldAlert size={13} />}
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
