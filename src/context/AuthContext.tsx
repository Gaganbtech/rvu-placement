import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
import { authService, normalizeRole } from '../services/authService';

export interface AuthContextType {
  user: AuthUser | null;
  session: SupabaseSession | null;
  profile: ProfileRow | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifyingAuth: boolean;
  isInitialized: boolean;
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

// Safe development diagnostics logger (never exposes secrets, passwords, or tokens)
const safeAuthLog = (event: string, meta?: Record<string, unknown>) => {
  try {
    const isDebug = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AUTH_DEBUG === 'true';
    if (isDebug) {
      console.log(`[AUTH DEBUG] ${event}:`, {
        timestamp: new Date().toISOString(),
        pathname: typeof window !== 'undefined' ? window.location.pathname : 'server',
        ...meta
      });
    }
  } catch {
    // Safe ignore
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);

  // Ref tracking current active user ID and profile presence to avoid race conditions
  const activeUserIdRef = useRef<string | null>(null);
  const hasProfileRef = useRef<boolean>(false);

  // Synchronize user profile from Supabase profiles table
  const syncProfile = useCallback(async (currentSession: SupabaseSession | null): Promise<AuthUser | null> => {
    if (!currentSession || !currentSession.user) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      activeUserIdRef.current = null;
      hasProfileRef.current = false;
      return null;
    }

    try {
      const userProfile = await authService.fetchUserProfile(
        currentSession.user.id, 
        currentSession.user.email
      );

      const mappedRole: UserRole = userProfile?.role ? normalizeRole(userProfile.role) : 'student';
      const mappedUser = authService.mapToAuthUser(currentSession.user, userProfile);

      setSession(currentSession);
      setProfile(userProfile);
      setRole(mappedRole);
      setUser(mappedUser);
      activeUserIdRef.current = currentSession.user.id;
      hasProfileRef.current = Boolean(mappedUser);

      safeAuthLog('Profile Synchronized', {
        userId: currentSession.user.id ? 'present' : 'none',
        hasProfile: Boolean(userProfile),
        role: mappedRole,
        isActive: userProfile?.is_active ?? true
      });

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

      return mappedUser;
    } catch (err) {
      console.error('[RVU Auth] Profile synchronization error:', err);
      return null;
    }
  }, []);

  // Initial Supabase session restoration and auth state listener
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setIsLoading(true);

      if (!supabase) {
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
        return;
      }

      try {
        safeAuthLog('Initial Session Check Starting');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('[RVU Auth] Initial session check notice:', error.message);
        }

        if (initialSession && isMounted) {
          await syncProfile(initialSession);
        } else if (isMounted) {
          setUser(null);
          setSession(null);
          setProfile(null);
          setRole(null);
          activeUserIdRef.current = null;
          hasProfileRef.current = false;
        }
      } catch (err) {
        console.error('[RVU Auth] Session hydration failure:', err);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
          safeAuthLog('Initialization Complete', {
            hasSession: Boolean(activeUserIdRef.current)
          });
        }
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, changedSession) => {
        if (!isMounted) return;

        safeAuthLog('Auth State Change Event', {
          event,
          hasSession: Boolean(changedSession),
          changedUserId: changedSession?.user?.id ? 'present' : 'none'
        });

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setProfile(null);
          setRole(null);
          setSessions([]);
          activeUserIdRef.current = null;
          hasProfileRef.current = false;
          setIsLoading(false);
          setIsInitialized(true);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          // If session and user are already hydrated for the same user, just update session
          if (changedSession && activeUserIdRef.current === changedSession.user.id && hasProfileRef.current) {
            setSession(changedSession);
            setIsLoading(false);
            setIsInitialized(true);
          } else if (changedSession) {
            await syncProfile(changedSession);
            setIsLoading(false);
            setIsInitialized(true);
          }
        }
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
    safeAuthLog('Login Initiated');
    try {
      const result = await authService.login(credentials);
      if (result.success && result.user) {
        // Synchronously and atomically hydrate all auth state
        setSession(result.session || null);
        setProfile(result.profile || null);
        setUser(result.user);
        setRole(result.user.role);
        activeUserIdRef.current = result.user.id;
        hasProfileRef.current = true;
        setIsInitialized(true);

        safeAuthLog('Login Hydrated State Atomically', {
          userId: 'present',
          role: result.user.role,
          redirectRoute: result.redirectRoute
        });
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    safeAuthLog('Logout Initiated');
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setSessions([]);
      activeUserIdRef.current = null;
      setIsLoading(false);
      setIsInitialized(true);
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

  const currentRole: UserRole | null = role || user?.role || null;
  const isAuthenticated = Boolean(user && session);
  const isVerifyingAuth = !isInitialized || isLoading;

  const value: AuthContextType = {
    user,
    session,
    profile,
    role: currentRole,
    isAuthenticated,
    isLoading,
    isVerifyingAuth,
    isInitialized,
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

export default AuthProvider;
