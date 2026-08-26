import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, RotateCcw, FileText, ArrowLeft, HeartHandshake } from 'lucide-react';

export const CmsPageView: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in">
      <button
        onClick={() => setCurrentView('home')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-800 leading-relaxed">
        {currentView === 'about' && (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-950">About HARWALKART</h1>
                <p className="text-xs text-amber-700 font-bold">Har Din Ka Hissa • Every One Local Shop</p>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <p>
                <strong>HARWALKART</strong> is a next-generation Indian e-commerce marketplace built on the philosophy that local neighborhood retail is the beating heart of India's economy. We empower local kirana stores, regional specialty shops, and artisans by connecting them directly to neighborhood buyers through hyper-local discovery and geo-targeted video commerce.
              </p>
              <p>
                Alongside local shops, HARWALKART presents its signature in-house culinary range, <strong>Kitchen Shakti</strong> — bringing 100% stone-ground, Agmark-certified pure Indian spices, pulses, and kitchen essentials to households across India.
              </p>
              <h3 className="text-base font-black text-slate-900 pt-2">Our 3 Core Pillars</h3>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Local First:</strong> Connecting shoppers with trusted stores within their pin code for rapid same-day fulfillment.</li>
                <li><strong>Uncompromising Purity:</strong> Delivering authentic, pesticide-tested, cold-processed Kitchen Shakti spices nationwide.</li>
                <li><strong>Empowerment of Micro-Merchants:</strong> Giving transparent digital tools, video ad capabilities, and fair marketplace terms to local Indian entrepreneurs.</li>
              </ul>
            </div>
          </>
        )}

        {currentView === 'privacy' && (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-950">Privacy & Data Protection Policy</h1>
                <p className="text-xs text-slate-500">Compliant with Indian Digital Personal Data Protection (DPDP) Act</p>
              </div>
            </div>
            <div className="space-y-4 text-xs sm:text-sm">
              <p>HARWALKART values the trust you place in us. We ensure strict end-to-end data security for customer phone numbers, delivery coordinates, and transaction history.</p>
              <h4 className="font-bold text-slate-900">1. Information Collection & Usage</h4>
              <p>We collect location coordinates and PIN codes exclusively to determine local shop serviceability and route orders to the nearest delivery hub. Payment credentials are handled strictly through RBI-authorized payment gateways and never stored on HARWALKART servers.</p>
            </div>
          </>
        )}

        {currentView === 'terms' && (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-950">Terms & Conditions</h1>
                <p className="text-xs text-slate-500">Marketplace guidelines for buyers and sellers</p>
              </div>
            </div>
            <div className="space-y-4 text-xs sm:text-sm">
              <p>Welcome to HARWALKART. By accessing or using our marketplace platform, you agree to comply with Indian e-commerce consumer protection regulations.</p>
              <h4 className="font-bold text-slate-900">1. Marketplace Intermediary Role</h4>
              <p>HARWALKART operates as an intermediary marketplace connecting buyers with verified local merchants, as well as a direct seller for Kitchen Shakti products.</p>
            </div>
          </>
        )}

        {currentView === 'delivery' && (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-950">Delivery & Shipping Guidelines</h1>
                <p className="text-xs text-slate-500">Hyperlocal Same-Day & Pan-India Dispatch</p>
              </div>
            </div>
            <div className="space-y-4 text-xs sm:text-sm">
              <h4 className="font-bold text-slate-900">Hyperlocal Delivery (Local Shops)</h4>
              <p>Orders from local shops within your PIN code service radius are prepared and dispatched same day, usually within 2 to 4 hours.</p>
              <h4 className="font-bold text-slate-900">Pan-India Delivery (Kitchen Shakti)</h4>
              <p>Kitchen Shakti products are shipped from central warehousing across all 19,000+ PIN codes with tracking updates provided via SMS.</p>
            </div>
          </>
        )}

        {currentView === 'returns' && (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-950">Returns & Refund Policy</h1>
                <p className="text-xs text-slate-500">7-Day Customer-Centric Resolution</p>
              </div>
            </div>
            <div className="space-y-4 text-xs sm:text-sm">
              <p>If you receive a damaged, expired, or incorrect item, request an instant replacement or refund via the Customer Support section (Helpline: 9372207811) within 7 days of delivery.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
