import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldAlert, History, Activity } from 'lucide-react';
import Modal from '../common/Modal';
import { Package, Vulnerability, PackageStoreState } from '../../types';
import { apiClient } from '../../api/client';
import { usePackageStore } from '../../store/packageStore';

interface AuditModalProps {
  pkg: Package;
  onClose: () => void;
  onAddCVE: () => void;
}

export const AuditModal = ({ pkg, onClose, onAddCVE }: AuditModalProps) => {
  const [newVersion, setNewVersion] = useState('');
  const [cves, setCves] = useState<Vulnerability[]>([]);
  const fetchPackages = usePackageStore((state: PackageStoreState) => state.fetchPackages);

  useEffect(() => {
    fetchCVEs();
  }, [pkg]);

  const fetchCVEs = async () => {
    try {
      const { data } = await apiClient.get(`/api/v1/vulns/${pkg.name}`);
      setCves(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVersion = async () => {
    if (!newVersion) return;
    try {
      await apiClient.post('/api/v1/versions/', { package_id: pkg.id, version: newVersion });
      setNewVersion('');
      await fetchPackages();
    } catch (err) {
      alert("Error adding version");
    }
  };

  const handleDeleteVersion = async (id: number) => {
    if (!window.confirm("Delete this version?")) return;
    try {
      await apiClient.delete(`/api/v1/versions/${id}`);
      await fetchPackages();
    } catch (err) {
      alert("Failed to delete version");
    }
  };

  const handleDeleteCVE = async (id: number) => {
    if (!window.confirm("Remove this security record?")) return;
    try {
      await apiClient.delete(`/api/v1/vulns/${id}`);
      fetchCVEs();
      await fetchPackages();
    } catch (err) {
      alert("Failed to delete CVE");
    }
  };

  return (
    <Modal title={`Audit: ${pkg.name}`} onClose={onClose}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={14} /> Deployment Lifecycle
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Build version (e.g. 1.2.4)" 
            className="input-field mono"
            style={{ flex: 1 }} 
            value={newVersion} 
            onChange={e => setNewVersion(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddVersion} style={{ padding: '0 1.25rem' }}>
            <Plus size={20}/>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {pkg.versions.length > 0 ? pkg.versions.map(v => (
            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <span className="mono" style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>v{v.version}</span>
              <button onClick={() => handleDeleteVersion(v.id)} className="btn-danger" style={{ background: 'none', border: 'none', padding: '0.25rem', borderRadius: '6px' }}>
                <Trash2 size={16} />
              </button>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)', fontSize: '0.85rem', background: 'var(--surface-1)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              No deployment history recorded
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ color: '#f87171', fontSize: '0.75rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={16} /> Vulnerability Matrix
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {cves.length > 0 ? cves.map(cve => (
            <div key={cve.id} style={{ background: 'rgba(239, 68, 68, 0.03)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {cve.cve_id} 
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', fontSize: '0.65rem' }}>v{cve.version}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(239, 68, 68, 0.8)', marginTop: '0.3rem', fontWeight: 600 }}>
                  {cve.severity} Severity • {cve.cvss_score} CVSS Score
                </div>
              </div>
              <button onClick={() => handleDeleteCVE(cve.id)} className="btn-danger" style={{ background: 'none', border: 'none', padding: '0.35rem', borderRadius: '8px' }}>
                <Trash2 size={18} />
              </button>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--success)', fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '14px', border: '1px dashed rgba(16, 185, 129, 0.2)' }}>
              Security clear: No active threats found
            </div>
          )}
        </div>
        
        <button className="btn btn-primary" style={{ width: '100%', background: 'var(--danger)', boxShadow: '0 8px 20px -6px rgba(239, 68, 68, 0.4)', justifyContent: 'center' }} onClick={onAddCVE}>
          <ShieldAlert size={18} /> Report Security Incident
        </button>
      </div>
      
      <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Close Intelligence Report</button>
    </Modal>
  );
};

export default AuditModal;
