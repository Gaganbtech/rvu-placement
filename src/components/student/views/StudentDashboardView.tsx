import React from 'react';
import { 
  CheckCircle2, 
  Briefcase, 
  FileText, 
  ArrowRight, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import type { Student, Opportunity, Application, PlacementAnnouncement, PlacementCalendarEvent } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentDashboardViewProps {
  student: Student;
  opportunities: Opportunity[];
  applications: Application[];
  announcements: PlacementAnnouncement[];
  calendarEvents: PlacementCalendarEvent[];
  onNavigate: (route: string) => void;
  onOpenApplyModal: (opp: Opportunity) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  opportunities,
  applications,
  announcements,
  calendarEvents,
  onNavigate,
  onOpenApplyModal
}) => {
  // Matched opportunities (top approved & published)
  const matchedOpps = opportunities
    .filter(o => o.isPublished && o.approvedByAdmin)
    .sort((a, b) => (b.matchScoreForDemoStudent || 0) - (a.matchScoreForDemoStudent || 0))
    .slice(0, 3);

  // Active in-progress applications
  const activeApplications = applications.filter(
    a => !['OFFER_ACCEPTED', 'OFFER_DECLINED', 'REJECTED', 'WITHDRAWN'].includes(a.stage)
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* 1. HERO WELCOME BANNER */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#142332] via-[#101A22] to-[#162738] border border-gold-border/60 p-6 sm:p-8 overflow-hidden shadow-card-elevated">
        
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none bg-[radial-gradient(#CCAA68_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                RVU CAREER HUB
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                DEMO STUDENT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display">
              Welcome back, <span className="text-gold">{student.name}</span>
            </h1>

            <p className="text-sm sm:text-base text-rvu-muted max-w-xl leading-relaxed">
              Your career journey starts here. Access verified campus drives, track your recruiter pipeline, and prepare with university resources.
            </p>

            {/* Student Verified Identity Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-rvu-subtle">
              <span className="text-white font-semibold">{student.programme}</span>
              <span>•</span>
              <span className="text-rvu-muted">{student.school}</span>
              <span>•</span>
              <span className="text-gold font-semibold">Graduating {student.graduationYear}</span>
            </div>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/student/opportunities')}
              icon={<Briefcase className="w-4 h-4" />}
            >
              Explore Opportunities
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('/student/applications')}
              icon={<FileText className="w-4 h-4" />}
            >
              View Applications ({applications.length})
            </Button>
          </div>
        </div>
      </div>

      {/* 2. PLACEMENT ELIGIBILITY & CAREER READINESS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Placement Eligibility Card (CRITICAL REQUIREMENT) */}
        <div className="lg:col-span-2 rounded-2xl bg-navy-card border border-emerald-500/40 p-6 shadow-card space-y-5 relative overflow-hidden">
          
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Institutional Authority Gate
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-rvu-subtle">
                  CAR Verified
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <span>PLACEMENT ELIGIBILITY</span>
              </h2>
            </div>

            {/* Official Status Stamp */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{student.eligibilityStatus === 'ELIGIBLE' ? '✓ Eligible for Placement' : 'Under Review'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1720] border border-emerald-500/20 text-xs space-y-2">
            <div className="flex items-center justify-between text-rvu-muted">
              <span className="font-mono">Eligible for:</span>
              <strong className="text-gold font-mono">{student.eligibilityDriveScope}</strong>
            </div>
            <p className="text-rvu-subtle leading-relaxed text-[11px]">
              "{student.eligibilityRemarks}"
            </p>
          </div>

          {/* Academic Criteria Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-navy-surface border border-white/5 text-xs space-y-1">
              <span className="text-[10px] text-rvu-subtle font-mono block">CGPA (Min 7.0)</span>
              <div className="text-base font-bold text-emerald-400 font-mono flex items-center gap-1">
                <span>{student.cgpa}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] text-rvu-subtle">Target achieved</span>
            </div>

            <div className="p-3 rounded-xl bg-navy-surface border border-white/5 text-xs space-y-1">
              <span className="text-[10px] text-rvu-subtle font-mono block">Active Backlogs</span>
              <div className="text-base font-bold text-emerald-400 font-mono flex items-center gap-1">
                <span>{student.activeBacklogs}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] text-rvu-subtle">Zero pending backlog</span>
            </div>

            <div className="p-3 rounded-xl bg-navy-surface border border-white/5 text-xs space-y-1">
              <span className="text-[10px] text-rvu-subtle font-mono block">Attendance (Min 75%)</span>
              <div className="text-base font-bold text-emerald-400 font-mono flex items-center gap-1">
                <span>{student.attendancePercentage}%</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] text-rvu-subtle">Institutional clear</span>
            </div>

            <div className="p-3 rounded-xl bg-navy-surface border border-white/5 text-xs space-y-1">
              <span className="text-[10px] text-rvu-subtle font-mono block">Programme Clearance</span>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1">
                <span>B.Tech CSE</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[9px] text-rvu-subtle">2027 Cohort verified</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-rvu-subtle gap-2">
            <span>Verified by: <strong className="text-white">{student.verifiedBy}</strong> on {student.verifiedDate}</span>
            <span className="text-amber-400/90 font-mono italic">
              * Note: Eligibility is set exclusively by CAR. Students cannot self-declare.
            </span>
          </div>
        </div>

        {/* Career Readiness Score Card */}
        <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 shadow-card space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Career Readiness
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                PREPARATION INDEX
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Readiness Score
            </h2>
          </div>

          {/* Big Score Display */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0E1720] border border-gold-border/30">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 border-2 border-gold flex items-center justify-center text-gold font-mono font-bold text-2xl shadow-gold-glow">
              {student.readinessScore}
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white">Career Preparation Benchmark</div>
              <div className="text-[11px] text-rvu-muted">
                Cohort percentile: <strong className="text-gold">Top 15%</strong>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                +6 pts from profile completion
              </div>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-2.5 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] text-rvu-muted mb-1">
                <span>Profile & Credentials</span>
                <span className="text-white">{student.readinessBreakdown.profile}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-navy-surface overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${student.readinessBreakdown.profile}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-rvu-muted mb-1">
                <span>ATS Resume Quality</span>
                <span className="text-white">{student.readinessBreakdown.resume}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-navy-surface overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${student.readinessBreakdown.resume}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-rvu-muted mb-1">
                <span>Technical Preparation</span>
                <span className="text-white">{student.readinessBreakdown.technicalPrep}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-navy-surface overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${student.readinessBreakdown.technicalPrep}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-rvu-muted mb-1">
                <span>Mock Interview Drills</span>
                <span className="text-white">{student.readinessBreakdown.interviewPrep}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-navy-surface overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${student.readinessBreakdown.interviewPrep}%` }} />
              </div>
            </div>
          </div>

          {/* Prompt Required Disclaimer */}
          <div className="p-2.5 rounded-lg bg-[#0E1720] border border-white/5 text-[10px] text-rvu-subtle italic leading-tight">
            * IMPORTANT: This is a career preparation indicator. It does NOT claim that it predicts placement probability.
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('/student/preparation')}
            className="w-full justify-center"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Enhance Readiness Score
          </Button>
        </div>

      </div>

      {/* 3. ACTIVE PIPELINE & ANNOUNCEMENTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Application Pipeline */}
        <div className="lg:col-span-2 rounded-2xl bg-navy-card border border-gold-border/60 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Live Recruiter Stages
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                Active Applications Pipeline
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/student/applications')}
              className="text-xs font-mono text-gold hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View All ({applications.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeApplications.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0E1720] border border-white/5 text-rvu-muted text-xs space-y-2">
              <p>You have no active applications in progress.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('/student/opportunities')}
              >
                Browse Campus Opportunities
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeApplications.map((app) => (
                <div 
                  key={app.id}
                  className="p-4 rounded-xl bg-[#0E1720] border border-gold-border/40 hover:border-gold/60 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-gold-border/40 flex items-center justify-center text-gold font-bold text-sm">
                        {app.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-tight">
                          {app.role}
                        </h3>
                        <div className="text-xs text-rvu-muted">
                          {app.companyName} • <span className="font-mono text-gold-light">{app.compensation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 uppercase font-bold">
                        Stage: {app.stage}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate(`/student/applications/${app.id}`)}
                        className="text-xs py-1"
                      >
                        Track
                      </Button>
                    </div>
                  </div>

                  {/* Next Action Box */}
                  {app.nextAction && (
                    <div className="p-3 rounded-lg bg-navy-card/80 border border-gold-border/30 flex items-start gap-2.5 text-xs">
                      <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-white text-[11px] font-mono uppercase">
                            Next Action: {app.nextAction.title}
                          </strong>
                          <span className="text-[10px] font-mono text-amber-300">
                            Deadline: {app.nextAction.deadline}
                          </span>
                        </div>
                        <p className="text-[11px] text-rvu-muted leading-relaxed">
                          {app.nextAction.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Placement Office Announcements */}
        <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Official Notices
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                CAR DESK
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Placement Announcements
            </h2>
          </div>

          <div className="space-y-3 flex-1">
            {announcements.slice(0, 3).map((ann) => (
              <div 
                key={ann.id}
                className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 space-y-1.5 hover:border-gold-border/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                    ann.priority === 'URGENT' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-gold/15 text-gold border border-gold/30'
                  }`}>
                    {ann.category}
                  </span>
                  <span className="text-rvu-subtle">{ann.publishedDate}</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {ann.title}
                </h4>
                <p className="text-[11px] text-rvu-muted line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>

          {calendarEvents.length > 0 && (
            <div className="p-3 rounded-xl bg-[#0E1720] border border-gold-border/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                <div className="leading-tight">
                  <span className="text-[9px] text-rvu-subtle font-mono uppercase block">Next Calendar Milestone</span>
                  <span className="text-white font-medium text-[11px] truncate max-w-[170px] block">{calendarEvents[0].title}</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/student/calendar')}
                className="text-gold text-[10px] font-mono hover:underline shrink-0"
              >
                {calendarEvents[0].date} &rarr;
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-white/5 text-center">
            <button
              onClick={() => onNavigate('/student/resources')}
              className="text-xs font-mono text-gold hover:underline"
            >
              View Official Placement Guidelines & Policies &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* 4. MATCHED OPPORTUNITIES PREVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Curated Recommendations
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-rvu-subtle">
                Demo Match
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Matched Opportunities
            </h2>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('/student/opportunities')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            All Open Postings
          </Button>
        </div>

        {/* Disclaimer for demo match score */}
        <div className="p-3 rounded-xl bg-[#0F1822] border border-gold-border/30 text-xs text-rvu-subtle flex items-center justify-between">
          <span>
            Matched using your verified programme (<strong>{student.programme}</strong>), CGPA, and key skills.
          </span>
          <span className="font-mono text-[10px] text-gold hidden sm:inline">
            * Note: UI/Demo match score; not an AI guarantee.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {matchedOpps.map((opp) => (
            <div
              key={opp.id}
              className="rounded-2xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all p-5 flex flex-col justify-between space-y-4 group shadow-card"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold">
                    {opp.companyName.charAt(0)}
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                    {opp.matchScoreForDemoStudent}% Match
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-gold transition-colors leading-snug">
                    {opp.role}
                  </h3>
                  <div className="text-xs text-rvu-muted mt-0.5">
                    {opp.companyName}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-rvu-subtle font-mono">
                  <div className="flex items-center justify-between">
                    <span>Package:</span>
                    <strong className="text-emerald-400">{opp.ctcLpa}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location:</span>
                    <span className="text-white">{opp.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Deadline:</span>
                    <span className="text-amber-300">{opp.applicationDeadline}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {opp.requiredSkills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-[#0E1720] border border-white/10 text-rvu-muted">
                      {s}
                    </span>
                  ))}
                  {opp.requiredSkills.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0E1720] text-rvu-subtle">
                      +{opp.requiredSkills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenApplyModal(opp)}
                  className="flex-1 justify-center text-xs py-1.5"
                >
                  Apply Now
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigate(`/student/opportunities/${opp.id}`)}
                  className="text-xs py-1.5 px-2.5"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
