import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  FileText, 
  Sparkles, 
  Video 
} from 'lucide-react';
import type { PriorityActionItem } from '../../../services/studentIntelligenceService';

interface TodaysPrioritiesProps {
  priorities: PriorityActionItem[];
  onNavigate: (route: string) => void;
}

export const TodaysPriorities: React.FC<TodaysPrioritiesProps> = ({
  priorities,
  onNavigate
}) => {
  const getCategoryIcon = (category: PriorityActionItem['category']) => {
    switch (category) {
      case 'INTERVIEW':
        return <Video className="w-4 h-4 text-sky-400" />;
      case 'DEADLINE':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'ASSESSMENT':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-gold" />;
      case 'SKILL':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'PROFILE':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold block">
            CAREER ACTION ITEMS
          </span>
          <h2 className="text-xl font-bold text-white font-display">
            TODAY'S PRIORITIES
          </h2>
        </div>
        <span className="text-xs font-mono text-rvu-subtle">
          {priorities.length} {priorities.length === 1 ? 'Action' : 'Actions'} Required
        </span>
      </div>

      {priorities.length === 0 ? (
        <div className="card-glass rounded-2xl p-6 border border-white/10 bg-navy-surface text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white font-display">
            You're all caught up.
          </h3>
          <p className="text-xs text-rvu-muted mt-1">
            No urgent application deadlines, pending assessments, or incomplete verification tasks today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priorities.map((item) => (
            <div
              key={item.id}
              className={`card-glass rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between bg-navy-surface ${
                item.urgency === 'URGENT'
                  ? 'border-rose-500/40 shadow-sm'
                  : item.urgency === 'HIGH'
                  ? 'border-amber-500/40'
                  : 'border-gold-border/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-subtle uppercase border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {item.dueDateText && (
                    <span className="text-[10px] font-mono text-amber-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.dueDateText}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white font-display mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-rvu-muted leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-rvu-subtle">
                  Action Required
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(item.actionRoute)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
                >
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
