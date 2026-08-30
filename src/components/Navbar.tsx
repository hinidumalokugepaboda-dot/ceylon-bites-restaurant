import React, { useState } from 'react';
import { 
  Flame, 
  ShoppingBag, 
  User, 
  QrCode, 
  Menu as MenuIcon, 
  X, 
  Sparkles,
  Search,
  Percent,
  Award,
  Info,
  Phone
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const {
    tableNumber,
    cartTotalCount,
    finalCartTotal,
    setIsCartOpen,
    setIsTableModalOpen,
    setIsAuthModalOpen,
    setIsProfileOpen,
    customerUser,
    setSearchQuery
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearchOpen, setNavSearchOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#c5a059]/40 p-0.5 shadow-md transition-all group-hover:border-[#c5a059]">
              <div className="w-full h-full bg-[#141414] rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#c5a059] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-[0.18em] text-lg md:text-xl text-white font-bold">
                  CEYLON <span className="text-[#c5a059]">BITES</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] px-2 py-0.5 border border-[#c5a059]/50 text-[#c5a059] bg-[#161616]">
                  BYOB
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 hidden sm:inline font-medium">
                Modern Sri Lankan Dining & Sizzlers
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-medium text-gray-400 hover:text-white transition-all"
            >
              Home
            </button>
            <button
              id="nav-menu"
              onClick={() => handleNavClick('menu')}
              className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-medium text-gray-400 hover:text-white transition-all"
            >
              Food Menu
            </button>
            <button
              id="nav-budget"
              onClick={() => handleNavClick('budget')}
              className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#c5a059] hover:text-white transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              Budget Optimizer
            </button>
            <button
              id="nav-offers"
              onClick={() => handleNavClick('offers')}
              className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-medium text-gray-400 hover:text-white transition-all flex items-center gap-1"
            >
              <Percent className="w-3 h-3 text-[#c5a059]" />
              Offers
            </button>
            <button
              id="nav-loyalty"
              onClick={() => handleNavClick('loyalty')}
              className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-medium text-gray-400 hover:text-white transition-all flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-[#c5a059]" />
              Loyalty (2,450 pts)
            </button>
            <button
              id="nav-about"
              onClick={() => handleNavClick('about')}
              className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-medium text-gray-400 hover:text-white transition-all"
            >
              About & BYOB
            </button>
            <button
              id="nav-contact"
              onClick={() => handleNavClick('contact')}
              className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-medium text-gray-400 hover:text-white transition-all"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Table Badge */}
            <button
              id="btn-table-badge"
              onClick={() => setIsTableModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#c5a059]/50 text-[10px] uppercase tracking-widest font-semibold text-gray-300 transition-all"
              title="Click to change table or view QR status"
            >
              <QrCode className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Table</span>
              <span className="text-[#c5a059] font-bold">
                #{tableNumber}
              </span>
            </button>

            {/* Quick Search */}
            <button
              id="btn-nav-search"
              onClick={() => {
                handleNavClick('menu');
                setNavSearchOpen(!navSearchOpen);
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all hidden sm:flex border border-white/5"
              aria-label="Search food"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Account Profile / Login */}
            <button
              id="btn-nav-account"
              onClick={() => {
                if (customerUser.isLoggedIn) {
                  setIsProfileOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-gray-300 hover:text-white hover:bg-white/5 border border-white/5 transition-all text-xs font-medium"
              aria-label="Account profile"
            >
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden sm:inline truncate max-w-[90px] uppercase tracking-wider text-[10px]">
                {customerUser.isLoggedIn ? customerUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#c5a059] hover:bg-[#d6b26b] text-black px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold shadow-md transition-all transform active:scale-95"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
              {cartTotalCount > 0 && (
                <span className="bg-black text-[#c5a059] font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Nav Search Overlay dropdown if toggled */}
      {navSearchOpen && (
        <div className="bg-[#111111] border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-[#c5a059]" />
            <input
              type="text"
              placeholder="Search chicken kottu, hot butter cuttlefish, devilled dishes..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a059]"
              autoFocus
            />
            <button
              onClick={() => setNavSearchOpen(false)}
              className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-white px-2 py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d0d] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="text-xs text-gray-400">
              Ordering for <span className="font-bold text-[#c5a059]">Table #{tableNumber}</span>
            </div>
            <button
              onClick={() => {
                setIsTableModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-[10px] uppercase tracking-wider font-semibold text-[#c5a059] hover:underline"
            >
              Switch Table
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 p-3 bg-[#141414] border border-white/5 text-left text-xs uppercase tracking-wider font-medium text-gray-300 hover:bg-[#1a1a1a]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('menu')}
              className="flex items-center gap-2.5 p-3 bg-[#141414] border border-white/5 text-left text-xs uppercase tracking-wider font-medium text-gray-300 hover:bg-[#1a1a1a]"
            >
              Food Menu
            </button>
            <button
              onClick={() => handleNavClick('budget')}
              className="flex items-center gap-2.5 p-3 bg-[#181510] border border-[#c5a059]/30 text-left text-xs uppercase tracking-wider font-bold text-[#c5a059]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              Budget Meal
            </button>
            <button
              onClick={() => handleNavClick('offers')}
              className="flex items-center gap-2.5 p-3 bg-[#141414] border border-white/5 text-left text-xs uppercase tracking-wider font-medium text-gray-300 hover:bg-[#1a1a1a]"
            >
              <Percent className="w-3.5 h-3.5 text-[#c5a059]" />
              Offers
            </button>
            <button
              onClick={() => handleNavClick('loyalty')}
              className="flex items-center gap-2.5 p-3 bg-[#141414] border border-white/5 text-left text-xs uppercase tracking-wider font-medium text-gray-300 hover:bg-[#1a1a1a]"
            >
              <Award className="w-3.5 h-3.5 text-[#c5a059]" />
              Loyalty
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="flex items-center gap-2.5 p-3 bg-[#141414] border border-white/5 text-left text-xs uppercase tracking-wider font-medium text-gray-300 hover:bg-[#1a1a1a]"
            >
              <Info className="w-3.5 h-3.5 text-gray-400" />
              About & BYOB
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (customerUser.isLoggedIn) {
                  setIsProfileOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-[#141414] border border-white/10 text-xs uppercase tracking-wider text-gray-300"
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{customerUser.isLoggedIn ? customerUser.name : 'Sign In / Register'}</span>
              </div>
              <span className="text-[10px] text-[#c5a059] font-bold">2,450 pts</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
