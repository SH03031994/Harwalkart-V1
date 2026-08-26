import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { INITIAL_REVIEWS } from '../../data/mockData';
import {
  Star,
  ShoppingCart,
  Zap,
  Share2,
  Heart,
  Truck,
  ShieldCheck,
  Award,
  Store,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    products,
    sellers,
    currentLocation,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openShareModal,
    setCurrentView,
    setSelectedShopId,
    showToast,
  } = useApp();

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const seller = sellers.find(s => s.id === product.sellerId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [quantity, setQuantity] = useState(1);
  const [checkPincode, setCheckPincode] = useState(currentLocation.pincode);
  const [pinStatus, setPinStatus] = useState<string | null>(null);

  // Review submission state
  const [reviews, setReviews] = useState(INITIAL_REVIEWS.filter(r => r.productId === product.id));
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newUserName, setNewUserName] = useState('');

  const isLiked = isInWishlist(product.id);

  // Check pin code delivery logic
  const handleVerifyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(checkPincode.trim())) {
      setPinStatus('invalid');
      return;
    }
    const isServiceable =
      product.serviceablePincodes.includes('*') ||
      product.serviceablePincodes.includes(checkPincode.trim());

    setPinStatus(isServiceable ? 'available' : 'unavailable');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newRev = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      userName: newUserName.trim() || 'Verified Customer',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      verifiedPurchase: true,
      helpfulCount: 0,
    };
    setReviews(prev => [newRev, ...prev]);
    setNewComment('');
    setNewUserName('');
    showToast('Aapka review submit ho gaya hai! Dhanyawad. ⭐');
  };

  const handleShare = () => {
    openShareModal({
      title: product.name,
      text: `Check out ${product.name} on HARWALKART. Price: ₹${product.price} (MRP: ₹${product.mrp}). 100% genuine and fast local delivery!`,
      url: `https://harwalkart.com/product/${product.slug}`,
      type: 'product',
      item: product,
    });
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.approved)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-in fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setCurrentView('home')}
          className="hover:text-amber-600 flex items-center gap-1 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <button
          onClick={() => setCurrentView('products')}
          className="hover:text-amber-600 cursor-pointer shrink-0"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-slate-800 font-bold truncate">{product.name}</span>
      </div>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        {/* Left Column: Image / Video Media (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Photos vs Video Tab Toggle */}
          {product.videoUrl && (
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-max text-xs font-bold">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeMediaTab === 'photos'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Photos ({product.images.length})
              </button>
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Product Video</span>
              </button>
            </div>
          )}

          {/* Primary Viewport */}
          <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
            {activeMediaTab === 'video' && product.videoUrl ? (
              <video
                src={product.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isHarwalkartDirect ? (
                <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Harwalkart Direct
                </span>
              ) : (
                <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                  Verified Local Shop
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="bg-rose-600 text-white text-xs font-black px-2 py-0.5 rounded-sm w-max">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Floating actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-xs transition-colors ${
                  isLiked
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-slate-700 hover:text-rose-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-amber-600 flex items-center justify-center shadow-md transition-colors"
                title="Share Product Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setActiveMediaTab('photos');
                  }}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImageIndex === idx && activeMediaTab === 'photos'
                      ? 'border-amber-500 ring-2 ring-amber-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specifications, Pricing & Actions (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Hindi Name */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 mt-2 leading-tight">
                {product.name}
              </h1>
              {product.hindiName && (
                <p className="text-sm font-semibold text-slate-600 mt-1">{product.hindiName}</p>
              )}
            </div>

            {/* Ratings & Verification */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {product.reviewCount} Verified Customer Ratings
              </span>
              {product.fssaiNumber && (
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  FSSAI Lic. #{product.fssaiNumber}
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-950">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-base text-slate-400 line-through">MRP ₹{product.mrp}</span>
              )}
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                Save ₹{product.mrp - product.price} ({product.discountPercent}% OFF)
              </span>
              <span className="text-xs text-slate-500 block w-full mt-1">
                Inclusive of all taxes ({seller?.isGstRegistered ? 'GST invoice provided' : 'Micro Local trade'}) • Net Unit: <strong>{product.unit}</strong>
              </span>
            </div>

            {/* Seller Info Card */}
            {seller && (
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 overflow-hidden shrink-0">
                    <img src={seller.logo} alt={seller.shopName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">{seller.shopName}</h4>
                      {seller.verified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 fill-sky-100" />}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {seller.address.area}, {seller.address.city} •{' '}
                      {seller.isHarwalkartDirect ? 'Pan-India Warehouse' : `${seller.distanceKm} km away`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedShopId(seller.id);
                    setCurrentView('shop-detail');
                  }}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shrink-0"
                >
                  Visit Shop
                </button>
              </div>
            )}

            {/* PIN Code Delivery Checker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Check Delivery at your PIN Code
              </label>
              <form onSubmit={handleVerifyPincode} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  value={checkPincode}
                  onChange={e => {
                    setCheckPincode(e.target.value.replace(/\D/g, ''));
                    setPinStatus(null);
                  }}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Check
                </button>
              </form>

              {pinStatus === 'available' && (
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Eligible for delivery at {checkPincode}! Estimated: {product.isHarwalkartDirect ? '2-3 Business Days (Express)' : 'Today by 7:00 PM'}
                </p>
              )}
              {pinStatus === 'unavailable' && (
                <p className="text-xs font-semibold text-rose-600 mt-1">
                  Sorry, this local shop currently does not deliver to PIN {checkPincode}. Try our Kitchen Shakti Pan-India range!
                </p>
              )}
            </div>

            {/* Quantity Selector & Action CTAs */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 font-black text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 font-black text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Total: <strong>₹{product.price * quantity}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product, quantity)}
                  className="py-3.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={() => {
                    addToCart(product, quantity);
                    setCurrentView('cart');
                  }}
                  className="py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description, Ingredients & Health Benefits Tabs */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3">
          Product Details & Authentic Sourcing Story
        </h3>

        <div className="prose max-w-none text-slate-700 text-sm leading-relaxed">
          <p>{product.description}</p>
        </div>

        {product.ingredients && product.ingredients.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
              100% Pure Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span key={i} className="bg-white border border-slate-300 text-xs font-medium px-3 py-1 rounded-lg text-slate-800">
                  🌱 {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.benefits && product.benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
              Key Quality Benefits
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              {product.benefits.map((ben, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Customer Ratings & Reviews</h3>
            <p className="text-xs text-slate-500">Real feedback from verified Harwalkart buyers</p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <span className="text-xl font-black text-emerald-800">{product.rating}</span>
            <div className="text-[11px] text-emerald-900 font-semibold">
              <div>out of 5 Stars</div>
              <div>{reviews.length + product.reviewCount} Ratings</div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
            Write a Review for {product.name}
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Your Rating:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setNewRating(star)}
                className="text-amber-400 p-0.5 cursor-pointer"
              >
                <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Your Name (e.g. Anjali Verma)"
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <textarea
            required
            rows={2}
            placeholder="Share your experience with this product's quality, taste, freshness or delivery..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Submit Review
          </button>
        </form>

        {/* Existing Reviews List */}
        <div className="space-y-3">
          {reviews.map(rev => (
            <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-sm">
                      Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900">Similar Products You Might Like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
