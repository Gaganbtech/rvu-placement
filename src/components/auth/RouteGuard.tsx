import React from 'react';
import { ShieldAlert, ArrowRight, LogOut } from 'lucide-react';
import type { AuthRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { FirstLoginPasswordModal } from './FirstLoginPasswordModal';

interface RouteGuardProps {
  requiredRole: AuthRole;
  currentPath: string;
  onNavigateLogin: (role: AuthRole) => void;
  onNavigatePortal: (route: string) => void;
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  requiredRole,
  currentPath: _currentPath,
  onNavigateLogin,
  onNavigatePortal,
  children
}) => {
  const { isAuthenticated, user, mustChangePassword, logout } = useAuth();

  // Automatically redirect unauthorized portal access to that user's own portal
  React.useEffect(() => {
    if (isAuthenticated && user && user.role !== requiredRole) {
      const roleTarget = user.role === 'student' ? '/student' : user.role === 'recruiter' ? '/recruiter' : '/management';
      onNavigatePortal(roleTarget);
    }
  }, [isAuthenticated, user, requiredRole, onNavigatePortal]);

  // 1. Unauthenticated Check
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#101A22] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#20303A] border border-[#CCAA68]/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#101A22] border border-[#CCAA68]/40 flex items-center justify-center mx-auto text-[#CCAA68]">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>

          <h2 className="text-xl font-bold text-white font-display">
            Authentication Required
          </h2>

          <p className="text-xs text-[#AEB7BC] leading-relaxed">
            You must sign in with your verified RVU institutional account to access this {requiredRole.toUpperCase()} workspace.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigateLogin(requiredRole)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Sign In to {requiredRole === 'placement-cell' ? 'Placement Cell' : `${requiredRole.toUpperCase()} Portal`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Role Authorization Check (Cross-Portal Access Prevention)
  if (user.role !== requiredRole) {
    const roleTarget = user.role === 'student' ? '/student' : user.role === 'recruiter' ? '/recruiter' : '/management';
    return (
      <div className="min-h-screen bg-[#101A22] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#20303A] border border-rose-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-white font-display">
            Access Denied • Role Restriction
          </h2>

          <p className="text-xs text-[#AEB7BC] leading-relaxed">
            Your account (<strong className="text-white">{user.email}</strong>) is authorized for <strong className="text-[#CCAA68]">{user.role.toUpperCase()}</strong> operations only. You cannot access {requiredRole.toUpperCase()} records.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onNavigatePortal(roleTarget)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-bold text-xs uppercase tracking-wider transition-all"
            >
              Go to My Portal ({user.role})
            </button>

            <button
              onClick={() => {
                logout();
                onNavigateLogin(requiredRole);
              }}
              className="py-2.5 px-3 rounded-xl bg-[#101A22] hover:bg-[#19252F] text-[#AEB7BC] hover:text-white border border-white/10 text-xs font-mono flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Mandatory First-Login Password Change Gate
  if (mustChangePassword) {
    const portalHome = requiredRole === 'student' ? '/student' : requiredRole === 'recruiter' ? '/recruiter' : '/management';
    return (
      <FirstLoginPasswordModal
        onPasswordChanged={() => {
          onNavigatePortal(portalHome);
        }}
      />
    );
  }

  // Authorized and compliant
  return <>{children}</>;
};
