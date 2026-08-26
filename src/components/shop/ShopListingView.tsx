import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShopCard } from './ShopCard';
import { checkSellerServiceability } from '../../utils/location';
import { Store, MapPin, Search, Globe, Compass, ShieldCheck, Filter } from 'lucide-react';

export const ShopListingView: React.FC = () => {
  const { sellers, currentLocation, setIsLocationModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gst' | 'local_10km'>('all');

  // Filter sellers:
  // 1. Only approved live sellers (or exclude direct warehouse)
  // 2. Enforce 10 KM radius for Non-GST Local sellers (customers outside 10 KM cannot see them)
  const filteredSellers = sellers.filter(s => {
    if (s.isHarwalkartDirect) return false;
    if (s.status !== 'approved') return false;

    // Check serviceability for the customer's current location
    const serviceability = checkSellerServiceability(s, currentLocation);

    // If seller is Option 2 (Non-GST Local) and customer is outside 10 KM radius, exclude seller
    const isLocalNonGst = s.sellerType === 'local_without_gst' || !s.isGstRegistered;
    if (isLocalNonGst && !serviceability.isServiceable) {
      return false;
    }

    // Type filter
    if (filterType === 'gst' && (s.sellerType === 'local_without_gst' || !s.isGstRegistered)) {
      return false;
    }
    if (filterType === 'local_10km' && (s.sellerType === 'gst' || s.isGstRegistered)) {
      return false;
    }

    // Search query matching
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = s.shopName.toLowerCase().includes(q);
      const matchArea = s.address.area.toLowerCase().includes(q);
      const matchCity = s.address.city.toLowerCase().includes(q);
      const matchCat = s.categories?.some(c => c.toLowerCase().includes(q));
      return matchName || matchArea || matchCity || matchCat;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">Local Neighbourhood Shops</h1>
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-md">
              {filteredSellers.length} Shops Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Showing verified stores delivering to <strong className="text-slate-800">{currentLocation.area}</strong> ({currentLocation.pincode})
          </p>
        </div>

        {/* Search & Location Change */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search local shops by name or area..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 w-full sm:w-64 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Area PIN</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 w-max text-xs font-bold shadow-2xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
            filterType === 'all' ? 'bg-slate-950 text-white font-black' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Available Shops
        </button>
        <button
          onClick={() => setFilterType('gst')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            filterType === 'gst' ? 'bg-slate-950 text-white font-black' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>GST Verified (Pan-India)</span>
        </button>
        <button
          onClick={() => setFilterType('local_10km')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            filterType === 'local_10km' ? 'bg-slate-950 text-white font-black' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Local (Within 10 KM)</span>
        </button>
      </div>

      {/* Shops Grid */}
      {filteredSellers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSellers.map(seller => (
            <ShopCard key={seller.id} seller={seller} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
          <Store className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No serviceable shops found in this 10 KM zone</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Non-GST local merchants only deliver within a fixed 10 KM radius of their registered location. Try switching your delivery PIN code or browse PAN-India GST stores.
          </p>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl cursor-pointer hover:bg-amber-400"
          >
            Change Location
          </button>
        </div>
      )}
    </div>
  );
};
