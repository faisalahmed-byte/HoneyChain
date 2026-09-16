import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Search, Key, Users, Package, Cpu, Link, Code } from 'lucide-react';
import { apiFetch } from '../apiFetch';

export const DatabaseOutputView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTable, setActiveTable] = useState<'sessions' | 'batches' | 'hives' | 'users' | 'blocks' | 'json'>('sessions');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDatabaseOutput();
  }, []);

  const fetchDatabaseOutput = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/database/output');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Error fetching database output:', e);
    } finally {
      setLoading(false);
    }
  };

  const filterRows = (rows: any[] = []) => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter(r => 
      JSON.stringify(r).toLowerCase().includes(term)
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center shrink-0">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tight font-sans">LIVE DATABASE RECORDS OUTPUT</h1>
                <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-mono">
                  SUPABASE & SQLITE LIVE SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Real-time Database Output: User Login Sessions, Harvest Batches, IoT Beehives, and Cryptographic SHA-256 Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDatabaseOutput}
              disabled={loading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh DB Output</span>
            </button>
          </div>
        </div>

        {/* Search & Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTable('sessions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTable === 'sessions' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>Login Sessions ({data?.loginSessions?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTable('batches')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTable === 'batches' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              <span>Harvest Batches ({data?.batches?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTable('hives')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTable === 'hives' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Beehives ({data?.hives?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTable('users')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTable === 'users' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Users ({data?.users?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTable('blocks')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTable === 'blocks' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Link className="h-3.5 w-3.5" />
              <span>Blockchain Blocks ({data?.blocks?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTable('json')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTable === 'json' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>Raw JSON</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search DB records..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Database Output Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table 1: Login Sessions */}
        {activeTable === 'sessions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-amber-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Portal Type</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {filterRows(data?.loginSessions || []).map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">#{s.id || idx + 1}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{s.user_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{s.user_id}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        s.role === 'Admin' ? 'bg-purple-100 text-purple-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        s.login_type === 'ADMIN_PORTAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {s.login_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.ip_address || '127.0.0.1'}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 2: Harvest Batches with block_tx_hash */}
        {activeTable === 'batches' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-amber-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Hive ID</th>
                  <th className="py-3 px-4">Beekeeper Name</th>
                  <th className="py-3 px-4">Floral Nectar</th>
                  <th className="py-3 px-4 text-right">Quantity (kg)</th>
                  <th className="py-3 px-4">Blockchain Tx Hash (`block_tx_hash`)</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {filterRows(data?.batches || []).map((b: any, idx: number) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">{b.id}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{b.hive_id || 'HIVE-007'}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{b.beekeeper_name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{b.floral_source}</td>
                    <td className="py-3 px-4 text-right font-black text-amber-900">{b.quantity_kg} kg</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-emerald-800 bg-emerald-50/50 p-1.5 rounded truncate max-w-xs" title={b.block_tx_hash}>
                      {b.block_tx_hash || '0x' + b.id.replace(/-/g, '').toLowerCase() + '...'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold rounded-md text-[10px]">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 3: Beehives */}
        {activeTable === 'hives' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-amber-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Hive ID</th>
                  <th className="py-3 px-4">Apiary Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Temp (°C)</th>
                  <th className="py-3 px-4 text-right">Humidity (%)</th>
                  <th className="py-3 px-4 text-right">Weight (kg)</th>
                  <th className="py-3 px-4">Colony Strength</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {filterRows(data?.hives || []).map((h: any, idx: number) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">{h.hive_id || h.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{h.apiary_name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{h.location_name || h.location}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{h.temperature_c || h.temperature}°C</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">{h.humidity_pct || h.humidity}%</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-900">{h.weight_kg || 19.4} kg</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded text-[10px]">
                        {h.colony_strength || 'Strong'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 4: Users */}
        {activeTable === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-amber-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Apiary Entity</th>
                  <th className="py-3 px-4">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {filterRows(data?.users || []).map((u: any, idx: number) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-900">{u.id}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-extrabold rounded text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{u.apiary_name || 'Agri Apiary'}</td>
                    <td className="py-3 px-4 text-slate-600">{u.location_name || 'Telangana'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 5: Blockchain Blocks */}
        {activeTable === 'blocks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-amber-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Block #</th>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Event Stage</th>
                  <th className="py-3 px-4">Actor Entity</th>
                  <th className="py-3 px-4">SHA-256 Block Hash (`current_hash`)</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {filterRows(data?.blocks || []).map((bl: any, idx: number) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-amber-900">Block #{bl.block_index}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{bl.batch_id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{bl.event_type}</td>
                    <td className="py-3 px-4 text-slate-700">{bl.actor}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-800 bg-slate-100 p-1.5 rounded truncate max-w-xs" title={bl.current_hash}>
                      {bl.current_hash}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{bl.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 6: Raw JSON Viewer */}
        {activeTable === 'json' && (
          <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
