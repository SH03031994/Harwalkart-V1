import React from 'react';
import { Product } from '../../types';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface TransparentPackagingVisualProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TransparentPackagingVisual: React.FC<TransparentPackagingVisualProps> = ({
  product,
  size = 'md',
  className = '',
}) => {
  // Determine appropriate packaging style based on category / packagingType / brand
  const packagingType =
    product.packagingType ||
    (product.category?.toLowerCase().includes('masala') || product.category?.toLowerCase().includes('spice')
      ? 'Transparent Stand-up Pouch'
      : product.category?.toLowerCase().includes('pulses') || product.category?.toLowerCase().includes('dal') || product.category?.toLowerCase().includes('grain')
      ? 'Transparent Food-Grade Pouch'
      : product.category?.toLowerCase().includes('dry fruit')
      ? 'Clear Food-Grade Jar'
      : product.category?.toLowerCase().includes('beauty') || product.category?.toLowerCase().includes('personal') || product.brandSlug === 'rupabhoom'
      ? 'Frosted Beauty Bottle'
      : product.category?.toLowerCase().includes('clean') || product.category?.toLowerCase().includes('household') || product.brandSlug === 'grahshorya'
      ? 'Transparent Clear Bottle'
      : 'Transparent Stand-up Pouch');

  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80';

  const isPouch = packagingType.toLowerCase().includes('pouch');
  const isJar = packagingType.toLowerCase().includes('jar');
  const isBottle = packagingType.toLowerCase().includes('bottle') || packagingType.toLowerCase().includes('spray');

  const getContainerStyles = () => {
    if (isPouch) {
      return 'rounded-2xl border-2 border-white/60 shadow-md';
    }
    if (isJar) {
      return 'rounded-3xl border-2 border-white/80 shadow-md';
    }
    if (isBottle) {
      return 'rounded-3xl border-2 border-white/70 shadow-md';
    }
    return 'rounded-2xl border-2 border-white/60 shadow-md';
  };

  const getBrandBadgeColor = () => {
    const b = (product.brand || '').toLowerCase();
    if (b.includes('kitchen') || product.brandSlug === 'kitchen-shakti') {
      return {
        bg: 'bg-amber-500 text-slate-950',
        label: 'KITCHEN SHAKTI',
        border: 'border-amber-400',
      };
    }
    if (b.includes('nutri') || product.brandSlug === 'nutriflow') {
      return {
        bg: 'bg-emerald-600 text-white',
        label: 'NUTRIFLOW',
        border: 'border-emerald-500',
      };
    }
    if (b.includes('rupa') || product.brandSlug === 'rupabhoom') {
      return {
        bg: 'bg-rose-600 text-white',
        label: 'RUPABHOOM™',
        border: 'border-rose-400',
      };
    }
    if (b.includes('shorya') || product.brandSlug === 'grahshorya') {
      return {
        bg: 'bg-teal-600 text-white',
        label: 'GRAHSHORYA™',
        border: 'border-teal-400',
      };
    }
    return {
      bg: 'bg-slate-900 text-white',
      label: product.brand.slice(0, 16).toUpperCase(),
      border: 'border-slate-700',
    };
  };

  const brandStyle = getBrandBadgeColor();

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* Product Raw Photography with Light Glow Behind */}
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Transparent Packaging Clear Overlay / Gloss Shimmer Effect */}
      <div className="absolute inset-2 z-10 pointer-events-none flex flex-col justify-between p-2">
        {/* Top Packaging Seal / Zip-lock Bar on Stand-up Pouches */}
        {isPouch && (
          <div className="w-full flex items-center justify-between bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-t-lg border-b border-slate-300/60 shadow-xs">
            <span className="text-[8px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
              Zipper Air-Tight Seal
            </span>
            <span className="text-[8px] font-bold text-slate-700">100% PURE</span>
          </div>
        )}

        {/* Jar or Bottle Top Cap */}
        {(isJar || isBottle) && (
          <div className="w-full flex items-center justify-between bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-t-xl border-b border-slate-300/60 shadow-xs">
            <span className="text-[8px] font-black uppercase text-slate-800 tracking-wider">
              {isJar ? 'Airtight Glass Jar' : 'Tamper-Proof Bottle'}
            </span>
            <span className="text-[8px] font-bold text-amber-700">FSSAI Grade</span>
          </div>
        )}

        {/* Center Transparent Window with Glass Reflection Highlights */}
        <div className="relative my-auto flex items-center justify-center">
          {/* Packaging Glass Reflection Sheen */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-white/20 via-transparent to-white/30 rounded-xl pointer-events-none" />
        </div>

        {/* Front Packaging Branded Label */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-2 border border-slate-200/90 shadow-md flex flex-col gap-1 mt-auto">
          <div className="flex items-center justify-between gap-1">
            <span
              className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${brandStyle.bg}`}
            >
              {brandStyle.label}
            </span>
            <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-700">
              <div className="w-2.5 h-2.5 border border-emerald-600 flex items-center justify-center rounded-xs bg-white">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </div>
              <span>Pure</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-1">
            <div className="text-[10px] sm:text-[11px] font-black text-slate-900 truncate leading-tight">
              {product.name}
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] font-bold text-slate-600 pt-0.5 border-t border-slate-200/80">
            <span className="text-amber-800 font-extrabold">{product.unit || 'Standard Pack'}</span>
            <span className="text-slate-500 truncate max-w-[100px]">{packagingType}</span>
          </div>
        </div>
      </div>

      {/* Transparent Packaging Badge */}
      <div className="absolute top-2 right-2 z-20">
        <span className="bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[8px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/40 shadow-xs flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          Clear Packaging
        </span>
      </div>
    </div>
  );
};
