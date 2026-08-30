import React from 'react';
import { QrCode, Search, CheckCircle2, PartyPopper } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'SCAN QR',
      description: 'Point your smartphone camera at the table QR code to open your digital menu instantly.',
      icon: QrCode,
      highlight: 'Instant Access'
    },
    {
      step: '02',
      title: 'EXPLORE MENU',
      description: 'Browse kottu, sizzling devilled dishes, seafood platters, or use our smart budget optimizer.',
      icon: Search,
      highlight: 'Full Flavours'
    },
    {
      step: '03',
      title: 'PLACE ORDER',
      description: 'Customize spice levels, add chef notes, apply loyalty points, and send directly to the wok kitchen.',
      icon: CheckCircle2,
      highlight: 'Direct to Kitchen'
    },
    {
      step: '04',
      title: 'ENJOY & UNWIND',
      description: 'Savour fresh sizzling dishes, enjoy your drinks, and track your order preparation in real time.',
      icon: PartyPopper,
      highlight: 'Good Times'
    }
  ];

  return (
    <section className="py-14 md:py-20 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block border border-[#c5a059] px-3 py-1 mb-3">
            <p className="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.25em]">
              Seamless Dining Process
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-white">
            Digital Table Ordering
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-2 tracking-wide">
            Instant smartphone table ordering with zero queues and real-time kitchen tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                id={`how-it-works-step-${index + 1}`}
                className="relative bg-[#111111] border border-white/5 p-7 hover:border-[#c5a059]/50 transition-all duration-300 group hover:-translate-y-1 text-left"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-serif italic text-gray-600 group-hover:text-[#c5a059] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-11 h-11 border border-white/10 flex items-center justify-center text-gray-300 group-hover:border-[#c5a059] group-hover:text-[#c5a059] bg-[#161616] transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-sm font-serif uppercase tracking-[0.15em] font-medium text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="h-[1px] w-full bg-white/10 mb-3" />

                <div className="inline-block text-[9px] uppercase tracking-[0.2em] font-medium text-[#c5a059]">
                  {item.highlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
