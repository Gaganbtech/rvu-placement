import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Safe environment variable reader across Vite and Node test runtimes
export const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta && import.meta.env && import.meta.env[key]) {
      return String(import.meta.env[key]).trim();
    }
  } catch {
    // Ignore
  }
  try {
    const proc = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process;
    if (proc && proc.env && proc.env[key]) {
      return String(proc.env[key]).trim();
    }
  } catch {
    // Ignore
  }
  return '';
};

export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');
export const AUTH_MODE = getEnvVar('VITE_AUTH_MODE') || 'development';
export const INSTITUTIONAL_DOMAIN = getEnvVar('VITE_AUTH_INSTITUTIONAL_EMAIL_DOMAIN') || 'rvu.edu.in';
export const ALLOW_ANY_EMAIL = getEnvVar('VITE_ALLOW_ANY_EMAIL') !== 'false'; // Default to true in development

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
    SUPABASE_ANON_KEY && 
    SUPABASE_URL !== 'https://your-project.supabase.co' && 
    SUPABASE_ANON_KEY !== 'your-anon-public-key' &&
    isSupabaseUrlValid(SUPABASE_URL) &&
    SUPABASE_ANON_KEY.length > 20
  );
};

export const getSupabaseConfigError = (): string | null => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return 'Supabase project credentials are not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the project root .env file and restart the development server.';
  }
  if (SUPABASE_URL === 'https://your-project.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-public-key') {
    return 'Supabase credentials are placeholder values. Please replace them with your actual Supabase project URL and anon public key in the project root .env file, then restart the development server.';
  }
  if (!isSupabaseUrlValid(SUPABASE_URL)) {
    return 'Supabase URL is invalid.';
  }
  return null;
};

export interface SupabaseDiagnostic {
  urlStatus: 'CONFIGURED' | 'MISSING';
  publicKeyStatus: 'CONFIGURED' | 'MISSING';
  authClientStatus: 'READY' | 'NOT READY';
  configError: string | null;
  authMode: string;
}

export const getSupabaseDiagnostic = (): SupabaseDiagnostic => {
  const urlStatus = (SUPABASE_URL && isSupabaseUrlValid(SUPABASE_URL) && SUPABASE_URL !== 'https://your-project.supabase.co')
    ? 'CONFIGURED'
    : 'MISSING';
  const publicKeyStatus = (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20 && SUPABASE_ANON_KEY !== 'your-anon-public-key')
    ? 'CONFIGURED'
    : 'MISSING';
  const authClientStatus = supabase !== null ? 'READY' : 'NOT READY';

  return {
    urlStatus,
    publicKeyStatus,
    authClientStatus,
    configError: getSupabaseConfigError(),
    authMode: AUTH_MODE
  };
};

// Centralized singleton Supabase client instance (or null if not configured)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null;

// Safe dev logging - NEVER logs secrets, keys, or tokens
if (typeof window !== 'undefined') {
  const diag = getSupabaseDiagnostic();
  // eslint-disable-next-line no-console
  console.info('[RVU Career Hub] Supabase Configuration:', {
    'Supabase URL': diag.urlStatus,
    'Supabase Public Key': diag.publicKeyStatus,
    'Auth Client': diag.authClientStatus
  });
}
