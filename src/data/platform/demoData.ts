/**
 * RVU CAREER HUB — Institutional Reference Data & Initial Empty Collections
 * 
 * ZERO FAKE / DEMO DATA COMMITMENT:
 * All collections are initialized to empty arrays.
 * Production data is fetched directly from Supabase tables with Row-Level Security (RLS).
 */

import type { 
  Student, 
  Opportunity, 
  PlacementDrive, 
  Application, 
  Offer, 
  StudentDocument, 
  PlacementNotification, 
  PlacementAnnouncement, 
  SupportTicket, 
  PlacementCalendarEvent,
  RecruiterAccount,
  CompanyRecord,
  InterviewScheduleItem,
  StudentImportRecord,
  ActivityLog,
  PlacementPolicySettings,
  RecruiterAssessment,
  RecruiterMessage,
  RecruiterNotification
} from './types';

export const EMPTY_STUDENT: Student = {
  id: 'RVU-PENDING',
  name: 'Authenticated Student',
  email: 'student@rvu.edu.in',
  isDemo: false,
  school: 'School of Computer Science and Engineering',
  programme: 'B.Tech Computer Science and Engineering',
  academicYear: '3rd Year (Semester VI)',
  batch: '2022 - 2026',
  graduationYear: 2026,
  cgpa: 0,
  activeBacklogs: 0,
  attendancePercentage: 0,
  placementStatus: 'NOT_STARTED',
  eligibilityStatus: 'ELIGIBLE',
  eligibilityDriveScope: 'AY 2026–27 Placement Drives',
  eligibilityRemarks: 'Awaiting verified profile submission',
  verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
  verifiedDate: new Date().toISOString(),
  readinessScore: 0,
  readinessBreakdown: {
    profile: 0,
    resume: 0,
    skills: 0,
    technicalPrep: 0,
    communication: 0,
    interviewPrep: 0
  },
  skills: [],
  skillsToDevelop: [],
  projects: [],
  careerPreferences: {
    preferredRoles: [],
    preferredLocations: [],
    workMode: ['On-site', 'Hybrid'],
    expectedCTCMinLPA: 0
  }
};

// All collections start completely empty — zero hardcoded fake records
export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_RECRUITERS: RecruiterAccount[] = [];
export const INITIAL_COMPANIES: CompanyRecord[] = [];
export const INITIAL_OPPORTUNITIES: Opportunity[] = [];
export const INITIAL_APPLICATIONS: Application[] = [];
export const INITIAL_DRIVES: PlacementDrive[] = [];
export const INITIAL_INTERVIEWS: InterviewScheduleItem[] = [];
export const INITIAL_OFFERS: Offer[] = [];
export const INITIAL_NOTIFICATIONS: PlacementNotification[] = [];
export const INITIAL_ANNOUNCEMENTS: PlacementAnnouncement[] = [];
export const INITIAL_DOCUMENTS: StudentDocument[] = [];
export const INITIAL_TICKETS: SupportTicket[] = [];
export const INITIAL_CALENDAR_EVENTS: PlacementCalendarEvent[] = [];
export const INITIAL_IMPORT_HISTORY: StudentImportRecord[] = [];
export const INITIAL_AUDIT_LOGS: ActivityLog[] = [];
export const INITIAL_ASSESSMENTS: RecruiterAssessment[] = [];
export const INITIAL_RECRUITER_MESSAGES: RecruiterMessage[] = [];
export const INITIAL_RECRUITER_NOTIFICATIONS: RecruiterNotification[] = [];

// Official RV University Academic Schools Directory
export const OFFICIAL_RVU_SCHOOLS = [
  'School of Computer Science and Engineering',
  'School of Business',
  'School of Design and Innovation',
  'School of Law',
  'School of Liberal Arts and Sciences',
  'School of Film, Media and Creative Arts',
  'School of Economics and Public Policy',
  'School of Continuing Education',
  'School of Architecture'
];

export const DEFAULT_POLICY_SETTINGS: PlacementPolicySettings = {
  minCgpaDefault: 6.5,
  maxBacklogsDefault: 0,
  minAttendancePercent: 75,
  allowMultipleOffers: true,
  dreamTierMinLPA: 12.0,
  marqueeTierMinLPA: 20.0,
  registrationWindowHours: 48,
  autoVerifySSOStudents: true,
  requireNOCForInternships: true,
  placementCycleYear: '2026–27',
  oneStudentOneJobRule: false,
  dreamJobMultiplier: 1.5,
  offerAcceptanceWindowDays: 3,
  officialSchools: OFFICIAL_RVU_SCHOOLS
};

// Audited Institutional Benchmark Metrics (AY 2025–26)
export const HISTORICAL_PLACEMENT_2025_26 = {
  academicYear: '2025-26',
  participatingSchools: 9,
  schoolsCount: 9,
  eligibleStudents: 1608,
  recruitingOrganizations: '250+',
  participatingRecruiters: '250+',
  totalOffers: '400+',
  highestCtcLpa: 43.5,
  highestPackage: '₹43.5 LPA (Aviatrix)',
  highestCtcCompany: 'Aviatrix',
  multipleOffersRate: '25%',
  multipleOffersRatePercentage: 25,
  placementDriveParticipationRate: '92%'
};
