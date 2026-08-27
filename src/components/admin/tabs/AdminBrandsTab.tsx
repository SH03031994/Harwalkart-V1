import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Brand } from '../../../types';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Package,
  Layers,
  Check,
  X,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export const AdminBrandsTab: React.FC = () => {
  const {
    brands,
    addBrand,
    updateBrand,
    deleteBrand,
    toggleBrandStatus,
    products,
    navigateToBrand,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    slug: '',
    category: '',
    tagline: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    themeColor: '#F59E0B',
    isActive: true,
  });

  const filteredBrands = brands.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.tagline?.toLowerCase().includes(q) ||
      b.hindiName?.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      hindiName: '',
      slug: '',
      category: 'Food, Grocery & Nutrition Products',
      tagline: '',
      description: '',
      logoUrl: '/file_0000000030047209a8264aa7122a27ff.png',
      bannerUrl: '',
      themeColor: '#F59E0B',
      isActive: true,
    });
    setEditingBrand(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      hindiName: brand.hindiName || '',
      slug: brand.slug,
      category: brand.category,
      tagline: brand.tagline,
      description: brand.description,
      logoUrl: brand.logoUrl,
      bannerUrl: brand.bannerUrl || '',
      themeColor: brand.themeColor || '#F59E0B',
      isActive: brand.isActive,
    });
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category.trim()) return;

    const autoSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/™/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        ...formData,
        slug: autoSlug,
      });
    } else {
      addBrand({
        ...formData,
        slug: autoSlug,
      });
    }

    setIsAddModalOpen(false);
    setEditingBrand(null);
  };

  const handleDelete = (brand: Brand) => {
    if (
      window.confirm(
        `Are you sure you want to delete brand "${brand.name}"? This action cannot be undone.`
      )
    ) {
      deleteBrand(brand.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
              Parent-Child Architecture
            </span>
            <span className="text-xs text-slate-500 font-bold">
              Harwalkart Marketplace
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
            Independent Brand Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Harwalkart's 4 independent flagship brands (KitchenShakti, NutriFlow, Rupabhoom™, GrahShorya™) and their assigned catalogs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-xs transition-transform hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Brand</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search brands by name, category, or tagline..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="text-xs font-bold text-slate-600">
          Showing <span className="text-slate-950 font-black">{filteredBrands.length}</span> Brands
        </div>
      </div>

      {/* Brands Cards / Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBrands.map(brand => {
          const brandProducts = products.filter(
            p => p.brandSlug === brand.slug || p.brandId === brand.id || p.brand.toLowerCase() === brand.name.toLowerCase()
          );

          return (
            <div
              key={brand.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Official Brand Logo Box */}
                    <div className="w-20 h-16 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={brand.logoUrl}
                        alt={`${brand.name} Logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-black text-slate-950">
                          {brand.name}
                        </h3>
                        {brand.hindiName && (
                          <span className="text-xs font-bold text-amber-800">
                            ({brand.hindiName})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 block">
                        Slug: <code className="bg-slate-100 px-1 py-0.5 rounded-sm">{brand.slug}</code>
                      </span>
                      <span className="inline-block mt-1 bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        {brand.category}
                      </span>
                    </div>
                  </div>

                  {/* Active / Inactive Status Switch */}
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => toggleBrandStatus(brand.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 transition-colors cursor-pointer ${
                        brand.isActive
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                      }`}
                    >
                      {brand.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-rose-700" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] font-bold text-slate-500 mt-1">
                      {brandProducts.length} mapped products
                    </span>
                  </div>
                </div>

                {/* Tagline & Description */}
                <div className="mt-3 bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1">
                  <div className="font-bold text-slate-800 italic">
                    "{brand.tagline}"
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                    {brand.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => navigateToBrand(brand.slug)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Brand Page</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(brand)}
                    className="p-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-xl transition-colors cursor-pointer"
                    title="Edit Brand Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(brand)}
                    className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-xl transition-colors cursor-pointer"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-950">
                {editingBrand ? `Edit Brand: ${editingBrand.name}` : 'Register New Brand under Harwalkart'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rupabhoom™"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Hindi Name
                  </label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={e => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. रूपभूम™"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. rupabhoom"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Beauty, Personal Care & Wellness Products"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Pure Herbal Radiance & Ayurvedic Wellness Care"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Official Logo Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.logoUrl}
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="Official logo image path"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400"
                />
                {formData.logoUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500">Logo Preview:</span>
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="h-10 w-24 object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Theme Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.themeColor}
                    onChange={e => setFormData({ ...formData, themeColor: e.target.value })}
                    className="w-10 h-8 rounded-lg cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={formData.themeColor}
                    onChange={e => setFormData({ ...formData, themeColor: e.target.value })}
                    className="w-32 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brand Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the brand's quality philosophy, sourcing and product range..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="brandActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded-md focus:ring-amber-400 cursor-pointer"
                />
                <label htmlFor="brandActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Brand is Active & Published on Harwalkart Marketplace
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {editingBrand ? 'Save Changes' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
