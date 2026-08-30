import React from 'react';
import { Flame, UtensilsCrossed, Clock, ShieldCheck, Heart } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-12 md:py-20 bg-[#0c0c0e] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" /> Our Story
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading leading-tight">
              Reinventing Sri Lankan Evening Bites for the <span className="text-amber-400">Modern Hangout.</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              At Ceylon Bites & Sizzle, we took the legendary street rhythms of Colombo night food — the clanging chop of godamba roti on iron kottu plates, sizzling caramelised devilled pans, and crunch of fresh sea cuttlefish — and elevated them into a modern evening destination.
            </p>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              We built our dining experience around what people love most: bold fiery flavours, warm mood lighting, fast smartphone table ordering, and complete BYOB freedom. Whether catching up with friends or celebrating a weekend unwind, we make sure the food is unforgettable and the vibes are unmatched.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <Flame className="w-5 h-5 text-red-500 mb-2" />
                <h4 className="text-xs sm:text-sm font-bold text-white">Bold Island Spices</h4>
                <p className="text-[11px] text-zinc-400 mt-1">Roast Ceylon curry & black pepper</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <Clock className="w-5 h-5 text-amber-500 mb-2" />
                <h4 className="text-xs sm:text-sm font-bold text-white">Fast Wok Sizzle</h4>
                <p className="text-[11px] text-zinc-400 mt-1">15-minute fresh table prep</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <UtensilsCrossed className="w-5 h-5 text-emerald-500 mb-2" />
                <h4 className="text-xs sm:text-sm font-bold text-white">BYOB Welcomed</h4>
                <p className="text-[11px] text-zinc-400 mt-1">Zero corkage & chilled glasses</p>
              </div>
            </div>
          </div>

          {/* Right Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 p-3 shadow-2xl space-y-3">
              <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Ceylon Bites culinary team"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400 font-bold text-xs">COLOMBO, SRI LANKA</span>
                </div>
                <p className="text-xs text-zinc-300">
                  "Good food. Great times. Bring your bottle — we'll supply the sizzling bites."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
