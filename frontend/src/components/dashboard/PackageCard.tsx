import React from 'react';
import { Package as PackageIcon, Trash2, AlertTriangle, ShieldCheck, ChevronRight, Hash, Layers } from 'lucide-react';
import { Package, RiskData } from '../../types';

interface PackageCardProps {
  pkg: Package;
  risk?: RiskData;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, risk, onClick, onDelete }) => {
  const riskScore = risk?.risk_score || 0;
  const isHighRisk = riskScore > 4;
  const vulnerabilityCount = risk?.vulnerability_count || 0;

  return (
    <div className="glass-panel fade-in" style={{ cursor: 'pointer', position: 'relative', padding: '1.75rem', overflow: 'hidden' }} onClick={onClick}>
      {/* Decorative Gradient Background */}
      <div style={{ 
        position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', 
        background: isHighRisk ? 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <button 
        onClick={onDelete}
        style={{ 
          position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', padding: '0.35rem', 
          borderRadius: '6px', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s'
        }}
        className="hover-bright"
      >
        <Trash2 size={12} />
      </button>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)', 
              padding: '0.75rem', borderRadius: '14px', border: '1px solid var(--border)' 
            }}>
              <PackageIcon size={24} color="var(--primary)" />
            </div>
            <div>
              <h3 className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>{pkg.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                  {pkg.ecosystem}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Hash size={10} /> ID: {pkg.id}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '0.75rem' }}>
            <div style={{ 
              padding: '0.4rem 0.9rem', 
              borderRadius: '12px', 
              background: isHighRisk ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isHighRisk ? '#f87171' : '#34d399',
              fontSize: '0.8rem',
              fontWeight: 800,
              border: `1px solid ${isHighRisk ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
            }}>
              {riskScore.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 700, marginTop: '0.3rem', textTransform: 'uppercase' }}>
              Risk Index
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flex: 1, flexWrap: 'wrap' }}>
            {pkg.versions.length > 0 ? pkg.versions.slice(0, 2).map(v => (
              <div key={v.id} className="mono" style={{ padding: '0.3rem 0.6rem', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {v.version.startsWith('v') ? v.version : `v${v.version}`}
              </div>
            )) : <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No deployment history</span>}
            {pkg.versions.length > 2 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', padding: '0.3rem 0.2rem' }}>+{pkg.versions.length - 2} more</div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: vulnerabilityCount > 0 ? 'var(--danger)' : 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 600 }}>
            <Layers size={14} /> {vulnerabilityCount} CVE
          </div>
        </div>

        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '1.25rem', 
          borderTop: '1px solid var(--border)', color: isHighRisk ? 'var(--warning)' : 'var(--success)', 
          fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' 
        }}>
          {isHighRisk ? <AlertTriangle size={16} className="animate-pulse" /> : <ShieldCheck size={16} />}
          <span style={{ textTransform: 'uppercase' }}>{isHighRisk ? 'Critical Vulnerabilities' : 'Security Clearance: Verified'}</span>
          <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
