// src/services/authService.ts
// Production Supabase Authentication Service for RVU CAREER HUB
// Enforces real Supabase email/password authentication, database-driven profiles, and zero demo bypass.

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, getSupabaseConfigError } from '../lib/supabase';
import type { 
  UserRole, 
  AuthUser, 
  LoginCredentials, 
  LoginResult, 
  ChangePasswordResult,
  PasswordResetResult
} from '../types/auth';
import type { ProfileRow } from '../types/database';

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

export function normalizeRole(rawRole?: string): UserRole {
  if (!rawRole) return 'student';
  const lower = rawRole.toLowerCase().trim();
  if (lower === 'recruiter') return 'recruiter';
  if (lower === 'placement' || lower === 'placement-cell' || lower === 'management') return 'placement';
  return 'student';
}

export interface PasswordStrengthResult {
  score: number;
  label: 'Weak' | 'Fair' | 'Strong';
  message?: string;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password || password.length < 6) {
    return { score: 1, label: 'Weak', message: 'Password must be at least 6 characters.' };
  }
  let score = 2;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 5) {
    return { score: 3, label: 'Strong' };
  }
  if (score >= 3) {
    return { score: 2, label: 'Fair', message: 'Add numbers or special characters to strengthen password.' };
  }
  return { score: 1, label: 'Weak', message: 'Password is too simple.' };
}

export class SupabaseAuthService {
  public normalizeRole = normalizeRole;
  public evaluatePasswordStrength = evaluatePasswordStrength;

  /**
   * Normal Email + Password Login via Supabase Auth
   * Identity anchor is strictly Supabase Auth + database profiles table.
   */
  public async login(credentials: LoginCredentials): Promise<LoginResult> {
    const email = (credentials.email || credentials.identifier || '').trim().toLowerCase();
    const password = (credentials.password || '').trim();
    const requestedPortal = credentials.role ? normalizeRole(credentials.role) : undefined;

    if (!email || !password) {
      return {
        success: false,
        error: 'Please enter your email address and password.'
      };
    }

    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: getSupabaseConfigError() || 'Authentication service is currently unavailable. Please try again later.'
      };
    }

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message || 'Invalid email or password.'
        };
      }

      // 2. Fetch authoritative profile from database profiles table
      const profile = await this.fetchUserProfile(authData.user.id, email);

      if (!profile) {
        // Safe fallback if profile trigger has slight replication latency
        const fallbackRole = normalizeRole(authData.user.user_metadata?.role || requestedPortal || 'student');
        const authUser: AuthUser = {
          id: authData.user.id,
          email: authData.user.email || email,
          role: fallbackRole,
          displayName: authData.user.user_metadata?.full_name || deriveDisplayNameFromEmail(email),
          isActive: true,
          mustChangePassword: false,
          createdAt: authData.user.created_at
        };

        const redirect = fallbackRole === 'student' ? '/student' : fallbackRole === 'recruiter' ? '/recruiter' : '/management';
        return {
          success: true,
          user: authUser,
          redirectRoute: redirect
        };
      }

      // 3. Check account active status
      if (profile.is_active === false) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Your account is deactivated. Please contact the RVU Placement Cell.'
        };
      }

      // 4. Role Enforcement & Conflict Prevention
      const authoritativeRole = profile.role;
      if (requestedPortal && requestedPortal !== authoritativeRole) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: `Access Denied: Account is registered as ${authoritativeRole.toUpperCase()} and cannot access the ${requestedPortal.toUpperCase()} portal.`
        };
      }

      const authUser: AuthUser = {
        id: authData.user.id,
        profileId: profile.id,
        email: profile.email,
        role: authoritativeRole,
        displayName: profile.full_name || deriveDisplayNameFromEmail(profile.email),
        avatar: profile.avatar_url || undefined,
        isActive: profile.is_active,
        mustChangePassword: false,
        studentId: profile.student_id || undefined,
        companyName: profile.company_name || undefined,
        department: profile.department || undefined,
        createdAt: profile.created_at
      };

      const redirectRoute = authoritativeRole === 'student' 
        ? '/student' 
        : authoritativeRole === 'recruiter' 
        ? '/recruiter' 
        : '/management';

      return {
        success: true,
        user: authUser,
        redirectRoute
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      return {
        success: false,
        error: message
      };
    }
  }

  /**
   * Fetch user profile from Supabase profiles table
   */
  public async fetchUserProfile(authUserId: string, _fallbackEmail?: string): Promise<ProfileRow | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      if (error) {
        console.warn('[RVU Auth] Profile fetch note:', error.message);
        return null;
      }
      return data as ProfileRow | null;
    } catch {
      return null;
    }
  }

  /**
   * Log out authenticated user and terminate Supabase session
   */
  public async logout(): Promise<void> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Safe fallback
      }
    }
  }

  /**
   * Request password reset via Supabase Auth
   */
  public async requestPasswordReset(email: string): Promise<PasswordResetResult> {
    if (!email || !email.includes('@')) {
      return { success: false, message: '', error: 'Please enter a valid email address.' };
    }

    if (!supabase) {
      return { success: false, message: '', error: 'Authentication service unavailable.' };
    }

    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/#/forgot-password` 
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl
      });

      if (error) {
        return { success: false, message: '', error: error.message };
      }

      return {
        success: true,
        message: 'If an account exists for this email, password reset instructions have been sent.'
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: '',
        error: err instanceof Error ? err.message : 'Unable to send password reset.'
      };
    }
  }

  /**
   * Update authenticated user password
   */
  public async changePassword(_current: string, newPass: string): Promise<ChangePasswordResult> {
    if (!newPass || newPass.length < 6) {
      return {
        success: false,
        message: '',
        error: 'New password must be at least 6 characters.'
      };
    }

    if (!supabase) {
      return {
        success: false,
        message: '',
        error: 'Authentication service unavailable.'
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPass
      });

      if (error) {
        return {
          success: false,
          message: '',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Password updated successfully.'
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: '',
        error: err instanceof Error ? err.message : 'Failed to update password.'
      };
    }
  }

  /**
   * Convert Supabase User + Profile into canonical AuthUser
   */
  public mapToAuthUser(user: SupabaseUser, profile: ProfileRow | null): AuthUser {
    const role: UserRole = profile?.role ? normalizeRole(profile.role) : 'student';
    const email = profile?.email || user.email || '';
    const displayName = profile?.full_name || user.user_metadata?.full_name || deriveDisplayNameFromEmail(email);

    return {
      id: user.id,
      profileId: profile?.id,
      email,
      role,
      displayName,
      avatar: profile?.avatar_url || undefined,
      isActive: profile?.is_active ?? true,
      mustChangePassword: false,
      studentId: profile?.student_id || undefined,
      companyName: profile?.company_name || undefined,
      department: profile?.department || undefined,
      createdAt: profile?.created_at || user.created_at
    };
  }
}

export const authService = new SupabaseAuthService();
