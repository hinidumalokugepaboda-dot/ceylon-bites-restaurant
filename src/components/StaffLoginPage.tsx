import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ChefHat, 
  ShieldCheck, 
  AlertCircle,
  Store,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { StaffRole } from '../types';

export const StaffLoginPage: React.FC = () => {
  const { loginStaff, setActiveView, staffUser, logoutStaff } = useRestaurant();

  const [selectedRole, setSelectedRole] = useState<'admin' | 'kitchen' | 'cashier'>('admin');
  const [staffCode, setStaffCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // NOTE: Never auto-redirect on mount so visiting /staff always lands on the login screen

  const handleRoleSelect = (role: 'admin' | 'kitchen' | 'cashier') => {
    handleQuickFill(role);
  };

  const handleQuickFill = (role: 'admin' | 'kitchen' | 'cashier') => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setStaffCode('ADMIN001');
      setPassword('admin123');
    } else if (role === 'kitchen') {
      setStaffCode('KIT001');
      setPassword('kitchen123');
    } else if (role === 'cashier') {
      setStaffCode('CASH001');
      setPassword('cashier123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!staffCode.trim()) {
      setError('Please enter your Staff ID or Username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      // Validate credentials — loginStaff checks account and returns the assigned role
      const result = await loginStaff(staffCode.trim(), password);
      if (result.success) {
        // Automatically decide and navigate to the dashboard matching the user's role
        const targetView = (result.role as 'admin' | 'kitchen' | 'cashier') || selectedRole;
        setActiveView(targetView);
      } else {
        setError(result.message || 'Invalid Staff ID or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#c5a059]/40 p-0.5">
              <div className="w-full h-full bg-[#141414] rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#c5a059]" />
              </div>
            </div>
            <div>
              <span className="font-serif tracking-[0.18em] text-base text-white font-bold">
                CEYLON <span className="text-[#c5a059]">BITES</span>
              </span>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 hidden sm:block">
                Staff Authentication Portal
              </p>
            </div>
          </div>

          {/* Back to restaurant */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Restaurant
          </button>
        </div>
      </div>

      {/* Login content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Restaurant Staff Gateway
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Enter your Staff ID & Password to access your assigned dashboard
            </p>
          </div>

          {/* Active Session Status (if previously signed in) */}
          {staffUser.isLoggedIn && (
            <div className="p-3.5 bg-[#18181b] border border-[#c5a059]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                <span className="text-gray-300">
                  Active session: <strong className="text-white">{staffUser.name}</strong> ({staffUser.role.toUpperCase()})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView(staffUser.role === 'admin' ? 'admin' : staffUser.role === 'kitchen' ? 'kitchen' : 'cashier')}
                  className="px-3 py-1.5 bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] border border-[#c5a059]/40 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Go to {staffUser.role.toUpperCase()} &rarr;
                </button>
                <button
                  type="button"
                  onClick={logoutStaff}
                  className="px-2.5 py-1.5 text-gray-400 hover:text-white text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Three Distinct Role Selection Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Admin */}
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-[#181510] border-[#c5a059] shadow-lg shadow-[#c5a059]/10 ring-1 ring-[#c5a059]'
                  : 'bg-[#111114] border-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
                </div>
                {selectedRole === 'admin' && (
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
                )}
              </div>
              <div className="text-sm font-bold text-white">Admin</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#c5a059] mt-0.5">
                /admin
              </div>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                Sales, RBAC Staff Accounts & System Management
              </p>
            </button>

            {/* 2. Kitchen */}
            <button
              type="button"
              onClick={() => handleRoleSelect('kitchen')}
              className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                selectedRole === 'kitchen'
                  ? 'bg-[#0f1720] border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500'
                  : 'bg-[#111114] border-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-sky-400" />
                </div>
                {selectedRole === 'kitchen' && (
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                )}
              </div>
              <div className="text-sm font-bold text-white">Kitchen</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-sky-400 mt-0.5">
                /kitchen
              </div>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                Live Cooking KDS, Preparation & Order Status
              </p>
            </button>

            {/* 3. Cashier */}
            <button
              type="button"
              onClick={() => handleRoleSelect('cashier')}
              className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                selectedRole === 'cashier'
                  ? 'bg-[#0e1b15] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'bg-[#111114] border-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <Store className="w-5 h-5 text-emerald-400" />
                </div>
                {selectedRole === 'cashier' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="text-sm font-bold text-white">Cashier</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 mt-0.5">
                /cashier
              </div>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                Orders, Pending Table Settlements & Billing
              </p>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-[#111114] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Sign in to <span className="text-white capitalize font-black">{selectedRole} Portal</span>
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                Access: /{selectedRole}
              </span>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-950/60 border border-red-800/60 rounded-xl text-xs sm:text-sm text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Staff ID */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                Staff ID / Code
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={staffCode}
                  onChange={(e) => { setStaffCode(e.target.value.toUpperCase()); setError(''); }}
                  placeholder="e.g. ADMIN001 or KIT001"
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.15em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                selectedRole === 'admin'
                  ? 'bg-[#c5a059] hover:bg-[#d6b26b]'
                  : selectedRole === 'kitchen'
                  ? 'bg-sky-400 hover:bg-sky-300'
                  : 'bg-emerald-400 hover:bg-emerald-300'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Open {selectedRole.toUpperCase()} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Footer */}
          <div className="p-4 bg-[#111114] border border-white/5 rounded-2xl space-y-2">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
              Quick Switch Credentials:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2 bg-black/40 border border-white/5 rounded-lg text-left text-xs hover:border-[#c5a059]/40 transition-colors cursor-pointer"
              >
                <span className="text-[#c5a059] font-bold block">Admin</span>
                <span className="text-gray-400 font-mono text-[11px]">ADMIN001 / admin123</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('kitchen')}
                className="p-2 bg-black/40 border border-white/5 rounded-lg text-left text-xs hover:border-sky-500/40 transition-colors cursor-pointer"
              >
                <span className="text-sky-400 font-bold block">Kitchen</span>
                <span className="text-gray-400 font-mono text-[11px]">KIT001 / kitchen123</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('cashier')}
                className="p-2 bg-black/40 border border-white/5 rounded-lg text-left text-xs hover:border-emerald-500/40 transition-colors cursor-pointer"
              >
                <span className="text-emerald-400 font-bold block">Cashier</span>
                <span className="text-gray-400 font-mono text-[11px]">CASH001 / cashier123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
