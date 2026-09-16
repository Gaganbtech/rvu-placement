import React, { useState } from 'react';
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import type { Opportunity } from '../../data/platform/types';
import { usePlatformStore } from '../../data/platform/studentStore';
import { ApplyModal } from '../student/modals/ApplyModal';

interface OpportunityDetailPublicViewProps {
  opportunityId: string;
  onBack: () => void;
  onNavigatePortal: (route: string) => void;
  onOpenStudentLoginModal: () => void;
}

export const OpportunityDetailPublicView: React.FC<OpportunityDetailPublicViewProps> = ({
  opportunityId,
  onBack,
  onNavigatePortal,
  onOpenStudentLoginModal
}) => {
  const store = usePlatformStore();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Find the opportunity from the unified platform store
  const opportunity: Opportunity | undefined = store.opportunities.find(o => o.id === opportunityId);

  // Check current user role & student state
  const currentRole = store.currentRole;
  const isStudent = currentRole === 'STUDENT';
  const isRecruiter = currentRole === 'RECRUITER';
  const isManagement = currentRole === 'PLACEMENT_ADMIN' || currentRole === 'CAR_ADMIN' || currentRole === 'SUPER_ADMIN';

  // Check if student has applied
  const existingApplication = isStudent
    ? store.applications.find(a => a.opportunityId === opportunityId && a.studentId === store.student.id)
    : undefined;

  const hasApplied = !!existingApplication;

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-navy-dark text-rvu-text py-16 px-4">
        <div className="max-w-3xl mx-auto card-glass rounded-2xl p-8 text-center border-gold/30">
          <AlertCircle className="w-12 h-12 text-gold mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-display mb-2">Opportunity Not Found</h1>
          <p className="text-sm text-rvu-muted mb-6">
            The requested placement or internship record ({opportunityId}) is either not published or has concluded.
          </p>
          <button
            onClick={onBack}
            className="btn-gold text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  // Active resume for applying
  const activeResume = store.documents.find(d => d.type === 'RESUME' && d.isActiveForApplications);

  const handlePrimaryAction = () => {
    if (isStudent) {
      if (hasApplied) {
        onNavigatePortal('/student/applications');
      } else {
        setIsApplyModalOpen(true);
      }
    } else if (isRecruiter) {
      onNavigatePortal('/recruiter/opportunities');
    } else if (isManagement) {
      onNavigatePortal('/management/opportunities');
    } else {
      // Unauthenticated public visitor
      onOpenStudentLoginModal();
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark text-rvu-text selection:bg-gold selection:text-navy-dark pb-24">
      
      {/* 1. TOP BREADCRUMB & BACK NAVIGATION BAR */}
      <div className="sticky top-0 z-40 bg-navy-dark/95 backdrop-blur-md border-b border-gold-border/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rvu-muted hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded-lg px-2.5 py-1.5"
            aria-label="Back to Opportunities Directory"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Back to Opportunities</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-rvu-subtle">
            <span className="hidden sm:inline">RVU Career Hub</span>
            <span className="hidden sm:inline">/</span>
            <span>Opportunities</span>
            <span>/</span>
            <span className="text-gold truncate max-w-[160px] sm:max-w-[240px]">{opportunity.role}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* 2. OPPORTUNITY HEADER CARD */}
        <div className="relative rounded-3xl p-6 sm:p-10 card-glass border-gold/40 shadow-2xl overflow-hidden mb-10">
          <div className="absolute inset-0 bg-tech-circuit opacity-20 pointer-events-none" />

          <div className="relative z-10">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gold-faint text-gold border border-gold/30 text-xs font-mono font-semibold uppercase">
                  {opportunity.type}
                </span>
                <span className="px-3 py-1 rounded-full bg-navy-surface text-rvu-muted border border-white/10 text-xs font-mono">
                  {opportunity.workMode}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CAR Office Approved
                </span>
              </div>

              {opportunity.applicationDeadline && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline: {opportunity.applicationDeadline}</span>
                </div>
              )}
            </div>

            {/* Role Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-rvu-text font-display tracking-tight mb-2">
              {opportunity.role}
            </h1>

            {/* Company & Location */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-rvu-muted mb-6">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <Building className="w-4 h-4 text-gold" />
                <span>{opportunity.companyName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rvu-subtle" />
                <span>{opportunity.location}</span>
              </div>
              {opportunity.ctcLpa && (
                <div className="flex items-center gap-1.5 text-gold font-mono font-semibold">
                  <Briefcase className="w-4 h-4" />
                  <span>{opportunity.ctcLpa}</span>
                </div>
              )}
            </div>

            {/* Role-Aware Primary Action Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-navy-surface/90 border border-gold/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase text-gold mb-1">
                  Application Status
                </div>
                <div className="text-sm font-semibold text-rvu-text">
                  {isStudent ? (
                    hasApplied ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Application Submitted on {existingApplication.submittedAt}
                      </span>
                    ) : (
                      <span>Open for eligible RV University candidates</span>
                    )
                  ) : isRecruiter ? (
                    <span>Recruiter Workspace Mode</span>
                  ) : isManagement ? (
                    <span>Placement Command Center Review Mode</span>
                  ) : (
                    <span>Requires active RV University student account to submit</span>
                  )}
                </div>
              </div>

              <button
                onClick={handlePrimaryAction}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-gold-sm ${
                  hasApplied
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'btn-gold hover:scale-[1.02]'
                }`}
              >
                {isStudent ? (
                  hasApplied ? (
                    <>
                      <span>View Application Status</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Apply Now</span>
                    </>
                  )
                ) : isRecruiter ? (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Manage Opportunity in Portal</span>
                  </>
                ) : isManagement ? (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Manage in Command Center</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    <span>Sign in to Apply</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* 3. DETAILS SECTIONS */}
        <div className="space-y-8">
          
          {/* Description & Overview */}
          <div className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
            <h2 className="text-lg sm:text-xl font-bold font-display text-rvu-text mb-3">
              Role Overview & Description
            </h2>
            <p className="text-sm text-rvu-muted leading-relaxed whitespace-pre-line mb-6">
              {opportunity.description}
            </p>

            {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-xs font-mono uppercase text-gold tracking-wider mb-3">
                  Key Responsibilities
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-rvu-muted">
                  {opportunity.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Academic Eligibility */}
          <div className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              ACADEMIC CRITERIA
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-rvu-text mb-4">
              Eligibility & School Alignment
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-navy-surface border border-white/5">
                <span className="text-[10px] font-mono text-rvu-subtle uppercase block mb-1">
                  Minimum CGPA
                </span>
                <span className="text-sm font-bold text-rvu-text font-mono">
                  {opportunity.minCgpa} / 10.0
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-surface border border-white/5">
                <span className="text-[10px] font-mono text-rvu-subtle uppercase block mb-1">
                  Backlog Policy
                </span>
                <span className="text-sm font-bold text-rvu-text font-mono">
                  {opportunity.maxBacklogsAllowed === 0 ? 'No active backlogs' : `Max ${opportunity.maxBacklogsAllowed} active backlog(s)`}
                </span>
              </div>

              {opportunity.eligibleGraduationYears && (
                <div className="p-3.5 rounded-xl bg-navy-surface border border-white/5">
                  <span className="text-[10px] font-mono text-rvu-subtle uppercase block mb-1">
                    Graduating Cohort
                  </span>
                  <span className="text-sm font-bold text-rvu-text font-mono">
                    {opportunity.eligibleGraduationYears.join(', ')} Batch
                  </span>
                </div>
              )}
            </div>

            {/* Eligible Schools & Programmes */}
            <div className="space-y-4 pt-4 border-t border-white/5 text-xs">
              {opportunity.eligibleSchools && opportunity.eligibleSchools.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-rvu-subtle block mb-1.5">
                    Eligible RVU Schools:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.eligibleSchools.map((sch, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-navy-surface text-rvu-text border border-white/10"
                      >
                        {sch}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {opportunity.eligibleProgrammes && opportunity.eligibleProgrammes.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-rvu-subtle block mb-1.5">
                    Eligible Programmes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.eligibleProgrammes.map((prg, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-navy-surface text-rvu-muted border border-white/5 font-mono text-[11px]"
                      >
                        {prg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Required Skills */}
          {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
            <div className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                COMPETENCIES
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-rvu-text mb-4">
                Required Skills & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-navy-surface text-rvu-text border border-gold/30 text-xs font-mono font-medium shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {opportunity.niceToHaveSkills && opportunity.niceToHaveSkills.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase text-rvu-subtle block mb-1.5">
                    Good to Have:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.niceToHaveSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-rvu-muted text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selection Process / Rounds */}
          {opportunity.selectionProcess && opportunity.selectionProcess.length > 0 && (
            <div className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                SELECTION PATHWAY
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-rvu-text mb-4">
                Recruitment Rounds
              </h2>
              <div className="space-y-3">
                {opportunity.selectionProcess.map((round) => (
                  <div
                    key={round.roundNumber}
                    className="p-4 rounded-xl bg-navy-surface border border-white/5 flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-gold-faint border border-gold/40 text-gold flex items-center justify-center text-xs font-bold font-mono shrink-0">
                      {round.roundNumber}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-rvu-text">
                          {round.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
                          {round.mode}
                        </span>
                      </div>
                      <p className="text-xs text-rvu-muted">
                        {round.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Preparation Callout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-surface to-navy-dark border border-gold/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase mb-1">
                <BookOpen className="w-4 h-4" />
                CAREER PREPARATION TOOLKIT
              </div>
              <p className="text-sm font-bold text-white mb-1">
                Prepare for technical and behavioral interviews
              </p>
              <p className="text-xs text-rvu-muted">
                Explore RVU mock interview simulations, coding question banks, and resume optimization.
              </p>
            </div>
            <button
              onClick={() => onNavigatePortal('/student/preparation')}
              className="btn-navy-outline text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 flex items-center gap-1.5"
            >
              <span>Explore Preparation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Student Application Modal */}
      {isStudent && isApplyModalOpen && (
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          opportunity={opportunity}
          student={store.student}
          activeResume={activeResume}
          onConfirmApply={store.applyToOpportunity}
          onViewApplication={() => {
            setIsApplyModalOpen(false);
            onNavigatePortal('/student/applications');
          }}
        />
      )}

    </div>
  );
};
