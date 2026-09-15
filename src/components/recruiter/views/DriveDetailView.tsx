import React from 'react';
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface DriveDetailViewProps {
  driveId: string;
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const DriveDetailView: React.FC<DriveDetailViewProps> = ({
  driveId,
  store,
  onNavigate
}) => {
  const drive = store.recruiterDrives.find(d => d.id === driveId) || store.placementDrives.find(d => d.id === driveId);
  const candidates = store.recruiterCandidates;

  if (!drive) {
    return (
      <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="text-sm font-semibold text-white">Campus Drive Session Not Found</div>
        <button
          onClick={() => onNavigate('/recruiter/drives')}
          className="px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Drives</span>
        </button>
      </div>
    );
  }

  const roster = drive.attendanceRoster || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/recruiter/drives')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Drives</span>
        </button>

        <button
          onClick={() => onNavigate('/recruiter/messages')}
          className="px-3.5 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-[#CCAA68] text-xs border border-[#CCAA68]/30 font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Message Campus Coordinator</span>
        </button>
      </div>

      {/* Main Drive Header */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CCAA68]/15 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{drive.title}</h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400">
                {drive.status}
              </span>
            </div>
            <div className="text-xs text-gray-300">
              Host Organization: <strong className="text-white">{drive.companyName}</strong> • Mode: <strong className="text-[#CCAA68]">{drive.mode}</strong>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Date & Time</div>
            <div className="text-sm font-bold text-white">{drive.date} • {drive.timeSlot}</div>
          </div>
        </div>

        {/* Campus Venue & Infrastructure */}
        <div className="p-4 rounded-xl bg-[#20303A] border border-[#CCAA68]/20 space-y-2 text-xs">
          <div className="font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#CCAA68]" />
            <span>Assigned Campus Venue: {drive.venue}</span>
          </div>
          <div className="text-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>80 Lab Systems Provisioned</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Node 20 & Python 3.11 Configured</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auditorium A Reserved for PPT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Drive Recruitment Funnel */}
      <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
          Campus Drive Funnel Breakdown
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#20303A] border border-white/5 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-mono">1. Registered</div>
            <div className="text-2xl font-bold text-white">{roster.length}</div>
            <div className="text-[10px] text-gray-400">Eligible cohort RSVPs</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#20303A] border border-white/5 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-mono">2. Shortlisted</div>
            <div className="text-2xl font-bold text-amber-400">
              {roster.filter(r => r.attendanceStatus === 'SHORTLISTED').length || 1}
            </div>
            <div className="text-[10px] text-gray-400">Cleared initial screening</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#20303A] border border-white/5 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-mono">3. Technical Round</div>
            <div className="text-2xl font-bold text-blue-400">
              {store.recruiterInterviews.length}
            </div>
            <div className="text-[10px] text-gray-400">Scheduled interviews</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#20303A] border border-white/5 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-mono">4. Offers Extended</div>
            <div className="text-2xl font-bold text-emerald-400">
              {store.recruiterOffers.length}
            </div>
            <div className="text-[10px] text-gray-400">Final selectees</div>
          </div>
        </div>
      </div>

      {/* Drive Attendance Roster */}
      <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Attendance Roster & Student Pre-Registration ({roster.length})
          </h3>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CAR Official Registration</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {roster.map(entry => {
            const cand = candidates.find(c => c.id === entry.studentId);

            return (
              <div
                key={entry.studentId}
                className="p-3.5 rounded-lg bg-[#20303A] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{entry.studentName}</span>
                    <span className="text-[10px] bg-[#101A22] text-gray-300 px-2 py-0.5 rounded font-mono">
                      {entry.studentId}
                    </span>
                    <span className="text-emerald-400 font-bold text-[11px]">• CGPA: {cand?.cgpa || '8.42'}</span>
                  </div>
                  <div className="text-gray-400 text-[11px] mt-0.5">
                    Registered on {entry.registeredAt} • {cand?.programme || 'B.Tech CSE'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    entry.attendanceStatus === 'SHORTLISTED'
                      ? 'bg-[#CCAA68] text-[#101A22]'
                      : 'bg-white/10 text-gray-300'
                  }`}>
                    {entry.attendanceStatus}
                  </span>

                  <button
                    onClick={() => onNavigate(`/recruiter/candidates/${entry.studentId}`)}
                    className="px-3 py-1 rounded bg-[#101A22] text-gray-200 hover:text-white hover:bg-white/10 text-xs border border-white/10 transition-colors"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
