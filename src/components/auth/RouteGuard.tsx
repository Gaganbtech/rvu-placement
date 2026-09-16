import React from 'react';
import type { UserRole, AuthRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { FirstLoginPasswordModal } from './FirstLoginPasswordModal';

interface RouteGuardProps {
  requiredRole: UserRole | AuthRole;
  currentPath: string;
  onNavigateLogin: (role: UserRole) => void;
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
  const { isAuthenticated, user, mustChangePassword } = useAuth();
  const canonicalRequired: UserRole = authService.normalizeRole(requiredRole);

  // Automatically redirect unauthorized portal access to that user's own portal
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      onNavigateLogin(canonicalRequired);
      return;
    }

    if (user.role !== canonicalRequired) {
      const roleTarget = user.role === 'student' ? '/student' : user.role === 'recruiter' ? '/recruiter' : '/management';
      onNavigatePortal(roleTarget);
    }
  }, [isAuthenticated, user, canonicalRequired, onNavigatePortal, onNavigateLogin]);

  // 1. Unauthenticated or Cross-Portal Unauthorized Check
  if (!isAuthenticated || !user || user.role !== canonicalRequired) {
    return (
      <div className="min-h-screen bg-[#101A22] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#CCAA68] border-t-transparent animate-spin" />
      </div>
    );
  }
  // 2. Mandatory First-Login Password Change Gate
  if (mustChangePassword) {
    const portalHome = 
      canonicalRequired === 'student' 
        ? '/student' 
        : canonicalRequired === 'recruiter' 
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

  // Authorized and compliant
  return <>{children}</>;
};

export default RouteGuard;
