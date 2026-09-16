import React from 'react';
import {
  Briefcase,
  Users,
  FileText,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  PlusCircle,
  ChevronRight,
  ShieldCheck,
  Code2,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterDashboardViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const RecruiterDashboardView: React.FC<RecruiterDashboardViewProps> = ({
  store,
  onNavigate
}) => {
  const activeRecruiter = store.activeRecruiter;
  const activeCompany = store.activeCompany;
  const opps = store.recruiterOpportunities;
  const apps = store.recruiterApplications;
  const candidates = store.recruiterCandidates;
  const interviews = store.recruiterInterviews;
  const offers = store.recruiterOffers;
  const assessments = store.recruiterAssessments;

  // Key KPI stats
  const publishedOppsCount = opps.filter(o => o.lifecycleState === 'PUBLISHED').length;
  const pendingOppsCount = opps.filter(o => o.lifecycleState === 'SUBMITTED' || o.lifecycleState === 'UNDER_REVIEW').length;
  const activeInterviewsCount = interviews.filter(i => i.status === 'SCHEDULED').length;
  const verifiedOffersCount = offers.filter(o => o.placementOfficeVerified).length;
  const pendingOffersCount = offers.filter(o => !o.placementOfficeVerified).length;

  // Pipeline stage breakdown
  const stageCounts = {
    APPLIED: apps.filter(a => a.stage === 'APPLIED').length,
    UNDER_REVIEW: apps.filter(a => a.stage === 'UNDER_REVIEW').length,
    SHORTLISTED: apps.filter(a => a.stage === 'SHORTLISTED').length,
    ASSESSMENT: apps.filter(a => a.stage === 'ASSESSMENT').length,
    INTERVIEW: apps.filter(a => a.stage === 'INTERVIEW').length,
    SELECTED: apps.filter(a => a.stage === 'SELECTED').length,
    OFFER: apps.filter(a => a.stage === 'OFFER').length
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101A22] via-[#19252F] to-[#20303A] border border-[#CCAA68]/30 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#CCAA68]/15 border border-[#CCAA68]/40 text-[#D8B978] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#CCAA68]" />
              <span>RVU CORPORATE CONNECT • RECRUITMENT WORKSPACE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome, {activeRecruiter?.name || 'Recruiter'}
            </h1>
            <p className="text-sm text-gray-300">
              Partner organization: <strong className="text-white font-medium">{activeCompany?.name || 'Hiring Organization'}</strong>. Manage job postings, review pre-screened RVU engineering & science candidates, conduct proctored assessments, schedule interviews, and issue verified offers.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>CAR Official Partner</span>
              </span>
              <span>•</span>
              <span className="italic text-[#CCAA68]">"Go, change the world"</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={() => onNavigate('/recruiter/opportunities/new')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Job Opportunity</span>
            </button>
            <button
              onClick={() => onNavigate('/recruiter/messages')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#20303A] hover:bg-[#20303A]/80 text-white font-medium text-xs border border-[#CCAA68]/20 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-[#CCAA68]" />
              <span>Contact CAR Office</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#CCAA68]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 6 Core Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div 
          onClick={() => onNavigate('/recruiter/opportunities')}
          className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Opportunities</span>
            <Briefcase className="w-4 h-4 text-[#CCAA68]" />
          </div>
          <div className="text-2xl font-bold text-white">{opps.length}</div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
            <span className="text-emerald-400">{publishedOppsCount} Live</span>
            {pendingOppsCount > 0 && <span className="text-amber-400">{pendingOppsCount} Review</span>}
          </div>
        </div>

        <div 
          onClick={() => onNavigate('/recruiter/applications')}
          className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Applications</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{apps.length}</div>
          <div className="text-[10px] text-gray-400 mt-1">
            <span>{stageCounts.SHORTLISTED + stageCounts.ASSESSMENT + stageCounts.INTERVIEW} active in funnel</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('/recruiter/candidates')}
          className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Candidates</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{candidates.length}</div>
          <div className="text-[10px] text-gray-400 mt-1">
            <span>Pre-screened RVU Cohort</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('/recruiter/assessments')}
          className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Assessments</span>
            <Code2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{assessments.length}</div>
          <div className="text-[10px] text-gray-400 mt-1">
            <span>Proctored Coding Tests</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('/recruiter/interviews')}
          className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{interviews.length}</div>
          <div className="text-[10px] text-gray-400 mt-1">
            <span className="text-blue-400">{activeInterviewsCount} upcoming</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('/recruiter/offers')}
          className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Offers Issued</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{offers.length}</div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
            <span className="text-emerald-400">{verifiedOffersCount} CAR Verified</span>
            {pendingOffersCount > 0 && <span className="text-amber-400">{pendingOffersCount} Pending</span>}
          </div>
        </div>
      </div>

      {/* Recruitment Pipeline Funnel Status */}
      <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Recruitment Lifecycle Funnel
            </h2>
            <p className="text-xs text-gray-400">
              Live status across all active {activeCompany?.name || 'company'} candidate pipelines
            </p>
          </div>
          <button
            onClick={() => onNavigate('/recruiter/applications')}
            className="text-xs text-[#CCAA68] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All Applications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
          {[
            { stage: 'APPLIED', label: '1. Applied', count: stageCounts.APPLIED, color: 'text-gray-300', bg: 'bg-[#20303A]' },
            { stage: 'UNDER_REVIEW', label: '2. Screening', count: stageCounts.UNDER_REVIEW, color: 'text-blue-300', bg: 'bg-blue-500/10 border border-blue-500/20' },
            { stage: 'SHORTLISTED', label: '3. Shortlisted', count: stageCounts.SHORTLISTED, color: 'text-amber-300', bg: 'bg-amber-500/10 border border-amber-500/20' },
            { stage: 'ASSESSMENT', label: '4. Assessment', count: stageCounts.ASSESSMENT, color: 'text-purple-300', bg: 'bg-purple-500/10 border border-purple-500/20' },
            { stage: 'INTERVIEW', label: '5. Interview', count: stageCounts.INTERVIEW, color: 'text-indigo-300', bg: 'bg-indigo-500/10 border border-indigo-500/20' },
            { stage: 'SELECTED', label: '6. Selected', count: stageCounts.SELECTED, color: 'text-teal-300', bg: 'bg-teal-500/10 border border-teal-500/20' },
            { stage: 'OFFER', label: '7. Offered', count: stageCounts.OFFER, color: 'text-emerald-300', bg: 'bg-emerald-500/10 border border-emerald-500/20' }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(`/recruiter/applications?stage=${item.stage}`)}
              className={`p-3 rounded-lg ${item.bg} hover:border-[#CCAA68]/40 cursor-pointer transition-all`}
            >
              <div className="text-[11px] font-medium text-gray-400">{item.label}</div>
              <div className={`text-xl font-bold mt-1 ${item.color}`}>{item.count}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">candidates</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Section: CAR Approval Gate & Recent Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CAR Approval Gate Box */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#CCAA68]">
              <ShieldCheck className="w-5 h-5 text-[#CCAA68]" />
              <h3 className="text-sm font-semibold text-white">
                CAR Placement Approval Desk
              </h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              In accordance with RV University Placement Policy, every opportunity and drive requires institutional review by the Office of Corporate & Alumni Relations (CAR) before being published to eligible students.
            </p>

            <div className="p-3 rounded-lg bg-[#20303A] border border-[#CCAA68]/20 space-y-2">
              <div className="text-[11px] font-medium text-gray-300">Approval Workflow:</div>
              <ul className="text-[11px] text-gray-400 space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">Submission:</strong> Recruiter submits job specification & CTC.</li>
                <li><strong className="text-white">Academic Audit:</strong> CAR audits CGPA and eligible schools.</li>
                <li><strong className="text-white">Publication:</strong> Published to matching RVU cohorts.</li>
              </ul>
            </div>

            {/* Opportunities awaiting review */}
            {pendingOppsCount > 0 ? (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pendingOppsCount} Opportunity Pending Review</span>
                </div>
                <div className="text-[11px] text-gray-300">
                  CAR is reviewing compensation breakdown and campus lab slots.
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All company postings are active & published!</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('/recruiter/messages')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-xs text-[#CCAA68] border border-[#CCAA68]/30 font-medium transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Message CAR Placement Coordinator</span>
          </button>
        </div>

        {/* Live Opportunities Table */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Active Opportunities</h3>
              <p className="text-xs text-gray-400">Manage your campus postings & review candidate applications</p>
            </div>
            <button
              onClick={() => onNavigate('/recruiter/opportunities/new')}
              className="text-xs text-[#CCAA68] hover:underline flex items-center gap-1 font-medium"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {opps.slice(0, 3).map(opp => (
              <div
                key={opp.id}
                onClick={() => onNavigate(`/recruiter/opportunities/${opp.id}`)}
                className="p-3.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 border border-[#CCAA68]/15 hover:border-[#CCAA68]/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">{opp.role}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      opp.lifecycleState === 'PUBLISHED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : opp.lifecycleState === 'SUBMITTED'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-gray-500/15 text-gray-400'
                    }`}>
                      {opp.lifecycleState}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 flex flex-wrap items-center gap-2">
                    <span>{opp.type}</span>
                    <span>•</span>
                    <span className="text-[#CCAA68]">{opp.ctcLpa}</span>
                    <span>•</span>
                    <span>Min CGPA: {opp.minCgpa}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 text-xs">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400">Applications</div>
                    <div className="font-semibold text-white">
                      {apps.filter(a => a.opportunityId === opp.id).length}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {opps.length > 3 && (
            <div className="text-center pt-2">
              <button
                onClick={() => onNavigate('/recruiter/opportunities')}
                className="text-xs text-[#CCAA68] hover:underline font-medium"
              >
                View all {opps.length} opportunities &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Upcoming Interviews & Recent Candidate Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews */}
        <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#CCAA68]" />
              <h3 className="text-sm font-semibold text-white">Upcoming Interviews</h3>
            </div>
            <button
              onClick={() => onNavigate('/recruiter/interviews')}
              className="text-xs text-[#CCAA68] hover:underline font-medium"
            >
              View Schedule
            </button>
          </div>

          {interviews.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              No interviews scheduled currently.
            </div>
          ) : (
            <div className="space-y-2.5">
              {interviews.slice(0, 3).map(interview => (
                <div
                  key={interview.id}
                  onClick={() => onNavigate(`/recruiter/interviews/${interview.id}`)}
                  className="p-3 rounded-lg bg-[#20303A] border border-[#CCAA68]/15 hover:border-[#CCAA68]/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {interview.studentName}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">
                      Round {interview.roundNumber}: {interview.roundTitle}
                    </div>
                    <div className="text-[10px] text-[#CCAA68] mt-0.5 flex items-center gap-1.5">
                      <span>{interview.date}</span>
                      <span>•</span>
                      <span>{interview.timeSlot}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      interview.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {interview.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Candidates Spotlight */}
        <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#CCAA68]" />
              <h3 className="text-sm font-semibold text-white">Recent Candidate Applications</h3>
            </div>
            <button
              onClick={() => onNavigate('/recruiter/applications')}
              className="text-xs text-[#CCAA68] hover:underline font-medium"
            >
              All Applications
            </button>
          </div>

          {apps.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              No applications received yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {apps.slice(0, 3).map(app => {
                const candidate = candidates.find(c => c.id === app.studentId);
                return (
                  <div
                    key={app.id}
                    onClick={() => onNavigate(`/recruiter/applications/${app.id}`)}
                    className="p-3 rounded-lg bg-[#20303A] border border-[#CCAA68]/15 hover:border-[#CCAA68]/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {candidate?.name || 'RVU Student'} ({app.studentId})
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        Applied for: {app.role}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        CGPA: <strong className="text-emerald-400">{candidate?.cgpa || '8.42'}</strong> • {candidate?.programme || 'B.Tech CSE'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#CCAA68]/20 text-[#D8B978]">
                        {app.stage}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
