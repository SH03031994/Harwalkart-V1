import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowLeft,
  Search,
  Filter,
  SlidersHorizontal,
  Package,
  Sparkles,
  Truck,
  HeartHandshake,
  Share2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const BrandDetailView: React.FC = () => {
  const {
    brands,
    selectedBrandSlug,
    products,
    setCurrentView,
    openShareModal,
    navigateToBrand,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'discount'>('featured');
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'certifications'>('products');

  // Find the selected brand (fallback to KitchenShakti if not found)
  const currentBrand =
    brands.find(b => b.slug === selectedBrandSlug) ||
    brands.find(b => b.slug === 'kitchen-shakti') ||
    brands[0];

  if (!currentBrand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Brand not found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
        >
          Return to Marketplace Home
        </button>
      </div>
    );
  }

  // Filter products belonging to this brand
  const brandProducts = products.filter(p => {
    // Only live published approved active products for customers
    if (!p.approved) return false;
    if (p.isActive === false) return false;
    if (p.isDraft) return false;
    if (p.isPublished === false) return false;

    const matchesBrand =
      p.brandSlug === currentBrand.slug ||
      p.brandId === currentBrand.id ||
      p.brand.toLowerCase().trim() === currentBrand.name.toLowerCase().trim();

    if (!matchesBrand) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchHindi = p.hindiName?.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subCategory?.toLowerCase().includes(q);
      if (!matchName && !matchHindi && !matchCat && !matchSub) return false;
    }

    if (selectedSubCategory !== 'all') {
      const matchesCategory = p.category === selectedSubCategory;
      const matchesSub = p.subCategory === selectedSubCategory;
      if (!matchesCategory && !matchesSub) return false;
    }

    return true;
  });

  // Extract unique categories and subcategories within this brand's catalog
  const allBrandProducts = products.filter(
    p =>
      p.approved &&
      p.isActive !== false &&
      !p.isDraft &&
      p.isPublished !== false &&
      (p.brandSlug === currentBrand.slug ||
        p.brandId === currentBrand.id ||
        p.brand.toLowerCase().trim() === currentBrand.name.toLowerCase().trim())
  );
  const brandCategories = Array.from(
    new Set([
      ...allBrandProducts.map(p => p.category),
      ...allBrandProducts.map(p => p.subCategory).filter(Boolean) as string[],
    ])
  );

  // Sorting
  const sortedProducts = [...brandProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    return b.rating - a.rating;
  });

  const handleShareBrand = () => {
    openShareModal({
      title: `${currentBrand.name} - Harwalkart Marketplace`,
      text: `Explore authentic ${currentBrand.name} products (${currentBrand.category}) on Harwalkart: ${currentBrand.tagline}`,
      url: `https://harwalkart.com/brand/${currentBrand.slug}`,
      type: 'brand',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 animate-in fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-semibold">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Harwalkart Marketplace</span>
          </button>
          <span>/</span>
          <span className="text-slate-400">Brands</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">{currentBrand.name}</span>
        </div>

        <button
          onClick={handleShareBrand}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold hover:text-amber-600 shadow-2xs transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Brand</span>
        </button>
      </div>

      {/* Brand Hero Banner */}
      <div
        className="rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 lg:p-10 relative overflow-hidden bg-white text-slate-900"
        style={{
          background: `linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)`,
        }}
      >
        {/* Decorative Top Accent */}
        <div
          className="absolute top-0 left-0 right-0 h-2.5"
          style={{ backgroundColor: currentBrand.themeColor || '#F59E0B' }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Brand Logo & Basic Information */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-slate-950 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                Harwalkart Flagship Brand
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                {currentBrand.category}
              </span>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                100% Genuine Direct Dispatch
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Official Logo Box */}
              <div className="w-32 h-24 rounded-2xl bg-white border-2 border-slate-200 p-3 shadow-md flex items-center justify-center shrink-0">
                <img
                  src={currentBrand.logoUrl}
                  alt={`${currentBrand.name} Official Logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950">
                    {currentBrand.name}
                  </h1>
                  {currentBrand.hindiName && (
                    <span className="text-sm sm:text-base font-bold text-amber-900">
                      ({currentBrand.hindiName})
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1 italic">
                  "{currentBrand.tagline}"
                </p>
                <p className="text-xs text-slate-600 font-medium mt-2 max-w-2xl leading-relaxed">
                  {currentBrand.description}
                </p>
              </div>
            </div>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] font-bold text-slate-700">
              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Premium Quality Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pan-India Fast Dispatch</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Harwalkart Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                <Package className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Tamper-Proof Seal</span>
              </div>
            </div>
          </div>

          {/* Quick Switch to Other 3 Brands */}
          <div className="lg:col-span-4 bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
            <span className="text-[10px] font-black uppercase text-slate-500 block">
              Switch Harwalkart Brand
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {brands
                .filter(b => b.id !== currentBrand.id && b.isActive)
                .map(otherBrand => (
                  <button
                    key={otherBrand.id}
                    onClick={() => navigateToBrand(otherBrand.slug)}
                    className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={otherBrand.logoUrl}
                          alt={otherBrand.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                          {otherBrand.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate max-w-[170px]">
                          {otherBrand.category}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Products Catalog ({sortedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'about'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>About {currentBrand.name}</span>
        </button>

        <button
          onClick={() => setActiveTab('certifications')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'certifications'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Quality & Compliance</span>
        </button>
      </div>

      {/* Tab 1: Products Catalog */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Search within brand */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search within ${currentBrand.name}...`}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Subcategories & Sort */}
            <div className="flex flex-wrap items-center gap-2">
              {brandCategories.length > 1 && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setSelectedSubCategory('all')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      selectedSubCategory === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600'
                    }`}
                  >
                    All Types
                  </button>
                  {brandCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedSubCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                        selectedSubCategory === cat
                          ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No matching {currentBrand.name} products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or explore all products from our other Harwalkart brands.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubCategory('all');
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Clear Brand Search
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: About Brand Story */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              About {currentBrand.name}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {currentBrand.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                1
              </div>
              <h4 className="text-sm font-black text-slate-900">Direct Sourcing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Raw ingredients and materials are sourced from top certified origins to guarantee uncompromised purity and authenticity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                2
              </div>
              <h4 className="text-sm font-black text-slate-900">Standardized Hygiene</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Processed in automated, state-of-the-art facilities following strict food safety and personal care manufacturing norms.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                3
              </div>
              <h4 className="text-sm font-black text-slate-900">Marketplace Guarantee</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Protected by the Harwalkart Parent Company quality promise—100% money-back guarantee if quality does not match expectations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Certifications & Direct Dispatch */}
      {activeTab === 'certifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Quality Assurance & Compliance
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every batch under {currentBrand.name} undergoes multi-stage lab checks and verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>FSSAI / FDA / Ayush Standard Compliance</span>
              </div>
              <p className="text-xs text-slate-600">
                Formulations and packaging strictly adhere to regulatory mandates and consumer safety parameters.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Tamper-Evident Direct Fulfillment</span>
              </div>
              <p className="text-xs text-slate-600">
                Packed in humidity-resistant, multi-layer barrier pouches and bottles with verified batch dates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
