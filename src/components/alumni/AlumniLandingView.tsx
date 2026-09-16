import React from 'react';
import {
  Award,
  ArrowLeft,
  Users,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AlumniService } from '../../services/alumniService';

interface AlumniLandingViewProps {
  onBackToHub: () => void;
  onNavigatePortal: (route: string) => void;
}

export const AlumniLandingView: React.FC<AlumniLandingViewProps> = ({
  onBackToHub,
  onNavigatePortal
}) => {
  const alumniData = AlumniService.getAlumniData();
  const {
    sectionHero,
    careerJourney,
    candidateExcellence,
    placementPerformance,
    corporateAlumniRelations,
    scholarship,
    alumniSections,
    verifiedProfiles,
    roleConnections
  } = alumniData;

  return (
    <div className="min-h-screen bg-navy-dark text-rvu-text selection:bg-gold selection:text-navy-dark pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-navy-dark/95 backdrop-blur-md border-b border-gold-border/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToHub}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rvu-muted hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded-lg px-2.5 py-1.5"
            aria-label="Back to Career Hub"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Back to Career Hub</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-rvu-subtle">
            <span>RVU Career Hub</span>
            <span>/</span>
            <span className="text-gold">Corporate & Alumni Relations</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Award className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              {sectionHero.eyebrow}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            {sectionHero.headline}
          </h1>

          <p className="text-sm sm:text-base text-rvu-muted leading-relaxed mb-4">
            {sectionHero.intro}
          </p>

          <p className="text-xs sm:text-sm text-gold-highlight/80 font-medium">
            {sectionHero.subline}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-navy-surface border border-gold-border/40 text-xs font-mono text-rvu-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>INSTITUTIONAL ENGAGEMENT • Corporate & Alumni Relations (CAR)</span>
          </div>
        </div>

        {/* Corporate & Alumni Relations Positioning Card */}
        <div className="card-glass rounded-2xl p-8 border border-gold/40 bg-gradient-to-r from-navy-surface via-navy to-navy-surface mb-16">
          <div className="max-w-3xl">
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-2">
              {corporateAlumniRelations.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-rvu-text font-display mb-3">
              {corporateAlumniRelations.headline}
            </h2>
            <p className="text-sm sm:text-base text-rvu-muted leading-relaxed mb-6">
              {corporateAlumniRelations.supportingText}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {corporateAlumniRelations.scopePoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs text-rvu-muted bg-black/20 p-3 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigatePortal('/alumni/join')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
              >
                <span>Join Alumni Network</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigatePortal('/student/support')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-surface border border-gold/30 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
              >
                <span>Student Mentorship Access</span>
                <Users className="w-3.5 h-3.5 text-gold" />
              </button>
            </div>
          </div>
        </div>

        {/* Career Journey Roadmap (01 Discover to 06 Grow) */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
              THE RVU CAREER PATHWAY
            </span>
            <h2 className="text-2xl font-bold text-rvu-text font-display">
              Six-Stage Career Journey
            </h2>
            <p className="text-xs sm:text-sm text-rvu-muted mt-1">
              From multidisciplinary foundations through campus recruitment to lifelong alumni engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {careerJourney.map((step) => (
              <div
                key={step.stepNumber}
                onClick={() => onNavigatePortal(step.route)}
                className="group card-glass rounded-xl p-4 border border-gold-border/30 bg-navy-surface hover:border-gold transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-black font-mono text-gold group-hover:scale-105 transition-transform">
                      {step.stepNumber}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-rvu-subtle border border-white/10">
                      {step.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-rvu-text group-hover:text-gold transition-colors font-display mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-rvu-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gold font-medium">
                  <span>{step.ctaText}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Excellence & Performance Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Candidate Excellence Verified Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
                VERIFIED OUTCOMES
              </span>
              <h2 className="text-2xl font-bold text-rvu-text font-display">
                Candidate Excellence
              </h2>
              <p className="text-xs text-rvu-muted mt-1">
                Official placement outcomes recorded in the RVU 2025–26 recruitment season.
              </p>
            </div>

            {/* Metric 1: Multiple Offers */}
            <div className="card-glass rounded-xl p-6 border border-gold-border/40 bg-navy-surface">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl font-black font-mono text-gold">
                  {candidateExcellence.multiOfferMetric.headline}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                  {candidateExcellence.multiOfferMetric.nature}
                </span>
              </div>
              <p className="text-sm font-semibold text-rvu-text mb-2">
                {candidateExcellence.multiOfferMetric.supportingText}
              </p>
              <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                {candidateExcellence.multiOfferMetric.context}
              </p>
              <div className="pt-3 border-t border-gold-border/20 text-[11px] text-rvu-subtle font-mono">
                Source: {candidateExcellence.multiOfferMetric.sourceLabel}
              </div>
            </div>

            {/* Metric 2: Highest Compensation */}
            <div className="card-glass rounded-xl p-6 border border-gold-border/40 bg-navy-surface">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl font-black font-mono text-gold">
                  {candidateExcellence.highestCompensationMetric.headline}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                  Aviatrix
                </span>
              </div>
              <p className="text-sm font-semibold text-rvu-text mb-2">
                {candidateExcellence.highestCompensationMetric.supportingText}
              </p>
              <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                {candidateExcellence.highestCompensationMetric.context}
              </p>
              <div className="pt-3 border-t border-gold-border/20 text-[11px] text-rvu-subtle font-mono">
                Source: {candidateExcellence.highestCompensationMetric.sourceLabel}
              </div>
            </div>
          </div>

          {/* Placement Salary Distribution */}
          <div className="lg:col-span-6">
            <div className="card-glass rounded-xl p-6 sm:p-7 border border-gold-border/40 bg-navy-surface h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-gold uppercase tracking-wider block">
                    SALARY BANDS (2025–26)
                  </span>
                  <span className="text-xs font-mono text-rvu-muted">
                    {placementPerformance.reportingCycle}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-rvu-text font-display mb-2">
                  Compensation Distribution Reporting
                </h3>
                <p className="text-xs text-rvu-muted mb-6">
                  Distribution of placement offers across verified compensation tiers documented in official RVU placement reporting.
                </p>

                {/* Salary Bands List */}
                <div className="space-y-4 mb-6">
                  {placementPerformance.salaryBands.map((band, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-navy-dark/90 border border-gold-border/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-rvu-text font-mono">
                          {band.range}
                        </span>
                        <span className="text-xs font-mono text-gold font-semibold">
                          {band.offersEstimate}
                        </span>
                      </div>
                      <p className="text-[11px] text-rvu-muted">
                        {band.percentageNote}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-rvu-subtle block uppercase">
                      Minimum Campus Compensation
                    </span>
                    <span className="text-sm font-bold font-mono text-rvu-text">
                      {placementPerformance.minimumCompensation}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-rvu-subtle block uppercase">
                      Total Verified Offers
                    </span>
                    <span className="text-sm font-bold font-mono text-gold">
                      {placementPerformance.totalOffersEstimate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gold-border/30 flex items-center justify-between text-xs text-rvu-muted">
                <span className="text-[11px] font-mono text-rvu-subtle">
                  250+ Recruiting Organizations
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

        {/* 6 Core Alumni Sections */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
              ECOSYSTEM CHAPTERS
            </span>
            <h2 className="text-2xl font-bold text-rvu-text font-display">
              Alumni Focus Areas
            </h2>
            <p className="text-xs sm:text-sm text-rvu-muted mt-1">
              Structured engagement channels managed under Corporate & Alumni Relations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {alumniSections.map((sec) => (
              <div
                key={sec.id}
                className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface/90 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-gold uppercase tracking-wider block mb-2">
                    {sec.scope}
                  </span>
                  <h3 className="text-base font-bold text-rvu-text font-display mb-2">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-rvu-muted leading-relaxed">
                    {sec.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-rvu-subtle font-mono">
                  <span>CAR Institutional Initiative</span>
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni Scholarship Connection Card */}
        <div className="card-glass rounded-2xl p-7 border border-gold/40 bg-gradient-to-r from-navy-surface to-navy-dark max-w-4xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-gold" />
                <span className="text-[11px] font-semibold text-gold font-mono uppercase">
                  ACADEMIC PROGRESSION
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-rvu-text font-display mb-1">
                {scholarship.title}
              </h3>
              <p className="text-lg font-mono font-bold text-gold mb-2">
                {scholarship.amount}
              </p>
              <p className="text-xs sm:text-sm text-rvu-muted max-w-xl leading-relaxed mb-2">
                {scholarship.description}
              </p>
              <p className="text-[11px] text-rvu-subtle font-mono">
                {scholarship.natureNote}
              </p>
            </div>
            <a
              href="https://rvu.edu.in/rvu-scholarships/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all shrink-0"
            >
              <span>View Scholarship Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Alumni Profiles Showcase & Honesty Notice */}
        <div className="card-glass rounded-2xl p-8 border border-gold-border/40 bg-navy-surface text-center max-w-3xl mx-auto mb-16">
          <Users className="w-8 h-8 text-gold mx-auto mb-3" />
          <h3 className="text-lg font-bold text-rvu-text font-display mb-2">
            Verified Alumni Profiles Directory
          </h3>
          {verifiedProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-6">
              {verifiedProfiles.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-navy-dark border border-gold-border/30">
                  <span className="text-xs font-bold text-rvu-text">{p.name}</span>
                  <span className="text-[10px] text-gold font-mono block">{p.programme} • {p.graduationYear}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-navy-dark/80 border border-gold-border/20 text-xs text-rvu-muted leading-relaxed mt-2">
              <p className="font-mono text-gold-highlight mb-1">
                INSTITUTIONAL DIRECTORY STATUS
              </p>
              <p>
                Alumni stories and profiles will appear here as verified records are published through Corporate & Alumni Relations.
              </p>
            </div>
          )}
        </div>

        {/* Role Connection Actions (Student, Alumni, Recruiter, Management) */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
              ECOSYSTEM ACCESS
            </span>
            <h2 className="text-2xl font-bold text-rvu-text font-display">
              Connect Across Roles
            </h2>
            <p className="text-xs sm:text-sm text-rvu-muted mt-1">
              Select your relationship with RV University to access dedicated workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student */}
            <div className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold block uppercase mb-2">
                  {roleConnections.student.label}
                </span>
                <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                  {roleConnections.student.description}
                </p>
              </div>
              <button
                onClick={() => onNavigatePortal(roleConnections.student.route)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
              >
                <span>{roleConnections.student.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alumni */}
            <div className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold block uppercase mb-2">
                  {roleConnections.alumni.label}
                </span>
                <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                  {roleConnections.alumni.description}
                </p>
              </div>
              <button
                onClick={() => onNavigatePortal(roleConnections.alumni.route)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
              >
                <span>{roleConnections.alumni.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recruiter */}
            <div className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold block uppercase mb-2">
                  {roleConnections.recruiter.label}
                </span>
                <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                  {roleConnections.recruiter.description}
                </p>
              </div>
              <button
                onClick={() => onNavigatePortal(roleConnections.recruiter.route)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
              >
                <span>{roleConnections.recruiter.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Management */}
            <div className="card-glass rounded-xl p-5 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold block uppercase mb-2">
                  {roleConnections.management.label}
                </span>
                <p className="text-xs text-rvu-muted leading-relaxed mb-4">
                  {roleConnections.management.description}
                </p>
              </div>
              <button
                onClick={() => onNavigatePortal(roleConnections.management.route)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
              >
                <span>{roleConnections.management.ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Source Citation Footer */}
        <div className="pt-6 border-t border-gold-border/30 flex flex-wrap items-center justify-between text-xs text-rvu-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Verified from official RV University Placement & Scholarship Documentation</span>
          </div>
          <a
            href="https://rvu.edu.in/placements/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline flex items-center gap-1 font-mono text-[11px]"
          >
            <span>rvu.edu.in/placements/</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
