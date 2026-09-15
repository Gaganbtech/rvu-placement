import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Briefcase
} from 'lucide-react';
import type { Application, Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentApplicationsViewProps {
  student: Student;
  applications: Application[];
  onNavigate: (route: string) => void;
}

export const StudentApplicationsView: React.FC<StudentApplicationsViewProps> = ({
  student,
  applications,
  onNavigate
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'ASSESSMENT' | 'INTERVIEW' | 'OFFER'>('ALL');

  const filteredApplications = applications.filter((app) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'ACTIVE') return !['REJECTED', 'WITHDRAWN'].includes(app.stage);
    if (selectedFilter === 'ASSESSMENT') return app.stage === 'ASSESSMENT';
    if (selectedFilter === 'INTERVIEW') return app.stage === 'INTERVIEW';
    if (selectedFilter === 'OFFER') return app.stage === 'OFFER' || app.stage === 'SELECTED';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                SHARED RECRUITMENT PIPELINE
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Monitored
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              My Applications
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Track your real-time recruitment stages across corporate partners. Recruiter updates, assessments, and interview schedules synchronize directly here.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('/student/opportunities')}
            icon={<Briefcase className="w-4 h-4" />}
          >
            Apply to More Roles
          </Button>
        </div>

        {/* Pipeline Stage Sequence Graphic */}
        <div className="pt-4 border-t border-white/5 overflow-x-auto">
          <div className="flex items-center gap-2 text-[10px] font-mono whitespace-nowrap min-w-max text-rvu-subtle">
            <span className="text-gold font-bold">Standard Pipeline:</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-white">1. Applied</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-white">2. Under Review</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-white">3. Shortlisted</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-white">4. Assessment</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-white">5. Interview</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">6. Offer</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: `All Applications (${applications.length})` },
          { key: 'ACTIVE', label: 'Active Pipeline' },
          { key: 'ASSESSMENT', label: 'Online Assessments' },
          { key: 'INTERVIEW', label: 'Interviews' },
          { key: 'OFFER', label: 'Offers / Selected' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
              selectedFilter === tab.key
                ? 'bg-gold text-navy-dark font-bold shadow-gold-glow'
                : 'bg-navy-card text-rvu-muted hover:text-white border border-gold-border/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 text-rvu-muted space-y-3">
          <FileText className="w-10 h-10 text-rvu-subtle mx-auto" />
          <p className="text-sm">No applications found in this category.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/student/opportunities')}
          >
            Browse Open Opportunities
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all p-6 shadow-card space-y-4 group"
            >
              {/* Top Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                    {app.companyName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-rvu-muted">
                      <span>{app.companyName}</span>
                      <span>•</span>
                      <span className="font-mono text-gold-light">{app.compensation}</span>
                    </div>
                    <h2 className="text-lg font-bold text-white font-display group-hover:text-gold transition-colors leading-tight">
                      {app.role}
                    </h2>
                    <div className="text-[11px] font-mono text-rvu-subtle pt-0.5">
                      Application Ref: <strong className="text-white">{app.id}</strong> • Submitted: {app.submittedAt}
                    </div>
                  </div>
                </div>

                {/* Stage Pill & CTA */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-rvu-subtle block uppercase">
                      Current Recruiter Stage
                    </span>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-gold/15 text-gold border border-gold/40 uppercase">
                      {app.stage}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate(`/student/applications/${app.id}`)}
                    className="text-xs py-2 px-3"
                    icon={<ChevronRight className="w-4 h-4" />}
                  >
                    View Timeline
                  </Button>
                </div>
              </div>

              {/* Next Action Box */}
              {app.nextAction && (
                <div className="p-3.5 rounded-xl bg-[#0E1720] border border-gold-border/40 flex items-start gap-3 text-xs">
                  <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <strong className="text-white font-mono uppercase text-[11px]">
                        Action Required: {app.nextAction.title}
                      </strong>
                      <span className="text-[10px] font-mono text-amber-300">
                        Deadline: {app.nextAction.deadline}
                      </span>
                    </div>
                    <p className="text-[11px] text-rvu-muted leading-relaxed">
                      {app.nextAction.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Mini Timeline Strip */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-rvu-subtle">
                <span className="text-rvu-muted">Timeline:</span>
                {app.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1 ${
                      step.completed 
                        ? 'text-emerald-400 font-medium' 
                        : step.active 
                        ? 'text-gold font-bold' 
                        : 'text-rvu-subtle'
                    }`}>
                      {step.completed && <CheckCircle2 className="w-3 h-3" />}
                      {step.active && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
                      <span>{step.label}</span>
                    </span>
                    {idx < app.timeline.length - 1 && <span className="text-white/20">&rarr;</span>}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Privacy note */}
      <div className="p-4 rounded-xl bg-[#0F1822] border border-white/5 text-[11px] text-rvu-subtle font-mono text-center">
        * Security Notice: Student {student.name} ({student.id}) can only view their own candidate records and updates. Private recruiter evaluations, rank lists, and other applicant data are strictly protected under RVU Placement Privacy Governance.
      </div>

    </div>
  );
};
