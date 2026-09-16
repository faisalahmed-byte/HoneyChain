import React, { useState } from 'react';
import type { UserRole, BeekeeperProfile } from '../types';
import { USER_PROFILES } from './TopHeader';
import { 
  Hexagon, LayoutDashboard, Cpu, Bell, QrCode, Package, 
  Search, Link, TestTube, Factory, Truck, ShoppingBag, 
  BarChart2, ShieldAlert, User, Layers, ChevronLeft, ChevronRight,
  UserCheck, Database, LogIn, Globe
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
  onOpenLoginModal
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; shortLabel: string; primaryTab: string }[] = [
    { role: 'Admin', label: '🛡️ All Modules / Admin', shortLabel: '🛡️ Admin', primaryTab: 'dashboard' },
    { role: 'Beekeeper', label: '👨‍🌾 Beekeeper', shortLabel: '👨‍🌾 Beekeeper', primaryTab: 'dashboard' },
    { role: 'Processor', label: '🧪 Quality & Lab', shortLabel: '🧪 Lab', primaryTab: 'quality' },
    { role: 'Distributor', label: '🚚 Cold-Chain Logistics', shortLabel: '🚚 Logistics', primaryTab: 'distribution' },
    { role: 'Consumer', label: '👤 Consumer Passport', shortLabel: '👤 Consumer', primaryTab: 'verify' },
  ];

  const getNavGroupsForRole = () => {
    switch (userRole) {
      case 'Admin':
        return [
          {
            group: '📊 Operations & Supply Chain',
            items: [
              { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
              { id: 'batches', label: '+ Create Honey Batch', icon: Package },
              { id: 'traceability', label: 'Batch Traceability Journey', icon: Search },
              { id: 'beekeeping', label: 'Smart Hives & AI Telemetry', icon: Cpu },
              { id: 'alerts', label: 'AI Alert Center', icon: Bell, badge: unreadAlertsCount },
              { id: 'quality', label: 'FSSAI Quality Testing', icon: TestTube },
              { id: 'processing', label: 'Thermal Processing & Pack', icon: Factory },
              { id: 'distribution', label: 'Cold-Chain Logistics', icon: Truck },
              { id: 'qr', label: 'QR Generator & Labels', icon: QrCode },
              { id: 'marketplace', label: 'Verified Marketplace', icon: ShoppingBag },
            ]
          },
          {
            group: '⚙️ Blockchain & System Audit',
            items: [
              { id: 'blockchain', label: 'Blockchain Ledger Audit', icon: Link },
              { id: 'tamper', label: 'Tamper Simulation Lab', icon: ShieldAlert },
              { id: 'database', label: 'Database Records Output', icon: Database },
              { id: 'analytics', label: 'National Analytics', icon: BarChart2 },
              { id: 'architecture', label: 'System Architecture', icon: Layers },
              { id: 'profile', label: 'My Apiary Profile', icon: User },
            ]
          }
        ];

      case 'Beekeeper':
        return [
          {
            group: '👨‍🌾 Apiary & Beekeeping',
            items: [
              { id: 'dashboard', label: 'Apiary Dashboard', icon: LayoutDashboard },
              { id: 'beekeeping', label: 'Smart Hives & AI Telemetry', icon: Cpu },
              { id: 'alerts', label: 'Alert Intelligence Center', icon: Bell, badge: unreadAlertsCount },
              { id: 'profile', label: 'My Apiary Profile', icon: User }
            ]
          },
          {
            group: '🍯 Harvest & Batches',
            items: [
              { id: 'batches', label: '+ Harvest Honey Batches', icon: Package },
              { id: 'traceability', label: 'Batch Journey & Traceability', icon: Search }
            ]
          },
          {
            group: '🏷️ QR & Direct Sales',
            items: [
              { id: 'qr', label: 'QR Management Generator', icon: QrCode },
              { id: 'marketplace', label: 'Honey Marketplace', icon: ShoppingBag }
            ]
          },
          {
            group: '🌐 Other System Modules',
            items: [
              { id: 'quality', label: 'Quality Inspections Lab', icon: TestTube },
              { id: 'processing', label: 'Processing & Bottling', icon: Factory },
              { id: 'distribution', label: 'Cold-Chain Logistics', icon: Truck },
              { id: 'blockchain', label: 'Blockchain Ledger Audit', icon: Link },
              { id: 'tamper', label: 'Tamper Simulation Lab', icon: ShieldAlert },
              { id: 'database', label: 'Database Records Output', icon: Database },
              { id: 'analytics', label: 'National Analytics', icon: BarChart2 },
            ]
          }
        ];

      case 'Processor':
        return [
          {
            group: '🧪 Quality & Processing Lab',
            items: [
              { id: 'dashboard', label: 'Facility Dashboard', icon: LayoutDashboard },
              { id: 'quality', label: 'FSSAI Quality Testing', icon: TestTube },
              { id: 'processing', label: 'Thermal Processing & Pack', icon: Factory },
              { id: 'batches', label: 'Honey Batches', icon: Package },
              { id: 'traceability', label: 'Batch Traceability', icon: Search },
              { id: 'qr', label: 'QR Label Printing', icon: QrCode },
              { id: 'blockchain', label: 'Blockchain Ledger', icon: Link },
            ]
          },
          {
            group: '🌐 Other System Modules',
            items: [
              { id: 'beekeeping', label: 'Smart Hives & AI Telemetry', icon: Cpu },
              { id: 'alerts', label: 'Alert Center', icon: Bell, badge: unreadAlertsCount },
              { id: 'distribution', label: 'Logistics Transport', icon: Truck },
              { id: 'marketplace', label: 'Honey Marketplace', icon: ShoppingBag },
              { id: 'tamper', label: 'Tamper Lab', icon: ShieldAlert },
              { id: 'database', label: 'Database Output', icon: Database },
            ]
          }
        ];

      case 'Distributor':
        return [
          {
            group: '🚚 Cold-Chain Logistics',
            items: [
              { id: 'dashboard', label: 'Logistics Dashboard', icon: LayoutDashboard },
              { id: 'distribution', label: 'Cold-Chain Transport', icon: Truck },
              { id: 'batches', label: 'Shipment Batches', icon: Package },
              { id: 'traceability', label: 'Shipment Journey', icon: Search },
              { id: 'blockchain', label: 'Blockchain Ledger Audit', icon: Link },
              { id: 'qr', label: 'QR Shipment Scanner', icon: QrCode },
            ]
          },
          {
            group: '🌐 Other System Modules',
            items: [
              { id: 'quality', label: 'Quality Testing', icon: TestTube },
              { id: 'processing', label: 'Processing Records', icon: Factory },
              { id: 'beekeeping', label: 'Smart Hives', icon: Cpu },
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
              { id: 'database', label: 'Database Output', icon: Database },
            ]
          }
        ];

      case 'Consumer':
      default:
        return [
          {
            group: '👤 Consumer Passport & Shop',
            items: [
              { id: 'verify', label: 'Digital Honey Passport', icon: QrCode },
              { id: 'traceability', label: 'Batch Journey Lookup', icon: Search },
              { id: 'marketplace', label: 'Verified Honey Marketplace', icon: ShoppingBag }
            ]
          },
          {
            group: '🌐 Explore Enterprise Modules',
            items: [
              { id: 'dashboard', label: 'Apiary Dashboard', icon: LayoutDashboard },
              { id: 'blockchain', label: 'Blockchain Ledger Audit', icon: Link },
              { id: 'tamper', label: 'Tamper Simulation Lab', icon: ShieldAlert },
            ]
          }
        ];
    }
  };

  const navGroups = getNavGroupsForRole();

  const handleRoleSelect = (r: UserRole, primaryTab: string) => {
    setUserRole(r);
    setCurrentTab(primaryTab);
    setRoleDropdownOpen(false);
  };

  const baseProfile = USER_PROFILES[userRole] || USER_PROFILES.Beekeeper;
  const currentProfile = (userRole === 'Beekeeper' && activeBeekeeper)
    ? { name: activeBeekeeper.name, initials: activeBeekeeper.initials, roleLabel: 'Beekeeper', location: activeBeekeeper.location }
    : baseProfile;

  return (
    <aside
      className={`h-full bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 relative z-30 shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
        <div
          onClick={() => setCurrentTab('landing')}
          className="flex items-center space-x-3 cursor-pointer overflow-hidden"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-sm shrink-0">
            <Hexagon className="h-5 w-5 fill-amber-950/20 stroke-[2.2]" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-white text-base tracking-tight font-sans">
                  HONEY CHAIN
                </span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30 uppercase">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                Trusted honey, hive to home
              </p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>



      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && item.badge > 0 ? (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Role Persona Profile (Dynamic) */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 shrink-0 relative">
        {!collapsed ? (
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between transition-colors text-left"
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

            {/* Role Dropdown */}
            {roleDropdownOpen && (
              <div className="absolute bottom-14 left-0 right-0 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-1.5 space-y-1.5 z-50 animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona:
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role, r.primaryTab)}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                      userRole === r.role
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{r.label}</span>
                    {userRole === r.role && <span className="text-[10px]">✓ Active</span>}
                  </button>
                ))}

                {userRole === 'Beekeeper' && beekeepers && beekeepers.length > 0 && onSelectBeekeeper && (
                  <div className="pt-2 border-t border-slate-700/80">
                    <div className="px-2 pb-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                      Select Beekeeper Account:
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {beekeepers.map((bk) => (
                        <button
                          key={bk.id}
                          onClick={() => {
                            onSelectBeekeeper(bk.id);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full px-2 py-1.5 rounded-lg text-xs flex items-center space-x-2 text-left transition-colors ${
                            bk.id === activeBeekeeper?.id
                              ? 'bg-slate-700 text-amber-300 font-bold'
                              : 'text-slate-300 hover:bg-slate-700/50'
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
                  <div className="pt-2 border-t border-slate-700/80">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenLoginModal();
                      }}
                      className="w-full px-2.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>🔒 Switch / Portal Login</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-800 text-amber-400 font-bold text-xs font-mono"
            title={`Logged in as ${currentProfile.name} (${currentProfile.roleLabel})`}
          >
            {currentProfile.initials}
          </button>
        )}
      </div>
    </aside>
  );
};
