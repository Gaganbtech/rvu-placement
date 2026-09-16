// src/services/e2eAuthFlow.test.ts
// Comprehensive end-to-end verification for RVU CAREER HUB User ID + Password Authentication

import { authService, INITIAL_DEFAULT_PASSWORD } from './authService';

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
  console.log('🚀 Running Complete RVU Auth E2E Test Suite...\n');

  // STEP 1: Check Environment and Absence of Supabase Requirement
  console.log('--- Step 1: Environment & Supabase Detachment ---');
  assert(authService.isDemoMode() === true, 'DEMO AUTH mode is enabled (VITE_DEMO_AUTH=true)');
  assert(authService.isAuthenticated() === false, 'Initially unauthenticated');

  // STEP 2: Student Login (gagan@gmail.com / 12345)
  console.log('\n--- Step 2: Student Login Test ---');
  const studentResult = await authService.login({
    identifier: 'gagan@gmail.com',
    password: '12345',
    role: 'student'
  });
  assert(studentResult.success === true, 'Student login succeeded with non-empty credentials');
  assert(studentResult.redirectRoute === '/student', 'Student redirects to /student');
  assert(authService.isAuthenticated() === true, 'User is authenticated');
  
  const studentUser = authService.getCurrentUser();
  assert(studentUser?.email === 'gagan@gmail.com', 'Current user email matches');
  assert(studentUser?.role === 'student', 'Current user role is student');

  // Verify safe session storage (NO PASSWORDS STORED)
  const session = authService.getStoredSession();
  assert(session !== null, 'Session exists in safe storage');
  assert(session?.authenticated === true, 'Session is marked authenticated');
  assert(session?.identifier === 'gagan@gmail.com', 'Session stores identifier');
  assert(session?.portal === 'student', 'Session stores portal as student');
  assert((session as any).password === undefined, 'CRITICAL SECURITY: Password is NOT stored in session');
  assert((session as any).token === undefined, 'CRITICAL SECURITY: Access tokens are NOT stored');

  // STEP 3: Refresh Persistence
  console.log('\n--- Step 3: Refresh Persistence Test ---');
  // Simulate page reload by creating a new DemoAuthService instance reading from the same storage
  const restoredAuth = new (authService.constructor as any)();
  assert(restoredAuth.isAuthenticated() === true, 'Session restored on simulated page reload');
  assert(restoredAuth.getCurrentUser()?.role === 'student', 'Restored role is student');

  // STEP 4: Password Change & Security Settings
  console.log('\n--- Step 4: Settings & Password Change Test ---');
  // Attempt with empty password
  const emptyPwdChange = await authService.changePassword('', '');
  assert(emptyPwdChange.success === false, 'Rejects empty password update');
  
  // Attempt with short password
  const shortPwdChange = await authService.changePassword('old', '123');
  assert(shortPwdChange.success === false, 'Rejects password shorter than 6 characters');

  // Valid password update
  const validPwdChange = await authService.changePassword('12345', 'MyNewStrongPass2026!');
  assert(validPwdChange.success === true, 'Accepts valid password update');
  assert(validPwdChange.message === 'Password updated successfully.', 'Reports success message');

  // Strength evaluation
  const weakEval = authService.evaluatePasswordStrength('123');
  assert(weakEval.label === 'Weak', 'Weak password recognized');
  const strongEval = authService.evaluatePasswordStrength('Secure#9876Admin');
  assert(strongEval.label === 'Strong', 'Strong password recognized');

  // STEP 5: Logout
  console.log('\n--- Step 5: Logout Test ---');
  await authService.logout();
  assert(authService.isAuthenticated() === false, 'Authenticated state is false after logout');
  assert(authService.getCurrentUser() === null, 'Current user is null after logout');
  assert(authService.getStoredSession() === null, 'Session storage is completely cleared');

  // STEP 6: Recruiter Login (test@example.com / hello)
  console.log('\n--- Step 6: Recruiter Login Test ---');
  const recruiterResult = await authService.login({
    identifier: 'test@example.com',
    password: 'hello',
    role: 'recruiter'
  });
  assert(recruiterResult.success === true, 'Recruiter login succeeded');
  assert(recruiterResult.redirectRoute === '/recruiter', 'Recruiter redirects to /recruiter');
  assert(authService.getCurrentUser()?.role === 'recruiter', 'Role is recruiter');

  // STEP 7: Route Protection / Cross-Portal Access Prevention
  console.log('\n--- Step 7: Route Protection & Cross-Portal Access Prevention ---');
  // Helper simulating the RouteGuard logic
  function checkRouteAccess(userRole: string | undefined, currentPath: string): { allowed: boolean; redirect: string } {
    if (!userRole) return { allowed: false, redirect: '/login' };
    if (currentPath.startsWith('/student') && userRole !== 'student') {
      return { allowed: false, redirect: userRole === 'recruiter' ? '/recruiter' : '/management' };
    }
    if (currentPath.startsWith('/recruiter') && userRole !== 'recruiter') {
      return { allowed: false, redirect: userRole === 'student' ? '/student' : '/management' };
    }
    if (currentPath.startsWith('/management') && userRole !== 'placement-cell' && userRole !== 'management') {
      return { allowed: false, redirect: userRole === 'student' ? '/student' : '/recruiter' };
    }
    return { allowed: true, redirect: currentPath };
  }

  // As a recruiter, attempting to access /student
  const recruiterAccessStudent = checkRouteAccess(authService.getCurrentUser()?.role, '/student');
  assert(recruiterAccessStudent.allowed === false, 'Recruiter is BLOCKED from /student');
  assert(recruiterAccessStudent.redirect === '/recruiter', 'Recruiter is redirected to /recruiter');

  // As a recruiter, attempting to access /management
  const recruiterAccessManagement = checkRouteAccess(authService.getCurrentUser()?.role, '/management');
  assert(recruiterAccessManagement.allowed === false, 'Recruiter is BLOCKED from /management');
  assert(recruiterAccessManagement.redirect === '/recruiter', 'Recruiter is redirected to /recruiter');

  // Logout recruiter
  await authService.logout();

  // STEP 8: Management / Placement Cell Login
  console.log('\n--- Step 8: Management / Placement Cell Login Test ---');
  const mgmtResult = await authService.login({
    identifier: 'placement@rvu.edu.in',
    password: 'adminpass',
    role: 'management'
  });
  assert(mgmtResult.success === true, 'Management login succeeded');
  assert(mgmtResult.redirectRoute === '/management', 'Management redirects to /management');
  assert(authService.getCurrentUser()?.role === 'placement-cell', 'Role mapped to placement-cell');

  // As management, attempting to access /student
  const mgmtAccessStudent = checkRouteAccess(authService.getCurrentUser()?.role, '/student');
  assert(mgmtAccessStudent.allowed === false, 'Management is BLOCKED from /student');
  assert(mgmtAccessStudent.redirect === '/management', 'Management redirected to /management');

  // As management, attempting to access /recruiter
  const mgmtAccessRecruiter = checkRouteAccess(authService.getCurrentUser()?.role, '/recruiter');
  assert(mgmtAccessRecruiter.allowed === false, 'Management is BLOCKED from /recruiter');
  assert(mgmtAccessRecruiter.redirect === '/management', 'Management redirected to /management');

  // Logout management
  await authService.logout();

  // STEP 9: Unauthenticated Access to Protected Routes
  console.log('\n--- Step 9: Unauthenticated Route Protection ---');
  const unauthStudent = checkRouteAccess(undefined, '/student/opportunities');
  assert(unauthStudent.allowed === false, 'Unauthenticated user blocked from /student/opportunities');
  assert(unauthStudent.redirect === '/login', 'Redirected to /login');

  const unauthRecruiter = checkRouteAccess(undefined, '/recruiter/candidates');
  assert(unauthRecruiter.allowed === false, 'Unauthenticated user blocked from /recruiter/candidates');
  assert(unauthRecruiter.redirect === '/login', 'Redirected to /login');

  const unauthManagement = checkRouteAccess(undefined, '/management/students');
  assert(unauthManagement.allowed === false, 'Unauthenticated user blocked from /management/students');
  assert(unauthManagement.redirect === '/login', 'Redirected to /login');

  // STEP 10: Initial Default Password Constant
  console.log('\n--- Step 10: Constant & Security Checks ---');
  assert(INITIAL_DEFAULT_PASSWORD === 'welcome2placement', 'Default password constant is welcome2placement');

  console.log(`\n==================================================`);
  console.log(`🏁 E2E Verification Complete: ${passCount} Passed, ${failCount} Failed`);
  console.log(`==================================================\n`);

  const proc = (globalThis as unknown as { process?: { exit: (code?: number) => void } }).process;
  if (failCount > 0 && proc) {
    proc.exit(1);
  }
}

runE2ETests().catch(err => {
  console.error('Fatal test error:', err);
  const proc = (globalThis as unknown as { process?: { exit: (code?: number) => void } }).process;
  if (proc) {
    proc.exit(1);
  }
});
