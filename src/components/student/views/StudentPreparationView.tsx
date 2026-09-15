import React from 'react';
import { 
  Sparkles, 
  Code, 
  MessageSquare, 
  FileText, 
  ShieldCheck
} from 'lucide-react';
import type { Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentPreparationViewProps {
  student: Student;
  onNavigate: (route: string) => void;
}

export const StudentPreparationView: React.FC<StudentPreparationViewProps> = ({
  student,
  onNavigate
}) => {
  const readinessMetrics = [
    {
      title: 'Profile & Academic Verification',
      score: student.readinessBreakdown.profile,
      desc: 'All 5 semesters of transcripts, SIS synchronization, and eligibility clearance complete.',
      status: 'Excellent',
      color: 'text-emerald-400'
    },
    {
      title: 'ATS Resume Compliance',
      score: student.readinessBreakdown.resume,
      desc: 'Tested against Tier-1 campus rubric. Clean typography, quantified impact metrics, verified skills.',
      status: 'Strong',
      color: 'text-gold'
    },
    {
      title: 'Core Technical Skills',
      score: student.readinessBreakdown.skills,
      desc: 'Proficiency in React, JavaScript, Python, and Git verified via university lab coursework.',
      status: 'Target Reached',
      color: 'text-sky-400'
    },
    {
      title: 'DSA & Systems Preparation',
      score: student.readinessBreakdown.technicalPrep,
      desc: 'Dynamic programming, graph algorithms, and relational indexing benchmarks in progress.',
      status: 'Action Recommended',
      color: 'text-amber-300'
    },
    {
      title: 'Professional Communication',
      score: student.readinessBreakdown.communication,
      desc: 'Verbal reasoning, behavioral question handling (STAR method), and executive presentation.',
      status: 'Satisfactory',
      color: 'text-indigo-300'
    },
    {
      title: 'Mock Interview Performance',
      score: student.readinessBreakdown.interviewPrep,
      desc: 'Completed 1 peer mock interview. Recommend scheduling 1 CAR faculty advisory simulation.',
      status: 'Slot Available',
      color: 'text-rose-300'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                RVU CAREER READINESS BENCHMARK
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Cohort Analytics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Career Readiness
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-xl leading-relaxed">
              Comprehensive diagnostics evaluating your academic profile, ATS resume strength, algorithmic readiness, and behavioral simulation score.
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="p-6 rounded-2xl bg-[#0E1720] border-2 border-gold flex items-center gap-5 shadow-gold-glow shrink-0">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-mono font-bold text-gold">
                {student.readinessScore}
              </div>
              <span className="text-[10px] font-mono text-rvu-subtle uppercase">out of 100</span>
            </div>
            <div className="space-y-0.5 border-l border-white/10 pl-4">
              <div className="text-xs font-bold text-white">Preparation Status</div>
              <div className="text-xs text-emerald-400 font-mono">Ahead of 85% of cohort</div>
              <div className="text-[10px] text-rvu-muted">+6 pts this month</div>
            </div>
          </div>
        </div>

        {/* Mandatory Prompt Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#0F1822] border border-gold-border/40 text-xs text-rvu-muted flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-mono text-[11px] block">IMPORTANT NOTICE ON READINESS INDEX:</strong>
            <p className="text-[11px] text-rvu-subtle leading-relaxed">
              This is a career preparation indicator intended to guide your self-study and workshop participation. It does <strong>NOT</strong> claim or guarantee to predict actual recruitment probability or placement outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
          Diagnostic Score Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {readinessMetrics.map((metric) => (
            <div
              key={metric.title}
              className="p-5 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4 hover:border-gold/60 transition-all shadow-card flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">
                    {metric.title}
                  </h3>
                  <span className={`text-base font-mono font-bold ${metric.color}`}>
                    {metric.score}%
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#0E1720] overflow-hidden">
                  <div 
                    className="h-full bg-gold rounded-full transition-all" 
                    style={{ width: `${metric.score}%` }} 
                  />
                </div>

                <p className="text-xs text-rvu-muted leading-relaxed pt-1">
                  {metric.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                <span className="text-rvu-subtle">Status:</span>
                <span className={`font-semibold ${metric.color}`}>
                  {metric.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Prep Modules */}
      <div className="p-6 sm:p-8 rounded-2xl bg-navy-card border border-gold-border/40 space-y-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
              Targeted Interventions
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              Recommended Preparation Tracks
            </h2>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('/student/skills')}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Review Skills & Gaps
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Code className="w-4 h-4 text-gold" />
              <span>DSA Dynamic Programming Sprint</span>
            </div>
            <p className="text-xs text-rvu-muted leading-relaxed">
              Curated list of 25 classical DP problems frequently asked by tier-1 campus partners (Aviatrix, Target, Cisco).
            </p>
            <div className="text-[10px] font-mono text-emerald-400">
              Module 4 • Est. 6 hours
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <MessageSquare className="w-4 h-4 text-gold" />
              <span>STAR Behavioral Response Lab</span>
            </div>
            <p className="text-xs text-rvu-muted leading-relaxed">
              Master the Situation, Task, Action, Result framework for situational interview questions and HR alignment rounds.
            </p>
            <div className="text-[10px] font-mono text-emerald-400">
              Interactive Lab • Est. 2 hours
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FileText className="w-4 h-4 text-gold" />
              <span>ATS Resume Optimizer</span>
            </div>
            <p className="text-xs text-rvu-muted leading-relaxed">
              Pre-screen your resume against recruiter keyword models and PDF parsing parsers before submitting to new drives.
            </p>
            <div className="text-[10px] font-mono text-emerald-400">
              Automated • Real-time
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
