import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { HeroBanner } from '../../../types';
import { INITIAL_HERO_BANNERS } from '../../../data/mockData';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Upload,
  Link,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { ImageUploadField } from '../../common/ImageUploadField';

export const AdminBannersTab: React.FC = () => {
  const {
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    toggleHeroBannerStatus,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  // Simple and focused form data
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    priority: 1,
    isActive: true,
  });

  const [previewError, setPreviewError] = useState(false);

  const sortedBanners = [...(heroBanners || [])].sort(
    (a, b) => (a.priority || 0) - (b.priority || 0)
  );

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: `Banner ${sortedBanners.length + 1}`,
      imageUrl: '',
      linkUrl: '/brand/kitchen-shakti',
      priority: sortedBanners.length + 1,
      isActive: true,
    });
    setPreviewError(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.linkUrl || banner.buttonLink || '',
      priority: banner.priority || 1,
      isActive: banner.isActive !== false,
    });
    setPreviewError(false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      alert('Please upload or provide a banner image URL.');
      return;
    }

    if (editingBanner) {
      updateHeroBanner(editingBanner.id, {
        title: formData.title.trim() || 'Hero Banner',
        imageUrl: formData.imageUrl.trim(),
        linkUrl: formData.linkUrl.trim(),
        buttonLink: formData.linkUrl.trim(),
        priority: Number(formData.priority) || 1,
        isActive: formData.isActive,
      });
    } else {
      addHeroBanner({
        title: formData.title.trim() || `Banner ${sortedBanners.length + 1}`,
        imageUrl: formData.imageUrl.trim(),
        linkUrl: formData.linkUrl.trim(),
        buttonLink: formData.linkUrl.trim(),
        priority: Number(formData.priority) || sortedBanners.length + 1,
        isActive: formData.isActive,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }

    setIsModalOpen(false);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedBanners.length) return;

    const currentItem = sortedBanners[index];
    const targetItem = sortedBanners[targetIndex];

    const currentPriority = currentItem.priority || index + 1;
    const targetPriority = targetItem.priority || targetIndex + 1;

    // Swap priorities
    updateHeroBanner(currentItem.id, { priority: targetPriority });
    updateHeroBanner(targetItem.id, { priority: currentPriority });
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950">Hero Banner Management</h3>
              <p className="text-xs text-slate-500">
                Upload pure banner images. Exactly what you upload is what customers will see on the homepage.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Restore default flagship banners button */}
          <button
            onClick={() => {
              if (
                confirm(
                  'Restore the 5 Flagship Harwalkart Banner Images (KitchenShakthi, NutriFlow, RupaBhoom, GrahShorya, Tropical Category)?'
                )
              ) {
                INITIAL_HERO_BANNERS.forEach((banner) => {
                  const exists = (heroBanners || []).find((b) => b.id === banner.id);
                  if (exists) {
                    updateHeroBanner(banner.id, banner);
                  } else {
                    addHeroBanner(banner);
                  }
                });
              }
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Restore default 5 flagship banners"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {/* Add Banner Button */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hero Banner</span>
          </button>
        </div>
      </div>

      {/* Banner List */}
      <div className="space-y-3">
        {sortedBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              banner.isActive
                ? 'bg-slate-50 border-slate-200 hover:border-amber-400'
                : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}
          >
            {/* Left: Priority Re-order Arrows & Thumbnail */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              {/* Order Controls */}
              <div className="flex flex-col items-center gap-0.5 shrink-0 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  onClick={() => handleMoveOrder(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-black text-slate-800 px-1.5">
                  #{banner.priority || index + 1}
                </span>
                <button
                  onClick={() => handleMoveOrder(index, 'down')}
                  disabled={index === sortedBanners.length - 1}
                  className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Banner Image Preview Container */}
              <div className="relative w-36 sm:w-44 h-20 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-900 flex items-center justify-center">
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Banner'}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Banner Info */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-950 text-sm truncate">
                    {banner.title || `Hero Banner #${banner.priority || index + 1}`}
                  </h4>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      banner.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {banner.isActive ? 'Published' : 'Unpublished'}
                  </span>
                </div>

                <p className="text-slate-500 text-xs font-mono truncate">
                  {banner.imageUrl}
                </p>

                {(banner.linkUrl || banner.buttonLink) && (
                  <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                    <Link className="w-3 h-3 shrink-0" />
                    <span className="truncate">Links to: {banner.linkUrl || banner.buttonLink}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              {/* Publish / Unpublish Toggle */}
              <button
                onClick={() => toggleHeroBannerStatus(banner.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  banner.isActive
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
                title="Publish / Unpublish"
              >
                {banner.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{banner.isActive ? 'Published' : 'Unpublished'}</span>
              </button>

              {/* Edit / Replace Image */}
              <button
                onClick={() => handleOpenEdit(banner)}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-800 cursor-pointer transition-colors"
                title="Edit / Replace Image"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete Banner */}
              <button
                onClick={() => {
                  if (confirm(`Delete banner "${banner.title || 'this banner'}"?`)) {
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
            <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-700 text-sm">No Hero Banners Found</div>
            <p className="text-xs text-slate-500">
              Add a hero banner image to showcase on the Harwalkart Homepage.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer"
            >
              Add First Banner
            </button>
          </div>
        )}
      </div>

      {/* ================= ADD / EDIT BANNER MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-950 text-base">
                  {editingBanner ? 'Edit Hero Banner' : 'Add Hero Banner'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-black text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* 1. Upload Banner Image */}
              <ImageUploadField
                label="Upload Banner Image *"
                sublabel="High-resolution banner image (SVG, PNG, JPG, or WebP). The image is displayed exactly as uploaded."
                value={formData.imageUrl}
                onChange={(url) => {
                  setFormData({ ...formData, imageUrl: url });
                  setPreviewError(false);
                }}
                role="admin"
                imageType="banner"
                folder="banners"
                required
                helpNote="The uploaded banner will be displayed without modifications, overlays, or cropping."
              />

              {/* 2. Banner Live Preview */}
              {formData.imageUrl && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    Exact Preview (As Customer Will See):
                  </label>
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center p-1">
                    {!previewError ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        onError={() => setPreviewError(true)}
                        className="w-full h-auto max-h-56 object-contain rounded-xl"
                      />
                    ) : (
                      <div className="py-8 text-center text-slate-400">
                        Image preview failed to load. Check URL or file.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Title / Reference Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Banner Name (For Admin Reference)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. KitchenShakthi Flagship Banner"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              {/* 4. Display Priority & Click Redirection Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Display Order / Priority</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                  <p className="text-[10px] text-slate-500">1 = First slide shown</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target Page on Click (Optional)</label>
                  <select
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  >
                    <option value="">None (Display only)</option>
                    <option value="/brand/kitchen-shakti">KitchenShakthi Brand</option>
                    <option value="/brand/nutriflow">NutriFlow Brand</option>
                    <option value="/brand/rupabhoom">RupaBhoom Brand</option>
                    <option value="/brand/grahshorya">GrahShorya Brand</option>
                    <option value="/products">All Products Catalog</option>
                    <option value="/shops">All Neighborhood Shops</option>
                    <option value="/video-shopping">Live Video Shopping</option>
                  </select>
                </div>
              </div>

              {/* 5. Publish Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="admin-banner-publish"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded-sm cursor-pointer"
                />
                <label
                  htmlFor="admin-banner-publish"
                  className="font-bold text-slate-800 cursor-pointer"
                >
                  Publish this banner on Homepage
                </label>
              </div>

              {/* 6. Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xs cursor-pointer transition-all"
                >
                  {editingBanner ? 'Save Changes' : 'Save & Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
