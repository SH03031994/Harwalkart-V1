import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller, Product } from '../../types';
import { Logo } from '../common/Logo';
import { SellerCommissionEarnings } from './SellerCommissionEarnings';
import { SellerLegalPolicies } from './SellerLegalPolicies';
import { SellerProductsManager } from './SellerProductsManager';
import { SellerAddProduct } from './SellerAddProduct';
import { SellerSettlements } from './SellerSettlements';
import { SellerOrders } from './SellerOrders';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Percent,
  Wallet,
  FileText,
  User,
  Settings as SettingsIcon,
  LogOut,
  Store,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Menu,
  X,
  Building2,
  Phone,
  Mail,
  Save,
  Radio,
} from 'lucide-react';

type SellerTab =
  | 'overview'
  | 'products'
  | 'add_product'
  | 'orders'
  | 'commission'
  | 'settlement'
  | 'legal'
  | 'profile'
  | 'settings';

export const SellerDashboard: React.FC = () => {
  const {
    authSession,
    sellerLogout,
    sellers,
    products,
    orders,
    withdrawalRequests,
    updateSellerProfile,
    updateServiceablePincodes,
    navigate,
    showToast,
  } = useApp();

  // Active seller from authSession or fallback to initial demo seller
  const activeSeller: Seller =
    authSession.seller || sellers.find(s => s.id === 'seller_sharma_kirana') || sellers[0];

  const [activeTab, setActiveTab] = useState<SellerTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile Edit State
  const [editOwnerName, setEditOwnerName] = useState(activeSeller.ownerName || activeSeller.name);
  const [editShopName, setEditShopName] = useState(activeSeller.shopName);
  const [editPhone, setEditPhone] = useState(activeSeller.phone);
  const [editEmail, setEditEmail] = useState(activeSeller.email);
  const [editHours, setEditHours] = useState(activeSeller.openingHours);
  const [editStreet, setEditStreet] = useState(activeSeller.address.street);
  const [editArea, setEditArea] = useState(activeSeller.address.area);
  const [editCity, setEditCity] = useState(activeSeller.address.city);
  const [editPin, setEditPin] = useState(activeSeller.address.pincode);
  const [editGstin, setEditGstin] = useState(activeSeller.gstin || '');
  const [editBusinessInfo, setEditBusinessInfo] = useState(activeSeller.businessInfo || '');

  // Settings State
  const [pincodeListText, setPincodeListText] = useState(
    (activeSeller.serviceablePincodes || ['110001', '110002', '110005']).join(', ')
  );
  const [serviceRadiusInput, setServiceRadiusInput] = useState(activeSeller.serviceRadiusKm || 5);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [orderSound, setOrderSound] = useState(true);

  // Filtered lists for this seller
  const sellerProducts = products.filter(p => p.sellerId === activeSeller.id);
  const sellerOrders = orders.filter(ord =>
    ord.items.some(it => it.sellerId === activeSeller.id || it.sellerName === activeSeller.shopName)
  );
  const sellerWithdrawals = withdrawalRequests.filter(w => w.sellerId === activeSeller.id);

  // Financial calculations
  let totalGrossSales = 0;
  let totalCommissionDeducted = 0;
  let totalNetEarnings = 0;

  sellerOrders.forEach(ord => {
    const sItems = ord.items.filter(it => it.sellerId === activeSeller.id || it.sellerName === activeSeller.shopName);
    const gross = sItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const comm = Math.round(gross * 0.02 * 100) / 100;
    const net = Math.round((gross - comm) * 100) / 100;
    totalGrossSales += gross;
    totalCommissionDeducted += comm;
    totalNetEarnings += net;
  });

  const pendingSettlement = activeSeller.walletBalance;
  const paidSettlement = Math.max(0, activeSeller.totalEarnings > activeSeller.walletBalance ? activeSeller.totalEarnings - activeSeller.walletBalance : 23500);

  // Navigation Items matching the exact user specification
  const navItems: { id: SellerTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package, badge: `${sellerProducts.length}` },
    { id: 'add_product', label: 'Add Product', icon: PlusCircle },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: `${sellerOrders.length}` },
    { id: 'commission', label: 'Commission & Earnings', icon: Percent, badge: '2%' },
    { id: 'settlement', label: 'Settlement', icon: Wallet, badge: `₹${Math.floor(activeSeller.walletBalance)}` },
    { id: 'legal', label: 'Legal & Policies', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    sellerLogout();
    navigate('/seller/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile(activeSeller.id, {
      name: editOwnerName,
      ownerName: editOwnerName,
      shopName: editShopName,
      phone: editPhone,
      email: editEmail,
      openingHours: editHours,
      gstin: editGstin,
      businessInfo: editBusinessInfo,
      address: {
        ...activeSeller.address,
        street: editStreet,
        area: editArea,
        city: editCity,
        pincode: editPin,
      },
    });
    showToast('Shop profile updated successfully!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const pinArr = pincodeListText
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    updateServiceablePincodes(activeSeller.id, pinArr, serviceRadiusInput);
    showToast('Serviceable area & delivery settings updated!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Seller Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Store Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <Logo size="sm" variant="light" />
              <div className="hidden sm:block border-l border-slate-700 pl-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-300 font-black text-[10px] uppercase px-2 py-0.5 rounded-md border border-amber-500/30">
                    SELLER HUB
                  </span>
                  {activeSeller.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md text-[10px] font-bold border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Store
                    </span>
                  ) : activeSeller.status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-md text-[10px] font-bold border border-rose-500/30">
                      <AlertCircle className="w-3 h-3" />
                      KYC Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md text-[10px] font-bold border border-amber-500/30">
                      <Clock className="w-3 h-3" />
                      Approval Pending
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                  {activeSeller.shopName} • ID: {activeSeller.id}
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Wallet Balance */}
            <button
              onClick={() => setActiveTab('settlement')}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition border border-white/10 cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline text-slate-300">Wallet:</span>
              <span className="text-emerald-400 font-black">
                ₹{activeSeller.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition cursor-pointer text-xs font-bold flex items-center gap-1.5"
              title="Logout from Seller Portal"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Seller Portal Navigation
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* 2% Commission Quick Policy Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900">
              <Percent className="w-4 h-4 text-amber-600" />
              <span>Harwalkart 2% Fee</span>
            </div>
            <p className="text-[11px] text-amber-900/80 leading-relaxed font-medium">
              Transparent 2% fee deducted upon order completion. You receive 98% Net Settlement directly in your bank/UPI.
            </p>
            <button
              onClick={() => setActiveTab('commission')}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline block cursor-pointer"
            >
              View Commission Breakdown →
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex">
            <div className="bg-white w-72 h-full p-4 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-600" />
                    <span className="font-black text-sm text-slate-900">Seller Menu</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isCurrent = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* KYC Pending Notice Banner */}
          {activeSeller.status === 'pending' && (
            <div className="mb-6 bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-6 shadow-sm animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <span>KYC Verification & Admin Approval In Progress</span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-800 text-[10px] uppercase font-black rounded-md border border-amber-500/30">
                        Pending
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      Your store registration for <strong>{activeSeller.shopName}</strong> has been submitted and is currently being verified by the Harwalkart Central Administration team.
                      {activeSeller.kycDoc && (
                        <span className="block mt-1 text-slate-700 font-semibold">
                          Submitted Document: {activeSeller.kycDoc.docType} ({activeSeller.kycDoc.docNumber}) • File: {activeSeller.kycDoc.fileName}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[11px] text-amber-900 font-bold bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300">
                    Est. Approval: 2-4 Hours
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* KYC Rejected Notice Banner */}
          {activeSeller.status === 'rejected' && (
            <div className="mb-6 bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 shadow-sm animate-in fade-in">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-rose-950 flex items-center gap-2">
                    <span>Seller KYC Application Rejected</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] uppercase font-black rounded-md border border-rose-300">
                      Action Required
                    </span>
                  </h3>
                  <p className="text-xs text-rose-800 mt-1 max-w-2xl leading-relaxed">
                    Reason: <strong>{activeSeller.rejectionReason || 'Uploaded documents could not be verified against government registries.'}</strong>
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    Please navigate to the <strong>Profile</strong> tab to update your business details or contact Harwalkart Support at <span className="font-bold text-slate-900">harwalkart@gmail.com</span> / <span className="font-bold text-slate-900">+91 9372207811</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW / DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Store Hero Banner */}
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xs relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
                      <Store className="w-3.5 h-3.5" />
                      {activeSeller.status === 'approved' ? 'Live Storefront Active' : 'Store Under KYC Review'}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">
                      Welcome back, {activeSeller.ownerName || activeSeller.name}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                      Your store <strong>{activeSeller.shopName}</strong> is serving orders in{' '}
                      <strong>{activeSeller.address.area}</strong> ({activeSeller.address.pincode}) with 2% Harwalkart settlement.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('add_product')}
                      className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Product
                    </button>
                    <button
                      onClick={() => setActiveTab('settlement')}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition cursor-pointer border border-white/20 flex items-center gap-1.5"
                    >
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      Withdraw ₹{activeSeller.walletBalance}
                    </button>
                  </div>
                </div>
              </div>

              {/* 5-Metric Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-500">Total Sales</span>
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{totalGrossSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-slate-400">{sellerOrders.length} orders total</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-amber-800">Harwalkart (2%)</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">2%</span>
                  </div>
                  <p className="text-2xl font-black text-amber-700">
                    ₹{totalCommissionDeducted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-amber-800 font-medium">Platform facilitation fee</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-emerald-800">Net Earnings</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-emerald-700">
                    ₹{totalNetEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-medium">98% retained by you</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-500">Pending Settlement</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{pendingSettlement.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-slate-400">Available in wallet</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-500">Paid Settlement</span>
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{paidSettlement.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-slate-400">Disbursed to Bank/UPI</p>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab('products')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Package className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-bold text-blue-600 group-hover:underline">Manage →</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-sm">Catalog ({sellerProducts.length} Products)</h3>
                  <p className="text-xs text-slate-500">Update pricing, stock availability, and multiple product images.</p>
                </div>

                <div
                  onClick={() => setActiveTab('orders')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <ShoppingBag className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-bold text-emerald-600 group-hover:underline">View Orders →</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-sm">Customer Orders ({sellerOrders.length})</h3>
                  <p className="text-xs text-slate-500">Process incoming orders with item-level 2% commission calculations.</p>
                </div>

                <div
                  onClick={() => setActiveTab('commission')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                      <Percent className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-bold text-amber-600 group-hover:underline">Calculator →</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-sm">2% Commission Insights</h3>
                  <p className="text-xs text-slate-500">Calculate net payout margins and verify automated fee deductions.</p>
                </div>
              </div>

              {/* Recent Orders Snippet */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Recent Store Orders</h3>
                    <p className="text-xs text-slate-500">Latest customer orders with 2% commission breakdown</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                  >
                    View All ({sellerOrders.length}) →
                  </button>
                </div>

                {sellerOrders.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No orders placed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {sellerOrders.slice(0, 3).map(ord => {
                      const sItems = ord.items.filter(
                        it => it.sellerId === activeSeller.id || it.sellerName === activeSeller.shopName
                      );
                      const gross = sItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
                      const comm = Math.round(gross * 0.02 * 100) / 100;
                      const net = Math.round((gross - comm) * 100) / 100;

                      return (
                        <div
                          key={ord.id}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900">{ord.id}</span>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md uppercase">
                                {ord.status}
                              </span>
                              <span className="text-[10px] text-slate-400">{ord.date}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5">
                              Customer: <strong>{ord.deliveryAddress.fullName}</strong> ({ord.deliveryAddress.city})
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase block">Gross Sale</span>
                              <span className="font-bold text-slate-900">₹{gross}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-amber-700 uppercase block font-bold">2% Fee</span>
                              <span className="font-bold text-amber-700">-₹{comm.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-emerald-700 uppercase block font-bold">Net Payout</span>
                              <span className="font-black text-emerald-700 text-sm">₹{net.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY PRODUCTS */}
          {activeTab === 'products' && (
            <SellerProductsManager
              seller={activeSeller}
              onNavigateToAddProduct={() => setActiveTab('add_product')}
            />
          )}

          {/* TAB 3: ADD PRODUCT */}
          {activeTab === 'add_product' && (
            <SellerAddProduct
              seller={activeSeller}
              onSuccess={() => {
                showToast('Product successfully added to your store!');
                setActiveTab('products');
              }}
            />
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && <SellerOrders seller={activeSeller} orders={orders} />}

          {/* TAB 5: COMMISSION & EARNINGS */}
          {activeTab === 'commission' && (
            <SellerCommissionEarnings seller={activeSeller} orders={orders} />
          )}

          {/* TAB 6: SETTLEMENT */}
          {activeTab === 'settlement' && (
            <SellerSettlements seller={activeSeller} withdrawals={sellerWithdrawals} />
          )}

          {/* TAB 7: LEGAL & POLICIES */}
          {activeTab === 'legal' && <SellerLegalPolicies />}

          {/* TAB 8: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xs">
                <h2 className="text-2xl font-black">Shop Profile & Business Details</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Manage merchant registration, store address, and contact details visible to local customers.
                </p>
              </div>

              <form
                onSubmit={handleSaveProfile}
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Store / Shop Name *
                    </label>
                    <input
                      type="text"
                      value={editShopName}
                      onChange={e => setEditShopName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Owner / Merchant Name *
                    </label>
                    <input
                      type="text"
                      value={editOwnerName}
                      onChange={e => setEditOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Registered Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={editHours}
                      onChange={e => setEditHours(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      GSTIN / Tax ID
                    </label>
                    <input
                      type="text"
                      value={editGstin}
                      onChange={e => setEditGstin(e.target.value)}
                      placeholder="e.g. 07AAACG2024L1Z1"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Physical Store Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Street Address / Shop No.
                      </label>
                      <input
                        type="text"
                        value={editStreet}
                        onChange={e => setEditStreet(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Area / Locality
                      </label>
                      <input
                        type="text"
                        value={editArea}
                        onChange={e => setEditArea(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={e => setEditCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={editPin}
                        onChange={e => setEditPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    About the Store / Business Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editBusinessInfo}
                    onChange={e => setEditBusinessInfo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xs">
                <h2 className="text-2xl font-black">Store Delivery & Service Settings</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Configure serviceable postal codes, delivery radius, and order notification preferences.
                </p>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6"
              >
                {/* Service Radius Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Hyperlocal Service Radius: <strong className="text-amber-700">{serviceRadiusInput} km</strong>
                    </label>
                    <span className="text-xs text-slate-400">Rider Pickup Coverage</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={serviceRadiusInput}
                    onChange={e => setServiceRadiusInput(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>1 km (Immediate Neighborhood)</span>
                    <span>10 km (Suburban)</span>
                    <span>25 km (Full City)</span>
                  </div>
                </div>

                {/* Serviceable Pincodes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Serviceable PIN Codes (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={pincodeListText}
                    onChange={e => setPincodeListText(e.target.value)}
                    placeholder="110001, 110002, 110005, 110006"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Customers with shipping addresses in these PIN codes will see your items in local search.
                  </p>
                </div>

                {/* Notifications */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Order Notification Preferences
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsAlerts}
                        onChange={e => setSmsAlerts(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Instant SMS & WhatsApp Order Alerts
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Receive notifications immediately when a customer orders from your store
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={orderSound}
                        onChange={e => setOrderSound(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Seller Portal Sound Alerts
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Play sound chime when new orders arrive in dashboard
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    Save Service Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
