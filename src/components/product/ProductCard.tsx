import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, ShoppingCart, Share2, Heart, Zap, CheckCircle2, Shield } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    openShareModal,
    setSelectedProductId,
    setCurrentView,
  } = useApp();

  const isLiked = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    openShareModal({
      title: product.name,
      text: `Buy ${product.name} at ₹${product.price} (MRP ₹${product.mrp}, ${product.discountPercent}% OFF) on HARWALKART.`,
      url: `https://harwalkart.com/product/${product.slug}`,
      type: 'product',
      item: product,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.isHarwalkartDirect ? (
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Shield className="w-3 h-3 text-slate-950" />
            Harwalkart Direct
          </span>
        ) : (
          <span className="bg-slate-900 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-xs">
            Local Shop
          </span>
        )}

        {product.discountPercent > 0 && (
          <span className="bg-rose-500 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-sm w-max">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist & Share Action Buttons */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-colors shadow-xs ${
            isLiked
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-amber-600 flex items-center justify-center backdrop-blur-xs shadow-xs transition-colors"
          title="Share Product Link"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Brand & Unit */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
            <span className="font-semibold uppercase tracking-wider text-amber-900 truncate">
              {product.brand}
            </span>
            <span className="text-slate-500 font-medium shrink-0">{product.unit}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Hindi Name if available */}
          {product.hindiName && (
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{product.hindiName}</p>
          )}

          {/* Seller / Local Shop details */}
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
            <span>Sold by:</span>
            <span className="font-semibold text-slate-700 truncate">{product.sellerName}</span>
          </p>
        </div>

        <div>
          {/* Rating & Review */}
          <div className="flex items-center gap-1.5 my-1">
            <div className="flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-black px-1.5 py-0.2 rounded-md">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price & MRP */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base sm:text-lg font-black text-slate-950">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
            )}
            <span className="text-[11px] font-bold text-emerald-700 ml-auto">
              Save ₹{product.mrp - product.price}
            </span>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className="py-2 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>

            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleBuyNow}
              className="py-2 px-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
