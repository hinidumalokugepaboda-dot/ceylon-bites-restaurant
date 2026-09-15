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
  ArrowRight,
  Bell,
  Lock,
  Smartphone,
  ShieldCheck
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
    customerUser,
    setIsPaymentGatewayOpen,
    setPendingCheckoutData
  } = useRestaurant();

  const [customerName, setCustomerName] = useState(customerUser.name || 'Kavindu Senanayake');
  const [customerPhone, setCustomerPhone] = useState(customerUser.phone || '077 123 4567');
  const [paymentCategory, setPaymentCategory] = useState<'table' | 'online'>('table');
  const [tablePaymentType, setTablePaymentType] = useState<'cash' | 'card'>('cash');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentCategory === 'online') {
      // Save pending checkout info and open the demo payment gateway
      setPendingCheckoutData({
        customerName,
        customerPhone,
        specialNotes
      });
      setIsCheckoutOpen(false);
      setIsPaymentGatewayOpen(true);
      return;
    }

    // Pay at table (Cash or Card POS) -> Direct order placement with cashier notification
    setIsSubmitting(true);
    setTimeout(() => {
      const paymentMethod = tablePaymentType === 'card' ? 'card' : 'cash';
      const paymentStatus = tablePaymentType === 'card' ? 'pay_at_table_card' : 'pay_at_table_cash';
      placeOrder(customerName, customerPhone, paymentMethod, specialNotes, paymentStatus);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="checkout-modal-container"
        className="relative w-full max-w-xl bg-[#111114] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left font-sans"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#16161a]">
          <div>
            <span className="text-[10px] sm:text-[11px] text-[#c5a059] font-bold uppercase tracking-[0.2em] block">
              {orderType === 'dine-in' ? `Dine-In • Table #${tableNumber}` : 'Takeaway Order'}
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
              Confirm & Settle Order
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-gray-400 hover:text-white rounded-lg bg-black/40 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5 custom-scrollbar">
          {/* Customer Details */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] block">
              Diner Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 font-semibold mb-1 block uppercase tracking-wider">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-black/70 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-semibold mb-1 block uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    className="w-full bg-black/70 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table Verification */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Serving to Table #{tableNumber}
                </div>
                <div className="text-[11px] text-gray-400">
                  Wok creations & sizzlers brought directly to your table.
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] block">
              Order Items ({cart.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-[#c5a059]">{item.quantity}x</span>
                    <span className="text-gray-200 truncate">{item.food.name}</span>
                    {item.selectedPortion && (
                      <span className="text-[9px] bg-[#c5a059]/20 text-[#c5a059] px-1.5 py-0.5 rounded font-bold">
                        {item.selectedPortion.portionCode}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 capitalize">({item.spiceLevel})</span>
                  </div>
                  <span className="font-bold text-white shrink-0 ml-2 font-mono">
                    Rs. {item.itemTotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT METHOD SELECTION: 2 CORE OPTIONS */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.15em] block">
              Choose Payment Method
            </span>

            {/* Top-Level 2 Category Tabs */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Option 1: Pay at Table */}
              <button
                type="button"
                onClick={() => setPaymentCategory('table')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentCategory === 'table'
                    ? 'bg-[#c5a059]/15 border-[#c5a059] shadow-md ring-1 ring-[#c5a059]/50'
                    : 'bg-black/60 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                    <Banknote className="w-4 h-4 text-[#c5a059]" />
                    <span>Pay at Table</span>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    paymentCategory === 'table' ? 'border-[#c5a059] bg-[#c5a059]' : 'border-gray-600'
                  }`}>
                    {paymentCategory === 'table' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                  Cash or Card via POS terminal at your table
                </p>
              </button>

              {/* Option 2: Online Payment */}
              <button
                type="button"
                onClick={() => setPaymentCategory('online')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentCategory === 'online'
                    ? 'bg-[#c5a059]/15 border-[#c5a059] shadow-md ring-1 ring-[#c5a059]/50'
                    : 'bg-black/60 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                    <CreditCard className="w-4 h-4 text-[#c5a059]" />
                    <span>Online Payment</span>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    paymentCategory === 'online' ? 'border-[#c5a059] bg-[#c5a059]' : 'border-gray-600'
                  }`}>
                    {paymentCategory === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                  Card, Genie, FriMi with instant demo gateway
                </p>
              </button>
            </div>

            {/* DETAIL VIEW FOR OPTION 1: PAY AT TABLE */}
            {paymentCategory === 'table' && (
              <div className="space-y-3 p-3.5 rounded-xl bg-[#151518] border border-white/5 animate-in fade-in duration-200">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                  Select Table Payment Type:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTablePaymentType('cash')}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      tablePaymentType === 'cash'
                        ? 'bg-[#c5a059]/20 border-[#c5a059] text-white'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Cash to Server</div>
                      <div className="text-[9px] text-gray-400">Settle with cash</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTablePaymentType('card')}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      tablePaymentType === 'card'
                        ? 'bg-[#c5a059]/20 border-[#c5a059] text-white'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Card via POS</div>
                      <div className="text-[9px] text-gray-400">Machine to table</div>
                    </div>
                  </button>
                </div>

                {/* Notification Alert Box */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-950/30 border border-[#c5a059]/30 text-xs text-amber-200">
                  <Bell className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-[#c5a059]">Cashier & Floor Notification:</strong> An instant alert will be sent to the cashier desk and assigned server that Table #{tableNumber} will settle via <strong className="text-white capitalize">{tablePaymentType}</strong> when your meal is served.
                  </p>
                </div>
              </div>
            )}

            {/* DETAIL VIEW FOR OPTION 2: ONLINE PAYMENT */}
            {paymentCategory === 'online' && (
              <div className="space-y-2 p-3.5 rounded-xl bg-[#151518] border border-white/5 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-[11px]">Instant Demo Payment Gateway</div>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                      Click below to open the simulated payment gateway. You can enter card details or click <em>"Fill Demo Card"</em>, simulate bank authorization, and receive instant payment confirmation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kitchen Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Special Table Notes
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Serve drinks first, extra napkins, celebrate birthday..."
              className="w-full bg-black/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Price Breakdown */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1.5 text-xs text-gray-400">
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
              <div className="flex justify-between text-[#c5a059] font-semibold">
                <span>Loyalty Points Discount</span>
                <span>- Rs. {appliedLoyaltyDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-white/10">
              <span>Total to Settle</span>
              <span className="text-[#c5a059] font-serif text-lg">
                Rs. {finalCartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Action Button */}
          {paymentCategory === 'online' ? (
            <button
              id="btn-proceed-online-payment"
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-[#c5a059] to-[#d6b26b] hover:from-[#d6b26b] hover:to-[#e5c47f] text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Online Payment (Rs. {finalCartTotal.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-confirm-place-order"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#c5a059] to-[#d6b26b] hover:from-[#d6b26b] hover:to-[#e5c47f] text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sending Order & Alerting Cashier...</span>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Place Order & Notify Cashier (Rs. {finalCartTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

