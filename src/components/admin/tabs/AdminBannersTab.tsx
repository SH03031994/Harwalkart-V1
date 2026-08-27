import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { HeroBanner } from '../../../types';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Link2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const AdminBannersTab: React.FC = () => {
  const { heroBanners, addHeroBanner, updateHeroBanner, deleteHeroBanner, toggleHeroBannerStatus, brands } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<HeroBanner | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: '✨ 100% VISIBLE PURITY',
    imageUrl: '',
    buttonText: 'Explore Transparent Range',
    buttonLink: '/brand/kitchen-shakti',
    brandTag: 'KitchenShakti',
    priority: 1,
    isActive: true,
  });

  const handleOpenAdd = () => {
    setFormData({
      title: 'Har Din Kuch Khas – Transparent Packaging',
      subtitle: 'See the 100% purity before you buy. Masalas, pulses, dry fruits and wellness products in premium transparent pouches & clear jars.',
      badgeText: '✨ 100% VISIBLE PURITY',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&auto=format&fit=crop&q=80',
      buttonText: 'Explore Transparent Range',
      buttonLink: '/brand/kitchen-shakti',
      brandTag: 'KitchenShakti',
      priority: (heroBanners?.length || 0) + 1,
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      badgeText: banner.badgeText || '✨ 100% VISIBLE PURITY',
      imageUrl: banner.imageUrl,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      brandTag: banner.brandTag || 'KitchenShakti',
      priority: banner.priority || 1,
      isActive: banner.isActive !== false,
    });
    setIsEditModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addHeroBanner({
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      badgeText: formData.badgeText.trim(),
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&auto=format&fit=crop&q=80',
      buttonText: formData.buttonText.trim() || 'Shop Now',
      buttonLink: formData.buttonLink || '/products',
      brandTag: formData.brandTag,
      priority: Number(formData.priority) || 1,
      isActive: formData.isActive,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanner) return;
    updateHeroBanner(selectedBanner.id, {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      badgeText: formData.badgeText.trim(),
      imageUrl: formData.imageUrl,
      buttonText: formData.buttonText.trim(),
      buttonLink: formData.buttonLink,
      brandTag: formData.brandTag,
      priority: Number(formData.priority),
      isActive: formData.isActive,
    });
    setIsEditModalOpen(false);
  };

  const sortedBanners = [...(heroBanners || [])].sort((a, b) => (a.priority || 0) - (b.priority || 0));

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Hero Banner Management</h3>
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
              {sortedBanners.length} Banners Configured
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete CRUD control over homepage hero banners, transparent packaging highlights, priority orders, and direct CTAs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hero Banner</span>
        </button>
      </div>

      {/* Info notice about Transparent Packaging & dynamic controls */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-950">Transparent Packaging Hero Showcase</div>
          <p className="text-amber-800 leading-relaxed">
            All banners created here are dynamically served on the Harwalkart Homepage. Priority 1 is rendered as the primary slide. Disabled banners are hidden from customers automatically.
          </p>
        </div>
      </div>

      {/* Banners Table & Cards */}
      <div className="space-y-4">
        {sortedBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              banner.isActive
                ? 'bg-slate-50 border-slate-200 hover:border-amber-400'
                : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}
          >
            {/* Banner Thumbnail & Basic Details */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-slate-900 font-black text-sm flex items-center justify-center shrink-0 border border-amber-200">
                #{banner.priority || index + 1}
              </div>

              <div className="relative w-28 h-18 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-200">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                <span className="absolute bottom-1 left-1 text-[8px] font-black text-amber-300 uppercase px-1 rounded-sm bg-slate-950/80">
                  {banner.brandTag || 'Harwalkart'}
                </span>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-950 text-sm truncate">{banner.title}</h4>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      banner.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-slate-600 text-xs line-clamp-1">{banner.subtitle}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="font-semibold text-amber-800 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Button: {banner.buttonText} ({banner.buttonLink})
                  </span>
                  {banner.badgeText && (
                    <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold">
                      {banner.badgeText}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                onClick={() => toggleHeroBannerStatus(banner.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  banner.isActive
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
                title="Toggle Active Status"
              >
                {banner.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{banner.isActive ? 'Active' : 'Disabled'}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(banner)}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-800 cursor-pointer transition-colors"
                title="Edit Banner Details"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete banner "${banner.title}"?`)) {
                    deleteHeroBanner(banner.id);
                  }
                }}
                className="p-2 bg-rose-100 hover:bg-rose-200 rounded-xl text-rose-700 cursor-pointer transition-colors"
                title="Delete Banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {sortedBanners.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
            <Layers className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-700 text-sm">No Hero Banners Found</div>
            <p className="text-xs text-slate-500">Add a new dynamic hero banner to highlight transparent packaging and top brands.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer"
            >
              Create First Banner
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-950 text-base">
                  {isAddModalOpen ? 'Add New Hero Banner' : 'Edit Hero Banner'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700 font-black text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4 text-xs">
              {/* Title & Brand Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Banner Headline / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. KitchenShakti Spices In Transparent Stand-Up Pouches"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Brand Tag / Promotion</label>
                  <select
                    value={formData.brandTag}
                    onChange={e => setFormData({ ...formData, brandTag: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  >
                    <option value="KitchenShakti">KitchenShakti™ (Pure Spices)</option>
                    <option value="NutriFlow">NutriFlow™ (Unpolished Pulses & Grains)</option>
                    <option value="Rupabhoom™">Rupabhoom™ (Ayurvedic Personal Care)</option>
                    <option value="GrahShorya™">GrahShorya™ (Home Hygiene Essentials)</option>
                    <option value="Harwalkart Marketplace">Harwalkart Marketplace (Local Stores)</option>
                  </select>
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Transparent food-grade packaging that shows genuine texture, aroma and purity..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                />
              </div>

              {/* Badge Text & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Top Badge / Pill Tag</label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="e.g. ✨ 100% VISIBLE PURITY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Display Priority (1 = Top First)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Image URL & File Upload */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Banner Background Image URL or Upload *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                  <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold flex items-center gap-1 cursor-pointer shrink-0">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>

                {formData.imageUrl && (
                  <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Button CTA & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="e.g. Explore Transparent Range"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Button Navigation Link</label>
                  <select
                    value={formData.buttonLink}
                    onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  >
                    <option value="/brand/kitchen-shakti">KitchenShakti (/brand/kitchen-shakti)</option>
                    <option value="/brand/nutriflow">NutriFlow (/brand/nutriflow)</option>
                    <option value="/brand/rupabhoom">Rupabhoom™ (/brand/rupabhoom)</option>
                    <option value="/brand/grahshorya">GrahShorya™ (/brand/grahshorya)</option>
                    <option value="/products">All Marketplace Products (/products)</option>
                    <option value="/shops">Local Neighborhood Shops (/shops)</option>
                    <option value="/video-shopping">Video Shopping (/video-shopping)</option>
                  </select>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="banner-active-check"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded-sm"
                />
                <label htmlFor="banner-active-check" className="font-bold text-slate-800 cursor-pointer">
                  Publish & Enable this banner immediately on Homepage
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xs cursor-pointer"
                >
                  {isAddModalOpen ? 'Save & Publish Banner' : 'Update Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
