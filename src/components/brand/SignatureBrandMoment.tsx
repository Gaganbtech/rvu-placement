import React from 'react';
import { CircuitBackground } from '../ui/CircuitBackground';
import { RVU_BRAND } from '../../data/rvu';

export const SignatureBrandMoment: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      
      {/* Subtle Technological Circuit Pattern */}
      <CircuitBackground variant="subtle" />
      
      {/* Soft Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gold-faint rounded-full blur-[140px] pointer-events-none opacity-30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 select-none">
        
        {/* Subtle Decorative Gold Crest Element */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
          <img 
            src="/src/assets/rvu-logo-gold.svg" 
            alt="RVU Logo Crest" 
            className="h-9 w-auto opacity-90 object-contain"
          />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {/* Signature Bold Typographic Statement */}
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-rvu-text leading-[0.95] mb-6">
          GO, <br />
          <span className="text-gold-gradient">CHANGE</span> <br />
          THE WORLD.
        </h2>

        {/* Sub-text: "RV University" */}
        <p className="text-base sm:text-xl font-display font-semibold tracking-widest text-rvu-muted uppercase">
          {RVU_BRAND.name}
        </p>

        <p className="mt-3 text-xs sm:text-sm text-rvu-subtle max-w-md mx-auto font-serif italic">
          "{RVU_BRAND.tagline}"
        </p>

      </div>
    </section>
  );
};
