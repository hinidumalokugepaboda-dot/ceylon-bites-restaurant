import React, { useRef } from 'react';
import { 
  Search, 
  X, 
  Flame, 
  Leaf, 
  Sparkles, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { FOOD_ITEMS, CATEGORIES } from '../data/menuData';
import { FoodCard } from './FoodCard';
import { MenuCategory } from '../types';

export const MenuSection: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    tableNumber
  } = useRestaurant();

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Filtering Logic
  const filteredFoods = FOOD_ITEMS.filter((item) => {
    // 1. Category Filter
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchIngredients = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags && !matchIngredients) {
        return false;
      }
    }

    // 3. Dietary / Trait Filter
    if (selectedFilter === 'spicy' && !item.spicy) return false;
    if (selectedFilter === 'vegetarian' && !item.vegetarian) return false;
    if (selectedFilter === 'popular' && !item.popular) return false;
    if (selectedFilter === 'chef-special' && !item.chefSpecial) return false;

    return true;
  });

  return (
    <section id="menu-section" className="py-12 md:py-20 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
        {/* Section Header */}
        <div className="text-left space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-block border border-[#c5a059] px-3 py-1 mb-2">
                <p className="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.25em]">
                  Digital Table Menu
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-white">
                Bites, Kottu & Sizzlers
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light tracking-wide mt-1">
                Artisan wok creations prepared live for Table #{tableNumber}. Pair with your chosen BYOB drinks.
              </p>
            </div>

            {/* Quick Status / Total Dishes Count */}
            <div className="hidden sm:flex items-center gap-2 bg-[#141414] px-3.5 py-2 border border-white/10 text-xs text-gray-300 font-light tracking-wider uppercase text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
              <span>{filteredFoods.length} Creations Available</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-3xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#c5a059] pointer-events-none" />
            <input
              id="menu-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chicken kottu, devilled cuttlefish, pork belly, spicy wings..."
              className="w-full bg-[#111111] border border-white/10 pl-11 pr-10 py-3.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a059] tracking-wide transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 text-gray-400 hover:text-white rounded-full bg-[#1c1c1c]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Navigation Tabs */}
        <div className="relative">
          {/* Scroll Buttons for Desktop */}
          <button
            onClick={() => scrollCategories('left')}
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-[#141414] border border-white/10 text-gray-300 hover:text-white hover:border-[#c5a059] items-center justify-center shadow-lg transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollCategories('right')}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-[#141414] border border-white/10 text-gray-300 hover:text-white hover:border-[#c5a059] items-center justify-center shadow-lg transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div
            ref={categoryScrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth select-none"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-tab-${cat.id}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs whitespace-nowrap uppercase tracking-[0.15em] transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-[#c5a059] text-black font-bold shadow-md'
                      : 'bg-[#141414] hover:bg-[#1c1c1c] text-gray-300 border border-white/5 hover:border-white/20'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Chips (Spicy, Veg, Popular, Chef Special) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3 text-[#c5a059]" /> Filters:
          </span>

          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'popular', label: 'Popular', icon: Sparkles },
            { id: 'spicy', label: 'Spicy Sizzle', icon: Flame },
            { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
            { id: 'chef-special', label: "Chef Special", icon: Award }
          ].map((chip) => {
            const isCurrent = selectedFilter === chip.id;
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedFilter(chip.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium whitespace-nowrap border transition-all ${
                  isCurrent
                    ? 'bg-[#1a1710] border-[#c5a059] text-[#c5a059]'
                    : 'bg-[#111111] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {Icon && <Icon className="w-3 h-3 text-[#c5a059]" />}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        {activeCategory !== 'all' && (
          <div className="p-4 bg-[#111111] border border-white/5 text-left flex items-center justify-between text-xs">
            <span className="text-gray-300 font-light">
              <strong className="text-[#c5a059] uppercase tracking-wider font-semibold">
                {CATEGORIES.find((c) => c.id === activeCategory)?.name}:
              </strong>{' '}
              {CATEGORIES.find((c) => c.id === activeCategory)?.description}
            </span>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-[10px] uppercase tracking-widest text-[#c5a059] hover:underline shrink-0 ml-3 font-semibold"
            >
              Show All
            </button>
          </div>
        )}

        {/* Food Items Grid */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-[#111111] border border-white/5 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center mx-auto text-[#c5a059]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif text-white">No dishes found</h3>
              <p className="text-xs text-gray-400 font-light mt-1">
                We couldn't find any dishes matching "{searchQuery}". Try searching for 'kottu', 'devilled' or 'cuttlefish'.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedFilter('all');
              }}
              className="px-4 py-2 bg-[#c5a059] text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#d6b26b] transition-all shadow"
            >
              Reset Filters & Show All
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
