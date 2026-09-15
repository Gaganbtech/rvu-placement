import React from 'react';
import { VERIFIED_PLACEMENT_PERFORMANCE } from '../../data/placementPerformance';
import { Trophy } from 'lucide-react';

export const PlacementPerformance: React.FC = () => {
  return (
    <section id="performance" className="relative py-24 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      
      {/* Background Technology Pattern */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Trophy className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              REPORTED 2025–26 PLACEMENT FIGURES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            PLACEMENT PERFORMANCE
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Verified compensation milestones, multi-offer achievements, and reported salary tier distributions across campus recruiters.
          </p>
        </div>

        {/* Top Highlights 4-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="card-glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-rvu-muted uppercase">Total Offers</span>
              <span className="text-xs px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/20">
                2025–26
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rvu-text font-display mb-1">
              {VERIFIED_PLACEMENT_PERFORMANCE.totalOffersDisplay}
            </div>
            <p className="text-xs text-rvu-muted">
              {VERIFIED_PLACEMENT_PERFORMANCE.totalOffersDetailed}
            </p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-rvu-muted uppercase">Recruiter Network</span>
              <span className="text-xs px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/20">
                Active
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rvu-text font-display mb-1">
              {VERIFIED_PLACEMENT_PERFORMANCE.recruitingOrgsDisplay}
            </div>
            <p className="text-xs text-rvu-muted">
              Recruiting organizations participating during the 2025–26 period.
            </p>
          </div>

          <div className="card-glass rounded-2xl p-6 border-gold/40 shadow-gold-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gold uppercase font-bold">Highest Compensation</span>
              <span className="text-xs px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                Aviatrix
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-display mb-1">
              {VERIFIED_PLACEMENT_PERFORMANCE.highestPackageDisplay}
            </div>
            <p className="text-xs text-rvu-muted">
              Highest package by Aviatrix (additional reported offer of ₹33 LPA from Aviatrix).
            </p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-rvu-muted uppercase">Multiple Offers</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                High Demand
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rvu-text font-display mb-1">
              {VERIFIED_PLACEMENT_PERFORMANCE.multipleOffersPercent}
            </div>
            <p className="text-xs text-rvu-muted">
              Of placed candidates secured multiple corporate job offers.
            </p>
          </div>

        </div>

        {/* Visual Salary Distribution Card */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold-border/40">
            <div>
              <h3 className="text-xl font-bold text-rvu-text font-display">
                Reported Salary Distribution
              </h3>
              <p className="text-xs text-rvu-muted mt-0.5">
                Compensation tiers reported across 2025–26 recruitment drives.
              </p>
            </div>

            <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-navy-surface border border-gold/30 text-gold shrink-0">
              Minimum Campus Compensation: {VERIFIED_PLACEMENT_PERFORMANCE.minimumCompensationDisplay}
            </div>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERIFIED_PLACEMENT_PERFORMANCE.salaryDistribution.map((tier) => (
              <div
                key={tier.range}
                className="p-5 rounded-xl bg-navy-surface/80 border border-gold/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-rvu-text font-display">
                    {tier.range}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-gold-faint text-gold border border-gold/30">
                    {tier.offerCountLabel}
                  </span>
                </div>

                <div className="h-2 w-full bg-navy-dark rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(tier.countApprox / 85) * 100}%` }}
                    className="h-full bg-gold-gradient rounded-full"
                  />
                </div>

                <p className="text-xs text-rvu-muted leading-relaxed">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gold-border/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rvu-subtle font-mono">
            <span>{VERIFIED_PLACEMENT_PERFORMANCE.sourceLabel}</span>
            <span>All values reported in Indian Rupees (INR)</span>
          </div>
        </div>

      </div>
    </section>
  );
};
