import React from 'react';
import {
  Users,
  Building2,
  Briefcase,
  Award,
  FileCheck,
  CalendarCheck,
  AlertTriangle,
  Upload,
  Layers,
  Megaphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import { HISTORICAL_PLACEMENT_2025_26 } from '../../../data/platform/demoData';

interface ManagementDashboardViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const ManagementDashboardView: React.FC<ManagementDashboardViewProps> = ({
  store,
  onNavigate
}) => {
  // Compute live counts
  const totalStudents = store.students.length;
  const eligibleStudents = store.students.filter(s => s.placementStatus === 'ELIGIBLE').length;
  const placedStudents = store.students.filter(s => s.placementStatus === 'PLACED').length;
  const activeCompanies = store.companies.filter(c => c.verificationStatus === 'VERIFIED').length;
  const activeOpportunities = store.opportunities.filter(o => o.lifecycleState === 'PUBLISHED' || o.isPublished).length;
  const totalApplications = store.applications.length;
  const pendingOffers = store.offers.filter(o => !o.placementOfficeVerified).length;
  const verifiedOffers = store.offers.filter(o => o.placementOfficeVerified).length;
  const pendingRecruiters = store.recruiters.filter(r => r.verificationStatus === 'PENDING').length;
  const upcomingInterviews = store.interviews.filter(i => i.status === 'SCHEDULED').length;

  const kpis = [
    {
      label: 'Total Registered Students',
      value: totalStudents,
      sublabel: 'Across 9 Official Schools',
      icon: <Users className="w-5 h-5 text-gold" />,
      onClick: () => onNavigate('/management/students')
    },
    {
      label: 'Placement Eligible Cohort',
      value: eligibleStudents,
      sublabel: `${Math.round((eligibleStudents / (totalStudents || 1)) * 100)}% of current registered`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      onClick: () => onNavigate('/management/students')
    },
    {
      label: 'Verified Corporate Partners',
      value: activeCompanies,
      sublabel: `${store.companies.length} total registered organizations`,
      icon: <Building2 className="w-5 h-5 text-sky-400" />,
      onClick: () => onNavigate('/management/companies')
    },
    {
      label: 'Active Opportunities Desk',
      value: activeOpportunities,
      sublabel: `${store.opportunities.length} overall pipeline listings`,
      icon: <Briefcase className="w-5 h-5 text-indigo-400" />,
      onClick: () => onNavigate('/management/opportunities')
    },
    {
      label: 'Live Applications Logged',
      value: totalApplications,
      sublabel: `${store.applications.filter(a => a.stage === 'OFFER' || a.stage === 'SELECTED').length} applications reached offer`,
      icon: <FileCheck className="w-5 h-5 text-purple-400" />,
      onClick: () => onNavigate('/management/applications')
    },
    {
      label: 'Verified Offers (AY 26–27)',
      value: verifiedOffers,
      sublabel: `${pendingOffers} pending CAR verification`,
      icon: <Award className="w-5 h-5 text-gold" />,
      highlight: pendingOffers > 0,
      onClick: () => onNavigate('/management/offers')
    }
  ];

  // Pipeline flow nodes
  const pipelineNodes = [
    { label: 'Students', count: totalStudents, route: '/management/students' },
    { label: 'Eligible', count: eligibleStudents, route: '/management/students' },
    { label: 'Opportunities', count: activeOpportunities, route: '/management/opportunities' },
    { label: 'Applications', count: totalApplications, route: '/management/applications' },
    { label: 'Interviews', count: upcomingInterviews, route: '/management/interviews' },
    { label: 'Offers', count: store.offers.length, route: '/management/offers' },
    { label: 'Placed', count: placedStudents, route: '/management/students' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14222E] via-[#101A22] to-[#162734] border border-gold-border/60 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-gold uppercase px-2 py-0.5 rounded bg-gold/10 border border-gold/30">
                OFFICE OF CORPORATE & ALUMNI RELATIONS (CAR)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Operational System Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              RVU Placement Command Center
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl">
              Central institutional nexus orchestrating student cohort eligibility, recruiter approvals, placement drives, opportunity listings, interview logistics, and offer verifications.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('/management/students/import')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-semibold shadow-md transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Import Excel</span>
            </button>
            <button
              onClick={() => onNavigate('/management/drives')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-card hover:bg-white/10 text-white text-xs font-medium border border-gold-border/40 transition-all"
            >
              <Layers className="w-4 h-4 text-gold" />
              <span>Drives</span>
            </button>
            <button
              onClick={() => onNavigate('/management/announcements')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-card hover:bg-white/10 text-white text-xs font-medium border border-gold-border/40 transition-all"
            >
              <Megaphone className="w-4 h-4 text-sky-400" />
              <span>Announce</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 High-Impact Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            onClick={kpi.onClick}
            className={`group p-4 rounded-xl bg-[#131F2B] border transition-all cursor-pointer hover:scale-[1.02] shadow-sm ${
              kpi.highlight
                ? 'border-gold/80 bg-gold/5 ring-1 ring-gold/40'
                : 'border-gold-border/40 hover:border-gold/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                {kpi.icon}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-rvu-subtle group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tracking-tight">
              {kpi.value}
            </div>
            <div className="text-xs font-semibold text-rvu-text mt-0.5 truncate">
              {kpi.label}
            </div>
            <div className="text-[10px] text-rvu-subtle font-mono mt-1 truncate">
              {kpi.sublabel}
            </div>
          </div>
        ))}
      </div>

      {/* Placement Operational Lifecycle Flow Diagram */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <span>Placement Operational Pipeline</span>
              <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                End-to-End Orchestration
              </span>
            </h3>
            <p className="text-[11px] text-rvu-muted">
              Click any stage to view matching student cohorts, opportunities, or audits.
            </p>
          </div>
          <span className="text-[11px] font-mono text-rvu-subtle hidden sm:inline">
            Active Cycle: AY 2026–27
          </span>
        </div>

        {/* Responsive Horizontal Pipeline */}
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex items-center min-w-[760px] justify-between gap-2 py-2">
            {pipelineNodes.map((node, index) => (
              <React.Fragment key={node.label}>
                <div
                  onClick={() => onNavigate(node.route)}
                  className="flex-1 flex flex-col items-center p-3 rounded-lg bg-[#142330] border border-gold-border/40 hover:border-gold hover:bg-gold/10 cursor-pointer transition-all text-center group"
                >
                  <span className="text-[10px] font-mono text-rvu-subtle uppercase tracking-wider">
                    {node.label}
                  </span>
                  <span className="text-lg font-bold text-white font-mono group-hover:text-gold mt-1">
                    {node.count}
                  </span>
                </div>

                {index < pipelineNodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gold/40 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Approvals & Critical Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Urgent Action Desk (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Placement Cell Action Queue
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rvu-subtle">
                {(pendingOffers + pendingRecruiters)} pending items
              </span>
            </div>

            <div className="space-y-2.5">
              
              {/* Unverified Offers */}
              {pendingOffers > 0 ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">
                        {pendingOffers} Offer{pendingOffers > 1 ? 's' : ''} Awaiting CAR Verification
                      </div>
                      <div className="text-[11px] text-rvu-muted">
                        Students have uploaded offer letters requiring CTC & joining date compliance review.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('/management/offers')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[11px] font-semibold transition-colors shrink-0"
                  >
                    Verify Offers &rarr;
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 text-xs text-rvu-muted">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All submitted student offer letters are currently verified.</span>
                </div>
              )}

              {/* Pending Recruiter Accounts */}
              {pendingRecruiters > 0 ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">
                        {pendingRecruiters} Recruiter Account Registration{pendingRecruiters > 1 ? 's' : ''} Pending
                      </div>
                      <div className="text-[11px] text-rvu-muted">
                        Review domain authenticity, corporate identity, and grant portal access.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('/management/recruiters')}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-mono text-[11px] font-semibold transition-colors shrink-0"
                  >
                    Review &rarr;
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 text-xs text-rvu-muted">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No unapproved recruiter registrations pending.</span>
                </div>
              )}

              {/* CGPA Eligibility Warnings */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 text-xs">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <div className="font-semibold text-white">
                      Student Cohort Quick Audit
                    </div>
                    <div className="text-[11px] text-rvu-muted">
                      {store.students.filter(s => s.placementStatus === 'INELIGIBLE').length} students currently marked ineligible due to backlogs or CGPA below threshold.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('/management/students')}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors shrink-0"
                >
                  Inspect Cohort &rarr;
                </button>
              </div>

            </div>
          </div>

          {/* Institutional Activity Audit Stream */}
          <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>Recent CAR Audit & System Logs</span>
              </h3>
              <button
                onClick={() => onNavigate('/management/audit-log')}
                className="text-xs text-gold hover:underline font-mono"
              >
                Full Trail &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {store.auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-2.5 rounded-lg bg-[#142330] border border-gold-border/20 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-gold/15 text-gold border border-gold/30">
                        {log.action}
                      </span>
                      <span className="font-medium text-white">{log.details}</span>
                    </div>
                    <div className="text-[10px] text-rvu-subtle font-mono">
                      By: <span className="text-rvu-muted">{log.actor}</span> ({log.actorRole}) &bull; Target: {log.targetEntity}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-rvu-subtle shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Historical 2025–26 Benchmark & Quick Tools */}
        <div className="space-y-4">
          
          {/* Official 2025–26 Benchmark Card */}
          <div className="rounded-xl bg-gradient-to-b from-[#131F2A] to-[#0E161F] border border-gold-border/50 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-border/30 pb-3">
              <div>
                <div className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
                  OFFICIAL INSTITUTIONAL RECORD
                </div>
                <h4 className="text-sm font-bold text-white font-display">
                  Placement Benchmark 2025–26
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Audited
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rvu-muted">Eligible Students:</span>
                <span className="font-mono font-bold text-white">{HISTORICAL_PLACEMENT_2025_26.eligibleStudents.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rvu-muted">Total Offers Extended:</span>
                <span className="font-mono font-bold text-white">{HISTORICAL_PLACEMENT_2025_26.totalOffers}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rvu-muted">Multiple Offers Rate:</span>
                <span className="font-mono font-bold text-white">{HISTORICAL_PLACEMENT_2025_26.multipleOffersRate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rvu-muted">Recruiters Participated:</span>
                <span className="font-mono font-bold text-white">{HISTORICAL_PLACEMENT_2025_26.participatingRecruiters}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rvu-muted">Highest CTC Record:</span>
                <span className="font-mono font-bold text-gold">{HISTORICAL_PLACEMENT_2025_26.highestPackage}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rvu-muted">Official Participating Schools:</span>
                <span className="font-mono font-bold text-white">{HISTORICAL_PLACEMENT_2025_26.schoolsCount} Schools</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-navy-dark/70 border border-white/5 text-[10px] text-rvu-subtle flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
              <span>
                Historical metrics are retained as audited reference. Live operational numbers reflect ongoing AY 2026–27 cycle.
              </span>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-4 space-y-2">
            <h4 className="text-xs font-mono text-rvu-subtle uppercase tracking-wider px-1">
              Quick Operations
            </h4>
            
            <button
              onClick={() => onNavigate('/management/students/import')}
              className="w-full text-left p-2.5 rounded-lg bg-[#142330] hover:bg-gold/10 hover:border-gold border border-gold-border/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-gold" />
                <div>
                  <div className="text-xs font-semibold text-white">Import Student Master</div>
                  <div className="text-[10px] text-rvu-subtle">Batch upload .xlsx with multi-rule check</div>
                </div>
              </div>
              <ArrowRight className="w-3 h-3 text-rvu-subtle" />
            </button>

            <button
              onClick={() => onNavigate('/management/drives')}
              className="w-full text-left p-2.5 rounded-lg bg-[#142330] hover:bg-gold/10 hover:border-gold border border-gold-border/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Campus Placement Drives</div>
                  <div className="text-[10px] text-rvu-subtle">Manage drives, attendance & venues</div>
                </div>
              </div>
              <ArrowRight className="w-3 h-3 text-rvu-subtle" />
            </button>

            <button
              onClick={() => onNavigate('/management/reports')}
              className="w-full text-left p-2.5 rounded-lg bg-[#142330] hover:bg-gold/10 hover:border-gold border border-gold-border/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Institutional Reports</div>
                  <div className="text-[10px] text-rvu-subtle">NIRF, school-wise & NAAC exports</div>
                </div>
              </div>
              <ArrowRight className="w-3 h-3 text-rvu-subtle" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
