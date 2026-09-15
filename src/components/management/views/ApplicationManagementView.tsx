import React, { useState } from 'react';
import {
  Search,
  Building2,
  ArrowRight
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { ApplicationStage } from '../../../data/platform/types';

interface ApplicationManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const ApplicationManagementView: React.FC<ApplicationManagementViewProps> = ({
  store,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  const filteredApps = store.applications.filter(app => {
    if (selectedStage !== 'ALL' && app.stage !== selectedStage) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const studentName = store.students.find(s => s.id === app.studentId)?.name || '';
      const matchCandidate = studentName.toLowerCase().includes(q) || app.studentId.toLowerCase().includes(q);
      const matchRole = app.role.toLowerCase().includes(q);
      const matchComp = app.companyName.toLowerCase().includes(q);
      if (!matchCandidate && !matchRole && !matchComp) return false;
    }
    return true;
  });

  const getStageBadge = (stage: ApplicationStage) => {
    switch (stage) {
      case 'OFFER':
      case 'JOINED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold/20 text-gold border border-gold/40">OFFERED</span>;
      case 'SELECTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">SELECTED</span>;
      case 'INTERVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">INTERVIEW</span>;
      case 'ASSESSMENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">ASSESSMENT</span>;
      case 'SHORTLISTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">SHORTLISTED</span>;
      case 'REJECTED':
      case 'WITHDRAWN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">REJECTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">APPLIED</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              SELECTION LIFECYCLE MONITOR
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {store.applications.length} Total Submissions
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Student Application & Funnel Desk
          </h1>
          <p className="text-xs text-rvu-muted">
            Monitor real-time candidate progression through online tests, technical rounds, shortlists, and final selections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-rvu-subtle">
            {store.applications.filter(a => a.stage === 'OFFER' || a.stage === 'SELECTED').length} Placements Confirmed
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/40 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rvu-subtle" />
          <input
            type="text"
            placeholder="Search candidate, role, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['ALL', 'APPLIED', 'SHORTLISTED', 'ASSESSMENT', 'INTERVIEW', 'SELECTED', 'OFFER'].map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedStage === stage
                  ? 'bg-gold text-navy-dark font-bold'
                  : 'bg-white/5 text-rvu-muted hover:text-white'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D161E] border-b border-gold-border/30 text-rvu-subtle font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3">Candidate / USN</th>
                <th className="p-3">Role & Partner</th>
                <th className="p-3">Applied Date</th>
                <th className="p-3 text-center">Current Funnel Stage</th>
                <th className="p-3">Stage Remarks</th>
                <th className="p-3 text-right">Student Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-rvu-muted font-sans">
                    No applications match this filter query.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const student = store.students.find(s => s.id === app.studentId);
                  const candidateName = student ? student.name : app.studentId;
                  return (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <button
                          onClick={() => onNavigate(`/management/students/${app.studentId}`)}
                          className="font-sans font-semibold text-white hover:text-gold text-left block"
                        >
                          {candidateName}
                        </button>
                        <span className="text-[10px] text-rvu-subtle">USN: {student?.universityRegisterNumber || app.studentId}</span>
                      </td>

                      <td className="p-3">
                        <div className="font-sans text-white font-medium">{app.role}</div>
                        <div className="text-[10px] text-gold flex items-center gap-1 font-sans">
                          <Building2 className="w-3 h-3" />
                          <span>{app.companyName}</span>
                        </div>
                      </td>

                      <td className="p-3 text-rvu-subtle">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>

                      <td className="p-3 text-center">
                        {getStageBadge(app.stage)}
                      </td>

                      <td className="p-3 font-sans text-rvu-muted text-[11px] max-w-[240px] truncate">
                        {app.nextAction?.description || 'Candidate profile actively under corporate evaluation.'}
                      </td>

                      <td className="p-3 text-right font-sans">
                        <button
                          onClick={() => onNavigate(`/management/students/${app.studentId}`)}
                          className="text-gold hover:underline text-xs flex items-center justify-end gap-1 ml-auto"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
