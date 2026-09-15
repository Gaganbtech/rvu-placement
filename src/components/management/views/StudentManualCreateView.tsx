import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  AlertCircle
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { Student, PlacementStatus } from '../../../data/platform/types';
import { OFFICIAL_RVU_SCHOOLS } from '../../../data/platform/demoData';

interface StudentManualCreateViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const StudentManualCreateView: React.FC<StudentManualCreateViewProps> = ({
  store,
  onNavigate
}) => {
  const [formData, setFormData] = useState({
    id: '',
    rollNumber: '',
    name: '',
    email: '',
    phone: '',
    school: OFFICIAL_RVU_SCHOOLS[0],
    programme: 'B.Tech Computer Science & Engineering',
    degree: 'B.Tech',
    department: 'School of Computer Science and Engineering',
    admissionYear: 2023,
    graduatingYear: 2027,
    batch: '2023-2027',
    currentSemester: 7,
    cgpa: 8.5,
    activeBacklogs: 0,
    historyOfBacklogs: 0,
    placementStatus: 'ELIGIBLE' as PlacementStatus,
    skills: 'Python, Machine Learning, Data Structures'
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.id.trim()) {
      setError('Student ID / USN is required.');
      return;
    }
    if (!formData.name.trim()) {
      setError('Full Student Name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('A valid institutional or personal email is required.');
      return;
    }

    // Check duplicate ID
    if (store.students.some(s => s.id.toLowerCase() === formData.id.toLowerCase())) {
      setError(`Student with ID "${formData.id}" already exists in the SIS.`);
      return;
    }

    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, idx) => ({
      id: `sk-${Date.now()}-${idx}`,
      name: s,
      level: 'Intermediate' as const,
      category: 'Core Technical' as const,
      isVerified: true
    }));

    const newStudent: Student = {
      id: formData.id.trim(),
      universityRegisterNumber: formData.rollNumber.trim() || formData.id.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || '+91 98000 00000',
      isDemo: true,
      school: formData.school,
      programme: formData.programme,
      specialization: 'General',
      academicYear: 'Final Year',
      semester: formData.currentSemester,
      batch: formData.batch,
      graduationYear: formData.graduatingYear,
      cgpa: formData.cgpa,
      activeBacklogs: formData.activeBacklogs,
      attendancePercentage: 88,
      placementStatus: formData.placementStatus,
      eligibilityStatus: formData.placementStatus === 'ELIGIBLE' ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
      eligibilityDriveScope: '2026–27 Placement Drives',
      eligibilityRemarks: 'Manually verified and enrolled by Placement Cell.',
      verifiedBy: 'Office of Corporate & Alumni Relations (CAR)',
      verifiedDate: `${new Date().getDate()} Sep 2026`,
      readinessScore: 80,
      readinessBreakdown: { profile: 85, resume: 80, skills: 80, technicalPrep: 75, communication: 80, interviewPrep: 75 },
      skills: skillsArray,
      skillsToDevelop: [],
      projects: [],
      careerPreferences: {
        preferredRoles: ['Software Engineer'],
        preferredLocations: ['Bengaluru'],
        workMode: ['Hybrid'],
        expectedCTCMinLPA: 8.0
      }
    };

    store.addStudent(newStudent);
    onNavigate(`/management/students/${newStudent.id}`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      <button
        onClick={() => onNavigate('/management/students')}
        className="inline-flex items-center gap-2 text-xs font-mono text-rvu-muted hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Master</span>
      </button>

      <div className="rounded-2xl bg-[#111C26] border border-gold-border/50 p-6 space-y-6 shadow-xl">
        <div className="border-b border-gold-border/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              DIRECT SIS ENROLLMENT
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display mt-1">
            Manual Student Enrollment
          </h1>
          <p className="text-xs text-rvu-muted">
            Directly register an individual student profile with verified academic and placement credentials.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Section 1: Basic Identity */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-gold tracking-wider">
              1. Identity & Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-rvu-muted mb-1">Student ID / USN *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RVU23CSE089"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aaditya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="aaditya@rvu.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98450 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: School & Programme */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h3 className="text-xs font-mono uppercase text-gold tracking-wider">
              2. School & Programme Allotment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-rvu-muted mb-1">Official RVU School *</label>
                <select
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                >
                  {OFFICIAL_RVU_SCHOOLS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Degree & Programme</label>
                <input
                  type="text"
                  value={formData.programme}
                  onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Batch / Class</label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Academic Performance */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h3 className="text-xs font-mono uppercase text-gold tracking-wider">
              3. Academic Performance & Placement Eligibility
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-rvu-muted mb-1">Current CGPA (0.00 - 10.00) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  value={formData.activeBacklogs}
                  onChange={(e) => setFormData({ ...formData, activeBacklogs: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Initial Placement Status</label>
                <select
                  value={formData.placementStatus}
                  onChange={(e) => setFormData({ ...formData, placementStatus: e.target.value as PlacementStatus })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold font-mono"
                >
                  <option value="ELIGIBLE">ELIGIBLE</option>
                  <option value="INELIGIBLE">INELIGIBLE</option>
                  <option value="OPTED_OUT">OPTED OUT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-rvu-muted mb-1">Key Skills (comma separated)</label>
              <input
                type="text"
                placeholder="Python, React, Data Analysis"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/management/students')}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-bold shadow"
            >
              <Check className="w-4 h-4" />
              <span>Enroll Student in Master</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
