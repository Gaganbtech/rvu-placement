import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  LifeBuoy
} from 'lucide-react';
import type { Application, Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentApplicationDetailViewProps {
  applicationId: string;
  student: Student;
  applications: Application[];
  onNavigate: (route: string) => void;
}

export const StudentApplicationDetailView: React.FC<StudentApplicationDetailViewProps> = ({
  applicationId,
  student,
  applications,
  onNavigate
}) => {
  const app = applications.find(a => a.id === applicationId);

  if (!app) {
    return (
      <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 space-y-4">
        <h2 className="text-xl font-bold text-white">Application Record Not Found</h2>
        <p className="text-sm text-rvu-muted">No application with identifier {applicationId} was found.</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('/student/applications')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Back link */}
      <div>
        <button
          onClick={() => onNavigate('/student/applications')}
          className="flex items-center gap-2 text-xs font-mono text-rvu-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Applications</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-6 shadow-card-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 border-2 border-gold/40 flex items-center justify-center text-gold font-bold text-2xl shadow-gold-glow">
              {app.companyName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-rvu-muted font-medium">
                  {app.companyName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-gold/15 text-gold border border-gold/30">
                  {app.type}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/20">
                  CAR Synchronized
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {app.role}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle pt-1">
                <span>Application ID: <strong className="text-white">{app.id}</strong></span>
                <span>•</span>
                <span>Submitted: <strong className="text-white">{app.submittedAt}</strong></span>
                <span>•</span>
                <span>Compensation: <strong className="text-emerald-400">{app.compensation}</strong></span>
              </div>
            </div>
          </div>

          {/* Current Stage Indicator */}
          <div className="p-4 rounded-xl bg-[#0E1720] border border-gold/40 text-center sm:text-right shrink-0 space-y-1">
            <span className="text-[10px] font-mono text-rvu-subtle uppercase block">
              CURRENT STAGE
            </span>
            <div className="text-xl font-mono font-bold text-gold uppercase tracking-wider">
              {app.stage}
            </div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active in Recruiter Queue</span>
            </div>
          </div>
        </div>

        {/* Prompt Required Action Banner: Current Stage, Next Action, Deadline */}
        {app.nextAction && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#101A22] to-amber-500/5 border border-amber-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2.5">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>NEXT ACTION: {app.nextAction.title}</span>
              </div>

              <div className="text-xs font-mono text-amber-400 font-bold">
                DEADLINE: {app.nextAction.deadline}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-rvu-muted leading-relaxed">
              {app.nextAction.description}
            </p>

            {app.nextAction.actionUrl && (
              <div className="pt-1">
                <a
                  href={app.nextAction.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-navy-dark font-bold font-mono text-xs hover:bg-gold-light transition-all shadow-gold-glow"
                >
                  <span>Launch Proctored Assessment Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Grid: Timeline & Evaluation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-2xl bg-navy-card border border-gold-border/60 space-y-6 shadow-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                  Shared Lifecycle Progress
                </span>
                <h2 className="text-lg font-bold text-white font-display">
                  Application Timeline
                </h2>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-faint text-gold">
                LIVE STATUS
              </span>
            </div>

            {/* Step-by-step Timeline */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {app.timeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Node Icon */}
                  <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-transform ${
                    step.completed 
                      ? 'bg-emerald-500 text-navy-dark shadow-sm' 
                      : step.active 
                      ? 'bg-gold text-navy-dark ring-4 ring-gold/20 animate-pulse' 
                      : 'bg-navy-surface border border-white/20 text-rvu-subtle'
                  }`}>
                    {step.completed ? '✓' : idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`text-sm font-bold ${
                        step.active ? 'text-gold' : step.completed ? 'text-white' : 'text-rvu-muted'
                      }`}>
                        {step.label}
                      </h4>
                      <span className="text-[10px] font-mono text-rvu-subtle">
                        {step.timestamp}
                      </span>
                    </div>

                    {step.remarks && (
                      <p className="text-xs text-rvu-muted leading-relaxed">
                        {step.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 text-[11px] text-rvu-subtle font-mono">
              * Recruiter updates propagate into the timeline once processed by CAR. Students cannot modify recruiter-controlled status.
            </div>
          </div>

          {/* Assessment Details Card (if applicable) */}
          {app.assessmentDetails && (
            <div className="p-6 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4">
              <h3 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
                Assessment Instructions & Guidelines
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono p-3.5 rounded-xl bg-[#0E1720] border border-white/5">
                <div>
                  <span className="text-[10px] text-rvu-subtle block">Platform</span>
                  <strong className="text-white">{app.assessmentDetails.platform}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-rvu-subtle block">Duration</span>
                  <strong className="text-white">{app.assessmentDetails.durationMinutes} Minutes</strong>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-rvu-subtle block">Assessment Window</span>
                  <span className="text-amber-300">{app.assessmentDetails.windowStart} &rarr; {app.assessmentDetails.windowEnd}</span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-rvu-muted">
                {app.assessmentDetails.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Col: Placement Office / Query Desk */}
        <div className="space-y-6">
          
          {/* Query Support Card */}
          <div className="p-6 rounded-2xl bg-navy-card border border-gold-border/40 space-y-4 shadow-card">
            <div className="flex items-center gap-2 text-gold">
              <LifeBuoy className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-display">
                Need Help with this Drive?
              </h3>
            </div>

            <p className="text-xs text-rvu-muted leading-relaxed">
              If you have scheduling conflicts, technical issues during testing, or queries about this recruitment process, raise a ticket directly to the Placement Office.
            </p>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('/student/support')}
              className="w-full justify-center text-xs"
              icon={<LifeBuoy className="w-4 h-4" />}
            >
              Raise Query with Placement Office
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="p-5 rounded-2xl bg-[#0E1720] border border-white/5 text-xs space-y-2 text-rvu-subtle">
            <div className="flex items-center gap-2 text-white font-bold font-mono text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CANDIDATE PRIVACY BOUNDARY</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              You are viewing candidate credentials and status specific to student ID <strong className="text-white">{student.id}</strong>. Recruiter internal notes, candidate comparative scorecards, and other student applications are inaccessible per RVU Placement Regulations.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
