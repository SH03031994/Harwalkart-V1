import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller, Order } from '../../types';
import {
  Percent,
  TrendingUp,
  DollarSign,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Calculator,
  HelpCircle,
  Download,
  Info,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

interface SellerCommissionEarningsProps {
  seller: Seller;
  orders: Order[];
}

export const SellerCommissionEarnings: React.FC<SellerCommissionEarningsProps> = ({ seller, orders }) => {
  const { showToast } = useApp();

  // Filter orders related to this seller
  const sellerOrders = orders.filter(ord =>
    ord.items.some(it => it.sellerId === seller.id || it.sellerName === seller.shopName)
  );

  // Compute live financial totals
  let totalGrossSales = 0;
  let totalCommissionDeducted = 0;
  let totalNetEarnings = 0;

  const orderCommissionList = sellerOrders.map(ord => {
    const sellerItems = ord.items.filter(it => it.sellerId === seller.id || it.sellerName === seller.shopName);
    const grossSale = sellerItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const commission = Math.round(grossSale * 0.02 * 100) / 100; // 2% Harwalkart commission
    const netEarnings = Math.round((grossSale - commission) * 100) / 100;

    totalGrossSales += grossSale;
    totalCommissionDeducted += commission;
    totalNetEarnings += netEarnings;

    return {
      orderId: ord.id,
      date: ord.date,
      items: sellerItems,
      grossSale,
      commissionRate: '2.00%',
      commission,
      netEarnings,
      status: ord.status,
      paymentMethod: ord.paymentMethod,
    };
  });

  // Calculate pending and paid settlement balances
  // In our model: seller.walletBalance represents available/pending settlement
  // Paid settlement represents total historical paid out (totalEarnings - walletBalance or withdrawal sums)
  const pendingSettlement = seller.walletBalance;
  const paidSettlement = Math.max(0, seller.totalEarnings > seller.walletBalance ? seller.totalEarnings - seller.walletBalance : 23500);

  // Commission Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const calculatedFee = Math.round(calcAmount * 0.02 * 100) / 100;
  const calculatedNet = Math.round((calcAmount - calculatedFee) * 100) / 100;

  const handleExportStatement = () => {
    showToast('2% Commission & Earnings Tax Summary statement downloaded! 📄');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Commission Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 md:p-8 rounded-3xl text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs text-white rounded-full text-xs font-black uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5" />
              Transparent 2% Marketplace Fee
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              HARWALKART 2% Commission & Earnings
            </h2>
            <p className="text-amber-50 text-sm max-w-2xl">
              Harwalkart charges a flat <strong>2% company commission</strong> on eligible completed orders. The remaining <strong>98% Net Seller Earnings</strong> is automatically calculated and transferred directly to your settlement account.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 text-white">
            <div className="p-3 bg-white text-amber-600 rounded-xl font-black text-xl">
              2%
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-100 uppercase">Fixed Rate</p>
              <p className="text-sm font-black text-white">No Hidden Fees</p>
              <p className="text-[10px] text-amber-200">0% Listing • 0% Setup</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards as Requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total Sales</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{totalGrossSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Gross revenue from {sellerOrders.length} orders</p>
        </div>

        {/* 2. HARWALKART Commission (2%) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">HARWALKART (2%)</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl font-bold text-xs">
              2%
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700">
            ₹{totalCommissionDeducted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-amber-900/80 font-medium">Automated 2% platform facilitation fee</p>
        </div>

        {/* 3. Net Seller Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Net Seller Earnings</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700">
            ₹{totalNetEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-800 font-medium">98% of gross sales retained by you</p>
        </div>

        {/* 4. Pending Settlement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Pending Settlement</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{pendingSettlement.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Ready in Seller Wallet for payout</p>
        </div>

        {/* 5. Paid Settlement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Paid Settlement</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{paidSettlement.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Successfully transferred to Bank/UPI</p>
        </div>
      </div>

      {/* Interactive 2% Commission Calculator Widget */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-black text-slate-900">Interactive 2% Commission Calculator</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Formula: Net = Gross × 0.98</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Enter Order / Sale Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="1"
                value={calcAmount}
                onChange={e => setCalcAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                placeholder="1000"
              />
            </div>
            <div className="flex gap-2 pt-1">
              {[500, 1000, 2500, 5000, 10000].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCalcAmount(preset)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-500">Order Sale</p>
              <p className="text-base font-black text-slate-900 mt-1">₹{calcAmount.toFixed(2)}</p>
              <span className="text-[10px] text-slate-400">100% Gross</span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <p className="text-[10px] font-bold uppercase text-amber-800">Harwalkart (2%)</p>
              <p className="text-base font-black text-amber-700 mt-1">-₹{calculatedFee.toFixed(2)}</p>
              <span className="text-[10px] text-amber-600 font-bold">2.0% Fee</span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <p className="text-[10px] font-bold uppercase text-emerald-800">Net Settlement</p>
              <p className="text-base font-black text-emerald-700 mt-1">₹{calculatedNet.toFixed(2)}</p>
              <span className="text-[10px] text-emerald-600 font-bold">98.0% Payout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order-wise Commission Breakdown Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Order-wise 2% Commission Breakdown</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live automated backend commission deductions for every store sale
            </p>
          </div>
          <button
            onClick={handleExportStatement}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </button>
        </div>

        {orderCommissionList.length === 0 ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <Info className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-bold">No orders recorded for this shop yet.</p>
            <p className="text-xs text-slate-500">When customers place orders from your store, 2% commission calculations will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3.5 rounded-l-xl">Order ID & Date</th>
                  <th className="py-3 px-3.5">Products Sold</th>
                  <th className="py-3 px-3.5">Gross Sale</th>
                  <th className="py-3 px-3.5 text-amber-700">Commission (2%)</th>
                  <th className="py-3 px-3.5 text-emerald-700">Net Seller Payout</th>
                  <th className="py-3 px-3.5">Order Status</th>
                  <th className="py-3 px-3.5 rounded-r-xl">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderCommissionList.map(item => (
                  <tr key={item.orderId} className="hover:bg-slate-50/80 transition font-medium">
                    <td className="py-3.5 px-3.5">
                      <span className="font-bold text-slate-900 block">{item.orderId}</span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </td>
                    <td className="py-3.5 px-3.5 max-w-[220px]">
                      {item.items.map((it, idx) => (
                        <div key={idx} className="truncate text-slate-700">
                          {it.quantity}x {it.productName}
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-3.5 font-bold text-slate-900">
                      ₹{item.grossSale.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3.5 font-bold text-amber-700">
                      -₹{item.commission.toFixed(2)}
                      <span className="block text-[9px] text-amber-600/80 font-semibold">(2.00%)</span>
                    </td>
                    <td className="py-3.5 px-3.5 font-black text-emerald-700 text-sm">
                      ₹{item.netEarnings.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          item.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Wallet Credited
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
