import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  AuthRole, 
  AuthUser, 
  LoginCredentials, 
  LoginResult,
  ChangePasswordResult,
  UserPreferences,
  SessionInfo
} from '../types/auth';
import { authService } from '../services/authService';

export interface AuthContextType {
  user: AuthUser | null;
  role: AuthRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  preferences: UserPreferences;
  sessions: SessionInfo[];
  isDemoAuth: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => Promise<void>;
  changePassword: (current: string, newPass: string) => Promise<ChangePasswordResult>;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  terminateOtherSessions: () => void;
  requestPasswordReset: (identifier: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [preferences, setPreferences] = useState<UserPreferences>(() => authService.getPreferences());
  const [sessions, setSessions] = useState<SessionInfo[]>(() => authService.getSessions());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if session exists in storage on initial mount
    const storedSession = authService.getStoredSession();
    if (storedSession && storedSession.authenticated) {
      const activeUser = authService.getCurrentUser();
      setUser(activeUser);
      setSessions(authService.getSessions());
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      if (result.success && result.user) {
        setUser(result.user);
        setPreferences(authService.getPreferences());
        setSessions(authService.getSessions());
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (current: string, newPass: string): Promise<ChangePasswordResult> => {
    const res = await authService.changePassword(current, newPass);
    if (res.success) {
      setUser(authService.getCurrentUser());
    }
    return res;
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const updated = authService.updatePreferences(updates);
    setPreferences(updated);
  };

  const terminateOtherSessions = () => {
    authService.terminateOtherSessions();
    setSessions(authService.getSessions());
  };

  const requestPasswordReset = async (_identifier: string): Promise<string> => {
    return 'Password recovery will be available when the production authentication service is connected.';
  };

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    isAuthenticated: user !== null,
    isLoading,
    mustChangePassword: Boolean(user?.mustChangePassword),
    preferences,
    sessions,
    isDemoAuth: authService.isDemoMode(),
    login,
    logout,
    changePassword,
    updatePreferences,
    terminateOtherSessions,
    requestPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
