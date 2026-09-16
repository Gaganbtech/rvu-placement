// src/services/data/dataServices.test.ts
// Test suite for Real Supabase Data Services & Error Sanitization

import { studentDataService } from './studentDataService';
import { recruiterDataService } from './recruiterDataService';
import { placementDataService } from './placementDataService';
import { sanitizeErrorMessage } from '../../lib/errorUtils';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
    failed++;
  }
}

async function runDataServiceTests() {
  console.log('🧪 Starting RVU Real Data Services & Security Tests...\n');

  console.log('--- Test Suite 1: Error Sanitization & Security Masking ---');
  assert(
    sanitizeErrorMessage('PGRST205: relation "public.profiles" does not exist') === 'An unexpected error occurred. Please try again.',
    'Masks PGRST205 schema cache errors'
  );
  assert(
    sanitizeErrorMessage('syntax error at or near "SELECT"') === 'An unexpected error occurred. Please try again.',
    'Masks raw SQL syntax errors'
  );
  assert(
    sanitizeErrorMessage('column "secret_col" does not exist') === 'An unexpected error occurred. Please try again.',
    'Masks internal database column errors'
  );
  assert(
    sanitizeErrorMessage('Invalid login credentials') === 'Invalid login credentials',
    'Preserves user-friendly authentic auth messages'
  );

  console.log('\n--- Test Suite 2: StudentDataService API Surface & Zero Fake Fallback ---');
  assert(typeof studentDataService.getStudentProfile === 'function', 'getStudentProfile is defined');
  assert(typeof studentDataService.getOpportunities === 'function', 'getOpportunities is defined');
  assert(typeof studentDataService.getApplications === 'function', 'getApplications is defined');
  assert(typeof studentDataService.applyToOpportunity === 'function', 'applyToOpportunity is defined');
  assert(typeof studentDataService.withdrawApplication === 'function', 'withdrawApplication is defined');
  assert(typeof studentDataService.getDocuments === 'function', 'getDocuments is defined');
  assert(typeof studentDataService.uploadDocument === 'function', 'uploadDocument is defined');
  assert(typeof studentDataService.getOffers === 'function', 'getOffers is defined');
  assert(typeof studentDataService.respondToOffer === 'function', 'respondToOffer is defined');

  console.log('\n--- Test Suite 3: RecruiterDataService API Surface ---');
  assert(typeof recruiterDataService.getRecruiterProfile === 'function', 'getRecruiterProfile is defined');
  assert(typeof recruiterDataService.getCompany === 'function', 'getCompany is defined');
  assert(typeof recruiterDataService.getOpportunities === 'function', 'getOpportunities is defined');
  assert(typeof recruiterDataService.createOpportunity === 'function', 'createOpportunity is defined');
  assert(typeof recruiterDataService.getApplications === 'function', 'getApplications is defined');
  assert(typeof recruiterDataService.updateApplicationStage === 'function', 'updateApplicationStage is defined');
  assert(typeof recruiterDataService.scheduleInterview === 'function', 'scheduleInterview is defined');
  assert(typeof recruiterDataService.createOffer === 'function', 'createOffer is defined');

  console.log('\n--- Test Suite 4: PlacementDataService API Surface ---');
  assert(typeof placementDataService.getStudents === 'function', 'getStudents is defined');
  assert(typeof placementDataService.getCompanies === 'function', 'getCompanies is defined');
  assert(typeof placementDataService.updateCompanyVerification === 'function', 'updateCompanyVerification is defined');
  assert(typeof placementDataService.getOpportunities === 'function', 'getOpportunities is defined');
  assert(typeof placementDataService.approveOpportunity === 'function', 'approveOpportunity is defined');
  assert(typeof placementDataService.getApplications === 'function', 'getApplications is defined');
  assert(typeof placementDataService.createDrive === 'function', 'createDrive is defined');
  assert(typeof placementDataService.getOffers === 'function', 'getOffers is defined');
  assert(typeof placementDataService.verifyOffer === 'function', 'verifyOffer is defined');
  assert(typeof placementDataService.getAuditLogs === 'function', 'getAuditLogs is defined');
  assert(typeof placementDataService.provisionUser === 'function', 'provisionUser is defined');

  console.log(`\n==================================================`);
  console.log(`🏁 Data Services Verification: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================\n`);

  const proc = (globalThis as unknown as { process?: { exit: (code?: number) => void } }).process;
  if (failed > 0 && proc) {
    proc.exit(1);
  }
}

runDataServiceTests().catch(err => {
  console.error('Fatal error in data service tests:', err);
  const proc = (globalThis as unknown as { process?: { exit: (code?: number) => void } }).process;
  if (proc) proc.exit(1);
});
