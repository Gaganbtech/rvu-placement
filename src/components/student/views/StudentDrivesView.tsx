import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  UserCheck,
  FileText,
  Mail,
  ShieldCheck,
  Users
} from 'lucide-react';
import type { PlacementDrive, Student, Opportunity, Application } from '../../../data/platform/types';
import { useStudentStore } from '../../../data/platform/studentStore';
import { Button } from '../../ui/Button';

interface StudentDrivesViewProps {
  student: Student;
  placementDrives: PlacementDrive[];
  opportunities: Opportunity[];
  applications: Application[];
  onNavigate: (route: string) => void;
  onOpenApplyModal: (opp: Opportunity) => void;
}

export const StudentDrivesView: React.FC<StudentDrivesViewProps> = ({
  student,
  placementDrives,
  opportunities,
  applications,
  onNavigate,
  onOpenApplyModal
}) => {
  const store = useStudentStore();
  const [filterMode, setFilterMode] = useState<'ALL' | 'REGISTERED' | 'UPCOMING'>('ALL');
  const [selectedInstructionsDrive, setSelectedInstructionsDrive] = useState<PlacementDrive | null>(null);

  // Filter drives
  const filteredDrives = placementDrives.filter(drive => {
    const isRegistered = drive.attendanceRoster?.some(r => r.studentId === student.id) ?? false;
    if (filterMode === 'REGISTERED') return isRegistered;
    if (filterMode === 'UPCOMING') return drive.status === 'UPCOMING' || drive.status === 'ONGOING';
    return true;
  });

  const registeredCount = placementDrives.filter(d => d.attendanceRoster?.some(r => r.studentId === student.id)).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                CAMPUS RECRUITMENT SCHEDULE
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Managed Drives
              </span>
              <span className="text-[10px] font-mono text-rvu-muted bg-white/5 px-2 py-0.5 rounded border border-white/10">
                Active Cohort: {student.programme} 2027
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-2">
              Campus Placement Drives
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Official on-campus and virtual recruitment schedules organized by the RV University Corporate & Alumni Relations (CAR) Directorate. Register for scheduled drive slots to ensure interview allocation.
            </p>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-gold">
                {placementDrives.length}
              </div>
              <div className="text-xs text-rvu-subtle font-mono">
                Total Drives
              </div>
            </div>
            <div className="text-right border-l border-white/10 pl-4">
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {registeredCount}
              </div>
              <div className="text-xs text-rvu-subtle font-mono">
                Registered
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              filterMode === 'ALL'
                ? 'bg-gold text-navy-dark font-bold'
                : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
            }`}
          >
            All Drives ({placementDrives.length})
          </button>

          <button
            onClick={() => setFilterMode('REGISTERED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              filterMode === 'REGISTERED'
                ? 'bg-emerald-500 text-navy-dark font-bold'
                : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
            }`}
          >
            Registered Only ({registeredCount})
          </button>

          <button
            onClick={() => setFilterMode('UPCOMING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              filterMode === 'UPCOMING'
                ? 'bg-gold/20 text-gold border border-gold/40 font-bold'
                : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
            }`}
          >
            Upcoming Only
          </button>
        </div>
      </div>

      {/* Drives List */}
      {filteredDrives.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 text-rvu-muted space-y-3">
          <p className="text-sm font-medium text-white">No drives found for the selected filter.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFilterMode('ALL')}
          >
            Show All Drives
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDrives.map((drive) => {
            const associatedOpp = opportunities.find(o => drive.associatedOpportunityIds.includes(o.id));
            const app = associatedOpp ? applications.find(a => a.opportunityId === associatedOpp.id) : undefined;
            const isApplied = !!app;
            const isRegistered = drive.attendanceRoster?.some(r => r.studentId === student.id) ?? false;

            return (
              <div
                key={drive.id}
                className="rounded-2xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all p-6 sm:p-8 space-y-6 shadow-card"
              >
                {/* Top Drive Info */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-xl shrink-0">
                      {drive.companyName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-rvu-muted font-medium">
                          {drive.companyName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                          {drive.mode}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {drive.status}
                        </span>
                        {isRegistered && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold">
                            <UserCheck className="w-3 h-3" />
                            Registered
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-white font-display mt-1">
                        {drive.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle pt-2">
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <Calendar className="w-3.5 h-3.5" />
                          {drive.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 text-white">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          {drive.timeSlot}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 text-white">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          {drive.venue}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 text-rvu-muted">
                          <Users className="w-3.5 h-3.5 text-rvu-subtle" />
                          {drive.attendanceRoster?.length || 0} Students Registered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Registration & Application */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                    {/* Register / Registered status */}
                    {isRegistered ? (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Slot Confirmed</span>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => store.registerForPlacementDrive(drive.id)}
                        icon={<UserCheck className="w-4 h-4" />}
                      >
                        Register for Drive
                      </Button>
                    )}

                    {/* Associated role application */}
                    {isApplied ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate(`/student/applications/${app.id}`)}
                        className="border-emerald-500/40 text-emerald-300"
                        icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      >
                        Applied ({app.stage})
                      </Button>
                    ) : associatedOpp ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenApplyModal(associatedOpp)}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Apply for Role
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate('/student/opportunities')}
                      >
                        View Roles
                      </Button>
                    )}
                  </div>
                </div>

                {/* Instructions & Guidelines for this drive */}
                <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-gold font-bold uppercase">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Drive Guidelines & Reporting Requirements:</span>
                    </div>
                    <button
                      onClick={() => setSelectedInstructionsDrive(drive)}
                      className="text-xs text-gold hover:underline font-mono flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      View Full Protocol
                    </button>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-rvu-muted">
                    {drive.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coordinator contact */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-rvu-subtle pt-2 border-t border-white/5 gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span>
                      Placement Officer: <strong className="text-white">{drive.coordinatorContact.name}</strong> ({drive.coordinatorContact.role})
                    </span>
                  </div>
                  <a 
                    href={`mailto:${drive.coordinatorContact.email}`}
                    className="text-gold hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {drive.coordinatorContact.email}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drive Protocol Modal */}
      {selectedInstructionsDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navy-card border border-gold-border rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-bold">
                  CAMPUS DRIVE PROTOCOL
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  {selectedInstructionsDrive.title}
                </h3>
                <p className="text-xs text-rvu-muted">
                  {selectedInstructionsDrive.companyName} • {selectedInstructionsDrive.venue}
                </p>
              </div>
              <button
                onClick={() => setSelectedInstructionsDrive(null)}
                className="text-rvu-subtle hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-rvu-muted">
              <div className="p-3 rounded-xl bg-[#0E1720] border border-white/10 space-y-1">
                <span className="font-bold text-white block">Schedule & Timings:</span>
                <p>Date: <strong className="text-amber-300">{selectedInstructionsDrive.date}</strong></p>
                <p>Slot: <strong className="text-white">{selectedInstructionsDrive.timeSlot}</strong></p>
                <p>Venue: <strong className="text-white">{selectedInstructionsDrive.venue}</strong></p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white block">Official Guidelines:</span>
                {selectedInstructionsDrive.instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-gold font-bold">{i + 1}.</span>
                    <span>{inst}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 text-rvu-text space-y-1">
                <span className="font-bold text-gold block">Code of Conduct:</span>
                <p>Students must carry physical RV University ID cards, 2 printed copies of their CAR-verified resume, and adhere to formal business attire.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedInstructionsDrive(null)}
              >
                Understood & Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
