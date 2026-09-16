// src/lib/env.ts
// Centralized safe environment variable configuration and diagnostic for Vite

export const env = {
  supabaseUrl: (import.meta.env?.VITE_SUPABASE_URL ?? '').trim(),
  supabaseAnonKey: (import.meta.env?.VITE_SUPABASE_ANON_KEY ?? '').trim(),
  authMode: (import.meta.env?.VITE_AUTH_MODE ?? 'development').trim(),
  allowAnyEmail: (import.meta.env?.VITE_ALLOW_ANY_EMAIL ?? 'true').trim() !== 'false',
  institutionalDomain: (import.meta.env?.VITE_AUTH_INSTITUTIONAL_EMAIL_DOMAIN ?? 'rvu.edu.in').trim(),
};

export const hasSupabaseConfig =
  Boolean(env.supabaseUrl) &&
  Boolean(env.supabaseAnonKey) &&
  env.supabaseUrl !== 'https://your-project.supabase.co' &&
  env.supabaseAnonKey !== 'your-anon-public-key' &&
  env.supabaseUrl.startsWith('https://') &&
  env.supabaseAnonKey.length > 20;

export const isSupabaseUrlValid = (url: string = env.supabaseUrl): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.length > 3 && (parsed.hostname.endsWith('.supabase.co') || parsed.hostname.includes('.'));
  } catch {
    return false;
  }
};

export const getSupabaseUrlHostname = (): string | null => {
  if (!env.supabaseUrl) return null;
  try {
    const parsed = new URL(env.supabaseUrl);
    return parsed.hostname;
  } catch {
    return null;
  }
};
