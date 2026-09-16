import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiFetch';
import type { Batch, BeekeeperProfile } from '../types';
import { 
  Search, MapPin, Calendar, ShieldCheck, 
  Link, QrCode, RefreshCw, Filter,
  Package
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TraceabilityViewProps {
  selectedBatchId: string;
  onSelectBatch: (id: string) => void;
  onNavigate: (tab: string) => void;
  activeBeekeeper?: BeekeeperProfile;
}

export const TraceabilityView: React.FC<TraceabilityViewProps> = ({
  selectedBatchId,
  onSelectBatch,
  onNavigate,
  activeBeekeeper
}) => {
  const [searchTerm, setSearchTerm] = useState(selectedBatchId || 'HC-TG-2026-001');
  const [statusFilter, setStatusFilter] = useState('All');
  const [batchData, setBatchData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [batchesList, setBatchesList] = useState<Batch[]>([]);

  useEffect(() => {
    fetchBatches();
    if (selectedBatchId) {
      loadBatchTrace(selectedBatchId);
    } else {
      loadBatchTrace('HC-TG-2026-001');
    }
  }, [selectedBatchId, activeBeekeeper]);

  const fetchBatches = async () => {
    try {
      const q = activeBeekeeper ? `?beekeeper=${encodeURIComponent(activeBeekeeper.name.split(' ')[0])}` : '';
      const res = await apiFetch(`/api/batches${q}`);
      const data = await res.json();
      if (Array.isArray(data)) setBatchesList(data);
    } catch (e) {}
  };

  const loadBatchTrace = async (id: string) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/verify/${id}`);
      const data = await res.json();
      setBatchData(data);
      onSelectBatch(id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batchesList.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.beekeeper_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.floral_source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const getMapCoordinates = (batch: any) => {
    const lat = batch?.gps_lat || 18.6725;
    const lng = batch?.gps_lng || 78.0941;
    const apiaryPos: [number, number] = [lat, lng];
    const labPos: [number, number] = [lat + 0.15, lng + 0.2];
    const procPos: [number, number] = [lat + 0.3, lng + 0.35];

    return { apiaryPos, labPos, procPos };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Honey Batches Management Table Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900">Honey Batch Traceability & Ledger</h2>
              <span className="text-[10px] bg-amber-50 text-amber-900 font-extrabold px-2 py-0.5 rounded border border-amber-200 uppercase font-mono">
                {batchesList.length} Registered Batches
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Track every honey harvest from apiary extraction to consumer QR verification
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('batches')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-2xs transition-colors flex items-center space-x-1.5 shrink-0"
            >
              <Package className="h-4 w-4" />
              <span>+ Create Batch</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            {['All', 'Harvested', 'Quality Checked', 'Processed', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Batch ID, Beekeeper..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Honey Batches Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider font-mono">
                <th className="py-3 px-3">Batch ID</th>
                <th className="py-3 px-3">Floral Source</th>
                <th className="py-3 px-3">Origin Location</th>
                <th className="py-3 px-3">Hive</th>
                <th className="py-3 px-3">Harvest Date</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3">Quality</th>
                <th className="py-3 px-3">Blockchain</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredBatches.map((b) => {
                const isSelected = batchData?.batch?.id === b.id;
                return (
                  <tr
                    key={b.id}
                    onClick={() => loadBatchTrace(b.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/70 border-l-4 border-l-amber-500 font-bold' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3 px-3 font-black text-amber-900">{b.id}</td>
                    <td className="py-3 px-3 font-sans font-bold text-slate-900">{b.floral_source}</td>
                    <td className="py-3 px-3 font-sans text-slate-600 truncate max-w-xs">{b.location}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{b.hive_id || 'HIVE-007'}</td>
                    <td className="py-3 px-3 text-slate-500">{b.extraction_date}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-amber-900">{b.quantity_kg} kg</td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded border border-emerald-200 font-sans">
                        {b.initial_quality_grade || 'Grade A+'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-700 text-[10px] font-bold flex items-center space-x-1 font-sans">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Minted</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadBatchTrace(b.id);
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-colors"
                      >
                        Inspect Journey
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 text-amber-600 animate-spin" />
        </div>
      )}

      {/* 2. Selected Batch Detailed Supply-Chain Journey */}
      {!loading && batchData && batchData.batch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Batch Header Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black text-amber-900 font-mono">{batchData.batch.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    batchData.authentic 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-red-50 text-red-800 border border-red-300'
                  }`}>
                    {batchData.authentic ? '● VERIFIED AUTHENTIC HONEY' : '⚠ VERIFICATION FAILED'}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Honey Type: <strong className="text-amber-900">{batchData.batch.floral_source}</strong> | Beekeeper: <strong>{batchData.batch.beekeeper_name}</strong> | Apiary: <strong>{batchData.batch.apiary_name}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('verify')}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-2xs"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Consumer QR Passport</span>
                </button>
              </div>
            </div>

            {/* End-to-End Supply Chain Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Link className="h-4 w-4 text-amber-600" />
                <span>Supply Chain Lifecycle & Cryptographic Timeline</span>
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {batchData.timeline.map((item: any, idx: number) => (
                  <div key={idx} className="relative flex items-start space-x-4">
                    <div className={`absolute -left-6 top-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shadow-2xs ${
                      item.completed 
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      <span>{item.icon}</span>
                    </div>

                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{item.title}</span>
                        <span className="text-[11px] font-semibold text-slate-500 font-mono flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{item.date}</span>
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 font-medium">
                        <span className="text-slate-900 font-bold">{item.actor}</span> — {item.location}
                      </div>

                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 font-mono">
                        {item.details}
                      </p>

                      {item.block && (
                        <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-200/60 mt-2">
                          <span className="font-bold text-amber-800">Block #{item.block.block_index}</span>
                          <span className="truncate max-w-xs text-slate-500" title={item.block.current_hash}>
                            Hash: {item.block.current_hash.substring(0, 16)}...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Supply Chain Map & Quality Report */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <MapPin className="h-4 w-4 text-amber-600" />
                <span>Geographic Supply Chain Route</span>
              </h3>

              <div className="h-64 rounded-xl overflow-hidden border border-slate-200 relative">
                {(() => {
                  const coords = getMapCoordinates(batchData.batch);
                  return (
                    <MapContainer
                      center={coords.apiaryPos}
                      zoom={7}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Marker position={coords.apiaryPos}>
                        <Popup>🐝 Apiary Harvest: {batchData.batch.apiary_name}</Popup>
                      </Marker>
                      <Marker position={coords.labPos}>
                        <Popup>🧪 Quality Testing Lab</Popup>
                      </Marker>
                      <Marker position={coords.procPos}>
                        <Popup>🏭 Processing Unit</Popup>
                      </Marker>
                      <Polyline
                        positions={[coords.apiaryPos, coords.labPos, coords.procPos]}
                        color="#d97706"
                        weight={3}
                        dashArray="6, 6"
                      />
                    </MapContainer>
                  );
                })()}
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-semibold">Origin Location:</span>
                  <span className="font-bold text-slate-900">{batchData.batch.location}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg font-mono">
                  <span className="font-semibold font-sans">GPS Coordinates:</span>
                  <span className="text-slate-900">{batchData.batch.gps_lat}, {batchData.batch.gps_lng}</span>
                </div>
              </div>
            </div>

            {batchData.quality && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Lab Quality Certification</span>
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <div className="text-slate-400 text-[10px] font-sans font-semibold uppercase">Purity Level</div>
                    <div className="font-black text-emerald-700 text-base">{batchData.quality.purity_pct}%</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <div className="text-slate-400 text-[10px] font-sans font-semibold uppercase">Moisture</div>
                    <div className="font-black text-slate-900 text-base">{batchData.quality.moisture_pct}%</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <div className="text-slate-400 text-[10px] font-sans font-semibold uppercase">pH Level</div>
                    <div className="font-extrabold text-slate-900">{batchData.quality.ph_level}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <div className="text-slate-400 text-[10px] font-sans font-semibold uppercase">NMR Adulteration</div>
                    <div className="font-extrabold text-emerald-700 font-sans text-[11px]">{batchData.quality.adulteration_test}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
