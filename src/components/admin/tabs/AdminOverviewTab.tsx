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
} from 'lucide-react';

interface AdminOverviewTabProps {
  setActiveTab: (tab: any) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ setActiveTab }) => {
  const {
    sellers,
    products,
    orders,
    registeredCustomers,
    withdrawalRequests,
    supportTickets,
    categories,
    approveSeller,
    rejectSeller,
  } = useApp();

  const pendingSellers = sellers.filter(s => s.status === 'pending');
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending');
  const openSupportTickets = supportTickets.filter(t => t.status === 'open');

  const totalGmv = orders.reduce((sum, o) => sum + o.total, 0) + 248500;
  const platformRevenue = Math.round(totalGmv * 0.025);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Notice Banner if actions are pending */}
      {pendingSellers.length > 0 && (
        <div className="p-5 bg-amber-50 border border-amber-300 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Pending KYC Shop Applications ({pendingSellers.length})
            </h4>
            <button
              onClick={() => setActiveTab('seller_approvals')}
              className="text-xs font-bold text-amber-900 underline cursor-pointer"
            >
              Review All Applications →
            </button>
          </div>

          <div className="space-y-2">
            {pendingSellers.map(s => (
              <div
                key={s.id}
                className="p-3 bg-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border border-amber-200/60"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {s.shopName} ({s.ownerName || s.name})
                  </div>
                  <p className="text-[11px] text-slate-500">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div
          onClick={() => setActiveTab('seller_approvals')}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">KYC Verification</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-950">{pendingSellers.length} Pending</div>
          <p className="text-[11px] text-amber-700 font-bold">Awaiting Super Admin Review</p>
        </div>

        <div
          onClick={() => setActiveTab('payments')}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Pending Payouts</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{pendingWithdrawals.length} Requests</div>
          <p className="text-[11px] text-slate-500">Merchant UPI & Bank Settlements</p>
        </div>

        <div
          onClick={() => setActiveTab('messages')}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Support Inquiries</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-blue-600">{openSupportTickets.length} Open</div>
          <p className="text-[11px] text-slate-500">Customer & Seller Assistance</p>
        </div>
      </div>

      {/* Platform Pillars */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-950">Harwalkart Operational Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">In-House Brand</span>
            <p className="text-base font-black text-slate-900">Kitchen Shakti Series</p>
            <p className="text-[11px] text-emerald-600 font-bold">100% Purity Certified Direct</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Hyper-Local Radius</span>
            <p className="text-base font-black text-slate-900">10 KM GPS Precision</p>
            <p className="text-[11px] text-amber-700 font-bold">PAN-India for GST Sellers</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Super Admin Support</span>
            <p className="text-base font-black text-slate-900">+91 9372207811</p>
            <p className="text-[11px] text-slate-500">harwalkart@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
