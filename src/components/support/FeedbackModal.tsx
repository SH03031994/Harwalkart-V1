import React, { useState } from 'react';
import {
  X,
  Bug,
  Lightbulb,
  MessageSquarePlus,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type FeedbackType = 'bug' | 'suggestion' | 'experience';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { customerUser, addSupportTicket, showToast } = useApp();

  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
  const [name, setName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pageUrl, setPageUrl] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : ''));
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !title.trim()) {
      showToast('Please provide a title and detailed description.');
      return;
    }

    const typeLabel =
      feedbackType === 'bug'
        ? 'Bug Report'
        : feedbackType === 'suggestion'
        ? 'Feature Suggestion'
        : 'General Experience Feedback';

    const fullMessage = [
      `[${typeLabel.toUpperCase()}] ${title.trim()}`,
      `Severity: ${severity.toUpperCase()}`,
      pageUrl ? `Affected View / URL: ${pageUrl}` : null,
      `Details:`,
      description.trim(),
    ]
      .filter(Boolean)
      .join('\n\n');

    addSupportTicket({
      name: name.trim() || customerUser?.name || 'Customer',
      email: email.trim() || customerUser?.email || 'customer@harwalkart.in',
      phone: phone.trim() || customerUser?.phone || '9372207811',
      category: `Feedback: ${typeLabel}`,
      message: fullMessage,
    });

    const generatedTkt = `FB-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketNumber(generatedTkt);
    setSubmitted(true);
    showToast(
      feedbackType === 'bug'
        ? 'Bug report submitted to Harwalkart engineering team! 🛠️'
        : 'Thank you! Your feedback has been recorded. 🌟'
    );
  };

  const handleReset = () => {
    setSubmitted(false);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div
      id="feedback-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="feedback-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Provide Feedback</h3>
              <p className="text-xs text-amber-300/90 font-medium">
                Submit bug reports, feature suggestions, or user experience ideas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900 dark:text-white">Feedback Received!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                  Dhanyawad! Your submission has been routed directly to our developer and product team with reference #{ticketNumber}.
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 font-medium max-w-sm mx-auto">
                We value your input in making Harwalkart seamless, fast, and delightful for every Indian shopper and merchant.
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  What kind of feedback do you have?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('bug')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                      feedbackType === 'bug'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Bug className="w-5 h-5 text-rose-500" />
                    <span>Bug Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('suggestion')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                      feedbackType === 'suggestion'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <span>Suggestion</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('experience')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                      feedbackType === 'experience'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <span>Experience</span>
                  </button>
                </div>
              </div>

              {/* Bug Severity (if bug) */}
              {feedbackType === 'bug' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Severity Level
                  </label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high', 'critical'] as const).map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverity(lvl)}
                        className={`flex-1 py-1.5 text-[11px] font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                          severity === lvl
                            ? lvl === 'critical'
                              ? 'bg-rose-600 text-white border-rose-600'
                              : lvl === 'high'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : lvl === 'medium'
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-slate-800 text-white border-slate-800'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title / Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {feedbackType === 'bug' ? 'Bug Summary *' : 'Subject / Idea Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={
                    feedbackType === 'bug'
                      ? 'e.g. Checkout button unresponsive on mobile'
                      : 'e.g. Add instant re-order shortcut for spices'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={
                    feedbackType === 'bug'
                      ? 'Steps to reproduce: 1. Added item to cart, 2. Clicked checkout, 3. Received white screen...'
                      : 'Explain what would make your experience on Harwalkart better and how you envision it working...'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* URL or Page context */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Page / Feature Affected (Optional)
                </label>
                <input
                  type="text"
                  value={pageUrl}
                  onChange={e => setPageUrl(e.target.value)}
                  placeholder="e.g. Cart page, Product details, Wishlist"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Contact Information (Pre-filled if logged in) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Phone / Email (For follow-up)
                  </label>
                  <input
                    type="text"
                    value={phone || email}
                    onChange={e => {
                      const val = e.target.value;
                      if (val.includes('@')) {
                        setEmail(val);
                      } else {
                        setPhone(val);
                      }
                    }}
                    placeholder="Contact info"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
