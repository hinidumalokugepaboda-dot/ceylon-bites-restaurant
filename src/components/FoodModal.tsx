import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Leaf, 
  Clock, 
  Check, 
  PlusCircle,
  Utensils
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodImage } from './common/FoodImage';
import { SpiceLevel, FoodAddon, ItemPortion } from '../types';
import { FOOD_ITEMS } from '../data/menuData';

export const FoodModal: React.FC = () => {
  const { selectedFood, closeFoodModal, addToCart } = useRestaurant();

  if (!selectedFood) return null;

  const portions = selectedFood.portions && selectedFood.portions.length > 0
    ? selectedFood.portions
    : [
        {
          id: `${selectedFood.id}-portion-s`,
          portionName: 'Small (S)',
          portionCode: 'S' as const,
          price: selectedFood.price,
          servesCount: 1,
          description: 'Single Serving'
        }
      ];

  const [selectedPortion, setSelectedPortion] = useState<ItemPortion>(portions[0]);
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>(selectedFood.spiceLevel);
  const [selectedAddons, setSelectedAddons] = useState<FoodAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    setSelectedPortion(portions[0]);
    setQuantity(1);
    setSpiceLevel(selectedFood.spiceLevel);
    setSelectedAddons([]);
    setSpecialInstructions('');
    setAddedAnimation(false);
  }, [selectedFood]);

  const presetInstructions = [
    'Extra spicy',
    'Less spicy',
    'Extra cheese',
    'Add extra gravy',
    'No onions',
    'Well done & crispy'
  ];

  const handleToggleAddon = (addon: FoodAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddPresetInstruction = (preset: string) => {
    if (specialInstructions.includes(preset)) {
      setSpecialInstructions(
        specialInstructions
          .replace(preset, '')
          .replace(/,\s*,/, ',')
          .trim()
      );
    } else {
      setSpecialInstructions(
        specialInstructions ? `${specialInstructions}, ${preset}` : preset
      );
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = selectedPortion.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(selectedFood, quantity, spiceLevel, specialInstructions, selectedAddons, selectedPortion);
    setAddedAnimation(true);
    setTimeout(() => {
      closeFoodModal();
    }, 600);
  };

  // Companion pairing items
  const pairingItems = selectedFood.pairingItemIds
    ? FOOD_ITEMS.filter((f) => selectedFood.pairingItemIds?.includes(f.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="food-modal-container"
        className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-left"
      >
        {/* Close Button */}
        <button
          onClick={closeFoodModal}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-gray-300 hover:text-white flex items-center justify-center border border-white/20 transition-all"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Header Image */}
          <div className="relative h-56 sm:h-72 w-full bg-[#0a0a0a] overflow-hidden">
            <FoodImage
              src={selectedFood.image}
              fallbackSrc={selectedFood.fallbackImage}
              alt={selectedFood.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/40" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {selectedFood.popular && (
                  <span className="bg-black/90 border border-[#c5a059] text-[#c5a059] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Popular Choice
                  </span>
                )}
                {selectedFood.vegetarian && (
                  <span className="bg-emerald-950/90 border border-emerald-800/60 text-emerald-400 font-medium text-[10px] uppercase tracking-wider px-2 py-1 shadow flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Vegetarian
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 bg-black/85 px-3 py-1 border border-white/10 text-[10px] uppercase tracking-wider font-medium text-gray-300">
                <Clock className="w-3 h-3 text-[#c5a059]" />
                <span>{selectedFood.portionInfo}</span>
              </div>
            </div>
          </div>

            {/* Details Section */}
          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-light">
                  {selectedFood.name}
                </h2>
                <div className="text-2xl sm:text-3xl font-serif text-[#c5a059] font-medium shrink-0">
                  Rs. {selectedPortion.price.toLocaleString()}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mt-2">
                {selectedFood.description}
              </p>
            </div>

            {/* Multi-tier Portion Size Selector (S / M / L) */}
            {portions.length > 1 && (
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#c5a059]" /> Select Portion Size
                  </span>
                  <span className="text-[#c5a059] font-medium text-[10px] uppercase tracking-wider">
                    {selectedPortion.portionName} • Serves {selectedPortion.servesCount}
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {portions.map((portion) => {
                    const isSelected = selectedPortion.id === portion.id;
                    return (
                      <button
                        key={portion.id}
                        type="button"
                        onClick={() => setSelectedPortion(portion)}
                        className={`p-3.5 border text-left transition-all relative overflow-hidden ${
                          isSelected
                            ? 'bg-[#1e1910] border-[#c5a059] text-white shadow-lg'
                            : 'bg-[#141414] border-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 bg-[#c5a059] text-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                            Selected
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs uppercase tracking-wider font-bold text-white">
                            {portion.portionName}
                          </span>
                          <span className="text-xs font-serif text-[#c5a059] font-medium">
                            Rs. {portion.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-light">
                          {portion.description || `Serves ${portion.servesCount} Person(s)`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ingredients list if available */}
            {selectedFood.ingredients && selectedFood.ingredients.length > 0 && (
              <div className="bg-[#141414] p-4 border border-white/5">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 block mb-2">
                  Key Ingredients & Spices
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFood.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-gray-300 bg-[#1a1a1a] px-2.5 py-1 border border-white/5 font-light"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Spice Level Selector */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#c5a059]" /> Select Spice Level
                </span>
                <span className="text-[#c5a059] font-medium text-[10px] uppercase tracking-wider">
                  {spiceLevel === 'extra-spicy' ? 'Extra fiery sizzle' : spiceLevel}
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'mild', label: 'Mild', desc: 'Gentle warmth' },
                  { id: 'medium', label: 'Medium', desc: 'Ceylon balance' },
                  { id: 'spicy', label: 'Spicy', desc: 'Traditional heat' },
                  { id: 'extra-spicy', label: 'Extra Sizzle', desc: 'Fiery chili kick' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSpiceLevel(item.id as SpiceLevel)}
                    className={`p-3 border text-left transition-all ${
                      spiceLevel === item.id
                        ? 'bg-[#1a1710] border-[#c5a059] text-[#c5a059]'
                        : 'bg-[#141414] border-white/5 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider font-bold">{item.label}</div>
                    <div className="text-[10px] text-gray-500 font-light mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Add-ons if present */}
            {selectedFood.addons && selectedFood.addons.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                  Add-Ons & Extras
                </label>
                <div className="space-y-2">
                  {selectedFood.addons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddon(addon)}
                        className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#181510] border-[#c5a059] text-white'
                            : 'bg-[#141414] border-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 flex items-center justify-center border ${
                              isSelected
                                ? 'bg-[#c5a059] border-[#c5a059] text-black'
                                : 'border-gray-700 bg-black'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs uppercase tracking-wider font-medium">{addon.name}</span>
                        </div>
                        <span className="text-xs font-serif text-[#c5a059] font-medium">
                          + Rs. {addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                Special Kitchen Instructions
              </label>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {presetInstructions.map((preset) => {
                  const isApplied = specialInstructions.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddPresetInstruction(preset)}
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-all ${
                        isApplied
                          ? 'bg-[#c5a059] text-black font-bold border-[#c5a059]'
                          : 'bg-[#141414] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra spicy, serve gravy on the side, extra lime wedges..."
                rows={2}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a059] resize-none"
              />
            </div>

            {/* Companion Smart Pairings */}
            {pairingItems.length > 0 && (
              <div className="pt-3 border-t border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-3">
                  <Utensils className="w-3.5 h-3.5 text-[#c5a059]" /> Pairs Well With This Dish
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pairingItems.slice(0, 2).map((pair) => (
                    <div
                      key={pair.id}
                      className="flex items-center justify-between p-2.5 bg-[#141414] border border-white/5"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-10 h-10 overflow-hidden shrink-0 bg-black">
                          <FoodImage
                            src={pair.image}
                            fallbackSrc={pair.fallbackImage}
                            alt={pair.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <div className="text-xs uppercase tracking-wider text-gray-200 truncate font-medium">{pair.name}</div>
                          <div className="text-xs font-serif text-[#c5a059] font-medium">Rs. {pair.price}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(pair, 1)}
                        className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#c5a059] hover:text-black text-gray-300 text-[10px] uppercase tracking-wider font-bold border border-white/10 transition-all shrink-0 ml-2"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Sticky Bar */}
        <div className="p-4 bg-[#0d0d0d] border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-[#141414] border border-white/10 p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 bg-black/40 hover:bg-white/10 text-gray-300 flex items-center justify-center font-bold transition-all active:scale-90"
              aria-label="Decrease"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-white px-2 min-w-[24px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 bg-black/40 hover:bg-white/10 text-gray-300 flex items-center justify-center font-bold transition-all active:scale-90"
              aria-label="Increase"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Action */}
          <button
            id="btn-modal-add-to-cart"
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-[0.2em] font-bold shadow-lg transition-all ${
              addedAnimation
                ? 'bg-emerald-600 text-white scale-95'
                : 'bg-[#c5a059] hover:bg-[#d6b26b] text-black active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
                <span className="font-serif normal-case ml-1">
                  • Rs. {totalPrice.toLocaleString()}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
