import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Cpu, Sliders, Globe, 
  Terminal, Copy, Check, Download, AlertTriangle, RefreshCw,
  Cloud, Key, Lock, Network, Share2, Layers, CheckCircle, CheckCircle2,
  FileCode, Play, Eye, Shield, ArrowRight, ArrowLeft, Database
} from 'lucide-react';

const SAMPLE_ASSETS = [
  {
    arn: 'arn:aws:acm:us-east-1:123456789012:certificate/api-wildcard',
    service: 'ACM Certificate',
    algorithm: 'RSA-2048 (SHA256withRSA)',
    posture: 'quantum-vulnerable-asymmetric',
    urgency: 'CRITICAL (Shor Broken)',
    consumers: 'ALB: api-gateway, CloudFront: cdn-prod',
    remediation: 'Migrate to NIST FIPS 204 (ML-DSA-65) or Hybrid X25519MLKEM768'
  },
  {
    arn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/api-gateway',
    service: 'Application Load Balancer',
    algorithm: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
    posture: 'quantum-vulnerable-modern-tls1.3',
    urgency: 'MEDIUM (Classical ECDHE)',
    consumers: 'Internet Facing Ingress',
    remediation: 'Deploy AWS Hybrid PQC SSL Policy (ELBSecurityPolicy-PQ-TLS13)'
  },
  {
    arn: 'arn:aws:kms:us-east-1:123456789012:key/prod-customer-pii',
    service: 'AWS KMS CMK',
    algorithm: 'SYMMETRIC_DEFAULT (AES-256-GCM)',
    posture: 'quantum-weakened-symmetric',
    urgency: 'COMPLIANT (128-bit Grover Floor)',
    consumers: 'S3: prod-billing-archives, RDS: customer-db',
    remediation: 'AES-256 meets NIST 128-bit quantum security floor. Maintain.'
  },
  {
    arn: 'arn:aws:s3:::legacy-export-unencrypted-2024',
    service: 'Amazon S3 Bucket',
    algorithm: 'None (Plaintext)',
    posture: 'unencrypted',
    urgency: 'IMMEDIATE ACTION',
    consumers: 'Legacy Reports Export',
    remediation: 'Enable default SSE-KMS with Customer Managed Key.'
  }
];

export default function PQCSimulator() {
  const [stage, setStage] = useState(1);

  // Stage 1: Scope & Collectors
  const [selectedAccounts, setSelectedAccounts] = useState(['123456789012 (Production CDE)', '987654321098 (Staging Env)']);
  const [selectedRegions, setSelectedRegions] = useState(['us-east-1 (N. Virginia)', 'eu-west-1 (Ireland)', 'ap-south-1 (Mumbai)']);
  const [activeCollectorsCount, setActiveCollectorsCount] = useState(35);

  // Stage 2: Live Discovery Execution
  const [scanning, setScanning] = useState(false);
  const [discoveredCount, setDiscoveredCount] = useState(384);

  // Stage 3: NIST 10-Class Posture & Mosca Engine
  const [shelfLifeX, setShelfLifeX] = useState(15);
  const [migrationRunwayY, setMigrationRunwayY] = useState(4);
  const [collapseHorizonZ, setCollapseHorizonZ] = useState(7);

  // Stage 4: Dependency Graph
  const [selectedAssetArn, setSelectedAssetArn] = useState(SAMPLE_ASSETS[0].arn);

  // Stage 6: CBOM Export
  const [copiedCBOM, setCopiedCBOM] = useState(false);
  const [downloadedCBOM, setDownloadedCBOM] = useState(false);

  // Mosca Condition & QARS
  const isBreached = (shelfLifeX + migrationRunwayY) > collapseHorizonZ;
  const moscaSum = shelfLifeX + migrationRunwayY;
  const moscaRatio = Math.min(100, Math.round(((shelfLifeX + migrationRunwayY) / collapseHorizonZ) * 35));
  const qarsScore = Math.min(99, 45 + moscaRatio);

  // Simulate Scan Launch
  const handleLaunchDiscovery = () => {
    setScanning(true);
    setDiscoveredCount(48);
    let count = 48;
    const interval = setInterval(() => {
      count += 84;
      setDiscoveredCount(Math.min(384, count));
      if (count >= 384) {
        clearInterval(interval);
        setScanning(false);
      }
    }, 300);
  };

  const sampleCBOM = {
    bomFormat: 'CycloneDX',
    specVersion: '1.7',
    serialNumber: 'urn:uuid:7c92b49e-1823-45ab-92fa-cbom2026',
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [{ vendor: 'Panacea PQC', name: 'panacea-scanner', version: '4.2.0' }],
      component: {
        type: 'cloud-infrastructure',
        name: 'AWS Multi-Account Enterprise Estate',
        scope: '123456789012, 987654321098'
      }
    },
    components: [
      {
        type: 'cryptographic-asset',
        name: 'arn:aws:acm:us-east-1:123456789012:certificate/api-wildcard',
        pqcCategory: 'quantum-vulnerable-asymmetric',
        cryptoProperties: {
          assetType: 'certificate',
          algorithm: 'RSA-2048',
          classicalSecurityLevel: 112,
          nistQuantumSecurityLevel: 0,
          postQuantumAlternative: 'ML-DSA-65 (NIST FIPS 204)',
          moscaRiskScore: qarsScore,
          hndlExposure: isBreached ? 'CRITICAL' : 'MODERATE'
        }
      },
      {
        type: 'cryptographic-asset',
        name: 'arn:aws:kms:us-east-1:123456789012:key/prod-customer-pii',
        pqcCategory: 'quantum-weakened-symmetric',
        cryptoProperties: {
          assetType: 'key',
          algorithm: 'AES-256-GCM',
          classicalSecurityLevel: 256,
          nistQuantumSecurityLevel: 128,
          nistQuantumFloorStatus: 'COMPLIANT_MARGINAL'
        }
      }
    ]
  };

  const handleCopyCBOM = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleCBOM, null, 2));
    setCopiedCBOM(true);
    setTimeout(() => setCopiedCBOM(false), 2000);
  };

  const handleReset = () => {
    setStage(1);
    setScanning(false);
    setDiscoveredCount(384);
    setCopiedCBOM(false);
    setDownloadedCBOM(false);
  };

  const activeAsset = SAMPLE_ASSETS.find(a => a.arn === selectedAssetArn) || SAMPLE_ASSETS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Stepper Header */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0.85rem 1.25rem', background: 'var(--bg-surface-elevated)', 
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--color-sec-soft)', color: 'var(--color-sec)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Panacea PQC Scanner — Cryptographic Discovery &amp; CBOM Flow
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              35 AWS Collectors &bull; NIST 10-Class Taxonomy &bull; 6-Edge Dependency Graph &bull; CycloneDX 1.7 CBOM
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { num: 1, label: 'AWS Scope' },
            { num: 2, label: 'Live Discovery' },
            { num: 3, label: 'NIST Taxonomy' },
            { num: 4, label: 'Dependency Graph' },
            { num: 5, label: 'Coverage Gaps' },
            { num: 6, label: 'CycloneDX CBOM' }
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

      {/* STAGE 1: AWS SCOPE & COLLECTORS CONFIGURATION */}
      {stage === 1 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 1: Multi-Account AWS Scope &amp; 35 Read-Only Collectors
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Cross-Account sts:AssumeRole &bull; Partition-Correct ARNs (aws, aws-cn, aws-us-gov) &bull; Least-Privilege IAM Policy
              </div>
            </div>
            <span className="badge badge-sec" style={{ fontSize: '0.68rem' }}>42 AWS Service APIs</span>
          </div>

          {/* Accounts & Regions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Target AWS Accounts (sts:AssumeRole)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {selectedAccounts.map(acc => (
                  <div key={acc} style={{ padding: '0.35rem 0.6rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Cloud size={13} color="var(--color-sec)" />
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Scanning Regions (Multi-Region Parallel)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {selectedRegions.map(reg => (
                  <div key={reg} style={{ padding: '0.35rem 0.6rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Globe size={13} color="var(--color-sec)" />
                    <span>{reg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Collectors Catalog Breakdown */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              Active Cryptographic Collectors (35 Native Collectors across 42 APIs)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.45rem' }}>
              {[
                { name: 'KMS & Custom Key Stores', count: '48 Keys' },
                { name: 'ACM & Private CA Certs', count: '124 Certs' },
                { name: 'ELB & ALB/NLB Policies', count: '32 Listeners' },
                { name: 'CloudFront Distributions', count: '18 Edges' },
                { name: 'S3 Default Encryption', count: '286 Buckets' },
                { name: 'RDS Instances & Aurora', count: '24 Clusters' },
                { name: 'Secrets Manager Vaults', count: '94 Secrets' },
                { name: 'EKS Envelope Encryption', count: '6 Clusters' }
              ].map(c => (
                <div key={c.name} style={{ padding: '0.45rem 0.6rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                  <span style={{ color: 'var(--color-sec)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => {
                handleLaunchDiscovery();
                setStage(2);
              }}
              className="btn-sec"
            >
              <Play size={14} />
              <span>Launch Cryptographic Discovery Scan &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: LIVE DISCOVERY & INVENTORY STREAM */}
      {stage === 2 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 2: Live Discovery Execution &amp; Inventory Pipeline
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Thread-Safe Parallel Collectors &bull; Zero Decryption / Metadata-Only &bull; Auto Normalization
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="status-dot online" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-health)' }}>
                {scanning ? 'Collectors Enumerating Assets...' : 'Scan Finished (384 Assets Cataloged)'}
              </span>
            </div>
          </div>

          {/* Telemetry Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Discovered Assets</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-sec)', fontFamily: 'var(--font-mono)' }}>
                {discoveredCount}
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Collectors</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                35 / 35
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Coverage Gaps Logged</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#d97706', fontFamily: 'var(--font-mono)' }}>
                1 Permission Gap
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Elapsed Time</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                4.2s
              </div>
            </div>
          </div>

          {/* Sample Discovered Assets Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Asset Identifier / ARN</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Service</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Algorithm / Primitive</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>PQC Classification</th>
                  <th style={{ padding: '0.5rem 0.6rem' }}>Post-Quantum Status</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ASSETS.map(a => (
                  <tr key={a.arn} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.5rem 0.6rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {a.arn.split(':').slice(-1)[0]}
                    </td>
                    <td style={{ padding: '0.5rem 0.6rem', color: 'var(--text-secondary)' }}>{a.service}</td>
                    <td style={{ padding: '0.5rem 0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{a.algorithm}</td>
                    <td style={{ padding: '0.5rem 0.6rem' }}>
                      <span className="badge badge-sec" style={{ fontSize: '0.65rem' }}>{a.posture}</span>
                    </td>
                    <td style={{ padding: '0.5rem 0.6rem', fontWeight: 700, color: a.urgency.startsWith('CRITICAL') ? '#e11d48' : a.urgency.startsWith('COMPLIANT') ? 'var(--color-health)' : '#d97706' }}>
                      {a.urgency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(1)} className="btn-secondary">&larr; Back to Scope</button>
            <button type="button" onClick={() => setStage(3)} className="btn-sec">Evaluate NIST 10-Class Posture &rarr;</button>
          </div>
        </div>
      )}

      {/* STAGE 3: NIST 10-CLASS TAXONOMY & MOSCA RISK ENGINE */}
      {stage === 3 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 3: NIST IR 8105 Posture Taxonomy &amp; Mosca's Theorem
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Separates Shor-broken asymmetric crypto from Grover-weakened symmetric crypto &bull; QARS Score: {qarsScore}/100
              </div>
            </div>
            <span className="badge badge-sec" style={{ fontSize: '0.68rem' }}>NIST SP 800-57 Rev. 5</span>
          </div>

          {/* Interactive Mosca Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <span>Data Shelf-Life (X)</span>
                <span style={{ color: 'var(--color-sec)', fontFamily: 'var(--font-mono)' }}>{shelfLifeX} Years</span>
              </div>
              <input 
                type="range" min="1" max="30" value={shelfLifeX} 
                onChange={(e) => setShelfLifeX(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-sec)' }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Healthcare records, banking secrets, PII retention mandates</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <span>Migration Runway (Y)</span>
                <span style={{ color: 'var(--color-sec)', fontFamily: 'var(--font-mono)' }}>{migrationRunwayY} Years</span>
              </div>
              <input 
                type="range" min="1" max="10" value={migrationRunwayY} 
                onChange={(e) => setMigrationRunwayY(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-sec)' }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Time needed to re-architect KMS keys, PKI, and network gateways</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <span>Quantum Threat Horizon (Z)</span>
                <span style={{ color: 'var(--color-sec)', fontFamily: 'var(--font-mono)' }}>{collapseHorizonZ} Years</span>
              </div>
              <input 
                type="range" min="2" max="15" value={collapseHorizonZ} 
                onChange={(e) => setCollapseHorizonZ(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-sec)' }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Consensus Q-Day horizon (NIST estimate: ~2030-2033)</span>
            </div>
          </div>

          {/* Mosca Verdict Card */}
          <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', background: isBreached ? 'rgba(244, 63, 94, 0.08)' : 'var(--color-health-soft)', border: '1px solid ' + (isBreached ? 'rgba(244, 63, 94, 0.3)' : 'var(--color-health-border)'), display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isBreached ? '#e11d48' : 'var(--color-health)' }}>
                {isBreached ? 'CRITICAL HNDL EXPOSURE (Mosca Breach: X + Y > Z)' : 'Within Migration Safety Margin'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                {isBreached 
                  ? `Retention (${shelfLifeX} yrs) + Migration (${migrationRunwayY} yrs) = ${moscaSum} yrs, exceeding Q-Day (${collapseHorizonZ} yrs). Adversaries harvesting traffic today can decrypt it in the future!`
                  : `Total timeline (${moscaSum} yrs) is within the projected ${collapseHorizonZ} yr horizon. Immediate hybrid PQC deployment recommended.`
                }
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>QARS Risk Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: isBreached ? '#e11d48' : 'var(--color-health)', fontFamily: 'var(--font-mono)' }}>
                {qarsScore} / 100
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(2)} className="btn-secondary">&larr; Back to Discovery</button>
            <button type="button" onClick={() => setStage(4)} className="btn-sec">Inspect Dependency Graph &rarr;</button>
          </div>
        </div>
      )}

      {/* STAGE 4: CRYPTOGRAPHIC DEPENDENCY GRAPH & BLAST RADIUS */}
      {stage === 4 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 4: Cryptographic Dependency Graph (6 Edge Types)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Maps Key &rarr; Resource consumers &bull; Evaluates Blast Radius of Quantum Compromise
              </div>
            </div>
            <span className="badge badge-sec" style={{ fontSize: '0.68rem' }}>Graph Relational Mapping</span>
          </div>

          {/* Graph Visualizer Card */}
          <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={18} color="var(--color-sec)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Inspecting Root Asset: <span style={{ fontFamily: 'var(--font-mono)' }}>{activeAsset.arn.split('/').slice(-1)[0]}</span>
                </span>
              </div>

              <span className="badge badge-sec" style={{ fontSize: '0.65rem' }}>
                {activeAsset.algorithm}
              </span>
            </div>

            {/* Visual Dependency Nodes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Root Cryptographic Asset</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-sec)', marginTop: '0.25rem' }}>{activeAsset.service}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Posture: <strong>{activeAsset.posture}</strong></div>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Downstream Consumers</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{activeAsset.consumers}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Edge Type: <em>terminates-tls / encrypts-at-rest</em></div>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Blast Radius Impact</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e11d48', marginTop: '0.25rem' }}>4 Microservices Exposed</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>18,400 Active API Sessions / hr</div>
              </div>
            </div>

            <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              <strong>Remediation Recommendation:</strong> {activeAsset.remediation}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(3)} className="btn-secondary">&larr; Back to NIST Posture</button>
            <button type="button" onClick={() => setStage(5)} className="btn-sec">Review Honest Coverage Gaps &rarr;</button>
          </div>
        </div>
      )}

      {/* STAGE 5: HONEST COVERAGE GAPS & IAM ATTESTATION */}
      {stage === 5 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 5: Honest Coverage Reporting &amp; IAM Permissions Gap
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                No Silent Omissions &bull; Missing IAM Actions Named &bull; Anti-Deletion Invariant Active
              </div>
            </div>
            <span className="badge badge-health" style={{ fontSize: '0.68rem' }}>100% Truthful Reporting</span>
          </div>

          <div style={{ padding: '0.75rem 1rem', background: 'rgba(217, 119, 6, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(217, 119, 6, 0.25)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={18} color="#d97706" />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
              <strong>Honest Inventory Invariant:</strong> An inventory tool that silently omits resources converts an unknown into a false assurance. Scopes with incomplete permissions are never reconciled, protecting historical baseline inventory.
            </div>
          </div>

          {/* Coverage Gap Registry Card */}
          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Logged Coverage Gap #1 (Staging Account: 987654321098)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.72rem' }}>
              <div>
                <strong>Service Collector:</strong> AWS KMS (Key Metadata)
              </div>
              <div>
                <strong>Required IAM Action:</strong> <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-sec)', fontWeight: 700 }}>kms:DescribeKey</span>
              </div>
              <div>
                <strong>Scanner Behavior:</strong> Gap declared loud; existing asset preserved; no run abort.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(4)} className="btn-secondary">&larr; Back to Graph</button>
            <button type="button" onClick={() => setStage(6)} className="btn-sec">Export CycloneDX 1.7 CBOM &rarr;</button>
          </div>
        </div>
      )}

      {/* STAGE 6: CYCLONEDX 1.7 CBOM EXPORT */}
      {stage === 6 && (
        <div className="animate-fade-in" style={{ background: 'var(--bg-surface-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-sec)', letterSpacing: '0.05em' }}>
                Stage 6: CycloneDX 1.7 Cryptographic Bill of Materials (CBOM)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Compliant with White House NSM-10 &amp; OMB M-23-02 Mandates &bull; RFC 4514 / JSON Standard
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={handleCopyCBOM}
                className="btn-secondary"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
              >
                {copiedCBOM ? <Check size={13} color="var(--color-health)" /> : <Copy size={13} />}
                <span>{copiedCBOM ? 'Copied JSON' : 'Copy CBOM JSON'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDownloadedCBOM(true)}
                className="btn-sec"
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
              >
                <Download size={13} />
                <span>{downloadedCBOM ? 'CBOM File Saved' : 'Download .cbom.json'}</span>
              </button>
            </div>
          </div>

          {/* JSON CBOM Preview */}
          <pre style={{ 
            background: 'var(--bg-subtle)', 
            color: 'var(--text-primary)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: '0.72rem', 
            overflowX: 'auto',
            maxHeight: 260,
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.45
          }}>
            {JSON.stringify(sampleCBOM, null, 2)}
          </pre>

          {downloadedCBOM && (
            <div className="animate-fade-in" style={{ padding: '0.6rem 0.85rem', background: 'var(--color-health-soft)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-health-border)', fontSize: '0.72rem', color: 'var(--color-health)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <CheckCircle size={15} />
              <span>Exported: <strong>panacea_aws_estate_cbom_v1.7.json</strong> (Schema validated CycloneDX 1.7)</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button type="button" onClick={() => setStage(5)} className="btn-secondary">&larr; Back to Coverage</button>
            <button type="button" onClick={handleReset} className="btn-secondary">
              <RefreshCw size={13} />
              <span>Restart PQC Simulator</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
