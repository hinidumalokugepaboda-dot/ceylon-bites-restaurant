import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Flame, 
  Tag, 
  Award, 
  Wine, 
  GlassWater, 
  Sparkles,
  Check
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodImage } from './common/FoodImage';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    appliedDiscount,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
    appliedLoyaltyDiscount,
    redeemLoyaltyInCart,
    removeLoyaltyDiscount,
    finalCartTotal,
    tableNumber,
    needIceBucket,
    setNeedIceBucket,
    needGlassware,
    setNeedGlassware,
    setIsCheckoutOpen,
    loyalty
  } = useRestaurant();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (!success) {
      setPromoError('Invalid coupon code. Try WEEKEND799 or SIZZLE15');
    } else {
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-container"
          className="w-screen max-w-md bg-[#0d0d0d] border-l border-white/10 text-left flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#111111]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center font-bold bg-black">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-serif uppercase tracking-[0.15em] font-medium text-white">
                  Table #{tableNumber} Order
                </h2>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-light">
                  {cart.length} unique {cart.length === 1 ? 'dish' : 'dishes'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded bg-[#161616] border border-white/10"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-14 h-14 border border-white/10 flex items-center justify-center text-gray-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-serif text-white">Your cart is empty</h3>
                  <p className="text-xs text-gray-400 font-light mt-1">
                    Select artisan kottu, sizzling devilled bites, or beverages to begin.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-[#c5a059] text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#d6b26b] transition-all shadow"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                {/* Items loop */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      id={`cart-item-${item.cartItemId}`}
                      className="p-3.5 bg-[#141414] border border-white/5 space-y-2.5 shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-14 h-14 overflow-hidden shrink-0 bg-black">
                            <FoodImage
                              src={item.food.image}
                              fallbackSrc={item.food.fallbackImage}
                              alt={item.food.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5 truncate">
                              <h4 className="text-xs uppercase tracking-wider font-medium text-white truncate">
                                {item.food.name}
                              </h4>
                              {item.selectedPortion && (
                                <span className="bg-[#1e1910] border border-[#c5a059]/50 text-[#c5a059] px-1 py-0.5 text-[8px] font-bold uppercase shrink-0">
                                  {item.selectedPortion.portionCode}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                              <span className="capitalize text-red-400 font-medium flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5 text-red-400" /> {item.spiceLevel}
                              </span>
                              <span>•</span>
                              <span className="text-gray-300 font-medium">{item.selectedPortion?.portionName || 'Regular'}</span>
                              <span>•</span>
                              <span className="text-[#c5a059] font-serif">
                                Rs. {(item.itemTotal / item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Add-ons and special notes if any */}
                      {(item.selectedAddons.length > 0 || item.specialInstructions) && (
                        <div className="bg-black/60 p-2 border border-white/5 text-[10px] text-gray-400 space-y-1">
                          {item.selectedAddons.length > 0 && (
                            <div>
                              <strong className="text-gray-300 uppercase tracking-wider text-[9px]">Addons:</strong>{' '}
                              {item.selectedAddons.map((a) => a.name).join(', ')}
                            </div>
                          )}
                          {item.specialInstructions && (
                            <div>
                              <strong className="text-[#c5a059] uppercase tracking-wider text-[9px]">Note:</strong> {item.specialInstructions}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quantity & Subtotal row */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <div className="flex items-center gap-1 bg-[#181818] border border-white/10 p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-5 h-5 bg-black/40 hover:bg-white/10 text-gray-300 flex items-center justify-center font-bold active:scale-90"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1.5 min-w-[18px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-5 h-5 bg-black/40 hover:bg-white/10 text-gray-300 flex items-center justify-center font-bold active:scale-90"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-sm font-serif text-[#c5a059] font-medium">
                          Rs. {item.itemTotal.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table BYOB Setup Checkbox */}
                <div className="p-3.5 bg-[#141414] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-300">
                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Wine className="w-3.5 h-3.5 text-[#c5a059]" /> BYOB Table Concierge
                    </span>
                    <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-bold border border-[#c5a059]/30 px-1.5 py-0.2">Free</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2 bg-[#181818] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={needGlassware}
                        onChange={(e) => setNeedGlassware(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#c5a059]"
                      />
                      <span className="text-[10px] text-gray-300 uppercase tracking-wide">Glasses</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-[#181818] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={needIceBucket}
                        onChange={(e) => setNeedIceBucket(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#c5a059]"
                      />
                      <span className="text-[10px] text-gray-300 uppercase tracking-wide">Ice Bucket</span>
                    </label>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-1.5">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Coupon e.g. WEEKEND799"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full bg-[#141414] border border-white/10 pl-8 pr-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-gray-600 focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#1a1a1a] hover:bg-[#c5a059] hover:text-black text-xs font-bold text-gray-300 rounded border border-white/10 uppercase tracking-wider text-[10px] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {promoError && (
                    <p className="text-[10px] text-red-400 pl-1">{promoError}</p>
                  )}
                  {appliedPromoCode && (
                    <div className="flex items-center justify-between px-2.5 py-1 bg-[#1a1710] border border-[#c5a059]/40 text-xs text-[#c5a059]">
                      <span>Applied: <strong>{appliedPromoCode}</strong> (-Rs. {appliedDiscount})</span>
                      <button onClick={removePromoCode} className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider">
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Loyalty Redemption Widget */}
                {loyalty.points >= 100 && (
                  <div className="p-3 bg-[#141414] border border-[#c5a059]/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] uppercase tracking-wider text-gray-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#c5a059]" /> Loyalty Points
                      </span>
                      <span className="text-[#c5a059] font-serif text-xs">{loyalty.points} pts</span>
                    </div>

                    {appliedLoyaltyDiscount > 0 ? (
                      <div className="flex items-center justify-between bg-black/70 p-2 text-xs">
                        <span className="text-emerald-400 text-[10px] uppercase tracking-wide font-medium">
                          ✓ Rs. {appliedLoyaltyDiscount} points discount active
                        </span>
                        <button
                          onClick={removeLoyaltyDiscount}
                          className="text-[10px] text-gray-400 hover:text-white uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => redeemLoyaltyInCart(100)}
                          className="flex-1 py-1.5 bg-[#1a1a1a] hover:bg-[#c5a059] hover:text-black border border-white/10 text-gray-300 text-[10px] uppercase tracking-wider font-bold transition-colors"
                        >
                          -Rs. 100 (100 pts)
                        </button>
                        {loyalty.points >= 500 && (
                          <button
                            onClick={() => redeemLoyaltyInCart(500)}
                            className="flex-1 py-1.5 bg-[#1a1710] hover:bg-[#c5a059] hover:text-black border border-[#c5a059]/40 text-[#c5a059] text-[10px] uppercase tracking-wider font-bold transition-colors"
                          >
                            -Rs. 500 (500 pts)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sticky Checkout Bottom Bar */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#111111] border-t border-white/10 space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-serif">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Offer Discount ({appliedPromoCode})</span>
                    <span>- Rs. {appliedDiscount.toLocaleString()}</span>
                  </div>
                )}
                {appliedLoyaltyDiscount > 0 && (
                  <div className="flex justify-between text-[#c5a059]">
                    <span>Loyalty Discount</span>
                    <span>- Rs. {appliedLoyaltyDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium text-white pt-2 border-t border-white/10">
                  <span className="uppercase tracking-widest text-xs">Total Bill</span>
                  <span className="text-base font-serif text-[#c5a059] font-medium">
                    Rs. {finalCartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                id="btn-cart-continue-checkout"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 bg-[#c5a059] hover:bg-[#d6b26b] text-black font-bold text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
