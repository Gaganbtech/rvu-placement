import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldAlert, 
  Check, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService, INITIAL_DEFAULT_PASSWORD } from '../../services/authService';

interface FirstLoginPasswordModalProps {
  onPasswordChanged: () => void;
}

export const FirstLoginPasswordModal: React.FC<FirstLoginPasswordModalProps> = ({
  onPasswordChanged
}) => {
  const { user, changePassword, isLoading } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Real-time strength evaluation
  const strength = authService.evaluatePasswordStrength(newPassword);

  const checks = {
    length: newPassword.length >= 8,
    mixedCase: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    different: newPassword.length > 0 && newPassword !== INITIAL_DEFAULT_PASSWORD
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPassword) {
      setErrorMsg('New password is required.');
      return;
    }

    if (newPassword === INITIAL_DEFAULT_PASSWORD) {
      setErrorMsg('New password must differ from your initial default password.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    if (strength.score < 2) {
      setErrorMsg('Please choose a stronger password containing uppercase, lowercase, and numbers.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    try {
      await changePassword(INITIAL_DEFAULT_PASSWORD, newPassword);
      setSuccessNotice('Your password has been updated successfully.');
      setTimeout(() => {
        onPasswordChanged();
      }, 900);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to update password. Please check your credentials.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1016]/95 backdrop-blur-md">
      {/* Circuit background overlay */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />
      <div className="absolute w-[500px] h-[300px] bg-[#CCAA68]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg bg-[#20303A] border-2 border-[#CCAA68] rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header with Security Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>MANDATORY FIRST LOGIN SECURITY STEP</span>
          </div>

          <h2 className="text-2xl font-bold text-white font-display tracking-tight">
            Create your new password
          </h2>

          <p className="text-xs text-[#AEB7BC] leading-relaxed max-w-sm mx-auto">
            Welcome to RVU Career Hub, <strong className="text-white">{user?.displayName}</strong>. You signed in using the initial default credential. RVU institutional security policy requires setting your personal password before accessing the portal.
          </p>
        </div>

        {/* Success confirmation */}
        {successNotice ? (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-2 animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="font-bold text-white text-sm">Your password has been updated successfully.</div>
            <p className="text-[11px] text-emerald-300/90">Redirecting to your workspace...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {errorMsg && (
              <div role="alert" className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block font-semibold text-white uppercase tracking-wider mb-1 font-mono text-[11px]">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#CCAA68] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full bg-[#101A22] border border-[#CCAA68]/40 focus:border-[#CCAA68] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#AEB7BC]/40 font-mono focus:outline-none focus:ring-1 focus:ring-[#CCAA68]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AEB7BC] hover:text-white"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1.5 p-2.5 rounded-lg bg-[#101A22] border border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#AEB7BC]">Password Strength:</span>
                    <span className={`font-bold ${
                      strength.label === 'Strong' ? 'text-emerald-400' :
                      strength.label === 'Fair' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {strength.label}
                    </span>
                  </div>

                  {/* 3-segment strength bar */}
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-colors ${
                      strength.score >= 1 ? (strength.score === 1 ? 'bg-rose-500' : strength.score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-white/10'
                    }`} />
                    <div className={`rounded-full transition-colors ${
                      strength.score >= 2 ? (strength.score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-white/10'
                    }`} />
                    <div className={`rounded-full transition-colors ${
                      strength.score >= 3 ? 'bg-emerald-500' : 'bg-white/10'
                    }`} />
                  </div>

                  {strength.message && (
                    <div className="text-[10px] text-[#AEB7BC] pt-0.5">
                      {strength.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block font-semibold text-white uppercase tracking-wider mb-1 font-mono text-[11px]">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#CCAA68] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#101A22] border border-[#CCAA68]/40 focus:border-[#CCAA68] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#AEB7BC]/40 font-mono focus:outline-none focus:ring-1 focus:ring-[#CCAA68]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AEB7BC] hover:text-white"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checklist of requirements */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#101A22] border border-white/5 text-[10px] font-mono text-[#AEB7BC]">
              <div className={`flex items-center gap-1.5 ${checks.length ? 'text-emerald-400 font-semibold' : ''}`}>
                <Check className={`w-3 h-3 ${checks.length ? 'text-emerald-400' : 'text-white/20'}`} />
                <span>8+ Characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${checks.mixedCase ? 'text-emerald-400 font-semibold' : ''}`}>
                <Check className={`w-3 h-3 ${checks.mixedCase ? 'text-emerald-400' : 'text-white/20'}`} />
                <span>Upper & Lowercase</span>
              </div>
              <div className={`flex items-center gap-1.5 ${checks.hasNumber ? 'text-emerald-400 font-semibold' : ''}`}>
                <Check className={`w-3 h-3 ${checks.hasNumber ? 'text-emerald-400' : 'text-white/20'}`} />
                <span>At least 1 number</span>
              </div>
              <div className={`flex items-center gap-1.5 ${checks.different ? 'text-emerald-400 font-semibold' : ''}`}>
                <Check className={`w-3 h-3 ${checks.different ? 'text-emerald-400' : 'text-white/20'}`} />
                <span>Differs from default</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#CCAA68] to-[#D8B978] hover:from-[#D8B978] hover:to-[#CCAA68] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#101A22]" />
                  <span>UPDATING PASSWORD...</span>
                </>
              ) : (
                <span>UPDATE PASSWORD</span>
              )}
            </button>

            <div className="text-center text-[11px] text-[#AEB7BC]/70 font-mono">
              You cannot skip this step. This ensures your institutional account remains protected.
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
