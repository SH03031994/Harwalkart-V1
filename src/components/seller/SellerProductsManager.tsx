import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller, Product } from '../../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
  Tag,
  Eye,
  Percent,
  X,
  Upload,
  Layers,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';
import { uploadImageFile } from '../../utils/imageUpload';

interface SellerProductsManagerProps {
  seller: Seller;
  onNavigateToAddProduct: () => void;
}

const CATEGORIES = [
  'All',
  'Grocery & Staples',
  'Spices & Masalas',
  'Oils & Ghee',
  'Atta & Flours',
  'Rice & Pulses',
  'Dry Fruits & Nuts',
  'Beverages & Tea',
  'Snacks & Namkeen',
  'Personal Care',
  'Household Essentials',
];

export const SellerProductsManager: React.FC<SellerProductsManagerProps> = ({
  seller,
  onNavigateToAddProduct,
}) => {
  const { products, updateProduct, deleteProduct, showToast } = useApp();

  // Filter products owned STRICTLY by this seller
  const sellerProducts = products.filter(p => p.sellerId === seller.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editMrp, setEditMrp] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editUnit, setEditUnit] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  // Real persistent image states for edit
  const [editMainImage, setEditMainImage] = useState('');
  const [editTransparentPackaging, setEditTransparentPackaging] = useState('');
  const [editAdditionalImages, setEditAdditionalImages] = useState<string[]>([]);
  const [isUploadingEditAdditional, setIsUploadingEditAdditional] = useState(false);
  const editAdditionalFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Modal State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Filter list
  const filteredProducts = sellerProducts.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(p.category.toLowerCase());

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && p.inStock && p.stockQuantity > 0) ||
      (stockFilter === 'out_of_stock' && (!p.inStock || p.stockQuantity === 0));

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    // Strict ownership verification
    if (product.sellerId !== seller.id) {
      showToast('Unauthorized: You can only edit your own shop products.');
      return;
    }

    setEditingProduct(product);
    setEditName(product.name);
    setEditBrand(product.brand);
    setEditCategory(product.category);
    setEditPrice(product.price);
    setEditMrp(product.mrp);
    setEditStock(product.stockQuantity);
    setEditUnit(product.unit || '1 unit');
    setEditSku(product.sku || `HK-SKU-${product.id.slice(-4)}`);
    setEditDescription(product.description || '');
    
    const extraImgs = product.additionalImages && product.additionalImages.length > 0
      ? [...product.additionalImages]
      : (product.images && product.images.length > 1 ? product.images.slice(1) : []);

    setEditMainImage(product.productImage || (product.images && product.images[0]) || '');
    setEditTransparentPackaging(product.transparentPackagingImage || product.packagingImage || '');
    setEditAdditionalImages(extraImgs);
  };

  const handleUploadEditAdditional = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingEditAdditional(true);
    const res = await uploadImageFile(file, {
      role: 'seller',
      sellerId: seller.id,
      imageType: 'additional',
      folder: 'products',
    });
    setIsUploadingEditAdditional(false);

    if (res.success && res.url) {
      setEditAdditionalImages(prev => [...prev, res.url]);
      showToast('Additional image uploaded to gallery.');
    } else {
      showToast(res.error || 'Failed to upload additional image.');
    }

    if (editAdditionalFileInputRef.current) {
      editAdditionalFileInputRef.current.value = '';
    }
  };

  const handleRemoveEditAdditional = (index: number) => {
    setEditAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryEdit = (index: number) => {
    const selected = editAdditionalImages[index];
    const prevMain = editMainImage;
    const rest = editAdditionalImages.filter((_, i) => i !== index);
    setEditMainImage(selected);
    setEditAdditionalImages(prevMain ? [prevMain, ...rest] : rest);
    showToast('Main product image updated.');
  };

  // Save Edit Changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editName.trim()) {
      showToast('Product name is required.');
      return;
    }
    if (editPrice <= 0 || editMrp <= 0) {
      showToast('Please enter valid Price and MRP.');
      return;
    }
    if (!editMainImage.trim()) {
      showToast('Please upload or select a main product image.');
      return;
    }

    const calculatedDiscount = Math.max(0, Math.round(((editMrp - editPrice) / editMrp) * 100));
    const allImages = [editMainImage, ...editAdditionalImages].filter(Boolean);

    const success = updateProduct(
      editingProduct.id,
      {
        name: editName.trim(),
        brand: editBrand.trim() || seller.shopName,
        category: editCategory,
        price: editPrice,
        mrp: editMrp,
        discountPercent: calculatedDiscount,
        stockQuantity: editStock,
        inStock: editStock > 0,
        unit: editUnit,
        sku: editSku,
        description: editDescription.trim(),
        images: allImages.length > 0 ? allImages : [editMainImage],
        productImage: editMainImage,
        transparentPackagingImage: editTransparentPackaging.trim() || undefined,
        packagingImage: editTransparentPackaging.trim() || undefined,
        additionalImages: editAdditionalImages,
      },
      seller.id // strictly enforce ownership
    );

    if (success) {
      setEditingProduct(null);
      showToast('Product updated successfully with persistent images.');
    }
  };


  // Confirm and Execute Delete
  const handleConfirmDelete = () => {
    if (!deletingProduct) return;

    const success = deleteProduct(deletingProduct.id, seller.id);
    if (success) {
      setDeletingProduct(null);
    }
  };

  // Quick Stock Toggle
  const handleToggleStock = (product: Product) => {
    if (product.sellerId !== seller.id) return;
    const newInStock = !product.inStock;
    const newQty = newInStock ? (product.stockQuantity > 0 ? product.stockQuantity : 25) : 0;
    updateProduct(product.id, { inStock: newInStock, stockQuantity: newQty }, seller.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            My Products Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Managing <strong className="text-slate-900">{sellerProducts.length}</strong> items listed under{' '}
            <strong className="text-amber-700">{seller.shopName}</strong>
          </p>
        </div>

        <button
          onClick={onNavigateToAddProduct}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, brand, or SKU..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product List Table / Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xs text-center space-y-4">
          <Package className="w-12 h-12 mx-auto text-slate-300" />
          <div>
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {sellerProducts.length === 0
                ? 'Your store catalog is currently empty. Click "Add New Product" to start selling to customers across your area!'
                : 'No items matched your current search or category filter. Try clearing filters.'}
            </p>
          </div>
          {sellerProducts.length === 0 && (
            <button
              onClick={onNavigateToAddProduct}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Product Info</th>
                  <th className="py-3.5 px-4">Category & SKU</th>
                  <th className="py-3.5 px-4">Price & MRP</th>
                  <th className="py-3.5 px-4">Stock Qty</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map(p => {
                  const mainImage = p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80';
                  const imageCount = p.images ? p.images.length : 1;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img
                              src={mainImage}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {imageCount > 1 && (
                              <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-slate-900/80 text-white text-[8px] font-bold rounded">
                                +{imageCount - 1}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-black text-slate-900 text-xs block line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Brand: <strong>{p.brand}</strong> • {p.unit}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & SKU */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                          {p.category}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          {p.sku || `HK-${p.id.slice(-5)}`}
                        </span>
                      </td>

                      {/* Price & MRP */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900 text-sm">₹{p.price}</span>
                          {p.mrp > p.price && (
                            <span className="text-[10px] text-slate-400 line-through">₹{p.mrp}</span>
                          )}
                        </div>
                        {p.discountPercent > 0 && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
                            {p.discountPercent}% OFF
                          </span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              p.stockQuantity <= 5 ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            {p.stockQuantity} units
                          </span>
                        </div>
                      </td>

                      {/* Status & Quick Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                            p.inStock && p.stockQuantity > 0
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {p.inStock && p.stockQuantity > 0 ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Out of Stock
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action Buttons: Edit & Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Product"
                            className="p-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-xl transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(p)}
                            title="Delete Product"
                            className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-xl transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-base font-black text-slate-900">Edit Product Information</h3>
                <p className="text-xs text-slate-500">
                  Update catalog details for <strong>{editingProduct.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Category, Brand, Unit, SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={e => setEditBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Unit / Size / Weight *
                  </label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={e => setEditUnit(e.target.value)}
                    placeholder="e.g. 500g Pack, 1 Litre, 10kg"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={editSku}
                    onChange={e => setEditSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium font-mono"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editMrp}
                    onChange={e => setEditMrp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-emerald-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStock}
                    onChange={e => setEditStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              {/* Real Image Management */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Product Images & Packaging</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Update photos directly from camera/gallery with permanent server persistence
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Storage Connected
                  </span>
                </div>

                {/* 1. Primary Product Image */}
                <ImageUploadField
                  label="Primary Product Image (Cover photo) *"
                  sublabel="Main product view shown across the catalog and search results"
                  value={editMainImage}
                  onChange={url => setEditMainImage(url)}
                  role="seller"
                  sellerId={seller.id}
                  imageType="main"
                  folder="products"
                  required
                />

                {/* 2. Transparent Packaging Image */}
                <ImageUploadField
                  label="Transparent Packaging Photo (Optional)"
                  sublabel="Clear view of pouch or jar showing authentic grain/spice purity"
                  value={editTransparentPackaging}
                  onChange={url => setEditTransparentPackaging(url)}
                  role="seller"
                  sellerId={seller.id}
                  imageType="packaging"
                  folder="products"
                />

                {/* 3. Additional Gallery Images */}
                <div className="space-y-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Additional Gallery Photos ({editAdditionalImages.length})
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Angles, nutrition table, FSSAI seal, packaging back
                      </p>
                    </div>

                    <div>
                      <input
                        ref={editAdditionalFileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleUploadEditAdditional}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => editAdditionalFileInputRef.current?.click()}
                        disabled={isUploadingEditAdditional}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer transition disabled:opacity-50"
                      >
                        {isUploadingEditAdditional ? (
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

                  {editAdditionalImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                      {editAdditionalImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 p-1">
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryEdit(idx)}
                              className="px-1.5 py-0.5 bg-amber-400 text-slate-950 font-bold text-[9px] uppercase rounded cursor-pointer"
                              title="Make this primary cover photo"
                            >
                              Make Main
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveEditAdditional(idx)}
                              className="p-1 bg-rose-600 text-white rounded cursor-pointer hover:bg-rose-500"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No extra gallery photos uploaded.</p>
                  )}
                </div>
              </div>


              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Delete Product Confirmation</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={
                  deletingProduct.images && deletingProduct.images.length > 0
                    ? deletingProduct.images[0]
                    : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100'
                }
                alt={deletingProduct.name}
                className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 truncate">{deletingProduct.name}</p>
                <p className="text-[11px] text-slate-500">
                  {deletingProduct.category} • ₹{deletingProduct.price} (Stock: {deletingProduct.stockQuantity})
                </p>
                <span className="text-[10px] text-amber-700 font-bold">
                  Shop: {seller.shopName}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>{deletingProduct.name}</strong>? It will be permanently removed from your seller catalog and from customer marketplace listings immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-xs"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
