import React, { useState, useEffect, useRef } from 'react';
import type { UserRole, Batch, HiveAlert, BeekeeperProfile } from '../types';
import { Search, Bell, ShieldCheck, ChevronRight, Package, Cpu, AlertTriangle, X, Menu, Thermometer, Droplets } from 'lucide-react';
import { apiFetch } from '../apiFetch';

interface TopHeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  unreadAlertsCount?: number;
  onSearchSelect?: (type: 'batch' | 'hive' | 'alert', id: string) => void;
  activeBeekeeper?: BeekeeperProfile;
  beekeepers?: BeekeeperProfile[];
  onSelectBeekeeper?: (id: string) => void;
  onOpenLoginModal?: () => void;
  onToggleMobileMenu?: () => void;
}

export const INITIAL_BEEKEEPERS: BeekeeperProfile[] = [
  {
    id: 'BK-001',
    name: 'Ramesh Kumar',
    initials: 'RK',
    apiaryName: 'Ramesh Honey Farms (Deccan Organic Apiary)',
    location: 'Nizamabad, TS',
    phone: '+91 98490 12345',
    experience: '8 Years Certified Organic Beekeeping',
    fssaiLicense: 'FSSAI Lic #23621009000412',
    primaryCrop: 'Neem & Wildflower Nectar',
    hivesCount: 10,
    honeyProducedKg: 2680,
    verifiedBatchesCount: 10,
    rating: '4.9 / 5.0',
    blockchainId: '0x9A4b...C781 (Verified)',
    roleLabel: 'Beekeeper'
  },
  {
    id: 'BK-002',
    name: 'Sunil Verma',
    initials: 'SV',
    apiaryName: 'Sunil Organic Apiaries (Litchi Orchards)',
    location: 'Muzaffarpur, BR',
    phone: '+91 94310 98765',
    experience: '12 Years Commercial Beekeeping',
    fssaiLicense: 'FSSAI Lic #10019011000854',
    primaryCrop: 'Lychee Nectar',
    hivesCount: 38,
    honeyProducedKg: 4200,
    verifiedBatchesCount: 14,
    rating: '4.8 / 5.0',
    blockchainId: '0x7B3c...F912 (Verified)',
    roleLabel: 'Beekeeper'
  },
  {
    id: 'BK-003',
    name: 'Bharatpur Co-op (M. Sharma)',
    initials: 'MS',
    apiaryName: 'Mustard Valley Apiary',
    location: 'Bharatpur, RJ',
    phone: '+91 94140 55432',
    experience: '15 Years Co-operative Lead',
    fssaiLicense: 'FSSAI Lic #11520034000192',
    primaryCrop: 'Mustard Nectar',
    hivesCount: 55,
    honeyProducedKg: 6800,
    verifiedBatchesCount: 22,
    rating: '4.95 / 5.0',
    blockchainId: '0x4E8d...A219 (Verified)',
    roleLabel: 'Beekeeper'
  },
  {
    id: 'BK-004',
    name: 'Priya Sharma',
    initials: 'PS',
    apiaryName: 'Coorg Natural Honey Estate',
    location: 'Coorg, KA',
    phone: '+91 98800 66789',
    experience: '6 Years Shola Forest Beekeeping',
    fssaiLicense: 'FSSAI Lic #11218002000531',
    primaryCrop: 'Wild Shola Forest Nectar',
    hivesCount: 30,
    honeyProducedKg: 3100,
    verifiedBatchesCount: 8,
    rating: '5.0 / 5.0',
    blockchainId: '0x1F9a...E543 (Verified)',
    roleLabel: 'Beekeeper'
  }
];

export const USER_PROFILES: Record<UserRole, { name: string; initials: string; roleLabel: string; location: string }> = {
  Beekeeper: { name: 'Ramesh Kumar', initials: 'RK', roleLabel: 'Apiary Owner', location: 'Nizamabad' },
  Processor: { name: 'Dr. A. K. Verma', initials: 'AV', roleLabel: 'QA & Bottling Operator', location: 'FSSAI Testing Lab' },
  Distributor: { name: 'Suresh Logistics', initials: 'SL', roleLabel: 'Logistics Operator', location: 'Hyderabad Hub' },
  Consumer: { name: 'Priya Sharma', initials: 'PS', roleLabel: 'Consumer Passport', location: 'Consumer View' },
  Admin: { name: 'System Administrator', initials: 'SA', roleLabel: 'System Administrator', location: 'National Honey Chain' }
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  unreadAlertsCount = 5,
  onSearchSelect,
  activeBeekeeper,
  beekeepers,
  onSelectBeekeeper,
  onOpenLoginModal,
  onToggleMobileMenu
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    batches: Batch[];
    hives: Array<{ hive_id: string; temperature_c: number; pest_risk: string }>;
    alerts: HiveAlert[];
  }>({ batches: [], hives: [], alerts: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [liveTelemetry, setLiveTelemetry] = useState<{ temp: number; hum: number } | null>(null);

  useEffect(() => {
    const fetchLive = () => {
      apiFetch('/api/hives')
        .then(res => res.json())
        .then(d => {
          if (d.hives && d.hives.length > 0) {
            const h1 = d.hives.find((h: any) => h.hive_id === 'HIVE-001') || d.hives[0];
            if (h1 && h1.temperature_c !== undefined && h1.humidity_pct !== undefined) {
              setLiveTelemetry({
                temp: Number(h1.temperature_c),
                hum: Number(h1.humidity_pct)
              });
            }
          }
        })
        .catch(() => {});
    };
    fetchLive();
    const interval = setInterval(fetchLive, 2000);
    return () => clearInterval(interval);
  }, []);

  const baseProfile = USER_PROFILES[userRole] || USER_PROFILES.Beekeeper;
  const activeProfile = (userRole === 'Beekeeper' && activeBeekeeper)
    ? { name: activeBeekeeper.name, initials: activeBeekeeper.initials, roleLabel: 'Beekeeper', location: activeBeekeeper.location }
    : baseProfile;

  // Handle clicking outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time live search query fetch
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ batches: [], hives: [], alerts: [] });
      setSearchOpen(false);
      return;
    }

    const q = searchQuery.toLowerCase().trim();

    Promise.all([
      apiFetch('/api/batches').then(res => res.json()).catch(() => []),
      apiFetch('/api/hives').then(res => res.json()).catch(() => ({ hives: [], alerts: [] })),
      apiFetch('/api/alerts?status=all').then(res => res.json()).catch(() => [])
    ]).then(([batchesData, hivesData, alertsData]) => {
      const batches = Array.isArray(batchesData)
        ? batchesData.filter((b: Batch) =>
            b.id.toLowerCase().includes(q) ||
            b.beekeeper_name.toLowerCase().includes(q) ||
            b.floral_source.toLowerCase().includes(q)
          ).slice(0, 4)
        : [];

      const hives = Array.isArray(hivesData.hives)
        ? hivesData.hives.filter((h: any) =>
            h.hive_id.toLowerCase().includes(q) ||
            h.apiary_name?.toLowerCase().includes(q)
          ).slice(0, 4)
        : [];

      const alerts = Array.isArray(alertsData)
        ? alertsData.filter((a: HiveAlert) =>
            a.title.toLowerCase().includes(q) ||
            a.hive_id.toLowerCase().includes(q) ||
            a.message.toLowerCase().includes(q)
          ).slice(0, 4)
        : [];

      setSearchResults({ batches, hives, alerts });
      setSearchOpen(true);
    });
  }, [searchQuery]);

  const getBreadcrumbs = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Apiary Dashboard', breadcrumb: ['Overview', 'Beekeeping', 'Dashboard'] };
      case 'beekeeping':
        return { title: 'Smart Beekeeping & AI Telemetry', breadcrumb: ['Beekeeping', 'IoT Monitoring', 'AI Insights'] };
      case 'alerts':
        return { title: 'AI Alert Intelligence Center', breadcrumb: ['Beekeeping', 'IoT Monitoring', 'Alert Center'] };
      case 'batches':
        return { title: 'Honey Batch Management', breadcrumb: ['Supply Chain', 'Traceability', 'Batches'] };
      case 'traceability':
        return { title: 'End-to-End Batch Journey', breadcrumb: ['Supply Chain', 'Traceability', 'Batch Journey'] };
      case 'blockchain':
        return { title: 'Blockchain Ledger Audit', breadcrumb: ['Verification', 'Cryptographic Ledger'] };
      case 'qr':
        return { title: 'Automated QR Management', breadcrumb: ['Verification', 'QR Identity Generator'] };
      case 'verify':
        return { title: 'Digital Honey Passport', breadcrumb: ['Consumer Verification', 'Honey Passport'] };
      case 'quality':
        return { title: 'FSSAI Quality Testing', breadcrumb: ['Supply Chain', 'Lab Inspections'] };
      case 'processing':
        return { title: 'Thermal Processing & Packaging', breadcrumb: ['Supply Chain', 'Facility Records'] };
      case 'distribution':
        return { title: 'Cold-Chain Logistics', breadcrumb: ['Supply Chain', 'Distributor Shipments'] };
      case 'marketplace':
        return { title: 'Verified Honey Marketplace', breadcrumb: ['Commerce', 'Direct Honey Sales'] };
      case 'analytics':
        return { title: 'National Production Analytics', breadcrumb: ['Administration', 'Analytics'] };
      case 'tamper':
        return { title: 'Tamper Simulation Lab', breadcrumb: ['Administration', 'Integrity Testing'] };
      case 'profile':
        return { title: 'Beekeeper Profile', breadcrumb: ['Administration', 'Profile & Apiary'] };
      case 'architecture':
        return { title: 'System Architecture Blueprint', breadcrumb: ['Administration', 'Technical Design'] };
      default:
        return { title: 'Honey Chain SaaS', breadcrumb: ['Honey Chain', 'Platform'] };
    }
  };

  const { title, breadcrumb } = getBreadcrumbs();

  const handleSelectResult = (type: 'batch' | 'hive' | 'alert', id: string) => {
    setSearchOpen(false);
    setSearchQuery('');

    if (onSearchSelect) {
      onSearchSelect(type, id);
    } else {
      if (type === 'batch') {
        setCurrentTab('traceability');
      } else if (type === 'hive') {
        setCurrentTab('beekeeping');
      } else if (type === 'alert') {
        setCurrentTab('alerts');
      }
    }
  };

  const roleBadgeMap: Record<UserRole, { label: string; style: string }> = {
    Admin: { label: 'SYSTEM SCOPED • ADMIN', style: 'bg-amber-500/20 text-amber-900 border-amber-500/40 font-mono' },
    Beekeeper: { label: 'APIARY SCOPED • BEEKEEPER', style: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-mono' },
    Processor: { label: 'FACILITY SCOPED • QA & BOTTLING', style: 'bg-sky-100 text-sky-900 border-sky-300 font-mono' },
    Distributor: { label: 'LOGISTICS SCOPED • DISTRIBUTION', style: 'bg-blue-100 text-blue-900 border-blue-300 font-mono' },
    Consumer: { label: 'PUBLIC ACCESS • CONSUMER', style: 'bg-purple-100 text-purple-900 border-purple-300 font-mono' }
  };

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
      {/* Left Title & Breadcrumbs */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Mobile Hamburger Menu Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 sm:p-2 -ml-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl lg:hidden flex items-center justify-center transition-colors shrink-0"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="min-w-0">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-semibold text-slate-400">
            {breadcrumb.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                <span className={index === breadcrumb.length - 1 ? 'text-amber-900 font-bold' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-0.5 min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none truncate max-w-[130px] sm:max-w-xs md:max-w-none">
              {title}
            </h1>
            {roleBadgeMap[userRole] && (
              <span className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md border uppercase shrink-0 ${roleBadgeMap[userRole].style}`}>
                <span className="hidden md:inline">{roleBadgeMap[userRole].label}</span>
                <span className="md:hidden">{userRole.toUpperCase()}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Search, Alerts, Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        
        {/* Live Hardware Telemetry Pill Synced with LCD Display */}
        {liveTelemetry && (
          <div 
            onClick={() => setCurrentTab('beekeeping')}
            className="flex items-center space-x-1.5 sm:space-x-2 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 border border-emerald-300/90 px-2 sm:px-3 py-1 rounded-xl text-xs font-mono shadow-2xs cursor-pointer transition-all shrink-0"
            title="Physical Arduino DHT22 Hardware Sensor Synced with 16x2 LCD Display"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider hidden lg:inline">LCD SYNC:</span>
            <span className="flex items-center space-x-0.5 text-slate-900 font-black">
              <Thermometer className="h-3 w-3 text-red-500 hidden sm:inline" />
              <span>{liveTelemetry.temp.toFixed(1)}°C</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center space-x-0.5 text-slate-900 font-black">
              <Droplets className="h-3 w-3 text-blue-500 hidden sm:inline" />
              <span>{Math.round(liveTelemetry.hum)}%</span>
            </span>
          </div>
        )}

        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden shrink-0"
          title="Search"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Live Search Input & Dropdown Container (Desktop) */}
        <div ref={searchRef} className="relative hidden md:block">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Batch ID, Hive or Alert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setSearchOpen(true);
              }}
              className="w-48 lg:w-64 pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Auto-complete Overlay Dropdown */}
          {searchOpen && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn space-y-2 max-h-96 overflow-y-auto">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 pt-1">
                Live Search Results ({searchResults.batches.length + searchResults.hives.length + searchResults.alerts.length})
              </div>

              {/* Batches Section */}
              {searchResults.batches.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded font-mono flex items-center space-x-1">
                    <Package className="h-3 w-3" />
                    <span>HONEY BATCHES</span>
                  </div>
                  {searchResults.batches.map(b => (
                    <div
                      key={b.id}
                      onClick={() => handleSelectResult('batch', b.id)}
                      className="p-2 hover:bg-amber-50/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-extrabold text-amber-900 block">{b.id}</span>
                        <span className="text-slate-500 text-[11px] font-medium">{b.floral_source} • {b.beekeeper_name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hives Section */}
              {searchResults.hives.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono flex items-center space-x-1">
                    <Cpu className="h-3 w-3" />
                    <span>APIARY HIVES</span>
                  </div>
                  {searchResults.hives.map(h => (
                    <div
                      key={h.hive_id}
                      onClick={() => handleSelectResult('hive', h.hive_id)}
                      className="p-2 hover:bg-blue-50/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-extrabold text-slate-900 block">{h.hive_id}</span>
                        <span className="text-slate-500 text-[11px] font-mono">Brood Temp: {h.temperature_c}°C</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 font-mono">
                        Pest: {h.pest_risk}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts Section */}
              {searchResults.alerts.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded font-mono flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>TELEMETRY ALERTS</span>
                  </div>
                  {searchResults.alerts.map(a => (
                    <div
                      key={a.id}
                      onClick={() => handleSelectResult('alert', String(a.id))}
                      className="p-2 hover:bg-red-50/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-slate-900 block">{a.title} ({a.hive_id})</span>
                        <span className="text-slate-500 text-[11px] font-mono">{a.timestamp}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        a.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {a.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.batches.length === 0 && searchResults.hives.length === 0 && searchResults.alerts.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400 font-mono">
                  No matching Batch, Hive, or Alert found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Blockchain Ledger Health Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-xl border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Ledger Valid</span>
        </div>

        {/* Portal Login Button */}
        {onOpenLoginModal && (
          <button
            onClick={onOpenLoginModal}
            className="px-2 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0"
            title="Open Login & Session Auth Portal"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-950" />
            <span className="hidden sm:inline">🔒 Portal Login</span>
            <span className="sm:hidden">Login</span>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setCurrentTab('alerts')}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="View Active Alerts"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center border-2 border-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile Badge (Dynamically Updated per Selected Persona with quick switcher) */}
        <div className="relative group">
          <div
            onClick={() => setCurrentTab('profile')}
            className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
            title={`Logged in as ${activeProfile.name} (${activeProfile.roleLabel})`}
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-amber-400 font-black text-xs flex items-center justify-center shadow-2xs border border-amber-500/30 font-mono">
              {activeProfile.initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-extrabold text-slate-900 leading-none">
                {activeProfile.name}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 leading-tight mt-0.5 font-sans">
                {activeProfile.roleLabel} • {activeProfile.location}
              </div>
            </div>
          </div>

          {/* Quick Beekeeper Switcher Dropdown on hover/click */}
          {userRole === 'Beekeeper' && beekeepers && beekeepers.length > 0 && onSelectBeekeeper && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Switch Beekeeper Account</span>
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="text-[10px] font-bold text-amber-600 hover:underline"
                >
                  Manage Profile
                </button>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {beekeepers.map(bk => (
                  <button
                    key={bk.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBeekeeper(bk.id);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center space-x-2 transition-colors ${
                      bk.id === activeBeekeeper?.id
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="h-6 w-6 rounded-lg bg-slate-900 text-amber-400 font-black text-[10px] flex items-center justify-center font-mono">
                      {bk.initials}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="truncate font-semibold">{bk.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{bk.location}</div>
                    </div>
                    {bk.id === activeBeekeeper?.id && (
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Input & Results Drawer */}
      {mobileSearchOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-slate-200 p-3 shadow-xl z-50 animate-fadeIn space-y-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search Batch ID, Hive or Alert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="max-h-72 overflow-y-auto space-y-2 pt-1 divide-y divide-slate-100">
              {/* Batches Section */}
              {searchResults.batches.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded font-mono">
                    HONEY BATCHES
                  </div>
                  {searchResults.batches.map(b => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        handleSelectResult('batch', b.id);
                      }}
                      className="p-2 hover:bg-amber-50/60 rounded-xl cursor-pointer text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-amber-900 block">{b.id}</span>
                        <span className="text-slate-500 text-[11px]">{b.floral_source} • {b.beekeeper_name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hives Section */}
              {searchResults.hives.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">
                    APIARY HIVES
                  </div>
                  {searchResults.hives.map(h => (
                    <div
                      key={h.hive_id}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        handleSelectResult('hive', h.hive_id);
                      }}
                      className="p-2 hover:bg-blue-50/60 rounded-xl cursor-pointer text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-900 block">{h.hive_id}</span>
                        <span className="text-slate-500 text-[11px]">Brood Temp: {h.temperature_c}°C</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 font-mono">
                        {h.pest_risk}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts Section */}
              {searchResults.alerts.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded font-mono">
                    ALERTS
                  </div>
                  {searchResults.alerts.map(a => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        handleSelectResult('alert', String(a.id));
                      }}
                      className="p-2 hover:bg-red-50/60 rounded-xl cursor-pointer text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{a.title} ({a.hive_id})</span>
                        <span className="text-slate-500 text-[11px]">{a.timestamp}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                        {a.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.batches.length === 0 && searchResults.hives.length === 0 && searchResults.alerts.length === 0 && (
                <div className="p-3 text-center text-xs text-slate-400 font-mono">
                  No matching Batch, Hive, or Alert found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
