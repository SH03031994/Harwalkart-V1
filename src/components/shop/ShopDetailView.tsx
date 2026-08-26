import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import {
  Store,
  MapPin,
  Star,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Clock,
  Search,
} from 'lucide-react';

export const ShopDetailView: React.FC = () => {
  const {
    selectedShopId,
    sellers,
    products,
    setCurrentView,
    openShareModal,
  } = useApp();

  const seller = sellers.find(s => s.id === selectedShopId) || sellers[0];
  const [shopSearch, setShopSearch] = useState('');
  const [selectedShopCat, setSelectedShopCat] = useState('all');

  const shopProducts = products.filter(p => {
    if (p.sellerId !== seller.id) return false;
    if (shopSearch && !p.name.toLowerCase().includes(shopSearch.toLowerCase())) return false;
    if (selectedShopCat !== 'all' && p.category !== selectedShopCat) return false;
    return true;
  });

  const handleShareShop = () => {
    openShareModal({
      title: `${seller.shopName} - Verified Local Shop on HARWALKART`,
      text: `Order fresh groceries and home essentials online from ${seller.shopName} in ${seller.address.area}, ${seller.address.city} on HARWALKART!`,
      url: `https://harwalkart.com/shop/${seller.slug}`,
      type: 'shop',
      item: seller,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('shops')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Local Shops</span>
      </button>

      {/* Shop Header Banner & Info */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={seller.bannerImage}
            alt={seller.shopName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Share Shop */}
          <button
            onClick={handleShareShop}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Shop</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6 sm:p-8 -mt-12 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
              <img src={seller.logo} alt={seller.shopName} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950">{seller.shopName}</h1>
                {seller.verified && (
                  <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-100 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Proprietor: <strong>{seller.name}</strong> • Member since {seller.joinedDate}</p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {seller.address.street}, {seller.address.area}, {seller.address.city} - {seller.address.pincode}
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {seller.openingHours}
                </span>
              </div>
            </div>
          </div>

          {/* Rating & Contact Card */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
              <span className="text-xl font-black text-emerald-800">{seller.rating}</span>
              <div className="text-[11px] text-emerald-900 font-bold leading-tight">
                <div>★ Rated</div>
                <div>{seller.reviewCount} Reviews</div>
              </div>
            </div>

            <a
              href={`tel:${seller.phone}`}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Shop</span>
            </a>
          </div>
        </div>

        {/* GST & Regulatory Information Ribbon */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Tax & GST Compliance:</strong>{' '}
              {seller.isGstRegistered
                ? `GST Registered Seller (GSTIN: ${seller.gstin}) • B2C & B2B Tax Invoicing Supported`
                : `Registered Micro/Composition Local Merchant (PAN: ${seller.panNumber}) under Indian Trade Norms`}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Delivery Coverage: <strong>{seller.isHarwalkartDirect ? 'PAN-India (Harwalkart Central Fulfillment)' : seller.isGstRegistered ? 'PAN-India (GST Registered Merchant)' : 'Hyperlocal 10 KM Radius'}</strong>
          </div>
        </div>
      </div>

      {/* Shop Catalogue Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Products Available at {seller.shopName}
            </h2>
            <p className="text-xs text-slate-500">{shopProducts.length} items in stock</p>
          </div>

          {/* Search inside shop */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={shopSearch}
              onChange={e => setShopSearch(e.target.value)}
              placeholder="Search in this shop..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        {shopProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {shopProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
