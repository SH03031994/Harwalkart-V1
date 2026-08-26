import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Seller } from '../../../types';
import {
  Store,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export const AdminSellersTab: React.FC = () => {
  const { sellers, addSeller, editSeller, suspendSeller, deleteSeller, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'suspended'>('all');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    pincode: '',
    state: 'Maharashtra',
    isGstRegistered: false,
    gstin: '',
    businessInfo: '',
    serviceRadiusKm: 10,
    categories: 'Spices & Masalas',
  });

  const filteredSellers = sellers.filter(s => {
    const matchesSearch =
      s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.ownerName && s.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.phone.includes(searchTerm) ||
      s.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.pincode.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      shopName: '',
      ownerName: '',
      phone: '',
      email: '',
      street: 'Shop No 1, Main Bazaar',
      city: 'Mumbai',
      pincode: '400001',
      state: 'Maharashtra',
      isGstRegistered: false,
      gstin: '',
      businessInfo: 'Retail grocery and household essentials.',
      serviceRadiusKm: 10,
      categories: 'Spices & Masalas',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (seller: Seller) => {
    setSelectedSeller(seller);
    setFormData({
      shopName: seller.shopName,
      ownerName: seller.ownerName || seller.name,
      phone: seller.phone,
      email: seller.email,
      street: seller.address.street,
      city: seller.address.city,
      pincode: seller.address.pincode,
      state: seller.address.state || 'Maharashtra',
      isGstRegistered: seller.isGstRegistered,
      gstin: seller.gstin || '',
      businessInfo: seller.businessInfo || '',
      serviceRadiusKm: seller.serviceRadiusKm || 10,
      categories: seller.categories?.join(', ') || 'Spices & Masalas',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addSeller({
      name: formData.ownerName,
      ownerName: formData.ownerName,
      shopName: formData.shopName,
      slug,
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60',
      bannerImage: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop&q=60',
      rating: 4.8,
      reviewCount: 1,
      isOpen: true,
      openingHours: '9:00 AM - 9:00 PM',
      distanceKm: 2.5,
      serviceablePincodes: [formData.pincode],
      serviceRadiusKm: Number(formData.serviceRadiusKm),
      isHarwalkartDirect: false,
      isGstRegistered: formData.isGstRegistered,
      gstin: formData.gstin,
      businessInfo: formData.businessInfo,
      status: 'approved',
      walletBalance: 0,
      totalEarnings: 0,
      phone: formData.phone,
      email: formData.email,
      verified: true,
      productCount: 0,
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
      address: {
        street: formData.street,
        area: formData.city,
        city: formData.city,
        pincode: formData.pincode,
        state: formData.state,
      },
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeller) return;

    editSeller(selectedSeller.id, {
      shopName: formData.shopName,
      ownerName: formData.ownerName,
      name: formData.ownerName,
      phone: formData.phone,
      email: formData.email,
      isGstRegistered: formData.isGstRegistered,
      gstin: formData.gstin,
      businessInfo: formData.businessInfo,
      serviceRadiusKm: Number(formData.serviceRadiusKm),
      categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
      address: {
        ...selectedSeller.address,
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
        state: formData.state,
      },
    });

    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Marketplace Sellers & Stores</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {sellers.length} Shops
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer verified local vendor accounts, wallet balances, GST status and delivery radiuses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Store</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stores by name, city, phone or PIN..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['all', 'approved', 'pending', 'suspended'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] cursor-pointer transition-colors ${
                statusFilter === tab
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab} ({sellers.filter(s => tab === 'all' || s.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredSellers.map(seller => {
          const isSuspended = seller.status === 'suspended';

          return (
            <div
              key={seller.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 text-xs ${
                isSuspended
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-slate-50 hover:bg-slate-50/80 border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.logo}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{seller.shopName}</h4>
                      <p className="text-slate-500 text-[11px]">
                        Owner: {seller.ownerName || seller.name} • {seller.address.city}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      seller.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : seller.status === 'suspended'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {seller.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-bold block">Service Reach</span>
                    <span className="font-bold text-slate-800">
                      {seller.isGstRegistered ? 'Pan-India (GST)' : `${seller.serviceRadiusKm || 10} KM Local`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-bold block">Wallet Balance</span>
                    <span className="font-bold text-emerald-600">₹{seller.walletBalance?.toLocaleString() || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-bold block">Mobile</span>
                    <span className="text-slate-800">+91 {seller.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-bold block">PIN Code</span>
                    <span className="text-slate-800">{seller.address.pincode}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                <button
                  onClick={() => suspendSeller(seller.id, !isSuspended)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                    isSuspended
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                      : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                  }`}
                >
                  {isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isSuspended ? 'Reactivate' : 'Suspend'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(seller)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                    title="Edit Store"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete store "${seller.shopName}"?`)) {
                        deleteSeller(seller.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 cursor-pointer"
                    title="Delete Store"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950">
                {isAddModalOpen ? 'Register New Store' : `Edit Store: ${selectedSeller?.shopName}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
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
                    value={formData.shopName}
                    onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Delivery Radius (KM)</label>
                  <input
                    type="number"
                    value={formData.serviceRadiusKm}
                    onChange={e => setFormData({ ...formData, serviceRadiusKm: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Categories (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.categories}
                  onChange={e => setFormData({ ...formData, categories: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="storeIsGst"
                    checked={formData.isGstRegistered}
                    onChange={e => setFormData({ ...formData, isGstRegistered: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="storeIsGst" className="font-bold text-slate-800 cursor-pointer">
                    GST Registered (Pan-India Serviceable)
                  </label>
                </div>

                {formData.isGstRegistered && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">GSTIN Number</label>
                    <input
                      type="text"
                      value={formData.gstin}
                      onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg uppercase font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
              >
                {isAddModalOpen ? 'Register Store' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
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
