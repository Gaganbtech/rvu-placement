import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import type { UserRole } from '../../types/auth';

interface AccessRestrictedViewProps {
  currentRole: UserRole | null;
  attemptedPath: string;
  onNavigateHome: () => void;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({
  currentRole,
  attemptedPath,
  onNavigateHome
}) => {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (countdown <= 0) {
      onNavigateHome();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, onNavigateHome]);

  const getAuthorizedLabel = () => {
    if (currentRole === 'student') return 'Student Portal';
    if (currentRole === 'recruiter') return 'Recruiter Portal';
    if (currentRole === 'placement') return 'Placement Cell Portal';
    return 'Login Workspace';
  };

  return (
    <div className="min-h-screen bg-[#101A22] text-[#F2F4F5] flex flex-col justify-between selection:bg-[#CCAA68] selection:text-[#101A22] p-4 sm:p-6">
      
      {/* Top Header Lockup */}
      <header className="max-w-6xl mx-auto w-full pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 flex items-center justify-center p-1.5 shadow-md">
            <img 
              src="/src/assets/rvu-logo-gold.svg" 
              alt="RV University" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white font-display">
              RV UNIVERSITY
            </div>
            <div className="text-[10px] text-[#D8B978] font-mono tracking-widest uppercase">
              RVU CAREER HUB
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#19252F] border border-[#CCAA68]/20 text-[11px] font-mono text-[#AEB7BC]">
          <Lock className="w-3.5 h-3.5 text-[#CCAA68]" />
          <span>Role Isolation Active</span>
        </div>
      </header>

      {/* Main Restriction Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-8">
        <div className="relative rounded-2xl bg-[#19252F] border border-rose-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500/40 via-[#CCAA68] to-rose-500/40" />

          <div className="space-y-6">
            
            {/* Icon & Title Lockup */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono tracking-widest text-[#D8B978] uppercase font-bold">
                  INSTITUTIONAL SECURITY GATEWAY
                </div>
                <h1 className="text-2xl font-bold text-white font-display tracking-tight">
                  ACCESS RESTRICTED
                </h1>
              </div>
            </div>

            {/* Explanation Message */}
            <div className="space-y-3 text-xs text-[#AEB7BC] leading-relaxed">
              <p>
                You do not have permission to access the requested portal (<code className="text-[#CCAA68] font-mono bg-[#101A22] px-1.5 py-0.5 rounded border border-[#CCAA68]/20">{attemptedPath}</code>).
              </p>
              <p>
                In strict compliance with RV University Career & Placement Governance, cross-portal access is strictly compartmentalized. Students, Recruiters, and Placement Cell members may only operate within their verified workspaces.
              </p>
            </div>

            {/* Active Identity Card */}
            <div className="p-3.5 rounded-xl bg-[#101A22] border border-[#CCAA68]/20 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono text-[#78848C] uppercase">
                  Current Authenticated Role
                </div>
                <div className="font-bold text-white uppercase tracking-wider font-mono">
                  {currentRole === 'placement' ? 'PLACEMENT CELL' : (currentRole || 'UNAUTHENTICATED')}
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="text-[10px] font-mono text-[#78848C] uppercase">
                  Automatic Safe Redirect
                </div>
                <div className="font-mono text-[#CCAA68] font-bold">
                  In {countdown}s...
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onNavigateHome}
                className="flex-1 py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] active:bg-[#B8924E] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Return to {getAuthorizedLabel()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full py-4 text-center text-xs text-[#78848C] border-t border-white/5">
        <div>
          RV University Career Hub • Office of Corporate & Alumni Relations (CAR) • Security Governance
        </div>
      </footer>

    </div>
  );
};
