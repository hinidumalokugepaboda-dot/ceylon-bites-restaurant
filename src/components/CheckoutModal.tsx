import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Phone, 
  User, 
  ShoppingBag, 
  Sparkles, 
  Utensils,
  ArrowRight
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    appliedDiscount,
    appliedLoyaltyDiscount,
    finalCartTotal,
    tableNumber,
    orderType,
    placeOrder,
    customerUser
  } = useRestaurant();

  const [customerName, setCustomerName] = useState(customerUser.name || 'Kavindu Senanayake');
  const [customerPhone, setCustomerPhone] = useState(customerUser.phone || '077 123 4567');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(customerName, customerPhone, paymentMethod, specialNotes);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="checkout-modal-container"
        className="relative w-full max-w-xl bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/90">
          <div>
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-wider">
              {orderType === 'dine-in' ? `Dine-In • Table ${tableNumber}` : 'Takeaway Order'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white font-heading">
              Confirm & Place Order
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 custom-scrollbar">
          {/* Customer Details */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Diner Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table Verification */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Ordering from Table #{tableNumber}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Food will be served directly to this table.
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Order Items ({cart.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/70 border border-zinc-850 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-amber-400">{item.quantity}x</span>
                    <span className="text-zinc-200 truncate">{item.food.name}</span>
                    {item.selectedPortion && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                        {item.selectedPortion.portionCode}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-500 capitalize">({item.spiceLevel})</span>
                  </div>
                  <span className="font-bold text-white shrink-0 ml-2">
                    Rs. {item.itemTotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Preferred Payment Method
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-white">Cash at Table</div>
                <div className="text-[10px] text-zinc-400">Pay server / cashier</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-white">Card at Table</div>
                <div className="text-[10px] text-zinc-400">POS machine to table</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'online'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-white">Digital / QR Pay</div>
                <div className="text-[10px] text-zinc-400">Scan QR at Table</div>
              </button>
            </div>
          </div>

          {/* Kitchen Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Special Table Notes
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Serve drinks first, extra napkins, celebrate birthday..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Price Breakdown */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-white">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Offer Discount</span>
                <span>- Rs. {appliedDiscount.toLocaleString()}</span>
              </div>
            )}
            {appliedLoyaltyDiscount > 0 && (
              <div className="flex justify-between text-amber-400 font-semibold">
                <span>Loyalty Points Discount</span>
                <span>- Rs. {appliedLoyaltyDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-zinc-800">
              <span>Total to Pay</span>
              <span className="text-amber-400 font-heading">
                Rs. {finalCartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            id="btn-confirm-place-order"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <span>Sending Order to Kitchen...</span>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Place Table Order (Rs. {finalCartTotal.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
