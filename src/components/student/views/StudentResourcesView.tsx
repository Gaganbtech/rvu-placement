import React from 'react';
import { 
  Download, 
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../ui/Button';

export const StudentResourcesView: React.FC = () => {
  const policies = [
    {
      title: 'RVU Campus Placement Policy (2026–27)',
      category: 'Statutory Policy',
      desc: 'Official regulations governing participation eligibility, multi-offer rules (Dream vs Marquee tiers), and student code of conduct.',
      fileSize: '1.4 MB PDF'
    },
    {
      title: 'Institutional Multi-Offer & Acceptance Guidelines',
      category: 'Offer Guidelines',
      desc: 'Procedures regarding Dream tier (₹12 LPA+) exceptions, offer freeze rules, and mandatory formal acceptance letters.',
      fileSize: '820 KB PDF'
    },
    {
      title: 'Formal Attire & Professional Protocol Code',
      category: 'Drive Protocols',
      desc: 'Mandatory decorum, punctuality requirements, and dress code for in-person campus recruitment drives.',
      fileSize: '450 KB PDF'
    }
  ];

  const templates = [
    {
      title: 'RVU Standard ATS Tech Resume (LaTeX Template)',
      type: 'Overleaf / LaTeX',
      desc: 'Single-page ATS-optimized format structured for Software, Data, and Core Systems roles.',
      downloads: '1,240 downloads'
    },
    {
      title: 'RVU Standard Placement Resume (MS Word Format)',
      type: 'Docx Template',
      desc: 'Pre-formatted Word template compliant with CAR placement portal parsing engines.',
      downloads: '890 downloads'
    },
    {
      title: 'Internship No-Objection Certificate (NOC) Form',
      type: 'Official Form',
      desc: 'Dean-approved NOC form required for semester-long external corporate internships.',
      downloads: '430 downloads'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
            OFFICIAL KNOWLEDGE BASE
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            CAR Published
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
          Resources & Placement Policy
        </h1>
        <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed">
          Access official university placement regulations, verified ATS resume templates, and corporate guidelines approved by the Corporate & Alumni Relations (CAR) Directorate.
        </p>
      </div>

      {/* Key Policy Highlights Alert */}
      <div className="p-5 rounded-2xl bg-[#0F1822] border border-amber-500/40 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-mono font-bold uppercase text-[11px]">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Core Placement Rules Every Student Must Know:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-rvu-muted">
          <div className="p-3 rounded-xl bg-navy-card/60 border border-white/5 space-y-1">
            <strong className="text-white block font-mono text-[11px]">1. Attendance Rule:</strong>
            <p className="text-[11px] leading-relaxed">
              Students must maintain minimum 75% overall academic attendance to remain eligible for drive registrations.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-navy-card/60 border border-white/5 space-y-1">
            <strong className="text-white block font-mono text-[11px]">2. One-Student-One-Core-Offer:</strong>
            <p className="text-[11px] leading-relaxed">
              Once placed in a Core Tier company, students may only compete for Dream Tier (₹12 LPA+) or Marquee (₹20 LPA+) drives.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-navy-card/60 border border-white/5 space-y-1">
            <strong className="text-white block font-mono text-[11px]">3. Professional Decorum:</strong>
            <p className="text-[11px] leading-relaxed">
              Unannounced absence after shortlisting incurs automatic suspension from next 2 recruitment drives.
            </p>
          </div>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
          Statutory Placement Documentation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {policies.map((pol) => (
            <div
              key={pol.title}
              className="p-5 rounded-2xl bg-navy-card border border-gold-border/40 hover:border-gold/60 transition-all space-y-3 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gold border border-gold/20 font-bold uppercase">
                  {pol.category}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {pol.title}
                </h3>
                <p className="text-xs text-rvu-muted leading-relaxed">
                  {pol.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-rvu-subtle">
                <span>{pol.fileSize}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => alert(`Downloading ${pol.title} (Verified CAR Document)`)}
                  className="text-xs py-1 px-2.5"
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
          Approved Resume & Internship Templates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {templates.map((tpl) => (
            <div
              key={tpl.title}
              className="p-5 rounded-2xl bg-navy-card border border-gold-border/40 hover:border-gold/60 transition-all space-y-3 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold uppercase">
                  {tpl.type}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {tpl.title}
                </h3>
                <p className="text-xs text-rvu-muted leading-relaxed">
                  {tpl.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-rvu-subtle">
                <span>{tpl.downloads}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => alert(`Downloading template: ${tpl.title}`)}
                  className="text-xs py-1 px-2.5"
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Get Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
