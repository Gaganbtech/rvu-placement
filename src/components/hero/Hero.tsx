import React from 'react';
import { ArrowRight, Shield, Users, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';
import { CircuitBackground } from '../ui/CircuitBackground';
import { EcosystemPreview } from './EcosystemPreview';
import { RVU_BRAND } from '../../data/rvu';

interface HeroProps {
  onOpenRecruiterModal: () => void;
  onExploreOpportunities: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenRecruiterModal,
  onExploreOpportunities
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
            
            {/* Small Eyebrow Label with Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-faint border border-gold/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
                RV UNIVERSITY // CAREER & PLACEMENT HUB
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-rvu-text font-display leading-[1.08] mb-6">
              YOUR FUTURE <br />
              <span className="text-gold-gradient">STARTS HERE.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-rvu-muted max-w-2xl font-normal leading-relaxed mb-5">
              Connect with opportunities, build industry-ready skills, and take your next step with RV University's career ecosystem.
            </p>

            {/* Official University Tagline as Gold-Highlighted Brand Statement */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-8 bg-gold/50" />
              <span className="text-lg sm:text-xl font-serif italic font-medium text-gold tracking-wide">
                "{RVU_BRAND.tagline}"
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={onExploreOpportunities}
                className="w-full sm:w-auto justify-center font-bold tracking-wide uppercase text-xs sm:text-sm"
              >
                EXPLORE OPPORTUNITIES
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={<Briefcase className="w-4 h-4 text-gold" />}
                iconPosition="left"
                onClick={onOpenRecruiterModal}
                className="w-full sm:w-auto justify-center font-bold tracking-wide uppercase text-xs sm:text-sm"
              >
                RECRUIT AT RVU
              </Button>
            </div>

            {/* Scale / Value Statement based on verified RVU figures */}
            <div className="pt-6 border-t border-gold-border/60 w-full flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-rvu-muted">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium text-rvu-text">{RVU_BRAND.legacyYears}</span>
              </div>
              <span className="hidden sm:inline text-gold-border">•</span>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium text-rvu-text">9 Interdisciplinary Schools</span>
              </div>
              <span className="hidden sm:inline text-gold-border">•</span>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium text-rvu-text">250+ Recruiting Organizations</span>
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
