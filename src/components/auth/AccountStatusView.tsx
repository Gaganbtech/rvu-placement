import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, Clock, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccountStatusViewProps {
  status: 'inactive' | 'unprovisioned';
  onNavigateLogin: () => void;
}

export const AccountStatusView: React.FC<AccountStatusViewProps> = ({
  status,
  onNavigateLogin
}) => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    onNavigateLogin();
  };

  const isInactive = status === 'inactive';

  return (
    <div className="min-h-screen bg-[#101A22] text-[#F2F4F5] flex flex-col justify-between selection:bg-[#CCAA68] selection:text-[#101A22] p-4 sm:p-6">
      
      {/* Top Header */}
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
              CAREER HUB
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#19252F] border border-[#CCAA68]/30 hover:border-[#CCAA68] text-xs text-[#AEB7BC] hover:text-white transition-all shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5 text-[#CCAA68]" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Card */}
      <main className="max-w-lg mx-auto w-full my-auto py-8">
        <div className="relative rounded-2xl bg-[#19252F] border border-[#CCAA68]/30 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/40 via-[#CCAA68] to-amber-500/40" />

          <div className="space-y-6">
            
            {/* Icon & Title */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                {isInactive ? <Clock className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono tracking-widest text-[#D8B978] uppercase font-bold">
                  ACCOUNT GOVERNANCE NOTICE
                </div>
                <h1 className="text-2xl font-bold text-white font-display tracking-tight">
                  {isInactive ? 'AWAITING ACTIVATION' : 'ACCOUNT NOT PROVISIONED'}
                </h1>
              </div>
            </div>

            {/* Core Message */}
            <div className="p-4 rounded-xl bg-[#101A22] border border-[#CCAA68]/20 text-xs text-[#AEB7BC] leading-relaxed space-y-2">
              <p className="font-semibold text-white">
                {isInactive 
                  ? 'Your account is awaiting activation. Please contact the RVU Placement Cell.'
                  : 'Your account is not fully provisioned yet. Please contact the RVU Placement Cell.'
                }
              </p>
              <p>
                In compliance with RV University institutional policy, accounts require verified administrative assignment before workspace access is granted.
              </p>
            </div>

            {/* Contact Information */}
            <div className="p-3.5 rounded-xl bg-[#101A22]/60 border border-white/5 space-y-1.5 text-xs text-[#AEB7BC]">
              <div className="flex items-center gap-1.5 text-[#D8B978] font-mono font-bold text-[11px]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>SUPPORT CONTACT</span>
              </div>
              <div>Office of Corporate & Alumni Relations (CAR)</div>
              <div className="font-mono text-[#CCAA68]">placement@rvu.edu.in</div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSignOut}
                className="flex-1 py-3 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] active:bg-[#B8924E] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
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
