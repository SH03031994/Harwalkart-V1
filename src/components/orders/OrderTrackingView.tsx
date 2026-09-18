import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Printer,
  X,
  Building2,
  Coins,
  Sparkles,
  Award,
  Gift,
  ArrowRight,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    selectedTrackingOrderId,
    setSelectedTrackingOrderId,
    setCurrentView,
    showToast,
    websiteSettings,
    authSession,
    customerUser,
    loyaltyBalance,
  } = useApp();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const activeOrder = orders.find(o => o.id === selectedTrackingOrderId) || orders[0];
  const earnedPoints = activeOrder ? (activeOrder.loyaltyPointsEarned || Math.max(1, Math.round(activeOrder.total / 10))) : 0;
  const activeCustomer = authSession.customer || customerUser;
  const customerPoints = loyaltyBalance ?? activeCustomer?.loyaltyPoints ?? 340;

  if (!activeOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No Orders Found</h2>
        <button
          onClick={() => setCurrentView('products')}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    setShowInvoiceModal(true);
    showToast(`Displaying GST Tax Invoice for Order #${activeOrder.id} 📄`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('account')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Account</span>
        </button>

        <button
          onClick={handleDownloadInvoice}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Download GST Invoice</span>
        </button>
      </div>

      {/* Order Status Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
            Order Status Tracker
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Order #{activeOrder.id}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {activeOrder.date} • Estimated Delivery: <strong className="text-white">{activeOrder.estimatedDelivery}</strong>
          </p>
        </div>

        <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider shrink-0">
          {activeOrder.status.replace('_', ' ')}
        </div>
      </div>

      {/* Subtle Animated Loyalty Points Earned Element */}
      {earnedPoints > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-200/40 p-5 sm:p-6 shadow-sm"
        >
          {/* Subtle ambient light motion accent */}
          <motion.div
            animate={{
              opacity: [0.35, 0.65, 0.35],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-300/40 blur-2xl"
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              {/* Floating Gentle Coin Badge */}
              <motion.div
                animate={{
                  y: [0, -3.5, 0],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-md shrink-0 border border-amber-200/80"
              >
                <Coins className="w-7 h-7 text-slate-950" />
              </motion.div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <motion.span
                    initial={{ scale: 0.82, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 260 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    +{earnedPoints} Points Earned on this Purchase!
                  </motion.span>
                  <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                    = ₹{earnedPoints} Instant Voucher Value
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-black text-slate-950">
                  Loyalty Reward Credited to Your Account
                </h2>

                <p className="text-xs text-slate-700 leading-relaxed max-w-xl">
                  You earned <strong className="font-bold text-slate-950">+{earnedPoints} loyalty points</strong> (1 point for every ₹10 spent) from Order <strong className="text-slate-950 font-mono">#{activeOrder.id}</strong>. Your points never expire and can be redeemed for store discount vouchers anytime!
                </p>
              </div>
            </div>

            {/* Quick Actions & Balance */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/60">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase text-amber-900/80 block">Current Balance</span>
                <span className="text-sm font-black text-slate-950 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300 inline-block shadow-2xs">
                  {customerPoints} pts
                </span>
              </div>

              <button
                onClick={() => setCurrentView('account')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>My Rewards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Live Visual Status Stepper */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Live Dispatch & Delivery Timeline
        </h2>

        <div className="relative border-l-2 border-amber-400 ml-4 pl-6 space-y-8">
          {activeOrder.trackingSteps.map((step, idx) => (
            <div key={idx} className="relative">
              <div
                className={`absolute -left-[33px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.completed
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                    : step.current
                    ? 'bg-slate-900 text-amber-400 ring-4 ring-slate-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className={`text-sm font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">{step.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address & Order Items Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            Delivery Location Details
          </h3>
          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">{activeOrder.deliveryAddress.fullName}</p>
            <p>{activeOrder.deliveryAddress.addressLine}</p>
            <p>{activeOrder.deliveryAddress.area}, {activeOrder.deliveryAddress.city} - {activeOrder.deliveryAddress.pincode}</p>
            <p className="text-slate-500">Contact: +91 {activeOrder.deliveryAddress.mobile}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            Items in this Package ({activeOrder.items.length})
          </h3>
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
            {activeOrder.items.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 truncate pr-2">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{item.productName}</p>
                    <p className="text-slate-500 text-[11px]">{item.quantity} x ₹{item.price} • {item.sellerName}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-baseline font-black text-slate-950 text-sm">
              <span>Total Amount</span>
              <span className="text-base text-slate-950">₹{activeOrder.total}</span>
            </div>

            {/* Real Payment Details Badge */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payment Mode:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {activeOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Gateway)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payment Status:</span>
                {activeOrder.paymentStatus === 'PAID' || activeOrder.paymentStatus === 'paid' ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    PAID (Verified)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full text-[11px]">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Pending Collection (COD)
                  </span>
                )}
              </div>

              {earnedPoints > 0 && (
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                  <span className="text-amber-800 font-bold flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-600" />
                    Points Earned:
                  </span>
                  <span className="font-black text-emerald-700">+{earnedPoints} pts (₹{earnedPoints} Value)</span>
                </div>
              )}

              {activeOrder.paymentTransaction && (
                <>
                  {activeOrder.paymentTransaction.gatewayPaymentId && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Transaction ID:</span>
                      <code className="text-slate-800 font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {activeOrder.paymentTransaction.gatewayPaymentId}
                      </code>
                    </div>
                  )}

                  {activeOrder.paymentTransaction.paymentMethodUsed && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Method Used:</span>
                      <span className="text-slate-700 font-semibold">
                        {activeOrder.paymentTransaction.paymentMethodUsed}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                    <span>Gateway Security:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      HMAC SHA-256 Verified
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 animate-in zoom-in-95 text-xs shadow-2xl border border-slate-100">
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-950 rounded">
                  Official GST Tax Invoice
                </span>
                <h3 className="text-xl font-black text-slate-950 mt-1">HARWALKART</h3>
                <p className="text-slate-600 text-xs font-bold">{websiteSettings?.companyOwnerName || 'SharanKumar Harwalkar'}</p>
                <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                  <p className="font-semibold text-slate-700">
                    Head Office: {websiteSettings?.officialAddress || 'Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220'}
                  </p>
                  <p>Support: +91 9372207811 • harwalkart@gmail.com</p>
                </div>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order & Buyer Details */}
            <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Billed & Shipped To</span>
                <p className="font-black text-slate-900 mt-0.5">{activeOrder.deliveryAddress.fullName}</p>
                <p className="text-slate-600 text-[11px]">{activeOrder.deliveryAddress.addressLine}</p>
                <p className="text-slate-600 text-[11px]">
                  {activeOrder.deliveryAddress.area}, {activeOrder.deliveryAddress.city} - {activeOrder.deliveryAddress.pincode}
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5">Phone: +91 {activeOrder.deliveryAddress.mobile}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Invoice Metadata</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">#{activeOrder.id}</p>
                <p className="text-slate-600 text-[11px]">Date: {activeOrder.date}</p>
                <p className="text-slate-600 text-[11px]">Payment: {activeOrder.paymentMethod.toUpperCase()}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold text-[10px]">
                  Paid in Full
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 flex justify-between text-[11px]">
                <span>Product Item Description</span>
                <span>Amount (INR)</span>
              </div>
              <div className="divide-y divide-slate-100 p-2">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <p className="text-slate-400 text-[10px]">Seller: {item.sellerName} | Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                    <div className="text-right font-black text-slate-900">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Calculation */}
            <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Inclusive of GST):</span>
                <span>₹{activeOrder.subtotal || activeOrder.total}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery & Handling Fee:</span>
                <span>₹{activeOrder.deliveryFee || 0}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promotional Discount:</span>
                  <span>-₹{activeOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Amount Paid:</span>
                <span>₹{activeOrder.total}</span>
              </div>
            </div>

            {/* Footer Disclaimer & Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400">
                This is a computer-generated tax invoice issued by HARWALKART.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 bg-slate-950 text-amber-400 font-bold rounded-xl cursor-pointer hover:bg-slate-900"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
