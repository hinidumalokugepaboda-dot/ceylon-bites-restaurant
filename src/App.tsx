import React, { useEffect } from 'react';
import { useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ByobBanner } from './components/ByobBanner';
import { HowItWorks } from './components/HowItWorks';
import { MenuSection } from './components/MenuSection';
import { BudgetOptimizer } from './components/BudgetOptimizer';
import { SmartRecommendations } from './components/SmartRecommendations';
import { OffersSection } from './components/OffersSection';
import { LoyaltySection } from './components/LoyaltySection';
import { RestaurantAtmosphere } from './components/RestaurantAtmosphere';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FoodModal } from './components/FoodModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { TableModal } from './components/TableModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OrderTracking } from './components/OrderTracking';
import { StickyBudgetTracker } from './components/StickyBudgetTracker';

export function App() {
  const { activeView, setActiveView } = useRestaurant();

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb] font-sans antialiased selection:bg-[#c5a059] selection:text-black">
      {/* Top Fixed Header Navbar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main View Router */}
      <main className="relative pt-16">
        {activeView === 'tracking' ? (
          <OrderTracking />
        ) : (
          <>
            <Hero onNavigate={handleNavigate} />
            <ByobBanner />
            <HowItWorks onNavigate={handleNavigate} />
            <MenuSection />
            <BudgetOptimizer />
            <SmartRecommendations />
            <OffersSection />
            <LoyaltySection />
            <RestaurantAtmosphere />
            <AboutSection />
            <ReviewsSection />
            <ContactSection />
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
      <OrderConfirmationModal />
      <TableModal />
      <CustomerAuthModal />
      <MobileBottomNav onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
