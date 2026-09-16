import React, { useState } from 'react';
import { 
  ShieldCheck,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Brain
} from 'lucide-react';
import type { Student, InterviewPrepQuestion } from '../../../data/platform/types';
import { useStudentStore } from '../../../data/platform/studentStore';
import { StudentIntelligenceService } from '../../../services/studentIntelligenceService';
import { 
  OFFICIAL_PREPARATION_TRACKS, 
  OFFICIAL_INTERVIEW_PREP_QUESTIONS 
} from '../../../data/platform/preparationData';
import { Button } from '../../ui/Button';

interface StudentPreparationViewProps {
  student: Student;
  onNavigate: (route: string) => void;
}

export const StudentPreparationView: React.FC<StudentPreparationViewProps> = ({
  student,
  onNavigate
}) => {
  const store = useStudentStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedTrackId, setExpandedTrackId] = useState<string>(OFFICIAL_PREPARATION_TRACKS[0]?.id || '');
  const [activeStarQuestion, setActiveStarQuestion] = useState<InterviewPrepQuestion | null>(null);

  // Dynamic deterministic readiness analysis
  const readiness = StudentIntelligenceService.calculateCareerReadiness(
    student,
    store.documents,
    store.completedPreparationTaskIds
  );

  const completedTaskIds = store.completedPreparationTaskIds;
  const totalTasks = OFFICIAL_PREPARATION_TRACKS.reduce((acc, t) => acc + t.tasks.length, 0);
  const completedCount = completedTaskIds.length;
  const taskProgressPct = Math.round((completedCount / (totalTasks || 1)) * 100);

  const categories = [
    { label: 'All Modules (8)', value: 'ALL' },
    { label: 'DSA & Systems', value: 'TECHNICAL' },
    { label: 'Coding Sprint', value: 'CODING' },
    { label: 'Aptitude', value: 'APTITUDE' },
    { label: 'STAR Interview', value: 'INTERVIEW' },
    { label: 'Communication', value: 'COMMUNICATION' },
    { label: 'Resume ATS', value: 'RESUME' },
    { label: 'Group Discussion', value: 'GROUP_DISCUSSION' },
    { label: 'Cloud & AI', value: 'DOMAIN' },
  ];

  const filteredTracks = selectedCategory === 'ALL'
    ? OFFICIAL_PREPARATION_TRACKS
    : OFFICIAL_PREPARATION_TRACKS.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                RVU CAREER READINESS OPERATING SYSTEM
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                8 Structured Tracks
              </span>
              <span className="text-[10px] font-mono text-rvu-muted bg-white/5 px-2 py-0.5 rounded border border-white/10">
                Cohort: {student.programme} {student.graduationYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Placement Preparation & Interview Mastery
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-xl leading-relaxed">
              Curated preparation tracks designed by RV University placement faculty and corporate hiring panels. Track your task completion, practice behavioral STAR responses, and resolve core competency gaps.
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="p-6 rounded-2xl bg-[#0E1720] border-2 border-gold flex items-center gap-5 shadow-gold-glow shrink-0">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-mono font-bold text-gold">
                {readiness.overallScore}
              </div>
              <span className="text-[10px] font-mono text-rvu-subtle uppercase">out of 100</span>
            </div>
            <div className="space-y-1 border-l border-white/10 pl-4">
              <div className="text-xs font-bold text-white">Readiness Index</div>
              <div className="text-xs text-emerald-400 font-mono">Tasks: {completedCount}/{totalTasks} ({taskProgressPct}%)</div>
              <div className="text-[10px] text-rvu-muted">Formula-Driven • Zero Fake Scores</div>
            </div>
          </div>
        </div>

        {/* Mandatory Prompt Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#0F1822] border border-gold-border/40 text-xs text-rvu-muted flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-mono text-[11px] block">TRANSPARENT EVALUATION DISCLOSURE:</strong>
            <p className="text-[11px] text-rvu-subtle leading-relaxed">
              This score is calculated deterministically across 5 institutional pillars: Profile Completeness (20%), ATS Resume Compliance (20%), Verified Skills (20%), Preparation Track Tasks (20%), and Academic Standing (20%). It serves as a skill-building diagnostic, not a placement guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Pillar Score Breakdown */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
          5-Pillar Diagnostic Score Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {readiness.components.map((comp) => (
            <div
              key={comp.id}
              className="p-5 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4 hover:border-gold/60 transition-all shadow-card flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">
                    {comp.name}
                  </h3>
                  <span className="text-base font-mono font-bold text-gold">
                    {comp.score}%
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#0E1720] overflow-hidden">
                  <div 
                    className="h-full bg-gold rounded-full transition-all" 
                    style={{ width: `${comp.score}%` }} 
                  />
                </div>

                <p className="text-xs text-rvu-muted leading-relaxed pt-1">
                  {comp.description}
                </p>
                <div className="text-[11px] font-mono text-rvu-subtle">
                  {comp.details}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                <span className="text-rvu-subtle">Weight: {comp.weight}%</span>
                <span className="font-semibold text-emerald-400">
                  {comp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8 Preparation Tracks Navigation & Task Checklists */}
      <div className="p-6 sm:p-8 rounded-2xl bg-navy-card border border-gold-border/40 space-y-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
              SYSTEMATIC SYLLABUS
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              Official RVU Preparation Tracks ({filteredTracks.length})
            </h2>
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('/student/skills')}
              icon={<Brain className="w-3.5 h-3.5" />}
            >
              Skill Gap Matrix
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-gold text-navy-dark font-bold'
                  : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tracks Accordion / List */}
        <div className="space-y-4">
          {filteredTracks.map(track => {
            const isExpanded = expandedTrackId === track.id;
            const completedInTrack = track.tasks.filter(t => completedTaskIds.includes(t.id)).length;
            const trackProgress = Math.round((completedInTrack / (track.tasks.length || 1)) * 100);
            const totalEstHours = Math.max(1, Math.round(track.tasks.reduce((a, b) => a + (b.estimatedMinutes || 60), 0) / 60));

            return (
              <div 
                key={track.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded 
                    ? 'border-gold bg-[#121D28]' 
                    : 'border-white/10 bg-[#0E1720] hover:border-gold/40'
                }`}
              >
                {/* Track Header */}
                <div 
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedTrackId(isExpanded ? '' : track.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-base shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {track.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                          {totalEstHours}h total
                        </span>
                      </div>
                      <p className="text-xs text-rvu-muted line-clamp-1 mt-0.5">
                        {track.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {completedInTrack} / {track.tasks.length} Done
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400 rounded-full transition-all"
                          style={{ width: `${trackProgress}%` }}
                        />
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gold" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-rvu-subtle" />
                    )}
                  </div>
                </div>

                {/* Track Tasks List (Collapsible) */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-white/5 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-rvu-subtle block">
                      Target Tasks ({track.tasks.length}) — Click checkbox to mark completed:
                    </span>
                    <div className="space-y-2">
                      {track.tasks.map(task => {
                        const isDone = completedTaskIds.includes(task.id);

                        return (
                          <div
                            key={task.id}
                            className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                              isDone
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-navy-card/60 border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => store.togglePreparationTask(task.id)}
                                className={`mt-0.5 p-1 rounded-lg border transition-all ${
                                  isDone
                                    ? 'bg-emerald-500 text-navy-dark border-emerald-500'
                                    : 'bg-[#0E1720] border-white/20 text-rvu-subtle hover:border-gold'
                                }`}
                                title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-navy-dark" />
                                ) : (
                                  <Circle className="w-4 h-4" />
                                )}
                              </button>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-semibold ${isDone ? 'text-emerald-200 line-through' : 'text-white'}`}>
                                    {task.title}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-rvu-subtle">
                                    {task.difficulty}
                                  </span>
                                </div>
                                <p className="text-xs text-rvu-muted mt-0.5 leading-relaxed">
                                  {task.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 text-xs font-mono text-rvu-subtle">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gold" />
                                {task.estimatedMinutes}m
                              </span>
                              {task.resourceLink && (
                                <a
                                  href={task.resourceLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gold hover:underline flex items-center gap-1"
                                >
                                  <span>Guide</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STAR Behavioral Interview Practice Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-navy-card border border-gold-border/40 space-y-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
              OFFICIAL RVU RUBRIC
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              STAR Behavioral Interview Bank ({OFFICIAL_INTERVIEW_PREP_QUESTIONS.length} Questions)
            </h2>
            <p className="text-xs text-rvu-muted max-w-xl">
              Real behavioral questions evaluated using the Situation, Task, Action, Result framework during RVU campus partner interviews.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIAL_INTERVIEW_PREP_QUESTIONS.map(q => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-[#0E1720] border border-white/10 hover:border-gold/60 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                    {q.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    STAR Model
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  "{q.question}"
                </h3>
                <p className="text-xs text-rvu-muted leading-relaxed">
                  Focus: {q.guidance}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-rvu-subtle">
                  CAR Rubric Included
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveStarQuestion(q)}
                  className="text-xs"
                >
                  View Sample Guide
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STAR Question Modal */}
      {activeStarQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navy-card border border-gold-border rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-bold">
                  STAR BEHAVIORAL INTERVIEW GUIDE
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  {activeStarQuestion.question}
                </h3>
                <span className="text-xs text-rvu-muted">
                  Category: {activeStarQuestion.category}
                </span>
              </div>
              <button
                onClick={() => setActiveStarQuestion(null)}
                className="text-rvu-subtle hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 text-rvu-text space-y-1">
                <span className="font-bold text-gold block font-mono">GUIDANCE:</span>
                <p>{activeStarQuestion.guidance}</p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white block font-mono">STAR FRAMEWORK BREAKDOWN:</span>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5">
                    <strong className="text-gold block">Situation:</strong>
                    <span className="text-rvu-muted">{activeStarQuestion.starFramework.situation}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5">
                    <strong className="text-gold block">Task:</strong>
                    <span className="text-rvu-muted">{activeStarQuestion.starFramework.task}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5">
                    <strong className="text-emerald-400 block">Action:</strong>
                    <span className="text-rvu-muted">{activeStarQuestion.starFramework.action}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5">
                    <strong className="text-emerald-400 block">Result:</strong>
                    <span className="text-rvu-muted">{activeStarQuestion.starFramework.result}</span>
                  </div>
                </div>
              </div>

              {activeStarQuestion.sampleAnswerSummary && (
                <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-white block font-mono">SUMMARY / TAKEAWAY:</span>
                  <p className="text-rvu-muted">{activeStarQuestion.sampleAnswerSummary}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveStarQuestion(null)}
              >
                Close Practice Guide
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
