import React, { useState, useRef, useEffect } from 'react';
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
  Percent,
  ShieldCheck,
  Check,
  Flame,
} from 'lucide-react';
import { ImageUploadField } from '../../common/ImageUploadField';
import { uploadImageFile } from '../../../utils/imageUpload';

interface AdminProductsTabProps {
  initialOpenAdd?: boolean;
  onResetInitialOpenAdd?: () => void;
}

// 12 High-Quality Curated Fast Presets for Quick Product Creation
const CURATED_PRODUCT_PRESETS = [
  {
    name: 'Kitchen Shakti Salem Turmeric (Haldi) Powder',
    hindiName: 'किचन शक्ति शुद्ध सलेम हल्दी पाउडर',
    brand: 'KITCHEN SHAKTI (Harwalkart)',
    brandId: 'brand_kitchen_shakti',
    brandSlug: 'kitchen-shakti',
    category: 'Masala & Food',
    subCategory: 'Spices & Masala',
    price: 85,
    mrp: 110,
    unit: '200g Pack',
    stockQuantity: 450,
    sku: 'HK-KS-HALDI-200G',
    fssaiNumber: '10022011000456',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    description: 'Golden Salem turmeric with guaranteed >3.2% natural active curcumin. Triple-cleaned, slow cold-ground with zero added lead chromate or chemicals.',
    features: ['High active curcumin (>3.2%)', '100% pure food-grade transparent pouch', 'Zero artificial colors or preservatives', 'FSSAI Agmark certified'],
    ingredients: ['100% High-Curcumin Salem Whole Turmeric Fingers'],
    tags: 'haldi, turmeric, kitchen shakti, pure spice, curcumin',
    featured: true,
    isBestSeller: true,
  },
  {
    name: 'Kitchen Shakti Guntur Lal Mirch Powder',
    hindiName: 'किचन शक्ति गुंटूर लाल मिर्च पाउडर',
    brand: 'KITCHEN SHAKTI (Harwalkart)',
    brandId: 'brand_kitchen_shakti',
    brandSlug: 'kitchen-shakti',
    category: 'Masala & Food',
    subCategory: 'Pure Red Chilli',
    price: 85,
    mrp: 110,
    unit: '200g Pack',
    stockQuantity: 400,
    sku: 'HK-KS-MIRCH-200G',
    fssaiNumber: '10022011000456',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    description: '100% pure stemless Guntur chillies cold-ground to preserve deep natural crimson color and natural spicy aroma. No artificial dyes or Sudan dyes.',
    features: ['Grade A Stemless Guntur chillies', 'Natural deep red color without dyes', 'Cold milled to retain capsaicin oils', 'Zero adulteration warranty'],
    ingredients: ['100% Pure Sun-Dried Red Chillies (Stemless Guntur Grade A)'],
    tags: 'mirch, chilli powder, guntur, spices, hot',
    featured: true,
    isBestSeller: true,
  },
  {
    name: 'NutriFlow Organic Unpolished Toor Dal',
    hindiName: 'न्यूट्रीफ्लो अनपॉलिश्ड अरहर / तूर दाल',
    brand: 'NUTRIFLOW',
    brandId: 'brand_nutriflow',
    brandSlug: 'nutriflow',
    category: 'Grocery & Staples',
    subCategory: 'Pulses & Dal',
    price: 185,
    mrp: 230,
    unit: '1kg Pack',
    stockQuantity: 300,
    sku: 'HK-NF-TOOR-1KG',
    fssaiNumber: '10022011000456',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: '100% unpolished desi toor dal. Zero water polish, zero oil polish, zero leather polish. Retains natural dietary fiber and rich plant protein.',
    features: ['Zero water or leather polish', 'High in natural plant protein (22g)', 'Easy to cook and digestive', 'Transparent food-grade pouch'],
    ingredients: ['100% Unpolished Organic Arhar (Toor) Dal'],
    tags: 'dal, toor dal, pulses, unpolished, organic, nutriflow',
    featured: true,
    isBestSeller: true,
  },
  {
    name: 'NutriFlow Cold-Pressed Kachi Ghani Mustard Oil',
    hindiName: 'न्यूट्रीफ्लो कच्ची घानी सरसों तेल',
    brand: 'NUTRIFLOW',
    brandId: 'brand_nutriflow',
    brandSlug: 'nutriflow',
    category: 'Oils & Ghee',
    subCategory: 'Cold Pressed Oils',
    price: 210,
    mrp: 260,
    unit: '1L Bottle',
    stockQuantity: 250,
    sku: 'HK-NF-MUSTARD-1L',
    fssaiNumber: '10022011000456',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80',
    description: 'Extracted from the finest Rajasthan yellow mustard seeds at ambient low temperature. Strong pungent aroma and natural pungency (pungency >0.30%).',
    features: ['Traditional wooden kachi ghani pressed', 'Zero chemicals or argemone oil', 'Rich in natural Omega-3 fatty acids', 'Heart friendly'],
    ingredients: ['100% First-Press Cold-Pressed Mustard Oil'],
    tags: 'mustard oil, sarson ka tel, kachi ghani, cold pressed',
    featured: false,
    isBestSeller: true,
  },
  {
    name: 'Rupabhoom™ Kumkumadi Golden Face Glow Oil',
    hindiName: 'रूपाभूम कुमकुमादि गोल्डन फेस ग्लो ऑयल',
    brand: 'RUPABHOOM',
    brandId: 'brand_rupabhoom',
    brandSlug: 'rupabhoom',
    category: 'Personal Care',
    subCategory: 'Ayurvedic Skincare',
    price: 449,
    mrp: 699,
    unit: '30ml Dropper',
    stockQuantity: 180,
    sku: 'HK-RB-KUMKUM-30ML',
    fssaiNumber: 'AYUR-KA-2024-889',
    image: 'https://images.unsplash.com/photo-1608248597359-bbad20a4ceb5?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: 'https://images.unsplash.com/photo-1608248597359-bbad20a4ceb5?w=600&auto=format&fit=crop&q=80',
    description: 'Authentic Ayurvedic formulation infused with genuine Kashmiri saffron (Kesar) strands, lotus pollen, red sandalwood, and 24 botanical herbs for radiant skin.',
    features: ['Infused with real Kashmiri saffron strands', 'Ayurvedic classical formulation', 'Reduces dark spots & pigmentation', 'Chemical-free & mineral oil-free'],
    ingredients: ['Kashmiri Kesar (Saffron)', 'Sandalwood', 'Manjistha', 'Licorice', 'Sesame Oil Base'],
    tags: 'kumkumadi, face oil, ayurveda, rupabhoom, glow',
    featured: true,
    isBestSeller: false,
  },
  {
    name: 'GrahShorya™ Lemon & Neem Power Dishwash Gel',
    hindiName: 'गृहशौर्य नीम्बू और नीम डिशवॉश जेल',
    brand: 'GRAHSHORYA',
    brandId: 'brand_grahshorya',
    brandSlug: 'grahshorya',
    category: 'Household Essentials',
    subCategory: 'Kitchen Cleaners',
    price: 149,
    mrp: 199,
    unit: '500ml Squeeze Bottle',
    stockQuantity: 280,
    sku: 'HK-GS-DISHWASH-500ML',
    fssaiNumber: 'IND-MFG-KA-991',
    image: 'https://images.unsplash.com/photo-1585670270608-b4be4fb880ed?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: 'https://images.unsplash.com/photo-1585670270608-b4be4fb880ed?w=600&auto=format&fit=crop&q=80',
    description: 'Concentrated plant-powered dishwashing formula infused with real lemon citrus degreaser and natural neem antibacterial protection. Tough on oily curry grease, gentle on hands.',
    features: ['Real Lemon & Neem active extracts', '1 Spoon cleans a full sink of utensils', 'Leaves zero white chemical residue', 'Safe for baby utensils'],
    ingredients: ['Plant-Derived Biodegradable Surfactants', 'Pure Lemon Extract', 'Neem Leaf Essential Oil'],
    tags: 'dishwash, cleaner, grahshorya, kitchen, lemon',
    featured: false,
    isBestSeller: true,
  },
  {
    name: 'India Gate Classic Basmati Rice (Aged 2 Years)',
    hindiName: 'इंडिया गेट क्लासिक बासमती चावल (२ साल पुराना)',
    brand: 'India Gate',
    brandId: '',
    brandSlug: 'india-gate',
    category: 'Rice & Pulses',
    subCategory: 'Aged Basmati',
    price: 195,
    mrp: 260,
    unit: '1kg Pouch',
    stockQuantity: 350,
    sku: 'MR-IG-BASMATI-1KG',
    fssaiNumber: '10014011002345',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: '',
    description: 'Authentic extra-long slender grains aged naturally for 24 months to deliver exquisite royal aroma and non-sticky fluffy cooking.',
    features: ['Aged 2 full years for maximum elongation', 'Pearlescent white slender grain', 'Perfect for Biryani and Pulao', '100% authentic Basmati'],
    ingredients: ['100% Traditional Basmati Rice'],
    tags: 'basmati rice, chawal, biryani, india gate, grocery',
    featured: false,
    isBestSeller: true,
  },
  {
    name: 'Pure Vedic Gir Cow A2 Desi Bilona Ghee',
    hindiName: 'शुद्ध वैदिक गिर गाय ए२ देसी बिलोना घी',
    brand: 'NutriFlow',
    brandId: 'brand_nutriflow',
    brandSlug: 'nutriflow',
    category: 'Oils & Ghee',
    subCategory: 'A2 Cow Ghee',
    price: 650,
    mrp: 850,
    unit: '500ml Glass Jar',
    stockQuantity: 120,
    sku: 'HK-NF-A2GHEE-500ML',
    fssaiNumber: '10022011000456',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted using traditional Vedic Bilona method (curd churning) from grass-fed indigenous Gir cows. Rich golden granular texture with heavenly aroma.',
    features: ['Traditional Bilona churned from curd', '100% Pure A2 Gir cow milk', 'Golden granular texture & aroma', 'Packed in glass jar'],
    ingredients: ['100% Pure Clarified Butter (Gir Cow A2 Milk Fat)'],
    tags: 'ghee, a2 cow ghee, desi ghee, bilona, pure',
    featured: true,
    isBestSeller: true,
  },
];

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  initialOpenAdd,
  onResetInitialOpenAdd,
}) => {
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
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Full comprehensive form state
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    category: categories[0]?.name || 'Masala & Food',
    subCategory: 'Spices & Masala',
    brand: 'KITCHEN SHAKTI (Harwalkart)',
    brandId: 'brand_kitchen_shakti',
    brandSlug: 'kitchen-shakti',
    price: 120,
    mrp: 160,
    unit: '500g Pack',
    stockQuantity: 50,
    sku: `HK-${Math.floor(1000 + Math.random() * 9000)}`,
    fssaiNumber: '10022011000456',
    description: '100% pure authentic products manufactured under Harwalkart parent marketplace with transparent packaging.',
    features: ['100% pure ingredients', 'Zero adulteration warranty', 'FSSAI certified', 'Fast Pan-India delivery'],
    featureInput: '',
    sellerId: sellers[0]?.id || 'seller-hk-direct',
    isHarwalkartDirect: true,
    featured: false,
    isBestSeller: false,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    transparentPackagingImage: '',
    additionalImages: [] as string[],
    tags: 'pure, authentic, harwalkart, direct',
  });

  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  // Handle triggered add from Admin dashboard quick action
  useEffect(() => {
    if (initialOpenAdd) {
      handleOpenAdd();
      if (onResetInitialOpenAdd) onResetInitialOpenAdd();
    }
  }, [initialOpenAdd]);

  const discountPercent =
    formData.mrp > formData.price && formData.mrp > 0
      ? Math.round(((formData.mrp - formData.price) / formData.mrp) * 100)
      : 0;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.hindiName && p.hindiName.includes(searchTerm));

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'in_stock'
        ? p.inStock && p.stockQuantity > 5
        : !p.inStock || p.stockQuantity <= 5;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdd = () => {
    const defaultBrand = brands[0] || {
      name: 'Kitchen Shakti',
      id: 'brand_kitchen_shakti',
      slug: 'kitchen-shakti',
      category: 'Masala & Food',
    };

    setFormData({
      name: '',
      hindiName: '',
      category: defaultBrand.category || categories[0]?.name || 'Masala & Food',
      subCategory: 'Spices & Masala',
      brand: defaultBrand.name,
      brandId: defaultBrand.id,
      brandSlug: defaultBrand.slug,
      price: 120,
      mrp: 160,
      unit: '500g Pack',
      stockQuantity: 50,
      sku: `HK-${defaultBrand.slug.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      fssaiNumber: '10022011000456',
      description: '100% pure authentic products manufactured under Harwalkart parent marketplace with transparent packaging.',
      features: ['100% pure ingredients', 'Zero adulteration warranty', 'FSSAI certified', 'Fast Pan-India delivery'],
      featureInput: '',
      sellerId: sellers[0]?.id || 'seller_harwalkart_direct',
      isHarwalkartDirect: true,
      featured: false,
      isBestSeller: false,
      isPublished: true,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
      transparentPackagingImage: '',
      additionalImages: [],
      tags: 'pure, authentic, harwalkart',
    });
    setIsAddModalOpen(true);
  };

  const handleApplyPreset = (preset: typeof CURATED_PRODUCT_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      hindiName: preset.hindiName,
      brand: preset.brand,
      brandId: preset.brandId,
      brandSlug: preset.brandSlug,
      category: preset.category,
      subCategory: preset.subCategory,
      price: preset.price,
      mrp: preset.mrp,
      unit: preset.unit,
      stockQuantity: preset.stockQuantity,
      sku: preset.sku,
      fssaiNumber: preset.fssaiNumber,
      image: preset.image,
      transparentPackagingImage: preset.transparentPackagingImage,
      description: preset.description,
      features: preset.features,
      tags: preset.tags,
      featured: preset.featured,
      isBestSeller: preset.isBestSeller,
      isHarwalkartDirect: Boolean(preset.brandId),
    }));
    showToast(`Applied preset: ${preset.name.slice(0, 30)}...`);
  };

  const handleOpenEdit = (prod: Product) => {
    setSelectedProduct(prod);
    const extraImgs =
      prod.additionalImages && prod.additionalImages.length > 0
        ? prod.additionalImages
        : prod.images && prod.images.length > 1
        ? prod.images.slice(1)
        : [];

    setFormData({
      name: prod.name,
      hindiName: prod.hindiName || '',
      category: prod.category,
      subCategory: prod.subCategory || 'General',
      brand: prod.brand,
      brandId: prod.brandId || '',
      brandSlug: prod.brandSlug || '',
      price: prod.price,
      mrp: prod.mrp || Math.round(prod.price * 1.25),
      unit: prod.unit,
      stockQuantity: prod.stockQuantity,
      sku: prod.sku || `HK-${prod.id}`,
      fssaiNumber: prod.fssaiNumber || '10022011000456',
      description: prod.description,
      features: prod.features && prod.features.length > 0 ? prod.features : ['100% pure', 'FSSAI certified'],
      featureInput: '',
      sellerId: prod.sellerId,
      isHarwalkartDirect: prod.isHarwalkartDirect,
      featured: prod.featured || false,
      isBestSeller: prod.isBestSeller || false,
      isPublished: !prod.isDraft && prod.isPublished !== false,
      image: prod.productImage || prod.images[0] || '',
      transparentPackagingImage: prod.transparentPackagingImage || prod.packagingImage || '',
      additionalImages: extraImgs,
      tags: prod.tags?.join(', ') || '',
    });
    setIsEditModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!formData.featureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, prev.featureInput.trim()],
      featureInput: '',
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
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
      setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleMakePrimaryAdditional = (index: number) => {
    const chosen = formData.additionalImages[index];
    const prevPrimary = formData.image;
    const rest = formData.additionalImages.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      image: chosen,
      additionalImages: prevPrimary ? [prevPrimary, ...rest] : rest,
    }));
    showToast('Main product image updated.');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a product name.');
      return;
    }
    if (!formData.image.trim()) {
      showToast('Please upload or select a main product image.');
      return;
    }
    if (formData.price <= 0 || formData.mrp <= 0) {
      showToast('Selling Price and MRP must be greater than zero.');
      return;
    }
    if (formData.price > formData.mrp) {
      showToast('Selling price cannot exceed MRP.');
      return;
    }

    const sel = sellers.find((s) => s.id === formData.sellerId) || sellers[0] || {
      id: 'seller_harwalkart_direct',
      shopName: 'Harwalkart Official Store',
    };
    const discount = Math.max(0, Math.round(((formData.mrp - formData.price) / formData.mrp) * 100));
    const matchedBrand = brands.find(
      (b) => b.name.toLowerCase() === formData.brand.toLowerCase() || b.id === formData.brandId
    );
    const allImages = [formData.image, ...(formData.additionalImages || [])].filter(Boolean);

    addProduct({
      name: formData.name.trim(),
      hindiName: formData.hindiName.trim() || undefined,
      slug: `${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      brand: formData.brand.trim(),
      brandId: matchedBrand?.id || formData.brandId || undefined,
      brandSlug: matchedBrand?.slug || formData.brandSlug || undefined,
      sellerId: sel.id,
      sellerName: sel.shopName,
      isHarwalkartDirect: formData.isHarwalkartDirect,
      category: formData.category,
      subCategory: formData.subCategory,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      discountPercent: discount,
      inStock: Number(formData.stockQuantity) > 0,
      stockQuantity: Number(formData.stockQuantity),
      sku: formData.sku.trim() || undefined,
      fssaiNumber: formData.fssaiNumber.trim() || undefined,
      images: allImages.length > 0 ? allImages : [formData.image],
      productImage: formData.image,
      transparentPackagingImage: formData.transparentPackagingImage.trim() || undefined,
      packagingImage: formData.transparentPackagingImage.trim() || undefined,
      additionalImages: formData.additionalImages,
      unit: formData.unit.trim(),
      description: formData.description.trim(),
      features: formData.features.length > 0 ? formData.features : undefined,
      serviceablePincodes: ['*'],
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      approved: true,
      featured: formData.featured,
      isBestSeller: formData.isBestSeller,
      isDraft: !formData.isPublished,
      isPublished: formData.isPublished,
      isActive: true,
    });

    showToast(`Product "${formData.name}" added successfully!`);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!formData.name.trim()) {
      showToast('Please enter a product name.');
      return;
    }
    if (!formData.image.trim()) {
      showToast('Please upload or select a main product image.');
      return;
    }
    if (formData.price <= 0 || formData.mrp <= 0) {
      showToast('Selling Price and MRP must be greater than zero.');
      return;
    }
    if (formData.price > formData.mrp) {
      showToast('Selling price cannot exceed MRP.');
      return;
    }

    const discount = Math.max(0, Math.round(((formData.mrp - formData.price) / formData.mrp) * 100));
    const matchedBrand = brands.find(
      (b) => b.name.toLowerCase() === formData.brand.toLowerCase() || b.id === formData.brandId
    );
    const allImages = [formData.image, ...(formData.additionalImages || [])].filter(Boolean);

    updateProduct(selectedProduct.id, {
      name: formData.name.trim(),
      hindiName: formData.hindiName.trim() || undefined,
      brand: formData.brand.trim(),
      brandId: matchedBrand?.id || formData.brandId || undefined,
      brandSlug: matchedBrand?.slug || formData.brandSlug || undefined,
      category: formData.category,
      subCategory: formData.subCategory,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      discountPercent: discount,
      unit: formData.unit.trim(),
      stockQuantity: Number(formData.stockQuantity),
      inStock: Number(formData.stockQuantity) > 0,
      sku: formData.sku.trim() || undefined,
      fssaiNumber: formData.fssaiNumber.trim() || undefined,
      description: formData.description.trim(),
      features: formData.features.length > 0 ? formData.features : undefined,
      images: allImages.length > 0 ? allImages : [formData.image],
      productImage: formData.image,
      transparentPackagingImage: formData.transparentPackagingImage.trim() || undefined,
      packagingImage: formData.transparentPackagingImage.trim() || undefined,
      additionalImages: formData.additionalImages,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: formData.featured,
      isBestSeller: formData.isBestSeller,
      isDraft: !formData.isPublished,
      isPublished: formData.isPublished,
    });

    showToast(`Product "${formData.name}" updated successfully!`);
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-950">Marketplace Products</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  {products.length} Products
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Add and update products with transparent packaging, high-res photos, and inventory tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-add-product-btn"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, Hindi name, brand, or store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
          >
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock (Good)</option>
            <option value="low_stock">Low Stock / Out (&le;5)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="p-4 bg-slate-50/80 hover:bg-white hover:border-amber-400 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 text-xs transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white flex items-center justify-center">
                  <img
                    src={prod.images[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&auto=format&fit=crop&q=60'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {prod.transparentPackagingImage && (
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[7px] font-black text-center py-0.2">
                      POUCH
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black text-amber-700 uppercase truncate max-w-[130px]">
                      {prod.brand || prod.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md shrink-0 ${
                          !prod.isDraft && prod.isPublished !== false && prod.approved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {!prod.isDraft && prod.isPublished !== false ? 'Live' : 'Draft'}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          prod.isActive !== false ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {prod.isActive !== false ? 'Active' : 'Off'}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 truncate text-xs" title={prod.name}>
                    {prod.name}
                  </h4>
                  {prod.hindiName && (
                    <p className="text-slate-500 text-[10px] truncate">{prod.hindiName}</p>
                  )}
                  <p className="text-slate-500 text-[10px] truncate">Store: {prod.sellerName}</p>
                </div>
              </div>

              {/* Price & Stock info */}
              <div className="flex items-baseline gap-2 pt-1 border-t border-slate-200/60">
                <span className="text-base font-black text-slate-950">₹{prod.price}</span>
                {prod.mrp > prod.price && (
                  <span className="text-slate-400 line-through text-[11px]">₹{prod.mrp}</span>
                )}
                {prod.discountPercent > 0 && (
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                    {prod.discountPercent}% OFF
                  </span>
                )}
                <span className="text-slate-500 text-[10px]">/ {prod.unit}</span>
                <span
                  className={`ml-auto text-[10px] font-bold ${
                    prod.stockQuantity > 5 ? 'text-slate-700' : 'text-rose-600 font-black'
                  }`}
                >
                  Stock: {prod.stockQuantity}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const nextPublish = prod.isDraft || prod.isPublished === false;
                    toggleProductPublish(prod.id, nextPublish);
                    showToast(nextPublish ? `"${prod.name}" is now published live!` : `"${prod.name}" unpublished to draft.`);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                    !prod.isDraft && prod.isPublished !== false
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white font-black'
                  }`}
                >
                  {!prod.isDraft && prod.isPublished !== false ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => {
                    const nextActive = !(prod.isActive !== false);
                    toggleProductActive(prod.id, nextActive);
                    showToast(nextActive ? `"${prod.name}" enabled.` : `"${prod.name}" disabled.`);
                  }}
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
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer flex items-center gap-1"
                  title="Edit Product"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete product "${prod.name}"?`)) {
                      deleteProduct(prod.id);
                      showToast(`Product "${prod.name}" deleted.`);
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="font-bold text-slate-700 text-sm">No Products Found</div>
          <p className="text-xs text-slate-500">
            {searchTerm ? `No products match "${searchTerm}".` : 'Get started by creating your first product.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 cursor-pointer shadow-xs"
          >
            + Add New Product
          </button>
        </div>
      )}

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-5 animate-in zoom-in-95 text-xs max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {isAddModalOpen ? 'Create New Marketplace Product' : `Update Product: ${selectedProduct?.name}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isAddModalOpen
                      ? 'Add a fresh product to Harwalkart with full pricing, stock, and photos.'
                      : 'Modify product specifications, pricing, transparency packaging, or imagery.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 1-Click Fast Presets (Visible when Adding) */}
            {isAddModalOpen && (
              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Instant Flagship Presets (1-Click Fill):</span>
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold">Select any product to load details</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CURATED_PRODUCT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="p-2 bg-white rounded-xl border border-amber-200/60 hover:border-amber-500 text-left transition cursor-pointer hover:shadow-2xs"
                    >
                      <div className="text-[11px] font-black text-slate-900 truncate">
                        {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
                      </div>
                      <div className="text-[10px] text-amber-700 font-bold">₹{preset.price} / {preset.unit}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Product Name and Hindi Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-bold"
                    placeholder="e.g. Kitchen Shakti Turmeric Powder"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Regional / Hindi Name</label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none"
                    placeholder="e.g. किचन शक्ति शुद्ध हल्दी पाउडर"
                  />
                </div>
              </div>

              {/* Brand and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Brand *</span>
                    <span className="text-[10px] text-amber-800 font-bold">Harwalkart/Merchant</span>
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => {
                      const selectedB = brands.find((b) => b.name === e.target.value);
                      if (selectedB) {
                        setFormData({
                          ...formData,
                          brand: selectedB.name,
                          brandId: selectedB.id,
                          brandSlug: selectedB.slug,
                          category: selectedB.category || formData.category,
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
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-amber-50/40 font-bold text-slate-900 outline-none"
                  >
                    <optgroup label="Official Harwalkart Brands">
                      {brands.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name} ({b.category})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other / Local Brands">
                      <option value="Local Merchant Brand">Local Merchant Brand</option>
                      <option value="India Gate">India Gate</option>
                      <option value="Amul">Amul</option>
                      <option value="Tata">Tata</option>
                      <option value="Patanjali">Patanjali</option>
                      <option value="Fortune">Fortune</option>
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Sub-Category</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none"
                    placeholder="e.g. Spices, Cold Pressed, Pulses"
                  />
                </div>
              </div>

              {/* Pricing, Discount, and Stock */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs">Pricing &amp; Inventory</span>
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      <span>{discountPercent}% Customer Savings (₹{formData.mrp - formData.price} off)</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-black text-slate-950 text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Stock Qty *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Unit / Pack Size *</label>
                    <input
                      type="text"
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold outline-none"
                      placeholder="e.g. 500g, 1kg, 1L"
                    />
                  </div>
                </div>
              </div>

              {/* SKU, FSSAI, and Merchant */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">SKU / Item Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-[11px] outline-none"
                    placeholder="e.g. HK-KS-HALDI-200G"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">FSSAI License / Number</label>
                  <input
                    type="text"
                    value={formData.fssaiNumber}
                    onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-[11px] outline-none"
                    placeholder="e.g. 10022011000456"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Selling Merchant / Shop</label>
                  <select
                    value={formData.sellerId}
                    onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none font-medium"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shopName} ({s.city || 'Delhi'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Product Visuals &amp; Transparent Packaging Photos</span>
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    High Purity Guarantee
                  </span>
                </div>

                {/* 1. Main Product Image */}
                <ImageUploadField
                  label="1. Main Product Primary Image *"
                  sublabel="The primary high-resolution photo displayed across product cards, catalogs, and search results."
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  role="admin"
                  imageType="main"
                  folder="products"
                  required
                />

                {/* 2. Transparent Packaging Image */}
                <ImageUploadField
                  label="2. Transparent Packaging View (Stand-up Pouch / Clear Jar)"
                  sublabel="Direct photo showing clear stand-up pouch / see-through packaging for 100% customer trust and zero hidden adulteration."
                  value={formData.transparentPackagingImage}
                  onChange={(url) => setFormData({ ...formData, transparentPackagingImage: url })}
                  role="admin"
                  imageType="packaging"
                  folder="products"
                  helpNote="Recommended: Shows raw spices/grains inside the transparent food-grade pouch."
                />

                {/* 3. Additional Gallery Images */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800">
                        3. Additional Product Gallery Images ({formData.additionalImages.length})
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

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Describe the product purity, source, packaging, and culinary or wellness use..."
                />
              </div>

              {/* Key Features Bullet Points */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Key Features / Quality USPs</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.featureInput}
                    onChange={(e) => setFormData({ ...formData, featureInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 p-2 border border-slate-200 rounded-xl outline-none"
                    placeholder="e.g. 100% Pure Guntur Chilli cold-ground"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
                  >
                    + Add USP
                  </button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5"
                      >
                        <span>✓ {feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-amber-700 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Tags */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Search Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none"
                  placeholder="masala, spice, pure, kitchen shakti"
                />
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500"
                  />
                  <span>Publish Live</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500"
                  />
                  <span>Featured Item</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500"
                  />
                  <span>Best Seller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isHarwalkartDirect}
                    onChange={(e) => setFormData({ ...formData, isHarwalkartDirect: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500"
                  />
                  <span>Harwalkart Direct</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black rounded-xl cursor-pointer shadow-xs transition-all hover:scale-101 text-sm"
              >
                {isAddModalOpen ? 'Save & Add Product to Catalog' : 'Save Product Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
