import React from 'react';
import {
  Download,
  CheckCircle2
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface ReportsViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  store
}) => {
  const reports = [
    {
      id: 'nirf_report',
      title: 'NIRF Institutional Placement Data Export',
      category: 'Statutory Compliance',
      description: 'Standard National Institutional Ranking Framework (NIRF) reporting format. Summarizes graduating cohort, eligible pool, verified median CTC, and institutional higher studies stats.',
      format: 'CSV / Excel'
    },
    {
      id: 'school_wise_summary',
      title: 'School-Wise Placement & Drive Distribution',
      category: 'Executive Report',
      description: 'Detailed analysis across all 9 official RVU schools: registered candidates, eligible counts, drive attendees, and verified job offers.',
      format: 'CSV'
    },
    {
      id: 'recruiter_feedback_summary',
      title: 'Corporate Partner Recruitment Audit',
      category: 'Corporate Relations',
      description: 'Breakdown of participating companies, selection ratios, package brackets, and recruiter ratings for AY 2026–27.',
      format: 'Excel'
    },
    {
      id: 'naac_criterion_5',
      title: 'NAAC Criterion V (Student Support & Progression)',
      category: 'Accreditation',
      description: 'Formal documentation verifying competitive exam coaching, placement assistance percentages, and verified appointment letters.',
      format: 'PDF / CSV'
    }
  ];

  const handleDownload = (reportTitle: string) => {
    // Generate sample CSV download
    const csvContent = `data:text/csv;charset=utf-8,"RV UNIVERSITY - OFFICE OF CAR","REPORT: ${reportTitle}","GENERATED: ${new Date().toISOString()}"\n"Metric","Count","Status"\n"Total Registered",${store.students.length},"Active"\n"Eligible Cohort",${store.students.filter(s => s.placementStatus === 'ELIGIBLE').length},"Verified"\n"Total Offers",${store.offers.length},"Recorded"`;
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `${reportTitle.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              ACCREDITATION & EXECUTIVE REPORTING
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Institutional Reports Generator
          </h1>
          <p className="text-xs text-rvu-muted">
            Export compliant statutory datasets for NIRF, NAAC, Academic Council, and Chancellor's office.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 hover:border-gold/60 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 font-bold">
                  {rep.category}
                </span>
                <span className="text-[10px] font-mono text-rvu-subtle">
                  Format: {rep.format}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-display">
                {rep.title}
              </h3>

              <p className="text-xs text-rvu-muted leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Data Synced with SIS</span>
              </span>

              <button
                onClick={() => handleDownload(rep.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export File</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
