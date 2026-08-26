import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_COUPONS } from '../../data/mockData';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  ArrowLeft,
  X,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
    currentLocation,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponFeedback(res);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your HARWALKART Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explore authentic Kitchen Shakti spices or order daily grocery essentials from your nearby local shops.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentView('kitchen-shakti')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            Shop Kitchen Shakti
          </button>
          <button
            onClick={() => setCurrentView('shops')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
          >
            Explore Local Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('products')}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-black text-slate-950">Shopping Cart ({cart.length} items)</h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Delivering to Pill */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-700" />
              <span className="text-slate-700">Delivering to:</span>
              <strong className="text-slate-900">{currentLocation.area}, {currentLocation.city} ({currentLocation.pincode})</strong>
            </div>
            {cartDeliveryFee === 0 ? (
              <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md text-[10px] uppercase">
                Free Delivery Applied
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">
                Add ₹{499 - cartSubtotal} more for FREE Delivery
              </span>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {cart.map(item => (
              <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 p-1">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {item.product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 truncate">{item.product.name}</h3>
                    <p className="text-xs text-slate-500">
                      Unit: {item.product.unit} • Sold by: <span className="font-semibold text-slate-700">{item.product.sellerName}</span>
                    </p>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-sm font-black text-slate-950">₹{item.product.price}</span>
                      {item.product.mrp > item.product.price && (
                        <span className="text-xs text-slate-400 line-through">₹{item.product.mrp}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 px-2.5 text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 px-2.5 text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-black text-slate-950">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Coupons (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Code Box */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>Apply Harwalkart Coupon</span>
            </div>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-emerald-800">{appliedCoupon}</span>
                  <p className="text-[11px] text-emerald-700 font-semibold">Discount applied on order</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. HARWAL100)"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold uppercase"
                />
                <button
                  onClick={() => handleApplyCoupon(couponInput)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}

            {couponFeedback && !appliedCoupon && (
              <p className={`text-xs font-semibold ${couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                {couponFeedback.message}
              </p>
            )}

            {/* Quick Available Coupons */}
            <div className="pt-2 space-y-1.5">
              <p className="text-[11px] text-slate-400 font-bold uppercase">Available Offers:</p>
              {AVAILABLE_COUPONS.map(c => (
                <div
                  key={c.code}
                  onClick={() => handleApplyCoupon(c.code)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 flex items-center justify-between cursor-pointer text-xs"
                >
                  <div>
                    <span className="font-bold text-amber-800">{c.code}</span>
                    <p className="text-[10px] text-slate-500">{c.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 hover:text-amber-800">
                    Apply
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
              Bill Details & GST Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated GST & Tax (5%)</span>
                <span className="font-bold text-slate-900">₹{Math.round(cartSubtotal * 0.05)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                {cartDeliveryFee === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">₹{cartDeliveryFee}</span>
                )}
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Harwalkart Coupon Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-slate-950 block">Grand Total</span>
                  <span className="text-[10px] text-slate-400">Includes all GST & local duties</span>
                </div>
                <span className="text-2xl font-black text-slate-950">₹{cartTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure Indian Payment Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
