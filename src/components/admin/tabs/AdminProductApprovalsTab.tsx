import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Product } from '../../../types';
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  Store,
  Tag,
  AlertCircle,
  Package,
} from 'lucide-react';

export const AdminProductApprovalsTab: React.FC = () => {
  const { products, approveProduct, rejectProduct, toggleProductApproval, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const isPending = !p.approved;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && isPending) ||
      (statusFilter === 'approved' && p.approved);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = products.filter(p => !p.approved).length;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Product Moderation & Approval Queue</h3>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                {pendingCount} Awaiting Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and approve seller product listings before they go live on customer search & nearby feeds.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search moderation queue..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] cursor-pointer transition-colors ${
            statusFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Items ({products.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] cursor-pointer transition-colors ${
            statusFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] cursor-pointer transition-colors ${
            statusFilter === 'approved' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Live Approved ({products.filter(p => p.approved).length})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map(p => (
          <div
            key={p.id}
            className="p-4 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 text-xs transition-all"
          >
            <div className="flex items-start gap-3">
              <img
                src={p.images[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&auto=format&fit=crop&q=60'}
                alt=""
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                      p.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] flex items-center gap-2">
                  <span>Store: {p.sellerName}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-900">₹{p.price}</span>
                </div>
                <p className="text-slate-600 line-clamp-2 text-[11px]">{p.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
              <div className="text-[11px] text-slate-500">
                Stock: <strong className="text-slate-800">{p.stockQuantity}</strong> ({p.unit})
              </div>

              <div className="flex items-center gap-2">
                {p.approved ? (
                  <button
                    onClick={() => rejectProduct(p.id)}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Unpublish</span>
                  </button>
                ) : (
                  <button
                    onClick={() => approveProduct(p.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve for Live Store</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
