import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Seller, SellerType, KycStatus } from '../../../types';
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
  RotateCcw,
  Globe,
  Compass,
  FileCheck2,
  Lock,
  MessageSquareWarning,
} from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'correction_requested' | 'approved' | 'rejected' | 'suspended';
type FilterType = 'all' | 'gst' | 'local_without_gst';

export const AdminSellerApprovalsTab: React.FC = () => {
  const {
    sellers,
    approveSeller,
    rejectSeller,
    requestSellerCorrection,
    suspendSeller,
    editSeller,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterStatus>('pending');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedSellerForView, setSelectedSellerForView] = useState<Seller | null>(null);
  const [selectedSellerForEdit, setSelectedSellerForEdit] = useState<Seller | null>(null);
  const [selectedSellerForReject, setSelectedSellerForReject] = useState<Seller | null>(null);
  const [selectedSellerForCorrection, setSelectedSellerForCorrection] = useState<Seller | null>(null);

  // Reject Form State
  const [rejectionReasonPreset, setRejectionReasonPreset] = useState('Incomplete KYC documentation');
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  // Correction Request Form State
  const [correctionReasonPreset, setCorrectionReasonPreset] = useState('Re-upload clear legible document copy');
  const [customCorrectionDetails, setCustomCorrectionDetails] = useState('');

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
    sellerType: 'gst' as SellerType,
    isGstRegistered: false,
    gstin: '',
    panNumber: '',
    serviceRadiusKm: 10,
    openingHours: '8:00 AM - 9:00 PM',
    businessInfo: '',
    categories: '',
  });

  // Filter and search counts
  const pendingCount = sellers.filter(
    s => s.status === 'pending' && s.kycStatus !== 'correction_requested'
  ).length;
  const correctionCount = sellers.filter(s => s.kycStatus === 'correction_requested').length;
  const approvedCount = sellers.filter(s => s.status === 'approved').length;
  const rejectedCount = sellers.filter(s => s.status === 'rejected').length;
  const suspendedCount = sellers.filter(s => s.status === 'suspended').length;
  const gstCount = sellers.filter(s => s.sellerType === 'gst' || s.isGstRegistered).length;
  const localCount = sellers.filter(s => s.sellerType === 'local_without_gst' || !s.isGstRegistered).length;

  const filteredSellers = sellers.filter(seller => {
    // Type filter
    if (typeFilter === 'gst' && seller.sellerType !== 'gst' && !seller.isGstRegistered) {
      return false;
    }
    if (typeFilter === 'local_without_gst' && seller.sellerType === 'gst' && seller.isGstRegistered) {
      return false;
    }

    // Status filter
    if (activeFilter === 'pending') {
      if (seller.status !== 'pending' || seller.kycStatus === 'correction_requested') return false;
    } else if (activeFilter === 'correction_requested') {
      if (seller.kycStatus !== 'correction_requested') return false;
    } else if (activeFilter !== 'all' && seller.status !== activeFilter) {
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
      sellerType: seller.sellerType || (seller.isGstRegistered ? 'gst' : 'local_without_gst'),
      isGstRegistered: seller.isGstRegistered,
      gstin: seller.gstin || '',
      panNumber: seller.panNumber || '',
      serviceRadiusKm: seller.serviceRadiusKm || (seller.isGstRegistered ? 50 : 10),
      openingHours: seller.openingHours || '8:00 AM - 9:00 PM',
      businessInfo: seller.businessInfo || '',
      categories: seller.categories?.join(', ') || 'Grocery, Masala & Food',
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSellerForEdit) return;

    const catArray = editFormData.categories
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const isLocal = editFormData.sellerType === 'local_without_gst' || !editFormData.isGstRegistered;
    const finalRadius = isLocal ? Math.min(Number(editFormData.serviceRadiusKm), 10) : Number(editFormData.serviceRadiusKm);

    editSeller(selectedSellerForEdit.id, {
      shopName: editFormData.shopName,
      ownerName: editFormData.ownerName,
      name: editFormData.ownerName,
      phone: editFormData.phone,
      email: editFormData.email,
      sellerType: editFormData.sellerType,
      isGstRegistered: editFormData.isGstRegistered,
      isRadiusLocked: isLocal,
      gstin: editFormData.gstin,
      panNumber: editFormData.panNumber,
      serviceRadiusKm: finalRadius,
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

  const handleOpenCorrection = (seller: Seller) => {
    setSelectedSellerForCorrection(seller);
    setCorrectionReasonPreset('Re-upload clear legible document copy');
    setCustomCorrectionDetails('');
  };

  const handleConfirmCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSellerForCorrection) return;

    const details = customCorrectionDetails.trim()
      ? `${correctionReasonPreset} - ${customCorrectionDetails.trim()}`
      : correctionReasonPreset;

    requestSellerCorrection(selectedSellerForCorrection.id, details);
    setSelectedSellerForCorrection(null);
    if (selectedSellerForView?.id === selectedSellerForCorrection.id) {
      setSelectedSellerForView(null);
    }
  };

  const handleApprove = (sellerId: string) => {
    approveSeller(sellerId);
    if (selectedSellerForView?.id === sellerId) {
      setSelectedSellerForView(prev =>
        prev
          ? {
              ...prev,
              status: 'approved',
              kycStatus: 'approved',
              verified: true,
              isOpen: true,
              isRadiusLocked: prev.sellerType === 'local_without_gst' || !prev.isGstRegistered,
            }
          : null
      );
    }
  };

  const handleToggleSuspend = (seller: Seller) => {
    const isCurrentlySuspended = seller.status === 'suspended';
    if (isCurrentlySuspended) {
      suspendSeller(seller.id, false);
      showToast(`Seller "${seller.shopName}" has been REACTIVATED and is back live.`);
    } else {
      if (
        confirm(
          `Are you sure you want to suspend "${seller.shopName}"? The shop and its products will be deactivated from the customer marketplace.`
        )
      ) {
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
                Manage <strong>Option 1 (GST Registered)</strong> & <strong>Option 2 (Without GST / 10 KM Local)</strong> seller compliance workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shop, owner, PAN, GST, phone..."
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div
          onClick={() => setActiveFilter('pending')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-amber-800">Pending Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-900 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-amber-700 font-medium">Require Verification</span>
        </div>

        <div
          onClick={() => setActiveFilter('correction_requested')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'correction_requested'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/30'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-blue-800">Correction Requested</span>
            <MessageSquareWarning className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-900 mt-1">{correctionCount}</div>
          <span className="text-[10px] text-blue-700 font-medium">Awaiting Seller Update</span>
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
          <span className="text-[10px] text-rose-700 font-medium">Declined</span>
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
          <span className="text-[10px] text-purple-700 font-medium">Paused</span>
        </div>
      </div>

      {/* Filter Tabs Navigation & Seller Type Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-2">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Pending ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('correction_requested')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'correction_requested'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Correction Needed ({correctionCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'approved'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'rejected'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Rejected ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All ({sellers.length})</span>
          </button>
        </div>

        {/* Seller Type Pill Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold shrink-0 self-start md:self-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              typeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setTypeFilter('gst')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              typeFilter === 'gst' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3 h-3 text-blue-600" />
            <span>GST Sellers ({gstCount})</span>
          </button>
          <button
            onClick={() => setTypeFilter('local_without_gst')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              typeFilter === 'local_without_gst' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3 h-3 text-amber-600" />
            <span>Local 10 KM ({localCount})</span>
          </button>
        </div>
      </div>

      {/* Seller Application Cards List */}
      <div className="space-y-4">
        {filteredSellers.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-2">
            <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500 opacity-60" />
            <p className="font-bold text-slate-700 text-sm">
              {activeFilter === 'pending'
                ? 'No pending seller KYC applications in queue.'
                : activeFilter === 'correction_requested'
                ? 'No sellers currently have correction requests pending.'
                : activeFilter === 'rejected'
                ? 'No rejected merchant applications.'
                : activeFilter === 'suspended'
                ? 'No suspended sellers.'
                : 'No merchant stores match your search and filter criteria.'}
            </p>
            <p className="text-xs text-slate-400">
              {activeFilter === 'pending'
                ? 'When a new merchant registers on Harwalkart Seller Portal, their application will appear here for Admin authorization.'
                : 'Try clearing your search query or selecting a different status filter above.'}
            </p>
          </div>
        ) : (
          filteredSellers.map(seller => {
            const isPending = seller.status === 'pending';
            const isApproved = seller.status === 'approved';
            const isRejected = seller.status === 'rejected';
            const isSuspended = seller.status === 'suspended';
            const isCorrection = seller.kycStatus === 'correction_requested';
            const isGstSeller = seller.sellerType === 'gst' || seller.isGstRegistered;

            return (
              <div
                key={seller.id}
                className={`p-5 rounded-3xl border transition-all text-xs space-y-4 ${
                  isCorrection
                    ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                    : isPending
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
                      src={
                        seller.logo ||
                        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={seller.shopName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-black text-slate-950">{seller.shopName}</h4>

                        {/* Seller Option Badge */}
                        {isGstSeller ? (
                          <span className="bg-slate-900 text-amber-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <Globe className="w-3 h-3" />
                            Option 1: GST Registered (PAN-India)
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <Compass className="w-3 h-3" />
                            Option 2: Non-GST Local (Fixed 10 KM)
                          </span>
                        )}

                        {/* Status Badges */}
                        {isCorrection && (
                          <span className="bg-blue-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
                            Correction Requested
                          </span>
                        )}
                        {isPending && !isCorrection && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
                            KYC Under Review
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
                            Rejected
                          </span>
                        )}
                        {isSuspended && (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Ban className="w-3 h-3 text-purple-600" />
                            Suspended
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
                      title="Inspect uploaded KYC documents and verification details"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Inspect KYC Docs</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(seller)}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      title="Edit store details, tax info or service radius"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>

                    {/* Request Correction action */}
                    {!isApproved && (
                      <button
                        onClick={() => handleOpenCorrection(seller)}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Ask seller to re-upload or correct documents"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                        <span>Request Correction</span>
                      </button>
                    )}

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

                    {/* Reject Action */}
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
                        title="Approve seller KYC and publish store to live marketplace"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isRejected ? 'Re-Approve Shop' : 'Approve Shop'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-Card Information Rows: KYC doc & Tax credentials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-[11px]">
                  {/* KYC Documents Summary */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">KYC Document</span>
                        <span className="font-bold text-slate-800 truncate block">
                          {seller.kycDoc ? `${seller.kycDoc.docType}: ${seller.kycDoc.docNumber}` : 'Documents Attached'}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                      {seller.kycDocuments?.length || 1} Doc(s)
                    </span>
                  </div>

                  {/* Tax & Legal PAN/GSTIN */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Building className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">
                          {isGstSeller ? 'GSTIN & PAN' : 'PAN ID (No GST)'}
                        </span>
                        <span className="font-bold text-slate-800 font-mono truncate block">
                          {isGstSeller ? (seller.gstin || 'Registered') : `PAN: ${seller.panNumber || 'Submitted'}`}
                        </span>
                      </div>
                    </div>
                    {seller.panNumber && isGstSeller && (
                      <span className="text-slate-500 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                        PAN: {seller.panNumber}
                      </span>
                    )}
                  </div>

                  {/* Delivery Radius & Constraint */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Delivery Rule</span>
                        <span className="font-bold text-slate-800 truncate block">
                          {isGstSeller ? 'PAN-India & Wider Delivery' : 'Fixed 10 KM Radius (Locked)'}
                        </span>
                      </div>
                    </div>
                    {isGstSeller ? (
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                        PAN-INDIA
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> 10 KM
                      </span>
                    )}
                  </div>
                </div>

                {/* Correction Request / Rejection Remark Notice */}
                {isCorrection && seller.rejectionReason && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-blue-900">
                    <RotateCcw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">Correction Requested from Seller:</p>
                      <p className="text-[11px] text-blue-800">{seller.rejectionReason}</p>
                      <p className="text-[10px] text-blue-600">
                        The seller has been prompted in their dashboard to rectify and resubmit these documents.
                      </p>
                    </div>
                  </div>
                )}

                {isRejected && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">Rejection Remarks:</p>
                      <p className="text-[11px] text-rose-800">
                        {seller.rejectionReason || 'Application does not meet Harwalkart platform onboarding standards.'}
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
      {/* MODAL 1: VIEW & INSPECT KYC APPLICATION & ALL ATTACHED DOCUMENTS */}
      {/* ========================================================================= */}
      {selectedSellerForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full space-y-5 animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedSellerForView.logo ||
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={selectedSellerForView.shopName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-950">{selectedSellerForView.shopName}</h3>
                    {selectedSellerForView.sellerType === 'gst' || selectedSellerForView.isGstRegistered ? (
                      <span className="bg-slate-900 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded">
                        OPTION 1: GST
                      </span>
                    ) : (
                      <span className="bg-amber-200 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded">
                        OPTION 2: LOCAL 10 KM
                      </span>
                    )}
                  </div>
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

            {/* Status & Compliance Rule Banner */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                selectedSellerForView.status === 'approved'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : selectedSellerForView.kycStatus === 'correction_requested'
                  ? 'bg-blue-50 border-blue-200 text-blue-950'
                  : selectedSellerForView.status === 'rejected'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : selectedSellerForView.status === 'suspended'
                  ? 'bg-purple-50 border-purple-200 text-purple-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedSellerForView.status === 'approved' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                {selectedSellerForView.kycStatus === 'correction_requested' && (
                  <RotateCcw className="w-6 h-6 text-blue-600" />
                )}
                {selectedSellerForView.status === 'rejected' && <XCircle className="w-6 h-6 text-rose-600" />}
                {selectedSellerForView.status === 'suspended' && <Ban className="w-6 h-6 text-purple-600" />}
                {selectedSellerForView.status === 'pending' && selectedSellerForView.kycStatus !== 'correction_requested' && (
                  <Clock className="w-6 h-6 text-amber-600 animate-spin" />
                )}

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block">Application & KYC Status</span>
                  <p className="text-sm font-black capitalize">
                    {selectedSellerForView.kycStatus === 'correction_requested'
                      ? 'Correction Requested (Awaiting Seller Re-submission)'
                      : selectedSellerForView.status === 'pending'
                      ? 'Pending Admin Verification & Approval'
                      : selectedSellerForView.status}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-500 block">Selling Eligibility</span>
                <span className="font-bold">
                  {selectedSellerForView.sellerType === 'gst' || selectedSellerForView.isGstRegistered
                    ? 'PAN-India Serviceable'
                    : 'Fixed 10 KM Hyperlocal Radius'}
                </span>
              </div>
            </div>

            {/* List of Uploaded KYC Documents */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span className="font-black text-slate-900 text-xs">Uploaded KYC Documents & Credentials</span>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                  Compliance Package
                </span>
              </div>

              {selectedSellerForView.kycDocuments && selectedSellerForView.kycDocuments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSellerForView.kycDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-400">{doc.docType}</span>
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                              doc.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {doc.verified ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </div>
                        <p className="font-mono font-bold text-slate-900 text-xs mt-1">{doc.docNumber}</p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-1">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{doc.fileName}</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">{doc.uploadedAt}</span>
                        <button
                          type="button"
                          onClick={() => showToast(`Opened document preview: ${doc.fileName}`)}
                          className="text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" /> View Scanned Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedSellerForView.kycDoc ? (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      {selectedSellerForView.kycDoc.docType}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{selectedSellerForView.kycDoc.docNumber}</span>
                    <span className="text-slate-500 block text-[11px]">{selectedSellerForView.kycDoc.fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`Opened document preview: ${selectedSellerForView.kycDoc?.fileName}`)}
                    className="text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer text-xs"
                  >
                    <ExternalLink className="w-3 h-3" /> View File
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-xs">
                  No separate document attached. Verified via Trade Records / PAN: {selectedSellerForView.panNumber || selectedSellerForView.gstin}.
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
                    <span className="text-slate-400">PAN Number:</span>{' '}
                    <strong className="font-mono">{selectedSellerForView.panNumber || 'Provided in KYC'}</strong>
                  </p>
                  {selectedSellerForView.gstin && (
                    <p>
                      <span className="text-slate-400">GSTIN:</span>{' '}
                      <strong className="font-mono text-blue-700">{selectedSellerForView.gstin}</strong>
                    </p>
                  )}
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
                    <strong>
                      {selectedSellerForView.address.city}, {selectedSellerForView.address.state || 'India'}
                    </strong>
                  </p>
                  <p>
                    <span className="text-slate-400">PIN Code:</span>{' '}
                    <strong className="font-mono">{selectedSellerForView.address.pincode}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">Delivery Boundary:</span>{' '}
                    <strong>
                      {selectedSellerForView.sellerType === 'gst' || selectedSellerForView.isGstRegistered
                        ? 'PAN-India / Nationwide'
                        : `${selectedSellerForView.serviceRadiusKm || 10} KM Radius (Locked)`}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Business Description */}
            {selectedSellerForView.businessInfo && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Business Statement</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedSellerForView.businessInfo}</p>
              </div>
            )}

            {/* Rejection / Correction Reason if any */}
            {selectedSellerForView.rejectionReason && (
              <div
                className={`p-3.5 rounded-2xl space-y-1 ${
                  selectedSellerForView.kycStatus === 'correction_requested'
                    ? 'bg-blue-50 border border-blue-200 text-blue-950'
                    : 'bg-rose-50 border border-rose-200 text-rose-950'
                }`}
              >
                <span className="block text-[10px] font-black uppercase">
                  {selectedSellerForView.kycStatus === 'correction_requested'
                    ? 'Current Correction Request'
                    : 'Recorded Rejection Reason'}
                </span>
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
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                {selectedSellerForView.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      const s = selectedSellerForView;
                      setSelectedSellerForView(null);
                      handleOpenCorrection(s);
                    }}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Request Correction</span>
                  </button>
                )}

                {selectedSellerForView.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      const s = selectedSellerForView;
                      setSelectedSellerForView(null);
                      handleOpenReject(s);
                    }}
                    className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSellerForView(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>

                {selectedSellerForView.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedSellerForView.id)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Authorize Shop</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REQUEST SELLER CORRECTION */}
      {/* ========================================================================= */}
      {selectedSellerForCorrection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmCorrection}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-600">
                <RotateCcw className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-950">Request Document Correction</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSellerForCorrection(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600">
              Specify what corrections <strong>{selectedSellerForCorrection.shopName}</strong> needs to make. The merchant will receive a notification to update and resubmit.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Correction Preset *</label>
                <select
                  value={correctionReasonPreset}
                  onChange={e => setCorrectionReasonPreset(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium"
                >
                  <option value="Re-upload clear legible document copy">Re-upload clear, legible scanned copy of PAN / KYC document</option>
                  <option value="GST certificate expired or name mismatch">GST certificate expired or business name mismatch with GST portal</option>
                  <option value="Invalid / unreadable PAN card image">Invalid or unreadable PAN card photograph</option>
                  <option value="Shop address proof required">Commercial address proof / Electricity bill required</option>
                  <option value="FSSAI registration mandatory for grocery items">FSSAI food registration mandatory for packaged grocery items</option>
                  <option value="Other specific correction">Other (specify custom instructions below)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Specific Instructions for Seller</label>
                <textarea
                  rows={3}
                  value={customCorrectionDetails}
                  onChange={e => setCustomCorrectionDetails(e.target.value)}
                  placeholder="e.g. Please upload the complete 3 pages of your GST REG-06 certificate with trade name clearly visible."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Send Correction Request
              </button>
              <button
                type="button"
                onClick={() => setSelectedSellerForCorrection(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REJECT SELLER APPLICATION WITH REASON */}
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
      {/* MODAL 4: EDIT SELLER INFORMATION */}
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
              {/* Seller Option Select */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Seller Category & Delivery Rule *</label>
                <select
                  value={editFormData.sellerType}
                  onChange={e => {
                    const st = e.target.value as SellerType;
                    setEditFormData({
                      ...editFormData,
                      sellerType: st,
                      isGstRegistered: st === 'gst',
                      serviceRadiusKm: st === 'local_without_gst' ? 10 : editFormData.serviceRadiusKm,
                    });
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold bg-slate-50"
                >
                  <option value="gst">Option 1: GST Registered Seller (PAN-India Enabled)</option>
                  <option value="local_without_gst">Option 2: Without GST / Local Seller (Locked 10 KM Radius)</option>
                </select>
              </div>

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
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">GSTIN Number</label>
                    <input
                      type="text"
                      value={editFormData.gstin}
                      onChange={e => setEditFormData({ ...editFormData, gstin: e.target.value.toUpperCase() })}
                      className="w-full p-2 border border-slate-200 rounded-lg uppercase font-mono"
                      placeholder="07AAAAA0000A1Z5"
                      disabled={editFormData.sellerType === 'local_without_gst'}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">PAN Number *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.panNumber}
                      onChange={e => setEditFormData({ ...editFormData, panNumber: e.target.value.toUpperCase() })}
                      className="w-full p-2 border border-slate-200 rounded-lg uppercase font-mono"
                      placeholder="AAAAA0000A"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Service Radius (KM) {editFormData.sellerType === 'local_without_gst' && '(Fixed at 10 KM max)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={editFormData.sellerType === 'local_without_gst' ? 10 : 50}
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
