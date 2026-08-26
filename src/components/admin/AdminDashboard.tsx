import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  TrendingUp,
  AlertTriangle,
  Store,
  Users,
  Package,
  CheckCircle2,
  Layers,
  FileText,
  Wallet,
  MapPin,
  Video,
  Radio,
  MessageSquare,
  Sliders,
  LogOut,
} from 'lucide-react';

import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminSellerApprovalsTab } from './tabs/AdminSellerApprovalsTab';
import { AdminSellersTab } from './tabs/AdminSellersTab';
import { AdminCustomersTab } from './tabs/AdminCustomersTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminProductApprovalsTab } from './tabs/AdminProductApprovalsTab';
import { AdminCategoriesTab } from './tabs/AdminCategoriesTab';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminPaymentsTab } from './tabs/AdminPaymentsTab';
import { AdminPincodesTab } from './tabs/AdminPincodesTab';
import { AdminVideosTab } from './tabs/AdminVideosTab';
import { AdminAdsTab } from './tabs/AdminAdsTab';
import { AdminSupportTab } from './tabs/AdminSupportTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';

export const AdminDashboard: React.FC = () => {
  const {
    sellers,
    products,
    videoAds,
    orders,
    registeredCustomers,
    withdrawalRequests,
    supportTickets,
    categories,
    advertisements,
    cityHubs,
    adminLogout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'seller_approvals'
    | 'sellers'
    | 'customers'
    | 'products'
    | 'product_approvals'
    | 'categories'
    | 'orders'
    | 'payments'
    | 'pincodes'
    | 'videos'
    | 'ads'
    | 'messages'
    | 'settings'
  >('overview');

  const pendingSellers = sellers.filter(s => s.status === 'pending');
  const pendingProducts = products.filter(p => !p.approved);
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending');
  const openSupportTickets = supportTickets.filter(t => t.status === 'open');

  const totalGmv = orders.reduce((sum, o) => sum + o.total, 0) + 248500;
  const platformCommission = Math.round(totalGmv * 0.025);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-2xl border border-white/10 shrink-0">
            <Logo size="md" variant="light" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">Master Admin Panel</h1>
              <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform Governance, KYC Verification, Settlement Approvals & PAN-India Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700 text-xs text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Marketplace Status</span>
            <span className="text-emerald-400 font-black">100% LIVE • PAN-INDIA</span>
          </div>
          <button
            onClick={adminLogout}
            className="px-3.5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Platform GMV</span>
          <div className="text-2xl font-black text-slate-950">₹{totalGmv.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-bold">Harwalkart + Local Stores</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Platform Revenue</span>
          <div className="text-2xl font-black text-emerald-600">₹{platformCommission.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500">Commission & Video Ads</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Pending Sellers</span>
          <div className="text-2xl font-black text-amber-600">{pendingSellers.length} Shops</div>
          <span className="text-[11px] text-amber-700 font-bold">Require KYC Approval</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Registered Customers</span>
          <div className="text-2xl font-black text-slate-950">{registeredCustomers.length} Shoppers</div>
          <span className="text-[11px] text-blue-600 font-bold">Active Indian Accounts</span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 Cols) */}
        <div className="lg:col-span-3 space-y-1 bg-white p-3 rounded-3xl border border-slate-200 shadow-xs h-max text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4" />
              <span>Admin Overview</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('seller_approvals')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'seller_approvals' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Seller Approval (KYC)</span>
            </div>
            {pendingSellers.length > 0 && (
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">
                {pendingSellers.length} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'sellers' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4" />
              <span>All Sellers ({sellers.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'customers' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Registered Customers</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{registeredCustomers.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>All Products ({products.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('product_approvals')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'product_approvals' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Product Approvals</span>
            </div>
            {pendingProducts.length > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black">
                {pendingProducts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'categories' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Marketplace Orders</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'payments' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4" />
              <span>Withdrawals & Payouts</span>
            </div>
            {pendingWithdrawals.length > 0 ? (
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">
                {pendingWithdrawals.length}
              </span>
            ) : (
              <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{withdrawalRequests.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pincodes')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'pincodes' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>PIN Codes & Cities ({cityHubs.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'videos' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4" />
              <span>Product Videos ({videoAds.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'ads' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4" />
              <span>Advertisements ({advertisements.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'messages' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Support & Contact</span>
            </div>
            {openSupportTickets.length > 0 ? (
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">
                {openSupportTickets.length}
              </span>
            ) : (
              <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{supportTickets.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4" />
              <span>Website Settings</span>
            </div>
          </button>

          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={adminLogout}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Logout</span>
            </button>
          </div>
        </div>

        {/* Content Area (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {activeTab === 'overview' && <AdminOverviewTab setActiveTab={setActiveTab} />}
          {activeTab === 'seller_approvals' && <AdminSellerApprovalsTab />}
          {activeTab === 'sellers' && <AdminSellersTab />}
          {activeTab === 'customers' && <AdminCustomersTab />}
          {activeTab === 'products' && <AdminProductsTab />}
          {activeTab === 'product_approvals' && <AdminProductApprovalsTab />}
          {activeTab === 'categories' && <AdminCategoriesTab />}
          {activeTab === 'orders' && <AdminOrdersTab />}
          {activeTab === 'payments' && <AdminPaymentsTab />}
          {activeTab === 'pincodes' && <AdminPincodesTab />}
          {activeTab === 'videos' && <AdminVideosTab />}
          {activeTab === 'ads' && <AdminAdsTab />}
          {activeTab === 'messages' && <AdminSupportTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
        </div>
      </div>
    </div>
  );
};
