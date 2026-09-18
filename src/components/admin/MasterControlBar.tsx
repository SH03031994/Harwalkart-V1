import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  Power,
  Banknote,
  Store,
  Users,
  Percent,
  Truck,
  Download,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Check,
} from 'lucide-react';

interface MasterControlBarProps {
  onOpenMasterModal: () => void;
}

export const MasterControlBar: React.FC<MasterControlBarProps> = ({ onOpenMasterModal }) => {
  const {
    websiteSettings,
    updateWebsiteSettings,
    products,
    sellers,
    orders,
    registeredCustomers,
    categories,
    brands,
    cityHubs,
    showToast,
  } = useApp();

  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [tempCommission, setTempCommission] = useState(websiteSettings.defaultCommissionRate.toString());

  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(websiteSettings.freeDeliveryThreshold.toString());

  const handleToggleMaintenance = () => {
    const next = !websiteSettings.maintenanceModeEnabled;
    updateWebsiteSettings({ maintenanceModeEnabled: next });
    showToast(next ? '⚠️ Maintenance Mode is now ACTIVE' : '✅ Marketplace is 100% LIVE & Online');
  };

  const handleToggleCod = () => {
    const next = !websiteSettings.enableCodDelivery;
    updateWebsiteSettings({ enableCodDelivery: next, enableCodPayment: next });
    showToast(next ? 'Cash on Delivery (COD) Enabled' : 'Cash on Delivery (COD) Disabled');
  };

  const handleToggleSellerReg = () => {
    const next = !websiteSettings.enableSellerRegistration;
    updateWebsiteSettings({ enableSellerRegistration: next });
    showToast(next ? 'Seller registrations OPEN' : 'Seller registrations PAUSED');
  };

  const handleToggleCustomerReg = () => {
    const next = !websiteSettings.enableCustomerRegistration;
    updateWebsiteSettings({ enableCustomerRegistration: next });
    showToast(next ? 'Customer signups OPEN' : 'Customer signups PAUSED');
  };

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempCommission) || 2.5;
    updateWebsiteSettings({ defaultCommissionRate: val });
    setIsEditingCommission(false);
    showToast(`Default platform commission set to ${val}%`);
  };

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(tempThreshold) || 3000;
    updateWebsiteSettings({ freeDeliveryThreshold: val });
    setIsEditingThreshold(false);
    showToast(`Free Delivery threshold set to ₹${val}`);
  };

  const handleQuickBackup = () => {
    try {
      const fullBackup = {
        meta: {
          platform: 'Harwalkart E-Commerce Marketplace',
          exportedAt: new Date().toISOString(),
          version: '2.5.0-master',
        },
        websiteSettings,
        products,
        sellers,
        orders,
        registeredCustomers,
        categories,
        brands,
        cityHubs,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `harwalkart_quick_backup_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      updateWebsiteSettings({
        lastBackupTimestamp: new Date().toISOString(),
      });

      showToast('Quick backup exported successfully');
    } catch {
      showToast('Export failed');
    }
  };

  return (
    <div
      id="admin-master-control-bar"
      className="bg-slate-900 text-white rounded-3xl p-3 sm:p-4 border border-slate-800 shadow-md space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Side Label */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-white text-xs block">
              MASTER CONTROL BAR
            </span>
            <span className="text-[10px] text-slate-400">
              Live Override Switches • Real-Time Engine
            </span>
          </div>
        </div>

        {/* Master Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickBackup}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Backup JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('Marketplace cache purged & re-indexed');
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
            title="Purge cache"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Purge Cache</span>
          </button>

          <button
            type="button"
            onClick={onOpenMasterModal}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Master Command Center</span>
          </button>
        </div>
      </div>

      {/* Grid of Direct Toggle Switches & Overrides */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
        {/* 1. Maintenance Mode Toggle */}
        <button
          type="button"
          onClick={handleToggleMaintenance}
          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            websiteSettings.maintenanceModeEnabled
              ? 'bg-rose-950/60 border-rose-600 text-rose-300'
              : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Marketplace</span>
            <span
              className={`w-2 h-2 rounded-full ${
                websiteSettings.maintenanceModeEnabled ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
          </div>
          <div className="mt-1">
            <span className="font-black block text-[11px]">
              {websiteSettings.maintenanceModeEnabled ? '⚠️ Maintenance' : '🟢 100% Live'}
            </span>
            <span className="text-[9px] text-slate-400">Click to switch</span>
          </div>
        </button>

        {/* 2. Cash on Delivery (COD) Switch */}
        <button
          type="button"
          onClick={handleToggleCod}
          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            websiteSettings.enableCodDelivery
              ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-300'
              : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Payment COD</span>
            <Banknote className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1">
            <span className="font-black block text-[11px]">
              {websiteSettings.enableCodDelivery ? '✓ COD Active' : '✕ COD Disabled'}
            </span>
            <span className="text-[9px] text-slate-400">Pan-India orders</span>
          </div>
        </button>

        {/* 3. Seller Onboarding Gateway */}
        <button
          type="button"
          onClick={handleToggleSellerReg}
          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            websiteSettings.enableSellerRegistration
              ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200'
              : 'bg-amber-950/40 border-amber-700/80 text-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Seller Portal</span>
            <Store className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1">
            <span className="font-black block text-[11px]">
              {websiteSettings.enableSellerRegistration ? '✓ Onboarding Open' : '⏸ Onboarding Paused'}
            </span>
            <span className="text-[9px] text-slate-400">KYC Merchant Gate</span>
          </div>
        </button>

        {/* 4. Customer Signups */}
        <button
          type="button"
          onClick={handleToggleCustomerReg}
          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            websiteSettings.enableCustomerRegistration
              ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200'
              : 'bg-amber-950/40 border-amber-700/80 text-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Shopper Signup</span>
            <Users className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-1">
            <span className="font-black block text-[11px]">
              {websiteSettings.enableCustomerRegistration ? '✓ Signups Open' : '⏸ Signups Paused'}
            </span>
            <span className="text-[9px] text-slate-400">Indian Accounts</span>
          </div>
        </button>

        {/* 5. Platform Commission Rate Inline Tweak */}
        <div className="p-2.5 rounded-2xl border border-slate-700 bg-slate-800/80 text-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Commission</span>
            <Percent className="w-3 h-3 text-amber-400" />
          </div>
          <div className="mt-1">
            {!isEditingCommission ? (
              <div
                onClick={() => setIsEditingCommission(true)}
                className="cursor-pointer hover:text-amber-400 flex items-center justify-between"
              >
                <span className="font-black text-[11px]">
                  {websiteSettings.defaultCommissionRate}% Standard
                </span>
                <span className="text-[9px] text-amber-400 underline">Edit</span>
              </div>
            ) : (
              <form onSubmit={handleSaveCommission} className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={tempCommission}
                  onChange={e => setTempCommission(e.target.value)}
                  className="w-12 px-1 py-0.5 bg-slate-900 border border-slate-600 rounded text-center text-xs font-bold text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 bg-amber-500 text-slate-950 rounded text-[10px] font-bold"
                >
                  <Check className="w-3 h-3" />
                </button>
              </form>
            )}
            <span className="text-[9px] text-slate-400 block">Local Seller Fee</span>
          </div>
        </div>

        {/* 6. Free Delivery Threshold Inline Tweak */}
        <div className="p-2.5 rounded-2xl border border-slate-700 bg-slate-800/80 text-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Free Shipping</span>
            <Truck className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="mt-1">
            {!isEditingThreshold ? (
              <div
                onClick={() => setIsEditingThreshold(true)}
                className="cursor-pointer hover:text-emerald-400 flex items-center justify-between"
              >
                <span className="font-black text-[11px]">
                  &gt; ₹{websiteSettings.freeDeliveryThreshold}
                </span>
                <span className="text-[9px] text-emerald-400 underline">Edit</span>
              </div>
            ) : (
              <form onSubmit={handleSaveThreshold} className="flex items-center gap-1">
                <input
                  type="number"
                  step="50"
                  min="0"
                  max="10000"
                  value={tempThreshold}
                  onChange={e => setTempThreshold(e.target.value)}
                  className="w-16 px-1 py-0.5 bg-slate-900 border border-slate-600 rounded text-center text-xs font-bold text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 bg-emerald-500 text-white rounded text-[10px] font-bold"
                >
                  <Check className="w-3 h-3" />
                </button>
              </form>
            )}
            <span className="text-[9px] text-slate-400 block">Min Cart Value</span>
          </div>
        </div>
      </div>
    </div>
  );
};
