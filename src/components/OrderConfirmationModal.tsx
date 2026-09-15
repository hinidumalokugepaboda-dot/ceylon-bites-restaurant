import React from 'react';
import { CheckCircle2, Clock, MapPin, ArrowRight, Sparkles, Utensils } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const OrderConfirmationModal: React.FC = () => {
  const {
    isOrderConfirmationOpen,
    setIsOrderConfirmationOpen,
    activeOrder,
    setActiveView
  } = useRestaurant();

  if (!isOrderConfirmationOpen || !activeOrder) return null;

  const handleTrackOrder = () => {
    setIsOrderConfirmationOpen(false);
    setActiveView('tracking');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="order-confirmation-container"
        className="relative w-full max-w-lg bg-[#121215] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center space-y-6"
      >
        {/* Glowing Success Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 animate-pulse">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Order Sent to Kitchen!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Order Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300">
            Our chefs have fired up the wok for your table. Sit back and enjoy your evening!
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-3 gap-2 text-left">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Order Number</span>
            <span className="text-sm font-black text-amber-400 font-mono">#{activeOrder.orderNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Table</span>
            <span className="text-sm font-black text-white">Table {activeOrder.tableNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Estimated Time</span>
            <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {activeOrder.estimatedPrepTimeMinutes} mins
            </span>
          </div>
        </div>

        {/* Payment Status Notification Banner */}
        <div className={`p-3.5 rounded-xl border text-xs text-left flex items-start gap-3 ${
          activeOrder.paymentMethod === 'online'
            ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300'
            : activeOrder.paymentMethod === 'card'
            ? 'bg-blue-950/70 border-blue-700/60 text-blue-300'
            : 'bg-amber-950/70 border-amber-700/60 text-amber-300'
        }`}>
          <div className="text-lg">
            {activeOrder.paymentMethod === 'online' ? '✅' : activeOrder.paymentMethod === 'card' ? '💳' : '💵'}
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="font-bold flex items-center justify-between">
              <span>
                {activeOrder.paymentMethod === 'online' && 'Online Payment Completed'}
                {activeOrder.paymentMethod === 'card' && 'Pay at Table: Card via POS'}
                {activeOrder.paymentMethod === 'cash' && 'Pay at Table: Cash to Server'}
              </span>
              {activeOrder.transactionId && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-1.5 py-0.5 rounded">
                  {activeOrder.transactionId}
                </span>
              )}
            </div>
            <p className="text-[11px] opacity-90">
              {activeOrder.paymentMethod === 'online' && 'Payment verified successfully. Total: Rs. ' + activeOrder.totalAmount.toLocaleString()}
              {activeOrder.paymentMethod === 'card' && `A floor server with a wireless POS machine has been notified for Table #${activeOrder.tableNumber}.`}
              {activeOrder.paymentMethod === 'cash' && `Cash payment recorded. Our cashier & floor waiter will collect cash at Table #${activeOrder.tableNumber}.`}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2">
          <button
            id="btn-confirm-track-order"
            onClick={handleTrackOrder}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Utensils className="w-5 h-5" />
            <span>Track Live Kitchen Progress</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsOrderConfirmationOpen(false)}
            className="text-xs text-zinc-400 hover:text-white pt-2 font-medium"
          >
            Back to Digital Menu
          </button>
        </div>
      </div>
    </div>
  );
};
