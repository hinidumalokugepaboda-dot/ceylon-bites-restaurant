import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Wine, 
  QrCode, 
  ArrowRight, 
  Clock, 
  UtensilsCrossed, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodImage } from './common/FoodImage';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenBudget: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onOpenBudget }) => {
  const { tableNumber, setIsTableModalOpen, openFoodModal } = useRestaurant();

  return (
    <section className="relative overflow-hidden pt-6 pb-14 md:pt-10 md:pb-24 border-b border-white/10 bg-[#0a0a0a]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[300px] md:h-[500px] bg-[#c5a059]/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Table Detection Ribbon (Mobile & Desktop) */}
        <div className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#121212] border border-white/10 text-xs text-gray-300 shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5a059]"></span>
          </span>
          <span className="uppercase tracking-[0.15em] text-[10px]">Active Dining</span>
          <span className="text-[#c5a059] font-bold tracking-widest text-[11px] border border-[#c5a059]/40 px-2 py-0.5 bg-[#1a1a1a]">
            TABLE #{tableNumber}
          </span>
          <button
            onClick={() => setIsTableModalOpen(true)}
            className="text-gray-400 hover:text-white uppercase tracking-wider text-[10px] ml-1 flex items-center gap-0.5 font-medium transition-colors"
          >
            Change <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-block border border-[#c5a059] px-3 py-1">
              <p className="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.25em] flex items-center gap-1.5">
                <Wine className="w-3 h-3 text-[#c5a059]" />
                BYOB Evening Dining • 0% Corkage
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight text-white leading-[1.15]">
              Sri Lankan Bites <br className="hidden sm:inline" />
              Crafted for <span className="text-[#c5a059] italic font-normal">Good Times.</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 max-w-2xl font-light leading-relaxed">
              Bold island flavours, sizzling devilled bites, and artisan kottu prepared live on open iron plates. 
              <span className="text-gray-200 font-normal block sm:inline sm:ml-1">
                Bring your favourite bottle — we provide the chilled glasses and sizzling bites.
              </span>
            </p>

            {/* Quick Slogan Badge */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 bg-[#141414] px-3 py-1.5 border border-white/5 text-[10px] uppercase tracking-widest">
                <QrCode className="w-3.5 h-3.5 text-[#c5a059]" /> Scan & Order
              </span>
              <span className="flex items-center gap-1.5 bg-[#141414] px-3 py-1.5 border border-white/5 text-[10px] uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 text-[#c5a059]" /> 15-Min Live Wok
              </span>
              <span className="flex items-center gap-1.5 bg-[#141414] px-3 py-1.5 border border-white/5 text-[10px] uppercase tracking-widest">
                <Flame className="w-3.5 h-3.5 text-[#c5a059]" /> Open Fire Sizzle
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="btn-hero-order-now"
                onClick={onExploreMenu}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#c5a059] hover:bg-[#d6b26b] text-black text-[11px] uppercase tracking-[0.2em] font-bold shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Order For Table {tableNumber}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="btn-hero-budget"
                onClick={onOpenBudget}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#c5a059]/40 text-gray-300 hover:text-white text-[11px] uppercase tracking-[0.15em] font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                Budget Meal Optimizer
              </button>
            </div>
          </div>

          {/* Right Hero Food Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-white/10 bg-[#111111] p-3 shadow-2xl">
              {/* Main Featured Food Card */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden group bg-[#161616]">
                <FoodImage
                  src="/assets/images/foods/cheese-chicken-kottu.jpg"
                  fallbackSrc="https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80"
                  alt="Sizzling Cheese Chicken Kottu"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Floating Tags */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <div className="border border-[#c5a059] bg-black/80 px-2.5 py-0.5">
                    <p className="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.2em]">Featured Sizzler</p>
                  </div>
                  <span className="bg-[#111111]/90 border border-white/10 text-gray-300 font-medium text-[10px] px-2 py-0.5 uppercase tracking-wider">
                    Cheese Chicken Kottu
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="text-left">
                    <p className="text-xs text-gray-400 font-light line-clamp-1">
                      Chopped Godamba roti, spiced chicken & melty cheese
                    </p>
                    <p className="text-xl font-serif text-[#c5a059] font-medium">
                      Rs. 1,250
                    </p>
                  </div>
                  <button
                    onClick={onExploreMenu}
                    className="px-4 py-2 bg-[#c5a059] hover:bg-[#d6b26b] text-black text-[10px] uppercase tracking-widest font-bold shadow transition-all"
                  >
                    View Dish
                  </button>
                </div>
              </div>

              {/* Mini Food Collage Strip */}
              <div className="grid grid-cols-3 gap-2 mt-2.5">
                <div className="bg-[#161616] p-2 border border-white/5 flex items-center gap-2 text-left">
                  <div className="w-10 h-10 overflow-hidden shrink-0 bg-black">
                    <FoodImage
                      src="/assets/images/foods/devilled-chicken.jpg"
                      fallbackSrc="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80"
                      alt="Devilled Chicken"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] uppercase tracking-wider text-gray-300 truncate">Devilled Chicken</div>
                    <div className="text-[10px] text-[#c5a059] font-bold">Rs. 850</div>
                  </div>
                </div>

                <div className="bg-[#161616] p-2 border border-white/5 flex items-center gap-2 text-left">
                  <div className="w-10 h-10 overflow-hidden shrink-0 bg-black">
                    <FoodImage
                      src="/assets/images/foods/hot-butter-cuttlefish.jpg"
                      fallbackSrc="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80"
                      alt="Hot Butter Cuttlefish"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] uppercase tracking-wider text-gray-300 truncate">Hot Butter Cuttlefish</div>
                    <div className="text-[10px] text-[#c5a059] font-bold">Rs. 1,400</div>
                  </div>
                </div>

                <div className="bg-[#161616] p-2 border border-white/5 flex items-center gap-2 text-left">
                  <div className="w-10 h-10 overflow-hidden shrink-0 bg-black">
                    <FoodImage
                      src="/assets/images/foods/fresh-lime.jpg"
                      fallbackSrc="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80"
                      alt="Fresh Lime Soda"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] uppercase tracking-wider text-gray-300 truncate">Fresh Lime Soda</div>
                    <div className="text-[10px] text-[#c5a059] font-bold">Rs. 250</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
