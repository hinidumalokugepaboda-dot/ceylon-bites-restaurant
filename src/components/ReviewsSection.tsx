import React from 'react';
import { Star, MessageSquare, Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/menuData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-[#0f0f12] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" /> Customer Experiences
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
            What Food Lovers Say
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real reviews from diners ordering from our digital tables in Colombo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all text-left shadow-lg"
            >
              <div className="space-y-3">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-white">{rev.name}</span>
                  <span className="text-[10px] text-zinc-500">{rev.date}</span>
                </div>
                <div className="text-[11px] text-amber-400 font-semibold truncate">
                  Favourite: {rev.dish}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
