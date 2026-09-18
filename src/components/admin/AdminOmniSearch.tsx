import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Package,
  Store,
  Users,
  FileText,
  ChevronRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';

interface AdminOmniSearchProps {
  setActiveTab: (tab: any) => void;
}

export const AdminOmniSearch: React.FC<AdminOmniSearchProps> = ({ setActiveTab }) => {
  const { products, sellers, orders, registeredCustomers, setSelectedProductId, showToast } =
    useApp();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  const matchedProducts = cleanQuery
    ? products
        .filter(
          p =>
            p.name.toLowerCase().includes(cleanQuery) ||
            p.category.toLowerCase().includes(cleanQuery) ||
            p.sellerName.toLowerCase().includes(cleanQuery) ||
            (p.brand && p.brand.toLowerCase().includes(cleanQuery))
        )
        .slice(0, 4)
    : [];

  const matchedSellers = cleanQuery
    ? sellers
        .filter(
          s =>
            s.shopName.toLowerCase().includes(cleanQuery) ||
            (s.ownerName && s.ownerName.toLowerCase().includes(cleanQuery)) ||
            s.phone.includes(cleanQuery) ||
            s.address.city.toLowerCase().includes(cleanQuery) ||
            s.address.pincode.includes(cleanQuery)
        )
        .slice(0, 4)
    : [];

  const matchedOrders = cleanQuery
    ? orders
        .filter(
          o =>
            o.id.toLowerCase().includes(cleanQuery) ||
            o.deliveryAddress.fullName.toLowerCase().includes(cleanQuery) ||
            o.deliveryAddress.mobile.includes(cleanQuery) ||
            o.deliveryAddress.city.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 4)
    : [];

  const matchedCustomers = cleanQuery
    ? registeredCustomers
        .filter(
          c =>
            c.name.toLowerCase().includes(cleanQuery) ||
            c.phone.includes(cleanQuery) ||
            c.email.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 4)
    : [];

  const isAnalyticsQuery = ['analytic', 'analytics', 'report', 'chart', 'gmv', 'revenue', 'sale', 'sales', 'profit', 'stats'].some(k => cleanQuery.includes(k));

  const hasResults =
    matchedProducts.length > 0 ||
    matchedSellers.length > 0 ||
    matchedOrders.length > 0 ||
    matchedCustomers.length > 0 ||
    isAnalyticsQuery;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Omni-Search orders, products, sellers, users..."
          className="w-full pl-9 pr-8 py-2 bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-2xl text-xs font-bold text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px]"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && cleanQuery && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto p-2.5 space-y-3 animate-in fade-in text-xs">
          {!hasResults ? (
            <div className="p-4 text-center text-slate-500">
              No matching records found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {/* Analytics Shortcut */}
              {isAnalyticsQuery && (
                <div
                  onClick={() => {
                    setActiveTab('analytics');
                    setIsOpen(false);
                    showToast('Navigated to Marketplace Analytics & Intelligence');
                  }}
                  className="p-3 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 rounded-xl border border-amber-300 dark:border-amber-700/60 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="font-black text-slate-900 dark:text-white block">
                        Marketplace Analytics &amp; Revenue Reports
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        View real-time GMV, fulfillment velocity, and profit margins
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </div>
              )}

              {/* Products */}
              {matchedProducts.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 px-2 block mb-1">
                    Products ({matchedProducts.length})
                  </span>
                  <div className="space-y-1">
                    {matchedProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setActiveTab(p.isHarwalkartDirect ? 'company_products' : 'products');
                          setIsOpen(false);
                          showToast(`Selected product: ${p.name}`);
                        }}
                        className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                            {p.name}
                          </span>
                        </div>
                        <span className="font-black text-amber-600">₹{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sellers */}
              {matchedSellers.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 px-2 block mb-1">
                    Sellers ({matchedSellers.length})
                  </span>
                  <div className="space-y-1">
                    {matchedSellers.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveTab('sellers');
                          setIsOpen(false);
                          showToast(`Viewing seller: ${s.shopName}`);
                        }}
                        className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Store className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                            {s.shopName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{s.address.city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders */}
              {matchedOrders.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 px-2 block mb-1">
                    Orders ({matchedOrders.length})
                  </span>
                  <div className="space-y-1">
                    {matchedOrders.map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setActiveTab('orders');
                          setIsOpen(false);
                          showToast(`Navigated to order ${o.id}`);
                        }}
                        className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {o.id} - {o.deliveryAddress.fullName}
                          </span>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">₹{o.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {matchedCustomers.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 px-2 block mb-1">
                    Customers ({matchedCustomers.length})
                  </span>
                  <div className="space-y-1">
                    {matchedCustomers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveTab('customers');
                          setIsOpen(false);
                          showToast(`Navigated to customer ${c.name}`);
                        }}
                        className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {c.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{c.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
