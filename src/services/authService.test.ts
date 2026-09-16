// Comprehensive Test Suite for RVU Career Hub Normal User ID + Password Authentication System
import { 
  authService, 
  deriveDisplayNameFromEmail, 
  deriveInitialsFromEmail 
} from './authService';


async function runTests() {
  console.log('🧪 Starting RVU User ID + Password Authentication Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // Ensure clean starting state
  await authService.logout();

  console.log('--- Test Suite 1: Helper Utilities (Display Name & Initials) ---');
  assert(deriveDisplayNameFromEmail('gagan@gmail.com') === 'Gagan', 'Derives "Gagan" from gagan@gmail.com');
  assert(deriveDisplayNameFromEmail('gagana.btech23@rvu.edu.in') === 'Gagana Btech', 'Derives "Gagana Btech" from dotted institutional email');
  assert(deriveDisplayNameFromEmail('john.doe') === 'John Doe', 'Derives "John Doe" from dotted username');
  assert(deriveInitialsFromEmail('gagan@gmail.com', 'Gagan') === 'GA', 'Derives initials "GA" for Gagan');
  assert(deriveInitialsFromEmail('student.test@gmail.com', 'Student Test') === 'ST', 'Derives initials "ST" for Student Test');

  console.log('\n--- Test Suite 2: Credential Validation (Empty & Invalid Handling) ---');
  
  // Empty user ID
  const emptyIdResult = await authService.login({ identifier: '', password: 'somepassword', role: 'student' });
  assert(emptyIdResult.success === false, 'Rejects empty user ID');
  assert(emptyIdResult.error === 'Please enter your user ID and password.', 'Returns: "Please enter your user ID and password."');

  // Empty password
  const emptyPassResult = await authService.login({ identifier: 'gagan@gmail.com', password: '', role: 'student' });
  assert(emptyPassResult.success === false, 'Rejects empty password');
  assert(emptyPassResult.error === 'Please enter your user ID and password.', 'Returns: "Please enter your user ID and password." for empty password');

  // Both empty
  const bothEmptyResult = await authService.login({ identifier: '', password: '', role: 'student' });
  assert(bothEmptyResult.success === false, 'Rejects both empty');

  // Invalid portal
  const invalidPortalResult = await authService.login({ identifier: 'gagan', password: '123', role: 'invalid-portal' as any });
  assert(invalidPortalResult.success === false, 'Rejects invalid portal selection');

  console.log('\n--- Test Suite 3: Local Demo Mode Authentication ---');
  assert(authService.isDemoMode() === true, 'Demo mode is active for local development');

  // User 1: gagan@gmail.com + 12345 (Student)
  const studentLogin = await authService.login({
    identifier: 'gagan@gmail.com',
    password: '12345',
    role: 'student'
  });
  assert(studentLogin.success === true, 'Logs in gagan@gmail.com with password 12345');
  assert(studentLogin.user?.role === 'student', 'User role is student');
  assert(studentLogin.redirectRoute === '/student', 'Redirect route is /student');
  assert(authService.isAuthenticated() === true, 'authService reports authenticated');
  assert(authService.getCurrentUser()?.email === 'gagan@gmail.com', 'Current user email preserved');

  // Check stored safe session (never stores password)
  const storedSession = authService.getStoredSession();
  assert(storedSession !== null, 'Session object stored');
  assert(storedSession?.authenticated === true, 'Session is marked authenticated');
  assert(storedSession?.identifier === 'gagan@gmail.com', 'Stored identifier is gagan@gmail.com');
  assert(storedSession?.portal === 'student', 'Stored portal is student');
  assert((storedSession as any).password === undefined, 'CRITICAL: Password is NEVER stored in session object');

  // User 2: test@example.com + hello (Recruiter)
  const recruiterLogin = await authService.login({
    identifier: 'test@example.com',
    password: 'hello',
    role: 'recruiter'
  });
  assert(recruiterLogin.success === true, 'Logs in test@example.com with password hello');
  assert(recruiterLogin.user?.role === 'recruiter', 'User role is recruiter');
  assert(recruiterLogin.redirectRoute === '/recruiter', 'Redirect route is /recruiter');

  // User 3: car.placement@rvu.edu.in + admin123 (Placement Cell / Management)
  const managementLogin = await authService.login({
    identifier: 'car.placement@rvu.edu.in',
    password: 'admin123',
    role: 'placement-cell'
  });
  assert(managementLogin.success === true, 'Logs in placement officer with credentials');
  assert(managementLogin.user?.role === 'placement-cell', 'User role is placement-cell');
  assert(managementLogin.redirectRoute === '/management', 'Redirect route is /management');

  console.log('\n--- Test Suite 4: Password Change & Security Settings ---');
  // Attempt with empty fields
  const emptyChange = await authService.changePassword('', '');
  assert(emptyChange.success === false, 'Rejects empty password change fields');

  // Attempt with short password
  const shortChange = await authService.changePassword('oldpass', '123');
  assert(shortChange.success === false, 'Rejects password shorter than 6 characters');

  // Valid password update
  const validChange = await authService.changePassword('oldpass123', 'newsecurepass456');
  assert(validChange.success === true, 'Accepts valid password update');
  assert(validChange.message === 'Password updated successfully.', 'Returns success message: "Password updated successfully."');

  // Password strength evaluation
  assert(authService.evaluatePasswordStrength('123').label === 'Weak', 'Evaluates "123" as Weak');
  assert(authService.evaluatePasswordStrength('secret123').label === 'Fair', 'Evaluates "secret123" as Fair');
  assert(authService.evaluatePasswordStrength('SecureP@ssw0rd2026!').label === 'Strong', 'Evaluates complex password as Strong');

  console.log('\n--- Test Suite 5: Logout & Session Teardown ---');
  await authService.logout();
  assert(authService.isAuthenticated() === false, 'User is unauthenticated after logout');
  assert(authService.getCurrentUser() === null, 'Current user is null after logout');
  assert(authService.getStoredSession() === null, 'Stored session is cleared after logout');

  // Summary
  console.log(`\n==================================================`);
  console.log(`🏁 Verification Finished: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================`);

  const proc = (globalThis as unknown as { process?: { exit: (code?: number) => void } }).process;
  if (failed > 0 && proc) {
    proc.exit(1);
  }
}

runTests().catch(console.error);
