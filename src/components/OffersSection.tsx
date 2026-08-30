import React, { useState } from 'react';
import { Percent, Sparkles, Clock, Check, ArrowRight, Tag } from 'lucide-react';
import { SPECIAL_OFFERS } from '../data/menuData';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodImage } from './common/FoodImage';
import { FOOD_ITEMS } from '../data/menuData';

export const OffersSection: React.FC = () => {
  const { applyPromoCode, addToCart, setIsCartOpen } = useRestaurant();
  const [claimedCode, setClaimedCode] = useState<string | null>(null);

  const handleClaimOffer = (code: string, applicableDishId?: string) => {
    applyPromoCode(code);
    if (applicableDishId) {
      const dish = FOOD_ITEMS.find((f) => f.id === applicableDishId);
      if (dish) {
        addToCart(dish, 1);
      }
    }
    setClaimedCode(code);
    setTimeout(() => {
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <section id="offers-section" className="py-12 md:py-16 bg-[#0c0c0e] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Percent className="w-3.5 h-3.5" /> Evening Sizzle Specials
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
            Promotions & Table Offers
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Exclusive dining packages and food discounts for your evening hangout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SPECIAL_OFFERS.map((offer) => {
            const isClaimed = claimedCode === offer.code;
            return (
              <div
                key={offer.id}
                id={`offer-card-${offer.id}`}
                className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between text-left group"
              >
                {/* Offer Image */}
                <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
                  <FoodImage
                    src={offer.image}
                    fallbackSrc={offer.fallbackImage}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-red-600 text-white font-black text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                      {offer.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300 font-semibold bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {offer.validUntil}
                    </span>
                    <span className="font-mono text-amber-400 font-bold uppercase">
                      CODE: {offer.code}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                      {offer.tagline}
                    </span>
                    <h3 className="text-lg font-black text-white font-heading">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <div>
                      {offer.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through mr-2 font-medium">
                          Rs. {offer.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-lg font-black text-amber-400 font-heading">
                        Rs. {offer.discountedPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleClaimOffer(offer.code, offer.applicableDishId)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow ${
                        isClaimed
                          ? 'bg-emerald-500 text-black'
                          : 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95'
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Claimed
                        </>
                      ) : (
                        <>
                          <Tag className="w-3.5 h-3.5" /> Claim Offer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
