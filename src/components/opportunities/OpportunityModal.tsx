import React, { useState } from 'react';
import type { Opportunity } from '../../data/opportunities';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Send
} from 'lucide-react';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  opportunity,
  onClose
}) => {
  const [applied, setApplied] = useState(false);

  if (!opportunity) return null;

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => {
      // simulated feedback
    }, 2000);
  };

  return (
    <Modal
      isOpen={!!opportunity}
      onClose={() => {
        setApplied(false);
        onClose();
      }}
      title={opportunity.title}
      subtitle={`${opportunity.company} • ${opportunity.school}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        
        {/* Top Highlight Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-navy-surface border border-gold/30">
          <div className="flex items-center gap-2">
            <Badge variant="gold">{opportunity.category}</Badge>
            <span className="text-xs px-2.5 py-1 rounded bg-white/5 text-rvu-text border border-white/10">
              {opportunity.workMode}
            </span>
            <span className="text-xs text-rvu-muted flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              {opportunity.location}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-xs text-rvu-subtle block uppercase font-mono">Profile Match</span>
              <span className="text-base font-extrabold text-gold font-mono">{opportunity.matchScore}%</span>
            </div>
            <div className="p-2 rounded-lg bg-gold-faint text-gold border border-gold/40">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Essential Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-navy-surface/60 border border-gold-border">
            <span className="text-[10px] text-rvu-muted block uppercase tracking-wider">Compensation</span>
            <span className="text-sm font-bold text-rvu-text font-mono mt-0.5 block">
              {opportunity.compensation}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-navy-surface/60 border border-gold-border">
            <span className="text-[10px] text-rvu-muted block uppercase tracking-wider">Application Deadline</span>
            <span className="text-sm font-bold text-gold font-mono mt-0.5 block">
              {opportunity.deadline}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-navy-surface/60 border border-gold-border">
            <span className="text-[10px] text-rvu-muted block uppercase tracking-wider">Open Positions</span>
            <span className="text-sm font-bold text-rvu-text font-mono mt-0.5 block">
              {opportunity.vacancies} Requisitions
            </span>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="p-4 rounded-xl bg-navy-surface/40 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-rvu-text">
            <GraduationCap className="w-4 h-4 text-gold" />
            <span>Eligibility & Academic Criteria</span>
          </div>
          <p className="text-xs text-rvu-muted leading-relaxed">
            {opportunity.eligibility}
          </p>
        </div>

        {/* Role Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-rvu-text uppercase tracking-wider text-gold">
            Overview & Context
          </h4>
          <p className="text-xs sm:text-sm text-rvu-muted leading-relaxed">
            {opportunity.description}
          </p>
        </div>

        {/* Key Responsibilities */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-rvu-text uppercase tracking-wider text-gold">
            Key Responsibilities
          </h4>
          <ul className="space-y-2">
            {opportunity.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-rvu-muted">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-rvu-text uppercase tracking-wider text-gold">
            Candidate Requirements
          </h4>
          <ul className="space-y-2">
            {opportunity.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-rvu-muted">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Selection Process Rounds */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-rvu-text uppercase tracking-wider text-gold">
            Evaluation Roadmap
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {opportunity.selectionRounds.map((round, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-navy-surface border border-gold-border text-xs text-rvu-text">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span>{round}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Action Footer */}
        <div className="pt-4 border-t border-gold-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-rvu-subtle text-center sm:text-left">
            Application routed via RVU Placement Cell with verified academic credentials.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Close
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={<Send className="w-4 h-4" />}
              onClick={handleApply}
              disabled={applied}
              className="w-full sm:w-auto min-w-[160px]"
            >
              {applied ? 'Application Submitted!' : 'Apply with RVU ID'}
            </Button>
          </div>
        </div>

        {applied && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Success! Your candidate dossier has been queued for placement cell review.</span>
          </div>
        )}

      </div>
    </Modal>
  );
};
