import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller } from '../../types';
import {
  PackagePlus,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  Tag,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface SellerAddProductProps {
  seller: Seller;
  onSuccess: () => void;
}

const CATEGORIES = [
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
  'Organic & Natural',
];

const SAMPLE_PRESET_IMAGES = [
  { label: 'Rice / Grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Spices / Masala', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Atta / Flour', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80' },
  { label: 'Pure Ghee / Oil', url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80' },
  { label: 'Pulses / Dal', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Dry Fruits', url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80' },
];

export const SellerAddProduct: React.FC<SellerAddProductProps> = ({ seller, onSuccess }) => {
  const { addProduct, showToast } = useApp();

  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [brand, setBrand] = useState(seller.shopName);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [mrp, setMrp] = useState<number>(200);
  const [price, setPrice] = useState<number>(160);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [unit, setUnit] = useState('1kg Pack');
  const [sku, setSku] = useState(`HK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [fssaiNumber, setFssaiNumber] = useState(seller.gstin ? '10019011006542' : '');
  const [description, setDescription] = useState('');
  
  // Multi-image state
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Auto-calculated discount percentage
  const discountPercent = mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages(prev => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
    showToast('Image added to product gallery.');
  };

  const handleAddPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
      showToast('Preset image added to gallery.');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      showToast('Product must have at least one main image.');
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
    showToast('Main product image set.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter a product name.');
      return;
    }
    if (price <= 0 || mrp <= 0) {
      showToast('Please enter valid selling price and MRP.');
      return;
    }
    if (price > mrp) {
      showToast('Selling price cannot exceed MRP.');
      return;
    }
    if (images.length === 0) {
      showToast('Please add at least one product image.');
      return;
    }

    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    addProduct({
      name: name.trim(),
      hindiName: hindiName.trim() || undefined,
      slug: `${generatedSlug}-${Date.now().toString().slice(-4)}`,
      brand: brand.trim() || seller.shopName,
      sellerId: seller.id,
      sellerName: seller.shopName,
      isHarwalkartDirect: seller.isHarwalkartDirect || false,
      category,
      price,
      mrp,
      discountPercent,
      inStock: stockQuantity > 0,
      stockQuantity,
      unit: unit.trim() || '1 unit',
      sku: sku.trim() || `HK-SKU-${Date.now().toString().slice(-4)}`,
      description: description.trim() || `${name} by ${seller.shopName}. Fresh quality guaranteed.`,
      fssaiNumber: fssaiNumber.trim() || undefined,
      images,
      serviceablePincodes: seller.serviceablePincodes || ['*'],
      tags: [category, brand, 'Fresh', 'Local'],
    });

    onSuccess();
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30 mb-2">
              <PackagePlus className="w-3.5 h-3.5" />
              New Catalog Item
            </div>
            <h2 className="text-2xl font-black text-white">Add Product to Store</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              List new inventory under <strong>{seller.shopName}</strong> with 2% Harwalkart settlement
            </p>
          </div>
          <span className="text-xs text-amber-400 bg-white/10 px-3 py-1.5 rounded-xl font-bold self-start">
            Shop ID: {seller.id}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Basic Product Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Royal Fortune Daawat Basmati Rice"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hindi / Local Name (Optional)
              </label>
              <input
                type="text"
                value={hindiName}
                onChange={e => setHindiName(e.target.value)}
                placeholder="e.g. बासमती चावल"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="e.g. Fortune / Kitchen Shakti / Store Brand"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Size / Weight / Unit *
              </label>
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="e.g. 500g, 1kg, 5 Litres, Pack of 2"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                SKU / Item Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="HK-SKU-102"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Stock */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>2. Pricing, Discount & Inventory</span>
            <span className="text-xs text-amber-700 font-bold normal-case">
              Harwalkart 2% commission applies at checkout
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                MRP (₹) *
              </label>
              <input
                type="number"
                min="1"
                value={mrp}
                onChange={e => setMrp(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-900"
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
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Auto Discount (%)
              </label>
              <div className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-amber-600">
                {discountPercent}% OFF
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Initial Stock Units *
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={e => setStockQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-900"
                required
              />
            </div>
          </div>

          {/* 2% Commission preview on this item */}
          <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-700" />
              <span>
                Item Selling Price: <strong>₹{price}</strong> • Harwalkart 2% Fee: <strong>₹{(price * 0.02).toFixed(2)}</strong>
              </span>
            </div>
            <span className="font-bold text-emerald-800">
              Net Seller Payout: ₹{(price * 0.98).toFixed(2)} / unit
            </span>
          </div>
        </div>

        {/* Section 3: Multi-Image Management */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              3. Product Images Gallery ({images.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Add multiple photos for best customer conversion</span>
          </div>

          {/* Gallery Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`relative group aspect-square rounded-2xl overflow-hidden border-2 bg-slate-100 ${
                  idx === 0 ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Product view ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black uppercase rounded shadow-xs">
                    Primary Image
                  </span>
                )}

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1.5 bg-rose-600 text-white rounded-lg cursor-pointer hover:bg-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Image URL Row */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image URL (https://...)..."
              value={imageUrlInput}
              onChange={e => setImageUrlInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer transition"
            >
              Add URL
            </button>
          </div>

          {/* Presets Row */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Quick Add Category Photo Presets:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPresetImage(preset.url)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-medium transition cursor-pointer border border-slate-200"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Description & Details */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            4. Description & FSSAI Details
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe freshness, origin, purity, packaging, or storage instructions..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              FSSAI License / Registration No. (Optional for Food items)
            </label>
            <input
              type="text"
              value={fssaiNumber}
              onChange={e => setFssaiNumber(e.target.value)}
              placeholder="14-digit FSSAI number"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium font-mono"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Product will be immediately available in your store inventory and local customer listings.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition shadow-md"
          >
            Publish Product to Store Catalog
          </button>
        </div>
      </form>
    </div>
  );
};
