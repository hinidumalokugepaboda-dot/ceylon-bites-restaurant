import React from 'react';
import { Sparkles, Users, Flame, Moon, Music } from 'lucide-react';
import { FoodImage } from './common/FoodImage';

export const RestaurantAtmosphere: React.FC = () => {
  const moments = [
    {
      title: 'Modern Evening Ambience',
      tag: 'Warm Atmosphere',
      desc: 'Ambient mood lighting, curated playlist, and cozy seating designed for long conversations and good times.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      icon: Moon
    },
    {
      title: 'Sizzling Open Wok Station',
      tag: 'Iron & Flames',
      desc: 'Watch our chefs toss chopped godamba roti and sizzling devilled bites over roaring iron plates.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      icon: Flame
    },
    {
      title: 'Social Sharing & Platters',
      tag: 'Friends & Family',
      desc: 'Generous sharing boards created for passing around the table while enjoying chilled drinks.',
      image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
      icon: Users
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-[#0f0f12] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Good Food • Great Times
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
            The Evening Dining Atmosphere
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A stylish, dark-and-warm hangout where incredible food meets effortless BYOB comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-xl group hover:border-amber-500/40 transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/30" />

                  <div className="absolute top-3 left-3">
                    <span className="bg-black/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-500/20 flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-black text-white font-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
