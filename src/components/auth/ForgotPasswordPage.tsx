import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Mail, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onBackToLogin
}) => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setErrorMsg(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestPasswordReset(trimmed);
      if (result.success) {
        setIsSent(true);
        setNotice(result.message || 'If an account exists for this email, password reset instructions have been sent.');
      } else {
        setErrorMsg(result.error || 'Unable to send password reset. Please try again.');
      }
    } catch {
      setErrorMsg('Unable to send password reset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101A22] text-white relative overflow-hidden flex flex-col justify-between selection:bg-[#CCAA68] selection:text-[#101A22] p-4 sm:p-6 lg:p-8">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#CCAA68]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full py-4 flex items-center justify-between border-b border-[#CCAA68]/20">
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
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 hover:border-[#CCAA68] text-xs text-[#AEB7BC] hover:text-white transition-all shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#CCAA68] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Sign In</span>
        </button>
      </header>

      {/* Center Card */}
      <main className="relative z-10 max-w-md mx-auto w-full py-8 my-auto">
        <div className="bg-[#20303A] rounded-2xl border border-[#CCAA68]/30 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
          
          {/* Top Accent Line */}
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#CCAA68] to-transparent" />

          {isSent ? (
            <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#D8B978] font-mono uppercase tracking-wider">
                  Reset Instructions Dispatched
                </div>
                <h2 className="text-xl font-bold text-white font-display">
                  Check Your Email
                </h2>
                <p className="text-xs text-[#AEB7BC] leading-relaxed">
                  {notice}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/5 text-xs text-[#AEB7BC] text-left space-y-1.5">
                <div className="font-semibold text-white">Next Steps:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-[#AEB7BC]">
                  <li>Open the reset email sent to <span className="font-mono text-[#CCAA68]">{email}</span>.</li>
                  <li>Click the secure password recovery link.</li>
                  <li>Enter your new password on the password reset screen.</li>
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
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#101A22] border border-[#CCAA68]/40 flex items-center justify-center mx-auto text-[#CCAA68] shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                  Password Recovery
                </h1>
                <p className="text-xs text-[#AEB7BC] leading-relaxed">
                  Enter your registered institutional email to receive secure password reset instructions.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label 
                    htmlFor="forgot-email"
                    className="block font-semibold text-[#AEB7BC] uppercase tracking-wider mb-1.5 font-mono text-[11px]"
                  >
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#CCAA68] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. gagana.btech23@rvu.edu.in"
                      className="w-full bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#AEB7BC]/50 focus:outline-none focus:ring-1 focus:ring-[#CCAA68] transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <span>SEND RESET LINK</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-xs font-mono text-[#D8B978] hover:underline"
                  >
                    Remember your password? Sign in instead
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full py-4 text-center text-xs text-[#78848C] border-t border-white/5">
        RV University Placement & Career Hub • Credential Governance
      </footer>
    </div>
  );
};
