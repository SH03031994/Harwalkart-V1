import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CategoryItem } from '../../../types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Tag,
  Percent,
} from 'lucide-react';

export const AdminCategoriesTab: React.FC = () => {
  const { categories, products, addCategory, editCategory, deleteCategory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '🛒',
    commissionRate: 2.5,
    description: '',
    image: '',
    isActive: true,
  });

  const filteredCategories = categories.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      slug: '',
      icon: '🛒',
      commissionRate: 2.5,
      description: 'Essential items for everyday household consumption.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=60',
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '🛒',
      commissionRate: cat.commissionRate,
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCategory({
      name: formData.name,
      slug: formData.slug || generatedSlug,
      icon: formData.icon,
      commissionRate: Number(formData.commissionRate),
      description: formData.description,
      image: formData.image,
      isActive: formData.isActive,
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    editCategory(selectedCategory.id, {
      name: formData.name,
      slug: formData.slug,
      icon: formData.icon,
      commissionRate: Number(formData.commissionRate),
      description: formData.description,
      image: formData.image,
      isActive: formData.isActive,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Marketplace Categories & Commission Rates</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure product catalog taxonomies, standard marketplace commission %, and display icons.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map(cat => {
          const productCount = products.filter(
            p => p.category.toLowerCase() === cat.name.toLowerCase() || p.category.includes(cat.name)
          ).length;

          return (
            <div
              key={cat.id}
              className="p-5 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 text-xs transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{cat.icon || '🏷️'}</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{cat.name}</h4>
                      <span className="text-slate-500 text-[11px] font-medium">{productCount} Products Listed</span>
                    </div>
                  </div>

                  <span className="bg-amber-100 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full shrink-0">
                    {cat.commissionRate}%
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] line-clamp-2">
                  {cat.description || 'Standard category for customer discovery and vendor listing.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-slate-500">
                <span className="text-[10px] font-bold uppercase">Commission Rate</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${cat.name}"? Existing products will remain.`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950">
                {isAddModalOpen ? 'Create New Category' : `Edit Category: ${selectedCategory?.name}`}
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
                <label className="font-bold text-slate-700">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. Dry Fruits & Nuts"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Icon Emoji</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-center text-base"
                    placeholder="🌶️"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Commission Rate (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.commissionRate}
                    onChange={e => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    placeholder="e.g. 2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="Category explanation for customers & sellers"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
              >
                {isAddModalOpen ? 'Create Category' : 'Save Changes'}
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
