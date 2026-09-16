import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Sparkles,
  AlertCircle,
  Building2,
  Award
} from 'lucide-react';
import type { 
  Student, 
  Opportunity, 
  Application, 
  PlacementAnnouncement, 
  PlacementCalendarEvent,
  PlacementDrive,
  StudentDocument,
  Offer
} from '../../../data/platform/types';
import { StudentIntelligenceService } from '../../../services/studentIntelligenceService';
import { CareerReadinessHero } from '../components/CareerReadinessHero';
import { TodaysPriorities } from '../components/TodaysPriorities';
import { CareerJourneyFlow } from '../components/CareerJourneyFlow';
import { StudentAICareerAssistant } from '../components/StudentAICareerAssistant';

interface StudentDashboardViewProps {
  student: Student;
  opportunities: Opportunity[];
  applications: Application[];
  announcements: PlacementAnnouncement[];
  calendarEvents: PlacementCalendarEvent[];
  placementDrives?: PlacementDrive[];
  documents?: StudentDocument[];
  offers?: Offer[];
  savedOpportunityIds?: string[];
  completedTaskIds?: string[];
  onToggleSaveOpportunity?: (oppId: string) => void;
  onNavigate: (route: string) => void;
  onOpenApplyModal: (opp: Opportunity) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  opportunities,
  applications,
  announcements,
  calendarEvents,
  placementDrives = [],
  documents = [],
  offers = [],
  savedOpportunityIds = [],
  completedTaskIds = [],
  onToggleSaveOpportunity,
  onNavigate,
  onOpenApplyModal
}) => {
  const [calendarFilter, setCalendarFilter] = useState<'TODAY' | 'THIS_WEEK' | 'THIS_MONTH'>('THIS_WEEK');

  // Compute Career Readiness
  const readiness = StudentIntelligenceService.calculateCareerReadiness(
    student,
    documents,
    completedTaskIds
  );

  // Compute Today's Priorities
  const priorities = StudentIntelligenceService.getTodaysPriorities(
    student,
    opportunities,
    applications,
    placementDrives,
    documents,
    calendarEvents
  );

  // Filter approved & published opportunities
  const publishedOpps = opportunities
    .filter(o => o.isPublished && o.approvedByAdmin)
    .slice(0, 4);

  // Application Pipeline stats
  const totalApplied = applications.length;
  const inReviewCount = applications.filter(a => ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED'].includes(a.stage)).length;
  const assessmentCount = applications.filter(a => a.stage === 'ASSESSMENT').length;
  const interviewCount = applications.filter(a => a.stage === 'INTERVIEW').length;
  const offerCount = offers.length;

  // Recent applications (top 3)
  const recentApplications = applications.slice(0, 3);

  // Filter calendar events
  const filteredEvents = calendarEvents.filter(e => {
    if (calendarFilter === 'TODAY') {
      return e.date.toLowerCase().includes('today') || e.date.includes('16 Sep');
    }
    return true;
  }).slice(0, 3);

  const getApplicationForOpp = (oppId: string) => {
    return applications.find(a => a.opportunityId === oppId);
  };

  const activeResume = documents.find(d => d.type === 'RESUME' && d.isActiveForApplications);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* ==================================================== */}
      {/* 4. TOP HEADER: GREETING & COMMAND CENTER BANNER */}
      {/* ==================================================== */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#142332] via-[#101A22] to-[#162738] border border-gold-border/60 p-6 sm:p-8 overflow-hidden shadow-card-elevated">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none bg-[radial-gradient(#CCAA68_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-gold uppercase font-bold px-2.5 py-1 rounded-full bg-gold-faint border border-gold/30">
                RVU CAREER OPERATING SYSTEM
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Session
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
              Good morning, <span className="text-gold">{student.name || 'Scholar'}</span>
            </h1>

            <p className="text-sm sm:text-base text-rvu-muted max-w-xl leading-relaxed">
              Here’s what matters for your career journey today. Review your readiness score, track recruiter pipelines, and prepare with institutional focus.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-rvu-subtle">
              <span className="text-white font-semibold">{student.programme}</span>
              <span>•</span>
              <span className="text-rvu-muted">{student.school}</span>
              <span>•</span>
              <span className="text-gold font-semibold">Class of {student.graduationYear}</span>
              <span>•</span>
              <span className="text-emerald-400">CGPA {student.cgpa.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('/student/opportunities')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Opportunities</span>
            </button>
            <button
              onClick={() => onNavigate('/student/applications')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-surface border border-gold/30 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
            >
              <FileText className="w-4 h-4 text-gold" />
              <span>My Applications ({applications.length})</span>
            </button>
          </div>
        </div>

        {/* Institutional Placement Announcement Ticker */}
        {announcements && announcements.length > 0 && (
          <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-between gap-3 text-xs font-mono text-rvu-text">
            <div className="flex items-center gap-2 overflow-hidden">
              <AlertCircle className="w-4 h-4 text-gold shrink-0" />
              <span className="text-gold font-bold uppercase shrink-0">CAR Notice:</span>
              <span className="text-white truncate">{announcements[0].title} — {announcements[0].content}</span>
            </div>
            <button
              onClick={() => onNavigate('/student/notifications')}
              className="text-gold text-[11px] hover:underline shrink-0 flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 4.1 CAREER READINESS HERO */}
      {/* ==================================================== */}
      <CareerReadinessHero
        readiness={readiness}
        onNavigate={onNavigate}
      />

      {/* ==================================================== */}
      {/* 4.2 TODAY'S PRIORITIES */}
      {/* ==================================================== */}
      <TodaysPriorities
        priorities={priorities}
        onNavigate={onNavigate}
      />

      {/* ==================================================== */}
      {/* 5. MY CAREER JOURNEY PROGRESSION */}
      {/* ==================================================== */}
      <CareerJourneyFlow
        applications={applications}
        offers={offers}
        drives={placementDrives}
        onNavigate={onNavigate}
      />

      {/* ==================================================== */}
      {/* 5.1 CORE WORKSPACE CARDS */}
      {/* ==================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div 
          onClick={() => onNavigate('/student/applications')}
          className="p-4 rounded-xl bg-navy-surface border border-gold-border/30 hover:border-gold/60 cursor-pointer transition-all hover:-translate-y-0.5 shadow-card"
        >
          <div className="flex items-center justify-between text-rvu-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Applications</span>
            <FileText className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalApplied}</div>
          <div className="text-[10px] text-rvu-subtle mt-1">
            {totalApplied === 0 ? 'No applications yet' : `${inReviewCount} in review`}
          </div>
        </div>

        <div 
          onClick={() => onNavigate('/student/drives')}
          className="p-4 rounded-xl bg-navy-surface border border-gold-border/30 hover:border-gold/60 cursor-pointer transition-all hover:-translate-y-0.5 shadow-card"
        >
          <div className="flex items-center justify-between text-rvu-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Upcoming Drives</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{placementDrives.length}</div>
          <div className="text-[10px] text-rvu-subtle mt-1">
            {placementDrives.length === 0 ? 'No placement drives' : 'Campus recruitment'}
          </div>
        </div>

        <div 
          onClick={() => onNavigate('/student/calendar')}
          className="p-4 rounded-xl bg-navy-surface border border-gold-border/30 hover:border-gold/60 cursor-pointer transition-all hover:-translate-y-0.5 shadow-card"
        >
          <div className="flex items-center justify-between text-rvu-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Upcoming Interviews</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{interviewCount}</div>
          <div className="text-[10px] text-rvu-subtle mt-1">
            {interviewCount === 0 ? 'No upcoming interviews' : 'Live round schedule'}
          </div>
        </div>

        <div 
          onClick={() => onNavigate('/student/offers')}
          className="p-4 rounded-xl bg-navy-surface border border-gold-border/30 hover:border-gold/60 cursor-pointer transition-all hover:-translate-y-0.5 shadow-card"
        >
          <div className="flex items-center justify-between text-rvu-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Offers</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{offerCount}</div>
          <div className="text-[10px] text-rvu-subtle mt-1">
            {offerCount === 0 ? 'No offers received' : 'Verified letters'}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4.3 OPPORTUNITY MATCHES (RECOMMENDED FOR YOU) */}
      {/* ==================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold block">
              ALIGNED POSITIONS
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              RECOMMENDED FOR YOU
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/student/opportunities')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline"
          >
            <span>View All Opportunities ({opportunities.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {publishedOpps.length === 0 ? (
          <div className="p-8 rounded-xl bg-navy-surface border border-dashed border-gold-border/40 text-center space-y-2">
            <p className="text-sm font-semibold text-white">No active opportunities</p>
            <p className="text-xs text-rvu-muted">Explore opportunities to start your career journey.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publishedOpps.map((opp) => {
            const match = StudentIntelligenceService.calculateOpportunityMatch(student, opp);
            const app = getApplicationForOpp(opp.id);
            const isSaved = savedOpportunityIds.includes(opp.id);

            return (
              <div
                key={opp.id}
                className="card-glass rounded-xl p-5 border border-gold-border/30 hover:border-gold/60 transition-all flex flex-col justify-between bg-navy-surface shadow-card group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                        {opp.companyName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs text-rvu-muted font-medium block">
                          {opp.companyName}
                        </span>
                        <h3 className="text-sm font-bold text-white font-display group-hover:text-gold transition-colors">
                          {opp.role}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                        {match.score}% Match
                      </span>
                      {onToggleSaveOpportunity && (
                        <button
                          onClick={() => onToggleSaveOpportunity(opp.id)}
                          className="p-1.5 rounded-lg text-rvu-subtle hover:text-gold hover:bg-white/5 transition-colors"
                          title={isSaved ? 'Unsave' : 'Save opportunity'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-gold fill-gold/20" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-navy-dark/90 border border-white/5 text-[11px] text-rvu-subtle font-mono mb-3">
                    {match.explanation}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {opp.requiredSkills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono font-bold text-gold">
                    {opp.ctcLpa}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate(`/student/opportunities/${opp.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-rvu-text hover:text-gold hover:border-gold transition-all"
                    >
                      View Details
                    </button>
                    {app ? (
                      <button
                        onClick={() => onNavigate(`/student/applications/${app.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                      >
                        Applied ({app.stage})
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenApplyModal(opp)}
                        className="px-3 py-1.5 rounded-lg bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 6. APPLICATION COMMAND CENTER */}
      {/* ==================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold block">
              RECRUITER PIPELINE
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              APPLICATION COMMAND CENTER
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/student/applications')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline"
          >
            <span>View All Applications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Funnel Counters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-navy-surface border border-gold-border/20 text-center">
            <span className="text-[10px] font-mono uppercase text-rvu-subtle block">Applied</span>
            <span className="text-2xl font-bold font-mono text-white">{totalApplied}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-surface border border-gold-border/20 text-center">
            <span className="text-[10px] font-mono uppercase text-rvu-subtle block">Screening</span>
            <span className="text-2xl font-bold font-mono text-sky-400">{inReviewCount}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-surface border border-gold-border/20 text-center">
            <span className="text-[10px] font-mono uppercase text-rvu-subtle block">Assessment</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{assessmentCount}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-surface border border-gold-border/20 text-center">
            <span className="text-[10px] font-mono uppercase text-rvu-subtle block">Interview</span>
            <span className="text-2xl font-bold font-mono text-purple-400">{interviewCount}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-surface border border-gold-border/20 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono uppercase text-rvu-subtle block">Offers</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{offerCount}</span>
          </div>
        </div>

        {/* Recent Applications Card */}
        {recentApplications.length > 0 && (
          <div className="card-glass rounded-xl p-4 border border-gold-border/30 bg-navy-surface space-y-2.5">
            {recentApplications.map(app => (
              <div
                key={app.id}
                onClick={() => onNavigate(`/student/applications/${app.id}`)}
                className="p-3 rounded-lg bg-navy-dark hover:bg-white/5 border border-white/5 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-xs">
                    {app.companyName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {app.role}
                    </h4>
                    <p className="text-[11px] text-rvu-muted">
                      {app.companyName} • Applied {app.submittedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gold border border-gold/20">
                    {app.stage}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-rvu-subtle" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 7. UPCOMING EVENTS / CAREER CALENDAR */}
      {/* ==================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold block">
              SCHEDULE & DEADLINES
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              UPCOMING CAREER EVENTS
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-lg bg-navy-dark border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => setCalendarFilter('TODAY')}
                className={`px-2 py-1 rounded ${calendarFilter === 'TODAY' ? 'bg-gold text-navy-dark font-bold' : 'text-rvu-muted'}`}
              >
                Today
              </button>
              <button
                onClick={() => setCalendarFilter('THIS_WEEK')}
                className={`px-2 py-1 rounded ${calendarFilter === 'THIS_WEEK' ? 'bg-gold text-navy-dark font-bold' : 'text-rvu-muted'}`}
              >
                This Week
              </button>
              <button
                onClick={() => setCalendarFilter('THIS_MONTH')}
                className={`px-2 py-1 rounded ${calendarFilter === 'THIS_MONTH' ? 'bg-gold text-navy-dark font-bold' : 'text-rvu-muted'}`}
              >
                This Month
              </button>
            </div>

            <button
              onClick={() => onNavigate('/student/calendar')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
            >
              <span>Open Calendar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="card-glass rounded-2xl p-6 border border-white/10 bg-navy-surface text-center">
            <Calendar className="w-8 h-8 text-rvu-subtle mx-auto mb-2" />
            <p className="text-xs text-rvu-muted">No upcoming career events for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                onClick={() => onNavigate('/student/calendar')}
                className="card-glass rounded-xl p-4 border border-gold-border/30 bg-navy-surface hover:border-gold/60 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gold border border-gold/20">
                      {event.eventType}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300">
                      {event.date}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">
                    {event.title}
                  </h4>
                  <p className="text-[11px] text-rvu-muted line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-rvu-subtle">
                  <span>{event.startTime} - {event.endTime}</span>
                  <span className="text-gold">{event.venueOrLink}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 11 & 12. SKILLS INTELLIGENCE & DOCUMENT VAULT ROW */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Skills Intelligence Preview (6 cols) */}
        <div className="lg:col-span-6 card-glass rounded-2xl p-6 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                  CAPABILITY RADAR
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  Skills Intelligence
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/student/skills')}
                className="text-xs font-semibold text-gold hover:underline inline-flex items-center gap-1"
              >
                <span>Full Matrix</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {student.skills.slice(0, 6).map(s => (
                <div
                  key={s.id}
                  className="px-2.5 py-1.5 rounded-lg bg-navy-dark border border-gold-border/20 flex items-center gap-2 text-xs"
                >
                  <span className="text-white font-medium">{s.name}</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/5 text-gold">
                    {s.level}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-navy-dark/90 border border-white/5 text-xs text-rvu-muted">
              <div className="flex items-center gap-1.5 text-gold font-mono text-[11px] mb-1 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>RECOMMENDED FOCUS AREA</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Strengthening distributed systems and dynamic programming algorithms will increase alignment with tier-1 recruiters.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4">
            <button
              onClick={() => onNavigate('/student/preparation')}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-gold hover:text-navy-dark hover:border-gold border border-white/10 text-xs font-semibold text-white transition-all text-center"
            >
              Build Missing Skills in Prep Center
            </button>
          </div>
        </div>

        {/* Document Vault & Profile Health Preview (6 cols) */}
        <div className="lg:col-span-6 card-glass rounded-2xl p-6 border border-gold-border/30 bg-navy-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                  CREDENTIALS & COMPLIANCE
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  Primary Placement Resume
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/student/documents')}
                className="text-xs font-semibold text-gold hover:underline inline-flex items-center gap-1"
              >
                <span>Document Vault</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {activeResume ? (
              <div className="p-4 rounded-xl bg-navy-dark border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{activeResume.fileName}</h4>
                      <p className="text-[10px] font-mono text-rvu-subtle">
                        {activeResume.fileSize} • Uploaded {activeResume.uploadedDate}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    ACTIVE FOR DRIVES
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-rvu-muted pt-2 border-t border-white/5 font-mono">
                  <span>ATS Format: Tier-1 Rubric Verified</span>
                  <span className="text-emerald-400">✓ SIS Synced</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-navy-dark border border-amber-500/30 text-center">
                <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-white">No active resume designated</p>
                <p className="text-[11px] text-rvu-muted">Upload your primary placement resume to enable one-click applications.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-3">
            <span className="text-xs font-mono text-rvu-subtle">
              {documents.length} verified document(s) in vault
            </span>
            <button
              onClick={() => onNavigate('/student/documents')}
              className="px-3 py-1.5 rounded-lg bg-gold text-navy-dark font-bold text-xs shadow-gold-sm hover:bg-gold-highlight transition-all"
            >
              Manage Documents
            </button>
          </div>
        </div>

      </div>

      {/* ==================================================== */}
      {/* 15. RVU CAREER AI ASSISTANT PANEL */}
      {/* ==================================================== */}
      <StudentAICareerAssistant
        student={student}
        opportunities={opportunities}
        applications={applications}
        documents={documents}
        onNavigate={onNavigate}
      />

    </div>
  );
};
