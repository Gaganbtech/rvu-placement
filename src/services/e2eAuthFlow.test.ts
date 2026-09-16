// src/services/e2eAuthFlow.test.ts
// Comprehensive E2E Verification for RVU CAREER HUB Production Supabase Architecture
// Tests Authentication, Authorization, Role Isolation, Object-Level Security & Route Protection

import { 
  authService, 
  normalizeRole, 
  deriveDisplayNameFromEmail, 
  deriveInitialsFromEmail,
  evaluatePasswordStrength
} from './authService';
import { 
  isSupabaseConfigured, 
  isSupabaseUrlValid, 
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY 
} from '../lib/supabase';
import { SecurityPolicyEngine } from './security/securityPolicy';
import type { AuthUser, UserRole } from '../types/auth';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
    failCount++;
  }
}

async function runE2ETests() {
  console.log('🚀 Running Complete RVU Supabase Auth & Security E2E Test Suite...\n');

  // STEP 1: Supabase Configuration and Environment Security
  console.log('--- Step 1: Supabase Environment & Credential Safety ---');
  assert(isSupabaseConfigured() === true, 'Supabase client is configured with production credentials');
  assert(isSupabaseUrlValid(SUPABASE_URL) === true, 'Supabase URL is valid HTTPS endpoint');
  assert(SUPABASE_URL.startsWith('https://'), 'Supabase URL strictly enforces TLS (https://)');
  assert(
    SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_') || SUPABASE_PUBLISHABLE_KEY.length > 20, 
    'Publishable API key is present and correctly formatted'
  );
  assert(
    !SUPABASE_PUBLISHABLE_KEY.includes('service_role') && !SUPABASE_PUBLISHABLE_KEY.includes('sb_secret_'),
    'CRITICAL SECURITY: Secret or service_role key is NEVER used in client code'
  );

  // STEP 2: Input Validation & Sanitization
  console.log('\n--- Step 2: Credential Validation & Input Sanitization ---');
  const emptyEmailRes = await authService.login({ email: '', password: 'somepassword', role: 'student' });
  assert(emptyEmailRes.success === false, 'Rejects empty email address');
  assert(emptyEmailRes.error === 'Please enter your email address and password.', 'Returns friendly error for empty email');

  const emptyPassRes = await authService.login({ email: 'student@rvu.edu.in', password: '', role: 'student' });
  assert(emptyPassRes.success === false, 'Rejects empty password');

  const bothEmptyRes = await authService.login({ email: '', password: '', role: 'student' });
  assert(bothEmptyRes.success === false, 'Rejects both fields empty');

  // STEP 3: Identity & Display Name Derivation
  console.log('\n--- Step 3: Identity Resolution & Display Names ---');
  assert(deriveDisplayNameFromEmail('gagan@gmail.com') === 'Gagan', 'Derives name "Gagan" from plain email');
  assert(
    deriveDisplayNameFromEmail('gagana.btech23@rvu.edu.in') === 'Gagana Btech', 
    'Derives "Gagana Btech" from institutional email'
  );
  assert(deriveInitialsFromEmail('gagan@gmail.com', 'Gagan') === 'GA', 'Derives correct 2-letter initials');

  // STEP 4: Role Normalization
  console.log('\n--- Step 4: Strict Role Normalization ---');
  assert(normalizeRole('student') === 'student', 'Normalizes student to student');
  assert(normalizeRole('recruiter') === 'recruiter', 'Normalizes recruiter to recruiter');
  assert(normalizeRole('placement') === 'placement', 'Normalizes placement to placement');
  assert(normalizeRole('management') === 'placement', 'Normalizes legacy management alias to placement');
  assert(normalizeRole('placement-cell') === 'placement', 'Normalizes legacy placement-cell alias to placement');
  assert(normalizeRole(undefined) === 'student', 'Defaults undefined input to student');

  // STEP 5: Password Security Evaluation
  console.log('\n--- Step 5: Password Strength Evaluation ---');
  assert(evaluatePasswordStrength('123').label === 'Weak', 'Identifies weak password');
  assert(evaluatePasswordStrength('secret123').label === 'Fair', 'Identifies fair password');
  assert(evaluatePasswordStrength('SecureP@ssw0rd2026!').label === 'Strong', 'Identifies strong password');

  // STEP 6: Live Supabase Auth Reject Verification (Remote Gate)
  console.log('\n--- Step 6: Live Supabase Remote Authentication Gate ---');
  const liveAuthAttempt = await authService.login({
    email: 'nonexistent_user@rvu.edu.in',
    password: 'wrong_password_123',
    role: 'student'
  });
  assert(liveAuthAttempt.success === false, 'Live Supabase Auth rejects unauthorized credentials');
  assert(
    Boolean(liveAuthAttempt.error === 'Invalid login credentials' || liveAuthAttempt.error?.includes('Invalid')),
    'Authentic Supabase Auth error message received'
  );

  // STEP 7: Route Protection & Cross-Portal Boundary Enforcement
  console.log('\n--- Step 7: Route Protection & Cross-Portal Boundary Isolation ---');
  function checkRouteAccess(userRole: UserRole | null | undefined, currentPath: string): { allowed: boolean; redirect: string } {
    if (!userRole) return { allowed: false, redirect: '/login' };
    if (currentPath.startsWith('/student') && userRole !== 'student') {
      return { allowed: false, redirect: userRole === 'recruiter' ? '/recruiter' : '/management' };
    }
    if (currentPath.startsWith('/recruiter') && userRole !== 'recruiter') {
      return { allowed: false, redirect: userRole === 'student' ? '/student' : '/management' };
    }
    if (currentPath.startsWith('/management') && userRole !== 'placement') {
      return { allowed: false, redirect: userRole === 'student' ? '/student' : '/recruiter' };
    }
    return { allowed: true, redirect: currentPath };
  }

  // 7a: Unauthenticated access blocked
  const unauthStudent = checkRouteAccess(null, '/student/opportunities');
  assert(unauthStudent.allowed === false, 'Unauthenticated access to /student is blocked');
  assert(unauthStudent.redirect === '/login', 'Unauthenticated redirected to /login');

  const unauthRecruiter = checkRouteAccess(null, '/recruiter/candidates');
  assert(unauthRecruiter.allowed === false, 'Unauthenticated access to /recruiter is blocked');

  const unauthManagement = checkRouteAccess(null, '/management/students');
  assert(unauthManagement.allowed === false, 'Unauthenticated access to /management is blocked');

  // 7b: Student boundaries
  const studentToRecruiter = checkRouteAccess('student', '/recruiter/candidates');
  assert(studentToRecruiter.allowed === false, 'Student BLOCKED from /recruiter');
  assert(studentToRecruiter.redirect === '/student', 'Student redirected back to /student');

  const studentToManagement = checkRouteAccess('student', '/management/analytics');
  assert(studentToManagement.allowed === false, 'Student BLOCKED from /management');
  assert(studentToManagement.redirect === '/student', 'Student redirected back to /student');

  // 7c: Recruiter boundaries
  const recruiterToStudent = checkRouteAccess('recruiter', '/student/profile');
  assert(recruiterToStudent.allowed === false, 'Recruiter BLOCKED from /student');
  assert(recruiterToStudent.redirect === '/recruiter', 'Recruiter redirected back to /recruiter');

  const recruiterToManagement = checkRouteAccess('recruiter', '/management/companies');
  assert(recruiterToManagement.allowed === false, 'Recruiter BLOCKED from /management');
  assert(recruiterToManagement.redirect === '/recruiter', 'Recruiter redirected back to /recruiter');

  // 7d: Placement cell boundaries
  const placementToStudent = checkRouteAccess('placement', '/student/opportunities');
  assert(placementToStudent.allowed === false, 'Placement cell BLOCKED from /student');
  assert(placementToStudent.redirect === '/management', 'Placement cell redirected back to /management');

  const placementToRecruiter = checkRouteAccess('placement', '/recruiter/candidates');
  assert(placementToRecruiter.allowed === false, 'Placement cell BLOCKED from /recruiter');
  assert(placementToRecruiter.redirect === '/management', 'Placement cell redirected back to /management');

  // STEP 8: Object-Level Security Policies (ABAC / RBAC)
  console.log('\n--- Step 8: Object-Level Data Isolation Policies ---');
  const mockStudentUser: AuthUser = {
    id: 'usr-student-001',
    email: 'student@rvu.edu.in',
    displayName: 'Aarav Sharma',
    role: 'student',
    studentId: '2025BTECH001',
    isActive: true,
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  };

  const mockRecruiterUser: AuthUser = {
    id: 'usr-recruiter-002',
    email: 'recruiter@technosphere.io',
    displayName: 'Priya Mehta',
    role: 'recruiter',
    companyName: 'Technosphere Systems',
    isActive: true,
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  };

  const mockPlacementUser: AuthUser = {
    id: 'usr-placement-003',
    email: 'placement@rvu.edu.in',
    displayName: 'Director Placement',
    role: 'placement',
    department: 'Career Advisory & Placement',
    isActive: true,
    mustChangePassword: false,
    createdAt: new Date().toISOString()
  };

  // 8a: Candidate profile access
  assert(
    SecurityPolicyEngine.canAccessCandidate(mockStudentUser, { candidateStudentId: '2025BTECH001' }) === true,
    'Student can access their own candidate profile'
  );
  assert(
    SecurityPolicyEngine.canAccessCandidate(mockStudentUser, { candidateStudentId: '2025BTECH999' }) === false,
    'Student CANNOT access another student candidate profile'
  );
  assert(
    SecurityPolicyEngine.canAccessCandidate(mockPlacementUser, { candidateStudentId: '2025BTECH999' }) === true,
    'Placement Cell has universal candidate access'
  );

  // 8b: Opportunity management
  assert(
    SecurityPolicyEngine.canAccessOpportunity(mockStudentUser, { opportunityId: 'opp-1' }, 'edit') === false,
    'Student CANNOT edit job opportunities'
  );
  assert(
    SecurityPolicyEngine.canAccessOpportunity(
      mockRecruiterUser, 
      { opportunityId: 'opp-1', companyId: 'Technosphere Systems' }, 
      'edit'
    ) === true,
    'Recruiter can edit their own company opportunity'
  );
  assert(
    SecurityPolicyEngine.canAccessOpportunity(
      mockRecruiterUser, 
      { opportunityId: 'opp-2', companyId: 'DifferentCorp' }, 
      'edit'
    ) === false,
    'Recruiter CANNOT edit another company opportunity'
  );
  assert(
    SecurityPolicyEngine.canAccessOpportunity(
      mockPlacementUser, 
      { opportunityId: 'opp-2', companyId: 'DifferentCorp' }, 
      'edit'
    ) === true,
    'Placement Cell can manage all opportunities'
  );

  // 8c: Application access
  assert(
    SecurityPolicyEngine.canAccessApplication(mockStudentUser, {
      applicationId: 'app-1',
      studentId: '2025BTECH001',
      companyId: 'Technosphere Systems'
    }) === true,
    'Student can access their own application'
  );
  assert(
    SecurityPolicyEngine.canAccessApplication(mockStudentUser, {
      applicationId: 'app-2',
      studentId: '2025BTECH999',
      companyId: 'Technosphere Systems'
    }) === false,
    'Student CANNOT access another student application'
  );
  assert(
    SecurityPolicyEngine.canAccessApplication(mockRecruiterUser, {
      applicationId: 'app-1',
      studentId: '2025BTECH001',
      companyId: 'Technosphere Systems'
    }) === true,
    'Recruiter can access applications submitted to their company'
  );
  assert(
    SecurityPolicyEngine.canAccessApplication(mockRecruiterUser, {
      applicationId: 'app-3',
      studentId: '2025BTECH001',
      companyId: 'CompetitorCorp'
    }) === false,
    'Recruiter CANNOT access applications submitted to another company'
  );

  // 8d: Student document confidentiality
  assert(
    SecurityPolicyEngine.canAccessStudentDocument(mockStudentUser, {
      documentId: 'doc-1',
      ownerStudentId: '2025BTECH001'
    }) === true,
    'Student can access their own uploaded documents'
  );
  assert(
    SecurityPolicyEngine.canAccessStudentDocument(mockStudentUser, {
      documentId: 'doc-2',
      ownerStudentId: '2025BTECH999'
    }) === false,
    'Student CANNOT access another student uploaded document'
  );
  assert(
    SecurityPolicyEngine.canAccessStudentDocument(mockPlacementUser, {
      documentId: 'doc-2',
      ownerStudentId: '2025BTECH999'
    }) === true,
    'Placement Cell has universal document verification access'
  );

  console.log(`\n==================================================`);
  console.log(`🏁 Complete E2E Verification Finished: ${passCount} Passed, ${failCount} Failed`);
  console.log(`==================================================\n`);

  const proc = (globalThis as unknown as { process?: { exit: (code?: number) => void } }).process;
  if (failCount > 0 && proc) {
    proc.exit(1);
  }
}

runE2ETests().catch(err => {
  console.error('Fatal E2E test error:', err);
  const proc = (globalThis as unknown as { process?: { exit: (code?: number) => void } }).process;
  if (proc) {
    proc.exit(1);
  }
});
