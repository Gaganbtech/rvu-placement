import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Info, User as UserIcon } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onBackToLogin
}) => {
  const [identifier, setIdentifier] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In local demo mode: do not send fake emails or pretend an email was sent.
    setNotice('Password recovery will be available when the production authentication service is connected.');
  };

  return (
    <div className="min-h-screen bg-[#101A22] text-white relative overflow-hidden flex flex-col justify-between selection:bg-[#CCAA68] selection:text-[#101A22]">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#CCAA68]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between border-b border-[#CCAA68]/20">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 hover:border-[#CCAA68] text-xs text-[#AEB7BC] hover:text-white transition-all shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#CCAA68] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Sign In</span>
        </button>
        <span className="text-xs font-mono text-[#D8B978]">
          RV UNIVERSITY CAREER HUB
        </span>
      </header>

      {/* Center Card */}
      <main className="relative z-10 max-w-md mx-auto w-full px-4 sm:px-6 py-8 my-auto">
        <div className="bg-[#20303A] rounded-2xl border border-[#CCAA68]/30 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
          
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#101A22] border border-[#CCAA68]/40 flex items-center justify-center mx-auto text-[#CCAA68] shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
              Password Recovery
            </h1>
            <p className="text-xs text-[#AEB7BC] leading-relaxed">
              Enter your user ID or institutional email to request password recovery.
            </p>
          </div>

          {notice && (
            <div className="mb-5 p-4 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-white">Notice:</div>
                <div className="leading-relaxed">{notice}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#AEB7BC] uppercase tracking-wider mb-1.5 font-mono text-[11px]">
                User ID / Institutional Email
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#CCAA68] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your user ID or email"
                  className="w-full bg-[#101A22] border border-[#CCAA68]/30 focus:border-[#CCAA68] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#AEB7BC]/50 focus:outline-none focus:ring-1 focus:ring-[#CCAA68] transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              REQUEST RECOVERY
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

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 text-center text-xs text-[#AEB7BC]/60 font-mono">
        RV University Placement & Career Hub • Credential Governance
      </footer>
    </div>
  );
};
