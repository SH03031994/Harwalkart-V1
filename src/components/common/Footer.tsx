import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Award, Heart, Store, ShieldAlert, UserCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCmsPage, navigate, authSession } = useApp();

  const handleCmsClick = (pageSlug: string) => {
    setSelectedCmsPage(pageSlug);
    setCurrentView('cms-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-amber-500 pt-12 pb-8">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Superfast Local Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct from verified neighborhood shops in your PIN code area.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Kitchen Shakti 100% Pure</h4>
              <p className="text-xs text-slate-400 mt-0.5">Harwalkart own certified pure spices delivered across India.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">GST & Legal Compliant</h4>
              <p className="text-xs text-slate-400 mt-0.5">Transparent seller invoicing compliant with Indian GST rules.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Hassle-Free Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated customer resolution team at 9372207811.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand & About */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white inline-block p-2 rounded-xl">
            <Logo size="md" />
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            <span className="text-amber-400 font-semibold">HARWALKART</span> - <span className="italic text-white">“Har Din Ka Hissa.”</span>
            <br />
            India's premier local + online shopping marketplace. Discover trusted products from your neighborhood retailers and order authentic Harwalkart Kitchen Shakti essentials directly to your doorstep.
          </p>

          <div className="space-y-2 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Customer Helpline: <strong>+91 9372207811</strong> (9 AM - 9 PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Official Support: <strong>harwalkart@gmail.com</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>HQ: New Delhi, India • Operational across Tier 1 & 2 cities</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-b border-slate-800 pb-2">
            Marketplace
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => {
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Home Page
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('kitchen-shakti');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-amber-300 font-semibold hover:text-amber-400 transition-colors cursor-pointer"
              >
                Kitchen Shakti Direct Range
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('shops');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Explore Local Shops
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('video-shopping');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Discover in Video Ads
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                All Categories & Deals
              </button>
            </li>
          </ul>
        </div>

        {/* Dedicated User & Merchant Portals */}
        <div>
          <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-b border-slate-800 pb-2">
            Portals & Access
          </h5>
          <ul className="space-y-3 text-xs">
            {/* Customer Panel */}
            <li className="space-y-1">
              <span className="font-bold text-amber-400 text-[11px] block">Customer Portal:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/customer/login')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Login
                </button>
                <span className="text-slate-700">•</span>
                <button
                  onClick={() => navigate('/customer/register')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Register
                </button>
                <span className="text-slate-700">•</span>
                <button
                  onClick={() => navigate('/customer/dashboard')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  My Orders
                </button>
              </div>
            </li>

            {/* Seller Panel */}
            <li className="space-y-1 pt-1">
              <span className="font-bold text-amber-400 text-[11px] block">Seller Portal:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/seller/login')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Seller Login
                </button>
                <span className="text-slate-700">•</span>
                <button
                  onClick={() => navigate('/seller/register')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Register Shop (KYC)
                </button>
                <span className="text-slate-700">•</span>
                <button
                  onClick={() => navigate('/seller/dashboard')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                >
                  Seller Hub
                </button>
              </div>
            </li>

            {/* Admin Console Link ONLY if already authenticated as Admin */}
            {authSession.role === 'admin' && authSession.isAuthenticated && (
              <li className="space-y-1 pt-1">
                <span className="font-bold text-red-400 text-[11px] block">Admin Console:</span>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="hover:text-white transition-colors cursor-pointer text-red-400 font-semibold"
                >
                  Open Master Dashboard
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Policies & Compliance */}
        <div>
          <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider border-b border-slate-800 pb-2">
            Policies & Legal
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => handleCmsClick('about-us')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                About Harwalkart
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCmsClick('privacy-policy')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCmsClick('terms-conditions')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCmsClick('refund-policy')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Refund & Return Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCmsClick('shipping-policy')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Shipping & PIN Code Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCmsClick('gst-compliance')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                GST & Seller Compliance
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('support');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 text-amber-300 font-semibold transition-colors cursor-pointer"
              >
                Help & Contact Desk
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 mt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© {new Date().getFullYear()} HARWALKART India Technologies Pvt. Ltd. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Local Bharat Commerce
        </p>
      </div>
    </footer>
  );
};
