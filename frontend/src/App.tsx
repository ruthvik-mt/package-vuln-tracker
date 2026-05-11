import React, { useEffect, useState } from 'react';
import { Plus, LogOut, Activity, Server, Database, RotateCw } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { usePackageStore } from './store/packageStore';
import { LoginForm } from './components/dashboard/LoginForm';
import PackageCard from './components/dashboard/PackageCard';
import { AddPackageModal } from './components/modals/AddPackageModal';
import { AuditModal } from './components/modals/AuditModal';
import { AddCVEModal } from './components/modals/AddCVEModal';
import { Package, AuthState, PackageStoreState } from './types';

const App: React.FC = () => {
  const token = useAuthStore((state: AuthState) => state.token);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const { packages, riskData, fetchPackages, deletePackage } = usePackageStore((state: PackageStoreState) => ({
    packages: state.packages,
    riskData: state.riskData,
    fetchPackages: state.fetchPackages,
    deletePackage: state.deletePackage
  }));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState<number | null>(null);
  const [showAddPkg, setShowAddPkg] = useState(false);
  const [showAddCVE, setShowAddCVE] = useState(false);
  const selectedPkg = packages.find(p => p.id === selectedPkgId) || null;

  useEffect(() => {
    if (token) fetchPackages();
  }, [token]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPackages();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (!token) {
    return <LoginForm />;
  }

  return (
    <div className="dashboard-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5rem', position: 'relative' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <Activity size={18} color="white" />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary)' }}>Security Core V1.0</span>
          </div>
          <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '1rem' }}>Security Dashboard</h1>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 500 }}>
              <Server size={16} /> Cluster Nodes: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Active (2)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 500 }}>
              <Database size={16} /> Data Pools: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Synchronized</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <button onClick={handleRefresh} className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
              <RotateCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              Synchronize
            </button>
            <div style={{ width: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />
            <button onClick={logout} className="btn btn-danger" style={{ fontSize: '0.85rem' }}>
              <LogOut size={18} /> Disconnect
            </button>
        </div>
      </header>

      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Tracked Assets <span style={{ color: 'var(--text-dim)', fontSize: '1rem', fontWeight: 400, marginLeft: '0.5rem' }}>({packages.length})</span></h2>
        <button onClick={() => setShowAddPkg(true)} className="btn btn-primary">
          <Plus size={20} /> Deploy New Tracker
        </button>
      </div>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
        {packages.map(pkg => (
          <PackageCard 
            key={pkg.id} 
            pkg={pkg} 
            risk={riskData[pkg.name]} 
            onClick={() => setSelectedPkgId(pkg.id)}
            onDelete={(e) => {
              e.stopPropagation();
              if (window.confirm(`Permanently delete ${pkg.name}?`)) {
                deletePackage(pkg.id, pkg.name);
              }
            }}
          />
        ))}

        <div 
          className="glass-panel fade-in" 
          style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            borderStyle: 'dashed', cursor: 'pointer', opacity: 0.5, minHeight: '200px',
            background: 'transparent'
          }}
          onClick={() => setShowAddPkg(true)}
        >
          <div style={{ background: 'var(--surface-1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', border: '1px dashed var(--border)' }}>
            <Plus size={32} color="var(--text-dim)" />
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Initialize New Asset</p>
        </div>
      </main>
      
      {showAddPkg && <AddPackageModal onClose={() => setShowAddPkg(false)} />}
      
      {selectedPkg && !showAddCVE && (
        <AuditModal 
          pkg={selectedPkg} 
          onClose={() => setSelectedPkgId(null)} 
          onAddCVE={() => setShowAddCVE(true)} 
        />
      )}

      {selectedPkg && showAddCVE && (
        <AddCVEModal 
          pkg={selectedPkg} 
          onClose={() => setShowAddCVE(false)} 
          onSuccess={() => setShowAddCVE(false)} 
        />
      )}
    </div>
  );
};

export default App;
