import React, { useState, useRef } from 'react';
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
  Layers,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ImageUploadField } from '../../common/ImageUploadField';
import { uploadImageFile } from '../../../utils/imageUpload';

export const AdminProductsTab: React.FC = () => {
  const {
    products,
    categories,
    brands,
    sellers,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductApproval,
    toggleProductPublish,
    toggleProductActive,
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
    brandId: 'brand_kitchen_shakti',
    brandSlug: 'kitchen-shakti',
    price: 120,
    mrp: 150,
    unit: '500g Pack',
    stockQuantity: 50,
    description: '',
    sellerId: sellers[0]?.id || 'seller-hk-direct',
    isHarwalkartDirect: true,
    image: '',
    transparentPackagingImage: '',
    additionalImages: [] as string[],
    tags: 'spices, pure, grocery',
  });

  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

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
    const defaultBrand = brands[0] || { name: 'Kitchen Shakti', id: 'brand_kitchen_shakti', slug: 'kitchen-shakti' };
    setFormData({
      name: '',
      hindiName: '',
      category: categories[0]?.name || 'Kitchen Shakti Range',
      brand: defaultBrand.name,
      brandId: defaultBrand.id,
      brandSlug: defaultBrand.slug,
      price: 120,
      mrp: 150,
      unit: '500g Pack',
      stockQuantity: 50,
      description: '100% pure authentic products manufactured under Harwalkart parent marketplace.',
      sellerId: 'seller-hk-direct',
      isHarwalkartDirect: true,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60',
      transparentPackagingImage: '',
      additionalImages: [],
      tags: 'pure, authentic, harwalkart',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setSelectedProduct(prod);
    const extraImgs = prod.additionalImages && prod.additionalImages.length > 0
      ? prod.additionalImages
      : prod.images && prod.images.length > 1
      ? prod.images.slice(1)
      : [];

    setFormData({
      name: prod.name,
      hindiName: prod.hindiName || '',
      category: prod.category,
      brand: prod.brand,
      brandId: prod.brandId || '',
      brandSlug: prod.brandSlug || '',
      price: prod.price,
      mrp: prod.mrp || Math.round(prod.price * 1.25),
      unit: prod.unit,
      stockQuantity: prod.stockQuantity,
      description: prod.description,
      sellerId: prod.sellerId,
      isHarwalkartDirect: prod.isHarwalkartDirect,
      image: prod.productImage || prod.images[0] || '',
      transparentPackagingImage: prod.transparentPackagingImage || prod.packagingImage || '',
      additionalImages: extraImgs,
      tags: prod.tags?.join(', ') || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUploadAdditional = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAdditional(true);
    const res = await uploadImageFile(file, {
      role: 'admin',
      imageType: 'additional',
      folder: 'products',
    });
    setIsUploadingAdditional(false);

    if (res.success && res.url) {
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, res.url],
      }));
      showToast('Additional image added to gallery.');
    } else {
      showToast(res.error || 'Failed to upload additional image.');
    }

    if (additionalFileInputRef.current) {
      additionalFileInputRef.current.value = '';
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleMakePrimaryAdditional = (index: number) => {
    const chosen = formData.additionalImages[index];
    const prevPrimary = formData.image;
    const rest = formData.additionalImages.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      image: chosen,
      additionalImages: prevPrimary ? [prevPrimary, ...rest] : rest,
    }));
    showToast('Main product image updated.');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      showToast('Please upload or select a main product image.');
      return;
    }

    const sel = sellers.find(s => s.id === formData.sellerId) || sellers[0];
    const discount = Math.max(0, Math.round(((formData.mrp - formData.price) / formData.mrp) * 100));

    // Match brand slug from brands list
    const matchedBrand = brands.find(b => b.name.toLowerCase() === formData.brand.toLowerCase() || b.id === formData.brandId);

    const allImages = [formData.image, ...(formData.additionalImages || [])].filter(Boolean);

    addProduct({
      name: formData.name,
      hindiName: formData.hindiName,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: formData.brand,
      brandId: matchedBrand?.id || formData.brandId,
      brandSlug: matchedBrand?.slug || formData.brandSlug,
      sellerId: sel.id,
      sellerName: sel.shopName,
      isHarwalkartDirect: formData.isHarwalkartDirect,
      category: formData.category,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      discountPercent: discount,
      inStock: Number(formData.stockQuantity) > 0,
      stockQuantity: Number(formData.stockQuantity),
      images: allImages.length > 0 ? allImages : [formData.image],
      productImage: formData.image,
      transparentPackagingImage: formData.transparentPackagingImage.trim() || undefined,
      packagingImage: formData.transparentPackagingImage.trim() || undefined,
      additionalImages: formData.additionalImages,
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
    if (!formData.image.trim()) {
      showToast('Please upload or select a main product image.');
      return;
    }

    const discount = Math.max(0, Math.round(((formData.mrp - formData.price) / formData.mrp) * 100));
    const matchedBrand = brands.find(b => b.name.toLowerCase() === formData.brand.toLowerCase() || b.id === formData.brandId);
    const allImages = [formData.image, ...(formData.additionalImages || [])].filter(Boolean);

    updateProduct(selectedProduct.id, {
      name: formData.name,
      hindiName: formData.hindiName,
      brand: formData.brand,
      brandId: matchedBrand?.id || formData.brandId,
      brandSlug: matchedBrand?.slug || formData.brandSlug,
      category: formData.category,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      discountPercent: discount,
      unit: formData.unit,
      stockQuantity: Number(formData.stockQuantity),
      inStock: Number(formData.stockQuantity) > 0,
      description: formData.description,
      images: allImages.length > 0 ? allImages : [formData.image],
      productImage: formData.image,
      transparentPackagingImage: formData.transparentPackagingImage.trim() || undefined,
      packagingImage: formData.transparentPackagingImage.trim() || undefined,
      additionalImages: formData.additionalImages,
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
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                          !prod.isDraft && prod.isPublished !== false && prod.approved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {!prod.isDraft && prod.isPublished !== false ? 'Live' : 'Draft'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          prod.isActive !== false ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {prod.isActive !== false ? 'Active' : 'Off'}
                      </span>
                    </div>
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

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleProductPublish(prod.id, prod.isDraft || prod.isPublished === false)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                    !prod.isDraft && prod.isPublished !== false
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {!prod.isDraft && prod.isPublished !== false ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => toggleProductActive(prod.id, !(prod.isActive !== false))}
                  className={`px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer ${
                    prod.isActive !== false ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {prod.isActive !== false ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div className="flex items-center gap-1">
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
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Brand *</label>
                    <span className="text-[10px] text-amber-800 font-extrabold">Harwalkart Brand</span>
                  </div>
                  <select
                    value={formData.brand}
                    onChange={e => {
                      const selectedB = brands.find(b => b.name === e.target.value);
                      if (selectedB) {
                        setFormData({
                          ...formData,
                          brand: selectedB.name,
                          brandId: selectedB.id,
                          brandSlug: selectedB.slug,
                          category: selectedB.category,
                          isHarwalkartDirect: true,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          brand: e.target.value,
                          brandId: '',
                          brandSlug: '',
                        });
                      }
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-amber-50/50 font-bold text-slate-900"
                  >
                    <optgroup label="Official Harwalkart Brands">
                      {brands.map(b => (
                        <option key={b.id} value={b.name}>
                          {b.name} ({b.category})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other / Local Merchant">
                      <option value="Local Merchant Brand">Local Merchant Brand</option>
                      <option value="Amul">Amul</option>
                      <option value="Tata">Tata</option>
                      <option value="India Gate">India Gate</option>
                      <option value="Patanjali">Patanjali</option>
                      <option value="Fortune">Fortune</option>
                    </optgroup>
                  </select>
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

              {/* Image Upload Section */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Product Images & Transparent Packaging</span>
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Persistent Storage Active
                  </span>
                </div>

                {/* 1. Main Product Image */}
                <ImageUploadField
                  label="1. Main Product Image"
                  sublabel="Primary photo displayed on search results and product listings"
                  value={formData.image}
                  onChange={url => setFormData({ ...formData, image: url })}
                  role="admin"
                  imageType="main"
                  folder="products"
                  required
                />

                {/* 2. Transparent Packaging Image */}
                <ImageUploadField
                  label="2. Transparent Packaging Image"
                  sublabel="Direct photo showing clear stand-up pouch / see-through packaging for 100% customer trust"
                  value={formData.transparentPackagingImage}
                  onChange={url => setFormData({ ...formData, transparentPackagingImage: url })}
                  role="admin"
                  imageType="packaging"
                  folder="products"
                  helpNote="Recommended: Clear packaging view showing actual food/grain purity inside."
                />

                {/* 3. Additional Gallery Images */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800">
                        3. Additional Product Images ({formData.additionalImages.length})
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Upload extra photos (nutrition table, back of pouch, FSSAI seal, certificates)
                      </p>
                    </div>

                    <div>
                      <input
                        ref={additionalFileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleUploadAdditional}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => additionalFileInputRef.current?.click()}
                        disabled={isUploadingAdditional}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl cursor-pointer transition disabled:opacity-50"
                      >
                        {isUploadingAdditional ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Upload Extra Image</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {formData.additionalImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                      {formData.additionalImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 p-1">
                            <button
                              type="button"
                              onClick={() => handleMakePrimaryAdditional(idx)}
                              className="px-1.5 py-0.5 bg-amber-400 text-slate-950 font-bold text-[9px] rounded cursor-pointer"
                              title="Make this the primary image"
                            >
                              Make Main
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalImage(idx)}
                              className="p-1 bg-rose-600 text-white rounded cursor-pointer hover:bg-rose-500"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
