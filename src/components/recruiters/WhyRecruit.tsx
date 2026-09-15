import React from 'react';
import { 
  Zap, 
  Layers, 
  Workflow, 
  Compass, 
  Headphones, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

interface ValueCard {
  title: string;
  quote: string;
  icon: React.ReactNode;
}

const WHY_RECRUIT_PILLARS: ValueCard[] = [
  {
    title: 'INDUSTRY-READY TALENT',
    quote: 'Students develop strong academic foundations with practical and industry-relevant skills.',
    icon: <Zap className="w-5 h-5 text-gold" />
  },
  {
    title: 'DIVERSE TALENT POOL',
    quote: 'Access multidisciplinary talent across engineering, business, design, economics, media, liberal arts and law.',
    icon: <Layers className="w-5 h-5 text-gold" />
  },
  {
    title: 'INDUSTRY-INTEGRATED LEARNING',
    quote: 'Students gain exposure through internships, live projects, capstones and experiential learning.',
    icon: <Workflow className="w-5 h-5 text-gold" />
  },
  {
    title: 'FUTURE-FOCUSED CURRICULUM',
    quote: 'Students develop digital, analytical, entrepreneurial and leadership capabilities.',
    icon: <Compass className="w-5 h-5 text-gold" />
  },
  {
    title: 'SEAMLESS RECRUITMENT SUPPORT',
    quote: 'RV University\'s Corporate & Alumni Relations team supports recruiters throughout the hiring process.',
    icon: <Headphones className="w-5 h-5 text-gold" />
  },
  {
    title: 'ACADEMIC EXCELLENCE',
    quote: 'Backed by the legacy of the RV Group, RVU develops capable, ethical and responsible professionals.',
    icon: <ShieldCheck className="w-5 h-5 text-gold" />
  }
];

export const WhyRecruit: React.FC = () => {
  return (
    <section id="why-recruit" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Building2 className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              EMPLOYER VALUE PROPOSITION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            WHY RECRUIT AT RV UNIVERSITY
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Partner with an institution that prepares students to lead in technology, commerce, design, governance, and creative industries.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_RECRUIT_PILLARS.map((item) => (
            <div
              key={item.title}
              className="group card-glass rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-surface border border-gold/30 text-gold flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-gold-sm">
                  {item.icon}
                </div>

                <h3 className="text-base font-extrabold text-rvu-text font-display group-hover:text-gold transition-colors tracking-wide mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-rvu-muted leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-gold-border/30 flex items-center justify-between text-[11px] text-rvu-subtle font-mono">
                <span>RVU Placement Charter</span>
                <span className="text-gold font-bold">Verified Principle</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
