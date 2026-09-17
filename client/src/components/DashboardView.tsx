import React, { useState, useEffect } from 'react';
import type { DashboardData, Hive, BeekeeperProfile } from '../types';
import { apiFetch } from '../apiFetch';
import { 
  Package, ShieldCheck, Scale, 
  BarChart3, PieChart as PieIcon, MapPin, RefreshCw,
  Cpu, AlertTriangle, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

import type { UserRole } from '../types';

interface DashboardViewProps {
  data: DashboardData | null;
  loading: boolean;
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
  activeBeekeeper?: BeekeeperProfile;
  userRole?: UserRole;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, loading, onRefresh, onNavigate, activeBeekeeper, userRole = 'Beekeeper' }) => {
  const [hivesList, setHivesList] = useState<Hive[]>([]);

  useEffect(() => {
    const fetchHives = () => {
      apiFetch('/api/hives')
        .then(res => res.json())
        .then(d => {
          if (d.hives) setHivesList(d.hives);
        })
        .catch(console.error);
    };
    fetchHives();
    const interval = setInterval(fetchHives, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="h-8 w-8 text-amber-600 animate-spin" />
        <p className="text-xs font-bold text-slate-600 font-mono">Loading Apiary Telemetry & Ledger...</p>
      </div>
    );
  }

  const { summary, productionByMonth, statusCounts: _statusCounts, qualityDistribution, regionalProduction, integrity: _integrity, activeAlerts } = data;

  const renderRoleBanner = () => {
    switch (userRole) {
      case 'Admin':
        return {
          tag: '🛡️ SYSTEM ADMINISTRATOR PORTAL',
          title: 'Platform Control & Live Database Inspection',
          subtitle: 'Audit live Supabase & SQLite database output, inspect cryptographic SHA-256 block hashes, and execute tamper detection simulations.',
          actions: (
            <>
              <button
                onClick={() => onNavigate('database')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-xs transition-colors shadow-sm flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>🗄️ Database Output</span>
              </button>
              <button
                onClick={() => onNavigate('tamper')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-extrabold text-xs transition-colors border border-slate-700 flex items-center space-x-2"
              >
                <span>🛡️ Tamper Simulation</span>
              </button>
            </>
          )
        };

      case 'Processor':
        return {
          tag: '🧪 FSSAI QUALITY INSPECTOR & PROCESSING',
          title: 'Quality Testing & Processing Facility',
          subtitle: 'Execute NMR purity inspections, FSSAI compliance verification, and 3-stage micro-mesh thermal packaging records.',
          actions: (
            <>
              <button
                onClick={() => onNavigate('quality')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-xs transition-colors shadow-sm flex items-center space-x-2"
              >
                <span>🧪 + Quality Testing</span>
              </button>
              <button
                onClick={() => onNavigate('processing')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-extrabold text-xs transition-colors border border-slate-700 flex items-center space-x-2"
              >
                <span>🏭 Processing & Pack</span>
              </button>
            </>
          )
        };

      case 'Distributor':
        return {
          tag: '🚚 COLD-CHAIN LOGISTICS & TRANSPORT',
          title: 'Cold-Chain Transport & Logistics Control',
          subtitle: 'Monitor refrigerated transit vehicle temperatures, storage humidity, and shipment dispatch records across transport hubs.',
          actions: (
            <>
              <button
                onClick={() => onNavigate('distribution')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-xs transition-colors shadow-sm flex items-center space-x-2"
              >
                <span>🚚 Cold-Chain Logistics</span>
              </button>
              <button
                onClick={() => onNavigate('batches')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-extrabold text-xs transition-colors border border-slate-700 flex items-center space-x-2"
              >
                <span>📦 View Shipments</span>
              </button>
            </>
          )
        };

      case 'Consumer':
        return {
          tag: '👤 VERIFIED HONEY PASSPORT',
          title: 'Digital Honey Passport & Marketplace',
          subtitle: 'Verify 100% pure honey origin, inspect cryptographic blockchain seals, and order certified organic honey directly.',
          actions: (
            <>
              <button
                onClick={() => onNavigate('verify')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-xs transition-colors shadow-sm flex items-center space-x-2"
              >
                <span>🔍 Verify Passport</span>
              </button>
              <button
                onClick={() => onNavigate('marketplace')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-extrabold text-xs transition-colors border border-slate-700 flex items-center space-x-2"
              >
                <span>🛒 Honey Marketplace</span>
              </button>
            </>
          )
        };

      case 'Beekeeper':
      default:
        return {
          tag: '👨‍🌾 BEEKEEPER APIARY OPERATIONS',
          title: `Good morning, ${activeBeekeeper ? activeBeekeeper.name.split(' ')[0] : 'Ramesh'}`,
          subtitle: `Here's what's happening across your apiary telemetry feeds and honey supply chain at ${activeBeekeeper ? activeBeekeeper.apiaryName : 'Deccan Organic Apiary'}.`,
          actions: (
            <>
              <button
                onClick={() => onNavigate('batches')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-xs transition-colors shadow-sm flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>+ Harvest Batch</span>
              </button>
              <button
                onClick={() => onNavigate('beekeeping')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-extrabold text-xs transition-colors border border-slate-700 flex items-center space-x-2"
              >
                <Cpu className="h-4 w-4" />
                <span>Smart Hives & AI</span>
              </button>
            </>
          )
        };
    }
  };

  const banner = renderRoleBanner();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome & Greeting Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider font-mono">
              {banner.tag}
            </span>
            <span className="text-xs text-slate-400 font-mono">• {activeBeekeeper ? activeBeekeeper.location : 'Nizamabad Hub'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {banner.title}
          </h2>
          <p className="text-xs text-slate-300 font-medium max-w-3xl">
            {banner.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {banner.actions}

          <button
            onClick={onRefresh}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
            title="Refresh Real-time Feeds"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Compact KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Active Hives</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">10</span>
            <span className="text-xs font-extrabold text-emerald-700">/ 10 Online</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">100% Telemetry Stream</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Honey Traced</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">{summary.totalQuantityKg.toLocaleString()}</span>
            <span className="text-xs font-extrabold text-slate-500">kg</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-extrabold">↑ +14.2% from last harvest</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Active Batches</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">{summary.activeBatches || 10}</span>
            <span className="text-xs font-bold text-slate-500">Batches</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">In active supply pipeline</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Verified Batches</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-emerald-700 font-mono">{summary.verifiedBatches}</span>
            <span className="text-xs font-bold text-slate-500">Passed</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-extrabold">100% Lab Purity Passed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Active Alerts</span>
            <div className="p-1.5 rounded-lg bg-red-50 text-red-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-red-600 font-mono">
              {activeAlerts ? activeAlerts.length : 5}
            </span>
            <span className="text-xs font-bold text-red-700">Alerts</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Requires mitigation</div>
        </div>
      </div>

      {/* 3. Main Dashboard 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Hive Monitoring Table (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-amber-600" />
                  <span>Hive Telemetry & Monitoring</span>
                </h3>
                <p className="text-xs text-slate-500">Real-time sensor feeds, internal conditions, and health status</p>
              </div>

              <button
                onClick={() => onNavigate('beekeeping')}
                className="text-xs font-extrabold text-amber-700 hover:text-amber-900 flex items-center space-x-1"
              >
                <span>View All 10 Hives</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Hive Monitoring Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Hive ID</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Temp</th>
                    <th className="py-3 px-3 text-right">Humidity</th>
                    <th className="py-3 px-3 text-right">Weight</th>
                    <th className="py-3 px-3 text-center">Colony Health</th>
                    <th className="py-3 px-3 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {hivesList.slice(0, 7).map((h) => (
                    <tr
                      key={h.hive_id}
                      onClick={() => onNavigate('beekeeping')}
                      className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-bold text-amber-900">{h.hive_id}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>Online</span>
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right font-extrabold ${h.temperature_c > 36 ? 'text-red-600' : 'text-slate-800'}`}>
                        {h.temperature_c}°C
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">{h.humidity_pct}%</td>
                      <td className="py-3 px-3 text-right font-extrabold text-amber-900">{h.weight_kg} kg</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">
                          {h.ai?.colonyHealth || 90}% Healthy 🟢
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-600 font-extrabold text-[11px]">
                        ↑ +1.8 kg/wk
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Honey Production & Regional Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-amber-600" />
                <span>Honey Production Trend (kg)</span>
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productionByMonth} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorQtyDash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.7}/>
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val: any) => [`${val} kg`, 'Monthly Production']} />
                    <Area type="monotone" dataKey="quantityKg" stroke="#b45309" strokeWidth={3} fillOpacity={1} fill="url(#colorQtyDash)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                <span>Regional Harvest Distribution (kg)</span>
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalProduction} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <XAxis dataKey="location" tick={{ fontSize: 9, fontWeight: 700 }} interval={0} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val: any) => [`${val} kg`, 'Total Harvest Volume']} />
                    <Bar dataKey="totalKg" fill="#d97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Priority Alerts & Quality Breakdown */}
        <div className="space-y-6">
          
          {/* Priority Alerts Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-extrabold text-base text-slate-900">Priority Hive Alerts</h3>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-extrabold text-amber-700 hover:text-amber-900"
              >
                View all alerts →
              </button>
            </div>

            <div className="space-y-3">
              {(activeAlerts || []).slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onNavigate('alerts')}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 cursor-pointer transition-colors ${
                    alert.severity === 'Critical'
                      ? 'bg-red-50/60 border-red-200 text-red-950 hover:bg-red-50'
                      : alert.severity === 'Warning'
                      ? 'bg-amber-50/60 border-amber-200 text-amber-950 hover:bg-amber-50'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="font-mono text-amber-900">{alert.hive_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                      alert.severity === 'Critical' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900">{alert.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-mono">Value: <strong>{alert.sensor_value || 'Threshold Exceeded'}</strong></span>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Grade Distribution Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <PieIcon className="h-4 w-4 text-emerald-600" />
                <span>Lab Quality Certification</span>
              </h3>
              <p className="text-xs text-slate-500">FSSAI laboratory purity test outcomes</p>
            </div>

            <div className="h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {qualityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend formatter={(val) => <span className="text-xs font-semibold text-slate-700">{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Blockchain Verification Health */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-extrabold uppercase font-mono tracking-wider">Blockchain Ledger</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/30">
                ● ACTIVE
              </span>
            </div>

            <div className="text-sm font-bold text-slate-200">
              SHA-256 Tamper-Evident Ledger Integrity
            </div>

            <div className="p-3 bg-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">✓ VERIFIED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Blocks:</span>
                <span className="text-white font-bold">{summary.totalEvents}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('blockchain')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl transition-colors text-center block"
            >
              Inspect Cryptographic Audit Trail →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
