import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import { ShopCard } from '../shop/ShopCard';
import { KitchenShaktiSection } from './KitchenShaktiSection';
import { BrandShowcaseSection } from './BrandShowcaseSection';
import { VideoShoppingSection } from '../video/VideoShoppingSection';
import { HeroBannerCarousel } from './HeroBannerCarousel';
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
      {/* ================= 1. DYNAMIC HERO BANNER CAROUSEL (5 FLAGSHIP HARWALKART BRANDS) ================= */}
      <HeroBannerCarousel
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          setCurrentView('products');
        }}
      />

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

      {/* ================= 2.5. HARWALKART 4 INDEPENDENT FLAGSHIP BRANDS ================= */}
      <BrandShowcaseSection />

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
