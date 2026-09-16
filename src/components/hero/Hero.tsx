import React from 'react';
import { ArrowRight, Shield, Users, Briefcase, GraduationCap, Building2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { CircuitBackground } from '../ui/CircuitBackground';
import { EcosystemPreview } from './EcosystemPreview';
import { RVU_BRAND } from '../../data/rvu';

interface HeroProps {
  onOpenRecruiterModal: () => void;
  onExploreOpportunities: () => void;
  onNavigatePortal?: (route: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenRecruiterModal,
  onExploreOpportunities,
  onNavigatePortal = (route: string) => { window.location.hash = route; }
}) => {
  return (
    <section 
      id="home" 
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 lg:pt-32 lg:pb-24 bg-navy-dark overflow-hidden"
    >
      {/* Circuit background traces and radial glows */}
      <CircuitBackground variant="hero" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content Column (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Eyebrow Label with Modern Style Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/40 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
                RV UNIVERSITY // DIGITAL PLACEMENT & CAREER PLATFORM
              </span>
            </div>

            {/* Bold Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.12] mb-6">
              Building <span className="text-gold-gradient">Careers</span>,<br />
              Digitizing <span className="text-gold-gradient">RV University</span>,<br />
              Revolutionizing <span className="text-white underline decoration-gold/60 underline-offset-8">Recruitments</span>.
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base lg:text-lg text-rvu-muted max-w-2xl font-normal leading-relaxed mb-6">
              The next-generation campus placement automation platform bringing together RVU academia, global recruiters, students, and alumni into a single verified ecosystem.
            </p>

            {/* University Tagline Badge */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-8 bg-gold/50" />
              <span className="text-base sm:text-lg font-serif italic font-medium text-gold tracking-wide">
                "{RVU_BRAND.tagline}"
              </span>
            </div>

            {/* Multi-Stakeholder Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
              {/* For Students */}
              <button
                onClick={() => onNavigatePortal('/student')}
                className="p-3.5 rounded-xl bg-navy-card hover:bg-gold/15 border border-gold-border/60 hover:border-gold text-left transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-gold">
                    <GraduationCap className="w-4 h-4 text-gold" />
                    <span>For Students</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-rvu-muted leading-tight">
                  Launch Career OS, build verified vault & 1-click apply.
                </p>
              </button>

              {/* For Employers */}
              <button
                onClick={() => onNavigatePortal('/recruiter')}
                className="p-3.5 rounded-xl bg-navy-card hover:bg-gold/15 border border-gold-border/60 hover:border-gold text-left transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-gold">
                    <Building2 className="w-4 h-4 text-gold" />
                    <span>For Employers</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-rvu-muted leading-tight">
                  Post JDs, filter talent & download student resumes.
                </p>
              </button>

              {/* For Placement Cell */}
              <button
                onClick={() => onNavigatePortal('/management')}
                className="p-3.5 rounded-xl bg-navy-card hover:bg-gold/15 border border-gold-border/60 hover:border-gold text-left transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-gold">
                    <Shield className="w-4 h-4 text-gold" />
                    <span>Placement Cell</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-rvu-muted leading-tight">
                  SIS Excel sync, live drive ops & placement analytics.
                </p>
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={onExploreOpportunities}
                className="w-full sm:w-auto justify-center font-bold tracking-wide uppercase text-xs sm:text-sm"
              >
                EXPLORE CAMPUS DRIVES
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={<Briefcase className="w-4 h-4 text-gold" />}
                iconPosition="left"
                onClick={onOpenRecruiterModal}
                className="w-full sm:w-auto justify-center font-bold tracking-wide uppercase text-xs sm:text-sm"
              >
                EMPLOYER REGISTRATION
              </Button>
            </div>

            {/* Verified Scale Metrics */}
            <div className="pt-5 border-t border-gold-border/40 w-full flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-rvu-muted font-mono">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="font-semibold text-white">Highest: ₹43.5 LPA (Aviatrix)</span>
              </div>
              <span className="hidden sm:inline text-gold-border">•</span>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="font-semibold text-white">1,608 Eligible Talent</span>
              </div>
              <span className="hidden sm:inline text-gold-border">•</span>
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="font-semibold text-white">180+ Enterprise Recruiters</span>
              </div>
            </div>

          </div>

          {/* Right Product Console Dashboard Preview (5 cols on lg) */}
          <div className="lg:col-span-5 w-full">
            <EcosystemPreview />
          </div>

        </div>
      </div>

      {/* Subtle bottom separator line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
};
