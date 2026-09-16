// src/components/auth/AuthCallbackPage.tsx
// Legacy magic-link callback route redirected to login
// Passwordless and magic-link authentication have been removed in favor of User ID + Password authentication.

import React, { useEffect } from 'react';
import type { AuthRole } from '../../types/auth';

interface AuthCallbackPageProps {
  onNavigatePortal: (route: string) => void;
  onNavigateLogin: (role?: AuthRole) => void;
}

export const AuthCallbackPage: React.FC<AuthCallbackPageProps> = ({
  onNavigateLogin
}) => {
  useEffect(() => {
    onNavigateLogin();
  }, [onNavigateLogin]);

  return null;
};
