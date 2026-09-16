import React from 'react';
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import type { SchoolInfo, ProgrammeInfo } from '../../data/schools';

interface ProgrammeDetailViewProps {
  school: SchoolInfo;
  programme: ProgrammeInfo;
  onBackToSchool: () => void;
  onNavigatePortal?: (route: string) => void;
}

export const ProgrammeDetailView: React.FC<ProgrammeDetailViewProps> = ({
  school,
  programme,
  onBackToSchool,
  onNavigatePortal
}) => {
  return (
    <div className="min-h-screen bg-navy-dark text-rvu-text selection:bg-gold selection:text-navy-dark pb-24">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-navy-dark/95 backdrop-blur-md border-b border-gold-border/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToSchool}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rvu-muted hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded-lg px-2.5 py-1.5"
            aria-label={`Back to ${school.name}`}
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Back to {school.shortName}</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-rvu-subtle">
            <span className="hidden sm:inline">{school.shortName}</span>
            <span className="hidden sm:inline">/</span>
            <span>Programmes</span>
            <span>/</span>
            <span className="text-gold truncate max-w-[150px] sm:max-w-[220px]">{programme.slug}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Programme Header Card */}
        <div className="relative rounded-3xl p-6 sm:p-10 card-glass border-gold/40 shadow-2xl overflow-hidden mb-10">
          <div className="absolute inset-0 bg-tech-circuit opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3 py-1 rounded-full bg-gold-faint text-gold border border-gold/30 text-xs font-mono font-semibold uppercase">
                {programme.degreeType}
              </span>
              <span className="px-3 py-1 rounded-full bg-navy-surface text-rvu-muted border border-white/10 text-xs font-mono">
                {programme.duration}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified RVU Programme
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-rvu-text font-display tracking-tight mb-4">
              {programme.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-rvu-muted mb-6">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span>Offered by <strong className="text-white">{school.name}</strong></span>
            </div>

            {programme.overview && (
              <p className="text-sm sm:text-base text-rvu-muted leading-relaxed max-w-3xl mb-8">
                {programme.overview}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={programme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2"
              >
                <span>Visit Official Programme Page</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {onNavigatePortal && (
                <button
                  onClick={() => onNavigatePortal('/student/opportunities')}
                  className="btn-navy-outline text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:border-gold hover:text-gold transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-gold" />
                  <span>View Placement Tracks</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="space-y-8">
          
          {/* 1. Verified Specialisations / Majors */}
          {programme.specialisations && programme.specialisations.length > 0 && (
            <div className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                CURRICULAR FOCUS
              </div>
              <h2 className="text-xl font-bold font-display text-rvu-text mb-4">
                Verified Majors & Specialisations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {programme.specialisations.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-navy-surface border border-white/5 flex items-start gap-2.5 text-xs sm:text-sm text-rvu-text"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Eligibility & Admission Criteria */}
          {programme.eligibility && (
            <div className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                ADMISSION REQUIREMENTS
              </div>
              <h2 className="text-xl font-bold font-display text-rvu-text mb-3">
                Eligibility Criteria
              </h2>
              <p className="text-sm text-rvu-muted leading-relaxed">
                {programme.eligibility}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5">
                <a
                  href={school.officialPages.admissions || "https://admissions.rvu.edu.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-gold hover:underline"
                >
                  <span>Apply via Official RVU Admissions Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* 3. Career & Placement Relevance */}
          {programme.careerRelevance && programme.careerRelevance.length > 0 && (
            <div className="card-glass rounded-2xl p-6 sm:p-8 border-gold-border/40">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-gold tracking-wider mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                PLACEMENT ALIGNMENT
              </div>
              <h2 className="text-xl font-bold font-display text-rvu-text mb-3">
                Career Relevance & Roles
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {programme.careerRelevance.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-navy-surface text-rvu-text border border-white/10 text-xs font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
              <p className="text-xs text-rvu-subtle italic">
                Graduates from this programme are prepared for recruitment drives across these specialized industry domains.
              </p>
            </div>
          )}

          {/* Source Attribution */}
          <div className="p-4 rounded-xl bg-navy-surface/50 border border-white/5 flex items-center justify-between text-xs text-rvu-subtle font-mono">
            <span>Source: RV University Official Website</span>
            <a
              href={programme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline flex items-center gap-1"
            >
              <span>{programme.officialUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
