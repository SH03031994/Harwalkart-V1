import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';

export const CustomerBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    navigate,
    cartCount,
    authSession,
    setSelectedCategory,
  } = useApp();

  const isHomeActive = currentView === 'home';
  const isCategoriesActive = currentView === 'products' && !currentView.includes('detail');
  const isCartActive = currentView === 'cart' || currentView === 'checkout';
  const isProfileActive =
    currentView === 'account' ||
    currentView === 'customer-dashboard' ||
    currentView === 'customer-login' ||
    currentView === 'customer-register';

  const handleSearchClick = () => {
    // Focus search input or navigate to products with search active
    const searchInput = document.getElementById('main-search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setCurrentView('products');
    }
  };

  const handleCategoriesClick = () => {
    setSelectedCategory('all');
    navigate('/products');
  };

  const handleProfileClick = () => {
    if (authSession.role === 'customer' && authSession.isAuthenticated) {
      navigate('/customer/dashboard');
    } else {
      navigate('/customer/login');
    }
  };

  return (
    <nav
      id="customer-mobile-bottom-nav"
      aria-label="Mobile Customer Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-around transition-colors"
    >
      {/* 1. Home */}
      <button
        id="mobile-nav-home-btn"
        onClick={() => navigate('/')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isHomeActive ? 'text-amber-500 font-black scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
        }`}
      >
        <div className="relative">
          <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {isHomeActive && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
      </button>

      {/* 2. Categories */}
      <button
        id="mobile-nav-categories-btn"
        onClick={handleCategoriesClick}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isCategoriesActive ? 'text-amber-500 font-black scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
        }`}
      >
        <div className="relative">
          <LayoutGrid className={`w-5 h-5 ${isCategoriesActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {isCategoriesActive && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Categories</span>
      </button>

      {/* 3. Search */}
      <button
        id="mobile-nav-search-btn"
        onClick={handleSearchClick}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-all cursor-pointer"
      >
        <div className="w-9 h-9 -mt-3 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
          <Search className="w-4 h-4 stroke-[2.5]" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-bold text-slate-900 dark:text-white">Search</span>
      </button>

      {/* 4. Cart */}
      <button
        id="mobile-nav-cart-btn"
        onClick={() => navigate('/cart')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
          isCartActive ? 'text-amber-500 font-black scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
        }`}
      >
        <div className="relative">
          <ShoppingBag className={`w-5 h-5 ${isCartActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white dark:border-slate-900">
              {cartCount}
            </span>
          )}
          {isCartActive && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
      </button>

      {/* 5. Profile */}
      <button
        id="mobile-nav-profile-btn"
        onClick={handleProfileClick}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isProfileActive ? 'text-amber-500 font-black scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
        }`}
      >
        <div className="relative">
          <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {isProfileActive && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
      </button>
    </nav>
  );
};
