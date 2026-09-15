import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  ChevronRight,
  Lock
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface CandidateDirectoryViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const CandidateDirectoryView: React.FC<CandidateDirectoryViewProps> = ({
  store,
  onNavigate
}) => {
  const candidates = store.recruiterCandidates;
  const apps = store.recruiterApplications;
  const activeCompany = store.activeCompany;

  const [searchTerm, setSearchTerm] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(0);
  const [programmeFilter, setProgrammeFilter] = useState<string>('ALL');

  // Extract unique programmes for dropdown
  const programmes = Array.from(new Set(candidates.map(c => c.programme).filter(Boolean)));

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cand.specialization && cand.specialization.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCgpa = cand.cgpa >= minCgpaFilter;
    const matchesProg = programmeFilter === 'ALL' || cand.programme === programmeFilter;

    return matchesSearch && matchesCgpa && matchesProg;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Candidate Talent Directory
          </h1>
          <p className="text-xs text-gray-400">
            Pre-screened RV University students actively engaged in hiring pipelines with {activeCompany?.name || 'your company'}
          </p>
        </div>

        <div className="text-xs text-[#CCAA68] bg-[#CCAA68]/15 px-3 py-1.5 rounded-lg border border-[#CCAA68]/30 font-mono self-start sm:self-auto">
          {candidates.length} Engaged Candidates
        </div>
      </div>

      {/* Institutional Privacy Scoping Notice */}
      <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#CCAA68] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-white">Institutional Privacy & FERPA Compliance</div>
          <p className="text-gray-300 leading-relaxed">
            In accordance with RV University data privacy regulations, recruiters have access to student dossiers solely for candidates who have applied to your opportunities, registered for your campus drives, or been assigned to assessment sessions.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, USN, specialization..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#20303A] text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none placeholder-gray-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Programme:</span>
            <select
              value={programmeFilter}
              onChange={e => setProgrammeFilter(e.target.value)}
              className="bg-[#20303A] text-white text-xs p-2 rounded-lg border border-[#CCAA68]/20 focus:outline-none max-w-xs truncate"
            >
              <option value="ALL">All Programmes</option>
              {programmes.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Min CGPA:</span>
            <select
              value={minCgpaFilter}
              onChange={e => setMinCgpaFilter(parseFloat(e.target.value))}
              className="bg-[#20303A] text-white text-xs p-2 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
            >
              <option value={0}>All CGPA</option>
              <option value={7.0}>7.0+ CGPA</option>
              <option value={7.5}>7.5+ CGPA</option>
              <option value={8.0}>8.0+ CGPA</option>
              <option value={8.5}>8.5+ CGPA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <Users className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No candidates found</div>
          <p className="text-xs text-gray-400">
            No candidates matched the current search criteria or CGPA threshold.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCandidates.map(cand => {
            const candApps = apps.filter(a => a.studentId === cand.id);
            const latestApp = candApps[0];

            return (
              <div
                key={cand.id}
                className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#CCAA68]/20 border border-[#CCAA68]/40 text-[#D8B978] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {cand.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{cand.name}</h3>
                        <div className="text-[11px] text-gray-400 font-mono">{cand.id}</div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-emerald-400">{cand.cgpa} CGPA</div>
                      <div className="text-[10px] text-gray-400">{cand.activeBacklogs} backlogs</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="font-medium text-white">{cand.programme}</div>
                    <div className="text-gray-400 text-[11px]">{cand.school} • Batch {cand.batch}</div>
                    {cand.specialization && (
                      <div className="text-[11px] text-[#CCAA68]">{cand.specialization}</div>
                    )}
                  </div>

                  {/* Active Application Tag */}
                  {latestApp && (
                    <div className="p-2.5 rounded-lg bg-[#20303A] border border-white/5 flex items-center justify-between text-xs">
                      <div className="min-w-0">
                        <div className="text-[10px] text-gray-400 uppercase font-mono">Applied Role</div>
                        <div className="text-white font-medium truncate">{latestApp.role}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#CCAA68]/20 text-[#D8B978] ml-2 flex-shrink-0">
                        {latestApp.stage}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#CCAA68]/10 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>CAR Verified</span>
                  </span>

                  <button
                    onClick={() => onNavigate(`/recruiter/candidates/${cand.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#CCAA68] text-white hover:text-[#101A22] text-xs font-semibold border border-[#CCAA68]/20 transition-all flex items-center gap-1.5"
                  >
                    <span>View Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
