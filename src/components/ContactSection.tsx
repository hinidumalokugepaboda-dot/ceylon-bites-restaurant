import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Wine, 
  ExternalLink,
  Instagram,
  Facebook,
  Send
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact-section" className="py-12 md:py-20 bg-[#0c0c0e] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" /> Visit Our Restaurant
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
            Find Us & Opening Hours
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Conveniently located along Marine Drive, Colombo 03 with secure parking and ocean breeze.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Cards */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Location & Address</h4>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    No. 42 Marine Drive, Kollupitiya, Colombo 03, Sri Lanka
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Evening Opening Hours</h4>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Tuesday – Sunday: 5:00 PM – 11:30 PM (Kitchen closes 11:00 PM)
                  </p>
                  <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                    Mondays: Closed for deep prep
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Phone / Inquiries</h4>
                <div className="text-sm font-black text-white font-mono">+94 11 234 5678</div>
                <div className="text-[11px] text-zinc-400">+94 77 123 4567 (WhatsApp)</div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</h4>
                <div className="text-xs font-bold text-white">hello@ceylonbites.lk</div>
                <div className="text-[11px] text-zinc-400">reservations@ceylonbites.lk</div>
              </div>
            </div>
          </div>

          {/* Map Location Mock Placeholder */}
          <div className="lg:col-span-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-2xl p-3 flex flex-col justify-between text-left space-y-3">
            <div className="relative h-64 sm:h-72 w-full rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
              {/* Stylized dark map placeholder visual */}
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-heading">
                    Ceylon Bites & Sizzle BYOB
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Marine Drive, Colombo 03 (Facing the Indian Ocean)
                  </p>
                </div>
                <span className="text-[11px] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 font-semibold">
                  Google Maps Location Verified
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 px-2">
              <span>Free Parking Available On-Site</span>
              <span className="text-amber-400 font-bold">Open Today at 5:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
