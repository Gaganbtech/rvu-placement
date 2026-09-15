import React, { useState } from 'react';
import { RVU_OFFICIAL_SCHOOLS, type SchoolInfo } from '../../data/schools';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

export const SchoolsTalent: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolInfo>(RVU_OFFICIAL_SCHOOLS[0]);

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
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Access exceptional undergraduate and postgraduate talent shaped by liberal education, experiential learning, and cross-disciplinary thinking.
          </p>
        </div>

        {/* 9 Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RVU_OFFICIAL_SCHOOLS.map((school) => {
            const isSelected = selectedSchool.id === school.id;
            return (
              <div
                key={school.id}
                onClick={() => setSelectedSchool(school)}
                className={`group card-glass rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-gold shadow-gold-glow -translate-y-1.5'
                    : 'hover:border-gold/50 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30 uppercase tracking-wide">
                      {school.shortName}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-rvu-muted group-hover:text-gold transition-colors shrink-0" />
                  </div>

                  <h3 className="text-lg font-bold text-rvu-text font-display group-hover:text-gold transition-colors mb-2 line-clamp-2">
                    {school.name}
                  </h3>

                  <p className="text-xs text-rvu-muted leading-relaxed mb-5 line-clamp-3">
                    {school.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gold-border/40">
                  <span className="text-[10px] text-rvu-subtle uppercase tracking-wider block mb-2 font-mono">
                    Relevant Career Domains
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {school.careerDomains.slice(0, 4).map((domain) => (
                      <span
                        key={domain}
                        className="text-[10px] px-2 py-0.5 rounded bg-navy-surface text-rvu-text border border-white/10"
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
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
