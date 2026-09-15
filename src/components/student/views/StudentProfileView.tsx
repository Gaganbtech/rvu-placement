import React from 'react';
import { 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Mail
} from 'lucide-react';
import type { Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentProfileViewProps {
  student: Student;
  onNavigate: (route: string) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onNavigate
}) => {
  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-6 shadow-card-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gold/15 border-2 border-gold/50 flex items-center justify-center text-gold font-bold text-3xl shadow-gold-glow shrink-0">
              {student.name.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  DEMO STUDENT
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SIS Verified Profile</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {student.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle">
                <span className="text-white font-semibold">{student.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gold">
                  <Mail className="w-3 h-3" />
                  {student.email}
                </span>
                <span>•</span>
                <span>Class of {student.graduationYear}</span>
              </div>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0 space-y-1">
            <span className="text-[10px] font-mono text-rvu-subtle uppercase block">
              Placement Status
            </span>
            <div className="text-base font-mono font-bold text-emerald-400 flex items-center justify-end gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{student.eligibilityDriveScope}</span>
            </div>
            <div className="text-[10px] font-mono text-rvu-subtle">
              Verified by CAR Office
            </div>
          </div>
        </div>

        {/* Legend Notice: Distinction between Verified vs Provided */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-rvu-subtle font-mono gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <strong>UNIVERSITY VERIFIED DATA:</strong> Controlled by University SIS
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1.5 text-gold">
              <User className="w-3.5 h-3.5" />
              <strong>STUDENT PROVIDED DATA:</strong> Maintained by Candidate
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Verified SIS Data vs Student Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: UNIVERSITY VERIFIED DATA (Read-only, authoritative) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-navy-card border border-emerald-500/40 space-y-6 shadow-card">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                CENTRAL SIS RECORDS
              </span>
              <h2 className="text-lg font-bold text-white font-display">
                UNIVERSITY VERIFIED DATA
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Locked / Institutional
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-rvu-subtle text-[10px] uppercase">Registered Programme</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>University Verified</span>
                </span>
              </div>
              <div className="text-white font-bold text-sm">
                {student.programme}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-rvu-subtle text-[10px] uppercase">Academic School</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>University Verified</span>
                </span>
              </div>
              <div className="text-white font-bold text-sm">
                {student.school}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 space-y-1">
                <span className="text-rvu-subtle text-[10px] uppercase block">Cumulative CGPA</span>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                  {student.cgpa} / 10.0
                </div>
                <span className="text-[10px] text-rvu-subtle">Semesters I–V Consolidated</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 space-y-1">
                <span className="text-rvu-subtle text-[10px] uppercase block">Active Backlogs</span>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                  {student.activeBacklogs}
                </div>
                <span className="text-[10px] text-rvu-subtle">Zero pending subjects</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 space-y-1">
                <span className="text-rvu-subtle text-[10px] uppercase block">Academic Attendance</span>
                <div className="text-lg font-bold text-white font-mono">
                  {student.attendancePercentage}%
                </div>
                <span className="text-[10px] text-emerald-400">Above 75% threshold</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 space-y-1">
                <span className="text-rvu-subtle text-[10px] uppercase block">Graduation Batch</span>
                <div className="text-lg font-bold text-white font-mono">
                  Cohort {student.graduationYear}
                </div>
                <span className="text-[10px] text-rvu-subtle">Semester VI Enrolled</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 text-[11px] text-rvu-subtle">
            * Academic verification is governed by RV University Registrar & CAR Office. To request changes or submit re-evaluation grades, raise a ticket via Help & Support.
          </div>
        </div>

        {/* SECTION 2: STUDENT PROVIDED DATA */}
        <div className="p-6 sm:p-8 rounded-2xl bg-navy-card border border-gold-border/60 space-y-6 shadow-card">
          <div className="flex items-center justify-between border-b border-gold-border/30 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                <User className="w-4 h-4" />
                CANDIDATE CURATION
              </span>
              <h2 className="text-lg font-bold text-white font-display">
                STUDENT PROVIDED DATA
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
              Editable by Student
            </span>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-rvu-subtle uppercase">
              <span>Technical Skills Inventory</span>
              <span className="text-gold">{student.skills.length} skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((s) => (
                <span key={s.id} className="text-xs px-2.5 py-1 rounded-lg bg-[#0E1720] border border-gold-border/40 text-white font-mono">
                  {s.name} <span className="text-gold text-[10px]">({s.level})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Career Preferences */}
          <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 space-y-3 text-xs font-mono">
            <h3 className="text-xs font-bold text-white uppercase">
              Career Preferences
            </h3>
            <div className="grid grid-cols-2 gap-2 text-rvu-muted">
              <div>
                <span className="text-[10px] text-rvu-subtle block">Target Roles:</span>
                <span className="text-white text-[11px]">{student.careerPreferences.preferredRoles.join(', ')}</span>
              </div>
              <div>
                <span className="text-[10px] text-rvu-subtle block">Preferred Cities:</span>
                <span className="text-white text-[11px]">{student.careerPreferences.preferredLocations.join(', ')}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-white/5 flex items-center justify-between">
                <span>Minimum Target CTC:</span>
                <strong className="text-emerald-400">₹{student.careerPreferences.expectedCTCMinLPA} LPA</strong>
              </div>
            </div>
          </div>

          {/* Featured Verified Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-rvu-subtle uppercase">
              <span>Featured Engineering Projects</span>
              <span className="text-emerald-400 font-normal">✓ Portfolio Linked</span>
            </div>

            {student.projects.map((proj) => (
              <div key={proj.id} className="p-3.5 rounded-xl bg-[#0E1720] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">
                    {proj.title}
                  </h4>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold text-[10px] flex items-center gap-1 hover:underline font-mono"
                    >
                      <span>Code</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-rvu-muted leading-relaxed">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-rvu-subtle font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('/student/documents')}
              className="flex-1 justify-center text-xs"
              icon={<FileText className="w-3.5 h-3.5" />}
            >
              Manage Resumes & Documents
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
};
