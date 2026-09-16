import React from 'react';
import {
  Users,
  Building2,
  Award,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Info
} from 'lucide-react';

export const RVUPlacementEcosystemPanel: React.FC = () => {
  return (
    <div className="card-glass rounded-3xl p-6 sm:p-8 lg:p-10 border-gold/40 shadow-2xl relative overflow-hidden">
      {/* Background Circuit Accent */}
      <div className="absolute inset-0 bg-tech-circuit opacity-20 pointer-events-none" />

      <div className="relative z-10">
        
        {/* Header with Verified Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-gold-border/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gold-faint border border-gold/30 text-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-gold uppercase tracking-wider font-semibold">
                Official Institutional Reporting
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-rvu-text">
                RVU Placement Ecosystem (2025–26)
              </h3>
            </div>
          </div>

          <a
            href="https://rvu.edu.in/placements/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-gold hover:underline bg-navy-surface px-3 py-1.5 rounded-xl border border-white/10 hover:border-gold/40 transition-colors"
          >
            <span>Source: rvu.edu.in/placements</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-navy-surface/80 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase text-rvu-muted">Eligible Talent</span>
              <Users className="w-4 h-4 text-gold" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-rvu-text mb-1">
              1,608
            </div>
            <p className="text-[11px] text-rvu-subtle">
              Total students eligible for recruitment across 9 schools
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-navy-surface/80 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase text-rvu-muted">Recruiters</span>
              <Building2 className="w-4 h-4 text-gold" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-gold mb-1">
              250+
            </div>
            <p className="text-[11px] text-rvu-subtle">
              Organizations participating in RVU campus placement
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-navy-surface/80 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase text-rvu-muted">Placement Offers</span>
              <Award className="w-4 h-4 text-gold" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-rvu-text mb-1">
              Approx. 425
            </div>
            <p className="text-[11px] text-rvu-subtle">
              Over 400 offers made across undergraduate & postgraduate cohorts
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-navy-surface/80 border border-gold/30 bg-gold-faint/10 flex flex-col justify-between shadow-gold-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase text-gold font-semibold">Highest CTC</span>
              <TrendingUp className="w-4 h-4 text-gold" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-gold mb-1">
              ₹43.5 LPA
            </div>
            <p className="text-[11px] text-rvu-muted">
              Premier international tech offer, plus ₹33 LPA offer from same org
            </p>
          </div>

        </div>

        {/* Detailed Distribution Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gold-border/20 text-xs">
          
          <div className="p-3.5 rounded-xl bg-navy-surface/60 border border-white/5">
            <span className="text-[10px] font-mono text-gold uppercase block mb-1">
              High-Tier Packages (₹20+ LPA)
            </span>
            <p className="text-rvu-text font-semibold mb-0.5">Approx. 20 Offers</p>
            <p className="text-[11px] text-rvu-subtle leading-relaxed">
              Secured in the ₹20.0 – ₹33.0 LPA salary bracket.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-surface/60 border border-white/5">
            <span className="text-[10px] font-mono text-gold uppercase block mb-1">
              Mid-Tier Packages (₹10–20 LPA)
            </span>
            <p className="text-rvu-text font-semibold mb-0.5">Approx. 40–50 Offers</p>
            <p className="text-[11px] text-rvu-subtle leading-relaxed">
              Leading consulting, data, and software product roles.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-surface/60 border border-white/5">
            <span className="text-[10px] font-mono text-gold uppercase block mb-1">
              Multiple Offer Rate
            </span>
            <p className="text-rvu-text font-semibold mb-0.5">Approx. 25% Multi-Offers</p>
            <p className="text-[11px] text-rvu-subtle leading-relaxed">
              Placed students received multiple concurrent corporate offers. Minimum package approx. ₹4 LPA.
            </p>
          </div>

        </div>

        {/* Honest Transparency Notice */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-2 text-[11px] text-rvu-subtle leading-relaxed">
          <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
          <span>
            <strong>Official Transparency Notice:</strong> Figures presented represent verified institutional placement reporting published by RV University for the 2025–26 academic cycle and do not imply current live vacancies. Live opportunities are accessible to registered RVU candidates after authentication.
          </span>
        </div>

      </div>
    </div>
  );
};
