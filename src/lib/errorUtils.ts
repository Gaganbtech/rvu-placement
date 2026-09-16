// src/lib/errorUtils.ts
// Production Error Sanitization & Security Masking for RVU Career Hub
// Prevents exposing database schema details, Postgres error codes, stack traces, or credentials to end users.

export function sanitizeErrorMessage(error: unknown, fallbackMessage: string = 'An unexpected error occurred. Please try again.'): string {
  if (!error) return fallbackMessage;

  const rawMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  if (!rawMessage) return fallbackMessage;

  // Sensitive patterns that must NEVER be shown to users
  const sensitivePatterns = [
    /PGRST\d+/i,
    /relation ".*" does not exist/i,
    /column ".*" does not exist/i,
    /violates foreign key constraint/i,
    /violates not-null constraint/i,
    /syntax error at or near/i,
    /permission denied for/i,
    /JWT/i,
    /bearer/i,
    /token/i,
    /secret/i,
    /password/i,
    /PostgresError/i,
    /stack trace/i,
    /schema cache/i,
  ];

  for (const pattern of sensitivePatterns) {
    if (pattern.test(rawMessage)) {
      // Log full diagnostic only to developer console in DEV mode
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.warn('[RVU Security Mask] Sanitized internal error:', rawMessage);
      }
      return fallbackMessage;
    }
  }

  // Safe user-friendly whitelist messages
  if (
    rawMessage.includes('Invalid login credentials') ||
    rawMessage.includes('Email not confirmed') ||
    rawMessage.includes('User not found') ||
    rawMessage.includes('Too many requests') ||
    rawMessage.includes('Password should be at least')
  ) {
    return rawMessage;
  }

  // If the message is short, clean, and contains no internal leaks, return it
  if (rawMessage.length < 120 && !rawMessage.includes('http') && !rawMessage.includes('{') && !rawMessage.includes('public.')) {
    return rawMessage;
  }

  return fallbackMessage;
}
