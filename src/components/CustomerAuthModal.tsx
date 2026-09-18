import React, { useState } from 'react';
import { X, User, Phone, Lock, History, LogOut, Check, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    customerUser,
    tableNumber,
    orderHistory,
    signUpCustomer,
    loginCustomerWithPassword,
    logoutCustomer
  } = useRestaurant();

  // Auth form states (when not logged in)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Profile view states (when logged in)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!phone.trim()) {
      setAuthError('Please enter your mobile phone number.');
      return;
    }
    if (!password) {
      setAuthError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginCustomerWithPassword(phone.trim(), password);
      if (result.success) {
        setAuthSuccess('Logged in successfully!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 500);
      } else {
        setAuthError(result.message || 'Invalid phone number or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!name.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setAuthError('Please enter your mobile phone number.');
      return;
    }
    if (!password || password.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpCustomer(name.trim(), phone.trim(), password);
      if (result.success) {
        setAuthSuccess('Account created successfully!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 500);
      } else {
        setAuthError(result.message || 'Could not create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="auth-modal-container"
        className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-left space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center font-bold">
              <User className="w-4 h-4 text-[#c5a059]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                {customerUser.isLoggedIn ? 'Customer Profile' : 'Ceylon Bites Account'}
              </h3>
              <span className="text-[11px] text-zinc-400">
                {customerUser.isLoggedIn 
                  ? `Dining at Table #${tableNumber}` 
                  : 'Fast table ordering & order tracking'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= NOT LOGGED IN: LOGIN / SIGNUP ================= */}
        {!customerUser.isLoggedIn ? (
          <div className="space-y-4">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-[#c5a059] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#c5a059] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error or Success feedback */}
            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300">
                <Check className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Form */}
            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 077 123 4567"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your account password"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-[#c5a059] hover:bg-[#d6b26b] disabled:opacity-50 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                >
                  {isLoading ? 'Signing In...' : 'Sign In to Table Session'}
                </button>

                <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      loginCustomerWithPassword('0771234567', 'password123');
                    }}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-[#c5a059]/40 text-xs font-semibold text-[#c5a059] rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⚡ 1-Tap Quick Sign-In (Kavindu)</span>
                  </button>
                  <p className="text-[10px] text-zinc-500 text-center">
                    Demo: <code className="text-zinc-300">0771234567</code> / <code className="text-zinc-300">password123</code>
                  </p>
                </div>

                <p className="text-center text-[11px] text-zinc-500 pt-1">
                  New guest?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError('');
                    }}
                    className="text-[#c5a059] font-bold hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kasun Silva"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 077 123 4567"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-[#c5a059] hover:bg-[#d6b26b] disabled:opacity-50 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center text-[11px] text-zinc-500 pt-1">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError('');
                    }}
                    className="text-[#c5a059] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        ) : (
          /* ================= LOGGED IN PROFILE & ORDER HISTORY ================= */
          <div className="space-y-4">
            {/* Tab buttons */}
            <div className="flex gap-2 border-b border-zinc-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#c5a059] text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#c5a059] text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Order History ({orderHistory.length})</span>
              </button>
            </div>

            {activeTab === 'profile' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Account Holder</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      Logged In
                    </span>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">{customerUser.name}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{customerUser.phone}</div>
                  </div>
                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Current Dining Table:</span>
                    <span className="font-bold text-[#c5a059]">Table #{tableNumber}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logoutCustomer();
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full py-3 bg-zinc-900 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-zinc-800 hover:border-red-800/50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                {orderHistory.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-500">
                    No past orders recorded yet.
                  </div>
                ) : (
                  orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">Order #{order.orderNumber}</span>
                          <span className="text-[10px] text-zinc-500 ml-2">Table #{order.tableNumber}</span>
                        </div>
                        <span className="font-black text-[#c5a059]">
                          Rs. {order.total.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 truncate">
                        {order.items.map((i) => `${i.quantity}x ${i.food.name}`).join(', ')}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-[10px] text-zinc-500">
                        <span>{order.createdAt}</span>
                        <span className="capitalize text-emerald-400 font-semibold">{order.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
