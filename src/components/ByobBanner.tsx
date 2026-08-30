import React from 'react';
import { Wine, Sparkles, Check, GlassWater, ShieldAlert } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const ByobBanner: React.FC = () => {
  const { needIceBucket, setNeedIceBucket, needGlassware, setNeedGlassware } = useRestaurant();

  return (
    <section className="py-8 md:py-12 bg-[#0d0d0d] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gold glow accent */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#c5a059]/5 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-3 text-left">
              <div className="inline-block border border-[#c5a059] px-3 py-1">
                <p className="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.25em] flex items-center gap-1.5">
                  <Wine className="w-3 h-3 text-[#c5a059]" />
                  BYOB Concierge & Guidelines
                </p>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-tight">
                Bring Your Own Bottle. <span className="text-[#c5a059] italic">We Provide the Sizzle.</span>
              </h3>

              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-3xl">
                Feel welcome to bring your preferred wine, single malt, beer, or spirits to pair with our fiery Sri Lankan devilled dishes, cuttlefish, and artisan cheese kottu. Chilled crystal glassware, hammered ice buckets, and fresh lime chasers are provided with zero corkage fee.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-[#161616] p-3 border border-white/5 uppercase tracking-wider text-[10px]">
                  <Check className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>0% Corkage Fee</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-[#161616] p-3 border border-white/5 uppercase tracking-wider text-[10px]">
                  <Check className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>Chilled Glassware</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-[#161616] p-3 border border-white/5 uppercase tracking-wider text-[10px]">
                  <Check className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>Ice Buckets & Tongs</span>
                </div>
              </div>
            </div>

            {/* Right Quick Setup Checklist for Table */}
            <div className="lg:col-span-4 bg-[#141414] border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Table BYOB Setup
                </span>
                <span className="text-[9px] border border-[#c5a059]/40 text-[#c5a059] px-2 py-0.5 uppercase tracking-wider font-bold">
                  Complimentary
                </span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 bg-[#181818] border border-white/5 text-xs text-gray-300 cursor-pointer hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <GlassWater className="w-4 h-4 text-[#c5a059]" />
                    <span className="text-[11px] tracking-wide">Bring Chilled Glasses for Table</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={needGlassware}
                    onChange={(e) => setNeedGlassware(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-black text-[#c5a059] focus:ring-[#c5a059] accent-[#c5a059]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#181818] border border-white/5 text-xs text-gray-300 cursor-pointer hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c5a059]" />
                    <span className="text-[11px] tracking-wide">Bring Ice Bucket with Tongs</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={needIceBucket}
                    onChange={(e) => setNeedIceBucket(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-black text-[#c5a059] focus:ring-[#c5a059] accent-[#c5a059]"
                  />
                </label>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 pt-1">
                <ShieldAlert className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span>Strictly 21+ for alcoholic beverages. Drink responsibly.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
