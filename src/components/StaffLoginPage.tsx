import React, { useState } from 'react';
import { Flame, Lock, User, Eye, EyeOff, ArrowLeft, ChefHat, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const StaffLoginPage: React.FC = () => {
  const { loginStaff, setActiveView, staffUser } = useRestaurant();

  const [staffCode, setStaffCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect
  React.useEffect(() => {
    if (staffUser.isLoggedIn) {
      const nextView = staffUser.role === 'admin' ? 'admin' : staffUser.role === 'reception' ? 'reception' : 'kitchen';
      setActiveView(nextView);
    }
  }, [staffUser.isLoggedIn, staffUser.role, setActiveView]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        // Context will update staffUser; the useEffect above will redirect
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top bar — consistent with restaurant nav */}
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
                Staff Portal
              </p>
            </div>
          </div>

          {/* Back to restaurant */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Restaurant
          </button>
        </div>
      </div>

      {/* Login content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#c5a059]/30 flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-8 h-8 text-[#c5a059]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Staff Login
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign in with your Staff ID and password
              </p>
            </div>
          </div>

          {/* Role cards — informational */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#111111] border border-white/8 rounded-xl text-center">
              <ShieldCheck className="w-5 h-5 text-[#c5a059] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">Admin</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Full access</div>
            </div>
            <div className="p-3 bg-[#111111] border border-white/8 rounded-xl text-center">
              <User className="w-5 h-5 text-[#c5a059] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">Reception</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Orders & payment</div>
            </div>
            <div className="p-3 bg-[#111111] border border-white/8 rounded-xl text-center">
              <ChefHat className="w-5 h-5 text-[#c5a059] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">Kitchen</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Prep & service</div>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-950/60 border border-red-800/60 rounded-xl text-sm text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Staff ID */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                Staff ID
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={staffCode}
                  onChange={(e) => { setStaffCode(e.target.value.toUpperCase()); setError(''); }}
                  placeholder="e.g. ADMIN001 or KIT001"
                  className="w-full bg-[#111111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                  autoComplete="username"
                  autoFocus
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
                  placeholder="Enter your password"
                  className="w-full bg-[#111111] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
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
              className="w-full py-3.5 bg-[#c5a059] hover:bg-[#d6b26b] active:bg-[#b08d48] text-black font-extrabold text-sm uppercase tracking-[0.15em] rounded-xl shadow-lg shadow-[#c5a059]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In to Staff Portal
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="p-4 bg-[#0e0e0e] border border-[#c5a059]/20 rounded-xl space-y-2.5">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#c5a059]">
              Demo Credentials
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Admin:</span>
                  <code className="font-mono text-white bg-white/5 px-1.5 py-0.5 rounded">ADMIN001</code>
                </div>
                <code className="font-mono text-gray-300 bg-white/5 px-1.5 py-0.5 rounded">admin123</code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Reception:</span>
                  <code className="font-mono text-white bg-white/5 px-1.5 py-0.5 rounded">REC001</code>
                </div>
                <code className="font-mono text-gray-300 bg-white/5 px-1.5 py-0.5 rounded">reception123</code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <ChefHat className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Kitchen:</span>
                  <code className="font-mono text-white bg-white/5 px-1.5 py-0.5 rounded">KIT001</code>
                </div>
                <code className="font-mono text-gray-300 bg-white/5 px-1.5 py-0.5 rounded">kitchen123</code>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-600">
            This portal is for authorized restaurant staff only.
          </p>
        </div>
      </div>
    </div>
  );
};
