import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/home/HomeView';
import { KitchenShaktiSection } from './components/home/KitchenShaktiSection';
import { ProductListingView } from './components/product/ProductListingView';
import { ProductDetailView } from './components/product/ProductDetailView';
import { ShopListingView } from './components/shop/ShopListingView';
import { ShopDetailView } from './components/shop/ShopDetailView';
import { CartView } from './components/cart/CartView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderTrackingView } from './components/orders/OrderTrackingView';
import { CustomerAccountView } from './components/account/CustomerAccountView';
import { CustomerSupportView } from './components/support/CustomerSupportView';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CmsPageView } from './components/cms/CmsPageView';
import { VideoShoppingSection } from './components/video/VideoShoppingSection';
import { LocationModal } from './components/modals/LocationModal';
import { ShareModal } from './components/modals/ShareModal';
import { AuthModal } from './components/modals/AuthModal';
import { PanelSwitcher } from './components/common/PanelSwitcher';

// Dedicated Auth Components
import { CustomerLogin } from './components/auth/CustomerLogin';
import { CustomerRegister } from './components/auth/CustomerRegister';
import { CustomerForgotPassword } from './components/auth/CustomerForgotPassword';
import { SellerLogin } from './components/auth/SellerLogin';
import { SellerRegister } from './components/auth/SellerRegister';
import { SellerForgotPassword } from './components/auth/SellerForgotPassword';
import { AdminLogin } from './components/auth/AdminLogin';
import { AdminForgotPassword } from './components/auth/AdminForgotPassword';
import { AccessRestrictedNotice } from './components/auth/AccessRestrictedNotice';

const AppContent: React.FC = () => {
  const { currentView, toastMessage, authSession } = useApp();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/50 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Global Header */}
      <Header />

      {/* Main Dynamic View Content */}
      <main className="flex-1 pb-12">
        {/* Marketplace Consumer Views */}
        {currentView === 'home' && <HomeView />}
        {currentView === 'kitchen-shakti' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <KitchenShaktiSection />
          </div>
        )}
        {currentView === 'products' && <ProductListingView />}
        {currentView === 'product-detail' && <ProductDetailView />}
        {currentView === 'shops' && <ShopListingView />}
        {currentView === 'shop-detail' && <ShopDetailView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-tracking' && <OrderTrackingView />}
        {currentView === 'support' && <CustomerSupportView />}
        {(currentView === 'video-ads' || currentView === 'video-shopping') && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <VideoShoppingSection />
          </div>
        )}

        {/* CMS Legal & Policy Pages */}
        {(['about', 'privacy', 'terms', 'delivery', 'returns', 'cms-page'].includes(currentView)) && (
          <CmsPageView />
        )}

        {/* 1. CUSTOMER PANEL VIEWS */}
        {currentView === 'customer-login' && <CustomerLogin />}
        {currentView === 'customer-register' && <CustomerRegister />}
        {currentView === 'customer-forgot-password' && <CustomerForgotPassword />}
        {(currentView === 'customer-dashboard' || currentView === 'account') && (
          authSession.role === 'customer' && authSession.isAuthenticated ? (
            <CustomerAccountView />
          ) : (
            <AccessRestrictedNotice requiredRole="customer" />
          )
        )}

        {/* 2. SELLER PANEL VIEWS */}
        {currentView === 'seller-login' && <SellerLogin />}
        {currentView === 'seller-register' && <SellerRegister />}
        {currentView === 'seller-forgot-password' && <SellerForgotPassword />}
        {(currentView === 'seller-dashboard' || currentView === 'seller-panel') && (
          authSession.role === 'seller' && authSession.isAuthenticated ? (
            <SellerDashboard />
          ) : (
            <AccessRestrictedNotice requiredRole="seller" />
          )
        )}

        {/* 3. ADMIN PANEL VIEWS */}
        {currentView === 'admin-login' && <AdminLogin />}
        {currentView === 'admin-forgot-password' && <AdminForgotPassword />}
        {(currentView === 'admin-dashboard' || currentView === 'admin-panel') && (
          authSession.role === 'admin' && authSession.isAuthenticated ? (
            <AdminDashboard />
          ) : (
            <AccessRestrictedNotice requiredRole="admin" />
          )
        )}
      </main>

      {/* Main Global Footer */}
      <Footer />

      {/* Global Interactive Modals & Floating Switcher */}
      <PanelSwitcher />
      <LocationModal />
      <ShareModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
