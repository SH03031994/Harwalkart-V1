import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Bike,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Zap,
  MapPin,
  Star,
  CheckCircle2,
  Wallet,
} from 'lucide-react';

export const DeliveryPartnerLogin: React.FC = () => {
  const { deliveryPartners, deliveryPartnerLogin, navigate } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = deliveryPartnerLogin(identifier, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Delivery partner login failed. Please check credentials.');
      }
    }, 250);
  };

  const handleQuickLogin = (partnerId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      const res = deliveryPartnerLogin(partnerId);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to authenticate delivery partner.');
      }
    }, 200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-md w-full space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <Logo size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-black rounded-full text-xs tracking-wider uppercase shadow-xs">
            <Bike className="w-3.5 h-3.5" />
            <span>Hyperlocal Delivery Fleet</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Delivery Partner Portal
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Accept store pickups, complete customer deliveries, and manage your daily earnings
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs rounded-2xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Registered Mobile, Email, or Rider ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. 9818822334 or rider_del_101"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Passcode / PIN (Optional for Demo)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Demo pass: rider123"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Fleet Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Rider Accounts */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ⚡ Instant Demo Riders:
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">1-Click Sign In</span>
            </div>

            <div className="space-y-2">
              {deliveryPartners.slice(0, 3).map(rider => (
                <button
                  key={rider.id}
                  onClick={() => handleQuickLogin(rider.id)}
                  type="button"
                  className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/80 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-2xl flex items-center justify-between text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      <Bike className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{rider.name}</span>
                        <span className="text-[10px] text-amber-500 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {rider.rating}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                        <span>{rider.city}</span>
                        <span>•</span>
                        <span>{rider.vehicleType} ({rider.vehicleNumber})</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 block">
                      ₹{rider.walletBalance}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {rider.completedDeliveries} trips
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-[11px] leading-relaxed">
              Instant daily UPI settlements, ₹50-₹80 per delivery + fuel allowance, and 100% customer cash handover tracking.
            </span>
          </div>

          {/* Registration link */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              New rider? Want to earn with Harwalkart?{' '}
              <button
                type="button"
                onClick={() => navigate('/delivery/register')}
                className="font-bold text-emerald-600 hover:text-emerald-500 hover:underline cursor-pointer block sm:inline mt-1 sm:mt-0"
              >
                Create Delivery Partner Account →
              </button>
            </p>
          </div>
        </div>

        {/* Back navigation */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Harwalkart Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
