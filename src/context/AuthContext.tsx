import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Session as SupabaseSession } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { 
  UserRole,
  AuthUser, 
  LoginCredentials, 
  LoginResult,
  ChangePasswordResult,
  PasswordResetResult,
  RegisterData,
  RegistrationResult,
  RecruiterAccessRequestData,
  AccessRequestResult,
  UserPreferences,
  SessionInfo
} from '../types/auth';
import type { ProfileRow } from '../types/database';
import { authService } from '../services/authService';

export interface AuthContextType {
  user: AuthUser | null;
  session: SupabaseSession | null;
  profile: ProfileRow | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifyingAuth: boolean;
  mustChangePassword: boolean;
  preferences: UserPreferences;
  sessions: SessionInfo[];
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  signIn: (credentials: LoginCredentials) => Promise<LoginResult>;
  register: (data: RegisterData) => Promise<RegistrationResult>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  changePassword: (current: string, newPass: string) => Promise<ChangePasswordResult>;
  resetPassword: (newPass: string) => Promise<ChangePasswordResult>;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  terminateOtherSessions: () => void;
  requestPasswordReset: (email: string) => Promise<PasswordResetResult>;
  submitAccessRequest: (data: RecruiterAccessRequestData) => Promise<AccessRequestResult>;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  reducedMotion: false,
  density: 'comfortable',
  notifications: {
    applicationUpdates: true,
    interviewUpdates: true,
    placementDrives: true,
    deadlines: true,
    offers: true,
    careerOpportunities: true,
    preparationReminders: true,
    systemNotifications: true,
    channels: { inApp: true, email: true, push: false }
  },
  careerPreferences: {
    preferredJobRoles: ['Software Engineer', 'AI/ML Engineer'],
    preferredDomains: ['AI', 'Cloud', 'FinTech'],
    preferredLocations: ['Bengaluru', 'Hyderabad'],
    workModes: ['On-site', 'Hybrid'],
    internshipPreference: true,
    fullTimePreference: true,
    careerInterests: ['Distributed Systems', 'Applied AI']
  },
  privacySettings: {
    profileVisibility: 'verified-recruiters',
    recruiterVisibility: true,
    showSkillsToRecruiters: true,
    showResumeToRecruiters: true,
    careerProfileVisibility: true
  },
  connectedServices: {
    googleWorkspace: false,
    linkedIn: false,
    gitHub: false,
    portfolio: false
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState<boolean>(true);

  // Load profile from Supabase and synchronize AuthUser state
  const syncProfile = useCallback(async (currentSession: SupabaseSession | null) => {
    if (!currentSession || !currentSession.user) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return;
    }

    try {
      const userProfile = await authService.fetchUserProfile(
        currentSession.user.id, 
        currentSession.user.email
      );

      setProfile(userProfile);
      setSession(currentSession);

      const mappedUser = authService.mapToAuthUser(currentSession.user, userProfile);
      setUser(mappedUser);

      // Populate basic session device telemetry
      setSessions([
        {
          id: 'sess-active',
          device: typeof navigator !== 'undefined' ? navigator.platform || 'Workstation' : 'Station',
          browser: 'Active Session',
          location: 'RV University Campus',
          ipMasked: '106.51.***.***',
          current: true,
          lastActive: 'Active Now'
        }
      ]);
    } catch (err) {
      console.error('[RVU Auth] Profile synchronization error:', err);
    }
  }, []);

  // Initial Supabase Session restoration and Auth State Listener
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setIsVerifyingAuth(true);

      if (!supabase) {
        if (isMounted) setIsVerifyingAuth(false);
        return;
      }

      try {
        // 1. Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[RVU Auth] Session check note:', error.message);
        }

        if (initialSession && isMounted) {
          await syncProfile(initialSession);
        }
      } catch (err) {
        console.error('[RVU Auth] Session check failure:', err);
      } finally {
        if (isMounted) {
          setIsVerifyingAuth(false);
        }
      }
    };

    initializeAuth();

    // 2. Subscribe to auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, changedSession) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await syncProfile(changedSession);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setProfile(null);
          setSessions([]);
        }
        setIsVerifyingAuth(false);
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [syncProfile]);

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      if (result.success && result.user) {
        setUser(result.user);
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
      setSession(null);
      setProfile(null);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<RegistrationResult> => {
    setIsLoading(true);
    try {
      return await authService.register(data);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (newPass: string): Promise<ChangePasswordResult> => {
    setIsLoading(true);
    try {
      return await authService.resetPassword(newPass);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAccessRequest = async (data: RecruiterAccessRequestData): Promise<AccessRequestResult> => {
    setIsLoading(true);
    try {
      return await authService.submitRecruiterAccessRequest(data);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (session) {
      await syncProfile(session);
    }
  };

  const changePassword = async (current: string, newPass: string): Promise<ChangePasswordResult> => {
    return authService.changePassword(current, newPass);
  };

  const requestPasswordReset = async (email: string): Promise<PasswordResetResult> => {
    return authService.requestPasswordReset(email);
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const terminateOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
  };

  const role: UserRole | null = user?.role || null;
  const isAuthenticated = Boolean(user && session);

  const value: AuthContextType = {
    user,
    session,
    profile,
    role,
    isAuthenticated,
    isLoading,
    isVerifyingAuth,
    mustChangePassword: user?.mustChangePassword || false,
    preferences,
    sessions,
    login,
    signIn: login, // Phase 4 alias
    register,
    logout,
    signOut: logout, // Phase 4 alias
    refreshProfile,
    changePassword,
    resetPassword,
    updatePreferences,
    terminateOtherSessions,
    requestPasswordReset,
    submitAccessRequest
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
