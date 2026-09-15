import React, { useState } from 'react';
import { GraduationCap, Briefcase, HeartHandshake, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { ParentGuideModal } from './ParentGuideModal';

interface StakeholderCardsProps {
  onExploreStudentHub: () => void;
  onOpenRecruiterModal: () => void;
  onNavigatePortal: (route: string) => void;
}

export const StakeholderCards: React.FC<StakeholderCardsProps> = ({
  onExploreStudentHub,
  onOpenRecruiterModal,
  onNavigatePortal
}) => {
  const [parentModalOpen, setParentModalOpen] = useState(false);

  return (
    <section id="stakeholders" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-gold-faint rounded-full blur-[140px] pointer-events-none opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              STAKEHOLDER PATHWAYS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            ONE ECOSYSTEM. <br />
            <span className="text-gold-gradient">THREE PERSPECTIVES.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Dedicated portals, verified workflows, and structured engagement channels built for students, recruiters, and families.
          </p>
        </div>

        {/* 3-Column Stakeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Students */}
          <div className="group relative card-glass rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-gold/60">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-faint border border-gold/40 text-gold flex items-center justify-center group-hover:scale-105 transition-transform shadow-gold-sm">
                <GraduationCap className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-gold uppercase tracking-wider">
                  STUDENTS
                </span>
                <h3 className="text-2xl font-bold text-rvu-text font-display">
                  YOUR CAREER JOURNEY STARTS HERE
                </h3>
                <p className="text-sm text-rvu-muted leading-relaxed">
                  Discover opportunities, prepare for recruitment and build the skills needed for a changing world.
                </p>
              </div>

              <ul className="space-y-2 pt-3 border-t border-gold-border/40 text-xs text-rvu-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Curated campus placement & internship requisitions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>AI resume feedback & coding diagnostic clinics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Direct Corporate & Alumni Relations guidance</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2.5">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onNavigatePortal('/student')}
                className="w-full justify-center uppercase font-bold text-xs tracking-wider"
              >
                ENTER STUDENT PORTAL
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={onExploreStudentHub}
                className="w-full justify-center uppercase text-xs tracking-wider"
              >
                EXPLORE OPPORTUNITIES
              </Button>
            </div>
          </div>

          {/* Card 2: Recruiters */}
          <div className="group relative card-glass rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-gold/60">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-navy-surface border border-gold/40 text-gold flex items-center justify-center group-hover:scale-105 transition-transform shadow-gold-sm">
                <Briefcase className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-gold uppercase tracking-wider">
                  RECRUITERS
                </span>
                <h3 className="text-2xl font-bold text-rvu-text font-display">
                  BUILD YOUR FUTURE TEAM AT RVU
                </h3>
                <p className="text-sm text-rvu-muted leading-relaxed">
                  Access a multidisciplinary talent pool shaped by interdisciplinary learning, experiential education and industry exposure.
                </p>
              </div>

              <ul className="space-y-2 pt-3 border-t border-gold-border/40 text-xs text-rvu-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Access 1,608 verified candidates across 9 schools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Seamless campus drive logistics & CAR support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Joint research labs & executive masterclasses</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2.5">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={onOpenRecruiterModal}
                className="w-full justify-center uppercase font-bold text-xs tracking-wider"
              >
                RECRUIT AT RVU
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => onNavigatePortal('/recruiter')}
                className="w-full justify-center uppercase text-xs tracking-wider"
              >
                EXPLORE RECRUITER PORTAL
              </Button>
            </div>
          </div>

          {/* Card 3: Parents */}
          <div id="parent-ecosystem" className="group relative card-glass rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-gold/60">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-navy-surface border border-gold/40 text-gold flex items-center justify-center group-hover:scale-105 transition-transform shadow-gold-sm">
                <HeartHandshake className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-gold uppercase tracking-wider">
                  PARENTS & GUARDIANS
                </span>
                <h3 className="text-2xl font-bold text-rvu-text font-display">
                  A CAREER ECOSYSTEM BUILT FOR THE FUTURE
                </h3>
                <p className="text-sm text-rvu-muted leading-relaxed">
                  Understand how RV University prepares your child for the professional world through experiential education, industry integration, and comprehensive mentorship.
                </p>
              </div>

              <ul className="space-y-2 pt-3 border-t border-gold-border/40 text-xs text-rvu-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Industry exposure through internships & live projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Multidisciplinary foundation across 9 schools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Dedicated Corporate & Alumni Relations guidance</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant="secondary"
                size="md"
                icon={<ShieldCheck className="w-4 h-4 text-gold" />}
                iconPosition="left"
                onClick={() => setParentModalOpen(true)}
                className="w-full justify-center uppercase text-xs tracking-wider"
              >
                EXPLORE PARENT GUIDE
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* Parent Guide Dialog */}
      <ParentGuideModal
        isOpen={parentModalOpen}
        onClose={() => setParentModalOpen(false)}
      />

    </section>
  );
};
