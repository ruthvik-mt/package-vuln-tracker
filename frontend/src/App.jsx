import React, { useState, useEffect } from 'react';
import { Package, ShieldAlert, Plus, LogOut, ChevronRight, AlertTriangle, ShieldCheck, X, Activity, Server, Database } from 'lucide-react';
import { api } from './services/api';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
    <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '500px', cursor: 'default' }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X /></button>
      </div>
      {children}
    </div>
  </div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [riskData, setRiskData] = useState({});
  
  // Modals
  const [showAddPkg, setShowAddPkg] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showAddCVE, setShowAddCVE] = useState(false);

  // Form States
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [newPkg, setNewPkg] = useState({ name: '', ecosystem: 'pypi' });
  const [newCVE, setNewCVE] = useState({ cve_id: '', description: '', severity: 'MEDIUM', cvss_score: 5.0, version: '' });
  const [newVersion, setNewVersion] = useState('');

  useEffect(() => {
    if (token) fetchPackages();
  }, [token]);

  const fetchPackages = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await api.getPackages();
      setPackages(data);
      
      const riskMap = {};
      const results = await Promise.allSettled(data.map(p => api.getRisk(p.name)));
      
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          riskMap[data[i].name] = result.value;
        } else {
          riskMap[data[i].name] = { risk_score: 0 };
        }
      });
      setRiskData(riskMap);
    } catch (err) {
      console.error(err);
      setError('System connection error. Ensure both microservices are online.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.login(username, password);
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
    } catch (err) {
      setError('Security Alert: Invalid credentials or connection refused.');
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      await api.addPackage(newPkg.name, newPkg.ecosystem);
      setShowAddPkg(false);
      setNewPkg({ name: '', ecosystem: 'pypi' });
      fetchPackages();
    } catch (err) {
      alert("Error adding package");
    }
  };

  const handleAddCVE = async (e) => {
    e.preventDefault();
    try {
      await api.addCVE({ ...newCVE, package_name: selectedPkg.name });
      setShowAddCVE(false);
      setNewCVE({ cve_id: '', description: '', severity: 'MEDIUM', cvss_score: 5.0 });
      fetchPackages();
    } catch (err) {
        alert(err.message);
    }
  };

  const handleAddVersion = async (e) => {
    e.preventDefault();
    try {
      await api.addVersion(selectedPkg.id, newVersion);
      setNewVersion('');
      fetchPackages();
    } catch (err) {
      alert("Error adding version");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="glass-card fade-in" style={{ width: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <ShieldAlert size={40} color="var(--primary)" />
            <div>
              <h1 style={{ fontSize: '1.25rem' }}>Security Protocol</h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vulnerability Management System v1.0</p>
            </div>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Service Identity</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            </div>
            <div className="input-group">
              <label>Clearance Code</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            </div>
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</p>}
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Initialize Connection</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <Activity size={18} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Live Telemetry</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Security Dashboard</h1>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Server size={14} /> Nodes Online: 2
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Database size={14} /> Instances: 2
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={fetchPackages} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>Refresh Feed</button>
            <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <LogOut size={18} /> Disconnect
            </button>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {packages.map(pkg => {
          const risk = riskData[pkg.name] || { risk_score: 0 };
          const isHighRisk = risk.risk_score > 4;
          
          return (
            <div key={pkg.id} className="glass-card fade-in" style={{ cursor: 'pointer' }} onClick={() => setSelectedPkg(pkg)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '10px' }}>
                    <Package size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{pkg.name}</h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{pkg.ecosystem}</span>
                  </div>
                </div>
                <div style={{ 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '12px', 
                  background: isHighRisk ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: isHighRisk ? 'var(--danger)' : 'var(--success)',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {risk.risk_score.toFixed(1)} SCORE
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {pkg.versions.length > 0 ? pkg.versions.slice(0, 3).map(v => (
                  <span key={v.id} style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.7rem' }}>
                    v{v.version}
                  </span>
                )) : <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No versions tracked</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: isHighRisk ? 'var(--warning)' : 'var(--success)', fontSize: '0.75rem', fontWeight: 600 }}>
                {isHighRisk ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                <span>{isHighRisk ? 'CRITICAL VULNERABILITIES' : 'NO THREATS DETECTED'}</span>
                <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </div>
            </div>
          );
        })}

        <div 
          className="glass-card fade-in" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', cursor: 'pointer', opacity: 0.7 }}
          onClick={() => setShowAddPkg(true)}
        >
          <Plus size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Track New Asset</p>
        </div>
      </main>

      {/* Add Package Modal */}
      {showAddPkg && (
        <Modal title="Register New Asset" onClose={() => setShowAddPkg(false)}>
          <form onSubmit={handleAddPackage}>
            <div className="input-group">
              <label>Asset Name</label>
              <input type="text" placeholder="e.g. react" required value={newPkg.name} onChange={e => setNewPkg({...newPkg, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Ecosystem</label>
              <select value={newPkg.ecosystem} onChange={e => setNewPkg({...newPkg, ecosystem: e.target.value})}>
                <option value="pypi">PyPI</option>
                <option value="npm">NPM</option>
                <option value="maven">Maven</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Confirm Registration</button>
          </form>
        </Modal>
      )}

      {/* Package Detail Modal */}
      {selectedPkg && !showAddCVE && (
        <Modal title={`Asset Audit: ${selectedPkg.name}`} onClose={() => setSelectedPkg(null)}>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Version Control</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                placeholder="v1.0.0" 
                style={{ flex: 1, padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} 
                value={newVersion} 
                onChange={e => setNewVersion(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAddVersion}><Plus size={16}/></button>
            </div>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} /> SECURITY VULNERABILITIES
            </h4>
            <button className="btn btn-primary" style={{ width: '100%', background: 'var(--danger)', boxShadow: 'none' }} onClick={() => setShowAddCVE(true)}>
              Record Security Incident (CVE)
            </button>
          </div>
          <button className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', justifyContent: 'center' }} onClick={() => setSelectedPkg(null)}>Close Audit</button>
        </Modal>
      )}

      {/* Add CVE Modal */}
      {showAddCVE && (
        <Modal title={`Report Vulnerability: ${selectedPkg.name}`} onClose={() => setShowAddCVE(false)}>
           <form onSubmit={handleAddCVE}>
            <div className="input-group">
              <label>CVE Identifier</label>
              <input type="text" placeholder="CVE-2024-XXXX" required value={newCVE.cve_id} onChange={e => setNewCVE({...newCVE, cve_id: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Affected Version</label>
              <select value={newCVE.version} onChange={e => setNewCVE({...newCVE, version: e.target.value})} required>
                <option value="">Select Version</option>
                {selectedPkg.versions.map(v => (
                  <option key={v.id} value={v.version}>{v.version}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Security Impact (CVSS)</label>
              <input type="number" step="0.1" min="0" max="10" value={newCVE.cvss_score} onChange={e => setNewCVE({...newCVE, cvss_score: parseFloat(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Severity Level</label>
              <select value={newCVE.severity} onChange={e => setNewCVE({...newCVE, severity: e.target.value})}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div className="input-group">
                <label>Description</label>
                <textarea 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', padding: '0.75rem', minHeight: '80px' }}
                    value={newCVE.description}
                    onChange={e => setNewCVE({...newCVE, description: e.target.value})}
                />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', background: 'var(--danger)', justifyContent: 'center' }}>Submit Incident Report</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default App;
