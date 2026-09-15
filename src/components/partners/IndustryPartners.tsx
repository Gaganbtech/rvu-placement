import React, { useState } from 'react';
import { INDUSTRY_PARTNERS, PARTNER_CATEGORIES } from '../../data/partners';
import { Building2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface IndustryPartnersProps {
  onOpenRecruiterModal: () => void;
}

export const IndustryPartners: React.FC<IndustryPartnersProps> = ({
  onOpenRecruiterModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredPartners = INDUSTRY_PARTNERS.filter((partner) => {
    if (selectedCategory === 'All') return true;
    return partner.category === selectedCategory;
  });

  return (
    <section id="partners" className="relative py-24 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      
      {/* Background Technology Grid */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Building2 className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold">
              CORPORATE ENGAGEMENT ECOSYSTEM
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            OUR INDUSTRY NETWORK
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Building meaningful connections between academia and industry across global technology leaders, financial institutions, and innovation labs.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {PARTNER_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gold text-navy-dark font-bold shadow-gold-sm scale-105'
                    : 'bg-navy-surface text-rvu-muted hover:text-rvu-text border border-gold/20 hover:border-gold/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* High-Finish Partner Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="group card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon and Tier Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-navy-surface border border-gold/30 text-gold flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                    {partner.tier}
                  </span>
                </div>

                {/* Partner Name (Neutral institutional label) */}
                <h3 className="text-base font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-2">
                  {partner.name}
                </h3>

                <p className="text-xs text-rvu-muted mb-4">
                  Engagement: <span className="text-rvu-text font-medium">{partner.engagementType}</span>
                </p>

                {/* Domain badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {partner.hiringDomains.map((domain) => (
                    <span
                      key={domain}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-rvu-muted border border-white/10"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Network Note */}
              <div className="pt-3 border-t border-gold-border/40 flex items-center justify-between text-[11px] text-rvu-subtle">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Placement & Internship MoU</span>
                </span>
                <span className="font-mono text-gold text-[10px]">Active Partner</span>
              </div>

            </div>
          ))}
        </div>

        {/* Recruiter Partnership Invitation Banner */}
        <div className="card-glass rounded-2xl p-6 sm:p-8 border border-gold/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-rvu-text font-display">
              Become an RV University Industry Partner
            </h4>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-xl">
              Partner with our Central Placement Cell for on-campus drives, joint curriculum workshops, student capstone sponsorships, and pre-placement hiring pipelines.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowUpRight className="w-4 h-4" />}
            onClick={onOpenRecruiterModal}
            className="shrink-0"
          >
            Partner With Us
          </Button>
        </div>

      </div>
    </section>
  );
};
