import React from 'react';
import {
  Download,
  ShieldCheck
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface ResourcesManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const ResourcesManagementView: React.FC<ResourcesManagementViewProps> = () => {
  const policies = [
    {
      title: 'RVU Central Placement Policy (AY 2026–27)',
      category: 'Institutional Policy',
      version: 'v4.2 (Ratified by Academic Council)',
      description: 'Comprehensive guidelines covering eligibility criteria, one-student-one-job norm, dream company thresholds, attendance requirements, and disciplinary penalties.'
    },
    {
      title: 'Corporate Recruitment Code & SOP',
      category: 'Corporate Relations',
      version: 'v2.1',
      description: 'Terms of engagement for visiting organizations, slot allotment protocols, pre-placement talk arrangements, and offer letter release guidelines.'
    },
    {
      title: 'Mandatory Student Placement Conduct Agreement',
      category: 'Student Compliance',
      version: 'AY 26-27 Master',
      description: 'Formal undertaking signed by participating candidates pledging interview attendance, professional attire, and non-disclosure obligations.'
    },
    {
      title: 'Internship & Final Semester Industry NOC Form',
      category: 'Academic Clearance',
      version: 'Standard Form',
      description: 'Official template for Dean / HOD clearance facilitating 8th-semester industry internships and project work.'
    }
  ];

  const handleDownloadNotice = (title: string) => {
    alert(`Downloading verified copy of: ${title}`);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              INSTITUTIONAL GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Placement Policies & Official Resources
          </h1>
          <p className="text-xs text-rvu-muted">
            Official operational handbooks, student conduct guidelines, and recruiter agreements governing the placement ecosystem.
          </p>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {policies.map((p, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 hover:border-gold/60 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 font-bold">
                  {p.category}
                </span>
                <span className="text-[10px] font-mono text-rvu-subtle">
                  {p.version}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-display">
                {p.title}
              </h3>

              <p className="text-xs text-rvu-muted leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Active & Enforceable</span>
              </div>

              <button
                onClick={() => handleDownloadNotice(p.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-gold" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
