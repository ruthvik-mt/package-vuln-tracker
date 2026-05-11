import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Package, PackageStoreState } from '../../types';
import { apiClient } from '../../api/client';
import { usePackageStore } from '../../store/packageStore';
import { ShieldAlert, Fingerprint, Activity, FileText } from 'lucide-react';

interface AddCVEModalProps {
  pkg: Package;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCVEModal = ({ pkg, onClose, onSuccess }: AddCVEModalProps) => {
  const [cveId, setCveId] = useState('');
  const [version, setVersion] = useState('');
  const [cvssScore, setCvssScore] = useState(5.0);
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchPackages = usePackageStore((state: PackageStoreState) => state.fetchPackages);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/vulns/', {
        cve_id: cveId,
        package_name: pkg.name,
        version,
        cvss_score: cvssScore,
        severity,
        description
      });
      await fetchPackages();
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error reporting CVE");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={`Incident Report: ${pkg.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              <Fingerprint size={12} /> CVE Identifier
            </label>
            <input 
              type="text" 
              placeholder="CVE-2024-XXXX" 
              className="input-field mono"
              required 
              value={cveId} 
              onChange={(e) => setCveId(e.target.value)} 
            />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              <Activity size={12} /> Target Version
            </label>
            <select 
              value={version} 
              className="input-field mono"
              onChange={(e) => setVersion(e.target.value)} 
              required
            >
              <option value="">Select Target</option>
              {pkg.versions.map(v => (
                <option key={v.id} value={v.version}>{v.version}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              CVSS Score (0-10)
            </label>
            <input 
              type="number" 
              step="0.1" 
              min="0" 
              max="10" 
              className="input-field"
              value={cvssScore} 
              onChange={(e) => setCvssScore(parseFloat(e.target.value))} 
            />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Risk Severity
            </label>
            <select 
              value={severity} 
              className="input-field"
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM (Standard)</option>
              <option value="HIGH">HIGH (Escalate)</option>
              <option value="CRITICAL">CRITICAL (Emergency)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              <FileText size={12} /> Intelligence Summary
            </label>
            <textarea 
                className="input-field"
                style={{ minHeight: '100px', resize: 'vertical' }}
                placeholder="Detail the attack vector and mitigation steps..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        <button 
          className="btn btn-primary" 
          disabled={isSubmitting}
          style={{ width: '100%', background: 'var(--danger)', boxShadow: '0 8px 20px -6px rgba(239, 68, 68, 0.4)', justifyContent: 'center', padding: '1rem' }}
        >
          <ShieldAlert size={18} /> {isSubmitting ? 'Transmitting Data...' : 'Submit Intelligence Report'}
        </button>
      </form>
    </Modal>
  );
};

export default AddCVEModal;
