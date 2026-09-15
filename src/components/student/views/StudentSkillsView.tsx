import React from 'react';
import { 
  CheckCircle2, 
  Briefcase, 
  Target
} from 'lucide-react';
import type { Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentSkillsViewProps {
  student: Student;
  onNavigate: (route: string) => void;
}

export const StudentSkillsView: React.FC<StudentSkillsViewProps> = ({
  student,
  onNavigate
}) => {
  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                TALENT CAPABILITY MATRIX
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Recruiter Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Skills & Gap Analysis
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Student skills connect directly to recruiter role specifications. Review your verified technical proficiencies and close identified gaps for upcoming placement drives.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/student/opportunities')}
            icon={<Briefcase className="w-4 h-4" />}
          >
            Matched Opportunities
          </Button>
        </div>
      </div>

      {/* 1. MY SKILLS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
              Current Competency Inventory
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              MY SKILLS
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{student.skills.length} Verified Skills</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {student.skills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-navy-card border border-gold-border/40 hover:border-gold/60 transition-all space-y-2 shadow-card"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  {skill.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gold border border-white/10">
                  {skill.level}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-rvu-subtle pt-1">
                <span>{skill.category}</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Lab Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SKILLS TO DEVELOP & GAP ANALYSIS */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Target Competencies
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Drive Requirements
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            SKILLS TO DEVELOP
          </h2>
        </div>

        <div className="space-y-4">
          {student.skillsToDevelop.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4 shadow-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {item.name}
                  </h3>
                  <div className="text-xs text-rvu-muted mt-0.5">
                    Gap Assessment: <strong className="text-amber-300">{item.gap}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="px-3 py-1 rounded-lg bg-[#0E1720] border border-white/10 text-rvu-muted">
                    Current: <strong className="text-white">L{item.currentLevel}/5</strong>
                  </div>
                  <span className="text-gold">&rarr;</span>
                  <div className="px-3 py-1 rounded-lg bg-gold/15 border border-gold/40 text-gold font-bold">
                    Target: <strong>L{item.targetLevel}/5</strong>
                  </div>
                </div>
              </div>

              {/* Progress Level Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-rvu-subtle">
                  <span>Novice (1)</span>
                  <span>Competent (3)</span>
                  <span>Expert Placement Grade (5)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0E1720] overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-400" 
                    style={{ width: `${(item.currentLevel / 5) * 100}%` }} 
                  />
                  <div 
                    className="h-full bg-amber-400/40 border-l border-amber-400" 
                    style={{ width: `${((item.targetLevel - item.currentLevel) / 5) * 100}%` }} 
                  />
                </div>
              </div>

              {/* Recommended University Resource */}
              <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 text-rvu-muted">
                  <Target className="w-4 h-4 text-gold shrink-0" />
                  <span>Curated Learning Track: <strong className="text-white">{item.recommendedResource}</strong></span>
                </div>
                <span className="text-gold font-mono text-[11px] shrink-0">
                  CAR Resource Library &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
