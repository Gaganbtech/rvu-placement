import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DevAuthStatusPageProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export const DevAuthStatusPage: React.FC<DevAuthStatusPageProps> = ({
  onNavigateHome,
  onNavigateLogin
}) => {
  const { user, isAuthenticated, isDemoAuth } = useAuth();

  const isDevMode = import.meta.env.DEV || isDemoAuth;
  if (!isDevMode) {
    return (
      <div className="min-h-screen bg-[#101A22] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold font-display">404 - Page Not Found</h1>
          <p className="text-xs text-[#AEB7BC]">Development diagnostics are not accessible in production mode.</p>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-xl bg-[#CCAA68] text-[#101A22] font-bold text-xs"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const sessionStatus = isAuthenticated && user ? 'SIGNED IN' : 'SIGNED OUT';

  return (
    <div className="min-h-screen bg-[#101A22] text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#CCAA68] selection:text-[#101A22]">
      {/* Background Accent */}
      <div className="max-w-2xl mx-auto w-full space-y-6 my-auto">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 hover:border-[#CCAA68] text-xs text-[#AEB7BC] hover:text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#CCAA68]" />
            <span>Back to Login</span>
          </button>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase">
            LOCAL DEMO AUTH ACTIVE
          </span>
        </div>

        {/* Card */}
        <div className="bg-[#19252F] border border-[#CCAA68]/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#CCAA68] uppercase font-bold tracking-wider mb-1">
              <span>RV UNIVERSITY</span>
              <span>•</span>
              <span>AUTH SYSTEM DIAGNOSTICS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              RVU Career Hub Auth Diagnostics
            </h1>
            <p className="text-xs text-[#AEB7BC] mt-1">
              Current authentication subsystem status: Normal User ID + Password Login (Local Demo Mode).
            </p>
          </div>

          {/* Diagnostic Metrics Grid */}
          <div className="space-y-3 font-mono text-xs">
            
            <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[#AEB7BC] text-[10px] uppercase">Authentication Mode</div>
                <div className="text-white font-bold">User ID + Password Login</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">VITE_DEMO_AUTH = true (Active)</div>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                ACTIVE
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[#AEB7BC] text-[10px] uppercase">Supabase Credentials Requirement</div>
                <div className="text-white font-bold">DISABLED (Not Required)</div>
                <div className="text-[10px] text-[#AEB7BC] mt-0.5">No VITE_SUPABASE_URL or ANON KEY required</div>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                NOT REQUIRED
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[#AEB7BC] text-[10px] uppercase">Magic Link & Email Confirmation</div>
                <div className="text-white font-bold">REMOVED</div>
                <div className="text-[10px] text-[#AEB7BC] mt-0.5">Direct User ID + Password authentication</div>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-[#AEB7BC]">
                REMOVED
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[#AEB7BC] text-[10px] uppercase">Current Session Status</div>
                <div className="text-white font-bold">{sessionStatus}</div>
                {user && (
                  <div className="text-[10px] text-[#D8B978] mt-0.5">
                    User: {user.email} • Role: {user.role.toUpperCase()}
                  </div>
                )}
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${isAuthenticated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-[#AEB7BC]'}`}>
                {sessionStatus}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/5 space-y-1">
              <div className="text-[#AEB7BC] text-[10px] uppercase">Current Origin</div>
              <div className="text-white font-mono">{origin}</div>
            </div>

          </div>

          {/* Guidelines Box */}
          <div className="p-4 rounded-xl bg-[#101A22] border border-[#CCAA68]/20 space-y-2 text-xs">
            <div className="text-[#D8B978] font-bold font-mono text-[11px] uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#CCAA68]" />
              <span>Development Testing Instructions</span>
            </div>
            <p className="text-[#AEB7BC] text-[11px] leading-relaxed">
              When in local demo mode, any non-empty User ID / email and any non-empty password will log in successfully to the chosen portal (Student, Recruiter, or Placement Cell).
            </p>
          </div>

        </div>

      </div>

      <footer className="text-center text-xs text-[#78848C] font-mono py-2">
        RV University Career Hub • Development Diagnostics
      </footer>
    </div>
  );
};
