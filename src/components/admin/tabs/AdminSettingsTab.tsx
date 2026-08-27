import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { WebsiteSettings, CompanyBankAccount } from '../../../types';
import {
  Globe,
  Sliders,
  Store,
  Truck,
  CreditCard,
  Package,
  Users,
  MapPin,
  Bell,
  Shield,
  FileText,
  Server,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  Info,
  ShieldCheck,
  Lock,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const {
    websiteSettings,
    updateWebsiteSettings,
    resetWebsiteSettings,
    companyBankAccount,
    saveCompanyBankAccount,
    showToast,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    | 'basic'
    | 'appearance'
    | 'marketplace'
    | 'delivery'
    | 'payment'
    | 'orders'
    | 'users_sellers'
    | 'location'
    | 'notifications'
    | 'security'
    | 'legal'
    | 'system'
  >('basic');

  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<WebsiteSettings>({
    ...websiteSettings,
  });

  const [activeLegalSubTab, setActiveLegalSubTab] = useState<
    'terms' | 'privacy' | 'refund' | 'cancellation' | 'shipping' | 'seller'
  >('terms');

  const [activityLogs, setActivityLogs] = useState<
    Array<{ id: string; timestamp: string; action: string; user: string; ip: string; status: string }>
  >([]);

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync state if external changes happen
  useEffect(() => {
    setFormData({ ...websiteSettings });
  }, [websiteSettings]);

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    const token = localStorage.getItem('hk_admin_auth_token');
    if (!token) return;
    try {
      const res = await fetch('/api/admin/activity-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setActivityLogs(data.logs);
      }
    } catch (e) {
      console.warn('Could not fetch activity logs:', e);
    }
  };

  useEffect(() => {
    if (activeSection === 'security' || activeSection === 'system') {
      fetchActivityLogs();
    }
  }, [activeSection]);

  const handleChange = <K extends keyof WebsiteSettings>(key: K, value: WebsiteSettings[K]) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleNestedSocialChange = (key: keyof WebsiteSettings['socialLinks'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    updateWebsiteSettings(formData);
    setHasUnsavedChanges(false);
    setTimeout(() => {
      setIsSaving(false);
      showToast('All Platform Settings updated and saved permanently! 🚀');
    }, 300);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset ALL 12 website setting sections to factory defaults?')) {
      resetWebsiteSettings();
      setHasUnsavedChanges(false);
    }
  };

  const handleDownloadBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'HARWALKART Multi-Vendor E-Commerce',
      websiteSettings: formData,
      companyBankAccount,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harwalkart_settings_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Database Settings backup downloaded successfully! 💾');
  };

  const handleClearLogs = async () => {
    const token = localStorage.getItem('hk_admin_auth_token');
    if (!token) return;
    try {
      const res = await fetch('/api/admin/clear-logs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('System logs cleared.');
        fetchActivityLogs();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // 12 Section Definitions
  const SECTIONS = [
    { id: 'basic', label: '1. Basic Information', icon: Globe, badge: 'Core' },
    { id: 'appearance', label: '2. Appearance & Theme', icon: Sliders, badge: 'UI' },
    { id: 'marketplace', label: '3. Marketplace & Vendors', icon: Store, badge: 'Rules' },
    { id: 'delivery', label: '4. Delivery & Shipping', icon: Truck, badge: 'Logistics' },
    { id: 'payment', label: '5. Payment & Settlement', icon: CreditCard, badge: 'Finance' },
    { id: 'orders', label: '6. Orders, Returns & SLA', icon: Package, badge: 'Orders' },
    { id: 'users_sellers', label: '7. Users, KYC & GST', icon: Users, badge: 'KYC' },
    { id: 'location', label: '8. Locations & Coverage', icon: MapPin, badge: 'Geo' },
    { id: 'notifications', label: '9. Alerts & Notifications', icon: Bell, badge: 'Messaging' },
    { id: 'security', label: '10. Security & 2FA', icon: Shield, badge: 'Admin' },
    { id: 'legal', label: '11. Legal Pages & Policies', icon: FileText, badge: 'Policy' },
    { id: 'system', label: '12. System, Backup & Logs', icon: Server, badge: 'Ops' },
  ] as const;

  const filteredSections = SECTIONS.filter(s =>
    s.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-slate-950">Website & Marketplace Master Settings</h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure all 12 operational modules: Basic Brand Info, Appearance, Marketplace, Delivery, Payments, Orders, KYC, Locations, Alerts, Security, Legal Policies, and System Diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Reset to factory defaults"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className={`px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all ${
              hasUnsavedChanges ? 'ring-2 ring-amber-400 ring-offset-2 animate-pulse' : ''
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigation + Settings Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-3">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search settings sections..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {filteredSections.map(s => {
                const IconComponent = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    id={`settings-nav-${s.id}`}
                    onClick={() => setActiveSection(s.id as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 text-amber-400 shadow-md font-black'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="truncate">{s.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                        isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Platform Status Widget */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Marketplace Engine</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-black">
                {formData.isWebsiteLive ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="text-sm font-black text-amber-400">{formData.brandName}</div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {formData.tagline} • Pin Code Serviceability: {formData.enablePincodeCheck ? 'Active' : 'Global'}
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Commission: {formData.defaultCommissionRate}%</span>
              <span>Free Delivery: ₹{formData.freeDeliveryThreshold}</span>
            </div>
          </div>
        </div>

        {/* Section Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ========================================================================= */}
            {/* 1. BASIC INFORMATION */}
            {/* ========================================================================= */}
            {activeSection === 'basic' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-amber-600" />
                      <span>1. Basic Information & Branding</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure your marketplace name, official logos, customer care contacts, and business address.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Brand / Marketplace Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.brandName}
                      onChange={e => handleChange('brandName', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Platform Tagline *</label>
                    <input
                      type="text"
                      required
                      value={formData.tagline}
                      onChange={e => handleChange('tagline', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Logo Image URL</label>
                    <input
                      type="text"
                      value={formData.logoUrl}
                      onChange={e => handleChange('logoUrl', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Favicon URL</label>
                    <input
                      type="text"
                      value={formData.faviconUrl}
                      onChange={e => handleChange('faviconUrl', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Platform Description (SEO Meta)</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={e => handleChange('description', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Customer Helpline Phone *</label>
                    <input
                      type="text"
                      required
                      value={formData.helplinePhone}
                      onChange={e => handleChange('helplinePhone', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">WhatsApp Support Mobile</label>
                    <input
                      type="text"
                      value={formData.whatsappSupportNumber}
                      onChange={e => handleChange('whatsappSupportNumber', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Official Support Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.supportEmail}
                      onChange={e => handleChange('supportEmail', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">In-House Spice Brand Name</label>
                    <input
                      type="text"
                      value={formData.flagshipBrand}
                      onChange={e => handleChange('flagshipBrand', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>Head Office Physical Address *</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold">
                          Admin Editable Only
                        </span>
                      </label>
                      <span className="text-[11px] text-slate-400">Single Official Company HQ</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.officialAddress}
                      onChange={e => handleChange('officialAddress', e.target.value)}
                      placeholder="Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white font-medium"
                    />
                    <p className="text-[11px] text-slate-500">
                      Official company Head Office used universally across Website Footer, Invoices, Contact Us, and Legal terms. Does not change with customer GPS.
                    </p>
                  </div>

                  <div className="space-y-1.5 col-span-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Registered Corporate Entity Address</label>
                    <input
                      type="text"
                      value={formData.registeredAddress || ''}
                      onChange={e => handleChange('registeredAddress', e.target.value)}
                      placeholder="Harwalkart (Jai Shree Ram Enterprises), Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. APPEARANCE & THEME */}
            {/* ========================================================================= */}
            {activeSection === 'appearance' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-600" />
                    <span>2. Appearance, Themes & Homepage Sections</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Customize branding color palettes, homepage banner headlines, visibility of home sections, and footer contents.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Marketplace Theme</label>
                    <select
                      value={formData.theme}
                      onChange={e => handleChange('theme', e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="amber-modern">Amber Golden (Harwalkart Modern)</option>
                      <option value="light">Crisp Light Clean</option>
                      <option value="dark">Midnight Dark</option>
                      <option value="system">Auto System Preference</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Primary Brand Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={e => handleChange('primaryColor', e.target.value)}
                        className="w-10 h-10 p-0.5 border border-slate-200 rounded-xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={e => handleChange('primaryColor', e.target.value)}
                        className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Secondary Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={e => handleChange('accentColor', e.target.value)}
                        className="w-10 h-10 p-0.5 border border-slate-200 rounded-xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={e => handleChange('accentColor', e.target.value)}
                        className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Homepage Banner Headlines</h4>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Hero Main Title</label>
                      <input
                        type="text"
                        value={formData.heroBannerTitle}
                        onChange={e => handleChange('heroBannerTitle', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Hero Subtitle</label>
                      <input
                        type="text"
                        value={formData.heroBannerSubtitle}
                        onChange={e => handleChange('heroBannerSubtitle', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Visibility Toggles */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Homepage Section Toggles</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Show Main Hero Banner</span>
                      <input
                        type="checkbox"
                        checked={formData.showHeroBanner}
                        onChange={e => handleChange('showHeroBanner', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Show Categories Showcase</span>
                      <input
                        type="checkbox"
                        checked={formData.showCategorySection}
                        onChange={e => handleChange('showCategorySection', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Show Trending Deals Grid</span>
                      <input
                        type="checkbox"
                        checked={formData.showTrendingSection}
                        onChange={e => handleChange('showTrendingSection', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Show Kitchen Shakti Spice Direct</span>
                      <input
                        type="checkbox"
                        checked={formData.showKitchenShaktiSection}
                        onChange={e => handleChange('showKitchenShaktiSection', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Announcement Banner */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-950 text-xs">Top Header Announcement Bar</span>
                    <input
                      type="checkbox"
                      checked={formData.isAnnouncementActive}
                      onChange={e => handleChange('isAnnouncementActive', e.target.checked)}
                      className="w-4 h-4 accent-amber-600 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.announcementBannerText}
                    onChange={e => handleChange('announcementBannerText', e.target.value)}
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-slate-900"
                    placeholder="e.g. 🎉 Launch Discount: Use code HARWAL100 for Flat ₹100 Off!"
                  />
                </div>

                {/* Footer Settings */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Footer Settings & Social Links</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Footer About Text</label>
                      <input
                        type="text"
                        value={formData.footerAboutText}
                        onChange={e => handleChange('footerAboutText', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Footer Copyright Text</label>
                      <input
                        type="text"
                        value={formData.footerCopyrightText}
                        onChange={e => handleChange('footerCopyrightText', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Facebook URL</label>
                      <input
                        type="text"
                        value={formData.socialLinks?.facebook || ''}
                        onChange={e => handleNestedSocialChange('facebook', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Instagram URL</label>
                      <input
                        type="text"
                        value={formData.socialLinks?.instagram || ''}
                        onChange={e => handleNestedSocialChange('instagram', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">YouTube Channel</label>
                      <input
                        type="text"
                        value={formData.socialLinks?.youtube || ''}
                        onChange={e => handleNestedSocialChange('youtube', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Twitter / X URL</label>
                      <input
                        type="text"
                        value={formData.socialLinks?.twitter || ''}
                        onChange={e => handleNestedSocialChange('twitter', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. MARKETPLACE & VENDORS */}
            {/* ========================================================================= */}
            {activeSection === 'marketplace' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-600" />
                    <span>3. Marketplace, Vendor Governance & Commission</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Control open registrations, KYC checks, admin review workflow for seller products, and take-rate commission %.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Customer Registration</span>
                      <p className="text-slate-500 text-[11px]">Allow new shoppers to create accounts on Harwalkart</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableCustomerRegistration}
                      onChange={e => handleChange('enableCustomerRegistration', e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Seller Self-Registration</span>
                      <p className="text-slate-500 text-[11px]">Allow local shops and vendors to apply online</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableSellerRegistration}
                      onChange={e => handleChange('enableSellerRegistration', e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Seller KYC Mandatory Approval</span>
                      <p className="text-slate-500 text-[11px]">Admin review of GST & PAN before seller store goes live</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.requireSellerKycApproval}
                      onChange={e => handleChange('requireSellerKycApproval', e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Product Admin Approval Gate</span>
                      <p className="text-slate-500 text-[11px]">New seller products require Admin sign-off before listing</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.requireProductApproval}
                      onChange={e => handleChange('requireProductApproval', e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Reviews & Ratings System</span>
                      <p className="text-slate-500 text-[11px]">Allow verified customers to post reviews on products</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableProductReviews}
                      onChange={e => handleChange('enableProductReviews', e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Kitchen Shakti Flagship Channel</span>
                      <p className="text-slate-500 text-[11px]">Enable direct in-house spice sales channel</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableDirectKitchenShakti}
                      onChange={e => handleChange('enableDirectKitchenShakti', e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
                  <h4 className="font-black text-amber-950 text-xs">Default Marketplace Commission Rate</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Platform Commission % on Completed Orders</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={50}
                          value={formData.defaultCommissionRate}
                          onChange={e => handleChange('defaultCommissionRate', Number(e.target.value))}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                        💡 Example: On an order of ₹1,000, Harwalkart retains ₹{(1000 * (formData.defaultCommissionRate / 100)).toFixed(1)} ({formData.defaultCommissionRate}%) and credits the merchant with ₹{(1000 * (1 - formData.defaultCommissionRate / 100)).toFixed(1)}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. DELIVERY & SHIPPING */}
            {/* ========================================================================= */}
            {activeSection === 'delivery' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-600" />
                    <span>4. Delivery, Radius, Shipping Rates & COD</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Define hyperlocal delivery zones, standard courier tariffs, free delivery cart thresholds, and pan-India shipping.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Local Delivery Radius (KM)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formData.localDeliveryRadiusKm}
                      onChange={e => handleChange('localDeliveryRadiusKm', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Standard Delivery Fee (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.standardDeliveryFee}
                      onChange={e => handleChange('standardDeliveryFee', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Free Delivery Minimum Cart (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.freeDeliveryThreshold}
                      onChange={e => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Express Delivery Fee (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.expressDeliveryFee}
                      onChange={e => handleChange('expressDeliveryFee', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Local Delivery SLA Label</label>
                    <input
                      type="text"
                      value={formData.localDeliveryTime}
                      onChange={e => handleChange('localDeliveryTime', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      placeholder="15-45 mins"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Pan-India Courier Fee (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.panIndiaDeliveryFee}
                      onChange={e => handleChange('panIndiaDeliveryFee', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Logistics Capabilities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-800 block">Pan-India Delivery for Direct Spices</span>
                        <span className="text-slate-500 text-[11px]">Allow buyers anywhere in India to order Kitchen Shakti packages</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.enablePanIndiaDelivery}
                        onChange={e => handleChange('enablePanIndiaDelivery', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-800 block">Cash on Delivery (COD) Option</span>
                        <span className="text-slate-500 text-[11px]">Enable doorstep cash payment for verified postal codes</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.enableCodDelivery}
                        onChange={e => handleChange('enableCodDelivery', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 5. PAYMENT & SETTLEMENT */}
            {/* ========================================================================= */}
            {activeSection === 'payment' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span>5. Payment Modes, Seller Payouts & Company Bank</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Activate checkout payment modes, set payout limits, configure settlement cycles, and view the corporate bank account.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <span className="font-bold text-slate-800">UPI Payments (GPay, PhonePe, Paytm, BHIM)</span>
                    <input
                      type="checkbox"
                      checked={formData.enableUpiPayment}
                      onChange={e => handleChange('enableUpiPayment', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <span className="font-bold text-slate-800">Debit / Credit Cards (Visa, Master, RuPay)</span>
                    <input
                      type="checkbox"
                      checked={formData.enableCardPayment}
                      onChange={e => handleChange('enableCardPayment', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <span className="font-bold text-slate-800">Net Banking (All Indian Banks)</span>
                    <input
                      type="checkbox"
                      checked={formData.enableNetBankingPayment}
                      onChange={e => handleChange('enableNetBankingPayment', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <span className="font-bold text-slate-800">Harwalkart Customer Wallet</span>
                    <input
                      type="checkbox"
                      checked={formData.enableWalletPayment}
                      onChange={e => handleChange('enableWalletPayment', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Seller Payout & Settlement Rules */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Merchant Payout & Settlement Rules</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Min. Withdrawal Threshold (₹)</label>
                      <input
                        type="number"
                        min={100}
                        value={formData.minWithdrawalAmount}
                        onChange={e => handleChange('minWithdrawalAmount', Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Payout Schedule Frequency</label>
                      <select
                        value={formData.payoutSchedule}
                        onChange={e => handleChange('payoutSchedule', e.target.value as any)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                      >
                        <option value="instant">Instant Automated (T+0)</option>
                        <option value="daily">Daily Batch (T+1)</option>
                        <option value="weekly">Weekly Settlement</option>
                        <option value="manual">Manual Admin Review</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Settlement Cycle (Days)</label>
                      <input
                        type="number"
                        min={1}
                        max={7}
                        value={formData.settlementCycleDays}
                        onChange={e => handleChange('settlementCycleDays', Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Bank Status */}
                <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">
                        Company Bank Account: {companyBankAccount ? companyBankAccount.bankName : 'Not Set Yet'}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {companyBankAccount
                          ? `A/C: ••••••••${companyBankAccount.accountNumber.slice(-4)} | IFSC: ${companyBankAccount.ifscCode}`
                          : 'Configure your company current account in Payment Settings & Bank tab.'}
                      </p>
                    </div>
                  </div>

                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-xl uppercase self-start sm:self-auto">
                    {companyBankAccount ? 'Ready for Gateway' : 'Setup Required'}
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 6. ORDERS, RETURNS & SLA */}
            {/* ========================================================================= */}
            {activeSection === 'orders' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-600" />
                    <span>6. Orders, Cancellation Window & Refund SLA</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Configure order expiry timeouts, rider GPS tracking, buyer self-cancellation windows, and return policies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Auto-Cancel Unpaid Orders Timeout (Minutes)</label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={formData.orderAutoCancelUnpaidMinutes}
                      onChange={e => handleChange('orderAutoCancelUnpaidMinutes', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Buyer Cancellation Window (Minutes)</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={formData.orderCancellationWindowMinutes}
                      onChange={e => handleChange('orderCancellationWindowMinutes', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Return Policy Window (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={formData.returnWindowDays}
                      onChange={e => handleChange('returnWindowDays', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Refund Settlement SLA (Business Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.refundProcessingDays}
                      onChange={e => handleChange('refundProcessingDays', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-800 block">Live Rider Tracking Animation</span>
                      <span className="text-slate-500 text-[11px]">Show interactive step-by-step dispatch tracking</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableOrderLiveTracking}
                      onChange={e => handleChange('enableOrderLiveTracking', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-800 block">Allow Customer Cancellations</span>
                      <span className="text-slate-500 text-[11px]">Enable cancel button before merchant dispatch</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.allowCustomerOrderCancellation}
                      onChange={e => handleChange('allowCustomerOrderCancellation', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer sm:col-span-2">
                    <div>
                      <span className="font-bold text-slate-800 block">Allow Customer Returns & Replacements</span>
                      <span className="text-slate-500 text-[11px]">Enable customer return request flow for damaged or incorrect goods</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.allowCustomerReturns}
                      onChange={e => handleChange('allowCustomerReturns', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 7. USERS, KYC & GST */}
            {/* ========================================================================= */}
            {activeSection === 'users_sellers' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    <span>7. Customer Verification, Seller KYC & GST Rules</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Enforce compliance requirements, GSTIN tax validation, FSSAI licensing, and auto-suspension safety triggers.
                  </p>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-800 block">Customer Mobile OTP Verification</span>
                      <span className="text-slate-500 text-[11px]">Mandatory 6-digit OTP verification for new shoppers</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.requireCustomerOtpVerification}
                      onChange={e => handleChange('requireCustomerOtpVerification', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-800 block">Seller GSTIN Number Required</span>
                      <span className="text-slate-500 text-[11px]">Sellers must provide active 15-digit GSTIN</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.requireSellerGst}
                      onChange={e => handleChange('requireSellerGst', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-800 block">Seller PAN Card Proof</span>
                      <span className="text-slate-500 text-[11px]">Mandatory PAN verification for vendor tax compliance</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.requireSellerPan}
                      onChange={e => handleChange('requireSellerPan', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-800 block">FSSAI Food License Mandatory</span>
                      <span className="text-slate-500 text-[11px]">Mandatory 14-digit FSSAI license for food/grocery shops</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.requireSellerFssai}
                      onChange={e => handleChange('requireSellerFssai', e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Harwalkart Central GST & Tax Info */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Platform GST & Tax Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Harwalkart GSTIN Number</label>
                      <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={e => handleChange('gstNumber', e.target.value.toUpperCase())}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Default Food/Grocery GST (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={28}
                        value={formData.defaultGstPercentage}
                        onChange={e => handleChange('defaultGstPercentage', Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Central FSSAI License No.</label>
                      <input
                        type="text"
                        value={formData.fssaiLicense}
                        onChange={e => handleChange('fssaiLicense', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Seller Safety & Auto Block */}
                <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-3">
                  <h4 className="font-black text-rose-950 text-xs">Seller Disciplinary & Auto-Suspension Trigger</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.autoSuspendSellerOnReports}
                        onChange={e => handleChange('autoSuspendSellerOnReports', e.target.checked)}
                        className="w-4 h-4 accent-rose-600 cursor-pointer"
                      />
                      <span className="font-bold text-rose-950">Auto-flag & temporarily restrict sellers on high dispute complaints</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-xs">Max Complaints:</span>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={formData.maxReportThreshold}
                        onChange={e => handleChange('maxReportThreshold', Number(e.target.value))}
                        className="w-16 p-2 bg-white border border-rose-300 rounded-xl font-bold text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 8. LOCATIONS & COVERAGE */}
            {/* ========================================================================= */}
            {activeSection === 'location' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span>8. Serviceable PIN Codes, Cities & GPS Settings</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Define active delivery PIN codes, metropolitan hub coverage, GPS auto-locating, and default landing regions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700">Active Serviceable PIN Codes (Comma Separated)</label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.enablePincodeCheck}
                          onChange={e => handleChange('enablePincodeCheck', e.target.checked)}
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />
                        <span className="font-bold text-slate-800">Strict PIN Code Check Active</span>
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.allowedPincodes}
                      onChange={e => handleChange('allowedPincodes', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                      placeholder="110001, 110002, 302001, 400001..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Default City</label>
                      <input
                        type="text"
                        value={formData.defaultCity}
                        onChange={e => handleChange('defaultCity', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Default State / Region</label>
                      <input
                        type="text"
                        value={formData.defaultState}
                        onChange={e => handleChange('defaultState', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">GPS Auto Location</label>
                      <select
                        value={formData.enableGpsLocation ? 'true' : 'false'}
                        onChange={e => handleChange('enableGpsLocation', e.target.value === 'true')}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      >
                        <option value="true">Enabled (Auto-detect buyer area)</option>
                        <option value="false">Disabled (Manual PIN selection only)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Operational Major Metropolitan Cities (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.operationalCities?.join(', ') || ''}
                      onChange={e =>
                        handleChange(
                          'operationalCities',
                          e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                        )
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Coverage Description Banner Label</label>
                    <input
                      type="text"
                      value={formData.serviceableAreasLabel}
                      onChange={e => handleChange('serviceableAreasLabel', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 9. ALERTS & NOTIFICATIONS */}
            {/* ========================================================================= */}
            {activeSection === 'notifications' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-600" />
                    <span>9. Email, SMS & WhatsApp Notification Settings</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Configure automated order alerts, OTP dispatch gateways, customer shipment notices, and vendor triggers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">SMS Gateway Provider</label>
                    <select
                      value={formData.smsGatewayProvider}
                      onChange={e => handleChange('smsGatewayProvider', e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="Default Gateway">Default Internal Gateway</option>
                      <option value="Fast2SMS">Fast2SMS (India)</option>
                      <option value="MSG91">MSG91</option>
                      <option value="Twilio">Twilio Global</option>
                    </select>
                  </div>

                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Sender Email Address</label>
                    <input
                      type="email"
                      value={formData.notificationSenderEmail}
                      onChange={e => handleChange('notificationSenderEmail', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* Channel Toggles */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Active Messaging Channels</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Email Alerts</span>
                      <input
                        type="checkbox"
                        checked={formData.enableEmailNotifications}
                        onChange={e => handleChange('enableEmailNotifications', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">SMS Notifications</span>
                      <input
                        type="checkbox"
                        checked={formData.enableSmsNotifications}
                        onChange={e => handleChange('enableSmsNotifications', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">WhatsApp Messages</span>
                      <input
                        type="checkbox"
                        checked={formData.enableWhatsAppNotifications}
                        onChange={e => handleChange('enableWhatsAppNotifications', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Trigger Events */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Automated Event Triggers</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Notify Customer when Order Placed</span>
                      <input
                        type="checkbox"
                        checked={formData.notifyCustomerOnOrderPlaced}
                        onChange={e => handleChange('notifyCustomerOnOrderPlaced', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Notify Customer on Out for Delivery</span>
                      <input
                        type="checkbox"
                        checked={formData.notifyCustomerOnOutForDelivery}
                        onChange={e => handleChange('notifyCustomerOnOutForDelivery', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Notify Seller Store on New Incoming Order</span>
                      <input
                        type="checkbox"
                        checked={formData.notifySellerOnNewOrder}
                        onChange={e => handleChange('notifySellerOnNewOrder', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Notify Delivery Partner on Dispatch Ready</span>
                      <input
                        type="checkbox"
                        checked={formData.notifyDeliveryPartnerOnDispatch}
                        onChange={e => handleChange('notifyDeliveryPartnerOnDispatch', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 10. SECURITY & 2FA */}
            {/* ========================================================================= */}
            {activeSection === 'security' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span>10. Admin Security, 2FA, Session Timeout & Permissions</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Maintain strict Super Admin protections, brute force login rate limits, activity logging, and sub-admin role gates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Admin 2FA Authentication</label>
                    <select
                      value={formData.enableAdmin2FA ? 'true' : 'false'}
                      onChange={e => handleChange('enableAdmin2FA', e.target.value === 'true')}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="true">Enabled (Mandatory OTP)</option>
                      <option value="false">Disabled (Password only)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">2FA Method</label>
                    <select
                      value={formData.admin2faMethod}
                      onChange={e => handleChange('admin2faMethod', e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="email_otp">Email OTP Code</option>
                      <option value="sms_otp">SMS OTP to Mobile</option>
                      <option value="authenticator_app">Authenticator App (TOTP)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Admin Inactivity Timeout</label>
                    <select
                      value={formData.adminSessionTimeoutMinutes}
                      onChange={e => handleChange('adminSessionTimeoutMinutes', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes (1 Hour)</option>
                      <option value={120}>120 Minutes (2 Hours)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Max Failed Logins (Lockout)</label>
                    <input
                      type="number"
                      min={3}
                      max={10}
                      value={formData.maxFailedLoginAttempts}
                      onChange={e => handleChange('maxFailedLoginAttempts', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Lockout Duration (Minutes)</label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={formData.lockoutDurationMinutes}
                      onChange={e => handleChange('lockoutDurationMinutes', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Audit Log Retention (Days)</label>
                    <input
                      type="number"
                      min={30}
                      max={365}
                      value={formData.logRetentionDays}
                      onChange={e => handleChange('logRetentionDays', Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                {/* Sub-Admin Role Permissions */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Sub-Admin Role Permission Guard</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Allow Sub-Admins to Delete Products</span>
                      <input
                        type="checkbox"
                        checked={formData.allowSubAdminProductDelete}
                        onChange={e => handleChange('allowSubAdminProductDelete', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <span className="font-bold text-slate-800">Allow Sub-Admins to Approve Payouts</span>
                      <input
                        type="checkbox"
                        checked={formData.allowSubAdminPayoutApproval}
                        onChange={e => handleChange('allowSubAdminPayoutApproval', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Security Audit Trail Viewer */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Security & Activity Audit Logs</span>
                    </h4>
                    <button
                      type="button"
                      onClick={fetchActivityLogs}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] space-y-2 max-h-48 overflow-y-auto">
                    {activityLogs.length === 0 ? (
                      <div className="text-slate-500 italic">No security alerts recorded. All systems normal.</div>
                    ) : (
                      activityLogs.map(l => (
                        <div key={l.id} className="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
                          <div>
                            <span className="text-amber-400 font-bold">[{l.status}]</span>{' '}
                            <span className="text-white">{l.action}</span>
                            <span className="text-slate-400 text-[10px] block">By {l.user} ({l.ip})</span>
                          </div>
                          <span className="text-slate-500 text-[10px] whitespace-nowrap">
                            {new Date(l.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 11. LEGAL PAGES & POLICIES */}
            {/* ========================================================================= */}
            {activeSection === 'legal' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span>11. Legal Pages & Compliance Policy Editor</span>
                    </h3>
                    <p className="text-slate-500 mt-0.5">
                      Edit published terms, privacy data protection policy, refunds, cancellations, and merchant agreements.
                    </p>
                  </div>
                </div>

                {/* Sub-tabs for policies */}
                <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                  {[
                    { id: 'terms', label: 'Terms & Conditions', field: 'termsAndConditionsText' as const },
                    { id: 'privacy', label: 'Privacy Policy', field: 'privacyPolicyText' as const },
                    { id: 'refund', label: 'Refund Policy', field: 'refundPolicyText' as const },
                    { id: 'cancellation', label: 'Cancellation Policy', field: 'cancellationPolicyText' as const },
                    { id: 'shipping', label: 'Shipping & Delivery', field: 'shippingDeliveryPolicyText' as const },
                    { id: 'seller', label: 'Seller Terms', field: 'sellerTermsText' as const },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveLegalSubTab(tab.id as any)}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                        activeLegalSubTab === tab.id
                          ? 'bg-slate-950 text-amber-400 font-black shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Editor textarea for active policy */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 uppercase text-[11px]">
                      {activeLegalSubTab.toUpperCase()} CONTENT
                    </label>
                    <span className="text-[11px] text-slate-400">Directly rendered on live public customer pages</span>
                  </div>

                  {activeLegalSubTab === 'terms' && (
                    <textarea
                      rows={10}
                      value={formData.termsAndConditionsText}
                      onChange={e => handleChange('termsAndConditionsText', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed font-sans focus:bg-white resize-y"
                    />
                  )}

                  {activeLegalSubTab === 'privacy' && (
                    <textarea
                      rows={10}
                      value={formData.privacyPolicyText}
                      onChange={e => handleChange('privacyPolicyText', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed font-sans focus:bg-white resize-y"
                    />
                  )}

                  {activeLegalSubTab === 'refund' && (
                    <textarea
                      rows={10}
                      value={formData.refundPolicyText}
                      onChange={e => handleChange('refundPolicyText', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed font-sans focus:bg-white resize-y"
                    />
                  )}

                  {activeLegalSubTab === 'cancellation' && (
                    <textarea
                      rows={10}
                      value={formData.cancellationPolicyText}
                      onChange={e => handleChange('cancellationPolicyText', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed font-sans focus:bg-white resize-y"
                    />
                  )}

                  {activeLegalSubTab === 'shipping' && (
                    <textarea
                      rows={10}
                      value={formData.shippingDeliveryPolicyText}
                      onChange={e => handleChange('shippingDeliveryPolicyText', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed font-sans focus:bg-white resize-y"
                    />
                  )}

                  {activeLegalSubTab === 'seller' && (
                    <textarea
                      rows={10}
                      value={formData.sellerTermsText}
                      onChange={e => handleChange('sellerTermsText', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed font-sans focus:bg-white resize-y"
                    />
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 12. SYSTEM, BACKUP & LOGS */}
            {/* ========================================================================= */}
            {activeSection === 'system' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in text-xs">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                      <Server className="w-5 h-5 text-amber-600" />
                      <span>12. System Operations, Maintenance, Backup & Error Logs</span>
                    </h3>
                    <p className="text-slate-500 mt-0.5">
                      Toggle live public availability, maintenance modes, export JSON snapshots, and inspect server error traces.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Critical Status Switches */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border transition-all ${
                    formData.isWebsiteLive ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-slate-900 block text-sm">Marketplace Public Access (Website ON/OFF)</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {formData.isWebsiteLive ? 'Currently LIVE for public visitors' : 'OFFLINE - Showing closed notice'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.isWebsiteLive}
                        onChange={e => handleChange('isWebsiteLive', e.target.checked)}
                        className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-all ${
                    formData.maintenanceModeEnabled ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-slate-900 block text-sm">Scheduled Maintenance Mode</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {formData.maintenanceModeEnabled ? 'MAINTENANCE ACTIVE' : 'Normal Operations'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.maintenanceModeEnabled}
                        onChange={e => handleChange('maintenanceModeEnabled', e.target.checked)}
                        className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {formData.maintenanceModeEnabled && (
                  <div className="space-y-1 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                    <label className="font-bold text-amber-950">Maintenance Notice Message</label>
                    <textarea
                      rows={2}
                      value={formData.maintenanceMessage}
                      onChange={e => handleChange('maintenanceMessage', e.target.value)}
                      className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-slate-900 resize-none"
                    />
                  </div>
                )}

                {/* Automated Backup Settings */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Automated Backup Settings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-800 block">Automatic State Snapshots</span>
                        <span className="text-slate-500 text-[11px]">Automated database snapshot backups</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.autoBackupEnabled}
                        onChange={e => handleChange('autoBackupEnabled', e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Backup Frequency</label>
                      <select
                        value={formData.backupFrequency}
                        onChange={e => handleChange('backupFrequency', e.target.value as any)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold"
                      >
                        <option value="hourly">Hourly Automated Snapshot</option>
                        <option value="daily">Daily Midnight Snapshot</option>
                        <option value="weekly">Weekly Consolidated Archive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* System Diagnostics & Logs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">System & Error Logs</h4>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={fetchActivityLogs}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Refresh Logs
                      </button>
                      <button
                        type="button"
                        onClick={handleClearLogs}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Clear Logs
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 text-slate-300 rounded-2xl font-mono text-[11px] space-y-1.5 max-h-56 overflow-y-auto">
                    <div className="text-emerald-400 font-bold">[SYSTEM ONLINE] Core Node.js / Express engine running on Port 3000</div>
                    <div className="text-slate-400">[CONFIG] Database synced with local storage and server session token registry.</div>
                    <div className="text-slate-400">[SECURITY] Admin RBAC active for authorized administrators.</div>
                    {activityLogs.map(l => (
                      <div key={l.id} className="text-slate-300">
                        <span className="text-amber-400">[{new Date(l.timestamp).toLocaleTimeString()}]</span> {l.action} ({l.user})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Persistent Action Bar */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-black">
                  ⚙️
                </div>
                <div>
                  <div className="font-black text-sm">Harwalkart Platform Configuration</div>
                  <p className="text-[11px] text-slate-400">
                    {hasUnsavedChanges
                      ? '⚠️ You have unsaved changes in this section.'
                      : 'All 12 modules configured and synced with database.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save & Apply All Settings'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
