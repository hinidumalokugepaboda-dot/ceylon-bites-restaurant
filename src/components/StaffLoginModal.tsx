import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ChefHat, 
  Store, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const StaffLoginModal: React.FC = () => {
  const { 
    isStaffModalOpen, 
    setIsStaffModalOpen, 
    staffUser, 
    loginStaff, 
    loginAsRole, 
    logoutStaff,
    setActiveView
  } = useRestaurant();

  const [staffCode, setStaffCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isStaffModalOpen) return null;

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!staffCode.trim()) {
      setError('Please enter your Staff ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginStaff(staffCode, password);
      if (result.success) {
        setIsStaffModalOpen(false);
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRoleSelect = (role: 'admin' | 'reception' | 'kitchen') => {
    loginAsRole(role);
    setIsStaffModalOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={() => setIsStaffModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-lg bg-[#111114] border border-[#c5a059]/40 rounded-2xl shadow-2xl text-left overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#16161a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1f1a10] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Staff Portal Login</h3>
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 border border-[#c5a059]/40 text-[#c5a059] bg-[#0c0c0e] rounded">
                  Official
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Select a role or sign in with your Staff ID</p>
            </div>
          </div>

          <button
            onClick={() => setIsStaffModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Active session banner if already logged in */}
          {staffUser.isLoggedIn && (
            <div className="p-3.5 rounded-xl bg-[#1c1912] border border-[#c5a059]/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
                  {staffUser.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> :
                   staffUser.role === 'reception' ? <Store className="w-4 h-4" /> :
                   <ChefHat className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Logged in as <span className="text-[#c5a059]">{staffUser.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 capitalize">
                    Current Active Role: <strong className="text-gray-200">{staffUser.role === 'reception' ? 'Cashier / Reception' : staffUser.role}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveView(staffUser.role === 'admin' ? 'admin' : staffUser.role === 'reception' ? 'reception' : 'kitchen');
                    setIsStaffModalOpen(false);
                  }}
                  className="px-2.5 py-1.5 bg-[#c5a059] hover:bg-[#d6b26b] text-black text-xs font-bold rounded-lg shadow transition-all cursor-pointer"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => logoutStaff()}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Quick 1-Click Role Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Role Access</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Click to enter portal</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Admin */}
              <button
                onClick={() => handleQuickRoleSelect('admin')}
                className="p-3 bg-[#16161a] hover:bg-[#1f1b13] border border-white/10 hover:border-[#c5a059]/60 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#c5a059] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#c5a059]">Admin</div>
                  <div className="text-[10px] text-gray-400 leading-tight mt-0.5">Sales & Management</div>
                </div>
              </button>

              {/* Kitchen */}
              <button
                onClick={() => handleQuickRoleSelect('kitchen')}
                className="p-3 bg-[#16161a] hover:bg-[#131922] border border-white/10 hover:border-sky-500/60 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-sky-400">Kitchen</div>
                  <div className="text-[10px] text-gray-400 leading-tight mt-0.5">Live Cooking KDS</div>
                </div>
              </button>

              {/* Reception / Cashier */}
              <button
                onClick={() => handleQuickRoleSelect('reception')}
                className="p-3 bg-[#16161a] hover:bg-[#111e16] border border-white/10 hover:border-emerald-500/60 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Store className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400">Cashier</div>
                  <div className="text-[10px] text-gray-400 leading-tight mt-0.5">Orders & Billing</div>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[#111114] px-3 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              Or Sign In With Staff ID
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-3.5" noValidate>
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                Staff ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={staffCode}
                  onChange={(e) => {
                    setStaffCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="e.g. ADMIN001, KIT001, REC001"
                  className="w-full bg-[#16161a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter staff password"
                  className="w-full bg-[#16161a] border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#c5a059] hover:bg-[#d6b26b] active:bg-[#b08d48] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In & Open Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
