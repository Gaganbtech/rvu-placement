import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { queryPlacementRAG, type RAGCitation } from '../../services/placementRagEngine';

export interface AIMessageExtended {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: RAGCitation[];
  isGuardrailTriggered?: boolean;
}

export const AICareerAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AIMessageExtended[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: 'Hello! I am the **RV University Placement & Career AI Assistant** powered by domain-specific RAG.\n\nAsk me about **RVU salary tiers**, **Dream vs Marquee upgrade rules**, **academic eligibility**, or **technical interview roadmaps**.',
      citations: [
        {
          id: 'tier-stratification-01',
          title: 'RVU Salary Tier Classification',
          sourceDoc: 'RVU CAR Policy Handbook 2026–27 §2.1',
          relevanceScore: 1.0,
          retrievalMethod: 'hybrid_rrf'
        }
      ],
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSelectPrompt = (promptText: string) => {
    const userMsg: AIMessageExtended = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const rag = queryPlacementRAG(promptText, 'public');
      const assistantMsg: AIMessageExtended = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: rag.answer,
        citations: rag.citations,
        isGuardrailTriggered: rag.isGuardrailTriggered,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue;
    setInputValue('');

    const userMsg: AIMessageExtended = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const rag = queryPlacementRAG(query, 'public');
      const assistantMsg: AIMessageExtended = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: rag.answer,
        citations: rag.citations,
        isGuardrailTriggered: rag.isGuardrailTriggered,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <section id="ai-assistant" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      
      {/* Background Technology Pattern */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[350px] bg-gold-faint rounded-full blur-[140px] pointer-events-none opacity-25" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold">
              NEXT-GEN GUIDANCE // UI PREVIEW
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            MEET YOUR CAREER ASSISTANT
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Personalized guidance for every step of your career journey — from profile-opportunity matching to interview simulation.
          </p>
        </div>

        {/* AI Concierge Chat Container */}
        <div className="max-w-4xl mx-auto card-glass rounded-2xl overflow-hidden border border-gold/40 shadow-card-elevated">
          
          {/* Chat Window Top Bar */}
          <div className="p-4 bg-navy-surface border-b border-gold-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-faint border border-gold/40 text-gold flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rvu-text flex items-center gap-2">
                  <span>RVU Career Concierge</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    Live Demo
                  </span>
                </h3>
                <p className="text-[11px] text-rvu-muted">
                  Calibrated on verified RVU placement curricula & employer expectations
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-rvu-subtle hidden sm:inline">
              PROTOTYPE PREVIEW
            </span>
          </div>

          {/* Chat Conversation History Area */}
          <div className="p-4 sm:p-6 space-y-4 max-h-[420px] overflow-y-auto bg-navy/60">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser 
                      ? 'bg-gold text-navy-dark font-bold' 
                      : 'bg-navy-surface border border-gold/40 text-gold'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm ${
                    isUser
                      ? 'bg-gold-faint border border-gold text-rvu-text ml-8'
                      : msg.isGuardrailTriggered
                      ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200 mr-8 space-y-2'
                      : 'bg-navy-card border border-gold-border text-rvu-text mr-8 space-y-3'
                  }`}>
                    {msg.isGuardrailTriggered && (
                      <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs mb-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Institutional Policy Guardrail</span>
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                    {/* Verified Policy Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="space-y-1.5 pt-2.5 border-t border-gold-border/30">
                        <div className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Grounded Policy Source:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((c) => (
                            <span
                              key={c.id}
                              className="text-[10px] text-gray-300 bg-navy-surface px-2.5 py-1 rounded-md border border-gold/30 font-mono"
                            >
                              {c.title} • <span className="text-gold">{c.sourceDoc}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-rvu-subtle text-right mt-1 font-mono">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy-surface border border-gold/40 text-gold flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-navy-card border border-gold-border text-xs text-rvu-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] font-mono">Retrieving placement knowledge...</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Preset Prompt Chips */}
          <div className="p-3 sm:px-6 bg-navy-surface/80 border-t border-gold-border/40 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-rvu-muted uppercase tracking-wider shrink-0 font-mono">
              Suggested RAG Queries:
            </span>
            {[
              'What are the RVU salary tiers?',
              'How does the Dream vs Marquee upgrade rule work?',
              'What is the minimum CGPA and backlog policy?',
              'What are the CAR ATS resume specifications?'
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPrompt(prompt)}
                className="px-2.5 py-1 rounded-full text-xs bg-navy-card text-rvu-text border border-gold-border hover:border-gold hover:bg-gold-faint transition-all shrink-0 whitespace-nowrap font-mono"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleCustomSubmit} className="p-3 sm:p-4 bg-navy-surface border-t border-gold-border flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about opportunities, resume benchmarks, or interview rounds..."
              className="flex-1 bg-navy-dark border border-gold/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-rvu-text placeholder-rvu-subtle focus:border-gold focus:outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Send className="w-3.5 h-3.5" />}
              className="shrink-0"
            >
              Send
            </Button>
          </form>

        </div>

        {/* Prototype Transparency Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-rvu-subtle max-w-xl mx-auto">
            * Interactive UI Demonstration: This preview illustrates conversational career matching workflows. Production integration connects to RVU's academic student database and placement management service.
          </p>
        </div>

      </div>
    </section>
  );
};
