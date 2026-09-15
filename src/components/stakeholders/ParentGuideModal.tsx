import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, Users, TrendingUp, Award, HelpCircle } from 'lucide-react';

interface ParentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentGuideModal: React.FC<ParentGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Parent Career Ecosystem Guide"
      subtitle="Comprehensive transparency on how RV University safeguards, mentors, and elevates every student's professional path."
      maxWidth="xl"
    >
      <div className="space-y-6 text-rvu-text">
        
        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-surface border border-gold-border space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gold">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>Transparent Placement Audits</span>
            </div>
            <p className="text-xs text-rvu-muted leading-relaxed">
              Every job offer, internship stipend, and recruiting partner is rigorously documented and verified under statutory higher education guidelines.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-surface border border-gold-border space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gold">
              <Users className="w-4 h-4 text-gold shrink-0" />
              <span>1:1 Faculty & Industry Mentorship</span>
            </div>
            <p className="text-xs text-rvu-muted leading-relaxed">
              Students receive dedicated career counselling and holistic emotional readiness coaching before and during campus recruitment cycles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-surface border border-gold-border space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gold">
              <TrendingUp className="w-4 h-4 text-gold shrink-0" />
              <span>Dual Career Pathways</span>
            </div>
            <p className="text-xs text-rvu-muted leading-relaxed">
              Whether pursuing elite corporate careers, entrepreneurial ventures at the RVU Incubation Center, or global higher education, students receive tailored tracks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-surface border border-gold-border space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gold">
              <Award className="w-4 h-4 text-gold shrink-0" />
              <span>Industry-Accredited Curriculum</span>
            </div>
            <p className="text-xs text-rvu-muted leading-relaxed">
              Coursework is continuously refreshed with Fortune 500 corporate advisory councils to ensure curricula match present and future workforce demands.
            </p>
          </div>
        </div>

        {/* Parent FAQs Accordion Snapshot */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-rvu-text uppercase tracking-wider text-gold flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions by Families</span>
          </h4>

          <div className="space-y-2">
            <div className="p-3.5 rounded-lg bg-navy-surface/50 border border-white/10">
              <h5 className="text-xs font-bold text-rvu-text mb-1">
                When do placement training programs commence for my child?
              </h5>
              <p className="text-xs text-rvu-muted leading-relaxed">
                Foundational aptitude and communication training begins in Year 1. Intensive mock coding, system design, and interview clinics start from the 5th semester onwards.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-navy-surface/50 border border-white/10">
              <h5 className="text-xs font-bold text-rvu-text mb-1">
                Can parents consult directly with the Placement Cell?
              </h5>
              <p className="text-xs text-rvu-muted leading-relaxed">
                Yes. RVU hosts regular Parent-University Career Townhalls and provides scheduled appointments with the Director of Career & Placement Services.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-gold-border flex justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
          >
            Acknowledge & Close
          </Button>
        </div>

      </div>
    </Modal>
  );
};
