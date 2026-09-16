import React, { useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  CheckCircle2,
  Bookmark,
  Sparkles
} from 'lucide-react';
import type { Opportunity, Student, Application } from '../../../data/platform/types';
import { useStudentStore } from '../../../data/platform/studentStore';
import { StudentIntelligenceService } from '../../../services/studentIntelligenceService';
import { Button } from '../../ui/Button';

interface StudentOpportunityDetailViewProps {
  opportunityId: string;
  student: Student;
  opportunities: Opportunity[];
  applications: Application[];
  onNavigate: (route: string) => void;
  onOpenApplyModal: (opp: Opportunity) => void;
}

export const StudentOpportunityDetailView: React.FC<StudentOpportunityDetailViewProps> = ({
  opportunityId,
  student,
  opportunities,
  applications,
  onNavigate,
  onOpenApplyModal
}) => {
  const store = useStudentStore();
  const opp = opportunities.find(o => o.id === opportunityId);

  const matchAnalysis = useMemo(() => {
    if (!opp) return null;
    return StudentIntelligenceService.calculateOpportunityMatch(student, opp);
  }, [opp, student]);

  if (!opp || !matchAnalysis) {
    return (
      <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 space-y-4">
        <h2 className="text-xl font-bold text-white">Opportunity Not Found</h2>
        <p className="text-sm text-rvu-muted">The requested recruitment posting could not be retrieved.</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('/student/opportunities')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Opportunities
        </Button>
      </div>
    );
  }

  const existingApp = applications.find(a => a.opportunityId === opp.id);
  const isApplied = !!existingApp;
  const isSaved = store.isOpportunitySaved(opp.id);

  // Verify student criteria
  const isCgpaEligible = student.cgpa >= opp.minCgpa;
  const isBacklogEligible = student.activeBacklogs <= opp.maxBacklogsAllowed;
  const isProgEligible = opp.eligibleProgrammes.some(p => student.programme.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(student.programme.toLowerCase()));
  const isGradYearEligible = opp.eligibleGraduationYears.includes(student.graduationYear);
  const isOverallEligible = isCgpaEligible && isBacklogEligible && isProgEligible && isGradYearEligible;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Back link & Top actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/student/opportunities')}
          className="flex items-center gap-2 text-xs font-mono text-rvu-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <button
          onClick={() => store.toggleSaveOpportunity(opp.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
            isSaved 
              ? 'bg-gold text-navy-dark border-gold font-bold shadow-md' 
              : 'bg-navy-card border-white/10 text-rvu-subtle hover:text-gold hover:border-gold/40'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          <span>{isSaved ? 'Saved in Watchlist' : 'Bookmark Role'}</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-6 shadow-card-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 border-2 border-gold/40 flex items-center justify-center text-gold font-bold text-2xl shadow-gold-glow shrink-0">
              {opp.companyName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-rvu-muted font-medium">
                  {opp.companyName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CAR Approved
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                  {opp.type}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {opp.role}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle pt-1">
                <span className="flex items-center gap-1.5 text-white">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  {opp.location}
                </span>
                <span>•</span>
                <span>Work Mode: <strong className="text-white">{opp.workMode}</strong></span>
                <span>•</span>
                <span>Openings: <strong className="text-white">{opp.openingsCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-rvu-subtle block">Package / CTC</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                {opp.ctcLpa}
              </div>
              {opp.stipendPerMonth && (
                <div className="text-[11px] font-mono text-gold-light">
                  Stipend: {opp.stipendPerMonth}
                </div>
              )}
            </div>

            {isApplied ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate(`/student/applications/${existingApp.id}`)}
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              >
                Track Application ({existingApp.stage})
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenApplyModal(opp)}
                disabled={!isOverallEligible}
                icon={<Briefcase className="w-4 h-4" />}
              >
                {isOverallEligible ? 'Apply Now' : 'Not Eligible'}
              </Button>
            )}
          </div>
        </div>

        {/* Timelines Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5">
            <span className="text-[10px] text-rvu-subtle block">Application Deadline</span>
            <strong className="text-amber-300">{opp.applicationDeadline}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5">
            <span className="text-[10px] text-rvu-subtle block">Hiring Drive Date</span>
            <strong className="text-white">{opp.driveDate}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5">
            <span className="text-[10px] text-rvu-subtle block">Deterministic Match</span>
            <strong className="text-gold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {matchAnalysis.score}% Match
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5">
            <span className="text-[10px] text-rvu-subtle block">Selection Mode</span>
            <strong className="text-emerald-400">Campus / Proctored</strong>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details & Selection Rounds */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About the Role */}
          <div className="p-6 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4">
            <h2 className="text-base font-bold text-gold uppercase tracking-wider font-mono">
              Role Overview & Responsibilities
            </h2>
            <p className="text-xs sm:text-sm text-rvu-muted leading-relaxed">
              {opp.description}
            </p>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-mono text-white uppercase font-bold">
                Key Responsibilities:
              </h3>
              <ul className="space-y-2 text-xs text-rvu-muted">
                {opp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Selection Process */}
          <div className="p-6 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4">
            <h2 className="text-base font-bold text-gold uppercase tracking-wider font-mono">
              Selection Rounds & Evaluation Pipeline
            </h2>
            <p className="text-xs text-rvu-subtle">
              Coordinated via RVU Placement & Career Management System in partnership with {opp.companyName}.
            </p>

            <div className="space-y-3">
              {opp.selectionProcess.map((round) => (
                <div 
                  key={round.roundNumber}
                  className="p-4 rounded-xl bg-[#0E1720] border border-white/5 flex items-start gap-4"
                >
                  <div className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-mono font-bold text-xs shrink-0 mt-0.5">
                    R{round.roundNumber}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">
                        {round.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-surface text-rvu-muted border border-white/10">
                        {round.mode}
                      </span>
                    </div>
                    <p className="text-[11px] text-rvu-muted leading-relaxed">
                      {round.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Eligibility Audit Checklist & Skills Breakdown */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-navy-card border border-emerald-500/40 space-y-4 shadow-card">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Automated Audit Gate
              </span>
              <h2 className="text-base font-bold text-white font-display">
                Eligibility Verification
              </h2>
            </div>

            <p className="text-xs text-rvu-muted leading-relaxed">
              Comparison between placement drive requirements and your verified RVU academic record:
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-rvu-subtle block text-[10px]">Minimum CGPA Required</span>
                  <span className="text-white font-bold">{opp.minCgpa} (Your CGPA: {student.cgpa})</span>
                </div>
                {isCgpaEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-rose-400 text-[10px]">Below Min</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-rvu-subtle block text-[10px]">Maximum Backlogs Allowed</span>
                  <span className="text-white font-bold">{opp.maxBacklogsAllowed} (Your Backlogs: {student.activeBacklogs})</span>
                </div>
                {isBacklogEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-rose-400 text-[10px]">Ineligible</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-rvu-subtle block text-[10px]">Eligible Programme</span>
                  <span className="text-white font-bold truncate max-w-[170px] block">{student.programme}</span>
                </div>
                {isProgEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-rose-400 text-[10px]">Mismatch</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#0E1720] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-rvu-subtle block text-[10px]">Graduation Year</span>
                  <span className="text-white font-bold">{student.graduationYear}</span>
                </div>
                {isGradYearEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-rose-400 text-[10px]">Mismatch</span>
                )}
              </div>
            </div>

            {/* Overall Verdict */}
            <div className={`p-3.5 rounded-xl border text-xs font-mono text-center space-y-1 ${
              isOverallEligible 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              <div className="font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isOverallEligible ? 'You Meet All Requirements' : 'Eligibility Criteria Unmet'}</span>
              </div>
              <p className="text-[10px] text-rvu-subtle">
                Audited against CAR Central Registry
              </p>
            </div>
          </div>

          {/* Required Skills Matrix with Match Highlighting */}
          <div className="p-6 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gold uppercase tracking-wider font-mono">
                Skills Alignment
              </h2>
              <span className="text-xs font-mono text-emerald-400">
                {matchAnalysis.matchedSkills.length} / {opp.requiredSkills.length} matched
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {opp.requiredSkills.map((skill) => {
                const isMatch = matchAnalysis.matchedSkills.some((s: string) => s.toLowerCase() === skill.toLowerCase());
                return (
                  <span 
                    key={skill}
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-colors ${
                      isMatch
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-[#0E1720] border border-white/10 text-rvu-muted'
                    }`}
                  >
                    {isMatch ? `✓ ${skill}` : skill}
                  </span>
                );
              })}
            </div>

            {matchAnalysis.missingSkills.length > 0 && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-amber-300 uppercase block">
                  Recommended Skill Focus:
                </span>
                <p className="text-[11px] text-rvu-muted">
                  Building proficiency in <strong className="text-white">{matchAnalysis.missingSkills.join(', ')}</strong> will further boost your interview qualification odds.
                </p>
                <button
                  onClick={() => onNavigate('/student/preparation')}
                  className="text-xs font-mono text-gold hover:underline flex items-center gap-1"
                >
                  <span>Open Preparation Tracks &rarr;</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
