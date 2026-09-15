import React, { useState } from 'react';
import { Order } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { X, AlertTriangle, AlertCircle } from 'lucide-react';

interface ReceptionCancelModalProps {
  order: Order;
  onClose: () => void;
}

const PRESET_REASONS = [
  'Payment not confirmed',
  'Customer requested cancellation',
  'Item unavailable',
  'Invalid order',
  'Other'
];

export const ReceptionCancelModal: React.FC<ReceptionCancelModalProps> = ({ order, onClose }) => {
  const { rejectReceptionOrder } = useRestaurant();
  const [reason, setReason] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== 'Other') {
      setReason(preset);
    } else {
      setReason('');
    }
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await rejectReceptionOrder(order.id, reason.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order.');
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
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cancel Order</h2>
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

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 mb-5">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-sm font-medium">
              The customer will be notified about the cancellation with your reason.
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Select a reason
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    selectedPreset === preset
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-semibold text-slate-700 mb-2">
              Reason details
            </label>
            <textarea
              id="reason"
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors resize-none"
              placeholder="Provide a detailed reason for cancellation..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (selectedPreset && e.target.value !== selectedPreset && selectedPreset !== 'Other') {
                  setSelectedPreset(null);
                }
              }}
              disabled={isSubmitting}
            />
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
            Back
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling...
              </>
            ) : (
              'Cancel Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
