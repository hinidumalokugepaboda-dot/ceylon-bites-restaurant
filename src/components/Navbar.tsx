import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ShoppingBag, 
  User, 
  QrCode, 
  Menu as MenuIcon, 
  X, 
  Sparkles,
  Percent,
  Award,
  Info,
  ShieldCheck,
  ChefHat,
  LogOut,
  Store
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const {
    tableNumber,
    cartTotalCount,
    setIsCartOpen,
    setIsTableModalOpen,
    setIsStaffModalOpen,
    setIsAuthModalOpen,
    setIsProfileOpen,
    customerUser,
    setActiveView,
    staffUser,
    loginAsRole,
    logoutStaff
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartBumping, setIsCartBumping] = useState(false);

  // Trigger bounce animation whenever cart items count increases
  useEffect(() => {
    if (cartTotalCount > 0) {
      setIsCartBumping(true);
      const timer = setTimeout(() => setIsCartBumping(false), 700);
      return () => clearTimeout(timer);
    }
  }, [cartTotalCount]);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 w-full">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 sm:gap-4">
          {/* Logo */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-[#c5a059]/40 p-0.5 shadow-md transition-all group-hover:border-[#c5a059]">
              <div className="w-full h-full bg-[#141414] rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#c5a059] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif tracking-[0.15em] sm:tracking-[0.18em] text-base sm:text-lg md:text-xl text-white font-bold whitespace-nowrap">
                  CEYLON <span className="text-[#c5a059]">BITES</span>
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.2em] px-1.5 py-0.5 border border-[#c5a059]/50 text-[#c5a059] bg-[#161616]">
                  BYOB
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 hidden xl:inline font-medium">
                Modern Sri Lankan Dining
              </p>
            </div>
          </div>

          {/* Desktop Nav Links (xl screen: full 7 links) */}
          <nav className="hidden xl:flex items-center gap-1.5 shrink">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className="px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] font-medium text-gray-400 hover:text-white transition-all whitespace-nowrap"
            >
              Home
            </button>
            <button
              id="nav-menu"
              onClick={() => handleNavClick('menu')}
              className="px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] font-medium text-gray-400 hover:text-white transition-all whitespace-nowrap"
            >
              Menu
            </button>
            <button
              id="nav-budget"
              onClick={() => handleNavClick('budget')}
              className="px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] font-semibold text-[#c5a059] hover:text-[#f0d48f] transition-all flex items-center gap-1 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              <span>Optimizer</span>
            </button>
            <button
              id="nav-offers"
              onClick={() => handleNavClick('offers')}
              className="px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] font-medium text-gray-400 hover:text-white transition-all flex items-center gap-1 whitespace-nowrap"
            >
              <Percent className="w-3 h-3 text-[#c5a059] shrink-0" />
              <span>Offers</span>
            </button>
            <button
              id="nav-loyalty"
              onClick={() => handleNavClick('loyalty')}
              className="px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] font-medium text-gray-400 hover:text-white transition-all flex items-center gap-1 whitespace-nowrap"
            >
              <Award className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              <span>Loyalty</span>
            </button>
            <button
              id="nav-about"
              onClick={() => handleNavClick('about')}
              className="px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] font-medium text-gray-400 hover:text-white transition-all whitespace-nowrap"
            >
              BYOB
            </button>
            <button
              id="nav-contact"
              onClick={() => handleNavClick('contact')}
              className="px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] font-medium text-gray-400 hover:text-white transition-all whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Medium Desktop Nav Links (lg to xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1 shrink">
            <button
              onClick={() => handleNavClick('menu')}
              className="px-2 py-1 text-xs uppercase tracking-wider font-medium text-gray-400 hover:text-white whitespace-nowrap"
            >
              Menu
            </button>
            <button
              onClick={() => handleNavClick('budget')}
              className="px-2 py-1 text-xs uppercase tracking-wider font-semibold text-[#c5a059] hover:text-[#f0d48f] whitespace-nowrap flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Optimizer</span>
            </button>
            <button
              onClick={() => handleNavClick('offers')}
              className="px-2 py-1 text-xs uppercase tracking-wider font-medium text-gray-400 hover:text-white whitespace-nowrap"
            >
              Offers
            </button>
          </nav>

          {/* Right Action Icons (Always visible & never clipped) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Table Badge */}
            <button
              id="btn-table-badge"
              onClick={() => setIsTableModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#c5a059]/50 text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-gray-300 transition-all cursor-pointer rounded-lg"
              title="Click to change table or view QR status"
            >
              <QrCode className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="hidden sm:inline">Table</span>
              <span className="text-[#c5a059] font-bold">
                #{tableNumber}
              </span>
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
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 hover:border-[#c5a059]/40 rounded-lg transition-all text-xs font-medium cursor-pointer"
              aria-label="Account profile"
            >
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden md:inline truncate max-w-[80px] uppercase tracking-wider text-[10px] font-semibold">
                {customerUser.isLoggedIn ? customerUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Staff Portal Popup Trigger */}
            <button
              id="btn-staff-modal-trigger"
              onClick={() => setIsStaffModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border transition-all text-[10px] sm:text-[11px] uppercase tracking-wider font-bold rounded-lg cursor-pointer shrink-0 ${
                staffUser.isLoggedIn
                  ? 'bg-[#c5a059]/15 border-[#c5a059]/60 text-[#c5a059] hover:bg-[#c5a059]/25 shadow-sm'
                  : 'bg-[#141414] hover:bg-[#1c1c1c] border-white/10 hover:border-[#c5a059]/50 text-gray-300 hover:text-white'
              }`}
              title="Staff Portal & Role Login"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Staff</span>
              {staffUser.isLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Cart Button with Animated Item Counter Badge */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-1.5 sm:gap-2 bg-[#c5a059] hover:bg-[#d6b26b] text-black px-3.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-extrabold rounded-lg shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer shrink-0 ring-1 ring-[#c5a059]/40 ${
                isCartBumping ? 'scale-105 ring-4 ring-[#c5a059]/80 shadow-[#c5a059]/50' : ''
              }`}
              aria-label="View Cart"
            >
              <ShoppingBag className={`w-4 h-4 text-black shrink-0 ${isCartBumping ? 'animate-bounce' : ''}`} />
              <span className="font-extrabold hidden xs:inline">Cart</span>
              <span
                key={cartTotalCount}
                className={`font-black text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px] transition-transform duration-300 ${
                  cartTotalCount > 0
                    ? 'bg-black text-[#c5a059] border border-[#c5a059]/60 shadow-inner scale-100 animate-in zoom-in-50'
                    : 'bg-black/20 text-black/70'
                }`}
              >
                {cartTotalCount}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 lg:hidden cursor-pointer shrink-0 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

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

          {/* Staff Section in Mobile Drawer */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#c5a059] px-1">
              Staff Portals
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="mobile-staff-admin"
                onClick={() => {
                  loginAsRole('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-[#141414] border border-white/10 hover:border-[#c5a059]/40 text-center rounded-xl cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                <span className="text-[10px] uppercase font-bold text-white">Admin</span>
              </button>

              <button
                id="mobile-staff-kitchen"
                onClick={() => {
                  loginAsRole('kitchen');
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-[#141414] border border-white/10 hover:border-sky-500/40 text-center rounded-xl cursor-pointer"
              >
                <ChefHat className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] uppercase font-bold text-white">Kitchen</span>
              </button>

              <button
                id="mobile-staff-cashier"
                onClick={() => {
                  loginAsRole('reception');
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-[#141414] border border-white/10 hover:border-emerald-500/40 text-center rounded-xl cursor-pointer"
              >
                <Store className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] uppercase font-bold text-white">Cashier</span>
              </button>
            </div>

            {staffUser.isLoggedIn ? (
              <button
                onClick={() => {
                  logoutStaff();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-red-950/30 border border-red-800/40 rounded-xl text-xs font-bold text-red-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Staff ({staffUser.name.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsStaffModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#c5a059]/40 rounded-xl text-xs font-bold text-[#c5a059]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff Portal & Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
