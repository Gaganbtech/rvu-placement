import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2, 
  Sparkles, 
  Info
} from 'lucide-react';
import type { AuthRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

interface LoginPageProps {
  initialRole?: AuthRole;
  onBackToPortals: () => void;
  onLoginSuccess: (role: AuthRole) => void;
  onNavigateForgotPassword?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = 'student',
  onBackToPortals,
  onLoginSuccess,
  onNavigateForgotPassword
}) => {
  const { login, isDemoAuth } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<AuthRole>(initialRole);
  const [identifier, setIdentifier] = useState(() => authService.getRememberedIdentifier() || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState<string | null>(null);

  const roleMeta: Record<AuthRole, {
    title: string;
    badge: string;
    icon: React.ReactNode;
    portalName: string;
    identifierPlaceholder: string;
    hint: string;
  }> = {
    'student': {
      title: 'STUDENT PORTAL',
      badge: 'CAREER OPERATING SYSTEM',
      icon: <GraduationCap className="w-4 h-4 text-[#CCAA68]" />,
      portalName: 'Student Portal',
      identifierPlaceholder: 'Enter your student ID or email',
      hint: 'e.g. gagana.btech23@rvu.edu.in or gagan@gmail.com'
    },
    'recruiter': {
      title: 'RECRUITER PORTAL',
      badge: 'CORPORATE TALENT CONNECT',
      icon: <Building2 className="w-4 h-4 text-[#CCAA68]" />,
      portalName: 'Recruiter Portal',
      identifierPlaceholder: 'Enter your corporate recruiter email',
      hint: 'e.g. recruiter@google.com or campus-talent@microsoft.com'
    },
    'placement-cell': {
      title: 'CAR / PLACEMENT CELL',
      badge: 'PLACEMENT GOVERNANCE',
      icon: <ShieldCheck className="w-4 h-4 text-[#CCAA68]" />,
      portalName: 'Placement Cell',
      identifierPlaceholder: 'Enter your placement officer ID or email',
      hint: 'e.g. car.placement@rvu.edu.in or placement.dir@rvu.edu.in'
    }
  };

  const currentMeta = roleMeta[selectedRole];

  const handleRoleChange = (newRole: AuthRole) => {
    setSelectedRole(newRole);
    setErrorMsg(null);
    setForgotPasswordNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setForgotPasswordNotice(null);

    const trimmedId = identifier.trim();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setErrorMsg('Please enter your user ID and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({
        identifier: trimmedId,
        password: trimmedPass,
        role: selectedRole,
        rememberMe
      });

      if (result.success && result.user) {
        onLoginSuccess(result.user.role);
      } else {
        setErrorMsg(result.error || 'Invalid user ID or password.');
      }
    } catch {
      setErrorMsg('Invalid user ID or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateForgotPassword) {
      onNavigateForgotPassword();
    } else {
      setForgotPasswordNotice('Password recovery will be available when the production authentication service is connected.');
    }
  };

  return (
    <div className="min-h-screen bg-[#101A22] text-[#F2F4F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-[#CCAA68] selection:text-[#101A22]">
      
      {/* Ambient background styling */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#CCAA68]/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#19252F]/40 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#CCAA68]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#19252F] border border-[#CCAA68]/40 flex items-center justify-center p-2 shadow-sm">
            <GraduationCap className="w-6 h-6 text-[#CCAA68]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide font-display">
              RV UNIVERSITY
            </div>
            <div className="text-[10px] text-[#CCAA68] tracking-wider uppercase font-semibold font-mono">
              CAREER HUB
            </div>
          </div>
        </div>

        <button
          onClick={onBackToPortals}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 hover:border-[#CCAA68] text-xs text-[#AEB7BC] hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#CCAA68]" />
          <span>Portals</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto w-full py-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Statement & Context */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19252F] border border-[#CCAA68]/30 text-[#D8B978] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#CCAA68]" />
              <span>WHERE TALENT MEETS OPPORTUNITY</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                WELCOME BACK <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCAA68] via-[#D8B978] to-[#E6CF9D]">
                  TO YOUR CAREER HUB
                </span>
              </h1>
              <p className="text-sm text-[#AEB7BC] max-w-md mx-auto lg:mx-0 leading-relaxed">
                Sign in to continue your journey from preparation to opportunity. Access campus drives, verified internships, and placement operations.
              </p>
            </div>

            {/* Key Platform Pillars */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#19252F]/70 border border-[#CCAA68]/20 text-left">
                <div className="text-[10px] uppercase font-mono text-[#D8B978] font-bold">100% Verified</div>
                <div className="text-xs font-bold text-white mt-0.5">Corporate Drives</div>
              </div>
              <div className="p-3 rounded-xl bg-[#19252F]/70 border border-[#CCAA68]/20 text-left">
                <div className="text-[10px] uppercase font-mono text-[#D8B978] font-bold">AI-Powered</div>
                <div className="text-xs font-bold text-white mt-0.5">Skill Analytics</div>
              </div>
              <div className="p-3 rounded-xl bg-[#19252F]/70 border border-[#CCAA68]/20 text-left">
                <div className="text-[10px] uppercase font-mono text-[#D8B978] font-bold">Unified</div>
                <div className="text-xs font-bold text-white mt-0.5">Offer Governance</div>
              </div>
            </div>

            {/* Dev Mode Notification Badge */}
            {isDemoAuth && (
              <div className="p-3 rounded-xl bg-[#19252F] border border-amber-500/30 flex items-start gap-2.5 text-left text-xs">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wider">
                    LOCAL DEVELOPMENT AUTH MODE
                  </div>
                  <div className="text-[#AEB7BC] text-[11px] mt-0.5">
                    For local testing, enter any valid User ID / email and any non-empty password to log in directly.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Credential Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-[#20303A] rounded-2xl border border-[#CCAA68]/20 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#CCAA68] to-transparent" />

              {/* Portal Selector Tabs */}
              <div className="mb-6">
                <div className="text-[11px] font-mono text-[#AEB7BC] uppercase font-bold tracking-wider mb-2">
                  Select Workspace
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#101A22] rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('student')}
                    className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'student'
                        ? 'bg-[#CCAA68] text-[#101A22] shadow-md'
                        : 'text-[#AEB7BC] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span className="text-[11px] truncate w-full text-center">Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('recruiter')}
                    className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'recruiter'
                        ? 'bg-[#CCAA68] text-[#101A22] shadow-md'
                        : 'text-[#AEB7BC] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] truncate w-full text-center">Recruiter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('placement-cell')}
                    className={`py-2 px-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'placement-cell'
                        ? 'bg-[#CCAA68] text-[#101A22] shadow-md'
                        : 'text-[#AEB7BC] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[11px] truncate w-full text-center">Placement</span>
                  </button>
                </div>
              </div>

              {/* Form Header */}
              <div className="mb-5 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#D8B978] font-mono uppercase tracking-wider">
                    {currentMeta.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#101A22] text-[#AEB7BC] font-mono border border-white/5">
                    {currentMeta.badge}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-display">
                  Sign In
                </h2>
                <p className="text-xs text-[#AEB7BC]">
                  Enter your credentials to access your {currentMeta.portalName} account.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* Forgot Password Notice */}
              {forgotPasswordNotice && (
                <div className="mb-4 p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-start gap-2 text-xs text-blue-300 animate-in fade-in">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{forgotPasswordNotice}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* User ID / Email Field */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor="rvu-user-id"
                    className="block text-xs font-mono text-[#AEB7BC] uppercase font-bold tracking-wider"
                  >
                    User ID / Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AEB7BC]">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="rvu-user-id"
                      name="identifier"
                      type="text"
                      autoComplete="username"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={currentMeta.identifierPlaceholder}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] focus:ring-1 focus:ring-[#CCAA68] text-sm text-white placeholder:text-[#78848C] transition-all outline-none"
                    />
                  </div>
                  <div className="text-[10px] text-[#78848C] font-mono">
                    {currentMeta.hint}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="rvu-password"
                      className="block text-xs font-mono text-[#AEB7BC] uppercase font-bold tracking-wider"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-[#CCAA68] hover:text-[#D8B978] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AEB7BC]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="rvu-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#CCAA68]/40 bg-[#101A22] text-[#CCAA68] focus:ring-[#CCAA68] focus:ring-offset-0 cursor-pointer accent-[#CCAA68]"
                    />
                    <span className="text-xs text-[#AEB7BC]">Remember me</span>
                  </label>
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
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>SIGN IN</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom Support Link */}
              <div className="mt-5 pt-4 border-t border-white/5 text-center text-xs text-[#AEB7BC]">
                <span>Need assistance? Contact </span>
                <a 
                  href="mailto:placement@rvu.edu.in" 
                  className="text-[#CCAA68] hover:underline font-mono"
                >
                  placement@rvu.edu.in
                </a>
              </div>

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
