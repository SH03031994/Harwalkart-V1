import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Award, ChevronRight } from 'lucide-react';

export const BrandShowcaseSection: React.FC = () => {
  const { brands, products, navigateToBrand } = useApp();

  const activeBrands = brands.filter(b => b.isActive);

  return (
    <section className="space-y-4 py-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
              Harwalkart Flagship Brands
            </span>
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
              Parent Marketplace Guaranteed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
            Explore Our 4 Independent Brands
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Discover specialized premium ranges curated under the Harwalkart parent marketplace—from pure kitchen spices to herbal wellness and home care.
          </p>
        </div>
      </div>

      {/* 4 Brands Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeBrands.map((brand) => {
          const brandProductsCount = products.filter(
            p => p.brandSlug === brand.slug || p.brandId === brand.id || p.brand.toLowerCase() === brand.name.toLowerCase()
          ).length;

          return (
            <div
              key={brand.id}
              onClick={() => navigateToBrand(brand.slug)}
              className="group bg-white rounded-3xl border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
            >
              {/* Top Accent Strip */}
              <div
                className="h-2 w-full transition-all group-hover:h-2.5"
                style={{ backgroundColor: brand.themeColor || '#F59E0B' }}
              />

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Logo & Category Container */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {/* Official Brand Logo Box */}
                    <div className="w-24 h-16 rounded-2xl bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center shadow-2xs group-hover:bg-white group-hover:border-amber-300 transition-all">
                      <img
                        src={brand.logoUrl}
                        alt={`${brand.name} Official Logo`}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        Verified
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 mt-1">
                        {brandProductsCount} Products
                      </span>
                    </div>
                  </div>

                  {/* Brand Title & Hindi Subtitle */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                    <span>{brand.name}</span>
                  </h3>

                  {brand.hindiName && (
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                      {brand.hindiName}
                    </p>
                  )}

                  {/* Category Pill */}
                  <div className="mt-2">
                    <span className="inline-block bg-slate-100 text-slate-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      {brand.category}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs text-slate-600 font-medium mt-2 line-clamp-2 leading-relaxed">
                    {brand.tagline}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Direct Harwalkart Guarantee</span>
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
