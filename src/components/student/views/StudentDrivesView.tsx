import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';
import type { PlacementDrive, Student, Opportunity, Application } from '../../../data/platform/types';
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
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                CAMPUS RECRUITMENT SCHEDULE
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Managed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              My Placement Drives
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              On-campus and hybrid recruitment drives scheduled for the {student.programme} 2027 cohort. Drives are coordinated by the Corporate & Alumni Relations (CAR) office.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <div className="text-2xl font-bold font-mono text-gold">
              {placementDrives.length}
            </div>
            <div className="text-xs text-rvu-subtle font-mono">
              Scheduled Drives
            </div>
          </div>
        </div>
      </div>

      {/* Drives List */}
      <div className="space-y-6">
        {placementDrives.map((drive) => {
          const associatedOpp = opportunities.find(o => drive.associatedOpportunityIds.includes(o.id));
          const app = associatedOpp ? applications.find(a => a.opportunityId === associatedOpp.id) : undefined;
          const isApplied = !!app;

          return (
            <div
              key={drive.id}
              className="rounded-2xl bg-navy-card border border-gold-border/60 hover:border-gold transition-all p-6 sm:p-8 space-y-6 shadow-card"
            >
              {/* Top Drive Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-xl shrink-0">
                    {drive.companyName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rvu-muted font-medium">
                        {drive.companyName}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-gold/15 text-gold border border-gold/30">
                        {drive.mode}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {drive.status}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white font-display mt-0.5">
                      {drive.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle pt-1">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <Calendar className="w-3.5 h-3.5" />
                        {drive.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        {drive.timeSlot}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold" />
                        {drive.venue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Application CTA */}
                <div className="flex items-center gap-3 shrink-0">
                  {isApplied ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(`/student/applications/${app.id}`)}
                      className="border-emerald-500/40 text-emerald-300"
                      icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    >
                      Applied (Stage: {app.stage})
                    </Button>
                  ) : associatedOpp ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenApplyModal(associatedOpp)}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Apply for Drive Role
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onNavigate('/student/opportunities')}
                    >
                      View Opportunities
                    </Button>
                  )}
                </div>
              </div>

              {/* Instructions & Guidelines for this drive */}
              <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-gold font-bold uppercase">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Placement Drive Instructions:</span>
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
                <div>
                  Placement Coordinator: <strong className="text-white">{drive.coordinatorContact.name}</strong> ({drive.coordinatorContact.role})
                </div>
                <a 
                  href={`mailto:${drive.coordinatorContact.email}`}
                  className="text-gold hover:underline"
                >
                  {drive.coordinatorContact.email}
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
