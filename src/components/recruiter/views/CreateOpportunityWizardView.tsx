import React, { useState } from 'react';
import {
  Briefcase,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  Calendar,
  IndianRupee,
  GraduationCap,
  Building,
  Sparkles,
  Info
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import { OFFICIAL_RVU_SCHOOLS } from '../../../data/platform/demoData';
import type { OpportunityType, WorkMode } from '../../../data/platform/types';

interface CreateOpportunityWizardViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const CreateOpportunityWizardView: React.FC<CreateOpportunityWizardViewProps> = ({
  store,
  onNavigate
}) => {
  const activeCompany = store.activeCompany;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Form State
  const [formData, setFormData] = useState({
    role: '',
    type: 'Placement' as OpportunityType,
    department: 'Engineering',
    jobFunction: 'Software & Technology',
    workMode: 'Hybrid' as WorkMode,
    location: 'Bengaluru',
    openingsCount: 5,

    // Compensation
    ctcLpa: '₹14.0 - ₹18.0 LPA',
    baseSalary: '₹12.0 LPA',
    stipendPerMonth: '₹50,000 / month',
    otherBenefits: 'Health Insurance ₹5 Lakhs, Relocation Allowance ₹50k, Annual Learning Budget',

    // Eligibility
    eligibleSchools: ['School of Computer Science and Engineering'],
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering'],
    eligibleGraduationYears: [2027],
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,

    // Skills & Descriptions
    requiredSkills: ['Data Structures', 'Python', 'JavaScript', 'Git'],
    newSkillInput: '',
    niceToHaveSkills: ['Docker', 'AWS', 'React'],
    newNiceSkillInput: '',
    description: 'We are seeking passionate students to join our core product engineering team building high-scale distributed systems.',
    responsibilities: [
      'Design, test, and deploy resilient microservices and client interfaces.',
      'Collaborate with senior technical leads and product managers.',
      'Participate in code reviews and automated testing.'
    ],
    newResponsibilityInput: '',

    // Selection Rounds
    selectionProcess: [
      { roundNumber: 1, title: 'CAR Eligibility & Profile Screening', mode: 'Online' as const, description: 'Academic gate verification' },
      { roundNumber: 2, title: 'Online Technical Assessment', mode: 'Online' as const, description: '90-minute timed DSA coding test' },
      { roundNumber: 3, title: 'Technical Interview Round', mode: 'In-person' as const, description: 'Live system design & coding drill' },
      { roundNumber: 4, title: 'Director & Culture Fit Round', mode: 'In-person' as const, description: 'Discussion with Head of Engineering' }
    ],

    // Timeline
    applicationDeadline: '30 Sep 2026',
    assessmentDate: '05 Oct 2026',
    interviewWindow: '10 Oct - 12 Oct 2026',
    driveDate: '15 Oct 2026',
    expectedOfferDate: '20 Oct 2026'
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Skill tag helpers
  const addRequiredSkill = () => {
    if (formData.newSkillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, prev.newSkillInput.trim()],
        newSkillInput: ''
      }));
    }
  };

  const removeRequiredSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }));
  };

  const addResponsibility = () => {
    if (formData.newResponsibilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, prev.newResponsibilityInput.trim()],
        newResponsibilityInput: ''
      }));
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const toggleSchool = (school: string) => {
    setFormData(prev => {
      const exists = prev.eligibleSchools.includes(school);
      return {
        ...prev,
        eligibleSchools: exists
          ? prev.eligibleSchools.filter(s => s !== school)
          : [...prev.eligibleSchools, school]
      };
    });
  };

  const handleSubmitToCAR = () => {
    // Submit to platform store
    store.createRecruiterOpportunity({
      role: formData.role || 'Associate Systems Engineer',
      type: formData.type,
      department: formData.department,
      jobFunction: formData.jobFunction,
      workMode: formData.workMode,
      location: formData.location,
      openingsCount: Number(formData.openingsCount),
      ctcLpa: formData.ctcLpa,
      stipendPerMonth: formData.type.includes('Internship') ? formData.stipendPerMonth : undefined,
      otherBenefits: formData.otherBenefits,
      eligibleSchools: formData.eligibleSchools,
      eligibleProgrammes: formData.eligibleProgrammes,
      eligibleGraduationYears: formData.eligibleGraduationYears,
      minCgpa: Number(formData.minCgpa),
      maxBacklogsAllowed: Number(formData.maxBacklogsAllowed),
      requiredSkills: formData.requiredSkills,
      niceToHaveSkills: formData.niceToHaveSkills,
      description: formData.description,
      responsibilities: formData.responsibilities,
      selectionProcess: formData.selectionProcess,
      applicationDeadline: formData.applicationDeadline,
      driveDate: formData.driveDate,
      timeline: {
        openingDate: 'Today',
        deadline: formData.applicationDeadline,
        assessmentDate: formData.assessmentDate,
        interviewWindow: formData.interviewWindow,
        expectedOfferDate: formData.expectedOfferDate
      }
    });

    setSubmittedSuccess(true);
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Opportunity Submitted to CAR Office</h2>
          <p className="text-sm text-gray-300">
            "{formData.role || 'Opportunity'}" has been received by the RV University Office of Corporate & Alumni Relations (CAR). Once the placement team verifies statutory guidelines and batch eligibility, it will be published to student dashboards.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 text-xs text-left text-gray-300 space-y-2">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#CCAA68]" />
            <span>Next Steps in CAR Verification Workflow</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>CAR Director reviews compensation breakdown ({formData.ctcLpa}).</li>
            <li>Eligibility criteria applied across {formData.eligibleSchools.length} selected RVU school(s).</li>
            <li>Campus lab/interview room slots mapped for {formData.driveDate}.</li>
          </ul>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('/recruiter/opportunities')}
            className="px-5 py-2.5 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors"
          >
            View Opportunities Desk
          </button>
          <button
            onClick={() => onNavigate('/recruiter')}
            className="px-5 py-2.5 rounded-xl bg-[#20303A] text-white text-xs border border-white/10 hover:bg-[#20303A]/80 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stepTitles = [
    'Basic Job Info',
    'Compensation & Perks',
    'RVU Eligibility',
    'Skills & Responsibilities',
    'Selection Process',
    'Drive & Timeline',
    'Review & Submit'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Create & Submit Opportunity
        </h1>
        <p className="text-xs text-gray-400">
          Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
        </p>
      </div>

      {/* Wizard Step Progress Bar */}
      <div className="p-3.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 overflow-x-auto custom-scrollbar">
        <div className="flex items-center min-w-[620px] justify-between">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-black font-semibold'
                      : isCurrent
                      ? 'bg-[#CCAA68] text-[#101A22] shadow-md shadow-[#CCAA68]/30 ring-2 ring-[#CCAA68]/40'
                      : 'bg-[#20303A] text-gray-400'
                  }`}
                >
                  {isDone ? '✓' : stepNum}
                </div>
                <span className={`text-xs whitespace-nowrap ${isCurrent ? 'text-white font-semibold' : 'text-gray-400'}`}>
                  {title}
                </span>
                {stepNum < totalSteps && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 ml-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Body */}
      <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-6">
        {/* STEP 1: Basic Job Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#CCAA68]" />
              <span>Step 1: Role Overview & Working Mode</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-gray-300 font-medium">Job Title / Designation *</label>
                <input
                  type="text"
                  placeholder="e.g. Associate Software Engineer / Systems Architect"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Opportunity Type *</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as OpportunityType })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                >
                  <option value="Placement">Full-Time Placement</option>
                  <option value="Internship + PPO">Internship + Pre-Placement Offer (PPO)</option>
                  <option value="Internship">Summer / Academic Internship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Work Mode *</label>
                <select
                  value={formData.workMode}
                  onChange={e => setFormData({ ...formData, workMode: e.target.value as WorkMode })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site Campus / Office</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Job Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru (Outer Ring Road / Whitefield)"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Number of Anticipated Openings *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.openingsCount}
                  onChange={e => setFormData({ ...formData, openingsCount: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Compensation & Benefits */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#CCAA68]" />
              <span>Step 2: Compensation & Institutional Package Disclosure</span>
            </h2>

            <div className="p-3 rounded-lg bg-[#20303A] border border-[#CCAA68]/20 text-xs text-gray-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#CCAA68] flex-shrink-0 mt-0.5" />
              <span>
                RVU placement policy mandates transparent disclosure of Cost-to-Company (CTC), Fixed Base Salary, and Internship Stipends for auditable records.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Annual CTC Range (LPA) *</label>
                <input
                  type="text"
                  placeholder="e.g. ₹14.0 - ₹18.0 LPA"
                  value={formData.ctcLpa}
                  onChange={e => setFormData({ ...formData, ctcLpa: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Fixed Base Component</label>
                <input
                  type="text"
                  placeholder="e.g. ₹12.0 LPA"
                  value={formData.baseSalary}
                  onChange={e => setFormData({ ...formData, baseSalary: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Monthly Internship Stipend (if applicable)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹50,000 / month"
                  value={formData.stipendPerMonth}
                  onChange={e => setFormData({ ...formData, stipendPerMonth: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-gray-300 font-medium">Other Benefits & Perks</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Medical insurance ₹5 Lakhs, Relocation allowance, Certification reimbursement"
                  value={formData.otherBenefits}
                  onChange={e => setFormData({ ...formData, otherBenefits: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RVU Eligibility */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#CCAA68]" />
              <span>Step 3: Academic Eligibility Across RVU Schools</span>
            </h2>

            <div className="space-y-2 text-xs">
              <label className="text-gray-300 font-medium">Select Eligible RVU Schools *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {OFFICIAL_RVU_SCHOOLS.map(school => {
                  const isSelected = formData.eligibleSchools.includes(school);
                  return (
                    <button
                      key={school}
                      type="button"
                      onClick={() => toggleSchool(school)}
                      className={`text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#CCAA68]/20 border border-[#CCAA68] text-white font-medium'
                          : 'bg-[#20303A] border border-white/10 text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{school}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#CCAA68] flex-shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Minimum Cumulative GPA (CGPA) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="5.0"
                  max="10.0"
                  value={formData.minCgpa}
                  onChange={e => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 7.0 })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Maximum Active Backlogs Permitted *</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={formData.maxBacklogsAllowed}
                  onChange={e => setFormData({ ...formData, maxBacklogsAllowed: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Skills & Responsibilities */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#CCAA68]" />
              <span>Step 4: Technical Competencies & Responsibilities</span>
            </h2>

            {/* Required Skills */}
            <div className="space-y-2 text-xs">
              <label className="text-gray-300 font-medium">Must-Have Skills *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Python, React, PostgreSQL..."
                  value={formData.newSkillInput}
                  onChange={e => setFormData({ ...formData, newSkillInput: e.target.value })}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRequiredSkill(); } }}
                  className="flex-1 bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addRequiredSkill}
                  className="px-3 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.requiredSkills.map((skill, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#20303A] text-white border border-[#CCAA68]/30 text-xs">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeRequiredSkill(i)} className="text-gray-400 hover:text-red-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-1.5 text-xs">
              <label className="text-gray-300 font-medium">Role Description *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
              />
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-2 text-xs">
              <label className="text-gray-300 font-medium">Key Responsibilities</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a core responsibility..."
                  value={formData.newResponsibilityInput}
                  onChange={e => setFormData({ ...formData, newResponsibilityInput: e.target.value })}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addResponsibility(); } }}
                  className="flex-1 bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="px-3 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {formData.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-[#20303A] text-xs text-gray-200">
                    <span>• {resp}</span>
                    <button type="button" onClick={() => removeResponsibility(i)} className="text-gray-400 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Selection Process */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-[#CCAA68]" />
              <span>Step 5: Selection Stages & Evaluation Format</span>
            </h2>

            <div className="space-y-3">
              {formData.selectionProcess.map((round, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#20303A] border border-[#CCAA68]/15 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Round {round.roundNumber}: {round.title}</span>
                    <span className="px-2 py-0.5 rounded bg-[#101A22] text-[#CCAA68] font-mono text-[10px]">
                      {round.mode}
                    </span>
                  </div>
                  <div className="text-gray-300 text-[11px]">{round.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Drive & Timeline */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#CCAA68]" />
              <span>Step 6: Recruitment Timeline & Campus Drive Schedule</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Application Deadline *</label>
                <input
                  type="text"
                  value={formData.applicationDeadline}
                  onChange={e => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Target Assessment Date</label>
                <input
                  type="text"
                  value={formData.assessmentDate}
                  onChange={e => setFormData({ ...formData, assessmentDate: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Interview Window</label>
                <input
                  type="text"
                  value={formData.interviewWindow}
                  onChange={e => setFormData({ ...formData, interviewWindow: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">Campus Drive Date</label>
                <input
                  type="text"
                  value={formData.driveDate}
                  onChange={e => setFormData({ ...formData, driveDate: e.target.value })}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Review & Submit */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#CCAA68]" />
              <span>Step 7: Final Review & Submission to CAR Office</span>
            </h2>

            <div className="p-4 rounded-xl bg-[#20303A] border border-[#CCAA68]/20 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#CCAA68]/15 pb-2">
                <div>
                  <div className="text-base font-bold text-white">{formData.role || 'Associate Software Engineer'}</div>
                  <div className="text-gray-400">{activeCompany?.name} • {formData.location} ({formData.workMode})</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#CCAA68]">{formData.ctcLpa}</div>
                  <div className="text-[10px] text-gray-400">{formData.openingsCount} Openings</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-gray-300 pt-1">
                <div><strong>Min CGPA:</strong> {formData.minCgpa}</div>
                <div><strong>Max Backlogs:</strong> {formData.maxBacklogsAllowed}</div>
                <div><strong>Application Deadline:</strong> {formData.applicationDeadline}</div>
                <div><strong>Drive Date:</strong> {formData.driveDate}</div>
              </div>

              <div className="pt-2">
                <div className="text-gray-400 text-[11px] mb-1">Eligible Schools ({formData.eligibleSchools.length}):</div>
                <div className="flex flex-wrap gap-1">
                  {formData.eligibleSchools.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-[#101A22] text-xs text-[#D8B978] border border-[#CCAA68]/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Statutory Notice */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-[#19252F] border border-amber-500/30 space-y-2 text-xs">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>CAR Placement Protocol Notice</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Upon clicking Submit, this posting will enter status <strong>SUBMITTED</strong>. The RV University Placement Office will verify the compensation structure and assign campus lab suites before broadcasting notifications to eligible students.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#CCAA68]/15">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-white text-xs border border-white/10 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] text-xs font-semibold transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitToCAR}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CCAA68] to-[#D8B978] text-[#101A22] text-xs font-bold shadow-lg transition-all hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit to CAR Placement Office</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
