import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  CheckCircle2
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterMessagesViewProps {
  store: PlatformStoreState;
  onNavigate?: (route: string) => void;
}

export const RecruiterMessagesView: React.FC<RecruiterMessagesViewProps> = ({
  store
}) => {
  const messages = store.recruiterMessages;
  const activeCompany = store.activeCompany;
  const candidates = store.recruiterCandidates;

  const [activeTab, setActiveTab] = useState<'ALL' | 'CAR' | 'CANDIDATE'>('ALL');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Compose form
  const [receiverType, setReceiverType] = useState<'CAR' | 'CANDIDATE'>('CAR');
  const [receiverId, setReceiverId] = useState('CAR-ADMIN');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const filtered = messages.filter(m => {
    if (activeTab === 'ALL') return true;
    return m.receiverType === activeTab || (activeTab === 'CAR' && m.senderRole?.includes('CAR'));
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    let receiverName = 'Dr. S. Ranganathan (Head, CAR)';
    if (receiverType === 'CANDIDATE') {
      const cand = candidates.find(c => c.id === receiverId);
      receiverName = cand?.name || 'RVU Candidate';
    }

    store.sendRecruiterMessage({
      receiverType,
      receiverId,
      receiverName,
      subject: subject.trim(),
      content: content.trim()
    });

    setIsComposeOpen(false);
    setSubject('');
    setContent('');
    setSentNotice(`Message transmitted successfully to ${receiverName}.`);
    setTimeout(() => setSentNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Institutional Communications Desk
          </h1>
          <p className="text-xs text-gray-400">
            Secure messaging channel between {activeCompany?.name || 'your company'}, the RVU CAR Office, and candidates
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors self-start sm:self-auto shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Compose Message</span>
        </button>
      </div>

      {sentNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{sentNotice}</span>
          </div>
          <button onClick={() => setSentNotice(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'ALL'
              ? 'bg-[#CCAA68] text-[#101A22] font-semibold'
              : 'bg-[#19252F] text-gray-300 hover:text-white border border-[#CCAA68]/20'
          }`}
        >
          All Messages ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('CAR')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'CAR'
              ? 'bg-[#CCAA68] text-[#101A22] font-semibold'
              : 'bg-[#19252F] text-gray-300 hover:text-white border border-[#CCAA68]/20'
          }`}
        >
          CAR Placement Cell
        </button>
        <button
          onClick={() => setActiveTab('CANDIDATE')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'CANDIDATE'
              ? 'bg-[#CCAA68] text-[#101A22] font-semibold'
              : 'bg-[#19252F] text-gray-300 hover:text-white border border-[#CCAA68]/20'
          }`}
        >
          Direct Candidate Messages
        </button>
      </div>

      {/* Message Feed */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <MessageSquare className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No communications found</div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Compose a message to Dr. S. Ranganathan (CAR Head) or directly message your shortlisted candidates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(msg => {
            const isFromCAR = msg.senderRole?.includes('CAR');

            return (
              <div
                key={msg.id}
                className={`p-5 rounded-xl border transition-all space-y-3 ${
                  isFromCAR
                    ? 'bg-gradient-to-r from-[#19252F] to-[#20303A] border-[#CCAA68]/40 shadow-lg'
                    : 'bg-[#19252F] border-[#CCAA68]/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    {isFromCAR ? (
                      <div className="w-8 h-8 rounded-lg bg-[#CCAA68]/20 border border-[#CCAA68]/40 text-[#D8B978] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#20303A] border border-white/10 text-gray-300 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{msg.senderName}</span>
                        {isFromCAR && (
                          <span className="text-[10px] bg-[#CCAA68]/20 text-[#D8B978] px-1.5 py-0.2 rounded font-mono">
                            OFFICE OF CAR
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        To: <span className="text-gray-300">{msg.receiverName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400 font-mono">
                    {msg.timestamp}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-white text-sm">{msg.subject}</div>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line text-xs bg-[#101A22]/50 p-3 rounded-lg border border-white/5">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compose Message Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101A22] border border-[#CCAA68]/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#CCAA68]/20 pb-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-[#CCAA68]" />
                <span>Compose Direct Communication</span>
              </h2>
              <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Recipient Target *</label>
                <select
                  value={receiverType}
                  onChange={e => setReceiverType(e.target.value as any)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                >
                  <option value="CAR">RVU Placement Office (CAR)</option>
                  <option value="CANDIDATE">Direct Candidate Message</option>
                </select>
              </div>

              {receiverType === 'CANDIDATE' && (
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Select Student *</label>
                  <select
                    value={receiverId}
                    onChange={e => setReceiverId(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  >
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id}) - {c.programme}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Subject Line *</label>
                <input
                  type="text"
                  placeholder="e.g. Inquiry regarding campus computer lab configuration"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Message Body *</label>
                <textarea
                  rows={4}
                  placeholder="Type your message..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#CCAA68]/15">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#20303A] text-white text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs hover:bg-[#D8B978]"
                >
                  Transmit Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
