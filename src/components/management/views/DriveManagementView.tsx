import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  MapPin,
  Plus,
  X,
  ChevronRight
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { PlacementDrive } from '../../../data/platform/types';

interface DriveManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const DriveManagementView: React.FC<DriveManagementViewProps> = ({
  store
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);

  // New Drive Form
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    roleTitle: '',
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    time: '09:30 AM',
    venue: 'CAR Placement Auditorium, Block A, RVU Campus',
    minCgpa: 7.5,
    maxBacklogs: 0,
    rounds: 'Online Aptitude & Coding, Technical Interview, HR Discussion'
  });

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrive.companyName.trim() || !newDrive.roleTitle.trim()) return;

    const drive: PlacementDrive = {
      id: `drv_${Date.now()}`,
      title: newDrive.roleTitle.trim(),
      companyId: `comp_${Date.now()}`,
      companyName: newDrive.companyName.trim(),
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
      date: newDrive.date,
      timeSlot: newDrive.time,
      venue: newDrive.venue,
      mode: 'On-Campus',
      eligibleProgrammes: ['B.Tech Computer Science & Engineering', 'B.Sc Data Science', 'B.Des'],
      associatedOpportunityIds: [],
      status: 'UPCOMING',
      instructions: newDrive.rounds.split(',').map(r => r.trim()).filter(Boolean),
      coordinatorContact: {
        name: 'Prof. S. R. Murthy',
        role: 'CAR Placement Director',
        email: 'car@rvu.edu.in'
      },
      attendanceRoster: store.students
        .filter(s => s.cgpa >= newDrive.minCgpa && s.activeBacklogs <= newDrive.maxBacklogs)
        .slice(0, 15)
        .map(s => ({
          studentId: s.id,
          studentName: s.name,
          registeredAt: new Date().toISOString(),
          attendanceStatus: 'REGISTERED'
        }))
    };

    store.addPlacementDrive(drive);
    setShowCreateModal(false);
  };

  const getStatusBadge = (status: PlacementDrive['status']) => {
    switch (status) {
      case 'ONGOING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />ONGOING</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">COMPLETED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">UPCOMING</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              RECRUITMENT CALENDAR & VENUES
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {store.drives.length} Scheduled Drives
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            On-Campus Placement Drives Desk
          </h1>
          <p className="text-xs text-rvu-muted">
            Manage physical and virtual drive schedules, auditorium allocations, attendee rosters, and real-time round progression.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy-dark font-bold text-xs flex items-center gap-1.5 transition-all shadow-gold-glow shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Campus Drive</span>
        </button>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.drives.map((drive) => {
          const registeredCount = drive.attendanceRoster?.length || 12;
          const attendedCount = drive.attendanceRoster?.filter(r => r.attendanceStatus === 'PRESENT' || r.attendanceStatus === 'SHORTLISTED' || r.attendanceStatus === 'SELECTED').length || 0;
          const selectedCount = drive.attendanceRoster?.filter(r => r.attendanceStatus === 'SELECTED').length || 0;

          return (
            <div
              key={drive.id}
              className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 hover:border-gold/60 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-gold font-bold">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{drive.companyName}</span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-0.5">{drive.title}</h3>
                  </div>
                  {getStatusBadge(drive.status)}
                </div>

                <div className="space-y-1.5 text-xs text-rvu-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="font-mono">{drive.date} &bull; {drive.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="truncate">{drive.venue}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#142330] border border-white/5 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-rvu-subtle">ROSTER</div>
                    <div className="text-white font-bold mt-0.5">{registeredCount}</div>
                  </div>
                  <div className="border-x border-white/5">
                    <div className="text-[10px] text-rvu-subtle">ATTENDED</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{attendedCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-rvu-subtle">SELECTS</div>
                    <div className="text-gold font-bold mt-0.5">{selectedCount}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-rvu-subtle uppercase">Instructions / Rounds:</div>
                  <div className="flex flex-wrap gap-1">
                    {drive.instructions.map((inst, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-rvu-muted">
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-rvu-subtle">
                  Mode: <strong className="text-white">{drive.mode}</strong>
                </span>

                <button
                  onClick={() => setSelectedDrive(drive)}
                  className="text-gold hover:underline flex items-center gap-1 font-mono text-xs"
                >
                  <span>Manage Roster</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Roster & Attendance Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#111C26] border border-gold-border/60 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-gold uppercase">{selectedDrive.companyName}</span>
                <h3 className="text-base font-bold text-white font-display">
                  {selectedDrive.title} &mdash; Drive Roster
                </h3>
              </div>
              <button
                onClick={() => setSelectedDrive(null)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#142330] border border-white/5 flex items-center justify-between text-xs font-mono">
              <span>Date: <strong className="text-white">{selectedDrive.date}</strong></span>
              <span>Venue: <strong className="text-white">{selectedDrive.venue}</strong></span>
              <span>Roster: <strong className="text-gold">{selectedDrive.attendanceRoster?.length || store.students.length}</strong></span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-rvu-subtle">Candidates in Drive Pipeline</h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                {store.students.slice(0, 8).map((st) => (
                  <div key={st.id} className="p-2.5 rounded-lg bg-[#142330] border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white font-sans">{st.name}</div>
                      <div className="text-[10px] text-rvu-subtle font-mono">{st.universityRegisterNumber || st.id} &bull; CGPA: {st.cgpa}</div>
                    </div>

                    <button
                      onClick={() => {
                        store.markDriveAttendance(selectedDrive.id, st.id, true);
                        alert(`Attendance logged for ${st.name}`);
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono hover:bg-emerald-500/30"
                    >
                      Mark Present
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedDrive(null)}
                className="px-4 py-2 rounded-lg bg-gold text-navy-dark font-bold text-xs"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Drive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#111C26] border border-gold-border/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                Schedule New Campus Placement Drive
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div>
                <label className="block text-rvu-muted mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Systems"
                  value={newDrive.companyName}
                  onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Drive Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Development Engineer & Cloud Specialist"
                  value={newDrive.roleTitle}
                  onChange={(e) => setNewDrive({ ...newDrive, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rvu-muted mb-1">Drive Date</label>
                  <input
                    type="date"
                    value={newDrive.date}
                    onChange={(e) => setNewDrive({ ...newDrive, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-rvu-muted mb-1">Reporting Time</label>
                  <input
                    type="text"
                    value={newDrive.time}
                    onChange={(e) => setNewDrive({ ...newDrive, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Campus Venue / Aud-Block</label>
                <input
                  type="text"
                  value={newDrive.venue}
                  onChange={(e) => setNewDrive({ ...newDrive, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rvu-muted mb-1">Min CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={newDrive.minCgpa}
                    onChange={(e) => setNewDrive({ ...newDrive, minCgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-rvu-muted mb-1">Max Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={newDrive.maxBacklogs}
                    onChange={(e) => setNewDrive({ ...newDrive, maxBacklogs: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Instructions / Process Rounds (Comma-separated)</label>
                <input
                  type="text"
                  value={newDrive.rounds}
                  onChange={(e) => setNewDrive({ ...newDrive, rounds: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
