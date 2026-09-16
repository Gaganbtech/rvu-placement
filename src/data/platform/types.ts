export type UserRole = 
  | 'STUDENT'
  | 'RECRUITER'
  | 'PLACEMENT_ADMIN'
  | 'PLACEMENT_COORDINATOR'
  | 'SUPER_ADMIN'
  | 'CAR_ADMIN'
  | 'COORDINATOR';

export type EligibilityStatus = 
  | 'ELIGIBLE' 
  | 'NOT_ELIGIBLE' 
  | 'UNDER_REVIEW';

export type OpportunityLifecycle = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'PUBLISHED' 
  | 'CLOSED'
  | 'ARCHIVED'
  | 'REJECTED';

export type OpportunityType = 
  | 'Placement' 
  | 'Internship' 
  | 'Internship + PPO'
  | 'Live Project'
  | 'Industry Mentoring'
  | 'Capstone Project'
  | 'International Internship';
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';

export type ApplicationStage = 
  | 'APPLIED' 
  | 'UNDER_REVIEW' 
  | 'SHORTLISTED' 
  | 'ASSESSMENT' 
  | 'INTERVIEW' 
  | 'SELECTED' 
  | 'OFFER' 
  | 'JOINED'
  | 'REJECTED' 
  | 'WITHDRAWN';

export type OfferStatus = 
  | 'OFFER_RECEIVED' 
  | 'OFFER_ACCEPTED' 
  | 'OFFER_DECLINED' 
  | 'OFFER_WITHDRAWN'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'JOINED';

export type PlacementOverallStatus = 
  | 'NOT_STARTED' 
  | 'ELIGIBLE' 
  | 'PARTICIPATING' 
  | 'SELECTED' 
  | 'PLACED' 
  | 'NOT_PLACED'
  | 'INELIGIBLE'
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'INTERVIEWING'
  | 'OFFERED'
  | 'OPTED_OUT';

export type PlacementStatus = PlacementOverallStatus;

export type NotificationCategory = 
  | 'PLACEMENT' 
  | 'APPLICATION' 
  | 'INTERVIEW' 
  | 'ANNOUNCEMENT' 
  | 'SYSTEM';

export type TicketCategory = 
  | 'ELIGIBILITY' 
  | 'APPLICATION' 
  | 'PLACEMENT_DRIVE' 
  | 'INTERVIEW' 
  | 'DOCUMENTS' 
  | 'TECHNICAL_ISSUE' 
  | 'OTHER';

export type TicketStatus = 
  | 'OPEN' 
  | 'UNDER_REVIEW' 
  | 'RESOLVED'
  | 'CLOSED';

// 1. Student Entity (University Placement Master Record)
export interface Student {
  id: string; // e.g., 'RVU2023CSE042'
  universityRegisterNumber?: string; // e.g., '2023BCSE042'
  name: string;
  email: string; // rvu email
  phone?: string;
  avatarUrl?: string;
  isDemo: boolean;
  isDeactivated?: boolean;
  deactivatedReason?: string;
  school: string;
  programme: string;
  specialization?: string;
  academicYear: string; // e.g., '3rd Year (Semester VI)'
  semester?: number;
  batch?: string; // e.g., '2023–2027'
  graduationYear: number; // e.g., 2027
  cgpa: number; // e.g., 8.42
  activeBacklogs: number; // 0
  attendancePercentage: number; // 88%
  
  // Placement Office Controlled Eligibility
  placementStatus: PlacementOverallStatus;
  eligibilityStatus: EligibilityStatus;
  eligibilityDriveScope: string; // '2026–27 Placement Drives'
  eligibilityRemarks: string;
  verifiedBy: string; // 'Corporate & Alumni Relations (CAR) Office'
  verifiedDate: string;

  // Career Readiness Score (Career preparation indicator, not probability)
  readinessScore: number; // 78
  readinessBreakdown: {
    profile: number;       // 95
    resume: number;        // 85
    skills: number;        // 75
    technicalPrep: number; // 70
    communication: number; // 72
    interviewPrep: number; // 68
  };

  // Student Profile Data
  skills: {
    id: string;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    category: 'Core Technical' | 'Framework' | 'Data & ML' | 'Soft Skills';
    isVerified: boolean;
  }[];

  skillsToDevelop: {
    id: string;
    name: string;
    currentLevel: number; // 1-5
    targetLevel: number;  // 1-5
    gap: string;
    recommendedResource: string;
  }[];

  projects: {
    id: string;
    title: string;
    role: string;
    techStack: string[];
    description: string;
    githubUrl?: string;
    liveUrl?: string;
    isVerified: boolean;
  }[];

  careerPreferences: {
    preferredRoles: string[];
    preferredLocations: string[];
    workMode: ('On-site' | 'Hybrid' | 'Remote')[];
    expectedCTCMinLPA: number;
  };

  internshipDetails?: {
    status: 'Not Started' | 'Seeking' | 'Ongoing' | 'Completed';
    company?: string;
    role?: string;
    duration?: string;
  };

  savedOpportunityIds?: string[];
  completedPreparationTaskIds?: string[];
}

// 2. Company Record
export interface CompanyRecord {
  id: string;
  name: string;
  logo?: string;
  logoUrl?: string;
  industry: string;
  headquarters: string;
  website: string;
  tier: 'Marquee' | 'Dream' | 'Core' | 'Mass';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  activeOpportunitiesCount: number;
  totalPlacements: number;
  highestPackageLPA: number;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  establishedYear?: number;
  overview?: string;
  description?: string;
}

export type RecruiterRole = 
  | 'COMPANY_ADMIN'
  | 'RECRUITER'
  | 'HIRING_MANAGER'
  | 'INTERVIEWER';

// 3. Recruiter Account
export interface RecruiterAccount {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  designation: string;
  email: string;
  phone: string;
  role?: RecruiterRole;
  department?: string;
  linkedIn?: string;
  avatarUrl?: string;
  status?: 'ACTIVE' | 'INVITED' | 'DEACTIVATED';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'INACTIVE';
  registeredDate?: string;
  lastActivity?: string;
  assignedDrivesCount?: number;
}

// 4. Opportunity Entity (Shared with Recruiter & Placement Office)
export interface Opportunity {
  id: string;
  recruiterId: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  role: string;
  department?: string;
  jobFunction?: string;
  type: OpportunityType;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  ctcLpa: string; // e.g. '₹14.0 - ₹18.0 LPA' or '₹60,000 / month Stipend'
  stipendPerMonth?: string;
  otherBenefits?: string;
  
  // Lifecycle
  lifecycleState: OpportunityLifecycle;
  isPublished: boolean;
  approvedByAdmin: boolean;
  approvedDate?: string;
  rejectionReason?: string;
  carReviewComments?: string;
  
  // Timeline
  timeline?: {
    applicationOpening?: string;
    applicationDeadline?: string;
    openingDate?: string;
    deadline?: string;
    assessmentDate?: string;
    interviewWindow?: string;
    expectedOfferDate?: string;
  };
  
  // Requirements & Eligibility
  eligibleSchools: string[];
  eligibleProgrammes: string[];
  eligibleGraduationYears: number[];
  minCgpa: number;
  maxBacklogsAllowed: number;
  requiredSkills: string[];
  niceToHaveSkills?: string[];
  description: string;
  responsibilities: string[];
  selectionProcess: {
    roundNumber: number;
    title: string;
    mode: 'Online' | 'In-person' | 'Hybrid';
    description: string;
  }[];
  
  applicationDeadline: string; // ISO date or display string
  driveDate: string;
  openingsCount?: number;
  matchScoreForDemoStudent?: number; // UI demo matching score
  source?: string;
  sourceUrl?: string;
  verifiedAt?: string;
}

// 5. Placement Drive Entity
export interface PlacementDrive {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  date: string;
  timeSlot: string;
  venue: string; // e.g. 'RVU Campus, Academic Block 2, Lab 401 & Aud-A' or 'Virtual'
  mode: 'On-Campus' | 'Virtual' | 'Hybrid';
  eligibleProgrammes: string[];
  associatedOpportunityIds: string[];
  status: 'DRAFT' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  instructions: string[];
  coordinatorContact: {
    name: string;
    role: string;
    email: string;
  };
  attendanceRoster?: {
    studentId: string;
    studentName: string;
    registeredAt: string;
    attendanceStatus: 'REGISTERED' | 'PRESENT' | 'ABSENT' | 'SHORTLISTED' | 'SELECTED';
  }[];
}

// 6. Application Entity (Shared Model across all 3 portals)
export interface Application {
  id: string; // e.g., 'DEMO-APP-0001'
  studentId: string;
  opportunityId: string;
  recruiterId: string;
  placementDriveId?: string;
  companyName: string;
  companyLogo: string;
  role: string;
  type: OpportunityType;
  location: string;
  compensation: string;
  
  // Current Status in Shared Pipeline
  stage: ApplicationStage;
  submittedAt: string;
  updatedAt: string;
  
  // Pipeline Timeline
  timeline: {
    stage: ApplicationStage;
    label: string;
    timestamp: string;
    completed: boolean;
    active: boolean;
    remarks?: string;
  }[];
  
  // Action Required for Student
  nextAction?: {
    title: string;
    description: string;
    deadline: string;
    actionUrl?: string;
    actionType?: 'ASSESSMENT' | 'INTERVIEW_CONFIRM' | 'DOCUMENT_UPLOAD' | 'OFFER_ACCEPT';
  };
  
  // Uploaded Candidate Resume Link
  resumeFileName?: string;
  resumeDataUrl?: string;
  resumeSize?: string;
  
  // Specific scheduled stage info (if reached)
  assessmentDetails?: {
    platform: string;
    durationMinutes: number;
    windowStart: string;
    windowEnd: string;
    instructions: string[];
    testLink?: string;
  };

  interviewDetails?: {
    roundNumber: number;
    roundTitle: string; // e.g. 'Technical Round 1: DSA & System Architecture'
    scheduledTime: string;
    mode: 'In-person' | 'Microsoft Teams' | 'Zoom' | 'Google Meet';
    venueOrLink: string;
    panel?: string; // Generic panel, no private recruiter names
    status: 'SCHEDULED' | 'RESCHEDULED' | 'COMPLETED';
  };

  offerDetails?: {
    offerId: string;
    ctcLpa: string;
    designation: string;
    joiningDate: string;
    expiryDate: string;
    status: OfferStatus;
    offerLetterUrl: string;
  };
}

// 7. Offer Entity
export interface Offer {
  id: string;
  applicationId: string;
  studentId: string;
  studentName?: string;
  companyName: string;
  companyLogo: string;
  role: string;
  ctcLpa: string;
  baseSalary?: string;
  joiningBonus?: string;
  stockOptions?: string;
  location: string;
  offerDate: string;
  acceptanceDeadline: string;
  joiningDate?: string;
  status: OfferStatus;
  offerLetterUrl: string;
  termsSummary: string[];
  placementOfficeVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

// 8. Documents Entity
export interface StudentDocument {
  id: string;
  studentId: string;
  type: 'RESUME' | 'TRANSCRIPT' | 'CERTIFICATE' | 'PORTFOLIO' | 'GOVT_ID';
  title: string;
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED';
  isActiveForApplications?: boolean;
  downloadUrl: string;
  fileDataUrl?: string;
}

// 9. Notifications Entity
export interface PlacementNotification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  origin: 'PLACEMENT_OFFICE' | 'RECRUITER' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
}

// 10. Placement Office Announcements Entity
export interface PlacementAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  category: 'Drive Briefing' | 'Policy' | 'Deadline' | 'General';
  targetAudience?: 'ALL' | 'CSE' | 'DESIGN' | 'BUSINESS' | 'LAW' | 'DRIVE_PARTICIPANTS';
  publishedDate: string;
  publishedBy: string; // e.g., 'Corporate & Alumni Relations (CAR)'
  isMandatory: boolean;
  attachmentName?: string;
  expiryDate?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'EXPIRED';
}

// 11. Support / Query Ticket Entity
export interface SupportTicket {
  id: string; // 'TICK-2026-084'
  studentId: string;
  studentName?: string;
  subject: string;
  category: TicketCategory;
  description: string;
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
  respondedAt?: string;
  assignedOfficer?: string;
}

// 12. Calendar Event Entity
export interface PlacementCalendarEvent {
  id: string;
  title: string;
  eventType: 'PLACEMENT_DRIVE' | 'ASSESSMENT' | 'INTERVIEW' | 'WORKSHOP' | 'PRE_PLACEMENT_TALK' | 'DEADLINE';
  date: string;
  startTime: string;
  endTime: string;
  companyName?: string;
  venueOrLink: string;
  description: string;
  isMandatory: boolean;
}

// 13. Audit Log Entry (Institutional Audit Trail)
export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string; // 'CAR Admin' | 'Student' | 'Recruiter'
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  entityId?: string;
  details: string;
}

// 14. Excel Student Batch Import Record
export interface StudentImportRecord {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  timestamp: string;
  totalRows: number;
  addedCount: number;
  updatedCount: number;
  warningCount: number;
  errorCount: number;
  status: 'COMPLETED' | 'COMPLETED_WITH_WARNINGS' | 'FAILED';
  errorDetails?: {
    rowNumber: number;
    studentId?: string;
    studentName?: string;
    field: string;
    message: string;
    severity: 'ERROR' | 'WARNING';
  }[];
}

// 15. Interview Scheduling Record
export interface InterviewScheduleItem {
  id: string;
  applicationId: string;
  companyId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  programme: string;
  companyName: string;
  role: string;
  roundNumber: number;
  roundTitle: string;
  date: string;
  timeSlot: string;
  mode: 'In-person' | 'Microsoft Teams' | 'Zoom' | 'Google Meet';
  venueOrLink: string;
  interviewerName: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED' | 'NO_SHOW';
  remarks?: string;
  evaluation?: {
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
    overallScore: number;
    recommendation: 'STRONG_HIRE' | 'HIRE' | 'HOLD' | 'REJECT';
    notes: string;
    evaluatedAt?: string;
    submittedAt?: string;
    evaluatorName?: string;
  };
}

// 16. Configurable Placement Policy Settings
export interface PlacementPolicySettings {
  minCgpaDefault: number;
  maxBacklogsDefault: number;
  minAttendancePercent: number;
  allowMultipleOffers: boolean;
  dreamTierMinLPA: number;
  marqueeTierMinLPA: number;
  registrationWindowHours: number;
  autoVerifySSOStudents: boolean;
  requireNOCForInternships: boolean;
  placementCycleYear: string;
  oneStudentOneJobRule: boolean;
  dreamJobMultiplier: number;
  offerAcceptanceWindowDays: number;
  officialSchools: string[];
}

// 17. Validated Excel Import Row
export interface ValidatedImportRow {
  rowNumber: number;
  raw: Record<string, any>;
  studentId: string;
  name: string;
  email: string;
  school: string;
  programme: string;
  batch: string;
  graduationYear: number;
  cgpa: number;
  activeBacklogs: number;
  eligibilityStatus: EligibilityStatus;
  placementStatus: PlacementOverallStatus;
  status: 'NEW' | 'UPDATE' | 'WARNING' | 'ERROR';
  errors: string[];
  warnings: string[];
  transformedStudent?: Partial<Student>;
}

// 18. Recruiter Assessment Stage
export interface RecruiterAssessment {
  id: string;
  opportunityId: string;
  companyId: string;
  name?: string;
  title: string;
  role?: string;
  type?: string;
  platform: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  durationMinutes: number;
  totalMarks?: number;
  passingMarks?: number;
  passThresholdScore?: number;
  instructions: string[];
  questionsCount?: number;
  status: 'Scheduled' | 'Open' | 'Completed' | 'Evaluated' | 'Cancelled' | 'ACTIVE' | 'UPCOMING';
  candidates: {
    applicationId: string;
    studentId: string;
    studentName: string;
    studentEmail?: string;
    programme?: string;
    cgpa?: number;
    score?: number;
    status: 'PENDING' | 'EVALUATED' | 'ABSENT';
    submittedAt?: string;
    proctoringFlags?: number;
    feedback?: string;
    evaluatedBy?: string;
  }[];
  candidateResults?: {
    candidateId: string;
    candidateName: string;
    score?: number;
    maxScore: number;
    result: 'Pending' | 'Passed' | 'Failed' | 'Under Review';
    completedAt?: string;
    evaluationNotes?: string;
  }[];
}

// 19. Controlled Recruiter Messaging
export interface RecruiterMessage {
  id: string;
  companyId: string;
  recruiterId?: string;
  senderId?: string;
  senderName?: string;
  senderRole?: string;
  receiverType?: 'CAR' | 'CANDIDATE' | 'TEAM' | 'RECRUITER';
  receiverId?: string;
  receiverName?: string;
  recipientType?: 'CAR' | 'CANDIDATE' | 'RECRUITER';
  recipientId?: string;
  recipientName?: string;
  subject: string;
  content?: string;
  message?: string;
  timestamp: string;
  category?: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
  isRead?: boolean;
  isUrgent?: boolean;
}

// 20. Recruiter Notifications
export interface RecruiterNotification {
  id: string;
  companyId: string;
  recruiterId?: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionRoute?: string;
  type: 
    | 'OPPORTUNITY_APPROVED' 
    | 'OPPORTUNITY_CHANGES_REQUESTED' 
    | 'NEW_APPLICATION' 
    | 'CANDIDATE_SHORTLISTED' 
    | 'INTERVIEW_SCHEDULED' 
    | 'OFFER_VERIFIED' 
    | 'DRIVE_APPROVED'
    | 'APPLICATION'
    | 'OPPORTUNITY_STATUS'
    | 'DRIVE'
    | 'ASSESSMENT'
    | 'OFFER_STATUS'
    | 'CAR_COMMUNICATION';
}

// 21. Career Preparation Data Models
export type PreparationCategory = 
  | 'APTITUDE'
  | 'TECHNICAL'
  | 'CODING'
  | 'COMMUNICATION'
  | 'INTERVIEW'
  | 'RESUME'
  | 'GROUP_DISCUSSION'
  | 'DOMAIN';

export interface PreparationTask {
  id: string;
  category: PreparationCategory;
  trackId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  isCompleted: boolean;
  learningPoints: string[];
  resourceLink?: string;
}

export interface PreparationTrack {
  id: string;
  category: PreparationCategory;
  title: string;
  description: string;
  iconName: string;
  tasksCount: number;
  completedTasksCount: number;
  tasks: PreparationTask[];
}

export interface InterviewPrepQuestion {
  id: string;
  category: 'Behavioral' | 'Technical' | 'Situational' | 'Leadership';
  question: string;
  guidance: string;
  starFramework: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  sampleAnswerSummary?: string;
}

export interface StudentSearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Opportunity' | 'Application' | 'Drive' | 'Preparation' | 'Resource' | 'Document' | 'Event';
  route: string;
  badge?: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  route?: string;
  actionKey?: string;
  iconName: string;
}


