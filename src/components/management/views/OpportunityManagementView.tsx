import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Building2,
  Archive
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { OpportunityLifecycle } from '../../../data/platform/types';

interface OpportunityManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const OpportunityManagementView: React.FC<OpportunityManagementViewProps> = ({
  store
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredOpps = store.opportunities.filter(opp => {
    if (selectedStatus !== 'ALL' && opp.lifecycleState !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchRole = opp.role.toLowerCase().includes(q);
      const matchComp = opp.companyName.toLowerCase().includes(q);
      if (!matchRole && !matchComp) return false;
    }
    return true;
  });

  const getStatusBadge = (state: OpportunityLifecycle) => {
    switch (state) {
      case 'PUBLISHED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ACTIVE IN STUDENT PORTAL</span>;
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">AWAITING CAR APPROVAL</span>;
      case 'CLOSED':
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-500/20 text-gray-400">ARCHIVED</span>;
      case 'DRAFT':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-rvu-muted">DRAFT</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              CAREER PIPELINE MODERATION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {store.opportunities.length} Pipeline Listings
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Opportunities & Openings Desk
          </h1>
          <p className="text-xs text-rvu-muted">
            Moderate recruiter postings, approve job descriptions, verify compensation structures, and publish to students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-rvu-subtle">
            {store.opportunities.filter(o => o.lifecycleState === 'PUBLISHED' || o.isPublished).length} Published Live
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/40 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rvu-subtle" />
          <input
            type="text"
            placeholder="Search role, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['ALL', 'PUBLISHED', 'UNDER_REVIEW', 'CLOSED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedStatus === tab
                  ? 'bg-gold text-navy-dark font-bold'
                  : 'bg-white/5 text-rvu-muted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-3">
        {filteredOpps.map((opp) => {
          const appCount = store.applications.filter(a => a.opportunityId === opp.id).length;
          return (
            <div
              key={opp.id}
              className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 hover:border-gold/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-gold font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.companyName}</span>
                  </div>
                  <span>&bull;</span>
                  <span className="font-mono text-[11px] text-rvu-subtle uppercase">{opp.type}</span>
                  <span>&bull;</span>
                  {getStatusBadge(opp.lifecycleState)}
                </div>

                <h3 className="font-bold text-white text-base">{opp.role}</h3>

                <div className="flex items-center gap-3 text-xs text-rvu-muted flex-wrap">
                  <span>CTC / Compensation: <strong className="text-gold font-mono">{opp.ctcLpa}</strong></span>
                  <span>&bull;</span>
                  <span>Min CGPA: <strong className="text-white font-mono">{opp.minCgpa}</strong></span>
                  <span>&bull;</span>
                  <span>Applications Logged: <strong className="text-emerald-400 font-mono">{appCount}</strong></span>
                </div>

                <div className="text-[11px] text-rvu-subtle truncate">
                  Eligible Schools: {opp.eligibleSchools.slice(0, 2).join(', ')}
                  {opp.eligibleSchools.length > 2 && ` +${opp.eligibleSchools.length - 2} more`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {(opp.lifecycleState === 'UNDER_REVIEW' || opp.lifecycleState === 'SUBMITTED' || !opp.isPublished) && (
                  <button
                    onClick={() => {
                      store.approveOpportunity(opp.id);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>
                )}

                {opp.lifecycleState === 'PUBLISHED' && (
                  <button
                    onClick={() => store.rejectOpportunity(opp.id, 'Archived by placement administrator.')}
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rvu-muted hover:text-white border border-white/10 text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                )}

                {opp.lifecycleState === 'REJECTED' && (
                  <button
                    onClick={() => store.approveOpportunity(opp.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs transition-colors"
                  >
                    Re-publish
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
