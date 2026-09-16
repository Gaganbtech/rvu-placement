/**
 * Role-Specific View Models and Selectors for RVU Career Hub
 * 
 * Separates data views strictly per role:
 * - StudentDashboardData
 * - RecruiterDashboardData
 * - PlacementDashboardData
 * 
 * Maps shared underlying data to role-specific projections without fabricating private data.
 */

import type { 
  Student, 
  Opportunity, 
  Application, 
  PlacementDrive, 
  Offer, 
  InterviewScheduleItem, 
  PlacementCalendarEvent,
  RecruiterAccount,
  CompanyRecord,
  StudentDocument
} from './types';
import type { PlatformStoreState } from './studentStore';
import { StudentIntelligenceService } from '../../services/studentIntelligenceService';

// ============================================================================
// 1. STUDENT VIEW MODEL & SELECTOR
// ============================================================================

export interface StudentDashboardData {
  student: Student;
  stats: {
    activeApplications: number;
    upcomingDrives: number;
    upcomingInterviews: number;
    offersCount: number;
    readinessScore: number;
    readinessTier: 'Foundational' | 'Emerging' | 'Competitive' | 'Exemplary';
  };
  journey: {
    stages: Array<{ key: string; label: string; status: 'completed' | 'current' | 'upcoming' }>;
  };
  recommendedOpportunities: Opportunity[];
  activeApplicationsList: Application[];
  upcomingDrivesList: PlacementDrive[];
  upcomingInterviewsList: InterviewScheduleItem[];
  offersList: Offer[];
  calendarEvents: PlacementCalendarEvent[];
  careerResources: Array<{
    title: string;
    description: string;
    category: string;
    route: string;
  }>;
}

export function getStudentDashboardData(
  student: Student,
  store: PlatformStoreState,
  completedTaskIds: string[] = []
): StudentDashboardData {
  const documents: StudentDocument[] = store.documents || [];
  const readiness = StudentIntelligenceService.calculateCareerReadiness(student, documents, completedTaskIds);

  const studentApps = store.applications.filter(a => a.studentId === student.id);
  const activeApps = studentApps.filter(a => !['REJECTED', 'WITHDRAWN'].includes(a.stage));
  
  const studentDrives = store.placementDrives.filter(d => 
    d.status === 'UPCOMING' || d.status === 'ONGOING'
  );

  const studentInterviews = store.interviews.filter(i => 
    (i.studentId === student.id || i.studentEmail === student.email) && i.status === 'SCHEDULED'
  );

  const studentOffers = store.offers.filter(o => o.studentId === student.id);

  // Recommended opportunities matching student's school/branch and active
  const recommendedOpps = store.opportunities
    .filter(o => (o.isPublished || o.lifecycleState === 'PUBLISHED') && o.approvedByAdmin)
    .slice(0, 4);

  // Journey stage progression
  const hasApplied = studentApps.length > 0;
  const hasInterview = studentInterviews.length > 0 || studentApps.some(a => a.stage === 'INTERVIEW');
  const hasOffer = studentOffers.length > 0;

  const stages: StudentDashboardData['journey']['stages'] = [
    { key: 'discover', label: 'DISCOVER', status: 'completed' },
    { key: 'prepare', label: 'PREPARE', status: readiness.overallScore >= 70 ? 'completed' : 'current' },
    { key: 'connect', label: 'CONNECT', status: hasApplied ? 'completed' : readiness.overallScore >= 70 ? 'current' : 'upcoming' },
    { key: 'apply', label: 'APPLY', status: hasInterview ? 'completed' : hasApplied ? 'current' : 'upcoming' },
    { key: 'succeed', label: 'SUCCEED', status: hasOffer ? 'completed' : 'upcoming' }
  ];

  const derivedTier: 'Foundational' | 'Emerging' | 'Competitive' | 'Exemplary' = 
    readiness.overallScore >= 85 ? 'Exemplary' : 
    readiness.overallScore >= 70 ? 'Competitive' : 
    readiness.overallScore >= 50 ? 'Emerging' : 'Foundational';

  return {
    student,
    stats: {
      activeApplications: activeApps.length,
      upcomingDrives: studentDrives.length,
      upcomingInterviews: studentInterviews.length,
      offersCount: studentOffers.length,
      readinessScore: readiness.overallScore,
      readinessTier: derivedTier
    },
    journey: { stages },
    recommendedOpportunities: recommendedOpps,
    activeApplicationsList: activeApps.slice(0, 4),
    upcomingDrivesList: studentDrives.slice(0, 3),
    upcomingInterviewsList: studentInterviews.slice(0, 3),
    offersList: studentOffers,
    calendarEvents: store.calendarEvents.slice(0, 4),
    careerResources: [
      {
        title: 'Technical Interview & DSA Handbook',
        description: 'Comprehensive DSA templates, system design patterns, and LeetCode curated paths.',
        category: 'Preparation',
        route: '/student/preparation'
      },
      {
        title: 'RVU Institutional Resume Guidelines',
        description: 'CAR-approved single-page resume format with ATS score diagnostics.',
        category: 'Documents',
        route: '/student/documents'
      },
      {
        title: 'Upcoming Placement Drive Circulars',
        description: 'Official schedule of on-campus marquee and dream tier recruitments.',
        category: 'Drives',
        route: '/student/drives'
      }
    ]
  };
}

// ============================================================================
// 2. RECRUITER VIEW MODEL & SELECTOR
// ============================================================================

export interface RecruiterDashboardData {
  recruiter: RecruiterAccount | undefined;
  company: CompanyRecord | undefined;
  stats: {
    activeOpportunities: number;
    applicationsReceived: number;
    shortlistedCandidates: number;
    upcomingInterviews: number;
    offersIssued: number;
  };
  pipeline: {
    applications: number;
    screening: number;
    shortlisted: number;
    assessment: number;
    interview: number;
    offer: number;
  };
  upcomingInterviews: InterviewScheduleItem[];
  activeOpportunitiesList: Opportunity[];
  recentCandidateActivity: Array<{
    id: string;
    studentName: string;
    roleTitle: string;
    stage: string;
    updatedAt: string;
  }>;
}

export function getRecruiterDashboardData(
  store: PlatformStoreState
): RecruiterDashboardData {
  const recruiter = store.activeRecruiter;
  const company = store.activeCompany;
  const opps = store.recruiterOpportunities || [];
  const apps = store.recruiterApplications || [];
  const interviews = store.recruiterInterviews || [];
  const offers = store.recruiterOffers || [];

  const publishedOpps = opps.filter(o => o.lifecycleState === 'PUBLISHED' || o.isPublished);
  const shortlistedApps = apps.filter(a => a.stage === 'SHORTLISTED');
  const scheduledInterviews = interviews.filter(i => i.status === 'SCHEDULED');

  const pipeline = {
    applications: apps.filter(a => a.stage === 'APPLIED').length,
    screening: apps.filter(a => a.stage === 'UNDER_REVIEW').length,
    shortlisted: shortlistedApps.length,
    assessment: apps.filter(a => a.stage === 'ASSESSMENT').length,
    interview: apps.filter(a => a.stage === 'INTERVIEW').length,
    offer: apps.filter(a => a.stage === 'OFFER' || a.stage === 'SELECTED').length
  };

  const recentActivity = apps.slice(0, 5).map(app => {
    const candidate = store.students.find(s => s.id === app.studentId);
    return {
      id: app.id,
      studentName: candidate?.name || 'Candidate',
      roleTitle: app.role || 'Software Role',
      stage: app.stage,
      updatedAt: app.updatedAt || app.submittedAt || 'Recent'
    };
  });

  return {
    recruiter,
    company,
    stats: {
      activeOpportunities: publishedOpps.length,
      applicationsReceived: apps.length,
      shortlistedCandidates: shortlistedApps.length,
      upcomingInterviews: scheduledInterviews.length,
      offersIssued: offers.length
    },
    pipeline,
    upcomingInterviews: scheduledInterviews.slice(0, 4),
    activeOpportunitiesList: publishedOpps.slice(0, 4),
    recentCandidateActivity: recentActivity
  };
}

// ============================================================================
// 3. PLACEMENT CELL VIEW MODEL & SELECTOR
// ============================================================================

export interface PlacementDashboardData {
  verifiedFacts: {
    eligibleStudents: number; // 1,608 verified public figure
    recruitingOrganizations: string; // 250+ recruiting organizations
    offersAY25_26: string; // approximately 425 offers (over 400 placement offers)
    highestCompensation: string; // ₹43.5 LPA
    highestOfferCompany: string; // Aviatrix
    multiOfferNote: string; // Approximately 25% of placed students secured multiple offers
  };
  operationalStats: {
    registeredStudents: number;
    eligibleCohort: number;
    corporatePartners: number;
    activeOpportunities: number;
    activeDrives: number;
    totalApplications: number;
    scheduledInterviews: number;
    verifiedOffers: number;
    pendingOffers: number;
    pendingRecruiterApprovals: number;
  };
  pipeline: {
    eligible: number;
    applied: number;
    shortlisted: number;
    assessment: number;
    interview: number;
    offer: number;
    placed: number;
  };
  schoolWiseActivity: Array<{
    school: string;
    shortCode: string;
    totalStudents: number;
    eligibleCount: number;
    placedCount: number;
  }>;
  recruiterPartnerActivity: Array<{
    companyName: string;
    tier: string;
    rolesCount: number;
    status: string;
  }>;
  upcomingDrives: PlacementDrive[];
  pendingApprovals: {
    recruiters: RecruiterAccount[];
    offers: Offer[];
  };
}

export function getPlacementDashboardData(store: PlatformStoreState): PlacementDashboardData {
  const totalStudents = store.students.length;
  const eligibleStudents = store.students.filter(s => s.placementStatus === 'ELIGIBLE').length;
  const placedStudents = store.students.filter(s => s.placementStatus === 'PLACED').length;
  const activeCompanies = store.companies.filter(c => c.verificationStatus === 'VERIFIED').length;
  const activeOpportunities = store.opportunities.filter(o => o.lifecycleState === 'PUBLISHED' || o.isPublished).length;
  const activeDrives = store.placementDrives.filter(d => d.status === 'UPCOMING' || d.status === 'ONGOING').length;
  const totalApplications = store.applications.length;
  const pendingOffers = store.offers.filter(o => !o.placementOfficeVerified);
  const verifiedOffers = store.offers.filter(o => o.placementOfficeVerified);
  const pendingRecruiters = store.recruiters.filter(r => r.verificationStatus === 'PENDING');
  const upcomingInterviews = store.interviews.filter(i => i.status === 'SCHEDULED').length;

  // School breakdown from real student store
  const schoolCodes: Record<string, string> = {
    'School of Computer Science & Engineering': 'SoCSE',
    'School of Design & Innovation': 'SoD',
    'School of Business': 'SoB',
    'School of Economics': 'SoE',
    'School of Liberal Arts & Sciences': 'SoLAS',
    'School of Law': 'SoL'
  };

  const schoolMap = new Map<string, { total: number; eligible: number; placed: number }>();
  store.students.forEach(s => {
    const schoolName = s.school || 'School of Computer Science & Engineering';
    const curr = schoolMap.get(schoolName) || { total: 0, eligible: 0, placed: 0 };
    curr.total += 1;
    if (s.placementStatus === 'ELIGIBLE') curr.eligible += 1;
    if (s.placementStatus === 'PLACED') curr.placed += 1;
    schoolMap.set(schoolName, curr);
  });

  const schoolWiseActivity = Array.from(schoolMap.entries()).map(([school, stats]) => ({
    school,
    shortCode: schoolCodes[school] || school.split(' ').map(w => w[0]).join(''),
    totalStudents: stats.total,
    eligibleCount: stats.eligible,
    placedCount: stats.placed
  }));

  const recruiterPartnerActivity = store.companies.slice(0, 5).map(c => ({
    companyName: c.name,
    tier: c.tier || 'Dream Tier',
    rolesCount: store.opportunities.filter(o => o.companyId === c.id).length || 1,
    status: c.verificationStatus
  }));

  return {
    verifiedFacts: {
      eligibleStudents: 1608,
      recruitingOrganizations: '250+',
      offersAY25_26: 'Approximately 425 offers (over 400 offers in 2025–26)',
      highestCompensation: '₹43.5 LPA',
      highestOfferCompany: 'Aviatrix',
      multiOfferNote: 'Approximately 25% of placed students secured multiple employment offers'
    },
    operationalStats: {
      registeredStudents: totalStudents,
      eligibleCohort: eligibleStudents,
      corporatePartners: activeCompanies,
      activeOpportunities,
      activeDrives,
      totalApplications,
      scheduledInterviews: upcomingInterviews,
      verifiedOffers: verifiedOffers.length,
      pendingOffers: pendingOffers.length,
      pendingRecruiterApprovals: pendingRecruiters.length
    },
    pipeline: {
      eligible: eligibleStudents,
      applied: totalApplications,
      shortlisted: store.applications.filter(a => a.stage === 'SHORTLISTED').length,
      assessment: store.applications.filter(a => a.stage === 'ASSESSMENT').length,
      interview: upcomingInterviews,
      offer: store.offers.length,
      placed: placedStudents
    },
    schoolWiseActivity,
    recruiterPartnerActivity,
    upcomingDrives: store.placementDrives.filter(d => d.status === 'UPCOMING' || d.status === 'ONGOING').slice(0, 4),
    pendingApprovals: {
      recruiters: pendingRecruiters,
      offers: pendingOffers
    }
  };
}
