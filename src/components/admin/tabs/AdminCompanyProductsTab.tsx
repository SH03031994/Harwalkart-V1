import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Product, Brand, CategoryItem, SubCategoryItem } from '../../../types';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Tag,
  AlertCircle,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Upload,
  Globe,
  FileEdit,
  Power,
  ShieldCheck,
  Check,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  Info,
  Smartphone,
} from 'lucide-react';
import { ImageUploadField } from '../../common/ImageUploadField';
import { uploadImageFile } from '../../../utils/imageUpload';

const COMPANY_BRANDS = [
  {
    name: 'KitchenShakti',
    slug: 'kitchen-shakti',
    id: 'brand_kitchen_shakti',
    tagline: '100% Pure Spices in Transparent Packaging',
    color: 'from-amber-600 to-amber-700',
    icon: '🌶️',
  },
  {
    name: 'NUTRIFLOW',
    slug: 'nutriflow',
    id: 'brand_nutriflow',
    tagline: 'Pure Nutrition, Cold-Pressed Oils & Superfoods',
    color: 'from-emerald-600 to-emerald-700',
    icon: '🌾',
  },
  {
    name: 'RUPABHOOM',
    slug: 'rupabhoom',
    id: 'brand_rupabhoom',
    tagline: 'Pure Ayurvedic Beauty & Wellness',
    color: 'from-rose-600 to-rose-700',
    icon: '✨',
  },
  {
    name: 'GRAHSHORYA',
    slug: 'grahshorya',
    id: 'brand_grahshorya',
    tagline: 'Safe, Plant-Powered Home & Kitchen Hygiene',
    color: 'from-cyan-600 to-cyan-700',
    icon: '🧼',
  },
];

export const AdminCompanyProductsTab: React.FC = () => {
  const {
    products,
    categories,
    brands,
    sellers,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductPublish,
    toggleProductActive,
    addSubCategory,
    showToast,
  } = useApp();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'inactive' | 'low_stock'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewProductData, setPreviewProductData] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    brand: 'KitchenShakti',
    brandId: 'brand_kitchen_shakti',
    brandSlug: 'kitchen-shakti',
    category: 'Kitchen Shakti Spices',
    subCategory: 'Ground Spices (Pisi Masale)',
    subCategoryId: 'sub_ks_ground',
    price: 120,
    mrp: 150,
    unit: '500g Pack',
    stockQuantity: 100,
    sku: '',
    description: '',
    highlights: '• 100% Pure & Unadulterated\n• Transparent Food-Grade Packaging\n• Lab Tested Quality Guarantee',
    image: '',
    transparentPackagingImage: '',
    additionalImages: [] as string[],
    tags: 'spices, pure, transparent packaging, harwalkart direct',
    isPublished: true,
    isActive: true,
    featured: true,
    isBestSeller: false,
  });

  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  // Sub-categories based on selected category in form
  const currentFormCategoryObj = categories.find(
    c => c.name.toLowerCase() === formData.category.toLowerCase() || c.id === formData.category
  );
  const availableSubCategories: SubCategoryItem[] = currentFormCategoryObj?.subCategories || [];

  // Filter Company Products (Harwalkart Direct or Matching Company Brands)
  const companyProducts = products.filter(p => {
    const isDirect = p.isHarwalkartDirect || p.sellerId === 'seller-hk-direct';
    const isCompanyBrand = COMPANY_BRANDS.some(
      cb =>
        cb.slug === p.brandSlug ||
        cb.id === p.brandId ||
        cb.name.toLowerCase() === p.brand.toLowerCase()
    );
    return isDirect || isCompanyBrand;
  });

  // Filtered list
  const filteredProducts = companyProducts.filter(p => {
    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchHindi = p.hindiName?.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subCategory?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      if (!matchName && !matchHindi && !matchBrand && !matchCat && !matchSub && !matchSku) {
        return false;
      }
    }

    // Brand filter
    if (selectedBrandFilter !== 'all') {
      const matchSlug = p.brandSlug === selectedBrandFilter;
      const matchId = p.brandId === selectedBrandFilter;
      const matchName = p.brand.toLowerCase() === selectedBrandFilter.toLowerCase();
      if (!matchSlug && !matchId && !matchName) return false;
    }

    // Category filter
    if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
      return false;
    }

    // Sub-category filter
    if (selectedSubCategoryFilter !== 'all' && p.subCategory !== selectedSubCategoryFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === 'published') {
      if (p.isDraft || p.isPublished === false || !p.approved) return false;
    } else if (statusFilter === 'draft') {
      if (!p.isDraft && p.isPublished !== false) return false;
    } else if (statusFilter === 'inactive') {
      if (p.isActive !== false) return false;
    } else if (statusFilter === 'low_stock') {
      if (p.stockQuantity > 10) return false;
    }

    return true;
  });

  // Count stats
  const totalCount = companyProducts.length;
  const publishedCount = companyProducts.filter(p => !p.isDraft && p.isPublished !== false && p.approved && p.isActive !== false).length;
  const draftCount = companyProducts.filter(p => p.isDraft || p.isPublished === false).length;
  const inactiveCount = companyProducts.filter(p => p.isActive === false).length;
  const lowStockCount = companyProducts.filter(p => p.stockQuantity <= 10).length;

  const handleBrandChange = (brandName: string) => {
    const brandObj = COMPANY_BRANDS.find(b => b.name === brandName) || {
      name: brandName,
      slug: brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      id: `brand_${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    };

    // Auto-select corresponding primary category
    let defaultCat = categories[0]?.name || 'Kitchen Shakti Spices';
    if (brandName === 'KitchenShakti') {
      const cat = categories.find(c => c.name.toLowerCase().includes('spice') || c.name.toLowerCase().includes('shakti'));
      if (cat) defaultCat = cat.name;
    } else if (brandName === 'NUTRIFLOW') {
      const cat = categories.find(c => c.name.toLowerCase().includes('food') || c.name.toLowerCase().includes('nutrition') || c.name.toLowerCase().includes('grocery'));
      if (cat) defaultCat = cat.name;
    } else if (brandName === 'RUPABHOOM') {
      const cat = categories.find(c => c.name.toLowerCase().includes('beauty') || c.name.toLowerCase().includes('care'));
      if (cat) defaultCat = cat.name;
    } else if (brandName === 'GRAHSHORYA') {
      const cat = categories.find(c => c.name.toLowerCase().includes('home') || c.name.toLowerCase().includes('household') || c.name.toLowerCase().includes('clean'));
      if (cat) defaultCat = cat.name;
    }

    const catObj = categories.find(c => c.name === defaultCat);
    const subCats = catObj?.subCategories || [];

    setFormData(prev => ({
      ...prev,
      brand: brandObj.name,
      brandId: brandObj.id,
      brandSlug: brandObj.slug,
      category: defaultCat,
      subCategory: subCats[0]?.name || '',
      subCategoryId: subCats[0]?.id || '',
    }));
  };

  const handleCategoryChange = (categoryName: string) => {
    const catObj = categories.find(c => c.name === categoryName);
    const subCats = catObj?.subCategories || [];
    setFormData(prev => ({
      ...prev,
      category: categoryName,
      subCategory: subCats[0]?.name || '',
      subCategoryId: subCats[0]?.id || '',
    }));
  };

  const handleOpenAdd = () => {
    const defaultBrand = COMPANY_BRANDS[0];
    const defaultCat = categories.find(c => c.name.toLowerCase().includes('spice')) || categories[0];
    const defaultSub = defaultCat?.subCategories?.[0]?.name || 'Ground Spices (Pisi Masale)';

    setFormData({
      name: '',
      hindiName: '',
      brand: defaultBrand.name,
      brandId: defaultBrand.id,
      brandSlug: defaultBrand.slug,
      category: defaultCat ? defaultCat.name : 'Kitchen Shakti Spices',
      subCategory: defaultSub,
      subCategoryId: defaultCat?.subCategories?.[0]?.id || '',
      price: 140,
      mrp: 180,
      unit: '500g Pouch',
      stockQuantity: 100,
      sku: `HK-${defaultBrand.slug.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      description: '100% Pure & authentic product manufactured under Harwalkart direct quality supervision in transparent food-safe packaging.',
      highlights: '• 100% Pure & Unadulterated\n• Transparent Food-Grade Packaging\n• Lab Tested Quality Guarantee',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60',
      transparentPackagingImage: '',
      additionalImages: [],
      tags: 'pure, transparent packaging, harwalkart direct',
      isPublished: true,
      isActive: true,
      featured: true,
      isBestSeller: false,
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
      brand: prod.brand,
      brandId: prod.brandId || '',
      brandSlug: prod.brandSlug || '',
      category: prod.category,
      subCategory: prod.subCategory || '',
      subCategoryId: prod.subCategoryId || '',
      price: prod.price,
      mrp: prod.mrp || Math.round(prod.price * 1.25),
      unit: prod.unit,
      stockQuantity: prod.stockQuantity,
      sku: prod.sku || '',
      description: prod.description || '',
      highlights: prod.features?.join('\n') || '• 100% Pure & Unadulterated\n• Transparent Food-Grade Packaging',
      image: prod.productImage || prod.images[0] || '',
      transparentPackagingImage: prod.transparentPackagingImage || prod.packagingImage || '',
      additionalImages: extraImgs,
      tags: prod.tags?.join(', ') || '',
      isPublished: !prod.isDraft && prod.isPublished !== false,
      isActive: prod.isActive !== false,
      featured: prod.featured || false,
      isBestSeller: prod.isBestSeller || false,
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

  const handleSaveProduct = (publishNow: boolean, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a product name.');
      return;
    }
    if (!formData.image.trim()) {
      showToast('Please upload or select a main product image.');
      return;
    }

    const discount = Math.max(0, Math.round(((formData.mrp - formData.price) / formData.mrp) * 100));
    const allImages = [formData.image, ...(formData.additionalImages || [])].filter(Boolean);
    const featuresList = formData.highlights.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
    const tagList = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    const isEditing = isEditModalOpen && selectedProduct;

    if (isEditing) {
      updateProduct(selectedProduct.id, {
        name: formData.name,
        hindiName: formData.hindiName,
        brand: formData.brand,
        brandId: formData.brandId,
        brandSlug: formData.brandSlug,
        category: formData.category,
        subCategory: formData.subCategory,
        subCategoryId: formData.subCategoryId,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        discountPercent: discount,
        inStock: Number(formData.stockQuantity) > 0,
        stockQuantity: Number(formData.stockQuantity),
        sku: formData.sku || undefined,
        unit: formData.unit,
        description: formData.description,
        features: featuresList,
        images: allImages.length > 0 ? allImages : [formData.image],
        productImage: formData.image,
        transparentPackagingImage: formData.transparentPackagingImage.trim() || undefined,
        packagingImage: formData.transparentPackagingImage.trim() || undefined,
        additionalImages: formData.additionalImages,
        tags: tagList,
        isDraft: !publishNow,
        isPublished: publishNow,
        approved: publishNow ? true : selectedProduct.approved,
        isActive: formData.isActive,
        featured: formData.featured,
        isBestSeller: formData.isBestSeller,
      });
      setIsEditModalOpen(false);
      showToast(publishNow ? `"${formData.name}" updated & published live!` : `"${formData.name}" updated & saved as draft.`);
    } else {
      addProduct({
        name: formData.name,
        hindiName: formData.hindiName,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: formData.brand,
        brandId: formData.brandId,
        brandSlug: formData.brandSlug,
        sellerId: 'seller-hk-direct',
        sellerName: 'Harwalkart Direct',
        isHarwalkartDirect: true,
        category: formData.category,
        subCategory: formData.subCategory,
        subCategoryId: formData.subCategoryId,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        discountPercent: discount,
        inStock: Number(formData.stockQuantity) > 0,
        stockQuantity: Number(formData.stockQuantity),
        sku: formData.sku || `HK-${formData.brandSlug.toUpperCase()}-${Date.now().toString().slice(-4)}`,
        unit: formData.unit,
        description: formData.description,
        features: featuresList,
        images: allImages.length > 0 ? allImages : [formData.image],
        productImage: formData.image,
        transparentPackagingImage: formData.transparentPackagingImage.trim() || undefined,
        packagingImage: formData.transparentPackagingImage.trim() || undefined,
        additionalImages: formData.additionalImages,
        serviceablePincodes: ['*'],
        tags: tagList,
        approved: publishNow,
        isDraft: !publishNow,
        isPublished: publishNow,
        isActive: formData.isActive,
        featured: formData.featured,
        isBestSeller: formData.isBestSeller,
      });
      setIsAddModalOpen(false);
      showToast(publishNow ? `"${formData.name}" published live to catalog! 🚀` : `"${formData.name}" saved as draft 📝`);
    }
  };

  const handleOpenPreview = (prod: Product) => {
    setPreviewProductData(prod);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Company Brands Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Official Company Catalog
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 100% Harwalkart Direct
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Company Product & Brand Management
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Add, edit, publish, unpublish, and organize products across the 4 company brands in their respective categories with high-resolution image uploads.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ ADD COMPANY PRODUCT</span>
          </button>
        </div>

        {/* 4 Company Brands Quick Tabs */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Filter By Harwalkart Brand:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => setSelectedBrandFilter('all')}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                selectedBrandFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700 font-bold'
              }`}
            >
              <div className="text-xs flex items-center justify-between">
                <span>All Company</span>
                <span className="text-[10px] opacity-80 font-black">({companyProducts.length})</span>
              </div>
            </button>

            {COMPANY_BRANDS.map(brand => {
              const brandCount = companyProducts.filter(
                p => p.brandSlug === brand.slug || p.brandId === brand.id || p.brand.toLowerCase() === brand.name.toLowerCase()
              ).length;
              const isSelected = selectedBrandFilter === brand.slug || selectedBrandFilter === brand.name;

              return (
                <button
                  key={brand.slug}
                  onClick={() => setSelectedBrandFilter(brand.slug)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700 font-bold'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate flex items-center gap-1.5">
                      <span>{brand.icon}</span>
                      <span>{brand.name}</span>
                    </span>
                    <span className="text-[10px] opacity-80 font-black ml-1">({brandCount})</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-bold uppercase block">Total Products</span>
          <div className="text-2xl font-black text-slate-950">{totalCount}</div>
          <span className="text-[10px] text-slate-400">All Company Items</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-emerald-700 font-bold uppercase block">Live Published</span>
          <div className="text-2xl font-black text-emerald-600">{publishedCount}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Visible to Customers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-amber-700 font-bold uppercase block">Drafts</span>
          <div className="text-2xl font-black text-amber-600">{draftCount}</div>
          <span className="text-[10px] text-amber-600 font-semibold">Hidden from Public</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-rose-700 font-bold uppercase block">Inactive / Disabled</span>
          <div className="text-2xl font-black text-rose-600">{inactiveCount}</div>
          <span className="text-[10px] text-rose-600 font-semibold">Paused in Catalog</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] text-orange-700 font-bold uppercase block">Low Stock (&le;10)</span>
          <div className="text-2xl font-black text-orange-600">{lowStockCount}</div>
          <span className="text-[10px] text-orange-600 font-semibold">Requires Restock</span>
        </div>
      </div>

      {/* Main Filter & Action Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Product Name, Hindi Name, SKU, Category, or Tag..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-700 hover:bg-slate-200'
              }`}
            >
              Live Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                statusFilter === 'draft' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-amber-800 hover:bg-slate-200'
              }`}
            >
              Drafts ({draftCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                statusFilter === 'inactive' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-rose-700 hover:bg-slate-200'
              }`}
            >
              Disabled ({inactiveCount})
            </button>
            <button
              onClick={() => setStatusFilter('low_stock')}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                statusFilter === 'low_stock' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-orange-700 hover:bg-slate-200'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
          </div>
        </div>

        {/* Category & Subcategory Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Category Filter:</label>
            <select
              value={selectedCategoryFilter}
              onChange={e => {
                setSelectedCategoryFilter(e.target.value);
                setSelectedSubCategoryFilter('all');
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon || '🏷️'} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Sub-Category Filter:</label>
            <select
              value={selectedSubCategoryFilter}
              onChange={e => setSelectedSubCategoryFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All Sub-Categories</option>
              {categories
                .flatMap(c => c.subCategories || [])
                .map(sub => (
                  <option key={sub.id} value={sub.name}>
                    {sub.categoryName ? `${sub.categoryName} → ` : ''}{sub.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-end justify-between">
            <span className="text-xs text-slate-500 font-semibold pb-2">
              Showing <strong className="text-slate-900 font-black">{filteredProducts.length}</strong> of {totalCount} company products
            </span>

            {(selectedBrandFilter !== 'all' || selectedCategoryFilter !== 'all' || selectedSubCategoryFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedBrandFilter('all');
                  setSelectedCategoryFilter('all');
                  setSelectedSubCategoryFilter('all');
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="text-xs text-amber-600 font-bold hover:underline pb-2 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS LISTING - RESPONSIVE (DESKTOP TABLE + MOBILE CARDS) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No company products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, brand filter, or status filters, or add a new company product.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-slate-950 text-amber-400 text-xs font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product Now
          </button>
        </div>
      ) : (
        <>
          {/* DESKTOP / TABLET VIEW (Hidden on small mobile < 640px) */}
          <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Product & Images</th>
                    <th className="py-3.5 px-3">Brand & Category</th>
                    <th className="py-3.5 px-3">Price & MRP</th>
                    <th className="py-3.5 px-3">Stock & SKU</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-3 text-center">Publish State</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredProducts.map(prod => {
                    const isDraft = prod.isDraft || prod.isPublished === false;
                    const isLive = !isDraft && prod.approved && prod.isActive !== false;
                    const discount = prod.mrp ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) : prod.discountPercent;
                    const brandObj = COMPANY_BRANDS.find(b => b.slug === prod.brandSlug || b.name === prod.brand);

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Image & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 group">
                              <img
                                src={prod.productImage || prod.images[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                              {prod.transparentPackagingImage && (
                                <span
                                  className="absolute bottom-0 right-0 bg-cyan-600 text-white text-[8px] font-black px-1 rounded-tl"
                                  title="Transparent Packaging Image Included"
                                >
                                  TRANSPARENT
                                </span>
                              )}
                            </div>
                            <div className="space-y-0.5 max-w-xs">
                              <div className="font-bold text-slate-900 text-xs line-clamp-1">
                                {prod.name}
                              </div>
                              {prod.hindiName && (
                                <div className="text-[11px] text-slate-500 line-clamp-1 font-serif">
                                  {prod.hindiName}
                                </div>
                              )}
                              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                <span>{prod.unit}</span>
                                {prod.images.length > 1 && (
                                  <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">
                                    {prod.images.length} photos
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Brand & Category */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 bg-slate-900 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md">
                              <span>{brandObj?.icon || '🏷️'}</span>
                              <span>{prod.brand}</span>
                            </span>
                            <div className="text-[11px] text-slate-600 font-semibold">
                              {prod.category}
                            </div>
                            {prod.subCategory && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                ↳ {prod.subCategory}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Price & MRP */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5">
                            <div className="text-sm font-black text-slate-900">₹{prod.price}</div>
                            {prod.mrp && prod.mrp > prod.price && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="line-through">₹{prod.mrp}</span>
                                <span className="text-emerald-600 font-bold">({discount}% off)</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Stock & SKU */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5">
                            <div className={`font-bold ${prod.stockQuantity <= 10 ? 'text-rose-600' : 'text-slate-900'}`}>
                              {prod.stockQuantity} units
                            </div>
                            {prod.stockQuantity <= 10 && (
                              <span className="text-[9px] bg-rose-100 text-rose-800 font-black px-1.5 py-0.5 rounded">
                                LOW STOCK
                              </span>
                            )}
                            {prod.sku && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                {prod.sku}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Active / Disabled */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => toggleProductActive(prod.id, !(prod.isActive !== false))}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
                              prod.isActive !== false
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title="Click to toggle Active / Inactive in catalog"
                          >
                            {prod.isActive !== false ? '● ACTIVE' : '○ DISABLED'}
                          </button>
                        </td>

                        {/* Publish State */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => toggleProductPublish(prod.id, isDraft)}
                            className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer transition-all inline-flex items-center gap-1 ${
                              !isDraft
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                            }`}
                            title={!isDraft ? 'Live in customer store (Click to Unpublish)' : 'Saved as Draft (Click to Publish Live)'}
                          >
                            {!isDraft ? (
                              <>
                                <Globe className="w-3 h-3" />
                                <span>LIVE</span>
                              </>
                            ) : (
                              <>
                                <FileEdit className="w-3 h-3" />
                                <span>DRAFT</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenPreview(prod)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                              title="Customer View Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-800 transition-colors cursor-pointer"
                              title="Edit Product Details & Images"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${prod.name}" permanently from company catalog?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors cursor-pointer"
                              title="Delete Product"
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

          {/* MOBILE STACKED CARDS VIEW (For screen width 320px - 639px) */}
          <div className="block sm:hidden space-y-3">
            {filteredProducts.map(prod => {
              const isDraft = prod.isDraft || prod.isPublished === false;
              const isLive = !isDraft && prod.approved && prod.isActive !== false;
              const discount = prod.mrp ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) : prod.discountPercent;
              const brandObj = COMPANY_BRANDS.find(b => b.slug === prod.brandSlug || b.name === prod.brand);

              return (
                <div
                  key={prod.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={prod.productImage || prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {prod.transparentPackagingImage && (
                        <span className="absolute bottom-0 right-0 bg-cyan-600 text-white text-[7px] font-black px-1">
                          CLEAR
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-slate-900 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded">
                          {brandObj?.icon} {prod.brand}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold truncate">
                          {prod.category}
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-2">
                        {prod.name}
                      </h4>

                      {prod.hindiName && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-serif">
                          {prod.hindiName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Stock Row */}
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-slate-900">₹{prod.price}</span>
                        {prod.mrp && prod.mrp > prod.price && (
                          <span className="text-[10px] text-slate-400 line-through">₹{prod.mrp}</span>
                        )}
                        {discount > 0 && (
                          <span className="text-[10px] text-emerald-600 font-bold">({discount}% off)</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{prod.unit}</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-black ${prod.stockQuantity <= 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {prod.stockQuantity} in stock
                      </span>
                      {prod.sku && (
                        <span className="block text-[9px] text-slate-400 font-mono">
                          {prod.sku}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      {/* Live / Draft Toggle */}
                      <button
                        onClick={() => toggleProductPublish(prod.id, isDraft)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 cursor-pointer ${
                          !isDraft
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {!isDraft ? <Globe className="w-3 h-3" /> : <FileEdit className="w-3 h-3" />}
                        <span>{!isDraft ? 'LIVE' : 'DRAFT'}</span>
                      </button>

                      {/* Active Toggle */}
                      <button
                        onClick={() => toggleProductActive(prod.id, !(prod.isActive !== false))}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          prod.isActive !== false
                            ? 'bg-slate-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {prod.isActive !== false ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenPreview(prod)}
                        className="p-2 bg-slate-100 text-slate-700 rounded-xl cursor-pointer"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="px-3 py-2 bg-slate-950 text-amber-400 font-bold rounded-xl flex items-center gap-1 cursor-pointer text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${prod.name}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-6 max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-950 text-white rounded-t-3xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Harwalkart Company Admin
                  </span>
                  <span className="text-xs text-slate-400">
                    {isAddModalOpen ? 'New Direct Product' : `Editing: ${selectedProduct?.name}`}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {isAddModalOpen ? 'Create New Company Product' : 'Edit Company Product Details'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={e => handleSaveProduct(formData.isPublished, e)}
              className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1"
            >
              {/* SECTION 1: Brand & Category Hierarchy */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Brand & Category Hierarchy</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Brand Selection */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Company Brand *</label>
                    <select
                      value={formData.brand}
                      onChange={e => handleBrandChange(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {COMPANY_BRANDS.map(b => (
                        <option key={b.slug} value={b.name}>
                          {b.icon} {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Primary Category *</label>
                    <select
                      value={formData.category}
                      onChange={e => handleCategoryChange(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                          {cat.icon || '🏷️'} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sub-Category Selection */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Sub-Category *</label>
                    <select
                      value={formData.subCategory}
                      onChange={e => {
                        const chosen = availableSubCategories.find(s => s.name === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          subCategory: e.target.value,
                          subCategoryId: chosen?.id || '',
                        }));
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {availableSubCategories.length === 0 ? (
                        <option value="General Products">General Products</option>
                      ) : (
                        availableSubCategories.map(sub => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Product Name & Identifiers */}
              <div className="space-y-3">
                <div className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Product Title & Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Product Title (English) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kitchen Shakti Pure Lal Mirch Powder (500g Pouch)"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Hindi Product Name (हिंदी नाम)</label>
                    <input
                      type="text"
                      placeholder="उदा. किचन शक्ति शुद्ध लाल मिर्च पाउडर"
                      value={formData.hindiName}
                      onChange={e => setFormData({ ...formData, hindiName: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-serif text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Pack Unit / Weight *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500g Pouch, 1L Bottle, Pack of 2"
                      value={formData.unit}
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Pricing & Inventory */}
              <div className="space-y-3">
                <div className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                  <span>3. Pricing, Discount & Inventory Stock</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.mrp}
                      onChange={e => setFormData({ ...formData, mrp: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-emerald-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Calculated Discount</label>
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 font-black rounded-xl border border-emerald-200 text-center">
                      {Math.max(0, Math.round(((formData.mrp - formData.price) / formData.mrp) * 100))}% OFF
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stockQuantity}
                      onChange={e => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">SKU / Product Code</label>
                    <input
                      type="text"
                      placeholder="e.g. HK-KS-MIRCH-500"
                      value={formData.sku}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Search Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="spices, pure, red chilli, kitchen shakti"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: IMAGE UPLOADS (MANDATORY REQUIREMENT) */}
              <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>4. Category & Product Image Uploads (Gallery / Camera / Files)</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    JPG, PNG, WEBP (Direct Upload to Persistent Storage)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Field 1: Main Product Image */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-black text-slate-900 text-xs">
                        1. Main Product Front Image *
                      </label>
                      <span className="text-[10px] text-emerald-700 font-bold">Primary</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Standard catalog front view shown to customers.
                    </p>
                    <ImageUploadField
                      label="Upload Main Product Image"
                      value={formData.image}
                      onChange={url => setFormData({ ...formData, image: url })}
                      imageType="product"
                      folder="products"
                    />
                  </div>

                  {/* Field 2: Transparent Packaging Image */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-black text-slate-900 text-xs flex items-center gap-1">
                        <span>2. Transparent Packaging Photo</span>
                        <span className="text-[9px] bg-cyan-100 text-cyan-800 font-black px-1.5 py-0.5 rounded">
                          HARWALKART SIGNATURE
                        </span>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Clear see-through packaging photo verifying pure ingredients.
                    </p>
                    <ImageUploadField
                      label="Upload Transparent Pack Photo"
                      value={formData.transparentPackagingImage}
                      onChange={url => setFormData({ ...formData, transparentPackagingImage: url })}
                      imageType="packaging"
                      folder="products"
                    />
                  </div>
                </div>

                {/* Additional Images Gallery */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">
                        3. Additional Product Gallery Images ({formData.additionalImages.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Side angle, nutrition facts, back label, and recipe shots.
                      </p>
                    </div>

                    <div>
                      <input
                        type="file"
                        ref={additionalFileInputRef}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleUploadAdditional}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => additionalFileInputRef.current?.click()}
                        disabled={isUploadingAdditional}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isUploadingAdditional ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>+ Add Gallery Photo</span>
                      </button>
                    </div>
                  </div>

                  {formData.additionalImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                      {formData.additionalImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl border border-slate-200 overflow-hidden aspect-square bg-slate-50"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                            <button
                              type="button"
                              onClick={() => handleMakePrimaryAdditional(idx)}
                              className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                              title="Make Primary Image"
                            >
                              Make Main
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalImage(idx)}
                              className="text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded cursor-pointer"
                              title="Remove Photo"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      No additional gallery images uploaded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: Description & Highlights */}
              <div className="space-y-3">
                <div className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <FileEdit className="w-3.5 h-3.5 text-amber-600" />
                  <span>5. Descriptions & Key Highlights</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Key Highlights / Features (One per line)</label>
                    <textarea
                      rows={3}
                      value={formData.highlights}
                      onChange={e => setFormData({ ...formData, highlights: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                      placeholder="• 100% Pure & Unadulterated&#10;• Transparent Food-Grade Packaging&#10;• Lab Tested Quality"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Product Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                      placeholder="Authentic products manufactured with high hygiene standards under Harwalkart direct quality supervision."
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: Visibility & Publishing Toggles */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-[11px] font-black uppercase text-slate-800 tracking-wider">
                  6. Visibility & Publishing Options
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>Active in Inventory</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span>Featured on Home Page</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span>Best Seller Badge</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer order-last sm:order-first"
                >
                  Cancel
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveProduct(false)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileEdit className="w-4 h-4" />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveProduct(true)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Globe className="w-4 h-4 stroke-[3]" />
                    <span>{isAddModalOpen ? 'Publish Product Live' : 'Save & Publish Live'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= LIVE CUSTOMER PREVIEW MODAL ================= */}
      {isPreviewModalOpen && previewProductData && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Customer Live Preview
                </span>
                <span className="text-xs text-slate-500">{previewProductData.brand}</span>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Product Card Rendering */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 border border-slate-200">
                <img
                  src={previewProductData.productImage || previewProductData.images[0]}
                  alt={previewProductData.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {previewProductData.transparentPackagingImage && (
                  <div className="absolute top-3 left-3 bg-cyan-600/90 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                    🔍 100% Transparent Pack
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-xs text-amber-400 text-xs font-black px-3 py-1 rounded-full">
                  {previewProductData.unit}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  {previewProductData.category} {previewProductData.subCategory ? `• ${previewProductData.subCategory}` : ''}
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {previewProductData.name}
                </h3>
                {previewProductData.hindiName && (
                  <p className="text-xs text-slate-600 font-serif">
                    {previewProductData.hindiName}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 bg-slate-50 p-3 rounded-xl">
                <span className="text-2xl font-black text-slate-900">₹{previewProductData.price}</span>
                {previewProductData.mrp && previewProductData.mrp > previewProductData.price && (
                  <>
                    <span className="text-xs text-slate-400 line-through">₹{previewProductData.mrp}</span>
                    <span className="text-xs text-emerald-600 font-black">
                      ({Math.round(((previewProductData.mrp - previewProductData.price) / previewProductData.mrp) * 100)}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Transparent Pack preview if present */}
              {previewProductData.transparentPackagingImage && (
                <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 space-y-2">
                  <span className="text-[11px] font-black text-cyan-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    <span>Verified Transparent Packaging View:</span>
                  </span>
                  <div className="h-40 rounded-xl overflow-hidden border border-cyan-300">
                    <img
                      src={previewProductData.transparentPackagingImage}
                      alt="Packaging View"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* Highlights */}
              {previewProductData.features && previewProductData.features.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-800">Product Highlights:</span>
                  <ul className="space-y-1 text-slate-600">
                    {previewProductData.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
