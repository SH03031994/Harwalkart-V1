import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller, WithdrawalRequest } from '../../types';
import {
  Wallet,
  Building2,
  QrCode,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Percent,
  Download,
  Info,
  Calendar,
} from 'lucide-react';

interface SellerSettlementsProps {
  seller: Seller;
  withdrawals: WithdrawalRequest[];
}

export const SellerSettlements: React.FC<SellerSettlementsProps> = ({ seller, withdrawals }) => {
  const { requestWithdrawal, showToast } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState<number>(
    seller.walletBalance > 500 ? Math.min(seller.walletBalance, 2500) : seller.walletBalance
  );
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank_transfer'>('upi');
  const [upiId, setUpiId] = useState('sharmakirana@okhdfcbank');
  const [accountNumber, setAccountNumber] = useState('50200012938491');
  const [ifscCode, setIfscCode] = useState('HDFC0001293');
  const [bankName, setBankName] = useState('HDFC Bank, Connaught Place');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingSettlement = seller.walletBalance;
  const paidSettlement = Math.max(0, seller.totalEarnings > seller.walletBalance ? seller.totalEarnings - seller.walletBalance : 23500);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      showToast('Please enter a valid payout amount.');
      return;
    }
    if (withdrawAmount > seller.walletBalance) {
      showToast(`Requested amount exceeds available balance of ₹${seller.walletBalance}`);
      return;
    }

    const destination =
      payoutMethod === 'upi'
        ? upiId.trim()
        : `A/C: ${accountNumber.trim()} (${bankName.trim()} IFSC: ${ifscCode.trim()})`;

    if (!destination) {
      showToast('Please provide valid UPI ID or Bank account details.');
      return;
    }

    setIsSubmitting(true);
    const result = requestWithdrawal(seller.id, withdrawAmount, payoutMethod, destination);
    setIsSubmitting(false);

    if (result.success) {
      setWithdrawAmount(0);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
              <Wallet className="w-3.5 h-3.5" />
              Automated Net Payout Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Settlement & Payout Center
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Withdraw your verified earnings with zero additional transfer fees. All payouts represent your <strong>98% Net Seller Settlement</strong> after automated 2% Harwalkart commission.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <p className="text-xs text-slate-400 font-bold uppercase">Available for Withdrawal</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">
              ₹{seller.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400">Net Settled Balance</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total Store Sales</span>
          <p className="text-2xl font-black text-slate-900">
            ₹{seller.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">Gross sales volume</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">2% Platform Commission</span>
          <p className="text-2xl font-black text-amber-700">
            ₹{(seller.totalEarnings * 0.02).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-amber-800">Deducted automatically</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Pending Settlement</span>
          <p className="text-2xl font-black text-emerald-700">
            ₹{pendingSettlement.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-800">Current wallet balance</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Paid Settlement</span>
          <p className="text-2xl font-black text-slate-900">
            ₹{paidSettlement.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">Disbursed to Bank/UPI</p>
        </div>
      </div>

      {/* Grid: Withdrawal Form + Payout History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Withdrawal Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-emerald-600" />
                Request Payout Transfer
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant UPI transfer or same-day Bank NEFT/IMPS
              </p>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Payout Amount (₹)
                  </label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(seller.walletBalance)}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    Withdraw All (₹{seller.walletBalance})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    max={seller.walletBalance}
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('upi')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                      payoutMethod === 'upi'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="text-xs block font-bold">UPI (VPA)</span>
                      <span className="text-[10px] text-slate-500">Instant transfer</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                      payoutMethod === 'bank_transfer'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="text-xs block font-bold">Bank Account</span>
                      <span className="text-[10px] text-slate-500">NEFT / IMPS</span>
                    </div>
                  </button>
                </div>
              </div>

              {payoutMethod === 'upi' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="e.g. sharmakirana@okhdfcbank"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Verified UPI handles: GPay, PhonePe, Paytm, BHIM</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      placeholder="Account number"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={e => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="HDFC0001293"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        placeholder="HDFC Bank"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={seller.walletBalance <= 0 || withdrawAmount <= 0 || isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-50 transition shadow-xs"
              >
                {isSubmitting ? 'Processing...' : `Transfer ₹${withdrawAmount || 0} to ${payoutMethod.toUpperCase()}`}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero gateway deduction. 100% of requested amount is disbursed.</span>
              </div>
            </form>
          </div>
        </div>

        {/* Settlement History Table */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Settlement & Disbursal Records</h3>
                <p className="text-xs text-slate-500 mt-0.5">Audit log of all payouts transferred to your account</p>
              </div>
              <span className="text-xs text-slate-400 font-bold">{withdrawals.length} records</span>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Info className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold">No withdrawal records found yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map(w => (
                  <div
                    key={w.id}
                    className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          ₹{w.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 font-bold uppercase rounded-md">
                          {w.payoutMethod.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] font-medium truncate max-w-sm">
                        Destination: <strong className="text-slate-900">{w.upiOrAccount}</strong>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Ref: {w.id} • Requested: {w.requestDate} {w.processedDate ? `• Settled: ${w.processedDate}` : ''}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                          w.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {w.status === 'completed' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Settled & Paid
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Processing (T+1)
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
