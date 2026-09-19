import React, { useEffect } from 'react';
import { useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { BudgetOptimizer } from './components/BudgetOptimizer';
import { Footer } from './components/Footer';
import { FoodModal } from './components/FoodModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { TableModal } from './components/TableModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OrderTracking } from './components/OrderTracking';
import { StickyBudgetTracker } from './components/StickyBudgetTracker';
import { StaffLoginModal } from './components/StaffLoginModal';
import { CustomerLoginGateway } from './components/CustomerLoginGateway';
// Staff pages
import { StaffLoginPage } from './components/StaffLoginPage';
import { KitchenDashboard } from './components/KitchenDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ReceptionDashboard } from './components/ReceptionDashboard';

export function App() {
  const { activeView, setActiveView, staffUser, customerUser } = useRestaurant();

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'tracking') {
      setActiveView('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (activeView === 'tracking') {
      setActiveView('home');
      setTimeout(() => {
        scrollToTarget(sectionId);
      }, 100);
      return;
    }

    // If currently in a staff view, go home first
    if (activeView === 'login' || activeView === 'kitchen' || activeView === 'admin') {
      setActiveView('home');
      setTimeout(() => scrollToTarget(sectionId), 100);
      return;
    }

    scrollToTarget(sectionId);
  };

  const scrollToTarget = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const mapping: Record<string, string> = {
      menu: 'menu-section',
      budget: 'budget-optimizer-section',
      byob: 'byob-section',
      offers: 'offers-section',
      loyalty: 'loyalty-section',
      about: 'about-section',
      contact: 'contact-section'
    };

    const targetId = mapping[sectionId] || sectionId;
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -70; // Navbar offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // ----------------------------------------------------------------
  // Staff-only views — render without the restaurant shell
  // ----------------------------------------------------------------
  if (activeView === 'login') {
    return <StaffLoginPage />;
  }

  if (activeView === 'kitchen') {
    if (!staffUser.isLoggedIn || (staffUser.role !== 'kitchen' && staffUser.role !== 'admin')) {
      return <StaffLoginPage />;
    }
    return <KitchenDashboard />;
  }

  if (activeView === 'reception' || activeView === 'cashier') {
    if (!staffUser.isLoggedIn || (staffUser.role !== 'reception' && staffUser.role !== 'cashier' && staffUser.role !== 'admin')) {
      return <StaffLoginPage />;
    }
    return <ReceptionDashboard />;
  }

  if (activeView === 'admin') {
    if (!staffUser.isLoggedIn || staffUser.role !== 'admin') {
      return <StaffLoginPage />;
    }
    return <AdminDashboard />;
  }

  // ----------------------------------------------------------------
  // Customer Login Gateway: If not authenticated, require login or registration
  // ----------------------------------------------------------------
  if (!customerUser.isLoggedIn) {
    return <CustomerLoginGateway />;
  }

  // ----------------------------------------------------------------
  // Customer-facing restaurant shell: Enforce strict top-to-bottom customer flow
  // 1. Header / Navbar
  // 2. Hero Section
  // 3. Digital Table Menu
  // 4. Smart Budget & Portion Optimizer
  // 5. Cart, Checkout Modal, and Footer
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb] font-sans antialiased selection:bg-[#c5a059] selection:text-black">
      {/* Top Fixed Header Navbar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main View Flow */}
      <main className="relative pt-16">
        {activeView === 'tracking' ? (
          <OrderTracking />
        ) : (
          <>
            <Hero
              onNavigate={handleNavigate}
              onExploreMenu={() => handleNavigate('menu')}
              onOpenBudget={() => handleNavigate('budget')}
            />
            <MenuSection />
            <BudgetOptimizer />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Interactive Overlays & Modals */}
      <StickyBudgetTracker onNavigate={handleNavigate} />
      <FoodModal />
      <CartDrawer />
      <CheckoutModal />
      <PaymentGatewayModal />
      <OrderConfirmationModal />
      <TableModal />
      <CustomerAuthModal />
      <MobileBottomNav onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
