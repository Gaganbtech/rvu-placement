import React from 'react';
import {
  Building,
  Calendar,
  MapPin,
  Users,
  ChevronRight
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterDrivesViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const RecruiterDrivesView: React.FC<RecruiterDrivesViewProps> = ({
  store,
  onNavigate
}) => {
  const drives = store.recruiterDrives;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Institutional Campus Recruitment Drives
          </h1>
          <p className="text-xs text-gray-400">
            Dedicated on-campus placement drives and laboratory session schedules organized with RVU CAR Office
          </p>
        </div>

        <div className="text-xs text-[#CCAA68] bg-[#CCAA68]/15 px-3 py-1.5 rounded-lg border border-[#CCAA68]/30 font-mono self-start sm:self-auto">
          {drives.length} Campus Drive Session(s)
        </div>
      </div>

      {/* Drives Grid */}
      {drives.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <Building className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No Campus Drives Scheduled</div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Contact the RVU Placement Office (CAR) to finalize dates and reserve campus auditoriums and computer labs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {drives.map(drive => (
            <div
              key={drive.id}
              className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 transition-all space-y-4 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CCAA68]/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">{drive.title}</h2>
                    <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400">
                      {drive.status}
                    </span>
                    <span className="text-[10px] bg-[#20303A] text-gray-300 px-2 py-0.5 rounded font-mono border border-white/10">
                      {drive.id}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 flex items-center gap-2">
                    <span>{drive.companyName}</span>
                    <span>•</span>
                    <span className="text-[#CCAA68]">{drive.mode} Drive</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(`/recruiter/drives/${drive.id}`)}
                  className="px-4 py-2 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-md"
                >
                  <span>Drive Operations Console</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Logistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#20303A]">
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Date & Reporting Time</div>
                  <div className="font-semibold text-white mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#CCAA68]" />
                    <span>{drive.date}</span>
                  </div>
                  <div className="text-gray-400 text-[11px] mt-0.5">{drive.timeSlot}</div>
                </div>

                <div className="p-3 rounded-lg bg-[#20303A]">
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Campus Venue Assigned</div>
                  <div className="font-semibold text-white mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#CCAA68]" />
                    <span className="truncate">{drive.venue}</span>
                  </div>
                  <div className="text-emerald-400 text-[10px] mt-0.5">Auditorium & Lab Suites Reserved</div>
                </div>

                <div className="p-3 rounded-lg bg-[#20303A]">
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Registered Roster</div>
                  <div className="font-semibold text-white mt-0.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#CCAA68]" />
                    <span>{drive.attendanceRoster?.length || 0} Candidates</span>
                  </div>
                  <div className="text-gray-400 text-[11px] mt-0.5">Pre-verified attendance sheet</div>
                </div>
              </div>

              {/* Coordinator Contact */}
              <div className="text-xs text-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/5">
                <div>
                  CAR Campus Coordinator: <strong className="text-white">{drive.coordinatorContact.name}</strong> ({drive.coordinatorContact.role})
                </div>
                <div className="text-[#CCAA68] font-mono text-[11px]">
                  {drive.coordinatorContact.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
