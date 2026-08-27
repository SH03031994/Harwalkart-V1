import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Order } from '../../../types';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Eye,
  Trash2,
  Phone,
  MapPin,
  DollarSign,
} from 'lucide-react';

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.deliveryAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.deliveryAddress.mobile.includes(searchTerm) ||
      o.deliveryAddress.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.deliveryAddress.pincode.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-indigo-100 text-indigo-800';
      case 'preparing':
        return 'bg-amber-100 text-amber-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Marketplace Customer Orders</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time customer purchases, tracking milestones, commission splits, and delivery fulfillment.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, Mobile or PIN..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === tab
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.replace(/_/g, ' ')} ({orders.filter(o => tab === 'all' || o.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(o => (
          <div
            key={o.id}
            className="p-5 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 text-xs transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 font-black">
                  📦
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-950 text-sm">Order #{o.id}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${getStatusBadge(o.status)}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] font-medium">Placed on: {o.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Order Value</span>
                  <span className="text-base font-black text-slate-950">₹{o.total}</span>
                </div>

                <select
                  value={o.status}
                  onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs cursor-pointer shadow-xs focus:ring-2 focus:ring-amber-400"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>Customer & Address</span>
                </div>
                <p className="font-bold text-slate-900">{o.deliveryAddress.fullName} (+91 {o.deliveryAddress.mobile})</p>
                <p className="text-slate-600 text-[11px] line-clamp-2">
                  {o.deliveryAddress.addressLine}, {o.deliveryAddress.city} - {o.deliveryAddress.pincode}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                  <Package className="w-3 h-3 text-blue-600" />
                  <span>Ordered Items ({o.items.length})</span>
                </div>
                <div className="space-y-0.5">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700 font-medium">
                      <span className="truncate max-w-[150px]">{it.name} (x{it.quantity})</span>
                      <span>₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                  <DollarSign className="w-3 h-3 text-emerald-600" />
                  <span>Settlement Breakdown</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">₹{o.subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Platform Commission:</span>
                  <span>₹{o.sellerCommissionTotal || Math.round(o.total * 0.02)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Payment:</span>
                  <span className="font-bold uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                    {o.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedOrder(o);
                  setIsViewModalOpen(true);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Invoice</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete Order #${o.id} record?`)) {
                    deleteOrder(o.id);
                  }
                }}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                title="Delete Order Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULL INVOICE MODAL */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-950">HARWALKART GST Tax Invoice</h3>
                <p className="text-slate-600 text-[11px] font-semibold mt-0.5">
                  Harwalkart (Jai Shree Ram Enterprises)
                </p>
                <p className="text-slate-500 text-[10px] leading-tight">
                  Head Office: Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220
                </p>
                <p className="text-amber-700 font-mono text-[10px] font-bold mt-1">
                  Order #{selectedOrder.id} • Date: {selectedOrder.date}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Delivery Destination</span>
                <p className="font-bold text-slate-900">
                  {selectedOrder.deliveryAddress.fullName} (+91 {selectedOrder.deliveryAddress.mobile})
                </p>
                <p className="text-slate-600">
                  {selectedOrder.deliveryAddress.addressLine}, {selectedOrder.deliveryAddress.city} -{' '}
                  {selectedOrder.deliveryAddress.pincode}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-2 font-bold text-slate-700 border-b border-slate-200">
                  Item Details
                </div>
                <div className="divide-y divide-slate-100 p-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{it.name}</p>
                        <p className="text-slate-500 text-[11px]">Seller: {it.sellerName} | Qty: {it.quantity}</p>
                      </div>
                      <div className="text-right font-black text-slate-900">
                        ₹{it.price * it.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span>₹{selectedOrder.deliveryFee}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full py-2.5 bg-slate-950 text-amber-400 font-bold rounded-xl cursor-pointer"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
