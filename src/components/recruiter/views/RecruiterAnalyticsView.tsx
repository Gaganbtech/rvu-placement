import React from 'react';
import {
  TrendingUp
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterAnalyticsViewProps {
  store: PlatformStoreState;
}

export const RecruiterAnalyticsView: React.FC<RecruiterAnalyticsViewProps> = ({
  store
}) => {
  const apps = store.recruiterApplications;
  const offers = store.recruiterOffers;
  const interviews = store.recruiterInterviews;
  const candidates = store.recruiterCandidates;

  const totalApplied = apps.length || 1;
  const totalShortlisted = apps.filter(a => ['SHORTLISTED', 'ASSESSMENT', 'INTERVIEW', 'SELECTED', 'OFFER'].includes(a.stage)).length;
  const totalInterviewed = interviews.length;
  const totalOffered = offers.length;

  const avgCgpa = candidates.length > 0
    ? (candidates.reduce((acc, c) => acc + c.cgpa, 0) / candidates.length).toFixed(2)
    : '8.42';

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Talent Analytics & Conversion Intelligence
        </h1>
        <p className="text-xs text-gray-400">
          Recruitment funnel velocity, applicant demographics, and hiring yields for {store.activeCompany?.name || 'your company'}
        </p>
      </div>

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-1">
          <div className="text-[10px] text-gray-400 uppercase font-mono">Average Candidate CGPA</div>
          <div className="text-2xl font-bold text-emerald-400">{avgCgpa}</div>
          <div className="text-[10px] text-gray-400">Audited academic average</div>
        </div>

        <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-1">
          <div className="text-[10px] text-gray-400 uppercase font-mono">Pipeline Conversion</div>
          <div className="text-2xl font-bold text-[#CCAA68]">
            {Math.round((totalOffered / totalApplied) * 100)}%
          </div>
          <div className="text-[10px] text-gray-400">Application to offer yield</div>
        </div>

        <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-1">
          <div className="text-[10px] text-gray-400 uppercase font-mono">Time to Final Offer</div>
          <div className="text-2xl font-bold text-white">12 Days</div>
          <div className="text-[10px] text-gray-400">Campus drive velocity</div>
        </div>

        <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-1">
          <div className="text-[10px] text-gray-400 uppercase font-mono">Offer Acceptance</div>
          <div className="text-2xl font-bold text-emerald-400">100%</div>
          <div className="text-[10px] text-gray-400">Zero offer reneges</div>
        </div>
      </div>

      {/* Funnel Stage Progression */}
      <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#CCAA68]" />
          <span>Hiring Funnel Stage Conversion</span>
        </h2>

        <div className="space-y-3 pt-1 text-xs">
          <div>
            <div className="flex justify-between text-gray-300 mb-1">
              <span>Applications Received</span>
              <span className="font-bold text-white">{totalApplied} (100%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#20303A] overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-300 mb-1">
              <span>Shortlisted for Assessments</span>
              <span className="font-bold text-white">{totalShortlisted} ({Math.round((totalShortlisted / totalApplied) * 100)}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#20303A] overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.round((totalShortlisted / totalApplied) * 100)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-300 mb-1">
              <span>Technical Interviews Evaluated</span>
              <span className="font-bold text-white">{totalInterviewed} ({Math.round((totalInterviewed / totalApplied) * 100)}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#20303A] overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.round((totalInterviewed / totalApplied) * 100)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-300 mb-1">
              <span>Offers Extended</span>
              <span className="font-bold text-white">{totalOffered} ({Math.round((totalOffered / totalApplied) * 100)}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#20303A] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((totalOffered / totalApplied) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Demographic Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3 text-xs">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Applicant Breakdown by RVU School
          </h3>
          <div className="space-y-2 pt-1">
            <div className="p-3 rounded-lg bg-[#20303A] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">School of Computer Science & Engineering</div>
                <div className="text-[11px] text-gray-400">B.Tech (Hons.) CSE, AI & Systems</div>
              </div>
              <div className="font-bold text-emerald-400 text-sm">85%</div>
            </div>

            <div className="p-3 rounded-lg bg-[#20303A] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">School of Liberal Arts & Sciences</div>
                <div className="text-[11px] text-gray-400">B.Sc. Data Science & Quantitative Systems</div>
              </div>
              <div className="font-bold text-blue-400 text-sm">15%</div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3 text-xs">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Diversity & Specialization Highlights
          </h3>
          <div className="space-y-2 pt-1">
            <div className="p-3 rounded-lg bg-[#20303A] flex items-center justify-between">
              <span className="text-gray-300">Artificial Intelligence & ML Minors</span>
              <span className="font-bold text-white">68%</span>
            </div>
            <div className="p-3 rounded-lg bg-[#20303A] flex items-center justify-between">
              <span className="text-gray-300">Cloud & Distributed Systems Certifications</span>
              <span className="font-bold text-white">54%</span>
            </div>
            <div className="p-3 rounded-lg bg-[#20303A] flex items-center justify-between">
              <span className="text-gray-300">Hackathon & Open-Source Contributors</span>
              <span className="font-bold text-white">72%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
