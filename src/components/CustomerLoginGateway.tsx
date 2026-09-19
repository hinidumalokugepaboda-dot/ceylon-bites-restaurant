import React, { useState } from 'react';
import { Flame, Phone, Lock, User, Eye, EyeOff, AlertCircle, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const CustomerLoginGateway: React.FC = () => {
  const {
    tableNumber,
    loginCustomerWithPassword,
    signUpCustomer,
    setActiveView
  } = useRestaurant();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = loginCustomerWithPassword(phone.trim(), password);
      if (res.success) {
        setSuccess('Welcome! Entering dining session...');
      } else {
        setError(res.message || 'Invalid phone number or password. If you are a new guest, please register below.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = signUpCustomer(name.trim(), phone.trim(), password);
      if (res.success) {
        setSuccess('Account created! Welcome to Ceylon Bites.');
      } else {
        setError(res.message || 'Could not register account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setMode('login');
    setPhone('077 123 4567');
    setPassword('demo123');
    setError('');
    // Auto sign in directly for convenience
    loginCustomerWithPassword('0771234567', 'demo123');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between selection:bg-[#c5a059] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-[#c5a059]/40 p-0.5">
            <div className="w-full h-full bg-[#141414] rounded-full flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#c5a059]" />
            </div>
          </div>
          <div>
            <span className="font-serif tracking-[0.16em] text-sm sm:text-base font-bold text-white">
              CEYLON <span className="text-[#c5a059]">BITES & SIZZLE</span>
            </span>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500">
              Modern Sri Lankan BYOB & Dining
            </p>
          </div>
        </div>

        {/* Staff portal shortcut */}
        <button
          onClick={() => setActiveView('login')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#c5a059]/40 text-[11px] text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
          <span className="hidden sm:inline">Staff Access</span>
        </button>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md space-y-6">

          {/* Table Verification Hero Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-full text-xs font-bold text-[#c5a059]">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
              <span>Digital Table Ordering &bull; Table #{tableNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Customer Sign In' : 'Guest Registration'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xs mx-auto">
              {mode === 'login'
                ? 'Sign in with your mobile number to view the digital menu and place orders.'
                : 'Create your dining account in seconds to start ordering directly to your table.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#141416] border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#c5a059] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In (Existing)
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#c5a059] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register (New Guest)
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs sm:text-sm text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs sm:text-sm text-emerald-300">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Forms */}
          <div className="bg-[#111114] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            {mode === 'login' ? (
              /* ============= LOGIN FORM ============= */
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setError(''); }}
                      placeholder="e.g. 077 123 4567"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                      autoComplete="tel"
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
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Enter your password"
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
                  className="w-full py-3.5 bg-[#c5a059] hover:bg-[#d6b26b] disabled:opacity-50 text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? 'Signing In...' : `Sign In & Enter Table #${tableNumber}`}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 1-Tap Demo Customer Fill */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="w-full py-2.5 bg-white/5 hover:bg-[#c5a059]/15 border border-white/10 hover:border-[#c5a059]/40 text-[#c5a059] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⚡ 1-Tap Demo Customer Sign-In</span>
                  </button>
                  <p className="text-[10px] text-gray-500 text-center">
                    Demo Credentials: <span className="text-gray-300 font-mono">0771234567</span> &bull; Password: <span className="text-gray-300 font-mono">demo123</span>
                  </p>
                </div>
              </form>
            ) : (
              /* ============= REGISTRATION FORM ============= */
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      placeholder="e.g. Kavindu Senanayake"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setError(''); }}
                      placeholder="e.g. 077 987 6543"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Minimum 4 characters"
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors"
                      autoComplete="new-password"
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

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#c5a059] hover:bg-[#d6b26b] disabled:opacity-50 text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? 'Creating Account...' : `Register & Start Dining`}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Footer Toggle text */}
          <div className="text-center text-xs text-gray-500">
            {mode === 'login' ? (
              <p>
                First time dining with us?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="text-[#c5a059] font-bold hover:underline cursor-pointer"
                >
                  Register an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-[#c5a059] font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 text-center border-t border-white/5 text-[11px] text-gray-600">
        &copy; {new Date().getFullYear()} Ceylon Bites & Sizzle. All rights reserved.
      </footer>
    </div>
  );
};
