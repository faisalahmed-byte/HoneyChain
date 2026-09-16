import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, ShieldAlert, 
  Link, RotateCcw, Sparkles 
} from 'lucide-react';
import { apiFetch } from '../apiFetch';

export const TamperDemoView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tamperResult, setTamperResult] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [restoreResult, setRestoreResult] = useState<any>(null);

  const handleTamper = async () => {
    setLoading(true);
    setVerifyResult(null);
    setRestoreResult(null);

    try {
      const res = await apiFetch('/api/blockchain/tamper-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block_index: 2, field: 'quantity_kg', new_value: 500 })
      });
      const data = await res.json();
      setTamperResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/blockchain/verify', { method: 'POST' });
      const data = await res.json();
      setVerifyResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    setTamperResult(null);
    setVerifyResult(null);

    try {
      const res = await apiFetch('/api/blockchain/restore', { method: 'POST' });
      const data = await res.json();
      setRestoreResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-2xs space-y-2">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Fraud & Tamper Detection Live Demonstration</h2>
            <p className="text-xs text-slate-500">
              Interactive security tool to demonstrate how SHA-256 hash chaining detects unauthorized data tampering
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h3 className="font-extrabold text-base text-amber-300">Live Tamper Demonstration Steps</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Cryptographic Integrity Verification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
            <div className="font-bold text-amber-400 text-sm">Step 1: Corrupt Record</div>
            <p className="text-slate-300 leading-relaxed">
              Simulate an unauthorized middleman changing Block #2 harvest quantity from <strong>250 kg</strong> to <strong>500 kg</strong> directly in database storage.
            </p>
            <button
              onClick={handleTamper}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Simulate Tampering</span>
            </button>
          </div>

          <div className="p-5 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
            <div className="font-bold text-amber-400 text-sm">Step 2: Run Verification</div>
            <p className="text-slate-300 leading-relaxed">
              Run SHA-256 link check. The system recalculates hashes and flags discrepancy between computed hash and stored block hash.
            </p>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Link className="h-4 w-4" />
              <span>Verify Blockchain</span>
            </button>
          </div>

          <div className="p-5 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
            <div className="font-bold text-amber-400 text-sm">Step 3: Restore Ledger</div>
            <p className="text-slate-300 leading-relaxed">
              Restore authentic block payload. The cryptographic hash chain returns to pristine verified status.
            </p>
            <button
              onClick={handleRestore}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restore Authentic Record</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {tamperResult && (
            <div className="p-4 bg-red-950/80 border-2 border-red-500 rounded-2xl text-red-200 space-y-1 font-mono text-xs animate-fadeIn">
              <div className="font-bold text-red-400 flex items-center space-x-2 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>UNAUTHORIZED ALTERATION APPLIED TO BLOCK #{tamperResult.blockIndex}</span>
              </div>
              <p>Batch: {tamperResult.batchId} | Field: {tamperResult.tamperedField} = {tamperResult.newValue} kg</p>
              <p className="text-[11px] text-red-300">The stored SHA-256 hash was NOT updated, creating a cryptographic mismatch!</p>
            </div>
          )}

          {verifyResult && (
            <div className={`p-5 rounded-2xl border-2 space-y-2 font-mono text-xs animate-fadeIn ${
              verifyResult.valid
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                : 'bg-red-950/90 border-red-500 text-red-100 animate-pulse'
            }`}>
              <div className="font-extrabold text-base flex items-center space-x-2">
                {verifyResult.valid ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                )}
                <span>{verifyResult.valid ? '✓ BLOCKCHAIN VERIFIED' : '❌ TAMPERING DETECTED'}</span>
              </div>
              <p className="text-sm font-bold">{verifyResult.message}</p>
              {verifyResult.reason && (
                <p className="text-red-300 bg-black/40 p-2.5 rounded-lg border border-red-800 text-[11px]">
                  {verifyResult.reason}
                </p>
              )}
            </div>
          )}

          {restoreResult && (
            <div className="p-5 bg-emerald-950/80 border-2 border-emerald-400 rounded-2xl text-emerald-200 space-y-2 font-mono text-xs animate-fadeIn">
              <div className="font-extrabold text-base flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <span>✓ BLOCKCHAIN RESTORED & VERIFIED</span>
              </div>
              <p>{restoreResult.message}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
