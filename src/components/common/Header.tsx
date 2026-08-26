import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { PRODUCT_CATEGORIES } from '../../data/mockData';
import {
  MapPin,
  Search,
  ShoppingCart,
  Heart,
  User,
  Store,
  Truck,
  HelpCircle,
  Menu,
  ChevronDown,
  X,
  LogOut,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Package,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentLocation,
    setIsLocationModalOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cartCount,
    wishlist,
    authSession,
    customerLogin,
    customerLogout,
    sellerLogin,
    sellerLogout,
    adminLogin,
    adminLogout,
    setSelectedProductId,
    setSelectedShopId,
    navigate,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchCategoryOpen, setIsSearchCategoryOpen] = useState(false);
  const [activeSearchCategoryName, setActiveSearchCategoryName] = useState('All Categories');

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setSelectedProductId(null);
    setSelectedShopId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    setActiveSearchCategoryName(categoryName);
    setIsCategoryMenuOpen(false);
    setIsSearchCategoryOpen(false);
    if (currentView !== 'home' && currentView !== 'products') {
      setCurrentView('products');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'products') {
      setCurrentView('products');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
      {/* ================= 1. TOP BLACK NOTIFICATION BAR ================= */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Location Delivery Target PIN */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-300">Delivering to:</span>
            <span className="font-bold text-white">
              {currentLocation.area || 'Connaught Place'}, {currentLocation.city || 'New Delhi'} ({currentLocation.pincode || '110001'})
            </span>
            {currentLocation.isGpsDetected && (
              <span className="px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-black rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                GPS Active
              </span>
            )}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold ml-1 underline cursor-pointer transition-colors text-xs flex items-center gap-1"
            >
              <span>Change / 📍 GPS</span>
            </button>
          </div>

          {/* Right: Portal / Action Links */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
            {/* Become a Seller */}
            <button
              onClick={() => {
                if (authSession.role === 'seller' && authSession.isAuthenticated) {
                  navigate('/seller/dashboard');
                } else {
                  navigate('/seller/register');
                }
              }}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Become a Seller</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Track Order */}
            <button
              onClick={() => handleNavClick('order-tracking')}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Order</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Help & Support */}
            <button
              onClick={() => handleNavClick('support')}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Help & Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN WHITE ECOMMERCE HEADER ================= */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Logo (Left) */}
        <div className="shrink-0">
          <Logo
            onClick={() => {
              navigate('/');
            }}
          />
        </div>

        {/* Large Universal Search Bar (Center) */}
        <div className="flex-1 max-w-2xl relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200/50 rounded-2xl overflow-hidden transition-all shadow-xs"
          >
            {/* Search Input */}
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search turmeric, basmati rice, local dairy..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent outline-hidden text-slate-900 placeholder:text-slate-400 font-medium"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Category Dropdown inside Search Bar */}
            <div className="relative border-l border-slate-200 hidden sm:block">
              <button
                type="button"
                onClick={() => setIsSearchCategoryOpen(!isSearchCategoryOpen)}
                className="px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1.5 cursor-pointer whitespace-nowrap bg-slate-100/70 hover:bg-slate-100"
              >
                <span>{activeSearchCategoryName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isSearchCategoryOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSearchCategoryOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('all', 'All Categories')}
                      className="w-full text-left px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 cursor-pointer"
                    >
                      All Categories
                    </button>
                    {PRODUCT_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id, cat.name)}
                        className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 cursor-pointer"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Yellow Search Button */}
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 px-4 sm:px-5 py-3 font-black transition-colors flex items-center justify-center cursor-pointer shrink-0"
              title="Search"
            >
              <Search className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        </div>

        {/* Action Icons (Right): Location, Wishlist, Cart, My Account */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          {/* 1. Location Action Icon */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex flex-col items-center justify-center text-slate-700 hover:text-amber-600 transition-colors cursor-pointer group"
            title="Choose Location / PIN"
          >
            <div className="relative p-1">
              <MapPin className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 hidden sm:inline">
              Location
            </span>
          </button>

          {/* 2. Wishlist Action Icon */}
          <button
            id="wishlist-header-btn"
            onClick={() => {
              navigate('/customer/dashboard');
            }}
            className="flex flex-col items-center justify-center text-slate-700 hover:text-rose-600 transition-colors cursor-pointer group"
            title="My Wishlist"
          >
            <div className="relative p-1">
              <Heart className="w-5 h-5 text-slate-800 group-hover:text-rose-600 group-hover:scale-110 transition-transform" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-rose-600 hidden sm:inline">
              Wishlist
            </span>
          </button>

          {/* 3. Cart Action Icon */}
          <button
            id="cart-header-btn"
            onClick={() => handleNavClick('cart')}
            className="flex flex-col items-center justify-center text-slate-700 hover:text-amber-600 transition-colors cursor-pointer group"
            title="Shopping Cart"
          >
            <div className="relative p-1">
              <ShoppingCart className="w-5 h-5 text-slate-800 group-hover:text-amber-600 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 hidden sm:inline">
              Cart
            </span>
          </button>

          {/* 4. My Account Action Icon */}
          <div className="relative">
            <button
              id="user-account-dropdown-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex flex-col items-center justify-center text-slate-700 hover:text-amber-600 transition-colors cursor-pointer group"
              title="My Account"
            >
              <div className="relative p-1">
                <User className="w-5 h-5 text-slate-800 group-hover:text-amber-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 hidden sm:inline">
                My Account
              </span>
            </button>

            {/* Account Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
                  {/* Active Profile Info */}
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Account Status
                    </p>
                    {authSession.isAuthenticated ? (
                      <div className="mt-1">
                        <p className="text-sm font-black text-slate-900 truncate">
                          {authSession.customer?.name || authSession.seller?.shopName || authSession.admin?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {authSession.customer?.phone ? `+91 ${authSession.customer.phone}` : authSession.seller?.email || authSession.admin?.email}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <p className="text-sm font-bold text-slate-900">Welcome to Harwalkart</p>
                        <p className="text-xs text-slate-500">Sign in to track orders & manage wishlist</p>
                      </div>
                    )}
                  </div>

                  {/* Customer Panel Access */}
                  <div className="py-2 px-3">
                    <div className="text-[10px] font-black uppercase text-amber-800 tracking-wider px-2 mb-1">
                      Customer Panel
                    </div>
                    {authSession.role === 'customer' && authSession.isAuthenticated ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('/customer/dashboard');
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 rounded-xl flex items-center gap-2 cursor-pointer"
                        >
                          <User className="w-4 h-4 text-amber-600" />
                          <span>Customer Dashboard (Orders & Profile)</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            customerLogout();
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 p-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('/customer/login');
                          }}
                          className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl text-center cursor-pointer shadow-xs"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('/customer/register');
                          }}
                          className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl text-center cursor-pointer"
                        >
                          Register
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Seller & Admin Shortcuts */}
                  <div className="border-t border-slate-100 pt-2 px-3">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 mb-1">
                      Business & Management
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (authSession.role !== 'seller' || !authSession.isAuthenticated) {
                          sellerLogin('sharma.kirana@harwalkart.com', 'password123');
                        }
                        navigate('/seller/dashboard');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-amber-600" />
                      <span>Seller Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (authSession.role !== 'admin' || !authSession.isAuthenticated) {
                          adminLogin('admin@harwalkart.com', 'AdminHarwal@2025');
                        }
                        navigate('/admin/dashboard');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-600" />
                      <span>Admin Panel</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= 3. NAVIGATION RIBBON (EXACT REFERENCE BAR) ================= */}
      <div className="bg-white border-t border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6 py-1.5 overflow-x-auto scrollbar-none">
            {/* Left: Yellow "All Categories" Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <Menu className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>All Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Drawer Dropdown */}
              {isCategoryMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsCategoryMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 text-xs font-black uppercase text-amber-800 tracking-wider border-b border-slate-100">
                      Product Categories
                    </div>
                    <button
                      onClick={() => handleCategorySelect('all', 'All Categories')}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between cursor-pointer"
                    >
                      <span>All Products</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">View All</span>
                    </button>
                    {PRODUCT_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id, cat.name)}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between cursor-pointer"
                      >
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Navigation Menu Items */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Home */}
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-2 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                  currentView === 'home'
                    ? 'text-amber-500 font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-amber-500'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Home
              </button>

              {/* Explore Shops */}
              <button
                onClick={() => handleNavClick('shops')}
                className={`px-3 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentView === 'shops'
                    ? 'text-amber-500 font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-amber-500'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Explore Shops
              </button>

              {/* Kitchen Shakti Range with PAN-INDIA badge */}
              <button
                onClick={() => handleNavClick('kitchen-shakti')}
                className={`px-3 py-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentView === 'kitchen-shakti'
                    ? 'text-amber-600 font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-amber-500'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <span>Kitchen Shakti Range</span>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs">
                  PAN-INDIA
                </span>
              </button>

              {/* Offers with HOT badge */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  handleNavClick('products');
                }}
                className="px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Offers</span>
                <span className="bg-red-500 text-white text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-2xs">
                  HOT
                </span>
              </button>

              {/* New Arrivals */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  handleNavClick('products');
                }}
                className="px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap"
              >
                New Arrivals
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
