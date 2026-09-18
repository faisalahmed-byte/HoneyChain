import React, { useState, useEffect } from 'react';
import type { BeekeeperProfile } from '../types';
import { Package, CheckCircle2, Link, Printer, ArrowRight, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { apiFetch } from '../apiFetch';

interface BatchCreateViewProps {
  onSuccess: (batchId: string) => void;
  onNavigate: (tab: string) => void;
  activeBeekeeper?: BeekeeperProfile;
}

export const BatchCreateView: React.FC<BatchCreateViewProps> = ({ onSuccess, onNavigate, activeBeekeeper }) => {
  const [formData, setFormData] = useState({
    hive_id: 'HIVE-007',
    beekeeper_name: activeBeekeeper ? activeBeekeeper.name : 'Ramesh Honey Farms',
    apiary_name: activeBeekeeper ? activeBeekeeper.apiaryName : 'Deccan Organic Apiary',
    location: activeBeekeeper ? activeBeekeeper.location : 'Nizamabad, Telangana',
    gps_lat: 18.6725,
    gps_lng: 78.0941,
    extraction_date: new Date().toISOString().split('T')[0],
    floral_source: activeBeekeeper ? `${activeBeekeeper.primaryCrop.split('&')[0].trim()} Honey` : 'Wildflower Honey',
    hives_count: 12,
    quantity_kg: 18.5,
    moisture_pct: 17.2,
    temperature_c: 33.8,
    initial_quality_grade: 'Grade A+',
    harvest_method: 'Manual Centrifugal Extraction',
    notes: 'Harvested from verified organic apiary during peak blossom season.'
  });

  useEffect(() => {
    if (activeBeekeeper) {
      setFormData(prev => ({
        ...prev,
        beekeeper_name: activeBeekeeper.name,
        apiary_name: activeBeekeeper.apiaryName,
        location: activeBeekeeper.location,
        floral_source: `${activeBeekeeper.primaryCrop.split('&')[0].trim()} Honey`
      }));
    }
  }, [activeBeekeeper]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await apiFetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setResult(data);
        onSuccess(data.batchId);
      } else {
        alert(`Error registering batch: ${data.error}`);
      }
    } catch (err: any) {
      setLoading(false);
      alert(`Network error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Create New Honey Batch</h2>
            <p className="text-xs text-slate-500">
              Register fresh honey harvest extraction and mint Genesis SHA-256 block on Honey Chain
            </p>
          </div>
        </div>
      </div>

      {result ? (
        <div className="bg-white p-8 rounded-3xl border border-emerald-300 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center space-x-3 text-emerald-800">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">Honey Batch Successfully Registered!</h3>
              <p className="text-xs font-semibold text-emerald-700">
                Genesis Block minted & cryptographic QR identity generated
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Assigned Batch ID</span>
                <div className="text-2xl font-black text-amber-900 font-mono">{result.batchId}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Genesis Block SHA-256 Hash</span>
                <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 break-all shadow-2xs">
                  {result.hash}
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Link className="h-3.5 w-3.5 mr-1 text-emerald-700" />
                  Genesis Block #{result.blockIndex} Minted
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <span className="text-xs font-extrabold text-slate-700 uppercase font-mono tracking-wider">Consumer QR Identity</span>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs">
                <QRCodeSVG value={`${window.location.origin}/verify/${result.batchId}`} size={160} />
              </div>
              <div className="text-[11px] font-mono text-slate-500 font-semibold">/verify/{result.batchId}</div>
              
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print QR Identity Label</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs"
            >
              Create Another Batch
            </button>

            <button
              onClick={() => onNavigate('traceability')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-2xs"
            >
              <span>View Batch Traceability</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Origin Hive <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.hive_id}
                onChange={(e) => setFormData({ ...formData, hive_id: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-bold text-amber-900 bg-slate-50 font-mono"
              >
                {['HIVE-001','HIVE-002','HIVE-003','HIVE-004','HIVE-005','HIVE-006','HIVE-007','HIVE-008','HIVE-009','HIVE-010'].map(h => (
                  <option key={h} value={h}>{h} (Telemetry Stream Active)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Beekeeper Name / Partner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.beekeeper_name}
                onChange={(e) => setFormData({ ...formData, beekeeper_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Apiary Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.apiary_name}
                onChange={(e) => setFormData({ ...formData, apiary_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Location (District, State) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Floral Nectar Source <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.floral_source}
                onChange={(e) => setFormData({ ...formData, floral_source: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-semibold text-slate-900 bg-slate-50"
              >
                <option value="Wildflower Honey">Wildflower Honey</option>
                <option value="Neem Honey">Neem Honey</option>
                <option value="Lychee Honey">Lychee Honey</option>
                <option value="Mustard Honey">Mustard Honey</option>
                <option value="White Acacia Honey">White Acacia Honey</option>
                <option value="Eucalyptus Honey">Eucalyptus Honey</option>
                <option value="Jamun Organic Honey">Jamun Organic Honey</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Number of Hives Extracted <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.hives_count}
                onChange={(e) => setFormData({ ...formData, hives_count: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-semibold text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Extracted Quantity (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.quantity_kg}
                onChange={(e) => setFormData({ ...formData, quantity_kg: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-semibold text-slate-900 bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Moisture Level (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.moisture_pct}
                onChange={(e) => setFormData({ ...formData, moisture_pct: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-semibold text-slate-900 bg-slate-50 font-mono"
              />
            </div>

          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Extraction Remarks & Harvest Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/50 text-xs font-semibold text-slate-900 bg-slate-50"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-slate-950" />
              <span>{loading ? 'Minting SHA-256 Block...' : 'Register Batch & Mint Genesis Block'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
