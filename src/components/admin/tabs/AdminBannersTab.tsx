import React, { useState, useEffect } from 'react';
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
  Link,
  CheckCircle2,
  Sliders,
  Sparkles,
  Smartphone,
  ExternalLink,
  Tag,
  Filter,
} from 'lucide-react';
import { ImageUploadField } from '../../common/ImageUploadField';

interface AdminBannersTabProps {
  initialOpenAdd?: boolean;
  onResetInitialOpenAdd?: () => void;
}

// Curated high-res flagship and campaign banner presets
const CURATED_BANNER_PRESETS = [
  {
    id: 'preset_kitchen_shakti',
    title: 'Harwalkart KitchenShakthi™ Spices Banner',
    subtitle: 'Authentic Indian Spice Blends, Garam Masala, Turmeric, Red Chilli & Onion Powder',
    badgeText: 'KitchenShakthi',
    brandTag: 'KitchenShakti',
    imageUrl: '/banners/harwalkart-kitchenshakthi.svg',
    buttonText: 'Explore KitchenShakthi',
    linkUrl: '/brand/kitchen-shakti',
  },
  {
    id: 'preset_nutriflow',
    title: 'Harwalkart NutriFlow™ Pulses & Bars Banner',
    subtitle: '100% Unpolished Pulses, Whole Grains & Super Energy Bars',
    badgeText: 'NutriFlow',
    brandTag: 'NutriFlow',
    imageUrl: '/banners/harwalkart-nutriflow.svg',
    buttonText: 'Explore NutriFlow',
    linkUrl: '/brand/nutriflow',
  },
  {
    id: 'preset_rupabhoom',
    title: 'Harwalkart RupaBhoom™ Ayurvedic Care Banner',
    subtitle: 'Pure Ayurvedic Facial Glow, Hair Elixirs & Herbal Care',
    badgeText: 'RupaBhoom',
    brandTag: 'RupaBhoom',
    imageUrl: '/banners/harwalkart-rupabhoom.svg',
    buttonText: 'Explore RupaBhoom',
    linkUrl: '/brand/rupabhoom',
  },
  {
    id: 'preset_grahshorya',
    title: 'Harwalkart GrahShorya™ Home Hygiene Banner',
    subtitle: 'Plant-Powered Cleaners, Floor Wash & Multi-Surface Care',
    badgeText: 'GrahShorya',
    brandTag: 'GrahShorya',
    imageUrl: '/banners/harwalkart-grahshorya.svg',
    buttonText: 'Explore GrahShorya',
    linkUrl: '/brand/grahshorya',
  },
  {
    id: 'preset_beach_categories',
    title: 'Harwalkart 4 Flagship Categories Beach Banner',
    subtitle: 'KitchenShakthi, RupaBhoom, NutriFlow & GrahShorya - Direct Purity',
    badgeText: 'All Categories',
    brandTag: 'All Brands',
    imageUrl: '/banners/harwalkart-category-beach.svg',
    buttonText: 'Explore All Categories',
    linkUrl: '/products',
  },
  {
    id: 'preset_kirana_express',
    title: '10-Minute Hyperlocal Neighborhood Kirana',
    subtitle: 'Fresh Groceries, Milk, Atta & Daily Essentials Delivered Fast from Trusted Stores',
    badgeText: 'Instant Delivery',
    brandTag: 'Local Kirana',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
    buttonText: 'Shop Local Kiranas',
    linkUrl: '/shops',
  },
  {
    id: 'preset_organic_harvest',
    title: 'Farm Fresh Organic Grains & Pure Oils',
    subtitle: 'Cold-Pressed Oils & Stone-Ground Grains Directly Sourced from Certified Indian Farmers',
    badgeText: '100% Organic',
    brandTag: 'NutriFlow',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1600&auto=format&fit=crop&q=80',
    buttonText: 'Browse Organic Harvest',
    linkUrl: '/category/Oils%20%26%20Ghee',
  },
  {
    id: 'preset_spices_celebration',
    title: 'Salem Turmeric & Guntur Red Chilli Festival',
    subtitle: 'Pure Sun-Dried Whole Spices & Freshly Ground Powders with Zero Adulteration',
    badgeText: 'Pure Pouch',
    brandTag: 'KitchenShakti',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&auto=format&fit=crop&q=80',
    buttonText: 'Buy Pure Spices',
    linkUrl: '/category/Kitchen%20Shakti%20Range',
  },
];

export const AdminBannersTab: React.FC<AdminBannersTabProps> = ({
  initialOpenAdd,
  onResetInitialOpenAdd,
}) => {
  const {
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    toggleHeroBannerStatus,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'unpublished'>('all');

  // Comprehensive Banner Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: '',
    brandTag: 'KitchenShakti',
    buttonText: 'Explore Now',
    linkUrl: '/brand/kitchen-shakti',
    imageUrl: '',
    mobileImageUrl: '',
    priority: 1,
    isActive: true,
  });

  const [previewError, setPreviewError] = useState(false);

  const sortedBanners = [...(heroBanners || [])].sort(
    (a, b) => (a.priority || 0) - (b.priority || 0)
  );

  const filteredBanners = sortedBanners.filter((b) => {
    if (statusFilter === 'published') return b.isActive !== false;
    if (statusFilter === 'unpublished') return b.isActive === false;
    return true;
  });

  // Handle triggered add from Admin dashboard quick action
  useEffect(() => {
    if (initialOpenAdd) {
      handleOpenAdd();
      if (onResetInitialOpenAdd) onResetInitialOpenAdd();
    }
  }, [initialOpenAdd]);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: `Harwalkart Hero Banner ${sortedBanners.length + 1}`,
      subtitle: 'Pure Authentic Products with Transparent Packaging and Fast Pan-India Delivery',
      badgeText: 'New Launch',
      brandTag: 'KitchenShakti',
      buttonText: 'Explore Now',
      linkUrl: '/brand/kitchen-shakti',
      imageUrl: '/banners/harwalkart-kitchenshakthi.svg',
      mobileImageUrl: '',
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
      subtitle: banner.subtitle || '',
      badgeText: banner.badgeText || '',
      brandTag: banner.brandTag || 'KitchenShakti',
      buttonText: banner.buttonText || 'Explore Now',
      linkUrl: banner.linkUrl || banner.buttonLink || '/products',
      imageUrl: banner.imageUrl || '',
      mobileImageUrl: banner.mobileImageUrl || '',
      priority: banner.priority || 1,
      isActive: banner.isActive !== false,
    });
    setPreviewError(false);
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset: typeof CURATED_BANNER_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      title: preset.title,
      subtitle: preset.subtitle,
      badgeText: preset.badgeText,
      brandTag: preset.brandTag,
      buttonText: preset.buttonText,
      linkUrl: preset.linkUrl,
      imageUrl: preset.imageUrl,
    }));
    setPreviewError(false);
    showToast(`Applied preset: ${preset.badgeText}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      showToast('Please upload or provide a banner image URL.');
      return;
    }

    if (editingBanner) {
      updateHeroBanner(editingBanner.id, {
        title: formData.title.trim() || 'Hero Banner',
        subtitle: formData.subtitle.trim(),
        badgeText: formData.badgeText.trim(),
        brandTag: formData.brandTag.trim(),
        buttonText: formData.buttonText.trim(),
        linkUrl: formData.linkUrl.trim(),
        buttonLink: formData.linkUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        mobileImageUrl: formData.mobileImageUrl.trim() || undefined,
        priority: Number(formData.priority) || 1,
        isActive: formData.isActive,
      });
      showToast(`Banner "${formData.title}" updated successfully!`);
    } else {
      addHeroBanner({
        title: formData.title.trim() || `Banner ${sortedBanners.length + 1}`,
        subtitle: formData.subtitle.trim(),
        badgeText: formData.badgeText.trim(),
        brandTag: formData.brandTag.trim(),
        buttonText: formData.buttonText.trim(),
        linkUrl: formData.linkUrl.trim(),
        buttonLink: formData.linkUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        mobileImageUrl: formData.mobileImageUrl.trim() || undefined,
        priority: Number(formData.priority) || sortedBanners.length + 1,
        isActive: formData.isActive,
        createdAt: new Date().toISOString().split('T')[0],
      });
      showToast(`New hero banner "${formData.title}" added to carousel!`);
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
    showToast(`Banner order updated (#${targetPriority} ⇄ #${currentPriority})`);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-950">Hero Banner Management</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {heroBanners.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Add, update, re-order, and publish flagship banners displayed directly on the homepage carousel.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                statusFilter === 'all' ? 'bg-white shadow-2xs text-slate-950 font-black' : 'text-slate-600'
              }`}
            >
              All ({sortedBanners.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                statusFilter === 'published' ? 'bg-white shadow-2xs text-emerald-700 font-black' : 'text-slate-600'
              }`}
            >
              Live ({sortedBanners.filter((b) => b.isActive !== false).length})
            </button>
            <button
              onClick={() => setStatusFilter('unpublished')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                statusFilter === 'unpublished' ? 'bg-white shadow-2xs text-slate-700 font-black' : 'text-slate-600'
              }`}
            >
              Drafts ({sortedBanners.filter((b) => b.isActive === false).length})
            </button>
          </div>

          {/* Reset Flagship Defaults Button */}
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
                showToast('Default flagship banners restored!');
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
            id="admin-add-hero-banner-btn"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Hero Banner</span>
          </button>
        </div>
      </div>

      {/* Banner List */}
      <div className="space-y-3">
        {filteredBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              banner.isActive !== false
                ? 'bg-slate-50/80 border-slate-200 hover:border-amber-400'
                : 'bg-slate-100/60 border-slate-200 opacity-70'
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
                  title="Move Up in slide order"
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
                  title="Move Down in slide order"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Banner Image Preview Container */}
              <div className="relative w-40 sm:w-48 h-20 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-900 flex items-center justify-center shadow-xs">
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Banner'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {banner.badgeText && (
                  <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm shadow-xs">
                    {banner.badgeText}
                  </span>
                )}
              </div>

              {/* Banner Info */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-slate-950 text-sm truncate">
                    {banner.title || `Hero Banner #${banner.priority || index + 1}`}
                  </h4>
                  {banner.brandTag && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 shrink-0">
                      {banner.brandTag}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      banner.isActive !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {banner.isActive !== false ? 'Live on Home' : 'Draft / Off'}
                  </span>
                </div>

                {banner.subtitle && (
                  <p className="text-slate-600 text-xs line-clamp-1">
                    {banner.subtitle}
                  </p>
                )}

                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  {(banner.linkUrl || banner.buttonLink) && (
                    <div className="flex items-center gap-1 text-amber-700 font-semibold truncate">
                      <Link className="w-3 h-3 shrink-0" />
                      <span className="truncate">Destination: {banner.linkUrl || banner.buttonLink}</span>
                    </div>
                  )}
                  {banner.mobileImageUrl && (
                    <div className="flex items-center gap-1 text-sky-700 shrink-0">
                      <Smartphone className="w-3 h-3 shrink-0" />
                      <span>Mobile Banner Active</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              {/* Publish / Unpublish Toggle */}
              <button
                onClick={() => {
                  toggleHeroBannerStatus(banner.id);
                  showToast(
                    banner.isActive !== false
                      ? `"${banner.title}" unpublished from homepage`
                      : `"${banner.title}" is now LIVE on homepage`
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  banner.isActive !== false
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
                title="Publish / Unpublish"
              >
                {banner.isActive !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{banner.isActive !== false ? 'Published' : 'Draft'}</span>
              </button>

              {/* Edit / Update Banner */}
              <button
                onClick={() => handleOpenEdit(banner)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Edit / Update Banner"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              {/* Delete Banner */}
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete banner "${banner.title || 'this banner'}"?`)) {
                    deleteHeroBanner(banner.id);
                    showToast('Banner deleted successfully');
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

        {filteredBanners.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-700 text-sm">No Hero Banners Found</div>
            <p className="text-xs text-slate-500">
              {statusFilter !== 'all'
                ? `No banners match the "${statusFilter}" filter.`
                : 'Add a hero banner image to showcase on the Harwalkart Homepage carousel.'}
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 cursor-pointer shadow-xs"
            >
              + Add New Hero Banner
            </button>
          </div>
        )}
      </div>

      {/* ================= ADD / EDIT BANNER MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-950 text-base">
                    {editingBanner ? 'Update Hero Banner' : 'Add New Hero Banner'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure graphics, links, tags, and display priority for homepage carousel.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick 1-Click Curated Presets Selection */}
            <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Curated Flagship &amp; Campaign Presets (1-Click Fill)</span>
                </span>
                <span className="text-[10px] text-amber-800 font-bold">Click any preset to apply</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CURATED_BANNER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 bg-white rounded-xl border border-amber-200/70 hover:border-amber-500 hover:shadow-2xs text-left transition cursor-pointer group"
                  >
                    <div className="text-[11px] font-black text-slate-900 group-hover:text-amber-700 truncate">
                      {preset.badgeText}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {preset.brandTag}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* 1. Upload Banner Image */}
              <ImageUploadField
                label="Primary Banner Image (Desktop / High-Res) *"
                sublabel="Upload SVG, WebP, PNG, or JPG banner graphic (1600x600 recommended). Image displays exactly as uploaded."
                value={formData.imageUrl}
                onChange={(url) => {
                  setFormData({ ...formData, imageUrl: url });
                  setPreviewError(false);
                }}
                role="admin"
                imageType="banner"
                folder="banners"
                required
                helpNote="The uploaded banner displays crisp and uncropped across modern desktop and tablet viewports."
              />

              {/* 2. Banner Live Preview */}
              {formData.imageUrl && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Live Graphic Preview:
                    </label>
                    <span className="text-[10px] text-slate-500">Scale: 100% container responsive</span>
                  </div>
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center p-1 relative">
                    {!previewError ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        onError={() => setPreviewError(true)}
                        className="w-full h-auto max-h-56 object-contain rounded-xl"
                      />
                    ) : (
                      <div className="py-8 text-center text-slate-400">
                        Image preview failed to load. Check URL or file format.
                      </div>
                    )}
                    {formData.badgeText && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
                        {formData.badgeText}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Optional Mobile Optimized Image */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mobile-Specific Banner Image URL (Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.mobileImageUrl}
                  onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                  placeholder="e.g. /banners/mobile-banner.webp or https://..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none"
                />
                <p className="text-[10px] text-slate-500">
                  If provided, mobile phone screens will load this vertical or compact aspect ratio image automatically.
                </p>
              </div>

              {/* 4. Title and Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. KitchenShakthi™ Pure Spices"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Badge Tagline (Pill)</label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="e.g. 100% PURE, NEW LAUNCH, FESTIVE SALE"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subtitle / Description</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Cold-Ground Salem Spices with High Active Curcumin & Essential Oils"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                />
              </div>

              {/* 5. Brand Tag & Destination Click Link */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Associated Brand</label>
                  <select
                    value={formData.brandTag}
                    onChange={(e) => setFormData({ ...formData, brandTag: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold"
                  >
                    <option value="KitchenShakti">KitchenShakti Spices</option>
                    <option value="NutriFlow">NutriFlow Pulses &amp; Nutrition</option>
                    <option value="RupaBhoom">RupaBhoom Ayurvedic Care</option>
                    <option value="GrahShorya">GrahShorya Hygiene</option>
                    <option value="All Brands">All Brands / Mega Store</option>
                    <option value="Local Kirana">Local Kirana Stores</option>
                    <option value="Festival Special">Festival Special</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Target Destination on Click</span>
                    <span className="text-[10px] text-amber-700 font-bold">Redirection route</span>
                  </label>
                  <select
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-medium"
                  >
                    <optgroup label="Official Brand Stores">
                      <option value="/brand/kitchen-shakti">KitchenShakthi Spices Brand Page</option>
                      <option value="/brand/nutriflow">NutriFlow Nutrition Brand Page</option>
                      <option value="/brand/rupabhoom">RupaBhoom Ayurvedic Care Page</option>
                      <option value="/brand/grahshorya">GrahShorya Hygiene Brand Page</option>
                    </optgroup>
                    <optgroup label="Marketplace Catalog & Stores">
                      <option value="/products">All Products Catalog</option>
                      <option value="/category/Kitchen%20Shakti%20Range">Kitchen Shakti Spices Category</option>
                      <option value="/category/Rice%20%26%20Pulses">Rice &amp; Pulses Category</option>
                      <option value="/category/Oils%20%26%20Ghee">Oils &amp; Pure Ghee Category</option>
                      <option value="/category/Dry%20Fruits%20%26%20Nuts">Dry Fruits Category</option>
                      <option value="/shops">Neighborhood Kirana Shops</option>
                      <option value="/video-shopping">Live Video Shopping</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* 6. Display Priority & Button Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Display Order / Priority *</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold"
                  />
                  <p className="text-[10px] text-slate-500">1 = First slide shown on Homepage</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Button Call-to-Action</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="e.g. Explore Collection, Shop Now"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* 7. Publish Toggle */}
              <div className="flex items-center gap-2 pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <input
                  type="checkbox"
                  id="admin-banner-publish"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded-sm cursor-pointer accent-amber-500"
                />
                <label
                  htmlFor="admin-banner-publish"
                  className="font-bold text-slate-800 cursor-pointer select-none"
                >
                  Publish this banner live on Homepage carousel
                </label>
              </div>

              {/* 8. Action Buttons */}
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
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xs cursor-pointer transition-all hover:scale-102"
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
