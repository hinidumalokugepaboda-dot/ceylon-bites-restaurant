import React from 'react';
import { Target, AlertTriangle, CheckCircle2, ShoppingBag, X, ArrowUpRight, Flame } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const StickyBudgetTracker: React.FC<{ onNavigate?: (section: string) => void }> = ({ onNavigate }) => {
  const { 
    targetBudget, 
    setTargetBudget, 
    cartSubtotal, 
    finalCartTotal, 
    setIsCartOpen,
    targetHeadcount
  } = useRestaurant();

  if (!targetBudget || targetBudget <= 0) return null;

  const currentTotal = finalCartTotal;
  const isOver = currentTotal > targetBudget;
  const overAmount = isOver ? currentTotal - targetBudget : 0;
  const remaining = isOver ? 0 : targetBudget - currentTotal;
  const percentage = Math.min(100, Math.round((currentTotal / targetBudget) * 100));

  // Determine status color
  const getStatusColor = () => {
    if (isOver) return 'bg-red-500 shadow-red-500/50';
    if (percentage > 85) return 'bg-amber-400 shadow-amber-400/50';
    return 'bg-emerald-400 shadow-emerald-400/50';
  };

  const getBorderColor = () => {
    if (isOver) return 'border-red-500/50 bg-red-950/40';
    if (percentage > 85) return 'border-amber-500/40 bg-amber-950/20';
    return 'border-[#c5a059]/40 bg-[#141414]/95';
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div 
        className={`p-3.5 sm:p-4 backdrop-blur-xl border shadow-2xl rounded-none transition-all duration-300 ${getBorderColor()}`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${getStatusColor()}`} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[#c5a059]" />
              Table Budget Tracker
            </span>
            {targetHeadcount > 0 && (
              <span className="text-[9px] bg-white/10 px-1.5 py-0.2 text-gray-300">
                {targetHeadcount}p
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate ? onNavigate('budget') : document.getElementById('budget-optimizer-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[9px] uppercase tracking-wider text-[#c5a059] hover:underline font-bold flex items-center gap-0.5"
            >
              Adjust <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => setTargetBudget(null)}
              className="text-gray-500 hover:text-white p-1 transition-colors"
              title="Dismiss Budget Tracker"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Numbers Row */}
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-serif font-bold text-white">
              Rs. {currentTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 font-light">
              / Rs. {targetBudget.toLocaleString()}
            </span>
          </div>

          <div>
            {isOver ? (
              <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 flex items-center gap-1 bg-red-950/80 px-2 py-0.5 border border-red-800/40 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> +Rs. {overAmount.toLocaleString()} OVER
              </span>
            ) : (
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800/40">
                <CheckCircle2 className="w-3 h-3" /> Rs. {remaining.toLocaleString()} left
              </span>
            )}
          </div>
        </div>

        {/* Visual Progress Track */}
        <div className="w-full h-1.5 bg-black/60 overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-300 ${getStatusColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Quick Cart Trigger */}
        <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-white/5">
          <span className="text-gray-400 font-light">
            {percentage}% of target limit utilized
          </span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-white hover:text-[#c5a059] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <ShoppingBag className="w-3 h-3 text-[#c5a059]" /> View Cart
          </button>
        </div>
      </div>
    </div>
  );
};
