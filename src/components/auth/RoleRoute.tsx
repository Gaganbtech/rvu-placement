import React, { useEffect } from 'react';
import type { UserRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { AccessRestrictedView } from './AccessRestrictedView';
import { FirstLoginPasswordModal } from './FirstLoginPasswordModal';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  currentPath: string;
  onNavigatePortal: (route: string) => void;
  children: React.ReactNode;
}

/**
 * Strict Role-Based Route Protection
 * 
 * Enforces:
 * 1. Authenticated session exists (redirects to /login if unauthenticated)
 * 2. User possesses one of the `allowedRoles`
 * 3. If an authenticated user enters a URL belonging to another role:
 *    - Student attempting /recruiter or /management -> renders AccessRestrictedView and redirects to /student
 *    - Recruiter attempting /student or /management -> renders AccessRestrictedView and redirects to /recruiter
 *    - Placement Cell attempting /student or /recruiter -> renders AccessRestrictedView and redirects to /management
 * 4. Never renders protected UI to unauthorized roles.
 */
export const RoleRoute: React.FC<RoleRouteProps> = ({
  allowedRoles,
  currentPath,
  onNavigatePortal,
  children
}) => {
  const { isAuthenticated, user, isVerifyingAuth, mustChangePassword } = useAuth();

  const authorizedHome = 
    user?.role === 'student' 
      ? '/student' 
      : user?.role === 'recruiter' 
      ? '/recruiter' 
      : '/management';

  useEffect(() => {
    if (isVerifyingAuth) return;

    // 1. Unauthenticated -> redirect to login with suggested role
    if (!isAuthenticated || !user) {
      onNavigatePortal('/login');
      return;
    }
  }, [isAuthenticated, user, isVerifyingAuth, onNavigatePortal]);

  // 1. Loading / Verification State (No content flash)
  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen bg-[#101A22] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#19252F] border border-[#CCAA68]/30 flex items-center justify-center p-2 mb-4 shadow-xl animate-pulse">
          <img 
            src="/src/assets/rvu-logo-gold.svg" 
            alt="RV University" 
            className="w-full h-full object-contain" 
          />
        </div>
        <div className="text-sm font-bold font-display text-white tracking-wide">
          RV UNIVERSITY • RVU CAREER HUB
        </div>
        <div className="text-xs text-[#D8B978] font-mono mt-1">
          Verifying RVU Career Hub access...
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-[#CCAA68] border-t-transparent animate-spin mt-4" />
      </div>
    );
  }

  // 2. Unauthenticated Gate
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#101A22] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#CCAA68] border-t-transparent animate-spin" />
      </div>
    );
  }

  // 3. Unauthorized Cross-Portal Access Attempt -> Render Access Restricted View
  if (!allowedRoles.includes(user.role)) {
    return (
      <AccessRestrictedView
        currentRole={user.role}
        attemptedPath={currentPath}
        onNavigateHome={() => onNavigatePortal(authorizedHome)}
      />
    );
  }

  // 3. Mandatory First-Login Password Change Gate
  if (mustChangePassword) {
    const portalHome = 
      user.role === 'student' 
        ? '/student' 
        : user.role === 'recruiter' 
        ? '/recruiter' 
        : '/management';
    return (
      <FirstLoginPasswordModal
        onPasswordChanged={() => {
          onNavigatePortal(portalHome);
        }}
      />
    );
  }

  // Authorized: render protected portal workspace
  return <>{children}</>;
};

export default RoleRoute;
