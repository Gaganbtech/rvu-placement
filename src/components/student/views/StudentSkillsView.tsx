import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Briefcase, 
  Target,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import type { Student } from '../../../data/platform/types';
import { useStudentStore } from '../../../data/platform/studentStore';
import { StudentIntelligenceService } from '../../../services/studentIntelligenceService';
import { Button } from '../../ui/Button';

interface StudentSkillsViewProps {
  student: Student;
  onNavigate: (route: string) => void;
}

export const StudentSkillsView: React.FC<StudentSkillsViewProps> = ({
  student,
  onNavigate
}) => {
  const store = useStudentStore();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Compute live market demand skill gaps using the active published opportunities in the portal
  const marketSkillGaps = StudentIntelligenceService.analyzeSkillGaps(student, store.opportunities);

  // Skill categories
  const categories = ['ALL', ...Array.from(new Set(student.skills.map(s => s.category)))];

  const filteredSkills = activeCategory === 'ALL'
    ? student.skills
    : student.skills.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                TALENT CAPABILITY MATRIX
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Verified & Recruiter Matched
              </span>
              <span className="text-[10px] font-mono text-rvu-muted bg-white/5 px-2 py-0.5 rounded border border-white/10">
                Cohort: {student.programme} 2027
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-2">
              Skills Intelligence & Competency Gap Analysis
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Your verified technical and domain skills match against live campus recruiter requirements. Address high-demand skill gaps to unlock greater eligibility across upcoming hiring drives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('/student/preparation')}
              icon={<BookOpen className="w-4 h-4" />}
            >
              Preparation Tracks
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/student/opportunities')}
              icon={<Briefcase className="w-4 h-4" />}
            >
              View Opportunities
            </Button>
          </div>
        </div>
      </div>

      {/* 1. MY VERIFIED SKILLS INVENTORY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
              VERIFIED INVENTORY
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              My Core Skills ({student.skills.length})
            </h2>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-gold text-navy-dark font-bold'
                    : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
                }`}
              >
                {cat === 'ALL' ? 'All Skills' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-navy-card border border-gold-border/40 hover:border-gold/60 transition-all space-y-3 shadow-card"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  {skill.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                  {skill.level}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-rvu-subtle pt-1 border-t border-white/5">
                <span>{skill.category}</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Lab Coursework Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. REAL-TIME MARKET DEMAND SKILL GAPS */}
      {marketSkillGaps.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                HIGH DEMAND OPPORTUNITY GAPS
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Live Drive Requirements
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Market Demand Gaps in Active RVU Openings
            </h2>
            <p className="text-xs text-rvu-muted">
              Skills requested by campus recruiters that are not yet listed in your verified profile. Adding or completing courses in these skills increases your matching score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketSkillGaps.slice(0, 4).map((gap) => (
              <div
                key={gap.skillName}
                className="p-5 rounded-2xl bg-navy-card border border-gold-border/40 hover:border-gold/60 transition-all space-y-4 shadow-card flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {gap.skillName}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Required in {gap.targetDemandCount} Active Roles
                    </span>
                  </div>

                  <p className="text-xs text-rvu-muted leading-relaxed">
                    Recruiter roles targeting this: <strong className="text-white">{gap.targetRoleExamples.join(', ')}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-gold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Track: {gap.recommendedTrackTitle}</span>
                  </span>

                  <button
                    onClick={() => onNavigate('/student/preparation')}
                    className="text-xs font-mono text-gold hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Build This Skill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SKILLS TO DEVELOP (CURATED DEVELOPMENT ROADMAP) */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
              FACULTY ROADMAP
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
              Semester 6 Action Plan
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Target Competency Benchmarks
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
                    Faculty Assessment: <strong className="text-amber-300">{item.gap}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="px-3 py-1 rounded-lg bg-[#0E1720] border border-white/10 text-rvu-muted">
                    Current: <strong className="text-white">Level {item.currentLevel}/5</strong>
                  </div>
                  <span className="text-gold">&rarr;</span>
                  <div className="px-3 py-1 rounded-lg bg-gold/15 border border-gold/40 text-gold font-bold">
                    Target: <strong>Level {item.targetLevel}/5</strong>
                  </div>
                </div>
              </div>

              {/* Progress Level Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-rvu-subtle">
                  <span>Foundational (L1)</span>
                  <span>Working Knowledge (L3)</span>
                  <span>Campus Placement Ready (L5)</span>
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
                <button
                  onClick={() => onNavigate('/student/preparation')}
                  className="text-gold font-mono text-[11px] shrink-0 hover:underline flex items-center gap-1"
                >
                  <span>Open Preparation Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
