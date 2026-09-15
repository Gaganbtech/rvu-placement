import React from 'react';
import {
  BarChart3,
  Award,
  Users,
  Building2
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import { OFFICIAL_RVU_SCHOOLS } from '../../../data/platform/demoData';

interface AnalyticsViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  store
}) => {
  // Compute school-wise metrics
  const schoolMetrics = OFFICIAL_RVU_SCHOOLS.map(school => {
    const students = store.students.filter(s => s.school === school);
    const eligible = students.filter(s => s.placementStatus === 'ELIGIBLE' || s.placementStatus === 'PLACED' || s.placementStatus === 'OFFERED');
    const placed = students.filter(s => s.placementStatus === 'PLACED' || s.placementStatus === 'OFFERED');
    const offers = store.offers.filter(o => {
      const st = store.students.find(s => s.id === o.studentId);
      return st?.school === school;
    });

    const rate = eligible.length > 0 ? Math.round((placed.length / eligible.length) * 100) : 0;

    return {
      school,
      total: students.length,
      eligible: eligible.length,
      placed: placed.length,
      offers: offers.length,
      placementRate: rate
    };
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              INSTITUTIONAL INTELLIGENCE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              Live Operational Aggregations
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Placement Analytics & Intelligence
          </h1>
          <p className="text-xs text-rvu-muted">
            Cross-school recruitment metrics, offer distribution, and conversion performance for AY 2026–27.
          </p>
        </div>
      </div>

      {/* School-Wise Performance Table */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden shadow-lg space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-gold-border/30 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-bold text-white font-display">
              School-Wise Placement Breakdown (9 Official RVU Schools)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-rvu-subtle">
            Cycle: AY 2026–27
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D161E] border-b border-gold-border/30 text-rvu-subtle font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3">Official School</th>
                <th className="p-3 text-center">Registered</th>
                <th className="p-3 text-center">Eligible Cohort</th>
                <th className="p-3 text-center">Offers Logged</th>
                <th className="p-3 text-center">Placement Rate</th>
                <th className="p-3">Conversion Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {schoolMetrics.map((sm) => (
                <tr key={sm.school} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-sans font-semibold text-white">
                    {sm.school}
                  </td>
                  <td className="p-3 text-center text-rvu-muted">
                    {sm.total}
                  </td>
                  <td className="p-3 text-center text-white font-bold">
                    {sm.eligible}
                  </td>
                  <td className="p-3 text-center text-gold font-bold">
                    {sm.offers}
                  </td>
                  <td className="p-3 text-center text-emerald-400 font-bold">
                    {sm.placementRate}%
                  </td>
                  <td className="p-3 w-48">
                    <div className="w-full bg-[#142330] rounded-full h-2 overflow-hidden border border-white/10">
                      <div
                        className="bg-gold h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, sm.placementRate)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recruitment Funnel Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Users className="w-4 h-4 text-gold" />
            <span>Eligible vs Ineligible Ratio</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {store.students.filter(s => s.placementStatus === 'ELIGIBLE').length} / {store.students.length}
          </div>
          <p className="text-[11px] text-rvu-muted">
            Students maintaining CGPA &ge; 6.0 with zero active academic backlogs.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Corporate Engagement Depth</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {store.companies.length} Partners
          </div>
          <p className="text-[11px] text-rvu-muted">
            {store.companies.filter(c => c.tier === 'Marquee').length} Marquee Tier-1 organizations actively engaged.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Verified Offers Ratio</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {store.offers.filter(o => o.placementOfficeVerified).length} / {store.offers.length}
          </div>
          <p className="text-[11px] text-rvu-muted">
            Official compliance verified offer letters processed by Central CAR.
          </p>
        </div>
      </div>

    </div>
  );
};
