import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, QrCode, Filter, Search } from 'lucide-react';
import { apiFetch } from '../apiFetch';

interface Product {
  id: string;
  batch_id: string;
  name: string;
  honey_type: string;
  price_inr: number;
  package_size: string;
  beekeeper_name: string;
  location: string;
}

interface MarketplaceViewProps {
  onNavigate: (tab: string, batchId?: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    apiFetch('/api/marketplace')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = products.filter((p) => {
    const matchesFilter = filterType === 'All' || p.honey_type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.beekeeper_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Direct Beekeeper Honey Marketplace</h2>
            <p className="text-xs text-slate-500">
              100% Traceable, Lab-Tested Pure Honey Direct from Verified Indian Beekeepers
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search honey or farm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
        {['All', 'Wildflower', 'Neem', 'Lychee', 'Mustard', 'Jamun'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
              filterType === t
                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-900 text-xs bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                  {p.batch_id}
                </span>
                <span className="flex items-center space-x-1 text-emerald-800 bg-emerald-50 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>FSSAI VERIFIED</span>
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  👨‍🌾 {p.beekeeper_name} • 📍 {p.location}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Package Size:</span>
                  <span className="font-bold text-slate-900">{p.package_size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Direct Farm Price:</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm">₹{p.price_inr}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigate('verify', p.batch_id)}
                className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>Verify Passport</span>
              </button>

              <button
                onClick={() => alert(`Purchasing batch ${p.batch_id} (${p.name}). Direct order submitted to ${p.beekeeper_name}.`)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center space-x-1"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Order Honey</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
