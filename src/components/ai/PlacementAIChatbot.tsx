import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  BookOpen,
  RotateCcw,
  GraduationCap,
  Building2,
  Award,
  AlertCircle
} from 'lucide-react';
import {
  queryPlacementRAG,
  getSuggestedFollowupsForRole,
  type UserRoleContext,
  type RAGCitation,
  type RetrievalMetric
} from '../../services/placementRagEngine';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: RAGCitation[];
  metrics?: RetrievalMetric;
  isGuardrailTriggered?: boolean;
  timestamp: string;
}

interface PlacementAIChatbotProps {
  currentRole?: UserRoleContext;
  onNavigate?: (route: string) => void;
}

export const PlacementAIChatbot: React.FC<PlacementAIChatbotProps> = ({
  currentRole = 'student',
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRoleContext>(currentRole);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<RAGCitation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync role if prop updates
  useEffect(() => {
    if (currentRole) {
      setActiveRole(currentRole);
    }
  }, [currentRole]);

  // Initial greeting on first open or role change
  useEffect(() => {
    if (messages.length === 0) {
      const initial = queryPlacementRAG('hello', activeRole);
      setMessages([
        {
          id: 'msg-init',
          sender: 'assistant',
          text: initial.answer,
          citations: initial.citations,
          metrics: initial.metrics,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [activeRole]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate RAG query execution
    setTimeout(() => {
      const ragResult = queryPlacementRAG(text, activeRole);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: ragResult.answer,
        citations: ragResult.citations,
        metrics: ragResult.metrics,
        isGuardrailTriggered: ragResult.isGuardrailTriggered,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleClearChat = () => {
    const initial = queryPlacementRAG('hello', activeRole);
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        text: initial.answer,
        citations: initial.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleRoleChange = (newRole: UserRoleContext) => {
    setActiveRole(newRole);
    const initial = queryPlacementRAG('hello', newRole);
    setMessages([
      {
        id: `msg-role-${Date.now()}`,
        sender: 'assistant',
        text: `Switched RAG context to **${newRole.toUpperCase()}**. ${initial.answer}`,
        citations: initial.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const followups = getSuggestedFollowupsForRole(activeRole);

  const getRoleIcon = (role: UserRoleContext) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="w-3.5 h-3.5 text-gold" />;
      case 'recruiter':
        return <Building2 className="w-3.5 h-3.5 text-sky-400" />;
      case 'management':
        return <Award className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-gold" />;
    }
  };

  return (
    <aside aria-label="Placement AI Assistant" className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#19252F] to-[#101A22] text-white border border-[#CCAA68]/50 shadow-2xl hover:border-[#CCAA68] hover:scale-105 transition-all duration-300"
          title="Open RVU Placement AI Assistant (RAG)"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#CCAA68] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#101A22]" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold font-display text-white flex items-center gap-1.5">
              <span>Placement AI</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#CCAA68]/20 text-[#CCAA68] border border-[#CCAA68]/30">
                RAG
              </span>
            </div>
            <div className="text-[10px] text-gray-400">Policies & Career Readiness</div>
          </div>
        </button>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl bg-[#101A22] border border-[#CCAA68]/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#19252F] via-[#142330] to-[#101A22] border-b border-[#CCAA68]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#CCAA68]/20 border border-[#CCAA68]/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#CCAA68]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                  <span>RVU Placement AI</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Policy RAG
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Strict Domain Verification</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Filter & Quick Bar */}
          <div className="px-3 py-2 bg-[#0C141B] border-b border-white/5 flex items-center justify-between text-xs">
            <span className="text-[11px] text-gray-400 font-mono">Knowledge Lens:</span>
            <div className="flex items-center gap-1">
              {(['student', 'recruiter', 'management'] as UserRoleContext[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono flex items-center gap-1 transition-all ${
                    activeRole === r
                      ? 'bg-[#CCAA68]/20 text-[#CCAA68] border border-[#CCAA68]/50 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {getRoleIcon(r)}
                  <span className="capitalize">{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-[#CCAA68]/20 border border-[#CCAA68]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#CCAA68]" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1.5 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#CCAA68] text-[#101A22] font-medium rounded-tr-none'
                        : msg.isGuardrailTriggered
                        ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200 rounded-tl-none'
                        : 'bg-[#19252F] border border-white/10 text-gray-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    {msg.isGuardrailTriggered && (
                      <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-[11px] mb-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Policy Guardrail Intercepted</span>
                      </div>
                    )}

                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Source Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                        <div className="text-[10px] text-[#CCAA68] font-mono flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>Grounded Citations:</span>
                          </span>
                          {msg.metrics && msg.metrics.confidencePercent > 0 && (
                            <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              {msg.metrics.confidencePercent}% Match • {msg.metrics.queryLatencyMs}ms
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {msg.citations.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setSelectedCitation(c)}
                              className="text-[10px] text-gray-300 hover:text-white bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded border border-white/10 font-mono transition-colors text-left truncate max-w-full"
                              title={c.sourceDoc}
                            >
                              • {c.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono px-1">
                    <span>{msg.timestamp}</span>
                    {msg.metrics && msg.metrics.denseScore > 0 && (
                      <span>• Vector Cos: {msg.metrics.denseScore}</span>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-xs pl-8">
                <div className="w-2 h-2 rounded-full bg-[#CCAA68] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#CCAA68] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#CCAA68] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-gray-400 font-mono">Retrieving placement policies...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts & Prompt Chips Bar */}
          <div className="p-2 bg-[#0C141B] border-t border-white/5 space-y-1.5">
            {onNavigate && (
              <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto pb-0.5 no-scrollbar">
                <span className="text-gray-500 font-mono">Jump:</span>
                {activeRole === 'student' && (
                  <>
                    <button
                      onClick={() => onNavigate('/student/documents')}
                      className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/30 whitespace-nowrap"
                    >
                      📁 My Documents
                    </button>
                    <button
                      onClick={() => onNavigate('/student/opportunities')}
                      className="px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 hover:bg-sky-900/60 border border-sky-500/30 whitespace-nowrap"
                    >
                      💼 Opportunities
                    </button>
                  </>
                )}
                {activeRole === 'recruiter' && (
                  <>
                    <button
                      onClick={() => onNavigate('/recruiter/applications')}
                      className="px-2 py-0.5 rounded bg-gold/15 text-gold hover:bg-gold/25 border border-gold/30 whitespace-nowrap"
                    >
                      👥 Candidate Desk
                    </button>
                    <button
                      onClick={() => onNavigate('/recruiter/opportunities/create')}
                      className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-500/30 whitespace-nowrap"
                    >
                      ✍️ Post JD
                    </button>
                  </>
                )}
                {activeRole === 'management' && (
                  <>
                    <button
                      onClick={() => onNavigate('/management/students/import')}
                      className="px-2 py-0.5 rounded bg-gold/15 text-gold hover:bg-gold/25 border border-gold/30 whitespace-nowrap"
                    >
                      📥 SIS Import (.xlsx)
                    </button>
                    <button
                      onClick={() => onNavigate('/management/rag-docs')}
                      className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 border border-purple-500/30 whitespace-nowrap"
                    >
                      🔒 Pvt DOCs (RAG)
                    </button>
                    <button
                      onClick={() => onNavigate('/management/offers')}
                      className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/30 whitespace-nowrap"
                    >
                      🎖️ Verify Offers
                    </button>
                  </>
                )}
                {activeRole === 'public' && (
                  <button
                    onClick={() => onNavigate('/opportunities')}
                    className="px-2 py-0.5 rounded bg-gold/15 text-gold hover:bg-gold/25 border border-gold/30 whitespace-nowrap"
                  >
                    🚀 Explore Tiers
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {followups.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[10px] whitespace-nowrap bg-[#19252F] hover:bg-[#CCAA68]/20 text-gray-300 hover:text-[#CCAA68] px-2.5 py-1 rounded-full border border-white/10 hover:border-[#CCAA68]/40 transition-all font-mono shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Citation Info Drawer (if clicked) */}
          {selectedCitation && (
            <div className="p-2.5 bg-[#142330] border-t border-[#CCAA68]/30 flex items-center justify-between text-xs text-gray-200">
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{selectedCitation.title}</div>
                <div className="text-[10px] text-[#CCAA68] font-mono truncate">{selectedCitation.sourceDoc}</div>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-[#101A22] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask about ${activeRole} policies, tiers, or rules...`}
              className="flex-1 bg-[#19252F] text-white placeholder-gray-500 text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#CCAA68] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] disabled:opacity-40 disabled:hover:bg-[#CCAA68] text-[#101A22] transition-colors"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </aside>
  );
};
