import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  CheckCircle2,
  ArrowLeft,
  MapPin,
  Lock,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    currentLocation,
    customerUser,
    placeOrder,
    setCurrentView,
    setSelectedTrackingOrderId,
  } = useApp();

  const [fullName, setFullName] = useState(customerUser.name || '');
  const [mobile, setMobile] = useState(customerUser.phone || '');
  const [email, setEmail] = useState(customerUser.email || '');
  const [addressLine, setAddressLine] = useState(customerUser.savedAddresses[0]?.addressLine || '');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState(currentLocation.pincode);
  const [area, setArea] = useState(currentLocation.area);
  const [city, setCity] = useState(currentLocation.city);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        sellerName: item.product.sellerName,
        sellerId: item.product.sellerId,
      }));

      const createdOrder = placeOrder({
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryCharge: cartDeliveryFee,
        discount: cartDiscount,
        taxAmount: Math.round(cartSubtotal * 0.05),
        total: cartTotal,
        deliveryAddress: {
          fullName,
          mobile,
          addressLine,
          area,
          city,
          pincode,
          state: 'India',
          landmark,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        estimatedDelivery: 'Today by 7:30 PM (or 2-3 days for Kitchen Shakti Pan-India)',
      });

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      setIsProcessing(false);
      setSelectedTrackingOrderId(createdOrder.id);
      setCurrentView('order-tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentView('cart')}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-slate-950">Secure Checkout & Delivery</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Address & Payment (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Customer & Address Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-black text-slate-900">Delivery Contact & Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (For OTP Delivery) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit PIN"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Local Area / Locality *</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="e.g. Connaught Place"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. New Delhi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">House / Flat No., Building & Street *</label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={e => setAddressLine(e.target.value)}
                placeholder="e.g. Flat 302, Green Valley Apartments, Main Market Road"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nearby Landmark (Optional)</label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="e.g. Near Shiv Temple / Metro Gate 2"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-black text-slate-900">Select Payment Method (India)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* UPI Option */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Instant UPI / QR / Apps</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Google Pay, PhonePe, Paytm, BHIM UPI
                  </p>
                </div>
              </label>

              {/* Cards Option */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>Credit & Debit Cards</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Visa, MasterCard, RuPay, Maestro
                  </p>
                </div>
              </label>

              {/* NetBanking */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>Net Banking</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    SBI, HDFC, ICICI, Axis, PNB & 50+ Banks
                  </p>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pay with Cash or UPI upon package arrival
                  </p>
                </div>
              </label>
            </div>

            {/* UPI Dynamic Entry */}
            {paymentMethod === 'upi' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">Enter UPI ID / VPA</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210@paytm or yourname@oksbi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
                <p className="text-[11px] text-slate-500">
                  Or simply click Place Order to scan the QR code on payment gateway.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Final Review & Place Order (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
              Order Summary ({cart.length} items)
            </h3>

            {/* Item Mini Thumbnails */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-slate-800 shrink-0">{item.quantity}x</span>
                    <span className="text-slate-600 truncate">{item.product.name}</span>
                  </div>
                  <span className="font-black text-slate-950 shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-emerald-600">
                  {cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="font-bold text-slate-900">₹{Math.round(cartSubtotal * 0.05)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-950">To Pay</span>
                <span className="text-2xl font-black text-slate-950">₹{cartTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Generating Order & Confirming...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • ₹{cartTotal}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              By confirming, you authorize HARWALKART to dispatch products as per Indian consumer guidelines.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
