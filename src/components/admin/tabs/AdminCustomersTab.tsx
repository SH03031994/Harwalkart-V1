import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CustomerUser } from '../../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Eye,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AdminCustomersTab: React.FC = () => {
  const {
    registeredCustomers,
    orders,
    addCustomer,
    editCustomer,
    toggleCustomerBlock,
    deleteCustomer,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pincode: '',
    address: '',
  });

  const filteredCustomers = registeredCustomers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.pincode && c.pincode.includes(searchTerm));

    const isBlocked = c.status === 'blocked' || c.isBlocked;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !isBlocked) ||
      (statusFilter === 'blocked' && isBlocked);

    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      pincode: '110001',
      address: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (customer: CustomerUser) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      pincode: customer.pincode || customer.savedAddresses?.[0]?.pincode || '',
      address: customer.address || customer.savedAddresses?.[0]?.addressLine || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      pincode: formData.pincode,
      address: formData.address,
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          name: formData.name,
          mobile: formData.phone,
          addressLine: formData.address || 'Standard Address',
          area: 'Central',
          city: 'New Delhi',
          pincode: formData.pincode,
          isDefault: true,
        },
      ],
      wishlist: [],
      status: 'active',
      isBlocked: false,
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    editCustomer(selectedCustomer.id, {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      pincode: formData.pincode,
      address: formData.address,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Registered Customer Accounts</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {registeredCustomers.length} Customers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer credentials, order histories, delivery addresses, and account permissions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, email, PIN..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] cursor-pointer transition-colors ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({registeredCustomers.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] cursor-pointer transition-colors ${
              statusFilter === 'active'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active ({registeredCustomers.filter(c => c.status !== 'blocked' && !c.isBlocked).length})
          </button>
          <button
            onClick={() => setStatusFilter('blocked')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] cursor-pointer transition-colors ${
              statusFilter === 'blocked'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Blocked ({registeredCustomers.filter(c => c.status === 'blocked' || c.isBlocked).length})
          </button>
        </div>
      </div>

      {/* Customer List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCustomers.map(customer => {
          const isBlocked = customer.status === 'blocked' || customer.isBlocked;
          const customerOrders = orders.filter(
            o =>
              o.deliveryAddress.fullName.toLowerCase() === customer.name.toLowerCase() ||
              o.deliveryAddress.mobile === customer.phone
          );

          return (
            <div
              key={customer.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 text-xs ${
                isBlocked
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-slate-50 hover:bg-slate-50/80 border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden shrink-0">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        customer.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{customer.name}</h4>
                      <p className="text-slate-500 text-[11px]">ID: {customer.id}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      isBlocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+91 {customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {customer.address || customer.savedAddresses?.[0]?.addressLine || 'Delhi Hub'} (PIN{' '}
                      {customer.pincode || customer.savedAddresses?.[0]?.pincode || '110001'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>Joined: {customer.joinedDate || '2025'}</span>
                  <span>
                    Orders Placed: <strong className="text-slate-800">{customerOrders.length}</strong>
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                <button
                  onClick={() => toggleCustomerBlock(customer.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                    isBlocked
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                      : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                  }`}
                >
                  {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isBlocked ? 'Unblock' : 'Block Access'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(customer)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                    title="Edit Customer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
                        deleteCustomer(customer.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 cursor-pointer"
                    title="Delete Customer"
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
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950">
                {isAddModalOpen ? 'Register New Customer' : `Edit Customer: ${selectedCustomer?.name}`}
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
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone (10-Digit) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. 9876543210"
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
                  placeholder="e.g. rahul@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Delivery PIN Code *</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. 110001"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Delivery Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="House / Flat No, Street, Landmark"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
              >
                {isAddModalOpen ? 'Add Customer' : 'Save Changes'}
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
