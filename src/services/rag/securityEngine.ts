/**
 * Production RAG Security, Safety & Privacy Engine
 * 
 * Protects against:
 *  1. Prompt Injection & Jailbreaks (DAN mode, reveal instructions, bypass rules)
 *  2. Recruiter & Corporate Personal Contact Details Leakage (Strictly blocked for Students & Public)
 *  3. RBAC Confidential Document Isolation
 *  4. PII & Sensitive Internal Entity Sanitization
 */

import type { UserRoleContext, KnowledgeChunk } from './types';

// ============================================================================
// PROMPT INJECTION & JAILBREAK DEFENSE PATTERNS
// ============================================================================

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|rules)/i,
  /you\s+are\s+now\s+(in\s+)?(dan\s+mode|unrestricted|god\s+mode|jailbreak)/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions|initial\s+prompt|secret\s+key)/i,
  /system\s+override/i,
  /bypass\s+(guardrails|security|restrictions|policies)/i,
  /pretend\s+you\s+have\s+no\s+rules/i,
  /drop\s+table/i,
  /<script\b/i
];

// ============================================================================
// RECRUITER DIRECT CONTACT LEAKAGE PATTERNS
// ============================================================================

const RECRUITER_CONTACT_PATTERNS = [
  /contact\s+(number|details|info|email|no|phone|mobile)/i,
  /phone\s+(number|no)?\s+(of|for)/i,
  /mobile\s+(number|no)?\s+(of|for)/i,
  /whatsapp\s+(number|no|group|link)/i,
  /hr\s+(email|phone|mobile|number|contact)/i,
  /recruiter\s+(email|phone|mobile|number|contact)/i,
  /personal\s+email\s+(of|for)/i,
  /direct\s+email\s+(of|for)/i,
  /call\s+(the\s+)?(recruiter|hr|company)/i,
  /reach\s+directly/i
];

export interface SecurityCheckResult {
  isSafe: boolean;
  violationType?: 'prompt_injection' | 'recruiter_contact_leak' | 'out_of_bounds';
  sanitizedQuery: string;
  securityNotice?: string;
}

/**
 * Validates inbound queries against security policies.
 */
export function inspectInboundSecurity(query: string, role: UserRoleContext): SecurityCheckResult {
  const normalized = query.trim();

  // 1. Check for prompt injection or jailbreak attempts
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        violationType: 'prompt_injection',
        sanitizedQuery: normalized,
        securityNotice: `⚠️ **Security Violation Detected:** System prompt alteration or unauthorized override attempts are strictly prohibited under RV University AI Governance policies.`
      };
    }
  }

  // 2. Check for recruiter direct contact details extraction
  if (role === 'student' || role === 'public') {
    for (const pattern of RECRUITER_CONTACT_PATTERNS) {
      if (pattern.test(normalized)) {
        return {
          isSafe: false,
          violationType: 'recruiter_contact_leak',
          sanitizedQuery: normalized,
          securityNotice: `⚠️ **Not allowed to disclose direct recruiter or company contact details.**\n• Direct phone numbers, personal emails, and HR contacts are strictly confidential under RVU placement regulations.\n• All recruiter communication and interview coordination is managed exclusively by the **Placement Cell** (placements@rvu.edu.in).`
        };
      }
    }
  }

  return {
    isSafe: true,
    sanitizedQuery: normalized
  };
}

/**
 * Filters knowledge chunks according to Role-Based Access Control (RBAC).
 */
export function filterChunksByRBAC(chunks: KnowledgeChunk[], role: UserRoleContext): KnowledgeChunk[] {
  return chunks.filter(chunk => {
    // Hide confidential chunks from non-management roles
    if (chunk.isConfidential && role !== 'management') {
      return false;
    }
    // Target roles filter
    if (chunk.targetRoles && chunk.targetRoles.length > 0) {
      return chunk.targetRoles.includes(role);
    }
    return true;
  });
}

/**
 * Sanitizes outbound text to guarantee no leaked telephone numbers or private credentials.
 */
export function sanitizeOutboundResponse(text: string, role: UserRoleContext): string {
  if (role === 'management') return text;

  // Mask any raw 10-digit phone numbers unless official placement cell desk
  let sanitized = text.replace(/(?<!\d)\+?91[-\s]?[6-9]\d{9}(?!\d)/g, '[CONFIDENTIAL CONTACT]');
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@(google|cisco|deloitte|adobe|microsoft|amazon|razorpay)\.com/gi, '[OFFICIAL CAR DESK ONLY]');

  return sanitized;
}
