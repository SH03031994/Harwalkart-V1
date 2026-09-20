import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { DeliveryPartner } from '../../../types';
import {
  Bike,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const AdminDeliveryPartnersTab: React.FC = () => {
  const {
    deliveryPartners,
    addDeliveryPartner,
    editDeliveryPartner,
    deleteDeliveryPartner,
    orders,
    navigate,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'offline' | 'suspended'>('all');
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'New Delhi',
    pincode: '110001',
    vehicleType: 'Bike' as 'Bike' | 'Scooter' | 'Electric EV' | 'Bicycle',
    vehicleNumber: 'DL 01 AB 0000',
    licenseNumber: 'DL-042024009988',
    walletBalance: 0,
    upiId: '',
    bankName: 'State Bank of India',
    accountNumber: '',
    ifsc: 'SBIN0001234',
    status: 'active' as 'active' | 'offline' | 'suspended',
  });

  const filteredPartners = deliveryPartners.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPartners = deliveryPartners.length;
  const activePartners = deliveryPartners.filter(p => p.status === 'active').length;
  const totalCompletedTrips = deliveryPartners.reduce((acc, p) => acc + (p.completedDeliveries || 0), 0);
  const totalFleetEarnings = deliveryPartners.reduce((acc, p) => acc + (p.totalEarnings || 0), 0);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: 'New Delhi',
      pincode: '110001',
      vehicleType: 'Bike',
      vehicleNumber: '',
      licenseNumber: '',
      walletBalance: 0,
      upiId: '',
      bankName: 'State Bank of India',
      accountNumber: '',
      ifsc: 'SBIN0001234',
      status: 'active',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (partner: DeliveryPartner) => {
    setSelectedPartner(partner);
    setFormData({
      name: partner.name,
      phone: partner.phone,
      email: partner.email,
      city: partner.city,
      pincode: partner.pincode || '110001',
      vehicleType: partner.vehicleType,
      vehicleNumber: partner.vehicleNumber,
      licenseNumber: partner.licenseNumber || '',
      walletBalance: partner.walletBalance,
      upiId: partner.upiId || '',
      bankName: partner.bankDetails?.bankName || 'State Bank of India',
      accountNumber: partner.bankDetails?.accountNumber || '',
      ifsc: partner.bankDetails?.ifscCode || 'SBIN0001234',
      status: partner.status,
    });
    setIsEditModalOpen(true);
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Please enter partner name and mobile phone.');
      return;
    }

    addDeliveryPartner({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@rider.harwalkart.com`,
      city: formData.city,
      pincode: formData.pincode,
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber,
      licenseNumber: formData.licenseNumber,
      status: formData.status,
      rating: 4.8,
      completedDeliveries: 0,
      totalEarnings: 0,
      walletBalance: Number(formData.walletBalance) || 0,
      joinedDate: new Date().toISOString().split('T')[0],
      upiId: formData.upiId || `${formData.phone}@upi`,
      bankDetails: {
        accountNumber: formData.accountNumber || '123456789012',
        ifsc: formData.ifsc || 'SBIN0001234',
        bankName: formData.bankName,
      },
    });

    setIsAddModalOpen(false);
    resetForm();
    showToast(`Delivery Partner "${formData.name}" onboarded successfully!`);
  };

  const handleUpdatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) return;

    editDeliveryPartner(selectedPartner.id, {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      pincode: formData.pincode,
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber,
      licenseNumber: formData.licenseNumber,
      status: formData.status,
      walletBalance: Number(formData.walletBalance),
      upiId: formData.upiId,
      bankDetails: {
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        bankName: formData.bankName,
      },
    });

    setIsEditModalOpen(false);
    setSelectedPartner(null);
    showToast(`Updated details for rider "${formData.name}".`);
  };

  const handleDeletePartner = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove delivery partner "${name}" from the fleet?`)) {
      deleteDeliveryPartner(id);
    }
  };

  const handleToggleStatus = (partner: DeliveryPartner) => {
    const nextStatus = partner.status === 'active' ? 'offline' : 'active';
    editDeliveryPartner(partner.id, { status: nextStatus });
    showToast(`Rider "${partner.name}" is now ${nextStatus.toUpperCase()}.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bike className="w-6 h-6 text-emerald-600" />
            <span>Delivery Fleet & Partners</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage hyperlocal delivery riders, track real-time duty status, vehicles, and earnings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/delivery/dashboard')}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Rider Panel View</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Partner</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider">Total Fleet</span>
            <Bike className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalPartners}
          </div>
          <span className="text-[10px] text-slate-400">Registered riders across cities</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider">Active On Duty</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {activePartners}
          </div>
          <span className="text-[10px] text-slate-400">Ready for instant pickups</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider">Completed Trips</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalCompletedTrips}
          </div>
          <span className="text-[10px] text-slate-400">OTP-verified deliveries</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider">Fleet Earnings Paid</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            ₹{totalFleetEarnings.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400">Delivery fees disbursed</span>
        </div>
      </div>

      {/* 3. Search and Status Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by rider name, mobile, vehicle number, or city..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({deliveryPartners.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Active ({deliveryPartners.filter(p => p.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('offline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === 'offline'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Offline ({deliveryPartners.filter(p => p.status === 'offline').length})
          </button>
        </div>
      </div>

      {/* 4. Delivery Partners List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Delivery Partner</th>
                <th className="py-3 px-4">City & Contact</th>
                <th className="py-3 px-4">Vehicle & License</th>
                <th className="py-3 px-4">Performance</th>
                <th className="py-3 px-4">Wallet Balance</th>
                <th className="py-3 px-4">Duty Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No delivery partners matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPartners.map(partner => (
                  <tr key={partner.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Partner Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                          {partner.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {partner.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            ID: {partner.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* City & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{partner.city} ({partner.pincode || '110001'})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>+91 {partner.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-md text-[10px]">
                          <Bike className="w-3 h-3 text-emerald-600" />
                          {partner.vehicleType}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          {partner.vehicleNumber}
                        </span>
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{partner.rating} / 5.0</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {partner.completedDeliveries} completed trips
                        </span>
                      </div>
                    </td>

                    {/* Wallet */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 block">
                          ₹{partner.walletBalance}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Lifetime: ₹{partner.totalEarnings}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(partner)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${
                          partner.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-300'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${partner.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{partner.status === 'active' ? 'On Duty' : 'Offline'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(partner)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Partner Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePartner(partner.id, partner.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Remove Partner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add / Edit Partner Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-600" />
                <span>{isAddModalOpen ? 'Onboard New Delivery Partner' : `Edit Rider: ${selectedPartner?.name}`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleCreatePartner : handleUpdatePartner} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Rider Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9811223344"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rider@example.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Assigned City / Hub
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New Delhi"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={e => setFormData({ ...formData, vehicleType: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Bike">Bike (Motorcycle)</option>
                    <option value="Scooter">Scooter (Activa / Jupiter)</option>
                    <option value="Electric EV">Electric EV 2-Wheeler</option>
                    <option value="Bicycle">Bicycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Vehicle Registration No.
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    placeholder="DL 01 AB 1234"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Driving License No.
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="DL-142024001234"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Wallet Balance (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.walletBalance}
                    onChange={e => setFormData({ ...formData, walletBalance: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Rider UPI ID for Payouts
                  </label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                    placeholder="e.g. 9811223344@upi"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Duty Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value="active">Active (On Duty)</option>
                    <option value="offline">Offline (Off Duty)</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  {isAddModalOpen ? 'Onboard Partner' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
