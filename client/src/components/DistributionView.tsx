import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiFetch';
import type { Batch } from '../types';
import { Truck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface DistributionViewProps {
  onNavigate: (tab: string) => void;
}

export const DistributionView: React.FC<DistributionViewProps> = ({ onNavigate }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [form, setForm] = useState({
    distributor_name: 'AgriExpress Logistics India',
    origin: 'Nizamabad Processing Hub',
    destination: 'Organic Harvest Retail Store, Banjara Hills, Hyderabad',
    transport_vehicle: 'Refrigerated EV Van (TS-07-EX-4412)',
    dispatch_date: new Date().toISOString().split('T')[0],
    delivery_date: new Date().toISOString().split('T')[0],
    storage_temp_c: 22.5,
    shipment_status: 'Delivered',
    notes: 'Maintained strict ambient thermal storage between 20-25°C throughout transit.'
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await apiFetch('/api/batches');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBatches(data);
        if (data.length > 0) setSelectedBatchId(data[0].id);
      }
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await apiFetch(`/api/batches/${selectedBatchId}/distribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setResult(data);
      } else {
        alert(`Error recording distribution: ${data.error}`);
      }
    } catch (err: any) {
      setLoading(false);
      alert(`Network error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Cold-Chain Logistics & Distribution</h2>
            <p className="text-xs text-slate-500">
              Track vehicle dispatch, transit thermal monitoring, and retail delivery events on Honey Chain
            </p>
          </div>
        </div>
      </div>

      {result ? (
        <div className="bg-white p-8 rounded-3xl border border-emerald-300 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center space-x-3 text-emerald-800">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">Shipment Milestone Recorded!</h3>
              <p className="text-xs font-semibold text-emerald-700">
                Logistics block appended to blockchain ledger
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-sans font-bold uppercase">BATCH ID</span>
              <span className="font-extrabold text-amber-900 text-base">{result.batchId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-sans font-bold uppercase">BLOCK INDEX</span>
              <span className="font-bold text-slate-900">Block #{result.blockIndex}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans font-bold uppercase block mb-1">SHA-256 HASH</span>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 break-all">
                {result.hash}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs"
            >
              Record Another Shipment
            </button>
            <button
              onClick={() => onNavigate('verify')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-2xs"
            >
              <span>View Consumer Passport</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Select Target Honey Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-bold text-amber-900 bg-slate-50 font-mono"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} — {b.floral_source} ({b.quantity_kg} kg) [Status: {b.status}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Distributor / Logistics Partner</label>
              <input
                type="text"
                required
                value={form.distributor_name}
                onChange={(e) => setForm({ ...form, distributor_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transport Vehicle / Van ID</label>
              <input
                type="text"
                required
                value={form.transport_vehicle}
                onChange={(e) => setForm({ ...form, transport_vehicle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Origin Facility / Hub</label>
              <input
                type="text"
                required
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Retail Destination Address</label>
              <input
                type="text"
                required
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transit Storage Temp (°C)</label>
              <input
                type="number"
                step="0.5"
                required
                value={form.storage_temp_c}
                onChange={(e) => setForm({ ...form, storage_temp_c: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shipment Status Event</label>
              <select
                value={form.shipment_status}
                onChange={(e) => setForm({ ...form, shipment_status: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50"
              >
                <option value="Dispatched">Dispatched (In Transit)</option>
                <option value="Delivered">Delivered (Retail Ready)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Logistics Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-2xs transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Minting Blockchain Block...' : 'Record Logistics Event & Mint Block'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
