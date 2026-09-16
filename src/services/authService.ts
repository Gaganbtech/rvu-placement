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
  PasswordResetResult,
  RegisterData,
  RegistrationResult,
  RecruiterAccessRequestData,
  AccessRequestResult
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
  if (!password || password.length < 8) {
    return { score: 1, label: 'Weak', message: 'Password must be at least 8 characters.' };
  }
  let score = 2;
  if (password.length >= 10) score++;
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

/**
 * Sanitize raw Supabase and Postgres error messages into safe user-facing notices.
 * Never expose internal SQL, column names, JWT claims, or technical trace details.
 */
export function sanitizeAuthError(error: unknown): string {
  if (!error) return 'Unable to sign in right now. Please try again.';
  const msg = typeof error === 'string' 
    ? error 
    : (error as any)?.message || String(error);
  const lower = msg.toLowerCase();

  if (
    lower.includes('invalid login credentials') ||
    lower.includes('invalid_credentials') ||
    lower.includes('invalid grant') ||
    lower.includes('invalid_grant') ||
    lower.includes('wrong password') ||
    lower.includes('user not found')
  ) {
    return 'Email or password is incorrect.';
  }

  if (
    lower.includes('email not confirmed') ||
    lower.includes('not confirmed') ||
    lower.includes('email_not_confirmed')
  ) {
    return 'Please check your email to verify your account before signing in.';
  }

  if (
    lower.includes('rate limit') ||
    lower.includes('too many requests') ||
    lower.includes('over_request_rate_limit')
  ) {
    return 'Your account is temporarily unavailable due to too many failed attempts. Please try again later.';
  }

  if (
    lower.includes('user already registered') ||
    lower.includes('already registered') ||
    lower.includes('already exists')
  ) {
    return 'An account already exists for this email. Try signing in or reset your password.';
  }

  if (lower.includes('password should be at least') || lower.includes('weak password')) {
    return 'Password must be at least 8 characters long.';
  }

  // Never expose raw Postgres, Supabase, JWT, schema, or column names
  if (
    lower.includes('postgres') ||
    lower.includes('pgrst') ||
    lower.includes('relation') ||
    lower.includes('column') ||
    lower.includes('violates') ||
    lower.includes('syntax')
  ) {
    return 'Unable to sign in right now. Please try again.';
  }

  return 'Unable to sign in right now. Please try again.';
}

export class SupabaseAuthService {
  public normalizeRole = normalizeRole;
  public evaluatePasswordStrength = evaluatePasswordStrength;
  public sanitizeAuthError = sanitizeAuthError;

  /**
   * Normal Email + Password Login via Supabase Auth
   * Identity anchor is strictly Supabase Auth + database profiles table.
   */
  public async login(credentials: LoginCredentials): Promise<LoginResult> {
    const email = (credentials.email || credentials.identifier || '').trim().toLowerCase();
    const password = (credentials.password || '').trim();

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
          error: sanitizeAuthError(authError)
        };
      }

      // 2. Fetch authoritative profile from database profiles table
      const profile = await this.fetchUserProfile(authData.user.id, email);

      if (!profile) {
        // Strict: Do not guess or default to student
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Your account is authenticated, but your RVU Career Hub profile is not configured.'
        };
      }

      // 3. Check account active status
      if (profile.is_active === false) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Your RVU Career Hub account is inactive.'
        };
      }

      // 4. Role validation
      if (!profile.role || !['student', 'recruiter', 'placement'].includes(profile.role)) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Your portal access has not been assigned yet. Please contact the Placement Cell.'
        };
      }

      // 5. Authoritative role from database is the ONLY source of authorization truth.
      // UI portal selector is strictly a UI hint; user is always navigated to their real database role.
      const authoritativeRole = profile.role;

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
        session: authData.session,
        profile,
        redirectRoute
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: sanitizeAuthError(err)
      };
    }
  }

  /**
   * Controlled Student Self-Registration via Supabase Auth
   * Browser submits only minimum registration information (full_name, email, password).
   * Server-side handle_new_user trigger strictly assigns role = 'student'.
   */
  public async register(data: RegisterData): Promise<RegistrationResult> {
    const fullName = (data.fullName || '').trim();
    const email = (data.email || '').trim().toLowerCase();
    const password = data.password || '';
    const confirmPassword = data.confirmPassword || '';

    if (!fullName || fullName.length < 2) {
      return { success: false, error: 'Please enter your full legal name.' };
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    if (confirmPassword && password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match. Please verify and try again.' };
    }

    const strength = evaluatePasswordStrength(password);
    if (strength.score < 2) {
      return { success: false, error: 'Password is too weak. Please use a combination of uppercase, numbers, or symbols.' };
    }

    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: getSupabaseConfigError() || 'Registration service is currently unavailable. Please try again later.'
      };
    }

    try {
      // CRITICAL SECURITY: Never pass role or is_active in client metadata!
      // Server-side handle_new_user trigger strictly derives role as 'student'
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (authError) {
        const errorMsg = sanitizeAuthError(authError);
        return {
          success: false,
          error: errorMsg
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Unable to create account. Please try again.'
        };
      }

      return {
        success: true,
        message: 'Account created. Please check your email to verify your account.',
        requiresEmailVerification: true
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: sanitizeAuthError(err)
      };
    }
  }

  /**
   * Submit controlled recruiter onboarding access request
   */
  public async submitRecruiterAccessRequest(data: RecruiterAccessRequestData): Promise<AccessRequestResult> {
    const fullName = (data.fullName || '').trim();
    const email = (data.email || '').trim().toLowerCase();
    const companyName = (data.companyName || '').trim();

    if (!fullName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Please enter a valid corporate email address.' };
    }
    if (!companyName) {
      return { success: false, error: 'Please enter your organization or company name.' };
    }

    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Service is currently unavailable. Please contact placement@rvu.edu.in.' };
    }

    try {
      const { error } = await supabase.from('access_requests').insert({
        email,
        full_name: fullName,
        company_name: companyName,
        designation: data.designation?.trim() || null,
        phone: data.phone?.trim() || null,
        requested_type: 'recruiter',
        status: 'pending',
        notes: data.message?.trim() || null
      });

      if (error) {
        console.error('[RVU Auth] Access request error:', error);
        return {
          success: false,
          error: 'Unable to submit request at this time. Please contact placement@rvu.edu.in directly.'
        };
      }

      return {
        success: true,
        message: 'Recruiter access request submitted successfully. The RVU Placement Cell will review your corporate credentials and contact you.'
      };
    } catch {
      return {
        success: false,
        error: 'Unable to submit request at this time. Please contact placement@rvu.edu.in directly.'
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
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      return { success: false, message: '', error: 'Please enter a valid email address.' };
    }

    if (!supabase) {
      return { success: false, message: '', error: 'Authentication service unavailable.' };
    }

    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/#/reset-password` 
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: redirectUrl
      });

      if (error) {
        // Safe message to prevent account enumeration
        return {
          success: true,
          message: 'If an account exists for this email, password reset instructions have been sent.'
        };
      }

      return {
        success: true,
        message: 'If an account exists for this email, password reset instructions have been sent.'
      };
    } catch {
      return {
        success: true,
        message: 'If an account exists for this email, password reset instructions have been sent.'
      };
    }
  }

  /**
   * Reset password for user following email reset token verification
   */
  public async resetPassword(newPass: string): Promise<ChangePasswordResult> {
    if (!newPass || newPass.length < 8) {
      return {
        success: false,
        message: '',
        error: 'Password must be at least 8 characters long.'
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
          error: sanitizeAuthError(error)
        };
      }

      return {
        success: true,
        message: 'Password updated successfully. Please sign in with your new password.'
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: '',
        error: sanitizeAuthError(err)
      };
    }
  }

  /**
   * Update authenticated user password
   */
  public async changePassword(_current: string, newPass: string): Promise<ChangePasswordResult> {
    if (!newPass || newPass.length < 8) {
      return {
        success: false,
        message: '',
        error: 'New password must be at least 8 characters long.'
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
          error: sanitizeAuthError(error)
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
        error: sanitizeAuthError(err)
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
