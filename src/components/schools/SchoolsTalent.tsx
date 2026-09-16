import React from 'react';
import { RVU_OFFICIAL_SCHOOLS, type SchoolInfo } from '../../data/schools';
import { GraduationCap, ArrowRight, BookOpen } from 'lucide-react';

interface SchoolsTalentProps {
  onNavigateSchool?: (schoolSlug: string) => void;
  onNavigatePortal?: (route: string) => void;
}

export const SchoolsTalent: React.FC<SchoolsTalentProps> = ({
  onNavigateSchool,
  onNavigatePortal
}) => {
  const handleSchoolClick = (school: SchoolInfo) => {
    if (onNavigateSchool) {
      onNavigateSchool(school.slug);
    } else if (onNavigatePortal) {
      onNavigatePortal(`/schools/${school.slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, school: SchoolInfo) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSchoolClick(school);
    }
  };

  return (
    <section id="schools" className="relative py-24 bg-navy-dark overflow-hidden border-b border-gold-border/40">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <GraduationCap className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              9 ACADEMIC SCHOOLS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            A MULTIDISCIPLINARY TALENT ECOSYSTEM
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted leading-relaxed">
            Access exceptional undergraduate, postgraduate, and doctoral talent shaped by liberal education, experiential learning, and cross-disciplinary thinking. Click any school to explore verified programmes, research centres, and placement pathways.
          </p>
        </div>

        {/* 9 Schools Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RVU_OFFICIAL_SCHOOLS.map((school) => {
            return (
              <button
                type="button"
                key={school.id}
                onClick={() => handleSchoolClick(school)}
                onKeyDown={(e) => handleKeyDown(e, school)}
                className="group relative text-left card-glass rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border border-gold-border/40 hover:border-gold hover:-translate-y-1.5 hover:shadow-gold-glow focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy-dark select-none"
                aria-label={`Explore official details, programmes and career pathways for ${school.name}`}
              >
                {/* Subtle circuit line indicator */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/80 transition-all duration-500 rounded-full" />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30 uppercase tracking-wide font-semibold">
                      {school.shortName}
                    </span>
                    <div className="p-1.5 rounded-lg bg-navy-surface text-rvu-muted group-hover:text-gold group-hover:bg-gold-faint group-hover:translate-x-1 transition-all duration-300 shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-2 line-clamp-2">
                    {school.name}
                  </h3>

                  <p className="text-xs text-rvu-muted leading-relaxed mb-4 line-clamp-3">
                    {school.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-rvu-subtle font-mono mb-5">
                    <BookOpen className="w-3.5 h-3.5 text-gold/80" />
                    <span>{school.programmes.length} Verified Programmes</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gold-border/40">
                  <span className="text-[10px] text-rvu-subtle uppercase tracking-wider block mb-2 font-mono">
                    Relevant Career Domains
                  </span>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {school.careerDomains.slice(0, 4).map((domain) => (
                      <span
                        key={domain}
                        className="text-[10px] px-2 py-0.5 rounded bg-navy-surface text-rvu-text border border-white/10 group-hover:border-gold/20 transition-colors"
                      >
                        {domain}
                      </span>
                    ))}
                    {school.careerDomains.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-rvu-muted">
                        +{school.careerDomains.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Explicit Action Button with subtle slide animation */}
                  <div className="flex items-center justify-between text-xs font-semibold text-gold pt-2 border-t border-white/5">
                    <span className="group-hover:underline">Explore School Profile</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
