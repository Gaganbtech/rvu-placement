import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface OpportunityDetailViewProps {
  opportunityId: string;
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  opportunityId,
  store,
  onNavigate
}) => {
  const opp = store.recruiterOpportunities.find(o => o.id === opportunityId) || store.opportunities.find(o => o.id === opportunityId);
  const apps = store.recruiterApplications.filter(a => a.opportunityId === opportunityId);
  const candidates = store.recruiterCandidates;

  if (!opp) {
    return (
      <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="text-sm font-semibold text-white">Opportunity Not Found</div>
        <p className="text-xs text-gray-400">
          The requested opportunity ({opportunityId}) does not exist or is not assigned to your organization.
        </p>
        <button
          onClick={() => onNavigate('/recruiter/opportunities')}
          className="px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Opportunities</span>
        </button>
      </div>
    );
  }

  const isApproved = opp.lifecycleState === 'PUBLISHED';
  const isPending = opp.lifecycleState === 'SUBMITTED' || opp.lifecycleState === 'UNDER_REVIEW';

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/recruiter/opportunities')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Postings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/recruiter/assessments')}
            className="px-3 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-white text-xs border border-[#CCAA68]/20 font-medium transition-colors"
          >
            Create Assessment
          </button>
          <button
            onClick={() => onNavigate(`/recruiter/applications?oppId=${opp.id}`)}
            className="px-4 py-1.5 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] text-xs font-semibold transition-colors"
          >
            View All {apps.length} Applicants
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CCAA68]/15 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{opp.role}</h1>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                isApproved
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : isPending
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
              }`}>
                {opp.lifecycleState}
              </span>
              <span className="text-[10px] bg-[#20303A] text-gray-300 px-2 py-0.5 rounded font-mono border border-white/10">
                {opp.id}
              </span>
            </div>

            <div className="text-xs text-gray-300 flex flex-wrap items-center gap-2 pt-1">
              <span className="font-semibold text-white">{opp.companyName}</span>
              <span>•</span>
              <span className="text-[#CCAA68] font-bold">{opp.ctcLpa}</span>
              {opp.stipendPerMonth && (
                <>
                  <span>•</span>
                  <span className="text-[#D8B978]">{opp.stipendPerMonth}</span>
                </>
              )}
              <span>•</span>
              <span>{opp.workMode} ({opp.location})</span>
              {opp.department && (
                <>
                  <span>•</span>
                  <span className="text-gray-400">{opp.department}</span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Target Hires</div>
            <div className="text-2xl font-bold text-white">{opp.openingsCount}</div>
          </div>
        </div>

        {/* CAR Approval State Banner */}
        {isPending ? (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-amber-300">Under Review by CAR Placement Office</div>
              <p className="text-gray-300">
                This job posting is being vetted by university placement administrators. Students will be eligible to view and apply once statutory verification is approved.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-emerald-300">Approved & Published by CAR Office</div>
              <p className="text-gray-300">
                {opp.carReviewComments || 'Verified for campus placement drives and active on eligible student dashboards.'}
              </p>
            </div>
          </div>
        )}

        {/* Key Specification Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Min CGPA Gate</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">{opp.minCgpa}</div>
            <div className="text-[10px] text-gray-400">{opp.maxBacklogsAllowed} active backlogs max</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Deadline</div>
            <div className="font-bold text-white text-sm mt-0.5">{opp.applicationDeadline}</div>
            <div className="text-[10px] text-gray-400">Application closure</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Campus Drive Date</div>
            <div className="font-bold text-white text-sm mt-0.5">{opp.driveDate || 'TBD'}</div>
            <div className="text-[10px] text-gray-400">Academic Block 2</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Applications</div>
            <div className="font-bold text-[#CCAA68] text-sm mt-0.5">{apps.length}</div>
            <div className="text-[10px] text-gray-400">Total received</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Description & Selection Rounds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Responsibilities, Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Job Description</h3>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
              {opp.description}
            </p>

            {opp.responsibilities && opp.responsibilities.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-white">Key Responsibilities:</div>
                <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
                  {opp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {opp.otherBenefits && (
              <div className="p-3 rounded-lg bg-[#20303A] border border-[#CCAA68]/15 text-xs space-y-1">
                <div className="font-semibold text-white">Benefits & Perks:</div>
                <div className="text-gray-300">{opp.otherBenefits}</div>
              </div>
            )}
          </div>

          {/* Applications for this posting */}
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Candidates Applied ({apps.length})</h3>
                <p className="text-xs text-gray-400">Pre-screened RVU students for this opportunity</p>
              </div>
              <button
                onClick={() => onNavigate(`/recruiter/applications?oppId=${opp.id}`)}
                className="text-xs text-[#CCAA68] hover:underline font-medium"
              >
                Manage Pipeline &rarr;
              </button>
            </div>

            {apps.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No students have applied for this opportunity yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {apps.map(app => {
                  const cand = candidates.find(c => c.id === app.studentId);
                  return (
                    <div
                      key={app.id}
                      onClick={() => onNavigate(`/recruiter/applications/${app.id}`)}
                      className="p-3 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 border border-white/5 hover:border-[#CCAA68]/30 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{cand?.name || 'RVU Student'} ({app.studentId})</div>
                        <div className="text-gray-400 text-[11px]">
                          CGPA: <strong className="text-emerald-400">{cand?.cgpa || '8.42'}</strong> • {cand?.programme}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-[#CCAA68]/20 text-[#D8B978]">
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

        {/* Right 1 Col: Selection Rounds & Eligible Schools */}
        <div className="space-y-6">
          {/* Selection Rounds */}
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Selection Rounds ({opp.selectionProcess.length})
            </h3>
            <div className="space-y-2.5">
              {opp.selectionProcess.map(round => (
                <div key={round.roundNumber} className="p-3 rounded-lg bg-[#20303A] border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      Round {round.roundNumber}: {round.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#101A22] text-[#CCAA68]">
                      {round.mode}
                    </span>
                  </div>
                  <div className="text-gray-400 text-[11px]">{round.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligible Schools */}
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Eligible Cohorts & Schools
            </h3>
            <div className="space-y-1.5">
              {opp.eligibleSchools.map(school => (
                <div key={school} className="p-2 rounded bg-[#20303A] text-gray-200 text-xs border border-white/5 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#CCAA68] flex-shrink-0" />
                  <span>{school}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
