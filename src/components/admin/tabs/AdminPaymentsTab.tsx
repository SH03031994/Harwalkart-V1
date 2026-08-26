import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { WithdrawalRequest } from '../../../types';
import { CompanyBankAccountSettings } from './CompanyBankAccountSettings';
import {
  Wallet,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Building2,
  CreditCard,
  Lock,
  Sliders,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const AdminPaymentsTab: React.FC = () => {
  const {
    withdrawalRequests,
    sellers,
    processWithdrawal,
    addManualPayout,
    deleteWithdrawalRequest,
    companyBankAccount,
    paymentSettings,
    updatePaymentSettings,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'company_bank' | 'merchant_payouts' | 'gateway_modes'>('company_bank');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    sellerId: sellers[0]?.id || '',
    amount: 1000,
    note: 'Manual bank adjustment / settlement',
  });

  const filteredRequests = withdrawalRequests.filter(w => {
    const matchesSearch =
      w.sellerShopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.upiOrAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    const defaultSeller = sellers[0];
    setFormData({
      sellerId: defaultSeller?.id || '',
      amount: 1000,
      note: 'Manual payout transfer',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const sel = sellers.find(s => s.id === formData.sellerId);
    if (!sel) return;

    addManualPayout(sel.id, Number(formData.amount), formData.note);
    setIsAddModalOpen(false);
  };

  const totalPayoutCompleted = withdrawalRequests
    .filter(w => w.status === 'completed' || w.status === 'paid')
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingPayoutTotal = withdrawalRequests
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Section Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        <button
          id="tab-company-bank"
          onClick={() => setActiveSubTab('company_bank')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'company_bank'
              ? 'bg-slate-950 text-amber-400 shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Bank Account</span>
          {companyBankAccount ? (
            <span className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-black">
              Configured
            </span>
          ) : (
            <span className="bg-amber-500/20 text-amber-700 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Not Set
            </span>
          )}
        </button>

        <button
          id="tab-merchant-payouts"
          onClick={() => setActiveSubTab('merchant_payouts')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'merchant_payouts'
              ? 'bg-slate-950 text-amber-400 shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Merchant Payouts & Ledger</span>
          <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-black">
            {withdrawalRequests.length}
          </span>
        </button>

        <button
          id="tab-gateway-modes"
          onClick={() => setActiveSubTab('gateway_modes')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'gateway_modes'
              ? 'bg-slate-950 text-amber-400 shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Payment Gateway & Modes</span>
        </button>
      </div>

      {/* SUBTAB 1: Company Bank Account */}
      {activeSubTab === 'company_bank' && <CompanyBankAccountSettings />}

      {/* SUBTAB 2: Merchant Payouts & Settlement Ledger */}
      {activeSubTab === 'merchant_payouts' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-950">Merchant Payouts & Settlement Ledger</h3>
                <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {withdrawalRequests.length} Transactions
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Process bank transfers, UPI payouts, and verify seller wallet balance deductions after deliveries.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Record Manual Settlement</span>
            </button>
          </div>

          {/* Summary KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Total Settled to Sellers</span>
                <div className="text-xl font-black text-emerald-600">₹{totalPayoutCompleted.toLocaleString()}</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-70" />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Pending Settlement Queue</span>
                <div className="text-xl font-black text-amber-600">₹{pendingPayoutTotal.toLocaleString()}</div>
              </div>
              <Clock className="w-8 h-8 text-amber-500 opacity-70" />
            </div>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by store name, UPI ID or account..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(['all', 'pending', 'completed', 'rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                    statusFilter === tab
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab} ({withdrawalRequests.filter(w => tab === 'all' || w.status === tab).length})
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b border-slate-200">
                <tr>
                  <th className="p-3">Store Name</th>
                  <th className="p-3">Payout Amount</th>
                  <th className="p-3">Method & Destination</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{w.sellerShopName}</div>
                      <div className="text-slate-400 text-[10px]">ID: {w.id}</div>
                    </td>

                    <td className="p-3">
                      <span className="font-black text-slate-950 text-sm">₹{w.amount.toLocaleString()}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-slate-800 uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded mr-1">
                        {w.payoutMethod}
                      </span>
                      <span className="font-mono text-slate-600 text-[11px]">{w.upiOrAccount}</span>
                    </td>

                    <td className="p-3 text-slate-600">{w.requestDate}</td>

                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          w.status === 'completed' || w.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : w.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {w.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                if (confirm(`Approve payout of ₹${w.amount} to ${w.sellerShopName}?`)) {
                                  processWithdrawal(w.id, 'completed');
                                }
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                            >
                              Mark Paid
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Reject payout request of ₹${w.amount}? Wallet balance will be restored.`)) {
                                  processWithdrawal(w.id, 'rejected');
                                }
                              }}
                              className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg text-xs cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Delete payout record ${w.id}?`)) {
                              deleteWithdrawalRequest(w.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RECORD MANUAL SETTLEMENT MODAL */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveAdd}
                className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-950">Record Merchant Payout</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Select Seller Store *</label>
                    <select
                      required
                      value={formData.sellerId}
                      onChange={e => setFormData({ ...formData, sellerId: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    >
                      {sellers.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.shopName} (Bal: ₹{s.walletBalance})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Settlement Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Note / Reference</label>
                    <input
                      type="text"
                      value={formData.note}
                      onChange={e => setFormData({ ...formData, note: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                      placeholder="Direct NEFT Bank Transfer Ref: CMS938210"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
                  >
                    Record & Settle Payout
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: Gateway & Payment Modes */}
      {activeSubTab === 'gateway_modes' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-950">Payment Modes & Gateway Settings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure accepted payment methods across the marketplace for customer checkout and corporate routing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 text-sm">Cash On Delivery (COD)</span>
                <p className="text-slate-500 text-[11px]">Allow buyers to pay via cash on door delivery</p>
              </div>
              <input
                type="checkbox"
                checked={paymentSettings?.enableCod ?? true}
                onChange={e => updatePaymentSettings({ enableCod: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 text-sm">UPI Payments</span>
                <p className="text-slate-500 text-[11px]">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
              <input
                type="checkbox"
                checked={paymentSettings?.enableUpi ?? true}
                onChange={e => updatePaymentSettings({ enableUpi: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 text-sm">Debit / Credit Cards</span>
                <p className="text-slate-500 text-[11px]">Visa, MasterCard, RuPay cards</p>
              </div>
              <input
                type="checkbox"
                checked={paymentSettings?.enableCards ?? true}
                onChange={e => updatePaymentSettings({ enableCards: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 text-sm">Net Banking</span>
                <p className="text-slate-500 text-[11px]">Direct Indian bank account transfer</p>
              </div>
              <input
                type="checkbox"
                checked={paymentSettings?.enableNetbanking ?? true}
                onChange={e => updatePaymentSettings({ enableNetbanking: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Gateway Mode: Sandbox / Internal Accounting</div>
                <p className="text-[11px] text-slate-400">Live gateway will connect to the configured Company Bank Account when enabled.</p>
              </div>
            </div>
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
              Ready
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
