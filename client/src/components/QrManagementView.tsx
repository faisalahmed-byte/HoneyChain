import React, { useState, useEffect } from 'react';
import type { Batch } from '../types';
import { QrCode, Search, Download, Printer, ExternalLink, ShieldCheck, Filter, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { apiFetch } from '../apiFetch';

interface QrManagementViewProps {
  onNavigate: (tab: string, batchId?: string) => void;
}

export const QrManagementView: React.FC<QrManagementViewProps> = ({ onNavigate }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBatchForModal, setSelectedBatchForModal] = useState<Batch | null>(null);

  useEffect(() => {
    apiFetch('/api/batches')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBatches(data);
      })
      .catch((e) => console.error(e));
  }, []);

  const openQrModal = (batch: Batch) => {
    setSelectedBatchForModal(batch);
  };

  const downloadQr = (batchId: string) => {
    const svgElement = document.getElementById(`qr-svg-${batchId}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `QR_${batchId}.png`;
        a.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQr = (batch: Batch) => {
    const printWindow = window.open('', '_blank');
    const url = `${window.location.origin}/verify/${batch.id}`;
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Label - ${batch.id}</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 20px; }
              .card { border: 2px solid #f59e0b; padding: 25px; max-width: 380px; margin: auto; border-radius: 16px; background: #fff8f0; }
              .title { font-size: 22px; font-weight: 900; color: #78350f; margin-bottom: 4px; }
              .sub { font-size: 13px; color: #92400e; font-weight: 600; }
              .batch { font-family: monospace; font-size: 20px; font-weight: 900; margin-top: 15px; color: #451a03; }
              .qr-box { background: white; padding: 15px; display: inline-block; border-radius: 12px; margin: 15px 0; border: 1px solid #fed7aa; }
              .url { font-family: monospace; font-size: 11px; color: #b45309; margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="title">HONEY CHAIN</div>
              <div class="sub">Verified Tamper-Evident Digital Passport</div>
              <div class="qr-box">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}" alt="QR Code" />
              </div>
              <div class="batch">${batch.id}</div>
              <div class="sub">${batch.floral_source} • ${batch.beekeeper_name}</div>
              <div class="url">${url}</div>
            </div>
            <script>window.print(); setTimeout(() => window.close(), 800);</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const filteredBatches = batches.filter((b) => {
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.beekeeper_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.floral_source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Automated QR Generator & Batch Management</h2>
            <p className="text-xs text-slate-500">
              Every honey batch in Honey Chain automatically receives a unique tamper-evident verification QR code
            </p>
          </div>
        </div>

        <div className="relative flex-1 sm:w-64 max-w-xs">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search Batch ID or Beekeeper..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
        {['All', 'Harvested', 'Quality Checked', 'Processed', 'Delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
              statusFilter === status
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Batches QR Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-amber-900 text-base bg-amber-100/80 px-2.5 py-1 rounded-lg">
                  {b.id}
                </span>
                <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>✓ ACTIVE QR</span>
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900">{b.floral_source}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  👨‍🌾 {b.beekeeper_name} • 📍 {b.location}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Assigned Hive:</span>
                  <span className="font-mono font-bold text-slate-800">{b.hive_id || 'HIVE-007'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Quantity:</span>
                  <span className="font-bold text-amber-900">{b.quantity_kg} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="font-semibold text-slate-800">{b.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => openQrModal(b)}
                className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>View QR</span>
              </button>

              <button
                onClick={() => onNavigate('verify', b.id)}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Passport</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Modal */}
      {selectedBatchForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-amber-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Honey Batch Digital Passport QR</span>
                <h3 className="font-mono font-extrabold text-xl text-amber-900">{selectedBatchForModal.id}</h3>
              </div>
              <button onClick={() => setSelectedBatchForModal(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/80 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="bg-white p-4 rounded-2xl shadow-md border border-amber-200">
                <QRCodeSVG
                  id={`qr-svg-${selectedBatchForModal.id}`}
                  value={`${window.location.origin}/verify/${selectedBatchForModal.id}`}
                  size={200}
                />
              </div>

              <div className="space-y-1">
                <p className="font-bold text-sm text-slate-900">{selectedBatchForModal.floral_source}</p>
                <p className="text-xs text-slate-500">{selectedBatchForModal.beekeeper_name} • {selectedBatchForModal.location}</p>
                <p className="font-mono text-[10px] text-amber-800 font-semibold pt-1">
                  URL: /verify/{selectedBatchForModal.id}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => downloadQr(selectedBatchForModal.id)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
              >
                <Download className="h-4 w-4" />
                <span>DOWNLOAD</span>
              </button>

              <button
                onClick={() => printQr(selectedBatchForModal)}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>PRINT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
