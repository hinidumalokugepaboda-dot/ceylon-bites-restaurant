import React from 'react';
import { Home, Utensils, Calculator, Award, Clock, ShoppingBag } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface MobileBottomNavProps {
  onNavigate: (sectionId: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate }) => {
  const {
    activeView,
    setActiveView,
    totalCartItemsCount,
    finalCartTotal,
    setIsCartOpen,
    activeOrder
  } = useRestaurant();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'budget', label: 'Budget', icon: Calculator },
    { id: 'loyalty', label: 'Rewards', icon: Award },
    { id: 'tracking', label: 'Order', icon: Clock, badge: activeOrder ? '1' : null }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none">
      {/* Floating Cart Pill if Cart has items */}
      {totalCartItemsCount > 0 && activeView !== 'tracking' && (
        <div className="px-4 pb-2 pointer-events-auto">
          <button
            id="mobile-floating-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-2xl shadow-black/80 flex items-center justify-between transition-all duration-200 active:scale-98 animate-bounce-subtle"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-black text-amber-400 flex items-center justify-center font-black text-xs">
                {totalCartItemsCount}
              </div>
              <span>View Table Cart</span>
            </div>
            <div className="font-black text-sm">
              Rs. {finalCartTotal.toLocaleString()}
            </div>
          </button>
        </div>
      )}

      {/* Bottom Bar */}
      <nav className="pointer-events-auto bg-[#0c0c0e]/95 backdrop-blur-lg border-t border-zinc-800/90 px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
