import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Store, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const SellerLogin: React.FC = () => {
  const { sellerLogin, navigate } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = sellerLogin(identifier, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Seller authentication failed. Please check credentials.');
      }
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Logo size="md" />
          </div>
          <div className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-full text-xs tracking-wider uppercase shadow-sm">
            Merchant / Seller Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Seller Dashboard Sign In
          </h2>
          <p className="text-sm text-slate-600">
            Manage your shop inventory, orders, video ads, PIN codes, and settlements
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Shop Registered Email or Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. shopname@gmail.com or mobile"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/seller/forgot-password')}
                  className="text-xs text-amber-800 hover:text-amber-950 font-bold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter seller account password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-amber-400 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Access Seller Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
            Want to register your retail shop on HARWALKART?{' '}
            <button
              onClick={() => navigate('/seller/register')}
              className="text-amber-800 hover:text-amber-950 font-bold hover:underline ml-1 cursor-pointer"
            >
              Register Shop & Submit KYC
            </button>
          </div>
        </div>

        {/* Security & Alternate Portal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 px-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Local Merchant Network</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/customer/login')}
              className="hover:text-slate-900 font-semibold cursor-pointer underline"
            >
              Customer Login
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/')}
              className="hover:text-slate-900 font-semibold cursor-pointer underline"
            >
              Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
