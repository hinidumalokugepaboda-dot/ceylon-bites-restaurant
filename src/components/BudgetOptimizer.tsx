import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShoppingBag, 
  RefreshCw, 
  Plus,
  Flame,
  Utensils,
  Users,
  TrendingDown,
  TrendingUp,
  Target
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodImage } from './common/FoodImage';
import { FoodItem } from '../types';

export const BudgetOptimizer: React.FC = () => {
  const { 
    optimizeBudget, 
    addToCart, 
    setIsCartOpen, 
    openFoodModal, 
    setTargetBudget, 
    setTargetHeadcount,
    targetBudget 
  } = useRestaurant();

  const [budgetInput, setBudgetInput] = useState<number>(3500);
  const [protein, setProtein] = useState<string>('chicken');
  const [foodType, setFoodType] = useState<string>('kottu');
  const [drink, setDrink] = useState<string>('lime');
  const [groupSize, setGroupSize] = useState<number>(2);
  const [comboAdded, setComboAdded] = useState<boolean>(false);
  const [trackerSet, setTrackerSet] = useState<boolean>(false);

  // Compute recommendation
  const recommendation = useMemo(() => {
    return optimizeBudget(budgetInput, protein, foodType, drink, groupSize);
  }, [budgetInput, protein, foodType, drink, groupSize, optimizeBudget]);

  const handleAddComboToCart = () => {
    recommendation.items.forEach((item) => {
      addToCart(item.food, item.quantity, item.food.spiceLevel, '', [], item.portion);
    });
    // Also auto-activate the budget tracker
    setTargetBudget(budgetInput);
    setTargetHeadcount(groupSize);

    setComboAdded(true);
    setTimeout(() => {
      setComboAdded(false);
      setIsCartOpen(true);
    }, 800);
  };

  const handleSetTracker = () => {
    setTargetBudget(budgetInput);
    setTargetHeadcount(groupSize);
    setTrackerSet(true);
    setTimeout(() => setTrackerSet(false), 2000);
  };

  const budgetPresets = [1500, 2500, 3500, 5000, 7500];

  return (
    <section id="budget-optimizer-section" className="py-14 md:py-20 bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-block border border-[#c5a059] px-3 py-1">
            <p className="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.25em]">
              Knapsack Meal Curator
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-white">
            Smart Budget & Portion Optimizer
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light tracking-wide">
            Enter your total spending limit and group headcount. Our knapsack algorithm calculates the optimal combination of Small, Medium, and Large portions for your table.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Preferences Form */}
          <div className="lg:col-span-5 bg-[#111111] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl text-left">
            {/* Budget Input & Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Total Budget Limit (LKR)
                </label>
                <span className="text-lg font-serif text-[#c5a059] font-medium">
                  Rs. {budgetInput.toLocaleString()}
                </span>
              </div>

              {/* Slider */}
              <input
                id="budget-range-slider"
                type="range"
                min="800"
                max="10000"
                step="100"
                value={budgetInput}
                onChange={(e) => setBudgetInput(Number(e.target.value))}
                className="w-full h-1.5 bg-[#222222] appearance-none cursor-pointer accent-[#c5a059] mb-3"
              />

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {budgetPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBudgetInput(preset)}
                    className={`text-[10px] uppercase tracking-wider px-2.5 py-1 font-medium border transition-all ${
                      budgetInput === preset
                        ? 'bg-[#c5a059] text-black border-[#c5a059] font-bold shadow'
                        : 'bg-[#161616] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    Rs. {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Diners / Headcount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#c5a059]" /> Headcount / Group Size
                </label>
                <span className="text-xs text-[#c5a059] font-serif font-medium">
                  {groupSize} {groupSize === 1 ? 'Person' : 'People'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { count: 1, label: '1 (Solo)' },
                  { count: 2, label: '2 (Duo)' },
                  { count: 3, label: '3 (Trio)' },
                  { count: 4, label: '4 (Group)' }
                ].map((item) => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setGroupSize(item.count)}
                    className={`py-2 text-[10px] uppercase tracking-wider font-medium border transition-all ${
                      groupSize === item.count
                        ? 'bg-[#c5a059] text-black border-[#c5a059] font-bold shadow'
                        : 'bg-[#161616] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Protein Preference */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                Protein Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'chicken', label: 'Chicken' },
                  { id: 'beef', label: 'Beef' },
                  { id: 'seafood', label: 'Seafood' },
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'any', label: 'Mixed' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProtein(item.id)}
                    className={`py-2 px-2 text-[10px] uppercase tracking-wider font-medium border transition-all ${
                      protein === item.id
                        ? 'bg-[#1a1710] border-[#c5a059] text-[#c5a059] font-bold'
                        : 'bg-[#161616] border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Dish Style */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                Main Dish Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'kottu', label: 'Kottu' },
                  { id: 'fried-rice', label: 'Fried Rice' },
                  { id: 'noodles', label: 'Noodles' },
                  { id: 'devilled', label: 'Devilled' },
                  { id: 'chicken-bites', label: 'Bites & Wings' },
                  { id: 'any', label: 'Surprise Me' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFoodType(item.id)}
                    className={`py-2 px-2 text-[10px] uppercase tracking-wider font-medium border transition-all ${
                      foodType === item.id
                        ? 'bg-[#1a1710] border-[#c5a059] text-[#c5a059] font-bold'
                        : 'bg-[#161616] border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Beverage / Chaser */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                Beverage / Chaser
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'lime', label: 'Fresh Lime' },
                  { id: 'passion', label: 'Passion Cooler' },
                  { id: 'ginger', label: 'Ginger Beer' },
                  { id: 'soft', label: 'Coke / Sprite' },
                  { id: 'any', label: 'Any Chaser' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDrink(item.id)}
                    className={`py-2 px-2 text-[10px] uppercase tracking-wider font-medium border transition-all ${
                      drink === item.id
                        ? 'bg-[#1a1710] border-[#c5a059] text-[#c5a059] font-bold'
                        : 'bg-[#161616] border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Progress Tracker Button */}
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleSetTracker}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#181818] hover:bg-[#202020] border border-white/10 hover:border-[#c5a059]/50 text-gray-300 text-[10px] uppercase tracking-wider font-bold transition-all"
              >
                <Target className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{trackerSet ? '✓ Active Tracker Set!' : 'Lock As Real-Time Table Budget Tracker'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Recommended Combo Card */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="bg-[#111111] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Header Status & Budget Meter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                    Knapsack Optimized Selection
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif text-white font-light mt-0.5">
                    {recommendation.comboTitle}
                  </h3>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {!recommendation.isOverBudget ? (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-800/60 px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Within Budget (Rs. {recommendation.remaining.toLocaleString()} left)
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 bg-red-950/90 border border-red-800/60 px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-red-400">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      Rs. {recommendation.overAmount.toLocaleString()} Over Budget
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Budget Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">
                    Combo Total: <strong className="text-white font-serif">Rs. {recommendation.totalCost.toLocaleString()}</strong>
                    <span className="text-[10px] text-gray-500 ml-2">
                      (Serves {recommendation.totalServings} for {groupSize} {groupSize === 1 ? 'person' : 'people'})
                    </span>
                  </span>
                  <span className="text-gray-400">
                    Target: <strong className="text-[#c5a059] font-serif">Rs. {recommendation.budget.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="w-full h-2 bg-[#222222] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      recommendation.isOverBudget ? 'bg-red-500' : 'bg-[#c5a059]'
                    }`}
                    style={{
                      width: `${Math.min(100, (recommendation.totalCost / recommendation.budget) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Recommended Items List with Multi-tier Portion details */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                  Curated Portions & Items ({recommendation.items.length} Line Items)
                </span>

                <div className="space-y-2.5">
                  {recommendation.items.map((item) => (
                    <div
                      key={`${item.food.id}-${item.portion.id}`}
                      onClick={() => openFoodModal(item.food)}
                      className="flex items-center justify-between p-3.5 bg-[#161616] border border-white/5 hover:border-[#c5a059]/40 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-12 h-12 overflow-hidden shrink-0 bg-black">
                          <FoodImage
                            src={item.food.image}
                            fallbackSrc={item.food.fallbackImage}
                            alt={item.food.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2 truncate">
                            <h4 className="text-xs uppercase tracking-wider font-bold text-white group-hover:text-[#c5a059] transition-colors truncate">
                              {item.food.name}
                            </h4>
                            <span className="bg-[#1e1910] border border-[#c5a059]/50 text-[#c5a059] px-1.5 py-0.2 text-[8px] font-bold uppercase shrink-0">
                              {item.portion.portionCode} • Serves {item.portion.servesCount}
                            </span>
                            {item.quantity > 1 && (
                              <span className="bg-white/10 text-white px-1.5 py-0.2 text-[9px] font-bold shrink-0">
                                x{item.quantity}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.portion.portionName} • {item.portion.description || 'Standard Serving'}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm font-serif text-[#c5a059] font-medium shrink-0 ml-3">
                        Rs. {item.itemTotal.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Knapsack Swap Suggestions (Downscaling / Upscaling) */}
              {recommendation.swapSuggestions && recommendation.swapSuggestions.length > 0 && (
                <div className="p-4 bg-[#141414] border border-[#c5a059]/20 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                    Portion Optimization Suggestions
                  </div>
                  <div className="space-y-2">
                    {recommendation.swapSuggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#1a1a1a] border border-white/5 flex items-start gap-2 text-xs text-gray-300"
                      >
                        {sug.type === 'downscale' ? (
                          <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="leading-relaxed">{sug.explanation}</p>
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5">
                            {sug.type === 'downscale'
                              ? `Saves Rs. ${sug.priceDifference.toLocaleString()}`
                              : `Upgrade for Rs. ${Math.abs(sug.priceDifference).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1-Click Action to Add Entire Combo */}
              <div className="pt-2">
                <button
                  id="btn-add-budget-combo-to-cart"
                  onClick={handleAddComboToCart}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-bold shadow-xl transition-all ${
                    comboAdded
                      ? 'bg-emerald-600 text-white scale-95'
                      : 'bg-[#c5a059] hover:bg-[#d6b26b] text-black active:scale-95'
                  }`}
                >
                  {comboAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Combo Added to Table Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Entire Combo to Cart (Rs. {recommendation.totalCost.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

