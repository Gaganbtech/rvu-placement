import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Code2,
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface ShortlistManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const ShortlistManagementView: React.FC<ShortlistManagementViewProps> = ({
  store,
  onNavigate
}) => {
  const apps = store.recruiterApplications;
  const candidates = store.recruiterCandidates;

  // Candidates currently in SHORTLISTED stage
  const shortlistedApps = apps.filter(a => a.stage === 'SHORTLISTED');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filtered = shortlistedApps.filter(app => {
    const cand = candidates.find(c => c.id === app.studentId);
    return (
      app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cand && cand.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(a => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkMove = (nextStage: 'ASSESSMENT' | 'INTERVIEW') => {
    if (selectedIds.length === 0) return;
    store.bulkAdvanceApplications(selectedIds, nextStage, `Moved to ${nextStage} from Shortlist Desk`);
    setActionNotice(`Successfully advanced ${selectedIds.length} candidate(s) to ${nextStage}.`);
    setSelectedIds([]);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Shortlist Management Desk
          </h1>
          <p className="text-xs text-gray-400">
            Organize pre-screened RVU candidates ready for technical assessments or interview rounds
          </p>
        </div>

        <div className="text-xs font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          {shortlistedApps.length} Shortlisted Candidates
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shortlisted candidates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#20303A] text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none placeholder-gray-400"
          />
        </div>

        {/* Bulk Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => handleBulkMove('ASSESSMENT')}
            disabled={selectedIds.length === 0}
            className="px-3.5 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Move to Assessment ({selectedIds.length})</span>
          </button>

          <button
            onClick={() => handleBulkMove('INTERVIEW')}
            disabled={selectedIds.length === 0}
            className="px-3.5 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Move to Interview ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Table / List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <CheckSquare className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No candidates in Shortlist</div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Candidates who clear initial screening or are marked shortlisted will appear here for batch processing.
          </p>
          <button
            onClick={() => onNavigate('/recruiter/applications')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs"
          >
            <span>Review Applications</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-xs text-gray-400">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-[#CCAA68]" />
              <span>Select all ({filtered.length})</span>
            </button>
            <span>{selectedIds.length} of {filtered.length} selected</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filtered.map(app => {
              const cand = candidates.find(c => c.id === app.studentId);
              const isSelected = selectedIds.includes(app.id);

              return (
                <div
                  key={app.id}
                  className={`p-4 rounded-xl bg-[#19252F] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isSelected ? 'border-[#CCAA68] bg-[#20303A]' : 'border-[#CCAA68]/20 hover:border-[#CCAA68]/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(app.id)}
                      className="rounded accent-[#CCAA68] w-4 h-4"
                    />

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm">{cand?.name || 'RVU Candidate'}</span>
                        <span className="text-[10px] bg-[#20303A] text-gray-300 px-2 py-0.5 rounded font-mono border border-white/10">
                          {app.studentId}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                          {cand?.cgpa} CGPA
                        </span>
                      </div>

                      <div className="text-xs text-gray-300">
                        {app.role} • {cand?.programme}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => store.advanceApplicationStage(app.id, 'ASSESSMENT', 'Advanced directly from Shortlist Desk')}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-medium transition-colors"
                    >
                      To Assessment
                    </button>
                    <button
                      onClick={() => store.advanceApplicationStage(app.id, 'INTERVIEW', 'Scheduled for technical interview round')}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 text-xs font-medium transition-colors"
                    >
                      To Interview
                    </button>
                    <button
                      onClick={() => onNavigate(`/recruiter/applications/${app.id}`)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
