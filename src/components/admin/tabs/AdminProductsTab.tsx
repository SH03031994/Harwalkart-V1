import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Product } from '../../../types';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Store,
  Tag,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const AdminProductsTab: React.FC = () => {
  const {
    products,
    categories,
    sellers,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductApproval,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    category: categories[0]?.name || 'Kitchen Shakti Range',
    brand: 'Kitchen Shakti',
    price: 120,
    mrp: 150,
    unit: '500g Pack',
    stockQuantity: 50,
    description: '',
    sellerId: sellers[0]?.id || 'seller-hk-direct',
    isHarwalkartDirect: true,
    image: '',
    tags: 'spices, pure, grocery',
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      hindiName: '',
      category: categories[0]?.name || 'Kitchen Shakti Range',
      brand: 'Kitchen Shakti',
      price: 120,
      mrp: 150,
      unit: '500g Pack',
      stockQuantity: 50,
      description: '100% pure authentic spices manufactured directly.',
      sellerId: 'seller-hk-direct',
      isHarwalkartDirect: true,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60',
      tags: 'kitchen shakti, pure, masala, cooking',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setSelectedProduct(prod);
    setFormData({
      name: prod.name,
      hindiName: prod.hindiName || '',
      category: prod.category,
      brand: prod.brand,
      price: prod.price,
      mrp: prod.mrp || Math.round(prod.price * 1.25),
      unit: prod.unit,
      stockQuantity: prod.stockQuantity,
      description: prod.description,
      sellerId: prod.sellerId,
      isHarwalkartDirect: prod.isHarwalkartDirect,
      image: prod.images[0] || '',
      tags: prod.tags?.join(', ') || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const sel = sellers.find(s => s.id === formData.sellerId) || sellers[0];
    const discount = Math.max(0, Math.round(((formData.mrp - formData.price) / formData.mrp) * 100));

    addProduct({
      name: formData.name,
      hindiName: formData.hindiName,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: formData.brand,
      sellerId: sel.id,
      sellerName: sel.shopName,
      isHarwalkartDirect: formData.isHarwalkartDirect,
      category: formData.category,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      discountPercent: discount,
      inStock: Number(formData.stockQuantity) > 0,
      stockQuantity: Number(formData.stockQuantity),
      images: [formData.image],
      unit: formData.unit,
      description: formData.description,
      serviceablePincodes: ['*'],
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      approved: true,
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const discount = Math.max(0, Math.round(((formData.mrp - formData.price) / formData.mrp) * 100));

    updateProduct(selectedProduct.id, {
      name: formData.name,
      hindiName: formData.hindiName,
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      discountPercent: discount,
      unit: formData.unit,
      stockQuantity: Number(formData.stockQuantity),
      inStock: Number(formData.stockQuantity) > 0,
      description: formData.description,
      images: [formData.image],
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Marketplace Catalog & Products</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {products.length} Items Listed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Harwalkart direct inventory, merchant listings, pricing, and live approval statuses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, shop or brand..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(prod => (
          <div
            key={prod.id}
            className="p-4 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 text-xs transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <img
                  src={prod.images[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&auto=format&fit=crop&q=60'}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">{prod.category}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                        prod.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prod.approved ? 'Live' : 'Pending'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 truncate text-xs">{prod.name}</h4>
                  <p className="text-slate-500 text-[11px] truncate">Store: {prod.sellerName}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-base font-black text-slate-950">₹{prod.price}</span>
                {prod.mrp > prod.price && (
                  <span className="text-slate-400 line-through text-[11px]">₹{prod.mrp}</span>
                )}
                <span className="text-slate-500 text-[11px]">/ {prod.unit}</span>
                <span className="ml-auto text-[11px] font-bold text-slate-700">Stock: {prod.stockQuantity}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                onClick={() => toggleProductApproval(prod.id)}
                className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                  prod.approved
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {prod.approved ? 'Unpublish' : 'Approve'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(prod)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  title="Edit Product"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete product "${prod.name}"?`)) {
                      deleteProduct(prod.id);
                    }
                  }}
                  className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 cursor-pointer"
                  title="Delete Product"
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
            className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950">
                {isAddModalOpen ? 'Create New Marketplace Product' : `Edit Product: ${selectedProduct?.name}`}
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
                <label className="font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. Kitchen Shakti Turmeric Powder 500g"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hindi / Regional Name</label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={e => setFormData({ ...formData, hindiName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    placeholder="e.g. शुद्ध हल्दी पाउडर"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Selling Store / Merchant</label>
                  <select
                    value={formData.sellerId}
                    onChange={e => setFormData({ ...formData, sellerId: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    {sellers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.shopName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={e => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={e => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Unit / Pack Size</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    placeholder="e.g. 500g, 1 Kg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Search Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    placeholder="masala, spice, pure"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
              >
                {isAddModalOpen ? 'Add Product' : 'Save Changes'}
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
