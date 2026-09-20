import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Bike,
  Package,
  Wallet,
  Clock,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Star,
  DollarSign,
  Navigation,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Key,
  CreditCard,
  Building2,
  Calendar,
  Layers,
  Search,
  UserCheck,
  Check,
} from 'lucide-react';
import { Order, DeliveryPartner } from '../../types';

export const DeliveryPartnerDashboard: React.FC = () => {
  const {
    authSession,
    deliveryPartnerLogout,
    deliveryPartners,
    orders,
    acceptDeliveryAssignment,
    confirmOrderPickup,
    completeDeliveryWithOtp,
    togglePartnerOnlineStatus,
    requestPartnerWithdrawal,
    withdrawalRequests,
    navigate,
    showToast,
  } = useApp();

  // Active rider session
  const activePartner: DeliveryPartner = authSession.deliveryPartner || deliveryPartners[0];

  const [activeTab, setActiveTab] = useState<'deliveries' | 'history' | 'wallet' | 'profile'>('deliveries');
  const [selectedDeliveryFilter, setSelectedDeliveryFilter] = useState<'all' | 'active' | 'available'>('all');
  
  // OTP modal / state
  const [otpModalOrderId, setOtpModalOrderId] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Withdrawal form state
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(500);
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank_transfer'>('upi');
  const [upiOrAccount, setUpiOrAccount] = useState<string>(activePartner.upiId || 'rider@upi');
  const [isWithdrawalSubmitting, setIsWithdrawalSubmitting] = useState(false);

  // Filter orders
  // 1. Orders assigned to this partner that are still active (not delivered/cancelled)
  const activeAssignedOrders = orders.filter(
    o => o.assignedPartnerId === activePartner.id && o.status !== 'delivered' && o.status !== 'cancelled'
  );

  // 2. Orders that are awaiting assignment in system (confirmed or preparing, no assigned partner)
  const availableUnassignedOrders = orders.filter(
    o => !o.assignedPartnerId && (o.status === 'confirmed' || o.status === 'preparing' || o.status === 'placed')
  );

  // 3. Completed orders by this partner
  const completedOrders = orders.filter(
    o => (o.assignedPartnerId === activePartner.id || o.status === 'delivered') && o.status === 'delivered'
  );

  // COD Cash in hand calculation (orders delivered by rider with COD)
  const codCashInHand = completedOrders
    .filter(o => o.paymentMethod === 'cod')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Partner's specific withdrawal requests
  const partnerPayouts = withdrawalRequests.filter(
    w => w.partnerId === activePartner.id || w.beneficiaryType === 'delivery_partner'
  );

  const handleToggleDuty = () => {
    const nextStatus = activePartner.status === 'active' ? 'offline' : 'active';
    togglePartnerOnlineStatus(activePartner.id, nextStatus);
  };

  const handleOpenOtpModal = (orderId: string) => {
    setOtpModalOrderId(orderId);
    setEnteredOtp('');
    setOtpError(null);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpModalOrderId) return;

    const res = completeDeliveryWithOtp(otpModalOrderId, activePartner.id, enteredOtp);
    if (!res.success) {
      setOtpError(res.error || 'Invalid OTP code.');
    } else {
      setOtpModalOrderId(null);
      setEnteredOtp('');
      setOtpError(null);
    }
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawalAmount <= 0) {
      showToast('Please enter a valid withdrawal amount.');
      return;
    }
    if (withdrawalAmount > activePartner.walletBalance) {
      showToast(`Cannot withdraw more than available balance (₹${activePartner.walletBalance}).`);
      return;
    }

    setIsWithdrawalSubmitting(true);
    setTimeout(() => {
      const res = requestPartnerWithdrawal(
        activePartner.id,
        withdrawalAmount,
        payoutMethod,
        upiOrAccount
      );
      setIsWithdrawalSubmitting(false);
      if (res.success) {
        setWithdrawalAmount(100);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 text-slate-900 dark:text-slate-100">
      {/* 1. TOP HEADER / FLEET STATUS BAR */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  {activePartner.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {activePartner.rating}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  ({activePartner.completedDeliveries} Trips)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>{activePartner.vehicleType} • {activePartner.vehicleNumber}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600" /> {activePartner.city}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Online / Offline Duty Switch */}
            <button
              onClick={handleToggleDuty}
              className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                activePartner.status === 'active'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${activePartner.status === 'active' ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
              <span>{activePartner.status === 'active' ? 'ON DUTY (ONLINE)' : 'OFFLINE (ON BREAK)'}</span>
            </button>

            {/* Logout / Switch */}
            <button
              onClick={deliveryPartnerLogout}
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Sign Out from Delivery Fleet"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Available Wallet Balance */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-wider">Wallet Balance</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{activePartner.walletBalance.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => setActiveTab('wallet')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Withdraw
              </button>
            </div>
            <p className="text-[10px] text-slate-400">Instant UPI transfer available</p>
          </div>

          {/* Card 2: Lifetime Earnings */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-wider">Total Earnings</span>
              <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block">
              ₹{activePartner.totalEarnings.toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-slate-400">₹50 delivery payout + incentives</p>
          </div>

          {/* Card 3: Active Orders */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-wider">Active Deliveries</span>
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {activeAssignedOrders.length}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {availableUnassignedOrders.length} Available
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Pickups ready in your zone</p>
          </div>

          {/* Card 4: Cash In Hand (COD) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-wider">Cash Collected (COD)</span>
              <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 block">
              ₹{codCashInHand.toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-slate-400">Customer cash pending hub deposit</p>
          </div>
        </div>

        {/* 3. NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'deliveries'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Orders & Tasks ({activeAssignedOrders.length + availableUnassignedOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Trip History ({completedOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet & Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Rider Profile & Vehicle</span>
          </button>
        </div>

        {/* 4. TAB CONTENTS */}

        {/* ================= TAB 1: DELIVERIES & TASKS ================= */}
        {activeTab === 'deliveries' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDeliveryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  selectedDeliveryFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                All Orders ({activeAssignedOrders.length + availableUnassignedOrders.length})
              </button>
              <button
                onClick={() => setSelectedDeliveryFilter('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  selectedDeliveryFilter === 'active'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                My In-Transit ({activeAssignedOrders.length})
              </button>
              <button
                onClick={() => setSelectedDeliveryFilter('available')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  selectedDeliveryFilter === 'available'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Available Pickups ({availableUnassignedOrders.length})
              </button>
            </div>

            {/* In-Transit Deliveries Section */}
            {(selectedDeliveryFilter === 'all' || selectedDeliveryFilter === 'active') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Bike className="w-4 h-4 text-emerald-600" />
                    <span>My Active Deliveries ({activeAssignedOrders.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500">Pick up from merchant & deliver to customer</span>
                </div>

                {activeAssignedOrders.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <Bike className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No active delivery in transit</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Accept an order from the "Available Pickups" section below to start earning delivery fees!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {activeAssignedOrders.map(order => {
                      const firstItem = order.items[0];
                      const isPickedUp = order.pickupStatus === 'out_for_delivery' || order.status === 'out_for_delivery';
                      const isCod = order.paymentMethod === 'cod';

                      return (
                        <div
                          key={order.id}
                          className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/40 shadow-md p-5 space-y-4"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-sm text-slate-900 dark:text-white">
                                  Order #{order.id}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  isPickedUp ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}>
                                  {isPickedUp ? 'Out For Delivery' : 'Pickup Pending'}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {order.items.length} items • ₹{order.total} • Payout: ₹50
                              </span>
                            </div>

                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                              +₹50 Fee
                            </span>
                          </div>

                          {/* Merchant Pickup Info */}
                          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Step 1: Merchant Store (Pickup)
                              </span>
                              {isPickedUp ? (
                                <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Picked Up
                                </span>
                              ) : (
                                <span className="text-[10px] font-black text-amber-600">Pending Pickup</span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {firstItem?.sellerName || 'Harwalkart Merchant Store'}
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400">
                              Collect {order.items.reduce((s, i) => s + i.quantity, 0)} packaged grocery/spice item(s).
                            </p>
                          </div>

                          {/* Customer Drop Location Info */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Navigation className="w-3 h-3 text-emerald-600" /> Step 2: Customer Drop Address
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                isCod ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              }`}>
                                {isCod ? `Collect Cash: ₹${order.total}` : 'Pre-paid (₹0 Collect)'}
                              </span>
                            </div>

                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {order.deliveryAddress.fullName}
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                                {order.deliveryAddress.addressLine}, {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                                {order.deliveryAddress.landmark ? ` (Landmark: ${order.deliveryAddress.landmark})` : ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <a
                                href={`tel:${order.deliveryAddress.mobile}`}
                                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>Call Customer ({order.deliveryAddress.mobile})</span>
                              </a>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-2 flex flex-col sm:flex-row gap-2">
                            {!isPickedUp ? (
                              <button
                                onClick={() => confirmOrderPickup(order.id, activePartner.id)}
                                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Package className="w-4 h-4" />
                                <span>Confirm Store Pickup & Start Transit</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenOtpModal(order.id)}
                                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Key className="w-4 h-4" />
                                <span>Enter Customer OTP & Complete Delivery</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Available Pickups Section */}
            {(selectedDeliveryFilter === 'all' || selectedDeliveryFilter === 'available') && (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-500" />
                      <span>Available Pickups in Zone ({availableUnassignedOrders.length})</span>
                    </h3>
                    <p className="text-xs text-slate-500">Orders ready for delivery partner acceptance</p>
                  </div>
                </div>

                {availableUnassignedOrders.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">All local orders currently assigned</h4>
                    <p className="text-xs text-slate-500">Check back in a few minutes for new incoming store orders.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableUnassignedOrders.map(order => {
                      const firstItem = order.items[0];
                      return (
                        <div
                          key={order.id}
                          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 space-y-3 hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-black text-xs text-slate-900 dark:text-white block">
                                  Order #{order.id}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {order.items.length} item(s) • Total ₹{order.total}
                                </span>
                              </div>
                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                +₹50 Earned
                              </span>
                            </div>

                            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                              <p className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-400 truncate">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span>Pickup: {firstItem?.sellerName || 'Local Partner Store'}</span>
                              </p>
                              <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate">
                                <Navigation className="w-3.5 h-3.5 shrink-0" />
                                <span>Drop: {order.deliveryAddress.area}, {order.deliveryAddress.city}</span>
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => acceptDeliveryAssignment(order.id, activePartner.id)}
                            className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Accept Delivery Order</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: TRIP HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Completed Delivery Trips
                </h3>
                <p className="text-xs text-slate-500">
                  Track all past orders successfully handed over to customers with OTP verification
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl">
                {completedOrders.length} Completed Handover(s)
              </span>
            </div>

            {completedOrders.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No completed trips logged yet</h4>
                <p className="text-xs text-slate-400">Your completed deliveries will appear here with payout statements.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {completedOrders.map(order => (
                  <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          #{order.id}
                        </span>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                          Delivered with OTP
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {order.deliveryAddress.fullName} • {order.deliveryAddress.area}, {order.deliveryAddress.city}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Payment: {order.paymentMethod.toUpperCase()} (Total: ₹{order.total})
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">
                        +₹50 Payout
                      </span>
                      <span className="text-[10px] text-slate-400">Credited to Wallet</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: WALLET & PAYOUTS ================= */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Request Payout Form */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
              <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <span>Request Payout</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Transfer your delivery earnings directly to your UPI ID or Bank account
                </p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-[11px] font-black uppercase text-emerald-800 dark:text-emerald-400">
                  Available for Withdrawal
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{activePartner.walletBalance.toLocaleString('en-IN')}
                </div>
              </div>

              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={activePartner.walletBalance}
                    value={withdrawalAmount}
                    onChange={e => setWithdrawalAmount(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                  />
                  <div className="flex gap-2 pt-1.5">
                    {[500, 1000, 2000, activePartner.walletBalance].map((val, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setWithdrawalAmount(val)}
                        className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer"
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Transfer Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutMethod('upi');
                        setUpiOrAccount(activePartner.upiId || 'rider@upi');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        payoutMethod === 'upi'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      UPI ID (Instant)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutMethod('bank_transfer');
                        setUpiOrAccount(activePartner.bankDetails?.accountNumber || '1234567890');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        payoutMethod === 'bank_transfer'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Direct Bank Transfer
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {payoutMethod === 'upi' ? 'UPI Virtual Payment Address' : 'Bank Account Number / IFSC'}
                  </label>
                  <input
                    type="text"
                    required
                    value={upiOrAccount}
                    onChange={e => setUpiOrAccount(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawalSubmitting || activePartner.walletBalance <= 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isWithdrawalSubmitting ? 'Submitting request...' : 'Submit Payout Request'}
                </button>
              </form>
            </div>

            {/* Right: Payout Requests Statement */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Settlement & Payout History
                </h3>
                <span className="text-xs text-slate-500">{partnerPayouts.length} record(s)</span>
              </div>

              {partnerPayouts.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No withdrawal requests yet</h4>
                  <p className="text-xs text-slate-400">Use the form to transfer delivery earnings to your bank.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {partnerPayouts.map(w => (
                    <div key={w.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            ₹{w.amount}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            w.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            w.status === 'approved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            w.status === 'rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {w.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {w.payoutMethod.toUpperCase()} • {w.upiOrAccount} • Date: {w.requestDate}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Ref: {w.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PROFILE & VEHICLE ================= */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Rider & Fleet Vehicle Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Official verified documents and banking information registered with Harwalkart
                </p>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> KYC Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Rider Contact Details
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Full Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activePartner.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mobile Phone:</span>
                    <span className="font-bold text-slate-900 dark:text-white">+91 {activePartner.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activePartner.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Primary Hub / City:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activePartner.city} ({activePartner.pincode || '110001'})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Joined Date:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activePartner.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle & License Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Vehicle & License Information
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle Type:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{activePartner.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle Registration No:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activePartner.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driving License No:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activePartner.licenseNumber || 'Verified on file'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer Rating:</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {activePartner.rating} / 5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Banking & Settlement Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 md:col-span-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Linked Settlement Bank Account & UPI
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">UPI Virtual Address</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activePartner.upiId || 'Not registered'}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Bank Name</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activePartner.bankDetails?.bankName || 'State Bank of India'}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Account Number</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {activePartner.bankDetails?.accountNumber ? `••••${activePartner.bankDetails.accountNumber.slice(-4)}` : '••••3918'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Fleet Helpline */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  Harwalkart Central Fleet Dispatch Support
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Need assistance with route, customer contact, or cancellation? Call helpline.
                </p>
              </div>
              <a
                href="tel:18002008899"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shrink-0 text-center"
              >
                Call Fleet Desk (1800-200-8899)
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ================= 5. OTP VERIFICATION MODAL ================= */}
      {otpModalOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Customer Delivery OTP
              </h3>
              <p className="text-xs text-slate-500">
                Ask the customer for the 4-digit secret delivery handover code for Order #{otpModalOrderId}
              </p>
            </div>

            {otpError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  value={enteredOtp}
                  onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="w-full text-center text-3xl tracking-widest font-black p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 text-center block pt-1">
                  Demo hint: enter <strong>1234</strong> or code sent to customer
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpModalOrderId(null)}
                  className="w-1/2 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Verify & Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
