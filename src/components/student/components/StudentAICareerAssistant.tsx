import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ChevronRight
} from 'lucide-react';
import type { Student, Opportunity, Application, StudentDocument } from '../../../data/platform/types';
import { StudentIntelligenceService } from '../../../services/studentIntelligenceService';

interface StudentAICareerAssistantProps {
  student: Student;
  opportunities: Opportunity[];
  applications: Application[];
  documents: StudentDocument[];
  onNavigate: (route: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionLabel?: string;
  actionRoute?: string;
}

// Grounded factual assistant response generator (pure function outside component)
function buildGroundedResponse(
  query: string,
  student: Student,
  opportunities: Opportunity[],
  applications: Application[],
  documents: StudentDocument[],
  replyId: string
): ChatMessage {
  const q = query.toLowerCase();

  // 1. Profile review
  if (q.includes('profile')) {
    const projectsCount = student.projects?.length || 0;
    return {
      id: replyId,
      sender: 'assistant',
      text: `Based on your official profile record (ID: ${student.id}): Your CGPA is ${student.cgpa.toFixed(2)} with 0 active backlogs. You have ${projectsCount} documented project(s) and ${student.skills.length} skills recorded. Your placement status is ${student.eligibilityStatus}.`,
      timestamp: 'Just now',
      actionLabel: 'Edit Profile',
      actionRoute: '/student/profile'
    };
  }

  // 2. Skill gaps
  if (q.includes('skill gap') || q.includes('skill')) {
    const gaps = StudentIntelligenceService.analyzeSkillGaps(student, opportunities);
    const topGap = gaps[0];
    if (topGap) {
      return {
        id: replyId,
        sender: 'assistant',
        text: `Analysis against active campus opportunities indicates high recruiter demand for "${topGap.skillName}" (${topGap.targetDemandCount} active posting(s)). You can build this competency via the ${topGap.recommendedTrackTitle} track.`,
        timestamp: 'Just now',
        actionLabel: 'Open Skills Intelligence',
        actionRoute: '/student/skills'
      };
    }
    return {
      id: replyId,
      sender: 'assistant',
      text: `Your verified skills (${student.skills.map(s => s.name).slice(0, 3).join(', ')}) align well with your cohort. Review your Skills matrix for advanced benchmarks.`,
      timestamp: 'Just now',
      actionLabel: 'View Skills',
      actionRoute: '/student/skills'
    };
  }

  // 3. Interview prep
  if (q.includes('interview')) {
    const upcomingInterview = applications.find(a => a.stage === 'INTERVIEW');
    if (upcomingInterview) {
      return {
        id: replyId,
        sender: 'assistant',
        text: `You have an active interview scheduled with ${upcomingInterview.companyName} for the ${upcomingInterview.role} position (${upcomingInterview.interviewDetails?.roundTitle || 'Technical Round'}). I recommend reviewing the STAR method guidelines and project architecture.`,
        timestamp: 'Just now',
        actionLabel: 'Open Interview Prep',
        actionRoute: '/student/preparation'
      };
    }
    return {
      id: replyId,
      sender: 'assistant',
      text: 'To prepare for upcoming placement rounds, practice the STAR framework (Situation, Task, Action, Result) for behavioral questions and review Data Structures & System Design modules.',
      timestamp: 'Just now',
      actionLabel: 'Interview Guidelines',
      actionRoute: '/student/preparation'
    };
  }

  // 4. Resume
  if (q.includes('resume')) {
    const activeResume = documents.find(d => d.type === 'RESUME' && d.isActiveForApplications);
    if (activeResume) {
      return {
        id: replyId,
        sender: 'assistant',
        text: `Your active resume is "${activeResume.fileName}" (${activeResume.fileSize}). Status: ${activeResume.status}. Ensure all engineering achievements use the X-Y-Z bullet formula: Accomplished [X], measured by [Y], by doing [Z].`,
        timestamp: 'Just now',
        actionLabel: 'Manage Documents',
        actionRoute: '/student/documents'
      };
    }
    return {
      id: replyId,
      sender: 'assistant',
      text: 'You do not have an active resume designated for applications. Please upload your primary PDF resume in the Document Vault.',
      timestamp: 'Just now',
      actionLabel: 'Upload Resume',
      actionRoute: '/student/documents'
    };
  }

  // 5. Applications
  if (q.includes('application') || q.includes('status')) {
    const count = applications.length;
    const stages = applications.map(a => `${a.companyName}: ${a.stage}`).join('; ');
    return {
      id: replyId,
      sender: 'assistant',
      text: `You have ${count} active application(s) recorded in the shared pipeline. Statuses: ${stages}. Check the Application Tracker for round-specific updates.`,
      timestamp: 'Just now',
      actionLabel: 'View Applications',
      actionRoute: '/student/applications'
    };
  }

  // 6. Preparation plan
  if (q.includes('preparation') || q.includes('plan')) {
    return {
      id: replyId,
      sender: 'assistant',
      text: 'The RVU Career Preparation roadmap covers 8 key tracks: Aptitude, Technical DSA, Coding, Communication, Interview, Resume, Group Discussion, and Domain Deep-Dives. Continue your pending tasks to strengthen readiness.',
      timestamp: 'Just now',
      actionLabel: 'Go to Preparation',
      actionRoute: '/student/preparation'
    };
  }

  // Default factual fallback
  return {
    id: replyId,
    sender: 'assistant',
    text: `I am grounded only in your verified RVU placement records and cannot speculate. For custom eligibility queries or scheduling conflicts, please raise a ticket directly with the CAR Placement Office.`,
    timestamp: 'Just now',
    actionLabel: 'Contact CAR Office',
    actionRoute: '/student/support'
  };
}

export const StudentAICareerAssistant: React.FC<StudentAICareerAssistantProps> = ({
  student,
  opportunities,
  applications,
  documents,
  onNavigate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${student.name.split(' ')[0]}! I am your RVU Career AI Assistant. I can analyze your eligibility for upcoming drives, suggest skill gap remediation tracks, or review your placement preparation. How can I assist you today?`,
      timestamp: 'Active'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageCounter = React.useRef(0);

  const promptChips = [
    'How ready am I for campus drives?',
    'What skills should I build next?',
    'How do I prepare for upcoming interviews?',
    'Review my active placement resume',
    'What is the status of my applications?',
    'What is the RVU placement policy?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    messageCounter.current += 1;
    const count = messageCounter.current;
    const userMessageId = `user-msg-${count}`;
    const assistantMessageId = `asst-msg-${count}`;

    const userMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = buildGroundedResponse(
        text,
        student,
        opportunities,
        applications,
        documents,
        assistantMessageId
      );
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="card-glass rounded-2xl border border-gold-border/40 bg-navy-surface p-6 shadow-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold-faint border border-gold/40 flex items-center justify-center text-gold shadow-gold-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
              <span>RVU CAREER AI</span>
              <Sparkles className="w-3.5 h-3.5 text-gold" />
            </h3>
            <p className="text-[11px] text-rvu-muted">
              Grounded in your student profile & university placement records
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gold border border-gold/20 hidden sm:inline">
          Deterministic Mode
        </span>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase text-rvu-subtle block">Suggested inquiries:</span>
        <div className="flex flex-wrap gap-1.5">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-xs px-2.5 py-1 rounded-lg bg-navy-dark border border-white/10 text-rvu-muted hover:text-gold hover:border-gold/40 transition-all font-mono text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                isAssistant ? 'bg-gold/15 text-gold border border-gold/30' : 'bg-white/10 text-white'
              }`}>
                {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-2 ${
                isAssistant
                  ? 'bg-[#121E2A] border border-white/10 text-rvu-text rounded-tl-sm'
                  : 'bg-gold/15 border border-gold/30 text-white rounded-tr-sm font-medium'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.actionLabel && msg.actionRoute && (
                  <button
                    onClick={() => onNavigate(msg.actionRoute!)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-gold hover:underline pt-1"
                  >
                    <span>{msg.actionLabel}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-rvu-subtle pl-10">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" />
            <span>Analyzing records...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-white/5"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask RVU Career AI about your profile, eligibility, or skills..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-navy-dark border border-white/10 text-xs text-white placeholder:text-rvu-subtle focus:outline-none focus:border-gold transition-colors"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-4 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-highlight transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
