import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiFetch';
import type { BlockchainBlock } from '../types';
import { 
  Link, AlertTriangle, CheckCircle2, 
  Search, ShieldAlert, Sparkles
} from 'lucide-react';

interface BlockchainLedgerViewProps {
  onNavigate: (tab: string) => void;
}

export const BlockchainLedgerView: React.FC<BlockchainLedgerViewProps> = ({ onNavigate }) => {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [filterBatchId, setFilterBatchId] = useState('');

  useEffect(() => {
    fetchBlockchain();
  }, [filterBatchId]);

  const fetchBlockchain = async () => {
    setLoading(true);
    try {
      const url = filterBatchId ? `/api/blockchain?batch_id=${filterBatchId}` : '/api/blockchain';
      const res = await apiFetch(url);
      const data = await res.json();
      setBlocks(data.blocks || []);
      setVerificationResult(data.verification);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBlockchain = async () => {
    setVerifying(true);
    try {
      const res = await apiFetch('/api/blockchain/verify', { method: 'POST' });
      const data = await res.json();
      setVerificationResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-extrabold text-slate-900">Blockchain Verification & Cryptographic Ledger</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tamper-evident SHA-256 provenance record of every honey batch journey
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('tamper')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Tamper Simulation Lab</span>
            </button>

            <button
              onClick={handleVerifyBlockchain}
              disabled={verifying}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-2xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{verifying ? 'Recalculating Hashes...' : 'Recalculate Ledger Integrity'}</span>
            </button>
          </div>
        </div>

        {/* Verification Status Card */}
        {verificationResult && (
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
            verificationResult.valid
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-950 animate-pulse'
          }`}>
            <div className="flex items-center space-x-3">
              {verificationResult.valid ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
              )}
              <div>
                <span className="font-extrabold text-sm tracking-wide">
                  {verificationResult.valid ? '✓ LEDGER INTEGRITY VERIFIED (ALL HASHES MATCH)' : '🔴 DATA INTEGRITY COMPROMISED (UNAUTHORIZED ALTERATION DETECTED)'}
                </span>
                {verificationResult.reason && (
                  <p className="text-xs text-red-700 mt-0.5 font-mono">
                    {verificationResult.reason}
                  </p>
                )}
              </div>
            </div>

            <div className="text-xs font-mono font-bold px-3 py-1 bg-white rounded-lg border border-slate-200 shrink-0">
              Total Blocks: {blocks.length}
            </div>
          </div>
        )}

        {/* Filter Input */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by Batch ID (e.g. HC-TG-2026-001)..."
            value={filterBatchId}
            onChange={(e) => setFilterBatchId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold w-64 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-slate-50"
          />
          {filterBatchId && (
            <button
              onClick={() => setFilterBatchId('')}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Block Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-mono font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Block #</th>
                <th className="py-3.5 px-4">Batch ID</th>
                <th className="py-3.5 px-4">Lifecycle Event</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Previous Hash</th>
                <th className="py-3.5 px-4">Current Block Hash</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    Loading cryptographic blocks...
                  </td>
                </tr>
              ) : blocks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No blockchain blocks found for filter.
                  </td>
                </tr>
              ) : (
                blocks.map((block) => (
                  <tr key={block.block_index} className={`hover:bg-slate-50 transition-colors ${
                    block.is_tampered === 1 ? 'bg-red-50/90 text-red-950 font-bold' : ''
                  }`}>
                    <td className="py-3 px-4 font-black text-amber-900">
                      Block {String(block.block_index).padStart(3, '0')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {block.batch_id}
                    </td>
                    <td className="py-3 px-4 font-sans font-extrabold">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {block.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {block.timestamp}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-sans font-semibold">
                      {block.actor}
                    </td>
                    <td className="py-3 px-4 text-[10px] text-slate-400 max-w-[130px] truncate" title={block.previous_hash}>
                      {block.previous_hash.substring(0, 14)}...
                    </td>
                    <td className="py-3 px-4 text-[10px] text-amber-900 font-bold max-w-[130px] truncate" title={block.current_hash}>
                      {block.current_hash.substring(0, 14)}...
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      {block.is_tampered === 1 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white animate-pulse">
                          🔴 TAMPERED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ VERIFIED
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
