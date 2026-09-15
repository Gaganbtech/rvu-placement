import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import type { Opportunity, Student, StudentDocument } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  student: Student;
  activeResume?: StudentDocument;
  onConfirmApply: (opportunityId: string) => { success: boolean; applicationId?: string; message: string };
  onViewApplication: (applicationId: string) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  student,
  activeResume,
  onConfirmApply,
  onViewApplication
}) => {
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setError(null);

    // Simulate brief network dispatch to shared platform
    setTimeout(() => {
      const res = onConfirmApply(opportunity.id);
      setIsSubmitting(false);
      if (res.success && res.applicationId) {
        setSubmittedAppId(res.applicationId);
      } else {
        setError(res.message);
      }
    }, 450);
  };

  const handleClose = () => {
    setSubmittedAppId(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#131F2A] border border-gold-border rounded-2xl shadow-2xl overflow-hidden text-rvu-text flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-gold-border/40 bg-[#0E1720] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-lg">
              {opportunity.companyName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-gold tracking-wider">
                Application Confirmation
              </span>
              <h2 className="text-lg font-bold text-white font-display">
                {opportunity.role}
              </h2>
              <div className="text-xs text-rvu-muted">
                {opportunity.companyName} • {opportunity.location}
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-rvu-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {submittedAppId ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-6 space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Submission Verified
                </span>
                <h3 className="text-2xl font-bold text-white font-display">
                  APPLICATION SUBMITTED
                </h3>
                <p className="text-sm text-rvu-muted max-w-md mx-auto">
                  Your candidate application has been transmitted to the recruiter and logged into the Central RVU Placement & Career Management System.
                </p>
              </div>

              {/* Application ID Card */}
              <div className="p-4 rounded-xl bg-navy-card border border-gold/40 max-w-sm mx-auto text-center space-y-1">
                <span className="text-[10px] font-mono text-rvu-subtle uppercase">
                  Central Application Reference ID
                </span>
                <div className="text-xl font-mono font-bold text-gold tracking-wider">
                  {submittedAppId}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Stage: Applied & Awaiting Review</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    handleClose();
                    onViewApplication(submittedAppId);
                  }}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Track Application in Pipeline
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleClose}
                >
                  Back to Opportunities
                </Button>
              </div>
            </div>
          ) : (
            /* PRE-SUBMISSION VERIFICATION STATE */
            <>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Notice Prompt */}
              <div className="p-4 rounded-xl bg-[#0F1822] border border-gold-border/60 text-xs text-rvu-muted flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-white font-mono text-[11px]">
                    OFFICIAL SUBMISSION NOTICE
                  </span>
                  <p className="leading-relaxed">
                    "Your application will be submitted to the RVU Placement & Career Management System."
                  </p>
                  <p className="text-[11px] text-rvu-subtle">
                    Recruiters will evaluate your verified academic records, institutional transcripts, and active placement resume.
                  </p>
                </div>
              </div>

              {/* 1. Verified Academic Profile */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gold font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    Academic Profile (University Verified)
                  </span>
                  <span className="text-emerald-400 font-normal">✓ Audited</span>
                </div>

                <div className="p-4 rounded-xl bg-navy-card border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-rvu-subtle block font-mono">Student ID</span>
                    <strong className="text-white font-mono">{student.id}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rvu-subtle block font-mono">CGPA</span>
                    <strong className="text-emerald-400 font-mono">{student.cgpa} / 10.0</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rvu-subtle block font-mono">Active Backlogs</span>
                    <strong className="text-white font-mono">{student.activeBacklogs}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rvu-subtle block font-mono">Cohort Year</span>
                    <strong className="text-white font-mono">{student.graduationYear}</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-4 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-rvu-subtle block font-mono">Programme</span>
                    <span className="text-rvu-text text-[11px]">{student.programme}</span>
                  </div>
                </div>
              </div>

              {/* 2. Active Placement Resume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gold font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Current Resume Attachment
                  </span>
                  <span className="text-emerald-400 font-normal">✓ Ready</span>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-card border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {activeResume ? activeResume.fileName : 'Aarav_Sharma_RVU_Tech_Resume_v3.2.pdf'}
                      </div>
                      <div className="text-[10px] text-rvu-subtle font-mono">
                        {activeResume ? `Size: ${activeResume.fileSize} • Uploaded: ${activeResume.uploadedDate}` : '412 KB • Uploaded 10 Sep 2026'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Active File
                  </span>
                </div>
              </div>

              {/* 3. Skills Matched */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gold font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Key Required Skills Checked
                  </span>
                  <span className="text-gold font-normal font-mono">{opportunity.matchScoreForDemoStudent}% Match</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {opportunity.requiredSkills.map((skill) => (
                    <span 
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-lg bg-navy-surface border border-gold-border/60 text-white font-mono flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Placement Office Eligibility Verification */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Eligibility Clearance: <strong>{student.eligibilityDriveScope}</strong></span>
                </div>
                <span className="text-[10px] font-mono text-rvu-subtle">
                  Auth: CAR Office
                </span>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        {!submittedAppId && (
          <div className="p-6 border-t border-gold-border/40 bg-[#0E1720] flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              SUBMIT APPLICATION
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};
