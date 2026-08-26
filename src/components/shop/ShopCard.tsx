import React from 'react';
import { Seller } from '../../types';
import { useApp } from '../../context/AppContext';
import { Store, Star, MapPin, Clock, Share2, CheckCircle, ShieldCheck } from 'lucide-react';

interface ShopCardProps {
  seller: Seller;
}

export const ShopCard: React.FC<ShopCardProps> = ({ seller }) => {
  const { setSelectedShopId, setCurrentView, openShareModal } = useApp();

  const handleOpenShop = () => {
    setSelectedShopId(seller.id);
    setCurrentView('shop-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareShop = (e: React.MouseEvent) => {
    e.stopPropagation();
    openShareModal({
      title: `${seller.shopName} - Local Shop on HARWALKART`,
      text: `Visit ${seller.shopName} (${seller.address.area}, ${seller.address.city}) on HARWALKART to buy fresh groceries and daily essentials directly!`,
      url: `https://harwalkart.com/shop/${seller.slug}`,
      type: 'shop',
      item: seller,
    });
  };

  return (
    <div
      onClick={handleOpenShop}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Banner */}
      <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
        <img
          src={seller.bannerImage}
          alt={seller.shopName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Distance Badge */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-amber-400 backdrop-blur-xs font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{seller.isHarwalkartDirect ? 'Central Warehouse' : `${seller.distanceKm} km away`}</span>
        </div>

        {/* Share Shop */}
        <button
          onClick={handleShareShop}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-xs shadow-xs"
          title="Share Shop Link"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Open / Closed status */}
        <div className="absolute bottom-2 right-2.5">
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
              seller.isOpen
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {seller.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Shop Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start gap-3">
            {/* Shop Logo */}
            <div className="w-12 h-12 rounded-xl border-2 border-white -mt-7 bg-white shadow-md overflow-hidden shrink-0">
              <img
                src={seller.logo}
                alt={seller.shopName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                  {seller.shopName}
                </h4>
                {seller.verified && (
                  <CheckCircle className="w-4 h-4 text-sky-500 fill-sky-100 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {seller.address.area}, {seller.address.city}
              </p>
            </div>
          </div>

          {/* GST and Merchant type pill */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {seller.isHarwalkartDirect ? (
              <span className="bg-amber-100 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-700" />
                Harwalkart Direct (Pan-India)
              </span>
            ) : seller.isGstRegistered ? (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                GST Pan-India Delivery
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                10 KM Local Delivery
              </span>
            )}
          </div>
        </div>

        {/* Bottom meta stats & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-black px-1.5 py-0.2 rounded-md">
              <span>{seller.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {seller.productCount} Products
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenShop}
            className="px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-amber-500 text-white group-hover:text-slate-950 text-xs font-bold transition-all cursor-pointer"
          >
            View Shop
          </button>
        </div>
      </div>
    </div>
  );
};
