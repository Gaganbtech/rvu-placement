import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Safe environment variable reader across Vite and Node runtimes
export const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env && import.meta.env[key]) {
      return String(import.meta.env[key]).trim();
    }
  } catch {
    // Ignore
  }
  try {
    const proc = (globalThis as unknown as { process?: { env?: Record<string, string>; loadEnvFile?: () => void } }).process;
    if (proc) {
      if (!proc.env?.[key] && typeof proc.loadEnvFile === 'function') {
        try {
          proc.loadEnvFile();
        } catch {
          // Ignore
        }
      }
      if (proc.env && proc.env[key]) {
        return String(proc.env[key]).trim();
      }
    }
  } catch {
    // Ignore
  }
  return '';
};

export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
// Support both standard VITE_SUPABASE_PUBLISHABLE_KEY and legacy VITE_SUPABASE_ANON_KEY
export const SUPABASE_PUBLISHABLE_KEY = 
  getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') || 
  getEnvVar('VITE_SUPABASE_ANON_KEY');

export const INSTITUTIONAL_DOMAIN = getEnvVar('VITE_AUTH_INSTITUTIONAL_EMAIL_DOMAIN') || 'rvu.edu.in';

export const isSupabaseUrlValid = (url: string = SUPABASE_URL): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.length > 3 && (parsed.hostname.endsWith('.supabase.co') || parsed.hostname.includes('.'));
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_PUBLISHABLE_KEY && 
    SUPABASE_URL !== 'https://your-project.supabase.co' && 
    SUPABASE_PUBLISHABLE_KEY !== 'your-anon-public-key' &&
    isSupabaseUrlValid(SUPABASE_URL) &&
    SUPABASE_PUBLISHABLE_KEY.length > 20
  );
};

export const getSupabaseConfigError = (): string | null => {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return 'Supabase project credentials are not configured. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in the .env file.';
  }
  if (SUPABASE_URL === 'https://your-project.supabase.co' || SUPABASE_PUBLISHABLE_KEY === 'your-anon-public-key') {
    return 'Supabase credentials are placeholder values. Please update them with valid project credentials.';
  }
  if (!isSupabaseUrlValid(SUPABASE_URL)) {
    return 'Supabase URL is invalid. Must be a valid HTTPS URL.';
  }
  return null;
};

// Centralized browser Supabase client instance (or null if unconfigured)
// Strictly uses Publishable API key; NEVER uses secret or service-role keys
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured()
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null;

// Safe diagnostic indicator (NEVER logs keys or tokens)
export const getSupabaseDiagnostic = () => {
  return {
    isConfigured: isSupabaseConfigured(),
    urlValid: isSupabaseUrlValid(SUPABASE_URL),
    clientReady: supabase !== null,
    configError: getSupabaseConfigError()
  };
};
