// src/services/authService.ts
// Centralized Authentication Service for RVU CAREER HUB
// Supports Normal User ID + Password Authentication with Local Demo Mode

import type { 
  AuthRole, 
  AuthUser, 
  LoginCredentials, 
  LoginResult,
  SafeAuthSession,
  ChangePasswordResult,
  UserPreferences,
  SessionInfo
} from '../types/auth';

// Session storage keys (NEVER store passwords or secrets)
export const INITIAL_DEFAULT_PASSWORD = 'welcome2placement';

export interface PasswordStrengthResult {
  score: number;
  label: 'Weak' | 'Fair' | 'Strong';
  message?: string;
}

const SAFE_SESSION_KEY = 'rvu_safe_auth_session';
const REMEMBERED_IDENTIFIER_KEY = 'rvu_remembered_identifier';
const AUTH_PREFS_KEY = 'rvu_user_preferences';

// Safe cross-environment storage helper (handles browser sessionStorage/localStorage and Node.js testing/SSR)
const memoryStorage: Record<string, string> = {};

function getSafeStorageItem(key: string): string | null {
  if (typeof window !== 'undefined') {
    try {
      return sessionStorage.getItem(key) || localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memoryStorage[key] || null;
}

function setSafeStorageItem(key: string, value: string, persist: boolean = false): void {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(key, value);
      if (persist) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    } catch {
      // Safe fallback
    }
  } else {
    memoryStorage[key] = value;
  }
}

function removeSafeStorageItem(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } catch {
      // Safe fallback
    }
  } else {
    delete memoryStorage[key];
  }
}

// Helper to derive a clean, friendly display name from an email address or user ID
export function deriveDisplayNameFromEmail(identifier: string): string {
  const [localPart] = (identifier || '').split('@');
  if (!localPart) return 'Institutional User';
  const cleaned = localPart.replace(/[0-9_.-]+/g, ' ').trim();
  if (!cleaned) return localPart.slice(0, 8);
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Helper to derive 2-letter initials for avatars
export function deriveInitialsFromEmail(identifier: string, displayName?: string): string {
  if (displayName && displayName.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  }
  const [localPart] = (identifier || '').split('@');
  return (localPart || 'RV').slice(0, 2).toUpperCase();
}

function getDefaultPreferences(): UserPreferences {
  return {
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
      channels: {
        inApp: true,
        email: true,
        push: false
      }
    },
    careerPreferences: {
      preferredJobRoles: ['Software Engineer', 'AI/ML Engineer', 'Full Stack Developer'],
      preferredDomains: ['Artificial Intelligence', 'Cloud Infrastructure', 'FinTech'],
      preferredLocations: ['Bengaluru', 'Hyderabad', 'Pune'],
      workModes: ['On-site', 'Hybrid'],
      internshipPreference: true,
      fullTimePreference: true,
      careerInterests: ['Distributed Systems', 'Generative AI', 'High-Performance Computing']
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
}

function getDefaultSessions(_role?: AuthRole): SessionInfo[] {
  return [
    {
      id: 'sess-active-local',
      device: 'MacBook Pro 16" (macOS 15)',
      browser: 'Chrome 128.0 (Active)',
      location: 'Bengaluru, Karnataka, IN',
      ipMasked: '106.51.***.***',
      current: true,
      lastActive: 'Active Now'
    },
    {
      id: 'sess-campus-wifi',
      device: 'RVU Campus Lab Station #04',
      browser: 'Safari 18.0',
      location: 'RVU Main Campus, Bengaluru',
      ipMasked: '14.139.***.***',
      current: false,
      lastActive: 'Yesterday at 04:30 PM'
    }
  ];
}

// Authentication Service Contract
export interface IAuthService {
  login(credentials: LoginCredentials): Promise<LoginResult>;
  logout(): Promise<void>;
  getCurrentUser(): AuthUser | null;
  isAuthenticated(): boolean;
  getStoredSession(): SafeAuthSession | null;
  changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResult>;
  evaluatePasswordStrength(password: string): PasswordStrengthResult;
  getPreferences(): UserPreferences;
  updatePreferences(updates: Partial<UserPreferences>): UserPreferences;
  getSessions(): SessionInfo[];
  terminateOtherSessions(): SessionInfo[];
  getRememberedIdentifier(): string | null;
  setRememberedIdentifier(identifier: string | null): void;
}

/**
 * DemoAuthService
 * Isolated development/testing authentication service.
 * Accepts any non-empty User ID and password when VITE_DEMO_AUTH=true.
 * Completely local, zero external network or Supabase dependencies.
 */
export class DemoAuthService implements IAuthService {
  private currentUser: AuthUser | null = null;
  private currentSession: SafeAuthSession | null = null;
  private preferences: UserPreferences = getDefaultPreferences();
  private activeSessions: SessionInfo[] = [];

  constructor() {
    this.restoreSessionFromStorage();
  }

  // Restore existing authenticated session from storage (survives page refresh)
  private restoreSessionFromStorage(): void {
    try {
      const storedJson = getSafeStorageItem(SAFE_SESSION_KEY);
      if (!storedJson) return;

      const session: SafeAuthSession = JSON.parse(storedJson);
      if (session && session.authenticated && session.identifier && session.role) {
        this.currentSession = session;
        this.currentUser = {
          id: session.userId || `usr-${session.identifier.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`,
          email: session.identifier.includes('@') ? session.identifier : `${session.identifier}@rvu.edu.in`,
          role: session.role,
          displayName: session.displayName || deriveDisplayNameFromEmail(session.identifier),
          isActive: true,
          mustChangePassword: false,
          lastLoginAt: session.createdAt,
          createdAt: session.createdAt,
          studentId: session.role === 'student' ? '2023BTECH001' : undefined,
          companyName: session.role === 'recruiter' ? 'RVU Corporate Hiring Partner' : undefined,
          department: session.role === 'placement-cell' ? 'Career Advisory & Placement' : undefined,
        };
        this.activeSessions = getDefaultSessions(session.role);
      }
    } catch {
      // Ignore corrupt local storage data
    }
  }

  public isDemoMode(): boolean {
    const envVal = import.meta.env?.VITE_DEMO_AUTH;
    return envVal === 'true' || envVal === true || envVal === undefined || import.meta.env?.DEV === true;
  }

  /**
   * Normal User ID + Password Login
   * Accepts identifier, password, and portal
   */
  public async login(credentials: LoginCredentials): Promise<LoginResult> {
    const rawIdentifier = credentials.identifier || credentials.email || '';
    const identifier = rawIdentifier.trim();
    const password = (credentials.password || '').trim();
    const portal = credentials.role || 'student';
    const rememberMe = Boolean(credentials.rememberMe || credentials.rememberDevice);

    // 1. Validate non-empty credentials
    if (!identifier || !password) {
      return {
        success: false,
        error: 'Please enter your user ID and password.'
      };
    }

    // 2. Validate portal
    const validPortals = ['student', 'recruiter', 'management', 'placement-cell'];
    if (!validPortals.includes(portal)) {
      return {
        success: false,
        error: 'Invalid user ID or password.'
      };
    }

    const normalizedRole: AuthRole = portal === 'management' ? 'placement-cell' : (portal as AuthRole);
    const redirectTarget = portal === 'student' ? '/student' : portal === 'recruiter' ? '/recruiter' : '/management';

    // 3. Demo Mode Validation
    if (this.isDemoMode()) {
      const authUser: AuthUser = {
        id: `usr-demo-${Date.now().toString(36)}`,
        email: identifier.includes('@') ? identifier.toLowerCase() : `${identifier.toLowerCase()}@rvu.edu.in`,
        role: normalizedRole,
        displayName: deriveDisplayNameFromEmail(identifier),
        isActive: true,
        mustChangePassword: false,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        studentId: normalizedRole === 'student' ? '2023BTECH001' : undefined,
        companyName: normalizedRole === 'recruiter' ? 'RVU Corporate Hiring Partner' : undefined,
        department: normalizedRole === 'placement-cell' ? 'Career Advisory & Placement' : undefined,
      };

      this.currentUser = authUser;
      this.activeSessions = getDefaultSessions(normalizedRole);

      // Safe session persistence (NO passwords, NO access tokens, NO secret keys)
      const safeSession: SafeAuthSession = {
        authenticated: true,
        identifier,
        portal,
        role: normalizedRole,
        displayName: authUser.displayName,
        userId: authUser.id,
        createdAt: new Date().toISOString()
      };

      this.currentSession = safeSession;
      setSafeStorageItem(SAFE_SESSION_KEY, JSON.stringify(safeSession), rememberMe);

      if (rememberMe) {
        setSafeStorageItem(REMEMBERED_IDENTIFIER_KEY, identifier, true);
      } else {
        removeSafeStorageItem(REMEMBERED_IDENTIFIER_KEY);
      }

      return {
        success: true,
        user: authUser,
        redirectRoute: redirectTarget
      };
    }

    // Production mode placeholder for real backend authentication API
    return {
      success: false,
      error: 'Invalid user ID or password.'
    };
  }

  /**
   * Logout
   * Clears session, temporary portal state, and returns user to login
   */
  public async logout(): Promise<void> {
    this.currentUser = null;
    this.currentSession = null;
    this.activeSessions = [];

    removeSafeStorageItem(SAFE_SESSION_KEY);
    removeSafeStorageItem('rvu_selected_portal');
    removeSafeStorageItem('rvu_intended_role');
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public getStoredSession(): SafeAuthSession | null {
    try {
      const storedJson = getSafeStorageItem(SAFE_SESSION_KEY);
      if (storedJson) return JSON.parse(storedJson);
    } catch {
      // Safe fallback
    }
    return this.currentSession;
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResult> {
    if (!currentPassword.trim() || !newPassword.trim()) {
      return {
        success: false,
        message: 'Please provide both your current and new password.',
        error: 'Please provide both your current and new password.'
      };
    }

    if (newPassword.trim().length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters.',
        error: 'New password must be at least 6 characters.'
      };
    }

    if (this.currentUser) {
      this.currentUser.mustChangePassword = false;
    }

    return {
      success: true,
      message: 'Password updated successfully.'
    };
  }

  public evaluatePasswordStrength(password: string): PasswordStrengthResult {
    if (!password || password.length < 6) {
      return {
        score: 0,
        label: 'Weak',
        message: 'Password must be at least 6 characters long.'
      };
    }

    let checks = 0;
    if (password.length >= 8) checks++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) checks++;
    if (/[0-9]/.test(password)) checks++;
    if (/[^A-Za-z0-9]/.test(password)) checks++;

    let score = 1;
    if (checks >= 3) score = 3;
    else if (checks >= 2) score = 2;

    const label: 'Weak' | 'Fair' | 'Strong' = 
      score === 3 ? 'Strong' :
      score === 2 ? 'Fair' : 'Weak';

    const message = 
      score === 3 
        ? 'Great! This is a strong and secure password.' 
        : score === 2 
        ? 'Decent password. Adding symbols or mixed case makes it stronger.' 
        : 'Weak password. Add uppercase letters, numbers, and symbols.';

    return {
      score,
      label,
      message
    };
  }

  public getPreferences(): UserPreferences {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(AUTH_PREFS_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // Safe fallback
      }
    }
    return this.preferences;
  }

  public updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    this.preferences = { ...this.preferences, ...updates };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTH_PREFS_KEY, JSON.stringify(this.preferences));
      } catch {
        // Safe fallback
      }
    }
    return this.preferences;
  }

  public getSessions(): SessionInfo[] {
    return this.activeSessions.length > 0 ? this.activeSessions : getDefaultSessions(this.currentUser?.role || 'student');
  }

  public terminateOtherSessions(): SessionInfo[] {
    this.activeSessions = this.activeSessions.filter(s => s.current);
    return this.activeSessions;
  }

  public getRememberedIdentifier(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REMEMBERED_IDENTIFIER_KEY);
  }

  public setRememberedIdentifier(identifier: string | null): void {
    if (typeof window === 'undefined') return;
    if (identifier) {
      localStorage.setItem(REMEMBERED_IDENTIFIER_KEY, identifier);
    } else {
      localStorage.removeItem(REMEMBERED_IDENTIFIER_KEY);
    }
  }
}

// Export singleton instance of DemoAuthService
export const authService = new DemoAuthService();
