import React, { useState } from 'react';
import { X, Clock, CheckCircle2, ChefHat, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { useRestaurant } from '../context/RestaurantContext';

interface AcceptOrderModalProps {
  order: Order;
  onClose: () => void;
}

const PREP_TIME_OPTIONS = [10, 15, 20, 25, 30];

export const AcceptOrderModal: React.FC<AcceptOrderModalProps> = ({ order, onClose }) => {
  const { acceptOrder } = useRestaurant();
  const [selectedTime, setSelectedTime] = useState<number>(20);
  const [customTime, setCustomTime] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [kitchenNote, setKitchenNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const effectiveTime = isCustom ? parseInt(customTime, 10) : selectedTime;

  const handleAccept = async () => {
    if (isCustom) {
      const t = parseInt(customTime, 10);
      if (!customTime || isNaN(t) || t <= 0 || t > 120) {
        setError('Please enter a valid preparation time between 1 and 120 minutes.');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');
    try {
      await acceptOrder(order.id, effectiveTime, kitchenNote.trim());
      onClose();
    } catch {
      setError('Failed to accept order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Accept Order</h3>
              <span className="text-[11px] text-slate-500">Order #{order.orderNumber} · Table {order.tableNumber}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg bg-slate-100 border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5 bg-white">
          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Order summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Order Summary</span>
            <div className="space-y-1">
              {order.items.slice(0, 4).map((item) => (
                <div key={item.cartItemId} className="text-xs text-slate-700">
                  {item.quantity}× {item.food.name}
                  {item.selectedPortion?.portionCode && (
                    <span className="ml-1.5 text-[10px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded">
                      {item.selectedPortion.portionCode}
                    </span>
                  )}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="text-[11px] text-slate-500">+{order.items.length - 4} more items</div>
              )}
            </div>
          </div>

          {/* Prep time selector */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#c5a059]" />
              <span className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
                Estimated Preparation Time
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {PREP_TIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setSelectedTime(t); setIsCustom(false); setError(''); }}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    !isCustom && selectedTime === t
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {t}m
                </button>
              ))}
            </div>

            {/* Custom time */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setIsCustom(true); setError(''); }}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  isCustom
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                Custom
              </button>
              {isCustom && (
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  placeholder="mins"
                  className="w-24 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              )}
              {!isCustom && (
                <span className="text-[11px] text-slate-500">
                  Selected: <strong className="text-slate-700">{selectedTime} minutes</strong>
                </span>
              )}
            </div>
          </div>

          {/* Kitchen note */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
              Kitchen Note <span className="normal-case font-normal text-slate-500">(optional — visible to customer)</span>
            </label>
            <textarea
              value={kitchenNote}
              onChange={(e) => setKitchenNote(e.target.value)}
              placeholder={`e.g. "Your order will be ready in approximately ${effectiveTime || 20} minutes. Enjoy!"`}
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Accepting...' : 'Accept Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
