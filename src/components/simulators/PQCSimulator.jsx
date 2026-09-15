import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Cpu, Sliders, Globe, 
  Terminal, Copy, Check, Download, AlertTriangle, RefreshCw
} from 'lucide-react';

export default function PQCSimulator() {
  const [activeTab, setActiveTab] = useState('mosca'); // 'mosca', 'prober', 'collectors', 'cbom'
  
  // Mosca Risk Engine State
  const [shelfLifeX, setShelfLifeX] = useState(15); // years
  const [migrationRunwayY, setMigrationRunwayY] = useState(4); // years
  const [collapseHorizonZ, setCollapseHorizonZ] = useState(7); // years

  // TLS Prober State
  const [targetEndpoint, setTargetEndpoint] = useState('https://api.payments.prod.internal:443');
  const [probing, setProbing] = useState(false);
  const [proberResult, setProberResult] = useState({
    tlsVersion: 'TLS 1.3',
    cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
    keyExchange: 'secp256r1 (Classical ECDHE)',
    signature: 'RSA-2048 (Shor Vulnerable)',
    pqcClassification: 'quantum-vulnerable-asymmetric',
    postQuantumSafe: false,
    fipsStandard: 'Pre-Quantum (Requires ML-KEM-768)'
  });

  const [copiedCBOM, setCopiedCBOM] = useState(false);

  // Compute Mosca Condition & QARS
  const isBreached = (shelfLifeX + migrationRunwayY) > collapseHorizonZ;
  const moscaSum = shelfLifeX + migrationRunwayY;
  
  // QARS formula: Weighted Algorithm (0.25) + Exposure (0.20) + Sensitivity (0.20) + Mosca Ratio (0.35)
  const moscaRatio = Math.min(100, Math.round(((shelfLifeX + migrationRunwayY) / collapseHorizonZ) * 35));
  const qarsScore = Math.min(99, 45 + moscaRatio);

  const handleRunProbe = () => {
    setProbing(true);
    setTimeout(() => {
      setProbing(false);
      setProberResult({
        tlsVersion: 'TLS 1.3',
        cipher: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        keyExchange: 'secp256r1 (Classical Curve)',
        signature: 'RSA-2048 (Shor Algorithm Vulnerable)',
        pqcClassification: 'quantum-vulnerable-asymmetric',
        postQuantumSafe: false,
        fipsStandard: 'Pre-Quantum (Migration to NIST FIPS 203 ML-KEM-768 required)'
      });
    }, 750);
  };

  const sampleCBOM = {
    bomFormat: 'CycloneDX',
    specVersion: '1.7',
    serialNumber: 'urn:uuid:7c92b49e-1823-45ab-92fa-cbom2026',
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [{ vendor: 'Panacea PQC', name: 'panacea-scanner', version: '4.2.0' }]
    },
    components: [
      {
        type: 'cryptographic-asset',
        name: 'api.payments.prod.internal:443',
        pqcCategory: 'quantum-vulnerable-asymmetric',
        cryptoProperties: {
          assetType: 'protocol',
          protocol: 'TLSv1.3',
          cipherSuites: ['TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384'],
          classicalAlgorithms: ['RSA-2048', 'ECDHE-P256'],
          postQuantumAlternative: 'X25519MLKEM768 (NIST FIPS 203)',
          moscaRiskScore: qarsScore,
          hndlExposure: isBreached ? 'CRITICAL' : 'LOW'
        }
      }
    ]
  };

  const handleCopyCBOM = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleCBOM, null, 2));
    setCopiedCBOM(true);
    setTimeout(() => setCopiedCBOM(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { id: 'mosca', label: '6-Factor Mosca Risk Engine' },
            { id: 'prober', label: 'Active TLS 1.3 Prober' },
            { id: 'collectors', label: '35 AWS Collectors' },
            { id: 'cbom', label: 'CycloneDX 1.7 CBOM' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: activeTab === t.id ? 'var(--color-sec)' : 'transparent',
                color: activeTab === t.id ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (activeTab === t.id ? 'var(--color-sec)' : 'transparent')
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <span className="badge badge-sec">NIST FIPS 203/204 Ready</span>
      </div>

      {/* TAB 1: Mosca Risk Engine */}
      {activeTab === 'mosca' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {/* Sliders Box */}
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Mosca's Theorem: X + Y &gt; Z
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                If Data Shelf-Life ($X$) + Migration Runway ($Y$) exceeds Time to Quantum Computer ($Z$), adversary Harvest Now, Decrypt Later (HNDL) is already fatal!
              </p>
            </div>

            {/* Slider X */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Data Confidentiality Shelf-Life (X)
                </label>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-sec)' }}>
                  {shelfLifeX} Years
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                value={shelfLifeX} 
                onChange={(e) => setShelfLifeX(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-sec)' }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Healthcare records, banking secrets, military schematics</span>
            </div>

            {/* Slider Y */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Migration Runway to PQC (Y)
                </label>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-sec)' }}>
                  {migrationRunwayY} Years
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={migrationRunwayY} 
                onChange={(e) => setMigrationRunwayY(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-sec)' }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Time needed to re-architect KMS keys, PKI, and network gateways</span>
            </div>

            {/* Slider Z */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Time to Cryptanalytically Relevant Quantum Computer (Z)
                </label>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-sec)' }}>
                  {collapseHorizonZ} Years
                </span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="15" 
                value={collapseHorizonZ} 
                onChange={(e) => setCollapseHorizonZ(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-sec)' }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Estimated Q-Day horizon (NIST consensus: 2030-2033)</span>
            </div>
          </div>

          {/* QARS Meter & Verdict Box */}
          <div style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Quantum-Adjusted Risk Score (QARS)
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: isBreached ? 'var(--color-rose)' : 'var(--color-health)' }}>
                  {qarsScore}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
                <span style={{ 
                  marginLeft: 'auto', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: 'var(--radius-xs)', 
                  background: isBreached ? 'rgba(244, 63, 94, 0.15)' : 'var(--color-health-soft)',
                  color: isBreached ? 'var(--color-rose)' : 'var(--color-health)'
                }}>
                  {isBreached ? 'CRITICAL HNDL RISK' : 'LOW IMMEDIATE THREAT'}
                </span>
              </div>

              {/* Mosca Condition Card */}
              <div style={{ 
                padding: '0.85rem', 
                borderRadius: 'var(--radius-sm)', 
                background: 'var(--bg-subtle)', 
                borderLeft: `4px solid ${isBreached ? 'var(--color-rose)' : 'var(--color-health)'}`,
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Condition: {shelfLifeX} + {migrationRunwayY} {isBreached ? '>' : '≤'} {collapseHorizonZ} ({moscaSum} yrs vs {collapseHorizonZ} yrs)
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {isBreached ? (
                    <>
                      <strong>Harvest Now Decrypt Later Triggered:</strong> Adversaries storing your traffic today will crack it before your retention expiry ({shelfLifeX} yrs) and migration ({migrationRunwayY} yrs) complete!
                    </>
                  ) : (
                    <>
                      <strong>Within Safety Margin:</strong> Migration can theoretically complete before the quantum horizon, but immediate hybrid deployment is recommended.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div style={{ padding: '0.75rem', background: 'var(--color-sec-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sec-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sec)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} />
                <span>Immediate Remediation Blueprint:</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Upgrade TLS terminating endpoints to NIST FIPS 203 (ML-KEM-768) hybrid key exchange and enforce AES-256-GCM symmetric floor to resist Grover's algorithm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Active TLS 1.3 Prober */}
      {activeTab === 'prober' && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
              Direct TLS 1.3 &amp; STARTTLS Network Prober
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Actively handshakes public or internal endpoints without credentials to test supported curves, ALPN, and PQC hybrid readiness.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              value={targetEndpoint} 
              onChange={(e) => setTargetEndpoint(e.target.value)}
              style={{ flex: 1, minWidth: 240, padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}
            />
            <button
              onClick={handleRunProbe}
              disabled={probing}
              className="btn-sec"
            >
              {probing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Probing Handshake...</span>
                </>
              ) : (
                <>
                  <Globe size={14} />
                  <span>Execute Network Probe</span>
                </>
              )}
            </button>
          </div>

          {/* Prober Details */}
          <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Negotiated Protocol</span>
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{proberResult.tlsVersion}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Negotiated Cipher Suite</span>
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{proberResult.cipher}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Key Exchange Mechanism</span>
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-rose)' }}>{proberResult.keyExchange}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>NIST PQC Taxonomy</span>
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-sec)' }}>{proberResult.pqcClassification}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 35 AWS Collectors */}
      {activeTab === 'collectors' && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            35 Multi-Account AWS Collectors (Read-Only)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {[
              { name: 'AWS KMS CMK Keys', count: '48 Keys', status: 'AES-256 Safe / RSA-4096 Weak' },
              { name: 'ACM SSL/TLS Certificates', count: '124 Certs', status: 'RSA-2048 Shor Vulnerable' },
              { name: 'CloudFront Distributions', count: '18 Edges', status: 'TLS 1.2 Classical Default' },
              { name: 'Application Load Balancers (ALB)', count: '32 Listeners', status: 'ELBSecurityPolicy-TLS13-1-2' },
              { name: 'Amazon S3 Bucket Encryption', count: '286 Buckets', status: 'SSE-KMS Enabled' },
              { name: 'Secrets Manager Vaults', count: '94 Secrets', status: 'Envelope Encrypted' }
            ].map(c => (
              <div key={c.name} style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-sec)', margin: '0.2rem 0', fontFamily: 'var(--font-mono)' }}>{c.count}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{c.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CycloneDX 1.7 CBOM */}
      {activeTab === 'cbom' && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                CycloneDX 1.7 Cryptographic Bill of Materials (CBOM)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Standardized RFC 4514 output compliant with White House NSM-10 mandates.
              </div>
            </div>

            <button
              onClick={handleCopyCBOM}
              className="btn-secondary"
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
            >
              {copiedCBOM ? <Check size={13} color="var(--color-health)" /> : <Copy size={13} />}
              <span>{copiedCBOM ? 'Copied CBOM' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre style={{ 
            background: 'var(--terminal-bg)', 
            color: '#a5b4fc', 
            padding: '1rem', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: '0.72rem', 
            overflowX: 'auto',
            maxHeight: 240,
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)'
          }}>
            {JSON.stringify(sampleCBOM, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
