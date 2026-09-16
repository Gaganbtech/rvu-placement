import React, { useState } from 'react';
import { 
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { evaluatePasswordStrength } from '../../services/authService';

interface ResetPasswordPageProps {
  onBackToLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  onBackToLogin
}) => {
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordStrength = evaluatePasswordStrength(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and try again.');
      return;
    }

    if (passwordStrength.score < 2) {
      setErrorMsg('Password is too weak. Please use numbers or uppercase characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPassword(password);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(result.error || 'Unable to update password. Your reset link may have expired.');
      }
    } catch {
      setErrorMsg('Unable to update password. Your reset link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101A22] text-[#F2F4F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-[#CCAA68] selection:text-[#101A22]">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#CCAA68]/10 rounded-full blur-[130px] pointer-events-none" />

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
          <span>Back to Sign In</span>
        </button>
      </header>

      {/* Main Card */}
      <main className="relative z-10 max-w-md mx-auto w-full py-8 my-auto">
        <div className="bg-[#20303A] rounded-2xl border border-[#CCAA68]/30 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
          
          {/* Top Accent Line */}
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#CCAA68] to-transparent" />

          {isSuccess ? (
            <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#D8B978] font-mono uppercase tracking-wider">
                  Security Update Complete
                </div>
                <h2 className="text-xl font-bold text-white font-display">
                  Password Updated
                </h2>
                <p className="text-xs text-[#AEB7BC] leading-relaxed">
                  Your RVU Career Hub credentials have been updated securely. You can now sign in with your new password.
                </p>
              </div>

              <button
                onClick={onBackToLogin}
                className="w-full py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
              </button>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#101A22] border border-[#CCAA68]/40 flex items-center justify-center mx-auto text-[#CCAA68] shadow-inner">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                  Set New Password
                </h1>
                <p className="text-xs text-[#AEB7BC] leading-relaxed">
                  Enter your new institutional password to secure your Career Hub account.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="reset-password"
                    className="block font-semibold text-[#AEB7BC] uppercase tracking-wider font-mono text-[11px]"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#CCAA68] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#AEB7BC]/50 focus:outline-none focus:ring-1 focus:ring-[#CCAA68] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#AEB7BC] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#AEB7BC]">Strength:</span>
                        <span className={
                          passwordStrength.label === 'Strong' ? 'text-emerald-400 font-bold' :
                          passwordStrength.label === 'Fair' ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'
                        }>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 h-1.5">
                        <div className={`rounded-full ${passwordStrength.score >= 1 ? (passwordStrength.score === 1 ? 'bg-rose-500' : 'bg-amber-400') : 'bg-white/10'}`} />
                        <div className={`rounded-full ${passwordStrength.score >= 2 ? (passwordStrength.score >= 3 ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-white/10'}`} />
                        <div className={`rounded-full ${passwordStrength.score >= 3 ? 'bg-emerald-400' : 'bg-white/10'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="reset-confirm-password"
                    className="block font-semibold text-[#AEB7BC] uppercase tracking-wider font-mono text-[11px]"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#CCAA68] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className={`w-full bg-[#101A22] border ${
                        passwordsMatch ? 'border-emerald-500/50' :
                        passwordMismatch ? 'border-rose-500/50' :
                        'border-[#CCAA68]/30'
                      } focus:border-[#CCAA68] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#AEB7BC]/50 focus:outline-none focus:ring-1 focus:ring-[#CCAA68] transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#AEB7BC] hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <div className="text-[10px] text-rose-400 font-mono">
                      Passwords do not match.
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] active:bg-[#B8924E] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>UPDATE PASSWORD</span>
                  )}
                </button>
              </form>
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full py-4 text-center text-xs text-[#78848C] border-t border-white/5">
        <div>
          RV University Placement & Career Hub • Credential Governance
        </div>
      </footer>
    </div>
  );
};
