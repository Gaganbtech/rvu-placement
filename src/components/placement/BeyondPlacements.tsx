import React from 'react';
import { Network, Briefcase, GraduationCap, Users2, Sparkles, CheckCircle2 } from 'lucide-react';

interface EcosystemCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlights: string[];
}

const ECOSYSTEM_CARDS: EcosystemCard[] = [
  {
    title: 'Industry Engagement',
    description: 'Structured collaborations with Fortune 500 enterprises, GCCs, and emerging unicorns for joint curriculum advisory, industry roundtables, and executive lectures.',
    icon: <Network className="w-6 h-6 text-gold" />,
    highlights: ['Corporate Advisory Councils', 'Guest CXO Masterclasses', 'Joint Hackathons & Case Studies']
  },
  {
    title: 'Internships',
    description: 'Mandatory experiential industry immersions embedded within all degree tracks, providing pre-final year students practical exposure and PPO conversion avenues.',
    icon: <Briefcase className="w-6 h-6 text-gold" />,
    highlights: ['Summer & Winter Internships', 'Pre-Placement Offers (PPOs)', 'Live Industry Problem Statements']
  },
  {
    title: 'Career Preparation',
    description: 'Intensive readiness clinics covering advanced data structures, domain-specific coding, system design, case deconstruction, and executive communication mastery.',
    icon: <GraduationCap className="w-6 h-6 text-gold" />,
    highlights: ['Proctored Coding Diagnostics', 'STAR Interview Simulations', 'ATS-Optimized Portfolio Reviews']
  },
  {
    title: 'Alumni & Corporate Relations',
    description: 'A global network of accomplished alumni mentoring graduating students, offering referral pipelines, and deepening institutional industry linkages.',
    icon: <Users2 className="w-6 h-6 text-gold" />,
    highlights: ['1:1 Alumni Mentorship Tracks', 'Executive Networking Receptions', 'Startup Incubation Synergy']
  }
];

export const BeyondPlacements: React.FC = () => {
  return (
    <section id="ecosystem" className="relative py-24 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      
      {/* Subtle Circuit Background */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              CORPORATE & ALUMNI RELATIONS (CAR)
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-5">
            BEYOND PLACEMENTS
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted leading-relaxed">
            RV University's Corporate & Alumni Relations (CAR) team serves as the interface between students, industry, alumni, startups, Global Capability Centres, and academic schools.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ECOSYSTEM_CARDS.map((card) => (
            <div
              key={card.title}
              className="group card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-surface border border-gold/30 text-gold flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-gold-sm">
                  {card.icon}
                </div>

                <h3 className="text-lg font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-2">
                  {card.title}
                </h3>

                <p className="text-xs text-rvu-muted leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gold-border/40 space-y-2">
                {card.highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-rvu-text/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
