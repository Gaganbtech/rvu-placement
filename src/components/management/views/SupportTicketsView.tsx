import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  Send,
  X
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { SupportTicket } from '../../../data/platform/types';

interface SupportTicketsViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const SupportTicketsView: React.FC<SupportTicketsViewProps> = ({
  store
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredTickets = store.tickets.filter(t => {
    if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSub = t.subject.toLowerCase().includes(q);
      const matchUser = (t.studentName && t.studentName.toLowerCase().includes(q)) || t.studentId.toLowerCase().includes(q);
      if (!matchSub && !matchUser) return false;
    }
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    store.replySupportTicket(activeTicket.id, replyText.trim(), 'Office of CAR (Placement Desk)');
    setReplyText('');

    // Update active ticket view
    const updated = store.tickets.find(t => t.id === activeTicket.id);
    if (updated) setActiveTicket(updated);
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">RESOLVED</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">IN REVIEW</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">OPEN</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              GRIEVANCE & SUPPORT HELPDESK
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {store.tickets.filter(t => t.status === 'OPEN').length} Open Queries
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Placement Cell Helpdesk Tickets
          </h1>
          <p className="text-xs text-rvu-muted">
            Resolve student queries regarding eligibility disputes, offer approvals, drive schedules, and document verifications.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-3.5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-rvu-subtle absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tickets by student name, USN, or issue description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open Tickets</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 hover:border-gold/60 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] text-gold font-bold">{ticket.id}</span>
                <span>&bull;</span>
                <span className="font-mono text-[10px] text-rvu-subtle">{ticket.category}</span>
                <span>&bull;</span>
                {getStatusBadge(ticket.status)}
              </div>

              <h3 className="font-bold text-white text-base">{ticket.subject}</h3>

              <div className="text-xs text-rvu-muted flex items-center gap-2">
                <span>From: <strong className="text-white">{ticket.studentName || 'Student'}</strong> ({ticket.studentId})</span>
                <span>&bull;</span>
                <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTicket(ticket)}
              className="px-3.5 py-2 rounded-lg bg-navy-card hover:bg-gold/20 text-rvu-muted hover:text-gold border border-gold-border/30 text-xs font-mono transition-colors shrink-0 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inspect & Reply</span>
            </button>
          </div>
        ))}
      </div>

      {/* Reply / Ticket Thread Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#111C26] border border-gold-border/60 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-gold uppercase">{activeTicket.id} &bull; {activeTicket.category}</span>
                <h3 className="text-base font-bold text-white font-display">
                  {activeTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 p-2">
              {/* Student Query */}
              <div className="p-3 rounded-xl text-xs space-y-1 bg-[#142330] border border-white/10 mr-8">
                <div className="flex items-center justify-between font-mono text-[10px] text-rvu-subtle">
                  <span className="font-bold text-gold">{activeTicket.studentName || 'Student'} ({activeTicket.studentId})</span>
                  <span>{activeTicket.createdAt}</span>
                </div>
                <p className="text-white text-xs leading-relaxed">{activeTicket.description}</p>
              </div>

              {/* Admin Response */}
              {activeTicket.adminResponse && (
                <div className="p-3 rounded-xl text-xs space-y-1 bg-gold/15 border border-gold/40 text-white ml-8">
                  <div className="flex items-center justify-between font-mono text-[10px] text-rvu-subtle">
                    <span className="font-bold text-gold">{activeTicket.assignedOfficer || 'CAR Placement Officer'} (Officer)</span>
                    <span>{activeTicket.respondedAt || 'Responded'}</span>
                  </div>
                  <p className="text-white text-xs leading-relaxed">{activeTicket.adminResponse}</p>
                </div>
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-white/10 space-y-2 shrink-0">
              <textarea
                rows={3}
                required
                placeholder="Type official placement office resolution..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-rvu-subtle">
                  Student will see this response in their Help & Support tab.
                </span>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
