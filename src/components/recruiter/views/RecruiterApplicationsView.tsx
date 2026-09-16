import React, { useState } from 'react';
import {
  Search,
  Users,
  CheckCircle2,
  ChevronRight,
  CheckSquare,
  Square,
  Download
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { ApplicationStage } from '../../../data/platform/types';
import { triggerFileDownload, generateSampleResumeDataUrl } from '../../../utils/fileStorage';

interface RecruiterApplicationsViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
  initialOpportunityId?: string;
  initialStage?: string;
}

export const RecruiterApplicationsView: React.FC<RecruiterApplicationsViewProps> = ({
  store,
  onNavigate,
  initialOpportunityId,
  initialStage
}) => {
  const apps = store.recruiterApplications;
  const candidates = store.recruiterCandidates;
  const opps = store.recruiterOpportunities;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>(initialStage || 'ALL');
  const [selectedOppId, setSelectedOppId] = useState<string>(initialOpportunityId || 'ALL');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

  const filteredApps = apps.filter(app => {
    const cand = candidates.find(c => c.id === app.studentId);
    const matchesSearch =
      app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cand && cand.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStage = selectedStage === 'ALL' || app.stage === selectedStage;
    const matchesOpp = selectedOppId === 'ALL' || app.opportunityId === selectedOppId;

    return matchesSearch && matchesStage && matchesOpp;
  });

  const toggleSelectAll = () => {
    if (selectedAppIds.length === filteredApps.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredApps.map(a => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedAppIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAdvance = (stage: ApplicationStage) => {
    if (selectedAppIds.length === 0) return;
    store.bulkAdvanceApplications(selectedAppIds, stage, `Bulk transitioned to ${stage} by recruiter`);
    setBulkActionSuccess(`Successfully moved ${selectedAppIds.length} candidates to ${stage}`);
    setSelectedAppIds([]);
    setTimeout(() => setBulkActionSuccess(null), 4000);
  };

  const stages: { stage: string; label: string }[] = [
    { stage: 'ALL', label: 'All Stages' },
    { stage: 'APPLIED', label: 'Applied' },
    { stage: 'UNDER_REVIEW', label: 'Under Review' },
    { stage: 'SHORTLISTED', label: 'Shortlisted' },
    { stage: 'ASSESSMENT', label: 'Assessment' },
    { stage: 'INTERVIEW', label: 'Interview' },
    { stage: 'SELECTED', label: 'Selected' },
    { stage: 'OFFER', label: 'Offer' },
    { stage: 'REJECTED', label: 'Rejected' }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Candidate Applications Desk
          </h1>
          <p className="text-xs text-gray-400">
            Review and advance pre-screened RVU students across active hiring pipelines
          </p>
        </div>

        <div className="text-xs text-[#CCAA68] bg-[#CCAA68]/15 px-3 py-1.5 rounded-lg border border-[#CCAA68]/30 font-mono self-start sm:self-auto">
          {apps.length} Total Applications
        </div>
      </div>

      {/* Success Notification */}
      {bulkActionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{bulkActionSuccess}</span>
          </div>
          <button onClick={() => setBulkActionSuccess(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, USN, role..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#20303A] text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-gray-400 whitespace-nowrap">Opportunity:</span>
            <select
              value={selectedOppId}
              onChange={e => setSelectedOppId(e.target.value)}
              className="bg-[#20303A] text-white text-xs p-2 rounded-lg border border-[#CCAA68]/20 focus:outline-none w-full md:w-64 truncate"
            >
              <option value="ALL">All Postings ({opps.length})</option>
              {opps.map(o => (
                <option key={o.id} value={o.id}>
                  {o.role} ({o.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stage Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#CCAA68]/10">
          {stages.map(s => {
            const count = s.stage === 'ALL' ? apps.length : apps.filter(a => a.stage === s.stage).length;
            return (
              <button
                key={s.stage}
                onClick={() => setSelectedStage(s.stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedStage === s.stage
                    ? 'bg-[#CCAA68] text-[#101A22] font-semibold shadow-sm'
                    : 'bg-[#20303A] text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{s.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedStage === s.stage ? 'bg-[#101A22] text-[#CCAA68]' : 'bg-[#101A22]/60 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Header when items selected */}
      {selectedAppIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[#20303A] border border-[#CCAA68]/40 flex flex-wrap items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-white">
            <CheckSquare className="w-4 h-4 text-[#CCAA68]" />
            <span><strong className="text-[#CCAA68]">{selectedAppIds.length}</strong> candidates selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400 text-[11px]">Advance selected to:</span>
            <button
              onClick={() => handleBulkAdvance('SHORTLISTED')}
              className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-medium"
            >
              Shortlisted
            </button>
            <button
              onClick={() => handleBulkAdvance('ASSESSMENT')}
              className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 font-medium"
            >
              Assessment
            </button>
            <button
              onClick={() => handleBulkAdvance('INTERVIEW')}
              className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 font-medium"
            >
              Interview
            </button>
            <button
              onClick={() => handleBulkAdvance('SELECTED')}
              className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 font-medium"
            >
              Selected
            </button>
          </div>
        </div>
      )}

      {/* Applications Table / Cards */}
      {filteredApps.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <Users className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No applications match the filters</div>
          <p className="text-xs text-gray-400">
            Try resetting your search query or stage filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-xs text-gray-400">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              {selectedAppIds.length === filteredApps.length ? (
                <CheckSquare className="w-4 h-4 text-[#CCAA68]" />
              ) : (
                <Square className="w-4 h-4 text-gray-500" />
              )}
              <span>Select all ({filteredApps.length})</span>
            </button>
            <span>Showing {filteredApps.length} candidates</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredApps.map(app => {
              const cand = candidates.find(c => c.id === app.studentId);
              const isSelected = selectedAppIds.includes(app.id);

              return (
                <div
                  key={app.id}
                  className={`p-4 rounded-xl bg-[#19252F] border transition-all ${
                    isSelected ? 'border-[#CCAA68] bg-[#20303A]/60' : 'border-[#CCAA68]/20 hover:border-[#CCAA68]/50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => toggleSelectOne(app.id)}
                        className="mt-1 text-gray-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#CCAA68]" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-500" />
                        )}
                      </button>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-white">
                            {cand?.name || 'RVU Student'}
                          </h3>
                          <span className="text-[10px] bg-[#20303A] text-gray-300 px-2 py-0.5 rounded font-mono border border-white/10">
                            {app.studentId}
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold bg-[#CCAA68]/20 text-[#D8B978] border border-[#CCAA68]/30">
                            {app.stage}
                          </span>
                        </div>

                        <div className="text-xs text-gray-300 flex flex-wrap items-center gap-2">
                          <span className="font-medium text-white">{app.role}</span>
                          <span>•</span>
                          <span>CGPA: <strong className="text-emerald-400">{cand?.cgpa || '8.42'}</strong></span>
                          <span>•</span>
                          <span>{cand?.programme || 'B.Tech (Hons.) Computer Science & Engineering'}</span>
                        </div>

                        <div className="text-[11px] text-gray-400 flex items-center gap-2">
                          <span>Applied: {app.submittedAt}</span>
                          <span>•</span>
                          <span>Updated: {app.updatedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                      <button
                        onClick={() => {
                          const skillNames = cand?.skills?.map(s => typeof s === 'string' ? s : s.name) || ['React', 'TypeScript', 'System Design'];
                          const dataUrl = app.resumeDataUrl || generateSampleResumeDataUrl(cand?.name || 'RVU Student', cand?.programme || 'B.Tech CSE', skillNames);
                          const fileName = app.resumeFileName || `${cand?.name?.replace(/\s+/g, '_') || 'Candidate'}_Resume.pdf`;
                          triggerFileDownload(dataUrl, fileName);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30 font-medium transition-colors flex items-center gap-1.5"
                        title="Download Candidate Resume"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                      <button
                        onClick={() => onNavigate(`/recruiter/candidates/${app.studentId}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-gray-200 text-xs border border-white/10 font-medium transition-colors"
                      >
                        Profile Dossier
                      </button>
                      <button
                        onClick={() => onNavigate(`/recruiter/applications/${app.id}`)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>Stage Actions</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
