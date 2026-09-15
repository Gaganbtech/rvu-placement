import React, { useState } from 'react';
import {
  Briefcase,
  PlusCircle,
  Search,
  Users,
  Calendar,
  Clock,
  ShieldCheck
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { OpportunityLifecycle } from '../../../data/platform/types';

interface RecruiterOpportunitiesViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const RecruiterOpportunitiesView: React.FC<RecruiterOpportunitiesViewProps> = ({
  store,
  onNavigate
}) => {
  const opps = store.recruiterOpportunities;
  const apps = store.recruiterApplications;
  const activeCompany = store.activeCompany;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OpportunityLifecycle>('ALL');

  const filteredOpps = opps.filter(opp => {
    const matchesSearch =
      opp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.department && opp.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      opp.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || opp.lifecycleState === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Job Opportunities & Postings
          </h1>
          <p className="text-xs text-gray-400">
            Post and manage verified placement and internship opportunities for {activeCompany?.name || 'your company'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('/recruiter/opportunities/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </button>
      </div>

      {/* CAR Verification Notice Banner */}
      <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#CCAA68] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-white">CAR Institutional Governance Gate</div>
          <p className="text-gray-300 leading-relaxed">
            All opportunities submitted by partner recruiters are reviewed by the RVU Office of Corporate & Alumni Relations (CAR) to verify eligibility criteria and salary statutory guidelines before being unlocked for student applications.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role, department, location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#20303A] text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none placeholder-gray-400"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['ALL', 'PUBLISHED', 'SUBMITTED', 'UNDER_REVIEW', 'ARCHIVED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? 'bg-[#CCAA68] text-[#101A22] font-semibold'
                  : 'bg-[#20303A] text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      {filteredOpps.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <Briefcase className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No opportunities found</div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try changing your search keywords or filter options.'
              : 'Create your first job posting to start recruiting talented RVU students.'}
          </p>
          <button
            onClick={() => onNavigate('/recruiter/opportunities/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Opportunity Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOpps.map(opp => {
            const oppApps = apps.filter(a => a.opportunityId === opp.id);
            const isApproved = opp.lifecycleState === 'PUBLISHED';
            const isPending = opp.lifecycleState === 'SUBMITTED' || opp.lifecycleState === 'UNDER_REVIEW';

            return (
              <div
                key={opp.id}
                className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CCAA68]/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">{opp.role}</h3>
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

                    <div className="text-xs text-gray-300 flex flex-wrap items-center gap-2 pt-0.5">
                      <span>{opp.type}</span>
                      <span>•</span>
                      <span className="text-[#CCAA68] font-medium">{opp.ctcLpa}</span>
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

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onNavigate(`/recruiter/opportunities/${opp.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-white text-xs border border-[#CCAA68]/20 font-medium transition-colors"
                    >
                      View Details & Applicants
                    </button>
                    <button
                      onClick={() => onNavigate(`/recruiter/applications?oppId=${opp.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{oppApps.length} Candidates</span>
                    </button>
                  </div>
                </div>

                {/* Eligibility & Timeline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#20303A]/70 border border-[#CCAA68]/10">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Academic Gate</div>
                    <div className="font-medium text-white mt-0.5">
                      Min CGPA: <strong className="text-emerald-400">{opp.minCgpa}</strong> • {opp.maxBacklogsAllowed} backlogs
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]/70 border border-[#CCAA68]/10">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Openings</div>
                    <div className="font-medium text-white mt-0.5">
                      {opp.openingsCount} target hires
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]/70 border border-[#CCAA68]/10">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Application Deadline</div>
                    <div className="font-medium text-white mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#CCAA68]" />
                      <span>{opp.applicationDeadline}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]/70 border border-[#CCAA68]/10">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Campus Drive Date</div>
                    <div className="font-medium text-white mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#CCAA68]" />
                      <span>{opp.driveDate || 'To be scheduled'}</span>
                    </div>
                  </div>
                </div>

                {/* Skills tags & CAR comment */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-gray-400 text-[11px]">Required:</span>
                    {opp.requiredSkills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-[#20303A] text-gray-300 text-[10px] border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {opp.carReviewComments && (
                    <div className="text-[11px] text-[#CCAA68] italic flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate max-w-md">{opp.carReviewComments}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
