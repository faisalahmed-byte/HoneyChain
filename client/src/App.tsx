import React, { useState, useEffect } from 'react';
import type { UserRole, DashboardData, BeekeeperProfile } from './types';
import { apiFetch } from './apiFetch';
import { Sidebar } from './components/Sidebar';
import { TopHeader, INITIAL_BEEKEEPERS } from './components/TopHeader';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { BatchCreateView } from './components/BatchCreateView';
import { TraceabilityView } from './components/TraceabilityView';
import { BlockchainLedgerView } from './components/BlockchainLedgerView';
import { QualityInspectionView } from './components/QualityInspectionView';
import { ProcessingView } from './components/ProcessingView';
import { DistributionView } from './components/DistributionView';
import { ConsumerVerificationView } from './components/ConsumerVerificationView';
import { SmartBeekeepingView } from './components/SmartBeekeepingView';
import { AnalyticsView } from './components/AnalyticsView';
import { TamperDemoView } from './components/TamperDemoView';
import { ArchitectureView } from './components/ArchitectureView';
import { MarketplaceView } from './components/MarketplaceView';
import { ProfileView } from './components/ProfileView';
import { AlertsView } from './components/AlertsView';
import { QrManagementView } from './components/QrManagementView';
import { DatabaseOutputView } from './components/DatabaseOutputView';
import { LoginModal } from './components/LoginModal';
import { LayoutGrid, Cpu, Package, QrCode, Menu } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Beekeeper');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('HC-TG-2026-001');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginSuccess = (role: UserRole, user: { id: string; name: string }, _loginType: 'ADMIN' | 'USER') => {
    setUserRole(role);
    if (role === 'Beekeeper') {
      const existing = beekeepers.find(b => b.id === user.id || b.name === user.name);
      if (existing) {
        setActiveBeekeeperId(existing.id);
      }
      setCurrentTab('dashboard');
    } else if (role === 'Admin') {
      setCurrentTab('database');
    } else {
      setCurrentTab('dashboard');
    }
  };

  // Beekeeper Account Management
  const [beekeepers, setBeekeepers] = useState<BeekeeperProfile[]>(() => {
    const saved = localStorage.getItem('hc_beekeepers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BEEKEEPERS;
  });

  const [activeBeekeeperId, setActiveBeekeeperId] = useState<string>(() => {
    return localStorage.getItem('hc_active_beekeeper_id') || 'BK-001';
  });

  useEffect(() => {
    localStorage.setItem('hc_beekeepers', JSON.stringify(beekeepers));
  }, [beekeepers]);

  useEffect(() => {
    localStorage.setItem('hc_active_beekeeper_id', activeBeekeeperId);
  }, [activeBeekeeperId]);

  const activeBeekeeper = beekeepers.find(b => b.id === activeBeekeeperId) || beekeepers[0];

  const handleSelectBeekeeper = (id: string) => {
    setActiveBeekeeperId(id);
    setUserRole('Beekeeper');
  };

  const handleUpdateBeekeeper = (updated: BeekeeperProfile) => {
    setBeekeepers(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleCreateBeekeeper = (newProfileData: Omit<BeekeeperProfile, 'id' | 'initials'>) => {
    const initials = newProfileData.name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'BK';

    const newId = `BK-${String(beekeepers.length + 1).padStart(3, '0')}`;
    const newProfile: BeekeeperProfile = {
      ...newProfileData,
      id: newId,
      initials,
      roleLabel: 'Beekeeper'
    };

    setBeekeepers(prev => [...prev, newProfile]);
    setActiveBeekeeperId(newId);
    setUserRole('Beekeeper');
  };

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [currentTab, activeBeekeeperId, userRole]);

  // Handle URL path e.g. /verify/HC-TG-2026-001
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/verify/')) {
      const parts = path.split('/verify/');
      if (parts[1]) {
        setSelectedBatchId(parts[1]);
        setUserRole('Consumer');
        setCurrentTab('verify');
      }
    }
  }, []);

  const fetchDashboard = async () => {
    setDashboardLoading(true);
    try {
      const q = (userRole === 'Beekeeper' && activeBeekeeper) 
        ? `?beekeeper=${encodeURIComponent(activeBeekeeper.name)}&location=${encodeURIComponent(activeBeekeeper.location)}` 
        : '';
      const res = await apiFetch(`/api/dashboard${q}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (e) {
      console.error('Error fetching dashboard:', e);
    } finally {
      setDashboardLoading(false);
    }
  };

  const activeAlertsCount = dashboardData?.activeAlerts ? dashboardData.activeAlerts.length : 5;

  // Standalone Landing Page View
  if (currentTab === 'landing') {
    return (
      <LandingPage onNavigate={setCurrentTab} />
    );
  }

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-slate-50 flex font-sans text-slate-800 antialiased selection:bg-amber-200 selection:text-amber-900">
      
      {/* Left Sidebar (Desktop side-by-side & Mobile Off-canvas Drawer) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        unreadAlertsCount={activeAlertsCount}
        activeBeekeeper={activeBeekeeper}
        beekeepers={beekeepers}
        onSelectBeekeeper={handleSelectBeekeeper}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* Top Header Bar */}
        <TopHeader
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          userRole={userRole}
          unreadAlertsCount={activeAlertsCount}
          activeBeekeeper={activeBeekeeper}
          beekeepers={beekeepers}
          onSelectBeekeeper={handleSelectBeekeeper}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          onSearchSelect={(type, id) => {
            if (type === 'batch') {
              setSelectedBatchId(id);
              setCurrentTab('traceability');
            } else if (type === 'hive') {
              setCurrentTab('beekeeping');
            } else if (type === 'alert') {
              setCurrentTab('alerts');
            }
          }}
        />

        {/* Dynamic Route Content */}
        <main className={`flex-1 overflow-y-auto ${currentTab === 'verify' ? 'p-0' : 'p-3 sm:p-6 lg:p-8'} pb-20 lg:pb-6`}>
          
          {currentTab === 'verify' && (
            <ConsumerVerificationView
              batchId={selectedBatchId}
              onNavigate={(tab) => {
                if (tab === 'dashboard' && userRole === 'Consumer') {
                  setUserRole('Beekeeper');
                }
                setCurrentTab(tab);
              }}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardView
              data={dashboardData}
              loading={dashboardLoading}
              onRefresh={fetchDashboard}
              onNavigate={setCurrentTab}
              activeBeekeeper={activeBeekeeper}
              userRole={userRole}
            />
          )}

          {currentTab === 'beekeeping' && (
            <SmartBeekeepingView activeBeekeeper={activeBeekeeper} />
          )}

          {currentTab === 'alerts' && (
            <AlertsView onNavigate={setCurrentTab} activeBeekeeper={activeBeekeeper} />
          )}

          {currentTab === 'qr' && (
            <QrManagementView onNavigate={(tab, batchId) => {
              if (batchId) setSelectedBatchId(batchId);
              setCurrentTab(tab);
            }} />
          )}

          {currentTab === 'batches' && (
            <BatchCreateView
              onSuccess={(id) => {
                setSelectedBatchId(id);
                fetchDashboard();
              }}
              onNavigate={setCurrentTab}
              activeBeekeeper={activeBeekeeper}
            />
          )}

          {currentTab === 'traceability' && (
            <TraceabilityView
              selectedBatchId={selectedBatchId}
              onSelectBatch={setSelectedBatchId}
              onNavigate={setCurrentTab}
              activeBeekeeper={activeBeekeeper}
            />
          )}

          {currentTab === 'blockchain' && (
            <BlockchainLedgerView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'quality' && (
            <QualityInspectionView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'processing' && (
            <ProcessingView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'distribution' && (
            <DistributionView onNavigate={setCurrentTab} />
          )}

          {currentTab === 'marketplace' && (
            <MarketplaceView onNavigate={(tab, batchId) => {
              if (batchId) setSelectedBatchId(batchId);
              setCurrentTab(tab);
            }} />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              onNavigate={setCurrentTab}
              activeBeekeeper={activeBeekeeper}
              beekeepersList={beekeepers}
              onSelectBeekeeper={handleSelectBeekeeper}
              onUpdateBeekeeper={handleUpdateBeekeeper}
              onCreateBeekeeper={handleCreateBeekeeper}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView />
          )}

          {currentTab === 'database' && (
            <DatabaseOutputView />
          )}

          {currentTab === 'tamper' && (
            <TamperDemoView />
          )}

          {currentTab === 'architecture' && (
            <ArchitectureView />
          )}
        </main>

        {/* Global SaaS Footer (Desktop) */}
        <footer className="bg-white border-t border-slate-200/80 py-3 px-6 text-xs text-slate-500 hidden lg:flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-amber-900 font-mono">HONEY CHAIN SaaS</span>
            <span>•</span>
            <span>Trusted honey, traceable from hive to home</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Cryptographic SHA-256 Ledger
          </div>
        </footer>

        {/* Mobile Bottom Navigation Bar (Smartphones & Tablets < lg) */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c18]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 flex items-center justify-around select-none shadow-[0_-4px_20px_rgba(0,0,0,0.35)]"
          aria-label="Mobile Navigation"
        >
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
              currentTab === 'dashboard'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Overview</span>
          </button>

          <button
            onClick={() => setCurrentTab('beekeeping')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
              currentTab === 'beekeeping'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <Cpu className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">IoT Hives</span>
          </button>

          <button
            onClick={() => setCurrentTab('batches')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
              currentTab === 'batches'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Batches</span>
          </button>

          <button
            onClick={() => setCurrentTab('verify')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
              currentTab === 'verify'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <QrCode className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Passport</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl text-slate-400 hover:text-amber-400 transition-all font-medium relative"
            title="All Modules & Role Scope"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
            {activeAlertsCount > 0 && (
              <span className="absolute top-1 right-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#070c18]" />
            )}
          </button>
        </nav>
      </div>

      {/* Global Session & Auth Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        beekeepers={beekeepers}
      />

    </div>
  );
};

export default App;
