import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiFetch';
import type { HiveAlert, BeekeeperProfile } from '../types';
import { AlertTriangle, CheckCircle2, RefreshCw, Filter, Search } from 'lucide-react';

interface AlertsViewProps {
  onNavigate?: (tab: string) => void;
  activeBeekeeper?: BeekeeperProfile;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onNavigate: _onNavigate, activeBeekeeper }) => {
  const [alerts, setAlerts] = useState<HiveAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [filter, activeBeekeeper]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      let statusParam = 'all';
      if (filter === 'resolved') statusParam = 'resolved';
      else if (filter === 'critical' || filter === 'warning') statusParam = 'active';

      const bkQuery = activeBeekeeper ? `&beekeeper=${encodeURIComponent(activeBeekeeper.name)}&location=${encodeURIComponent(activeBeekeeper.location)}` : '';
      const res = await apiFetch(`/api/alerts?status=${statusParam}${bkQuery}`);
      const data = await res.json();
      if (Array.isArray(data)) setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      const res = await apiFetch(`/api/alerts/${id}/resolve`, { method: 'POST' });
      if (res.ok) {
        fetchAlerts();
      } else {
        alert('Failed to resolve alert');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <span className="bg-red-50 text-red-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-200 uppercase">🔴 CRITICAL</span>;
      case 'warning':
        return <span className="bg-amber-50 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">🟠 WARNING</span>;
      case 'attention':
        return <span className="bg-yellow-50 text-yellow-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-yellow-200 uppercase">🟡 ATTENTION</span>;
      default:
        return <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">🟢 INFO</span>;
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'critical' && a.severity.toLowerCase() !== 'critical') return false;
    if (filter === 'warning' && a.severity.toLowerCase() !== 'warning') return false;

    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.hive_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">AI Alert Intelligence & Incident Monitoring</h2>
            <p className="text-xs text-slate-500">
              Monitor issues requiring attention across your apiary telemetry sensors
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Hive or Alert Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <button
            onClick={fetchAlerts}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shrink-0"
            title="Refresh Alerts"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <Filter className="h-4 w-4 text-slate-400 mr-1" />
        {[
          { id: 'all', label: 'ALL ALERTS' },
          { id: 'critical', label: 'CRITICAL ONLY' },
          { id: 'warning', label: 'WARNINGS ONLY' },
          { id: 'resolved', label: 'RESOLVED ALERTS' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              filter === t.id
                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Structured Alert Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Hive ID</th>
                <th className="py-3.5 px-4">Alert Description</th>
                <th className="py-3.5 px-4">Recorded Sensor Value</th>
                <th className="py-3.5 px-4">Expected Range</th>
                <th className="py-3.5 px-4">Detected</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredAlerts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">{getSeverityBadge(a.severity)}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-900">{a.hive_id}</td>
                  <td className="py-3.5 px-4 font-sans font-extrabold text-slate-900 max-w-xs">
                    <div>{a.title}</div>
                    <div className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{a.message}</div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">{a.sensor_value || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">{a.expected_range || 'Normal'}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{a.timestamp}</td>
                  <td className="py-3.5 px-4 font-sans font-bold">
                    {a.resolved ? (
                      <span className="text-emerald-700 inline-flex items-center space-x-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <span className="text-red-600 font-extrabold uppercase text-[10px] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        Open
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {!a.resolved && (
                      <button
                        onClick={() => handleResolve(a.id)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-extrabold shadow-2xs transition-colors"
                      >
                        MARK AS RESOLVED
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAlerts.length === 0 && !loading && (
          <div className="py-16 text-center text-slate-500 space-y-2 font-sans">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">No Alerts Found</h3>
            <p className="text-xs text-slate-400">Your hives are currently operating within configured normal ranges.</p>
          </div>
        )}
      </div>
    </div>
  );
};
