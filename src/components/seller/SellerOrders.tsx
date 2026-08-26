import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller, Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  Phone,
  User,
  Percent,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SellerOrdersProps {
  seller: Seller;
  orders: Order[];
}

export const SellerOrders: React.FC<SellerOrdersProps> = ({ seller, orders }) => {
  const { updateOrderStatus, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filter orders containing items belonging to this seller
  const sellerOrders = orders.filter(ord =>
    ord.items.some(it => it.sellerId === seller.id || it.sellerName === seller.shopName)
  );

  const filteredOrders = sellerOrders.filter(ord => {
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.deliveryAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.deliveryAddress.mobile.includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return { label: 'New Order', bg: 'bg-blue-100 text-blue-900', icon: Clock };
      case 'confirmed':
        return { label: 'Confirmed', bg: 'bg-amber-100 text-amber-900', icon: CheckCircle2 };
      case 'preparing':
        return { label: 'Packing / Packed', bg: 'bg-purple-100 text-purple-900', icon: Package };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', bg: 'bg-indigo-100 text-indigo-900', icon: Truck };
      case 'delivered':
        return { label: 'Delivered', bg: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-rose-100 text-rose-800', icon: Clock };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-800', icon: Clock };
    }
  };

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = currentStatus;
    if (currentStatus === 'placed') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'out_for_delivery';
    else if (currentStatus === 'out_for_delivery') nextStatus = 'delivered';

    if (nextStatus !== currentStatus) {
      updateOrderStatus(orderId, nextStatus);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            Store Orders & 2% Commission Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer orders and view transparent net settlements for <strong>{seller.shopName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Total Orders: <strong>{sellerOrders.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, mobile..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xs text-center space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No matching orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no customer orders matching your selected filter. New orders will appear here automatically in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(ord => {
            const sellerItems = ord.items.filter(
              it => it.sellerId === seller.id || it.sellerName === seller.shopName
            );
            const grossTotal = sellerItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
            const commission = Math.round(grossTotal * 0.02 * 100) / 100;
            const netEarnings = Math.round((grossTotal - commission) * 100) / 100;
            const isExpanded = expandedOrderId === ord.id;
            const statusConfig = getStatusBadge(ord.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition"
              >
                {/* Order Header Summary Card */}
                <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-900 text-sm font-mono">{ord.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${statusConfig.bg}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{ord.date}</span>
                    </div>

                    {/* Customer overview */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {ord.deliveryAddress.fullName}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {ord.deliveryAddress.mobile}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ord.deliveryAddress.area}, {ord.deliveryAddress.city} ({ord.deliveryAddress.pincode})
                      </span>
                    </div>
                  </div>

                  {/* Financial Settlement & Quick Action */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-right">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Gross: ₹{grossTotal}</div>
                      <div className="text-sm font-black text-emerald-700">
                        Net Payout: ₹{netEarnings.toFixed(2)}
                      </div>
                      <div className="text-[9px] text-amber-700 font-semibold">
                        (2% Fee: ₹{commission.toFixed(2)})
                      </div>
                    </div>

                    {/* Advance Status Button */}
                    {ord.status !== 'delivered' && ord.status !== 'cancelled' && (
                      <button
                        onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                        className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                      >
                        {ord.status === 'placed' && 'Accept & Confirm'}
                        {ord.status === 'confirmed' && 'Start Packing'}
                        {ord.status === 'preparing' && 'Handover to Rider'}
                        {ord.status === 'out_for_delivery' && 'Mark Delivered'}
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition cursor-pointer"
                      title="View Details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Items + 2% Commission Breakdown */}
                {isExpanded && (
                  <div className="p-5 md:p-6 bg-slate-50/50 space-y-4 animate-in fade-in">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Ordered Items & Commission Calculation
                    </h4>

                    <div className="space-y-2">
                      {sellerItems.map((it, idx) => {
                        const itemGross = it.price * it.quantity;
                        const itemComm = Math.round(itemGross * 0.02 * 100) / 100;
                        const itemNet = Math.round((itemGross - itemComm) * 100) / 100;

                        return (
                          <div
                            key={idx}
                            className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={it.image}
                                alt={it.productName}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-100 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{it.productName}</p>
                                <p className="text-[11px] text-slate-500">
                                  {it.quantity} unit{it.quantity > 1 ? 's' : ''} × ₹{it.price}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-right sm:text-right">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase block">Gross</span>
                                <span className="font-bold text-slate-900">₹{itemGross.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-amber-700 uppercase block font-bold">2% Harwalkart</span>
                                <span className="font-bold text-amber-700">-₹{itemComm.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-emerald-700 uppercase block font-bold">Net Payout</span>
                                <span className="font-black text-emerald-700 text-sm">₹{itemNet.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Customer Full Delivery Address & Payment summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">
                          Delivery Address
                        </span>
                        <p className="font-bold text-slate-800">{ord.deliveryAddress.fullName}</p>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {ord.deliveryAddress.addressLine}, {ord.deliveryAddress.area}, {ord.deliveryAddress.city} -{' '}
                          <strong>{ord.deliveryAddress.pincode}</strong>
                        </p>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">
                          Payment Details
                        </span>
                        <p className="text-slate-700 text-[11px]">
                          Payment Method: <strong className="uppercase">{ord.paymentMethod}</strong>
                        </p>
                        <p className="text-slate-700 text-[11px]">
                          Payment Status:{' '}
                          <span className="text-emerald-700 font-bold uppercase">{ord.paymentStatus}</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Estimated Delivery: {ord.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
