import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import { ShopCard } from '../shop/ShopCard';
import { KitchenShaktiSection } from './KitchenShaktiSection';
import { VideoShoppingSection } from '../video/VideoShoppingSection';
import { checkSellerServiceability } from '../../utils/location';
import {
  Search,
  MapPin,
  Truck,
  ShieldCheck,
  Award,
  Store,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Headphones,
  Flame,
  ShoppingBag,
  Wheat,
  Milk,
  Coffee,
  Cookie,
  HeartHandshake,
  Grid,
  Heart,
  ShoppingCart,
  Percent,
  Star,
  User,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    sellers,
    currentLocation,
    setIsLocationModalOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setCurrentView,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    customerLogin,
    sellerLogin,
    adminLogin,
    navigate,
  } = useApp();

  const [heroSearch, setHeroSearch] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    setSearchQuery(heroSearch);
    setCurrentView('products');
  };

  // Top picks priority sorting (ensure reference items appear first, followed by others)
  const topPicksProducts = [
    // Ensure turmeric, rice, ghee, salt, tea are at the front if present
    ...products.filter(p => p.id === 'hk_ks_haldi'),
    ...products.filter(p => p.id === 'prod_india_gate_classic'),
    ...products.filter(p => p.id === 'prod_amul_cow_ghee'),
    ...products.filter(p => p.id === 'prod_tata_salt_iodised'),
    ...products.filter(p => p.id === 'prod_tata_tea_premium_pkg'),
    ...products.filter(
      p =>
        ![
          'hk_ks_haldi',
          'prod_india_gate_classic',
          'prod_amul_cow_ghee',
          'prod_tata_salt_iodised',
          'prod_tata_tea_premium_pkg',
        ].includes(p.id) &&
        p.approved &&
        p.inStock
    ),
  ].slice(0, 10);

  const localSellers = sellers.filter(s => {
    if (s.isHarwalkartDirect) return false;
    if (s.status !== 'approved') return false;
    const isLocalNonGst = s.sellerType === 'local_without_gst' || !s.isGstRegistered;
    if (isLocalNonGst) {
      const check = checkSellerServiceability(s, currentLocation);
      if (!check.isServiceable) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-4 animate-in fade-in">
      {/* ================= 1. HERO BANNER SECTION (EXACT REFERENCE DESIGN) ================= */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#FFF7ED] via-[#FDF5E6] to-[#FFF9F0] border border-amber-100 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10">
        {/* Navigation Arrows Left & Right */}
        <button
          onClick={() => setCurrentHeroSlide((prev) => (prev === 0 ? 2 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-all hover:scale-105 z-20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-slate-800" />
        </button>

        <button
          onClick={() => setCurrentHeroSlide((prev) => (prev === 2 ? 0 : prev + 1))}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-all hover:scale-105 z-20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-slate-800" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Heading, Subtitle, Search, Trust Badges */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            {/* Main Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-slate-950">
                Har Din <br />
                <span className="text-amber-500 inline-flex items-center gap-1 mt-1">
                  Kuch Khas
                  {/* Decorative Golden Rays / Sparkles SVG */}
                  <svg className="w-7 h-7 text-amber-500 ml-1 inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                    <circle cx="19" cy="5" r="1.5" fill="#FAB800" />
                    <circle cx="5" cy="18" r="1.5" fill="#FAB800" />
                  </svg>
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-3 max-w-lg leading-relaxed">
                Pure, authentic and daily essential products from your trusted local shops.
              </p>
            </div>

            {/* Hero Search Box */}
            <form onSubmit={handleHeroSearch} className="space-y-2.5 max-w-lg">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search turmeric, basmati rice, local dairy..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl text-xs sm:text-sm font-medium border border-slate-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto py-3 px-8 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <span>Search Store</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </form>

            {/* Trust Badges 4-Items Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="leading-tight">100% Authentic Products</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="leading-tight">Fast & Safe Delivery</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="leading-tight">Secure Payments</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <Headphones className="w-3.5 h-3.5" />
                </div>
                <span className="leading-tight">Support 24/7</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Composition (Kitchen Shakti Spices Showcase) */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-100/40 to-transparent rounded-3xl p-4 flex flex-col items-center">
              {/* Spices Showcase Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end justify-center w-full">
                {/* 1. Red Chili Powder Pouch */}
                <div
                  onClick={() => {
                    setSelectedProductId('hk_ks_lal_mirch');
                    setCurrentView('product-detail');
                  }}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:-translate-y-1.5"
                >
                  <div className="w-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-2xl p-2.5 sm:p-3 text-slate-950 shadow-lg border border-amber-300 relative overflow-hidden text-center flex flex-col justify-between min-h-[160px] sm:min-h-[190px]">
                    <div className="flex justify-between items-start">
                      <span className="text-[7px] sm:text-[8px] bg-slate-950 text-white font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                        KITCHEN SHAKTI
                      </span>
                      <div className="w-3 h-3 border border-emerald-600 flex items-center justify-center rounded-xs bg-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    <div className="my-1.5">
                      <div className="text-[10px] sm:text-xs font-black text-slate-950 leading-tight">
                        Red Chili Powder
                      </div>
                      <div className="text-[8px] sm:text-[9px] font-bold text-slate-900">
                        (लाल मिर्च पाउडर)
                      </div>
                      <div className="text-[7px] text-slate-800 font-semibold mt-0.5">
                        100% Natural
                      </div>
                    </div>

                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-red-600/90 flex items-center justify-center shadow-inner my-1 border-2 border-amber-200">
                      <span className="text-xl sm:text-2xl">🌶️</span>
                    </div>

                    <div className="flex justify-between items-center text-[8px] font-black text-slate-900 pt-1 border-t border-amber-400/50">
                      <span>Pure Grade</span>
                      <span>200g</span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-2 text-center">
                    Red Chili Powder
                  </span>
                </div>

                {/* 2. Turmeric Powder Pouch (Center Hero) */}
                <div
                  onClick={() => {
                    setSelectedProductId('hk_ks_haldi');
                    setCurrentView('product-detail');
                  }}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:-translate-y-2 z-10"
                >
                  <div className="w-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-2xl p-3 sm:p-4 text-slate-950 shadow-2xl border-2 border-amber-300 relative overflow-hidden text-center flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] sm:text-[9px] bg-slate-950 text-white font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        KITCHEN SHAKTI
                      </span>
                      <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center rounded-xs bg-white">
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    <div className="my-2">
                      <div className="text-xs sm:text-sm font-black text-slate-950 leading-tight">
                        Turmeric Powder
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-slate-900">
                        (हल्दी पाउडर)
                      </div>
                      <div className="text-[8px] text-slate-800 font-semibold mt-0.5">
                        100% Natural
                      </div>
                    </div>

                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-amber-300 flex items-center justify-center shadow-inner my-1 border-2 border-amber-100">
                      <span className="text-2xl sm:text-3xl">✨</span>
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-black text-slate-900 pt-1 border-t border-amber-400/60">
                      <span>High Curcumin</span>
                      <span>200g</span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-amber-900 mt-2 text-center">
                    Turmeric Powder
                  </span>
                </div>

                {/* 3. Coriander Powder Pouch */}
                <div
                  onClick={() => {
                    setSelectedProductId('hk_ks_dhaniya');
                    setCurrentView('product-detail');
                  }}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:-translate-y-1.5"
                >
                  <div className="w-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-2xl p-2.5 sm:p-3 text-slate-950 shadow-lg border border-amber-300 relative overflow-hidden text-center flex flex-col justify-between min-h-[160px] sm:min-h-[190px]">
                    <div className="flex justify-between items-start">
                      <span className="text-[7px] sm:text-[8px] bg-slate-950 text-white font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                        KITCHEN SHAKTI
                      </span>
                      <div className="w-3 h-3 border border-emerald-600 flex items-center justify-center rounded-xs bg-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    <div className="my-1.5">
                      <div className="text-[10px] sm:text-xs font-black text-slate-950 leading-tight">
                        Coriander Powder
                      </div>
                      <div className="text-[8px] sm:text-[9px] font-bold text-slate-900">
                        (धनिया पाउडर)
                      </div>
                      <div className="text-[7px] text-slate-800 font-semibold mt-0.5">
                        100% Natural
                      </div>
                    </div>

                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-yellow-700/80 flex items-center justify-center shadow-inner my-1 border-2 border-amber-200">
                      <span className="text-xl sm:text-2xl">🌿</span>
                    </div>

                    <div className="flex justify-between items-center text-[8px] font-black text-slate-900 pt-1 border-t border-amber-400/50">
                      <span>Slow Ground</span>
                      <span>200g</span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-2 text-center">
                    Coriander Powder
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slider Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6 relative z-10">
          <button
            onClick={() => setCurrentHeroSlide(0)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentHeroSlide === 0 ? 'bg-amber-500 w-5' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label="Slide 1"
          />
          <button
            onClick={() => setCurrentHeroSlide(1)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentHeroSlide === 1 ? 'bg-amber-500 w-5' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label="Slide 2"
          />
          <button
            onClick={() => setCurrentHeroSlide(2)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentHeroSlide === 2 ? 'bg-amber-500 w-5' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label="Slide 3"
          />
          <button
            onClick={() => setCurrentHeroSlide(3)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentHeroSlide === 3 ? 'bg-amber-500 w-5' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label="Slide 4"
          />
        </div>
      </section>

      {/* ================= 2. CIRCULAR CATEGORY QUICK-ACCESS ROW (EXACT REFERENCE ICONS) ================= */}
      <section className="bg-white py-3 px-2 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 sm:gap-4 items-center justify-items-center">
          {/* 1. All Shops */}
          <button
            onClick={() => setCurrentView('shops')}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <Store className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              All Shops
            </span>
          </button>

          {/* 2. Kitchen Shakti Range */}
          <button
            onClick={() => setCurrentView('kitchen-shakti')}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/10 border-2 border-amber-300 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 fill-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              Kitchen Shakti Range
            </span>
          </button>

          {/* 3. Atta, Rice & Pulses */}
          <button
            onClick={() => {
              setSelectedCategory('Grocery');
              setCurrentView('products');
            }}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <Wheat className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              Atta, Rice & Pulses
            </span>
          </button>

          {/* 4. Dairy & Breakfast */}
          <button
            onClick={() => {
              setSelectedCategory('Dairy');
              setCurrentView('products');
            }}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <Milk className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              Dairy & Breakfast
            </span>
          </button>

          {/* 5. Masala & Spices */}
          <button
            onClick={() => {
              setSelectedCategory('Masala & Food');
              setCurrentView('products');
            }}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              Masala & Spices
            </span>
          </button>

          {/* 6. Tea, Coffee & Drinks */}
          <button
            onClick={() => {
              setSelectedCategory('Beverages');
              setCurrentView('products');
            }}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              Tea, Coffee & Drinks
            </span>
          </button>

          {/* 7. Snacks & Munchies */}
          <button
            onClick={() => {
              setSelectedCategory('Snacks');
              setCurrentView('products');
            }}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <Cookie className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              Snacks & Munchies
            </span>
          </button>

          {/* 8. Personal Care & Home Care */}
          <button
            onClick={() => {
              setSelectedCategory('Home & Living');
              setCurrentView('products');
            }}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              Personal Care & Home Care
            </span>
          </button>

          {/* 9. View All */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('products');
            }}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 group-hover:border-amber-500 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              <Grid className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 mt-2 line-clamp-1">
              View All
            </span>
          </button>
        </div>
      </section>

      {/* ================= 3. VALUE PROPOSITION STRIP (5 COLUMNS CREAM CARD) ================= */}
      <section className="bg-[#FFF9F0] border border-amber-100 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {/* 1. Local Shop Products */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Local Shop Products</h4>
              <p className="text-[10px] text-slate-600 mt-0.5">From your trusted neighbourhood shops</p>
            </div>
          </div>

          {/* 2. Kitchen Shakti Quality */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Kitchen Shakti Quality</h4>
              <p className="text-[10px] text-slate-600 mt-0.5">Pure & authentic spices</p>
            </div>
          </div>

          {/* 3. Best Prices Always */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Best Prices Always</h4>
              <p className="text-[10px] text-slate-600 mt-0.5">Great quality at best price</p>
            </div>
          </div>

          {/* 4. Fast Delivery Pan-India */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Fast Delivery Pan-India</h4>
              <p className="text-[10px] text-slate-600 mt-0.5">Quick & safe delivery</p>
            </div>
          </div>

          {/* 5. Secure Payment 100% Safe */}
          <div className="flex items-center gap-3 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Secure Payment 100% Safe</h4>
              <p className="text-[10px] text-slate-600 mt-0.5">Multiple secure payment options</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. TOP PICKS FOR YOU SECTION (EXACT REFERENCE CARDS) ================= */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">Top Picks for You</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('products');
              }}
              className="text-xs font-black text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 text-amber-800" />
            </button>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('products');
              }}
              className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Cards Row (5 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {topPicksProducts.slice(0, 5).map((prod) => {
            const isLiked = isInWishlist(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => {
                  setSelectedProductId(prod.id);
                  setCurrentView('product-detail');
                }}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between p-3 relative cursor-pointer"
              >
                {/* Top Badge: Bestseller or Discount */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  {prod.id === 'hk_ks_haldi' || prod.isBestSeller ? (
                    <span className="bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-2xs">
                      Bestseller
                    </span>
                  ) : prod.discountPercent > 0 ? (
                    <span className="bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-1.5 py-0.5 rounded-md shadow-2xs">
                      {prod.discountPercent}% OFF
                    </span>
                  ) : null}
                </div>

                {/* Wishlist Heart Top Right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(prod.id);
                  }}
                  className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-colors ${
                    isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                </button>

                {/* Product Image */}
                <div className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-amber-800 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{prod.unit}</p>
                  </div>

                  {/* Price Row */}
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm sm:text-base font-black text-slate-950">₹{prod.price}</span>
                      {prod.mrp > prod.price && (
                        <span className="text-xs text-slate-400 line-through">₹{prod.mrp}</span>
                      )}
                      {prod.discountPercent > 0 && (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-1 rounded-sm">
                          {prod.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Yellow Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, 1);
                      }}
                      className="w-full mt-2 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Add to Cart</span>
                      <ShoppingCart className="w-3.5 h-3.5 text-slate-950" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 5. THREE PROMOTIONAL BANNER CARDS (EXACT REFERENCE DESIGN) ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Sell on Harwalkart (Dark Navy) */}
        <div className="bg-slate-950 rounded-3xl p-6 text-white border border-slate-800 shadow-md flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-3 z-10 max-w-[60%]">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">Sell on Harwalkart</h3>
              <p className="text-xs text-slate-300 mt-1">Grow your business with Harwalkart</p>
            </div>
            <button
              onClick={() => navigate('/seller/register')}
              className="py-2 px-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-full flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <span>Become a Seller</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>

          {/* Shop Storefront Illustration Icon */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-amber-500/20 rounded-2xl border border-amber-400/30 flex items-center justify-center text-amber-400 text-4xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            🏪
          </div>
        </div>

        {/* Card 2: Kitchen Shakti Range (Warm Yellow) */}
        <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-3xl p-6 text-slate-950 border border-amber-200 shadow-md flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-3 z-10 max-w-[60%]">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-tight">Kitchen Shakti Range</h3>
              <p className="text-xs text-amber-950 font-medium mt-1">Pure. Authentic. Trusted.</p>
            </div>
            <button
              onClick={() => setCurrentView('kitchen-shakti')}
              className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>

          {/* Spice Pouches Graphic */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/70 rounded-2xl border border-amber-300/50 flex items-center justify-center text-amber-700 text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            🌶️🥣
          </div>
        </div>

        {/* Card 3: Best Offers of the Day (Soft Cream) */}
        <div className="bg-[#FFFBEB] rounded-3xl p-6 text-slate-950 border border-amber-200/80 shadow-md flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-3 z-10 max-w-[60%]">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-tight">Best Offers of the Day</h3>
              <p className="text-xs text-slate-600 mt-1">Up to 35% discount on daily groceries</p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('products');
              }}
              className="py-2 px-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-full flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* 3D Gift Box Graphic */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-center text-4xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            🎁
          </div>
        </div>
      </section>

      {/* ================= 6. NEARBY LOCAL SHOPS SECTION ================= */}
      <section className="space-y-4 pt-2">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">Local Shops Near You</h2>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                {currentLocation.area || 'Bandra West'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Buy directly from verified neighbourhood kirana, dairy, and grocery stores.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('shops')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Shops ({sellers.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {localSellers.slice(0, 3).map((seller) => (
            <ShopCard key={seller.id} seller={seller} />
          ))}
        </div>
      </section>

      {/* ================= 7. HARWALKART DIRECT - KITCHEN SHAKTI RANGE SHOWCASE ================= */}
      <KitchenShaktiSection />

      {/* ================= 8. VIDEO SHOPPING REELS SECTION ================= */}
      <VideoShoppingSection />
    </div>
  );
};
