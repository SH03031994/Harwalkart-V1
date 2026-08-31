import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CompanyBankAccount } from '../../../types';
import {
  Building2,
  Lock,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  QrCode,
  Info,
  Building,
} from 'lucide-react';

const COMMON_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank (PNB)',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Bank of Baroda (BOB)',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'Yes Bank',
  'Federal Bank',
  'IDFC FIRST Bank',
];

export const CompanyBankAccountSettings: React.FC = () => {
  const {
    companyBankAccount,
    saveCompanyBankAccount,
    removeCompanyBankAccount,
    authSession,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
    upiId: string;
    accountType: 'Current' | 'Savings' | 'Overdraft';
    branchName: string;
  }>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    upiId: '',
    accountType: 'Current',
    branchName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Only authorized admins are allowed
  const isAdmin = authSession.role === 'admin' && authSession.isAuthenticated;

  const handleOpenAdd = () => {
    setFormData({
      accountHolderName: 'SHARANKUMAR HARWALKAR',
      bankName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      upiId: '',
      accountType: 'Current',
      branchName: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    if (!companyBankAccount) return;
    setFormData({
      accountHolderName: companyBankAccount.accountHolderName || '',
      bankName: companyBankAccount.bankName || '',
      accountNumber: companyBankAccount.accountNumber || '',
      confirmAccountNumber: companyBankAccount.accountNumber || '',
      ifscCode: companyBankAccount.ifscCode || '',
      upiId: companyBankAccount.upiId || '',
      accountType: companyBankAccount.accountType || 'Current',
      branchName: companyBankAccount.branchName || '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.accountHolderName.trim()) {
      errs.accountHolderName = 'Account Holder Name is required.';
    } else if (formData.accountHolderName.trim().length < 3) {
      errs.accountHolderName = 'Account Holder Name must be at least 3 characters.';
    }

    if (!formData.bankName.trim()) {
      errs.bankName = 'Bank Name is required.';
    }

    const cleanAcc = formData.accountNumber.trim();
    if (!cleanAcc) {
      errs.accountNumber = 'Account Number is required.';
    } else if (!/^\d{9,18}$/.test(cleanAcc)) {
      errs.accountNumber = 'Valid Indian Bank Account number must be 9 to 18 numeric digits.';
    }

    if (formData.confirmAccountNumber.trim() !== cleanAcc) {
      errs.confirmAccountNumber = 'Account numbers do not match.';
    }

    const cleanIfsc = formData.ifscCode.trim().toUpperCase();
    if (!cleanIfsc) {
      errs.ifscCode = 'IFSC Code is required.';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      errs.ifscCode = 'Invalid IFSC format (e.g. SBIN0001234 or HDFC0000123).';
    }

    if (formData.upiId.trim() && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId.trim())) {
      errs.upiId = 'Invalid UPI ID format (e.g. name@bank or company@upi).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const accountToSave: CompanyBankAccount = {
      accountHolderName: formData.accountHolderName.trim(),
      bankName: formData.bankName.trim(),
      accountNumber: formData.accountNumber.trim(),
      ifscCode: formData.ifscCode.trim().toUpperCase(),
      upiId: formData.upiId.trim() || undefined,
      accountType: formData.accountType,
      branchName: formData.branchName.trim() || undefined,
    };

    saveCompanyBankAccount(accountToSave);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    removeCompanyBankAccount();
    setIsDeleteConfirmOpen(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      showToast(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const maskAccountNumber = (acc: string) => {
    if (!acc || acc.length <= 4) return acc;
    const last4 = acc.slice(-4);
    const masked = '•'.repeat(acc.length - 4);
    return `${masked} ${last4}`;
  };

  if (!isAdmin) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-red-200 text-center space-y-3">
        <Lock className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-base font-black text-slate-900">Restricted Administrator Area</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Company Bank Account details are private and accessible strictly to verified Super Administrators.
        </p>
      </div>
    );
  }

  return (
    <div id="company-bank-account-section" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-amber-500/20 p-3 rounded-2xl border border-amber-500/30 shrink-0">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Company Bank Account</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Admin Private
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Official corporate bank account details for Harwalkart platform management, treasury operations, and seller payout disbursals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {companyBankAccount ? (
            <div className="flex items-center gap-2">
              <button
                id="edit-company-bank-btn"
                onClick={handleOpenEdit}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Account</span>
              </button>
              <button
                id="remove-company-bank-btn"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          ) : (
            <button
              id="add-company-bank-btn"
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company Bank Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Security & Isolation Notice */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-black">Private Internal Corporate Record</p>
          <p className="text-[11px] text-amber-800">
            These bank credentials are encrypted within platform administrative storage and will only be utilized for official platform treasury, commission receipts, and seller settlement clearing. No external payment gateway or live bank API is connected yet.
          </p>
        </div>
      </div>

      {/* Account Card / Empty State */}
      {companyBankAccount ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Bank Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-6 relative overflow-hidden">
              {/* Background watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <Building className="w-48 h-48 text-amber-400" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                    CORPORATE ACCOUNT
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                  {companyBankAccount.accountType || 'Current'}
                </span>
              </div>

              {/* Card Chip & Bank Name */}
              <div className="space-y-2 relative z-10">
                <div className="w-9 h-7 bg-gradient-to-tr from-amber-300 to-amber-100 rounded-md border border-amber-400/60 shadow-xs flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-600/40 rounded-xs grid grid-cols-2 gap-0.5">
                    <div className="border-r border-amber-600/40"></div>
                    <div></div>
                  </div>
                </div>
                <div className="text-base font-black text-white truncate">
                  {companyBankAccount.bankName}
                </div>
              </div>

              {/* Account Number */}
              <div className="space-y-1 relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Account Number
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base font-black tracking-wider text-amber-200">
                    {showAccountNumber
                      ? companyBankAccount.accountNumber
                      : maskAccountNumber(companyBankAccount.accountNumber)}
                  </span>
                  <button
                    onClick={() => setShowAccountNumber(!showAccountNumber)}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showAccountNumber ? 'Hide account number' : 'Show account number'}
                  >
                    {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-white/10 flex items-end justify-between relative z-10 text-xs">
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Account Holder</div>
                  <div className="font-black text-white text-xs truncate max-w-[160px]">
                    {companyBankAccount.accountHolderName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase font-bold text-slate-400">IFSC Code</div>
                  <div className="font-mono font-bold text-amber-300 text-xs">
                    {companyBankAccount.ifscCode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Table & Verified Attributes */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-slate-900 text-sm">Account Specification & IFSC Verification</h4>
                <p className="text-[11px] text-slate-500">
                  Official banking credentials configured for SharanKumar Harwalkar (Harwalkart).
                </p>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Validated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Holder Name */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Account Holder Name</span>
                <div className="font-black text-slate-900 text-sm flex items-center justify-between">
                  <span>{companyBankAccount.accountHolderName}</span>
                  <button
                    onClick={() => copyToClipboard(companyBankAccount.accountHolderName, 'Holder Name')}
                    className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    {copiedField === 'Holder Name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Bank Name */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Bank Name</span>
                <div className="font-black text-slate-900 text-sm flex items-center justify-between">
                  <span>{companyBankAccount.bankName}</span>
                  <button
                    onClick={() => copyToClipboard(companyBankAccount.bankName, 'Bank Name')}
                    className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    {copiedField === 'Bank Name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Account Number */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Account Number</span>
                <div className="font-mono font-black text-slate-900 text-sm flex items-center justify-between">
                  <span>{showAccountNumber ? companyBankAccount.accountNumber : maskAccountNumber(companyBankAccount.accountNumber)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                      title={showAccountNumber ? 'Hide' : 'Show'}
                    >
                      {showAccountNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(companyBankAccount.accountNumber, 'Account Number')}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    >
                      {copiedField === 'Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* IFSC Code */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">IFSC Code</span>
                <div className="font-mono font-black text-slate-900 text-sm flex items-center justify-between">
                  <span className="text-amber-700">{companyBankAccount.ifscCode}</span>
                  <button
                    onClick={() => copyToClipboard(companyBankAccount.ifscCode, 'IFSC Code')}
                    className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    {copiedField === 'IFSC Code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* UPI ID */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Corporate UPI ID</span>
                <div className="font-mono font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>{companyBankAccount.upiId || 'Not configured'}</span>
                  {companyBankAccount.upiId && (
                    <button
                      onClick={() => copyToClipboard(companyBankAccount.upiId!, 'UPI ID')}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    >
                      {copiedField === 'UPI ID' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Account Type & Branch */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Account Type & Branch</span>
                <div className="font-bold text-slate-900 text-xs">
                  {companyBankAccount.accountType || 'Current Account'}
                  {companyBankAccount.branchName ? ` • ${companyBankAccount.branchName}` : ''}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            {companyBankAccount.updatedAt && (
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Last Updated: {new Date(companyBankAccount.updatedAt).toLocaleString('en-IN')}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ready for platform accounting
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-10 rounded-3xl border border-slate-200 border-dashed text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-3xl border border-amber-200/80 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-black text-slate-950">No Company Bank Account Added</h4>
            <p className="text-xs text-slate-500">
              Provide your official corporate bank credentials. These details are stored privately for Super Admin auditing, vendor payouts, and future gateway integration.
            </p>
          </div>
          <button
            id="empty-add-company-bank-btn"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Company Bank Account</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 p-2.5 rounded-2xl text-amber-700">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {companyBankAccount ? 'Edit Company Bank Account' : 'Add Company Bank Account'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter valid Indian banking credentials for corporate treasury.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Field 1: Account Holder Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="bank-holder-name-input"
                  type="text"
                  required
                  placeholder="e.g. SHARANKUMAR HARWALKAR"
                  value={formData.accountHolderName}
                  onChange={e => setFormData({ ...formData, accountHolderName: e.target.value })}
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900 ${
                    errors.accountHolderName ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                  }`}
                />
                {errors.accountHolderName && (
                  <p className="text-[11px] text-red-600 font-bold">{errors.accountHolderName}</p>
                )}
              </div>

              {/* Field 2: Bank Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="bank-name-input"
                  type="text"
                  required
                  list="common-banks-list"
                  placeholder="e.g. State Bank of India, HDFC Bank, ICICI Bank"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900 ${
                    errors.bankName ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                  }`}
                />
                <datalist id="common-banks-list">
                  {COMMON_BANKS.map(b => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
                {errors.bankName && (
                  <p className="text-[11px] text-red-600 font-bold">{errors.bankName}</p>
                )}
              </div>

              {/* Field 3 & 4: Account Number & Confirm Account Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bank-account-number-input"
                    type="text"
                    required
                    placeholder="9 to 18 digits"
                    value={formData.accountNumber}
                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl font-mono font-bold text-slate-900 ${
                      errors.accountNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.accountNumber && (
                    <p className="text-[11px] text-red-600 font-bold">{errors.accountNumber}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Confirm Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bank-confirm-account-number-input"
                    type="text"
                    required
                    placeholder="Re-enter account number"
                    value={formData.confirmAccountNumber}
                    onChange={e => setFormData({ ...formData, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl font-mono font-bold text-slate-900 ${
                      errors.confirmAccountNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.confirmAccountNumber && (
                    <p className="text-[11px] text-red-600 font-bold">{errors.confirmAccountNumber}</p>
                  )}
                </div>
              </div>

              {/* Field 5: IFSC Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bank-ifsc-code-input"
                    type="text"
                    required
                    maxLength={11}
                    placeholder="e.g. SBIN0001234"
                    value={formData.ifscCode}
                    onChange={e => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl font-mono font-bold text-slate-900 uppercase ${
                      errors.ifscCode ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.ifscCode && (
                    <p className="text-[11px] text-red-600 font-bold">{errors.ifscCode}</p>
                  )}
                </div>

                {/* Field 6: UPI ID (Optional) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    UPI ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="bank-upi-id-input"
                    type="text"
                    placeholder="e.g. harwalkart@okhdfcbank"
                    value={formData.upiId}
                    onChange={e => setFormData({ ...formData, upiId: e.target.value.toLowerCase() })}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900 ${
                      errors.upiId ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.upiId && (
                    <p className="text-[11px] text-red-600 font-bold">{errors.upiId}</p>
                  )}
                </div>
              </div>

              {/* Optional Fields: Account Type & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={e => setFormData({ ...formData, accountType: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Current">Current Account (Corporate / Business)</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Overdraft">Overdraft (OD) Account</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Branch Name / City <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Connaught Place, New Delhi"
                    value={formData.branchName}
                    onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="save-company-bank-account-btn"
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Bank Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-950">Remove Company Bank Account?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove the stored company bank credentials? You can re-add or edit them anytime.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-remove-bank-btn"
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Yes, Remove Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
