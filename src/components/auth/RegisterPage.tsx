import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  User as UserIcon, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { evaluatePasswordStrength } from '../../services/authService';

interface RegisterPageProps {
  onBackToLogin: () => void;
  onNavigateRecruiterRequest?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onBackToLogin,
  onNavigateRecruiterRequest
}) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');

  const passwordStrength = evaluatePasswordStrength(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and try again.');
      return;
    }

    if (passwordStrength.score < 2) {
      setErrorMsg('Password is too weak. Please include numbers or uppercase characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        fullName: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword
      });

      if (result.success) {
        setSuccessEmail(trimmedEmail);
        setIsSuccess(true);
      } else {
        setErrorMsg(result.error || 'Unable to register account right now. Please try again.');
      }
    } catch {
      setErrorMsg('Unable to register account right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101A22] text-[#F2F4F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-[#CCAA68] selection:text-[#101A22]">
      
      {/* Ambient background styling */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#CCAA68]/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#19252F]/40 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

      {/* Top Header with Official RV University Logo */}
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

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto w-full py-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Context & Information */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19252F] border border-[#CCAA68]/30 text-[#D8B978] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#CCAA68]" />
              <span>WHERE TALENT MEETS OPPORTUNITY</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                JOIN THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCAA68] via-[#D8B978] to-[#E6CF9D]">
                  RVU CAREER HUB
                </span>
              </h1>
              <p className="text-sm text-[#AEB7BC] max-w-md mx-auto lg:mx-0 leading-relaxed">
                Create your student account to access campus placement drives, verified internships, AI career prep, and official institutional recruitment.
              </p>
            </div>

            {/* Platform Features */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#19252F]/70 border border-[#CCAA68]/20 text-left">
                <div className="text-[10px] uppercase font-mono text-[#D8B978] font-bold">Official</div>
                <div className="text-xs font-bold text-white mt-0.5">Placement Drives</div>
              </div>
              <div className="p-3 rounded-xl bg-[#19252F]/70 border border-[#CCAA68]/20 text-left">
                <div className="text-[10px] uppercase font-mono text-[#D8B978] font-bold">Institutional</div>
                <div className="text-xs font-bold text-white mt-0.5">Resume Verification</div>
              </div>
              <div className="p-3 rounded-xl bg-[#19252F]/70 border border-[#CCAA68]/20 text-left">
                <div className="text-[10px] uppercase font-mono text-[#D8B978] font-bold">Secure</div>
                <div className="text-xs font-bold text-white mt-0.5">Offer Governance</div>
              </div>
            </div>

            {/* Recruiter Notice Box */}
            <div className="p-4 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#CCAA68]" />
                <span className="text-xs font-bold text-[#D8B978] font-mono uppercase tracking-wider">
                  Employer & Corporate Recruitment
                </span>
              </div>
              <p className="text-xs text-[#AEB7BC] leading-relaxed">
                Looking to hire RV University graduates or conduct on-campus drives? Recruiter accounts are issued through an institutional approval process.
              </p>
              {onNavigateRecruiterRequest && (
                <button
                  type="button"
                  onClick={onNavigateRecruiterRequest}
                  className="text-xs text-[#CCAA68] hover:text-[#D8B978] font-semibold underline underline-offset-2 flex items-center gap-1 mt-1"
                >
                  Request Recruiter Access &rarr;
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-[#20303A] rounded-2xl border border-[#CCAA68]/20 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#CCAA68] to-transparent" />

              {isSuccess ? (
                /* Account Created / Email Verification Confirmation State */
                <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#D8B978] font-mono uppercase tracking-wider">
                      Registration Submitted
                    </div>
                    <h2 className="text-xl font-bold text-white font-display">
                      Account Created
                    </h2>
                    <p className="text-xs text-[#AEB7BC] leading-relaxed">
                      Please check your email to verify your account:
                    </p>
                    <div className="p-2.5 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 text-xs font-mono text-[#CCAA68] break-all">
                      {successEmail}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#19252F] border border-white/5 text-xs text-[#AEB7BC] text-left space-y-1.5">
                    <div className="font-semibold text-white">Next Steps:</div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-[#AEB7BC]">
                      <li>Open the verification email sent to your inbox.</li>
                      <li>Click the confirmation link to activate your credentials.</li>
                      <li>Return to Career Hub and sign in to your student workspace.</li>
                    </ul>
                  </div>

                  <button
                    onClick={onBackToLogin}
                    className="w-full py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] active:bg-[#B8924E] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Sign In</span>
                  </button>
                </div>
              ) : (
                /* Registration Form */
                <>
                  {/* Form Header */}
                  <div className="mb-6 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#D8B978] font-mono uppercase tracking-wider">
                        STUDENT REGISTRATION
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#101A22] text-[#AEB7BC] font-mono border border-white/5">
                        CAREER WORKSPACE
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white font-display">
                      Create your RVU Career Hub account
                    </h2>
                    <p className="text-xs text-[#AEB7BC]">
                      Register to access your career and placement workspace.
                    </p>
                  </div>

                  {/* Error Notice */}
                  {errorMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-300 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="reg-name"
                        className="block text-xs font-mono text-[#AEB7BC] uppercase font-bold tracking-wider"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AEB7BC]">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <input
                          id="reg-name"
                          name="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Gagana Btech"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] focus:ring-1 focus:ring-[#CCAA68] text-sm text-white placeholder:text-[#78848C] transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="reg-email"
                        className="block text-xs font-mono text-[#AEB7BC] uppercase font-bold tracking-wider"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AEB7BC]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="reg-email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. gagan@gmail.com or gagana.btech23@rvu.edu.in"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] focus:ring-1 focus:ring-[#CCAA68] text-sm text-white placeholder:text-[#78848C] transition-all outline-none"
                        />
                      </div>
                      <div className="text-[10px] text-[#78848C] font-mono">
                        Institutional email (@rvu.edu.in) recommended for automatic profile verification.
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="reg-password"
                        className="block text-xs font-mono text-[#AEB7BC] uppercase font-bold tracking-wider"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AEB7BC]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="reg-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] focus:ring-1 focus:ring-[#CCAA68] text-sm text-white placeholder:text-[#78848C] transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#AEB7BC] hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
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

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="reg-confirm-password"
                        className="block text-xs font-mono text-[#AEB7BC] uppercase font-bold tracking-wider"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AEB7BC]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="reg-confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#101A22] border ${
                            passwordsMatch ? 'border-emerald-500/50' : 
                            passwordMismatch ? 'border-rose-500/50' : 
                            'border-[#CCAA68]/30'
                          } focus:border-[#CCAA68] focus:ring-1 focus:ring-[#CCAA68] text-sm text-white placeholder:text-[#78848C] transition-all outline-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#AEB7BC] hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordMismatch && (
                        <div className="text-[10px] text-rose-400 font-mono">
                          Passwords do not match.
                        </div>
                      )}
                      {passwordsMatch && (
                        <div className="text-[10px] text-emerald-400 font-mono">
                          Passwords match.
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] active:bg-[#B8924E] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating account...</span>
                          </>
                        ) : (
                          <span>CREATE ACCOUNT</span>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Sign In & Back Links */}
                  <div className="mt-5 pt-4 border-t border-white/5 text-center text-xs text-[#AEB7BC] space-y-2">
                    <div>
                      <span>Already have an account? </span>
                      <button 
                        type="button"
                        onClick={onBackToLogin}
                        className="text-[#CCAA68] hover:underline font-bold"
                      >
                        Sign In
                      </button>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={onBackToLogin}
                        className="text-[11px] text-[#78848C] hover:text-[#AEB7BC] transition-colors font-mono"
                      >
                        &larr; Back to Career Hub
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

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
