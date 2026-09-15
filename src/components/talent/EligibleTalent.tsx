import React, { useState } from 'react';
import { ELIGIBLE_STUDENTS_BREAKDOWN, TOTAL_ELIGIBLE_STUDENTS } from '../../data/eligibleStudents';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';

export const EligibleTalent: React.FC = () => {
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(ELIGIBLE_STUDENTS_BREAKDOWN[0].schoolId);

  const toggleExpand = (id: string) => {
    setExpandedSchoolId(prev => prev === id ? null : id);
  };

  return (
    <section id="talent" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      
      {/* Background Technology Pattern */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
            <Users className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold font-mono">
              TALENT AUDIT DATA
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight mb-4">
            {TOTAL_ELIGIBLE_STUDENTS.toLocaleString()} STUDENTS ELIGIBLE FOR RECRUITMENT
          </h2>
          
          <p className="text-base sm:text-lg text-rvu-muted">
            Official breakdown of eligible candidates across undergraduate and postgraduate programmes reported by RV University.
          </p>
        </div>

        {/* Talent Distribution Cards & Programme Breakdown */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {ELIGIBLE_STUDENTS_BREAKDOWN.map((item) => {
            const isExpanded = expandedSchoolId === item.schoolId;
            const percent = ((item.totalEligible / TOTAL_ELIGIBLE_STUDENTS) * 100).toFixed(1);

            return (
              <div
                key={item.schoolId}
                className="card-glass rounded-2xl overflow-hidden border border-gold-border transition-all"
              >
                {/* School Bar Header */}
                <button
                  onClick={() => toggleExpand(item.schoolId)}
                  className="w-full p-5 sm:p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-rvu-text font-display">
                        {item.schoolName}
                      </h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-gold-faint text-gold border border-gold/30">
                        {percent}%
                      </span>
                    </div>

                    {/* Progress Proportion Bar */}
                    <div className="h-1.5 w-full max-w-md bg-navy-surface rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-gold-gradient rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-extrabold text-gold font-display block">
                        {item.totalEligible}
                      </span>
                      <span className="text-[10px] text-rvu-subtle uppercase font-mono">
                        Eligible Candidates
                      </span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-navy-surface text-gold border border-gold/20">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Programme Breakdown */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gold-border/40 bg-navy-surface/50 animate-in slide-in-from-top-2 duration-200">
                    <div className="text-xs font-semibold text-gold uppercase tracking-wider mb-3 font-mono">
                      Programme-wise Eligible Student Count
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {item.programmes.map((prog) => (
                        <div
                          key={prog.programmeName}
                          className="p-3.5 rounded-xl bg-navy-card border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-xs font-semibold text-rvu-text block">
                              {prog.programmeName}
                            </span>
                            <span className="text-[10px] text-rvu-muted">
                              {prog.level}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-extrabold text-gold font-mono">
                              {prog.eligibleCount}
                            </span>
                            <span className="text-[9px] text-rvu-subtle block uppercase">
                              Eligible
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Source and Transparency Citation */}
        <div className="mt-10 text-center">
          <p className="text-xs text-rvu-muted max-w-xl mx-auto font-mono">
            Source: RV University official placement information, 2025–26. Numbers denote students verified as eligible for recruitment drives during the reporting period.
          </p>
        </div>

      </div>
    </section>
  );
};
