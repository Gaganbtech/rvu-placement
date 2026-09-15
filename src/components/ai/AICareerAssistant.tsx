import React, { useState } from 'react';
import { 
  AI_INITIAL_CONVERSATION, 
  AI_PROMPT_SUGGESTIONS, 
  type AIMessage 
} from '../../data/aiAssistantMock';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';

export const AICareerAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>(AI_INITIAL_CONVERSATION);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSelectPrompt = (promptText: string, responseText: string, matches?: any) => {
    // Append user message
    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulated realistic response timing
    setTimeout(() => {
      const assistantMsg: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: responseText,
        timestamp: 'Just now',
        matches: matches
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue;
    setInputValue('');

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `Thank you for your inquiry regarding "${query}". Based on current RV University campus hiring parameters, the Placement Cell provides curated resources and mock evaluation slots. Please check the Career Resources hub or schedule an appointment with your faculty placement advisor.`,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
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
                      : 'bg-navy-card border border-gold-border text-rvu-text mr-8 space-y-3'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                    {/* Matched Opportunity Cards Preview */}
                    {msg.matches && (
                      <div className="space-y-2 pt-2 border-t border-gold-border/40">
                        <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-wider block">
                          Identified Profile Matches:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {msg.matches.map((match, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-navy-surface border border-gold/20 hover:border-gold/50 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-gold font-mono">
                                  {match.matchScore}% Match
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-rvu-text line-clamp-1 mb-0.5">
                                {match.title}
                              </h4>
                              <p className="text-[10px] text-rvu-muted truncate">
                                {match.company}
                              </p>
                            </div>
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
                  <span className="ml-1 text-[11px] font-mono">Evaluating criteria...</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Preset Prompt Chips */}
          <div className="p-3 sm:px-6 bg-navy-surface/80 border-t border-gold-border/40 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-rvu-muted uppercase tracking-wider shrink-0">
              Suggested:
            </span>
            {AI_PROMPT_SUGGESTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectPrompt(item.prompt, item.response, item.matches)}
                className="px-2.5 py-1 rounded-full text-xs bg-navy-card text-rvu-text border border-gold-border hover:border-gold hover:bg-gold-faint transition-all shrink-0 whitespace-nowrap"
              >
                {item.label}
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
