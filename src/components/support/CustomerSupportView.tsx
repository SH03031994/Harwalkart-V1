import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  MessageSquare,
  Send,
  HelpCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
} from 'lucide-react';

export const CustomerSupportView: React.FC = () => {
  const { customerUser, addSupportTicket, showToast, websiteSettings } = useApp();

  const [name, setName] = useState(customerUser.name || '');
  const [email, setEmail] = useState(customerUser.email || '');
  const [phone, setPhone] = useState(customerUser.phone || '');
  const [orderId, setOrderId] = useState('');
  const [category, setCategory] = useState('Order & Delivery');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    addSupportTicket({
      name,
      email: email || 'customer@harwalkart.in',
      phone,
      orderId: orderId || undefined,
      category,
      message,
    });

    setSubmitted(true);
    setMessage('');
    setOrderId('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto font-black shadow-md">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          HARWALKART Customer Support
        </h1>
        <p className="text-sm sm:text-base text-amber-300 max-w-xl mx-auto font-medium leading-relaxed">
          “Aapko kisi product, order, payment ya delivery se judi koi bhi madad chahiye? Humein message karein. Harwalkart team aapki madad ke liye yahan hai.”
        </p>
      </div>

      {/* Direct Contact & Head Office Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="tel:9372207811"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Direct Customer Helpline</span>
            <div className="text-lg font-black text-slate-900">9372207811</div>
            <p className="text-xs text-slate-500">Available: 9:00 AM - 9:00 PM (All Days)</p>
          </div>
        </a>

        <a
          href="mailto:harwalkart@gmail.com"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Official Support Email</span>
            <div className="text-lg font-black text-slate-900">harwalkart@gmail.com</div>
            <p className="text-xs text-slate-500">Fast email response within 2 hours</p>
          </div>
        </a>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold mt-0.5">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Official Head Office</span>
            <div className="text-xs font-black text-slate-900 mt-0.5">Harwalkart</div>
            <p className="text-xs text-slate-600 leading-snug mt-0.5 font-medium">
              {websiteSettings?.officialAddress || 'Harwalkart, Yah In, Chuk Karegaon, Pune MIDC, Maharashtra, India – 412220'}
            </p>
          </div>
        </div>
      </div>

      {/* Message Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-black text-slate-900">Send a Message to Support</h2>
          <p className="text-xs text-slate-500">We resolve all queries with priority</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-900">Message Received!</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              Dhanyawad! Harwalkart executive will review your query and contact you shortly on your registered phone/email.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Send Another Query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit phone number"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Order ID (Optional)</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="e.g. HK-ORD-89421"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Order & Delivery">Order & Delivery Inquiries</option>
                <option value="Kitchen Shakti Spices">Kitchen Shakti Spices Inquiry</option>
                <option value="Local Shop Product">Local Shop Product Issue</option>
                <option value="Payment / Refund">Payment & Refund Status</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Aapki samasya ya sawal yahan likhein..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
