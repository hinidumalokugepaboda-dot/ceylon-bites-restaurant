import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  Building2
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const PaymentGatewayModal: React.FC = () => {
  const {
    isPaymentGatewayOpen,
    setIsPaymentGatewayOpen,
    pendingCheckoutData,
    finalCartTotal,
    tableNumber,
    placeOrder,
    customerUser
  } = useRestaurant();

  const [activeGatewayTab, setActiveGatewayTab] = useState<'card' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(customerUser.name || 'Kavindu Senanayake');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<'genie' | 'frimi' | 'ezcash'>('genie');
  const [walletPhone, setWalletPhone] = useState(customerUser.phone || '077 123 4567');
  const [simulateOtp, setSimulateOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  // Processing & step simulation states
  const [paymentStage, setPaymentStage] = useState<'form' | 'otp' | 'processing' | 'success'>('form');
  const [processingStep, setProcessingStep] = useState(1);
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    if (isPaymentGatewayOpen) {
      // Reset state on open
      setPaymentStage('form');
      setProcessingStep(1);
      setTxnId(`TXN-CB-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isPaymentGatewayOpen]);

  if (!isPaymentGatewayOpen) return null;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setExpiry(raw);
  };

  // Card brand detection
  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('51') || clean.startsWith('52') || clean.startsWith('53') || clean.startsWith('54') || clean.startsWith('55')) return 'Mastercard';
    if (clean.startsWith('34') || clean.startsWith('37')) return 'Amex';
    return 'Card';
  };

  // Quick fill demo test card
  const handleUseTestCard = () => {
    setCardNumber('4532 8920 7412 8492');
    setCardHolder(customerUser.name || 'Kavindu Senanayake');
    setExpiry('08/28');
    setCvv('742');
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (simulateOtp) {
      setPaymentStage('otp');
      setOtpValue('7492');
    } else {
      runProcessingSimulation();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    runProcessingSimulation();
  };

  const runProcessingSimulation = () => {
    setPaymentStage('processing');
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 900);

    setTimeout(() => {
      setProcessingStep(3);
    }, 1800);

    setTimeout(() => {
      setPaymentStage('success');
    }, 2700);
  };

  const handleCompleteOrder = () => {
    const customerName = pendingCheckoutData?.customerName || customerUser.name || 'Guest Diner';
    const customerPhone = pendingCheckoutData?.customerPhone || customerUser.phone || '077 000 0000';
    const specialNotes = pendingCheckoutData?.specialNotes || '';
    const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '8492';

    placeOrder(customerName, customerPhone, 'online', specialNotes, 'paid_online', txnId, last4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="payment-gateway-modal"
        className="relative w-full max-w-lg bg-[#0e0e11] border border-[#c5a059]/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-left font-sans"
      >
        {/* Gateway Security Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#141416] via-[#1b1b20] to-[#141416] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-widest text-sm font-bold text-white uppercase">
                  Ceylon<span className="text-[#c5a059]">Pay</span>
                </span>
                <span className="bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Secure Simulated Payment Gateway
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPaymentGatewayOpen(false)}
            className="p-2 text-gray-400 hover:text-white rounded-lg bg-black/40 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            aria-label="Cancel payment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Amount Recap Banner */}
        <div className="px-5 py-3.5 bg-[#16161a] border-b border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
              Table #{tableNumber} • Order Settle
            </span>
            <span className="text-xs text-gray-300 font-medium truncate">
              {pendingCheckoutData?.customerName || customerUser.name}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
              Amount Due
            </span>
            <span className="text-lg font-serif font-bold text-[#c5a059]">
              Rs. {finalCartTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dynamic Payment Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STAGE 1: FORM INPUT */}
          {paymentStage === 'form' && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              {/* Payment Tabs */}
              <div className="flex rounded-xl bg-black/60 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveGatewayTab('card')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeGatewayTab === 'card'
                      ? 'bg-[#c5a059] text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Debit / Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGatewayTab('wallet')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeGatewayTab === 'wallet'
                      ? 'bg-[#c5a059] text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Lanka QR / Wallet</span>
                </button>
              </div>

              {/* CARD PAYMENT TAB */}
              {activeGatewayTab === 'card' && (
                <div className="space-y-3.5 animate-in fade-in">
                  {/* Demo Card Quick Fill Helper */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141416] border border-white/5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span className="text-[11px] text-gray-300 font-medium">
                        Quick Demo Mode
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleUseTestCard}
                      className="px-2.5 py-1 rounded bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-wider transition-all border border-[#c5a059]/40 cursor-pointer"
                    >
                      Fill Demo Card
                    </button>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="text-[11px] text-gray-300 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Card Number</span>
                      <span className="text-[10px] text-[#c5a059] font-mono">{getCardBrand()}</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 •••• •••• 8492"
                        className="w-full bg-black/80 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] font-mono tracking-wider"
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="text-[11px] text-gray-300 font-bold uppercase tracking-wider mb-1.5 block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="e.g. Kavindu Senanayake"
                      className="w-full bg-black/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-300 font-bold uppercase tracking-wider mb-1.5 block">
                        Expires (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full bg-black/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] font-mono text-center tracking-widest"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-300 font-bold uppercase tracking-wider mb-1.5 block">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full bg-black/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] font-mono text-center tracking-widest"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* WALLET / LANKA QR TAB */}
              {activeGatewayTab === 'wallet' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedWallet('genie')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedWallet === 'genie'
                          ? 'bg-[#c5a059]/15 border-[#c5a059] text-white'
                          : 'bg-black/60 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Dialog Genie</div>
                      <div className="text-[9px] text-[#c5a059]">Direct Debit</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedWallet('frimi')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedWallet === 'frimi'
                          ? 'bg-[#c5a059]/15 border-[#c5a059] text-white'
                          : 'bg-black/60 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Nations FriMi</div>
                      <div className="text-[9px] text-[#c5a059]">In-App Pay</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedWallet('ezcash')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedWallet === 'ezcash'
                          ? 'bg-[#c5a059]/15 border-[#c5a059] text-white'
                          : 'bg-black/60 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">eZ Cash</div>
                      <div className="text-[9px] text-[#c5a059]">Mobile PIN</div>
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 font-bold uppercase tracking-wider mb-1.5 block">
                      Registered Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="e.g. 077 123 4567"
                      className="w-full bg-black/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              )}

              {/* Simulation Options */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={simulateOtp}
                    onChange={(e) => setSimulateOtp(e.target.checked)}
                    className="accent-[#c5a059] w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Simulate Bank 3D-Secure SMS OTP</span>
                </label>
                <span className="text-[10px] text-[#c5a059] uppercase font-bold">Optional</span>
              </div>

              {/* Submit Pay Button */}
              <button
                id="btn-gateway-submit-pay"
                type="submit"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#c5a059] to-[#d6b26b] hover:from-[#d6b26b] hover:to-[#e5c47f] text-black font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay Rs. {finalCartTotal.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STAGE 2: 3D SECURE OTP SIMULATION */}
          {paymentStage === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center py-2 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/20 border border-[#c5a059] text-[#c5a059] flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-white">
                  Bank 3D-Secure Verification
                </h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  A demo 4-digit OTP has been generated for your card payment of <span className="text-[#c5a059] font-bold">Rs. {finalCartTotal.toLocaleString()}</span>
                </p>
              </div>

              <div className="p-3 bg-[#16161a] border border-white/10 rounded-xl max-w-xs mx-auto">
                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                  Demo Security Code
                </div>
                <div className="text-xl font-mono font-extrabold text-[#c5a059] tracking-widest">
                  {otpValue}
                </div>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <button
                type="submit"
                className="w-full max-w-xs mx-auto py-3.5 px-6 bg-[#c5a059] hover:bg-[#d6b26b] text-black font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Authorize</span>
              </button>
            </form>
          )}

          {/* STAGE 3: LIVE PROGRESS SIMULATION */}
          {paymentStage === 'processing' && (
            <div className="py-8 space-y-6 text-center animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#c5a059]/20 animate-ping opacity-50" />
                <div className="w-full h-full rounded-full border-4 border-t-[#c5a059] border-r-transparent border-b-[#c5a059]/30 border-l-transparent animate-spin flex items-center justify-center bg-black/60">
                  <Lock className="w-7 h-7 text-[#c5a059]" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-white">
                  Processing Payment...
                </h3>
                <p className="text-xs text-gray-400">
                  Please do not refresh or close this window
                </p>
              </div>

              {/* Multi-step progress tracker */}
              <div className="max-w-xs mx-auto space-y-2 text-left bg-black/60 p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2.5 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    processingStep >= 1 ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500'
                  }`}>
                    ✓
                  </div>
                  <span className={processingStep >= 1 ? 'text-gray-200' : 'text-gray-500'}>
                    Encrypting payment payload...
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    processingStep >= 2 ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {processingStep >= 2 ? '✓' : '2'}
                  </div>
                  <span className={processingStep >= 2 ? 'text-gray-200' : 'text-gray-500'}>
                    Authorizing with card network...
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    processingStep >= 3 ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {processingStep >= 3 ? '✓' : '3'}
                  </div>
                  <span className={processingStep >= 3 ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                    Payment Approved & Confirmed!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: PAYMENT SUCCESSFUL STATE */}
          {paymentStage === 'success' && (
            <div className="py-4 space-y-5 text-center animate-in zoom-in-90 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Transaction Approved
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Payment Successful!
                </h3>
                <p className="text-xs text-gray-300 max-w-sm mx-auto">
                  Your payment of <span className="text-[#c5a059] font-bold">Rs. {finalCartTotal.toLocaleString()}</span> was verified. Your order has been placed for <span className="text-white font-bold">Table #{tableNumber}</span>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-xl bg-[#141416] border border-white/10 space-y-2 text-xs text-left max-w-md mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="font-mono font-bold text-[#c5a059]">{txnId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Card / Method</span>
                  <span className="text-white font-medium">
                    {activeGatewayTab === 'card' ? `${getCardBrand()} •••• ${cardNumber.slice(-4) || '8492'}` : selectedWallet.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Table</span>
                  <span className="text-white font-bold">Table #{tableNumber}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5 font-bold">
                  <span className="text-gray-200">Amount Paid</span>
                  <span className="text-[#c5a059] font-serif text-sm">Rs. {finalCartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Continue to Table Order Tracking Button */}
              <button
                id="btn-complete-paid-order"
                onClick={handleCompleteOrder}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#c5a059] to-[#d6b26b] hover:from-[#d6b26b] hover:to-[#e5c47f] text-black font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Order & Track Live Wok</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-[#0a0a0c] border-t border-white/5 text-center text-[10px] text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Demo Payment Mode • Safe, Simulated & Instant Table Dispatch</span>
        </div>
      </div>
    </div>
  );
};
