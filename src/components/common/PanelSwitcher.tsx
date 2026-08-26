import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Store,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ChevronUp,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';

export const PanelSwitcher: React.FC = () => {
  const {
    authSession,
    customerLogin,
    sellerLogin,
    navigate,
    showToast,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  const handleQuickCustomer = () => {
    customerLogin('rahul.verma@example.com', 'customer123');
    navigate('/customer/dashboard');
    showToast('Customer Portal: Viewing as Rahul Verma');
  };

  const handleQuickSeller = () => {
    sellerLogin('sharmakirana.delhi@gmail.com', 'seller123');
    navigate('/seller/dashboard');
    showToast('Seller Portal: Viewing Sharma Kirana Store (Approved)');
  };

  return (
    <aside aria-label="Portal Navigation Panel" className="fixed bottom-4 left-4 z-50">
      {/* Floating Toggle Pill */}
      <div className="flex items-center gap-2 bg-slate-950/95 text-white backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xl border border-amber-500/40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-black text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          title="Switch between Customer and Seller Portals"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">PORTALS:</span>
          <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-extrabold text-[11px]">
            {authSession.isAuthenticated
              ? authSession.role === 'customer'
                ? '🛍️ Customer View'
                : authSession.role === 'seller'
                ? '🏪 Seller View'
                : '🛡️ Admin Console'
              : '⚡ Switch Portal'}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        {/* Quick Icon Links */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleQuickCustomer}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              authSession.role === 'customer' && authSession.isAuthenticated
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400'
            }`}
            title="Customer Panel"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Customer</span>
          </button>

          <button
            onClick={handleQuickSeller}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              authSession.role === 'seller' && authSession.isAuthenticated
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400'
            }`}
            title="Seller Panel"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Seller</span>
          </button>

          {/* Admin link shown ONLY if currently authenticated as admin */}
          {authSession.role === 'admin' && authSession.isAuthenticated && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-red-600 text-white"
              title="Admin Console"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Admin Console</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Popup Menu */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-80 sm:w-96 bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 p-4 animate-in fade-in slide-in-from-bottom-2 z-50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div>
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                HARWALKART Marketplace Portals
              </h4>
              <p className="text-[11px] text-slate-400">
                Explore Customer and Merchant features
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="space-y-2.5">
            {/* 1. Customer Panel */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">1. Customer Panel</h5>
                    <p className="text-[10px] text-slate-400">Order, Wishlist, Addresses, Tracking</p>
                  </div>
                </div>
                {authSession.role === 'customer' && authSession.isAuthenticated && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    handleQuickCustomer();
                    setIsOpen(false);
                  }}
                  className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    navigate('/customer/login');
                    setIsOpen(false);
                  }}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Login / Register
                </button>
              </div>
            </div>

            {/* 2. Seller Panel */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">2. Seller Hub / Panel</h5>
                    <p className="text-[10px] text-slate-400">Products, Stock, Orders, Settlements</p>
                  </div>
                </div>
                {authSession.role === 'seller' && authSession.isAuthenticated && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    handleQuickSeller();
                    setIsOpen(false);
                  }}
                  className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    navigate('/seller/login');
                    setIsOpen(false);
                  }}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Login / KYC
                </button>
              </div>
            </div>

            {/* Admin Panel Card - ONLY visible if authenticated admin */}
            {authSession.role === 'admin' && authSession.isAuthenticated && (
              <div className="bg-slate-900/90 border border-red-500/50 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-black">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Admin Master Panel</h5>
                      <p className="text-[10px] text-slate-400">KYC Approvals, Products, Settlements</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-950 px-2 py-0.5 rounded-md border border-red-800">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      navigate('/admin/dashboard');
                      setIsOpen(false);
                    }}
                    className="w-full py-1.5 px-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <span>Open Master Admin</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Marketplace Home */}
            <div className="pt-1">
              <button
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Return to Marketplace Storefront</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
