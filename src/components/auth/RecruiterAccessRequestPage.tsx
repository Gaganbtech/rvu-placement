import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Briefcase, 
  Phone, 
  FileText, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RecruiterAccessRequestPageProps {
  onBackToLogin: () => void;
}

export const RecruiterAccessRequestPage: React.FC<RecruiterAccessRequestPageProps> = ({
  onBackToLogin
}) => {
  const { submitAccessRequest } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCompany = companyName.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMsg('Please enter a valid corporate email address.');
      return;
    }

    if (!trimmedCompany) {
      setErrorMsg('Please enter your company or organization name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitAccessRequest({
        fullName: trimmedName,
        email: trimmedEmail,
        companyName: trimmedCompany,
        designation: designation.trim() || undefined,
        phone: phone.trim() || undefined,
        message: message.trim() || undefined
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(result.error || 'Unable to submit request at this time. Please try again.');
      }
    } catch {
      setErrorMsg('Unable to submit request at this time. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101A22] text-[#F2F4F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-[#CCAA68] selection:text-[#101A22]">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#CCAA68]/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#19252F]/40 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#CCAA68]/20">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assets/rvu-logo-gold.svg" 
            alt="RV University Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="border-l border-[#CCAA68]/40 pl-3">
            <div className="text-sm font-bold text-white tracking-wide font-display">
              RV UNIVERSITY
            </div>
            <div className="text-[10px] text-[#CCAA68] tracking-wider uppercase font-semibold font-mono">
              CAREER HUB
            </div>
          </div>
        </div>

        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 hover:border-[#CCAA68] text-xs text-[#AEB7BC] hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#CCAA68]" />
          <span>Sign In</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-xl mx-auto w-full py-8 my-auto">
        <div className="bg-[#20303A] rounded-2xl border border-[#CCAA68]/20 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
          
          {/* Top Accent Line */}
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#CCAA68] to-transparent" />

          {isSuccess ? (
            <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#D8B978] font-mono uppercase tracking-wider">
                  Access Request Submitted
                </div>
                <h2 className="text-xl font-bold text-white font-display">
                  Request Received
                </h2>
                <p className="text-xs text-[#AEB7BC] leading-relaxed max-w-md mx-auto">
                  Thank you for your interest in hiring RV University talent. The Office of Corporate & Alumni Relations (CAR) will review your corporate credentials and issue an institutional invitation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#19252F] border border-white/5 text-xs text-[#AEB7BC] text-left space-y-1.5">
                <div className="font-semibold text-white">What happens next?</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-[#AEB7BC]">
                  <li>Verification of employer domain and recruiter identity.</li>
                  <li>Issuance of formal recruiter workspace activation email.</li>
                  <li>Assigned placement coordinator will contact you to schedule campus drives.</li>
                </ul>
              </div>

              <button
                onClick={onBackToLogin}
                className="w-full py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Return to Sign In</span>
              </button>
            </div>
          ) : (
            <>
              {/* Header Lockup */}
              <div className="mb-6 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#D8B978] font-mono uppercase tracking-wider">
                    CORPORATE PARTNER INTAKE
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#101A22] text-[#AEB7BC] font-mono border border-white/5">
                    CONTROLLED ONBOARDING
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-display">
                  Request Recruiter Access
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Connect with RV University students across engineering, design, business, and liberal sciences.
                </p>
              </div>

              {/* Security Advisory Notice */}
              <div className="mb-5 p-3.5 rounded-xl bg-[#101A22] border border-[#CCAA68]/20 flex items-start gap-2.5 text-xs text-[#AEB7BC]">
                <ShieldCheck className="w-4 h-4 text-[#CCAA68] shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  Recruiter accounts require verified corporate credentials and institutional authorization by the RVU Placement Cell. Privileged access is never self-assigned.
                </p>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                
                {/* Full Name & Corporate Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label 
                      htmlFor="req-fullname"
                      className="block font-mono text-[#AEB7BC] uppercase font-bold text-[11px]"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-3.5 h-3.5 text-[#AEB7BC] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="req-fullname"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] text-xs text-white placeholder:text-[#78848C] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label 
                      htmlFor="req-email"
                      className="block font-mono text-[#AEB7BC] uppercase font-bold text-[11px]"
                    >
                      Corporate Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[#AEB7BC] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="req-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. talent@google.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] text-xs text-white placeholder:text-[#78848C] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Name & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label 
                      htmlFor="req-company"
                      className="block font-mono text-[#AEB7BC] uppercase font-bold text-[11px]"
                    >
                      Company / Organization *
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-[#AEB7BC] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="req-company"
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Google India"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] text-xs text-white placeholder:text-[#78848C] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label 
                      htmlFor="req-designation"
                      className="block font-mono text-[#AEB7BC] uppercase font-bold text-[11px]"
                    >
                      Designation / Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-3.5 h-3.5 text-[#AEB7BC] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="req-designation"
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. University Talent Lead"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] text-xs text-white placeholder:text-[#78848C] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label 
                    htmlFor="req-phone"
                    className="block font-mono text-[#AEB7BC] uppercase font-bold text-[11px]"
                  >
                    Direct Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#AEB7BC] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="req-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] text-xs text-white placeholder:text-[#78848C] outline-none"
                    />
                  </div>
                </div>

                {/* Hiring Intent / Notes */}
                <div className="space-y-1">
                  <label 
                    htmlFor="req-message"
                    className="block font-mono text-[#AEB7BC] uppercase font-bold text-[11px]"
                  >
                    Hiring Scope / Campuses of Interest
                  </label>
                  <div className="relative">
                    <FileText className="w-3.5 h-3.5 text-[#AEB7BC] absolute left-3 top-3 pointer-events-none" />
                    <textarea
                      id="req-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Looking to hire 2026 graduates for Software Engineering and Product Design roles..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] text-xs text-white placeholder:text-[#78848C] outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] active:bg-[#B8924E] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <span>SUBMIT RECRUITER REQUEST</span>
                    )}
                  </button>
                </div>

              </form>

              {/* Back to Sign In */}
              <div className="mt-4 pt-3 border-t border-white/5 text-center text-xs text-[#AEB7BC]">
                <span>Already have recruiter credentials? </span>
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-[#CCAA68] hover:underline font-bold"
                >
                  Sign In
                </button>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full py-4 text-center text-xs text-[#78848C] border-t border-white/5">
        <div>
          RV University Career Hub • Central Placement & Corporate Relations • RVU Bengaluru
        </div>
      </footer>

    </div>
  );
};
