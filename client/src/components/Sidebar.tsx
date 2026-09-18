import React, { useState } from 'react';
import type { UserRole, BeekeeperProfile } from '../types';
import { USER_PROFILES } from './TopHeader';
import { 
  Hexagon, LayoutGrid, Cpu, Bell, QrCode, Package, 
  Search, Link, FlaskConical, Factory, Truck, ShoppingBag, 
  BarChart2, ShieldAlert, User, Layers, ChevronLeft, ChevronRight,
  UserCheck, Database, LogIn, Shield, Sparkles, ChevronDown, X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  unreadAlertsCount?: number;
  activeBeekeeper?: BeekeeperProfile;
  beekeepers?: BeekeeperProfile[];
  onSelectBeekeeper?: (id: string) => void;
  onOpenLoginModal?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface RoleScopeConfig {
  role: UserRole;
  scopeBadge: string;
  badgeStyle: string;
  title: string;
  subtitle: string;
  cardBg: string;
  cardBorder: string;
  shieldColor: string;
  primaryTab: string;
  modules: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  unreadAlertsCount = 0,
  activeBeekeeper,
  beekeepers,
  onSelectBeekeeper,
  onOpenLoginModal,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [extendedAdminOpen, setExtendedAdminOpen] = useState(false);

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    onCloseMobile?.();
  };

  // Role Configuration matching exact screenshots and scope definitions
  const roleConfigs: Record<UserRole, RoleScopeConfig> = {
    // 1. Apiary Owner (Beekeeper) - 6 Modules Authorized (Image 2)
    Beekeeper: {
      role: 'Beekeeper',
      scopeBadge: 'APIARY SCOPED',
      badgeStyle: 'bg-[#062820] text-emerald-400 border border-emerald-500/30',
      title: 'Apiary Owner',
      subtitle: '6 Modules Authorized',
      cardBg: 'bg-[#041c17]/80',
      cardBorder: 'border-emerald-500/30',
      shieldColor: 'text-emerald-400',
      primaryTab: 'dashboard',
      modules: [
        { id: 'dashboard', label: 'Overview & Apiary Map', icon: LayoutGrid },
        { id: 'beekeeping', label: 'Smart Hive IoT Console', icon: Cpu },
        { id: 'batches', label: 'Honey Batch Registry', icon: Package },
        { id: 'blockchain', label: 'SHA-256 Ledger Explorer', icon: Link },
        { id: 'alerts', label: 'AI Hive Anomaly Insights', icon: Sparkles },
        { id: 'verify', label: 'Consumer Passport View', icon: QrCode },
      ]
    },

    // 2. QA & Bottling Operator (Processor) - 6 Modules Authorized (Image 3)
    Processor: {
      role: 'Processor',
      scopeBadge: 'FACILITY SCOPED',
      badgeStyle: 'bg-[#0c2438] text-sky-400 border border-sky-500/30',
      title: 'QA & Bottling Operator',
      subtitle: '6 Modules Authorized',
      cardBg: 'bg-[#071929]/80',
      cardBorder: 'border-sky-500/30',
      shieldColor: 'text-sky-400',
      primaryTab: 'dashboard',
      modules: [
        { id: 'dashboard', label: 'Overview & Apiary Map', icon: LayoutGrid },
        { id: 'batches', label: 'Honey Batch Registry', icon: Package },
        { id: 'quality', label: 'Quality Testing Lab', icon: FlaskConical },
        { id: 'processing', label: 'Processing & Bottling', icon: Factory },
        { id: 'blockchain', label: 'SHA-256 Ledger Explorer', icon: Link },
        { id: 'verify', label: 'Consumer Passport View', icon: QrCode },
      ]
    },

    // 3. Consumer Passport (Consumer) - 1 Modules Authorized (Image 4)
    Consumer: {
      role: 'Consumer',
      scopeBadge: 'PUBLIC ACCESS',
      badgeStyle: 'bg-[#25123d] text-purple-300 border border-purple-500/30',
      title: 'Consumer Passport',
      subtitle: '1 Modules Authorized',
      cardBg: 'bg-[#150a26]/80',
      cardBorder: 'border-purple-500/30',
      shieldColor: 'text-purple-400',
      primaryTab: 'verify',
      modules: [
        { id: 'verify', label: 'Consumer Passport View', icon: QrCode },
      ]
    },

    // 4. System Administrator (Admin) - 8 Modules Authorized (Image 1)
    Admin: {
      role: 'Admin',
      scopeBadge: 'SYSTEM SCOPED',
      badgeStyle: 'bg-[#2b1c06] text-amber-400 border border-amber-500/30',
      title: 'System Administrator',
      subtitle: '8 Modules Authorized',
      cardBg: 'bg-[#191004]/80',
      cardBorder: 'border-amber-500/30',
      shieldColor: 'text-amber-400',
      primaryTab: 'dashboard',
      modules: [
        { id: 'dashboard', label: 'Overview & Apiary Map', icon: LayoutGrid },
        { id: 'beekeeping', label: 'Smart Hive IoT Console', icon: Cpu },
        { id: 'batches', label: 'Honey Batch Registry', icon: Package },
        { id: 'quality', label: 'Quality Testing Lab', icon: FlaskConical },
        { id: 'processing', label: 'Processing & Bottling', icon: Factory },
        { id: 'blockchain', label: 'SHA-256 Ledger Explorer', icon: Link },
        { id: 'alerts', label: 'AI Hive Anomaly Insights', icon: Sparkles },
        { id: 'verify', label: 'Consumer Passport View', icon: QrCode },
      ]
    },

    // 5. Logistics Operator (Distributor) - 5 Modules Authorized
    Distributor: {
      role: 'Distributor',
      scopeBadge: 'LOGISTICS SCOPED',
      badgeStyle: 'bg-[#0e2142] text-blue-400 border border-blue-500/30',
      title: 'Logistics Operator',
      subtitle: '5 Modules Authorized',
      cardBg: 'bg-[#071329]/80',
      cardBorder: 'border-blue-500/30',
      shieldColor: 'text-blue-400',
      primaryTab: 'dashboard',
      modules: [
        { id: 'dashboard', label: 'Overview & Apiary Map', icon: LayoutGrid },
        { id: 'batches', label: 'Honey Batch Registry', icon: Package },
        { id: 'distribution', label: 'Cold-Chain Logistics', icon: Truck },
        { id: 'blockchain', label: 'SHA-256 Ledger Explorer', icon: Link },
        { id: 'verify', label: 'Consumer Passport View', icon: QrCode },
      ]
    }
  };

  const currentConfig = roleConfigs[userRole] || roleConfigs.Admin;

  // Extended utilities for Admin
  const adminExtendedModules = [
    { id: 'traceability', label: 'Batch Journey Explorer', icon: Search },
    { id: 'qr', label: 'QR Label Generator', icon: QrCode },
    { id: 'marketplace', label: 'Verified Honey Marketplace', icon: ShoppingBag },
    { id: 'tamper', label: 'Tamper Simulation Lab', icon: ShieldAlert },
    { id: 'database', label: 'Database Records Output', icon: Database },
    { id: 'analytics', label: 'National Analytics', icon: BarChart2 },
    { id: 'architecture', label: 'System Architecture', icon: Layers },
    { id: 'profile', label: 'Apiary Farm Profile', icon: User },
  ];

  const personaList: { role: UserRole; label: string; badge: string }[] = [
    { role: 'Admin', label: 'System Administrator', badge: 'SYSTEM SCOPED' },
    { role: 'Beekeeper', label: 'Apiary Owner', badge: 'APIARY SCOPED' },
    { role: 'Processor', label: 'QA & Bottling Operator', badge: 'FACILITY SCOPED' },
    { role: 'Distributor', label: 'Logistics Operator', badge: 'LOGISTICS SCOPED' },
    { role: 'Consumer', label: 'Consumer Passport', badge: 'PUBLIC ACCESS' },
  ];

  const handleRoleSelect = (r: UserRole) => {
    setUserRole(r);
    const targetConfig = roleConfigs[r];
    const isTabAuthorized = targetConfig.modules.some(m => m.id === currentTab);
    if (!isTabAuthorized) {
      setCurrentTab(targetConfig.primaryTab);
    }
    setRoleDropdownOpen(false);
    onCloseMobile?.();
  };

  const baseProfile = USER_PROFILES[userRole] || USER_PROFILES.Beekeeper;
  const currentProfile = (userRole === 'Beekeeper' && activeBeekeeper)
    ? { name: activeBeekeeper.name, initials: activeBeekeeper.initials, roleLabel: 'Apiary Owner', location: activeBeekeeper.location }
    : baseProfile;

  const isExpandedView = !collapsed || isMobileOpen;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      <aside
        className={`h-full bg-[#070c18] text-slate-300 flex flex-col border-r border-slate-800/80 transition-all duration-300 select-none lg:relative lg:z-30 lg:translate-x-0 shrink-0 ${
          collapsed ? 'lg:w-16' : 'lg:w-64'
        } fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div
            onClick={() => handleNav('landing')}
            className="flex items-center space-x-3 cursor-pointer overflow-hidden"
            title="Go to Landing Page"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-sm shrink-0">
              <Hexagon className="h-5 w-5 fill-amber-950/20 stroke-[2.2]" />
            </div>
            {isExpandedView && (
              <div className="truncate">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight font-sans">
                    HONEY CHAIN
                  </span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30 uppercase font-mono">
                    SaaS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  Trusted honey, hive to home
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {/* Desktop Collapse Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors hidden lg:flex items-center justify-center"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Mobile Close Drawer Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors lg:hidden flex items-center justify-center"
              title="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scope Card Header */}
        {isExpandedView ? (
          <div className="p-3 shrink-0">
            <div 
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`p-3.5 rounded-2xl border ${currentConfig.cardBorder} ${currentConfig.cardBg} cursor-pointer hover:brightness-110 transition-all shadow-md relative group`}
              title="Click to switch role or authorized scope"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9.5px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md uppercase ${currentConfig.badgeStyle}`}>
                  {currentConfig.scopeBadge}
                </span>
                <Shield className={`h-4 w-4 ${currentConfig.shieldColor}`} />
              </div>
              
              <div className="text-base font-bold text-white tracking-tight leading-tight">
                {currentConfig.title}
              </div>
              
              <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                <span>{currentConfig.subtitle}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-400 transition-colors flex items-center space-x-0.5">
                  <span>Switch</span>
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 shrink-0 flex justify-center">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`p-2 rounded-xl border ${currentConfig.cardBorder} ${currentConfig.cardBg} ${currentConfig.shieldColor} transition-transform hover:scale-105`}
              title={`${currentConfig.title} • ${currentConfig.scopeBadge}`}
            >
              <Shield className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Navigation Console */}
        <div className="flex-1 overflow-y-auto py-1 px-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
          <div>
            {isExpandedView && (
              <div className="px-2 pb-2 text-[10.5px] font-mono font-bold tracking-widest text-slate-400/80 uppercase">
                NAVIGATION CONSOLE
              </div>
            )}
            
            <div className="space-y-1">
              {currentConfig.modules.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    title={!isExpandedView ? item.label : undefined}
                    className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group select-none ${
                      isActive
                        ? 'bg-[#0f1a2e] text-amber-400 font-bold border border-slate-700/60 shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium'
                    }`}
                  >
                    {/* Active left amber bar indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-amber-400 rounded-r-md shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    )}

                    <div className="flex items-center space-x-3 truncate pl-1">
                      <Icon className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      {isExpandedView && <span className="truncate">{item.label}</span>}
                    </div>

                    {isExpandedView && (
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {item.id === 'alerts' && unreadAlertsCount > 0 && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-red-500 text-white">
                            {unreadAlertsCount}
                          </span>
                        )}
                        {isActive && (
                          <ChevronRight className="h-4 w-4 text-amber-400 shrink-0" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        {/* Extended System Modules (Visible for Admin) */}
        {userRole === 'Admin' && isExpandedView && (
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setExtendedAdminOpen(!extendedAdminOpen)}
              className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-mono font-bold tracking-wider text-slate-400 hover:text-amber-300 transition-colors uppercase"
            >
              <span>⚙️ AUDIT & SYSTEM UTILITIES</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${extendedAdminOpen ? 'rotate-180' : ''}`} />
            </button>

            {extendedAdminOpen && (
              <div className="mt-1 space-y-1">
                {adminExtendedModules.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-[#0f1a2e] text-amber-400 font-bold border border-slate-700/60'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-400 rounded-r-md" />
                      )}
                      <div className="flex items-center space-x-2.5 truncate pl-1">
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Role Persona Profile & Quick Switcher */}
      <div className="p-3 border-t border-slate-800/80 bg-[#060a14] shrink-0 relative">
        {isExpandedView ? (
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0 font-mono">
                  {currentProfile.initials}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-100 truncate">{currentProfile.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono font-medium truncate">
                    {currentProfile.roleLabel} • {currentProfile.location}
                  </div>
                </div>
              </div>
              <UserCheck className="h-4 w-4 text-slate-400 shrink-0" />
            </button>

            {/* Role Switcher Modal / Dropdown */}
            {roleDropdownOpen && (
              <div className="absolute bottom-14 left-0 right-0 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-2 space-y-1.5 z-50 animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Authorized Personas:</span>
                  <span className="text-[9px] text-amber-400">Click to Switch</span>
                </div>
                
                {personaList.map((p) => {
                  const isSelected = userRole === p.role;
                  return (
                    <button
                      key={p.role}
                      onClick={() => handleRoleSelect(p.role)}
                      className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate font-bold">{p.label}</div>
                        <div className={`text-[9px] font-mono ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                          {p.badge}
                        </div>
                      </div>
                      {isSelected && <span className="text-[10px] font-black shrink-0">✓ Active</span>}
                    </button>
                  );
                })}

                {userRole === 'Beekeeper' && beekeepers && beekeepers.length > 0 && onSelectBeekeeper && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="px-2 pb-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                      Select Apiary Farm:
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {beekeepers.map((bk) => (
                        <button
                          key={bk.id}
                          onClick={() => {
                            onSelectBeekeeper(bk.id);
                            setRoleDropdownOpen(false);
                            onCloseMobile?.();
                          }}
                          className={`w-full px-2 py-1.5 rounded-lg text-xs flex items-center space-x-2 text-left transition-colors ${
                            bk.id === activeBeekeeper?.id
                              ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30'
                              : 'text-slate-300 hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded text-amber-400">{bk.initials}</span>
                          <span className="truncate flex-1">{bk.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {onOpenLoginModal && (
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onCloseMobile?.();
                        onOpenLoginModal();
                      }}
                      className="w-full px-2.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>🔒 Portal Login / Session</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-800/80 text-amber-400 font-bold text-xs font-mono hover:bg-slate-700"
            title={`Active: ${currentConfig.title} (${currentConfig.scopeBadge})`}
          >
            {currentProfile.initials}
          </button>
        )}
      </div>
    </aside>
  </>
  );
};
