import React, { useState } from 'react';
import { Award, Sparkles, Gift, Check, ArrowRight, History, Shield, Zap } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { RewardVoucher } from '../types';

export const LoyaltySection: React.FC = () => {
  const { loyalty, redeemLoyaltyInCart, setIsCartOpen, appliedLoyaltyDiscount } = useRestaurant();
  const [redeemedId, setRedeemedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const handleRedeem = (reward: RewardVoucher) => {
    if (loyalty.points >= reward.pointsCost) {
      redeemLoyaltyInCart(reward.pointsCost);
      setRedeemedId(reward.id);
      setTimeout(() => {
        setIsCartOpen(true);
      }, 600);
    }
  };

  const progressPercent = Math.min(100, Math.round((loyalty.points / loyalty.nextTierPoints) * 100));

  return (
    <section id="loyalty-section" className="py-12 md:py-16 bg-[#0f0f12] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" /> Ceylon Bites Rewards
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
            Order More. <span className="text-amber-400">Earn More.</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Earn 10 points for every Rs. 100 spent on table dining. Redeem instantly for cash discounts and complimentary dishes.
          </p>
        </div>

        {/* Loyalty Points Status Card */}
        <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#181611] border border-amber-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Points & Tier */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Membership Status
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black uppercase">
                      {loyalty.tier} Foodie
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                    {loyalty.points.toLocaleString()} <span className="text-amber-400 text-lg font-bold">Reward Points</span>
                  </h3>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 max-w-lg">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Current: {loyalty.points} pts</span>
                  <span>Next Tier (Platinum): {loyalty.nextTierPoints} pts</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-zinc-400">
                  Only <strong className="text-amber-400">{loyalty.nextTierPoints - loyalty.points} points</strong> away from unlocked VIP dining perks & 15% birthday rebates!
                </div>
              </div>
            </div>

            {/* Right: Quick Stats & Toggle History */}
            <div className="md:col-span-5 bg-zinc-950/80 rounded-xl p-4 border border-zinc-800 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-xs text-zinc-400">Total Spent</div>
                  <div className="text-sm sm:text-base font-black text-white font-heading mt-0.5">
                    Rs. {loyalty.totalSpent.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-xs text-zinc-400">Table Orders</div>
                  <div className="text-sm sm:text-base font-black text-amber-400 font-heading mt-0.5">
                    {loyalty.ordersCount} Visits
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHistory ? 'Hide Points Log' : 'View Points History'}</span>
              </button>
            </div>
          </div>

          {/* Points History Collapsible Drawer */}
          {showHistory && (
            <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2 animate-in fade-in">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                Recent Points Activity
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {loyalty.history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-zinc-200">{h.title}</div>
                      <div className="text-[10px] text-zinc-500">{h.date}</div>
                    </div>
                    <span
                      className={`font-black ${
                        h.points >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {h.points >= 0 ? `+${h.points}` : h.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Redeemable Rewards Grid */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-heading">
              Available Rewards To Redeem
            </h3>
            {appliedLoyaltyDiscount > 0 && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/80">
                Rs. {appliedLoyaltyDiscount} Discount Applied in Cart
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loyalty.rewards.map((reward) => {
              const canRedeem = loyalty.points >= reward.pointsCost;
              const isRedeemed = redeemedId === reward.id;

              return (
                <div
                  key={reward.id}
                  id={`reward-card-${reward.id}`}
                  className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all duration-300 ${
                    canRedeem
                      ? 'bg-zinc-900/90 border-zinc-800 hover:border-amber-500/40'
                      : 'bg-zinc-950/50 border-zinc-850 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Gift className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                        {reward.pointsCost} Points
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base font-heading">
                      {reward.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canRedeem}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow ${
                      isRedeemed
                        ? 'bg-emerald-500 text-black'
                        : canRedeem
                        ? 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {isRedeemed ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" /> Redeemed to Cart!
                      </>
                    ) : canRedeem ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Redeem Now
                      </>
                    ) : (
                      `Need ${reward.pointsCost - loyalty.points} more pts`
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
