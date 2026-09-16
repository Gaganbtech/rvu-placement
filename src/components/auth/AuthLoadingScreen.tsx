import React from 'react';

interface AuthLoadingScreenProps {
  message?: string;
}

/**
 * Institutional Authentication Loading Screen for RVU Career Hub
 * Strictly uses official RV University branding and official vector logo.
 * Displayed during Supabase session hydration and route verification.
 */
export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({
  message = 'Securing your workspace...'
}) => {
  return (
    <div 
      className="min-h-screen bg-[#101A22] text-white flex flex-col items-center justify-center p-6 text-center select-none"
      role="status"
      aria-live="polite"
    >
      {/* Branded Logo Container */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#19252F] border border-[#CCAA68]/40 flex items-center justify-center p-3 mb-5 shadow-2xl animate-pulse">
        <img 
          src="/src/assets/rvu-logo-gold.svg" 
          alt="RV University Logo" 
          className="w-full h-full object-contain" 
        />
      </div>

      {/* Institutional Brand Headers */}
      <div className="space-y-1">
        <div className="text-sm sm:text-base font-bold font-display text-white tracking-wider">
          RV UNIVERSITY
        </div>
        <div className="text-xs font-semibold text-[#D8B978] font-mono tracking-widest uppercase">
          CAREER HUB
        </div>
      </div>

      {/* Status Message */}
      <div className="text-xs text-[#AEB7BC] font-mono mt-3">
        {message}
      </div>

      {/* Subtle Institutional Spinner */}
      <div className="w-6 h-6 rounded-full border-2 border-[#CCAA68]/30 border-t-[#CCAA68] animate-spin mt-6" />
    </div>
  );
};

export default AuthLoadingScreen;
