import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Sparkles,
  Info,
  Coins,
} from 'lucide-react';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { Order, PaymentTransactionDetails } from '../../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    currentLocation,
    customerUser,
    authSession,
    placeOrder,
    setCurrentView,
    setSelectedTrackingOrderId,
    showToast,
    loyaltyBalance,
    loyaltyTier,
    calculatePointsForAmount,
  } = useApp();

  const [fullName, setFullName] = useState(customerUser.name || '');
  const [mobile, setMobile] = useState(customerUser.phone || '');
  const [email, setEmail] = useState(customerUser.email || '');
  const [addressLine, setAddressLine] = useState(customerUser.savedAddresses[0]?.addressLine || '');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState(currentLocation.pincode);
  const [area, setArea] = useState(currentLocation.area);
  const [city, setCity] = useState(currentLocation.city);
  
  // Loyalty Points integration
  const activeCustomer = authSession.customer || customerUser;
  const userLoyaltyPoints = loyaltyBalance ?? activeCustomer?.loyaltyPoints ?? 340;
  const [applyLoyaltyPoints, setApplyLoyaltyPoints] = useState(false);
  const loyaltyDiscount = applyLoyaltyPoints ? Math.min(userLoyaltyPoints, Math.floor(cartSubtotal * 0.5)) : 0;
  const finalPayableTotal = Math.max(0, cartTotal - loyaltyDiscount);
  const expectedPointsEarned = calculatePointsForAmount
    ? calculatePointsForAmount(finalPayableTotal, loyaltyTier)
    : Math.max(1, Math.round(finalPayableTotal / 10));

  // Payment Mode selection: 'online' or 'cod'
  const [paymentChoice, setPaymentChoice] = useState<'online' | 'cod'>('online');
  const [isProcessingCod, setIsProcessingCod] = useState(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);

  // Gateway config state for indicator
  const [gatewayInfo, setGatewayInfo] = useState<{
    mode: 'test' | 'live';
    isLiveConfigured: boolean;
  }>({ mode: 'test', isLiveConfigured: false });

  useEffect(() => {
    fetch('/api/payment/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGatewayInfo({
            mode: data.mode,
            isLiveConfigured: data.isLiveConfigured,
          });
        }
      })
      .catch(() => {});
  }, []);

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

  const orderBasePayload = {
    items: orderItems,
    subtotal: cartSubtotal,
    deliveryCharge: cartDeliveryFee,
    discount: cartDiscount + loyaltyDiscount,
    taxAmount: Math.round(cartSubtotal * 0.05),
    total: finalPayableTotal,
    loyaltyPointsUsed: loyaltyDiscount,
    loyaltyPointsEarned: expectedPointsEarned,
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
    estimatedDelivery: 'Today by 7:30 PM (or 2-3 days for Kitchen Shakti Pan-India)',
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      showToast('Please enter customer full name.');
      return false;
    }
    if (!mobile.trim() || mobile.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!pincode.trim() || pincode.length < 6) {
      showToast('Please enter a valid 6-digit delivery PIN code.');
      return false;
    }
    if (!addressLine.trim()) {
      showToast('Please enter complete house/building address.');
      return false;
    }
    return true;
  };

  // 1. Handle Submit Form
  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentChoice === 'online') {
      // Open Real Payment Gateway Flow
      setIsGatewayModalOpen(true);
    } else {
      // Cash on Delivery Direct Place Order
      handlePlaceCodOrder();
    }
  };

  // 2. Handle Cash on Delivery Flow
  const handlePlaceCodOrder = () => {
    setIsProcessingCod(true);

    setTimeout(() => {
      const createdOrder = placeOrder({
        ...orderBasePayload,
        paymentMethod: 'cod',
        paymentStatus: 'COD_PENDING',
      });

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      setIsProcessingCod(false);
      showToast(`Order #${createdOrder.id} placed successfully with Cash on Delivery! 📦`);
      setSelectedTrackingOrderId(createdOrder.id);
      setCurrentView('order-tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  // 3. Handle Gateway Verified Payment Success
  const handleOnlinePaymentVerified = (verifiedOrder: Order, transaction: PaymentTransactionDetails) => {
    setIsGatewayModalOpen(false);

    // Synchronize to context if not already synced
    const finalOrder = placeOrder({
      ...orderBasePayload,
      paymentMethod: 'online',
      paymentStatus: 'PAID',
      paymentTransaction: transaction,
    });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    showToast(`Payment Verified & Confirmed! Order #${finalOrder.id || verifiedOrder.id} is booked. ✅`);
    setSelectedTrackingOrderId(finalOrder.id || verifiedOrder.id);
    setCurrentView('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Handle Gateway Payment Failure or Cancellation
  const handleOnlinePaymentFailed = (errorMsg: string) => {
    showToast(`Payment Cancelled or Failed: ${errorMsg}`);
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
        <div>
          <h1 className="text-2xl font-black text-slate-950">Secure Checkout & Delivery</h1>
          <p className="text-xs text-slate-500">
            Real Payment Gateway Verification & Cash on Delivery
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Address & Payment (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Customer & Address Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="text-base font-black text-slate-900">Delivery Contact & Address</h2>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                100% Verified Delivery
              </span>
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nearby Landmark (Optional)</label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="e.g. Near Shiv Temple / Metro Gate 2"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 2. Clear Payment Options (Online vs COD) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-base font-black text-slate-900">Choose Payment Option</h2>
              </div>

              {paymentChoice === 'online' && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Real Gateway Checkout</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: Online Payment */}
              <label
                className={`p-5 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  paymentChoice === 'online'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-300 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentChoice"
                  checked={paymentChoice === 'online'}
                  onChange={() => setPaymentChoice('online')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-950">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>Online Payment</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      Instant
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, NetBanking & Wallets.
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-500">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Cryptographic Gateway Verification</span>
                  </div>
                </div>
              </label>

              {/* Option 2: Cash on Delivery */}
              <label
                className={`p-5 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  paymentChoice === 'cod'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-300 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentChoice"
                  checked={paymentChoice === 'cod'}
                  onChange={() => setPaymentChoice('cod')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-950">
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Doorstep Pay
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    Pay with Cash or scan Delivery Rider's UPI QR upon physical package delivery.
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-500">
                    <Truck className="w-3 h-3 text-amber-600" />
                    <span>OTP Delivery Confirmation</span>
                  </div>
                </div>
              </label>

            </div>

            {/* Gateway Information Callout */}
            {paymentChoice === 'online' ? (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-700">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">
                    Real Gateway Flow Notice:
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Clicking &quot;Pay Now via Real Gateway&quot; will open the secure gateway checkout with your selected UPI app, Card 3D-Secure OTP verification, or NetBanking. Order is only confirmed after cryptographic server verification.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Cash on Delivery Rules:</p>
                  <p className="text-[11px] text-amber-800">
                    Please keep exact cash ₹{cartTotal} ready. Our delivery executive will verify your package transparently before handing it over.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Final Review & Place Order (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-slate-500">{cart.length} items</span>
            </h3>

            {/* Item Mini Thumbnails */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
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
                <span>Delivery Charge</span>
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
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Loyalty Points Discount ({loyaltyDiscount} pts)</span>
                  <span>-₹{loyaltyDiscount}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-950">Total Payable</span>
                <span className="text-2xl font-black text-slate-950">₹{finalPayableTotal}</span>
              </div>
            </div>

            {/* Loyalty Points Earning & Redemption Banner */}
            <div className="space-y-2.5">
              {userLoyaltyPoints > 0 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-slate-900">
                        Redeem Loyalty Points ({userLoyaltyPoints} available)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Use up to ₹{Math.min(userLoyaltyPoints, Math.floor(cartSubtotal * 0.5))} off on this order
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApplyLoyaltyPoints(!applyLoyaltyPoints)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                      applyLoyaltyPoints
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {applyLoyaltyPoints ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
              )}

              <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 text-xs">
                  🪙
                </div>
                <div className="text-emerald-950 font-medium leading-tight">
                  You will earn <strong className="font-black text-emerald-900">+{expectedPointsEarned} Loyalty Points</strong> on this order!
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            {paymentChoice === 'online' ? (
              <button
                type="submit"
                className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Pay Now via Real Gateway • ₹{finalPayableTotal}</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isProcessingCod}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingCod ? (
                  <span>Booking COD Order...</span>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Place Order (Cash on Delivery) • ₹{finalPayableTotal}</span>
                  </>
                )}
              </button>
            )}

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Harwalkart Consumer Guarantee</span>
              </div>
              <p>
                100% Pure Transparent Packaging inspection before accepting order.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Gateway Checkout Modal */}
      {isGatewayModalOpen && (
        <PaymentGatewayModal
          isOpen={isGatewayModalOpen}
          onClose={() => setIsGatewayModalOpen(false)}
          orderAmount={cartTotal}
          customerDetails={{
            fullName,
            mobile,
            email,
            addressLine,
            city,
            pincode,
          }}
          orderDetails={orderBasePayload}
          onPaymentSuccess={handleOnlinePaymentVerified}
          onPaymentFailure={handleOnlinePaymentFailed}
        />
      )}
    </div>
  );
};
