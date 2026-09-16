import React, { useEffect } from 'react';
import type { UserRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { AccessRestrictedView } from './AccessRestrictedView';
import { FirstLoginPasswordModal } from './FirstLoginPasswordModal';
import { AccountStatusView } from './AccountStatusView';
import { AuthLoadingScreen } from './AuthLoadingScreen';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  currentPath: string;
  onNavigatePortal: (route: string) => void;
  children: React.ReactNode;
}

const validRoles: UserRole[] = ['student', 'recruiter', 'placement'];

/**
 * Strict Role-Based Route Guard for RVU CAREER HUB
 * 
 * Enforces:
 * 1. Auth Loading Gate: While authentication is initializing or hydrating, renders AuthLoadingScreen.
 *    NEVER redirects to login during initialization.
 * 2. Unauthenticated Gate: Redirects unauthenticated users to /login only after initialization completes.
 * 3. Inactive Account Gate: Shows AccountStatusView for inactive accounts.
 * 4. Unprovisioned Role Gate: Shows AccountStatusView if role is missing or invalid.
 * 5. Strict Role Isolation: Blocks cross-portal access (e.g. Student -> /recruiter) with AccessRestrictedView.
 * 6. Never renders protected UI to unauthenticated or unauthorized users.
 */
export const RoleRoute: React.FC<RoleRouteProps> = ({
  allowedRoles,
  currentPath,
  onNavigatePortal,
  children
}) => {
  const { session, user, role, isInitialized, isLoading, mustChangePassword } = useAuth();

  const activeRole = role || user?.role || null;
  const authorizedHome = 
    activeRole === 'student' 
      ? '/student' 
      : activeRole === 'recruiter' 
      ? '/recruiter' 
      : '/management';

  // Navigate unauthenticated users to /login ONLY after initialization is complete
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!session || !user) {
      onNavigatePortal('/login');
    }
  }, [isInitialized, isLoading, session, user, onNavigatePortal]);

  // 1. Loading / Hydration State (Prevents redirect loop & content flash)
  if (!isInitialized || isLoading) {
    return <AuthLoadingScreen message="Securing your workspace..." />;
  }

  // 2. Unauthenticated Gate (Redirect is in flight via useEffect)
  if (!session || !user) {
    return <AuthLoadingScreen message="Redirecting to login..." />;
  }

  // 3. Inactive Account Gate
  if (user.isActive === false) {
    return (
      <AccountStatusView
        status="inactive"
        onNavigateLogin={() => onNavigatePortal('/login')}
      />
    );
  }

  // 4. Missing / Unprovisioned Role Gate
  if (!activeRole || !validRoles.includes(activeRole)) {
    return (
      <AccountStatusView
        status="unprovisioned"
        onNavigateLogin={() => onNavigatePortal('/login')}
      />
    );
  }

  // 5. Unauthorized Cross-Portal Access Attempt -> Render AccessRestrictedView
  if (!allowedRoles.includes(activeRole)) {
    return (
      <AccessRestrictedView
        currentRole={activeRole}
        attemptedPath={currentPath}
        onNavigateHome={() => onNavigatePortal(authorizedHome)}
      />
    );
  }

  // 6. Mandatory First-Login Password Change Gate
  if (mustChangePassword) {
    return (
      <FirstLoginPasswordModal
        onPasswordChanged={() => {
          onNavigatePortal(authorizedHome);
        }}
      />
    );
  }

  // 7. Authorized: render protected portal workspace
  return <>{children}</>;
};

export default RoleRoute;
