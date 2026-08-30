import React, { useState } from 'react';
import { X, User, Phone, Mail, Award, History, LogOut, Check, Sparkles } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    customerUser,
    setCustomerUser,
    loyalty,
    orderHistory,
    setActiveView
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [editName, setEditName] = useState(customerUser.name || 'Kavindu Senanayake');
  const [editPhone, setEditPhone] = useState(customerUser.phone || '077 123 4567');
  const [editEmail, setEditEmail] = useState(customerUser.email || 'kavindu@ceylonbites.lk');
  const [isSaved, setIsSaved] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerUser({
      name: editName,
      phone: editPhone,
      email: editEmail,
      isLoggedIn: true
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsAuthModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="auth-modal-container"
        className="relative w-full max-w-lg bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-left space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Foodie Profile & Loyalty
              </h3>
              <span className="text-[11px] text-zinc-400">
                Tier: <strong className="text-amber-400 uppercase">{loyalty.tier} Member</strong>
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Order History ({orderHistory.length})</span>
          </button>
        </div>

        {/* Tab 1: Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">
                  Reward Balance
                </span>
                <span className="text-xl font-black text-amber-400 font-heading">
                  {loyalty.points.toLocaleString()} Points
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setActiveView('loyalty');
                }}
                className="text-xs bg-amber-500 text-black font-bold px-3 py-1.5 rounded-lg shadow"
              >
                Redeem Rewards
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                  Mobile Number (For Table Notifications)
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> Saved Profile!
                </>
              ) : (
                'Save Profile Info'
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Order History List */}
        {activeTab === 'orders' && (
          <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
            {orderHistory.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-500">
                No past orders recorded yet.
              </div>
            ) : (
              orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Order #{order.orderNumber}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">Table {order.tableNumber}</span>
                    </div>
                    <span className="font-black text-amber-400">
                      Rs. {order.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-400 truncate">
                    {order.items.map((i) => `${i.quantity}x ${i.food.name}`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-850 text-[10px] text-zinc-500">
                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="capitalize text-emerald-400 font-semibold">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
