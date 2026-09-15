import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Users, TrendingUp, Building2, Trophy } from 'lucide-react';
import { VERIFIED_PLACEMENT_PERFORMANCE } from '../../data/placementPerformance';

export const PlacementImpact: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    eligible: 0,
    offers: 0,
    partners: 0
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        eligible: Math.floor(progress * VERIFIED_PLACEMENT_PERFORMANCE.eligibleStudents),
        offers: Math.floor(progress * 400),
        partners: Math.floor(progress * 250)
      });

      if (step >= steps) {
        setCounts({
          eligible: VERIFIED_PLACEMENT_PERFORMANCE.eligibleStudents,
          offers: 400,
          partners: 250
        });
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section 
      id="impact"
      ref={sectionRef} 
      className="relative py-20 bg-navy overflow-hidden border-b border-gold-border/40"
    >
      {/* Background glow and subtle ambient pattern */}
      <div className="absolute inset-0 bg-tech-circuit opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-faint rounded-full blur-[130px] pointer-events-none opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              2025–26 PLACEMENT REPORTING
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            PLACEMENT AT RVU
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Connecting industry with multidisciplinary, industry-ready talent.
          </p>
        </div>

        {/* Verified 4-Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Metric 1: Eligible Students */}
          <div className="group relative card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-navy-surface border border-gold/20 group-hover:border-gold/50 transition-colors">
                <Users className="w-5 h-5 text-gold" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30 uppercase">
                Talent Pool
              </span>
            </div>

            <div className="mb-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-gold-gradient">
                {counts.eligible.toLocaleString()}
              </span>
            </div>

            <h3 className="text-base font-bold text-rvu-text mb-2">
              Students Eligible for Recruitment
            </h3>

            <p className="text-xs text-rvu-muted leading-relaxed">
              Multidisciplinary graduating students eligible across 9 university schools.
            </p>
          </div>

          {/* Metric 2: Placement Offers */}
          <div className="group relative card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-navy-surface border border-gold/20 group-hover:border-gold/50 transition-colors">
                <TrendingUp className="w-5 h-5 text-gold" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted border border-white/10 uppercase">
                ~425 Offers
              </span>
            </div>

            <div className="mb-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-rvu-text">
                {counts.offers}+
              </span>
            </div>

            <h3 className="text-base font-bold text-rvu-text mb-2">
              Placement Offers
            </h3>

            <p className="text-xs text-rvu-muted leading-relaxed">
              Approximately 425 offers secured; ~25% placed students secured multiple offers.
            </p>
          </div>

          {/* Metric 3: Recruiting Organizations */}
          <div className="group relative card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-navy-surface border border-gold/20 group-hover:border-gold/50 transition-colors">
                <Building2 className="w-5 h-5 text-gold" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted border border-white/10 uppercase">
                2025–26 Drive
              </span>
            </div>

            <div className="mb-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-rvu-text">
                {counts.partners}+
              </span>
            </div>

            <h3 className="text-base font-bold text-rvu-text mb-2">
              Recruiting Organizations
            </h3>

            <p className="text-xs text-rvu-muted leading-relaxed">
              Leading global enterprises, research labs, GCCs, and high-growth innovators.
            </p>
          </div>

          {/* Metric 4: Highest Annual Compensation */}
          <div className="group relative card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-navy-surface border border-gold/20 group-hover:border-gold/50 transition-colors">
                <Trophy className="w-5 h-5 text-gold" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30 uppercase">
                Aviatrix Offer
              </span>
            </div>

            <div className="mb-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-gold-gradient">
                {VERIFIED_PLACEMENT_PERFORMANCE.highestPackageDisplay}
              </span>
            </div>

            <h3 className="text-base font-bold text-rvu-text mb-2">
              Highest Annual Compensation
            </h3>

            <p className="text-xs text-rvu-muted leading-relaxed">
              Offered by Aviatrix (with an additional reported offer of ₹33 LPA from Aviatrix).
            </p>
          </div>

        </div>

        {/* Footnote */}
        <div className="mt-8 text-center">
          <p className="text-xs text-rvu-muted max-w-xl mx-auto font-mono">
            Reported for the 2025–26 placement period.
          </p>
        </div>

      </div>
    </section>
  );
};
