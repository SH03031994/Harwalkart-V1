import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { shareModalData, closeShareModal, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalData) return null;

  const { title, url, text } = shareModalData;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Link copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsapp = () => {
    const message = encodeURIComponent(`${text}\n\n👉 View on HARWALKART:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Share on Social & WhatsApp</h3>
          </div>
          <button onClick={closeShareModal} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">Share with family, friends or customers</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={shareWhatsapp}
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">WhatsApp</span>
            </button>

            <button
              onClick={shareFacebook}
              className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                <span className="text-sm font-black">f</span>
              </div>
              <span className="text-xs font-bold">Facebook</span>
            </button>

            <button
              onClick={shareTelegram}
              className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">Telegram</span>
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Public Link (harwalkart.com)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 select-all"
              />
              <button
                onClick={handleCopy}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
