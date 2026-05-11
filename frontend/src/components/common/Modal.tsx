import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div 
    style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      zIndex: 1000, padding: '1rem' 
    }}
    onClick={onClose}
  >
    <div 
      className="glass-panel" 
      style={{ 
        width: '100%', maxWidth: '550px', cursor: 'default', minHeight: '500px',
        maxHeight: '95vh', overflowY: 'auto', padding: '2.5rem', 
        border: '1px solid var(--border-bright)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
        animation: 'modalEnter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }} 
      onClick={e => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{title}</h2>
        <button 
          onClick={onClose} 
          style={{ 
            background: 'var(--surface-1)', border: '1px solid var(--border)', 
            color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem',
            borderRadius: '10px', display: 'flex', transition: 'all 0.2s'
          }}
          className="hover-bright"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
