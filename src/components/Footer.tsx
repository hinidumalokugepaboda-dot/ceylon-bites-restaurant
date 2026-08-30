import React from 'react';
import { Flame, Heart, Phone, Mail, MapPin, Wine, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-left pt-12 pb-24 md:pb-12 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0c0c0e] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-white font-heading">
                  CEYLON <span className="text-amber-500">BITES</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">
                  Modern Sri Lankan BYOB & Evening Hangout
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Bold flavours, sizzling bites and good food for nights worth remembering. Bring your bottle — we'll supply the sizzling bites.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-amber-400 hover:border-amber-500 cursor-pointer transition-all">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-amber-400 hover:border-amber-500 cursor-pointer transition-all">
                <Facebook className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Digital Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('budget')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Budget Optimizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Weekend Offers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('loyalty')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Loyalty Rewards
                </button>
              </li>
            </ul>
          </div>

          {/* Menu Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Food Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Sizzling Kottu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Devilled Dishes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Hot Butter Seafood
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Wok Fried Rice & Noodles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Sharing Boards & Platters
                </button>
              </li>
            </ul>
          </div>

          {/* BYOB & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              BYOB & Table Rules
            </h4>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li>✓ 0% Corkage Fee</li>
              <li>✓ Chilled Glassware Provided</li>
              <li>✓ Ice Buckets On Request</li>
              <li>✓ Non-Alcoholic Chasers Available</li>
              <li>✓ Strictly 21+ for Alcohol</li>
              <li>✓ Table QR Ordering Enabled</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Ceylon Bites & Sizzle. All rights reserved. Built for modern dining.
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            Designed for Sri Lankan BYOB dining & good times.
          </div>
        </div>
      </div>
    </footer>
  );
};
