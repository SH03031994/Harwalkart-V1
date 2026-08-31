import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, RotateCcw, FileText, ArrowLeft, HeartHandshake, Building2, MapPin, Mail, Phone } from 'lucide-react';

export const CmsPageView: React.FC = () => {
  const { currentView, setCurrentView, websiteSettings } = useApp();

  const officialAddress = websiteSettings?.officialAddress || 'Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220';

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

              {/* Official Company & Head Office Box */}
              <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Official Company & Head Office Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-slate-900 block">Registered Entity & Owner:</span>
                      <p>HARWALKART (SharanKumar Harwalkar)</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">In-House Spice Brand:</span>
                      <p>Kitchen Shakti (100% Pure Agmark Spices)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-slate-900 block">Official Head Office:</span>
                      <p className="font-medium text-slate-900 leading-snug">
                        {officialAddress}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Helpline & Support:</span>
                      <p>+91 9372207811 • harwalkart@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
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
              <h4 className="font-bold text-slate-900">2. Grievance Officer & Official Communications</h4>
              <p>For data privacy queries or official notices, contact our Grievance Officer at <strong>harwalkart@gmail.com</strong> or write to our Head Office: <strong>{officialAddress}</strong>.</p>
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
              <h4 className="font-bold text-slate-900">2. Official Company Address & Jurisdiction</h4>
              <p>This platform is operated by HARWALKART (SharanKumar Harwalkar), with official Head Office located at <strong>{officialAddress}</strong>. All contractual transactions are governed by the laws of India under applicable Maharashtra jurisdiction.</p>
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
