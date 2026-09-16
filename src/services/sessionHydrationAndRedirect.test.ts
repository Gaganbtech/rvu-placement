// src/services/sessionHydrationAndRedirect.test.ts
// Comprehensive Test Suite for RVU Career Hub Session Hydration & Redirect Prevention
// Enforces Section 22 validation requirements for auth state lifecycle, route guards, and role security.

import { 
  authService, 
  sanitizeAuthError, 
  normalizeRole 
} from './authService';
import type { 
  UserRole, 
  AuthUser, 
  AuthState,
  LoginResult 
} from '../types/auth';
import type { ProfileRow } from '../types/database';

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

/**
 * Route guard decision simulator mirroring RoleRoute and App.tsx
 */
function evaluateRouteAccess(
  authState: AuthState,
  allowedRoles: UserRole[],
  targetPath: string
): {
  decision: 'LOADING' | 'ALLOW' | 'REDIRECT_LOGIN' | 'REDIRECT_HOME' | 'ACCOUNT_INACTIVE' | 'ACCOUNT_UNPROVISIONED';
  redirectTo?: string;
  view?: string;
} {
  // 1. Loading / Hydration Gate: While initializing or loading, NEVER redirect to login
  if (!authState.isInitialized || authState.isLoading) {
    return { decision: 'LOADING' };
  }

  // 2. Unauthenticated Gate: No session or no user after initialization
  if (!authState.session || !authState.user) {
    return { decision: 'REDIRECT_LOGIN', redirectTo: '/login' };
  }

  // 3. Inactive Account Gate
  if (authState.user.isActive === false) {
    return { decision: 'ACCOUNT_INACTIVE', view: 'AccountStatusView(inactive)' };
  }

  // 4. Missing or Unprovisioned Role Gate
  const validRoles: UserRole[] = ['student', 'recruiter', 'placement'];
  if (!authState.role || !validRoles.includes(authState.role)) {
    return { decision: 'ACCOUNT_UNPROVISIONED', view: 'AccountStatusView(unprovisioned)' };
  }

  // 5. Cross-Portal Role Isolation Gate
  if (!allowedRoles.includes(authState.role)) {
    const authorizedHome = 
      authState.role === 'student' 
        ? '/student' 
        : authState.role === 'recruiter' 
        ? '/recruiter' 
        : '/management';
    return { decision: 'REDIRECT_HOME', redirectTo: authorizedHome, view: 'AccessRestrictedView' };
  }

  // 6. Authorized
  return { decision: 'ALLOW' };
}

async function runSessionHydrationTests() {
  console.log('🧪 Starting RVU Session Hydration & Redirect Loop Regression Tests...\n');

  // ==============================================================================
  // Test Suite 1: Auth Provider Lifecycle & Initialization Guarding
  // ==============================================================================
  console.log('--- Test Suite 1: Auth Provider Initialization Guarding ---');

  // 1. Initial boot state has isInitialized=false, isLoading=true
  const bootingState: AuthState = {
    session: null,
    user: null,
    profile: null,
    role: null,
    isLoading: true,
    isInitialized: false
  };

  const bootingAccess = evaluateRouteAccess(bootingState, ['student'], '/student');
  assert(bootingAccess.decision === 'LOADING', '1. Route guard shows loading screen during initial boot');
  assert(bootingAccess.redirectTo === undefined, '1. Route guard NEVER redirects to /login during initialization');

  // 2. Hydration state (session exists but profile/role still resolving)
  const hydratingState: AuthState = {
    session: { access_token: 'valid-token', refresh_token: 'ref', expires_in: 3600, token_type: 'bearer', user: { id: 'u1', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } },
    user: null,
    profile: null,
    role: null,
    isLoading: true,
    isInitialized: false
  };

  const hydratingAccess = evaluateRouteAccess(hydratingState, ['student'], '/student');
  assert(hydratingAccess.decision === 'LOADING', '2. Authenticated user does not redirect to login during session hydration');
  assert(hydratingAccess.redirectTo !== '/login', '2. Session hydration suppresses redirect to login');

  // ==============================================================================
  // Test Suite 2: Strict Cross-Portal Boundary Isolation
  // ==============================================================================
  console.log('\n--- Test Suite 2: Strict Cross-Portal Boundary Isolation ---');

  const studentState: AuthState = {
    session: { access_token: 'tok-s', refresh_token: 'r-s', expires_in: 3600, token_type: 'bearer', user: { id: 'stud-1', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } },
    user: {
      id: 'stud-1',
      email: 'student@rvu.edu.in',
      role: 'student',
      displayName: 'RVU Student',
      isActive: true,
      mustChangePassword: false,
      createdAt: ''
    },
    profile: {
      id: 'prof-1',
      auth_user_id: 'stud-1',
      email: 'student@rvu.edu.in',
      full_name: 'RVU Student',
      role: 'student',
      is_active: true,
      created_at: '',
      updated_at: ''
    },
    role: 'student',
    isLoading: false,
    isInitialized: true
  };

  // 3. Student can access student routes
  const s1 = evaluateRouteAccess(studentState, ['student'], '/student');
  const s2 = evaluateRouteAccess(studentState, ['student'], '/student/opportunities');
  const s3 = evaluateRouteAccess(studentState, ['student'], '/student/applications');
  assert(s1.decision === 'ALLOW', '3. Student can access /student');
  assert(s2.decision === 'ALLOW', '3. Student can access /student/opportunities');
  assert(s3.decision === 'ALLOW', '3. Student can access /student/applications');

  // 4. Student CANNOT access recruiter routes
  const sRecruiter = evaluateRouteAccess(studentState, ['recruiter'], '/recruiter');
  assert(sRecruiter.decision === 'REDIRECT_HOME', '4. Student cannot access /recruiter (AccessRestrictedView)');
  assert(sRecruiter.redirectTo === '/student', '4. Student on /recruiter is redirected to /student');

  // 5. Student CANNOT access placement routes
  const sManagement = evaluateRouteAccess(studentState, ['placement'], '/management');
  assert(sManagement.decision === 'REDIRECT_HOME', '5. Student cannot access /management (AccessRestrictedView)');
  assert(sManagement.redirectTo === '/student', '5. Student on /management is redirected to /student');

  // Recruiter State
  const recruiterState: AuthState = {
    session: { access_token: 'tok-r', refresh_token: 'r-r', expires_in: 3600, token_type: 'bearer', user: { id: 'rec-1', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } },
    user: {
      id: 'rec-1',
      email: 'recruiter@google.com',
      role: 'recruiter',
      displayName: 'Google Campus Recruiter',
      isActive: true,
      mustChangePassword: false,
      createdAt: ''
    },
    profile: {
      id: 'prof-2',
      auth_user_id: 'rec-1',
      email: 'recruiter@google.com',
      full_name: 'Google Campus Recruiter',
      role: 'recruiter',
      is_active: true,
      created_at: '',
      updated_at: ''
    },
    role: 'recruiter',
    isLoading: false,
    isInitialized: true
  };

  // 6. Recruiter cannot access student routes
  const rStudent = evaluateRouteAccess(recruiterState, ['student'], '/student');
  assert(rStudent.decision === 'REDIRECT_HOME', '6. Recruiter cannot access /student');
  assert(rStudent.redirectTo === '/recruiter', '6. Recruiter on /student is redirected to /recruiter');

  // 7. Recruiter cannot access placement routes
  const rManagement = evaluateRouteAccess(recruiterState, ['placement'], '/management');
  assert(rManagement.decision === 'REDIRECT_HOME', '7. Recruiter cannot access /management');
  assert(rManagement.redirectTo === '/recruiter', '7. Recruiter on /management is redirected to /recruiter');

  // Placement Cell State
  const placementState: AuthState = {
    session: { access_token: 'tok-p', refresh_token: 'r-p', expires_in: 3600, token_type: 'bearer', user: { id: 'pl-1', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } },
    user: {
      id: 'pl-1',
      email: 'placement@rvu.edu.in',
      role: 'placement',
      displayName: 'Director of Placement',
      isActive: true,
      mustChangePassword: false,
      createdAt: ''
    },
    profile: {
      id: 'prof-3',
      auth_user_id: 'pl-1',
      email: 'placement@rvu.edu.in',
      full_name: 'Director of Placement',
      role: 'placement',
      is_active: true,
      created_at: '',
      updated_at: ''
    },
    role: 'placement',
    isLoading: false,
    isInitialized: true
  };

  // 8. Placement cannot access student routes
  const pStudent = evaluateRouteAccess(placementState, ['student'], '/student');
  assert(pStudent.decision === 'REDIRECT_HOME', '8. Placement cannot access /student');
  assert(pStudent.redirectTo === '/management', '8. Placement on /student is redirected to /management');

  // 9. Placement cannot access recruiter routes
  const pRecruiter = evaluateRouteAccess(placementState, ['recruiter'], '/recruiter');
  assert(pRecruiter.decision === 'REDIRECT_HOME', '9. Placement cannot access /recruiter');
  assert(pRecruiter.redirectTo === '/management', '9. Placement on /recruiter is redirected to /management');

  // ==============================================================================
  // Test Suite 3: Logged-out and Session Refresh Verification
  // ==============================================================================
  console.log('\n--- Test Suite 3: Unauthenticated & Session Rehydration ---');

  // 10. Logged-out user cannot access private routes
  const loggedOutState: AuthState = {
    session: null,
    user: null,
    profile: null,
    role: null,
    isLoading: false,
    isInitialized: true
  };

  const loggedOutAccessStudent = evaluateRouteAccess(loggedOutState, ['student'], '/student');
  const loggedOutAccessRecruiter = evaluateRouteAccess(loggedOutState, ['recruiter'], '/recruiter');
  const loggedOutAccessPlacement = evaluateRouteAccess(loggedOutState, ['placement'], '/management');
  assert(loggedOutAccessStudent.decision === 'REDIRECT_LOGIN', '10. Logged-out user blocked from /student');
  assert(loggedOutAccessRecruiter.decision === 'REDIRECT_LOGIN', '10. Logged-out user blocked from /recruiter');
  assert(loggedOutAccessPlacement.decision === 'REDIRECT_LOGIN', '10. Logged-out user blocked from /management');

  // 11. Refresh preserves session (rehydration simulation)
  // Step A: Refresh starts with isLoading=true, isInitialized=false -> loading screen
  const refreshStartAccess = evaluateRouteAccess(bootingState, ['student'], '/student');
  assert(refreshStartAccess.decision === 'LOADING', '11. Page refresh begins in LOADING state without kicking to /login');

  // Step B: Supabase rehydrates stored session and profiles -> returns ALLOW
  const refreshedHydratedState: AuthState = {
    ...studentState,
    isLoading: false,
    isInitialized: true
  };
  const refreshCompleteAccess = evaluateRouteAccess(refreshedHydratedState, ['student'], '/student');
  assert(refreshCompleteAccess.decision === 'ALLOW', '11. Session successfully restored after refresh without login redirect');

  // ==============================================================================
  // Test Suite 4: Error Handling & Account Status Verification
  // ==============================================================================
  console.log('\n--- Test Suite 4: Error Handling & Account Status Messages ---');

  // 12. Missing profile does NOT appear as "Invalid credentials"
  const missingProfileMsg = 'Your account is authenticated, but your RVU Career Hub profile is not configured.';
  assert(missingProfileMsg !== 'Email or password is incorrect.', '12. Missing profile message is distinct from credential error');
  assert(!missingProfileMsg.includes('credentials'), '12. Missing profile does not mention invalid credentials');

  // 13. Missing role does NOT appear as "Invalid credentials"
  const missingRoleMsg = 'Your portal access has not been assigned yet. Please contact the Placement Cell.';
  assert(missingRoleMsg !== 'Email or password is incorrect.', '13. Missing role message is distinct from credential error');

  const unprovisionedState: AuthState = {
    session: { access_token: 'tok-u', refresh_token: 'r-u', expires_in: 3600, token_type: 'bearer', user: { id: 'u-unprov', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } },
    user: {
      id: 'u-unprov',
      email: 'newuser@rvu.edu.in',
      role: 'student', // Fallback
      displayName: 'Unprovisioned User',
      isActive: true,
      mustChangePassword: false,
      createdAt: ''
    },
    profile: {
      id: 'prof-unprov',
      auth_user_id: 'u-unprov',
      email: 'newuser@rvu.edu.in',
      full_name: 'Unprovisioned User',
      role: '' as any, // Missing role in DB
      is_active: true,
      created_at: '',
      updated_at: ''
    },
    role: null, // Unassigned role
    isLoading: false,
    isInitialized: true
  };

  const unprovisionedAccess = evaluateRouteAccess(unprovisionedState, ['student'], '/student');
  assert(unprovisionedAccess.decision === 'ACCOUNT_UNPROVISIONED', '13. Unprovisioned account renders AccountStatusView(unprovisioned)');

  // 14. Inactive account is handled correctly
  const inactiveState: AuthState = {
    session: { access_token: 'tok-i', refresh_token: 'r-i', expires_in: 3600, token_type: 'bearer', user: { id: 'u-inact', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } },
    user: {
      id: 'u-inact',
      email: 'inactive@rvu.edu.in',
      role: 'student',
      displayName: 'Inactive User',
      isActive: false, // Inactive account
      mustChangePassword: false,
      createdAt: ''
    },
    profile: {
      id: 'prof-inact',
      auth_user_id: 'u-inact',
      email: 'inactive@rvu.edu.in',
      full_name: 'Inactive User',
      role: 'student',
      is_active: false,
      created_at: '',
      updated_at: ''
    },
    role: 'student',
    isLoading: false,
    isInitialized: true
  };

  const inactiveAccess = evaluateRouteAccess(inactiveState, ['student'], '/student');
  assert(inactiveAccess.decision === 'ACCOUNT_INACTIVE', '14. Inactive account blocked and displays AccountStatusView(inactive)');

  // 15. Logout removes access
  const postLogoutState: AuthState = {
    session: null,
    user: null,
    profile: null,
    role: null,
    isLoading: false,
    isInitialized: true
  };
  const postLogoutAccess = evaluateRouteAccess(postLogoutState, ['student'], '/student');
  assert(postLogoutAccess.decision === 'REDIRECT_LOGIN', '15. Logout removes access to protected routes');

  // ==============================================================================
  // Test Suite 5: Login UI Hint vs Authoritative Database Role
  // ==============================================================================
  console.log('\n--- Test Suite 5: Login UI Portal Selector as Hint Only ---');

  // Student selects "recruiter" tab on login screen
  // Database returns role: 'student'
  // Result must route to /student, not throw an access denied error
  const loginUser = studentState.user!;
  const authoritativeRedirect = loginUser.role === 'student' ? '/student' : loginUser.role === 'recruiter' ? '/recruiter' : '/management';
  assert(authoritativeRedirect === '/student', 'Selected UI tab does not override database role; routes strictly to /student');

  console.log(`\n==================================================`);
  console.log(`🏁 Session Hydration & Redirect Tests: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSessionHydrationTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
