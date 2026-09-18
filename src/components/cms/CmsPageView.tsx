import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { POLICIES_LEGAL_DOCS, LegalPolicyDoc } from '../../data/legalPoliciesData';
import {
  HeartHandshake,
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
  Building2,
  Headphones,
  ArrowLeft,
  Search,
  Printer,
  Copy,
  Check,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Receipt,
  Scale,
  Sparkles,
} from 'lucide-react';

type TabKey =
  | 'about-us'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'refund-policy'
  | 'shipping-policy'
  | 'gst-compliance'
  | 'help-desk';

const TABS: { id: TabKey; label: string; shortLabel: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'about-us', label: 'About Harwalkart', shortLabel: 'About Us', icon: HeartHandshake, badge: 'Our Story' },
  { id: 'privacy-policy', label: 'Privacy Policy', shortLabel: 'Privacy', icon: ShieldCheck, badge: 'DPDP 2023' },
  { id: 'terms-conditions', label: 'Terms & Conditions', shortLabel: 'Terms', icon: FileText, badge: 'Agreement' },
  { id: 'refund-policy', label: 'Refund & Return Policy', shortLabel: 'Refunds', icon: RotateCcw, badge: '7-Day Return' },
  { id: 'shipping-policy', label: 'Shipping & PIN Code Policy', shortLabel: 'Shipping', icon: Truck, badge: 'Logistics' },
  { id: 'gst-compliance', label: 'GST & Seller Compliance', shortLabel: 'GST & Legal', icon: Receipt, badge: 'TCS & Tax' },
  { id: 'help-desk', label: 'Help & Contact Desk', shortLabel: 'Help & Desk', icon: Headphones, badge: 'Support' },
];

export const CmsPageView: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedCmsPage,
    setSelectedCmsPage,
    websiteSettings,
    showToast,
    customerUser,
    addSupportTicket,
  } = useApp();

  // Normalize initial tab from selectedCmsPage or currentView
  const getInitialTab = (): TabKey => {
    const slug = selectedCmsPage || currentView;
    if (slug === 'about' || slug === 'about-us') return 'about-us';
    if (slug === 'privacy' || slug === 'privacy-policy') return 'privacy-policy';
    if (slug === 'terms' || slug === 'terms-conditions') return 'terms-conditions';
    if (slug === 'returns' || slug === 'refund-policy' || slug === 'refund') return 'refund-policy';
    if (slug === 'delivery' || slug === 'shipping' || slug === 'shipping-policy') return 'shipping-policy';
    if (slug === 'gst' || slug === 'gst-compliance') return 'gst-compliance';
    if (slug === 'support' || slug === 'help' || slug === 'help-desk') return 'help-desk';
    return 'about-us';
  };

  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Embedded Help Desk Ticket State
  const [ticketName, setTicketName] = useState(customerUser.name || '');
  const [ticketPhone, setTicketPhone] = useState(customerUser.phone || '');
  const [ticketEmail, setTicketEmail] = useState(customerUser.email || '');
  const [ticketCategory, setTicketCategory] = useState('General Policy Inquiry');
  const [ticketOrderId, setTicketOrderId] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketReference, setTicketReference] = useState('');

  // Sync with context prop changes
  useEffect(() => {
    if (selectedCmsPage) {
      if (['about-us', 'privacy-policy', 'terms-conditions', 'refund-policy', 'shipping-policy', 'gst-compliance', 'help-desk'].includes(selectedCmsPage)) {
        setActiveTab(selectedCmsPage as TabKey);
      }
    } else if (['about', 'privacy', 'terms', 'delivery', 'returns'].includes(currentView)) {
      setActiveTab(getInitialTab());
    }
  }, [selectedCmsPage, currentView]);

  const handleTabChange = (tabId: TabKey) => {
    setActiveTab(tabId);
    setSelectedCmsPage(tabId);
    setSearchQuery('');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${activeTab}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Direct link to this policy document copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName.trim() || !ticketPhone.trim() || !ticketMessage.trim()) {
      showToast('Please fill in your name, mobile number, and message.');
      return;
    }

    const refNumber = `HK-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    addSupportTicket({
      name: ticketName,
      phone: ticketPhone,
      email: ticketEmail || 'customer@harwalkart.in',
      category: ticketCategory,
      orderId: ticketOrderId.trim() || undefined,
      message: `[${ticketCategory}] ${ticketMessage.trim()}`,
    });

    setTicketReference(refNumber);
    setTicketSubmitted(true);
    setTicketMessage('');
    setTicketOrderId('');
    showToast(`Support ticket ${refNumber} logged. Our compliance team will respond within 24 hours.`);
  };

  const activeDoc: LegalPolicyDoc | undefined = POLICIES_LEGAL_DOCS[activeTab];

  const officialAddress =
    websiteSettings?.officialAddress ||
    'Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220';

  // Filter sections if search query is present
  const filteredSections = useMemo(() => {
    if (!activeDoc) return [];
    if (!searchQuery.trim()) return activeDoc.sections;

    const q = searchQuery.toLowerCase();
    return activeDoc.sections.filter(sec => {
      const headingMatch = sec.heading.toLowerCase().includes(q);
      const contentMatch = sec.content.some(c => c.toLowerCase().includes(q));
      const subMatch = sec.subsections?.some(
        sub => sub.title.toLowerCase().includes(q) || sub.points.some(p => p.toLowerCase().includes(q))
      );
      return headingMatch || contentMatch || subMatch;
    });
  }, [activeDoc, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-amber-700 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2 text-slate-500">
          <span>Harwalkart Central</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">Policies & Legal Center</span>
          <span>/</span>
          <span className="text-amber-700 font-bold capitalize">{activeTab.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Hero Banner with Official Authority Tone */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Regulatory & Compliance Center</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              HARWALKART Policies & Legal Documentation
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transparent, statutory consumer protections, Indian DPDP data compliance, GST framework, and merchant codes governing Bharat\'s premier local retail and authentic spice marketplace.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Legal Metrology & DPDP 2023 Compliant</span>
              </span>
              <span>•</span>
              <span>Proprietor: <strong>SharanKumar Harwalkar</strong></span>
              <span>•</span>
              <span>Head Office: <strong>Pune MIDC, Maharashtra</strong></span>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex md:flex-col gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Print official policy for legal records"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Policy</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
              title="Copy direct shareable link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 7-Tab Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Clause Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`Search within ${activeDoc?.title || 'policies'} (e.g. refund timeline, TCS, FSSAI, MRP, Kitchen Shakti, Pune)...`}
          className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-700 font-bold px-2 py-1 rounded bg-slate-100"
          >
            Clear
          </button>
        )}
      </div>

      {/* Document Content View */}
      {activeDoc && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
          {/* Document Header Metadata */}
          <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black uppercase tracking-wider">
                {activeDoc.badge}
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Updated: <strong>{activeDoc.lastUpdated}</strong></span>
                </span>
                <span>•</span>
                <span>Version {activeDoc.version}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {activeDoc.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {activeDoc.subtitle}
            </p>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>{activeDoc.governingLaw}</span>
            </div>
          </div>

          {/* Document Body Sections */}
          <div className="p-6 sm:p-10 space-y-8 leading-relaxed">
            {filteredSections.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">No matching clauses found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No sections in "{activeDoc.title}" matched "{searchQuery}". Try searching for broader terms or clearing your search.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              filteredSections.map(section => (
                <div key={section.id} className="space-y-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    <span>{section.heading}</span>
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Subsections if present */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {section.subsections.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5"
                        >
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>{sub.title}</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {sub.points.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold mt-0.5">•</span>
                                <span className="leading-snug">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Highlight box if present */}
                  {section.highlightBox && (
                    <div className="mt-4 p-5 bg-gradient-to-br from-amber-50 via-amber-50/50 to-white rounded-2xl border border-amber-200 space-y-3 shadow-xs">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-700" />
                        <h4 className="text-xs font-black uppercase text-amber-950 tracking-wider">
                          {section.highlightBox.title}
                        </h4>
                      </div>
                      <p className="text-xs text-amber-900 font-medium">
                        {section.highlightBox.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                        {section.highlightBox.details.map((item, dIdx) => (
                          <div key={dIdx} className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                            <span className="text-[11px] font-bold text-slate-500 block">{item.label}:</span>
                            <span className="font-bold text-slate-900 leading-snug">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Interactive Help & Ticket Submission Desk (when viewing Help Desk or accessible at bottom) */}
          {activeTab === 'help-desk' && (
            <div className="bg-slate-50 p-6 sm:p-10 border-t border-slate-200 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Submit Official Assistance Request</h3>
                  <p className="text-xs text-slate-500">
                    Directly connect with our compliance and customer care desk in Pune. 48-hour statutory response guaranteed.
                  </p>
                </div>
              </div>

              {ticketSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 text-emerald-950 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Inquiry Logged Successfully! Reference ID: {ticketReference}</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Thank you for contacting HARWALKART. Our compliance officer has received your request and will contact you via WhatsApp/phone at <strong>{ticketPhone}</strong> or email within 24–48 hours.
                  </p>
                  <button
                    onClick={() => setTicketSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-900 underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={ticketName}
                        onChange={e => setTicketName(e.target.value)}
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={ticketPhone}
                        onChange={e => setTicketPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase">Inquiry Category</label>
                      <select
                        value={ticketCategory}
                        onChange={e => setTicketCategory(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                      >
                        <option value="General Policy Inquiry">General Policy & Legal Inquiry</option>
                        <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                        <option value="Refund & Return Request">Refund & Return Request (7-Day Guarantee)</option>
                        <option value="Kitchen Shakti Purity Query">Kitchen Shakti Spice Quality / Purity</option>
                        <option value="Merchant 2% Commission / GST">Seller Onboarding & GST Compliance</option>
                        <option value="Statutory DPDP Grievance">Statutory DPDP / Grievance Escalation</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase">Order ID (If Applicable)</label>
                      <input
                        type="text"
                        value={ticketOrderId}
                        onChange={e => setTicketOrderId(e.target.value)}
                        placeholder="e.g. HK-ORD-98421"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Message & Details *</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketMessage}
                      onChange={e => setTicketMessage(e.target.value)}
                      placeholder="Please elaborate your query, feedback, or claim with specific details..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-slate-500">
                      Direct helpline: <a href="tel:9372207811" className="font-bold text-amber-700 hover:underline">+91 9372207811</a>
                    </p>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Document Footer Verification */}
          <div className="p-6 bg-slate-950 text-slate-400 text-xs border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold text-white">HARWALKART (SharanKumar Harwalkar)</p>
              <p className="text-slate-400 text-[11px]">
                Official Registered Head Office: {officialAddress}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:9372207811"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-[11px] font-bold transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Call 9372207811</span>
              </a>
              <a
                href="mailto:harwalkart@gmail.com"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
