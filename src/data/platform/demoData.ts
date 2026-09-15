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
  CompanyRecord,
  RecruiterAccount,
  InterviewScheduleItem,
  StudentImportRecord,
  ActivityLog,
  PlacementPolicySettings,
  RecruiterAssessment,
  RecruiterMessage,
  RecruiterNotification
} from './types';

// DEMO STUDENT (Authentic RVU School & Programme, marked as DEMO)
export const DEMO_STUDENT: Student = {
  id: 'RVU2023CSE042',
  universityRegisterNumber: '2023BCSE042',
  name: 'Demo Student',
  email: 'demo.student@rvu.edu.in',
  phone: '+91 98860 12345',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  isDemo: true,
  school: 'School of Computer Science & Engineering',
  programme: 'B.Tech (Hons.) Computer Science & Engineering',
  specialization: 'Artificial Intelligence & Distributed Systems',
  academicYear: '3rd Year (Semester VI)',
  semester: 6,
  batch: '2023–2027',
  graduationYear: 2027,
  cgpa: 8.42,
  activeBacklogs: 0,
  attendancePercentage: 88,

  // Authority Layer: Placement Office (CAR)
  placementStatus: 'PARTICIPATING',
  eligibilityStatus: 'ELIGIBLE',
  eligibilityDriveScope: '2026–27 Placement Drives',
  eligibilityRemarks: 'Academic criteria verified. Zero backlogs. Institutional clearance granted by CAR Office.',
  verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
  verifiedDate: '15 Aug 2026',

  // Career Readiness Score
  readinessScore: 78,
  readinessBreakdown: {
    profile: 95,
    resume: 85,
    skills: 75,
    technicalPrep: 70,
    communication: 72,
    interviewPrep: 68
  },

  skills: [
    { id: 'sk-1', name: 'React', level: 'Advanced', category: 'Framework', isVerified: true },
    { id: 'sk-2', name: 'JavaScript', level: 'Advanced', category: 'Core Technical', isVerified: true },
    { id: 'sk-3', name: 'Python', level: 'Intermediate', category: 'Core Technical', isVerified: true },
    { id: 'sk-4', name: 'Git', level: 'Advanced', category: 'Core Technical', isVerified: true },
    { id: 'sk-5', name: 'Node.js', level: 'Intermediate', category: 'Framework', isVerified: true },
    { id: 'sk-6', name: 'REST APIs', level: 'Intermediate', category: 'Core Technical', isVerified: true },
  ],

  skillsToDevelop: [
    {
      id: 'skd-1',
      name: 'SQL & Database Optimization',
      currentLevel: 2,
      targetLevel: 4,
      gap: 'Medium (Indexing, Query Optimization)',
      recommendedResource: 'RVU Advanced Relational Systems Lab & LeetCode SQL 50'
    },
    {
      id: 'skd-2',
      name: 'Data Structures & Algorithms',
      currentLevel: 3,
      targetLevel: 5,
      gap: 'Moderate (Dynamic Programming, Graphs)',
      recommendedResource: 'RVU CodeForge Bootcamp - Module 4 Graph Algorithms'
    },
    {
      id: 'skd-3',
      name: 'System Design Principles',
      currentLevel: 2,
      targetLevel: 4,
      gap: 'High (Distributed Caching, Load Balancing)',
      recommendedResource: 'Alex Xu Systems Lab & RVU Cloud Architecture Seminar'
    }
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'Autonomous Drone Fleet Telemetry Dashboard',
      role: 'Lead Frontend & Systems Architect',
      techStack: ['React', 'TypeScript', 'WebSockets', 'TailwindCSS'],
      description: 'Real-time telemetry monitor visualizing drone flight paths, battery degradation, and failover states with sub-50ms latency.',
      githubUrl: 'https://github.com/rvu-demo/drone-telemetry',
      isVerified: true
    },
    {
      id: 'proj-2',
      title: 'Decentralized Academic Credential Verifier',
      role: 'Full Stack Engineer',
      techStack: ['Node.js', 'PostgreSQL', 'Express', 'Docker'],
      description: 'Zero-knowledge proof credential verification tool built for university transcript validation.',
      githubUrl: 'https://github.com/rvu-demo/academic-verifier',
      isVerified: true
    }
  ],

  careerPreferences: {
    preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Cloud Platform Engineer'],
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Pune'],
    workMode: ['Hybrid', 'On-site'],
    expectedCTCMinLPA: 12.0
  },

  internshipDetails: {
    status: 'Seeking',
    duration: 'Summer 2026'
  }
};

// INITIAL STUDENT MASTER LIST (Central Placement Master Data across 9 Schools)
export const INITIAL_STUDENTS: Student[] = [
  DEMO_STUDENT,
  {
    id: 'RVU2023CSE007',
    universityRegisterNumber: '2023BCSE007',
    name: 'Ananya Krishnan',
    email: 'ananya.k@rvu.edu.in',
    phone: '+91 98860 23456',
    isDemo: true,
    school: 'School of Computer Science & Engineering',
    programme: 'B.Tech (Hons.) Computer Science & Engineering',
    specialization: 'Cloud Computing & Cyber Security',
    academicYear: '3rd Year (Semester VI)',
    semester: 6,
    batch: '2023–2027',
    graduationYear: 2027,
    cgpa: 9.15,
    activeBacklogs: 0,
    attendancePercentage: 94,
    placementStatus: 'SELECTED',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDriveScope: '2026–27 Placement Drives',
    eligibilityRemarks: 'Academic excellence clearance. Dean recommendation for Marquee tiers.',
    verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
    verifiedDate: '15 Aug 2026',
    readinessScore: 92,
    readinessBreakdown: { profile: 100, resume: 95, skills: 90, technicalPrep: 88, communication: 90, interviewPrep: 89 },
    skills: [
      { id: 'sk-11', name: 'Go', level: 'Advanced', category: 'Core Technical', isVerified: true },
      { id: 'sk-12', name: 'Kubernetes', level: 'Intermediate', category: 'Framework', isVerified: true },
      { id: 'sk-13', name: 'Python', level: 'Advanced', category: 'Core Technical', isVerified: true }
    ],
    skillsToDevelop: [],
    projects: [
      {
        id: 'proj-11',
        title: 'High-Throughput Distributed Raft Key-Value Store',
        role: 'Core Systems Developer',
        techStack: ['Go', 'gRPC', 'Protobuf'],
        description: 'Fault-tolerant distributed storage cluster with automated leader election and snapshot compaction.',
        isVerified: true
      }
    ],
    careerPreferences: {
      preferredRoles: ['Distributed Systems Engineer', 'Cloud Infrastructure Associate'],
      preferredLocations: ['Bengaluru'],
      workMode: ['Hybrid'],
      expectedCTCMinLPA: 16.0
    }
  },
  {
    id: 'RVU2023CSE089',
    universityRegisterNumber: '2023BCSE089',
    name: 'Rohan Verma',
    email: 'rohan.v@rvu.edu.in',
    phone: '+91 98860 34567',
    isDemo: true,
    school: 'School of Computer Science & Engineering',
    programme: 'B.Tech (Hons.) Computer Science & Engineering',
    specialization: 'Data Science & Machine Learning',
    academicYear: '3rd Year (Semester VI)',
    semester: 6,
    batch: '2023–2027',
    graduationYear: 2027,
    cgpa: 7.80,
    activeBacklogs: 0,
    attendancePercentage: 82,
    placementStatus: 'PARTICIPATING',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDriveScope: '2026–27 Placement Drives',
    eligibilityRemarks: 'Verified for Core and Dream campus drives.',
    verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
    verifiedDate: '15 Aug 2026',
    readinessScore: 74,
    readinessBreakdown: { profile: 90, resume: 80, skills: 72, technicalPrep: 70, communication: 75, interviewPrep: 66 },
    skills: [
      { id: 'sk-21', name: 'Python', level: 'Advanced', category: 'Core Technical', isVerified: true },
      { id: 'sk-22', name: 'PyTorch', level: 'Intermediate', category: 'Data & ML', isVerified: true }
    ],
    skillsToDevelop: [],
    projects: [],
    careerPreferences: {
      preferredRoles: ['ML Ops Engineer', 'Backend Developer'],
      preferredLocations: ['Bengaluru', 'Pune'],
      workMode: ['On-site', 'Hybrid'],
      expectedCTCMinLPA: 10.0
    }
  },
  {
    id: 'RVU2023CSE112',
    universityRegisterNumber: '2023BCSE112',
    name: 'Vikram Menon',
    email: 'vikram.m@rvu.edu.in',
    phone: '+91 98860 45678',
    isDemo: true,
    school: 'School of Computer Science & Engineering',
    programme: 'B.Tech (Hons.) Computer Science & Engineering',
    academicYear: '3rd Year (Semester VI)',
    semester: 6,
    batch: '2023–2027',
    graduationYear: 2027,
    cgpa: 6.45,
    activeBacklogs: 1,
    attendancePercentage: 71,
    placementStatus: 'NOT_STARTED',
    eligibilityStatus: 'NOT_ELIGIBLE',
    eligibilityDriveScope: 'Eligibility Withheld (CAR Review Required)',
    eligibilityRemarks: 'CGPA is below minimum threshold (7.0) and active backlog pending in Operating Systems.',
    verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
    verifiedDate: '20 Aug 2026',
    readinessScore: 58,
    readinessBreakdown: { profile: 70, resume: 65, skills: 60, technicalPrep: 50, communication: 65, interviewPrep: 52 },
    skills: [{ id: 'sk-31', name: 'Java', level: 'Intermediate', category: 'Core Technical', isVerified: true }],
    skillsToDevelop: [],
    projects: [],
    careerPreferences: {
      preferredRoles: ['Software QA Engineer'],
      preferredLocations: ['Bengaluru'],
      workMode: ['On-site'],
      expectedCTCMinLPA: 6.0
    }
  },
  {
    id: 'RVU2023DES014',
    universityRegisterNumber: '2023BDES014',
    name: 'Priya Nambiar',
    email: 'priya.n@rvu.edu.in',
    phone: '+91 98860 56789',
    isDemo: true,
    school: 'School of Design and Innovation',
    programme: 'B.Des. (Hons.) User Experience (UX)',
    academicYear: '3rd Year (Semester VI)',
    semester: 6,
    batch: '2023–2027',
    graduationYear: 2027,
    cgpa: 8.85,
    activeBacklogs: 0,
    attendancePercentage: 92,
    placementStatus: 'PARTICIPATING',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDriveScope: '2026–27 Placement Drives',
    eligibilityRemarks: 'UX portfolio audited by School of Design faculty liaison.',
    verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
    verifiedDate: '18 Aug 2026',
    readinessScore: 88,
    readinessBreakdown: { profile: 95, resume: 90, skills: 88, technicalPrep: 82, communication: 90, interviewPrep: 85 },
    skills: [
      { id: 'sk-41', name: 'Figma', level: 'Advanced', category: 'Framework', isVerified: true },
      { id: 'sk-42', name: 'Design Systems', level: 'Advanced', category: 'Core Technical', isVerified: true }
    ],
    skillsToDevelop: [],
    projects: [],
    careerPreferences: {
      preferredRoles: ['Product Designer', 'Interaction Designer'],
      preferredLocations: ['Bengaluru', 'Mumbai'],
      workMode: ['Hybrid'],
      expectedCTCMinLPA: 12.0
    }
  },
  {
    id: 'RVU2023BBA031',
    universityRegisterNumber: '2023BBBA031',
    name: 'Sanjana Roy',
    email: 'sanjana.r@rvu.edu.in',
    phone: '+91 98860 67890',
    isDemo: true,
    school: 'School of Business',
    programme: 'BBA (Hons.) Finance & Analytics',
    academicYear: '3rd Year (Semester VI)',
    semester: 6,
    batch: '2023–2027',
    graduationYear: 2027,
    cgpa: 8.65,
    activeBacklogs: 0,
    attendancePercentage: 90,
    placementStatus: 'PARTICIPATING',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDriveScope: '2026–27 Placement Drives',
    eligibilityRemarks: 'Financial modeling and equity research credentials verified.',
    verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
    verifiedDate: '16 Aug 2026',
    readinessScore: 84,
    readinessBreakdown: { profile: 92, resume: 88, skills: 80, technicalPrep: 80, communication: 88, interviewPrep: 82 },
    skills: [
      { id: 'sk-51', name: 'Financial Modeling', level: 'Advanced', category: 'Core Technical', isVerified: true },
      { id: 'sk-52', name: 'Excel & PowerBI', level: 'Advanced', category: 'Core Technical', isVerified: true }
    ],
    skillsToDevelop: [],
    projects: [],
    careerPreferences: {
      preferredRoles: ['Investment Banking Analyst', 'Financial Valuation Associate'],
      preferredLocations: ['Bengaluru', 'Mumbai'],
      workMode: ['On-site'],
      expectedCTCMinLPA: 11.0
    }
  },
  {
    id: 'RVU2023ECO003',
    universityRegisterNumber: '2023BECO003',
    name: 'Meera Sengupta',
    email: 'meera.s@rvu.edu.in',
    phone: '+91 98860 78901',
    isDemo: true,
    school: 'School of Economics and Public Policy',
    programme: 'B.Sc. (Hons.) Economics',
    academicYear: '3rd Year (Semester VI)',
    semester: 6,
    batch: '2023–2027',
    graduationYear: 2027,
    cgpa: 9.30,
    activeBacklogs: 0,
    attendancePercentage: 96,
    placementStatus: 'PARTICIPATING',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDriveScope: '2026–27 Placement Drives',
    eligibilityRemarks: 'Econometric thesis clearance and statistical computing validated.',
    verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
    verifiedDate: '15 Aug 2026',
    readinessScore: 91,
    readinessBreakdown: { profile: 98, resume: 92, skills: 90, technicalPrep: 88, communication: 94, interviewPrep: 86 },
    skills: [
      { id: 'sk-61', name: 'R', level: 'Advanced', category: 'Core Technical', isVerified: true },
      { id: 'sk-62', name: 'STATA', level: 'Advanced', category: 'Core Technical', isVerified: true },
      { id: 'sk-63', name: 'Econometrics', level: 'Advanced', category: 'Core Technical', isVerified: true }
    ],
    skillsToDevelop: [],
    projects: [],
    careerPreferences: {
      preferredRoles: ['Quantitative Research Analyst', 'Economic Consultant'],
      preferredLocations: ['Bengaluru', 'New Delhi'],
      workMode: ['Hybrid'],
      expectedCTCMinLPA: 14.0
    }
  },
  {
    id: 'RVU2023LAW022',
    universityRegisterNumber: '2023BLAW022',
    name: 'Arjun Kashyap',
    email: 'arjun.k@rvu.edu.in',
    phone: '+91 98860 89012',
    isDemo: true,
    school: 'School of Law',
    programme: 'B.Sc. (Hons.) Criminology, Cyber Law and Forensic Sciences',
    academicYear: '3rd Year (Semester VI)',
    semester: 6,
    batch: '2023–2027',
    graduationYear: 2027,
    cgpa: 8.20,
    activeBacklogs: 0,
    attendancePercentage: 86,
    placementStatus: 'PARTICIPATING',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDriveScope: '2026–27 Placement Drives',
    eligibilityRemarks: 'Cyber forensics laboratory credentials audited.',
    verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
    verifiedDate: '17 Aug 2026',
    readinessScore: 80,
    readinessBreakdown: { profile: 88, resume: 82, skills: 78, technicalPrep: 76, communication: 85, interviewPrep: 78 },
    skills: [
      { id: 'sk-71', name: 'Digital Forensics', level: 'Advanced', category: 'Core Technical', isVerified: true },
      { id: 'sk-72', name: 'GDPR & DPDP Act Compliance', level: 'Intermediate', category: 'Core Technical', isVerified: true }
    ],
    skillsToDevelop: [],
    projects: [],
    careerPreferences: {
      preferredRoles: ['Cyber Risk & Privacy Analyst', 'Regulatory Compliance Officer'],
      preferredLocations: ['Bengaluru'],
      workMode: ['Hybrid'],
      expectedCTCMinLPA: 10.0
    }
  }
];

// INITIAL RECRUITER ACCOUNTS
export const INITIAL_RECRUITERS: RecruiterAccount[] = [
  {
    id: 'REC-001',
    name: 'Rohit Deshmukh',
    companyId: 'COMP-001',
    companyName: 'TechnoSphere Systems',
    designation: 'Head of University Relations',
    role: 'COMPANY_ADMIN',
    department: 'University Relations & Emerging Talent',
    email: 'rohit.d@technosphere.io',
    phone: '+91 98450 11223',
    linkedIn: 'https://linkedin.com/in/rohit-deshmukh-rvu',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    registeredDate: '15 Jul 2026',
    lastActivity: '14 Sep 2026, 03:30 PM',
    assignedDrivesCount: 2
  },
  {
    id: 'REC-001-B',
    name: 'Ananya Sen',
    companyId: 'COMP-001',
    companyName: 'TechnoSphere Systems',
    designation: 'Staff Engineering Lead & Hiring Manager',
    role: 'HIRING_MANAGER',
    department: 'Core Cloud Platforms',
    email: 'ananya.s@technosphere.io',
    phone: '+91 98450 55667',
    linkedIn: 'https://linkedin.com/in/ananya-sen-rvu',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    registeredDate: '01 Aug 2026',
    lastActivity: '14 Sep 2026, 04:15 PM',
    assignedDrivesCount: 1
  },
  {
    id: 'REC-002',
    name: 'Shreya Kulkarni',
    companyId: 'COMP-002',
    companyName: 'CloudMatrix Networks',
    designation: 'Lead Campus Recruiter, APAC',
    role: 'RECRUITER',
    department: 'Global Campus Talent Acquisition',
    email: 'shreya.k@cloudmatrix.com',
    phone: '+91 98450 22334',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    registeredDate: '20 Jul 2026',
    lastActivity: '13 Sep 2026, 11:00 AM',
    assignedDrivesCount: 1
  },
  {
    id: 'REC-003',
    name: 'Arunav Saxena',
    companyId: 'COMP-003',
    companyName: 'Apex Cognitive AI',
    designation: 'Director of Talent Acquisition',
    role: 'COMPANY_ADMIN',
    department: 'People & Culture Strategy',
    email: 'arunav@apexcognitive.ai',
    phone: '+91 98450 33445',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    registeredDate: '28 Jul 2026',
    lastActivity: '10 Sep 2026, 05:15 PM',
    assignedDrivesCount: 1
  },
  {
    id: 'REC-004',
    name: 'Malini Chandran',
    companyId: 'COMP-004',
    companyName: 'FinVantage Global',
    designation: 'Senior Talent Partner',
    role: 'RECRUITER',
    department: 'Early Careers Technology Program',
    email: 'm.chandran@finvantage.com',
    phone: '+91 98450 44556',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    registeredDate: '02 Aug 2026',
    lastActivity: '08 Sep 2026, 02:20 PM',
    assignedDrivesCount: 1
  },
  {
    id: 'REC-005',
    name: 'Karthik Raman',
    companyId: 'COMP-005',
    companyName: 'Synapse Data Labs',
    designation: 'Talent Scout Specialist',
    role: 'RECRUITER',
    department: 'Technical Sourcing',
    email: 'karthik@synapsedata.io',
    phone: '+91 98450 55667',
    status: 'INVITED',
    verificationStatus: 'PENDING',
    registeredDate: '09 Sep 2026',
    lastActivity: '09 Sep 2026, 10:15 AM',
    assignedDrivesCount: 0
  }
];

// INITIAL COMPANIES
export const INITIAL_COMPANIES: CompanyRecord[] = [
  {
    id: 'COMP-001',
    name: 'TechnoSphere Systems',
    industry: 'Enterprise Software & Cloud Platforms',
    headquarters: 'Bengaluru, India',
    website: 'https://technosphere.io',
    tier: 'Dream',
    verificationStatus: 'VERIFIED',
    activeOpportunitiesCount: 2,
    totalPlacements: 24,
    highestPackageLPA: 18.0,
    primaryContactName: 'Rohit Deshmukh',
    primaryContactEmail: 'rohit.d@technosphere.io',
    primaryContactPhone: '+91 98450 11223',
    establishedYear: 2014
  },
  {
    id: 'COMP-002',
    name: 'CloudMatrix Networks',
    industry: 'Telecommunications & Cloud Networking',
    headquarters: 'San Jose, CA & Bengaluru',
    website: 'https://cloudmatrix.com',
    tier: 'Dream',
    verificationStatus: 'VERIFIED',
    activeOpportunitiesCount: 1,
    totalPlacements: 18,
    highestPackageLPA: 19.0,
    primaryContactName: 'Shreya Kulkarni',
    primaryContactEmail: 'shreya.k@cloudmatrix.com',
    establishedYear: 2008
  },
  {
    id: 'COMP-003',
    name: 'Apex Cognitive AI',
    industry: 'Artificial Intelligence & Large Models',
    headquarters: 'Bengaluru, India',
    website: 'https://apexcognitive.ai',
    tier: 'Marquee',
    verificationStatus: 'VERIFIED',
    activeOpportunitiesCount: 1,
    totalPlacements: 8,
    highestPackageLPA: 22.0,
    primaryContactName: 'Arunav Saxena',
    primaryContactEmail: 'arunav@apexcognitive.ai',
    establishedYear: 2021
  },
  {
    id: 'COMP-004',
    name: 'FinVantage Global',
    industry: 'Quantitative Finance & Asset Management',
    headquarters: 'London & Bengaluru',
    website: 'https://finvantage.com',
    tier: 'Dream',
    verificationStatus: 'VERIFIED',
    activeOpportunitiesCount: 1,
    totalPlacements: 12,
    highestPackageLPA: 20.0,
    primaryContactName: 'Malini Chandran',
    primaryContactEmail: 'm.chandran@finvantage.com',
    establishedYear: 2011
  },
  {
    id: 'COMP-005',
    name: 'Synapse Data Labs',
    industry: 'Healthcare Analytics & Biotech',
    headquarters: 'Bengaluru, India',
    website: 'https://synapsedata.io',
    tier: 'Core',
    verificationStatus: 'PENDING',
    activeOpportunitiesCount: 0,
    totalPlacements: 0,
    highestPackageLPA: 12.0,
    primaryContactName: 'Karthik Raman',
    primaryContactEmail: 'karthik@synapsedata.io',
    establishedYear: 2022
  }
];

// SHARED OPPORTUNITIES
export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'OPP-2026-001',
    recruiterId: 'REC-001',
    companyId: 'COMP-001',
    companyName: 'TechnoSphere Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    role: 'Software Engineer Intern',
    type: 'Internship + PPO',
    location: 'Bengaluru (Outer Ring Road)',
    workMode: 'Hybrid',
    ctcLpa: '₹14.0 - ₹18.0 LPA',
    stipendPerMonth: '₹65,000 / month',
    lifecycleState: 'PUBLISHED',
    isPublished: true,
    approvedByAdmin: true,
    approvedDate: '01 Sep 2026',
    eligibleSchools: ['School of Computer Science & Engineering', 'School of Science'],
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering', 'B.Sc Computer Science'],
    eligibleGraduationYears: [2027],
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    requiredSkills: ['JavaScript', 'React', 'Git', 'Data Structures'],
    niceToHaveSkills: ['TypeScript', 'Docker', 'REST APIs'],
    description: 'Join our core platform engineering team building next-generation enterprise orchestration tooling.',
    responsibilities: [
      'Architect and maintain production-grade React & TypeScript UI modules.',
      'Write clean, unit-tested code with minimum 85% test coverage.',
      'Collaborate in 2-week Agile sprints with senior engineers in Bengaluru and San Jose.'
    ],
    selectionProcess: [
      { roundNumber: 1, title: 'Resume Screening & CGPA Verification', mode: 'Online', description: 'Conducted automatically by RVU CAR Placement Portal' },
      { roundNumber: 2, title: 'Online Coding Assessment', mode: 'Online', description: '90-minute timed proctored coding test on HackerRank' },
      { roundNumber: 3, title: 'Technical Interview Round 1', mode: 'Online', description: 'Live coding and systems with Lead Engineer' },
      { roundNumber: 4, title: 'Technical Interview Round 2 + Culture', mode: 'In-person', description: 'Held at RVU Campus Academic Block 2 Lab 401' }
    ],
    applicationDeadline: '20 Sep 2026',
    driveDate: '24 Sep 2026',
    openingsCount: 8,
    matchScoreForDemoStudent: 94,
    department: 'Platform Engineering',
    jobFunction: 'Software Development',
    otherBenefits: 'Comprehensive Health Insurance (₹5L), Relocation Allowance ₹50,000, Annual Learning Budget ₹30,000',
    timeline: {
      openingDate: '01 Sep 2026',
      deadline: '20 Sep 2026',
      assessmentDate: '17 Sep 2026',
      interviewWindow: '20 Sep - 24 Sep 2026',
      expectedOfferDate: '28 Sep 2026'
    },
    carReviewComments: 'Verified and approved for 2027 CSE cohort by Dr. S. Ranganathan.'
  },
  {
    id: 'OPP-2026-002',
    recruiterId: 'REC-002',
    companyId: 'COMP-002',
    companyName: 'CloudMatrix Networks',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    role: 'Cloud Infrastructure Associate',
    type: 'Placement',
    location: 'Bengaluru (Whitefield)',
    workMode: 'On-site',
    ctcLpa: '₹15.5 - ₹19.0 LPA',
    lifecycleState: 'PUBLISHED',
    isPublished: true,
    approvedByAdmin: true,
    approvedDate: '02 Sep 2026',
    eligibleSchools: ['School of Computer Science & Engineering'],
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering'],
    eligibleGraduationYears: [2027],
    minCgpa: 8.0,
    maxBacklogsAllowed: 0,
    requiredSkills: ['Python', 'Linux', 'Git', 'Networking Basics'],
    niceToHaveSkills: ['AWS', 'Kubernetes', 'Terraform'],
    description: 'Scale multi-region Kubernetes clusters and high-throughput networking fabrics.',
    responsibilities: [
      'Implement infrastructure-as-code automation using Terraform and Python.',
      'Monitor distributed cloud resources and manage SLA alerts.'
    ],
    selectionProcess: [
      { roundNumber: 1, title: 'CAR Academic Gate', mode: 'Online', description: 'Automated check' },
      { roundNumber: 2, title: 'Cloud Aptitude Screen', mode: 'Online', description: '60 mins' },
      { roundNumber: 3, title: 'Technical Interview', mode: 'In-person', description: 'RVU Campus' }
    ],
    applicationDeadline: '22 Sep 2026',
    driveDate: '26 Sep 2026',
    openingsCount: 5,
    matchScoreForDemoStudent: 89
  },
  {
    id: 'OPP-2026-003',
    recruiterId: 'REC-003',
    companyId: 'COMP-003',
    companyName: 'Apex Cognitive AI',
    companyLogo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128',
    role: 'AI Systems & Backend Engineer',
    type: 'Placement',
    location: 'Bengaluru (Indiranagar)',
    workMode: 'Hybrid',
    ctcLpa: '₹18.0 - ₹22.0 LPA',
    lifecycleState: 'PUBLISHED',
    isPublished: true,
    approvedByAdmin: true,
    approvedDate: '04 Sep 2026',
    eligibleSchools: ['School of Computer Science & Engineering', 'School of Science'],
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering'],
    eligibleGraduationYears: [2027],
    minCgpa: 8.25,
    maxBacklogsAllowed: 0,
    requiredSkills: ['Python', 'Data Structures', 'REST APIs', 'SQL'],
    description: 'Work on cutting-edge generative AI retrieval pipelines and scalable inference engines.',
    responsibilities: ['Design high-concurrency API endpoints.', 'Maintain vector indexing clusters.'],
    selectionProcess: [
      { roundNumber: 1, title: 'HackerRank Algorithm Test', mode: 'Online', description: '90 mins' },
      { roundNumber: 2, title: 'System Design Interview', mode: 'In-person', description: 'RVU Boardroom' }
    ],
    applicationDeadline: '25 Sep 2026',
    driveDate: '28 Sep 2026',
    openingsCount: 4,
    matchScoreForDemoStudent: 92
  },
  {
    id: 'OPP-2026-004',
    recruiterId: 'REC-004',
    companyId: 'COMP-004',
    companyName: 'FinVantage Global',
    companyLogo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=128',
    role: 'Quantitative Systems Analyst',
    type: 'Placement',
    location: 'Bengaluru (MG Road)',
    workMode: 'On-site',
    ctcLpa: '₹16.0 - ₹20.0 LPA',
    lifecycleState: 'PUBLISHED',
    isPublished: true,
    approvedByAdmin: true,
    approvedDate: '05 Sep 2026',
    eligibleSchools: ['School of Computer Science & Engineering', 'School of Economics and Public Policy'],
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering', 'B.Sc. (Hons.) Economics'],
    eligibleGraduationYears: [2027],
    minCgpa: 8.0,
    maxBacklogsAllowed: 0,
    requiredSkills: ['Python', 'SQL', 'Data Structures', 'Git'],
    description: 'Build algorithmic trading infrastructure and statistical modeling tools.',
    responsibilities: ['Optimize order routing simulations.', 'Develop backtesting frameworks.'],
    selectionProcess: [
      { roundNumber: 1, title: 'Quant Aptitude', mode: 'Online', description: '60 mins' },
      { roundNumber: 2, title: 'Director Round', mode: 'In-person', description: 'Campus Drive' }
    ],
    applicationDeadline: '28 Sep 2026',
    driveDate: '02 Oct 2026',
    openingsCount: 3,
    matchScoreForDemoStudent: 84
  },
  {
    id: 'OPP-2026-005',
    recruiterId: 'REC-005',
    companyId: 'COMP-005',
    companyName: 'Synapse Data Labs',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=128',
    role: 'Healthcare Data Analyst',
    type: 'Placement',
    location: 'Bengaluru (Electronic City)',
    workMode: 'Hybrid',
    ctcLpa: '₹10.0 - ₹12.5 LPA',
    lifecycleState: 'UNDER_REVIEW',
    isPublished: false,
    approvedByAdmin: false,
    eligibleSchools: ['School of Computer Science & Engineering', 'School of Allied and Healthcare Professions'],
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering', 'B.Sc. (Hons.)'],
    eligibleGraduationYears: [2027],
    minCgpa: 7.0,
    maxBacklogsAllowed: 0,
    requiredSkills: ['Python', 'SQL', 'Tableau'],
    description: 'Clinical data transformation and electronic medical record pipeline development.',
    responsibilities: ['Analyze anonymized patient healthcare datasets.'],
    selectionProcess: [{ roundNumber: 1, title: 'Aptitude Test', mode: 'Online', description: '60 mins' }],
    applicationDeadline: '30 Sep 2026',
    driveDate: '05 Oct 2026',
    openingsCount: 6,
    matchScoreForDemoStudent: 80
  },
  {
    id: 'OPP-2026-006',
    recruiterId: 'REC-001',
    companyId: 'COMP-001',
    companyName: 'TechnoSphere Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    role: 'Associate Cloud Security Specialist',
    type: 'Placement',
    location: 'Bengaluru (Outer Ring Road)',
    workMode: 'Hybrid',
    department: 'Cybersecurity & Infrastructure',
    jobFunction: 'Cloud Infrastructure & Security',
    ctcLpa: '₹15.0 - ₹19.5 LPA',
    lifecycleState: 'SUBMITTED',
    isPublished: false,
    approvedByAdmin: false,
    eligibleSchools: ['School of Computer Science & Engineering'],
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering'],
    eligibleGraduationYears: [2027],
    minCgpa: 8.0,
    maxBacklogsAllowed: 0,
    requiredSkills: ['Linux', 'Network Security', 'Python', 'AWS'],
    niceToHaveSkills: ['Kubernetes Security', 'CISSP / Security+'],
    description: 'Protect cloud-native enterprise assets, conduct threat modeling, and build automated security guardrails.',
    responsibilities: [
      'Design zero-trust authentication workflows across Kubernetes microservices.',
      'Perform static and dynamic security scans on container images.',
      'Coordinate with SOC team for real-time incident detection.'
    ],
    selectionProcess: [
      { roundNumber: 1, title: 'CAR Eligibility Audit', mode: 'Online', description: 'Institutional filter' },
      { roundNumber: 2, title: 'Security & Networking Assessment', mode: 'Online', description: '90-minute HackerRank test' },
      { roundNumber: 3, title: 'Deep Dive Technical Panel', mode: 'In-person', description: 'Campus Interview' }
    ],
    applicationDeadline: '05 Oct 2026',
    driveDate: '12 Oct 2026',
    openingsCount: 4,
    timeline: {
      openingDate: '10 Sep 2026',
      deadline: '05 Oct 2026',
      assessmentDate: '08 Oct 2026',
      interviewWindow: '12 Oct - 14 Oct 2026',
      expectedOfferDate: '18 Oct 2026'
    },
    carReviewComments: 'Awaiting CAR Director review and campus lab slot scheduling.'
  }
];

// SHARED APPLICATIONS
export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'DEMO-APP-0001',
    studentId: 'RVU2023CSE042',
    opportunityId: 'OPP-2026-001',
    recruiterId: 'REC-001',
    placementDriveId: 'DRIVE-2026-001',
    companyName: 'TechnoSphere Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    role: 'Software Engineer Intern',
    type: 'Internship + PPO',
    location: 'Bengaluru (Outer Ring Road)',
    compensation: '₹14.0 - ₹18.0 LPA (₹65k/mo Stipend)',
    stage: 'ASSESSMENT',
    submittedAt: '10 Sep 2026, 10:14 AM',
    updatedAt: '14 Sep 2026, 03:30 PM',
    timeline: [
      { stage: 'APPLIED', label: 'Application Submitted', timestamp: '10 Sep 2026', completed: true, active: false, remarks: 'Verified by RVU Placement Portal' },
      { stage: 'UNDER_REVIEW', label: 'Recruiter Review & CGPA Audit', timestamp: '12 Sep 2026', completed: true, active: false, remarks: 'Profile reviewed by Technical Recruiting Team' },
      { stage: 'SHORTLISTED', label: 'Shortlisted for Assessment', timestamp: '14 Sep 2026', completed: true, active: false, remarks: 'Shortlisted among top 40 candidates' },
      { stage: 'ASSESSMENT', label: 'Online Technical Assessment', timestamp: '17 Sep 2026', completed: false, active: true, remarks: 'Proctored 90-min test on HackerRank' },
      { stage: 'INTERVIEW', label: 'Technical & Systems Interview', timestamp: '20 Sep 2026', completed: false, active: false },
      { stage: 'SELECTED', label: 'Final Selection', timestamp: 'Pending', completed: false, active: false },
      { stage: 'OFFER', label: 'Formal Offer Issued', timestamp: 'Pending', completed: false, active: false }
    ],
    nextAction: {
      title: 'Complete Technical Assessment',
      description: 'You have been shortlisted for the HackerRank Online Technical Assessment. Ensure a webcam-enabled browser and stable internet connection.',
      deadline: '18 Sep 2026, 11:59 PM IST',
      actionType: 'ASSESSMENT',
      actionUrl: 'https://hackerrank.com/rvu-technosphere-eval-2026'
    },
    assessmentDetails: {
      platform: 'HackerRank (Proctored)',
      durationMinutes: 90,
      windowStart: '17 Sep 2026, 10:00 AM',
      windowEnd: '18 Sep 2026, 11:59 PM',
      instructions: [
        'Questions include 2 Data Structures & Algorithms coding challenges and 10 MCQs on React & Web Systems.',
        'Full screen mode required. Tab switching will trigger automated proctoring flags.'
      ]
    }
  },
  {
    id: 'DEMO-APP-0002',
    studentId: 'RVU2023CSE042',
    opportunityId: 'OPP-2026-002',
    recruiterId: 'REC-002',
    placementDriveId: 'DRIVE-2026-002',
    companyName: 'CloudMatrix Networks',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    role: 'Cloud Infrastructure Associate',
    type: 'Placement',
    location: 'Bengaluru (Whitefield)',
    compensation: '₹15.5 - ₹19.0 LPA',
    stage: 'SHORTLISTED',
    submittedAt: '08 Sep 2026, 04:22 PM',
    updatedAt: '13 Sep 2026, 11:00 AM',
    timeline: [
      { stage: 'APPLIED', label: 'Application Submitted', timestamp: '08 Sep 2026', completed: true, active: false },
      { stage: 'UNDER_REVIEW', label: 'CAR Verification & Profile Screening', timestamp: '11 Sep 2026', completed: true, active: false },
      { stage: 'SHORTLISTED', label: 'Shortlisted for Round 1', timestamp: '13 Sep 2026', completed: true, active: true, remarks: 'Candidate shortlisted based on Python & Systems coursework' }
    ],
    nextAction: {
      title: 'Awaiting Assessment Slot Confirmation',
      description: 'Recruiter is finalizing batch scheduling with RVU CAR Office.',
      deadline: '21 Sep 2026',
      actionType: 'ASSESSMENT'
    }
  },
  {
    id: 'DEMO-APP-0003',
    studentId: 'RVU2023CSE007',
    opportunityId: 'OPP-2026-003',
    recruiterId: 'REC-003',
    companyName: 'Apex Cognitive AI',
    companyLogo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128',
    role: 'AI Systems & Backend Engineer',
    type: 'Placement',
    location: 'Bengaluru (Indiranagar)',
    compensation: '₹18.0 - ₹22.0 LPA',
    stage: 'INTERVIEW',
    submittedAt: '05 Sep 2026, 11:30 AM',
    updatedAt: '12 Sep 2026, 04:00 PM',
    timeline: [
      { stage: 'APPLIED', label: 'Applied', timestamp: '05 Sep', completed: true, active: false },
      { stage: 'SHORTLISTED', label: 'Shortlisted', timestamp: '08 Sep', completed: true, active: false },
      { stage: 'ASSESSMENT', label: 'Assessment Cleared (Score: 98%)', timestamp: '10 Sep', completed: true, active: false },
      { stage: 'INTERVIEW', label: 'Technical Interview Scheduled', timestamp: '18 Sep', completed: false, active: true }
    ]
  }
];

// PLACEMENT DRIVES
export const INITIAL_DRIVES: PlacementDrive[] = [
  {
    id: 'DRIVE-2026-001',
    title: 'TechnoSphere Systems Campus Placement Drive 2026',
    companyId: 'COMP-001',
    companyName: 'TechnoSphere Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    date: '24 Sep 2026',
    timeSlot: '09:00 AM - 06:00 PM IST',
    venue: 'RVU Campus, Academic Block 2, Computer Labs 401 & 402 + Auditorium A',
    mode: 'Hybrid',
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering', 'B.Sc Computer Science'],
    associatedOpportunityIds: ['OPP-2026-001'],
    status: 'UPCOMING',
    instructions: [
      'Formal attire strictly required for all in-person rounds.',
      'Bring 3 hard copies of your verified RVU Placement Resume.',
      'Carry your official RV University Student ID Card at all times.'
    ],
    coordinatorContact: {
      name: 'Dr. S. Ranganathan',
      role: 'Head, Corporate & Alumni Relations',
      email: 'car.placements@rvu.edu.in'
    },
    attendanceRoster: [
      { studentId: 'RVU2023CSE042', studentName: 'Demo Student', registeredAt: '10 Sep 2026', attendanceStatus: 'SHORTLISTED' },
      { studentId: 'RVU2023CSE007', studentName: 'Ananya Krishnan', registeredAt: '08 Sep 2026', attendanceStatus: 'REGISTERED' },
      { studentId: 'RVU2023CSE089', studentName: 'Rohan Verma', registeredAt: '09 Sep 2026', attendanceStatus: 'REGISTERED' }
    ]
  },
  {
    id: 'DRIVE-2026-002',
    title: 'CloudMatrix Networks Annual Campus Recruitment Drive',
    companyId: 'COMP-002',
    companyName: 'CloudMatrix Networks',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    date: '26 Sep 2026',
    timeSlot: '10:00 AM - 05:00 PM IST',
    venue: 'RVU Conference Center, Boardroom Suite 3',
    mode: 'On-Campus',
    eligibleProgrammes: ['B.Tech (Hons.) Computer Science & Engineering'],
    associatedOpportunityIds: ['OPP-2026-002'],
    status: 'UPCOMING',
    instructions: [
      'Laptops required for live terminal & networking problem solving round.',
      'Report to Placement Cell Help Desk 15 minutes before the technical session.'
    ],
    coordinatorContact: {
      name: 'Prof. Ananya Sen',
      role: 'Faculty Placement Coordinator, CSE',
      email: 'ananya.sen@rvu.edu.in'
    },
    attendanceRoster: [
      { studentId: 'RVU2023CSE042', studentName: 'Demo Student', registeredAt: '08 Sep 2026', attendanceStatus: 'REGISTERED' }
    ]
  }
];

// INTERVIEWS SCHEDULED
export const INITIAL_INTERVIEWS: InterviewScheduleItem[] = [
  {
    id: 'INT-2026-001',
    applicationId: 'DEMO-APP-0003',
    companyId: 'COMP-003',
    studentId: 'RVU2023CSE007',
    studentName: 'Ananya Krishnan',
    studentEmail: 'ananya.k@rvu.edu.in',
    programme: 'B.Tech (Hons.) Computer Science & Engineering',
    companyName: 'Apex Cognitive AI',
    role: 'AI Systems & Backend Engineer',
    roundNumber: 2,
    roundTitle: 'System Design & Distributed Retrieval Deep Dive',
    date: '18 Sep 2026',
    timeSlot: '11:00 AM - 12:00 PM IST',
    mode: 'Microsoft Teams',
    venueOrLink: 'https://teams.microsoft.com/l/meetup-join/rvu-apex-001',
    interviewerName: 'Dr. Vivek Murthy (Principal Systems Architect)',
    status: 'SCHEDULED',
    remarks: 'Focus on distributed vector database indexing and concurrent API throughput.'
  },
  {
    id: 'INT-2026-002',
    applicationId: 'DEMO-APP-0001',
    companyId: 'COMP-001',
    studentId: 'RVU2023CSE042',
    studentName: 'Demo Student',
    studentEmail: 'demo.student@rvu.edu.in',
    programme: 'B.Tech (Hons.) Computer Science & Engineering',
    companyName: 'TechnoSphere Systems',
    role: 'Software Engineer Intern',
    roundNumber: 3,
    roundTitle: 'Frontend Systems Architecture & Live Code Drill',
    date: '20 Sep 2026',
    timeSlot: '02:30 PM - 03:30 PM IST',
    mode: 'In-person',
    venueOrLink: 'RVU Academic Block 2, Interview Suite 401',
    interviewerName: 'Senior Engineering Panel (TechnoSphere ORR Campus)',
    status: 'SCHEDULED'
  },
  {
    id: 'INT-2026-003',
    applicationId: 'DEMO-APP-0001',
    companyId: 'COMP-001',
    studentId: 'RVU2023CSE042',
    studentName: 'Demo Student',
    studentEmail: 'demo.student@rvu.edu.in',
    programme: 'B.Tech (Hons.) Computer Science & Engineering',
    companyName: 'TechnoSphere Systems',
    role: 'Software Engineer Intern',
    roundNumber: 2,
    roundTitle: 'Core Data Structures & Algorithm Optimization',
    date: '16 Sep 2026',
    timeSlot: '03:00 PM - 04:00 PM IST',
    mode: 'Google Meet',
    venueOrLink: 'https://meet.google.com/rvu-tech-ds2',
    interviewerName: 'Ananya Sen (Engineering Lead)',
    status: 'COMPLETED',
    evaluation: {
      technicalScore: 9,
      communicationScore: 8,
      problemSolvingScore: 9,
      overallScore: 8.7,
      recommendation: 'STRONG_HIRE',
      notes: 'Demonstrated solid grasp of Trie indexing, concurrency, and clean React state management. Candidate articulated trade-offs clearly.',
      submittedAt: '16 Sep 2026, 04:15 PM',
      evaluatorName: 'Ananya Sen'
    }
  }
];

// PLACEMENT OFFERS
export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'OFFER-2026-001',
    applicationId: 'DEMO-APP-0000',
    studentId: 'RVU2023CSE042',
    studentName: 'Demo Student',
    companyName: 'Nexus AI Laboratories',
    companyLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=128',
    role: 'Platform & Machine Learning Associate',
    ctcLpa: '₹16.5 LPA',
    baseSalary: '₹14.0 LPA',
    joiningBonus: '₹1.5 Lakhs',
    stockOptions: '₹1.0 Lakh vested over 2 years',
    location: 'Bengaluru (Koramangala)',
    offerDate: '05 Sep 2026',
    acceptanceDeadline: '25 Sep 2026',
    joiningDate: '01 Jul 2027',
    status: 'OFFER_RECEIVED',
    offerLetterUrl: '#',
    termsSummary: [
      'Standard 6-month probationary evaluation with full salary continuation.',
      'Comprehensive medical insurance coverage of ₹5 Lakhs.',
      'CAR Placement Office verified and registered under institutional records.'
    ],
    placementOfficeVerified: true,
    verifiedBy: 'CAR Officer Pradeep K.',
    verifiedAt: '06 Sep 2026'
  },
  {
    id: 'OFFER-2026-002',
    applicationId: 'DEMO-APP-9999',
    studentId: 'RVU2023CSE007',
    studentName: 'Ananya Krishnan',
    companyName: 'Aviatrix Systems',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    role: 'Cloud Systems Software Engineer',
    ctcLpa: '₹43.5 LPA',
    baseSalary: '₹34.0 LPA',
    joiningBonus: '₹5.0 Lakhs',
    stockOptions: '₹4.5 Lakhs Equity RSUs',
    location: 'Bengaluru / San Jose',
    offerDate: '01 Sep 2026',
    acceptanceDeadline: '15 Sep 2026',
    joiningDate: '15 Jun 2027',
    status: 'PENDING_VERIFICATION',
    offerLetterUrl: '#',
    termsSummary: [
      'Highest package tier for 2026–27 cohort.',
      'Pending CAR statutory compensation verification.'
    ],
    placementOfficeVerified: false
  }
];

// PLACEMENT NOTIFICATIONS
export const INITIAL_NOTIFICATIONS: PlacementNotification[] = [
  {
    id: 'NOTIF-001',
    studentId: 'RVU2023CSE042',
    title: 'Assessment Window Open: TechnoSphere Systems',
    message: 'Your HackerRank Online Technical Assessment for Software Engineer Intern is now live. Complete before 18 Sep 11:59 PM.',
    category: 'INTERVIEW',
    origin: 'RECRUITER',
    timestamp: '2 hours ago',
    isRead: false,
    actionRoute: '/student/applications/DEMO-APP-0001'
  },
  {
    id: 'NOTIF-002',
    studentId: 'RVU2023CSE042',
    title: 'Mandatory Pre-Placement Briefing Notice',
    message: 'Placement Office (CAR) has scheduled the 2026–27 Placement Orientation for Friday, 19 Sep at 04:00 PM in the Main Auditorium.',
    category: 'ANNOUNCEMENT',
    origin: 'PLACEMENT_OFFICE',
    timestamp: 'Yesterday',
    isRead: false,
    actionRoute: '/student/calendar'
  },
  {
    id: 'NOTIF-003',
    studentId: 'RVU2023CSE042',
    title: 'New Opportunity Published: Apex Cognitive AI',
    message: 'Apex Cognitive AI has published "AI Systems & Backend Engineer" (₹18.0 - ₹22.0 LPA). Your profile matches 92%.',
    category: 'PLACEMENT',
    origin: 'PLACEMENT_OFFICE',
    timestamp: '2 days ago',
    isRead: true,
    actionRoute: '/student/opportunities/OPP-2026-003'
  },
  {
    id: 'NOTIF-004',
    studentId: 'RVU2023CSE042',
    title: 'Eligibility Verified for 2026–27 Campus Drives',
    message: 'The CAR office has audited your Semester I–V academic records. Your placement status is set to: ✓ Eligible.',
    category: 'SYSTEM',
    origin: 'PLACEMENT_OFFICE',
    timestamp: '5 days ago',
    isRead: true,
    actionRoute: '/student'
  }
];

// ANNOUNCEMENTS
export const INITIAL_ANNOUNCEMENTS: PlacementAnnouncement[] = [
  {
    id: 'ANN-001',
    title: 'Mandatory Pre-Placement Briefing Scheduled for 2026–27 Cohort',
    content: 'All students registered for 2026–27 campus placements must attend the formal orientation briefing. CAR leadership will cover code of conduct, multi-offer guidelines, and drive attendance protocols.',
    priority: 'URGENT',
    category: 'Drive Briefing',
    targetAudience: 'ALL',
    publishedDate: '10 Sep 2026',
    publishedBy: 'Corporate & Alumni Relations (CAR)',
    isMandatory: true,
    attachmentName: 'RVU_Placement_Policy_2026_27.pdf',
    status: 'PUBLISHED'
  },
  {
    id: 'ANN-002',
    title: 'Resume Submission & Verification Deadline Extended',
    content: 'In response to student requests following mid-semester laboratory evaluations, the portal window for uploading verified resume versions has been extended to 15 Sep 2026, 11:59 PM.',
    priority: 'HIGH',
    category: 'Deadline',
    targetAudience: 'ALL',
    publishedDate: '09 Sep 2026',
    publishedBy: 'Placement Operations Desk',
    isMandatory: false,
    status: 'PUBLISHED'
  },
  {
    id: 'ANN-003',
    title: 'Interview Venue & Lab Allocation Updated for TechnoSphere Drive',
    content: 'Please note the revised venue allocation: Round 2 and Round 3 interviews will take place in Academic Block 2, Computer Labs 401 & 402 instead of Block 1.',
    priority: 'NORMAL',
    category: 'Policy',
    targetAudience: 'CSE',
    publishedDate: '08 Sep 2026',
    publishedBy: 'CAR Infrastructure Coordinator',
    isMandatory: false,
    status: 'PUBLISHED'
  }
];

// DOCUMENTS
export const INITIAL_DOCUMENTS: StudentDocument[] = [
  {
    id: 'DOC-001',
    studentId: 'RVU2023CSE042',
    type: 'RESUME',
    title: 'Primary Placement Resume (Tech & Systems)',
    fileName: 'Aarav_Sharma_RVU_Tech_Resume_v3.2.pdf',
    fileSize: '412 KB',
    uploadedDate: '10 Sep 2026',
    status: 'VERIFIED',
    isActiveForApplications: true,
    downloadUrl: '#'
  },
  {
    id: 'DOC-002',
    studentId: 'RVU2023CSE042',
    type: 'TRANSCRIPT',
    title: 'Semester I–V Consolidated Official Grade Sheet',
    fileName: 'RVU_Transcripts_Sem1_to_Sem5_Verified.pdf',
    fileSize: '1.2 MB',
    uploadedDate: '15 Aug 2026',
    status: 'VERIFIED',
    isActiveForApplications: false,
    downloadUrl: '#'
  },
  {
    id: 'DOC-003',
    studentId: 'RVU2023CSE042',
    type: 'CERTIFICATE',
    title: 'AWS Certified Solutions Architect – Associate',
    fileName: 'AWS_Solutions_Architect_Badge_Aarav.pdf',
    fileSize: '580 KB',
    uploadedDate: '28 Jul 2026',
    status: 'VERIFIED',
    isActiveForApplications: false,
    downloadUrl: '#'
  },
  {
    id: 'DOC-004',
    studentId: 'RVU2023CSE042',
    type: 'CERTIFICATE',
    title: 'HackerRank 5-Star Problem Solving Credential',
    fileName: 'HackerRank_ProblemSolving_Gold.pdf',
    fileSize: '320 KB',
    uploadedDate: '12 Aug 2026',
    status: 'VERIFIED',
    isActiveForApplications: false,
    downloadUrl: '#'
  }
];

// SUPPORT TICKETS
export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-2026-084',
    studentId: 'RVU2023CSE042',
    studentName: 'Demo Student',
    subject: 'Request for Mock Technical Interview slot adjustment due to Lab exam',
    category: 'INTERVIEW',
    description: 'I have a university practical exam scheduled on Friday 18 Sep 2:00 PM - 5:00 PM. Could my mock technical interview round be moved to the Saturday morning slot?',
    priority: 'HIGH',
    status: 'UNDER_REVIEW',
    createdAt: '11 Sep 2026, 09:30 AM',
    updatedAt: '11 Sep 2026, 02:15 PM',
    assignedOfficer: 'Mr. Pradeep Kumar (CAR Placement Officer)'
  },
  {
    id: 'TICK-2026-041',
    studentId: 'RVU2023CSE042',
    studentName: 'Demo Student',
    subject: 'Minor Specialization Elective Verification in Placement Profile',
    category: 'ELIGIBILITY',
    description: 'Confirming whether my Artificial Intelligence & Machine Learning minor credits are officially tagged on the corporate drive eligibility filters.',
    priority: 'NORMAL',
    status: 'RESOLVED',
    createdAt: '25 Aug 2026, 11:20 AM',
    updatedAt: '27 Aug 2026, 04:45 PM',
    adminResponse: 'Your minor specialization in AI & ML is confirmed and verified in the central SIS. Recruiters with AI filter requirements will see your verified credential tag.',
    respondedAt: '27 Aug 2026',
    assignedOfficer: 'CAR Academic Liaison Desk'
  }
];

// CALENDAR EVENTS
export const INITIAL_CALENDAR_EVENTS: PlacementCalendarEvent[] = [
  {
    id: 'CAL-001',
    title: 'TechnoSphere Systems: Online Assessment Window',
    eventType: 'ASSESSMENT',
    date: '2026-09-17',
    startTime: '10:00 AM',
    endTime: '11:59 PM',
    companyName: 'TechnoSphere Systems',
    venueOrLink: 'HackerRank Proctored Platform',
    description: '90-minute technical assessment for shortlisted candidates.',
    isMandatory: true
  },
  {
    id: 'CAL-002',
    title: 'Mandatory Pre-Placement Cohort Orientation',
    eventType: 'PRE_PLACEMENT_TALK',
    date: '2026-09-19',
    startTime: '04:00 PM',
    endTime: '05:30 PM',
    venueOrLink: 'Auditorium A, RV University Campus',
    description: 'Official CAR session on hiring guidelines and drive expectations.',
    isMandatory: true
  },
  {
    id: 'CAL-003',
    title: 'TechnoSphere Systems: On-Campus Placement Drive',
    eventType: 'PLACEMENT_DRIVE',
    date: '2026-09-24',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    companyName: 'TechnoSphere Systems',
    venueOrLink: 'Academic Block 2, Labs 401 & 402',
    description: 'In-person technical interviews and management discussion.',
    isMandatory: true
  },
  {
    id: 'CAL-004',
    title: 'CloudMatrix Networks: Campus Recruitment Drive',
    eventType: 'PLACEMENT_DRIVE',
    date: '2026-09-26',
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    companyName: 'CloudMatrix Networks',
    venueOrLink: 'Boardroom Suite 3, Conference Center',
    description: 'Infrastructure and networking technical interview rounds.',
    isMandatory: true
  },
  {
    id: 'CAL-005',
    title: 'Deadline: Apex Cognitive AI Applications Close',
    eventType: 'DEADLINE',
    date: '2026-09-25',
    startTime: '11:59 PM',
    endTime: '11:59 PM',
    companyName: 'Apex Cognitive AI',
    venueOrLink: 'RVU Career Hub Portal',
    description: 'Final submission deadline for AI Systems & Backend Engineer role.',
    isMandatory: false
  }
];

// HISTORICAL EXCEL IMPORTS
export const INITIAL_IMPORT_HISTORY: StudentImportRecord[] = [
  {
    id: 'IMP-2026-001',
    fileName: 'CSE_Batch_2023_2027_Master.xlsx',
    fileSize: '418 KB',
    uploadedBy: 'CAR Admin (Dr. S. Ranganathan)',
    timestamp: '15 Aug 2026, 02:45 PM',
    totalRows: 550,
    addedCount: 420,
    updatedCount: 125,
    warningCount: 24,
    errorCount: 5,
    status: 'COMPLETED_WITH_WARNINGS',
    errorDetails: [
      { rowNumber: 42, studentId: 'RVU2023CSE998', studentName: 'Test Student', field: 'Email', message: 'Invalid domain (non-rvu email)', severity: 'ERROR' },
      { rowNumber: 88, studentId: 'RVU2023CSE999', studentName: 'Incomplete Record', field: 'CGPA', message: 'Missing semester 5 GPA', severity: 'ERROR' },
      { rowNumber: 124, studentId: 'RVU2023CSE042', studentName: 'Demo Student', field: 'Phone', message: 'Phone number format normalized', severity: 'WARNING' }
    ]
  },
  {
    id: 'IMP-2026-002',
    fileName: 'School_of_Economics_2027.xlsx',
    fileSize: '95 KB',
    uploadedBy: 'CAR Operations Desk',
    timestamp: '22 Aug 2026, 11:15 AM',
    totalRows: 48,
    addedCount: 48,
    updatedCount: 0,
    warningCount: 0,
    errorCount: 0,
    status: 'COMPLETED'
  }
];

// INSTITUTIONAL AUDIT TRAIL
export const INITIAL_AUDIT_LOGS: ActivityLog[] = [
  {
    id: 'AUD-001',
    timestamp: '10 Sep 2026, 04:30 PM',
    actor: 'CAR Admin (Dr. S. Ranganathan)',
    actorRole: 'SUPER_ADMIN',
    action: 'Opportunity Approved',
    targetEntity: 'Opportunity',
    entityId: 'OPP-2026-001',
    details: 'Approved TechnoSphere Systems "Software Engineer Intern" for CSE 2027 batch with ₹14.0 - ₹18.0 LPA bracket.'
  },
  {
    id: 'AUD-002',
    timestamp: '09 Sep 2026, 01:15 PM',
    actor: 'CAR Placement Officer',
    actorRole: 'PLACEMENT_ADMIN',
    action: 'Student Eligibility Updated',
    targetEntity: 'Student',
    entityId: 'RVU2023CSE042',
    details: 'Verified CGPA (8.42) and zero backlogs. Updated eligibility status to ELIGIBLE for 2026–27 Placement Drives.'
  },
  {
    id: 'AUD-003',
    timestamp: '08 Sep 2026, 10:45 AM',
    actor: 'CAR Operations Desk',
    actorRole: 'PLACEMENT_COORDINATOR',
    action: 'Drive Published',
    targetEntity: 'PlacementDrive',
    entityId: 'DRIVE-2026-001',
    details: 'Published TechnoSphere On-Campus Drive scheduled for 24 Sep at Academic Block 2 Labs 401 & 402.'
  },
  {
    id: 'AUD-004',
    timestamp: '05 Sep 2026, 03:20 PM',
    actor: 'CAR Admin',
    actorRole: 'SUPER_ADMIN',
    action: 'Recruiter Verified',
    targetEntity: 'Recruiter',
    entityId: 'REC-001',
    details: 'Verified credentials for Rohit Deshmukh, Head of University Relations at TechnoSphere Systems.'
  }
];

// 9 OFFICIAL RVU SCHOOLS
export const OFFICIAL_RVU_SCHOOLS = [
  'School of Computer Science and Engineering',
  'School of Design and Innovation',
  'School of Business',
  'School of Economics and Public Policy',
  'School of Liberal Arts and Sciences',
  'School of Law',
  'School of Film, Media and Creative Arts',
  'School of General Education',
  'School of Continuing Education'
];

// DEFAULT CONFIGURABLE PLACEMENT POLICY SETTINGS
export const DEFAULT_POLICY_SETTINGS: PlacementPolicySettings = {
  minCgpaDefault: 7.0,
  maxBacklogsDefault: 0,
  minAttendancePercent: 75,
  allowMultipleOffers: true,
  dreamTierMinLPA: 12.0,
  marqueeTierMinLPA: 20.0,
  registrationWindowHours: 48,
  autoVerifySSOStudents: true,
  requireNOCForInternships: true,
  placementCycleYear: '2026–2027',
  oneStudentOneJobRule: true,
  dreamJobMultiplier: 1.5,
  offerAcceptanceWindowDays: 3,
  officialSchools: OFFICIAL_RVU_SCHOOLS
};

// HISTORICAL AUDITED BENCHMARK FOR 2025-26
export const HISTORICAL_PLACEMENT_2025_26 = {
  eligibleStudents: 1608,
  totalOffers: '400+',
  participatingRecruiters: '250+',
  highestPackage: '₹43.5 LPA',
  schoolsCount: 9,
  academicYear: '2025–26'
};

// RECRUITER ASSESSMENTS
export const INITIAL_ASSESSMENTS: RecruiterAssessment[] = [
  {
    id: 'ASSESS-2026-001',
    opportunityId: 'OPP-2026-001',
    companyId: 'COMP-001',
    title: 'TechnoSphere Systems - Full Stack & DSA Coding Diagnostic',
    role: 'Software Engineer Intern',
    platform: 'HackerRank Proctored',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 75,
    startDate: '17 Sep 2026, 10:00 AM',
    endDate: '18 Sep 2026, 11:59 PM',
    instructions: [
      'Round 1: 2 Algorithmic Problem Solving challenges (Array/Map, Dynamic Programming / Sliding Window).',
      'Round 2: 10 Objective questions on React 18 Concurrent Features, TypeScript generics, and System design primitives.',
      'Webcam & tab monitoring enabled. Any external window switch triggers automatic audit logs.'
    ],
    questionsCount: 12,
    status: 'ACTIVE',
    candidates: [
      {
        applicationId: 'DEMO-APP-0001',
        studentId: 'RVU2023CSE042',
        studentName: 'Demo Student',
        studentEmail: 'demo.student@rvu.edu.in',
        programme: 'B.Tech (Hons.) Computer Science & Engineering',
        cgpa: 8.42,
        status: 'EVALUATED',
        score: 88,
        submittedAt: '17 Sep 2026, 11:30 AM',
        proctoringFlags: 0,
        feedback: 'Clean modular TypeScript implementation with optimal O(N) space and time complexity. Answered all React 18 questions correctly.',
        evaluatedBy: 'Ananya Sen (Engineering Lead)'
      }
    ]
  },
  {
    id: 'ASSESS-2026-002',
    opportunityId: 'OPP-2026-002',
    companyId: 'COMP-002',
    title: 'CloudMatrix Networks - Cloud Infrastructure & Systems Assessment',
    role: 'Cloud Infrastructure Associate',
    platform: 'Mettle Online Assessment',
    durationMinutes: 75,
    totalMarks: 100,
    passingMarks: 70,
    startDate: '20 Sep 2026, 09:00 AM',
    endDate: '21 Sep 2026, 06:00 PM',
    instructions: [
      'Hands-on Linux shell scripting scenario.',
      'Networking protocols (TCP/IP, HTTP/2, DNS) and containerization fundamentals.'
    ],
    questionsCount: 15,
    status: 'UPCOMING',
    candidates: [
      {
        applicationId: 'DEMO-APP-0002',
        studentId: 'RVU2023CSE042',
        studentName: 'Demo Student',
        studentEmail: 'demo.student@rvu.edu.in',
        programme: 'B.Tech (Hons.) Computer Science & Engineering',
        cgpa: 8.42,
        status: 'PENDING'
      }
    ]
  }
];

// RECRUITER COMMUNICATIONS / MESSAGES
export const INITIAL_RECRUITER_MESSAGES: RecruiterMessage[] = [
  {
    id: 'RMSG-001',
    companyId: 'COMP-001',
    senderId: 'REC-001',
    senderName: 'Rohit Deshmukh (TechnoSphere Systems)',
    senderRole: 'COMPANY_ADMIN',
    receiverType: 'CAR',
    receiverId: 'CAR-ADMIN',
    receiverName: 'Dr. S. Ranganathan (Head, Corporate & Alumni Relations)',
    subject: 'Lab 401 & 402 Setup Confirmation for 24 Sep On-Campus Drive',
    content: 'Hi Dr. Ranganathan,\n\nWe would like to confirm that Academic Block 2 Labs 401 and 402 have Node.js 20.x, Python 3.11, and Git configured on all student workstations for our upcoming coding & system simulation rounds.\n\nOur visiting panel will consist of 5 technical architects and 2 talent leads arriving at 08:30 AM.\n\nWarm regards,\nRohit Deshmukh',
    timestamp: '10 Sep 2026, 02:30 PM',
    isRead: true,
    isUrgent: false
  },
  {
    id: 'RMSG-002',
    companyId: 'COMP-001',
    senderId: 'CAR-ADMIN',
    senderName: 'Dr. S. Ranganathan (Head, Corporate & Alumni Relations)',
    senderRole: 'CAR_DIRECTOR',
    receiverType: 'RECRUITER',
    receiverId: 'REC-001',
    receiverName: 'Rohit Deshmukh (TechnoSphere Systems)',
    subject: 'Re: Lab 401 & 402 Setup Confirmation for 24 Sep On-Campus Drive',
    content: 'Dear Rohit,\n\nBoth computer laboratories have been provisioned by our campus IT systems team with high-speed leased line internet, Node 20, Python 3.11, and dedicated proctoring stations. We have also reserved Auditorium A for your 09:00 AM Pre-Placement Talk.\n\nLooking forward to hosting the TechnoSphere team on campus!\n\nBest regards,\nDr. S. Ranganathan',
    timestamp: '10 Sep 2026, 04:15 PM',
    isRead: false,
    isUrgent: false
  },
  {
    id: 'RMSG-003',
    companyId: 'COMP-001',
    senderId: 'REC-001',
    senderName: 'Rohit Deshmukh (TechnoSphere Systems)',
    senderRole: 'COMPANY_ADMIN',
    receiverType: 'CANDIDATE',
    receiverId: 'RVU2023CSE042',
    receiverName: 'Demo Student',
    subject: 'TechnoSphere Systems: Online Assessment Link & Preparation Guide',
    content: 'Dear Demo Student,\n\nCongratulations on being shortlisted for the Software Engineer Intern role at TechnoSphere Systems! Your proctored assessment window will open on 17 Sep at 10:00 AM IST.\n\nPlease ensure you take the test in a quiet environment with a functional webcam. Review standard DSA and React principles prior to beginning.\n\nBest of luck!\nTechnoSphere Talent Acquisition Team',
    timestamp: '14 Sep 2026, 03:45 PM',
    isRead: true,
    isUrgent: false
  }
];

// RECRUITER NOTIFICATIONS
export const INITIAL_RECRUITER_NOTIFICATIONS: RecruiterNotification[] = [
  {
    id: 'RNOTIF-001',
    companyId: 'COMP-001',
    recruiterId: 'REC-001',
    title: 'New Application Submitted',
    message: 'Demo Student (CGPA 8.42, CSE) applied for Software Engineer Intern.',
    type: 'APPLICATION',
    timestamp: '10 Sep 2026, 10:14 AM',
    isRead: false,
    actionRoute: '/recruiter/applications/DEMO-APP-0001'
  },
  {
    id: 'RNOTIF-002',
    companyId: 'COMP-001',
    recruiterId: 'REC-001',
    title: 'CAR Approved Opportunity',
    message: 'Opportunity OPP-2026-001 has been reviewed, approved, and published to 2027 CSE cohort by CAR.',
    type: 'OPPORTUNITY_STATUS',
    timestamp: '10 Sep 2026, 04:30 PM',
    isRead: true,
    actionRoute: '/recruiter/opportunities/OPP-2026-001'
  },
  {
    id: 'RNOTIF-003',
    companyId: 'COMP-001',
    recruiterId: 'REC-001',
    title: 'Drive Venue Confirmed by CAR',
    message: 'Academic Block 2 Labs 401 & 402 + Auditorium A assigned for Campus Drive on 24 Sep.',
    type: 'DRIVE',
    timestamp: '08 Sep 2026, 10:45 AM',
    isRead: true,
    actionRoute: '/recruiter/drives/DRIVE-2026-001'
  },
  {
    id: 'RNOTIF-004',
    companyId: 'COMP-001',
    recruiterId: 'REC-001',
    title: 'Assessment Score Received',
    message: 'Demo Student submitted assessment for Software Engineer Intern with score 88/100.',
    type: 'ASSESSMENT',
    timestamp: '17 Sep 2026, 11:32 AM',
    isRead: false,
    actionRoute: '/recruiter/assessments/ASSESS-2026-001'
  },
  {
    id: 'RNOTIF-005',
    companyId: 'COMP-001',
    recruiterId: 'REC-001',
    title: 'New Message from CAR Office',
    message: 'Dr. S. Ranganathan responded to your campus drive setup inquiry.',
    type: 'CAR_COMMUNICATION',
    timestamp: '10 Sep 2026, 04:15 PM',
    isRead: false,
    actionRoute: '/recruiter/messages'
  }
];

