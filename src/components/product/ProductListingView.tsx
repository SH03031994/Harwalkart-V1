import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../../data/mockData';
import { Filter, SlidersHorizontal, ArrowUpDown, Store, Flame, Search } from 'lucide-react';

export const ProductListingView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    currentLocation,
  } = useApp();

  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'discount'>('popular');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'local'>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Filtering
  const filteredProducts = products.filter(product => {
    if (!product.approved) return false;
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchHindi = product.hindiName?.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      if (!matchName && !matchHindi && !matchBrand && !matchCategory) return false;
    }
    if (filterType === 'direct' && !product.isHarwalkartDirect) return false;
    if (filterType === 'local' && product.isHarwalkartDirect) return false;
    if (product.price < minPrice || product.price > maxPrice) return false;
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    return b.rating - a.rating;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products & Spices'}
          </h1>
          <p className="text-xs text-slate-500">
            Showing {sortedProducts.length} items available in {currentLocation.area} ({currentLocation.pincode})
          </p>
        </div>

        {/* Source Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-max text-xs font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer ${
              filterType === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilterType('direct')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer ${
              filterType === 'direct' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Flame className="w-3 h-3 fill-current" />
            <span>Kitchen Shakti</span>
          </button>
          <button
            onClick={() => setFilterType('local')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer ${
              filterType === 'local' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <Store className="w-3 h-3" />
            <span>Local Shops</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Filters (3 Cols) */}
        <div className="lg:col-span-3 space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs h-max">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter Catalog</span>
            </span>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories list */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Categories</label>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span>{cat.icon}</span>
              </button>
            ))}
          </div>

          {/* Sort By Selector */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-slate-400 block">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="popular">Top Rated & Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Product Grid (9 Cols) */}
        <div className="lg:col-span-9 space-y-4">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for other items or browse our pure Kitchen Shakti Pan-India collection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
