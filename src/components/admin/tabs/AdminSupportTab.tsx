import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SupportTicket } from '../../../types';
import {
  MessageSquare,
  Search,
  Send,
  CheckCircle2,
  Clock,
  Trash2,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from 'lucide-react';

export const AdminSupportTab: React.FC = () => {
  const { supportTickets, replyToSupportTicket, updateSupportTicketStatus, deleteSupportTicket, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'answered' | 'resolved' | 'closed'>('all');
  const [replies, setReplies] = useState<{ [id: string]: string }>({});

  const filteredTickets = supportTickets.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone.includes(searchTerm) ||
      (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReply = (ticketId: string) => {
    const replyText = replies[ticketId]?.trim();
    if (!replyText) {
      showToast('Please type a reply message before sending');
      return;
    }
    replyToSupportTicket(ticketId, replyText);
    setReplies({ ...replies, [ticketId]: '' });
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Customer & Merchant Support Helpdesk</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {supportTickets.length} Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Resolve customer queries, delivery inquiries, payment issues, and merchant onboarding assistance.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by name, phone, message..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'open', 'answered', 'resolved', 'closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === tab
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab} ({supportTickets.filter(t => tab === 'all' || t.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map(tkt => (
          <div
            key={tkt.id}
            className="p-5 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 text-xs transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-black">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-950 text-sm">{tkt.name}</h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        tkt.status === 'open'
                          ? 'bg-amber-100 text-amber-900'
                          : tkt.status === 'answered'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    +91 {tkt.phone} {tkt.email && `• ${tkt.email}`} • Created: {tkt.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <select
                  value={tkt.status}
                  onChange={e => updateSupportTicketStatus(tkt.id, e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs cursor-pointer shadow-xs focus:ring-2 focus:ring-amber-400"
                >
                  <option value="open">Open</option>
                  <option value="answered">Answered</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  onClick={() => {
                    if (confirm(`Delete ticket #${tkt.id}?`)) {
                      deleteSupportTicket(tkt.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Delete Ticket"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Customer Inquiry:</span>
              <p className="text-slate-800 font-medium leading-relaxed">"{tkt.message}"</p>
            </div>

            {/* Response Section */}
            {tkt.response ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <div className="flex items-center gap-1 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin Official Response (Sent):</span>
                </div>
                <p className="leading-relaxed font-medium">{tkt.response}</p>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <span className="text-slate-500 text-[11px] font-bold block">Send Resolution Reply to User:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type official support reply..."
                    value={replies[tkt.id] || ''}
                    onChange={e => setReplies({ ...replies, [tkt.id]: e.target.value })}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSendReply(tkt.id);
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendReply(tkt.id)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
