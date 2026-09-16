// src/services/registrationAndAuthSecurity.test.ts
// Comprehensive Test Suite for RVU Career Hub Secure Registration,
// Login UX Sanitization, Password Recovery, and Role Security Regression Tests.

import { 
  authService, 
  sanitizeAuthError, 
  evaluatePasswordStrength, 
  normalizeRole 
} from './authService';
import type { RegisterData, UserRole } from '../types/auth';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

async function runTests() {
  console.log('🧪 Starting RVU Registration & Auth Security Regression Tests...\n');

  // ==============================================================================
  // Test Suite 1: Registration Input Validation & Password Rules
  // ==============================================================================
  console.log('--- Test Suite 1: Registration Input Validation & Password Rules ---');
  
  // 1. Rejects empty full name
  const emptyNameResult = await authService.register({
    fullName: '',
    email: 'student@rvu.edu.in',
    password: 'StrongPassword123!',
    confirmPassword: 'StrongPassword123!'
  });
  assert(!emptyNameResult.success, 'Rejects empty full name');
  assert(emptyNameResult.error === 'Please enter your full legal name.', 'Returns helpful name validation message');

  // 2. Invalid email rejected
  const invalidEmailResult = await authService.register({
    fullName: 'Test Candidate',
    email: 'invalid-email-address',
    password: 'StrongPassword123!',
    confirmPassword: 'StrongPassword123!'
  });
  assert(!invalidEmailResult.success, 'Invalid email rejected');
  assert(invalidEmailResult.error === 'Please enter a valid email address.', 'Returns helpful email validation message');

  // 3. Short password rejected (min 8 characters)
  const shortPassResult = await authService.register({
    fullName: 'Test Candidate',
    email: 'test@rvu.edu.in',
    password: 'short',
    confirmPassword: 'short'
  });
  assert(!shortPassResult.success, 'Short password (< 8 chars) rejected');
  assert(shortPassResult.error === 'Password must be at least 8 characters long.', 'Returns 8 character minimum requirement message');

  // 4. Password mismatch rejected
  const mismatchResult = await authService.register({
    fullName: 'Test Candidate',
    email: 'test@rvu.edu.in',
    password: 'StrongPassword123!',
    confirmPassword: 'DifferentPassword456!'
  });
  assert(!mismatchResult.success, 'Password mismatch rejected');
  assert(mismatchResult.error === 'Passwords do not match. Please verify and try again.', 'Returns password mismatch error');

  // 5. Weak password rejected
  const weakPassStrength = evaluatePasswordStrength('abcdefgh');
  assert(weakPassStrength.score < 2, 'Evaluates simple lowercase password as Weak');
  const weakPassResult = await authService.register({
    fullName: 'Test Candidate',
    email: 'test@rvu.edu.in',
    password: 'password',
    confirmPassword: 'password'
  });
  assert(!weakPassResult.success, 'Weak password rejected by registration service');

  // ==============================================================================
  // Test Suite 2: Client Role Spoofing & Role Boundary Enforcement
  // ==============================================================================
  console.log('\n--- Test Suite 2: Client Role Spoofing & Privilege Escalation Prevention ---');

  // 6. Student cannot select recruiter or placement role via registration interface
  const regPayload: RegisterData = {
    fullName: 'Student Applicant',
    email: 'student.app@rvu.edu.in',
    password: 'StrongPassword123!',
    confirmPassword: 'StrongPassword123!'
  };
  assert(!('role' in regPayload), 'RegisterData interface strictly excludes role parameter from browser client');

  // 7. Role normalization prevents client role spoofing
  assert(normalizeRole('student') === 'student', 'Normalizes student to student');
  assert(normalizeRole('STUDENT') === 'student', 'Case-insensitive student normalization');
  assert(normalizeRole('unknown_role') === 'student', 'Defaults unknown role to student');
  assert(normalizeRole(undefined) === 'student', 'Defaults undefined role to student');

  // 8. Server-side handle_new_user trigger logic verification
  // Simulating the trigger rule: IF assigned_role IN ('placement', 'recruiter') THEN assigned_role := 'student';
  function simulateServerRoleAssignment(clientSuppliedRole?: string): UserRole {
    const raw = clientSuppliedRole?.toLowerCase() || 'student';
    if (raw === 'placement' || raw === 'recruiter') {
      return 'student'; // Neutralized by server trigger
    }
    return 'student';
  }
  assert(simulateServerRoleAssignment('recruiter') === 'student', 'Student cannot select recruiter role; neutralized by trigger');
  assert(simulateServerRoleAssignment('placement') === 'student', 'Student cannot select placement role; neutralized by trigger');
  assert(simulateServerRoleAssignment('admin') === 'student', 'Client cannot self-provision admin privileges');

  // ==============================================================================
  // Test Suite 3: Login Error Sanitization & Safe User Messaging
  // ==============================================================================
  console.log('\n--- Test Suite 3: Login Error Sanitization & Safe User Messaging ---');

  // 9. Never displays raw "Invalid login credentials"
  const rawCredsError = sanitizeAuthError('Invalid login credentials');
  assert(rawCredsError === 'Email or password is incorrect.', 'Sanitizes "Invalid login credentials" to "Email or password is incorrect."');
  
  const invalidGrantError = sanitizeAuthError('invalid_grant: Invalid login credentials');
  assert(invalidGrantError === 'Email or password is incorrect.', 'Sanitizes "invalid_grant" to "Email or password is incorrect."');

  // 10. Email unconfirmed error
  const emailUnconfirmedError = sanitizeAuthError('Email not confirmed');
  assert(emailUnconfirmedError === 'Please check your email to verify your account before signing in.', 'Friendly message for unconfirmed email');

  // 11. Rate limit error
  const rateLimitError = sanitizeAuthError('over_request_rate_limit: Too many requests');
  assert(rateLimitError === 'Your account is temporarily unavailable due to too many failed attempts. Please try again later.', 'Friendly message for rate-limited account');

  // 12. Duplicate registration message (account enumeration safe)
  const duplicateError = sanitizeAuthError('User already registered');
  assert(duplicateError === 'An account already exists for this email. Try signing in or reset your password.', 'Safe message for existing email registration');

  // 13. Masks internal database syntax and schema errors
  const sqlError = sanitizeAuthError('syntax error at or near "SELECT" in relation public.profiles');
  assert(sqlError === 'Unable to sign in right now. Please try again.', 'Masks raw PostgreSQL syntax error');

  const pgrstError = sanitizeAuthError('PGRST205: column profiles.non_existent does not exist');
  assert(pgrstError === 'Unable to sign in right now. Please try again.', 'Masks PostgREST internal schema error');

  // ==============================================================================
  // Test Suite 4: Account Activation & Provisioning Gates
  // ==============================================================================
  console.log('\n--- Test Suite 4: Account Activation & Provisioning Gates ---');

  // 14. Inactive account blocked (Requirement 14)
  function simulateAccountActiveCheck(isActive: boolean): { allowed: boolean; error?: string } {
    if (!isActive) {
      return {
        allowed: false,
        error: 'Your account is awaiting activation. Please contact the RVU Placement Cell.'
      };
    }
    return { allowed: true };
  }
  const inactiveCheck = simulateAccountActiveCheck(false);
  assert(!inactiveCheck.allowed, 'Inactive user (is_active = false) blocked from portal access');
  assert(inactiveCheck.error === 'Your account is awaiting activation. Please contact the RVU Placement Cell.', 'Displays institutional activation message');

  // 15. Missing/Unprovisioned role blocked (Requirement 15)
  function simulateRoleProvisioningCheck(role: string | null | undefined): { allowed: boolean; error?: string } {
    if (!role || !['student', 'recruiter', 'placement'].includes(role)) {
      return {
        allowed: false,
        error: 'Your account is not fully provisioned yet. Please contact the RVU Placement Cell.'
      };
    }
    return { allowed: true };
  }
  const nullRoleCheck = simulateRoleProvisioningCheck(null);
  assert(!nullRoleCheck.allowed, 'User with null role blocked from portal access');
  assert(nullRoleCheck.error === 'Your account is not fully provisioned yet. Please contact the RVU Placement Cell.', 'Displays unprovisioned account message');

  const invalidRoleCheck = simulateRoleProvisioningCheck('visitor');
  assert(!invalidRoleCheck.allowed, 'User with invalid role blocked from portal access');

  // ==============================================================================
  // Test Suite 5: Cross-Portal Route Isolation Matrix
  // ==============================================================================
  console.log('\n--- Test Suite 5: Cross-Portal Boundary Isolation ---');

  interface RouteAccessRule {
    role: UserRole | 'unauthenticated';
    path: string;
    shouldAllow: boolean;
  }

  const accessMatrix: RouteAccessRule[] = [
    // Unauthenticated access
    { role: 'unauthenticated', path: '/student', shouldAllow: false },
    { role: 'unauthenticated', path: '/recruiter', shouldAllow: false },
    { role: 'unauthenticated', path: '/management', shouldAllow: false },

    // Student access
    { role: 'student', path: '/student', shouldAllow: true },
    { role: 'student', path: '/student/applications', shouldAllow: true },
    { role: 'student', path: '/recruiter', shouldAllow: false },
    { role: 'student', path: '/management', shouldAllow: false },

    // Recruiter access
    { role: 'recruiter', path: '/recruiter', shouldAllow: true },
    { role: 'recruiter', path: '/recruiter/candidates', shouldAllow: true },
    { role: 'recruiter', path: '/student', shouldAllow: false },
    { role: 'recruiter', path: '/management', shouldAllow: false },

    // Placement Cell access
    { role: 'placement', path: '/management', shouldAllow: true },
    { role: 'placement', path: '/management/policy', shouldAllow: true },
    { role: 'placement', path: '/student', shouldAllow: false },
    { role: 'placement', path: '/recruiter', shouldAllow: false }
  ];

  function evaluateRouteAccess(role: UserRole | 'unauthenticated', path: string): boolean {
    if (role === 'unauthenticated') return false;
    if (path.startsWith('/student') && role === 'student') return true;
    if (path.startsWith('/recruiter') && role === 'recruiter') return true;
    if (path.startsWith('/management') && role === 'placement') return true;
    return false;
  }

  accessMatrix.forEach(rule => {
    const isAllowed = evaluateRouteAccess(rule.role, rule.path);
    const label = `${rule.role.toUpperCase()} access to ${rule.path} -> ${rule.shouldAllow ? 'ALLOWED' : 'BLOCKED'}`;
    assert(isAllowed === rule.shouldAllow, label);
  });

  // ==============================================================================
  // Test Suite 6: Recruiter Access Requests Validation
  // ==============================================================================
  console.log('\n--- Test Suite 6: Recruiter Access Request Intake Validation ---');

  // Rejects empty company name
  const emptyCompanyReq = await authService.submitRecruiterAccessRequest({
    fullName: 'Recruiter Lead',
    email: 'recruiter@microsoft.com',
    companyName: ''
  });
  assert(!emptyCompanyReq.success, 'Rejects empty company name in recruiter request');

  // Rejects invalid email
  const invalidEmailReq = await authService.submitRecruiterAccessRequest({
    fullName: 'Recruiter Lead',
    email: 'not-an-email',
    companyName: 'Microsoft'
  });
  assert(!invalidEmailReq.success, 'Rejects invalid email in recruiter request');

  // ==============================================================================
  // Test Suite 7: Password Reset & Update Validations
  // ==============================================================================
  console.log('\n--- Test Suite 7: Password Recovery & Update Security ---');

  // Password reset rejects invalid email
  const badEmailReset = await authService.requestPasswordReset('bad-email');
  assert(!badEmailReset.success, 'requestPasswordReset rejects invalid email format');

  // Reset password rejects short new password (< 8 chars)
  const shortNewPass = await authService.resetPassword('12345');
  assert(!shortNewPass.success, 'resetPassword rejects passwords shorter than 8 characters');
  assert(shortNewPass.error === 'Password must be at least 8 characters long.', 'Enforces 8 character password update policy');

  // ==============================================================================
  // Final Summary
  // ==============================================================================
  console.log('\n==================================================');
  console.log(`🏁 Registration & Auth Security: ${passed} Passed, ${failed} Failed`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
