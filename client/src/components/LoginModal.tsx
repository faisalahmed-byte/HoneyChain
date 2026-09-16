import React, { useState } from 'react';
import type { UserRole, BeekeeperProfile } from '../types';
import { ShieldCheck, UserCheck, Lock, User, X, ArrowRight } from 'lucide-react';
import { apiFetch } from '../apiFetch';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, user: { id: string; name: string }, loginType: 'ADMIN' | 'USER') => void;
  beekeepers?: BeekeeperProfile[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  beekeepers = []
}) => {
  const [activePortal, setActivePortal] = useState<'ADMIN' | 'USER'>('ADMIN');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [userRole, setUserRole] = useState<UserRole>('Beekeeper');
  const [selectedBeekeeperId, setSelectedBeekeeperId] = useState(beekeepers[0]?.id || 'BK-001');
  const [userNameInput, setUserNameInput] = useState('Ramesh Kumar');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const targetBeekeeper = beekeepers.find(b => b.id === selectedBeekeeperId);
    const body = activePortal === 'ADMIN'
      ? { loginType: 'ADMIN', username: adminUsername, password: adminPassword, role: 'Admin', userId: 'ADMIN-001' }
      : { 
          loginType: 'USER', 
          role: userRole, 
          userId: userRole === 'Beekeeper' && targetBeekeeper ? targetBeekeeper.id : 'USER-001',
          username: userRole === 'Beekeeper' && targetBeekeeper ? targetBeekeeper.name : userNameInput 
        };

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        onLoginSuccess(data.role, data.user, data.loginType);
        onClose();
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (e: any) {
      setLoading(false);
      setErrorMsg(`Network error: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header Banner */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black font-sans tracking-tight">HONEY CHAIN AUTHENTICATION</h2>
              <p className="text-xs text-slate-400 font-mono">Secure Access Control & Session Database Recording</p>
            </div>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="flex bg-slate-800 p-1 rounded-xl mt-4 border border-slate-700/80">
            <button
              type="button"
              onClick={() => { setActivePortal('ADMIN'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activePortal === 'ADMIN'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>🛡️ Admin Portal Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setActivePortal('USER'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activePortal === 'USER'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>👨‍🌾 Stakeholder User Login</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-800 flex items-center space-x-2">
              <X className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activePortal === 'ADMIN' ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium">
                <span className="font-extrabold block mb-0.5">⚙️ Administrator Privileges Access</span>
                Access full system overview, live Supabase database output, tamper detection suite, and SHA-256 blockchain ledger.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase font-mono block mb-1.5">Admin Username</label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase font-mono block mb-1.5">Admin Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                    placeholder="admin123"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Default credentials: admin / admin123</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase font-mono block mb-1.5">Select User Role</label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Beekeeper">👨‍🌾 Beekeeper (Harvest & Smart Hives)</option>
                  <option value="Processor">🧪 Quality & Processing Specialist</option>
                  <option value="Distributor">🚚 Cold-Chain Logistics Distributor</option>
                  <option value="Consumer">👤 Consumer Passport Verifier</option>
                </select>
              </div>

              {userRole === 'Beekeeper' && beekeepers.length > 0 ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase font-mono block mb-1.5">Select Registered Beekeeper Account</label>
                  <select
                    value={selectedBeekeeperId}
                    onChange={e => {
                      setSelectedBeekeeperId(e.target.value);
                      const bk = beekeepers.find(b => b.id === e.target.value);
                      if (bk) setUserNameInput(bk.name);
                    }}
                    className="w-full p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {beekeepers.map(bk => (
                      <option key={bk.id} value={bk.id}>
                        {bk.name} ({bk.location}) - {bk.apiaryName}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase font-mono block mb-1.5">Full Name / Stakeholder Entity</label>
                  <input
                    type="text"
                    value={userNameInput}
                    onChange={e => setUserNameInput(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Enter name"
                  />
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Authenticating & Recording Session...</span>
              ) : (
                <>
                  <span>Authenticate & Record in Database</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
