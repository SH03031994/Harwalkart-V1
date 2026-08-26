import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { WebsiteSettings } from '../../../types';
import {
  Sliders,
  Save,
  RotateCcw,
  Building,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  DollarSign,
  Radio,
  CheckCircle2,
} from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings, resetWebsiteSettings, showToast } = useApp();

  const [formData, setFormData] = useState<WebsiteSettings>({
    ...websiteSettings,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings(formData);
  };

  const handleReset = () => {
    if (confirm('Reset all website settings to original platform defaults?')) {
      resetWebsiteSettings();
      setTimeout(() => {
        setFormData({
          brandName: 'HARWALKART',
          tagline: 'Every One Local Shop',
          flagshipBrand: 'KITCHEN SHAKTI',
          flagshipTagline: 'Har Din Ka Hissa.',
          helplinePhone: '+91 9372207811',
          supportEmail: 'harwalkart@gmail.com',
          officialAddress: 'Harwalkart Enterprise Head Office, Connaught Place, New Delhi, India 110001',
          defaultCommissionRate: 2.5,
          minWithdrawalAmount: 500,
          freeDeliveryThreshold: 499,
          standardDeliveryFee: 40,
          gstNumber: '07AAAAA0000A1Z5',
          fssaiLicense: '10020011000123',
          enableGpsLocation: true,
          enableDirectKitchenShakti: true,
          announcementBannerText: '🎉 Exclusive Launch Offer: Use Coupon HARWAL100 for Flat ₹100 Off on orders above ₹499!',
          isAnnouncementActive: true,
          socialLinks: {},
        });
      }, 50);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Website & Platform System Settings</h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
              Live Production
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage global marketplace branding, helpline contacts, in-house spice credentials, fees, and promo banners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Marketplace Branding */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-600" />
            <span>Harwalkart Marketplace Identity</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Platform Brand Name *</label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Marketplace Tagline *</label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 2: In-House Spice Line (Kitchen Shakti) */}
        <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-4">
          <h4 className="font-black text-amber-950 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Flagship Direct Spice Line (Kitchen Shakti)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">In-House Brand Name *</label>
              <input
                type="text"
                required
                value={formData.flagshipBrand}
                onChange={e => setFormData({ ...formData, flagshipBrand: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Brand Tagline *</label>
              <input
                type="text"
                required
                value={formData.flagshipTagline}
                onChange={e => setFormData({ ...formData, flagshipTagline: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Support */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Customer Care & Headquarters</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">National Helpline Mobile *</label>
              <input
                type="text"
                required
                value={formData.helplinePhone}
                onChange={e => setFormData({ ...formData, helplinePhone: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Official Support Email *</label>
              <input
                type="email"
                required
                value={formData.supportEmail}
                onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Registered Office Address *</label>
              <input
                type="text"
                required
                value={formData.officialAddress}
                onChange={e => setFormData({ ...formData, officialAddress: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Fees & Commissions */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-black text-slate-950 text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span>Pricing, Delivery Fees & Commission Rates</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Default Seller Commission (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.defaultCommissionRate}
                onChange={e => setFormData({ ...formData, defaultCommissionRate: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                required
                value={formData.freeDeliveryThreshold}
                onChange={e => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                required
                value={formData.standardDeliveryFee}
                onChange={e => setFormData({ ...formData, standardDeliveryFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Announcements */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-black text-slate-950 text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-600" />
            <span>Global Promo Banner & Toggles</span>
          </h4>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Top Header Announcement Marquee Text</label>
              <input
                type="text"
                value={formData.announcementBannerText}
                onChange={e => setFormData({ ...formData, announcementBannerText: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Show Promo Announcement Banner</span>
                <span className="text-slate-500 text-[11px]">
                  Display festive offers and discount notifications across customer header.
                </span>
              </div>

              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={e => setFormData({ ...formData, isAnnouncementActive: e.target.checked })}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
