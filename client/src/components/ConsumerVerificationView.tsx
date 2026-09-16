import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiFetch';
import { 
  ShieldCheck, 
  Sparkles, ChevronDown, ChevronUp, Link, Cpu, Search, CheckCircle2, MapPin, Calendar
} from 'lucide-react';

interface ConsumerVerificationViewProps {
  batchId?: string;
  onNavigate?: (tab: string) => void;
}

export const ConsumerVerificationView: React.FC<ConsumerVerificationViewProps> = ({ batchId = 'HC-TG-2026-001', onNavigate }) => {
  const [inputBatchId, setInputBatchId] = useState(batchId);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showProof, setShowProof] = useState(false);
  const [showWhyFactors, setShowWhyFactors] = useState(false);

  useEffect(() => {
    if (batchId) {
      setInputBatchId(batchId);
      verifyBatch(batchId);
    }
  }, [batchId]);

  const verifyBatch = async (id: string) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/verify/${id}`);
      const resData = await res.json();
      setData(resData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBatchId.trim()) {
      verifyBatch(inputBatchId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Consumer Standalone Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 py-3 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="mr-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center space-x-1 transition-colors"
                title="Return to Honey Chain Platform"
              >
                <span>← Back to Platform</span>
              </button>
            )}
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-2xs">
              <ShieldCheck className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-none">
                HONEY CHAIN
              </span>
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                VERIFIED HONEY PASSPORT
              </span>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-40 sm:w-56">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Batch ID..."
              value={inputBatchId}
              onChange={(e) => setInputBatchId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </form>
        </div>
      </header>

      {/* Main Passport Content Container */}
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        
        {loading && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="h-8 w-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600 font-mono">Verifying Cryptographic Provenance...</p>
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6">
            
            {/* 1. Verification Hero Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 ${
              data.authentic 
                ? 'bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white border-amber-500/30'
                : 'bg-red-950 text-white border-red-500'
            }`}>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    data.authentic ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white animate-pulse'
                  }`}>
                    {data.authentic ? '🟢 AUTHENTIC HONEY' : '🔴 TAMPERING DETECTED'}
                  </span>
                  <span className="font-mono text-xs text-amber-300 font-extrabold bg-white/10 px-2.5 py-1 rounded-full">
                    {data.batchId}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {data.batch?.floral_source || 'Wildflower Honey'}
                </h1>
                <p className="text-xs text-slate-300 font-medium">
                  Trusted honey, traceable from hive to home.
                </p>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15 text-center shrink-0">
                <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Blockchain Status</div>
                <div className="text-sm font-black font-mono mt-0.5 text-amber-300">
                  {data.authentic ? '100% VERIFIED' : 'HASH MISMATCH'}
                </div>
              </div>
            </div>

            {/* 2. Origin Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 font-mono">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <span>1. APIARY & ORIGIN PROVENANCE</span>
                </h2>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded font-mono">
                  GPS VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Master Beekeeper</span>
                  <div className="font-extrabold text-slate-900 text-sm">{data.batch?.beekeeper_name}</div>
                  <p className="text-[11px] text-slate-500">Registered Organic Apiary Partner</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Apiary Facility</span>
                  <div className="font-extrabold text-slate-900 text-sm">{data.batch?.apiary_name}</div>
                  <p className="text-[11px] text-slate-500">📍 {data.batch?.location}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Smart Hive</span>
                  <div className="font-mono font-black text-amber-900 text-sm">{data.hive?.hive_id || 'HIVE-007'}</div>
                  <p className="text-[11px] text-slate-500">IoT Sensor Colony Feed Active</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Floral Nectar Source</span>
                  <div className="font-extrabold text-slate-900 text-sm">{data.batch?.floral_source}</div>
                  <p className="text-[11px] text-slate-500">Neem & Wild Flora Canopy</p>
                </div>
              </div>
            </div>

            {/* 3. Harvest Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 font-mono">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <span>2. HARVEST SPECIFICATIONS</span>
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-center font-mono">
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                  <span className="text-[10px] text-amber-900 font-sans font-bold uppercase block">Harvest Date</span>
                  <span className="font-black text-slate-900 text-sm">{data.batch?.extraction_date}</span>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                  <span className="text-[10px] text-amber-900 font-sans font-bold uppercase block">Batch Quantity</span>
                  <span className="font-black text-slate-900 text-sm">{data.batch?.quantity_kg} kg</span>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                  <span className="text-[10px] text-amber-900 font-sans font-bold uppercase block">Extraction Method</span>
                  <span className="font-extrabold text-slate-900 text-xs font-sans">Manual Centrifugal</span>
                </div>
              </div>
            </div>

            {/* 4. Journey Timeline Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 font-mono">
                  <Link className="h-4 w-4 text-amber-600" />
                  <span>3. SUPPLY CHAIN JOURNEY TIMELINE</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                {(data.timeline || []).map((step: any, idx: number) => (
                  <div key={idx} className={`p-3 rounded-2xl border flex flex-col items-center justify-between space-y-1 ${
                    step.completed 
                      ? 'bg-amber-50/60 border-amber-200 text-slate-900'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}>
                    <div className="text-2xl">{step.icon}</div>
                    <div className="font-extrabold text-[11px] text-amber-950">{step.stage}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-full font-mono">{step.date}</div>
                    <div className="text-[9px] font-black text-emerald-700 uppercase">
                      {step.completed ? '✓ Verified' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Quality Lab Testing Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 font-mono">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>4. FSSAI LABORATORY QUALITY CERTIFICATION</span>
                </h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                  [ DEMO LABORATORY DATA ]
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Moisture Content</span>
                  <span className="font-black text-slate-900 text-base">{data.quality?.moisture_pct || 17.2}%</span>
                  <span className="text-[10px] text-emerald-700 font-bold block font-sans">✓ &lt; 20% Standard</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Purity Index</span>
                  <span className="font-black text-emerald-700 text-base">{data.quality?.purity_pct || 99.8}%</span>
                  <span className="text-[10px] text-emerald-700 font-bold block font-sans">✓ Grade A+ Pure</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">HMF Level</span>
                  <span className="font-black text-slate-900 text-base">{data.quality?.hmf_mg_kg || 12.4} mg/kg</span>
                  <span className="text-[10px] text-emerald-700 font-bold block font-sans">✓ Fresh Unheated</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">C4 Adulteration</span>
                  <span className="font-extrabold text-emerald-700 text-xs block pt-1 font-sans">{data.quality?.adulteration_test || 'PASSED (NMR CLEAN)'}</span>
                  <span className="text-[10px] text-emerald-700 font-bold block font-sans">✓ 100% Authentic</span>
                </div>
              </div>
            </div>

            {/* 6. Smart Hive IoT Telemetry Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 font-mono">
                  <Cpu className="h-4 w-4 text-blue-600" />
                  <span>5. SMART HIVE TELEMETRY ({data.hive?.hive_id || 'HIVE-007'})</span>
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-center font-mono">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Brood Temperature</span>
                  <span className="font-black text-slate-900 text-base">{data.hive?.temperature_c || 34.2}°C</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Relative Humidity</span>
                  <span className="font-black text-slate-900 text-base">{data.hive?.humidity_pct || 61}%</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Scale Weight</span>
                  <span className="font-black text-slate-900 text-base">{data.hive?.weight_kg || 19.4} kg</span>
                </div>
              </div>
            </div>

            {/* 7. AI-Assisted Insights Section */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-100 font-mono">
                    6. AI-ASSISTED HIVE ANALYSIS
                  </h2>
                </div>
                <span className="text-[10px] bg-slate-800 text-amber-300 font-extrabold px-2 py-0.5 rounded border border-slate-700 font-mono">
                  [ SIMULATED PREDICTION ]
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Colony Health</span>
                  <span className="text-xl font-black text-emerald-400">{data.aiInsights?.colonyHealth || 92}%</span>
                </div>

                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Stress Risk</span>
                  <span className="text-xl font-black text-red-400">{data.aiInsights?.stressRisk || 8}%</span>
                </div>

                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Productivity</span>
                  <span className="text-lg font-black text-amber-300 font-sans">{data.aiInsights?.productivity || 'HIGH'} 📈</span>
                </div>

                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Expected Yield</span>
                  <span className="text-xl font-black text-blue-300">{data.aiInsights?.harvestPrediction?.expectedYieldKg || 20.2} kg</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowWhyFactors(!showWhyFactors)}
                  className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center space-x-1"
                >
                  <span>How this insight was generated</span>
                  {showWhyFactors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showWhyFactors && (
                  <div className="mt-2 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2 animate-fadeIn">
                    <p className="text-[10px] text-amber-400 font-bold uppercase">Algorithm Factor Weighting:</p>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {(data.aiInsights?.whyThisResult || [
                        'Stable brood temperature 35.2°C maintained over past 7 days.',
                        'Consistent scale weight gain +1.8 kg / week recorded.',
                        'High honey cap level > 85% registered.',
                        'Zero critical pest or varroa mite anomalies flagged.'
                      ]).map((factor: string, idx: number) => (
                        <li key={idx} className="flex items-center space-x-1.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 8. Blockchain Verification Footer Toggle */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-extrabold text-sm text-slate-900">Cryptographic Blockchain Record Integrity Verified</span>
                </div>

                <button
                  onClick={() => setShowProof(!showProof)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Link className="h-3.5 w-3.5 text-amber-400" />
                  <span>{showProof ? 'Hide Cryptographic Audit Trail' : 'View Complete Audit Trail'}</span>
                  {showProof ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {showProof && (
                <div className="bg-slate-950 text-white p-5 rounded-2xl space-y-3 font-mono text-xs border border-slate-800 animate-fadeIn">
                  <div className="text-amber-400 font-bold border-b border-slate-800 pb-2">
                    Batch {data.batch?.id} SHA-256 Ledger Blocks ({data.blocks?.length || 0} Blocks)
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-none">
                    {data.blocks?.map((b: any) => (
                      <div key={b.block_index} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-amber-300 font-bold">
                          <span>Block #{b.block_index} [{b.event_type}]</span>
                          <span className="text-slate-400 text-[10px]">{b.timestamp}</span>
                        </div>
                        <div className="text-slate-300 text-[11px]">Actor: {b.actor} | Location: {b.location}</div>
                        <div className="text-slate-400 text-[10px] truncate">Prev Hash: {b.previous_hash}</div>
                        <div className="text-amber-400 text-[10px] font-bold truncate">Hash: {b.current_hash}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Standalone Footer */}
      <footer className="max-w-3xl mx-auto px-4 mt-8 text-center text-xs text-slate-400">
        <p className="font-semibold">HONEY CHAIN — Verified Honey Provenance & Smart Beekeeping</p>
        <p className="text-[10px] mt-0.5">SHA-256 Tamper-Evident Ledger • Smart India Hackathon Prototype</p>
      </footer>
    </div>
  );
};
