import React, { useState } from 'react';
import { X, XCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { useRestaurant } from '../context/RestaurantContext';

interface RejectOrderModalProps {
  order: Order;
  onClose: () => void;
}

const QUICK_REASONS = [
  'Item currently unavailable',
  'Kitchen at full capacity',
  'Closing time — cannot prepare',
  'Ingredient out of stock',
];

export const RejectOrderModal: React.FC<RejectOrderModalProps> = ({ order, onClose }) => {
  const { rejectOrder } = useRestaurant();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleReject = async () => {
    if (!reason.trim()) {
      setError('A rejection reason is required. Please describe why the order cannot be fulfilled.');
      return;
    }
    if (reason.trim().length < 10) {
      setError('Please provide a more detailed reason (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await rejectOrder(order.id, reason.trim());
      onClose();
    } catch {
      setError('Failed to reject order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-red-100 flex items-center justify-between bg-red-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reject Order</h3>
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
          {/* Warning */}
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              The customer will be notified with your rejection reason. Please be clear and respectful.
            </p>
          </div>

          {/* Order summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Order Items</span>
            <div className="space-y-1">
              {order.items.slice(0, 4).map((item) => (
                <div key={item.cartItemId} className="text-xs text-slate-700">
                  {item.quantity}× {item.food.name}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="text-[11px] text-slate-500">+{order.items.length - 4} more items</div>
              )}
            </div>
          </div>

          {/* Quick reason buttons */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
              Quick Reasons
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setReason(r); setError(''); }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    reason === r
                      ? 'bg-red-50 border-red-300 text-red-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom reason textarea */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              placeholder="e.g. Chicken Kottu is currently unavailable. We apologise for the inconvenience."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 resize-none"
            />
            <span className="text-[10px] text-slate-500 block text-right">{reason.length} chars</span>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

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
              onClick={handleReject}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <XCircle className="w-4 h-4" />
              {isSubmitting ? 'Rejecting...' : 'Reject Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
