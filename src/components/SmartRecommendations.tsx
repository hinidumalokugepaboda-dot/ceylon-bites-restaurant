import React from 'react';
import { Sparkles, Utensils, Plus, ArrowRight, Heart } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { FOOD_ITEMS } from '../data/menuData';
import { FoodImage } from './common/FoodImage';

export const SmartRecommendations: React.FC = () => {
  const { openFoodModal, addToCart, setIsCartOpen } = useRestaurant();

  // Highlight combos
  const kottuCombo = {
    title: 'The Ultimate Kottu & Sizzle Trio',
    description: 'Our most-ordered pairing: Cheese Chicken Kottu + Devilled Chicken + Fresh Lime Soda.',
    items: [
      FOOD_ITEMS.find((f) => f.id === 'kottu-cheese-chicken') || FOOD_ITEMS[1],
      FOOD_ITEMS.find((f) => f.id === 'devilled-chicken') || FOOD_ITEMS[3],
      FOOD_ITEMS.find((f) => f.id === 'drink-fresh-lime') || FOOD_ITEMS[FOOD_ITEMS.length - 3]
    ],
    total: 1250 + 850 + 250 // 2350
  };

  const crowdFavorites = [
    FOOD_ITEMS.find((f) => f.id === 'seafood-hbc') || FOOD_ITEMS[6],
    FOOD_ITEMS.find((f) => f.id === 'bites-wings-spicy') || FOOD_ITEMS[13],
    FOOD_ITEMS.find((f) => f.id === 'kottu-chicken') || FOOD_ITEMS[0],
    FOOD_ITEMS.find((f) => f.id === 'devilled-pork') || FOOD_ITEMS[4]
  ];

  const handleAddCombo = () => {
    kottuCombo.items.forEach((item) => {
      addToCart(item, 1);
    });
    setIsCartOpen(true);
  };

  return (
    <section className="py-12 md:py-16 bg-[#0c0c0e] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Combo Spotlight Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-[#1c1813] border border-amber-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Perfect Table Pairing
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white font-heading">
                {kottuCombo.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {kottuCombo.description}
              </p>

              {/* Items strip */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                {kottuCombo.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openFoodModal(item)}
                    className="p-2 sm:p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/40 cursor-pointer transition-all text-center group"
                  >
                    <div className="w-full h-16 sm:h-20 rounded-lg overflow-hidden mb-1.5">
                      <FoodImage
                        src={item.image}
                        fallbackSrc={item.fallbackImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-[11px] font-bold text-zinc-200 truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-black text-amber-400">
                      Rs. {item.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
                  Combo Pricing
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
                  Rs. {kottuCombo.total.toLocaleString()}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Includes 1 Sizzler Main + 1 Sharing Bite + 1 Chilled Chaser
                </p>
              </div>

              <button
                onClick={handleAddCombo}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Add Sizzle Trio to Table</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Customers Also Like Strip */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                Customers Also Order For Evening Hangouts
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Top rated sizzling accompaniments for BYOB tables.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crowdFavorites.map((food) => (
              <div
                key={food.id}
                onClick={() => openFoodModal(food)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 hover:border-amber-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-950">
                    <FoodImage
                      src={food.image}
                      fallbackSrc={food.fallbackImage}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                      {food.name}
                    </h4>
                    <span className="text-xs font-black text-amber-400 font-heading block mt-0.5">
                      Rs. {food.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(food, 1);
                  }}
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 flex items-center justify-center shrink-0 ml-2 transition-all"
                  aria-label="Add to cart"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
