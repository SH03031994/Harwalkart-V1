import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Shield, Lock, Mail, ArrowRight, ShieldCheck, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin, navigate, showToast } = useApp();
  const [email, setEmail] = useState('admin@harwalkart.com');
  const [password, setPassword] = useState('Harwal@Admin2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = adminLogin(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid administrative credentials.');
      }
    }, 400);
  };

  const handleQuickAdminDemo = () => {
    setEmail('admin@harwalkart.com');
    setPassword('Harwal@Admin2026');
    setErrorMessage(null);
    showToast('Loaded Central Admin credentials');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/5">
      <div className="max-w-md w-full space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Logo size="md" />
          </div>
          <div className="inline-block px-3 py-1 bg-red-100 text-red-900 border border-red-300 font-black rounded-full text-xs tracking-widest uppercase">
            Restricted Admin Console
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Harwalkart Control Center
          </h2>
          <p className="text-xs text-slate-600">
            Platform governance, seller approvals, KYC validation, settlements & analytics
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 space-y-6">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
            <Shield className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong>Security Protocol:</strong> Access restricted to authorized HARWALKART operations personnel. All activities are audited and logged.
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@harwalkart.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Admin Security Key / Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/admin/forgot-password')}
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
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
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
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Authenticate & Enter Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login button */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Demo Admin Access
              </span>
              <button
                type="button"
                onClick={handleQuickAdminDemo}
                className="text-[11px] font-bold text-amber-900 hover:underline cursor-pointer"
              >
                Auto-fill credentials
              </button>
            </div>
            <p className="text-[11px] text-slate-600">
              Email: <strong>admin@harwalkart.com</strong> | Password: <strong>Harwal@Admin2026</strong>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="text-center text-xs text-slate-500 space-y-2">
          <p>Strictly No Public Registration for Central Administrative roles.</p>
          <div className="flex justify-center gap-4 text-xs font-medium">
            <button onClick={() => navigate('/customer/login')} className="hover:text-slate-800 underline cursor-pointer">
              Customer Portal
            </button>
            <span>•</span>
            <button onClick={() => navigate('/seller/login')} className="hover:text-slate-800 underline cursor-pointer">
              Seller Portal
            </button>
            <span>•</span>
            <button onClick={() => navigate('/')} className="hover:text-slate-800 underline cursor-pointer">
              Harwalkart Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
