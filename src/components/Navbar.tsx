import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  ChefHat,
  LogOut,
  Bell,
  ChevronDown,
  Store
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import CustomerNotificationPanel from './CustomerNotificationPanel';

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
    setSearchQuery,
    setActiveView,
    staffUser,
    loginAsRole,
    logoutStaff,
    unreadNotificationCount
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearchOpen, setNavSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);
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

  const handleStaffPortalClick = () => {
    if (staffUser.isLoggedIn) {
      const nextView = staffUser.role === 'admin' ? 'admin' : staffUser.role === 'reception' ? 'reception' : 'kitchen';
      setActiveView(nextView);
    } else {
      setActiveView('login');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Table Badge */}
            <button
              id="btn-table-badge"
              onClick={() => setIsTableModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#c5a059]/50 text-[10px] uppercase tracking-widest font-semibold text-gray-300 transition-all cursor-pointer"
              title="Click to change table or view QR status"
            >
              <QrCode className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="hidden sm:inline">Table</span>
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
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all hidden sm:flex border border-white/5 cursor-pointer"
              aria-label="Search food"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="btn-nav-notifications"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/5 cursor-pointer flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#c5a059] text-[#0a0a0a] text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              <CustomerNotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
              />
            </div>

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
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-gray-300 hover:text-white hover:bg-white/5 border border-white/5 transition-all text-xs font-medium cursor-pointer"
              aria-label="Account profile"
            >
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden md:inline truncate max-w-[80px] uppercase tracking-wider text-[10px]">
                {customerUser.isLoggedIn ? customerUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Staff Dropdown Menu */}
            <div className="relative">
              <button
                id="btn-staff-menu"
                onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 border transition-all text-[10px] uppercase tracking-wider font-bold cursor-pointer ${
                  staffUser.isLoggedIn
                    ? 'bg-[#c5a059]/15 border-[#c5a059]/50 text-[#c5a059] hover:bg-[#c5a059]/25'
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-[#c5a059]/40 bg-[#121212]'
                }`}
                title="Staff Management & Dashboards"
              >
                {staffUser.isLoggedIn ? (
                  staffUser.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" /> :
                  staffUser.role === 'reception' ? <Store className="w-3.5 h-3.5 text-[#c5a059]" /> :
                  <ChefHat className="w-3.5 h-3.5 text-[#c5a059]" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span>
                  {staffUser.isLoggedIn
                    ? (staffUser.role === 'admin' ? 'Admin' : staffUser.role === 'reception' ? 'Cashier' : 'Kitchen')
                    : 'Staff'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${staffDropdownOpen ? 'rotate-180 text-[#c5a059]' : 'text-gray-500'}`} />
              </button>

              {staffDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#121215] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                      Staff Portals
                    </div>
                    {staffUser.isLoggedIn && (
                      <span className="text-[9px] bg-[#c5a059]/20 text-[#c5a059] px-1.5 py-0.5 rounded font-bold uppercase">
                        {staffUser.role}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <button
                      id="btn-staff-go-admin"
                      onClick={() => {
                        loginAsRole('admin');
                        setStaffDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1a1712] border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#c5a059]">Admin Dashboard</div>
                        <div className="text-[10px] text-gray-400">Sales, analytics & staff</div>
                      </div>
                    </button>

                    <button
                      id="btn-staff-go-kitchen"
                      onClick={() => {
                        loginAsRole('kitchen');
                        setStaffDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#141820] border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                        <ChefHat className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-400">Kitchen Display (KDS)</div>
                        <div className="text-[10px] text-gray-400">Live orders & food preparation</div>
                      </div>
                    </button>

                    <button
                      id="btn-staff-go-cashier"
                      onClick={() => {
                        loginAsRole('reception');
                        setStaffDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#141e17] border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400">Cashier & Reception</div>
                        <div className="text-[10px] text-gray-400">Confirm orders & table bills</div>
                      </div>
                    </button>
                  </div>

                  <div className="border-t border-white/10 mt-1.5 pt-1.5 space-y-1">
                    <button
                      id="btn-staff-go-login"
                      onClick={() => {
                        setActiveView('login');
                        setStaffDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                      <span>Staff Login Screen</span>
                    </button>

                    {staffUser.isLoggedIn && (
                      <button
                        id="btn-staff-logout"
                        onClick={() => {
                          logoutStaff();
                          setStaffDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout ({staffUser.name.split(' ')[0]})</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button with Animated Item Counter Badge */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-1.5 sm:gap-2 bg-[#c5a059] hover:bg-[#d6b26b] text-black px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-extrabold shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer shrink-0 ring-1 ring-[#c5a059]/40 ${
                isCartBumping ? 'scale-110 ring-4 ring-[#c5a059]/80 shadow-[#c5a059]/50' : ''
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
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 lg:hidden cursor-pointer shrink-0"
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
                  setActiveView('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2 bg-[#141414] border border-white/10 rounded-xl text-xs font-semibold text-gray-500 hover:text-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff Login Screen</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
