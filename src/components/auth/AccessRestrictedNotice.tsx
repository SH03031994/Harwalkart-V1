import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { ShieldAlert, ArrowRight, Lock, User, Store, Shield } from 'lucide-react';

interface AccessRestrictedNoticeProps {
  requiredRole: Role;
}

export const AccessRestrictedNotice: React.FC<AccessRestrictedNoticeProps> = ({ requiredRole }) => {
  const { navigate, authSession } = useApp();

  const getRoleConfig = () => {
    switch (requiredRole) {
      case 'seller':
        return {
          title: 'Seller Authentication Required',
          description: 'You need an active Harwalkart Merchant / Seller account to access the Seller Dashboard.',
          loginPath: '/seller/login',
          registerPath: '/seller/register',
          color: 'amber',
          icon: <Store className="w-8 h-8 text-amber-500" />,
        };
      case 'admin':
        return {
          title: 'Administrator Authorization Required',
          description: 'This area is strictly restricted to Harwalkart Central Administration personnel.',
          loginPath: '/admin/login',
          registerPath: null,
          color: 'red',
          icon: <Shield className="w-8 h-8 text-red-500" />,
        };
      case 'customer':
      default:
        return {
          title: 'Customer Sign In Required',
          description: 'Please sign in to your Harwalkart customer account to view your orders, addresses, and account details.',
          loginPath: '/customer/login',
          registerPath: '/customer/register',
          color: 'amber',
          icon: <User className="w-8 h-8 text-amber-500" />,
        };
    }
  };

  const config = getRoleConfig();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          {config.icon}
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
            <Lock className="w-3.5 h-3.5" /> Access Restricted
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {config.title}
          </h2>
          <p className="text-xs text-slate-600">
            {config.description}
          </p>
        </div>

        {authSession.isAuthenticated && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-left">
            Current active session: <strong>{authSession.role?.toUpperCase()}</strong>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Please switch accounts or log in with {requiredRole.toUpperCase()} credentials to continue.
            </p>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={() => navigate(config.loginPath)}
            className="w-full py-3.5 px-4 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Sign In to {requiredRole.toUpperCase()} Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {config.registerPath && (
            <button
              onClick={() => navigate(config.registerPath!)}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Create New {requiredRole.toUpperCase()} Account
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium hover:underline block mx-auto cursor-pointer"
          >
            Return to HARWALKART Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
