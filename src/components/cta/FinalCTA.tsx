import React from 'react';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { CircuitBackground } from '../ui/CircuitBackground';

interface FinalCTAProps {
  onExploreOpportunities: () => void;
  onOpenRecruiterModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onExploreOpportunities,
  onOpenRecruiterModal
}) => {
  return (
    <section className="relative py-24 sm:py-32 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      
      {/* Circuit pattern and radial glow */}
      <CircuitBackground variant="subtle" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold-faint rounded-full blur-[140px] pointer-events-none opacity-30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Top Mini Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-faint border border-gold/40 mb-6 shadow-gold-sm">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-xs font-semibold tracking-wider uppercase text-gold">
            AMBITION • OPPORTUNITY • EXCELLENCE
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-rvu-text font-display tracking-tight leading-tight mb-6">
          YOUR NEXT CHAPTER <br />
          <span className="text-gold-gradient">STARTS NOW.</span>
        </h2>

        {/* Text */}
        <p className="text-base sm:text-lg lg:text-xl text-rvu-muted max-w-2xl mx-auto leading-relaxed mb-10">
          Discover your opportunities. Build your skills. Shape your future. Whether you are launching your professional journey or seeking outstanding graduate talent, RV University is your partner.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={onExploreOpportunities}
            className="w-full sm:w-auto min-w-[220px]"
          >
            Explore Opportunities
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<Building2 className="w-4 h-4 text-gold" />}
            iconPosition="left"
            onClick={onOpenRecruiterModal}
            className="w-full sm:w-auto min-w-[220px]"
          >
            Recruit at RVU
          </Button>
        </div>

        {/* Institutional Positioning Tagline */}
        <div className="mt-14 pt-8 border-t border-gold-border/40 text-xs text-rvu-subtle tracking-wider uppercase font-mono">
          RV UNIVERSITY BENGALURU // WHERE TALENT MEETS OPPORTUNITY
        </div>

      </div>
    </section>
  );
};
