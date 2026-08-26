import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Seller, SellerStatus } from '../../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Building,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit2,
  AlertTriangle,
  Search,
  ShieldCheck,
  ShieldAlert,
  Download,
  ExternalLink,
  Ban,
  RefreshCw,
  Info,
  Check,
  X,
  Plus,
  Store,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'suspended';

export const AdminSellerApprovalsTab: React.FC = () => {
  const {
    sellers,
    approveSeller,
    rejectSeller,
    suspendSeller,
    editSeller,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterStatus>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedSellerForView, setSelectedSellerForView] = useState<Seller | null>(null);
  const [selectedSellerForEdit, setSelectedSellerForEdit] = useState<Seller | null>(null);
  const [selectedSellerForReject, setSelectedSellerForReject] = useState<Seller | null>(null);

  // Reject Form State
  const [rejectionReasonPreset, setRejectionReasonPreset] = useState('Incomplete KYC documentation');
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    street: '',
    area: '',
    city: '',
    pincode: '',
    state: 'Delhi',
    isGstRegistered: false,
    gstin: '',
    panNumber: '',
    serviceRadiusKm: 10,
    openingHours: '8:00 AM - 9:00 PM',
    businessInfo: '',
    categories: ''
  });

  // Filter and search logic
  const pendingCount = sellers.filter(s => s.status === 'pending').length;
  const approvedCount = sellers.filter(s => s.status === 'approved').length;
  const rejectedCount = sellers.filter(s => s.status === 'rejected').length;
  const suspendedCount = sellers.filter(s => s.status === 'suspended').length;

  const filteredSellers = sellers.filter(seller => {
    // Status filter
    if (activeFilter !== 'all' && seller.status !== activeFilter) {
      return false;
    }

    // Search query matching
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();

    return (
      seller.shopName.toLowerCase().includes(term) ||
      (seller.ownerName && seller.ownerName.toLowerCase().includes(term)) ||
      seller.name.toLowerCase().includes(term) ||
      seller.phone.includes(term) ||
      seller.email.toLowerCase().includes(term) ||
      seller.address.city.toLowerCase().includes(term) ||
      seller.address.pincode.includes(term) ||
      (seller.gstin && seller.gstin.toLowerCase().includes(term)) ||
      (seller.panNumber && seller.panNumber.toLowerCase().includes(term)) ||
      (seller.kycDoc && seller.kycDoc.docNumber.toLowerCase().includes(term))
    );
  });

  // Handlers
  const handleOpenEdit = (seller: Seller) => {
    setSelectedSellerForEdit(seller);
    setEditFormData({
      shopName: seller.shopName,
      ownerName: seller.ownerName || seller.name,
      phone: seller.phone,
      email: seller.email,
      street: seller.address.street,
      area: seller.address.area,
      city: seller.address.city,
      pincode: seller.address.pincode,
      state: seller.address.state || 'India',
      isGstRegistered: seller.isGstRegistered,
      gstin: seller.gstin || '',
      panNumber: seller.panNumber || '',
      serviceRadiusKm: seller.serviceRadiusKm || 10,
      openingHours: seller.openingHours || '8:00 AM - 9:00 PM',
      businessInfo: seller.businessInfo || '',
      categories: seller.categories?.join(', ') || 'Grocery, Masala & Food'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSellerForEdit) return;

    const catArray = editFormData.categories
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    editSeller(selectedSellerForEdit.id, {
      shopName: editFormData.shopName,
      ownerName: editFormData.ownerName,
      name: editFormData.ownerName,
      phone: editFormData.phone,
      email: editFormData.email,
      isGstRegistered: editFormData.isGstRegistered,
      gstin: editFormData.gstin,
      panNumber: editFormData.panNumber,
      serviceRadiusKm: Number(editFormData.serviceRadiusKm),
      openingHours: editFormData.openingHours,
      businessInfo: editFormData.businessInfo,
      categories: catArray.length > 0 ? catArray : selectedSellerForEdit.categories,
      address: {
        ...selectedSellerForEdit.address,
        street: editFormData.street,
        area: editFormData.area,
        city: editFormData.city,
        pincode: editFormData.pincode,
        state: editFormData.state,
      },
    });

    setSelectedSellerForEdit(null);
  };

  const handleOpenReject = (seller: Seller) => {
    setSelectedSellerForReject(seller);
    setRejectionReasonPreset('Incomplete KYC documentation');
    setCustomRejectionReason('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSellerForReject) return;

    const finalReason =
      rejectionReasonPreset === 'Other (specify below)'
        ? customRejectionReason.trim() || 'Application rejected by platform administrator'
        : customRejectionReason.trim()
        ? `${rejectionReasonPreset}: ${customRejectionReason.trim()}`
        : rejectionReasonPreset;

    rejectSeller(selectedSellerForReject.id, finalReason);
    setSelectedSellerForReject(null);
    if (selectedSellerForView?.id === selectedSellerForReject.id) {
      setSelectedSellerForView(null);
    }
  };

  const handleApprove = (sellerId: string) => {
    approveSeller(sellerId);
    if (selectedSellerForView?.id === sellerId) {
      setSelectedSellerForView(prev => prev ? { ...prev, status: 'approved', verified: true, isOpen: true } : null);
    }
  };

  const handleToggleSuspend = (seller: Seller) => {
    const isCurrentlySuspended = seller.status === 'suspended';
    if (isCurrentlySuspended) {
      suspendSeller(seller.id, false);
      showToast(`Seller "${seller.shopName}" has been REACTIVATED and is back live.`);
    } else {
      if (confirm(`Are you sure you want to suspend "${seller.shopName}"? The shop and its products will be deactivated from the customer marketplace.`)) {
        suspendSeller(seller.id, true);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950">Merchant KYC & Store Approvals</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review onboarding applications, verify Aadhaar/PAN/GST credentials, and authorize live marketplace broadcasting.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by shop, owner, phone, city, GST..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setActiveFilter('pending')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-amber-800">Pending KYC</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-900 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-amber-700 font-medium">Require Verification</span>
        </div>

        <div
          onClick={() => setActiveFilter('approved')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'approved'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-emerald-800">Live / Approved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-900 mt-1">{approvedCount}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Active on Marketplace</span>
        </div>

        <div
          onClick={() => setActiveFilter('rejected')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'rejected'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/30'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-rose-800">Rejected</span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-900 mt-1">{rejectedCount}</div>
          <span className="text-[10px] text-rose-700 font-medium">Declined Applications</span>
        </div>

        <div
          onClick={() => setActiveFilter('suspended')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'suspended'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400/30'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-purple-800">Suspended</span>
            <Ban className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-black text-purple-900 mt-1">{suspendedCount}</div>
          <span className="text-[10px] text-purple-700 font-medium">Temporarily Paused</span>
        </div>
      </div>

      {/* Filter Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 text-xs font-bold">
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeFilter === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Pending Approvals</span>
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveFilter('approved')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeFilter === 'approved'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Approved & Live ({approvedCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('rejected')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeFilter === 'rejected'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Rejected ({rejectedCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('suspended')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeFilter === 'suspended'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Suspended ({suspendedCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>All Merchants ({sellers.length})</span>
        </button>
      </div>

      {/* Seller Application Cards List */}
      <div className="space-y-4">
        {filteredSellers.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-2">
            <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500 opacity-60" />
            <p className="font-bold text-slate-700 text-sm">
              {activeFilter === 'pending'
                ? 'No pending seller KYC applications in queue.'
                : activeFilter === 'rejected'
                ? 'No rejected merchant applications.'
                : activeFilter === 'suspended'
                ? 'No suspended sellers.'
                : 'No merchant stores match your search.'}
            </p>
            <p className="text-xs text-slate-400">
              {activeFilter === 'pending'
                ? 'When a new merchant registers on Harwalkart Seller Portal, their shop will instantly appear here for Admin authorization.'
                : 'Try clearing your search query or selecting a different status filter above.'}
            </p>
          </div>
        ) : (
          filteredSellers.map(seller => {
            const isPending = seller.status === 'pending';
            const isApproved = seller.status === 'approved';
            const isRejected = seller.status === 'rejected';
            const isSuspended = seller.status === 'suspended';

            return (
              <div
                key={seller.id}
                className={`p-5 rounded-3xl border transition-all text-xs space-y-4 ${
                  isPending
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                    : isRejected
                    ? 'bg-rose-50/30 border-rose-200'
                    : isSuspended
                    ? 'bg-purple-50/30 border-purple-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Main Card Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <img
                      src={seller.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80'}
                      alt={seller.shopName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-black text-slate-950">{seller.shopName}</h4>
                        
                        {/* Status Badges */}
                        {isPending && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
                            KYC Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Live on Marketplace
                          </span>
                        )}
                        {isRejected && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Application Rejected
                          </span>
                        )}
                        {isSuspended && (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Ban className="w-3 h-3 text-purple-600" />
                            Shop Suspended
                          </span>
                        )}

                        {seller.isHarwalkartDirect && (
                          <span className="bg-slate-900 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md">
                            Direct Hub
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Owner: <strong>{seller.ownerName || seller.name}</strong>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3 h-3" /> +91 {seller.phone}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Mail className="w-3 h-3" /> {seller.email}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3" /> {seller.address.city}, {seller.address.pincode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Button Group */}
                  <div className="flex flex-wrap items-center gap-2 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => setSelectedSellerForView(seller)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      title="View complete KYC application, documents and business details"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>View & Inspect</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(seller)}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      title="Edit store details, contact info or service area"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>

                    {/* Suspend / Unsuspend action for approved or suspended sellers */}
                    {(isApproved || isSuspended) && (
                      <button
                        onClick={() => handleToggleSuspend(seller)}
                        className={`px-3 py-2 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isSuspended
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                        }`}
                        title={isSuspended ? 'Reactivate seller shop' : 'Suspend seller shop'}
                      >
                        {isSuspended ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Unsuspend</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Reject Action (Available for pending, or to revoke) */}
                    {!isRejected && (
                      <button
                        onClick={() => handleOpenReject(seller)}
                        className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Reject seller registration with reason"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Approve / Re-Approve Action */}
                    {!isApproved && (
                      <button
                        onClick={() => handleApprove(seller.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        title="Approve seller and publish store to live marketplace"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isRejected ? 'Re-Approve Shop' : 'Approve Shop'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-Card Information Rows: KYC doc & Tax credentials */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-[11px]">
                  {/* KYC Document Snippet */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">KYC Document</span>
                        <span className="font-bold text-slate-800">
                          {seller.kycDoc ? `${seller.kycDoc.docType}: ${seller.kycDoc.docNumber}` : 'Document Pending'}
                        </span>
                      </div>
                    </div>
                    {seller.kycDoc?.verified ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                        UNVERIFIED
                      </span>
                    )}
                  </div>

                  {/* GST & PAN Info */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Tax / Trade Status</span>
                        <span className="font-bold text-slate-800">
                          {seller.isGstRegistered ? `GSTIN: ${seller.gstin || 'Registered'}` : 'Local Non-GST (10 KM)'}
                        </span>
                      </div>
                    </div>
                    {seller.panNumber && (
                      <span className="text-slate-400 font-mono text-[10px]">PAN: {seller.panNumber}</span>
                    )}
                  </div>

                  {/* Service Coverage */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Delivery Coverage</span>
                        <span className="font-bold text-slate-800">
                          {seller.isGstRegistered ? 'PAN-India Delivery' : `${seller.serviceRadiusKm || 10} KM Radius`}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-500 font-medium text-[10px]">
                      {seller.serviceablePincodes?.includes('*') ? 'All PINs' : `${seller.serviceablePincodes?.length || 1} PINs`}
                    </span>
                  </div>
                </div>

                {/* Rejection Notice Banner if rejected */}
                {isRejected && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">Rejection Remarks:</p>
                      <p className="text-[11px] text-rose-800">
                        {seller.rejectionReason || 'Application does not meet Harwalkart platform onboarding standards.'}
                      </p>
                      <p className="text-[10px] text-rose-600 italic">
                        The merchant has been notified. They can update their KYC details and resubmit for approval.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW & INSPECT KYC APPLICATION DETAILS */}
      {/* ========================================================================= */}
      {selectedSellerForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-5 animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedSellerForView.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedSellerForView.shopName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <h3 className="text-base font-black text-slate-950">{selectedSellerForView.shopName}</h3>
                  <p className="text-slate-500 text-[11px]">Merchant ID: {selectedSellerForView.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSellerForView(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Verification Status Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                selectedSellerForView.status === 'approved'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : selectedSellerForView.status === 'rejected'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : selectedSellerForView.status === 'suspended'
                  ? 'bg-purple-50 border-purple-200 text-purple-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedSellerForView.status === 'approved' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                {selectedSellerForView.status === 'rejected' && <XCircle className="w-6 h-6 text-rose-600" />}
                {selectedSellerForView.status === 'suspended' && <Ban className="w-6 h-6 text-purple-600" />}
                {selectedSellerForView.status === 'pending' && <Clock className="w-6 h-6 text-amber-600 animate-spin" />}

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block">Application Status</span>
                  <p className="text-sm font-black capitalize">
                    {selectedSellerForView.status === 'pending' ? 'Pending Admin Authorization' : selectedSellerForView.status}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Registered On</span>
                <span className="font-bold">{selectedSellerForView.joinedDate || '2026-08-19'}</span>
              </div>
            </div>

            {/* KYC Document Detailed Certificate Inspection Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span className="font-black text-slate-900 text-xs">KYC Document & Verification Proof</span>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                  Official Record
                </span>
              </div>

              {selectedSellerForView.kycDoc ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Document Type</span>
                    <p className="font-bold text-slate-800">{selectedSellerForView.kycDoc.docType}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Document Number / ID</span>
                    <p className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                      {selectedSellerForView.kycDoc.docNumber}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Uploaded Document File</span>
                    <p className="text-slate-700 font-medium flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      {selectedSellerForView.kycDoc.fileName || 'KYC_Document_Proof.pdf'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Upload Timestamp</span>
                    <p className="text-slate-700 font-medium">{selectedSellerForView.kycDoc.uploadedAt}</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-xs">
                  No separate document attached. Verifying via official trade registry: {selectedSellerForView.gstin || selectedSellerForView.panNumber || 'Aadhaar ID'}.
                </div>
              )}
            </div>

            {/* Merchant Business & Owner Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Owner & Contact Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-black text-slate-900 border-b border-slate-200 pb-1.5">Owner & Contact</h5>
                <div className="space-y-1 text-[11px]">
                  <p>
                    <span className="text-slate-400">Owner Name:</span>{' '}
                    <strong>{selectedSellerForView.ownerName || selectedSellerForView.name}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">Mobile Phone:</span>{' '}
                    <strong>+91 {selectedSellerForView.phone}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">Email Address:</span>{' '}
                    <strong>{selectedSellerForView.email}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">Operating Hours:</span>{' '}
                    <span>{selectedSellerForView.openingHours || '8:00 AM - 9:00 PM'}</span>
                  </p>
                </div>
              </div>

              {/* Physical Store Address & Area */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-black text-slate-900 border-b border-slate-200 pb-1.5">Store Address & Service Area</h5>
                <div className="space-y-1 text-[11px]">
                  <p>
                    <span className="text-slate-400">Street / Market:</span>{' '}
                    <strong>{selectedSellerForView.address.street}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">City & State:</span>{' '}
                    <strong>{selectedSellerForView.address.city}, {selectedSellerForView.address.state || 'India'}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">PIN Code:</span>{' '}
                    <strong>{selectedSellerForView.address.pincode}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">Coverage Limit:</span>{' '}
                    <strong>
                      {selectedSellerForView.isGstRegistered ? 'PAN-India Delivery' : `${selectedSellerForView.serviceRadiusKm || 10} KM Radius`}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Business Description & Categories */}
            {selectedSellerForView.businessInfo && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Business Statement</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedSellerForView.businessInfo}</p>
              </div>
            )}

            {/* Rejection Reason if any */}
            {selectedSellerForView.rejectionReason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-rose-950">
                <span className="text-rose-700 block text-[10px] font-black uppercase">Recorded Rejection Reason</span>
                <p className="text-xs font-bold">{selectedSellerForView.rejectionReason}</p>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const s = selectedSellerForView;
                    setSelectedSellerForView(null);
                    handleOpenEdit(s);
                  }}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                {selectedSellerForView.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      const s = selectedSellerForView;
                      setSelectedSellerForView(null);
                      handleOpenReject(s);
                    }}
                    className="px-3.5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSellerForView(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>

                {selectedSellerForView.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedSellerForView.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Make Shop Live</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REJECT SELLER APPLICATION WITH REASON */}
      {/* ========================================================================= */}
      {selectedSellerForReject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmReject}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-950">Reject Seller Application</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSellerForReject(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600">
              Please specify the reason for rejecting <strong>{selectedSellerForReject.shopName}</strong>. This reason will be recorded and shown to the merchant.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Rejection Category *</label>
                <select
                  value={rejectionReasonPreset}
                  onChange={e => setRejectionReasonPreset(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                >
                  <option value="Incomplete KYC documentation">Incomplete or unreadable KYC documentation</option>
                  <option value="GSTIN number mismatch with trade registry">GSTIN number mismatch with trade registry</option>
                  <option value="Invalid Aadhaar / PAN card details">Invalid Aadhaar / PAN card details</option>
                  <option value="Store address not serviceable in designated zone">Store address not serviceable in designated zone</option>
                  <option value="Missing mandatory FSSAI food license">Missing mandatory FSSAI food license</option>
                  <option value="Duplicate merchant account detected">Duplicate merchant account detected</option>
                  <option value="Other (specify below)">Other (specify custom remarks below)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Notes / Remarks for Seller</label>
                <textarea
                  rows={3}
                  value={customRejectionReason}
                  onChange={e => setCustomRejectionReason(e.target.value)}
                  placeholder="e.g. Please re-upload a clear scanned copy of your GST certificate and owner Aadhaar card."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Confirm Rejection
              </button>
              <button
                type="button"
                onClick={() => setSelectedSellerForReject(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT SELLER INFORMATION */}
      {/* ========================================================================= */}
      {selectedSellerForEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-black text-slate-950">Edit Seller: {selectedSellerForEdit.shopName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSellerForEdit(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Shop / Store Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.shopName}
                    onChange={e => setEditFormData({ ...editFormData, shopName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.ownerName}
                    onChange={e => setEditFormData({ ...editFormData, ownerName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone}
                    onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Street Address & Market *</label>
                <input
                  type="text"
                  required
                  value={editFormData.street}
                  onChange={e => setEditFormData({ ...editFormData, street: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Area</label>
                  <input
                    type="text"
                    value={editFormData.area}
                    onChange={e => setEditFormData({ ...editFormData, area: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.city}
                    onChange={e => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.pincode}
                    onChange={e => setEditFormData({ ...editFormData, pincode: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* GST & Service Area */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsGst"
                    checked={editFormData.isGstRegistered}
                    onChange={e => setEditFormData({ ...editFormData, isGstRegistered: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="editIsGst" className="font-bold text-slate-800 cursor-pointer">
                    GST Registered Merchant (PAN-India Eligible)
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">GSTIN Number</label>
                    <input
                      type="text"
                      value={editFormData.gstin}
                      onChange={e => setEditFormData({ ...editFormData, gstin: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg uppercase font-mono"
                      placeholder="07AAAAA0000A1Z5"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">PAN Number</label>
                    <input
                      type="text"
                      value={editFormData.panNumber}
                      onChange={e => setEditFormData({ ...editFormData, panNumber: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg uppercase font-mono"
                      placeholder="AAAAA0000A"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Service Radius (KM for non-GST stores)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={editFormData.serviceRadiusKm}
                    onChange={e => setEditFormData({ ...editFormData, serviceRadiusKm: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Categories (comma-separated)</label>
                <input
                  type="text"
                  value={editFormData.categories}
                  onChange={e => setEditFormData({ ...editFormData, categories: e.target.value })}
                  placeholder="Grocery, Masala & Food, Kitchen"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Business Statement / Bio</label>
                <textarea
                  rows={2}
                  value={editFormData.businessInfo}
                  onChange={e => setEditFormData({ ...editFormData, businessInfo: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Save Seller Changes
              </button>
              <button
                type="button"
                onClick={() => setSelectedSellerForEdit(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
