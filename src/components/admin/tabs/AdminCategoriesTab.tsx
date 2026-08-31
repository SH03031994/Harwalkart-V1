import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CategoryItem, SubCategoryItem } from '../../../types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Tag,
  Percent,
  ChevronDown,
  ChevronUp,
  FolderTree,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AdminCategoriesTab: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    editCategory,
    deleteCategory,
    addSubCategory,
    editSubCategory,
    deleteSubCategory,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Category Modals
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // SubCategory Modals
  const [activeParentCategory, setActiveParentCategory] = useState<CategoryItem | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryItem | null>(null);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [isEditSubModalOpen, setIsEditSubModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '🛒',
    commissionRate: 2.5,
    description: '',
    image: '',
    isActive: true,
  });

  const [subFormData, setSubFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  const filteredCategories = categories.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.subCategories?.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Category Actions
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

  // SubCategory Actions
  const handleOpenAddSub = (cat: CategoryItem) => {
    setActiveParentCategory(cat);
    setSubFormData({
      name: '',
      slug: '',
      description: '',
      isActive: true,
    });
    setIsAddSubModalOpen(true);
  };

  const handleOpenEditSub = (cat: CategoryItem, sub: SubCategoryItem) => {
    setActiveParentCategory(cat);
    setSelectedSubCategory(sub);
    setSubFormData({
      name: sub.name,
      slug: sub.slug,
      description: sub.description || '',
      isActive: sub.isActive !== undefined ? sub.isActive : true,
    });
    setIsEditSubModalOpen(true);
  };

  const handleSaveAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParentCategory) return;
    const generatedSlug = subFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addSubCategory(activeParentCategory.id, {
      name: subFormData.name,
      slug: subFormData.slug || generatedSlug,
      categoryName: activeParentCategory.name,
      description: subFormData.description,
      isActive: subFormData.isActive,
    });
    // Ensure expanded
    setExpandedCategories(prev => ({ ...prev, [activeParentCategory.id]: true }));
    setIsAddSubModalOpen(false);
  };

  const handleSaveEditSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParentCategory || !selectedSubCategory) return;
    editSubCategory(activeParentCategory.id, selectedSubCategory.id, {
      name: subFormData.name,
      slug: subFormData.slug,
      description: subFormData.description,
      isActive: subFormData.isActive,
    });
    setIsEditSubModalOpen(false);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Marketplace Categories & Sub-Categories</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage hierarchical taxonomy (Brand &rarr; Category &rarr; Sub-category &rarr; Product) and commission rates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories or sub-categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {filteredCategories.map(cat => {
          const catProducts = products.filter(
            p => p.category.toLowerCase() === cat.name.toLowerCase() || p.category.includes(cat.name)
          );
          const isExpanded = expandedCategories[cat.id] ?? true;
          const subCats = cat.subCategories || [];

          return (
            <div
              key={cat.id}
              className="bg-slate-50 hover:bg-slate-50/90 rounded-2xl border border-slate-200 overflow-hidden transition-all text-xs"
            >
              {/* Category Bar */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                    {cat.icon || '🏷️'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">{cat.name}</h4>
                      <span className="bg-amber-100 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                        {cat.commissionRate}% Commission
                      </span>
                      <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {subCats.length} Sub-Categories
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {cat.description || 'Standard marketplace catalog category.'} &bull; <strong className="text-slate-700">{catProducts.length} Products</strong> Listed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleOpenAddSub(cat)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sub-Category</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer"
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
                    className="p-2 hover:bg-rose-100 rounded-xl text-rose-600 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer"
                    title={isExpanded ? 'Collapse Sub-Categories' : 'Expand Sub-Categories'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sub-Categories Accordion Content */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <FolderTree className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sub-Categories under {cat.name} ({subCats.length})</span>
                    </span>
                  </div>

                  {subCats.length === 0 ? (
                    <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                      No sub-categories defined yet. Click <strong>"Add Sub-Category"</strong> to create structured classifications.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {subCats.map(sub => {
                        const subProdCount = products.filter(
                          p => p.subCategory?.toLowerCase() === sub.name.toLowerCase()
                        ).length;

                        return (
                          <div
                            key={sub.id}
                            className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs hover:border-amber-300 transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 text-xs truncate">
                                {sub.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {subProdCount} products &bull; {sub.slug}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleOpenEditSub(cat, sub)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                                title="Edit Sub-Category"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete sub-category "${sub.name}"?`)) {
                                    deleteSubCategory(cat.id, sub.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 cursor-pointer"
                                title="Delete Sub-Category"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= ADD / EDIT CATEGORY MODAL ================= */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950">
                {isAddModalOpen ? 'Create New Marketplace Category' : `Edit Category: ${selectedCategory?.name}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
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
                  placeholder="e.g. Dry Fruits & Superfoods"
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
                  placeholder="Category explanation for customers & vendors"
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

      {/* ================= ADD / EDIT SUBCATEGORY MODAL ================= */}
      {(isAddSubModalOpen || isEditSubModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={isAddSubModalOpen ? handleSaveAddSub : handleSaveEditSub}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  Under {activeParentCategory?.name}
                </span>
                <h3 className="text-base font-black text-slate-950 mt-1">
                  {isAddSubModalOpen ? 'Add Sub-Category' : `Edit: ${selectedSubCategory?.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddSubModalOpen(false);
                  setIsEditSubModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sub-Category Name *</label>
                <input
                  type="text"
                  required
                  value={subFormData.name}
                  onChange={e => setSubFormData({ ...subFormData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. Cold Pressed Groundnut Oils"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Slug (Optional)</label>
                <input
                  type="text"
                  value={subFormData.slug}
                  onChange={e => setSubFormData({ ...subFormData, slug: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-slate-600"
                  placeholder="e.g. cold-pressed-groundnut-oils"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={subFormData.description}
                  onChange={e => setSubFormData({ ...subFormData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="Brief description for classification"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
              >
                {isAddSubModalOpen ? 'Save Sub-Category' : 'Update Sub-Category'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddSubModalOpen(false);
                  setIsEditSubModalOpen(false);
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
