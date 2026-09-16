import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Mail,
  Edit3,
  Save
} from 'lucide-react';
import type { Student } from '../../../data/platform/types';
import { useStudentStore } from '../../../data/platform/studentStore';
import { Button } from '../../ui/Button';

interface StudentProfileViewProps {
  student: Student;
  onNavigate: (route: string) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onNavigate
}) => {
  const store = useStudentStore();
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [preferredRoles, setPreferredRoles] = useState(student.careerPreferences.preferredRoles.join(', '));
  const [preferredLocations, setPreferredLocations] = useState(student.careerPreferences.preferredLocations.join(', '));
  const [expectedCTC, setExpectedCTC] = useState(student.careerPreferences.expectedCTCMinLPA.toString());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute profile health score deterministically
  const hasResume = store.documents.some(d => d.type === 'RESUME');
  const hasProjects = student.projects.length >= 2;
  const hasSkills = student.skills.length >= 5;
  const hasPreferences = student.careerPreferences.preferredRoles.length > 0;
  const profileHealth = Math.round(
    (15 * 1.0) + // SIS verification always complete
    (hasResume ? 25 : 0) +
    (hasProjects ? 25 : 10) +
    (hasSkills ? 20 : 10) +
    (hasPreferences ? 15 : 0)
  );

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateStudentProfile({
      careerPreferences: {
        ...student.careerPreferences,
        preferredRoles: preferredRoles.split(',').map(r => r.trim()).filter(Boolean),
        preferredLocations: preferredLocations.split(',').map(l => l.trim()).filter(Boolean),
        expectedCTCMinLPA: parseFloat(expectedCTC) || student.careerPreferences.expectedCTCMinLPA
      }
    });
    setIsEditingPreferences(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
                  ACTIVE STUDENT
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SIS Verified Profile</span>
                </span>
                {saveSuccess && (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 animate-fadeIn">
                    ✓ Profile Saved
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {student.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle">
                <span className="text-white font-semibold">SRN: {student.id}</span>
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

          <div className="flex items-center gap-6 sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-rvu-subtle uppercase block">
                Profile Health
              </span>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                {profileHealth}%
              </div>
              <span className="text-[10px] font-mono text-rvu-muted">
                Placement Complete
              </span>
            </div>

            <div className="text-right border-l border-white/10 pl-6">
              <span className="text-[10px] font-mono text-rvu-subtle uppercase block">
                Placement Scope
              </span>
              <div className="text-base font-mono font-bold text-white flex items-center justify-end gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{student.eligibilityDriveScope}</span>
              </div>
              <div className="text-[10px] font-mono text-rvu-subtle">
                CAR Clearance Granted
              </div>
            </div>
          </div>
        </div>

        {/* Legend Notice: Distinction between Verified vs Provided */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-rvu-subtle font-mono gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <strong>UNIVERSITY SIS VERIFIED:</strong> Managed by Registrar & CAR
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1.5 text-gold">
              <User className="w-3.5 h-3.5" />
              <strong>CANDIDATE CURATED:</strong> Maintained by Student
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
                <span className="text-[10px] text-rvu-subtle">Semesters I–V Verified</span>
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
            * Academic verification is governed by RV University Registrar & CAR Office. To request grade modifications, submit a support ticket under "Profile Corrections".
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
            <button
              onClick={() => setIsEditingPreferences(!isEditingPreferences)}
              className="text-xs font-mono px-3 py-1 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-navy-dark transition-all flex items-center gap-1 font-bold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingPreferences ? 'Cancel Edit' : 'Edit Preferences'}</span>
            </button>
          </div>

          {/* Edit Preferences Form Modal/Area */}
          {isEditingPreferences ? (
            <form onSubmit={handleSavePreferences} className="p-4 rounded-xl bg-[#0E1720] border border-gold/40 space-y-4 animate-fadeIn">
              <span className="text-xs font-bold text-white uppercase block">
                Update Career Preferences
              </span>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-rvu-subtle uppercase block">Target Roles (comma separated):</label>
                <input
                  type="text"
                  value={preferredRoles}
                  onChange={(e) => setPreferredRoles(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-navy-card border border-white/10 text-xs text-white focus:outline-none focus:border-gold"
                  placeholder="Software Development Engineer, Cloud Engineer, etc."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-rvu-subtle uppercase block">Preferred Locations (comma separated):</label>
                <input
                  type="text"
                  value={preferredLocations}
                  onChange={(e) => setPreferredLocations(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-navy-card border border-white/10 text-xs text-white focus:outline-none focus:border-gold"
                  placeholder="Bengaluru, Hyderabad, Pune, etc."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-rvu-subtle uppercase block">Expected Minimum CTC (LPA):</label>
                <input
                  type="number"
                  step="0.5"
                  value={expectedCTC}
                  onChange={(e) => setExpectedCTC(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-navy-card border border-white/10 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditingPreferences(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            /* Display Career Preferences */
            <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 space-y-3 text-xs font-mono">
              <h3 className="text-xs font-bold text-white uppercase flex items-center justify-between">
                <span>Career Preferences</span>
                <span className="text-emerald-400 text-[10px]">Active Matching</span>
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
                <div className="col-span-2 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span>Minimum Target CTC:</span>
                  <strong className="text-emerald-400">₹{student.careerPreferences.expectedCTCMinLPA} LPA</strong>
                </div>
              </div>
            </div>
          )}

          {/* Technical Skills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-rvu-subtle uppercase">
              <span>Technical Skills Inventory</span>
              <button
                onClick={() => onNavigate('/student/skills')}
                className="text-gold text-xs hover:underline flex items-center gap-1"
              >
                <span>View Matrix ({student.skills.length})</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((s) => (
                <span key={s.id} className="text-xs px-2.5 py-1 rounded-lg bg-[#0E1720] border border-gold-border/40 text-white font-mono">
                  {s.name} <span className="text-gold text-[10px]">({s.level})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Featured Verified Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-rvu-subtle uppercase">
              <span>Featured Engineering Projects ({student.projects.length})</span>
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
                      <span>Repository</span>
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
