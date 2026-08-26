import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import { Flame, ShieldCheck, Truck, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const KitchenShaktiSection: React.FC = () => {
  const { harwalkartProducts, setCurrentView, setSelectedCategory } = useApp();

  return (
    <section className="bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-white border border-amber-200 rounded-3xl p-5 sm:p-8 my-10 shadow-sm relative overflow-hidden">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-amber-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider mb-2 shadow-xs">
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>HARWALKART DIRECT • KITCHEN SHAKTI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Pure Indian Spices & Food Range
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
            Directly sourced and processed at Harwalkart spice hubs. 100% stone-ground, Agmark Grade A, zero artificial colors, vacuum sealed with moisture barrier.
          </p>
        </div>

        {/* Pan-India Badge */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-amber-300 shadow-xs flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Truck className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase text-amber-900 tracking-wider">
              Pan-India Delivery
            </div>
            <div className="text-xs font-bold text-slate-800">
              Shipped to All 19,000+ PIN Codes
            </div>
          </div>
        </div>
      </div>

      {/* Trust Pills Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-7 text-xs font-bold text-slate-800">
        <div className="bg-white/80 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Pure & Unadulterated</span>
        </div>
        <div className="bg-white/80 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600 shrink-0" />
          <span>FSSAI & Agmark Certified</span>
        </div>
        <div className="bg-white/80 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Low-Temp Stone Ground</span>
        </div>
        <div className="bg-white/80 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
          <span>High Curcumin / Essential Oils</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {harwalkartProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
