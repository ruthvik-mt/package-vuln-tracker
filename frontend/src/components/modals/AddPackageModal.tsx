import React, { useState } from 'react';
import Modal from '../common/Modal';
import { apiClient } from '../../api/client';
import { usePackageStore } from '../../store/packageStore';
import { PackageStoreState } from '../../types';
import { Box, Globe, Shield } from 'lucide-react';

interface AddPackageModalProps {
  onClose: () => void;
}

export const AddPackageModal = ({ onClose }: AddPackageModalProps) => {
  const [name, setName] = useState('');
  const [ecosystem, setEcosystem] = useState('pypi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchPackages = usePackageStore((state: PackageStoreState) => state.fetchPackages);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/packages/', { name, ecosystem });
      await fetchPackages();
      onClose();
    } catch (err) {
      alert("Error adding package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Asset Registration" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>
            <Box size={14} /> Unique Identifier
          </label>
          <input 
            type="text" 
            placeholder="e.g. enterprise-core-service" 
            className="input-field"
            required 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
        
        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>
            <Globe size={14} /> Ecosystem Context
          </label>
          <div style={{ position: 'relative' }}>
            <select 
              value={ecosystem} 
              onChange={e => setEcosystem(e.target.value)}
              className="input-field"
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="pypi">PyPI (Python Foundation)</option>
              <option value="npm">NPM (Node Package Manager)</option>
              <option value="maven">Maven (Apache Software Foundation)</option>
            </select>
            <div style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}>
              ▼
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
        >
          {isSubmitting ? 'Initializing Tracker...' : 'Initialize Asset Tracking'}
        </button>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <Shield size={20} color="var(--primary)" />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Registered assets are automatically monitored for zero-day vulnerabilities across global databases.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AddPackageModal;
