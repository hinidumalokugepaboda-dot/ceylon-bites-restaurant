import React, { useState } from 'react';
import { Flame, Plus, Minus, Check, Leaf, Clock, Sparkles, Users } from 'lucide-react';
import { FoodItem, ItemPortion } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodImage } from './common/FoodImage';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { openFoodModal, cart, addToCart, updateCartQuantity } = useRestaurant();

  // Multi-tier portion state
  const portions = food.portions && food.portions.length > 0
    ? food.portions
    : [
        {
          id: `${food.id}-portion-s`,
          portionName: 'Small (S)',
          portionCode: 'S' as const,
          price: food.price,
          servesCount: 1,
          description: 'Single Serving'
        }
      ];

  const [selectedPortion, setSelectedPortion] = useState<ItemPortion>(portions[0]);

  // Find if this specific item + portion is in the cart
  const portionCartItem = cart.find(
    (c) => c.food.id === food.id && c.selectedPortion?.id === selectedPortion.id
  );
  const totalInCart = portionCartItem ? portionCartItem.quantity : 0;

  const handleCardClick = () => {
    openFoodModal(food);
  };

  const handlePortionSelect = (e: React.MouseEvent, p: ItemPortion) => {
    e.stopPropagation();
    setSelectedPortion(p);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (food.addons && food.addons.length > 0) {
      // If customizable with add-ons, open modal to let user choose options
      openFoodModal(food);
    } else {
      addToCart(food, 1, food.spiceLevel, '', [], selectedPortion);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (portionCartItem) {
      updateCartQuantity(portionCartItem.cartItemId, portionCartItem.quantity + 1);
    } else {
      addToCart(food, 1, food.spiceLevel, '', [], selectedPortion);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (portionCartItem) {
      updateCartQuantity(portionCartItem.cartItemId, portionCartItem.quantity - 1);
    }
  };

  return (
    <div
      id={`food-card-${food.id}`}
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-[#111111] border border-white/5 hover:border-[#c5a059]/50 transition-all duration-300 overflow-hidden shadow-md hover:shadow-2xl cursor-pointer text-left"
    >
      {/* Food Photo Container */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#0d0d0d]">
        <FoodImage
          src={food.image}
          fallbackSrc={food.fallbackImage}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {food.popular && (
            <span className="bg-black/90 border border-[#c5a059] text-[#c5a059] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Popular
            </span>
          )}
          {food.chefSpecial && (
            <span className="bg-[#1a1a1a] border border-white/20 text-gray-200 font-medium text-[9px] uppercase tracking-wider px-2 py-0.5 shadow-md">
              Chef Special
            </span>
          )}
          {food.vegetarian && (
            <span className="bg-emerald-950/90 border border-emerald-800/60 text-emerald-400 font-medium text-[9px] uppercase tracking-wider px-2 py-0.5 shadow-md flex items-center gap-0.5">
              <Leaf className="w-2.5 h-2.5" /> Veg
            </span>
          )}
        </div>

        {/* Spice Indicator & Serves info */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 bg-black/85 px-2 py-0.5 text-[10px] text-gray-300 border border-white/10 uppercase tracking-wider">
            {food.spicy ? (
              <span className="flex items-center gap-0.5 text-red-400 font-medium">
                <Flame className="w-2.5 h-2.5 text-red-400" />
                {food.spiceLevel === 'extra-spicy' ? 'Extra Hot' : food.spiceLevel === 'spicy' ? 'Spicy' : 'Medium'}
              </span>
            ) : (
              <span className="text-gray-400">Mild</span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-black/85 px-2 py-0.5 text-[9px] uppercase tracking-wider text-gray-300 border border-white/10">
            <Users className="w-2.5 h-2.5 text-[#c5a059]" />
            <span>Serves {selectedPortion.servesCount}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-serif text-base text-white group-hover:text-[#c5a059] transition-colors line-clamp-1">
            {food.name}
          </h3>
          <p className="text-xs text-gray-400 font-light leading-relaxed mt-1 line-clamp-2">
            {food.description}
          </p>
        </div>

        {/* Multi-tier Portion Selector (S / M / L) */}
        {portions.length > 1 && (
          <div className="pt-2 border-t border-white/5 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold shrink-0">
              Size:
            </span>
            <div className="flex items-center gap-1 flex-1">
              {portions.map((p) => {
                const isSelected = selectedPortion.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={(e) => handlePortionSelect(e, p)}
                    type="button"
                    className={`flex-1 py-1 px-1.5 text-[10px] uppercase font-bold tracking-wider transition-all border ${
                      isSelected
                        ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-sm'
                        : 'bg-[#181818] text-gray-400 border-white/10 hover:text-white hover:border-white/20'
                    }`}
                    title={`${p.portionName} - Rs. ${p.price} (Serves ${p.servesCount})`}
                  >
                    {p.portionCode}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">
              {selectedPortion.portionName}
            </span>
            <span className="text-base font-serif text-[#c5a059] font-medium">
              Rs. {selectedPortion.price.toLocaleString()}
            </span>
          </div>

          {/* Quick Action Button */}
          {totalInCart > 0 ? (
            <div className="flex items-center gap-1 bg-[#c5a059] text-black p-1 shadow-md">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 flex items-center justify-center bg-black/10 hover:bg-black/25 text-black font-bold active:scale-90 transition-all"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold px-1.5 min-w-[18px] text-center">
                {totalInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 flex items-center justify-center bg-black/10 hover:bg-black/25 text-black font-bold active:scale-90 transition-all"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] hover:bg-[#c5a059] hover:text-black text-gray-300 font-bold text-[10px] uppercase tracking-widest transition-all duration-200 border border-white/10 hover:border-[#c5a059] active:scale-95 shadow"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

