import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Advertisement } from '../../../types';
import {
  Radio,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MousePointer,
  MapPin,
  Tag,
} from 'lucide-react';

export const AdminAdsTab: React.FC = () => {
  const {
    advertisements,
    addAdvertisement,
    editAdvertisement,
    deleteAdvertisement,
    toggleAdvertisementStatus,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: 'SPECIAL OFFER',
    imageUrl: '',
    linkUrl: 'Kitchen Shakti Range',
    targetCity: 'All India',
    targetPincode: '',
    position: 'hero' as 'hero' | 'middle' | 'sidebar' | 'popup',
  });

  const filteredAds = advertisements.filter(
    a =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.targetCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      title: 'Kitchen Shakti Premium Shudh Masale',
      subtitle: 'Flat 30% Off on Pure Haldi, Mirch & Dhaniya Combos',
      badge: 'FESTIVE OFFER',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&auto=format&fit=crop&q=80',
      linkUrl: 'Kitchen Shakti Range',
      targetCity: 'All India',
      targetPincode: '',
      position: 'hero',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (ad: Advertisement) => {
    setSelectedAd(ad);
    setFormData({
      title: ad.title,
      subtitle: ad.subtitle,
      badge: ad.badge || 'OFFER',
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      targetCity: ad.targetCity,
      targetPincode: ad.targetPincode || '',
      position: ad.position,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAdvertisement({
      title: formData.title,
      subtitle: formData.subtitle,
      badge: formData.badge,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl,
      targetCity: formData.targetCity,
      targetPincode: formData.targetPincode || undefined,
      position: formData.position,
      status: 'active',
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAd) return;

    editAdvertisement(selectedAd.id, {
      title: formData.title,
      subtitle: formData.subtitle,
      badge: formData.badge,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl,
      targetCity: formData.targetCity,
      targetPincode: formData.targetPincode || undefined,
      position: formData.position,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Marketing Banners & Local Advertisements</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {advertisements.length} Campaigns
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure homepage hero slider banners, category promo tiles, and geo-targeted merchant announcements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ad Banner</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns by headline, subtitle or city..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Ad Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredAds.map(ad => (
          <div
            key={ad.id}
            className="p-4 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 text-xs transition-all"
          >
            <div className="space-y-3">
              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900">
                <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-center">
                    <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {ad.position}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        ad.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-200'
                      }`}
                    >
                      {ad.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-white text-sm line-clamp-1">{ad.title}</h4>
                    <p className="text-slate-200 text-xs line-clamp-1">{ad.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Hub</span>
                  <span className="font-bold text-slate-800">{ad.targetCity}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Impressions</span>
                  <span className="font-bold text-slate-800">{ad.impressions || 0}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Clicks</span>
                  <span className="font-bold text-emerald-600">{ad.clicks || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                onClick={() => toggleAdvertisementStatus(ad.id, ad.status === 'active' ? 'paused' : 'active')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                  ad.status === 'active'
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {ad.status === 'active' ? 'Pause Campaign' : 'Activate Live'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(ad)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  title="Edit Banner"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete banner campaign "${ad.title}"?`)) {
                      deleteAdvertisement(ad.id);
                    }
                  }}
                  className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 animate-in zoom-in-95 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950">
                {isAddModalOpen ? 'Create Advertisement Banner' : 'Edit Banner Campaign'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Banner Headline *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. Har Din Kuch Khas - Kitchen Shakti"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sub-headline / Offer Copy *</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. 100% Pure Spices with Flat ₹100 Coupon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Promo Badge Text</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    placeholder="e.g. SUPER SAVER"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Display Placement</label>
                  <select
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    <option value="hero">Homepage Hero Slider Banner</option>
                    <option value="middle">Middle Promo Banner</option>
                    <option value="sidebar">Sidebar Promo Tile</option>
                    <option value="popup">Special Modal / Popup</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Banner Image URL (High-Res 16:9) *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target Indian City</label>
                  <input
                    type="text"
                    value={formData.targetCity}
                    onChange={e => setFormData({ ...formData, targetCity: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    placeholder="All India or New Delhi"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target PIN Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.targetPincode}
                    onChange={e => setFormData({ ...formData, targetPincode: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    placeholder="e.g. 110001"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
              >
                {isAddModalOpen ? 'Publish Campaign' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
