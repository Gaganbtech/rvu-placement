// Comprehensive Test Suite for RVU Career Hub Production Supabase Authentication System
import { 
  authService, 
  deriveDisplayNameFromEmail, 
  deriveInitialsFromEmail,
  normalizeRole,
  evaluatePasswordStrength
} from './authService';
import { isSupabaseConfigured, isSupabaseUrlValid } from '../lib/supabase';

async function runTests() {
  console.log('🧪 Starting RVU Supabase Authentication Tests...\n');
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

  console.log('--- Test Suite 1: Helper Utilities (Display Name & Initials) ---');
  assert(deriveDisplayNameFromEmail('gagan@gmail.com') === 'Gagan', 'Derives "Gagan" from gagan@gmail.com');
  assert(deriveDisplayNameFromEmail('gagana.btech23@rvu.edu.in') === 'Gagana Btech', 'Derives "Gagana Btech" from dotted institutional email');
  assert(deriveDisplayNameFromEmail('john.doe') === 'John Doe', 'Derives "John Doe" from dotted username');
  assert(deriveInitialsFromEmail('gagan@gmail.com', 'Gagan') === 'GA', 'Derives initials "GA" for Gagan');
  assert(deriveInitialsFromEmail('student.test@gmail.com', 'Student Test') === 'ST', 'Derives initials "ST" for Student Test');

  console.log('\n--- Test Suite 2: Role Normalization ---');
  assert(normalizeRole('student') === 'student', 'Normalizes student to student');
  assert(normalizeRole('recruiter') === 'recruiter', 'Normalizes recruiter to recruiter');
  assert(normalizeRole('placement') === 'placement', 'Normalizes placement to placement');
  assert(normalizeRole('management') === 'placement', 'Normalizes legacy management to placement');
  assert(normalizeRole('placement-cell') === 'placement', 'Normalizes legacy placement-cell to placement');
  assert(normalizeRole(undefined) === 'student', 'Defaults undefined role to student');

  console.log('\n--- Test Suite 3: Credential Validation (Empty & Invalid Handling) ---');
  // Empty user ID
  const emptyIdResult = await authService.login({ email: '', password: 'somepassword', role: 'student' });
  assert(emptyIdResult.success === false, 'Rejects empty email');
  assert(emptyIdResult.error === 'Please enter your email address and password.', 'Returns: "Please enter your email address and password."');

  // Empty password
  const emptyPassResult = await authService.login({ email: 'gagan@gmail.com', password: '', role: 'student' });
  assert(emptyPassResult.success === false, 'Rejects empty password');
  assert(emptyPassResult.error === 'Please enter your email address and password.', 'Returns error for empty password');

  // Both empty
  const bothEmptyResult = await authService.login({ email: '', password: '', role: 'student' });
  assert(bothEmptyResult.success === false, 'Rejects both empty');

  console.log('\n--- Test Suite 4: Supabase Connection & Configuration ---');
  assert(isSupabaseUrlValid('https://pnzuudpptjyjabtbmsti.supabase.co') === true, 'Supabase URL format is valid');
  assert(isSupabaseUrlValid('http://insecure.url') === false, 'Insecure HTTP URL is rejected');
  assert(isSupabaseConfigured() === true, 'Supabase client is configured with valid credentials');

  console.log('\n--- Test Suite 5: Password Security & Evaluation ---');
  assert(evaluatePasswordStrength('123').label === 'Weak', 'Evaluates "123" as Weak');
  assert(evaluatePasswordStrength('secret123').label === 'Fair', 'Evaluates "secret123" as Fair');
  assert(evaluatePasswordStrength('SecureP@ssw0rd2026!').label === 'Strong', 'Evaluates complex password as Strong');

  console.log('\n--- Test Suite 6: Live Supabase Auth Sign In (Authentication Gate) ---');
  // Attempt login with invalid credentials against live Supabase Auth
  const liveAuthAttempt = await authService.login({
    email: 'nonexistent_user@rvu.edu.in',
    password: 'wrong_password_123',
    role: 'student'
  });
  assert(liveAuthAttempt.success === false, 'Live Supabase Auth correctly rejects invalid credentials');
  assert(
    liveAuthAttempt.error === 'Email or password is incorrect.',
    'Returns safe sanitized user-facing error message: "Email or password is incorrect."'
  );

  console.log('\n--- Test Suite 7: User Mapping & Canonical Types ---');
  const mockSupaUser = {
    id: 'usr-uuid-1234',
    email: 'student@rvu.edu.in',
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: { full_name: 'Aarav Sharma' },
    aud: 'authenticated'
  };

  const mockProfile: import('../types/database').ProfileRow = {
    id: 'prof-uuid-5678',
    auth_user_id: 'usr-uuid-1234',
    email: 'student@rvu.edu.in',
    full_name: 'Aarav Sharma',
    role: 'student',
    is_active: true,
    student_id: '2025BTECH001',
    company_name: null,
    department: 'Computer Science',
    phone: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const mapped = authService.mapToAuthUser(mockSupaUser as any, mockProfile);
  assert(mapped.id === 'usr-uuid-1234', 'Mapped user ID preserved');
  assert(mapped.role === 'student', 'Mapped user role is student');
  assert(mapped.displayName === 'Aarav Sharma', 'Mapped display name preserved');
  assert(mapped.studentId === '2025BTECH001', 'Mapped student ID preserved');

  console.log(`\n==================================================`);
  console.log(`🏁 Verification Finished: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================`);

  const proc = (globalThis as unknown as { process?: { exit: (code?: number) => void } }).process;
  if (failed > 0 && proc) {
    proc.exit(1);
  }
}

runTests().catch(console.error);
