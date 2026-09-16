import React, { useState } from 'react';
import {
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Users,
  X
} from 'lucide-react';
import { AlumniService } from '../../services/alumniService';

interface SuccessStoriesProps {
  onNavigatePortal?: (route: string) => void;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({
  onNavigatePortal
}) => {
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);

  const alumniData = AlumniService.getAlumniData();
  const {
    sectionHero,
    careerJourney,
    candidateExcellence,
    placementPerformance,
    corporateAlumniRelations,
    scholarship,
    roleConnections
  } = alumniData;

  const handleNavigate = (route: string, isExternal?: boolean) => {
    if (isExternal) {
      window.open(route, '_blank', 'noopener,noreferrer');
      return;
    }
    if (onNavigatePortal) {
      onNavigatePortal(route);
    } else {
      window.location.assign(route);
    }
  };

  return (
    <section id="stories" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      {/* Background Ambience Circuit Grid */}
      <div className="absolute inset-0 bg-tech-circuit opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* ==================================================== */}
        {/* 10. SECTION INTRODUCTION */}
        {/* ==================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Award className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              {sectionHero.eyebrow}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            {sectionHero.headline}
          </h2>

          <p className="text-base sm:text-lg text-rvu-muted leading-relaxed mb-3">
            {sectionHero.intro}
          </p>

          <p className="text-xs sm:text-sm text-gold-highlight/80 font-medium">
            {sectionHero.subline}
          </p>
        </div>

        {/* ==================================================== */}
        {/* 20. GLOBAL CAREER STORY CONCEPT */}
        {/* ==================================================== */}
        <div className="card-glass rounded-2xl p-6 sm:p-7 border border-gold-border/30 bg-navy-dark/80 max-w-4xl mx-auto mb-16">
          <div className="text-center mb-5">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider block">
              ECOSYSTEM FLOW
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-rvu-text font-display">
              RVU Institutional Progression
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono">
            <div className="px-3 py-2 rounded-xl bg-navy-surface border border-gold-border/40 text-rvu-text font-bold">
              FROM RVU
            </div>
            <ArrowRight className="w-4 h-4 text-gold shrink-0" />
            <div className="px-3 py-2 rounded-xl bg-navy-surface border border-gold-border/40 text-rvu-text font-bold">
              INDIA + GLOBAL
            </div>
            <ArrowRight className="w-4 h-4 text-gold shrink-0" />
            <div className="px-3 py-2 rounded-xl bg-navy-surface border border-gold-border/40 text-rvu-text font-bold">
              INDUSTRY
            </div>
            <ArrowRight className="w-4 h-4 text-gold shrink-0" />
            <div className="px-3 py-2 rounded-xl bg-gold text-navy-dark font-black">
              ALUMNI NETWORK
            </div>
          </div>
          <p className="text-[11px] text-center text-rvu-subtle mt-4">
            Positioning represents institutional academic design and interdisciplinary pathways, not guaranteed individual employment outcomes.
          </p>
        </div>

        {/* ==================================================== */}
        {/* 11. CAREER JOURNEY VISUAL (01 to 06) */}
        {/* ==================================================== */}
        <div className="mb-20">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
              CAREER JOURNEY
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-rvu-text font-display">
              Six Progressive Milestones
            </h3>
            <p className="text-xs sm:text-sm text-rvu-muted mt-1">
              Interactive roadmap connecting foundational discovery through experiential projects to career launch and lifelong alumni growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {careerJourney.map((step) => (
              <div
                key={step.stepNumber}
                onClick={() => handleNavigate(step.route)}
                className="group card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface hover:border-gold hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-mono text-gold group-hover:scale-105 transition-transform">
                      {step.stepNumber}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-subtle border border-white/10">
                      {step.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-rvu-text group-hover:text-gold transition-colors font-display mb-2">
                    {step.title}
                  </h4>

                  <p className="text-xs text-rvu-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gold font-medium">
                  <span>{step.ctaText}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================== */}
        {/* 12 & 13. CANDIDATE EXCELLENCE & PLACEMENT VISUAL */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* Left Column: Candidate Excellence Panel */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
                VERIFIED PLACEMENT REPORTING
              </span>
              <h3 className="text-2xl font-bold text-rvu-text font-display">
                Candidate Excellence
              </h3>
              <p className="text-xs text-rvu-muted mt-1">
                Metrics published in official RV University 2025–26 placement documentation.
              </p>
            </div>

            {/* Approx 25% Multiple Offers Card */}
            <div className="card-glass rounded-xl p-6 border border-gold-border/40 bg-navy-surface">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl font-black font-mono text-gold">
                  {candidateExcellence.multiOfferMetric.headline}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                  Placement Reporting
                </span>
              </div>
              <p className="text-sm font-bold text-rvu-text mb-2">
                {candidateExcellence.multiOfferMetric.supportingText}
              </p>
              <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                {candidateExcellence.multiOfferMetric.context}
              </p>
              <div className="pt-3 border-t border-gold-border/20 text-[10px] font-mono text-rvu-subtle">
                Source: {candidateExcellence.multiOfferMetric.sourceLabel}
              </div>
            </div>

            {/* ₹43.5 LPA Highest Package Card */}
            <div className="card-glass rounded-xl p-6 border border-gold-border/40 bg-navy-surface">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl font-black font-mono text-gold">
                  {candidateExcellence.highestCompensationMetric.headline}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gold border border-gold/30">
                  Aviatrix
                </span>
              </div>
              <p className="text-sm font-bold text-rvu-text mb-2">
                {candidateExcellence.highestCompensationMetric.supportingText}
              </p>
              <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                {candidateExcellence.highestCompensationMetric.context}
              </p>
              <div className="pt-3 border-t border-gold-border/20 text-[10px] font-mono text-rvu-subtle">
                Source: {candidateExcellence.highestCompensationMetric.sourceLabel}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://rvu.edu.in/placements/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:text-gold-highlight hover:underline"
              >
                <span>View Official Placement Reporting</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Placement Performance Salary Bands Visual */}
          <div className="lg:col-span-7">
            <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold-border/40 bg-navy-surface h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-gold uppercase tracking-wider">
                    PLACEMENT PERFORMANCE
                  </span>
                  <span className="text-[11px] font-mono text-rvu-subtle">
                    {placementPerformance.reportingCycle}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-rvu-text font-display mb-2">
                  Compensation Bands & Offer Distribution
                </h3>
                <p className="text-xs text-rvu-muted mb-6 leading-relaxed">
                  Categorized offer distribution documented in official placement cycle reporting. Figures represent approximate offers recorded by RV University.
                </p>

                {/* Salary Bands List */}
                <div className="space-y-4 mb-6">
                  {placementPerformance.salaryBands.map((band, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-navy-dark border border-gold-border/30 hover:border-gold/60 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold font-mono text-rvu-text">
                            {band.range}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                            {band.tierLabel}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-gold">
                          {band.offersEstimate}
                        </span>
                      </div>
                      <p className="text-xs text-rvu-muted">
                        {band.percentageNote}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Minimum & Highest Strip */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-rvu-subtle uppercase block mb-1">
                      Minimum Campus Compensation
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-rvu-text">
                      {placementPerformance.minimumCompensation}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-rvu-subtle uppercase block mb-1">
                      Highest Compensation (2025–26)
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-gold">
                      {placementPerformance.highestCompensation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-border/30 mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-rvu-muted">
                <span className="font-mono text-[11px]">
                  Approx. 425 offers across 250+ recruiting organizations
                </span>
                <a
                  href="https://rvu.edu.in/placements/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Verify Placement Report</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ==================================================== */}
        {/* 14. ALUMNI CONNECTION (CAR) & 19. SCHOLARSHIP */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* CAR Positioning Card */}
          <div className="lg:col-span-7">
            <div className="card-glass rounded-2xl p-7 sm:p-8 border border-gold/40 bg-navy-surface h-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-2">
                  {corporateAlumniRelations.eyebrow}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-rvu-text font-display mb-3">
                  {corporateAlumniRelations.headline}
                </h3>
                <p className="text-xs sm:text-sm text-rvu-muted leading-relaxed mb-6">
                  {corporateAlumniRelations.supportingText}
                </p>

                <div className="space-y-2.5 mb-6">
                  {corporateAlumniRelations.scopePoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-rvu-muted">
                      <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gold-border/20 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleNavigate('/alumni')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
                >
                  <span>Connect with Alumni</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleNavigate('/alumni/join')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-dark border border-gold/30 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
                >
                  <span>Join Alumni Network</span>
                  <Users className="w-3.5 h-3.5 text-gold" />
                </button>
              </div>
            </div>
          </div>

          {/* 19. RVU Alumni Scholarship Card */}
          <div className="lg:col-span-5">
            <div className="card-glass rounded-2xl p-7 sm:p-8 border border-gold-border/40 bg-navy-surface h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-3">
                  <GraduationCap className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[10px] font-semibold text-gold font-mono uppercase">
                    ALUMNI SCHOLARSHIP
                  </span>
                </div>

                <h3 className="text-xl font-bold text-rvu-text font-display mb-1">
                  {scholarship.title}
                </h3>
                <div className="text-2xl font-black font-mono text-gold mb-3">
                  {scholarship.amount}
                </div>

                <p className="text-xs sm:text-sm text-rvu-muted leading-relaxed mb-4">
                  “{scholarship.description}”
                </p>

                <p className="text-[11px] text-rvu-subtle font-mono mb-4">
                  {scholarship.natureNote}
                </p>
              </div>

              <div className="pt-4 border-t border-gold-border/20">
                <a
                  href={scholarship.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-gold-border/30 text-xs font-semibold text-rvu-text hover:bg-gold hover:text-navy-dark hover:border-gold transition-all"
                >
                  <span>View Scholarship Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ==================================================== */}
        {/* 17. HONEST ALUMNI DIRECTORY NOTICE (NO FAKE PROFILES) */}
        {/* ==================================================== */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold-border/30 bg-navy-surface text-center max-w-3xl mx-auto mb-20">
          <Users className="w-8 h-8 text-gold mx-auto mb-2" />
          <h3 className="text-base sm:text-lg font-bold text-rvu-text font-display mb-1">
            Alumni Stories & Graduate Profiles
          </h3>
          <p className="text-xs sm:text-sm text-rvu-muted leading-relaxed">
            Alumni stories and profiles will appear here as verified records are published through Corporate & Alumni Relations.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-mono text-rvu-subtle">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Strict institutional verification policy active</span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 18. ROLE-AWARE ACCESS MATRIX */}
        {/* ==================================================== */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
              ROLE WORKFLOWS
            </span>
            <h3 className="text-2xl font-bold text-rvu-text font-display">
              Alumni & Stakeholder Pathways
            </h3>
            <p className="text-xs sm:text-sm text-rvu-muted mt-1">
              Every workflow routes directly into active platform capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student */}
            <div className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold block uppercase mb-1">
                  {roleConnections.student.label}
                </span>
                <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                  {roleConnections.student.description}
                </p>
              </div>
              <button
                onClick={() => handleNavigate(roleConnections.student.route)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
              >
                <span>{roleConnections.student.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alumni */}
            <div className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold block uppercase mb-1">
                  {roleConnections.alumni.label}
                </span>
                <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                  {roleConnections.alumni.description}
                </p>
              </div>
              <button
                onClick={() => handleNavigate(roleConnections.alumni.route)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
              >
                <span>{roleConnections.alumni.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recruiter */}
            <div className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold block uppercase mb-1">
                  {roleConnections.recruiter.label}
                </span>
                <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                  {roleConnections.recruiter.description}
                </p>
              </div>
              <button
                onClick={() => handleNavigate(roleConnections.recruiter.route)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
              >
                <span>{roleConnections.recruiter.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Management */}
            <div className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold block uppercase mb-1">
                  {roleConnections.management.label}
                </span>
                <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                  {roleConnections.management.description}
                </p>
              </div>
              <button
                onClick={() => handleNavigate(roleConnections.management.route)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
              >
                <span>{roleConnections.management.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 28. SOURCE FOOTER */}
        {/* ==================================================== */}
        <div className="pt-6 border-t border-gold-border/30 flex flex-wrap items-center justify-between gap-4 text-xs text-rvu-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>Verified from official RV University sources (Placements, CAR & Scholarships)</span>
          </div>

          <button
            onClick={() => setSourcesModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-highlight hover:underline font-mono"
          >
            <span>View Sources →</span>
          </button>
        </div>

      </div>

      {/* Sources Verification Modal */}
      {sourcesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold/50 bg-navy-surface max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold-border/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-bold text-rvu-text font-display">
                  Placement & Alumni Provenance
                </h3>
              </div>
              <button
                onClick={() => setSourcesModalOpen(false)}
                className="p-1 rounded-lg text-rvu-muted hover:text-rvu-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-rvu-muted mb-4 leading-relaxed">
              All data points in this section reflect official RV University reporting. Salary bands and multiple-offer ratios are derived directly from the 2025–26 placement release. Alumni scholarship figures are sourced from current academic scholarship guidelines.
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-xl bg-navy-dark border border-gold-border/20">
                <h4 className="text-xs font-bold text-rvu-text mb-1">RV University Placement Reporting (2025–26)</h4>
                <p className="text-[11px] text-rvu-muted mb-2">Highest package (Aviatrix ₹43.5 LPA), multiple-offer percentage (approx. 25%), and salary tier distribution.</p>
                <a
                  href="https://rvu.edu.in/placements/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline inline-flex items-center gap-1 text-[10px] font-mono"
                >
                  <span>rvu.edu.in/placements/</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-dark border border-gold-border/20">
                <h4 className="text-xs font-bold text-rvu-text mb-1">RV University Alumni Scholarship</h4>
                <p className="text-[11px] text-rvu-muted mb-2">₹50,000 tuition fee waiver for eligible RVU graduates admitted to RVU master's programmes.</p>
                <a
                  href="https://rvu.edu.in/rvu-scholarships/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline inline-flex items-center gap-1 text-[10px] font-mono"
                >
                  <span>rvu.edu.in/rvu-scholarships/</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              onClick={() => setSourcesModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs"
            >
              Close Sources
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
