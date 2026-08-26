import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Percent,
  RefreshCw,
  Truck,
  XCircle,
  Lock,
  Download,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export type PolicyType =
  | 'terms'
  | 'seller_terms'
  | 'privacy'
  | 'return_refund'
  | 'shipping'
  | 'cancellation'
  | 'commission_policy';

interface PolicyItem {
  id: PolicyType;
  title: string;
  shortDesc: string;
  badge: string;
  icon: React.ElementType;
  lastUpdated: string;
  sections: { heading: string; content: string[] }[];
}

const POLICIES: PolicyItem[] = [
  {
    id: 'commission_policy',
    title: 'HARWALKART 2% Commission Policy',
    shortDesc: 'Transparent, flat 2% marketplace commission structure with no hidden fees.',
    badge: 'Core Policy',
    icon: Percent,
    lastUpdated: 'August 24, 2026',
    sections: [
      {
        heading: '1. Flat 2% Commission Structure',
        content: [
          'HARWALKART operates on a merchant-first model with a flat 2.0% platform facilitation fee on gross item sales for all registered marketplace sellers.',
          'Example Calculation: If a customer purchases goods worth ₹1,000 from your shop, the HARWALKART 2% fee is ₹20. The remaining ₹980 (98%) is your Net Seller Settlement.',
          'There are ZERO listing fees, ZERO monthly subscription charges, and ZERO hidden onboarding costs.',
        ],
      },
      {
        heading: '2. Commission Deduction & Net Settlement',
        content: [
          'The 2% commission is automatically computed at the exact time of order placement by our automated settlement engine.',
          'Upon successful order delivery and OTP verification, the Net Settlement amount (Gross Price minus 2% HARWALKART Commission) is credited to your Seller Wallet.',
          'Sellers can request automated payouts to their registered UPI VPA or Verified Bank Account (NEFT/IMPS) on a weekly or on-demand basis.',
        ],
      },
      {
        heading: '3. GST & Tax Invoicing on Commission',
        content: [
          'HARWALKART issues a monthly GST Tax Invoice for the 2% facilitation fees charged, enabling sellers to claim Input Tax Credit (ITC) as per applicable GST laws.',
          'TCS (Tax Collected at Source) under Section 52 of the CGST Act is deducted and deposited with the Government as required by law.',
        ],
      },
      {
        heading: '4. Refund & Cancellation Adjustments',
        content: [
          'If an order is cancelled before dispatch or returned due to verified customer defects, any 2% commission charged for that order is fully reversed and credited back.',
          'No cancellation fee is charged to the seller for genuine stock-outs reported promptly through the Seller Panel.',
        ],
      },
    ],
  },
  {
    id: 'seller_terms',
    title: 'Seller Terms & Conditions',
    shortDesc: 'Merchant obligations, catalog standards, authentic products, and store operations.',
    badge: 'Seller Agreement',
    icon: ShieldCheck,
    lastUpdated: 'August 24, 2026',
    sections: [
      {
        heading: '1. Merchant Registration & KYC',
        content: [
          'All merchants must provide valid Government identity documents (Aadhaar, PAN, GSTIN, or FSSAI License where applicable) before listing products.',
          'Harwalkart reserves the right to verify physical store locations and trade licenses to maintain local consumer trust.',
        ],
      },
      {
        heading: '2. Product Pricing & Quality Standards',
        content: [
          'Selling price listed on Harwalkart must not exceed the Maximum Retail Price (MRP) printed on the product packaging.',
          'Sellers are strictly forbidden from selling expired, counterfeit, repackaged, or sub-standard goods. In case of food items, FSSAI compliance is mandatory.',
        ],
      },
      {
        heading: '3. Order Fulfillment & Dispatch Times',
        content: [
          'For hyperlocal orders (within serviceable radius), sellers must accept and pack orders within 15 minutes of receipt to enable 45-90 minute delivery.',
          'Goods must be packed in hygienic, tamper-evident packaging provided or approved by Harwalkart.',
        ],
      },
      {
        heading: '4. Exclusivity & Fair Practices',
        content: [
          'Sellers retain complete independence and can operate on other channels. However, pricing on Harwalkart should remain competitive to ensure best local customer value.',
        ],
      },
    ],
  },
  {
    id: 'terms',
    title: 'General Terms & Conditions',
    shortDesc: 'Overall marketplace terms governing platform use, accounts, and transactions.',
    badge: 'Platform Terms',
    icon: FileText,
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. Platform Overview',
        content: [
          'Harwalkart is an Indian omnichannel marketplace connecting local kirana stores, regional producers, and direct agricultural brand Kitchen Shakti with consumers across India.',
          'Use of the Seller Portal implies acceptance of these Terms and any future updates published herein.',
        ],
      },
      {
        heading: '2. Account Security & Credential Responsibility',
        content: [
          'Sellers are solely responsible for maintaining the confidentiality of their login credentials, OTPs, and bank settlement details.',
          'Any authorized staff activity through the Seller Panel is legally binding on the merchant business.',
        ],
      },
      {
        heading: '3. Intellectual Property & Brand Names',
        content: [
          'Merchants warrant that product images, trademarks, and descriptions uploaded do not infringe third-party intellectual property rights.',
          'Harwalkart and Kitchen Shakti logos are registered trademarks and may not be used without written authorization.',
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Data Protection Policy',
    shortDesc: 'How customer and merchant data is collected, protected, and processed.',
    badge: 'Data Security',
    icon: Lock,
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. Customer Data Privacy',
        content: [
          'Customer contact numbers and delivery addresses provided on orders must strictly be used ONLY for the fulfillment of the specific order.',
          'Sellers are strictly prohibited from using customer data for independent marketing, unsolicited SMS/WhatsApp messages, or sharing with third parties.',
        ],
      },
      {
        heading: '2. Merchant Financial Data',
        content: [
          'Bank account numbers, IFSC codes, and UPI VPAs provided for settlements are encrypted with bank-grade 256-bit encryption.',
          'Harwalkart never sells or rents merchant information to unauthorized third-party advertisers.',
        ],
      },
    ],
  },
  {
    id: 'return_refund',
    title: 'Return & Refund Policy',
    shortDesc: 'Guidelines on customer returns, replacements, and seller reimbursement.',
    badge: 'Returns',
    icon: RefreshCw,
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. Return Window for Groceries & Staples',
        content: [
          'Due to the perishable nature of food items, customers can request returns within 24-48 hours of delivery for items that are damaged, expired, or incorrect.',
          'Non-perishable packaged items and dry staples carry a 3-day replacement guarantee.',
        ],
      },
      {
        heading: '2. Seller Dispute & Evidence Submission',
        content: [
          'In case of customer dispute, sellers can provide CCTV/packing footage or dispatch photos via the Seller Support Portal.',
          'Harwalkart operates a Seller Protection Fund (SPF) to reimburse sellers for false customer claims or courier transit damage.',
        ],
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & Local Delivery Policy',
    shortDesc: 'Hyperlocal rider network, dispatch guidelines, and serviceable PIN codes.',
    badge: 'Logistics',
    icon: Truck,
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. Local Hub Pickup Protocol',
        content: [
          'Harwalkart delivery executives or authorized 3PL riders will arrive at the seller storefront for order pickup.',
          'Sellers must verify the Order ID on the rider app before handing over sealed packages.',
        ],
      },
      {
        heading: '2. Delivery Radii & Pin Codes',
        content: [
          'Sellers can configure their custom delivery radius (1 km to 25 km) or specific PIN codes in the Seller Settings tab.',
        ],
      },
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    shortDesc: 'Rules governing pre-dispatch order cancellations and zero-penalty guidelines.',
    badge: 'Cancellation',
    icon: XCircle,
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. Customer Cancellations',
        content: [
          'Customers may cancel an order free of charge before the seller begins packing the order.',
          'Once the order is marked "Out for Delivery", cancellations require support desk review.',
        ],
      },
      {
        heading: '2. Seller Cancellations',
        content: [
          'In rare cases of stock depletion, sellers may cancel an unconfirmed order immediately without penalty, provided inventory is updated in the portal.',
        ],
      },
    ],
  },
];

export const SellerLegalPolicies: React.FC = () => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<PolicyType>('commission_policy');
  const [searchQuery, setSearchQuery] = useState('');

  const currentPolicy = POLICIES.find(p => p.id === selectedPolicyId) || POLICIES[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              HARWALKART Compliance & Merchant Governance
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Legal Agreements & Platform Policies
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Transparent, fair, and merchant-friendly rules governing the Harwalkart marketplace. All policies include our clear <strong>2% Commission Policy</strong> and merchant protection guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Policy
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Navigation + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Select Document</span>
              <span className="text-[11px] text-slate-400">{POLICIES.length} Policies</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {POLICIES.map(policy => {
                const Icon = policy.icon;
                const isSelected = policy.id === selectedPolicyId;
                return (
                  <button
                    key={policy.id}
                    onClick={() => setSelectedPolicyId(policy.id)}
                    className={`w-full text-left p-3.5 rounded-2xl flex items-start gap-3 transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-700 shadow-2xs'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">{policy.title}</span>
                      </div>
                      <p className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {policy.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Support Callout */}
          <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-950 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              100% Merchant Transparency
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Have questions regarding our 2% commission terms or settlement cycle? Our Seller Helpdesk is available 24x7 at <strong>seller@harwalkart.in</strong>.
            </p>
          </div>
        </div>

        {/* Policy Document Viewer */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            {/* Document Header */}
            <div className="border-b border-slate-100 pb-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider">
                  {currentPolicy.badge}
                </span>
                <span className="text-xs text-slate-400">
                  Last Updated: <strong className="text-slate-600">{currentPolicy.lastUpdated}</strong>
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <currentPolicy.icon className="w-6 h-6 text-amber-600 shrink-0" />
                {currentPolicy.title}
              </h1>
              <p className="text-sm text-slate-600 font-medium">{currentPolicy.shortDesc}</p>
            </div>

            {/* Document Body Sections */}
            <div className="space-y-6">
              {currentPolicy.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {sec.heading}
                  </h3>
                  <div className="space-y-2 pl-4 border-l-2 border-slate-100 text-xs md:text-sm text-slate-600 leading-relaxed">
                    {sec.content.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Document Footer Agreement Box */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  This policy applies to all transactions processed on <strong>Harwalkart Marketplace</strong>.
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                Status: <span className="text-emerald-700">Active & Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
