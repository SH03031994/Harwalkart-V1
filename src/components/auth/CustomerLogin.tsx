import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Mail, Lock, Smartphone, ArrowRight, ShieldCheck, UserCheck, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

export const CustomerLogin: React.FC = () => {
  const { customerLogin, navigate, showToast } = useApp();
  const [identifier, setIdentifier] = useState('rahul.verma@example.com');
  const [password, setPassword] = useState('customer123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = customerLogin(identifier, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check credentials.');
      }
    }, 400);
  };

  const handleDemoFill = (email: string) => {
    setIdentifier(email);
    setPassword('customer123');
    setErrorMessage(null);
    showToast(`Filled demo credentials for ${email}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Logo size="md" />
          </div>
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold tracking-wide uppercase">
            Customer Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-sm text-slate-600">
            Access your orders, saved addresses, wishlist, and fast checkout
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <span className="text-rose-500 font-bold shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address or 10-Digit Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or name@example.com"
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
                  onClick={() => navigate('/customer/forgot-password')}
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
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as Customer</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Preset Helper */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>1-Click Demo Customer Fill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('rahul.verma@example.com')}
                className="p-2 bg-white border border-amber-300 hover:border-amber-500 rounded-xl text-left font-medium text-slate-800 hover:bg-amber-100/50 transition-all cursor-pointer"
              >
                <div className="font-bold text-[11px] text-amber-900 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Rahul Verma
                </div>
                <div className="text-[10px] text-slate-500 truncate">Delhi (110001)</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('priya.sharma@example.com')}
                className="p-2 bg-white border border-amber-300 hover:border-amber-500 rounded-xl text-left font-medium text-slate-800 hover:bg-amber-100/50 transition-all cursor-pointer"
              >
                <div className="font-bold text-[11px] text-amber-900 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Priya Sharma
                </div>
                <div className="text-[10px] text-slate-500 truncate">Jaipur (302003)</div>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
            Don't have a Harwalkart Customer account yet?{' '}
            <button
              onClick={() => navigate('/customer/register')}
              className="text-amber-800 hover:text-amber-950 font-bold hover:underline ml-1 cursor-pointer"
            >
              Register with OTP & PIN code
            </button>
          </div>
        </div>

        {/* Security & Alternate Portal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 px-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Encrypted Indian Marketplace</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/seller/login')}
              className="hover:text-slate-900 font-semibold cursor-pointer underline"
            >
              Seller Login
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/admin/login')}
              className="hover:text-slate-900 font-semibold cursor-pointer underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
