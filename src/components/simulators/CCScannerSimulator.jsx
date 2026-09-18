import React, { useState } from 'react';
import { 
  CreditCard, Search, ShieldAlert, ShieldCheck, 
  Lock, RefreshCw, Terminal, CheckCircle, CheckCircle2,
  Server, HardDrive, FileText, Download, AlertTriangle, 
  Network, Eye, Shield, ArrowRight, ArrowLeft, Play, Database
} from 'lucide-react';

const INITIAL_SYSTEMS = [
  { id: 'sys-1', name: 'WIN-FILE-SRV01', ip: '10.0.12.44', os: 'Windows Server 2022', proto: 'SMB (TCP 445)', share: 'C$, D$', status: 'Connected', verified: true, files: 4120 },
  { id: 'sys-2', name: 'WIN-APP-PROD02', ip: '10.0.12.89', os: 'Windows Server 2019', proto: 'SMB (TCP 445)', share: 'C$', status: 'Connected', verified: true, files: 2890 },
  { id: 'sys-3', name: 'LNX-BILLING-01', ip: '10.0.14.15', os: 'RHEL 9.2 (Linux)', proto: 'SSH/SFTP (TCP 22)', share: '/var/log, /opt/billing', status: 'Connected', verified: true, files: 6410 },
  { id: 'sys-4', name: 'LNX-CHECKOUT-02', ip: '10.0.14.18', os: 'Ubuntu 22.04 LTS', proto: 'SSH/SFTP (TCP 22)', share: '/var/www, /home/deploy', status: 'Connected', verified: true, files: 3150 }
];

const INITIAL_FINDINGS = [
  { 
    id: 1, 
    system: 'WIN-FILE-SRV01', 
    source: 'D$\\AppFiles\\Orders\\2026_03_batch.csv', 
    masked: '4111-XXXX-XXXX-8832', 
    brand: 'Visa Signature Debit', 
    bin: '411128 (Chase Bank)', 
    luhn: 'VALID (Mod-10)', 
    presidioScore: '0.98',
    spacyContext: 'Found nearby: "EXP: 08/28", "CARDHOLDER: JENKINS/S"',
    status: 'Masked at Detection',
    line: 'Line 412'
  },
  { 
    id: 2, 
    system: 'LNX-BILLING-01', 
    source: '/var/log/checkout_err.log', 
    masked: '5500-XXXX-XXXX-4912', 
    brand: 'Mastercard Corporate', 
    bin: '550000 (Citibank)', 
    luhn: 'VALID (Mod-10)', 
    presidioScore: '0.95',
    spacyContext: 'Found nearby: "AUTH_FAIL", "CVV: ***", "EXP: 11/27"',
    status: 'Masked at Detection',
    line: 'Line 1,842'
  },
  { 
    id: 3, 
    system: 'WIN-APP-PROD02', 
    source: 'C$\\inetpub\\logs\\w3c_ex2609.log', 
    masked: '3782-XXXXXX-10005', 
    brand: 'American Express', 
    bin: '378282 (Amex Centurion)', 
    luhn: 'VALID (Mod-10)', 
    presidioScore: '0.96',
    spacyContext: 'Found nearby: "POST /pay/v2", "AMEX_AUTH"',
    status: 'Masked at Detection',
    line: 'Line 9,301'
  },
  { 
    id: 4, 
    system: 'LNX-CHECKOUT-02', 
    source: '/opt/billing/archive/legacy_dump.sql', 
    masked: '6011-XXXX-XXXX-9010', 
    brand: 'Discover Novus', 
    bin: '601100 (Discover Bank)', 
    luhn: 'VALID (Mod-10)', 
    presidioScore: '0.94',
    spacyContext: 'Found nearby: "billing_account_num", "DISC_CARD"',
    status: 'Masked at Detection',
    line: 'Line 54'
  }
];

export default function CCScannerSimulator() {
  const [stage, setStage] = useState(1);
  const [systems, setSystems] = useState(INITIAL_SYSTEMS);
  const [testingConnectivity, setTestingConnectivity] = useState(false);
  const [connectivityVerified, setConnectivityVerified] = useState(true);

  // Scan Scope & Invariants
  const [selectedFormats, setSelectedFormats] = useState(['Logs (.log)', 'Delimited (.csv/.tsv)', 'PDF Documents (.pdf)', 'Office (.docx/.xlsx)', 'Databases (.sql/.sqlite)', 'Archives (.zip/.tar)']);
  const [systemsPool, setSystemsPool] = useState(4);
  const [filesPool, setFilesPool] = useState(8);

  // Live Execution Telemetry
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [scannedFilesCount, setScannedFilesCount] = useState(16570);
  const [activeStreams, setActiveStreams] = useState([
    { sys: 'WIN-FILE-SRV01', file: 'D$\\AppFiles\\Orders\\2026_03_batch.csv', speed: '42 MB/s', state: 'Streaming in RAM' },
    { sys: 'LNX-BILLING-01', file: '/var/log/checkout_err.log', speed: '38 MB/s', state: 'Presidio + spaCy NER' },
    { sys: 'WIN-APP-PROD02', file: 'C$\\inetpub\\logs\\w3c_ex2609.log', speed: '55 MB/s', state: 'Luhn Checksum Passed' },
    { sys: 'LNX-CHECKOUT-02', file: '/opt/billing/archive/legacy_dump.sql', speed: '48 MB/s', state: 'Streaming in RAM' }
  ]);

  // Findings
  const [findings, setFindings] = useState(INITIAL_FINDINGS);
  const [selectedFinding, setSelectedFinding] = useState(INITIAL_FINDINGS[0]);

  // QSA Evidence Pack
  const [exportedPack, setExportedPack] = useState(false);

  // Test Connectivity Handler
  const handleTestConnectivity = () => {
    setTestingConnectivity(true);
    setTimeout(() => {
      setTestingConnectivity(false);
      setConnectivityVerified(true);
    }, 1200);
  };

  // Run Scan Simulation
  const handleLaunchScan = () => {
    setScanning(true);
    setScanProgress(0);
    setScannedFilesCount(2400);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          return 100;
        }
        return prev + 25;
      });
      setScannedFilesCount(prev => prev + 3500);
    }, 500);
  };

  // Reset
  const handleReset = () => {
    setStage(1);
    setScanning(false);
    setScanProgress(100);
    setScannedFilesCount(16570);
    setExportedPack(false);
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
          <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--color-sec-soft)', color: 'var(--color-sec)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Central CC Scanner — Agentless PCI DSS Flow
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              SMB/SSH Remote Readers &bull; Zero-Disk In-Memory Stream &bull; Presidio + spaCy NER &bull; QSA Pack
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { num: 1, label: 'Target Systems' },
            { num: 2, label: 'Scan Scope' },
            { num: 3, label: 'Live Monitor' },
            { num: 4, label: 'Defensible Findings' },
            { num: 5, label: 'QSA Evidence Pack' }
          ].map(s => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStage(s.num)}
              style={{
                padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-xs)', fontSize: '0.7rem', fontWeight: 600,
                background: stage === s.num ? 'var(--color-sec)' : 'var(--bg-subtle)',
                color: stage === s.num ? '#fff' : 'var(--text-muted)',
                border: '1px solid ' + (stage === s.num ? 'var(--color-sec)' : 'var(--border-subtle)')
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

      {/* STAGE 1: TARGET SYSTEMS & HOST IDENTITY VERIFICATION */}
      {stage === 1 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 1: Agentless Target Infrastructure &amp; Credential Handshake
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Zero code installed on targets &bull; Native SMB (Windows) and SSH/SFTP (Linux) &bull; Re-IP Safe Fingerprints
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestConnectivity}
              disabled={testingConnectivity}
              className="btn-sec"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              <Network size={13} />
              <span>{testingConnectivity ? 'Validating Handshakes...' : 'Test Connectivity (All Systems)'}</span>
            </button>
          </div>

          {/* Invariant Banner */}
          <div style={{ padding: '0.75rem 1rem', background: 'var(--color-sec-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sec-border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={18} color="var(--color-sec)" />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
              <strong>Agentless &amp; Read-Only Invariant:</strong> Nothing is executed on targets. Files are streamed directly into volatile memory over SMB port 445 (Windows) and SFTP port 22 (Linux) using vault-backed read credentials.
            </div>
          </div>

          {/* Systems Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.55rem 0.75rem' }}>Hostname / Identity</th>
                  <th style={{ padding: '0.55rem 0.75rem' }}>IP Address</th>
                  <th style={{ padding: '0.55rem 0.75rem' }}>Operating System</th>
                  <th style={{ padding: '0.55rem 0.75rem' }}>Protocol &amp; Shares</th>
                  <th style={{ padding: '0.55rem 0.75rem' }}>Est. Files</th>
                  <th style={{ padding: '0.55rem 0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {systems.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Server size={14} color="var(--color-sec)" />
                        {s.name}
                      </div>
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {s.ip}
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', color: 'var(--text-secondary)' }}>
                      {s.os}
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', color: 'var(--text-secondary)' }}>
                      <strong>{s.proto}</strong> &bull; <span style={{ color: 'var(--text-muted)' }}>{s.share}</span>
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {s.files.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem' }}>
                      <span className="badge badge-health" style={{ fontSize: '0.65rem' }}>
                        <CheckCircle2 size={11} /> Ready
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setStage(2)}
              className="btn-sec"
            >
              <span>Proceed to Scope &amp; Invariants &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: SCAN SCOPE & TWO-LEVEL CONCURRENCY */}
      {stage === 2 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 2: Format Filter (~30 Formats) &amp; Two-Level Concurrency
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Pool of Systems &times; Pool of Files &bull; Zero Disk Cache &bull; Format-Aware Text Extractors
              </div>
            </div>
            <span className="badge badge-sec" style={{ fontSize: '0.68rem' }}>Presidio + spaCy en_core_web_lg</span>
          </div>

          {/* Formats Grid */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              Target File Formats In Scope (~30 Formats Covered)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem' }}>
              {[
                'Logs (.log / .txt / .out)',
                'Delimited (.csv / .tsv)',
                'PDF Documents (.pdf)',
                'Office Word (.docx / .doc)',
                'Office Excel (.xlsx / .xls)',
                'Databases (.sql / .sqlite / .db)',
                'Emails (.eml / .msg)',
                'Archives (.zip / .tar / .gz)',
                'Modern Data (.parquet / .json)'
              ].map(fmt => (
                <div key={fmt} style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-primary)' }}>
                  <Check size={13} color="var(--color-sec)" />
                  <span>{fmt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two Level Concurrency Tuning */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Level 1: Concurrent Systems Pool
              </label>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-sec)' }}>
                4 Systems in Flight
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Overlaps network round-trip latencies across multiple hosts simultaneously.
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Level 2: Concurrent Files Pool (Per System)
              </label>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-sec)' }}>
                8 Files per System (32 Total Streams)
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Maximizes SMB/SFTP parallel pipe throughput without saturating host CPUs.
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(1)} className="btn-secondary">&larr; Back to Systems</button>
            <button type="button" onClick={() => { handleLaunchScan(); setStage(3); }} className="btn-sec">
              <Play size={14} />
              <span>Launch Agentless PCI Audit Scan &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: LIVE STREAMING TELEMETRY MONITOR */}
      {stage === 3 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 3: Live In-Memory Pipeline &amp; Telemetry Monitor
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Prefilter &rarr; Text Extraction &rarr; Luhn Check &rarr; Presidio CREDIT_CARD &rarr; spaCy NER Context
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="status-dot online" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-health)' }}>
                {scanning ? 'Scanning Streams In Flight...' : 'Scan Complete (Zero Crashes)'}
              </span>
            </div>
          </div>

          {/* Realtime Telemetry Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Audited Files</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {scannedFilesCount.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Stream Velocity</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-sec)', fontFamily: 'var(--font-mono)' }}>
                183 MB/sec
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Disk Footprint</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-health)', fontFamily: 'var(--font-mono)' }}>
                0 Bytes (RAM Only)
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>PAN Findings</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
                4 Detected
              </div>
            </div>
          </div>

          {/* Active File Streams Table */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Active In-Flight In-Memory Streams
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {activeStreams.map((st, i) => (
                <div key={i} style={{ padding: '0.55rem 0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-sec)', fontFamily: 'var(--font-mono)' }}>{st.sys}</span>
                    <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{st.file}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{st.speed}</span>
                    <span className="badge badge-sec" style={{ fontSize: '0.65rem' }}>{st.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(2)} className="btn-secondary">&larr; Back to Scope</button>
            <button type="button" onClick={() => setStage(4)} className="btn-sec">Review Defensible Findings &rarr;</button>
          </div>
        </div>
      )}

      {/* STAGE 4: DEFENSIBLE MASKED FINDINGS */}
      {stage === 4 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 4: Defensible Findings (PCI DSS Req. 3.4 Compliant)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Masked at Detection &bull; Mod-10 Luhn Checksum &bull; Presidio High-Confidence &bull; spaCy Context Scoring
              </div>
            </div>
            <span className="badge badge-health" style={{ fontSize: '0.68rem' }}>4 PAN Violations Flagged</span>
          </div>

          {/* Findings Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Target System</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>File Location</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Masked PAN</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Card Brand / BIN</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Luhn Check</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Confidence</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {findings.map(f => (
                  <tr 
                    key={f.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-subtle)',
                      background: selectedFinding.id === f.id ? 'var(--color-sec-soft)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.5rem 0.6rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{f.system}</td>
                    <td style={{ padding: '0.5rem 0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {f.source} <span style={{ color: 'var(--text-muted)' }}>({f.line})</span>
                    </td>
                    <td style={{ padding: '0.5rem 0.6rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
                      {f.masked}
                    </td>
                    <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600 }}>{f.brand}</td>
                    <td style={{ padding: '0.5rem 0.6rem' }}>
                      <span className="badge badge-health" style={{ fontSize: '0.62rem' }}>{f.luhn}</span>
                    </td>
                    <td style={{ padding: '0.5rem 0.6rem', fontFamily: 'var(--font-mono)' }}>{f.presidioScore}</td>
                    <td style={{ padding: '0.5rem 0.6rem' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedFinding(f)}
                        style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)', fontSize: '0.65rem', fontWeight: 700, background: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }}
                      >
                        Inspect Context
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Finding Deep Dive Box */}
          <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-sec)', marginBottom: '0.35rem' }}>
              Deep Dive: {selectedFinding.source} ({selectedFinding.system})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.72rem' }}>
              <div>
                <strong>BIN Issuer Attribution:</strong> {selectedFinding.bin}
              </div>
              <div>
                <strong>spaCy NER Evidence:</strong> <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>{selectedFinding.spacyContext}</span>
              </div>
              <div>
                <strong>PCI DSS 4.0 Posture:</strong> <span style={{ color: '#e11d48', fontWeight: 700 }}>Requirement 3.4 Remediation Mandatory</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(3)} className="btn-secondary">&larr; Back to Monitor</button>
            <button type="button" onClick={() => setStage(5)} className="btn-sec">Generate QSA Evidence Pack &rarr;</button>
          </div>
        </div>
      )}

      {/* STAGE 5: QSA EVIDENCE PACK & COVERAGE ATTESTATION */}
      {stage === 5 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 5: QSA Evidence Pack &amp; Coverage Attestation (Req. 10 Trail)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Defensible Audit Package &bull; Zero False Assurances &bull; SHA-256 Tamper-Evident Ledger
              </div>
            </div>
            <span className="badge badge-health" style={{ fontSize: '0.68rem' }}>PCI DSS 4.0 QSA-Ready</span>
          </div>

          {/* Attestation Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            
            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Audited Estate Scope</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                4 / 4 Systems Audited
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-health)', fontWeight: 600, marginTop: '0.15rem' }}>
                100% Connectivity &bull; 0 Timeouts
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Coverage Gap Registry</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-health)', marginTop: '0.2rem' }}>
                0 Skipped Files
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Permission Denied: 0 &bull; Locked: 0
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Audit Trail Integrity</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-sec)', marginTop: '0.2rem' }}>
                SHA-256 Signed
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Tamper-evident audit_log.sqlite
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div style={{ background: 'var(--color-sec-soft)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sec-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileText size={20} color="var(--color-sec)" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Complete QSA Assessment Bundle (ZIP / PDF / CSV)
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Includes executive summary, masked card findings ledger, host identities, and coverage gap declarations.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExportedPack(true)}
              className="btn-sec"
            >
              <Download size={14} />
              <span>{exportedPack ? 'Evidence Bundle Downloaded' : 'Export QSA Evidence Bundle (.zip)'}</span>
            </button>
          </div>

          {exportedPack && (
            <div className="animate-fade-in" style={{ padding: '0.65rem 0.85rem', background: 'var(--color-health-soft)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-health-border)', fontSize: '0.72rem', color: 'var(--color-health)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <CheckCircle size={15} />
              <span>Evidence package generated: <strong>pci_dss_4.0_qsa_evidence_2026.zip</strong> (SHA-256: 7f8a9...b14)</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(4)} className="btn-secondary">&larr; Back to Findings</button>
            <button type="button" onClick={handleReset} className="btn-secondary">
              <RefreshCw size={13} />
              <span>Restart Assessment Simulator</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
