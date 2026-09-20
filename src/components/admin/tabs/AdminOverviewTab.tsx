import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Store,
  Users,
  Package,
  FileText,
  Wallet,
  MapPin,
  Video,
  Radio,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Sliders,
  Power,
  Banknote,
  Truck,
  ShieldCheck,
  Download,
  Activity,
  Zap,
  BarChart3,
} from 'lucide-react';

interface AdminOverviewTabProps {
  setActiveTab: (tab: any) => void;
  onOpenMasterModal?: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  setActiveTab,
  onOpenMasterModal,
}) => {
  const {
    sellers,
    products,
    orders,
    registeredCustomers,
    withdrawalRequests,
    supportTickets,
    categories,
    brands,
    cityHubs,
    websiteSettings,
    updateWebsiteSettings,
    approveSeller,
    rejectSeller,
    showToast,
  } = useApp();

  const pendingSellers = sellers.filter(s => s.status === 'pending');
  const pendingProducts = products.filter(p => !p.approved);
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending');
  const openSupportTickets = supportTickets.filter(t => t.status === 'open');

  const totalGmv = orders.reduce((sum, o) => sum + o.total, 0) + 248500;
  const platformRevenue = Math.round(totalGmv * 0.025);

  const handleExportBackup = () => {
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
        `harwalkart_backup_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      updateWebsiteSettings({
        lastBackupTimestamp: new Date().toISOString(),
      });

      showToast('Database exported successfully as JSON file');
    } catch {
      showToast('Export failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Super Admin Master Overview Control Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Platform Master Operations Hub</h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                  ONLINE • LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full administrative authority over Harwalkart marketplace &amp; Kitchen Shakti Direct
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export JSON Backup</span>
            </button>

            {onOpenMasterModal && (
              <button
                type="button"
                onClick={onOpenMasterModal}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Open Command Center</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <span className="font-black text-emerald-400">
                {websiteSettings.maintenanceModeEnabled ? '⚠️ Maintenance' : '🟢 100% Live'}
              </span>
            </div>
            <Power className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cash on Delivery</span>
              <span className="font-black text-white">
                {websiteSettings.enableCodDelivery ? 'Active (Pan-India)' : 'Disabled'}
              </span>
            </div>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Commission Rate</span>
              <span className="font-black text-amber-400">
                {websiteSettings.defaultCommissionRate}% Standard
              </span>
            </div>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>

          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Free Shipping</span>
              <span className="font-black text-white">
                {websiteSettings.enableFreeDelivery && websiteSettings.freeDeliveryThreshold > 0
                  ? `> ₹${websiteSettings.freeDeliveryThreshold}`
                  : 'Disabled'}
              </span>
            </div>
            <Truck className="w-4 h-4 text-sky-400" />
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('company_products')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Add Kitchen Shakti Direct Product
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seller_approvals')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-blue-400" />
            Review KYC Applications ({pendingSellers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Manage Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-amber-500/30"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            Analytics &amp; Intelligence
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-300" />
            Comprehensive Website Settings
          </button>
        </div>
      </div>

      {/* Notice Banner if actions are pending */}
      {pendingSellers.length > 0 && (
        <div className="p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              Pending KYC Shop Applications ({pendingSellers.length})
            </h4>
            <button
              onClick={() => setActiveTab('seller_approvals')}
              className="text-xs font-bold text-amber-900 dark:text-amber-300 underline cursor-pointer"
            >
              Review All Applications →
            </button>
          </div>

          <div className="space-y-2">
            {pendingSellers.map(s => (
              <div
                key={s.id}
                className="p-3 bg-white dark:bg-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border border-amber-200/60 dark:border-slate-700"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {s.shopName} ({s.ownerName || s.name})
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {s.address.city} (PIN {s.address.pincode}) • Doc: {s.kycDoc?.docType || 'GSTIN'}: {s.kycDoc?.docNumber || s.gstin}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveSeller(s.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    ✓ Approve KYC
                  </button>
                  <button
                    onClick={() => rejectSeller(s.id)}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div
          onClick={() => setActiveTab('analytics')}
          className="p-5 bg-gradient-to-br from-amber-500/10 to-emerald-500/10 dark:from-amber-950/30 dark:to-emerald-950/30 rounded-3xl border border-amber-300/80 dark:border-amber-700/80 shadow-xs hover:border-amber-500 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[10px] font-black uppercase flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Live Analytics
            </span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-950 dark:text-white">Revenue Intel</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">GMV, AOV &amp; Hub Velocities →</p>
        </div>

        <div
          onClick={() => setActiveTab('seller_approvals')}
          className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-400 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">KYC Verification</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-950 dark:text-white">{pendingSellers.length} Pending</div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">Awaiting Super Admin Review</p>
        </div>

        <div
          onClick={() => setActiveTab('payments')}
          className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-400 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Pending Payouts</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{pendingWithdrawals.length} Requests</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Merchant UPI &amp; Bank Settlements</p>
        </div>

        <div
          onClick={() => setActiveTab('messages')}
          className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-400 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Support Inquiries</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-blue-600">{openSupportTickets.length} Open</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Customer &amp; Seller Assistance</p>
        </div>
      </div>

      {/* Platform Pillars */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-950 dark:text-white">Harwalkart Operational Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">In-House Brand</span>
            <p className="text-base font-black text-slate-900 dark:text-white">Kitchen Shakti Series</p>
            <p className="text-[11px] text-emerald-600 font-bold">100% Purity Certified Direct</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Hyper-Local Radius</span>
            <p className="text-base font-black text-slate-900 dark:text-white">10 KM GPS Precision</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">PAN-India for GST Sellers</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Super Admin Support</span>
            <p className="text-base font-black text-slate-900 dark:text-white">+91 9372207811</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">jaishreeramenterprises24@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
