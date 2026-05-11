import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Terminal, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/client';
import { AuthState } from '../../types';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((state: AuthState) => state.setToken);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const { data } = await apiClient.post('/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToken(data.access_token);
    } catch (err) {
      setError('AUTHENTICATION_FAILURE: Access denied by security controller.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)'
    }}>
      <div className="glass-panel fade-in" style={{ width: '440px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            display: 'inline-flex', background: 'var(--primary-glow)', padding: '1rem', 
            borderRadius: '20px', marginBottom: '1.5rem', border: '1px solid var(--border-bright)'
          }}>
            <ShieldCheck size={48} color="white" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-1px' }}>Security Protocol</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem', fontWeight: 500, letterSpacing: '0.5px' }}>
            Vulnerability Management Console <span className="mono" style={{ color: 'var(--primary)' }}>v2.4.0</span>
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>
              <User size={14} /> Service Identity
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="system-admin"
                style={{ paddingLeft: '3rem' }}
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
              />
              <Terminal size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>
              <Lock size={14} /> Clearance Code
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••••••"
                style={{ paddingLeft: '3rem' }}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <ShieldCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            </div>
          </div>

          {error && (
            <div style={{ 
              display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'rgba(239, 68, 68, 0.08)', 
              color: 'var(--danger)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)',
              marginBottom: '2rem', fontSize: '0.85rem', fontWeight: 600
            }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '1.1rem', fontSize: '1rem' }}
          >
            {isLoading ? 'Decrypting Access...' : 'Initialize Connection'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>
            Authorized Personnel Only. All activities are <span style={{ color: 'var(--warning)', fontWeight: 700 }}>Logged</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
