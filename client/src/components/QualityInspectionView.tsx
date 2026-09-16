import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiFetch';
import type { Batch } from '../types';
import { TestTube, ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface QualityInspectionViewProps {
  onNavigate: (tab: string) => void;
}

export const QualityInspectionView: React.FC<QualityInspectionViewProps> = ({ onNavigate }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [form, setForm] = useState({
    inspector_name: 'Dr. A. K. Verma (National Honey Testing Lab)',
    moisture_pct: 17.2,
    purity_pct: 99.8,
    ph_level: 3.9,
    hmf_mg_kg: 12.4,
    adulteration_test: 'Passed (C4 Sugar & NMR Clean)',
    pollen_analysis: 'Dominant Floral Nectar Pollen (> 75%)',
    colour: 'Golden Amber',
    aroma: 'Rich Floral Medicinal',
    quality_grade: 'Grade A+',
    notes: 'Exceeds FSSAI and BIS export purity standards. Zero adulterants detected.'
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

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selectedBatchId) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await apiFetch(`/api/batches/${selectedBatchId}/quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, action })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setResult(data);
      } else {
        alert(`Error submitting inspection: ${data.error}`);
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
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <TestTube className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">FSSAI Quality Inspection & Lab Testing</h2>
            <p className="text-xs text-slate-500">
              Record laboratory purity parameters and append signed verification blocks to Honey Chain
            </p>
          </div>
        </div>
      </div>

      {result ? (
        <div className="bg-white p-8 rounded-3xl border border-emerald-300 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center space-x-3 text-emerald-800">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">Quality Certificate Issued!</h3>
              <p className="text-xs font-semibold text-emerald-700">
                Quality inspection block successfully appended to blockchain ledger
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
              Inspect Another Batch
            </button>
            <button
              onClick={() => onNavigate('traceability')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-2xs"
            >
              <span>View Batch Journey</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Select Target Honey Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-bold text-amber-900 bg-slate-50 font-mono"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} — {b.floral_source} ({b.beekeeper_name}) [Status: {b.status}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Inspector / Certifying Lab</label>
              <input
                type="text"
                value={form.inspector_name}
                onChange={(e) => setForm({ ...form, inspector_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Moisture Level (%) [Standard &lt; 20%]</label>
              <input
                type="number"
                step="0.1"
                value={form.moisture_pct}
                onChange={(e) => setForm({ ...form, moisture_pct: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purity Level (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.purity_pct}
                onChange={(e) => setForm({ ...form, purity_pct: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-700 bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">pH Level [Standard 3.4 - 4.5]</label>
              <input
                type="number"
                step="0.1"
                value={form.ph_level}
                onChange={(e) => setForm({ ...form, ph_level: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">HMF Content (mg/kg) [Max 40]</label>
              <input
                type="number"
                step="0.1"
                value={form.hmf_mg_kg}
                onChange={(e) => setForm({ ...form, hmf_mg_kg: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adulteration / C4 Sugar NMR Result</label>
              <input
                type="text"
                value={form.adulteration_test}
                onChange={(e) => setForm({ ...form, adulteration_test: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-extrabold text-emerald-700 bg-slate-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleAction('reject')}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-2xs transition-colors flex items-center space-x-1.5"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject Batch</span>
            </button>

            <button
              onClick={() => handleAction('approve')}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-2xs transition-colors flex items-center space-x-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Approve & Mint Quality Block</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
