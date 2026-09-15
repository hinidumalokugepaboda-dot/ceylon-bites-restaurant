import React, { useState } from 'react';
import { Order } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { X, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

interface ReceptionConfirmModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceptionConfirmModal: React.FC<ReceptionConfirmModalProps> = ({ order, onClose }) => {
  const { confirmReceptionOrder } = useRestaurant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await confirmReceptionOrder(order.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to confirm order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={isSubmitting ? undefined : onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Confirm Order</h2>
              <p className="text-sm font-medium text-slate-500">
                Order #{order.orderNumber} &middot; Table {order.tableNumber || 'N/A'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-2 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              Order Summary
            </h3>
            <div className="space-y-3 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex gap-2">
                    <span className="font-medium text-slate-700">{item.quantity}x</span>
                    <span className="text-slate-600">{item.food.name}</span>
                  </div>
                  <span className="font-medium text-slate-700">Rs. {item.itemTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-1">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Payment Method</span>
                <span className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'Unknown'}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base mt-1">
                <span>Total Amount</span>
                <span>Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <p className="text-sm font-medium">
              This order will be sent to the kitchen for preparation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-200/50 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm & Send to Kitchen'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
